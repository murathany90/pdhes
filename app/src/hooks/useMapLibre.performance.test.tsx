// @vitest-environment jsdom

import type { FeatureCollection } from 'geojson';
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRef } from 'react';
import { DEFAULT_POWER_GRID_CONFIG, useSettingsStore, type PowerGridConfig } from '../stores/useSettingsStore';
import { useMapToolsStore } from '../stores/useMapToolsStore';
import { makeTestSite } from '../test-utils/makeTestSite';
import type { Site } from '../types/site';
import { useMapLibre, type MapLayerVisibility } from './useMapLibre';

const mapMockState = vi.hoisted(() => ({
  maps: [] as any[],
  markers: [] as any[],
  popups: [] as any[],
}));

vi.mock('../data/worldExamplesDetailed', () => ({
  WORLD_EXAMPLES_DETAILED: [
    {
      id: 'world-one',
      name: 'World One',
      country: 'Test',
      status: 'Operational',
      capacityMw: '100',
      storageMwh: '500',
      headM: '100',
      lon: 30,
      lat: 40,
      wikiUrl: null,
    },
  ],
}));

vi.mock('maplibre-gl', () => {
  class FakeGeoJsonSource {
    data: unknown;
    setData = vi.fn((data: unknown) => {
      this.data = data;
    });

    constructor(data: unknown) {
      this.data = data;
    }
  }

  class FakeMap {
    styleLoaded = false;
    removed = false;
    sources = new Map<string, FakeGeoJsonSource>();
    layers = new Set<string>();
    handlers = new Map<string, Set<(...args: any[]) => void>>();
    layerHandlers = new Map<string, Set<(...args: any[]) => void>>();
    sourceAddCounts = new Map<string, number>();
    layerAddCounts = new Map<string, number>();
    addControl = vi.fn();
    addSource = vi.fn((id: string, source: any) => {
      this.sources.set(id, new FakeGeoJsonSource(source.data));
      this.sourceAddCounts.set(id, (this.sourceAddCounts.get(id) ?? 0) + 1);
    });
    addLayer = vi.fn((layer: { id: string }) => {
      this.layers.add(layer.id);
      this.layerAddCounts.set(layer.id, (this.layerAddCounts.get(layer.id) ?? 0) + 1);
    });
    removeLayer = vi.fn((id: string) => this.layers.delete(id));
    removeSource = vi.fn((id: string) => this.sources.delete(id));
    setLayoutProperty = vi.fn();
    setPaintProperty = vi.fn();
    setFilter = vi.fn();
    setTerrain = vi.fn();
    setStyle = vi.fn(() => {
      this.styleLoaded = false;
    });
    flyTo = vi.fn();
    getCanvas = vi.fn(() => ({ style: {} }));
    getStyle = vi.fn(() => (this.removed ? undefined : { version: 8 }));
    isStyleLoaded = vi.fn(() => this.styleLoaded);
    getSource = vi.fn((id: string) => this.sources.get(id));
    getLayer = vi.fn((id: string) => this.layers.has(id) ? { id } : undefined);
    on = vi.fn((event: string, layerOrHandler: string | ((...args: any[]) => void), maybeHandler?: (...args: any[]) => void) => {
      if (typeof layerOrHandler === 'string') {
        const key = `${event}:${layerOrHandler}`;
        const set = this.layerHandlers.get(key) ?? new Set();
        if (maybeHandler) set.add(maybeHandler);
        this.layerHandlers.set(key, set);
        return this;
      }
      const set = this.handlers.get(event) ?? new Set();
      set.add(layerOrHandler);
      this.handlers.set(event, set);
      return this;
    });
    once = vi.fn((event: string, handler: (...args: any[]) => void) => {
      const onceHandler = (...args: any[]) => {
        this.off(event, onceHandler);
        handler(...args);
      };
      this.on(event, onceHandler);
      return this;
    });
    off = vi.fn((event: string, layerOrHandler: string | ((...args: any[]) => void), maybeHandler?: (...args: any[]) => void) => {
      if (typeof layerOrHandler === 'string') {
        this.layerHandlers.get(`${event}:${layerOrHandler}`)?.delete(maybeHandler!);
        return this;
      }
      this.handlers.get(event)?.delete(layerOrHandler);
      return this;
    });
    fire(event: string, payload: any = {}) {
      if (event === 'load' || event === 'styledata') this.styleLoaded = true;
      [...(this.handlers.get(event) ?? [])].forEach((handler) => handler(payload));
    }
    remove = vi.fn(() => {
      this.removed = true;
    });

    constructor() {
      mapMockState.maps.push(this);
    }
  }

  class FakeMarker {
    element: HTMLElement;
    remove = vi.fn();
    addTo = vi.fn(() => this);
    setLngLat = vi.fn(() => this);
    setPopup = vi.fn(() => this);
    getElement = vi.fn(() => this.element);

    constructor(options: { element?: HTMLElement } = {}) {
      this.element = options.element ?? document.createElement('div');
      mapMockState.markers.push(this);
    }
  }

  class FakePopup {
    options: any;
    html = '';
    content: HTMLElement | null = null;
    remove = vi.fn();
    addTo = vi.fn(() => this);
    setLngLat = vi.fn(() => this);
    setHTML = vi.fn((html: string) => {
      this.html = html;
      return this;
    });
    setDOMContent = vi.fn((content: HTMLElement) => {
      this.content = content;
      return this;
    });
    on = vi.fn(() => this);
    isOpen = vi.fn(() => false);

    constructor(options: any = {}) {
      this.options = options;
      mapMockState.popups.push(this);
    }
  }

  return {
    default: {
      Map: FakeMap,
      Marker: FakeMarker,
      Popup: FakePopup,
      AttributionControl: class {},
      NavigationControl: class {},
    },
  };
});

