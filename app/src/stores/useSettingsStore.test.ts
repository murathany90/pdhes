// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_POWER_GRID_CONFIG, SETTINGS_STORAGE_KEY, useSettingsStore } from './useSettingsStore';

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

  it('fills newly added voltage groups without replacing saved preferences', async () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({
      state: {
        theme: 'dark',
        mapStyle: 'light',
        heightScale: 1.8,
        weights: { ...useSettingsStore.getState().weights, grid: 33 },
        showPowerGrid: true,
        powerGridConfig: {
          voltages: {
            ...DEFAULT_POWER_GRID_CONFIG.voltages,
            v400: { color: '#123456', width: 7 },
          },
          elements: DEFAULT_POWER_GRID_CONFIG.elements,
        },
      },
      version: 3,
    }));

    await useSettingsStore.persist.rehydrate();

    expect(useSettingsStore.getState().theme).toBe('dark');
    expect(useSettingsStore.getState().heightScale).toBe(1.8);
    expect(useSettingsStore.getState().powerGridConfig.voltages.v400).toEqual({ color: '#123456', width: 7 });
    expect(useSettingsStore.getState().powerGridConfig.voltages.v380).toEqual(DEFAULT_POWER_GRID_CONFIG.voltages.v380);
  });
});
