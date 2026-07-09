import type { ManualGeometryFeature } from '../types/manualGeometry';
import type { Layout3DFootprint, Site } from '../types/site';

export function overrideSiteWithManualGeometries(site: Site, features: ManualGeometryFeature[]): Site {
  if (!features || features.length === 0) return site;

  // Convert manual features to Layout3DFootprint format
  const manualFootprints: Layout3DFootprint[] = features.map(feature => {
    // Only polygon coordinates are strictly matched to the footprint format right now
    // But we can pass linestrings by just taking their coordinates array
    const isPolygon = feature.geometry.type === 'Polygon';
    const coords = isPolygon 
      ? (feature.geometry as any).coordinates[0] 
      : (feature.geometry as any).coordinates;

    return {
      id: feature.id as string || crypto.randomUUID(),
      component: feature.properties.role, // role acts as the component key in ThreeDModel
      kind: isPolygon ? 'polygon' : 'polyline',
      material: feature.properties.material as any,
      coords: coords as [number, number][],
      baseElevationM: feature.properties.minElevationM,
      topElevationM: feature.properties.maxElevationM,
    };
  });

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
      // The manual footprints override default footprints, but we can also hide legacy reservoirs
      hideLegacySquareReservoir: baseLayout.hideLegacySquareReservoir || manualFootprints.some(f => 
        f.component === 'upperReservoirWater' || f.component === 'lowerReservoirWater'
      ),
      componentFootprints: [
        ...(baseLayout.componentFootprints || []),
        ...manualFootprints
      ]
    }
  };
}
