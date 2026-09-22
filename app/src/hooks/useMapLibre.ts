import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import type { Site } from '../types/site';
import { escapeHtml } from '../utils/format';
import { buildLayout } from '../utils/layout';
import { getMapStyleSpecification, getMarkerIconHtml, type MapStyleKind } from '../utils/mapProviders';
import { useSiteStore } from '../stores/useSiteStore';
import { WORLD_EXAMPLES_DETAILED } from '../data/worldExamplesDetailed';
import {
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
import { filterGridFeatures, formatGridVoltageLabel, normalizeGridVoltageFeatures } from '../utils/powerGrid';

function popupWaterwayText(site: Site): string {
  if (site.tunnelLengthKm !== null && site.tunnelLengthKm !== undefined) return `${num(site.tunnelLengthKm, 1)} km tünel`;
  if (site.penstockLengthM !== null && site.penstockLengthM !== undefined) return `${num(site.penstockLengthM)} m cebri boru`;
  if (site.tailraceTunnelLengthM !== null && site.tailraceTunnelLengthM !== undefined) return `${num(site.tailraceTunnelLengthM)} m kuyruk suyu`;
  return 'Su yolu belirtilmedi';
}

const CANDIDATE_POPUP_MAX_WIDTH = '240px';
const WORLD_POPUP_MAX_WIDTH = '210px';

function compactPopupText(value: unknown, maxLength = 34): string {
  const normalized = String(value ?? '—').replace(/\s+/g, ' ').trim() || '—';
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function popupMetric(label: string, value: unknown, maxLength = 34): string {
  const fullValue = String(value ?? '—') || '—';
  return `<div class="map-popup-metric"><span>${escapeHtml(label)}</span><b title="${escapeHtml(fullValue)}">${escapeHtml(compactPopupText(fullValue, maxLength))}</b></div>`;
}

function popupChip(value: unknown, maxLength = 42): string {
  const fullValue = String(value ?? '—') || '—';
  return `<div class="map-popup-chip" title="${escapeHtml(fullValue)}">${escapeHtml(compactPopupText(fullValue, maxLength))}</div>`;
}

function popupTooltip(title: string, rows: Array<[string, string]> = []): string {
  return `
    <div class="map-popup-tooltip">
      <strong>${escapeHtml(title)}</strong>
      ${rows.map(([label, value]) => `<div><span>${escapeHtml(label)}:</span> <b>${escapeHtml(value)}</b></div>`).join('')}
    </div>
  `;
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
  disableAutoFlyTo?: boolean;
}

export type OSMGridLoadStatus = 'idle' | 'loading' | 'ready' | 'empty' | 'error';

function setLayerVisibility(map: maplibregl.Map, layerId: string, visible: boolean) {
  if (!map.getLayer(layerId)) return;
  map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
}

function setLayersVisibility(map: maplibregl.Map, layerIds: string[], visible: boolean) {
  layerIds.forEach((layerId) => setLayerVisibility(map, layerId, visible));
}

const geoJsonSourceDataCache = new WeakMap<object, Map<string, FeatureCollection | string>>();

function ensureGeoJsonSource(map: maplibregl.Map, id: string, data: FeatureCollection | string) {
  let dataCache = geoJsonSourceDataCache.get(map);
  if (!dataCache) {
    dataCache = new Map();
    geoJsonSourceDataCache.set(map, dataCache);
  }
  const source = map.getSource(id) as maplibregl.GeoJSONSource | undefined;
  if (source) {
    if (typeof data !== 'string' && dataCache.get(id) !== data) {
      source.setData(data);
      dataCache.set(id, data);
    }
    return source;
  }
  map.addSource(id, { type: 'geojson', data });
  dataCache.set(id, data);
  return map.getSource(id) as maplibregl.GeoJSONSource | undefined;
}

function ensureLayer(map: maplibregl.Map, layer: maplibregl.AddLayerObject, beforeId?: string) {
  if (map.getLayer(layer.id)) return;
  map.addLayer(layer, beforeId);
}

function applyTerrainMode(map: maplibregl.Map, enabled: boolean, heightScale: number) {
  if (enabled) {
    map.setTerrain({ source: 'terrainSource', exaggeration: heightScale * 1.3 });
    if (map.getSource('hillshadeSource')) {
      ensureLayer(map, {
        id: 'hillshade-layer',
        type: 'hillshade',
        source: 'hillshadeSource',
        paint: {
          'hillshade-shadow-color': '#0f172a',
          'hillshade-illumination-direction': 315,
          'hillshade-exaggeration': 0.85
        }
      }, 'base');
      setLayerVisibility(map, 'hillshade-layer', true);
    }
    return;
  }

  map.setTerrain(null);
  setLayerVisibility(map, 'hillshade-layer', false);
}

function safeOffLayer(
  map: maplibregl.Map,
  event: keyof maplibregl.MapLayerEventType,
  layerId: string,
  handler: (event: any) => void,
) {
  try {
    map.off(event, layerId, handler);
  } catch {
    // Layer-scoped handlers can outlive style reloads; MapLibre throws if the layer is gone.
  }
}

type CachedMarker = {
  marker: maplibregl.Marker;
  element: HTMLElement;
  clickHandler?: EventListener;
  popup?: maplibregl.Popup;
};

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
  disableAutoFlyTo = false,
}: UseMapLibreOptions) {
  const { showPowerGrid, powerGridConfig } = useSettingsStore();
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapStyleRef = useRef(mapStyle);
  const drawRequestRef = useRef(0);
  const waitingForStyleRef = useRef(false);
  const queueDrawLayersRef = useRef<() => void>(() => {});
  const onSelectSiteRef = useRef(onSelectSite);
  const candidateMarkersRef = useRef<Map<string, CachedMarker>>(new Map());
  const worldMarkersRef = useRef<Map<string, CachedMarker>>(new Map());
  const activePopupRef = useRef<maplibregl.Popup | null>(null);
  const [osmPowerGridData, setOsmPowerGridData] = useState<FeatureCollection | null>(null);
  const [osmPowerGridStatus, setOsmPowerGridStatus] = useState<OSMGridLoadStatus>('idle');
  const [osmPowerGridError, setOsmPowerGridError] = useState<string | null>(null);
  const layerEventCleanupRef = useRef<(() => void)[]>([]);
  const boundLayerEventsRef = useRef<Set<string>>(new Set());
  const canCreateMap = Boolean(site);
  const osmPowerGridUrl = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/power-grid-filtered.geojson?v=4`;
  const projectGridSources = useMemo(() => ({
    grid400: filterGridFeatures(gridAssets, 'LineString', ['400']),
    grid154: filterGridFeatures(gridAssets, 'LineString', ['154']),
    substations: filterGridFeatures(gridAssets, 'Point', ['400', '154']),
  }), [gridAssets]);
  const projectLayout = useMemo(() => site ? buildLayout(site, heightScale) : null, [heightScale, site]);

  useEffect(() => {
    if (!showPowerGrid) {
      if (!osmPowerGridData) setOsmPowerGridStatus('idle');
      return undefined;
    }
    if (osmPowerGridData || osmPowerGridStatus === 'loading' || osmPowerGridStatus === 'ready' || osmPowerGridStatus === 'empty' || osmPowerGridStatus === 'error') return undefined;
    if (typeof fetch !== 'function') {
      setOsmPowerGridError('OSM şebeke verisi bu tarayıcıda yüklenemedi.');
      setOsmPowerGridStatus('error');
      return undefined;
    }
    const controller = new AbortController();
    setOsmPowerGridError(null);
    setOsmPowerGridStatus('loading');
    fetch(osmPowerGridUrl, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`power-grid-filtered.geojson HTTP ${response.status}`);
        const data = await response.json();
        if (data?.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
          throw new Error('power-grid-filtered.geojson geçerli bir FeatureCollection değil');
        }
        if (!controller.signal.aborted) {
          const normalized = normalizeGridVoltageFeatures(data);
          setOsmPowerGridData(normalized);
          setOsmPowerGridStatus(normalized.features.length > 0 ? 'ready' : 'empty');
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          const message = error instanceof Error ? error.message : String(error);
          setOsmPowerGridError(`OSM şebeke verisi yüklenemedi: ${message}`);
          setOsmPowerGridStatus('error');
          console.error('Failed to normalize OSM power-grid data:', error);
        }
      });
    return () => controller.abort();
  }, [osmPowerGridData, osmPowerGridUrl, showPowerGrid]);

  useEffect(() => {
    onSelectSiteRef.current = onSelectSite;
  }, [onSelectSite]);

  const bindLayerEvent = useCallback((
    map: maplibregl.Map,
    event: keyof maplibregl.MapLayerEventType,
    layerId: string,
    handler: (event: any) => void,
  ) => {
    const key = `${String(event)}:${layerId}`;
    if (boundLayerEventsRef.current.has(key)) return;
    map.on(event, layerId, handler);
    boundLayerEventsRef.current.add(key);
    layerEventCleanupRef.current.push(() => safeOffLayer(map, event, layerId, handler));
  }, []);

  const queueDrawLayers = useCallback(() => {
    const map = mapRef.current;
    if (!map || !site) return;
    const requestId = ++drawRequestRef.current;
    const run = () => {
      if (requestId !== drawRequestRef.current) return;
      if (!map.getStyle()) return;
      if (!map.isStyleLoaded()) {
        if (!waitingForStyleRef.current) {
          waitingForStyleRef.current = true;
          map.once('styledata', () => {
            waitingForStyleRef.current = false;
            queueDrawLayersRef.current();
          });
        }
        return;
      }
      waitingForStyleRef.current = false;

      applyTerrainMode(map, layers.terrain3d, heightScale);

      ensureGeoJsonSource(map, 'grid400', projectGridSources.grid400);
      ensureLayer(map, {
        id: 'grid-400-line',
        type: 'line',
        source: 'grid400',
        paint: { 'line-color': '#ffd75a', 'line-width': 1.1, 'line-opacity': 0.28 },
      });

      ensureGeoJsonSource(map, 'grid154', projectGridSources.grid154);
      ensureLayer(map, {
        id: 'grid-154-line',
        type: 'line',
        source: 'grid154',
        paint: { 'line-color': '#48f49a', 'line-width': 0.8, 'line-opacity': 0.2 },
      });

      ensureGeoJsonSource(map, 'substations', projectGridSources.substations);
      ensureLayer(map, {
        id: 'substation-circles',
        type: 'circle',
        source: 'substations',
        paint: {
          'circle-radius': ['case', ['==', ['get', 'voltageGroup'], 'v400'], 4, 2.8],
          'circle-color': ['case', ['==', ['get', 'voltageGroup'], 'v400'], '#ffd75a', '#48f49a'],
          'circle-opacity': 0.65,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#07110e',
        },
      });

      if (!projectLayout) return;

      ensureGeoJsonSource(map, 'projectGrid', projectLayout.grid);
      ensureLayer(map, {
        id: 'project-grid-line',
        type: 'line',
        source: 'projectGrid',
        paint: { 'line-color': ['get', 'color'], 'line-width': ['get', 'width'], 'line-opacity': 0.82 },
      });
      setLayersVisibility(map, ['grid-400-line', 'grid-154-line', 'substation-circles', 'project-grid-line'], layers.powerGrid);

      ensureGeoJsonSource(map, 'risk', projectLayout.risk);
      ensureLayer(map, { id: 'risk-fill', type: 'fill', source: 'risk', paint: { 'fill-color': '#ff5c73', 'fill-opacity': 0.13 } });
      ensureLayer(map, { id: 'risk-line', type: 'line', source: 'risk', paint: { 'line-color': '#ff5c73', 'line-width': 1.5, 'line-dasharray': [2, 2] } });
      setLayersVisibility(map, ['risk-fill', 'risk-line'], layers.risk);

      ensureGeoJsonSource(map, 'water', projectLayout.water);
      ensureLayer(map, {
        id: 'water-line',
        type: 'line',
        source: 'water',
        paint: { 'line-color': ['get', 'color'], 'line-width': ['get', 'width'], 'line-opacity': 0.95, 'line-dasharray': [6, 2, 2, 2] },
      });
      setLayerVisibility(map, 'water-line', layers.waterPath);

      if (layers.projectLayout) {
        const activeBlocks: string[] = [];
        if (layers.upperReservoir) activeBlocks.push('upper_reservoir', 'upperReservoirWater', 'upperReservoirEmbankment', 'upperIntake', 'intake', 'dam');
        if (layers.lowerReservoir) activeBlocks.push('lower_reservoir', 'lowerReservoirFootprint', 'dam');
        if (layers.powerhouse) activeBlocks.push('powerhouse', 'powerhouseFootprint');
        if (layers.surgeTank) activeBlocks.push('surge_tank', 'surgeTankFootprint', 'penstock', 'tailrace');
        if (layers.switchyard3d) activeBlocks.push('switchyard', 'switchyardFootprint', 'existing_switchyard', 'new_switchyard');
        if (layers.portal) activeBlocks.push('portal', 'serviceDrainPortal');

        const filteredBlocks = {
          type: 'FeatureCollection',
          features: projectLayout.blocks.features.filter(f => {
            const comp = f.properties?.component || f.properties?.key;
            return activeBlocks.includes(comp);
          })
        } as any;

        const filteredLabels = {
          type: 'FeatureCollection',
          features: projectLayout.labels.features.filter(f => activeBlocks.includes(f.properties?.key))
        } as any;

        const extrusionColor = draftingMode ? [
          'case',
          ['==', ['get', 'component'], draftingMode],
          '#aaaaaa',
          ['get', 'color']
        ] : ['get', 'color'];
        const extrusionOpacity = draftingMode ? [
          'case',
          ['==', ['get', 'component'], draftingMode],
          0.4,
          0.85
        ] : 0.85;

        ensureGeoJsonSource(map, 'blocks', filteredBlocks);
        ensureLayer(map, {
          id: 'blocks-extrusion',
          type: 'fill-extrusion',
          source: 'blocks',
          paint: {
            'fill-extrusion-color': extrusionColor as any,
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'base'],
            'fill-extrusion-opacity': extrusionOpacity as any,
          },
        });
        map.setPaintProperty('blocks-extrusion', 'fill-extrusion-color', extrusionColor as any);
        map.setPaintProperty('blocks-extrusion', 'fill-extrusion-opacity', extrusionOpacity as any);

        ensureGeoJsonSource(map, 'blockLabels', filteredLabels);
        ensureLayer(map, {
          id: 'block-labels',
          type: 'symbol',
          source: 'blockLabels',
          layout: { 'text-field': ['get', 'label'], 'text-size': 12, 'text-font': ['Noto Sans Bold'], 'text-variable-anchor': ['top', 'bottom', 'left', 'right'] },
          paint: { 'text-color': '#d9fff0', 'text-halo-color': '#06100d', 'text-halo-width': 1.5 },
        });
        setLayersVisibility(map, ['blocks-extrusion', 'block-labels'], layers.projectLayout);

        {
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
                const html = popupTooltip(label);
                
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

              bindLayerEvent(map, 'mouseenter', 'blocks-extrusion', showBlockTooltip);
              bindLayerEvent(map, 'mouseleave', 'blocks-extrusion', hideBlockTooltip);
        }
      } else {
        setLayersVisibility(map, ['blocks-extrusion', 'block-labels'], false);
      }

      const shouldKeepOsmPowerGrid = showPowerGrid || Boolean(map.getSource('osm-power-grid'));
      if (shouldKeepOsmPowerGrid && osmPowerGridData) {
        ensureGeoJsonSource(map, 'osm-power-grid', osmPowerGridData);
        
        const getVoltageProp = (prop: 'color' | 'width'): any => {
          const group = ['coalesce', ['get', 'voltageGroup'], 'unknown'];
          return [
            'match',
            group,
            'over500', powerGridConfig.voltages.over500[prop],
            'v400', powerGridConfig.voltages.v400[prop],
            'v380', powerGridConfig.voltages.v380?.[prop] ?? '#f59e0b',
            'v154', powerGridConfig.voltages.v154[prop],
            'v33', powerGridConfig.voltages.v33[prop],
            'under33', powerGridConfig.voltages.under33[prop],
            powerGridConfig.voltages.unknown[prop]
          ];
        };

        if (powerGridConfig.elements.lines.show || powerGridConfig.elements.cables.show) {
          const typeFilter = [];
          if (powerGridConfig.elements.lines.show) typeFilter.push('line', 'minor_line');
          if (powerGridConfig.elements.cables.show) typeFilter.push('cable');

          ensureLayer(map, {
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
          map.setFilter('osm-power-lines', ['in', ['get', 'type'], ['literal', typeFilter]]);
          map.setPaintProperty('osm-power-lines', 'line-color', getVoltageProp('color'));
          map.setPaintProperty('osm-power-lines', 'line-width', [
            '*',
            getVoltageProp('width'),
            ['case',
              ['==', ['get', 'type'], 'cable'], ['*', powerGridConfig.elements.cables.size || 0.5, 1.1],
              ['*', powerGridConfig.elements.lines.size || 0.5, 1.1]
            ]
          ]);
          map.setPaintProperty('osm-power-lines', 'line-opacity', 0.85);
          setLayerVisibility(map, 'osm-power-lines', showPowerGrid);
        }
        
        if (powerGridConfig.elements.substation.show || powerGridConfig.elements.plant.show) {
          const pointTypes = [];
          if (powerGridConfig.elements.substation.show) pointTypes.push('substation');
          if (powerGridConfig.elements.plant.show) pointTypes.push('plant');

          ensureLayer(map, {
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
          map.setFilter('osm-power-points', ['in', ['get', 'type'], ['literal', pointTypes]]);
          map.setPaintProperty('osm-power-points', 'text-color', getVoltageProp('color'));
          setLayerVisibility(map, 'osm-power-points', showPowerGrid);
        }

        if (!(powerGridConfig.elements.lines.show || powerGridConfig.elements.cables.show)) {
          setLayerVisibility(map, 'osm-power-lines', false);
        }
        if (!(powerGridConfig.elements.substation.show || powerGridConfig.elements.plant.show)) {
          setLayerVisibility(map, 'osm-power-points', false);
        }

        // Add tooltips
        {
          const showTooltip = (e: any) => {
            map.getCanvas().style.cursor = 'pointer';
            const feature = e.features[0];
            const props = feature.properties;
            const html = popupTooltip(props.name || 'İsimsiz', [
              ['Tip', props.type || 'Bilinmiyor'],
              ['Gerilim', formatGridVoltageLabel(props.voltageKv ?? props.voltage)],
            ]);
            
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

          bindLayerEvent(map, 'mouseenter', 'osm-power-lines', showTooltip);
          bindLayerEvent(map, 'mouseleave', 'osm-power-lines', hideTooltip);
          bindLayerEvent(map, 'mouseenter', 'osm-power-points', showTooltip);
          bindLayerEvent(map, 'mouseleave', 'osm-power-points', hideTooltip);
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
        ensureGeoJsonSource(map, 'candidates', candidates);
        ensureLayer(map, {
          id: 'candidate-labels',
          type: 'symbol',
          source: 'candidates',
          layout: { 'text-field': ['get', 'name'], 'text-size': 11, 'text-offset': [0, 1.4], 'text-font': ['Noto Sans Regular'] },
          paint: { 'text-color': '#eafff2', 'text-halo-color': '#04100c', 'text-halo-width': 1.2 },
        });
        setLayerVisibility(map, 'candidate-labels', true);
        
        sites.forEach((candidate) => {
          const markerColor = candidate.id === selectedId ? '#ff2a55' : getSiteColor(candidate);
          const center = getSiteCenter(candidate);
          let cached = candidateMarkersRef.current.get(candidate.id);
          if (!cached) {
            const el = document.createElement('div');
            cached = {
              element: el,
              marker: new maplibregl.Marker({ element: el }).setLngLat(center).addTo(map),
            };
            candidateMarkersRef.current.set(candidate.id, cached);
          }
          const { element: el, marker } = cached;
          el.innerHTML = getMarkerIconHtml(isSeaLowerReservoir(candidate) ? 'sea' : 'classic', markerColor, candidate.id === selectedId);
          el.classList.toggle('active-marker', candidate.id === selectedId);
          el.style.display = '';
          marker.setLngLat(center);
          if (cached.clickHandler) {
            el.removeEventListener('click', cached.clickHandler);
            cached.clickHandler = undefined;
          }

          if (interactiveCandidates) {
            el.style.cursor = 'pointer';
            const clickHandler = (e: Event) => {
              e.stopPropagation();
              onSelectSiteRef.current?.(candidate.id);
              const popupContent = document.createElement('div');
              popupContent.innerHTML = `
                <div class="map-popup-card map-popup-card--candidate">
                  <div class="map-popup-kicker">PDHES Aday Sahası</div>
                  <div class="map-popup-title">${escapeHtml(candidate.name)}</div>
                  ${popupChip(PDHES_TYPE_LABELS[candidate.pdhesType])}
                  <div class="map-popup-grid">
                    ${popupMetric('Güç', `${num(candidate.capacityMW)} MW${candidate.energyGWh ? ` / ${num(candidate.energyGWh)} GWh` : ''}`)}
                    ${popupMetric('Düşü', `${num(candidate.headM)} m / ${popupWaterwayText(candidate)}`)}
                    ${popupMetric('Sınıf', CYCLE_TYPE_LABELS[candidate.technicalClassification.cycleType])}
                  </div>
                  <div class="map-popup-actions">
                    <a class="map-popup-action primary" href="#/3d">3D Çizim</a>
                    ${['kamu-gokcekaya-pspp', 'kamu-sariyar-pspp'].includes(candidate.id)
                      ? `<button class="show-3d-btn map-popup-action secondary" type="button">Görsel</button>`
                      : `<button class="show-3d-btn map-popup-action disabled" type="button" disabled>Görsel Yok</button>`
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

              activePopupRef.current?.remove();
              activePopupRef.current = new maplibregl.Popup({ closeButton: true, offset: 16, maxWidth: CANDIDATE_POPUP_MAX_WIDTH })
                .setLngLat(center)
                .setDOMContent(popupContent)
                .addTo(map);
            };
            el.addEventListener('click', clickHandler);
            cached.clickHandler = clickHandler;
          } else {
            el.style.cursor = '';
          }
        });
        const activeCandidateIds = new Set(sites.map(candidate => candidate.id));
        candidateMarkersRef.current.forEach((cached, id) => {
          if (!activeCandidateIds.has(id)) {
            if (cached.clickHandler) cached.element.removeEventListener('click', cached.clickHandler);
            cached.popup?.remove();
            cached.marker.remove();
            candidateMarkersRef.current.delete(id);
          }
        });
      } else {
        setLayerVisibility(map, 'candidate-labels', false);
        candidateMarkersRef.current.forEach((cached) => {
          cached.element.style.display = 'none';
        });
      }
      // Add World Examples
      WORLD_EXAMPLES_DETAILED.forEach((example) => {
        const isWorldSelected = example.id === worldExampleFocusId;
        let cached = worldMarkersRef.current.get(example.id);
        const el = cached?.element ?? document.createElement('div');
        el.innerHTML = getMarkerIconHtml('classic', isWorldSelected ? '#ff2a55' : '#00a8ff', isWorldSelected);
        el.classList.toggle('active-marker', isWorldSelected);
        el.style.cursor = 'pointer';
        el.style.zIndex = isWorldSelected ? '10' : '1';
        
        if (!cached) {
          cached = {
            element: el,
            marker: new maplibregl.Marker({ element: el }).setLngLat([example.lon || 0, example.lat || 0]).addTo(map),
          };
          worldMarkersRef.current.set(example.id, cached);
        } else {
          cached.marker.setLngLat([example.lon || 0, example.lat || 0]);
        }

        const popupHtml = `
          <div class="map-popup-card map-popup-card--world we-popup-content">
            <div class="map-popup-kicker">${escapeHtml(example.country)} &middot; ${escapeHtml(example.status)}</div>
            <div class="map-popup-title">${escapeHtml(example.name)}</div>
            ${popupChip(example.type)}
            <div class="map-popup-grid">
              ${popupMetric('Güç', `${String(example.capacityMw)} MW`)}
              ${popupMetric('Enerji', `${String(example.storageMwh)} MWh`)}
              ${popupMetric('Düşü', `${String(example.headM)} m`)}
              ${popupMetric('Yıl', String(example.commissioningYear))}
            </div>
            ${example.wikiUrl ? `<div class="map-popup-actions"><a class="map-popup-action primary" href="${escapeHtml(example.wikiUrl)}" target="_blank" rel="noopener noreferrer">Wiki ↗</a></div>` : ''}
          </div>
        `;

        if (!cached.popup) {
          const popup = new maplibregl.Popup({ closeButton: true, offset: 12, maxWidth: WORLD_POPUP_MAX_WIDTH })
            .setLngLat([example.lon || 0, example.lat || 0])
            .setHTML(popupHtml);

          popup.on('open', () => {
            const { setWorldExampleFocus } = useSiteStore.getState();
            setWorldExampleFocus(example.id);
          });

          popup.on('close', () => {
            // popup oto-kapanınca worldExampleFocusId temizlenmesini engelliyoruz ki
            // kullanıcının haritası aniden Türkiye'ye dönmesin.
          });

          cached.popup = popup;
          cached.marker.setPopup(popup);
        } else {
          cached.popup.setLngLat([example.lon || 0, example.lat || 0]).setHTML(popupHtml);
        }

        // Storing popup in the element so we can access it programmatically later if needed
        (el as any)._popup = cached.popup;
        el.id = `we-marker-${example.id}`;
      });

    };
    run();
  }, [bindLayerEvent, draftingMode, heightScale, interactiveCandidates, layers, osmPowerGridData, osmPowerGridUrl, powerGridConfig, projectGridSources, projectLayout, selectedId, site, sites, showPowerGrid, worldExampleFocusId]);

  useEffect(() => {
    queueDrawLayersRef.current = queueDrawLayers;
  }, [queueDrawLayers]);

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
    setTimeout(() => {
      const details = document.querySelector('details.maplibregl-ctrl-attrib');
      if (details) details.removeAttribute('open');
    }, 200);
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
    mapRef.current = map;
    mapStyleRef.current = mapStyle;
    useMapToolsStore.getState().setMap(map);
    
    map.on('load', () => {
      queueDrawLayersRef.current();
    });

    let moveEndTimeout: any;
    map.on('moveend', () => {
      clearTimeout(moveEndTimeout);
      moveEndTimeout = setTimeout(() => {
        queueDrawLayersRef.current();
      }, 400); // Wait for terrain to settle to avoid extrusion elevation issues
    });
    
    map.on('contextmenu', (e: maplibregl.MapMouseEvent) => {
      const { mode, isDrawing, setIsDrawing, openContextMenu } = useMapToolsStore.getState();
      if (mode === 'measure' && isDrawing) {
        setIsDrawing(false);
      } else {
        openContextMenu(e.point.x, e.point.y, e.lngLat);
      }
    });

    map.on('error', (e: maplibregl.ErrorEvent) => {
      const error = e?.error as { status?: number; message?: string } | undefined;
      if (error?.status === 403 || error?.status === 401 || error?.message?.includes('403')) {
        const currentStyle = useSettingsStore.getState().mapStyle;
        if (currentStyle.includes('maptiler')) {
          console.warn('MapTiler kota aşımı / yetki hatası tespit edildi. Açık kaynaklı sağlayıcıya geçiliyor...');
          useSettingsStore.getState().setMapStyle(currentStyle.includes('hybrid') || currentStyle.includes('satellite') ? 'satellite' : 'osm');
        }
      }
    });

    map.on('click', (e: maplibregl.MapMouseEvent) => {
      const { mode, addMeasurementPoint } = useMapToolsStore.getState();
      if (mode === 'measure') {
        addMeasurementPoint([e.lngLat.lng, e.lngLat.lat]);
      }
    });

    return () => {
      drawRequestRef.current += 1;
      waitingForStyleRef.current = false;
      activePopupRef.current?.remove();
      activePopupRef.current = null;
      candidateMarkersRef.current.forEach((cached) => {
        if (cached.clickHandler) cached.element.removeEventListener('click', cached.clickHandler);
        cached.popup?.remove();
        cached.marker.remove();
      });
      candidateMarkersRef.current.clear();
      worldMarkersRef.current.forEach((cached) => {
        cached.popup?.remove();
        cached.marker.remove();
      });
      worldMarkersRef.current.clear();
      layerEventCleanupRef.current.forEach((cleanup) => cleanup());
      layerEventCleanupRef.current = [];
      boundLayerEventsRef.current.clear();
      (map as any)._blockPopup?.remove?.();
      (map as any)._pgPopup?.remove?.();
      useMapToolsStore.getState().setMap(null);
      map.remove();
      mapRef.current = null;
    };
    // Map creation is intentionally tied only to first data availability.
    // Site/style updates redraw layers without recreating the map instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, canCreateMap]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !site) return;
    if (mapStyleRef.current === mapStyle) return;
    mapStyleRef.current = mapStyle;
    layerEventCleanupRef.current.forEach((cleanup) => cleanup());
    layerEventCleanupRef.current = [];
    boundLayerEventsRef.current.clear();
    map.setStyle(getMapStyleSpecification(mapStyle));
    queueDrawLayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStyle]);

  useEffect(() => {
    queueDrawLayers();
  }, [queueDrawLayers]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !site || disableAutoFlyTo) return;
    if (worldExampleFocusId) return; // Do not fly to site if a world example is currently focused
    const view = getSiteView(site);
    map.flyTo({
      center: view.center,
      zoom: view.zoom,
      pitch: view.pitch,
      bearing: view.bearing,
      duration: 2500,
    });
  }, [selectedId, site, worldExampleFocusId]);

  return { mapRef, osmPowerGridStatus, osmPowerGridError };
}
