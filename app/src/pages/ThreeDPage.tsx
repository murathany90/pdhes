import { useState, useEffect, useMemo, useReducer, useRef } from 'react';
import { Droplets, Mountain, Play, Square, Tag, Zap } from 'lucide-react';
import { DEFAULT_SITE_ID, useSiteStore } from '../stores/useSiteStore';
import { COMPONENTS } from '../utils/constants';
import type { Layout3DFootprint, Site } from '../types/site';
import LayerToggle from '../components/ui/LayerToggle';
import ScenarioSlider from '../components/ui/ScenarioSlider';
import ThreeDModel from '../components/ui/ThreeDModel';
import WarningBanner from '../components/ui/WarningBanner';
import { buildComponentsDetail, COORDINATE_CONFIDENCE_LABELS } from '../utils/siteDerived';
import { publicAssetUrl } from '../utils/publicUrl';
import { isValidLayout3DFootprint, shouldClearActiveFootprintComponent } from '../utils/layout3dFootprints';
import {
  advanceReservoirSoc,
  transitionSimulationState,
  type SimulationQuality,
  type SimulationState,
} from '../utils/layout3dSimulation';

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
  const { sites, selectedId } = useSiteStore();
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

  // Lazy load footprints
  useEffect(() => {
    const requestId = footprintRequestRef.current + 1;
    footprintRequestRef.current = requestId;
    const requestSiteId = site?.id ?? null;
    const applyResult = (result: Omit<FootprintLoadState, 'siteId'>) => {
      if (requestId !== footprintRequestRef.current) return;
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
    const timeout = window.setTimeout(() => controller.abort(), 10_000);
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
        if (requestId !== footprintRequestRef.current) return;
        console.error('Failed to load footprints:', err);
        applyResult({
          status: err?.name === 'AbortError' ? 'timeout' : 'network-error',
          footprints: [],
          error: String(err?.message || err),
        });
      });
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [site?.id, site?.layout3D?.useFootprintPolygons, site?.layout3D?.componentFootprints]);

  const [activeComponent, setActiveComponent] = useState('upper_reservoir');
  const [mode, setMode] = useState<'generate' | 'pump'>('generate');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulationState, dispatchSimulation] = useReducer(simulationReducer, 'IDLE');
  const [reservoirSoc, setReservoirSoc] = useState(INITIAL_RESERVOIR_SOC);
  const [quality] = useState<SimulationQuality>('auto');
  const componentsDetail = useMemo(() => (site ? buildComponentsDetail(site) : null), [site]);
  const maxUnits = componentsDetail?.powerhouse?.units || 4;
  const [activeUnitIds, setActiveUnitIds] = useState<string[]>(() => makeUnitIds(maxUnits));
  const activeUnits = activeUnitIds.length;
  const upperSoc = reservoirSoc.upper;
  const lowerSoc = reservoirSoc.lower;

  const setAllLayerVisibility = (visible: boolean) => {
    const nextLayers = createLayerVisibilityState(visible);
    setLayers(nextLayers);
    setActiveComponent(visible ? firstVisibleComponentKey(nextLayers) : '');
  };

  const setComponentLayerVisibility = (key: string, visible: boolean) => {
    setLayers((prev) => {
      const nextLayers = { ...prev, [key]: visible };
      setActiveComponent((current) => (
        shouldClearActiveFootprintComponent(current, key, visible)
          ? firstVisibleComponentKey(nextLayers)
          : current
      ));
      return nextLayers;
    });
  };

  const selectComponent = (component: string) => {
    setActiveComponent(isKnownComponentKey(component) ? component : '');
  };

  // Reset state when site changes
  useEffect(() => {
    if (site) {
      setActiveComponent('upper_reservoir');
      setMode('generate');
      setIsPlaying(false);
      dispatchSimulation({ type: 'STOP' });
      setReservoirSoc(INITIAL_RESERVOIR_SOC);
      setActiveUnitIds(makeUnitIds(buildComponentsDetail(site).powerhouse.units || 4));
    }
  }, [site?.id]);

  useEffect(() => {
    if (isPlaying) dispatchSimulation({ type: 'TICK' });
  }, [isPlaying, mode]);

  useEffect(() => {
    const running = simulationState === 'GENERATING' || simulationState === 'PUMPING';
    if (!site || !componentsDetail || !isPlaying || !running || activeUnits <= 0) return undefined;
    const interval = window.setInterval(() => {
      setReservoirSoc((current) => {
        const activeRatio = maxUnits > 0 ? activeUnits / maxUnits : 0;
        const flowCms = (site.projectFlowCms ?? 0) * activeRatio;
        const next = advanceReservoirSoc({
          upperSoc: current.upper,
          lowerSoc: current.lower,
          mode,
          flowCms,
          deltaSeconds: SIMULATION_STEP_SECONDS,
          activeVolumeHm3: componentsDetail.upper_reservoir.active_volume_mcm,
        });
        if (next.limitState) {
          dispatchSimulation({ type: next.limitState });
          setIsPlaying(false);
        }
        return { upper: next.upperSoc, lower: next.lowerSoc };
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [
    activeUnits,
    componentsDetail,
    isPlaying,
    maxUnits,
    mode,
    simulationState,
    site,
  ]);

  const [showTerrain, setShowTerrain] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [terrainOpacity, setTerrainOpacity] = useState(70);

  // Inject fetched footprints into site object temporarily for ThreeDModel.
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

  const footprintPendingForSite = Boolean(
    site?.layout3D?.useFootprintPolygons && footprintLoad.siteId !== site.id,
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
  if (site.layout3D?.useFootprintPolygons && (footprintPendingForSite || footprintLoad.status === 'loading')) {
    return <section className="panel active"><p className="muted">Veri yükleniyor...</p></section>;
  }

  const detail = componentsDetail ?? buildComponentsDetail(site);
  const footprintWarning = site.layout3D?.useFootprintPolygons && !['idle', 'loading', 'success'].includes(footprintLoad.status)
    ? `Footprint verisi yüklenemedi; fallback model kullanılıyor (${footprintLoad.status}).`
    : '';
  const representationalWarning = `Bu değerler ve 3D konumlar temsilidir. Koordinat güveni: ${COORDINATE_CONFIDENCE_LABELS[site.coordinates.coordinateConfidence]}.`;
  const combinedWarning = [footprintWarning, representationalWarning].filter(Boolean).join(' ');
  const isFootprintMode = Boolean(site.layout3D?.useFootprintPolygons);
  const terrainLabel = isFootprintMode ? 'Temsili zemin' : '3D Arazi (Terrain)';
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
    setIsPlaying(true);
    dispatchSimulation({ type: 'START', mode });
  };

  return (
    <section className="panel active no-pad threed-page">
      <div className="threed-layout">
        
        <div className="threed-left" style={{ padding: 0 }}>
          <ThreeDModel
            siteId={site.id}
            activeComponent={activeComponent}
            onSelectComponent={selectComponent}
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
          />
        </div>

        {/* Sağ Panel: Kontroller */}
        <div className="threed-right">
          <h2 style={{ marginBottom: 4 }}>Kavramsal Tesis Yerleşimi</h2>
          <p className="muted" style={{ marginBottom: 24 }}>Seçili saha: <b>{site.name}</b></p>

          {/* Mode Toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button
              type="button"
              className={`btn ${mode === 'generate' ? 'primary' : 'ghost'}`}
              aria-pressed={mode === 'generate'}
              style={{ flex: 1, minHeight: 36, fontSize: 13 }}
              onClick={() => {
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
              style={{ flex: 1, minHeight: 36, fontSize: 13 }}
              onClick={() => {
                setMode('pump');
                if (isPlaying) dispatchSimulation({ type: 'START', mode: 'pump' });
              }}
            >
              <Droplets size={16} aria-hidden="true" />
              Pompalama modu
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
             <button
              type="button"
              className={`btn ${isPlaying ? 'danger-solid' : 'ghost'}`}
              aria-pressed={isPlaying}
              style={{ flex: 1, minHeight: 36, fontSize: 13 }}
              onClick={startOrStopSimulation}
            >
              {isPlaying ? <Square size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
              {isPlaying ? 'Simülasyonu durdur' : 'Simülasyonu başlat'}
            </button>
          </div>
          
          <h3 style={{ marginBottom: 12 }}>Aktif Gruplar ({activeUnits}/{maxUnits})</h3>
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, flexWrap: 'wrap' }}>
            {makeUnitIds(maxUnits).map((unitId) => (
               <button
                type="button"
                key={unitId}
                className={`btn ${activeUnitIds.includes(unitId) ? 'primary' : 'ghost'}`}
                aria-pressed={activeUnitIds.includes(unitId)}
                style={{ padding: '4px 12px', minHeight: 32, fontSize: 13, flex: 1 }}
                onClick={() => toggleUnit(unitId)}
              >
                {unitId}
              </button>
            ))}
          </div>

          <h3 style={{ marginBottom: 12 }}>Katman Görünürlüğü</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button type="button" className="btn ghost" style={{ flex: 1, padding: '4px', fontSize: 12 }} onClick={() => setAllLayerVisibility(true)}>
              Tümünü Aç
            </button>
            <button type="button" className="btn ghost" style={{ flex: 1, padding: '4px', fontSize: 12 }} onClick={() => setAllLayerVisibility(false)}>
              Tümünü Kapat
            </button>
          </div>
          <div style={{ marginBottom: 24 }}>
            <LayerToggle 
              label={<><Mountain size={16} aria-hidden="true" /> {terrainLabel}</>}
              color="#4c6b45"
              active={showTerrain} 
              onChange={setShowTerrain} 
            />
            {isFootprintMode && (
              <p className="muted" style={{ fontSize: 12, margin: '4px 0 8px' }}>
                Gerçek DEM bağlı değil; zemin footprint sahnesinde referans düzlemi olarak gösterilir.
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
          </div>

          <h3 style={{ marginBottom: 12 }}>Arazi Görünümü</h3>
          <div className="card" style={{ padding: 16, marginBottom: 24 }}>
            <ScenarioSlider 
              label="Arazi Şeffaflığı" 
              value={terrainOpacity} 
              min={0} max={100} step={5} unit="%" 
              onChange={setTerrainOpacity} 
            />
          </div>

          <h3 style={{ marginBottom: 12 }}>
            Bileşen Detayları: {selectedComponent?.label || 'Katman seçilmedi'}
          </h3>
          <div className="card" style={{ padding: 16, marginBottom: 24 }}>
            {/* Generic description from constants */}
            <p style={{ fontSize: 13, color: 'var(--text)', marginBottom: 16, lineHeight: 1.5 }}>
              {selectedComponent?.description || 'Görünür bir katman seçildiğinde bileşen detayları burada gösterilir.'}
            </p>

            {/* Dynamic data from site details */}
            {Object.entries((detail as any)[activeComponent] || {}).map(([k, v]) => (
              <p key={k} style={{ marginBottom: 8, fontSize: 14 }}>
                <b style={{ color: 'var(--text)' }}>{k.replace(/_/g, ' ').toUpperCase()}:</b>{' '}
                <span className="muted">{String(v)}</span>
              </p>
            ))}
            
            <div style={{ marginTop: 16 }}>
              <WarningBanner type="danger" message={combinedWarning} />
            </div>
          </div>

          <h3 style={{ marginTop: 16, marginBottom: 12 }}>Fare (Mouse) Kontrolleri</h3>
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

        </div>
      </div>
    </section>
  );
}
