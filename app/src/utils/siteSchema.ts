import type {
  CandidateSourceGroup,
  ConceptType,
  CoordinateConfidence,
  CycleType,
  GridSupplyType,
  InfrastructureType,
  Layout3DMaterial,
  PrimaryPurpose,
  Site,
} from '../types/site';

const SOURCE_GROUPS: readonly CandidateSourceGroup[] = [
  'JICA_EIE_16',
  'SEA_WATER_PROTOTYPE_TOP4',
];

const CYCLE_TYPES: readonly CycleType[] = [
  'OPEN_LOOP',
  'CLOSED_LOOP',
  'SEA_LOWER_RESERVOIR',
];

const INFRASTRUCTURE_TYPES: readonly InfrastructureType[] = [
  'PURE_NEW_BUILD',
  'MIXED_EXISTING_HYDRO_CASCADE',
  'EXISTING_RESERVOIR_INTEGRATED',
  'SEAWATER_COASTAL',
];

const CONCEPT_TYPES: readonly ConceptType[] = [
  'CONVENTIONAL_LAND',
  'SEAWATER',
  'VARIABLE_SPEED_OPTION',
  'HYBRID_RENEWABLE_OPTION',
];

const GRID_SUPPLY_TYPES: readonly GridSupplyType[] = [
  'GRID_SUPPORTED',
  'HYBRID_RENEWABLE_POTENTIAL',
  'OFFGRID_OR_ISLAND_PILOT',
];

const PRIMARY_PURPOSES: readonly PrimaryPurpose[] = [
  'PEAK_POWER',
  'ENERGY_STORAGE',
  'RENEWABLE_BALANCING',
  'ISLAND_GRID_RESILIENCE',
];

const COORDINATE_CONFIDENCES: readonly CoordinateConfidence[] = [
  'existing-data',
  'fallback-approximate',
  'agent-verified-dem',
  'official-or-surveyed',
];

const LAYOUT_3D_MATERIALS: readonly Layout3DMaterial[] = [
  'water',
  'embankment',
  'crest_road',
  'concrete',
  'tunnel_axis',
  'shaft',
  'portal',
  'industrial',
  'tailrace_channel',
  'switchyard',
];

const LEGACY_FIELDS = ['pdhesType', 'concept', 'conceptLabel', 'lat', 'lon'];

export interface SiteValidationResult {
  ok: boolean;
  sites: Site[];
  errors: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isNullableNumber(value: unknown): value is number | null | undefined {
  return value === null || value === undefined || isFiniteNumber(value);
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

function isBBox(value: unknown): value is [number, number, number, number] {
  return Array.isArray(value)
    && value.length === 4
    && value.every((item) => typeof item === 'number' && Number.isFinite(item))
    && value[0] >= -180
    && value[2] <= 180
    && value[1] >= -90
    && value[3] <= 90
    && value[0] < value[2]
    && value[1] < value[3];
}

function sameCoordinate(a: [number, number], b: [number, number]): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

function isCoordinateRing(value: unknown): value is [number, number][] {
  return Array.isArray(value)
    && value.length >= 4
    && value.every(isCoordinate)
    && sameCoordinate(value[0], value[value.length - 1]);
}

function isEnum<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value);
}

function validateTechnicalClassification(value: unknown, index: number): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return [`sites[${index}].technicalClassification nesne olmalıdır.`];
  if (!isEnum(value.cycleType, CYCLE_TYPES)) errors.push(`sites[${index}].technicalClassification.cycleType geçersiz.`);
  if (!isEnum(value.infrastructureType, INFRASTRUCTURE_TYPES)) errors.push(`sites[${index}].technicalClassification.infrastructureType geçersiz.`);
  if (!isEnum(value.conceptType, CONCEPT_TYPES)) errors.push(`sites[${index}].technicalClassification.conceptType geçersiz.`);
  if (!isEnum(value.gridSupplyType, GRID_SUPPLY_TYPES)) errors.push(`sites[${index}].technicalClassification.gridSupplyType geçersiz.`);
  if (!isEnum(value.primaryPurpose, PRIMARY_PURPOSES)) errors.push(`sites[${index}].technicalClassification.primaryPurpose geçersiz.`);
  if (!isString(value.classificationNote)) errors.push(`sites[${index}].technicalClassification.classificationNote boş olamaz.`);
  return errors;
}

