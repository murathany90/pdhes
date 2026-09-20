import type { Feature, FeatureCollection, GeoJsonProperties, Geometry, Point, Position } from 'geojson';
import { hasVerifiedFlowDirection } from '../data/hydrology';

type Coordinate = [number, number];

export type FlowParticlePlan = {
  id: string;
  systemId: string;
  componentId: number;
  coordinates: Coordinate[];
  cumulativeKm: number[];
  edgeBreaksKm: number[];
  lengthKm: number;
  selected: boolean;
  directional: boolean;
  directionMode: 'cascade-elevation' | 'verified' | 'representative';
  directionSign: 1 | -1 | null;
  upstreamName?: string;
  downstreamName?: string;
  elevationDropM?: number;
};

export type CascadeFlowGuide = {
  systemId: string;
  upstreamHesId: string;
  downstreamHesId: string;
  upstreamName: string;
  downstreamName: string;
  upstream: Coordinate;
  downstream: Coordinate;
  upstreamElevationM: number;
  downstreamElevationM: number;
};

export type FlowBounds = { west: number; south: number; east: number; north: number };

type ParticleProperties = {
  selected: boolean;
  directionMode: 'cascade-elevation' | 'verified' | 'representative';
  opacity: number;
  routeId: string;
  componentId: number;
  sourceSegmentIndex: number;
  routeSegmentCount: number;
  routeDistanceKm: number;
  travelDirection: 1 | -1;
  trailStep: number;
  particleId: string;
  upstreamName?: string;
  downstreamName?: string;
  elevationDropM?: number;
};

type GraphEdge = {
  index: number;
  coordinates: Coordinate[];
  start: string;
  end: string;
};

type CachedRoute = Omit<FlowParticlePlan, 'id' | 'systemId' | 'selected' | 'directional' | 'directionMode' | 'directionSign' | 'upstreamName' | 'downstreamName' | 'elevationDropM'> & { sourceOrderPreserved: boolean };

const EMPTY_PARTICLES: FeatureCollection<Point, ParticleProperties> = { type: 'FeatureCollection', features: [] };
const ROUTE_CACHE = new WeakMap<object, CachedRoute[]>();
const BASE_SPEED_KM_PER_SECOND = 8;

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

function endpointKey(point: Coordinate): string {
  // Provider endpoints that are truly shared are byte-identical. Rounding only
  // removes sub-metre serialization noise; it never bridges a geographic gap.
  return `${point[0].toFixed(6)},${point[1].toFixed(6)}`;
}

function nearestDistanceKm(path: Coordinate[], point: Coordinate): number {
  return Math.min(...path.map((candidate) => distanceKm(candidate, point)));
}

