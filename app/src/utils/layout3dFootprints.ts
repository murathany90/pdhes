import type { Layout3DFootprint, Layout3DMaterial, Site } from '../types/site';

export interface ScenePoint {
  x: number;
  y: number;
  z: number;
}

export interface Layout3DProjectedFootprint {
  id: string;
  component: string;
  kind: Layout3DFootprint['kind'];
  material: Layout3DMaterial;
  closed: boolean;
  points: ScenePoint[];
  baseY: number;
  topY: number;
  extrudeY: number;
}

export interface Layout3DFootprintPlan {
  enabled: boolean;
  hideLegacySquareReservoir: boolean;
  items: Layout3DProjectedFootprint[];
}

export const LAYOUT_3D_MATERIAL_COLORS: Record<Layout3DMaterial, string> = {
  water: '#0f70b7',
  embankment: '#6f756b',
  crest_road: '#4f5358',
  concrete: '#a7afb8',
  tunnel_axis: '#36d6ff',
  shaft: '#ffd75a',
  portal: '#ff944d',
  industrial: '#9b6cff',
  tailrace_channel: '#0891b2',
  switchyard: '#48f49a',
  switchyard_existing: '#8bc34a',
  switchyard_new: '#48f49a',
};

const METERS_PER_DEGREE_LAT = 111_320;
const SCENE_SCALE = 0.11; // Increased to match ThreeDModel's realistic terrain scale (~220 units per 2000m)
const VERTICAL_SCALE = 0.11; // Kept proportional to SCENE_SCALE

export function projectLngLatToScene(
  coord: [number, number],
  bbox: [number, number, number, number],
): { x: number; z: number } {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const centerLon = (minLon + maxLon) / 2;
  const centerLat = (minLat + maxLat) / 2;
  const metersPerDegreeLon = METERS_PER_DEGREE_LAT * Math.cos(centerLat * Math.PI / 180);

  return {
    x: (coord[0] - centerLon) * metersPerDegreeLon * SCENE_SCALE,
    z: -(coord[1] - centerLat) * METERS_PER_DEGREE_LAT * SCENE_SCALE,
  };
}

function getFootprintsBbox(footprints: Layout3DFootprint[]): [number, number, number, number] {
  if (footprints.length === 0) return [0, 0, 0, 0];
  let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity;
  for (const f of footprints) {
    for (const [lon, lat] of f.coords) {
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
  }
  return [minLon, minLat, maxLon, maxLat];
}

function elevationValues(footprint: Layout3DFootprint): number[] {
  return [
    footprint.baseElevationM,
    footprint.topElevationM,
    footprint.elevationM,
    ...(footprint.profileElevationM ?? []),
  ].filter((value): value is number => Number.isFinite(value));
}

function minElevation(footprints: Layout3DFootprint[]): number {
  const values = footprints.flatMap(elevationValues);
  return values.length > 0 ? Math.min(...values) : 0;
}

function projectedY(elevationM: number | undefined, minElevationM: number, exaggeration: number): number {
  if (!Number.isFinite(elevationM)) return 0;
  return ((elevationM as number) - minElevationM) * VERTICAL_SCALE * exaggeration;
}

function projectFootprint(
  footprint: Layout3DFootprint,
  site: Site,
  minElevationM: number,
  bbox: [number, number, number, number]
): Layout3DProjectedFootprint {
  const exaggeration = site.layout3D?.terrainExaggeration ?? 1;
  const baseElevation = footprint.baseElevationM ?? footprint.elevationM ?? footprint.profileElevationM?.[0] ?? minElevationM;
  const topElevation = footprint.topElevationM ?? footprint.elevationM ?? baseElevation;
  const baseY = projectedY(baseElevation, minElevationM, exaggeration);
  const topY = projectedY(topElevation, minElevationM, exaggeration);
  const extrudeY = Math.max(0, (footprint.extrudeM ?? Math.max(0, topElevation - baseElevation)) * VERTICAL_SCALE * exaggeration);

  return {
    id: footprint.id,
    component: footprint.component,
    kind: footprint.kind,
    material: footprint.material,
    closed: Boolean(footprint.closed),
    points: footprint.coords.map((coord, index) => {
      const { x, z } = projectLngLatToScene(coord, bbox);
      const profileElevation = footprint.profileElevationM?.[index];
      return {
        x,
        y: projectedY(profileElevation ?? topElevation, minElevationM, exaggeration),
        z,
      };
    }),
    baseY,
    topY,
    extrudeY,
  };
}

export function buildLayout3DFootprintPlan(site: Site): Layout3DFootprintPlan {
  const layout3D = site.layout3D;
  if (!layout3D?.useFootprintPolygons || !layout3D.componentFootprints || layout3D.componentFootprints.length === 0) {
    return { enabled: false, hideLegacySquareReservoir: false, items: [] };
  }

  const bbox = getFootprintsBbox(layout3D.componentFootprints);
  const baseElevation = minElevation(layout3D.componentFootprints);
  return {
    enabled: true,
    hideLegacySquareReservoir: layout3D.hideLegacySquareReservoir,
    items: layout3D.componentFootprints.map((footprint) => projectFootprint(footprint, site, baseElevation, bbox)),
  };
}