function validateCoordinates(value: unknown, index: number): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return [`sites[${index}].coordinates nesne olmalıdır.`];
  if (value.coordinateSystem !== 'WGS84') errors.push(`sites[${index}].coordinates.coordinateSystem WGS84 olmalıdır.`);
  if (value.coordinateOrder !== '[lon, lat]') errors.push(`sites[${index}].coordinates.coordinateOrder [lon, lat] olmalıdır.`);
  if (!isEnum(value.coordinateConfidence, COORDINATE_CONFIDENCES)) errors.push(`sites[${index}].coordinates.coordinateConfidence geçersiz.`);
  if (!isString(value.coordinateNote)) errors.push(`sites[${index}].coordinates.coordinateNote boş olamaz.`);
  if (!isCoordinate(value.mapAnchor)) errors.push(`sites[${index}].coordinates.mapAnchor geçersiz.`);
  if (!isRecord(value.lowerReservoir) || !isString(value.lowerReservoir.name) || !isCoordinate(value.lowerReservoir.point)) {
    errors.push(`sites[${index}].coordinates.lowerReservoir geçersiz.`);
  }
  if (!isRecord(value.upperReservoir) || !isString(value.upperReservoir.description) || !isCoordinate(value.upperReservoir.point)) {
    errors.push(`sites[${index}].coordinates.upperReservoir geçersiz.`);
  }
  if (value.upperReservoirPolygon !== undefined && !isCoordinateRing(value.upperReservoirPolygon)) {
    errors.push(`sites[${index}].coordinates.upperReservoirPolygon kapalı koordinat poligonu olmalıdır.`);
  }
  if (!isRecord(value.powerhouse) || !isCoordinate(value.powerhouse.point) || !isString(value.powerhouse.preferred3dType)) {
    errors.push(`sites[${index}].coordinates.powerhouse geçersiz.`);
  }
  if (!isRecord(value.surgeTank) || !isCoordinate(value.surgeTank.point)) errors.push(`sites[${index}].coordinates.surgeTank geçersiz.`);
  if (value.servicePortal !== undefined) {
    if (!isRecord(value.servicePortal) || !isCoordinate(value.servicePortal.point)) {
      errors.push(`sites[${index}].coordinates.servicePortal geçersiz.`);
    }
  }
  if (!Array.isArray(value.penstockRoute) || value.penstockRoute.length < 2 || !value.penstockRoute.every(isCoordinate)) {
    errors.push(`sites[${index}].coordinates.penstockRoute geçersiz.`);
  }
  if (!isRecord(value.tailraceOutlet) || !isCoordinate(value.tailraceOutlet.point)) errors.push(`sites[${index}].coordinates.tailraceOutlet geçersiz.`);
  if (!isRecord(value.switchyard) || !isCoordinate(value.switchyard.point)) errors.push(`sites[${index}].coordinates.switchyard geçersiz.`);
  if (!isRecord(value.gridConnection) || !isCoordinate(value.gridConnection.point) || !isString(value.gridConnection.voltageClassHint)) {
    errors.push(`sites[${index}].coordinates.gridConnection geçersiz.`);
  }
  if (value.intakeOutfall !== null && value.intakeOutfall !== undefined) {
    if (!isRecord(value.intakeOutfall) || !isCoordinate(value.intakeOutfall.point) || !isString(value.intakeOutfall.description)) {
      errors.push(`sites[${index}].coordinates.intakeOutfall geçersiz.`);
    }
  }
  if (!isBBox(value.bbox)) errors.push(`sites[${index}].coordinates.bbox geçersiz.`);
  return errors;
}

