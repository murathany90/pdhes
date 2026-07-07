import { useCallback, useEffect, useRef, type RefObject } from 'react';
import maplibregl from 'maplibre-gl';
import type { FeatureCollection, Geometry } from 'geojson';
import type { Site } from '../types/site';
import { escapeHtml } from '../utils/format';
import { buildLayout } from '../utils/layout';
import { getMapStyleSpecification, getMarkerIconHtml, type MapStyleKind } from '../utils/mapProviders';
import { useSiteStore } from '../stores/useSiteStore';
import { WORLD_EXAMPLES } from '../data/worldExamples';

export interface MapLayerVisibility {
  candidates: boolean;
  projectLayout: boolean;
  risk: boolean;
  waterPath: boolean;
  gridConnection: boolean;
  grid400: boolean;
  grid154: boolean;
  substations: boolean;
  terrain3d: boolean;
}

interface UseMapLibreOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  site?: Site;
  sites: Site[];
  selectedId: string;
  mapStyle: MapStyleKind;
  heightScale: number;
  gridAssets: FeatureCollection | null;
  layers: MapLayerVisibility;
  onSelectSite?: (id: string) => void;
  interactiveCandidates?: boolean;
}

function featureCollection(features: GeoJSON.Feature<Geometry>[]): FeatureCollection {
  return { type: 'FeatureCollection', features } as FeatureCollection;
}

function filterGrid(gridAssets: FeatureCollection | null, geometryType: string, voltages: string[]) {
  if (!gridAssets) return featureCollection([]);
  return featureCollection(
    gridAssets.features.filter((feature) =>
      feature.geometry?.type === geometryType && voltages.includes(String(feature.properties?.voltage ?? '')),
    ) as GeoJSON.Feature<Geometry>[],
  );
}

function removeIfExists(map: maplibregl.Map, layers: string[], sources: string[]) {
  layers.forEach((id) => {
    if (map.getLayer(id)) map.removeLayer(id);
  });
  sources.forEach((id) => {
    if (map.getSource(id)) map.removeSource(id);
  });
}

