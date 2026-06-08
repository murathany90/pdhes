import { useRef, useState } from 'react';
import { useMapLibre, type MapLayerVisibility } from '../hooks/useMapLibre';
import { useSiteStore } from '../stores/useSiteStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { COMPONENTS } from '../utils/constants';
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
};

const LAYER_LABELS: Array<{ key: keyof MapLayerVisibility; label: string }> = [
  { key: 'candidates', label: 'Aday sahalar' },
  { key: 'projectLayout', label: 'Kavramsal yerleşim' },
  { key: 'risk', label: 'Risk alanı' },
  { key: 'waterPath', label: 'Su yolu' },
  { key: 'gridConnection', label: 'Yakın şebeke bağlantısı' },
  { key: 'grid400', label: '400 kV hatlar' },
  { key: 'grid154', label: '154 kV hatlar' },
  { key: 'substations', label: 'Trafo merkezleri' },
];

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { sites, selectedId, selectSite, gridAssets } = useSiteStore();
  const { mapStyle, heightScale } = useSettingsStore();
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [layers, setLayers] = useState<MapLayerVisibility>(DEFAULT_LAYERS);
  const site = sites.find((item) => item.id === selectedId) || sites[0];

  useMapLibre({
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

  if (!site) return <section className="panel active"><p className="muted">Veri yükleniyor...</p></section>;

  const layoutCls = `map-layout ${leftCollapsed ? 'collapsed-left' : ''} ${rightCollapsed ? 'collapsed-right' : ''}`;

  return (
    <section className="panel active">
      <div className={layoutCls}>
        <aside className="map-left">
          <button className="btn ghost panel-toggle" onClick={() => setLeftCollapsed(true)}>‹</button>
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
              <div
                key={candidate.id}
                className={`site-item ${candidate.id === selectedId ? 'active' : ''}`}
                onClick={() => selectSite(candidate.id)}
              >
                <div className="row">
                  <b>{candidate.name}</b>
                  <span className={`tag ${candidate.concept === 'sea' ? 'sea' : 'classic'}`}>{candidate.score}</span>
                </div>
                <span className="muted small">{candidate.region}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="map-stage">
          <div ref={mapContainer} style={{ position: 'absolute', inset: 0 }} />
          {leftCollapsed && <button className="btn ghost floating-toggle left" onClick={() => setLeftCollapsed(false)}>›</button>}
          {rightCollapsed && <button className="btn ghost floating-toggle right" onClick={() => setRightCollapsed(false)}>‹</button>}
        </div>

        <aside className="map-right">
          <button className="btn ghost panel-toggle" onClick={() => setRightCollapsed(true)}>›</button>
          <h2 style={{ marginTop: 0 }}>Yatırım / kapasite özeti</h2>
          <div className="grid" style={{ gap: 10 }}>
            <div className="metric good"><span>Kapasite</span><b>{num(site.powerMW)} MW / {site.energyGWh} GWh</b></div>
            <div className="metric info"><span>Düşü / su yolu</span><b>{num(site.head, 1)} m / {site.tunnelKm} km</b></div>
            <div className="metric warn"><span>Yatırım gideri</span><b>{moneyBn(site.capexBn)}</b></div>
            <div className="metric"><span>Gelir / geri ödeme</span><b>{moneyM(site.revenueM)} / {site.payback} yıl</b></div>
          </div>

          <h3 style={{ marginTop: 16 }}>Harita katmanları</h3>
          <div className="layer-controls">
            {LAYER_LABELS.map(({ key, label }) => (
              <label className="check" key={key}>
                <span>{label}</span>
                <input
                  type="checkbox"
                  name={`map-layer-${key}`}
                  aria-label={label}
                  checked={layers[key]}
                  onChange={(event) => setLayers((current) => ({ ...current, [key]: event.target.checked }))}
                />
              </label>
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
