import type {
  PdhesType,
  ComponentsDetail,
  ConceptType,
  CoordinateConfidence,
  CycleType,
  GridSupplyType,
  InfrastructureType,
  PrimaryPurpose,
  Site,
  SiteLayout,
  SiteView,
} from '../types/site';

export const PDHES_TYPE_LABELS: Record<PdhesType, string> = {
  OPEN_LOOP: 'Açık Çevrim PDHES',
  CLOSED_LOOP: 'Kapalı Çevrim PDHES',
  SEA_WATER: 'Deniz Suyu PDHES',
  HYBRID: 'Hibrit (Şebeke Desteksiz) PDHES',
  MIXED: 'Karışık PDHES',
};

export const CYCLE_TYPE_LABELS: Record<CycleType, string> = {
  OPEN_LOOP: 'Açık döngü',
  CLOSED_LOOP: 'Kapalı döngü',
  SEA_LOWER_RESERVOIR: 'Deniz alt rezervuarlı',
};

export const INFRASTRUCTURE_TYPE_LABELS: Record<InfrastructureType, string> = {
  PURE_NEW_BUILD: 'Tamamen yeni / saf',
  MIXED_EXISTING_HYDRO_CASCADE: 'Mevcut HES kaskadı entegrasyonu',
  EXISTING_RESERVOIR_INTEGRATED: 'Mevcut rezervuar entegre',
  SEAWATER_COASTAL: 'Kıyı / deniz suyu',
};

export const CONCEPT_TYPE_LABELS: Record<ConceptType, string> = {
  CONVENTIONAL_LAND: 'Geleneksel kara tipi',
  SEAWATER: 'Deniz suyu',
  VARIABLE_SPEED_OPTION: 'Değişken hızlı seçenek',
  HYBRID_RENEWABLE_OPTION: 'Hibrit yenilenebilir seçenek',
};

export const GRID_SUPPLY_TYPE_LABELS: Record<GridSupplyType, string> = {
  GRID_SUPPORTED: 'Şebeke destekli',
  HYBRID_RENEWABLE_POTENTIAL: 'Hibrit yenilenebilir potansiyelli',
  OFFGRID_OR_ISLAND_PILOT: 'Ada / mikro şebeke pilotu',
};

export const PRIMARY_PURPOSE_LABELS: Record<PrimaryPurpose, string> = {
  PEAK_POWER: 'Pik güç santrali',
  ENERGY_STORAGE: 'Enerji depolama santrali',
  RENEWABLE_BALANCING: 'Yenilenebilir dengeleme',
  ISLAND_GRID_RESILIENCE: 'Ada şebeke dayanıklılığı',
};

export const COORDINATE_CONFIDENCE_LABELS: Record<CoordinateConfidence, string> = {
  'existing-data': 'Mevcut veri',
  'fallback-approximate': 'Fallback yaklaşık',
  'agent-verified-dem': 'DEM doğrulanmış',
  'official-or-surveyed': 'Resmi / ölçülmüş',
};

export const PDHES_TYPE_COLORS: Record<PdhesType, string> = {
  OPEN_LOOP: '#3d7dff',
  CLOSED_LOOP: '#36d6ff',
  SEA_WATER: '#36d6ff',
  HYBRID: '#ff9800',
  MIXED: '#48f49a',
};

export function isSeaLowerReservoir(site: Site): boolean {
  return site.technicalClassification.cycleType === 'SEA_LOWER_RESERVOIR';
}

export function getSiteColor(site: Site): string {
  if (site.pdhesType === 'SEA_WATER') return PDHES_TYPE_COLORS.SEA_WATER;
  if (site.technicalClassification.infrastructureType === 'PURE_NEW_BUILD') return '#48f49a';
  return PDHES_TYPE_COLORS.OPEN_LOOP;
}

export function getSiteCenter(site: Site): [number, number] {
  return site.coordinates.powerhouse?.point ?? site.coordinates.mapAnchor;
}

export function getSiteView(site: Site): SiteView {
  return site.view ?? {
    center: getSiteCenter(site),
    zoom: site.pdhesType === 'SEA_WATER' ? 12 : 13.5,
    pitch: 55,
    bearing: 0,
  };
}

