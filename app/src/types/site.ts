export interface Coordinates {
  mapAnchor: [number, number];
  lowerReservoir: [number, number];
  upperReservoir: [number, number];
  powerhouse: [number, number];
  surgeTank: [number, number];
  switchyard: [number, number];
  gridConnection: [number, number];
  intakeOutfall: [number, number] | null;
  bbox: [[number, number], [number, number]];
}

export interface SiteLayout {
  bearing: number;
  upper: [number, number];
  lower: [number, number];
  power: [number, number];
  surge: [number, number];
  switchyard: [number, number];
  gridA: [number, number];
  gridB: [number, number];
  risk: [number, number];
  gridTap?: [number, number];
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

export interface LocationEvidence {
  field: string;
  sourceName: string;
  sourceType: string;
  sourceUrl: string;
  method: string;
  confidence: string;
  note: string;
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

export type PdhesType = 'MUSTAKIL_PDHES' | 'YARI_PDHES' | 'MAKRO_DENIZ_PDHES' | 'MIKRO_DENIZ_PDHES';
export type Concept = 'classic' | 'sea';
export type CapacityClass = 'macro' | 'micro' | 'medium';
export type TechnologyReadiness = 'concept' | 'pre_feasibility' | 'feasibility';
export type Confidence = 'reference_based' | 'gis_inferred' | 'dem_inferred';
export type LocationConfidenceLevel = 'high' | 'medium' | 'low';

export interface Site {
  id: string;
  name: string;
  concept: Concept;
  conceptLabel: string;
  lat: number;
  lon: number;
  region: string;
  score: number;
  head: number;
  tunnelKm: number;
  activeMcm: number;
  powerMW: number;
  energyGWh: number;
  capexBn: number;
  revenueM: number;
  payback: number;
  gridDistKm: number;
  lower: string;
  upper: string;
  thesis: string;
  risks: string[];
  scores: Scores;
  view: SiteView;
  color: string;
  layout: SiteLayout;
  timeline: TimelineEvent[];
  pdhesType: PdhesType;
  province: string;
  locationConfidence: LocationConfidenceLevel;
  isApproximate: boolean;
  confidence: Confidence;
  technologyReadiness: TechnologyReadiness;
  coordinates: Coordinates;
  evidence: string[];
  note: string;
  capacityClass: CapacityClass;
  lowerReservoirType: string;
  upperReservoirType: string;
  oldCoordinates?: [number, number];
  verifiedAt: string;
  verificationNotes: string;
  locationEvidence: LocationEvidence[];
  layout3D: { scale: string; preferredBearing: number; componentFootprints: unknown[] };
  components_detail: ComponentsDetail;
  gridConnection?: GridConnection;
  nearest380Km?: number;
  nearest154Km?: number;
  nearestSubstation?: { name: string; voltage_kv: number; coord: [number, number]; distance_km: number };
  nMinusOneNote?: string;
}

export interface ComponentDef {
  key: string;
  label: string;
  color: string;
}

export interface WorldExample {
  name: string;
  country: string;
  mw: number;
  head: number;
  type: string;
  year?: number;
  description?: string;
}