function validateModel3d(value: unknown, index: number): string[] {
  if (!isRecord(value)) return [`sites[${index}].model3d nesne olmalıdır.`];
  const errors: string[] = [];
  if (value.terrainMode !== 'real-dem-if-available-else-procedural') errors.push(`sites[${index}].model3d.terrainMode geçersiz.`);
  if (!['existing-dam-lake', 'artificial-lower-pond', 'sea'].includes(String(value.lowerReservoirMode))) errors.push(`sites[${index}].model3d.lowerReservoirMode geçersiz.`);
  if (!['concrete-lined-pool', 'compacted-clay-pool', 'geomembrane-or-conceptual-pool'].includes(String(value.upperReservoirMode))) errors.push(`sites[${index}].model3d.upperReservoirMode geçersiz.`);
  if (!['underground-cavern', 'semi-underground-or-surface'].includes(String(value.powerhouseMode))) errors.push(`sites[${index}].model3d.powerhouseMode geçersiz.`);
  if (!['shaft-plus-pressure-tunnel', 'surface-or-buried-penstock', 'conceptual-waterway'].includes(String(value.penstockMode))) errors.push(`sites[${index}].model3d.penstockMode geçersiz.`);
  if (typeof value.showUncertaintyOverlay !== 'boolean') errors.push(`sites[${index}].model3d.showUncertaintyOverlay boolean olmalıdır.`);
  return errors;
}

function validateLayout(value: unknown, index: number): string[] {
  if (value === undefined) return [];
  if (!isRecord(value)) return [`sites[${index}].layout nesne olmalıdır.`];
  const errors: string[] = [];
  if (!isFiniteNumber(value.bearing)) errors.push(`sites[${index}].layout.bearing geçersiz.`);
  for (const key of ['upper', 'lower', 'power', 'surge', 'switchyard', 'gridA', 'gridB', 'risk']) {
    if (!isCoordinate(value[key])) errors.push(`sites[${index}].layout.${key} geçersiz.`);
  }
  if (value.gridTap !== undefined && !isCoordinate(value.gridTap)) errors.push(`sites[${index}].layout.gridTap geçersiz.`);
  if (value.servicePortal !== undefined && !isCoordinate(value.servicePortal)) errors.push(`sites[${index}].layout.servicePortal geçersiz.`);
  if (value.upperPolygon !== undefined && !isCoordinateRing(value.upperPolygon)) {
    errors.push(`sites[${index}].layout.upperPolygon kapalı koordinat poligonu olmalıdır.`);
  }
  return errors;
}

function validateLayout3D(value: unknown, index: number): string[] {
  if (value === undefined) return [];
  if (!isRecord(value)) return [`sites[${index}].layout3D nesne olmalıdır.`];
  const errors: string[] = [];
  if (value.scale !== 'macro') errors.push(`sites[${index}].layout3D.scale macro olmalıdır.`);
  if (!isFiniteNumber(value.preferredBearing)) errors.push(`sites[${index}].layout3D.preferredBearing geçersiz.`);
  if (!isFiniteNumber(value.terrainExaggeration)) errors.push(`sites[${index}].layout3D.terrainExaggeration geçersiz.`);
  if (value.reservoirSurfaceMode !== 'polygon') errors.push(`sites[${index}].layout3D.reservoirSurfaceMode polygon olmalıdır.`);
  if (typeof value.useFootprintPolygons !== 'boolean') errors.push(`sites[${index}].layout3D.useFootprintPolygons boolean olmalıdır.`);
  if (typeof value.hideLegacySquareReservoir !== 'boolean') errors.push(`sites[${index}].layout3D.hideLegacySquareReservoir boolean olmalıdır.`);
  if (!Array.isArray(value.componentFootprints) || value.componentFootprints.length === 0) {
    errors.push(`sites[${index}].layout3D.componentFootprints boş olmayan dizi olmalıdır.`);
    return errors;
  }

  value.componentFootprints.forEach((footprint, footprintIndex) => {
    const prefix = `sites[${index}].layout3D.componentFootprints[${footprintIndex}]`;
    if (!isRecord(footprint)) {
      errors.push(`${prefix} nesne olmalıdır.`);
      return;
    }
    if (!isString(footprint.id)) errors.push(`${prefix}.id boş olamaz.`);
    if (!isString(footprint.component)) errors.push(`${prefix}.component boş olamaz.`);
    if (!['polygon', 'polyline'].includes(String(footprint.kind))) errors.push(`${prefix}.kind geçersiz.`);
    if (!isEnum(footprint.material, LAYOUT_3D_MATERIALS)) errors.push(`${prefix}.material geçersiz.`);
    if (!Array.isArray(footprint.coords) || footprint.coords.length < 2 || !footprint.coords.every(isCoordinate)) {
      errors.push(`${prefix}.coords geçersiz.`);
    }
    if (footprint.kind === 'polygon' && !isCoordinateRing(footprint.coords)) {
      errors.push(`${prefix}.coords kapalı poligon olmalıdır.`);
    }
    if (footprint.profileElevationM !== undefined) {
      if (!Array.isArray(footprint.profileElevationM)
        || !footprint.profileElevationM.every(isFiniteNumber)
        || (Array.isArray(footprint.coords) && footprint.profileElevationM.length !== footprint.coords.length)) {
        errors.push(`${prefix}.profileElevationM koordinat sayısıyla uyumlu olmalıdır.`);
      }
    }
    for (const key of ['baseElevationM', 'topElevationM', 'extrudeM', 'elevationM']) {
      if (footprint[key] !== undefined && !isFiniteNumber(footprint[key])) errors.push(`${prefix}.${key} geçersiz.`);
    }
  });
  return errors;
}

