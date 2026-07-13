import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as turf from '@turf/turf';

export const TARGET_SITE_IDS = [
  'kamu-gokcekaya-pspp',
  'kamu-sariyar-pspp',
  'altinkaya',
  'kamu-bayramhacili-pspp',
  'kamu-hasan-ugurlu-pspp',
  'kamu-adiguzel-pspp',
  'kamu-kargi-pspp',
  'kamu-yamula-pspp',
  'kamu-oymapinar-pspp',
  'kamu-aslantas-pspp',
  'kamu-demirkopru-pspp',
];

const DEFAULT_ACTIVE_DEPTH_M = 25;
const SWITCHYARD_AND_PORTAL_SCALE = 0.4;
const POWERHOUSE_AND_SURGE_SCALE = 0.6;
const UPPER_EMBANKMENT_SCALE = 1.04;
const EARTH_RADIUS_M = 6371008.8;

const SWITCHYARD_OR_PORTAL_IDS = [
  'switchyard',
  'existingSwitchyard',
  'newSwitchyard',
  'switchyardFootprint',
  'servicePortal',
  'accessPortal',
  'tunnelPortal',
  'serviceDrainPortal',
];

const POWERHOUSE_OR_SURGE_IDS = [
  'powerhouse',
  'powerhouseFootprint',
  'undergroundPowerhouse',
  'surgeTank',
  'surgeTankFootprint',
  'surgeShaft',
  'surgeChamber',
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isCoordinate(value) {
  return Array.isArray(value)
    && value.length === 2
    && Number.isFinite(value[0])
    && Number.isFinite(value[1]);
}

function closeRing(coords) {
  const ring = coords.map((coord) => [Number(coord[0]), Number(coord[1])]);
  if (ring.length === 0) return ring;
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push([first[0], first[1]]);
  }
  return ring;
}

function toRadians(value) {
  return value * Math.PI / 180;
}

export function distanceMeters(a, b) {
  if (!isCoordinate(a) || !isCoordinate(b)) return Number.POSITIVE_INFINITY;
  const lat1 = toRadians(a[1]);
  const lat2 = toRadians(b[1]);
  const dLat = toRadians(b[1] - a[1]);
  const dLon = toRadians(b[0] - a[0]);
  const hav = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(hav));
}

export function polygonAreaM2(coords) {
  const ring = closeRing(coords);
  if (ring.length < 4) return 0;
  return turf.area(turf.polygon([ring]));
}

function centroidOfCoords(coords, kind = 'polygon') {
  if (!Array.isArray(coords) || coords.length === 0) return null;
  if (kind === 'polygon' && coords.length >= 4) {
    const centroid = turf.centroid(turf.polygon([closeRing(coords)])).geometry.coordinates;
    return [centroid[0], centroid[1]];
  }
  if (coords.length >= 2) {
    const centroid = turf.centroid(turf.lineString(coords)).geometry.coordinates;
    return [centroid[0], centroid[1]];
  }
  return isCoordinate(coords[0]) ? coords[0] : null;
}

function scaleCoordinateAround(coord, center, scale) {
  const cosLat = Math.max(0.000001, Math.cos(toRadians(center[1])));
  const x = (coord[0] - center[0]) * cosLat;
  const y = coord[1] - center[1];
  return [
    center[0] + (x * scale) / cosLat,
    center[1] + y * scale,
  ];
}

function scaleCoordsAround(coords, center, scale, closed) {
  const scaled = coords.map((coord) => scaleCoordinateAround(coord, center, scale));
  return closed ? closeRing(scaled) : scaled;
}

function translateCoordsToCentroid(coords, currentCentroid, targetCentroid, closed) {
  const dx = targetCentroid[0] - currentCentroid[0];
  const dy = targetCentroid[1] - currentCentroid[1];
  const translated = coords.map((coord) => [coord[0] + dx, coord[1] + dy]);
  return closed ? closeRing(translated) : translated;
}

function scaleFootprint(footprint, scale) {
  if (!footprint || footprint.kind !== 'polygon') return footprint;
  const next = clone(footprint);
  const centroid = centroidOfCoords(next.coords, 'polygon');
  if (!centroid) return next;
  next.coords = scaleCoordsAround(closeRing(next.coords), centroid, scale, true);
  if (Number.isFinite(next.extrudeM)) next.extrudeM *= scale;
  if (Number.isFinite(next.baseElevationM) && Number.isFinite(next.topElevationM)) {
    next.topElevationM = next.baseElevationM + (next.topElevationM - next.baseElevationM) * scale;
  }
  return next;
}

