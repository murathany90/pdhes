import { create } from 'zustand';

const STORAGE_KEY = 'pspp-content-overrides-v1';
const ADMIN_PASS = 'admin123';

interface AdminStore {
  isAuthenticated: boolean;
  contentOverrides: Record<string, string>;
  login: (password: string) => boolean;
  logout: () => void;
  getContent: (key: string, defaults: Record<string, unknown>) => string;
  setOverride: (key: string, value: string) => void;
  resetOverrides: () => void;
  exportOverrides: () => string;
  importOverrides: (json: string) => boolean;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  isAuthenticated: false,
  contentOverrides: JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'),

  login: (password) => {
    if (password === ADMIN_PASS) {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => set({ isAuthenticated: false }),

  getContent: (key, defaults) => {
    const overrides = get().contentOverrides;
    if (Object.prototype.hasOwnProperty.call(overrides, key)) return overrides[key];
    const parts = key.split('.');
    let val: unknown = defaults;
    for (const p of parts) {
      if (val && typeof val === 'object' && p in val) {
        val = (val as Record<string, unknown>)[p];
      } else return '';
    }
    return typeof val === 'string' ? val : '';
  },

  setOverride: (key, value) => {
    const overrides = { ...get().contentOverrides, [key]: value };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    set({ contentOverrides: overrides });
  },

  resetOverrides: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ contentOverrides: {} });
  },

  exportOverrides: () => JSON.stringify(get().contentOverrides, null, 2),

  importOverrides: (json) => {
    try {
      const data = JSON.parse(json);
      if (typeof data === 'object' && data !== null) {
        const merged = { ...get().contentOverrides, ...data };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        set({ contentOverrides: merged });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
}));