function validateSiteRecord(value: unknown, index: number): { site: Site | null; errors: string[] } {
  if (!isRecord(value)) {
    return { site: null, errors: [`sites[${index}] bir nesne olmalıdır.`] };
  }

  const errors: string[] = [];
  for (const field of LEGACY_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(value, field)) {
      errors.push(`sites[${index}].${field} eski ${field} alanı kullanılmamalıdır.`);
    }
  }

  if (!isString(value.id)) errors.push(`sites[${index}].id boş olamaz.`);
  if (!isString(value.name)) errors.push(`sites[${index}].name boş olamaz.`);
  if (!isString(value.province)) errors.push(`sites[${index}].province boş olamaz.`);
  if (value.country !== 'Türkiye') errors.push(`sites[${index}].country Türkiye olmalıdır.`);
  if (!isEnum(value.sourceGroup, SOURCE_GROUPS)) errors.push(`sites[${index}].sourceGroup geçersiz.`);
  if (!isString(value.sourceNote)) errors.push(`sites[${index}].sourceNote boş olamaz.`);
  if (!Number.isInteger(value.order) || Number(value.order) < 1) errors.push(`sites[${index}].order pozitif tam sayı olmalıdır.`);

  if (!isFiniteNumber(value.capacityMW) || value.capacityMW <= 0) errors.push(`sites[${index}].capacityMW pozitif sayı olmalıdır.`);
  for (const key of [
    'projectFlowCms',
    'headM',
    'energyGWh',
    'activeVolumeHm3',
    'tunnelLengthKm',
    'capexUsdBn',
    'annualRevenueUsdM',
    'paybackYear',
    'score',
    'shaftLengthM',
    'penstockLengthM',
    'tailraceTunnelLengthM',
  ]) {
    if (!isNullableNumber(value[key])) errors.push(`sites[${index}].${key} sayı veya null olmalıdır.`);
  }
  if (!isString(value.lowerReservoirName)) errors.push(`sites[${index}].lowerReservoirName boş olamaz.`);
  if (!isString(value.upperReservoirDescription)) errors.push(`sites[${index}].upperReservoirDescription boş olamaz.`);
  if (!Array.isArray(value.risks) || !value.risks.every(isString)) errors.push(`sites[${index}].risks metin dizisi olmalıdır.`);
  if (!Array.isArray(value.assumptions) || !value.assumptions.every(isString)) errors.push(`sites[${index}].assumptions metin dizisi olmalıdır.`);

  errors.push(...validateTechnicalClassification(value.technicalClassification, index));
  errors.push(...validateCoordinates(value.coordinates, index));
  errors.push(...validateModel3d(value.model3d, index));
  errors.push(...validateLayout(value.layout, index));
  errors.push(...validateLayout3D(value.layout3D, index));

  if (errors.length > 0) return { site: null, errors };

  return {
    site: {
      ...(value as unknown as Site),
      id: String(value.id).trim(),
      name: String(value.name).trim(),
      province: String(value.province).trim(),
      sourceNote: String(value.sourceNote).trim(),
      lowerReservoirName: String(value.lowerReservoirName).trim(),
      upperReservoirDescription: String(value.upperReservoirDescription).trim(),
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