function translateFootprintToCentroid(footprint, targetCentroid) {
  if (!footprint || footprint.kind !== 'polygon' || !isCoordinate(targetCentroid)) return footprint;
  const next = clone(footprint);
  const centroid = centroidOfCoords(next.coords, 'polygon');
  if (!centroid) return next;
  next.coords = translateCoordsToCentroid(closeRing(next.coords), centroid, targetCentroid, true);
  return next;
}

export function findFootprint(footprints, ids) {
  if (!Array.isArray(footprints)) return undefined;
  const wanted = new Set(ids);
  return footprints.find((footprint) => wanted.has(footprint.id) || wanted.has(footprint.component));
}

function footprintMatchesAny(footprint, names) {
  return names.some((name) => footprint.id === name || footprint.component === name);
}

function nearestPointOnRing(point, ring) {
  if (!isCoordinate(point) || !Array.isArray(ring) || ring.length < 2) return point;
  const nearest = turf.nearestPointOnLine(
    turf.lineString(closeRing(ring)),
    turf.point(point),
    { units: 'meters' },
  ).geometry.coordinates;
  return [nearest[0], nearest[1]];
}

function setPolylineEndpoint(polyline, endpoint, targetRingOrPoint) {
  if (!polyline || polyline.kind !== 'polyline' || !Array.isArray(polyline.coords) || polyline.coords.length < 2) {
    return polyline;
  }
  const next = clone(polyline);
  const index = endpoint === 'start' ? 0 : next.coords.length - 1;
  const target = Array.isArray(targetRingOrPoint?.[0])
    ? nearestPointOnRing(next.coords[index], targetRingOrPoint)
    : targetRingOrPoint;
  if (isCoordinate(target)) next.coords[index] = target;
  return next;
}

function targetActiveVolumeHm3(refSite) {
  const value = refSite?.excelCalculated?.upperActiveVolumeHm3
    ?? refSite?.activeVolumeHm3
    ?? refSite?.components_detail?.upper_reservoir?.active_volume_mcm;
  return Number.isFinite(value) && value > 0 ? value : null;
}

function targetActiveDepthM(refSite) {
  const value = refSite?.layout3D?.conceptualActiveDepthM
    ?? refSite?.components_detail?.upper_reservoir?.active_depth_m
    ?? refSite?.components_detail?.upper_reservoir?.activeDepthM;
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_ACTIVE_DEPTH_M;
}

function scaleUpperReservoirWater(footprint, activeVolumeHm3, activeDepthM) {
  const currentArea = polygonAreaM2(footprint.coords);
  const targetArea = activeVolumeHm3 * 1_000_000 / activeDepthM;
  const centroid = centroidOfCoords(footprint.coords, 'polygon');
  if (!centroid || currentArea <= 0 || targetArea <= 0) {
    return {
      footprint: clone(footprint),
      scale: 1,
      surfaceAreaM2: currentArea,
      volumeValidationDifferencePct: Number.POSITIVE_INFINITY,
    };
  }

  let scale = Math.sqrt(targetArea / currentArea);
  let scaled = closeRing(footprint.coords);
  let area = currentArea;
  for (let i = 0; i < 5; i += 1) {
    scaled = scaleCoordsAround(closeRing(footprint.coords), centroid, scale, true);
    area = polygonAreaM2(scaled);
    if (area <= 0) break;
    const correction = Math.sqrt(targetArea / area);
    scale *= correction;
    if (Math.abs(1 - correction) < 0.0001) break;
  }

  const next = clone(footprint);
  next.coords = scaled;
  next.activeVolumeHm3 = activeVolumeHm3;
  next.activeDepthM = activeDepthM;
  next.surfaceAreaM2 = area;
  next.volumeValidationDifferencePct = Math.abs(((area * activeDepthM / 1_000_000) - activeVolumeHm3) / activeVolumeHm3) * 100;
  return {
    footprint: next,
    scale,
    surfaceAreaM2: area,
    volumeValidationDifferencePct: next.volumeValidationDifferencePct,
  };
}