export function useMapLibre({
  containerRef,
  site,
  sites,
  selectedId,
  mapStyle,
  heightScale,
  gridAssets,
  layers,
  onSelectSite,
  interactiveCandidates = true,
}: UseMapLibreOptions) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapStyleRef = useRef(mapStyle);
  const drawRequestRef = useRef(0);
  const onSelectSiteRef = useRef(onSelectSite);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const canCreateMap = Boolean(site);

  useEffect(() => {
    onSelectSiteRef.current = onSelectSite;
  }, [onSelectSite]);

  const handleCandidateClick = useCallback(() => {
    // Legacy click handler (can be kept if needed for fallback, but Markers use native events)
  }, []);

  const queueDrawLayers = useCallback(() => {
    const map = mapRef.current;
    if (!map || !site) return;
    const requestId = ++drawRequestRef.current;
    const run = () => {
      if (requestId !== drawRequestRef.current) return;
      if (!map.isStyleLoaded()) {
        map.once('styledata', queueDrawLayers);
        return;
      }
      const oldLayers = [
        'grid-400-line',
        'grid-154-line',
        'substation-circles',
        'substation-labels',
        'risk-fill',
        'risk-line',
        'project-grid-line',
        'water-line',
        'blocks-extrusion',
        'block-labels',
        'candidate-circles',
        'candidate-labels',
        'hillshade-layer',
      ];
      const oldSources = ['grid400', 'grid154', 'substations', 'risk', 'projectGrid', 'water', 'blocks', 'blockLabels', 'candidates'];
      if (map.getLayer('candidate-circles')) {
        map.off('click', 'candidate-circles', handleCandidateClick);
      }
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      
      // Also cleanup world example markers if we are storing them in the same array or another ref
      // Actually we'll just store them all in markersRef
      
      removeIfExists(map, oldLayers, oldSources);

      if (layers.terrain3d) {
        map.setTerrain({ source: 'terrainSource', exaggeration: heightScale * 1.3 });
        if (map.getSource('terrainSource') && !map.getLayer('hillshade-layer')) {
          map.addLayer({
            id: 'hillshade-layer',
            type: 'hillshade',
            source: 'terrainSource',
            paint: {
              'hillshade-shadow-color': '#0f172a',
              'hillshade-illumination-direction': 315,
              'hillshade-exaggeration': 0.85
            }
          }, 'base');
        }
      } else {
        map.setTerrain(null);
      }

      const layout = buildLayout(site, heightScale);

      if (layers.grid400) {
        map.addSource('grid400', { type: 'geojson', data: filterGrid(gridAssets, 'LineString', ['400']) });
        map.addLayer({
          id: 'grid-400-line',
          type: 'line',
          source: 'grid400',
          paint: { 'line-color': '#ffd75a', 'line-width': 1.1, 'line-opacity': 0.28 },
        });
      }

      if (layers.grid154) {
        map.addSource('grid154', { type: 'geojson', data: filterGrid(gridAssets, 'LineString', ['154']) });
        map.addLayer({
          id: 'grid-154-line',
          type: 'line',
          source: 'grid154',
          paint: { 'line-color': '#48f49a', 'line-width': 0.8, 'line-opacity': 0.2 },
        });
      }

      if (layers.substations) {
        map.addSource('substations', { type: 'geojson', data: filterGrid(gridAssets, 'Point', ['400', '154']) });
        map.addLayer({
          id: 'substation-circles',
          type: 'circle',
          source: 'substations',
          paint: {
            'circle-radius': ['case', ['==', ['get', 'voltage'], '400'], 4, 2.8],
            'circle-color': ['case', ['==', ['get', 'voltage'], '400'], '#ffd75a', '#48f49a'],
            'circle-opacity': 0.65,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#07110e',
          },
        });
      }

      if (layers.risk) {
        map.addSource('risk', { type: 'geojson', data: layout.risk });
        map.addLayer({ id: 'risk-fill', type: 'fill', source: 'risk', paint: { 'fill-color': '#ff5c73', 'fill-opacity': 0.13 } });
        map.addLayer({ id: 'risk-line', type: 'line', source: 'risk', paint: { 'line-color': '#ff5c73', 'line-width': 1.5, 'line-dasharray': [2, 2] } });
      }

      if (layers.gridConnection) {
        map.addSource('projectGrid', { type: 'geojson', data: layout.grid });
        map.addLayer({
          id: 'project-grid-line',
          type: 'line',
          source: 'projectGrid',
          paint: { 'line-color': ['get', 'color'], 'line-width': ['get', 'width'], 'line-opacity': 0.82 },
        });
      }

      if (layers.waterPath) {
        map.addSource('water', { type: 'geojson', data: layout.water });
        map.addLayer({
          id: 'water-line',
          type: 'line',
          source: 'water',
          paint: { 'line-color': ['get', 'color'], 'line-width': ['get', 'width'], 'line-opacity': 0.95, 'line-dasharray': [6, 2, 2, 2] },
        });
      }

      if (layers.projectLayout) {
        map.addSource('blocks', { type: 'geojson', data: layout.blocks });
        map.addLayer({
          id: 'blocks-extrusion',
          type: 'fill-extrusion',
          source: 'blocks',
          paint: {
            'fill-extrusion-color': ['get', 'color'],
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'base'],
            'fill-extrusion-opacity': 0.85,
          },
        });
        map.addSource('blockLabels', { type: 'geojson', data: layout.labels });
        map.addLayer({
          id: 'block-labels',
          type: 'symbol',
          source: 'blockLabels',
          layout: { 'text-field': ['get', 'label'], 'text-size': 12, 'text-font': ['Noto Sans Bold'], 'text-variable-anchor': ['top', 'bottom', 'left', 'right'] },
          paint: { 'text-color': '#d9fff0', 'text-halo-color': '#06100d', 'text-halo-width': 1.5 },
        });
      }

      if (layers.candidates) {
        const candidates: FeatureCollection = {
          type: 'FeatureCollection',
          features: sites.map((candidate) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [candidate.lon, candidate.lat] },
            properties: { id: candidate.id, name: candidate.name, concept: candidate.conceptLabel, color: candidate.color },
          })),
        };
        map.addSource('candidates', { type: 'geojson', data: candidates });
        map.addLayer({
          id: 'candidate-labels',
          type: 'symbol',
          source: 'candidates',
          layout: { 'text-field': ['get', 'name'], 'text-size': 11, 'text-offset': [0, 1.4], 'text-font': ['Noto Sans Regular'] },
          paint: { 'text-color': '#eafff2', 'text-halo-color': '#04100c', 'text-halo-width': 1.2 },
        });
        
        sites.forEach((candidate) => {
          const el = document.createElement('div');
          el.innerHTML = getMarkerIconHtml(candidate.concept || 'classic', candidate.id === selectedId ? '#ff2a55' : candidate.color, candidate.id === selectedId);
          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([candidate.lon, candidate.lat])
            .addTo(map);

          if (interactiveCandidates) {
            marker.getElement().style.cursor = 'pointer';
            marker.getElement().addEventListener('click', (e) => {
              e.stopPropagation();
              onSelectSiteRef.current?.(candidate.id);
              new maplibregl.Popup({ closeButton: false, offset: 25 })
                .setLngLat([candidate.lon, candidate.lat])
                .setHTML(`<b>${escapeHtml(candidate.name)}</b><br><span style="font-size: 12px">${escapeHtml(candidate.conceptLabel)}</span>`)
                .addTo(map);
            });
          }
          markersRef.current.push(marker);
        });
      }

      // Add World Examples
      WORLD_EXAMPLES.forEach((example) => {
        const el = document.createElement('div');
        el.innerHTML = getMarkerIconHtml('classic', '#00a8ff', false); // Focus ID state not easily available here without adding it to hook props, so defaulting to standard size
        el.style.cursor = 'pointer';
        
        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([example.lon, example.lat])
          .addTo(map);

        const popupHtml = `
          <div class="we-popup-content">
            <div style="font-weight:bold;font-size:14px;margin-bottom:4px;color:var(--text);">${example.flag} ${escapeHtml(example.name)}</div>
            <div style="font-size:12px;color:var(--muted);margin-bottom:8px;">${escapeHtml(example.country)} &middot; ${example.status === 'operational' ? 'İşletmede' : 'İşletmede değil'}</div>
            <div style="font-size:13px;border-top:1px solid var(--line);padding-top:6px;margin-bottom:6px;">
              <div><b>Kurulu güç:</b> ${example.capacityMw.toLocaleString('tr-TR')} MW</div>
              ${example.headM ? `<div><b>Düşü:</b> ${example.headM} m</div>` : ''}
              ${example.storageMwh ? `<div><b>Depolama:</b> ${example.storageMwh.toLocaleString('tr-TR')} MWh</div>` : ''}
              ${example.commissioningYear ? `<div><b>Yıl:</b> ${example.commissioningYear}</div>` : ''}
            </div>
            ${example.wikiNote ? `<div style="font-size:12px;color:var(--soft);margin-bottom:6px;"><b>Not:</b> ${escapeHtml(example.wikiNote)}</div>` : ''}
            <a href="${example.wikiUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;font-size:12px;color:var(--blue);text-decoration:none;margin-top:4px;">Wikipedia &nearr;</a>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 15, maxWidth: '260px' })
          .setLngLat([example.lon, example.lat])
          .setHTML(popupHtml);
          
        popup.on('open', () => {
          const { setWorldExampleFocus } = useSiteStore.getState();
          setWorldExampleFocus(example.id);
        });

        popup.on('close', () => {
          const { worldExampleFocusId, clearWorldExampleFocus } = useSiteStore.getState();
          if (worldExampleFocusId === example.id) {
            clearWorldExampleFocus();
          }
        });
        
        marker.setPopup(popup);
        
        // Storing popup in the element so we can access it programmatically later if needed
        (el as any)._popup = popup;
        el.id = `we-marker-${example.id}`;

        markersRef.current.push(marker);
      });

    };
    run();
  }, [gridAssets, handleCandidateClick, heightScale, interactiveCandidates, layers, selectedId, site, sites]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !site) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: getMapStyleSpecification(mapStyle),
      center: site.view.center,
      zoom: site.view.zoom,
      pitch: site.view.pitch,
      bearing: site.view.bearing,
      attributionControl: false,
      maxZoom: 22,
    });
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
    mapRef.current = map;
    mapStyleRef.current = mapStyle;
    
    map.on('load', () => {
      queueDrawLayers();
    });
    
    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      if (map.getLayer('candidate-circles')) {
        map.off('click', 'candidate-circles', handleCandidateClick);
      }
      map.remove();
      mapRef.current = null;
    };
    // Map creation is intentionally tied only to first data availability.
    // Site/style updates redraw layers without recreating the map instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, handleCandidateClick, canCreateMap]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !site) return;
    if (mapStyleRef.current === mapStyle) return;
    mapStyleRef.current = mapStyle;
    map.setStyle(getMapStyleSpecification(mapStyle));
    queueDrawLayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStyle]);

  useEffect(() => {
    queueDrawLayers();
  }, [queueDrawLayers]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !site) return;
    map.flyTo({
      center: site.view.center,
      zoom: site.view.zoom,
      pitch: site.view.pitch,
      bearing: site.view.bearing,
      duration: 900,
    });
  }, [selectedId, site]);

  return { mapRef };
}
