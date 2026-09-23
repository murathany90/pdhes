// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';
import type { FeatureCollection, Geometry } from 'geojson';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { focusSelectedEntityOnce, type FocusDatasets } from './mapCamera';

function emptyCollection(): FeatureCollection<Geometry> {
  return { type: 'FeatureCollection', features: [] };
}

describe('focusSelectedEntityOnce', () => {
  it('remembers a selection only after focus succeeds, including when data arrives late', () => {
    const selection = { type: 'hes', id: 'plant-1' };
    const focusedSelection = { current: null as string | null };
    const map = { fitBounds: vi.fn(), flyTo: vi.fn() } as unknown as MapLibreMap;
    const datasets: FocusDatasets = {
      rivers: emptyCollection(),
      basins: emptyCollection(),
      dams: emptyCollection(),
      hes177: emptyCollection(),
      cascades: emptyCollection(),
    };

    expect(focusSelectedEntityOnce(focusedSelection, 'hes:plant-1', map, selection, datasets)).toBe(false);
    expect(focusedSelection.current).toBeNull();

    datasets.hes177.features.push({
      type: 'Feature',
      id: 'plant-1',
      properties: { id: 'plant-1' },
      geometry: { type: 'Point', coordinates: [31, 40] },
    });
    expect(focusSelectedEntityOnce(focusedSelection, 'hes:plant-1', map, selection, datasets)).toBe(true);
    expect(focusedSelection.current).toBe('hes:plant-1');
    expect(map.flyTo).toHaveBeenCalledTimes(1);

    expect(focusSelectedEntityOnce(focusedSelection, 'hes:plant-1', map, selection, datasets)).toBe(true);
    expect(map.flyTo).toHaveBeenCalledTimes(1);
  });
});
