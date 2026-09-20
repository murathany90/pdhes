import { useEffect } from 'react';
import type * as maplibregl from 'maplibre-gl';
import { useManualGeometryStore } from '../stores/useManualGeometryStore';
import { useShallow } from 'zustand/react/shallow';

export default function ManualGeometryLayer({ map, siteId }: { map: maplibregl.Map | null, siteId: string }) {
  const features = useManualGeometryStore(useShallow(state => state.getFeaturesForSite(siteId)));

  useEffect(() => {
    if (!map) return;

    const sourceId = 'manual-geometries';
    
    const geojson: any = {
      type: 'FeatureCollection',
      features
    };

    const ensureManualLayers = () => {
      if (!map.isStyleLoaded()) return;
      const source = map.getSource(sourceId) as maplibregl.GeoJSONSource | undefined;
      if (source) {
        source.setData(geojson);
      } else {
        map.addSource(sourceId, { type: 'geojson', data: geojson });
      }

      if (!map.getLayer('manual-polygons')) {
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
      }

      if (!map.getLayer('manual-polygons-outline')) {
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
      }

      if (!map.getLayer('manual-lines')) {
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
      }

      if (!map.getLayer('manual-points')) {
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
    };

    ensureManualLayers();

    const onStyleLoad = () => ensureManualLayers();
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
