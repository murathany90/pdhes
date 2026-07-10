import { useCallback, useEffect, useRef, type RefObject } from 'react';
import maplibregl from 'maplibre-gl';
import type { FeatureCollection, Geometry } from 'geojson';
import type { Site } from '../types/site';
import { escapeHtml } from '../utils/format';
import { buildLayout } from '../utils/layout';
import { getMapStyleSpecification, getMarkerIconHtml, type MapStyleKind } from '../utils/mapProviders';
import { useSiteStore } from '../stores/useSiteStore';
import { WORLD_EXAMPLES_DETAILED } from '../data/worldExamplesDetailed';
import {
  COORDINATE_CONFIDENCE_LABELS,
  CYCLE_TYPE_LABELS,
  PDHES_TYPE_LABELS,
  getSiteCenter,
  getSiteColor,
  getSiteView,
  isSeaLowerReservoir,
} from '../utils/siteDerived';
import { num } from '../utils/format';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useMapToolsStore } from '../stores/useMapToolsStore';

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
  powerGrid: boolean;
  terrain3d: boolean;
  upperReservoir: boolean;
  lowerReservoir: boolean;
  powerhouse: boolean;
  surgeTank: boolean;
  switchyard3d: boolean;
  portal: boolean;
}

interface UseMapLibreOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  site?: Site;
  sites: Site[];
  selectedId: string;
  worldExampleFocusId?: string | null;
  mapStyle: MapStyleKind;
  heightScale: number;
  gridAssets: FeatureCollection | null;
  layers: MapLayerVisibility;
  onSelectSite?: (id: string) => void;
  interactiveCandidates?: boolean;
  draftingMode?: string;
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
  if (!map || typeof map.getStyle !== 'function' || !map.getStyle()) return;
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
  worldExampleFocusId,
  mapStyle,
  heightScale,
  gridAssets,
  layers,
  onSelectSite,
  interactiveCandidates = true,
  draftingMode,
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
      if (!map.getStyle()) return;
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
        'candidate-circles',
        'candidate-labels',
        'hillshade-layer',
        'osm-power-lines',
        'osm-power-points',
      ];
      const oldSources = ['grid400', 'grid154', 'substations', 'risk', 'projectGrid', 'water', 'candidates', 'osm-power-grid'];
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

      if (layers.powerGrid) {
        map.addSource('grid400', { type: 'geojson', data: filterGrid(gridAssets, 'LineString', ['400']) });
        map.addLayer({
          id: 'grid-400-line',
          type: 'line',
          source: 'grid400',
          paint: { 'line-color': '#ffd75a', 'line-width': 1.1, 'line-opacity': 0.28 },
        });

        map.addSource('grid154', { type: 'geojson', data: filterGrid(gridAssets, 'LineString', ['154']) });
        map.addLayer({
          id: 'grid-154-line',
          type: 'line',
          source: 'grid154',
          paint: { 'line-color': '#48f49a', 'line-width': 0.8, 'line-opacity': 0.2 },
        });

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

        map.addSource('projectGrid', { type: 'geojson', data: layout.grid });
        map.addLayer({
          id: 'project-grid-line',
          type: 'line',
          source: 'projectGrid',
          paint: { 'line-color': ['get', 'color'], 'line-width': ['get', 'width'], 'line-opacity': 0.82 },
        });
      }

      if (layers.risk) {
        map.addSource('risk', { type: 'geojson', data: layout.risk });
        map.addLayer({ id: 'risk-fill', type: 'fill', source: 'risk', paint: { 'fill-color': '#ff5c73', 'fill-opacity': 0.13 } });
        map.addLayer({ id: 'risk-line', type: 'line', source: 'risk', paint: { 'line-color': '#ff5c73', 'line-width': 1.5, 'line-dasharray': [2, 2] } });
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
        const activeBlocks: string[] = [];
        if (layers.upperReservoir) activeBlocks.push('upper_reservoir', 'upperReservoirWater', 'upperReservoirEmbankment', 'upperIntake');
        if (layers.lowerReservoir) activeBlocks.push('lower_reservoir', 'lowerReservoirFootprint');
        if (layers.powerhouse) activeBlocks.push('powerhouse', 'powerhouseFootprint');
        if (layers.surgeTank) activeBlocks.push('surge_tank', 'surgeTankFootprint');
        if (layers.switchyard3d) activeBlocks.push('switchyard', 'switchyardFootprint');
        if (layers.portal) activeBlocks.push('portal', 'serviceDrainPortal');

        const filteredBlocks = {
          type: 'FeatureCollection',
          features: layout.blocks.features.filter(f => {
            const comp = f.properties?.component || f.properties?.key;
            return activeBlocks.includes(comp);
          })
        } as any;

        const filteredLabels = {
          type: 'FeatureCollection',
          features: layout.labels.features.filter(f => activeBlocks.includes(f.properties?.key))
        } as any;

        if (map.getSource('blocks')) {
          (map.getSource('blocks') as maplibregl.GeoJSONSource).setData(filteredBlocks);
          if (map.getLayer('blocks-extrusion')) {
            map.setPaintProperty('blocks-extrusion', 'fill-extrusion-color', draftingMode ? [
              'case',
              ['==', ['get', 'component'], draftingMode],
              '#aaaaaa',
              ['get', 'color']
            ] : ['get', 'color']);
            map.setPaintProperty('blocks-extrusion', 'fill-extrusion-opacity', draftingMode ? [
              'case',
              ['==', ['get', 'component'], draftingMode],
              0.4,
              0.85
            ] : 0.85);
          }
        } else {
          map.addSource('blocks', { type: 'geojson', data: filteredBlocks });
          setTimeout(() => {
            if (map.getLayer('blocks-extrusion')) return;
            map.addLayer({
              id: 'blocks-extrusion',
              type: 'fill-extrusion',
              source: 'blocks',
              paint: {
                'fill-extrusion-color': draftingMode ? [
                  'case',
                  ['==', ['get', 'component'], draftingMode],
                  '#aaaaaa',
                  ['get', 'color']
                ] : ['get', 'color'],
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'base'],
                'fill-extrusion-opacity': draftingMode ? [
                  'case',
                  ['==', ['get', 'component'], draftingMode],
                  0.4,
                  0.85
                ] : 0.85,
              },
            });
          }, 50);
        }

        if (map.getSource('blockLabels')) {
          (map.getSource('blockLabels') as maplibregl.GeoJSONSource).setData(filteredLabels);
        } else {
          map.addSource('blockLabels', { type: 'geojson', data: filteredLabels });
          setTimeout(() => {
            if (map.getLayer('block-labels')) return;
            map.addLayer({
              id: 'block-labels',
              type: 'symbol',
              source: 'blockLabels',
              layout: { 'text-field': ['get', 'label'], 'text-size': 12, 'text-font': ['Noto Sans Bold'], 'text-variable-anchor': ['top', 'bottom', 'left', 'right'] },
              paint: { 'text-color': '#d9fff0', 'text-halo-color': '#06100d', 'text-halo-width': 1.5 },
            });

            if (!(map as any)._blockBound) {
              (map as any)._blockBound = true;
              
              const showBlockTooltip = (e: any) => {
                map.getCanvas().style.cursor = 'pointer';
                const feature = e.features[0];
                const props = feature.properties;
                const labelMap: Record<string, string> = {
                  'upper_reservoir': 'Üst Rezervuar',
                  'lower_reservoir': 'Alt Rezervuar',
                  'powerhouse': 'Türbin Odası / Güç Evi',
                  'switchyard': 'Şalt Sahası',
                  'surge_tank': 'Denge Bacası',
                  'portal': 'Tünel Portalı'
                };
                
                const label = props.label || labelMap[props.component] || labelMap[props.key] || props.component || 'Bilinmeyen Nesne';
                const html = `
                  <div style="font-family:sans-serif;font-size:12px;padding:4px">
                    <strong style="display:block;font-size:13px">${label}</strong>
                  </div>
                `;
                
                if (!(map as any)._blockPopup) {
                  (map as any)._blockPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 10 });
                }
                (map as any)._blockPopup.setLngLat(e.lngLat).setHTML(html).addTo(map);
              };

              const hideBlockTooltip = () => {
                map.getCanvas().style.cursor = '';
                if ((map as any)._blockPopup) {
                  (map as any)._blockPopup.remove();
                }
              };

              map.on('mouseenter', 'blocks-extrusion', showBlockTooltip);
              map.on('mouseleave', 'blocks-extrusion', hideBlockTooltip);
            }
          }, 50);
        }
      } else {
        if (map.getLayer('blocks-extrusion')) map.removeLayer('blocks-extrusion');
        if (map.getSource('blocks')) map.removeSource('blocks');
        if (map.getLayer('block-labels')) map.removeLayer('block-labels');
        if (map.getSource('blockLabels')) map.removeSource('blockLabels');
      }

      if (showPowerGrid) {
        map.addSource('osm-power-grid', { type: 'geojson', data: import.meta.env.BASE_URL.replace(/\/$/, '') + '/power-grid-filtered.geojson?v=4' });
        
        const getVoltageProp = (prop: 'color' | 'width'): any => {
          const v = ['to-number', ['coalesce', ['get', 'voltage'], 0]];
          return [
            'case',
            ['>=', v, 500], powerGridConfig.voltages.over500[prop],
            ['>=', v, 300], powerGridConfig.voltages.v400[prop],
            ['>=', v, 66], powerGridConfig.voltages.v154[prop],
            ['>=', v, 20], powerGridConfig.voltages.v33[prop],
            ['all', ['>', v, 0], ['<', v, 20]], powerGridConfig.voltages.under33[prop],
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
                  ['==', ['get', 'type'], 'cable'], ['*', powerGridConfig.elements.cables.size || 0.5, 1.1],
                  ['*', powerGridConfig.elements.lines.size || 0.5, 1.1]
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
              'text-color': [
                'case',
                ['==', ['get', 'type'], 'plant'], powerGridConfig.elements.plant.color,
                powerGridConfig.elements.substation.color
              ],
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
            properties: { id: candidate.id, name: candidate.name, sourceGroupLabel: PDHES_TYPE_LABELS[candidate.pdhesType], color: getSiteColor(candidate) },
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
          if (candidate.id === selectedId) el.classList.add('active-marker');
          const marker = new maplibregl.Marker({ element: el })
            .setLngLat(center)
            .addTo(map);

          if (interactiveCandidates) {
            marker.getElement().style.cursor = 'pointer';
            marker.getElement().addEventListener('click', (e) => {
              e.stopPropagation();
              onSelectSiteRef.current?.(candidate.id);
              const popupContent = document.createElement('div');
              popupContent.innerHTML = `
                  <b>${escapeHtml(candidate.name)}</b><br>
                  <span style="font-size:12px">${escapeHtml(PDHES_TYPE_LABELS[candidate.pdhesType])}</span>
                  <div style="font-size:12px;margin-top:6px">
                    <div><b>Güç / Enerji:</b> ${num(candidate.capacityMW)} MW${candidate.energyGWh ? ` / ${num(candidate.energyGWh)} GWh` : ''}</div>
                    <div><b>Düşü (head) / Su Yolu:</b> ${num(candidate.headM)} m / ${escapeHtml(popupWaterwayText(candidate))}</div>
                    <div><b>Teknik sınıf:</b> ${escapeHtml(CYCLE_TYPE_LABELS[candidate.technicalClassification.cycleType])}</div>
                    <div><b>Alt rezervuar:</b> ${escapeHtml(candidate.lowerReservoirName)}</div>
                    <div><b>Üst rezervuar:</b> ${escapeHtml(candidate.upperReservoirDescription)}</div>
                    <div><b>Koordinat:</b> ${escapeHtml(COORDINATE_CONFIDENCE_LABELS[candidate.coordinates.coordinateConfidence])}</div>
                    <div style="display:flex; gap:8px; margin-top:10px;">
                      <a href="#/3d" style="flex:1; padding:6px 12px; background:#3b82f6; color:white; border-radius:4px; text-decoration:none; font-weight:bold; font-size:12px; text-align:center;">3D Çizimi Gör</a>
                      ${['kamu-gokcekaya-pspp', 'kamu-sariyar-pspp'].includes(candidate.id)
                        ? `<button class="show-3d-btn" style="flex:1; padding:6px 12px; background:#10b981; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size:12px; text-align:center;">3D Görsel</button>`
                        : `<button class="show-3d-btn" disabled style="flex:1; padding:6px 12px; background:#64748b; color:#94a3b8; border:none; border-radius:4px; cursor:not-allowed; font-weight:bold; font-size:12px; text-align:center;">3D Görsel Yok</button>`
                      }
                    </div>
                  </div>
              `;

              if (['kamu-gokcekaya-pspp', 'kamu-sariyar-pspp'].includes(candidate.id)) {
                const btn = popupContent.querySelector('.show-3d-btn');
                if (btn) {
                  btn.addEventListener('click', () => {
                    window.dispatchEvent(new CustomEvent('show-3d-image', { detail: candidate.id }));
                  });
                }
              }

              new maplibregl.Popup({ closeButton: false, offset: 25 })
                .setLngLat(center)
                .setDOMContent(popupContent)
                .addTo(map);
            });
          }
          markersRef.current.push(marker);
        });
      }
      // Add World Examples
      WORLD_EXAMPLES_DETAILED.forEach((example) => {
        const isWorldSelected = example.id === worldExampleFocusId;
        const el = document.createElement('div');
        el.innerHTML = getMarkerIconHtml('classic', isWorldSelected ? '#ff2a55' : '#00a8ff', isWorldSelected);
        if (isWorldSelected) el.classList.add('active-marker');
        el.style.cursor = 'pointer';
        el.style.zIndex = isWorldSelected ? '10' : '1';
        
        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([example.lon || 0, example.lat || 0])
          .addTo(map);

        const popupHtml = `
          <div class="we-popup-content">
            <div style="font-weight:bold;font-size:14px;margin-bottom:4px;color:var(--text);">${escapeHtml(example.name)}</div>
            <div style="font-size:12px;color:var(--muted);margin-bottom:8px;">${escapeHtml(example.country)} &middot; ${escapeHtml(example.status)}</div>
            <div style="font-size:13px;border-top:1px solid var(--line);padding-top:6px;margin-bottom:6px;">
              <div><b>Kurulu güç:</b> ${example.capacityMw} MW</div>
              <div><b>Depolama:</b> ${example.storageMwh} MWh</div>
              <div><b>Düşü:</b> ${example.headM} m</div>
              <div><b>Yıl:</b> ${example.commissioningYear}</div>
            </div>
            <div style="font-size:12px;color:var(--soft);margin-bottom:6px;"><b>Tipi:</b> ${escapeHtml(example.type)}</div>
            ${example.wikiUrl ? `<a href="${example.wikiUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;font-size:12px;color:var(--blue);text-decoration:none;margin-top:4px;">Wikipedia &nearr;</a>` : ''}
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 15, maxWidth: '260px' })
          .setLngLat([example.lon || 0, example.lat || 0])
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
  }, [gridAssets, handleCandidateClick, heightScale, interactiveCandidates, layers, selectedId, site, sites, showPowerGrid, powerGridConfig, draftingMode]);

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
    map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: 'Şebeke verileri: OSM Grid' }), 'bottom-right');
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
    mapRef.current = map;
    mapStyleRef.current = mapStyle;
    useMapToolsStore.getState().setMap(map);
    
    map.on('load', () => {
      queueDrawLayers();
    });
    
    map.on('contextmenu', (e) => {
      const { mode, isDrawing, setIsDrawing, openContextMenu } = useMapToolsStore.getState();
      if (mode === 'measure' && isDrawing) {
        setIsDrawing(false);
      } else {
        openContextMenu(e.point.x, e.point.y, e.lngLat);
      }
    });

    map.on('error', (e) => {
      if (e && e.error && (e.error as any).status === 403 || (e.error as any).status === 401 || (e.error?.message || '').includes('403')) {
        const currentStyle = useSettingsStore.getState().mapStyle;
        if (currentStyle.includes('maptiler')) {
          console.warn('MapTiler kota aşımı / yetki hatası tespit edildi. Açık kaynaklı sağlayıcıya geçiliyor...');
          useSettingsStore.getState().setMapStyle(currentStyle.includes('hybrid') || currentStyle.includes('satellite') ? 'satellite' : 'osm');
        }
      }
    });

    map.on('click', (e) => {
      const { mode, addMeasurementPoint } = useMapToolsStore.getState();
      if (mode === 'measure') {
        addMeasurementPoint([e.lngLat.lng, e.lngLat.lat]);
      }
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      if (map && typeof map.getStyle === 'function' && map.getStyle() && map.getLayer('candidate-circles')) {
        map.off('click', 'candidate-circles', handleCandidateClick);
      }
      useMapToolsStore.getState().setMap(null);
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
      duration: 2500,
    });
  }, [selectedId, site, worldExampleFocusId]);

  return { mapRef };
}
