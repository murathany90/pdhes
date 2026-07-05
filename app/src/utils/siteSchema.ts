import type { PdhesType, Site } from '../types/site';

const CANONICAL_TYPES: readonly PdhesType[] = [
  'CLOSED_LOOP',
  'OPEN_LOOP',
  'SEA_WATER',
  'PROTOTYPE',
];

const LEGACY_TYPE_MAP: Record<string, PdhesType> = {
  MUSTAKIL_PDHES: 'CLOSED_LOOP',
  YARI_PDHES: 'OPEN_LOOP',
  MAKRO_DENIZ_PDHES: 'SEA_WATER',
  MIKRO_DENIZ_PDHES: 'PROTOTYPE',
};

const REQUIRED_NUMBERS: Array<keyof Site> = [
  'lat',
  'lon',
  'score',
  'head',
  'tunnelKm',
  'activeMcm',
  'powerMW',
  'energyGWh',
  'capexBn',
  'revenueM',
  'payback',
  'gridDistKm',
];

export interface SiteValidationResult {
  ok: boolean;
  sites: Site[];
  errors: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCoordinate(value: unknown): value is [number, number] {
  return Array.isArray(value)
    && value.length === 2
    && Number.isFinite(value[0])
    && Number.isFinite(value[1])
    && value[0] >= -180
    && value[0] <= 180
    && value[1] >= -90
    && value[1] <= 90;
}

function buildCoordinates(
  value: Record<string, unknown>,
  mapAnchor: [number, number],
): Site['coordinates'] | null {
  const coordinates = isRecord(value.coordinates) ? value.coordinates : {};
  const layout = isRecord(value.layout) ? value.layout : {};
  const upperReservoir = isCoordinate(coordinates.upperReservoir)
    ? coordinates.upperReservoir
    : isCoordinate(layout.upper) ? layout.upper : null;
  const lowerReservoir = isCoordinate(coordinates.lowerReservoir)
    ? coordinates.lowerReservoir
    : isCoordinate(layout.lower) ? layout.lower : null;
  const powerhouse = isCoordinate(coordinates.powerhouse)
    ? coordinates.powerhouse
    : isCoordinate(layout.power) ? layout.power : null;
  const surgeTank = isCoordinate(coordinates.surgeTank)
    ? coordinates.surgeTank
    : isCoordinate(layout.surge) ? layout.surge : null;
  const switchyard = isCoordinate(coordinates.switchyard)
    ? coordinates.switchyard
    : isCoordinate(layout.switchyard) ? layout.switchyard : null;
  const gridConnection = isCoordinate(coordinates.gridConnection)
    ? coordinates.gridConnection
    : isCoordinate(layout.gridTap) ? layout.gridTap : switchyard;

  if (!upperReservoir || !lowerReservoir || !powerhouse || !surgeTank || !switchyard || !gridConnection) {
    return null;
  }

  const bbox = Array.isArray(coordinates.bbox)
    && coordinates.bbox.length === 2
    && isCoordinate(coordinates.bbox[0])
    && isCoordinate(coordinates.bbox[1])
    ? coordinates.bbox as [[number, number], [number, number]]
    : [
        [mapAnchor[0] - 0.05, mapAnchor[1] - 0.05],
        [mapAnchor[0] + 0.05, mapAnchor[1] + 0.05],
      ] as [[number, number], [number, number]];

  return {
    mapAnchor,
    lowerReservoir,
    upperReservoir,
    powerhouse,
    surgeTank,
    switchyard,
    gridConnection,
    intakeOutfall: isCoordinate(coordinates.intakeOutfall) ? coordinates.intakeOutfall : null,
    bbox,
  };
}

export function normalizePdhesType(value: unknown): PdhesType | null {
  if (typeof value !== 'string') return null;
  if ((CANONICAL_TYPES as readonly string[]).includes(value)) return value as PdhesType;
  return LEGACY_TYPE_MAP[value] ?? null;
}

function validateSiteRecord(value: unknown, index: number): { site: Site | null; errors: string[] } {
  if (!isRecord(value)) {
    return { site: null, errors: [`sites[${index}] bir nesne olmalıdır.`] };
  }

  const errors: string[] = [];
  const id = typeof value.id === 'string' ? value.id.trim() : '';
  const name = typeof value.name === 'string' ? value.name.trim() : '';
  const pdhesType = normalizePdhesType(value.pdhesType);
  const fallbackMapAnchor: [number, number] | null = Number.isFinite(value.lon) && Number.isFinite(value.lat)
    ? [Number(value.lon), Number(value.lat)]
    : null;
  const mapAnchor = isRecord(value.coordinates) && isCoordinate(value.coordinates.mapAnchor)
    ? value.coordinates.mapAnchor
    : fallbackMapAnchor;
  const normalizedCoordinates = mapAnchor ? buildCoordinates(value, mapAnchor) : null;

  if (!id) errors.push(`sites[${index}].id boş olamaz.`);
  if (!name) errors.push(`sites[${index}].name boş olamaz.`);
  if (!pdhesType) errors.push(`sites[${index}].pdhesType geçersiz.`);

  for (const key of REQUIRED_NUMBERS) {
    if (!Number.isFinite(value[key])) {
      errors.push(`sites[${index}].${String(key)} sonlu bir sayı olmalıdır.`);
    }
  }

  if (!normalizedCoordinates) {
    errors.push(`sites[${index}].coordinates.mapAnchor geçersiz.`);
  }

  if (!isRecord(value.layout) || !isCoordinate(value.layout.upper) || !isCoordinate(value.layout.lower)) {
    errors.push(`sites[${index}].layout üst/alt koordinatları geçersiz.`);
  }

  if (errors.length > 0 || !pdhesType || !normalizedCoordinates) {
    return { site: null, errors };
  }

  return {
    site: {
      ...(value as unknown as Site),
      id,
      name,
      pdhesType,
      coordinates: normalizedCoordinates,
    },
    errors,
  };
}

export function validateSites(value: unknown): SiteValidationResult {
  if (!Array.isArray(value)) {
    return { ok: false, sites: [], errors: ['Saha verisi bir dizi olmalıdır.'] };
  }

  const sites: Site[] = [];
  const errors: string[] = [];
  const ids = new Set<string>();

  value.forEach((record, index) => {
    const result = validateSiteRecord(record, index);
    errors.push(...result.errors);
    if (!result.site) return;
    if (ids.has(result.site.id)) {
      errors.push(`Saha kimliği tekrar ediyor: ${result.site.id}`);
      return;
    }
    ids.add(result.site.id);
    sites.push(result.site);
  });

  return {
    ok: errors.length === 0,
    sites,
    errors,
  };
}
