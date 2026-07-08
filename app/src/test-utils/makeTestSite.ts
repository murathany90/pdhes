import type { Pdh3dModelSpec, PdhCoordinateSet, Site, TechnicalClassification } from '../types/site';

type CoordinateOverrides = Partial<Omit<PdhCoordinateSet, 'lowerReservoir' | 'upperReservoir' | 'powerhouse' | 'surgeTank' | 'tailraceOutlet' | 'switchyard' | 'gridConnection'>> & {
  lowerReservoir?: Partial<PdhCoordinateSet['lowerReservoir']>;
  upperReservoir?: Partial<PdhCoordinateSet['upperReservoir']>;
  powerhouse?: Partial<PdhCoordinateSet['powerhouse']>;
  surgeTank?: Partial<PdhCoordinateSet['surgeTank']>;
  tailraceOutlet?: Partial<PdhCoordinateSet['tailraceOutlet']>;
  switchyard?: Partial<PdhCoordinateSet['switchyard']>;
  gridConnection?: Partial<PdhCoordinateSet['gridConnection']>;
};

type TestSiteOverrides = Partial<Omit<Site, 'technicalClassification' | 'coordinates' | 'model3d'>> & {
  technicalClassification?: Partial<TechnicalClassification>;
  coordinates?: CoordinateOverrides;
  model3d?: Partial<Pdh3dModelSpec>;
};

export function makeTestSite(overrides: TestSiteOverrides = {}): Site {
  const baseClassification: TechnicalClassification = {
    cycleType: 'OPEN_LOOP',
    infrastructureType: 'EXISTING_RESERVOIR_INTEGRATED',
    conceptType: 'CONVENTIONAL_LAND',
    gridSupplyType: 'GRID_SUPPORTED',
    primaryPurpose: 'PEAK_POWER',
    classificationNote: 'Test siniflandirmasi',
  };

  const baseCoordinates: PdhCoordinateSet = {
    coordinateSystem: 'WGS84',
    coordinateOrder: '[lon, lat]',
    coordinateConfidence: 'fallback-approximate',
    coordinateNote: 'Yaklasik test koordinati',
    mapAnchor: [32, 40],
    lowerReservoir: { name: 'Alt rezervuar', point: [32, 40] },
    upperReservoir: { description: 'Ust rezervuar', point: [32.05, 40.05] },
    powerhouse: { point: [32.01, 40.01], preferred3dType: 'underground-cavern' },
    surgeTank: { point: [32.02, 40.02] },
    penstockRoute: [[32.05, 40.05], [32.02, 40.02], [32.01, 40.01]],
    tailraceOutlet: { point: [32.005, 40.005] },
    switchyard: { point: [32.03, 40.01] },
    gridConnection: { point: [32.04, 40.02], voltageClassHint: '154/380 kV' },
    intakeOutfall: null,
    bbox: [31.95, 39.95, 32.08, 40.08],
  };

  const baseModel3d: Pdh3dModelSpec = {
    terrainMode: 'real-dem-if-available-else-procedural',
    lowerReservoirMode: 'existing-dam-lake',
    upperReservoirMode: 'concrete-lined-pool',
    powerhouseMode: 'underground-cavern',
    penstockMode: 'shaft-plus-pressure-tunnel',
    showUncertaintyOverlay: true,
  };

  const site: Site = {
    id: 'test-site',
    name: 'Test PDHES',
    province: 'Ankara',
    country: 'Türkiye',
    sourceGroup: 'JICA_EIE_16',
    sourceNote: 'JICA/EIE test kaydi',
    order: 1,
    capacityMW: 1000,
    projectFlowCms: 270,
    headM: 434,
    energyGWh: 8,
    activeVolumeHm3: null,
    tunnelLengthKm: 1.4,
    capexUsdBn: 2,
    annualRevenueUsdM: 200,
    paybackYear: 10,
    score: 75,
    lowerReservoirName: 'Alt rezervuar',
    upperReservoirDescription: 'Ust rezervuar',
    technicalClassification: baseClassification,
    coordinates: baseCoordinates,
    risks: ['Jeoloji'],
    assumptions: ['Aktif hacim kaynakta yok; senaryo varsayimi kullanilir.'],
    model3d: baseModel3d,
    thesis: 'Test aciklamasi',
    timeline: [],
  };

  const coordinateOverrides = overrides.coordinates ?? {};
  return {
    ...site,
    ...overrides,
    technicalClassification: {
      ...site.technicalClassification,
      ...overrides.technicalClassification,
    },
    coordinates: {
      ...site.coordinates,
      ...coordinateOverrides,
      lowerReservoir: { ...site.coordinates.lowerReservoir, ...coordinateOverrides.lowerReservoir },
      upperReservoir: { ...site.coordinates.upperReservoir, ...coordinateOverrides.upperReservoir },
      powerhouse: { ...site.coordinates.powerhouse, ...coordinateOverrides.powerhouse },
      surgeTank: { ...site.coordinates.surgeTank, ...coordinateOverrides.surgeTank },
      tailraceOutlet: { ...site.coordinates.tailraceOutlet, ...coordinateOverrides.tailraceOutlet },
      switchyard: { ...site.coordinates.switchyard, ...coordinateOverrides.switchyard },
      gridConnection: { ...site.coordinates.gridConnection, ...coordinateOverrides.gridConnection },
    },
    model3d: {
      ...site.model3d,
      ...overrides.model3d,
    },
  };
}
