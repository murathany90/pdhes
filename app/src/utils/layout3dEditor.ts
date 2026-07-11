import type { Layout3DFootprint, Layout3DSpec, PdhCoordinateSet, Site, SiteLayout } from '../types/site';
import { circlePolygon, mid, rotatedRectangle, scalePolygon } from './geo';
import { buildComponentsDetail, getSiteLayout, isSeaLowerReservoir } from './siteDerived';

const METERS_PER_DEGREE_LAT = 111_320;

const EDITOR_FOOTPRINT_IDS = new Set([
  'upperReservoirWater',
  'upperReservoirEmbankment',
  'lowerReservoirFootprint',
  'penstock01',
  'tailraceOutfall',
  'powerhouseFootprint',
  'surgeTankFootprint',
  'switchyardFootprint',
  'serviceDrainPortal',
]);

function sameCoordinate(a: [number, number], b: [number, number]): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

export function ensureClosedRing(coords: [number, number][]): [number, number][] {
  if (coords.length === 0) return [];
  const ring = coords.map((coord) => [coord[0], coord[1]] as [number, number]);
  if (!sameCoordinate(ring[0], ring[ring.length - 1])) {
    ring.push([ring[0][0], ring[0][1]]);
  }
  return ring;
}

function validRing(coords: [number, number][] | undefined): [number, number][] | null {
  if (!coords || coords.length < 3) return null;
  const ring = ensureClosedRing(coords);
  return ring.length >= 4 ? ring : null;
}

function rectangleForArea(areaM2: number, widthToLengthRatio = 0.72): { width: number; length: number } {
  if (!Number.isFinite(areaM2) || areaM2 <= 0) return { width: 900, length: 650 };
  const length = Math.sqrt(areaM2 / widthToLengthRatio);
  return { width: length * widthToLengthRatio, length };
}

function bearingBetween(a: [number, number], b: [number, number]): number {
  const centerLat = (a[1] + b[1]) / 2;
  const metersPerDegreeLon = METERS_PER_DEGREE_LAT * Math.cos(centerLat * Math.PI / 180);
  const east = (b[0] - a[0]) * metersPerDegreeLon;
  const north = (b[1] - a[1]) * METERS_PER_DEGREE_LAT;
  if (east === 0 && north === 0) return 0;
  return Math.atan2(east, north) * 180 / Math.PI;
}

function footprintPolygon(
  id: string,
  component: string,
  material: Layout3DFootprint['material'],
  coords: [number, number][],
  baseElevationM: number,
  topElevationM: number,
): Layout3DFootprint {
  return {
    id,
    component,
    kind: 'polygon',
    material,
    closed: true,
    coords: ensureClosedRing(coords),
    baseElevationM,
    topElevationM,
    extrudeM: Math.max(0, topElevationM - baseElevationM),
  };
}

function footprintPolyline(
  id: string,
  component: string,
  material: Layout3DFootprint['material'],
  coords: [number, number][],
  startElevationM: number,
  endElevationM: number,
): Layout3DFootprint {
  const safeCoords = coords.length >= 2 ? coords : [];
  const profileElevationM = safeCoords.map((_, index) => {
    if (safeCoords.length <= 1) return startElevationM;
    const t = index / (safeCoords.length - 1);
    return startElevationM + (endElevationM - startElevationM) * t;
  });

  return {
    id,
    component,
    kind: 'polyline',
    material,
    coords: safeCoords,
    profileElevationM,
  };
}

function ringOrFallback(
  polygon: [number, number][] | undefined,
  center: [number, number],
  widthM: number,
  lengthM: number,
  bearing: number,
): [number, number][] {
  return validRing(polygon) ?? rotatedRectangle(center, widthM, lengthM, bearing);
}

function updateLayoutFromCoordinates(site: Site, coordinates: PdhCoordinateSet, bearing: number): SiteLayout {
  const current = getSiteLayout(site);
  const gridTap = coordinates.gridConnection.point;
  return {
    ...current,
    bearing: Number.isFinite(current.bearing) ? current.bearing : bearing,
    upper: coordinates.upperReservoir.point,
    upperPolygon: validRing(coordinates.upperReservoirPolygon) ?? current.upperPolygon,
    lower: coordinates.lowerReservoir.point,
    power: coordinates.powerhouse.point,
    surge: coordinates.surgeTank.point,
    switchyard: coordinates.switchyard.point,
    gridTap,
    risk: coordinates.mapAnchor,
  };
}

