import type { Feature, LineString, Polygon, Point, MultiLineString } from 'geojson';
import type { Layout3DMaterial } from './site';

export type ManualGeometryType = 'LineString' | 'MultiLineString' | 'Polygon' | 'Point';

export type ManualFeatureType = 
  | 'distance'
  | 'existing_dam_embankment'
  | 'lower_reservoir'
  | 'sea_boundary'
  | 'upper_reservoir'
  | 'upper_reservoir_embankment'
  | 'powerhouse'
  | 'existing_switchyard'
  | 'new_switchyard'
  | 'penstock_tunnel_axis'
  | 'intake_structure'
  | 'tailrace_outfall'
  | 'surge_tank'
  | 'service_drainage_portal';

export interface ManualGeometryProperties {
  siteId: string;
  siteName: string;
  featureType: ManualFeatureType;
  displayName: string;
  geometryType: ManualGeometryType;
  material: Layout3DMaterial | 'none' | 'penstock_axis';
  role: string;
  source: 'manual_map_drawing';
  confidence: string;
  lengthM?: number;
  areaM2?: number;
  perimeterM?: number;
  minElevationM?: number;
  maxElevationM?: number;
  meanElevationM?: number;
  slopePercent?: number;
  headCompatibilityWarning?: string;
  createdAt: string;
  notes?: string;
}

export type ManualGeometryFeature = Feature<
  LineString | MultiLineString | Polygon | Point,
  ManualGeometryProperties
>;

export const MANUAL_FEATURE_TYPES: Record<ManualFeatureType, {
  label: string;
  requiredGeometry: 'polygon' | 'line' | 'point';
  material: Layout3DMaterial | 'none' | 'penstock_axis';
  role: string;
}> = {
  distance: { label: 'Mesafe (Sadece Ölçüm)', requiredGeometry: 'line', material: 'none', role: 'measurement' },
  existing_dam_embankment: { label: 'Mevcut Baraj Seti', requiredGeometry: 'line', material: 'embankment', role: 'lowerReservoirDamEmbankment' },
  lower_reservoir: { label: 'Alt Rezervuar', requiredGeometry: 'polygon', material: 'water', role: 'lowerReservoirWater' },
  sea_boundary: { label: 'Deniz Sınırı', requiredGeometry: 'line', material: 'water', role: 'seaBoundary' },
  upper_reservoir: { label: 'Üst Rezervuar', requiredGeometry: 'polygon', material: 'water', role: 'upperReservoirWater' },
  upper_reservoir_embankment: { label: 'Üst Rezervuar Set/Dolgu', requiredGeometry: 'polygon', material: 'embankment', role: 'upperReservoirDamEmbankment' },
  powerhouse: { label: 'Güç Evi', requiredGeometry: 'polygon', material: 'industrial', role: 'powerhouseFootprint' },
  existing_switchyard: { label: 'Mevcut Şalt Sahası', requiredGeometry: 'polygon', material: 'switchyard', role: 'switchyardFootprint' },
  new_switchyard: { label: 'Yeni Şalt Sahası', requiredGeometry: 'polygon', material: 'switchyard', role: 'switchyardFootprint' },
  penstock_tunnel_axis: { label: 'Cebri Boru / Tünel Ekseni', requiredGeometry: 'line', material: 'penstock_axis', role: 'penstockAlignment' },
  intake_structure: { label: 'Su Alma Yapısı (Intake)', requiredGeometry: 'polygon', material: 'concrete', role: 'upperIntake' },
  tailrace_outfall: { label: 'Kuyruk Suyu Çıkışı', requiredGeometry: 'line', material: 'tailrace_channel', role: 'tailraceAlignment' },
  surge_tank: { label: 'Denge Bacası', requiredGeometry: 'polygon', material: 'shaft', role: 'surgeTankFootprint' },
  service_drainage_portal: { label: 'Servis / Drenaj Portalı', requiredGeometry: 'polygon', material: 'portal', role: 'servicePortal' },
};
