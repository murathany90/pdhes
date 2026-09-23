import { useState, useEffect, useMemo, useReducer, useRef } from 'react';
import { Droplets, Mountain, Play, Square, Tag, Zap, Search, Settings2, PanelLeft, PanelRight, Eye, EyeOff, X } from 'lucide-react';
import { DEFAULT_SITE_ID, useSiteStore } from '../stores/useSiteStore';
import { COMPONENTS } from '../utils/constants';
import type { Layout3DFootprint, Site } from '../types/site';
import type { Layout3DProjectedFootprint } from '../utils/layout3dFootprints';
import type { DerivedLayout3DTopology } from '../utils/layout3dSimulation';
import LayerToggle from '../components/ui/LayerToggle';
import ScenarioSlider from '../components/ui/ScenarioSlider';
import ThreeDModel from '../components/ui/ThreeDModel';
import WarningBanner from '../components/ui/WarningBanner';
import { buildComponentsDetail, COORDINATE_CONFIDENCE_LABELS, PDHES_TYPE_LABELS } from '../utils/siteDerived';
import { publicAssetUrl } from '../utils/publicUrl';
import { footprintLayerKey, groupFootprintsByLayer, isValidLayout3DFootprint, shouldClearActiveFootprintComponent } from '../utils/layout3dFootprints';
import { resolveLayout3DDisplayStatus, LAYOUT_3D_DISPLAY_STATUS_LABELS } from '../utils/layout3dDisplayStatus';
import { FLOW_VISUAL, resolveSceneQuality } from '../utils/layout3dVisual';
import { componentDescription, componentLabel, footprintItemDetailLabel, footprintItemLabel } from '../utils/layout3dLabels';
import { useLayout3DSnapshot } from '../hooks/useLayout3DSnapshot';
import { useManualGeometryStore } from '../stores/useManualGeometryStore';
import { overrideSiteWithManualGeometries } from '../utils/manualGeometryConverter';
import { useShallow } from 'zustand/react/shallow';
import {
  advanceReservoirSoc,
  SIMULATION_STATE_LABELS,
  transitionSimulationState,
  type SimulationQuality,
  type SimulationState,
} from '../utils/layout3dSimulation';

const DETAIL_LABELS: Record<string, string> = {
  elevation_m: 'Kaynak kotu (m)', active_volume_mcm: 'Aktif hacim (hm³)', dam_height_m: 'Set yüksekliği (m)',
  lining: 'Kaplama', geology_note: 'Jeoloji notu', shape_note: 'Geometri kaynağı', render_mode: 'Gösterim yöntemi',
  min_level_m: 'Alt seviye (m)', note: 'Not', diameter_m: 'Çap (m)', length_m: 'Uzunluk (m)', material: 'Malzeme',
  pressure_class: 'Basınç sınıfı', count: 'Adet', units: 'Ünite sayısı', unitPowerMW: 'Ünite üretim gücü (MW)',
  unitPumpMW: 'Ünite pompa gücü (MW)', cavern_width_m: 'Genişlik (m)', cavern_length_m: 'Uzunluk (m)',
  cavern_height_m: 'Yükseklik (m)', turbine_type: 'Makine tipi', type: 'Tür', height_m: 'Yükseklik (m)',
  voltage_kv: 'Gerilim (kV)', transformer_count: 'Trafo sayısı', connection_line_km: 'Bağlantı uzunluğu (km)',
  excavation_type: 'Kazı yöntemi', visualization_note: 'Gösterim notu',
};

function createLayerVisibilityState(visible: boolean): Record<string, boolean> {
  return COMPONENTS.reduce<Record<string, boolean>>((acc, component) => {
    acc[component.key] = visible;
    return acc;
  }, {});
}

function firstVisibleComponentKey(layers: Record<string, boolean>): string {
  return COMPONENTS.find((component) => layers[component.key] !== false)?.key ?? '';
}

function isKnownComponentKey(component: string): boolean {
  return COMPONENTS.some((item) => item.key === component);
}

type StructureItemKind = 'footprint' | 'unit' | 'transformer' | 'layer';

interface StructureItem {
  id: string;
  label: string;
  layerKey: string;
  kind: StructureItemKind;
}

interface StructureSection {
  key: string;
  label: string;
  layerKeys: string[];
  items: StructureItem[];
}

const STRUCTURE_SECTIONS: ReadonlyArray<{ key: string; label: string; layerKeys: string[] }> = [
  { key: 'upper', label: 'Üst Rezervuar', layerKeys: ['upper_reservoir'] },
  { key: 'waterways', label: 'Hidrolik Su Yolları', layerKeys: ['tunnel', 'surge_tank', 'penstock', 'tailrace', 'portal'] },
  { key: 'plant', label: 'Santral', layerKeys: ['powerhouse'] },
  { key: 'lower', label: 'Alt Rezervuar', layerKeys: ['lower_reservoir'] },
  { key: 'grid', label: 'Şalt ve Bağlantı', layerKeys: ['switchyard', 'transmission'] },
];

/**
 * Sol yapı ağacı: footprint kimlikleri varsa tekil nesneler, yoksa katman
 * satırları. Kaynakta bulunmayan bileşen üretilmez.
 */
