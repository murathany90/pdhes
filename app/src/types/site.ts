import type { PdhesCandidateExcelCalculatedData } from '../utils/pdhes/types';

export type PdhesType =
  | 'OPEN_LOOP'
  | 'CLOSED_LOOP'
  | 'SEA_WATER'
  | 'HYBRID'
  | 'MIXED';

export type CycleType =
  | 'OPEN_LOOP'
  | 'CLOSED_LOOP'
  | 'SEA_LOWER_RESERVOIR';

export type InfrastructureType =
  | 'PURE_NEW_BUILD'
  | 'MIXED_EXISTING_HYDRO_CASCADE'
  | 'EXISTING_RESERVOIR_INTEGRATED'
  | 'SEAWATER_COASTAL';

export type ConceptType =
  | 'CONVENTIONAL_LAND'
  | 'SEAWATER'
  | 'VARIABLE_SPEED_OPTION'
  | 'HYBRID_RENEWABLE_OPTION';

export type GridSupplyType =
  | 'GRID_SUPPORTED'
  | 'HYBRID_RENEWABLE_POTENTIAL'
  | 'OFFGRID_OR_ISLAND_PILOT';

export type PrimaryPurpose =
  | 'PEAK_POWER'
  | 'ENERGY_STORAGE'
  | 'RENEWABLE_BALANCING'
  | 'ISLAND_GRID_RESILIENCE';

export type CoordinateConfidence =
  | 'existing-data'
  | 'fallback-approximate'
  | 'agent-verified-dem'
  | 'official-or-surveyed';

export interface TechnicalClassification {
  cycleType: CycleType;
  infrastructureType: InfrastructureType;
  conceptType: ConceptType;
  gridSupplyType: GridSupplyType;
  primaryPurpose: PrimaryPurpose;
  classificationNote: string;
}

export interface PdhCoordinateSet {
  coordinateSystem: 'WGS84';
  coordinateOrder: '[lon, lat]';
  coordinateConfidence: CoordinateConfidence;
  coordinateNote: string;
  mapAnchor: [number, number];
  lowerReservoir: { name: string; point: [number, number] };
  upperReservoir: { description: string; point: [number, number] };
  upperReservoirPolygon?: [number, number][];
  lowerReservoirPolygon?: [number, number][];
  powerhouse: { point: [number, number]; preferred3dType: string };
  surgeTank: { point: [number, number] };
  servicePortal?: { point: [number, number] };
  penstockRoute: [number, number][];
  tailraceOutlet: { point: [number, number] };
  switchyard: { point: [number, number] };
  existingSwitchyard?: { point: [number, number] };
  newSwitchyard?: { point: [number, number] };
  gridConnection: { point: [number, number]; voltageClassHint: string };
  transmissionLineRoute?: [number, number][];
  intakeOutfall?: { point: [number, number]; description: string } | null;
  bbox: [number, number, number, number];
}

export interface Pdh3dModelSpec {
  terrainMode: 'real-dem-if-available-else-procedural';
  lowerReservoirMode: 'existing-dam-lake' | 'artificial-lower-pond' | 'sea';
  upperReservoirMode: 'concrete-lined-pool' | 'compacted-clay-pool' | 'geomembrane-or-conceptual-pool';
  powerhouseMode: 'underground-cavern' | 'semi-underground-or-surface';
  penstockMode: 'shaft-plus-pressure-tunnel' | 'surface-or-buried-penstock' | 'conceptual-waterway';
  showUncertaintyOverlay: boolean;
}

export interface SiteView {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
}

export interface TimelineEvent {
  date: string;
  title: string;
  text: string;
}

export interface Scores {
  topo: number;
  grid: number;
  env: number;
  geology: number;
  access: number;
  market: number;
}

