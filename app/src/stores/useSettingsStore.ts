import { create } from 'zustand';

interface SettingsStore {
  theme: 'dark' | 'light';
  mapStyle: 'dark' | 'light' | 'satellite';
  heightScale: number;
  weights: { topo: number; grid: number; env: number; geo: number };
  setTheme: (t: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setMapStyle: (s: 'dark' | 'light' | 'satellite') => void;
  setHeightScale: (v: number) => void;
  setWeight: (key: keyof SettingsStore['weights'], v: number) => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  theme: (localStorage.getItem('pspp-theme') as 'dark' | 'light') || 'light',
  mapStyle: 'satellite',
  heightScale: 1.3,
  weights: { topo: 30, grid: 20, env: 15, geo: 10 },
  setTheme: (t) => {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('pspp-theme', t);
    set({ theme: t });
  },
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },
  setMapStyle: (s) => set({ mapStyle: s }),
  setHeightScale: (v) => set({ heightScale: v }),
  setWeight: (key, v) => set((s) => ({ weights: { ...s.weights, [key]: v } })),
}));
