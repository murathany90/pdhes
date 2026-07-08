import { create } from 'zustand';
import type { LngLat } from 'maplibre-gl';

export type InteractionMode = 'default' | 'measure';

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  lngLat: LngLat | null;
  elevationResult?: number | null;
}

interface MapToolsState {
  map: maplibregl.Map | null;
  mode: InteractionMode;
  isDrawing: boolean;
  contextMenu: ContextMenuState;
  measurementPoints: number[][]; // Array of [lng, lat]
  setMap: (map: maplibregl.Map | null) => void;
  setMode: (mode: InteractionMode) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  openContextMenu: (x: number, y: number, lngLat: LngLat) => void;
  closeContextMenu: () => void;
  setElevationResult: (elevation: number | null) => void;
  addMeasurementPoint: (point: [number, number]) => void;
  clearMeasurement: () => void;
}

export const useMapToolsStore = create<MapToolsState>((set) => ({
  map: null,
  mode: 'default',
  isDrawing: false,
  contextMenu: {
    isOpen: false,
    x: 0,
    y: 0,
    lngLat: null,
    elevationResult: null,
  },
  measurementPoints: [],

  setMap: (map) => set({ map }),
  setMode: (mode) => set({ mode, measurementPoints: [], isDrawing: mode === 'measure' }),
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  
  openContextMenu: (x, y, lngLat) => set((state) => ({
    contextMenu: { ...state.contextMenu, isOpen: true, x, y, lngLat, elevationResult: null }
  })),
  
  closeContextMenu: () => set((state) => ({
    contextMenu: { ...state.contextMenu, isOpen: false }
  })),

  setElevationResult: (elevation) => set((state) => ({
    contextMenu: { ...state.contextMenu, elevationResult: elevation }
  })),

  addMeasurementPoint: (point) => set((state) => ({
    measurementPoints: [...state.measurementPoints, point]
  })),

  clearMeasurement: () => set({ measurementPoints: [] }),
}));