export interface ComponentsDetail {
  upper_reservoir: {
    elevation_m: number;
    active_volume_mcm: number;
    dam_height_m: number;
    lining: string;
    geology_note: string;
    shape_note?: string;
    render_mode?: 'polygon_footprint';
  };
  lower_reservoir: {
    elevation_m: number;
    min_level_m: number;
    note: string;
  };
  penstock: {
    diameter_m: number;
    length_m: number;
    material: string;
    pressure_class: string;
    count: number;
  };
  powerhouse: {
    cavern_width_m: number;
    cavern_length_m: number;
    cavern_height_m: number;
    units: number;
    turbine_type: string;
  };
  surge_tank: {
    type: string;
    height_m: number;
    diameter_m: number;
  };
  switchyard: {
    voltage_kv: number;
    transformer_count: number;
    connection_line_km: number;
  };
  tunnel: {
    length_m: number;
    diameter_m: number;
    excavation_type: string;
  };
  intake_outfall?: {
    type: string;
    corrosion_control: string;
    note: string;
  } | null;
}

export interface GridConnection {
  preferredVoltageKv: number;
  preferredLineName: string;
  preferredLineDistanceKm: number;
  tapCoord: [number, number];
  lineSegment: [[number, number], [number, number]];
  nearest380: { lineName: string; distanceKm: number; tapCoord: [number, number] };
  nearest154: { lineName: string; distanceKm: number; tapCoord: [number, number] };
}

export interface Site {
  id: string;
  name: string;
  province: string;
  country: 'Türkiye';
  pdhesType: PdhesType;
  sourceNote: string;
  order: number;

  canonical?: {
    capacityMW: number;
    headM: number | null;
  };
  source?: {
    capacityMW: number;
    headM: number | null;
    sourceNote?: string;
    confidence?: string;
  };
  capacityMW: number;
  projectFlowCms: number | null;
  headM: number | null;
  energyGWh?: number | null;
  activeVolumeHm3?: number | null;
  tunnelLengthKm?: number | null;
  capexUsdBn?: number | null;
  annualRevenueUsdM?: number | null;
  paybackYear?: number | null;
  score?: number | null;
  excelCalculated?: PdhesCandidateExcelCalculatedData;

  lowerReservoirName: string;
  upperReservoirDescription: string;
  shaftLengthM?: number | null;
  penstockLengthM?: number | null;
  tailraceTunnelLengthM?: number | null;
  totalWaterwayLengthM?: number | null;

  technicalClassification: TechnicalClassification;
  coordinates: PdhCoordinateSet;
  risks: string[];
  assumptions: string[];
  model3d: Pdh3dModelSpec;
  components_detail?: ComponentsDetail;

  thesis?: string;
  note?: string;
  verificationNotes?: string;
  timeline?: TimelineEvent[];
  evidence?: string[];
  view?: SiteView;
  layout?: SiteLayout;
  layout3D?: Layout3DSpec;
  color?: string;
  gridConnection?: GridConnection;
}

export interface ComponentDef {
  key: string;
  label: string;
  color: string;
  description?: string;
}

export interface SiteLayout {
  bearing: number;
  upper: [number, number];
  upperPolygon?: [number, number][];
  lower: [number, number];
  power: [number, number];
  surge: [number, number];
  servicePortal?: [number, number];
  switchyard: [number, number];
  gridA: [number, number];
  gridB: [number, number];
  risk: [number, number];
  gridTap?: [number, number];
}

export type Layout3DFootprintKind = 'polygon' | 'polyline';

export type Layout3DMaterial =
  | 'water'
  | 'embankment'
  | 'crest_road'
  | 'concrete'
  | 'tunnel_axis'
  | 'shaft'
  | 'portal'
  | 'industrial'
  | 'tailrace_channel'
  | 'switchyard'
  | 'switchyard_existing'
  | 'switchyard_new';

export interface Layout3DFootprint {
  id: string;
  component: string;
  kind: Layout3DFootprintKind;
  material: Layout3DMaterial;
  closed?: boolean;
  coords: [number, number][];
  baseElevationM?: number;
  topElevationM?: number;
  extrudeM?: number;
  elevationM?: number;
  profileElevationM?: number[];
}

export interface Layout3DSpec {
  scale: 'macro' | 'local';
  preferredBearing: number;
  terrainExaggeration: number;
  reservoirSurfaceMode: 'polygon' | 'circle';
  useFootprintPolygons: boolean;
  hideLegacySquareReservoir: boolean;
  renderLowerReservoirAsPolygon?: boolean;
  renderUpperReservoirAsPolygon?: boolean;
  renderPenstocksAsParallelArray?: boolean;
  componentFootprints?: Layout3DFootprint[];
}

export type { WorldExample } from '../data/worldExamples';
