import type { Feature, FeatureCollection, Geometry, GeoJsonProperties, Position } from 'geojson';
import type { Map as MapLibreMap, LngLatLike } from 'maplibre-gl';

export type Selection = { type: string; id: string };
export type FocusDatasets = {
  rivers: FeatureCollection<Geometry, GeoJsonProperties>;
  basins: FeatureCollection<Geometry, GeoJsonProperties>;
  dams: FeatureCollection<Geometry, GeoJsonProperties>;
  hes177: FeatureCollection<Geometry, GeoJsonProperties>;
  cascades: FeatureCollection<Geometry, GeoJsonProperties>;
  riverGroups?: Map<string, Feature<Geometry, GeoJsonProperties>>;
};

const FOCUS_PADDING = { top: 56, right: 36, bottom: 132, left: 36 };

function featureId(feature: Feature<Geometry, GeoJsonProperties>): string | null {
  const value = feature.properties?.id ?? feature.properties?.entityId ?? feature.properties?.OBJECTID ?? feature.id;
  return value === undefined || value === null ? null : String(value);
}

function basinFeatureId(feature: Feature<Geometry, GeoJsonProperties>): string | null {
  const value = feature.properties?.basinId ?? feature.properties?.HAVZA_ID ?? feature.properties?.ID;
  return value === undefined || value === null ? null : String(value);
}

function positions(geometry: Geometry | null): Position[] {
  if (!geometry) return [];
  if (geometry.type === 'Point') return [geometry.coordinates];
  if (geometry.type === 'MultiPoint' || geometry.type === 'LineString') return geometry.coordinates;
  if (geometry.type === 'MultiLineString' || geometry.type === 'Polygon') return geometry.coordinates.flat();
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.flat(2);
  if (geometry.type === 'GeometryCollection') return geometry.geometries.flatMap((item) => positions(item));
  return [];
}

function distanceSquared(a: Position, b: Position): number {
  const longitudeScale = Math.cos((Number(a[1]) * Math.PI) / 180) || 1;
  const dx = (Number(a[0]) - Number(b[0])) * longitudeScale;
  const dy = Number(a[1]) - Number(b[1]);
  return dx * dx + dy * dy;
}

function positionsNearPoint(geometry: Geometry | null, point: Position): Position[] {
  if (!geometry || geometry.type !== 'MultiLineString') return positions(geometry);
  const parts = geometry.coordinates;
  if (!parts.length) return [];
  const nearest = parts.reduce((best, part, index) => {
    const distance = part.reduce((minimum, candidate) => Math.min(minimum, distanceSquared(candidate, point)), Infinity);
    return distance < best.distance ? { distance, index } : best;
  }, { distance: Infinity, index: -1 });
  return nearest.index >= 0 ? parts[nearest.index] : [];
}

function findFeature(selection: Selection, datasets: FocusDatasets): Feature<Geometry, GeoJsonProperties> | null {
  if (selection.type === 'river' && datasets.riverGroups?.has(selection.id)) return datasets.riverGroups.get(selection.id) ?? null;
  const collection = datasets[selection.type === 'river' ? 'rivers' : selection.type === 'basin' ? 'basins' : selection.type === 'dam' ? 'dams' : selection.type === 'hes' ? 'hes177' : 'rivers'];
  return collection?.features.find((feature) => (selection.type === 'basin' ? basinFeatureId(feature) : featureId(feature)) === selection.id) ?? null;
}

export function hasFocusableSelectedEntity(selection: Selection, datasets: FocusDatasets): boolean {
  const feature = findFeature(selection, datasets);
  return Boolean(feature && positions(feature.geometry).length > 0);
}

function boundsFor(points: Position[]): [[number, number], [number, number]] | null {
  if (!points.length) return null;
  let minX = Infinity; let minY = Infinity; let maxX = -Infinity; let maxY = -Infinity;
  points.forEach(([x, y]) => { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); });
  return [[minX, minY], [maxX, maxY]];
}

export function focusSelectedEntity(map: MapLibreMap, selection: Selection, datasets: FocusDatasets): boolean {
  const feature = findFeature(selection, datasets);
  if (!feature) return false;
  const points = positions(feature.geometry);
  if (!points.length) return false;
  if (selection.type === 'hes') {
    const relation = (feature.properties ?? {}) as Record<string, unknown>;
    const relatedIds = new Set([selection.id, ...(Array.isArray(relation.damIds) ? relation.damIds.map(String) : [])]);
    const relatedRiverIds = new Set([
      ...(Array.isArray(relation.riverIds) ? relation.riverIds.map(String) : []),
      ...(relation.riverSystemId ? [String(relation.riverSystemId)] : []),
    ]);
    const relatedPoints = [
      ...datasets.hes177.features,
      ...datasets.dams.features,
    ].filter((candidate) => { const id = featureId(candidate); return id !== null && relatedIds.has(id); }).flatMap((candidate) => positions(candidate.geometry));
    const focusPoint = points[0];
    const relatedRiverFeatures = datasets.rivers.features
      .filter((candidate) => { const id = featureId(candidate); return id !== null && relatedRiverIds.has(id); });
    const nearbyRiverPoints = relatedRiverFeatures.flatMap((candidate) => positionsNearPoint(candidate.geometry, focusPoint));
    relatedPoints.push(...(nearbyRiverPoints.length ? nearbyRiverPoints : relatedRiverFeatures.flatMap((candidate) => positions(candidate.geometry))));
    if (relatedPoints.length > 1) {
      const relatedBounds = boundsFor(relatedPoints);
      if (relatedBounds) {
        map.fitBounds(relatedBounds, { padding: FOCUS_PADDING, maxZoom: 11.5, duration: 950, essential: true });
        return true;
      }
    }
  }
  if (feature.geometry?.type === 'Point') {
    map.flyTo({ center: points[0] as LngLatLike, zoom: selection.type === 'basin' ? 7.8 : selection.type === 'river' ? 9.2 : 10.8, padding: FOCUS_PADDING, duration: 850, essential: true });
    return true;
  }
  const bounds = boundsFor(points);
  if (!bounds) return false;
  map.fitBounds(bounds, { padding: FOCUS_PADDING, maxZoom: selection.type === 'basin' ? 8.2 : selection.type === 'river' ? 9.5 : 10.5, duration: 950, essential: true });
  return true;
}

export function focusSelectedEntityOnce(
  focusedSelection: { current: string | null },
  selectionKey: string,
  map: MapLibreMap,
  selection: Selection,
  datasets: FocusDatasets,
): boolean {
  if (focusedSelection.current === selectionKey) return true;
  if (!focusSelectedEntity(map, selection, datasets)) return false;
  focusedSelection.current = selectionKey;
  return true;
}