function numeric(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function pointCoordinate(feature: Feature<Geometry, GeoJsonProperties> | undefined): Coordinate | null {
  if (!feature || feature.geometry?.type !== 'Point') return null;
  return coordinate(feature.geometry.coordinates);
}

function riverSystemIds(properties: GeoJsonProperties): string[] {
  if (!properties) return [];
  const values = [
    properties.riverSystemId,
    ...(Array.isArray(properties.riverSystemIds) ? properties.riverSystemIds : []),
    ...(Array.isArray(properties.riverIds) ? properties.riverIds : []),
  ];
  return [...new Set(values.map(String).filter(Boolean))];
}

/**
 * Uses versioned HES/cascade metadata only as direction anchors. The cascade
 * line itself is deliberately ignored: particles always remain on real river
 * geometry.
 */
export function createCascadeFlowGuides(
  hes: FeatureCollection<Geometry, GeoJsonProperties>,
  cascades: FeatureCollection<Geometry, GeoJsonProperties>,
): CascadeFlowGuide[] {
  const byId = new Map(hes.features.map((feature) => [String(feature.properties?.id ?? feature.id ?? ''), feature]));
  return cascades.features.flatMap((cascade) => {
    const from = byId.get(String(cascade.properties?.fromId ?? ''));
    const to = byId.get(String(cascade.properties?.toId ?? ''));
    const fromPoint = pointCoordinate(from);
    const toPoint = pointCoordinate(to);
    const fromElevation = numeric(from?.properties?.maxWaterLevelM) ?? numeric(from?.properties?.minWaterLevelM);
    const toElevation = numeric(to?.properties?.maxWaterLevelM) ?? numeric(to?.properties?.minWaterLevelM);
    if (!from || !to || !fromPoint || !toPoint || fromElevation === null || toElevation === null || fromElevation === toElevation) return [];
    const sharedSystems = riverSystemIds(from.properties).filter((id) => riverSystemIds(to.properties).includes(id));
    if (!sharedSystems.length) return [];
    const upstream = fromElevation > toElevation ? from : to;
    const downstream = fromElevation > toElevation ? to : from;
    const upstreamPoint = fromElevation > toElevation ? fromPoint : toPoint;
    const downstreamPoint = fromElevation > toElevation ? toPoint : fromPoint;
    const upstreamElevationM = Math.max(fromElevation, toElevation);
    const downstreamElevationM = Math.min(fromElevation, toElevation);
    return sharedSystems.map((systemId) => ({
      systemId,
      upstreamHesId: String(upstream.properties?.id ?? upstream.id ?? ''),
      downstreamHesId: String(downstream.properties?.id ?? downstream.id ?? ''),
      upstreamName: String(upstream.properties?.name ?? 'Üst HES'),
      downstreamName: String(downstream.properties?.name ?? 'Alt HES'),
      upstream: upstreamPoint,
      downstream: downstreamPoint,
      upstreamElevationM,
      downstreamElevationM,
    }));
  });
}

function projectOnRoute(route: CachedRoute, point: Coordinate): { distanceToRouteKm: number; distanceAlongKm: number } {
  let bestDistance = Infinity;
  let bestAlong = 0;
  for (let index = 1; index < route.coordinates.length; index += 1) {
    const start = route.coordinates[index - 1];
    const end = route.coordinates[index];
    const latitudeRadians = ((start[1] + end[1] + point[1]) / 3) * Math.PI / 180;
    const scaleX = 111.32 * Math.cos(latitudeRadians);
    const scaleY = 110.57;
    const vx = (end[0] - start[0]) * scaleX;
    const vy = (end[1] - start[1]) * scaleY;
    const wx = (point[0] - start[0]) * scaleX;
    const wy = (point[1] - start[1]) * scaleY;
    const denominator = vx * vx + vy * vy;
    const ratio = denominator > 0 ? Math.min(1, Math.max(0, (wx * vx + wy * vy) / denominator)) : 0;
    const distance = Math.hypot(wx - ratio * vx, wy - ratio * vy);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestAlong = route.cumulativeKm[index - 1] + ratio * (route.cumulativeKm[index] - route.cumulativeKm[index - 1]);
    }
  }
  return { distanceToRouteKm: bestDistance, distanceAlongKm: bestAlong };
}

function cascadeDirection(route: CachedRoute, guides: CascadeFlowGuide[]): { sign: 1 | -1; guide: CascadeFlowGuide } | null {
  const candidates = guides.flatMap((guide) => {
    const upstream = projectOnRoute(route, guide.upstream);
    const downstream = projectOnRoute(route, guide.downstream);
    if (upstream.distanceToRouteKm > 25 || downstream.distanceToRouteKm > 25 || Math.abs(upstream.distanceAlongKm - downstream.distanceAlongKm) < 0.5) return [];
    return [{
      sign: (downstream.distanceAlongKm > upstream.distanceAlongKm ? 1 : -1) as 1 | -1,
      guide,
      score: upstream.distanceToRouteKm + downstream.distanceToRouteKm,
    }];
  }).sort((left, right) => left.score - right.score);
  if (!candidates.length || candidates.some((candidate) => candidate.sign !== candidates[0].sign)) return null;
  return candidates[0];
}

function intersectsBounds(path: Coordinate[], bounds?: FlowBounds): boolean {
  if (!bounds) return true;
  let west = Infinity;
  let east = -Infinity;
  let south = Infinity;
  let north = -Infinity;
  for (const [longitude, latitude] of path) {
    west = Math.min(west, longitude);
    east = Math.max(east, longitude);
    south = Math.min(south, latitude);
    north = Math.max(north, latitude);
  }
  return east >= bounds.west && west <= bounds.east && north >= bounds.south && south <= bounds.north;
}