export function getSiteLayout(site: Site): SiteLayout {
  if (site.layout) return site.layout;

  const coords = site.coordinates;
  const gridTap = coords.gridConnection.point;
  return {
    bearing: 0,
    upper: coords.upperReservoir.point,
    lower: coords.lowerReservoir.point,
    power: coords.powerhouse.point,
    surge: coords.surgeTank.point,
    switchyard: coords.switchyard.point,
    gridA: [gridTap[0] - 0.02, gridTap[1] - 0.015],
    gridB: [gridTap[0] + 0.02, gridTap[1] + 0.015],
    risk: coords.mapAnchor,
    gridTap,
  };
}

export function buildComponentsDetail(site: Site): ComponentsDetail {
  if (site.components_detail) return site.components_detail;

  const hasExcel = !!site.excelCalculated;
  const isSea = isSeaLowerReservoir(site);
  const activeMcm = site.activeVolumeHm3 ?? (hasExcel ? site.excelCalculated!.upperActiveVolumeHm3 : null) ?? 10;
  const head = site.excelCalculated?.netHeadM ?? site.headM ?? 300;
  
  const lowerElevation = site.excelCalculated?.lowerReservoirElevationM ?? 150;
  const upperElevation = site.excelCalculated?.upperReservoirElevationM ?? Math.round(lowerElevation + head);

  const lengthM = site.penstockLengthM ?? Math.round((site.tunnelLengthKm ?? 1.5) * 1000);
  const units = site.capacityMW >= 1000 ? 4 : site.capacityMW >= 500 ? 2 : 1;
  const voltage = site.capacityMW >= 1000 ? 380 : 154;
  return {
    upper_reservoir: {
      elevation_m: upperElevation,
      active_volume_mcm: activeMcm,
      dam_height_m: Math.max(18, Math.round(Math.min(80, head / 10))),
      lining: site.model3d.upperReservoirMode === 'compacted-clay-pool'
        ? 'Sıkıştırılmış kil / geomembran seçeneği'
        : site.model3d.upperReservoirMode === 'concrete-lined-pool'
          ? 'Beton kaplamalı kavramsal havuz'
          : 'Kavramsal kaplamalı üst rezervuar',
      geology_note: 'Jeoloji ve sızdırmazlık saha etüdüyle doğrulanmalıdır.',
    },
    lower_reservoir: {
      elevation_m: lowerElevation,
      min_level_m: isSea ? 0 : Math.max(0, lowerElevation - 10),
      note: site.lowerReservoirName,
    },
    penstock: {
      diameter_m: Math.max(3, Math.min(8, Math.sqrt(site.capacityMW / 100))),
      length_m: lengthM,
      material: isSea ? 'Korozyon dayanımlı kaplamalı çelik' : 'Çelik kaplı basınçlı su yolu',
      pressure_class: `${Math.round(head / 10)} bar mertebesi ön kabul`,
      count: units,
    },
    powerhouse: {
      cavern_width_m: site.model3d.powerhouseMode === 'underground-cavern' ? 28 : 20,
      cavern_length_m: Math.max(80, units * 45),
      cavern_height_m: site.model3d.powerhouseMode === 'underground-cavern' ? 45 : 28,
      units,
      turbine_type: 'Tersinir Francis pompa-türbin ön kabulü',
    },
    surge_tank: {
      type: site.shaftLengthM ? 'Şaft bağlantılı denge bacası' : 'Kavramsal denge bacası',
      height_m: Math.max(40, Math.round(head / 5)),
      diameter_m: 10,
    },
    switchyard: {
      voltage_kv: voltage,
      transformer_count: units,
      connection_line_km: 1,
    },
    tunnel: {
      length_m: lengthM,
      diameter_m: Math.max(4, Math.min(9, Math.sqrt(site.capacityMW / 80))),
      excavation_type: site.model3d.penstockMode === 'conceptual-waterway'
        ? 'Kavramsal su yolu; kaynakta uzunluk detayı yok'
        : 'Şaft + basınç tüneli ön kabulü',
    },
    intake_outfall: isSea ? {
      type: 'Deniz intake/outfall',
      corrosion_control: 'Korozyon, biofouling ve sızdırmazlık doğrulaması gerekir.',
      note: site.coordinates.intakeOutfall?.description ?? 'Deniz alım/deşarj yapısı',
    } : null,
  };
}
