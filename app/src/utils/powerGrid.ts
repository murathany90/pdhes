import type { Feature, FeatureCollection, Geometry } from 'geojson';

const VOLTAGE_UNIT_PATTERN = /(-?\d+(?:[.,]\d+)?)\s*(?:kv|kvolt)?/gi;

export type GridVoltageGroup = 'over500' | 'v400' | 'v380' | 'v154' | 'v33' | 'under33' | 'unknown';

function toKv(value: number): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  return value >= 1000 ? value / 1000 : value;
}

/** Converts common OSM/grid voltage encodings to kV values without guessing missing data. */
export function normalizeGridVoltageKv(value: unknown): number[] {
  if (typeof value === 'number') {
    const voltage = toKv(value);
    return voltage === null ? [] : [voltage];
  }
  if (typeof value !== 'string') return [];

  const result: number[] = [];
  for (const match of value.matchAll(VOLTAGE_UNIT_PATTERN)) {
    const parsed = Number(match[1].replace(',', '.'));
    const voltage = toKv(parsed);
    if (voltage !== null && !result.includes(voltage)) result.push(voltage);
  }
  return result;
}

/** Maps normalized nominal voltages to a visual style group without changing the source value. */
export function getGridVoltageGroup(value: unknown): GridVoltageGroup {
  const voltages = Array.isArray(value) && value.every((item) => typeof item === 'number')
    ? value.filter((item): item is number => Number.isFinite(item) && item > 0)
    : normalizeGridVoltageKv(value);
  if (voltages.length === 0) return 'unknown';

  const maximum = Math.max(...voltages);
  if (maximum >= 500) return 'over500';
  if (maximum >= 390) return 'v400';
  if (maximum >= 300) return 'v380';
  if (maximum >= 66) return 'v154';
  if (maximum >= 20) return 'v33';
  return 'under33';
}

/** Formats normalized kV values for UI text while leaving the source voltage untouched. */
export function formatGridVoltageLabel(value: unknown): string {
  const voltages = Array.isArray(value) && value.every((item) => typeof item === 'number')
    ? value.filter((item): item is number => Number.isFinite(item) && item > 0)
    : normalizeGridVoltageKv(value);
  if (voltages.length === 0) return 'Bilinmiyor';
  return voltages
    .map((voltage) => `${Number.isInteger(voltage) ? voltage : Number(voltage.toFixed(2))} kV`)
    .join(' / ');
}

/** Adds normalized style-only fields while retaining the original voltage property. */
export function normalizeGridVoltageFeatures(gridAssets: FeatureCollection): FeatureCollection {
  return {
    ...gridAssets,
    features: gridAssets.features.map((feature) => {
      const voltageKv = normalizeGridVoltageKv(feature.properties?.voltage);
      return {
        ...feature,
        properties: {
          ...(feature.properties ?? {}),
          voltageKv,
          voltageKvMax: voltageKv.length > 0 ? Math.max(...voltageKv) : null,
          voltageGroup: getGridVoltageGroup(voltageKv),
        },
      };
    }),
  };
}

export function filterGridFeatures(
  gridAssets: FeatureCollection | null,
  geometryType: string,
  voltages: string[],
): FeatureCollection {
  const targetVoltages = voltages.map(Number).filter(Number.isFinite);
  if (!gridAssets || targetVoltages.length === 0) return { type: 'FeatureCollection', features: [] };

  const acceptedGeometryTypes = geometryType === 'LineString'
    ? new Set(['LineString', 'MultiLineString'])
    : geometryType === 'Point'
      ? new Set(['Point', 'MultiPoint'])
      : new Set([geometryType]);

  const features = gridAssets.features.filter((feature) => (
    feature.geometry
    && acceptedGeometryTypes.has(feature.geometry.type)
    && normalizeGridVoltageKv(feature.properties?.voltage).some((voltage) => targetVoltages.includes(voltage))
  )) as Feature<Geometry>[];

  return normalizeGridVoltageFeatures({ type: 'FeatureCollection', features });
}