export function hasVerifiedFlowRouteDirection(properties: GeoJsonProperties): boolean {
  if (!properties || !hasVerifiedFlowDirection(properties)) return false;
  const order = String(properties.coordinateOrder ?? properties.geometryDirection ?? properties.flowCoordinateOrder ?? '').toLocaleLowerCase('en-US');
  return properties.coordinatesFollowFlow === true
    || properties.geometryDirectionVerified === true && ['upstream-to-downstream', 'upstream_downstream', 'downstream'].includes(order);
}

function appendEdge(
  route: Coordinate[],
  edgeBreaksKm: number[],
  edge: GraphEdge,
  currentNode: string,
): { nextNode: string; sourceOrderPreserved: boolean } {
  const sourceOrderPreserved = edge.start === currentNode;
  const coordinates = sourceOrderPreserved ? edge.coordinates : [...edge.coordinates].reverse();
  route.push(...(route.length ? coordinates.slice(1) : coordinates));
  const cumulativeKm = cumulativeDistances(route);
  edgeBreaksKm.push(cumulativeKm[cumulativeKm.length - 1]);
  return { nextNode: sourceOrderPreserved ? edge.end : edge.start, sourceOrderPreserved };
}

function connectedRoutes(geometry: Geometry | null): CachedRoute[] {
  if (!geometry) return [];
  const cached = ROUTE_CACHE.get(geometry);
  if (cached) return cached;

  const edges: GraphEdge[] = linePaths(geometry).map((coordinates, index) => ({
    index,
    coordinates,
    start: endpointKey(coordinates[0]),
    end: endpointKey(coordinates[coordinates.length - 1]),
  }));
  const adjacency = new Map<string, number[]>();
  for (const edge of edges) {
    for (const node of [edge.start, edge.end]) adjacency.set(node, [...(adjacency.get(node) ?? []), edge.index]);
  }

  const componentByEdge = new Map<number, number>();
  let componentId = 0;
  for (const edge of edges) {
    if (componentByEdge.has(edge.index)) continue;
    const pending = [edge.index];
    componentByEdge.set(edge.index, componentId);
    while (pending.length) {
      const current = edges[pending.pop() as number];
      for (const node of [current.start, current.end]) {
        for (const neighbour of adjacency.get(node) ?? []) {
          if (!componentByEdge.has(neighbour)) {
            componentByEdge.set(neighbour, componentId);
            pending.push(neighbour);
          }
        }
      }
    }
    componentId += 1;
  }

  const visited = new Set<number>();
  const routes: CachedRoute[] = [];
  const walk = (startNode: string, firstEdgeIndex: number) => {
    const coordinates: Coordinate[] = [];
    const edgeBreaksKm: number[] = [];
    let node = startNode;
    let edgeIndex: number | undefined = firstEdgeIndex;
    let sourceOrderPreserved = true;
    const routeComponent = componentByEdge.get(firstEdgeIndex) ?? 0;
    while (edgeIndex !== undefined && !visited.has(edgeIndex)) {
      const edge = edges[edgeIndex];
      visited.add(edgeIndex);
      const appended = appendEdge(coordinates, edgeBreaksKm, edge, node);
      node = appended.nextNode;
      sourceOrderPreserved = sourceOrderPreserved && appended.sourceOrderPreserved;
      const available = (adjacency.get(node) ?? []).filter((candidate) => !visited.has(candidate));
      edgeIndex = (adjacency.get(node)?.length === 2 && available.length === 1) ? available[0] : undefined;
    }
    const cumulativeKm = cumulativeDistances(coordinates);
    const lengthKm = cumulativeKm[cumulativeKm.length - 1] ?? 0;
    if (coordinates.length > 1 && lengthKm > 0) routes.push({ coordinates, cumulativeKm, edgeBreaksKm, lengthKm, componentId: routeComponent, sourceOrderPreserved });
  };

  // A branch node terminates one real route and starts the adjacent branches;
  // no synthetic connector is inserted to manufacture a preferred branch.
  for (const [node, incidentEdges] of adjacency) {
    if (incidentEdges.length === 2) continue;
    for (const edgeIndex of incidentEdges) if (!visited.has(edgeIndex)) walk(node, edgeIndex);
  }
  // Closed loops have no degree-one/branch node, so seed their first edge.
  for (const edge of edges) if (!visited.has(edge.index)) walk(edge.start, edge.index);

  ROUTE_CACHE.set(geometry, routes);
  return routes;
}

