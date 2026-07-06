import { useRef, useState, useEffect } from 'react';
import { MapPin, Mountain, AlertTriangle, Droplets, Zap, Activity, Waypoints, Box, Layers, X } from 'lucide-react';
import { useMapLibre, type MapLayerVisibility } from '../hooks/useMapLibre';
import { useSiteStore } from '../stores/useSiteStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { COMPONENTS } from '../utils/constants';
import { WORLD_EXAMPLES } from '../data/worldExamples';
import { num, moneyBn, moneyM } from '../utils/format';

const DEFAULT_LAYERS: MapLayerVisibility = {
  candidates: true,
  projectLayout: true,
  risk: true,
  waterPath: true,
  gridConnection: true,
  grid400: true,
  grid154: false,
  substations: true,
  terrain3d: true,
};

const LAYER_LABELS: Array<{ key: keyof MapLayerVisibility; label: string; Icon: any }> = [
  { key: 'candidates', label: 'Sahalar', Icon: MapPin },
  { key: 'projectLayout', label: 'Yerleşim', Icon: Mountain },
  { key: 'terrain3d', label: '3D Arazi', Icon: Layers },
  { key: 'risk', label: 'Risk Alanı', Icon: AlertTriangle },
  { key: 'waterPath', label: 'Su Yolu', Icon: Droplets },
  { key: 'gridConnection', label: 'Bağlantı', Icon: Waypoints },
  { key: 'grid400', label: '400 kV', Icon: Zap },
  { key: 'grid154', label: '154 kV', Icon: Activity },
  { key: 'substations', label: 'Trafolar', Icon: Box },
];

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { sites, selectedId, selectSite, gridAssets, fetchGridAssets, worldExampleFocusId, clearWorldExampleFocus } = useSiteStore();
  const { mapStyle, heightScale, setHeightScale } = useSettingsStore();
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [layers, setLayers] = useState<MapLayerVisibility>(DEFAULT_LAYERS);
  const [isCardOpen, setIsCardOpen] = useState(true);
  const site = sites.find((item) => item.id === selectedId) || sites[0];

  useEffect(() => {
    fetchGridAssets();
  }, [fetchGridAssets]);

  const { mapRef } = useMapLibre({
    containerRef: mapContainer,
    site,
    sites,
    selectedId,
    mapStyle,
    heightScale,
    gridAssets,
    layers,
    onSelectSite: selectSite,
  });

  useEffect(() => {
    if (worldExampleFocusId && mapRef.current) {
      const example = WORLD_EXAMPLES.find((e) => e.id === worldExampleFocusId);
      if (example) {
        mapRef.current.flyTo({
          center: [example.lon, example.lat],
          zoom: 8,
          pitch: 0,
          bearing: 0,
          duration: 1500,
        });
        
        // Wait for flyTo to start and then trigger the click event on the marker to open the popup
        setTimeout(() => {
          const markerEl = document.getElementById(`we-marker-${example.id}`);
          if (markerEl && (markerEl as any)._popup) {
            const popup = (markerEl as any)._popup;
            if (!popup.isOpen()) {
              popup.addTo(mapRef.current);
            }
          }
        }, 300);
      }
      clearWorldExampleFocus();
    }
  }, [worldExampleFocusId, mapRef, clearWorldExampleFocus]);

  if (!site) return <section className="panel active"><p className="muted">Veri yükleniyor...</p></section>;

  const layoutCls = `map-layout ${leftCollapsed ? 'collapsed-left' : ''} ${rightCollapsed ? 'collapsed-right' : ''}`;

  return (
    <section className="panel active no-pad">
      <div className={layoutCls}>
        <aside className="map-left" aria-label="Saha keşfi">
          <button
            type="button"
            className="btn ghost panel-toggle"
            aria-label="Saha keşfi panelini kapat"
            title="Saha keşfi panelini kapat"
            onClick={() => setLeftCollapsed(true)}
          >
            ‹
          </button>
          <h2 style={{ marginTop: 0 }}>Saha keşfi</h2>
          <p className="muted small">Seçili aday için tahmini rezervuar, su yolu, güç evi ve şebeke bağlantısı yerleşimini gösterir.</p>
          <div className="card" style={{ padding: 12, boxShadow: 'none', marginTop: 10 }}>
            <span className={`tag ${site.concept === 'sea' ? 'sea' : 'classic'}`}>{site.concept === 'sea' ? 'Deniz suyu' : 'Klasik'}</span>
            <h3 style={{ margin: '8px 0 6px' }}>{site.name}</h3>
            <p className="muted small">{site.thesis}</p>
            <div className="metric-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="metric"><span>Kurulu güç</span><b>{num(site.powerMW)} MW</b></div>
              <div className="metric"><span>Depolama</span><b>{site.energyGWh} GWh</b></div>
            </div>
          </div>
          <h3 style={{ marginTop: 16 }}>Adaylar</h3>
          <div className="site-list">
            {sites.map((candidate) => (
              <button
                type="button"
                key={candidate.id}
                className={`site-item ${candidate.id === selectedId ? 'active' : ''}`}
                aria-current={candidate.id === selectedId ? 'true' : undefined}
                onClick={() => selectSite(candidate.id)}
              >
                <div className="row">
                  <b>{candidate.name}</b>
                  <span className={`tag ${candidate.concept === 'sea' ? 'sea' : 'classic'}`}>{candidate.score}</span>
                </div>
                <span className="muted small">{candidate.region}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="map-stage">
          <div ref={mapContainer} style={{ position: 'absolute', inset: 0 }} />
          
          {/* 3D / 2D Geçiş ve Kalite Kontrol Kartı */}
          {isCardOpen ? (
          <div className="map-floating-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="card-title" style={{ margin: 0 }}>HARİTA GÖRÜNÜMÜ</div>
              <button type="button" className="btn ghost" onClick={() => setIsCardOpen(false)} style={{ padding: 4, minHeight: 24, height: 24 }} title="Kapat" aria-label="Kapat"><X size={16}/></button>
            </div>
            
            <div className="card-row">
              <span className="card-label">Mod</span>
              <div className="segmented-control" role="group" aria-label="Harita boyutu">
                <button
                  type="button"
                  className={`segment-btn ${!layers.terrain3d ? 'active' : ''}`}
                  aria-pressed={!layers.terrain3d}
                  onClick={() => setLayers(current => ({ ...current, terrain3d: false }))}
                >
                  2D Düz
                </button>
                <button
                  type="button"
                  className={`segment-btn ${layers.terrain3d ? 'active' : ''}`}
                  aria-pressed={layers.terrain3d}
                  onClick={() => setLayers(current => ({ ...current, terrain3d: true }))}
                >
                  3D Arazi
                </button>
              </div>
            </div>

            {layers.terrain3d && (
              <div className="card-row" style={{ marginTop: 4 }}>
                <span className="card-label">3D Kalitesi (Engebe)</span>
                <div className="quality-options" role="group" aria-label="3D arazi kalitesi">
                  {[
                    { label: 'Düşük', val: 1.0 },
                    { label: 'Orta', val: 1.3 },
                    { label: 'Yüksek', val: 2.2 },
                    { label: 'Ekstrem', val: 3.0 }
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.val}
                      className={`quality-btn ${Math.abs(heightScale - opt.val) < 0.1 ? 'active' : ''}`}
                      aria-pressed={Math.abs(heightScale - opt.val) < 0.1}
                      onClick={() => setHeightScale(opt.val)}
                      title={`${opt.label} (${opt.val}x)`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          ) : (
            <button type="button" className="btn" onClick={() => setIsCardOpen(true)} title="Harita Görünümü" style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, background: 'var(--panel)', color: 'var(--text)', border: '1px solid var(--line)', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              <Layers size={16} />
              <b style={{ fontSize: 13 }}>Görünüm</b>
            </button>
          )}

          {leftCollapsed && (
            <button
              type="button"
              className="btn ghost floating-toggle left"
              aria-label="Saha keşfi panelini aç"
              title="Saha keşfi panelini aç"
              onClick={() => setLeftCollapsed(false)}
            >
              ›
            </button>
          )}
          {rightCollapsed && (
            <button
              type="button"
              className="btn ghost floating-toggle right"
              aria-label="Kapasite özeti panelini aç"
              title="Kapasite özeti panelini aç"
              onClick={() => setRightCollapsed(false)}
            >
              ‹
            </button>
          )}
        </div>

        <aside className="map-right" aria-label="Kapasite özeti">
          <button
            type="button"
            className="btn ghost panel-toggle"
            aria-label="Kapasite özeti panelini kapat"
            title="Kapasite özeti panelini kapat"
            onClick={() => setRightCollapsed(true)}
          >
            ›
          </button>
          <h2 style={{ marginTop: 0 }}>Kavramsal kapasite özeti</h2>
          <div className="grid" style={{ gap: 10 }}>
            <div className="metric good"><span>Kapasite</span><b>{num(site.powerMW)} MW / {site.energyGWh} GWh</b></div>
            <div className="metric info"><span>Düşü / su yolu</span><b>{num(site.head, 1)} m / {site.tunnelKm} km</b></div>
            <div className="metric warn"><span>Yatırım gideri</span><b>{moneyBn(site.capexBn)}</b></div>
            <div className="metric"><span>Gelir / geri ödeme</span><b>{moneyM(site.revenueM)} / {site.payback} yıl</b></div>
          </div>

          <h3 style={{ marginTop: 16 }}>Harita katmanları</h3>
          <div className="layer-grid">
            {LAYER_LABELS.map(({ key, label, Icon }) => (
              <button
                type="button"
                key={key}
                className={`layer-btn ${layers[key] ? 'active' : ''}`}
                onClick={() => setLayers((current) => ({ ...current, [key]: !current[key] }))}
                aria-label={label}
                aria-pressed={layers[key]}
              >
                <Icon size={14} aria-hidden="true" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <h3 style={{ marginTop: 16 }}>Proje zaman çizelgesi</h3>
          <div className="timeline">
            {site.timeline.map((event, index) => (
              <div className="tl" key={`${event.date}-${index}`}>
                <time>{event.date}</time>
                <b style={{ display: 'block', marginTop: 3 }}>{event.title}</b>
                <p>{event.text}</p>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: 16 }}>Yerleşim bileşenleri</h3>
          <div className="legend">
            {COMPONENTS.map((component) => (
              <span className="tag" key={component.key}>
                <i className="sw" style={{ background: component.color }} />
                {component.label}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
