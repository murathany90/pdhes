import { useEffect } from 'react';
import { useManualGeometryStore } from '../stores/useManualGeometryStore';

export default function ManualGeometryLayer({ map, siteId }: { map: maplibregl.Map | null, siteId: string }) {
  const features = useManualGeometryStore(state => state.getFeaturesForSite(siteId));

  useEffect(() => {
    if (!map) return;

    const sourceId = 'manual-geometries';
    
    const geojson: any = {
      type: 'FeatureCollection',
      features
    };

    const source = map.getSource(sourceId) as maplibregl.GeoJSONSource;
    if (source) {
      source.setData(geojson);
    } else if (map.isStyleLoaded()) {
      map.addSource(sourceId, { type: 'geojson', data: geojson });
      
      // Polygon fill layer
      map.addLayer({
        id: 'manual-polygons',
        type: 'fill',
        source: sourceId,
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'fill-color': [
            'match',
            ['get', 'material'],
            'water', '#3b82f6',
            'embankment', '#8B4513',
            'industrial', '#6b7280',
            'switchyard', '#fbbf24',
            'concrete', '#9ca3af',
            'shaft', '#dc2626',
            'portal', '#4b5563',
            '#ffffff'
          ],
          'fill-opacity': 0.4
        }
      });

      // Polygon outline layer
      map.addLayer({
        id: 'manual-polygons-outline',
        type: 'line',
        source: sourceId,
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'line-color': [
            'match',
            ['get', 'material'],
            'water', '#2563eb',
            'embankment', '#5c2e0b',
            'industrial', '#4b5563',
            'switchyard', '#d97706',
            'concrete', '#6b7280',
            'shaft', '#991b1b',
            'portal', '#374151',
            '#000000'
          ],
          'line-width': 2
        }
      });

      // Line layer
      map.addLayer({
        id: 'manual-lines',
        type: 'line',
        source: sourceId,
        filter: ['==', '$type', 'LineString'],
        paint: {
          'line-color': [
            'match',
            ['get', 'material'],
            'penstock_axis', '#dc2626', // red for penstock
            'tailrace_channel', '#3b82f6', // blue for tailrace
            'water', '#3b82f6',
            'embankment', '#8B4513',
            '#10b981' // green for distance
          ],
          'line-width': 4,
          'line-dasharray': [
            'match',
            ['get', 'material'],
            'penstock_axis', ['literal', [2, 1]],
            ['literal', [1, 0]]
          ]
        }
      });
      
      // Point layer (for surge tank or small items if they are drawn as point)
      map.addLayer({
        id: 'manual-points',
        type: 'circle',
        source: sourceId,
        filter: ['==', '$type', 'Point'],
        paint: {
          'circle-radius': 6,
          'circle-color': '#dc2626',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });
    }

    // Sometimes style needs to be fully loaded
    const onStyleLoad = () => {
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, { type: 'geojson', data: geojson });
        // (Layer addition logic would ideally be refactored to a function to avoid duplication,
        // but for simplicity it's sufficient here if we handle it this way)
      }
    };
    map.on('styledata', onStyleLoad);
    
    return () => {
      map.off('styledata', onStyleLoad);
      if (!map || typeof map.getStyle !== 'function' || !map.getStyle()) return;
      if (map.getLayer('manual-polygons')) map.removeLayer('manual-polygons');
      if (map.getLayer('manual-polygons-outline')) map.removeLayer('manual-polygons-outline');
      if (map.getLayer('manual-lines')) map.removeLayer('manual-lines');
      if (map.getLayer('manual-points')) map.removeLayer('manual-points');
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [map, features, siteId]);

  return null;
}