function plansForFeature(feature: Feature<Geometry, GeoJsonProperties>, selectedPoint: Coordinate | null, bounds?: FlowBounds, cascadeGuides: CascadeFlowGuide[] = []): FlowParticlePlan[] {
  const properties = feature.properties ?? {};
  const selected = properties.selectedRiver === true;
  const systemId = String(properties.id ?? feature.id ?? 'river');
  const directionMetadataVerified = hasVerifiedFlowRouteDirection(properties);
  const routes = connectedRoutes(feature.geometry)
    .filter((route) => selected || intersectsBounds(route.coordinates, bounds))
    .sort((left, right) => {
      if (selected && selectedPoint) return nearestDistanceKm(left.coordinates, selectedPoint) - nearestDistanceKm(right.coordinates, selectedPoint);
      return right.lengthKm - left.lengthKm;
    });
  const systemGuides = cascadeGuides.filter((guide) => guide.systemId === systemId);
  return routes.map((route, index) => {
    const cascade = cascadeDirection(route, systemGuides);
    const metadataDirectional = directionMetadataVerified && route.sourceOrderPreserved;
    return {
      ...route,
      id: `${systemId}-route-${index}`,
      systemId,
      selected,
      directional: Boolean(cascade || metadataDirectional),
      directionMode: cascade ? 'cascade-elevation' : metadataDirectional ? 'verified' : 'representative',
      directionSign: cascade?.sign ?? (metadataDirectional ? 1 : null),
      upstreamName: cascade?.guide.upstreamName,
      downstreamName: cascade?.guide.downstreamName,
      elevationDropM: cascade ? cascade.guide.upstreamElevationM - cascade.guide.downstreamElevationM : undefined,
    };
  });
}

export function createFlowParticlePlans(
  rivers: FeatureCollection<Geometry, GeoJsonProperties>,
  selectedPoint: Coordinate | null,
  bounds?: FlowBounds,
  cascadeGuides: CascadeFlowGuide[] = [],
): FlowParticlePlan[] {
  const active = rivers.features.filter((feature) => feature.properties?.flowParticleActive === true);
  return active.flatMap((feature) => plansForFeature(feature, selectedPoint, bounds, cascadeGuides));
}

function modulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

function pointAlongRoute(plan: FlowParticlePlan, distance: number): { coordinate: Coordinate; sourceSegmentIndex: number } {
  const target = Math.min(plan.lengthKm, Math.max(0, distance));
  let segment = 1;
  while (segment < plan.cumulativeKm.length && plan.cumulativeKm[segment] < target) segment += 1;
  const upper = Math.min(segment, plan.coordinates.length - 1);
  const lower = Math.max(0, upper - 1);
  const span = plan.cumulativeKm[upper] - plan.cumulativeKm[lower];
  const ratio = span > 0 ? (target - plan.cumulativeKm[lower]) / span : 0;
  const sourceSegmentIndex = Math.max(0, plan.edgeBreaksKm.findIndex((edgeEnd) => target <= edgeEnd));
  return {
    coordinate: [
      plan.coordinates[lower][0] + (plan.coordinates[upper][0] - plan.coordinates[lower][0]) * ratio,
      plan.coordinates[lower][1] + (plan.coordinates[upper][1] - plan.coordinates[lower][1]) * ratio,
    ],
    sourceSegmentIndex,
  };
}

function particleBudget(plans: FlowParticlePlan[], zoom: number): number {
  const selected = plans.some((plan) => plan.selected);
  const totalLengthKm = plans.reduce((total, plan) => total + plan.lengthKm, 0);
  const spacingKm = selected
    ? (zoom >= 9 ? 5 : zoom >= 7 ? 10 : 22)
    : (zoom >= 9 ? 14 : zoom >= 7 ? 24 : 42);
  const cap = selected
    ? (zoom >= 9 ? 160 : zoom >= 7 ? 110 : 64)
    : (zoom >= 9 ? 180 : zoom >= 7 ? 150 : 120);
  return Math.max(1, Math.min(cap, Math.ceil(totalLengthKm / spacingKm)));
}