function buildStructureTree(
  items: Layout3DProjectedFootprint[],
  topology: DerivedLayout3DTopology | null,
  unitIds: string[],
): StructureSection[] {
  const byLayer = new Map(groupFootprintsByLayer(items).map((group) => [group.layerKey, group.items]));
  return STRUCTURE_SECTIONS.map((section) => {
    const sectionItems: StructureItem[] = [];
    for (const layerKey of section.layerKeys) {
      const footprints = byLayer.get(layerKey) ?? [];
      if (footprints.length === 0) {
        sectionItems.push({ id: `layer:${layerKey}`, label: componentLabel(layerKey), layerKey, kind: 'layer' });
      } else {
        for (const footprint of footprints) {
          sectionItems.push({ id: footprint.id, label: footprintItemDetailLabel(footprint), layerKey, kind: 'footprint' });
        }
      }
    }
    if (section.key === 'plant') {
      for (const unitId of unitIds) {
        sectionItems.push({ id: unitId, label: `${unitId} · Pompa-türbin`, layerKey: 'powerhouse', kind: 'unit' });
      }
    }
    if (section.key === 'grid' && topology) {
      for (const transformer of topology.transformers) {
        sectionItems.push({ id: transformer.id, label: `${transformer.id} · Trafo`, layerKey: 'switchyard', kind: 'transformer' });
      }
    }
    return { ...section, items: sectionItems };
  });
}

type InfoTab = 'general' | 'technical' | 'operation' | 'source';

const INFO_TABS: ReadonlyArray<{ id: InfoTab; label: string }> = [
  { id: 'general', label: 'Genel' },
  { id: 'technical', label: 'Teknik Veri' },
  { id: 'operation', label: 'İşletme' },
  { id: 'source', label: 'Kaynak / Veri' },
];
type FootprintLoadStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'empty'
  | 'not-found'
  | 'invalid-schema'
  | 'network-error'
  | 'timeout'
  | 'fallback-model';

interface FootprintLoadState {
  siteId: string | null;
  status: FootprintLoadStatus;
  footprints: Layout3DFootprint[];
  error?: string;
}

function validateFootprintPayload(value: unknown): value is Layout3DFootprint[] {
  return Array.isArray(value) && value.length > 0 && value.every(isValidLayout3DFootprint);
}

function makeUnitIds(count: number): string[] {
  return Array.from({ length: Math.max(0, count) }, (_, index) => `G${index + 1}`);
}

function simulationReducer(state: SimulationState, action: Parameters<typeof transitionSimulationState>[1]): SimulationState {
  return transitionSimulationState(state, action);
}

const INITIAL_RESERVOIR_SOC = { upper: 0.72, lower: 0.28 };
const SIMULATION_STEP_SECONDS = 60;

interface ThreeDPageProps {
  site?: Site;
  dataLoading?: boolean;
  dataError?: string | null;
}

