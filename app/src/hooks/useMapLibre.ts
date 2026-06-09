import { useCallback, useEffect, useRef, type RefObject } from 'react';
import maplibregl from 'maplibre-gl';
import type { FeatureCollection, Geometry } from 'geojson';
import type { Site } from '../types/site';
import { escapeHtml } from '../utils/format';
import { buildLayout } from '../utils/layout';

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
  mapStyle: 'dark' | 'light' | 'satellite';
  heightScale: number;
  gridAssets: FeatureCollection | null;
  layers: MapLayerVisibility;
  onSelectSite?: (id: string) => void;
  interactiveCandidates?: boolean;
}

function getMapStyle(kind: string): maplibregl.StyleSpecification {
  const glyphs = 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf';
  const sources: Record<string, any> = {
    base: {
      type: 'raster',
      tileSize: 256,
      maxzoom: 22
    },
    terrainSource: {
      type: 'raster-dem',
      tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
      tileSize: 256,
      encoding: 'terrarium',
      maxzoom: 15
    }
  };

  if (kind === 'satellite') {
    sources.base.tiles = ['https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'];
  } else if (kind === 'light') {
    sources.base.tiles = ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'];
  } else {
    sources.base.tiles = ['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'];
  }

  return {
    version: 8,
    glyphs,
    sources,
    layers: [{ id: 'base', type: 'raster', source: 'base' }],
  };
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
  const canCreateMap = Boolean(site);

  useEffect(() => {
    onSelectSiteRef.current = onSelectSite;
  }, [onSelectSite]);

  const handleCandidateClick = useCallback((event: maplibregl.MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    const id = feature?.properties?.id;
    if (!feature || !id) return;
    onSelectSiteRef.current?.(id);
    const map = mapRef.current;
    if (map) {
      new maplibregl.Popup()
        .setLngLat(event.lngLat)
        .setHTML(`<b>${escapeHtml(feature.properties?.name)}</b><br><span>${escapeHtml(feature.properties?.concept)}</span>`)
        .addTo(map);
    }
  }, []);

  const queueDrawLayers = useCallback(() => {
    const map = mapRef.current;
    if (!map || !site) return;
    const requestId = ++drawRequestRef.current;
    const run = () => {
      if (requestId !== drawRequestRef.current) return;
      if (!map.isStyleLoaded()) {
        map.once('styledata', run);
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
            'fill-extrusion-opacity': [
              'match',
              ['get', 'key'],
              ['upper_reservoir', 'lower_reservoir'], 0.50,
              0.85
            ],
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
          id: 'candidate-circles',
          type: 'circle',
          source: 'candidates',
          paint: {
            'circle-radius': ['case', ['==', ['get', 'id'], selectedId], 9, 6],
            'circle-color': ['get', 'color'],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#07110e',
            'circle-opacity': 0.95,
          },
        });
        map.addLayer({
          id: 'candidate-labels',
          type: 'symbol',
          source: 'candidates',
          layout: { 'text-field': ['get', 'name'], 'text-size': 11, 'text-offset': [0, 1.4], 'text-font': ['Noto Sans Regular'] },
          paint: { 'text-color': '#eafff2', 'text-halo-color': '#04100c', 'text-halo-width': 1.2 },
        });
        if (interactiveCandidates) {
          map.on('click', 'candidate-circles', handleCandidateClick);
        }
      }
    };
    run();
  }, [gridAssets, handleCandidateClick, heightScale, interactiveCandidates, layers, selectedId, site, sites]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !site) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: getMapStyle(mapStyle),
      center: site.view.center,
      zoom: site.view.zoom,
      pitch: site.view.pitch,
      bearing: site.view.bearing,
      attributionControl: false,
      maxZoom: 22,
    });
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
    mapRef.current = map;
    mapStyleRef.current = mapStyle;
    queueDrawLayers();
    return () => {
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
    map.setStyle(getMapStyle(mapStyle));
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
