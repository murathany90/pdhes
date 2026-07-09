import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ManualGeometryFeature } from '../types/manualGeometry';

interface ManualGeometryState {
  features: ManualGeometryFeature[];
  addFeature: (feature: ManualGeometryFeature) => void;
  removeFeature: (id: string) => void;
  clearFeaturesForSite: (siteId: string) => void;
  clearAllFeatures: () => void;
  getFeaturesForSite: (siteId: string) => ManualGeometryFeature[];
}

export const useManualGeometryStore = create<ManualGeometryState>()(
  persist(
    (set, get) => ({
      features: [],

      addFeature: (feature) =>
        set((state) => ({
          features: [...state.features, feature],
        })),

      removeFeature: (id) =>
        set((state) => ({
          features: state.features.filter((f) => f.id !== id),
        })),

      clearFeaturesForSite: (siteId) =>
        set((state) => ({
          features: state.features.filter((f) => f.properties.siteId !== siteId),
        })),

      clearAllFeatures: () => set({ features: [] }),

      getFeaturesForSite: (siteId) => get().features.filter((f) => f.properties.siteId === siteId),
    }),
    {
      name: 'pdhes-manual-geometries',
    }
  )
);
