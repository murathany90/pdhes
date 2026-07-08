import { useCallback, useEffect, useRef, type RefObject } from 'react';
import maplibregl from 'maplibre-gl';
import type { FeatureCollection, Geometry } from 'geojson';
import type { Site } from '../types/site';
import { escapeHtml } from '../utils/format';
import { buildLayout } from '../utils/layout';
import { getMapStyleSpecification, getMarkerIconHtml, type MapStyleKind } from '../utils/mapProviders';
import { useSiteStore } from '../stores/useSiteStore';
import { WORLD_EXAMPLES } from '../data/worldExamples';
import {
  COORDINATE_CONFIDENCE_LABELS,
  CYCLE_TYPE_LABELS,
  SOURCE_GROUP_LABELS,
  getSiteCenter,
  getSiteColor,
  getSiteView,
  isSeaLowerReservoir,
} from '../utils/siteDerived';
import { num } from '../utils/format';
import { useSettingsStore } from '../stores/useSettingsStore';

function popupWaterwayText(site: Site): string {
  if (site.tunnelLengthKm !== null && site.tunnelLengthKm !== undefined) return `${num(site.tunnelLengthKm, 1)} km tünel`;
  if (site.penstockLengthM !== null && site.penstockLengthM !== undefined) return `${num(site.penstockLengthM)} m cebri boru`;
  if (site.tailraceTunnelLengthM !== null && site.tailraceTunnelLengthM !== undefined) return `${num(site.tailraceTunnelLengthM)} m kuyruk suyu`;
  return 'Su yolu belirtilmedi';
}

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
  const { showPowerGrid, powerGridConfig } = useSettingsStore();
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
        'osm-power-lines',
        'osm-power-points',
      ];
      const oldSources = ['grid400', 'grid154', 'substations', 'risk', 'projectGrid', 'water', 'blocks', 'blockLabels', 'candidates', 'osm-power-grid'];
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

      if (showPowerGrid) {
        map.addSource('osm-power-grid', { type: 'geojson', data: import.meta.env.BASE_URL.replace(/\/$/, '') + '/power-grid-filtered.geojson' });
        
        const getVoltageProp = (prop: 'color' | 'width'): any => {
          const v = ['to-number', ['coalesce', ['get', 'voltage'], 0]];
          return [
            'case',
            ['>=', v, 500], powerGridConfig.voltages.over500[prop],
            ['>=', v, 400], powerGridConfig.voltages.v400[prop],
            ['>=', v, 154], powerGridConfig.voltages.v154[prop],
            ['==', v, 33], powerGridConfig.voltages.v33[prop],
            ['all', ['>', v, 0], ['<', v, 33]], powerGridConfig.voltages.under33[prop],
            powerGridConfig.voltages.unknown[prop]
          ];
        };

        if (powerGridConfig.elements.lines.show || powerGridConfig.elements.cables.show) {
          const typeFilter = [];
          if (powerGridConfig.elements.lines.show) typeFilter.push('line', 'minor_line');
          if (powerGridConfig.elements.cables.show) typeFilter.push('cable');

          map.addLayer({
            id: 'osm-power-lines',
            type: 'line',
            source: 'osm-power-grid',
            filter: ['in', ['get', 'type'], ['literal', typeFilter]],
            paint: {
              'line-color': getVoltageProp('color'),
              'line-width': [
                '*',
                getVoltageProp('width'),
                ['case',
                  ['==', ['get', 'type'], 'cable'], ['*', powerGridConfig.elements.cables.size || 0.5, 1.5],
                  ['*', powerGridConfig.elements.lines.size || 0.5, 1.5]
                ]
              ],
              'line-opacity': 0.85
            }
          });
        }
        
        if (powerGridConfig.elements.substation.show || powerGridConfig.elements.plant.show) {
          const pointTypes = [];
          if (powerGridConfig.elements.substation.show) pointTypes.push('substation');
          if (powerGridConfig.elements.plant.show) pointTypes.push('plant');

          map.addLayer({
            id: 'osm-power-points',
            type: 'symbol',
            source: 'osm-power-grid',
            filter: ['in', ['get', 'type'], ['literal', pointTypes]],
            layout: {
              'text-field': [
                'case',
                ['==', ['get', 'type'], 'plant'], '⬤', // Circle for plants
                '■' // Square for substations
              ],
              'text-size': [
                '*',
                getVoltageProp('width'),
                ['case',
                  ['==', ['get', 'type'], 'plant'], ['*', powerGridConfig.elements.plant.size || 0.6, 8],
                  ['*', powerGridConfig.elements.substation.size || 0.8, 8]
                ]
              ],
              'text-allow-overlap': true,
              'text-ignore-placement': true
            },
            paint: {
              'text-color': getVoltageProp('color'),
              'text-halo-color': '#ffffff',
              'text-halo-width': 2
            }
          });
        }

        // Add tooltips
        if (!(map as any)._pgBound) {
          (map as any)._pgBound = true;
          
          const showTooltip = (e: any) => {
            map.getCanvas().style.cursor = 'pointer';
            const feature = e.features[0];
            const props = feature.properties;
            const html = `
              <div style="font-family:sans-serif;font-size:12px;padding:2px">
                <strong style="display:block;margin-bottom:4px;font-size:13px">${props.name || 'İsimsiz'}</strong>
                <div style="color:#555">Tip: <b>${props.type || 'Bilinmiyor'}</b></div>
                <div style="color:#555">Gerilim: <b>${props.voltage ? props.voltage + ' kV' : 'Bilinmiyor'}</b></div>
              </div>
            `;
            
            if (!(map as any)._pgPopup) {
              (map as any)._pgPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 10 });
            }
            (map as any)._pgPopup.setLngLat(e.lngLat).setHTML(html).addTo(map);
          };

          const hideTooltip = () => {
            map.getCanvas().style.cursor = '';
            if ((map as any)._pgPopup) {
              (map as any)._pgPopup.remove();
            }
          };

          map.on('mouseenter', 'osm-power-lines', showTooltip);
          map.on('mouseleave', 'osm-power-lines', hideTooltip);
          map.on('mouseenter', 'osm-power-points', showTooltip);
          map.on('mouseleave', 'osm-power-points', hideTooltip);
        }
      }

      if (layers.candidates) {
        const candidates: FeatureCollection = {
          type: 'FeatureCollection',
          features: sites.map((candidate) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: getSiteCenter(candidate) },
            properties: { id: candidate.id, name: candidate.name, sourceGroupLabel: SOURCE_GROUP_LABELS[candidate.sourceGroup], color: getSiteColor(candidate) },
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
          const markerColor = candidate.id === selectedId ? '#ff2a55' : getSiteColor(candidate);
          const center = getSiteCenter(candidate);
          el.innerHTML = getMarkerIconHtml(isSeaLowerReservoir(candidate) ? 'sea' : 'classic', markerColor, candidate.id === selectedId);
          const marker = new maplibregl.Marker({ element: el })
            .setLngLat(center)
            .addTo(map);

          if (interactiveCandidates) {
            marker.getElement().style.cursor = 'pointer';
            marker.getElement().addEventListener('click', (e) => {
              e.stopPropagation();
              onSelectSiteRef.current?.(candidate.id);
              new maplibregl.Popup({ closeButton: false, offset: 25 })
                .setLngLat(center)
                .setHTML(`
                  <b>${escapeHtml(candidate.name)}</b><br>
                  <span style="font-size:12px">${escapeHtml(SOURCE_GROUP_LABELS[candidate.sourceGroup])}</span>
                  <div style="font-size:12px;margin-top:6px">
                    <div><b>Güç / Enerji:</b> ${num(candidate.capacityMW)} MW${candidate.energyGWh ? ` / ${num(candidate.energyGWh)} GWh` : ''}</div>
                    <div><b>Düşü (head) / Su Yolu:</b> ${num(candidate.headM)} m / ${escapeHtml(popupWaterwayText(candidate))}</div>
                    <div><b>Teknik sınıf:</b> ${escapeHtml(CYCLE_TYPE_LABELS[candidate.technicalClassification.cycleType])}</div>
                    <div><b>Alt rezervuar:</b> ${escapeHtml(candidate.lowerReservoirName)}</div>
                    <div><b>Üst rezervuar:</b> ${escapeHtml(candidate.upperReservoirDescription)}</div>
                    <div><b>Koordinat:</b> ${escapeHtml(COORDINATE_CONFIDENCE_LABELS[candidate.coordinates.coordinateConfidence])}</div>
                    <button type="button" style="margin-top:6px">Kavramsal tesis yerleşimini göster</button>
                  </div>
                `)
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
            ${example.wikiUrl ? `<a href="${example.wikiUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;font-size:12px;color:var(--blue);text-decoration:none;margin-top:4px;">Wikipedia &nearr;</a>` : ''}
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
  }, [gridAssets, handleCandidateClick, heightScale, interactiveCandidates, layers, selectedId, site, sites, showPowerGrid, powerGridConfig]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !site) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: getMapStyleSpecification(mapStyle),
      center: getSiteView(site).center,
      zoom: getSiteView(site).zoom,
      pitch: getSiteView(site).pitch,
      bearing: getSiteView(site).bearing,
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
    const view = getSiteView(site);
    map.flyTo({
      center: view.center,
      zoom: view.zoom,
      pitch: view.pitch,
      bearing: view.bearing,
      duration: 900,
    });
  }, [selectedId, site]);

  return { mapRef };
}
