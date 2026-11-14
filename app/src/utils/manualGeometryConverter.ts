import type { ManualGeometryFeature, ManualFeatureType } from '../types/manualGeometry';
import type { Layout3DFootprint, Layout3DMaterial, Site } from '../types/site';
import { isValidLayout3DFootprint } from './layout3dFootprints';

// Manual-map feature roles use camelCase names that the 3D renderer does
// not recognize. Translate them to the canonical footprint component keys.
const COMPONENT_BY_FEATURE_TYPE: Partial<Record<ManualFeatureType, string>> = {
  existing_dam_embankment: 'lower_reservoir',
  lower_reservoir: 'lower_reservoir',
  sea_boundary: 'lower_reservoir',
  upper_reservoir: 'upper_reservoir',
  upper_reservoir_embankment: 'upper_reservoir',
  powerhouse: 'powerhouse',
  existing_switchyard: 'existing_switchyard',
  new_switchyard: 'new_switchyard',
  penstock_tunnel_axis: 'penstock',
  intake_structure: 'intake',
  tailrace_outfall: 'tailrace_channel',
  surge_tank: 'surge_tank',
  service_drainage_portal: 'portal',
};

const MATERIAL_OVERRIDES: Partial<Record<ManualFeatureType, Layout3DMaterial>> = {
  penstock_tunnel_axis: 'tunnel_axis',
};

export function manualGeometryToFootprints(features: ManualGeometryFeature[]): Layout3DFootprint[] {
  return features.flatMap((feature, index) => {
    const type = feature.properties?.featureType;
    const component = COMPONENT_BY_FEATURE_TYPE[type];
    // Distances, point markers and unknown roles are not surveyed 3D areas or
    // routes. Do not invent a footprint around a point or a measurement line.
    if (!component || feature.geometry?.type === 'Point') return [];

    const material = MATERIAL_OVERRIDES[type] ?? feature.properties.material;
    const geometry = feature.geometry;
    const parts: number[][][] = geometry.type === 'Polygon'
      ? [geometry.coordinates[0]]
      : geometry.type === 'LineString'
        ? [geometry.coordinates]
        : geometry.type === 'MultiLineString'
          ? geometry.coordinates
          : [];
    const kind = geometry.type === 'Polygon' ? 'polygon' as const : 'polyline' as const;
    const baseId = feature.id === undefined || feature.id === null
      ? `manual-${type}-${index + 1}` : String(feature.id);

    return parts.flatMap((part, partIndex) => {
      const footprint: Layout3DFootprint = {
        id: parts.length === 1 ? baseId : `${baseId}-part-${partIndex + 1}`,
        component,
        kind,
        material: material as Layout3DMaterial,
        coords: part.map((point) => [point[0], point[1]] as [number, number]),
        baseElevationM: feature.properties.minElevationM,
        topElevationM: feature.properties.maxElevationM,
      };
      return isValidLayout3DFootprint(footprint) ? [footprint] : [];
    });
  });
}

export function overrideSiteWithManualGeometries(site: Site, features: ManualGeometryFeature[]): Site {
  if (!features?.length) return site;
  const manualFootprints = manualGeometryToFootprints(features);
  if (manualFootprints.length === 0) return site;

  const baseLayout = site.layout3D || {
    scale: 'macro',
    preferredBearing: 0,
    terrainExaggeration: 1,
    reservoirSurfaceMode: 'polygon',
    useFootprintPolygons: false,
    hideLegacySquareReservoir: false,
    componentFootprints: [],
  };

  return {
    ...site,
    layout3D: {
      ...baseLayout,
      useFootprintPolygons: true,
      componentFootprints: [
        ...(baseLayout.componentFootprints || []),
        ...manualFootprints,
      ],
    },
  };
}
