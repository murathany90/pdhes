import { useEffect, useMemo, useRef, useState } from 'react';
import { useMapLibre, type MapLayerVisibility } from '../hooks/useMapLibre';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useSiteStore } from '../stores/useSiteStore';
import type { Site, SiteLayout } from '../types/site';

interface ThreeDEditorPageProps {
  site?: Site;
  onDone: () => void;
}

type PointKey = 'upper' | 'lower' | 'power' | 'surge' | 'switchyard' | 'gridA' | 'gridB' | 'risk' | 'gridTap';

const POINT_LABELS: Record<PointKey, string> = {
  upper: 'Üst rezervuar',
  lower: 'Alt rezervuar',
  power: 'Yeraltı güç evi (powerhouse)',
  surge: 'Denge bacası (surge tank)',
  switchyard: 'Şalt sahası (switchyard)',
  gridA: 'Şebeke hattı A',
  gridB: 'Şebeke hattı B',
  risk: 'Risk alanı merkezi',
  gridTap: 'Şebeke bağlantı noktası',
};

const EDITOR_LAYERS: MapLayerVisibility = {
  candidates: false,
  projectLayout: true,
  risk: true,
  waterPath: true,
  gridConnection: true,
  grid400: false,
  grid154: false,
  substations: false,
  terrain3d: true,
};

function cloneLayout(layout: SiteLayout): SiteLayout {
  return JSON.parse(JSON.stringify(layout)) as SiteLayout;
}

function pointText(label: string, point?: [number, number]) {
  if (!point) return `${label}: tanımlı değil`;
  return `${label}: ${point[0].toFixed(6)}, ${point[1].toFixed(6)}`;
}

export default function ThreeDEditorPage({ site, onDone }: ThreeDEditorPageProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { updateSite, baseSites, gridAssets } = useSiteStore();
  const { mapStyle, heightScale } = useSettingsStore();
  const [layout, setLayout] = useState<SiteLayout | null>(site ? cloneLayout(site.layout) : null);
  const [activePoint, setActivePoint] = useState<PointKey>('upper');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (site) setLayout(cloneLayout(site.layout));
  }, [site]);

  const previewSite = useMemo(() => {
    if (!site || !layout) return undefined;
    return {
      ...site,
      layout,
      view: {
        ...site.view,
        center: layout.power,
      },
    };
  }, [layout, site]);

  useMapLibre({
    containerRef: mapContainer,
    site: previewSite,
    sites: previewSite ? [previewSite] : [],
    selectedId: previewSite?.id || '',
    mapStyle,
    heightScale,
    gridAssets,
    layers: EDITOR_LAYERS,
    interactiveCandidates: false,
  });

  if (!site || !layout) {
    return <section className="panel active"><p className="muted">Düzenlenecek 3D yerleşim bulunamadı.</p></section>;
  }

  const activeCoord = layout[activePoint] || layout.upper;
  const updatePoint = (index: 0 | 1, value: number) => {
    setLayout((current) => {
      if (!current) return current;
      const currentPoint = current[activePoint] || current.upper;
      const nextPoint: [number, number] = index === 0 ? [value, currentPoint[1]] : [currentPoint[0], value];
      return { ...current, [activePoint]: nextPoint };
    });
  };

  const summary = [
    `Yön açısı: ${layout.bearing}°`,
    pointText('Üst rezervuar', layout.upper),
    pointText('Alt rezervuar', layout.lower),
    pointText('Güç evi', layout.power),
    pointText('Denge bacası', layout.surge),
    pointText('Şalt sahası', layout.switchyard),
    pointText('Şebeke bağlantısı', layout.gridTap),
  ].join('\n');

  return (
    <section className="panel active">
      <div className="map-layout">
        <aside className="map-left">
          <h2>3D Yerleşim Editörü</h2>
          <p className="muted small">{site.name}</p>
          <div className="site-list">
            {(Object.keys(POINT_LABELS) as PointKey[]).map((key) => (
              <div key={key} className={`site-item ${activePoint === key ? 'active' : ''}`} onClick={() => setActivePoint(key)}>
                <div className="row">
                  <b>{POINT_LABELS[key]}</b>
                  <span className="muted small">koordinat</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="map-stage">
          <div ref={mapContainer} style={{ position: 'absolute', inset: 0 }} />
        </div>

        <aside className="map-right">
          <h2>{POINT_LABELS[activePoint]}</h2>
          <div className="editor-form">
            <div className="form-group">
              <label>Yön açısı</label>
              <input className="input" type="number" value={layout.bearing} onChange={(event) => setLayout({ ...layout, bearing: Number(event.target.value) })} />
            </div>
            <div className="form-group">
              <label>Boylam</label>
              <input className="input" type="number" step="0.000001" value={activeCoord[0]} onChange={(event) => updatePoint(0, Number(event.target.value))} />
            </div>
            <div className="form-group">
              <label>Enlem</label>
              <input className="input" type="number" step="0.000001" value={activeCoord[1]} onChange={(event) => updatePoint(1, Number(event.target.value))} />
            </div>
            <button
              className="btn primary"
              onClick={() => {
                updateSite(site.id, { layout });
                setMessage('3D yerleşim kaydedildi.');
              }}
            >
              Kaydet
            </button>
            <button
              className="btn"
              onClick={() => {
                const base = baseSites.find((item) => item.id === site.id);
                setLayout(cloneLayout(base?.layout || site.layout));
                setMessage('Varsayılan yerleşim yüklendi.');
              }}
            >
              Varsayılana dön
            </button>
            <button className="btn ghost" onClick={onDone}>Yönetim paneline dön</button>
            {message && <p className="notice">{message}</p>}
          </div>
          <h3 style={{ marginTop: 16 }}>Yerleşim kayıt özeti</h3>
          <div className="codebox">{summary}</div>
        </aside>
      </div>
    </section>
  );
}
