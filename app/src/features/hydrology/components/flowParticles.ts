import type { Feature, FeatureCollection, GeoJsonProperties, Geometry, Point, Position } from 'geojson';
import { hasVerifiedFlowDirection } from '../data/hydrology';

type Coordinate = [number, number];

export type FlowParticlePlan = {
  id: string;
  coordinates: Coordinate[];
  cumulativeKm: number[];
  lengthKm: number;
  selected: boolean;
  directional: boolean;
};

export type FlowBounds = { west: number; south: number; east: number; north: number };

type ParticleProperties = {
  selected: boolean;
  directionMode: 'verified' | 'representative';
  opacity: number;
};

const EMPTY_PARTICLES: FeatureCollection<Point, ParticleProperties> = { type: 'FeatureCollection', features: [] };

function coordinate(value: Position): Coordinate | null {
  const longitude = Number(value[0]);
  const latitude = Number(value[1]);
  return Number.isFinite(longitude) && Number.isFinite(latitude) ? [longitude, latitude] : null;
}

function linePaths(geometry: Geometry | null): Coordinate[][] {
  if (!geometry) return [];
  if (geometry.type === 'LineString') {
    const path = geometry.coordinates.map(coordinate).filter((value): value is Coordinate => Boolean(value));
    return path.length > 1 ? [path] : [];
  }
  if (geometry.type === 'MultiLineString') {
    return geometry.coordinates.map((line) => line.map(coordinate).filter((value): value is Coordinate => Boolean(value))).filter((line) => line.length > 1);
  }
  return [];
}

function distanceKm(left: Coordinate, right: Coordinate): number {
  const latitudeRadians = ((left[1] + right[1]) / 2) * Math.PI / 180;
  const dx = (right[0] - left[0]) * 111.32 * Math.cos(latitudeRadians);
  const dy = (right[1] - left[1]) * 110.57;
  return Math.hypot(dx, dy);
}

function cumulativeDistances(path: Coordinate[]): number[] {
  const distances = [0];
  for (let index = 1; index < path.length; index += 1) {
    distances.push(distances[index - 1] + distanceKm(path[index - 1], path[index]));
  }
  return distances;
}

function nearestDistanceKm(path: Coordinate[], point: Coordinate): number {
  return Math.min(...path.map((candidate) => distanceKm(candidate, point)));
}

function intersectsBounds(path: Coordinate[], bounds?: FlowBounds): boolean {
  if (!bounds) return true;
  return path.some(([longitude, latitude]) => longitude >= bounds.west && longitude <= bounds.east && latitude >= bounds.south && latitude <= bounds.north);
}

function hasVerifiedCoordinateOrder(properties: GeoJsonProperties): boolean {
  if (!properties || !hasVerifiedFlowDirection(properties)) return false;
  const order = String(properties.coordinateOrder ?? properties.geometryDirection ?? properties.flowCoordinateOrder ?? '').toLocaleLowerCase('en-US');
  return properties.coordinatesFollowFlow === true
    || properties.geometryDirectionVerified === true && ['upstream-to-downstream', 'upstream_downstream', 'downstream'].includes(order);
}

function plansForFeature(feature: Feature<Geometry, GeoJsonProperties>, selectedPoint: Coordinate | null, bounds?: FlowBounds): FlowParticlePlan[] {
  const properties = feature.properties ?? {};
  const selected = properties.selectedRiver === true;
  const featureId = String(properties.id ?? feature.id ?? 'river');
  const paths = linePaths(feature.geometry);
  const candidates = selected && selectedPoint
    ? [...paths].sort((left, right) => nearestDistanceKm(left, selectedPoint) - nearestDistanceKm(right, selectedPoint)).slice(0, 2)
    : paths.filter((path) => intersectsBounds(path, bounds)).sort((left, right) => {
      const leftDistances = cumulativeDistances(left);
      const rightDistances = cumulativeDistances(right);
      return rightDistances[rightDistances.length - 1] - leftDistances[leftDistances.length - 1];
    }).slice(0, selected ? 6 : 1);
  return candidates.flatMap((path, index) => {
    const cumulativeKm = cumulativeDistances(path);
    const lengthKm = cumulativeKm[cumulativeKm.length - 1];
    if (lengthKm <= 0) return [];
    return [{ id: `${featureId}-${index}`, coordinates: path, cumulativeKm, lengthKm, selected, directional: hasVerifiedCoordinateOrder(properties) }];
  });
}

export function createFlowParticlePlans(
  rivers: FeatureCollection<Geometry, GeoJsonProperties>,
  selectedPoint: Coordinate | null,
  bounds?: FlowBounds,
): FlowParticlePlan[] {
  const active = rivers.features.filter((feature) => feature.properties?.flowParticleActive === true);
  return active.flatMap((feature) => plansForFeature(feature, selectedPoint, bounds));
}

function pointAlongPath(plan: FlowParticlePlan, progress: number): Coordinate {
  const target = Math.min(1, Math.max(0, progress)) * plan.lengthKm;
  let segment = 1;
  while (segment < plan.cumulativeKm.length && plan.cumulativeKm[segment] < target) segment += 1;
  const upper = Math.min(segment, plan.coordinates.length - 1);
  const lower = Math.max(0, upper - 1);
  const span = plan.cumulativeKm[upper] - plan.cumulativeKm[lower];
  const ratio = span > 0 ? (target - plan.cumulativeKm[lower]) / span : 0;
  return [
    plan.coordinates[lower][0] + (plan.coordinates[upper][0] - plan.coordinates[lower][0]) * ratio,
    plan.coordinates[lower][1] + (plan.coordinates[upper][1] - plan.coordinates[lower][1]) * ratio,
  ];
}

export function createFlowParticleCollection(
  plans: FlowParticlePlan[],
  elapsedSeconds: number,
  speed: number,
  zoom: number,
): FeatureCollection<Point, ParticleProperties> {
  if (!plans.length) return EMPTY_PARTICLES;
  const selectedMode = plans.some((plan) => plan.selected);
  const particleBudget = selectedMode ? (zoom >= 8 ? 36 : 24) : (zoom >= 8 ? 72 : zoom >= 6 ? 48 : 30);
  const features: Array<Feature<Point, ParticleProperties>> = [];
  const basePerPlan = selectedMode ? 8 : zoom >= 7 ? 2 : 1;

  for (const plan of plans) {
    const count = Math.min(selectedMode ? 14 : 3, Math.max(basePerPlan, Math.round(plan.lengthKm / (selectedMode ? 8 : 45))));
    for (let index = 0; index < count && features.length < particleBudget; index += 1) {
      const offset = (index + 0.5) / count;
      const progress = plan.directional
        ? (elapsedSeconds * 0.075 * speed + offset) % 1
        : 0.5 + 0.42 * Math.sin(elapsedSeconds * 0.9 * speed + offset * Math.PI * 2);
      const pulse = 0.72 + 0.28 * Math.sin(elapsedSeconds * 2.4 * speed + offset * Math.PI * 2);
      features.push({
        type: 'Feature',
        id: `${plan.id}-${index}`,
        geometry: { type: 'Point', coordinates: pointAlongPath(plan, progress) },
        properties: { selected: plan.selected, directionMode: plan.directional ? 'verified' : 'representative', opacity: pulse },
      });
    }
    if (features.length >= particleBudget) break;
  }
  return { type: 'FeatureCollection', features };
}

export function emptyFlowParticles(): FeatureCollection<Point, ParticleProperties> {
  return EMPTY_PARTICLES;
}