export function buildEditorComponentFootprints(site: Site): Layout3DFootprint[] {
  const coordinates = site.coordinates;
  const layout = getSiteLayout(site);
  const detail = buildComponentsDetail(site);
  const sea = isSeaLowerReservoir(site);
  const bearing = site.layout3D?.preferredBearing ?? layout.bearing ?? bearingBetween(layout.upper, layout.lower);
  const upperElevation = detail.upper_reservoir.elevation_m;
  const lowerElevation = detail.lower_reservoir.elevation_m;
  const damHeight = detail.upper_reservoir.dam_height_m;
  const activeVolumeM3 = Math.max(1, detail.upper_reservoir.active_volume_mcm) * 1_000_000;
  // Use user-provided damHeight (assumed effective water depth = damHeight * 0.8) for area calculation
  const effectiveDepth = Math.max(5, damHeight * 0.8);
  const upperDimensions = rectangleForArea(activeVolumeM3 / effectiveDepth, sea ? 0.78 : 0.72);

  const upperWater = ringOrFallback(
    coordinates.upperReservoirPolygon,
    layout.upper,
    upperDimensions.width,
    upperDimensions.length,
    bearing + 4,
  );
  const lowerWater = ringOrFallback(
    coordinates.lowerReservoirPolygon,
    layout.lower,
    sea ? 160 : 900,
    sea ? 110 : 500,
    bearing - 10,
  );

  const powerhouseFootprint = rotatedRectangle(
    layout.power,
    sea ? 260 : 320,
    sea ? 150 : 170,
    bearing + 1,
  );
  const switchyardFootprint = rotatedRectangle(
    layout.switchyard,
    sea ? 340 : 390,
    sea ? 240 : 260,
    bearing - 7,
  );
  const surgeTankFootprint = circlePolygon(layout.surge, sea ? 55 : 70, 32);
  const portalCenter = site.coordinates.servicePortal?.point ?? mid(layout.upper, layout.power, sea ? 0.55 : 0.58);
  const portalFootprint = rotatedRectangle(portalCenter, sea ? 180 : 220, sea ? 90 : 110, bearing + 12);
  
  // Create a single waterway route. If manual points exist, use them. Otherwise auto-connect.
  let waterwayRoute: [number, number][] = [];
  if (coordinates.penstockRoute && coordinates.penstockRoute.length >= 2) {
    waterwayRoute = coordinates.penstockRoute;
  } else {
    waterwayRoute = [layout.upper, layout.surge, layout.power, coordinates.tailraceOutlet?.point ?? layout.lower, layout.lower];
  }

  return [
    footprintPolygon('upperReservoirEmbankment', 'upper_reservoir', 'embankment', scalePolygon(upperWater, 1.04), upperElevation - damHeight, upperElevation + 3),
    footprintPolygon('upperReservoirWater', 'upper_reservoir', 'water', upperWater, upperElevation, upperElevation + 1),
    footprintPolygon('lowerReservoirFootprint', 'lower_reservoir', 'water', lowerWater, lowerElevation, lowerElevation + 1),
    footprintPolyline('penstock01', 'penstock', 'tunnel_axis', waterwayRoute, upperElevation, lowerElevation),
    footprintPolygon('powerhouseFootprint', 'powerhouse', 'industrial', powerhouseFootprint, lowerElevation, lowerElevation + detail.powerhouse.cavern_height_m),
    footprintPolygon('surgeTankFootprint', 'surge_tank', 'shaft', surgeTankFootprint, lowerElevation + 10, lowerElevation + 10 + detail.surge_tank.height_m),
    footprintPolygon('switchyardFootprint', 'switchyard', 'switchyard', switchyardFootprint, lowerElevation + 2, lowerElevation + 2 + Math.max(10, detail.switchyard.transformer_count * 4)),
    footprintPolygon('serviceDrainPortal', 'portal', 'portal', portalFootprint, lowerElevation + 4, lowerElevation + 24),
  ];
}

function mergeFootprints(existing: Layout3DFootprint[] | undefined, generated: Layout3DFootprint[]): Layout3DFootprint[] {
  const preserved = (existing ?? []).filter((footprint) => !EDITOR_FOOTPRINT_IDS.has(footprint.id));
  return [...preserved, ...generated];
}

export function applyEditorDerivedLayout(site: Site): Site {
  const upperReservoirPolygon = validRing(site.coordinates.upperReservoirPolygon) ?? undefined;
  const lowerReservoirPolygon = validRing(site.coordinates.lowerReservoirPolygon) ?? undefined;
  const coordinates: PdhCoordinateSet = { ...site.coordinates };
  delete coordinates.upperReservoirPolygon;
  delete coordinates.lowerReservoirPolygon;
  if (upperReservoirPolygon) coordinates.upperReservoirPolygon = upperReservoirPolygon;
  if (lowerReservoirPolygon) coordinates.lowerReservoirPolygon = lowerReservoirPolygon;
  const bearing = site.layout3D?.preferredBearing ?? site.layout?.bearing ?? bearingBetween(
    coordinates.upperReservoir.point,
    coordinates.lowerReservoir.point,
  );
  const layout = updateLayoutFromCoordinates(site, coordinates, bearing);
  const generatedFootprints = buildEditorComponentFootprints({ ...site, coordinates, layout });
  const baseLayout3D: Layout3DSpec = {
    scale: 'macro',
    preferredBearing: bearing,
    terrainExaggeration: 1,
    reservoirSurfaceMode: 'polygon',
    useFootprintPolygons: false,
    hideLegacySquareReservoir: false,
    ...(site.layout3D ?? {}),
  };

  return {
    ...site,
    coordinates,
    layout,
    layout3D: {
      ...baseLayout3D,
      scale: 'macro',
      reservoirSurfaceMode: 'polygon',
      useFootprintPolygons: true,
      hideLegacySquareReservoir: true,
      renderUpperReservoirAsPolygon: true,
      renderLowerReservoirAsPolygon: true,
      componentFootprints: mergeFootprints(baseLayout3D.componentFootprints, generatedFootprints),
    },
  };
}