const DEFAULT_LAYERS: MapLayerVisibility = {
  candidates: true,
  projectLayout: true,
  risk: true,
  waterPath: true,
  powerGrid: true,
  terrain3d: true,
  upperReservoir: true,
  lowerReservoir: true,
  powerhouse: true,
  surgeTank: true,
  switchyard3d: true,
  portal: true,
};

const gridAssets: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', geometry: { type: 'LineString', coordinates: [[30, 40], [31, 41]] }, properties: { voltage: '400' } },
    { type: 'Feature', geometry: { type: 'LineString', coordinates: [[30, 39], [31, 40]] }, properties: { voltage: '154' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [30, 40] }, properties: { voltage: '400' } },
  ],
};

function Harness({
  layers,
  site,
  sites = [site],
  mapStyle = 'satellite',
}: {
  layers: MapLayerVisibility;
  site: Site;
  sites?: Site[];
  mapStyle?: 'satellite' | 'light';
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  useMapLibre({
    containerRef,
    site,
    sites,
    selectedId: site.id,
    mapStyle,
    heightScale: 1.1,
    gridAssets,
    layers,
    onSelectSite: vi.fn(),
  });
  return <div ref={containerRef} />;
}

function latestMap() {
  return mapMockState.maps.at(-1);
}

describe('useMapLibre performance behavior', () => {
  beforeEach(() => {
    mapMockState.maps.length = 0;
    mapMockState.markers.length = 0;
    mapMockState.popups.length = 0;
    useSettingsStore.setState({
      showPowerGrid: false,
      powerGridConfig: structuredClone(DEFAULT_POWER_GRID_CONFIG) as PowerGridConfig,
    });
    useMapToolsStore.setState({ map: null, mode: 'default', isDrawing: false, measurementPoints: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
    vi.clearAllMocks();
  });

  it('keeps stable GeoJSON sources when only candidate visibility changes', () => {
    const site = makeTestSite();
    const { rerender } = render(<Harness site={site} layers={DEFAULT_LAYERS} />);
    const map = latestMap();

    act(() => map.fire('load'));
    expect(map.sourceAddCounts.get('risk')).toBe(1);
    expect(map.sourceAddCounts.get('water')).toBe(1);
    expect(map.sourceAddCounts.get('projectGrid')).toBe(1);

    rerender(<Harness site={site} layers={{ ...DEFAULT_LAYERS, candidates: false }} />);

    expect(map.sourceAddCounts.get('risk')).toBe(1);
    expect(map.sourceAddCounts.get('water')).toBe(1);
    expect(map.sourceAddCounts.get('projectGrid')).toBe(1);
    expect(map.setLayoutProperty).toHaveBeenCalledWith('candidate-labels', 'visibility', 'none');
  });

  it('does not recreate marker DOM nodes when candidate layer is toggled', () => {
    const site = makeTestSite();
    const { rerender } = render(<Harness site={site} layers={DEFAULT_LAYERS} />);
    const map = latestMap();

    act(() => map.fire('load'));
    const initialMarkerCount = mapMockState.markers.length;

    rerender(<Harness site={site} layers={{ ...DEFAULT_LAYERS, candidates: false }} />);
    rerender(<Harness site={site} layers={DEFAULT_LAYERS} />);

    expect(mapMockState.markers).toHaveLength(initialMarkerCount);
  });

  it('keeps the OSM power-grid source stable across global grid toggles', async () => {
    const site = makeTestSite();
    useSettingsStore.setState({ showPowerGrid: true });
    render(<Harness site={site} layers={DEFAULT_LAYERS} />);
    const map = latestMap();

    act(() => map.fire('load'));
    expect(map.sourceAddCounts.get('osm-power-grid')).toBe(1);

    await act(async () => {
      useSettingsStore.setState({ showPowerGrid: false });
    });
    await act(async () => {
      useSettingsStore.setState({ showPowerGrid: true });
    });

    expect(map.sourceAddCounts.get('osm-power-grid')).toBe(1);
    expect(map.setLayoutProperty).toHaveBeenCalledWith('osm-power-lines', 'visibility', 'none');
    expect(map.setLayoutProperty).toHaveBeenCalledWith('osm-power-lines', 'visibility', 'visible');
  });

  it('keeps 3D terrain enabled after moveend redraws from the initial 2D render', () => {
    vi.useFakeTimers();
    const site = makeTestSite();
    const twoDimensionalLayers = { ...DEFAULT_LAYERS, terrain3d: false };
    const threeDimensionalLayers = { ...DEFAULT_LAYERS, terrain3d: true };
    const { rerender } = render(<Harness site={site} layers={twoDimensionalLayers} />);
    const map = latestMap();

    act(() => map.fire('load'));
    expect(map.setTerrain).toHaveBeenLastCalledWith(null);

    rerender(<Harness site={site} layers={threeDimensionalLayers} />);
    expect(map.setTerrain).toHaveBeenLastCalledWith({ source: 'terrainSource', exaggeration: 1.1 * 1.3 });

    act(() => {
      map.fire('moveend');
      vi.advanceTimersByTime(450);
    });

    expect(map.setTerrain).toHaveBeenLastCalledWith({ source: 'terrainSource', exaggeration: 1.1 * 1.3 });
  });

  it('re-applies 3D terrain after style reloads finish', () => {
    const site = makeTestSite();
    const { rerender } = render(<Harness site={site} layers={DEFAULT_LAYERS} mapStyle="satellite" />);
    const map = latestMap();

    act(() => map.fire('load'));
    expect(map.setTerrain).toHaveBeenLastCalledWith({ source: 'terrainSource', exaggeration: 1.1 * 1.3 });

    rerender(<Harness site={site} layers={DEFAULT_LAYERS} mapStyle="light" />);
    expect(map.setStyle).toHaveBeenCalledTimes(1);

    act(() => map.fire('styledata'));

    expect(map.setTerrain).toHaveBeenLastCalledWith({ source: 'terrainSource', exaggeration: 1.1 * 1.3 });
  });

  it('uses responsive popup card markup for candidate and world example popups', () => {
    const site = makeTestSite({ id: 'candidate-one', name: 'Candidate One PDHES' });
    render(<Harness site={site} layers={DEFAULT_LAYERS} />);
    const map = latestMap();

    act(() => map.fire('load'));
    const candidateMarker = mapMockState.markers.find((marker) => marker.element.id !== 'we-marker-world-one');
    act(() => {
      candidateMarker.element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    const candidatePopup = mapMockState.popups.at(-1);
    expect(candidatePopup.options.closeButton).toBe(true);
    expect(candidatePopup.content?.querySelector('.map-popup-card')).toBeTruthy();
    expect(candidatePopup.content?.querySelector('.map-popup-actions')).toBeTruthy();

    const worldPopup = mapMockState.popups.find((popup) => popup.html.includes('World One'));
    expect(worldPopup.options.closeButton).toBe(true);
    expect(worldPopup.html).toContain('map-popup-card');
    expect(worldPopup.html).toContain('map-popup-grid');
  });

  it('cleans map tools store and marker artifacts on unmount', () => {
    const site = makeTestSite();
    const { unmount } = render(<Harness site={site} layers={DEFAULT_LAYERS} />);
    const map = latestMap();
    act(() => map.fire('load'));

    unmount();

    expect(useMapToolsStore.getState().map).toBeNull();
    expect(map.remove).toHaveBeenCalledTimes(1);
    expect(mapMockState.markers.every((marker) => marker.remove.mock.calls.length === 1)).toBe(true);
  });
});
