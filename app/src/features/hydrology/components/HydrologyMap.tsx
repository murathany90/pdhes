import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import { useHydrologyStore } from '../store/useHydrologyStore';
import { getForecastTimestamps } from '../services/hydroData';
import { damIconBucket, displayName, getBasinColor, getDamColor } from '../data/hydrology';
import { fullnessRecordsByHes, fullnessSourceLabel, preferredFullnessRecord, resolveHistoricalFullness, resolveHesFullness } from '../data/fullnessSources';
import { getBasemapBootstrapStyle, getBasemapStyle, THEME_BACKGROUND } from './mapStyles';
import { HES_PIE_LAYER_ID, ensureHydrologyOverlay, type OverlayCollections, type OverlayOptions } from './mapLayers';
import { focusSelectedEntity } from './mapCamera';
import { advanceFlowDistance, createCascadeFlowGuides, createFlowParticleCollection, createFlowParticlePlans, emptyFlowParticles, hasVerifiedFlowRouteDirection } from './flowParticles';
import { emptyFeatureCollection } from '../types/hydrology';

const INTERACTIVE_LAYERS = ['rivers-core', 'dams-points', 'basins-fill', 'reservoirs-outline', 'hes177-points', HES_PIE_LAYER_ID] as const;
const HYDROLOGY_LAYER_ORDER = [
  'basins-fill',
  'reservoirs-fill',
  'rivers-glow',
  'dams-halo',
  'hes177-halo',
  'hes-cascades',
] as const;

function numberFrom(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

function liveNumber(record: unknown, keys: string[]): number | null {
  if (Array.isArray(record)) {
    for (const item of record) {
      const value = liveNumber(item, keys);
      if (value !== null) return value;
    }
    return null;
  }
  if (!record || typeof record !== 'object') return null;
  const source = record as Record<string, unknown>;
  for (const key of keys) {
    const value = numberFrom(source[key]);
    if (value !== null) return value;
  }
  return null;
}

function findHesEpiasRecord(records: Array<Record<string, unknown>>, hesId: string, properties: Record<string, unknown>): Record<string, unknown> | null {
  const names = [properties.damName, properties.name].filter(Boolean).map((value) => String(value).toLocaleLowerCase('tr-TR'));
  return records.find((record) => {
    const ids = [record.hesId, record.hesID, record.entityId, record.entity_id].filter(Boolean).map(String);
    const recordNames = [record.damName, record.dam_name, record.name].filter(Boolean).map((value) => String(value).toLocaleLowerCase('tr-TR'));
    return ids.includes(hesId) || recordNames.some((name) => names.includes(name));
  }) ?? null;
}

function visualPowerRadius(value: unknown): number {
  const power = numberFrom(value);
  if (power === null || power < 20) return 6;
  if (power <= 100) return 6 + ((power - 20) / 80) * 3;
  if (power <= 700) return 9 + ((power - 100) / 600) * 4;
  if (power <= 2400) return 13 + ((power - 700) / 1700) * 5;
  return 18;
}

const VECTOR_BASEMAP_PALETTES = {
  dark: { water: '#123a5a', waterway: '#2c6e9d', landcover: '#163328', roads: '#38516a', boundary: '#5f7890' },
  light: { water: '#a8cde7', waterway: '#5c9bc5', landcover: '#d7e8ce', roads: '#b29476', boundary: '#718096' },
} as const;

function applyVectorBasemapPalette(map: MapLibreMap, variant: 'dark' | 'light'): void {
  const palette = VECTOR_BASEMAP_PALETTES[variant];
  if (map.getLayer('basemap-background')) map.setPaintProperty('basemap-background', 'background-color', THEME_BACKGROUND[variant]);
  if (map.getLayer('basemap-landcover')) map.setPaintProperty('basemap-landcover', 'fill-color', palette.landcover);
  if (map.getLayer('basemap-water')) map.setPaintProperty('basemap-water', 'fill-color', palette.water);
  if (map.getLayer('basemap-waterway')) map.setPaintProperty('basemap-waterway', 'line-color', palette.waterway);
  if (map.getLayer('basemap-roads')) map.setPaintProperty('basemap-roads', 'line-color', palette.roads);
  if (map.getLayer('basemap-boundaries')) map.setPaintProperty('basemap-boundaries', 'line-color', palette.boundary);
}

function escapePopup(value: unknown): string {
  return String(value ?? '—').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character);
}

function fullnessBadge(result: { fullnessPercent: number | null; status: string; sourceClass: string }): string {
  if (result.fullnessPercent === null) return result.status === 'not_applicable' ? 'N/A' : '—';
  if (result.sourceClass === 'mock') return 'M';
  if (result.sourceClass === 'official' || result.sourceClass === 'official_live') return 'E';
  if (result.sourceClass === 'official_published') return 'D';
  if (result.sourceClass === 'satellite_altimetry' || result.sourceClass === 'satellite_area') return 'U';
  return 'H';
}

/** Short source label for the minimal popup (no raw method strings). */
export function shortSourceLabel(properties: Record<string, unknown>): string {
  if (String(properties.fullnessStatus ?? '') === 'not_applicable') return 'Uygulanamaz';
  if (properties.occupancy === null || properties.occupancy === undefined) return 'Veri yok';
  const sourceClass = String(properties.fullnessSourceClass ?? '');
  if (sourceClass === 'official_live' || sourceClass === 'official') return 'EPİAŞ resmî canlı';
  if (sourceClass === 'official_published') return 'DSİ resmî yayın';
  if (sourceClass === 'satellite_altimetry' || sourceClass === 'satellite_area') return 'Uydu tahmini';
  if (sourceClass === 'mock') return 'MOCK';
  return 'Hacim tahmini';
}

