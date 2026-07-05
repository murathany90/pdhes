import { create } from 'zustand';

const STORAGE_KEY = 'pspp-content-overrides-v2';
const LEGACY_STORAGE_KEY = 'pspp-content-overrides-v1';
const MAX_CONTENT_IMPORT_LENGTH = 512 * 1024;

function readOverrides(): Record<string, string> {
  for (const key of [STORAGE_KEY, LEGACY_STORAGE_KEY]) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) continue;
      return Object.fromEntries(
        Object.entries(parsed)
          .filter(([name, value]) =>
            !['__proto__', 'constructor', 'prototype'].includes(name) && typeof value === 'string',
          ),
      );
    } catch {
      // Ignore corrupt legacy content and continue with safe defaults.
    }
  }
  return {};
}

interface WorkspaceStore {
  contentOverrides: Record<string, string>;
  getContent: (key: string, defaults: Record<string, unknown>) => string;
  setOverride: (key: string, value: string) => void;
  resetOverrides: () => void;
  exportOverrides: () => string;
  importOverrides: (json: string) => boolean;
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  contentOverrides: readOverrides(),

  getContent: (key, defaults) => {
    const overrides = get().contentOverrides;
    if (Object.prototype.hasOwnProperty.call(overrides, key)) return overrides[key];
    const parts = key.split('.');
    let value: unknown = defaults;
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = (value as Record<string, unknown>)[part];
      } else {
        return '';
      }
    }
    return typeof value === 'string' ? value : '';
  },

  setOverride: (key, value) => {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) return;
    const overrides = { ...get().contentOverrides, [key]: value };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    set({ contentOverrides: overrides });
  },

  resetOverrides: () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    set({ contentOverrides: {} });
  },

  exportOverrides: () => JSON.stringify(get().contentOverrides, null, 2),

  importOverrides: (json) => {
    if (json.length > MAX_CONTENT_IMPORT_LENGTH) return false;
    try {
      const parsed: unknown = JSON.parse(json);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return false;
      const entries = Object.entries(parsed);
      if (entries.some(([key, value]) =>
        ['__proto__', 'constructor', 'prototype'].includes(key) || typeof value !== 'string',
      )) return false;
      const merged = { ...get().contentOverrides, ...Object.fromEntries(entries) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      set({ contentOverrides: merged });
      return true;
    } catch {
      return false;
    }
  },
}));