function bboxFromCoordinates(coords) {
  const flat = coords.filter(isCoordinate);
  const lons = flat.map((coord) => coord[0]);
  const lats = flat.map((coord) => coord[1]);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const lonPad = Math.max(0.002, (maxLon - minLon) * 0.08);
  const latPad = Math.max(0.002, (maxLat - minLat) * 0.08);
  return [minLon - lonPad, minLat - latPad, maxLon + lonPad, maxLat + latPad];
}

function allFootprintCoordinates(footprints) {
  return footprints.flatMap((footprint) => footprint.coords ?? []);
}

function mergeRoute(...routes) {
  const result = [];
  routes.flat().forEach((coord) => {
    if (!isCoordinate(coord)) return;
    const last = result[result.length - 1];
    if (!last || last[0] !== coord[0] || last[1] !== coord[1]) {
      result.push(coord);
    }
  });
  return result;
}

function processFootprints(refSite, warnings) {
  const sourceFootprints = clone(refSite.layout3D?.componentFootprints ?? []);
  const activeVolumeHm3 = targetActiveVolumeHm3(refSite);
  const activeDepthM = targetActiveDepthM(refSite);
  if (!activeVolumeHm3) {
    warnings.push(`${refSite.id}: üst aktif hacim bulunamadı; rezervuar ölçeklenmedi.`);
  }

  const processed = sourceFootprints.map((footprint) => {
    if (footprintMatchesAny(footprint, SWITCHYARD_OR_PORTAL_IDS)) {
      return scaleFootprint(footprint, SWITCHYARD_AND_PORTAL_SCALE);
    }
    if (footprintMatchesAny(footprint, POWERHOUSE_OR_SURGE_IDS)) {
      return scaleFootprint(footprint, POWERHOUSE_AND_SURGE_SCALE);
    }
    return clone(footprint);
  });

  const upperWaterIndex = processed.findIndex((footprint) => footprint.id === 'upperReservoirWater');
  let upperScale = 1;
  let upperSurfaceAreaM2 = 0;
  let upperVolumeDiffPct = Number.POSITIVE_INFINITY;
  if (upperWaterIndex >= 0 && activeVolumeHm3) {
    const scaled = scaleUpperReservoirWater(processed[upperWaterIndex], activeVolumeHm3, activeDepthM);
    processed[upperWaterIndex] = scaled.footprint;
    upperScale = scaled.scale;
    upperSurfaceAreaM2 = scaled.surfaceAreaM2;
    upperVolumeDiffPct = scaled.volumeValidationDifferencePct;
    if (upperVolumeDiffPct > 2) {
      warnings.push(`${refSite.id}: üst rezervuar hacim farkı ${upperVolumeDiffPct.toFixed(2)}%.`);
    }
  }

  const upperWater = findFootprint(processed, ['upperReservoirWater']);
  const upperEmbankmentIndex = processed.findIndex((footprint) => footprint.id === 'upperReservoirEmbankment');
  if (upperWater && upperEmbankmentIndex >= 0) {
    const center = centroidOfCoords(upperWater.coords, 'polygon');
    const embankment = clone(processed[upperEmbankmentIndex]);
    embankment.coords = scaleCoordsAround(upperWater.coords, center, UPPER_EMBANKMENT_SCALE, true);
    processed[upperEmbankmentIndex] = embankment;
  }

  const upperBoundary = findFootprint(processed, ['upperReservoirWater'])?.coords;
  const lowerBoundary = findFootprint(processed, ['lowerReservoirFootprint', 'lowerReservoirWater'])?.coords;
  const surgeBoundary = findFootprint(processed, ['surgeTankFootprint', 'surgeTank'])?.coords;
  const powerBoundary = findFootprint(processed, ['powerhouseFootprint', 'powerhouse', 'undergroundPowerhouse'])?.coords;

  const upperIntakeIndex = processed.findIndex((footprint) => footprint.id === 'upperIntake' || footprint.component === 'intake');
  let intakePoint = null;
  if (upperIntakeIndex >= 0 && upperBoundary) {
    const current = centroidOfCoords(processed[upperIntakeIndex].coords, 'polygon');
    intakePoint = current ? nearestPointOnRing(current, upperBoundary) : null;
    if (intakePoint) processed[upperIntakeIndex] = translateFootprintToCentroid(processed[upperIntakeIndex], intakePoint);
  }

  for (let index = 0; index < processed.length; index += 1) {
    const footprint = processed[index];
    if (footprint.kind !== 'polyline') continue;
    let next = footprint;
    if (footprint.id.includes('headrace')) {
      next = setPolylineEndpoint(next, 'start', intakePoint ?? upperBoundary);
      next = setPolylineEndpoint(next, 'end', surgeBoundary);
    } else if (footprint.id.includes('penstock')) {
      next = setPolylineEndpoint(next, 'start', surgeBoundary);
      next = setPolylineEndpoint(next, 'end', powerBoundary);
    } else if (footprint.id.includes('tailrace')) {
      next = setPolylineEndpoint(next, 'start', powerBoundary);
      next = setPolylineEndpoint(next, 'end', lowerBoundary);
    }
    processed[index] = next;
  }

  return {
    footprints: processed.map((footprint) => (footprint.kind === 'polygon'
      ? { ...footprint, coords: closeRing(footprint.coords) }
      : footprint)),
    upperScale,
    upperSurfaceAreaM2,
    upperVolumeDiffPct,
    activeVolumeHm3,
    activeDepthM,
  };
}

