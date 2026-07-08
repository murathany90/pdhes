import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ScoreWeights } from '../utils/scoring';

export const SETTINGS_STORAGE_KEY = 'pspp-settings-v2';

export const DEFAULT_SCORE_WEIGHTS: ScoreWeights = {
  topo: 25,
  grid: 20,
  env: 15,
  geology: 15,
  access: 10,
  market: 15,
};

export type VoltageGroup = 'under33' | 'v33' | 'v154' | 'v400' | 'over500' | 'unknown' | 'external';
export type ElementGroup = 'lines' | 'cables' | 'substation' | 'plant' | 'substationInner';

export interface PowerGridConfig {
  voltages: Record<VoltageGroup, { color: string; width: number }>;
  elements: Record<ElementGroup, { show: boolean; line?: number; size?: number }>;
}

export const DEFAULT_POWER_GRID_CONFIG: PowerGridConfig = {
  voltages: {
    under33: { color: '#59d57a', width: 2 },
    v33: { color: '#1f9443', width: 2.5 },
    v154: { color: '#1c2633', width: 3 },
    v400: { color: '#ed4344', width: 4 },
    over500: { color: '#b72721', width: 5 },
    unknown: { color: '#f38b2a', width: 1.5 },
    external: { color: '#8c52ff', width: 2.5 },
  },
  elements: {
    lines: { show: true, line: 3, size: 0.5 },
    cables: { show: true, line: 2, size: 0.5 },
    substation: { show: true, size: 0.8 },
    plant: { show: true, size: 0.6 },
    substationInner: { show: true, size: 0.5 },
  }
};

interface SettingsStore {
  theme: 'dark' | 'light';
  mapStyle: 'dark' | 'light' | 'satellite';
  heightScale: number;
  weights: ScoreWeights;
  setTheme: (t: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setMapStyle: (s: 'dark' | 'light' | 'satellite') => void;
  setHeightScale: (v: number) => void;
  setWeight: (key: keyof SettingsStore['weights'], v: number) => void;
  showPowerGrid: boolean;
  powerGridConfig: PowerGridConfig;
  setShowPowerGrid: (v: boolean) => void;
  updatePowerGridVoltage: (group: VoltageGroup, updates: Partial<{ color: string; width: number }>) => void;
  updatePowerGridElement: (group: ElementGroup, updates: Partial<{ show: boolean; line: number; size: number }>) => void;
}

function legacyTheme(): 'dark' | 'light' {
  if (typeof localStorage === 'undefined') return 'light';
  return localStorage.getItem('pspp-theme') === 'dark' ? 'dark' : 'light';
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      theme: legacyTheme(),
      mapStyle: 'satellite',
      heightScale: 1.3,
      weights: DEFAULT_SCORE_WEIGHTS,
      showPowerGrid: false,
      powerGridConfig: DEFAULT_POWER_GRID_CONFIG,
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('pspp-theme', theme);
        set({ theme });
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(next);
      },
      setMapStyle: (mapStyle) => set({ mapStyle }),
      setHeightScale: (heightScale) => set({ heightScale }),
      setWeight: (key, value) => set((state) => ({
        weights: { ...state.weights, [key]: value },
      })),
      setShowPowerGrid: (showPowerGrid) => set({ showPowerGrid }),
      updatePowerGridVoltage: (group, updates) => set((state) => ({
        powerGridConfig: {
          ...state.powerGridConfig,
          voltages: {
            ...state.powerGridConfig.voltages,
            [group]: { ...state.powerGridConfig.voltages[group], ...updates }
          }
        }
      })),
      updatePowerGridElement: (group, updates) => set((state) => ({
        powerGridConfig: {
          ...state.powerGridConfig,
          elements: {
            ...state.powerGridConfig.elements,
            [group]: { ...state.powerGridConfig.elements[group], ...updates }
          }
        }
      })),
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ theme, mapStyle, heightScale, weights, showPowerGrid, powerGridFilters }) => ({
        theme,
        mapStyle,
        heightScale,
        weights,
        showPowerGrid,
        powerGridConfig,
      }),
    },
  ),
);
