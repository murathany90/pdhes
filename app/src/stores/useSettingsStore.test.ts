// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import { SETTINGS_STORAGE_KEY, useSettingsStore } from './useSettingsStore';

describe('useSettingsStore persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.setState({
      theme: 'light',
      mapStyle: 'satellite',
      heightScale: 1.1,
      weights: {
        topo: 25,
        grid: 20,
        env: 15,
        geology: 15,
        access: 10,
        market: 15,
      },
    });
  });

  it('persists map, terrain, and all scoring preferences', () => {
    useSettingsStore.getState().setMapStyle('dark');
    useSettingsStore.getState().setHeightScale(2.2);
    useSettingsStore.getState().setWeight('market', 24);

    const stored = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}');
    expect(stored.state.mapStyle).toBe('dark');
    expect(stored.state.heightScale).toBe(2.2);
    expect(stored.state.weights.market).toBe(24);
  });
});