function preferredPowerhousePoint(refSite, footprints) {
  if (isCoordinate(refSite.coordinates?.powerhouse?.point)) return refSite.coordinates.powerhouse.point;
  const powerhouse = findFootprint(footprints, ['powerhouseFootprint', 'powerhouse', 'undergroundPowerhouse']);
  return centroidOfCoords(powerhouse?.coords ?? [], powerhouse?.kind ?? 'polygon');
}

function buildUpdatedSite(existingSite, refSite, footprintResult, warnings) {
  const footprints = footprintResult.footprints;
  const upperWater = findFootprint(footprints, ['upperReservoirWater']);
  const lowerReservoir = findFootprint(footprints, ['lowerReservoirFootprint', 'lowerReservoirWater']);
  const powerhouse = findFootprint(footprints, ['powerhouseFootprint', 'powerhouse', 'undergroundPowerhouse']);
  const surge = findFootprint(footprints, ['surgeTankFootprint', 'surgeTank']);
  const switchyard = findFootprint(footprints, ['switchyardFootprint', 'switchyard']);
  const portal = findFootprint(footprints, ['serviceDrainPortal', 'servicePortal', 'accessPortal', 'tunnelPortal', 'portal']);
  const tailrace = findFootprint(footprints, ['tailraceAlignment', 'tailrace_tunnel']);
  const headrace = findFootprint(footprints, ['headraceAlignment', 'headrace_tunnel']);
  const penstock = footprints.find((footprint) => footprint.id.startsWith('penstock'));

  const upperPoint = centroidOfCoords(upperWater?.coords ?? refSite.coordinates?.upperReservoir?.point, 'polygon')
    ?? refSite.coordinates?.upperReservoir?.point
    ?? existingSite.coordinates.upperReservoir.point;
  const lowerPoint = centroidOfCoords(lowerReservoir?.coords ?? refSite.coordinates?.lowerReservoir?.point, 'polygon')
    ?? refSite.coordinates?.lowerReservoir?.point
    ?? existingSite.coordinates.lowerReservoir.point;
  const powerhouseCentroid = centroidOfCoords(powerhouse?.coords ?? [], 'polygon')
    ?? refSite.coordinates?.powerhouse?.point
    ?? existingSite.coordinates.powerhouse.point;
  const powerhousePoint = preferredPowerhousePoint(refSite, footprints) ?? powerhouseCentroid;
  const surgePoint = centroidOfCoords(surge?.coords ?? [], 'polygon') ?? refSite.coordinates?.surgeTank?.point ?? existingSite.coordinates.surgeTank.point;
  const switchyardPoint = centroidOfCoords(switchyard?.coords ?? [], 'polygon') ?? refSite.coordinates?.switchyard?.point ?? existingSite.coordinates.switchyard.point;
  const portalPoint = centroidOfCoords(portal?.coords ?? [], 'polygon') ?? refSite.coordinates?.servicePortal?.point ?? existingSite.coordinates.servicePortal?.point;
  const tailracePoint = tailrace?.coords?.at(-1) ?? refSite.coordinates?.tailraceOutlet?.point ?? existingSite.coordinates.tailraceOutlet.point;
  const penstockRoute = mergeRoute(headrace?.coords ?? [], penstock?.coords ?? []);
  const bbox = bboxFromCoordinates([
    ...allFootprintCoordinates(footprints),
    refSite.coordinates?.mapAnchor,
    refSite.view?.center,
  ]);

  const layout3DSource = refSite.layout3D ?? existingSite.layout3D ?? {};
  const { componentFootprints: _componentFootprints, ...layout3DWithoutFootprints } = layout3DSource;

  const coordinates = {
    ...existingSite.coordinates,
    ...(refSite.coordinates ?? {}),
    mapAnchor: refSite.coordinates?.mapAnchor ?? existingSite.coordinates.mapAnchor,
    lowerReservoir: {
      ...existingSite.coordinates.lowerReservoir,
      ...(refSite.coordinates?.lowerReservoir ?? {}),
      point: lowerPoint,
    },
    upperReservoir: {
      ...existingSite.coordinates.upperReservoir,
      ...(refSite.coordinates?.upperReservoir ?? {}),
      point: upperPoint,
    },
    upperReservoirPolygon: upperWater?.coords ?? existingSite.coordinates.upperReservoirPolygon,
    lowerReservoirPolygon: lowerReservoir?.coords ?? existingSite.coordinates.lowerReservoirPolygon,
    powerhouse: {
      ...existingSite.coordinates.powerhouse,
      ...(refSite.coordinates?.powerhouse ?? {}),
      point: powerhousePoint,
    },
    surgeTank: { ...(refSite.coordinates?.surgeTank ?? existingSite.coordinates.surgeTank), point: surgePoint },
    servicePortal: portalPoint ? { ...(refSite.coordinates?.servicePortal ?? existingSite.coordinates.servicePortal ?? {}), point: portalPoint } : undefined,
    penstockRoute: penstockRoute.length >= 2 ? penstockRoute : existingSite.coordinates.penstockRoute,
    tailraceOutlet: { ...(refSite.coordinates?.tailraceOutlet ?? existingSite.coordinates.tailraceOutlet), point: tailracePoint },
    switchyard: { ...(refSite.coordinates?.switchyard ?? existingSite.coordinates.switchyard), point: switchyardPoint },
    gridConnection: refSite.coordinates?.gridConnection ?? existingSite.coordinates.gridConnection,
    transmissionLineRoute: refSite.coordinates?.transmissionLineRoute ?? existingSite.coordinates.transmissionLineRoute,
    bbox,
  };

  const refLayout = refSite.layout ?? {};
  const existingLayout = existingSite.layout ?? {};
  const layout = {
    ...existingLayout,
    ...refLayout,
    bearing: refLayout.bearing ?? existingLayout.bearing ?? layout3DSource.preferredBearing ?? 0,
    upper: upperPoint,
    upperPolygon: upperWater?.coords,
    lower: lowerPoint,
    power: powerhousePoint,
    surge: surgePoint,
    servicePortal: portalPoint,
    switchyard: switchyardPoint,
    gridA: refLayout.gridA ?? existingLayout.gridA ?? coordinates.gridConnection.point,
    gridB: refLayout.gridB ?? existingLayout.gridB ?? coordinates.gridConnection.point,
    risk: refLayout.risk ?? existingLayout.risk ?? coordinates.mapAnchor,
    gridTap: refLayout.gridTap ?? existingLayout.gridTap ?? coordinates.gridConnection.point,
  };

  const componentsDetail = {
    ...(existingSite.components_detail ?? {}),
    ...(refSite.components_detail ?? {}),
    upper_reservoir: {
      ...(existingSite.components_detail?.upper_reservoir ?? {}),
      ...(refSite.components_detail?.upper_reservoir ?? {}),
      active_volume_mcm: footprintResult.activeVolumeHm3 ?? existingSite.components_detail?.upper_reservoir?.active_volume_mcm ?? 0,
      shape_note: 'Referans 3D JSON ve aktif hacim hedefiyle ölçeklenmiş poligon.',
      render_mode: 'polygon_footprint',
    },
  };

  const updated = {
    ...existingSite,
    coordinates,
    layout,
    layout3D: {
      ...layout3DWithoutFootprints,
      scale: 'macro',
      reservoirSurfaceMode: 'polygon',
      useFootprintPolygons: true,
      hideLegacySquareReservoir: true,
    },
    view: refSite.view ?? existingSite.view,
    components_detail: componentsDetail,
    verificationNotes: refSite.verificationNotes ?? existingSite.verificationNotes,
  };

  if (!isCoordinate(powerhousePoint)) {
    warnings.push(`${existingSite.id}: güç evi marker koordinatı üretilemedi.`);
  }

  return {
    site: updated,
    metadata: {
      powerhouseCentroid,
      powerhousePoint,
      markerPowerhouseDistanceM: distanceMeters(powerhousePoint, powerhouseCentroid),
    },
  };
}