function formatObservedDate(value: unknown): string {
  if (typeof value !== 'string' || !value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('tr-TR');
}

/** Minimal HES popup: each identity/value is rendered on its own line. */
export function hesPopupHtml(properties: Record<string, unknown>): string {
  const producer = properties.isProducer === true ? '<span class="hydro-popup-producer">⚡</span>' : '';
  const hasValue = properties.occupancy !== null && properties.occupancy !== undefined;
  const fullness = hasValue ? `%${Math.round(Number(properties.occupancy))}` : 'Veri yok';
  const badge = fullnessBadge({ fullnessPercent: hasValue ? Number(properties.occupancy) : null, status: String(properties.fullnessStatus ?? ''), sourceClass: String(properties.fullnessSourceClass ?? '') });
  const power = properties.installedPowerMw === null || properties.installedPowerMw === undefined ? '—' : `${escapePopup(properties.installedPowerMw)} MW`;
  const observed = formatObservedDate(properties.fullnessObservedAt);
  const age = properties.fullnessFreshnessDays === null || properties.fullnessFreshnessDays === undefined ? '' : ` · ${properties.fullnessFreshnessDays} gün`;
  const river = properties.riverName ?? properties.displayRiverName ?? 'Akarsu doğrulanamadı';
  const basin = properties.basinName ?? properties.displayBasinName ?? '—';
  const dam = properties.damName;
  return `<div class="hydro-click-popup"><div class="hydro-popup-head"><strong>${producer}${escapePopup(properties.name)}</strong><button type="button" data-popup-close aria-label="Kapat">×</button></div><div class="hydro-popup-sub">${escapePopup(power)} · ${escapePopup(river)}</div><div class="hydro-popup-sub">Havza: ${escapePopup(basin)}${dam ? ` · Baraj: ${escapePopup(dam)}` : ''}</div><div class="hydro-popup-main"><span class="hydro-popup-fullness">Doluluk: ${escapePopup(fullness)} <small>${badge}</small></span></div><div class="hydro-popup-source">Kaynak: ${escapePopup(shortSourceLabel(properties))}</div><div class="hydro-popup-observed">Gözlem: ${escapePopup(observed)}${escapePopup(age)}</div><button type="button" class="hydro-popup-detail" data-show-detail>Detay</button></div>`;
}

function bindHesPopupActions(popup: maplibregl.Popup, hesId: string): void {
  const element = popup.getElement();
  element?.querySelector('[data-popup-close]')?.addEventListener('click', () => popup.remove());
  element?.querySelector('[data-show-detail]')?.addEventListener('click', () => {
    const store = useHydrologyStore.getState();
    store.setSelectedEntity({ type: 'hes', id: hesId });
    if (!store.isSidebarOpen) store.toggleSidebar();
    popup.remove();
  });
}

export function BaseMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const initialBasemapRef = useRef(useHydrologyStore.getState().basemap);
  const themeRef = useRef(useHydrologyStore.getState().theme);
  const dataRef = useRef<OverlayCollections | null>(null);
  const optionsRef = useRef<OverlayOptions | null>(null);
  const lastSyncedDataRef = useRef<OverlayCollections | null>(null);
  const lastSyncedOptionsRef = useRef<OverlayOptions | null>(null);
  const frameRef = useRef<number | null>(null);
  const flowAnimationRef = useRef<number | null>(null);
  const flowAnimationSpeedRef = useRef(1);
  const flowDistanceRef = useRef(0);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const clickPopupRef = useRef<maplibregl.Popup | null>(null);
  const basemapFallbackRef = useRef<'none' | 'vector' | 'local'>('none');
  // A `setStyle` call discards every application source and layer. Do not try
  // to restore the overlay from intermediate `styledata` events; wait for the
  // matching style to be ready instead.
  const styleReadyRef = useRef(false);
  const overlayRetryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const overlayBootstrapRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [catchment, setCatchment] = useState(emptyFeatureCollection());

  const rivers = useHydrologyStore((state) => state.rivers);
  const basins = useHydrologyStore((state) => state.basins);
  const damStations = useHydrologyStore((state) => state.damStations);
  const reservoirs = useHydrologyStore((state) => state.reservoirs);
  const hes177 = useHydrologyStore((state) => state.hes177);
  const cascades = useHydrologyStore((state) => state.cascades);
  const hes177Relations = useHydrologyStore((state) => state.hes177Relations);
  const geoglows = useHydrologyStore((state) => state.geoglows);
  const epias = useHydrologyStore((state) => state.epias);
  const fullness = useHydrologyStore((state) => state.fullness);
  const fullnessHistory = useHydrologyStore((state) => state.fullnessHistory);
  const layers = useHydrologyStore((state) => state.layers);
  const basemap = useHydrologyStore((state) => state.basemap);
  const theme = useHydrologyStore((state) => state.theme);
  const selectedEntity = useHydrologyStore((state) => state.selectedEntity);
  const timelineIndex = useHydrologyStore((state) => state.timelineIndex);
  const dataMode = useHydrologyStore((state) => state.dataMode);
  const flowAnimationEnabled = useHydrologyStore((state) => state.flowAnimationEnabled);
  const flowAnimationSpeed = useHydrologyStore((state) => state.flowAnimationSpeed);
  const historicalDate = useHydrologyStore((state) => state.historicalDate);
  const activeCatchmentHesId = useHydrologyStore((state) => state.activeCatchmentHesId);
  const setSelectedEntity = useHydrologyStore((state) => state.setSelectedEntity);
  const toggleCatchment = useHydrologyStore((state) => state.toggleCatchment);
  const cascadeFlowGuides = useMemo(() => createCascadeFlowGuides(hes177, cascades), [cascades, hes177]);

  const collections = useMemo<OverlayCollections>(() => {
    const geoglowsRecords = geoglows?.records ?? [];
    const timestamps = getForecastTimestamps(geoglows);
    const activeTimestamp = timestamps[timelineIndex];
    const epiasRecords = dataMode === 'epias' ? epias?.records ?? [] : [];
    const fullnessByHes = fullnessRecordsByHes(fullness);
    const fullnessFor = (id: string, properties: Record<string, unknown>, liveRecord?: Record<string, unknown> | null) => {
      const current = resolveHesFullness(id, properties, preferredFullnessRecord(fullnessByHes.get(id), liveRecord), dataMode);
      return historicalDate ? resolveHistoricalFullness(id, current, fullnessHistory, historicalDate) : current;
    };
    const selectedRiver = selectedEntity?.type === 'river' ? rivers.features.find((feature) => String(feature.properties?.id ?? feature.id ?? '') === selectedEntity.id) ?? null : null;
    const selectedRiverHesIds = selectedEntity?.type === 'river'
      ? new Set(Array.isArray(selectedRiver?.properties?.hesIds) ? selectedRiver.properties.hesIds.map(String) : hes177.features.filter((feature) => {
        const relation = hes177Relations?.byHesId?.[String(feature.properties?.id ?? feature.id ?? '')];
        return relation?.riverIds?.map(String).includes(selectedEntity.id);
      }).map((feature) => String(feature.properties?.id ?? feature.id ?? '')))
      : new Set<string>();
    const selectedBasinHesIds = selectedEntity?.type === 'basin'
      ? new Set(hes177.features.filter((feature) => String(feature.properties?.basinId ?? '') === selectedEntity.id).map((feature) => String(feature.properties?.id ?? feature.id ?? '')))
      : new Set<string>();
    const selectedRiverDamIds = new Set([...selectedRiverHesIds].flatMap((id) => hes177Relations?.byHesId?.[id]?.damIds?.map(String) ?? []));
    const basinNames = new Map(basins.features.map((feature) => [String(feature.properties?.basinId ?? feature.properties?.ID ?? feature.id ?? ''), String(feature.properties?.name ?? feature.properties?.HAVZA_ADI ?? '')]));
    const basinFeatures = basins.features.map((feature) => {
      const id = String(feature.properties?.basinId ?? feature.properties?.ID ?? feature.id ?? '');
      const selectedBasinId = selectedEntity?.type === 'basin' ? selectedEntity.id : selectedEntity?.type === 'hes' ? String(hes177.features.find((candidate) => String(candidate.properties?.id ?? candidate.id ?? '') === selectedEntity.id)?.properties?.basinId ?? '') : null;
      return { ...feature, properties: { ...feature.properties, color: getBasinColor(id, theme), selected: Boolean(selectedBasinId && id === selectedBasinId), dimmed: Boolean(selectedBasinId && id !== selectedBasinId) } };
    });
    const riverFeatures = rivers.features.map((feature) => {
      const id = String(feature.properties?.id ?? feature.id ?? '');
      const localRiverIds = Array.isArray(feature.properties?.geoglowsLocalRiverIds) ? feature.properties.geoglowsLocalRiverIds.map(String) : [String(feature.properties?.representativeLocalRiverId ?? '')].filter(Boolean);
      const live = geoglowsRecords.find((record) => localRiverIds.includes(String(record.localRiverId ?? '')));
      const liveData = Array.isArray(live?.data) && activeTimestamp ? live.data.filter((row) => row && typeof row === 'object' && (row as Record<string, unknown>).datetime === activeTimestamp) : live?.data;
      const flow = liveNumber(liveData, ['flow', 'discharge', 'streamflow', 'flow_median', 'value']) ?? numberFrom(feature.properties?.flow);
      const width = flow !== null ? Math.min(8, Math.max(2.8, Math.log10(Math.max(flow, 0) + 1) * 2.8)) : numberFrom(feature.properties?.width) ?? 2.8;
      const relationRiverSelected = selectedEntity?.type === 'hes' ? hes177Relations?.byHesId?.[selectedEntity.id]?.riverIds?.map(String).includes(id) : false;
      const basinRelevant = selectedEntity?.type === 'basin' && (Array.isArray(feature.properties?.basinIds) ? feature.properties.basinIds.map(String).includes(selectedEntity.id) : String(feature.properties?.basinId ?? '') === selectedEntity.id);
      const riverRelevant = selectedEntity?.type === 'river' ? id === selectedEntity.id : selectedEntity?.type === 'basin' ? basinRelevant : relationRiverSelected;
      const directionVerified = hasVerifiedFlowRouteDirection(feature.properties);
      const hasFocusedRiver = selectedEntity?.type === 'hes' || selectedEntity?.type === 'river' || selectedEntity?.type === 'basin';
      return { ...feature, properties: { ...feature.properties, name: displayName(feature.properties ?? {}, 'river', id), riverName: feature.properties?.riverName ?? feature.properties?.name, basinName: basinNames.get(String(feature.properties?.basinId ?? '')), flow, color: '#38bdf8', width, hasForecast: Boolean(live && Array.isArray(live.data) && live.data.length > 1), flowDirectionVerified: directionVerified, showVerifiedDirection: Boolean(flowAnimationEnabled && riverRelevant && directionVerified), flowParticleActive: Boolean(flowAnimationEnabled && (!hasFocusedRiver || riverRelevant)), selectedRiver: riverRelevant, dimmed: Boolean(selectedEntity && !riverRelevant) } };
    });
    const damFeatures = damStations.features.map((feature) => {
      const properties = feature.properties ?? {};
      const id = String(properties.id ?? feature.id ?? '');
      const name = displayName(properties, 'dam', id);
      const live = epiasRecords.find((record) => String(record.damName ?? record.name ?? '').toLocaleLowerCase('tr-TR') === name.toLocaleLowerCase('tr-TR'));
      const hesIds = Array.isArray(properties.hesIds) ? properties.hesIds.map(String) : [];
      const linkedHesProperties = hesIds.length ? hes177.features.find((candidate) => String(candidate.properties?.id ?? candidate.id ?? '') === hesIds[0])?.properties ?? properties : properties;
      const selectedHesRelation = selectedEntity?.type === 'hes' ? hes177Relations?.byHesId?.[selectedEntity.id] : undefined;
      const relatedToSelectedHes = Boolean(selectedHesRelation?.damIds?.map(String).includes(id));
      const fullnessSeedId = hesIds[0] ?? id;
      const seededOccupancy = fullnessFor(fullnessSeedId, linkedHesProperties, live).fullnessPercent;
      const basinRelevant = selectedEntity?.type === 'basin' && String(properties.basinId ?? '') === selectedEntity.id;
      const damRelevant = selectedRiverDamIds.has(id) || hesIds.some((hesId) => selectedRiverHesIds.has(hesId) || selectedBasinHesIds.has(hesId)) || relatedToSelectedHes || basinRelevant || selectedEntity?.type === 'dam' && selectedEntity.id === id;
      return { ...feature, properties: { ...properties, name, basinName: properties.basinName ?? properties.HavzaAdi, occupancy: seededOccupancy, damIcon: damIconBucket(seededOccupancy), isProducer: hesIds.length > 0, hesMatchIds: hesIds, selected: selectedEntity?.type === 'dam' && selectedEntity.id === id, relatedToSelected: damRelevant, dimmed: Boolean(selectedEntity && !damRelevant), color: seededOccupancy === null ? '#94a3b8' : getDamColor(seededOccupancy), radius: seededOccupancy === null ? 8 : Math.min(13, Math.max(6, seededOccupancy / 8)) } };
    });
    const enrichedHes177 = { ...hes177, features: hes177.features.map((feature) => {
      const id = String(feature.properties?.id ?? feature.id ?? '');
      const relation = hes177Relations?.byHesId?.[id];
      const matchingRiver = rivers.features.find((river) => relation?.riverIds?.map(String).includes(String(river.properties?.id ?? river.id ?? '')));
      const localRiverIds = Array.isArray(matchingRiver?.properties?.geoglowsLocalRiverIds) ? matchingRiver.properties.geoglowsLocalRiverIds.map(String) : [];
      const live = geoglowsRecords.find((record) => localRiverIds.includes(String(record.localRiverId ?? '')));
      const flow = liveNumber(live?.data, ['flow', 'discharge', 'streamflow', 'flow_median', 'value']);
      const fullnessResult = fullnessFor(id, feature.properties ?? {}, findHesEpiasRecord(epiasRecords, id, feature.properties ?? {}));
      const selectedRiverName = selectedRiver?.properties?.riverName ?? selectedRiver?.properties?.name;
      const riverSelected = selectedEntity?.type === 'river' && Boolean((relation?.riverIds ?? []).map(String).includes(selectedEntity.id) || (selectedRiverName && relation?.riverName === selectedRiverName));
      const hesSelected = selectedEntity?.type === 'hes' && selectedEntity.id === id;
      const basinSelected = selectedEntity?.type === 'basin' && String(feature.properties?.basinId ?? '') === selectedEntity.id;
      const selectedHesRelation = selectedEntity?.type === 'hes' ? hes177Relations?.byHesId?.[selectedEntity.id] : undefined;
      const hesRelated = riverSelected || Boolean(selectedHesRelation?.cascadeFromIds?.map(String).includes(id) || String(selectedHesRelation?.cascadeToId ?? '') === id);
      const fullnessSourceKey = fullnessSourceLabel(fullnessResult);
      return { ...feature, properties: { ...feature.properties, color: '#38bdf8', flow, occupancy: fullnessResult.fullnessPercent, fullnessSource: fullnessBadge(fullnessResult), fullnessStatus: fullnessResult.status, fullnessSourceClass: fullnessResult.sourceClass, fullnessSourceKey, fullnessSourceUrl: fullnessResult.sourceUrl, fullnessMethod: fullnessResult.method, fullnessObservedAt: fullnessResult.observedAt, fullnessSourcePublishedAt: fullnessResult.sourcePublishedAt, fullnessFreshnessDays: fullnessResult.freshnessDays, fullnessConfidence: fullnessResult.confidence, fullnessEstimated: fullnessResult.isEstimated, fullnessReasonUnavailable: fullnessResult.reasonUnavailable, fullnessIsHistorical: fullnessResult.isHistoricalView === true, fullnessRequestedDate: fullnessResult.requestedDate, damIcon: damIconBucket(fullnessResult.fullnessPercent), visualRadius: visualPowerRadius(feature.properties?.installedPowerMw), markerDiameterPx: visualPowerRadius(feature.properties?.installedPowerMw) * 2, damLinked: Boolean(relation?.damIds?.length), isProducer: true, relatedToSelected: riverSelected || basinSelected || hesRelated, selected: hesSelected, dimmed: Boolean(selectedEntity && !hesSelected && !hesRelated && !riverSelected && !basinSelected), cascadeDepth: relation?.cascadeOrder ?? null } };
    }) };
    const reservoirFeatures = reservoirs.features.map((feature) => {
      const properties = feature.properties ?? {};
      const hesIds = Array.isArray(properties.hesIds) ? properties.hesIds.map(String) : [];
      const selectedHes = selectedEntity?.type === 'hes' && hesIds.includes(selectedEntity.id);
      const selectedRiverHes = selectedEntity?.type === 'river' && hesIds.some((id) => selectedRiverHesIds.has(id));
      const selectedBasin = selectedEntity?.type === 'basin' && String(properties.basinId ?? '') === selectedEntity.id;
      return { ...feature, properties: { ...properties, selected: selectedHes, dimmed: Boolean(selectedEntity && !selectedHes && !selectedRiverHes && !selectedBasin) } };
    });
    return { rivers: { ...rivers, features: riverFeatures }, basins: { ...basins, features: basinFeatures }, dams: { ...damStations, features: damFeatures }, hes177: enrichedHes177, cascades, catchment, reservoirs: { ...reservoirs, features: reservoirFeatures } };
  }, [basins, cascades, catchment, damStations, dataMode, epias, flowAnimationEnabled, fullness, fullnessHistory, geoglows, hes177, hes177Relations, historicalDate, reservoirs, rivers, selectedEntity, theme, timelineIndex]);

  const overlayOptions = useMemo<OverlayOptions>(() => ({
    rivers: layers.rivers,
    dams: layers.dams,
    basins: layers.basins,
    hes177: true,
    reservoirs: true,
    outlineColor: theme === 'light' ? '#475569' : '#07111f',
    selectionColor: theme === 'light' ? '#0f766e' : '#f8fafc',
    basinOutlineColor: theme === 'light' ? '#475569' : '#93c5fd',
    riverGlowColor: theme === 'light' ? '#0e7490' : '#38bdf8',
    riverSelectedColor: theme === 'light' ? '#0891b2' : '#67e8f9',
    flowAnimationEnabled,
    selectedEntity,
    selectedBasinId: selectedEntity?.type === 'basin' ? selectedEntity.id : selectedEntity?.type === 'hes' ? String(hes177.features.find((feature) => String(feature.properties?.id ?? feature.id ?? '') === selectedEntity.id)?.properties?.basinId ?? '') || null : null,
    selectedRiverMemberIds: selectedEntity?.type === 'river' ? [selectedEntity.id] : selectedEntity?.type === 'hes' ? hes177Relations?.byHesId?.[selectedEntity.id]?.riverIds?.map(String) ?? [] : [],
  }), [flowAnimationEnabled, hes177.features, hes177Relations, layers.basins, layers.dams, layers.rivers, selectedEntity, theme]);

  const syncOverlay = useCallback(function syncOverlay(force = false) {
    const map = mapRef.current;
    if (!map || !styleReadyRef.current || !dataRef.current || !optionsRef.current || !map.getStyle()) return;
    if (!force && lastSyncedDataRef.current === dataRef.current && lastSyncedOptionsRef.current === optionsRef.current) return;
    const needsInitialRefresh = lastSyncedDataRef.current !== dataRef.current || lastSyncedOptionsRef.current !== optionsRef.current;
    try {
      const synced = ensureHydrologyOverlay(map, dataRef.current, optionsRef.current, () => {
        if (mapRef.current !== map) return;
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(() => { frameRef.current = null; syncOverlay(true); });
      });
      if (!synced) {
        if (overlayRetryRef.current === null) {
          overlayRetryRef.current = setTimeout(() => {
            overlayRetryRef.current = null;
            syncOverlay(true);
          }, 250);
        }
        return;
      }
      const firstHydrologyLayer = HYDROLOGY_LAYER_ORDER.find((id) => Boolean(map.getLayer(id)));
      if (map.getLayer('basemap-raster') && firstHydrologyLayer) map.moveLayer('basemap-raster', firstHydrologyLayer);
      lastSyncedDataRef.current = dataRef.current;
      lastSyncedOptionsRef.current = optionsRef.current;
      if (map.getLayer('basemap-background')) map.setPaintProperty('basemap-background', 'background-color', THEME_BACKGROUND[themeRef.current]);
      map.triggerRepaint();
      // Raster styles can finish their first render one frame after the
      // GeoJSON source is registered. Reconcile once more after that frame so
      // the first view does not require a manual layer toggle to paint.
      if (needsInitialRefresh && overlayRetryRef.current === null) {
        overlayRetryRef.current = setTimeout(() => {
          overlayRetryRef.current = null;
          syncOverlay(true);
        }, 350);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('[BaseMap] overlay sync retry:', error instanceof Error ? error.message : String(error));
      // A style swap can briefly invalidate the style object. Retry after the
      // style parser has had a chance to finish, even if no further tile event
      // is emitted by the fallback source.
      if (overlayRetryRef.current === null) {
        overlayRetryRef.current = setTimeout(() => {
          overlayRetryRef.current = null;
          syncOverlay(true);
        }, 250);
      }
    }
  }, []);

  const scheduleOverlaySync = useCallback((force = false) => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => { frameRef.current = null; syncOverlay(force); });
  }, [syncOverlay]);

  useEffect(() => { dataRef.current = collections; optionsRef.current = overlayOptions; scheduleOverlaySync(); }, [collections, overlayOptions, scheduleOverlaySync]);

  useEffect(() => {
    // P0: map initialization must NOT wait for canonical data. The requested
    // basemap and the application overlay both initialize independently; the
    // overlay syncs in when canonical data arrives via dataRef.
    if (!mapContainerRef.current || mapRef.current) return;
    maplibregl.setWorkerUrl(maplibreWorkerUrl);
    // Starting with the requested basemap avoids the old bootstrap -> setStyle
    // swap during the first paint. That swap could remove HES sources after a
    // `styledata` handler had already restored them, leaving an empty map until
    // the next page load.
    const map = new maplibregl.Map({ container: mapContainerRef.current, style: getBasemapStyle(initialBasemapRef.current), center: [35.3, 39], zoom: 5.5, attributionControl: false, renderWorldCopies: false });
    mapRef.current = map;
    // Support/deep-diagnosis handle (allows console inspection of live map state).
    (window as unknown as { __hydroMap?: MapLibreMap }).__hydroMap = map;
    const loggedMapErrors = new Set<string>();
    const onLoad = () => {
      map.resize();
      if (map.isStyleLoaded()) {
        styleReadyRef.current = true;
        scheduleOverlaySync(true);
      }
    };
    const onStyleLoad = () => {
      styleReadyRef.current = true;
      scheduleOverlaySync(true);
    };
    const fallbackToVector = () => {
      if (basemapFallbackRef.current !== 'none') return;
      basemapFallbackRef.current = 'vector';
      styleReadyRef.current = false;
      lastSyncedDataRef.current = null;
      lastSyncedOptionsRef.current = null;
      map.setStyle(getBasemapStyle(themeRef.current === 'light' ? 'light' : 'dark'), { diff: false });
    };
    const fallbackToLocal = () => {
      if (basemapFallbackRef.current === 'local') return;
      basemapFallbackRef.current = 'local';
      styleReadyRef.current = false;
      lastSyncedDataRef.current = null;
      lastSyncedOptionsRef.current = null;
      map.setStyle(getBasemapBootstrapStyle(themeRef.current), { diff: false });
    };
    const onMapError = (event: maplibregl.ErrorEvent) => {
      const details = event as unknown as { sourceId?: unknown; error?: unknown };
      const sourceId = String(details.sourceId ?? '').toLocaleLowerCase('en-US');
      const message = String(details.error instanceof Error ? details.error.message : details.error ?? '').toLocaleLowerCase('en-US');
      const errorKey = `${sourceId}:${message.slice(0, 120)}`;
      if (!loggedMapErrors.has(errorKey)) {
        loggedMapErrors.add(errorKey);
        // eslint-disable-next-line no-console
        console.warn('[BaseMap] map fallback:', sourceId || '(no source)', message.slice(0, 120));
      }
      if (sourceId === 'basemap-raster') fallbackToVector();
      else if (sourceId === 'openmaptiles' || message.includes('openfreemap') || message.includes('openmaptiles')) fallbackToLocal();
      (event as unknown as { preventDefault?: () => void }).preventDefault?.();
    };
    map.on('load', onLoad);
    map.on('style.load', onStyleLoad);
    map.on('error', onMapError);
    // Bounded first-paint bootstrap: retry overlay sync a few times until the
    // key layers exist. No render-loop listener — a render->sync->repaint
    // cycle would pin the main thread on slower production timing.
    let bootstrapAttempts = 0;
    const stopOverlayBootstrap = () => {
      if (overlayBootstrapRef.current !== null) {
        clearTimeout(overlayBootstrapRef.current);
        overlayBootstrapRef.current = null;
      }
    };
    const bootstrapOverlays = () => {
      overlayBootstrapRef.current = null;
      bootstrapAttempts += 1;
      scheduleOverlaySync(true);
      const ready = Boolean(map.getLayer('hes177-points') && map.getLayer('rivers-core'));
      if (!ready && bootstrapAttempts < 12) {
        overlayBootstrapRef.current = setTimeout(bootstrapOverlays, 500);
      }
    };
    overlayBootstrapRef.current = setTimeout(bootstrapOverlays, 500);
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: 'GDW rezervuar poligonları · OpenFreeMap / OSM' }), 'bottom-right');
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (overlayRetryRef.current !== null) clearTimeout(overlayRetryRef.current);
      overlayRetryRef.current = null;
      frameRef.current = null;
      styleReadyRef.current = false;
      lastSyncedDataRef.current = null;
      lastSyncedOptionsRef.current = null;
      stopOverlayBootstrap();
      map.off('load', onLoad); map.off('style.load', onStyleLoad); map.off('error', onMapError);
      popupRef.current?.remove();
      map.remove(); mapRef.current = null;
      delete (window as unknown as { __hydroMap?: MapLibreMap }).__hydroMap;
      clickPopupRef.current?.remove();
    };
  }, [scheduleOverlaySync, syncOverlay]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || basemap === initialBasemapRef.current) return;
    if ((basemap === 'dark' || basemap === 'light') && map.getSource('openmaptiles') && !map.getSource('basemap-raster')) {
      initialBasemapRef.current = basemap;
      applyVectorBasemapPalette(map, basemap);
      map.triggerRepaint();
      return;
    }
    initialBasemapRef.current = basemap;
    basemapFallbackRef.current = 'none';
    styleReadyRef.current = false;
    lastSyncedDataRef.current = null;
    lastSyncedOptionsRef.current = null;
    map.setStyle(getBasemapStyle(basemap), { diff: false });
  }, [basemap, scheduleOverlaySync]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedEntity) return;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    const focus = () => {
      if (!map.getStyle()) { retryTimer = setTimeout(focus, 250); return; }
      if (dataRef.current) focusSelectedEntity(map, selectedEntity, dataRef.current);
    };
    focus();
    return () => { if (retryTimer) clearTimeout(retryTimer); };
  }, [basins, damStations, hes177, reservoirs, rivers, selectedEntity]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    setCatchment(emptyFeatureCollection());
    if (!activeCatchmentHesId) {
      setCatchment(emptyFeatureCollection());
      return;
    }
    const feature = hes177.features.find((candidate) => String(candidate.properties?.id ?? candidate.id ?? '') === activeCatchmentHesId);
    const url = feature?.properties?.catchmentUrl;
    if (typeof url !== 'string' || !url.startsWith('http')) {
      setCatchment(emptyFeatureCollection());
      return;
    }
    fetch(url, { cache: 'force-cache', signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error(`catchment ${response.status}`);
      const value = await response.json() as { type?: string; features?: unknown[] };
      if (!cancelled && value.type === 'FeatureCollection' && Array.isArray(value.features)) setCatchment(value as typeof catchment);
    }).catch(() => { if (!cancelled) setCatchment(emptyFeatureCollection()); });
    return () => { cancelled = true; controller.abort(); };
  }, [activeCatchmentHesId, hes177.features]);

  useEffect(() => {
    themeRef.current = theme;
    const map = mapRef.current;
    if (!map) return;
    if (!map.getLayer('basemap-background')) { scheduleOverlaySync(); return; }
    if (theme === 'dark' || theme === 'light') applyVectorBasemapPalette(map, theme);
    if (map.getLayer('basemap-background')) map.setPaintProperty('basemap-background', 'background-color', THEME_BACKGROUND[theme]);
    if (map.getLayer('basemap-raster')) map.setPaintProperty('basemap-raster', 'raster-opacity', theme === 'light' ? 0.72 : 0.48);
    map.triggerRepaint();
  }, [theme, scheduleOverlaySync]);

  useEffect(() => { flowAnimationSpeedRef.current = flowAnimationSpeed; }, [flowAnimationSpeed]);

  useEffect(() => {
    const map = mapRef.current;
    const clearParticles = () => {
      const source = map?.getSource('rivers-flow-particles') as GeoJSONSource | undefined;
      source?.setData(emptyFlowParticles());
      const container = map?.getContainer();
      if (container) {
        container.dataset.flowParticleCount = '0';
        container.dataset.flowParticleSignature = '';
        container.dataset.flowParticleProbe = '';
        container.dataset.flowRouteCount = '0';
        container.dataset.flowCascadeDirectedRouteCount = '0';
        container.dataset.flowConnectedTransitions = '0';
        container.dataset.flowTraveledDistanceKm = '0';
      }
    };
    if (!map || !flowAnimationEnabled || !layers.rivers) {
      clearParticles();
      return;
    }

    let active = true;
    let lastTickAt: number | null = null;
    let lastPaintAt = 0;
    let traveledDistanceKm = flowDistanceRef.current;
    const selectedHes = selectedEntity?.type === 'hes'
      ? collections.hes177.features.find((feature) => String(feature.properties?.id ?? feature.id ?? '') === selectedEntity.id)
      : null;
    const selectedPoint = selectedHes?.geometry?.type === 'Point'
      ? [Number(selectedHes.geometry.coordinates[0]), Number(selectedHes.geometry.coordinates[1])] as [number, number]
      : null;
    let plans = createFlowParticlePlans(collections.rivers, selectedPoint, undefined, cascadeFlowGuides);

    const rebuildPlans = () => {
      const bounds = map.getBounds();
      plans = createFlowParticlePlans(collections.rivers, selectedPoint, {
        west: bounds.getWest(), south: bounds.getSouth(), east: bounds.getEast(), north: bounds.getNorth(),
      }, cascadeFlowGuides);
    };
    const tick = (now: number) => {
      if (!active || document.visibilityState !== 'visible') return;
      if (lastTickAt !== null) {
        traveledDistanceKm = advanceFlowDistance(traveledDistanceKm, (now - lastTickAt) / 1000, flowAnimationSpeedRef.current);
      }
      flowDistanceRef.current = traveledDistanceKm;
      lastTickAt = now;
      if (now - lastPaintAt >= 33) {
        const source = map.getSource('rivers-flow-particles') as GeoJSONSource | undefined;
        if (source && map.getLayer('rivers-flow-particles') && map.getLayoutProperty('rivers-flow-particles', 'visibility') !== 'none') {
          const particles = createFlowParticleCollection(plans, traveledDistanceKm, map.getZoom());
          source.setData(particles);
          const signature = particles.features.slice(0, 4).map((feature) => feature.geometry.coordinates.map((value) => Number(value).toFixed(5)).join(',')).join('|');
          const container = map.getContainer();
          const probe = particles.features.find((feature) => feature.properties?.directionMode === 'cascade-elevation' && feature.properties?.trailStep === 0)
            ?? particles.features.find((feature) => Number(feature.properties?.routeSegmentCount ?? 0) > 1 && feature.properties?.trailStep === 0)
            ?? particles.features[0];
          container.dataset.flowParticleCount = String(particles.features.length);
          container.dataset.flowParticleSignature = signature;
          container.dataset.flowParticleProbe = probe ? JSON.stringify({
            id: probe.id,
            coordinates: probe.geometry.coordinates.map((value) => Number(Number(value).toFixed(6))),
            routeId: probe.properties?.routeId,
            sourceSegmentIndex: probe.properties?.sourceSegmentIndex,
            routeSegmentCount: probe.properties?.routeSegmentCount,
            routeDistanceKm: probe.properties?.routeDistanceKm,
            directionMode: probe.properties?.directionMode,
            travelDirection: probe.properties?.travelDirection,
            upstreamName: probe.properties?.upstreamName,
            downstreamName: probe.properties?.downstreamName,
            elevationDropM: probe.properties?.elevationDropM,
          }) : '';
          container.dataset.flowRouteCount = String(plans.length);
          container.dataset.flowCascadeDirectedRouteCount = String(plans.filter((plan) => plan.directionMode === 'cascade-elevation').length);
          container.dataset.flowConnectedTransitions = String(plans.reduce((total, plan) => total + Math.max(0, plan.edgeBreaksKm.length - 1), 0));
          container.dataset.flowTraveledDistanceKm = traveledDistanceKm.toFixed(3);
          container.dataset.flowAnimationSpeed = String(flowAnimationSpeedRef.current);
          (window as unknown as { __hydroFlowDebug?: Record<string, unknown> }).__hydroFlowDebug = {
            enabled: true,
            speed: flowAnimationSpeedRef.current,
            particleCount: particles.features.length,
            routeCount: plans.length,
            cascadeDirectedRouteCount: plans.filter((plan) => plan.directionMode === 'cascade-elevation').length,
            routeLengthKm: Number(plans.reduce((total, plan) => total + plan.lengthKm, 0).toFixed(2)),
            connectedTransitions: plans.reduce((total, plan) => total + Math.max(0, plan.edgeBreaksKm.length - 1), 0),
            traveledDistanceKm: Number(traveledDistanceKm.toFixed(3)),
            particles: particles.features.slice(0, 24).map((feature) => ({
              id: feature.id,
              coordinates: feature.geometry.coordinates.map((value) => Number(Number(value).toFixed(6))),
              routeId: feature.properties?.routeId,
              sourceSegmentIndex: feature.properties?.sourceSegmentIndex,
              routeSegmentCount: feature.properties?.routeSegmentCount,
              routeDistanceKm: feature.properties?.routeDistanceKm,
              directionMode: feature.properties?.directionMode,
              travelDirection: feature.properties?.travelDirection,
              trailStep: feature.properties?.trailStep,
              upstreamName: feature.properties?.upstreamName,
              downstreamName: feature.properties?.downstreamName,
              elevationDropM: feature.properties?.elevationDropM,
            })),
            signature,
            updatedAt: new Date().toISOString(),
          };
        }
        lastPaintAt = now;
      }
      flowAnimationRef.current = requestAnimationFrame(tick);
    };
    const restart = () => {
      if (flowAnimationRef.current !== null) cancelAnimationFrame(flowAnimationRef.current);
      lastTickAt = null;
      flowAnimationRef.current = document.visibilityState === 'visible' ? requestAnimationFrame(tick) : null;
    };
    const onViewportChange = () => rebuildPlans();

    map.on('moveend', onViewportChange);
    map.on('zoomend', onViewportChange);
    document.addEventListener('visibilitychange', restart);
    rebuildPlans();
    restart();
    return () => {
      active = false;
      map.off('moveend', onViewportChange);
      map.off('zoomend', onViewportChange);
      document.removeEventListener('visibilitychange', restart);
      if (flowAnimationRef.current !== null) cancelAnimationFrame(flowAnimationRef.current);
      flowAnimationRef.current = null;
      clearParticles();
      (window as unknown as { __hydroFlowDebug?: Record<string, unknown> }).__hydroFlowDebug = { enabled: false, speed: flowAnimationSpeedRef.current, particleCount: 0 };
    };
  }, [cascadeFlowGuides, collections.hes177, collections.rivers, flowAnimationEnabled, layers.rivers, selectedEntity]);

  useEffect(() => {
    const map = mapRef.current; const container = mapContainerRef.current;
    if (!map || !container) return;
    const observer = new ResizeObserver(() => map.resize()); observer.observe(container); map.resize();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const onClick = (event: maplibregl.MapMouseEvent) => {
      clickPopupRef.current?.remove();
      clickPopupRef.current = null;
      const available = INTERACTIVE_LAYERS.filter((layer) => Boolean(map.getLayer(layer)));
      if (!available.length) return;
      const feature = map.queryRenderedFeatures(event.point, { layers: [...available] })[0];
      const id = feature?.properties?.id ?? feature?.properties?.entityId;
      if (!feature || id === undefined || id === null) {
        setSelectedEntity(null);
        if (activeCatchmentHesId) toggleCatchment(activeCatchmentHesId);
        return;
      }
      if (feature.layer.id === 'rivers-core') setSelectedEntity({ type: 'river', id: String(id) });
      if (feature.layer.id === 'dams-points') setSelectedEntity({ type: 'dam', id: String(id) });
      if (feature.layer.id === 'basins-fill') {
        const basinId = feature.properties?.basinId ?? feature.properties?.HAVZA_ID ?? feature.properties?.ID;
        if (basinId !== undefined && basinId !== null) setSelectedEntity({ type: 'basin', id: String(basinId) });
      }
      if (feature.layer.id === 'reservoirs-outline') {
        const hesId = Array.isArray(feature.properties?.hesIds) ? String(feature.properties.hesIds[0] ?? '') : '';
        if (hesId) setSelectedEntity({ type: 'hes', id: hesId });
        return;
      }
      if (feature.layer.id === 'hes177-points' || feature.layer.id === HES_PIE_LAYER_ID) {
        const hesId = String(id);
        setSelectedEntity({ type: 'hes', id: hesId });
        const properties = { ...((feature.properties ?? {}) as Record<string, unknown>) };
        const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 14, maxWidth: '280px', className: themeRef.current === 'light' ? 'hydro-click-popup-wrap hydro-tooltip-light' : 'hydro-click-popup-wrap' })
          .setLngLat(event.lngLat)
          .setHTML(hesPopupHtml(properties))
          .addTo(map);
        clickPopupRef.current = popup;
        popup.on('close', () => { if (clickPopupRef.current === popup) clickPopupRef.current = null; });
        bindHesPopupActions(popup, hesId);
      }
    };
    const onEnter = () => { map.getCanvas().style.cursor = 'pointer'; };
    const onLeave = () => { map.getCanvas().style.cursor = ''; popupRef.current?.remove(); };
    const onMove = (event: maplibregl.MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      if (!feature) return;
      const props = (feature.properties ?? {}) as Record<string, unknown>;
      const layerId = feature.layer.id;
      const kind = layerId === 'basins-fill' ? 'basin' : layerId === 'rivers-core' ? 'river' : layerId === 'reservoirs-outline' ? 'lake' : layerId === 'hes177-points' || layerId === HES_PIE_LAYER_ID ? 'hes' : 'dam';
      const name = displayName(props, kind, String(props.id ?? feature.id ?? ''));
      const detail = kind === 'hes'
        ? [`${props.installedPowerMw ?? '—'} MW · ${String(props.riverName ?? props.displayRiverName ?? 'Akarsu doğrulanamadı')}`, `Doluluk: ${props.occupancy === null || props.occupancy === undefined ? 'Veri yok' : `%${Math.round(Number(props.occupancy))}`}`, `Kaynak: ${shortSourceLabel(props)}`]
          .join('\n')
        : kind === 'river' ? `${props.hasForecast ? 'GEOGLOWS tahmini mevcut' : 'GEOGLOWS tahmini yok'}\nHavza: ${String(props.basinName ?? props.HavzaAdi ?? props.basinId ?? '—')}`
          : kind === 'dam' ? `${props.occupancy !== null && props.occupancy !== undefined ? `Doluluk: %${Math.round(Number(props.occupancy))}` : 'Doluluk: Veri yok'}${props.isProducer === true ? '\n⚡ Bağlı HES tesisi' : ''}`
            : `Alan: ${props.areaKm2 ? `${Number(props.areaKm2).toLocaleString('tr-TR')} km²` : 'özet veri yok'}`;
      popupRef.current?.remove();
      popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 10, className: themeRef.current === 'light' ? 'hydro-tooltip hydro-tooltip-light' : 'hydro-tooltip' })
        .setLngLat(event.lngLat)
        .setText(`${name}\n${detail}`)
        .addTo(map);
    };
    map.on('click', onClick); INTERACTIVE_LAYERS.forEach((layer) => { map.on('mouseenter', layer, onEnter); map.on('mouseleave', layer, onLeave); });
    INTERACTIVE_LAYERS.forEach((layer) => map.on('mousemove', layer, onMove));
    return () => { map.off('click', onClick); INTERACTIVE_LAYERS.forEach((layer) => { map.off('mouseenter', layer, onEnter); map.off('mouseleave', layer, onLeave); map.off('mousemove', layer, onMove); }); popupRef.current?.remove(); clickPopupRef.current?.remove(); };
  }, [activeCatchmentHesId, setSelectedEntity, toggleCatchment]);

  useEffect(() => {
    const popup = clickPopupRef.current;
    if (!popup || selectedEntity?.type !== 'hes') return;
    const feature = collections.hes177.features.find((candidate) => String(candidate.properties?.id ?? candidate.id ?? '') === selectedEntity.id);
    if (!feature) return;
    const properties = { ...((feature.properties ?? {}) as Record<string, unknown>) };
    popup.setHTML(hesPopupHtml(properties));
    bindHesPopupActions(popup, selectedEntity.id);
  }, [collections, selectedEntity]);

  return (
    <div ref={mapContainerRef} className="hydrology-map-canvas" style={{ minHeight: 320 }} aria-label="Türkiye hidroloji haritası" />
  );
}