export default function ThreeDPage({ site: propSite, dataLoading = false, dataError = null }: ThreeDPageProps) {
  const { sites, selectedId, selectSite } = useSiteStore();
  const site = propSite
    || sites.find((item) => item.id === selectedId)
    || sites.find((item) => item.id === DEFAULT_SITE_ID)
    || sites[0];

  const initialLayers = useMemo(() => {
    return createLayerVisibilityState(true);
  }, []);

  const [layers, setLayers] = useState<Record<string, boolean>>(initialLayers);
  const [footprintLoad, setFootprintLoad] = useState<FootprintLoadState>({
    siteId: null,
    status: 'idle',
    footprints: [],
  });
  const footprintRequestRef = useRef(0);
  const [footprintRetry, setFootprintRetry] = useState(0);

  // Lazy load footprints
  useEffect(() => {
    const requestId = footprintRequestRef.current + 1;
    footprintRequestRef.current = requestId;
    const requestSiteId = site?.id ?? null;
    let disposed = false;
    let timedOut = false;
    const applyResult = (result: Omit<FootprintLoadState, 'siteId'>) => {
      if (disposed || requestId !== footprintRequestRef.current) return;
      setFootprintLoad({ ...result, siteId: requestSiteId });
    };

    if (!site?.layout3D?.useFootprintPolygons) {
      applyResult({ status: 'idle', footprints: [] });
      return undefined;
    }

    const inlineFootprints = site.layout3D.componentFootprints;
    if (inlineFootprints && inlineFootprints.length > 0) {
      if (inlineFootprints.every(isValidLayout3DFootprint)) {
        applyResult({ status: 'success', footprints: inlineFootprints });
      } else {
        applyResult({ status: 'invalid-schema', footprints: [], error: 'Footprint şeması geçersiz.' });
      }
      return undefined;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 10_000);
    applyResult({ status: 'loading', footprints: [] });
    fetch(publicAssetUrl(`/footprints/${requestSiteId}.json`), { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          applyResult({
            status: res.status === 404 ? 'not-found' : 'network-error',
            footprints: [],
            error: `HTTP ${res.status}`,
          });
          return;
        }
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          applyResult({ status: 'empty', footprints: [], error: 'Footprint dizisi boş.' });
          return;
        }
        if (!validateFootprintPayload(data)) {
          applyResult({
            status: 'invalid-schema',
            footprints: [],
            error: 'Footprint şeması geçersiz.',
          });
          return;
        }
        applyResult({ status: 'success', footprints: data });
      })
      .catch((err) => {
        if (disposed || requestId !== footprintRequestRef.current) return;
        if (err?.name === 'AbortError' && !timedOut) return;
        console.error('Failed to load footprints:', err);
        applyResult({
          status: err?.name === 'AbortError' && timedOut ? 'timeout' : 'network-error',
          footprints: [],
          error: String(err?.message || err),
        });
      }).finally(() => window.clearTimeout(timeout));
    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [site?.id, site?.layout3D?.useFootprintPolygons, site?.layout3D?.componentFootprints, footprintRetry]);

  const [activeComponent, setActiveComponent] = useState('upper_reservoir');
  const [mode, setMode] = useState<'generate' | 'pump'>('generate');

  const [isPlaying, setIsPlaying] = useState(false);
  const [simulationState, dispatchSimulation] = useReducer(simulationReducer, 'IDLE');
  const [reservoirSoc, setReservoirSoc] = useState(INITIAL_RESERVOIR_SOC);
  const [quality, setQuality] = useState<SimulationQuality>(() => resolveSceneQuality());
  const [fxEnabled, setFxEnabled] = useState(true);
  const componentsDetail = useMemo(() => (site ? buildComponentsDetail(site) : null), [site]);
  const unitIds = useMemo(() => site?.layout3D?.topology?.units?.map((unit) => unit.id) ?? makeUnitIds(componentsDetail?.powerhouse?.units || 4), [site, componentsDetail]);
  const maxUnits = unitIds.length;
  const [activeUnitIds, setActiveUnitIds] = useState<string[]>(() => unitIds);
  const activeUnits = activeUnitIds.length;
  const upperSoc = reservoirSoc.upper;
  const lowerSoc = reservoirSoc.lower;
  const reservoirRef = useRef(reservoirSoc);
  const [energyMWh, setEnergyMWh] = useState(0);
  // Telemetri ile sahne aynı anlık görüntüyü kullanır: girdi her iki
  // tarafta da manuel geometri override'lı efektif tesistir.
  const manualFeatures = useManualGeometryStore(useShallow((state) => state.getFeaturesForSite(site?.id ?? '')));
  const siteWithFootprints = useMemo(() => {
    if (!site) return undefined;
    const footprints = footprintLoad.siteId === site.id ? footprintLoad.footprints : [];
    return {
      ...site,
      layout3D: site.layout3D ? {
        ...site.layout3D,
        componentFootprints: footprints,
      } : undefined
    };
  }, [site, footprintLoad.siteId, footprintLoad.footprints]);
  const effectiveSite = useMemo(
    () => (siteWithFootprints ? overrideSiteWithManualGeometries(siteWithFootprints, manualFeatures) : undefined),
    [siteWithFootprints, manualFeatures],
  );
  const { snapshot, footprintPlan, topology } = useLayout3DSnapshot({
    site: effectiveSite,
    componentsDetail,
    activeUnitIds,
    mode,
    simulationState,
    isPlaying,
  });


  const setAllLayerVisibility = (visible: boolean) => {
    const nextLayers = createLayerVisibilityState(visible);
    setLayers(nextLayers);
    setActiveComponent(visible ? firstVisibleComponentKey(nextLayers) : '');
    if (!visible) setSelectedItemId(null);
  };

  const setComponentLayerVisibility = (key: string, visible: boolean) => {
    setLayers((prev) => {
      const nextLayers = { ...prev, [key]: visible };
      setActiveComponent((current) => (
        shouldClearActiveFootprintComponent(current, key, visible)
          ? firstVisibleComponentKey(nextLayers)
          : current
      ));
      if (!visible) {
        setSelectedItemId((current) => (current && layerKeyOfItem(current) === key ? null : current));
      }
      return nextLayers;
    });
  };

  const selectComponent = (component: string) => {
    setActiveComponent(isKnownComponentKey(component) ? component : '');
    setSelectedItemId(null);
  };

  // Tekil nesne seçimi: tür + kimlik aynı anda güncellenir; sol ağaç,
  // sahne, bilgi paneli ve kamera odağı aynı kimliği kullanır.
  const selectItem = (layerKey: string, itemId: string | null) => {
    setSelectedItemId(itemId);
    setActiveComponent(isKnownComponentKey(layerKey) ? layerKey : '');
    setInfoOpen(true);
  };

  const layerKeyOfItem = (itemId: string): string | null => {
    const footprint = footprintPlan.items.find((item) => item.id === itemId);
    if (footprint) return footprintLayerKey(footprint.component);
    if (topology?.units.some((unit) => unit.id === itemId)) return 'powerhouse';
    if (topology?.transformers.some((transformer) => transformer.id === itemId)) return 'switchyard';
    return null;
  };

  // Reset state when site changes
  useEffect(() => {
    if (site) {
      setActiveComponent('upper_reservoir');
      setSelectedItemId(null);
      setMode('generate');
      setIsPlaying(false);
      dispatchSimulation({ type: 'STOP' });
      setReservoirSoc(INITIAL_RESERVOIR_SOC);
      reservoirRef.current = INITIAL_RESERVOIR_SOC;
      setEnergyMWh(0);
      setActiveUnitIds(unitIds);
    }
  }, [site?.id]);

  // Son aktif ünite kapatıldığında simülasyonu durdur; ünite yeniden
  // seçildiğinde kullanıcı komutu olmadan akışın kendiliğinden
  // başlamasını önle.
  useEffect(() => {
    if (activeUnitIds.length === 0 && isPlaying) {
      setIsPlaying(false);
      dispatchSimulation({ type: 'STOP' });
    }
  }, [activeUnitIds, isPlaying]);

  useEffect(() => {
    if (!isPlaying || !simulationState.startsWith('STARTING')) return;
    // A UI transition only; no transient hydraulic process is calculated.
    const timer = window.setTimeout(() => dispatchSimulation({ type: 'TICK' }), 400);
    return () => window.clearTimeout(timer);
  }, [isPlaying, simulationState]);

  useEffect(() => {
    if (!snapshot.running || !componentsDetail || snapshot.flowCms <= 0) return;
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'hidden') return;
      const current = reservoirRef.current;
      const volume = componentsDetail.upper_reservoir.active_volume_mcm;
      const next = advanceReservoirSoc({
        upperSoc: current.upper, lowerSoc: current.lower, mode,
        flowCms: snapshot.flowCms, deltaSeconds: SIMULATION_STEP_SECONDS,
        activeVolumeHm3: volume,
      });
      const transferredM3 = Math.abs(next.upperSoc - current.upper) * volume * 1_000_000;
      const actualSeconds = transferredM3 / snapshot.flowCms;
      setEnergyMWh((energy) => energy + (mode === 'generate' ? 1 : -1) * snapshot.powerMW * actualSeconds / 3600);
      reservoirRef.current = { upper: next.upperSoc, lower: next.lowerSoc };
      setReservoirSoc(reservoirRef.current);
      if (next.limitState) {
        dispatchSimulation({ type: next.limitState });
        setIsPlaying(false);
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, [componentsDetail, mode, snapshot.running, snapshot.flowCms, snapshot.powerMW]);

  const [showTerrain, setShowTerrain] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [terrainOpacity, setTerrainOpacity] = useState(70);
  const [xray, setXray] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [infoTab, setInfoTab] = useState<InfoTab>('general');
  // Dar ekranda çekmeceler kapalı açılır; sahne görünür kalır.
  const [treeOpen, setTreeOpen] = useState(() => (typeof window === 'undefined' ? true : window.innerWidth > 1100));
  const [infoOpen, setInfoOpen] = useState(() => (typeof window === 'undefined' ? true : window.innerWidth > 1100));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [siteSearch, setSiteSearch] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);

  const footprintPendingForSite = Boolean(
    site?.layout3D?.useFootprintPolygons && footprintLoad.siteId !== site.id,
  );
  const footprintLoadingForSite = Boolean(
    site?.layout3D?.useFootprintPolygons
    && (footprintPendingForSite || (footprintLoad.siteId === site.id && footprintLoad.status === 'loading')),
  );
  if (!site) {
    return (
      <section className="panel active">
        <p className="muted" role={dataError ? 'alert' : 'status'}>
          {dataError
            ? `3D tesis verisi yüklenemedi: ${dataError}`
            : dataLoading
              ? 'Veri yükleniyor...'
              : 'Geçerli tesis verisi bulunamadı.'}
        </p>
      </section>
    );
  }
  const detail = componentsDetail ?? buildComponentsDetail(site);
  // Aşama 2'de UI bu durumu doğrudan kullanabilir: footprint / yükleniyor /
  // temsili / yüklenemeyen-geometri-geri-dönüşü.
  const displayStatus = resolveLayout3DDisplayStatus({
    useFootprintPolygons: site.layout3D?.useFootprintPolygons,
    loadStatus: footprintLoad.siteId === site.id ? footprintLoad.status : 'loading',
    hasFootprints: (footprintLoad.siteId === site.id ? footprintLoad.footprints : []).length > 0,
  });
  const footprintWarning = displayStatus === 'fallback'
    ? `Footprint verisi yüklenemedi; temsili model gösteriliyor (${footprintLoad.status}). Doğrulanmış yerleşim gibi değerlendirme.`
    : '';
  const representationalWarning = `Kaynak footprint koordinatları korunur; ekipman kesitleri, bağlantılar ve su seviyesi hareketi temsilidir. Koordinat güveni: ${COORDINATE_CONFIDENCE_LABELS[site.coordinates.coordinateConfidence]}. DEM ve kot–hacim eğrisi bağlı değildir.`;
  const combinedWarning = [footprintWarning, representationalWarning].filter(Boolean).join(' ');
  const isFootprintMode = Boolean(site.layout3D?.useFootprintPolygons);
  const terrainLabel = 'Temsili arazi';
  const selectedComponent = COMPONENTS.find(c => c.key === activeComponent);
  const toggleUnit = (id: string) => {
    setActiveUnitIds((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id].sort()
    ));
  };
  const startOrStopSimulation = () => {
    if (isPlaying) {
      setIsPlaying(false);
      dispatchSimulation({ type: 'STOP' });
      return;
    }
    if (activeUnits === 0) return;
    setIsPlaying(true);
    dispatchSimulation({ type: 'START', mode });
  };

  const structureTree = useMemo(
    () => buildStructureTree(footprintPlan.items, topology, unitIds),
    [footprintPlan, topology, unitIds],
  );
  const filteredSites = useMemo(() => {
    const query = siteSearch.trim().toLocaleLowerCase('tr-TR');
    if (!query) return sites;
    return sites.filter((candidate) => (
      candidate.name.toLocaleLowerCase('tr-TR').includes(query)
      || candidate.province.toLocaleLowerCase('tr-TR').includes(query)
    ));
  }, [sites, siteSearch]);

  const selectedFootprint = selectedItemId
    ? footprintPlan.items.find((item) => item.id === selectedItemId)
    : undefined;
  const selectedUnit = selectedItemId
    ? topology?.units.find((unit) => unit.id === selectedItemId)
    : undefined;
  const selectedTransformer = selectedItemId
    ? topology?.transformers.find((transformer) => transformer.id === selectedItemId)
    : undefined;
  const infoLayerKey = selectedFootprint
    ? footprintLayerKey(selectedFootprint.component)
    : selectedUnit ? 'powerhouse'
      : selectedTransformer ? 'switchyard'
        : activeComponent;
  const infoTitle = selectedUnit
    ? `${selectedUnit.id} · Pompa-türbin ünitesi`
    : selectedTransformer
      ? `${selectedTransformer.id} · Trafo`
      : selectedFootprint
        ? footprintItemDetailLabel(selectedFootprint)
        : selectedComponent?.label ?? 'Seçim yok';

  const DETAIL_KEY_BY_LAYER: Record<string, string> = {
    upper_reservoir: 'upper_reservoir',
    tunnel: 'tunnel',
    surge_tank: 'surge_tank',
    penstock: 'penstock',
    powerhouse: 'powerhouse',
    lower_reservoir: 'lower_reservoir',
    switchyard: 'switchyard',
    transmission: 'switchyard',
    portal: '',
  };
  const infoDetailKey = DETAIL_KEY_BY_LAYER[infoLayerKey] ?? '';
  const infoDetailEntries = infoDetailKey
    ? Object.entries((detail as unknown as Record<string, Record<string, unknown>>)[infoDetailKey] ?? {})
    : [];
  const penstockOfUnit = selectedUnit
    ? topology?.penstocks.find((penstock) => penstock.connectedUnitIds.includes(selectedUnit.id))
    : undefined;
  const transformerOfUnit = selectedUnit
    ? topology?.transformers.find((transformer) => transformer.connectedUnitIds.includes(selectedUnit.id))
    : undefined;

  return (
    <section className="panel active no-pad threed-page threed-shell">
      {/* ÜST TESİS ÇUBUĞU */}
      <div className="threed-topbar">
        <button
          type="button"
          className="btn ghost"
          aria-pressed={treeOpen}
          aria-label="Yapı ağacını aç/kapat"
          title="Yapı ağacı"
          onClick={() => setTreeOpen((open) => !open)}
        >
          <PanelLeft size={16} aria-hidden="true" />
        </button>
        <div className="threed-site-search">
          <Search size={15} aria-hidden="true" />
          <input
            type="search"
            aria-label="Tesis ara"
            placeholder="Tesis ara… (Gökçekaya, Sarıyar, Altınkaya)"
            value={siteSearch}
            onChange={(event) => setSiteSearch(event.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => window.setTimeout(() => setSearchFocus(false), 150)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setSiteSearch('');
                event.currentTarget.blur();
              }
            }}
          />
          {searchFocus && (
            <div className="threed-site-results" role="listbox" aria-label="Tesis sonuçları">
              <p className="muted" style={{ padding: '4px 10px', fontSize: 12 }}>
                {siteSearch ? `${filteredSites.length} sonuç` : `Tüm tesisler (${filteredSites.length})`}
              </p>
              {filteredSites.length === 0 && (
                <p className="muted" style={{ padding: '8px 12px', fontSize: 13 }}>Sonuç bulunamadı.</p>
              )}
              {filteredSites.map((candidate) => (
                <button
                  key={candidate.id}
                  type="button"
                  role="option"
                  aria-selected={candidate.id === site.id}
                  className={`threed-site-result ${candidate.id === site.id ? 'active' : ''}`}
                  onClick={() => { selectSite(candidate.id); setSiteSearch(''); setSearchFocus(false); }}
                >
                  <b>{candidate.name}</b>
                  <span className="muted">
                    {PDHES_TYPE_LABELS[candidate.pdhesType]} · {candidate.capacityMW.toLocaleString('tr-TR')} MW
                    {' '}· {candidate.layout3D?.useFootprintPolygons ? 'Footprint modeli' : 'Temsili model'}
                    {' '}· {COORDINATE_CONFIDENCE_LABELS[candidate.coordinates.coordinateConfidence]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="threed-site-meta">
          <b>{site.name}</b>
          <span className="muted">
            {PDHES_TYPE_LABELS[site.pdhesType]} · {site.capacityMW.toLocaleString('tr-TR')} MW
            {' '}· {LAYOUT_3D_DISPLAY_STATUS_LABELS[displayStatus]}
          </span>
        </div>
        <button
          type="button"
          className="btn ghost"
          aria-pressed={infoOpen}
          aria-label="Bilgi panelini aç/kapat"
          title="Bilgi paneli"
          onClick={() => setInfoOpen((open) => !open)}
        >
          <PanelRight size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="btn ghost"
          aria-pressed={settingsOpen}
          aria-label="Gelişmiş ayarları aç/kapat"
          title="Gelişmiş ayarlar"
          onClick={() => setSettingsOpen((open) => !open)}
        >
          <Settings2 size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="threed-main">
        {/* SOL YAPI AĞACI */}
        <aside className={`threed-tree ${treeOpen ? 'open' : ''}`} aria-label="Tesis yapı ağacı">
          <div className="threed-panel-head">
            <h3>Tesis Bileşenleri</h3>
            <button type="button" className="btn ghost threed-mini" aria-label="Yapı ağacını kapat" onClick={() => setTreeOpen(false)}>
              <X size={15} aria-hidden="true" />
            </button>
          </div>
          {structureTree.map((section) => {
            const allVisible = section.layerKeys.every((key) => layers[key] !== false);
            return (
              <div key={section.key} className="threed-tree-section">
                <div className="threed-tree-section-head">
                  <button
                    type="button"
                    className="btn ghost threed-mini"
                    aria-pressed={allVisible}
                    title={`${section.label} katmanlarını ${allVisible ? 'gizle' : 'göster'}`}
                    aria-label={`${section.label} katmanlarını ${allVisible ? 'gizle' : 'göster'}`}
                    onClick={() => {
                      const next = !allVisible;
                      for (const key of section.layerKeys) {
                        if ((layers[key] !== false) !== next) setComponentLayerVisibility(key, next);
                      }
                    }}
                  >
                    {allVisible ? <Eye size={14} aria-hidden="true" /> : <EyeOff size={14} aria-hidden="true" />}
                  </button>
                  <span>{section.label}</span>
                </div>
                {section.layerKeys.map((layerKey) => (
                  <div key={layerKey}>
                    <LayerToggle
                      label={componentLabel(layerKey)}
                      color={COMPONENTS.find((c) => c.key === layerKey)?.color}
                      active={layers[layerKey] !== false}
                      onChange={(visible) => setComponentLayerVisibility(layerKey, visible)}
                    />
                    <div className="threed-tree-items">
                      {section.items.filter((item) => item.layerKey === layerKey).map((item) => {
                        const pressed = item.kind === 'layer'
                          ? activeComponent === layerKey && !selectedItemId
                          : selectedItemId === item.id;
                        const statusActive = item.kind === 'unit'
                          ? activeUnitIds.includes(item.id)
                          : undefined;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            className={`threed-tree-item ${pressed ? 'active' : ''}`}
                            aria-pressed={pressed}
                            onClick={() => (
                              item.kind === 'layer'
                                ? selectComponent(layerKey)
                                : selectItem(layerKey, item.id)
                            )}
                          >
                            {statusActive !== undefined && (
                              <span
                                aria-hidden="true"
                                className="threed-tree-dot"
                                style={{ background: statusActive ? FLOW_VISUAL.generate : 'var(--muted)' }}
                              />
                            )}
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </aside>

        {/* ORTA 3D SAHNE */}
        <div className="threed-stage">
          <div className="threed-scene-stage">
            <ThreeDModel
              siteId={site.id}
              activeComponent={activeComponent}
              onSelectComponent={selectComponent}
              selectedItemId={selectedItemId}
              onSelectItem={selectItem}
              layers={layers}
              mode={mode}
              componentsDetail={detail}
              site={siteWithFootprints ?? site}
              isPlaying={isPlaying}
              activeUnits={activeUnits}
              activeUnitIds={activeUnitIds}
              simulationState={simulationState}
              quality={quality}
              upperSoc={upperSoc}
              lowerSoc={lowerSoc}
              maxUnits={maxUnits}
              showTerrain={showTerrain}
              showLabels={showLabels}
              terrainOpacity={terrainOpacity / 100}
              xray={xray}
              fxEnabled={fxEnabled}
            />
            {footprintLoadingForSite && (
              <div className="threed-footprint-loading" role="status" aria-live="polite">
                <strong>{site.name} yerleşim geometrisi yükleniyor</strong>
                <span>Yeni tesise ait footprint verisi gelene kadar önceki tesisin geometrisi gösterilmez.</span>
              </div>
            )}
          </div>
        </div>

        {/* SAĞ BAĞLAMSAL PANEL */}
        <aside className={`threed-info ${infoOpen ? 'open' : ''}`} aria-label="Bileşen bilgi paneli">
          <div className="threed-panel-head">
            <h3>{infoTitle}</h3>
            <button type="button" className="btn ghost threed-mini" aria-label="Bilgi panelini kapat" onClick={() => setInfoOpen(false)}>
              <X size={15} aria-hidden="true" />
            </button>
          </div>
          {(footprintWarning || representationalWarning) && (
            <div style={{ marginBottom: 12 }}>
              <WarningBanner type="danger" message={combinedWarning} />
              {footprintWarning && (
                <button type="button" className="btn ghost" style={{ marginTop: 8 }} onClick={() => setFootprintRetry((v) => v + 1)}>
                  Geometriyi yeniden yükle
                </button>
              )}
            </div>
          )}
          <div className="threed-tabs" role="tablist" aria-label="Bilgi sekmeleri">
            {INFO_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={infoTab === tab.id}
                className={`threed-tab ${infoTab === tab.id ? 'active' : ''}`}
                onClick={() => setInfoTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {infoTab === 'general' && (
            <div role="tabpanel">
              <p style={{ fontSize: 13, color: 'var(--text)', marginBottom: 16, lineHeight: 1.5 }}>
                {componentDescription(infoLayerKey) || 'Görünür bir katman seçildiğinde bileşen detayları burada gösterilir.'}
              </p>
              {selectedFootprint && (
                <p className="muted" style={{ fontSize: 13, marginBottom: 8 }}>
                  Kayıt: <b>{selectedFootprint.id}</b> · {selectedFootprint.kind === 'polygon' ? 'Alan' : 'Güzergâh'}
                </p>
              )}
              {selectedUnit && (
                <p className="muted" style={{ fontSize: 13, marginBottom: 8 }}>
                  Durum: <b>{activeUnitIds.includes(selectedUnit.id) ? 'Aktif ünite' : 'Pasif ünite'}</b>
                  {penstockOfUnit ? ` · Bağlantı: ${footprintItemLabel({ id: penstockOfUnit.footprintId, component: 'penstock' })}` : ''}
                  {transformerOfUnit ? ` · ${transformerOfUnit.id}` : ''}
                </p>
              )}
              <label className="threed-component-picker">Bileşen seçimi
                <select value={activeComponent} onChange={(event) => selectComponent(event.target.value)}>
                  <option value="">Katman seçilmedi</option>
                  {COMPONENTS.filter((c) => layers[c.key]).map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </label>
              <p className="threed-data-note">Kesikli su yolu: yeraltı/eksen gösterimi. Sarı kesikli bağlantılar, elektrik hattı ve ekipman bağlantıları temsilidir. Su yüzeyleri footprint sınırını korur; kıyı çekilmesi hesaplanmaz. Kotlar farklı kaynaklarda uyuşmayabilir; sahne footprint kotunu kullanır.</p>
            </div>
          )}

          {infoTab === 'technical' && (
            <div role="tabpanel">
              {selectedUnit && (
                <div style={{ display: 'grid', gap: 8, fontSize: 14, marginBottom: 12 }}>
                  <p><b>Üretim gücü:</b> <span className="muted">{selectedUnit.ratedGenerationMW.toLocaleString('tr-TR')} MW</span></p>
                  <p><b>Pompa gücü:</b> <span className="muted">{selectedUnit.ratedPumpMW.toLocaleString('tr-TR')} MW</span></p>
                  <p><b>Debi:</b> <span className="muted">{selectedUnit.generationFlowCms != null ? `${selectedUnit.generationFlowCms.toLocaleString('tr-TR')} m³/s` : 'Kaynakta yok'}</span></p>
                  <p className="threed-data-note">Ünite değerleri temsili dağılımla türetilir; üretici verisi değildir.</p>
                </div>
              )}
              {selectedTransformer && (
                <div style={{ display: 'grid', gap: 8, fontSize: 14, marginBottom: 12 }}>
                  <p><b>Bağlı üniteler:</b> <span className="muted">{selectedTransformer.connectedUnitIds.join(', ') || '—'}</span></p>
                  <p><b>Gerilim:</b> <span className="muted">{selectedTransformer.highVoltageKV != null ? `${selectedTransformer.highVoltageKV} kV` : 'Kaynakta yok'}</span></p>
                </div>
              )}
              {infoDetailEntries.length === 0 && !selectedUnit && !selectedTransformer && (
                <p className="muted" style={{ fontSize: 13 }}>Bu bileşen için kaynakta ayrı teknik veri yok.</p>
              )}
              {infoDetailEntries.map(([k, v]) => (
                <p key={k} style={{ marginBottom: 8, fontSize: 14 }}>
                  <b style={{ color: 'var(--text)' }}>{DETAIL_LABELS[k] ?? k.replace(/_/g, ' ')}:</b>{' '}
                  <span className="muted">{typeof v === 'number' ? v.toLocaleString('tr-TR', { maximumFractionDigits: 3 }) : String(v)}</span>
                  <small className="threed-provenance">{Object.hasOwn((site.components_detail as unknown as Record<string, object> | undefined)?.[infoDetailKey] ?? {}, k) ? 'Kaynak dosyası değeri · doğrulama düzeyi tesis notundadır' : 'Türetilmiş / temsili ön kabul'}</small>
                </p>
              ))}
            </div>
          )}

          {infoTab === 'operation' && (
            <div role="tabpanel">
              <p className="threed-data-note">İşletme: {SIMULATION_STATE_LABELS[simulationState]} · Seçili ünite {activeUnits}/{maxUnits}. Ekipman yerleşimi ve grup bağlantıları temsili gösterimdir.</p>
              <div style={{ display: 'grid', gap: 8, fontSize: 14 }}>
                <p><b>Güç:</b> <span className="muted">{mode === 'pump' && snapshot.powerMW ? '−' : ''}{snapshot.powerMW.toFixed(1)} MW</span></p>
                <p><b>Debi:</b> <span className="muted">{snapshot.running && snapshot.flowCms <= 0 ? 'temsilî akış' : `${snapshot.flowCms.toFixed(1)} m³/s`}</span></p>
                <p><b>Üst SOC:</b> <span className="muted">%{(upperSoc * 100).toFixed(1)}</span></p>
                <p><b>Alt SOC:</b> <span className="muted">%{(lowerSoc * 100).toFixed(1)}</span></p>
                <p><b>Net enerji:</b> <span className="muted">{energyMWh.toFixed(1)} MWh</span></p>
              </div>
            </div>
          )}

          {infoTab === 'source' && (
            <div role="tabpanel">
              {selectedFootprint ? (
                <div style={{ display: 'grid', gap: 8, fontSize: 14, marginBottom: 12 }}>
                  <p><b>Kayıt:</b> <span className="muted">{selectedFootprint.id}</span></p>
                  <p><b>Tür:</b> <span className="muted">{selectedFootprint.kind} · {selectedFootprint.material}</span></p>
                  <p className="threed-data-note">Kaynak halka koordinatları korunur; görüntüleme geometrisi sadeleştirilebilir.</p>
                </div>
              ) : (
                <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>Tekil footprint kaydı seçilmedi; katman görünümü aktif.</p>
              )}
              <p className="threed-data-note">
                Koordinat güveni: {COORDINATE_CONFIDENCE_LABELS[site.coordinates.coordinateConfidence]} (yerleşim kaynağından ayrı değerlendirilir).
                DEM ve kot–hacim eğrisi bağlı değildir. SCADA bağlantısı yok; gösterim temsili simülasyon içerir.
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* ALT İŞLETME ÇUBUĞU */}
      <div className="threed-bottombar">
        <div className="threed-controls">
          <button
            type="button"
            className={`btn ${mode === 'generate' ? 'primary' : 'ghost'}`}
            aria-pressed={mode === 'generate'}
            style={{ minHeight: 36, fontSize: 13 }}
            onClick={() => {
              if (mode === 'generate') return;
              setMode('generate');
              if (isPlaying) dispatchSimulation({ type: 'START', mode: 'generate' });
            }}
          >
            <Zap size={16} aria-hidden="true" />
            Üretim modu
          </button>
          <button
            type="button"
            className={`btn ${mode === 'pump' ? 'primary' : 'ghost'}`}
            aria-pressed={mode === 'pump'}
            style={{ minHeight: 36, fontSize: 13 }}
            onClick={() => {
              if (mode === 'pump') return;
              setMode('pump');
              if (isPlaying) dispatchSimulation({ type: 'START', mode: 'pump' });
            }}
          >
            <Droplets size={16} aria-hidden="true" />
            Pompalama modu
          </button>
          <button
            type="button"
            className={`btn ${isPlaying ? 'danger-solid' : 'ghost'}`}
            aria-pressed={isPlaying}
            style={{ minHeight: 36, fontSize: 13 }}
            disabled={!isPlaying && activeUnits === 0}
            onClick={startOrStopSimulation}
          >
            {isPlaying ? <Square size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
            {isPlaying ? 'Simülasyonu durdur' : 'Simülasyonu başlat'}
          </button>
        </div>
        <div className="threed-units" aria-label={`Aktif Gruplar (${activeUnits}/${maxUnits})`}>
          {unitIds.map((unitId) => (
            <button
              type="button"
              key={unitId}
              className={`btn ${activeUnitIds.includes(unitId) ? 'primary' : 'ghost'}`}
              aria-pressed={activeUnitIds.includes(unitId)}
              style={{ padding: '4px 12px', minHeight: 32, fontSize: 13 }}
              onClick={() => toggleUnit(unitId)}
            >
              {unitId}
            </button>
          ))}
        </div>
        <div className="threed-telemetry" aria-label="Simülasyon göstergeleri" data-state={simulationState}>
          <span className="threed-mode">{activeUnits === 0 ? 'Duruş · ünite seçilmedi' : SIMULATION_STATE_LABELS[simulationState]}</span>
          <span>Üst SOC <b>%{(upperSoc * 100).toFixed(1)}</b></span>
          <span>Alt SOC <b>%{(lowerSoc * 100).toFixed(1)}</b></span>
          <span>Güç <b>{mode === 'pump' && snapshot.powerMW ? '−' : ''}{snapshot.powerMW.toFixed(1)} MW</b></span>
          <span>Debi <b>{snapshot.running && snapshot.flowCms <= 0 ? 'temsilî akış' : `${snapshot.flowCms.toFixed(1)} m³/s`}</b></span>
          <span>Net enerji <b>{energyMWh.toFixed(1)} MWh</b></span>
        </div>
      </div>

      {/* AÇILABİLİR GELİŞMİŞ AYARLAR */}
      {settingsOpen && (
        <div className="threed-settings" role="dialog" aria-label="Gelişmiş 3D ayarları">
          <div className="threed-panel-head">
            <h3>Gelişmiş Ayarlar</h3>
            <button type="button" className="btn ghost threed-mini" aria-label="Ayarları kapat" onClick={() => setSettingsOpen(false)}>
              <X size={15} aria-hidden="true" />
            </button>
          </div>
          <h4>Katman Görünürlüğü</h4>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button type="button" className="btn ghost" style={{ flex: 1, padding: '4px', fontSize: 12 }} onClick={() => setAllLayerVisibility(true)}>
              Tümünü Aç
            </button>
            <button type="button" className="btn ghost" style={{ flex: 1, padding: '4px', fontSize: 12 }} onClick={() => setAllLayerVisibility(false)}>
              Tümünü Kapat
            </button>
          </div>
          <LayerToggle
            label={<><Mountain size={16} aria-hidden="true" /> {terrainLabel}</>}
            color="#4c6b45"
            active={showTerrain}
            onChange={setShowTerrain}
          />
          {isFootprintMode && (
            <p className="muted" style={{ fontSize: 12, margin: '4px 0 8px' }}>
              Gerçek DEM bağlı değil; zemin footprint sahnesinde temsili yüzey olarak gösterilir.
            </p>
          )}
          <LayerToggle
            label={<><Tag size={16} aria-hidden="true" /> İsim Etiketleri</>}
            color="#aaaaaa"
            active={showLabels}
            onChange={setShowLabels}
          />
          <div style={{ height: 8 }} />
          {COMPONENTS.map(c => (
            <LayerToggle
              key={c.key}
              label={c.label}
              color={c.color}
              active={!!layers[c.key]}
              onChange={(v) => setComponentLayerVisibility(c.key, v)}
            />
          ))}
          <h4>Arazi Görünümü</h4>
          <ScenarioSlider
            label="Arazi Şeffaflığı"
            value={terrainOpacity}
            min={0} max={100} step={5} unit="%"
            onChange={setTerrainOpacity}
          />
          <div style={{ height: 8 }} />
          <LayerToggle
            label="Yeraltı / kesit görünümü (temsili)"
            color="#36d6ff"
            active={xray}
            onChange={setXray}
          />
          <p className="muted" style={{ fontSize: 12, margin: '4px 0 8px' }}>
            Temsili kesit: arazi saydamlaştırılır, kaynak güzergâhları yer değiştirmez.
          </p>
          <LayerToggle
            label="Akış animasyonları"
            color={FLOW_VISUAL.hydraulic}
            active={fxEnabled}
            onChange={setFxEnabled}
          />
          <h4>Grafik Kalitesi</h4>
          <label className="threed-component-picker">Grafik kalitesi
            <select
              value={quality}
              aria-label="Grafik kalitesi"
              onChange={(event) => setQuality(event.target.value as SimulationQuality)}
            >
              <option value="low">Düşük (mobil)</option>
              <option value="auto">Otomatik</option>
              <option value="high">Yüksek</option>
            </select>
          </label>
          <p className="muted" style={{ fontSize: 12, margin: '4px 0 8px' }}>
            Kalite yalnızca görüntüleme ayrıntısını değiştirir; sayısal simülasyon durumu değişmez.
          </p>
          <h4>Görsel Dil</h4>
          <div className="card" style={{ padding: 16, marginBottom: 24, display: 'grid', gap: 8, fontSize: 13 }}>
            {[
              { color: FLOW_VISUAL.water, text: 'Su yüzeyleri' },
              { color: FLOW_VISUAL.hydraulic, text: 'Hidrolik akış (üstten alta / alttan üste)' },
              { color: FLOW_VISUAL.generate, text: 'Elektrik akışı · üretim (santral → şebeke)' },
              { color: FLOW_VISUAL.pump, text: 'Elektrik akışı · pompalama (şebeke → santral)' },
              { color: FLOW_VISUAL.representativeLink, text: 'Temsili bağlantı (kesikli çizgi)' },
            ].map((row) => (
              <div key={row.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span aria-hidden="true" style={{ width: 14, height: 14, borderRadius: 4, background: row.color, flexShrink: 0 }} />
                <span>{row.text}</span>
              </div>
            ))}
          </div>
          <h4>Kamera Kontrolleri</h4>
          <p className="muted">Dokunmatik: tek parmakla döndürün, iki parmakla yakınlaştırın ve kaydırın.</p>
          <div className="card" style={{ padding: 16, backgroundColor: 'var(--surface-sunken)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--text)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <b style={{ minWidth: 120 }}>Sol Tık + Sürükle:</b> <span>Kamerayı Döndür</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <b style={{ minWidth: 120 }}>Sağ Tık + Sürükle:</b> <span>Modeli Kaydır (Pan)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <b style={{ minWidth: 120 }}>Tekerlek (Scroll):</b> <span>Yakınlaş / Uzaklaş</span>
              </div>
            </div>
          </div>
          <p className="threed-data-note" style={{ marginTop: 16 }}>Simülasyon · SCADA bağlantısı yok. 1 saniye = 1 model dakikası. SOC, aynı çevrim hacminin üst/alt depodaki payıdır; barajın ölçülen doluluk oranı değildir. Güç ve debi mevcut modelin sabit işletme kabulleridir; geçişler hidrolik hesap değildir.{site.projectFlowCms == null ? ' Debi kaynağı yok; su animasyonu akış yönünü gösterir, hız temsilidir.' : ''}</p>
        </div>
      )}
    </section>
  );
}