export function prepare3DGeometryUpdate(baseSites, referenceSites) {
  const warnings = [];
  const referenceById = new Map(referenceSites.map((site) => [site.id, site]));
  const footprintFiles = new Map();
  const metadataById = new Map();
  const report = [];
  const targetIds = new Set(TARGET_SITE_IDS);

  for (const id of TARGET_SITE_IDS) {
    if (!referenceById.has(id)) warnings.push(`${id}: referans JSON içinde bulunamadı.`);
    if (!baseSites.some((site) => site.id === id)) warnings.push(`${id}: mevcut data.json içinde bulunamadı.`);
  }

  const sites = baseSites.map((site) => {
    if (!targetIds.has(site.id)) return site;
    const refSite = referenceById.get(site.id);
    if (!refSite) return site;

    const footprintResult = processFootprints(refSite, warnings);
    const { site: updatedSite, metadata } = buildUpdatedSite(site, refSite, footprintResult, warnings);
    footprintFiles.set(site.id, footprintResult.footprints);
    metadataById.set(site.id, metadata);
    report.push({
      id: site.id,
      name: site.name,
      activeVolumeHm3: footprintResult.activeVolumeHm3,
      activeDepthM: footprintResult.activeDepthM,
      surfaceAreaM2: footprintResult.upperSurfaceAreaM2,
      volumeValidationDifferencePct: footprintResult.upperVolumeDiffPct,
      upperReservoirScale: footprintResult.upperScale,
      switchyardScale: SWITCHYARD_AND_PORTAL_SCALE,
      portalScale: SWITCHYARD_AND_PORTAL_SCALE,
      powerhouseScale: POWERHOUSE_AND_SURGE_SCALE,
      surgeScale: POWERHOUSE_AND_SURGE_SCALE,
      markerPowerhouseDistanceM: metadata.markerPowerhouseDistanceM,
    });
    return updatedSite;
  });

  return { sites, footprintFiles, metadataById, report, warnings };
}

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return '—';
  return value.toLocaleString('tr-TR', { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

function printReport(result) {
  const rows = result.report.map((row) => ({
    id: row.id,
    'Aktif Hm3': formatNumber(row.activeVolumeHm3, 2),
    'Derinlik m': formatNumber(row.activeDepthM, 0),
    'Alan m2': formatNumber(row.surfaceAreaM2, 0),
    'Hacim fark %': formatNumber(row.volumeValidationDifferencePct, 3),
    'Üst ölçek': formatNumber(row.upperReservoirScale, 3),
    'Şalt/portal': '0,40',
    'Güç/surge': '0,60',
    'Marker m': formatNumber(row.markerPowerhouseDistanceM, 1),
  }));
  console.table(rows);
  if (result.warnings.length > 0) {
    console.warn('Uyarılar:');
    result.warnings.forEach((warning) => console.warn(`- ${warning}`));
  }
}

async function runCli() {
  const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const dataPath = path.join(appRoot, 'public', 'data.json');
  const refPath = path.resolve(appRoot, '..', 'docs', 'PDHES_11_Santral_3D_Gelistirilmis_Tek_JSON.json');
  const footprintsDir = path.join(appRoot, 'public', 'footprints');
  const baseSites = JSON.parse(await fs.readFile(dataPath, 'utf8'));
  const referenceSites = JSON.parse(await fs.readFile(refPath, 'utf8'));
  const result = prepare3DGeometryUpdate(baseSites, referenceSites);

  await fs.mkdir(footprintsDir, { recursive: true });
  await fs.writeFile(dataPath, `${JSON.stringify(result.sites, null, 2)}\n`, 'utf8');
  await Promise.all([...result.footprintFiles].map(([siteId, footprints]) => (
    fs.writeFile(path.join(footprintsDir, `${siteId}.json`), `${JSON.stringify(footprints, null, 2)}\n`, 'utf8')
  )));
  printReport(result);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCli().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