export function advanceFlowDistance(currentKm: number, deltaSeconds: number, speed: number): number {
  const safeDelta = Math.min(0.1, Math.max(0, deltaSeconds));
  return currentKm + safeDelta * BASE_SPEED_KM_PER_SECOND * Math.min(3, Math.max(0.25, speed));
}

export function createFlowParticleCollection(
  plans: FlowParticlePlan[],
  traveledDistanceKm: number,
  zoom: number,
): FeatureCollection<Point, ParticleProperties> {
  if (!plans.length) return EMPTY_PARTICLES;
  const totalLengthKm = plans.reduce((total, plan) => total + plan.lengthKm, 0);
  if (totalLengthKm <= 0) return EMPTY_PARTICLES;
  const budget = particleBudget(plans, zoom);
  const allocations = new Map<FlowParticlePlan, number[]>();
  const priorityPlans = plans.filter((plan) => plan.directionMode === 'cascade-elevation');
  // Reserve part of the country-view budget for every visible river system;
  // the remainder guarantees that elevation-directed cascades are not lost
  // among hundreds of disconnected source routes.
  const seededPlans = priorityPlans.length ? priorityPlans.slice(0, Math.floor(budget * 0.6)) : plans.length <= budget ? plans : [];
  for (const plan of seededPlans) allocations.set(plan, [plan.lengthKm / 2]);
  const distributedBudget = Math.max(0, budget - seededPlans.length);
  let routeStart = 0;
  let planIndex = 0;

  for (let particleIndex = 0; particleIndex < distributedBudget; particleIndex += 1) {
    const networkOffset = totalLengthKm * (particleIndex + 0.5) / distributedBudget;
    while (planIndex < plans.length - 1 && networkOffset > routeStart + plans[planIndex].lengthKm) {
      routeStart += plans[planIndex].lengthKm;
      planIndex += 1;
    }
    allocations.set(plans[planIndex], [...(allocations.get(plans[planIndex]) ?? []), networkOffset - routeStart]);
  }

  const features: Array<Feature<Point, ParticleProperties>> = [];
  let globalParticleIndex = 0;
  for (const plan of plans) {
    const offsets = allocations.get(plan) ?? [];
    for (let localIndex = 0; localIndex < offsets.length; localIndex += 1) {
      const travelDirection: 1 | -1 = plan.directionSign ?? (globalParticleIndex % 2 === 0 ? 1 : -1);
      const routeDistanceKm = modulo(offsets[localIndex] + traveledDistanceKm * travelDirection, plan.lengthKm);
      const pulse = 0.72 + 0.28 * Math.sin(traveledDistanceKm * 0.32 + globalParticleIndex * 1.7);
      const particleId = `${plan.id}-particle-${localIndex}`;
      const trailGapKm = plan.selected ? 1.2 : zoom < 6 ? 3.2 : 2;
      for (let trailStep = 2; trailStep >= 0; trailStep -= 1) {
        const trailDistanceKm = modulo(routeDistanceKm - travelDirection * trailGapKm * trailStep, plan.lengthKm);
        const sampled = pointAlongRoute(plan, trailDistanceKm);
        features.push({
          type: 'Feature',
          id: `${particleId}-trail-${trailStep}`,
          geometry: { type: 'Point', coordinates: sampled.coordinate },
          properties: {
            selected: plan.selected,
            directionMode: plan.directionMode,
            opacity: pulse * (trailStep === 0 ? 1 : trailStep === 1 ? 0.58 : 0.3),
            routeId: plan.id,
            componentId: plan.componentId,
            sourceSegmentIndex: sampled.sourceSegmentIndex,
            routeSegmentCount: plan.edgeBreaksKm.length,
            routeDistanceKm: Number(trailDistanceKm.toFixed(3)),
            travelDirection,
            trailStep,
            particleId,
            upstreamName: plan.upstreamName,
            downstreamName: plan.downstreamName,
            elevationDropM: plan.elevationDropM === undefined ? undefined : Number(plan.elevationDropM.toFixed(1)),
          },
        });
      }
      globalParticleIndex += 1;
    }
  }
  return { type: 'FeatureCollection', features };
}

export function emptyFlowParticles(): FeatureCollection<Point, ParticleProperties> {
  return EMPTY_PARTICLES;
}
