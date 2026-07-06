import { create } from 'zustand';
import type { FeatureCollection } from 'geojson';
import type { Site } from '../types/site';
import { parseWorkspaceImport, serializeWorkspaceSites } from '../utils/workspaceData';

export const SITES_STORAGE_KEY = 'pspp-sites-v1';
const LEGACY_CUSTOM_SITES_KEY = 'pspp-custom-sites-v1';

interface SiteStore {
  sites: Site[];
  baseSites: Site[];
  gridAssets: FeatureCollection | null;
  selectedId: string;
  worldExampleFocusId: string | null;
  loading: boolean;
  selectSite: (id: string) => void;
  setSites: (sites: Site[]) => void;
  setBaseSites: (sites: Site[]) => void;
  setGridAssets: (g: FeatureCollection) => void;
  setLoading: (v: boolean) => void;
  addSite: (site: Site) => void;
  updateSite: (id: string, patch: Partial<Site>) => void;
  deleteSite: (id: string) => void;
  importSites: (json: string) => boolean;
  resetSites: () => void;
  exportSites: () => string;
  selectedSite: () => Site | undefined;
  setWorldExampleFocus: (id: string) => void;
  clearWorldExampleFocus: () => void;
  fetchGridAssets: () => Promise<void>;
}

function readSites(key: string): Site[] | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = parseWorkspaceImport(raw);
    return parsed.ok ? parsed.sites : null;
  } catch {
    return null;
  }
}

function persistSites(sites: Site[]) {
  localStorage.setItem(SITES_STORAGE_KEY, serializeWorkspaceSites(sites));
}

function ensureSelected(sites: Site[], selectedId: string) {
  return sites.some((site) => site.id === selectedId) ? selectedId : sites[0]?.id || '';
}

export function getPersistedSites(): Site[] | null {
  return readSites(SITES_STORAGE_KEY);
}

export function getLegacyCustomSites(): Site[] {
  return readSites(LEGACY_CUSTOM_SITES_KEY) || [];
}

export const useSiteStore = create<SiteStore>((set, get) => ({
  sites: [],
  baseSites: [],
  gridAssets: null,
  selectedId: 'gokcekaya',
  worldExampleFocusId: null,
  loading: true,
  selectSite: (id) => set({ selectedId: id }),
  setSites: (sites) => set((state) => ({ sites, selectedId: ensureSelected(sites, state.selectedId) })),
  setBaseSites: (sites) => set({ baseSites: sites }),
  setGridAssets: (g) => set({ gridAssets: g }),
  setLoading: (v) => set({ loading: v }),
  addSite: (site) => {
    set((state) => {
      const sites = [...state.sites.filter((item) => item.id !== site.id), site];
      persistSites(sites);
      return { sites, selectedId: site.id };
    });
  },
  updateSite: (id, patch) => {
    set((state) => {
      const sites = state.sites.map((site) => (site.id === id ? { ...site, ...patch } : site));
      persistSites(sites);
      return { sites };
    });
  },
  deleteSite: (id) => {
    set((state) => {
      const sites = state.sites.filter((site) => site.id !== id);
      persistSites(sites);
      return { sites, selectedId: ensureSelected(sites, state.selectedId) };
    });
  },
  importSites: (json) => {
    const parsed = parseWorkspaceImport(json);
    if (!parsed.ok) return false;
    persistSites(parsed.sites);
    set((state) => ({ sites: parsed.sites, selectedId: ensureSelected(parsed.sites, state.selectedId) }));
    return true;
  },
  resetSites: () => {
    const baseSites = get().baseSites;
    localStorage.removeItem(SITES_STORAGE_KEY);
    set((state) => ({ sites: baseSites, selectedId: ensureSelected(baseSites, state.selectedId) }));
  },
  exportSites: () => serializeWorkspaceSites(get().sites),
  selectedSite: () => {
    const state = get();
    return state.sites.find((s) => s.id === state.selectedId) || state.sites[0];
  },
  setWorldExampleFocus: (id) => set({ worldExampleFocusId: id }),
  clearWorldExampleFocus: () => set({ worldExampleFocusId: null }),
  fetchGridAssets: async () => {
    if (get().gridAssets) return;
    try {
      const base = import.meta.env.BASE_URL;
      const res = await fetch(`${base.replace(/\/$/, '')}/grid_assets.json`);
      if (res.ok) {
        const data = await res.json();
        if (data.type === 'FeatureCollection') {
          set({ gridAssets: data });
        }
      }
    } catch (e) {
      console.error('Failed to load grid assets:', e);
    }
  },
}));
