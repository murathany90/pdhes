import { create } from 'zustand';
import type { FeatureCollection } from 'geojson';
import type { Site } from '../types/site';

export const SITES_STORAGE_KEY = 'pspp-sites-v1';
const LEGACY_CUSTOM_SITES_KEY = 'pspp-custom-sites-v1';

interface SiteStore {
  sites: Site[];
  baseSites: Site[];
  gridAssets: FeatureCollection | null;
  selectedId: string;
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
}

function readSites(key: string): Site[] | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as Site[] : null;
  } catch {
    return null;
  }
}

function persistSites(sites: Site[]) {
  localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites));
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
    try {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed)) return false;
      const sites = parsed as Site[];
      if (sites.some((site) => !site?.id || !site?.name)) return false;
      persistSites(sites);
      set((state) => ({ sites, selectedId: ensureSelected(sites, state.selectedId) }));
      return true;
    } catch {
      return false;
    }
  },
  resetSites: () => {
    const baseSites = get().baseSites;
    localStorage.removeItem(SITES_STORAGE_KEY);
    set((state) => ({ sites: baseSites, selectedId: ensureSelected(baseSites, state.selectedId) }));
  },
  exportSites: () => JSON.stringify(get().sites, null, 2),
  selectedSite: () => {
    const state = get();
    return state.sites.find((s) => s.id === state.selectedId) || state.sites[0];
  },
}));
