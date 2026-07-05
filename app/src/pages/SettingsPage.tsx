import { useSettingsStore } from '../stores/useSettingsStore';
import { useSiteStore } from '../stores/useSiteStore';

const WEIGHT_LABELS: Record<string, string> = {
  topo: 'Topografya / düşü',
  grid: 'Şebeke yakınlığı',
  env: 'Çevresel kısıt',
  geo: 'Jeoloji / deprem',
};

export default function SettingsPage() {
  const { theme, mapStyle, heightScale, weights, setTheme, setMapStyle, setHeightScale, setWeight } = useSettingsStore();
  const { resetSites, sites } = useSiteStore();

  return (
    <section className="panel active">
      <div className="settings-layout">
        <div className="card">
          <h2>Arayüz ve harita</h2>
          <div className="editor-form">
            <div className="form-group">
              <label>Tema</label>
              <select className="select" value={theme} onChange={(event) => setTheme(event.target.value as 'dark' | 'light')}>
                <option value="dark">Koyu</option>
                <option value="light">Açık</option>
              </select>
            </div>
            <div className="form-group">
              <label>Harita görünümü</label>
              <select className="select" value={mapStyle} onChange={(event) => setMapStyle(event.target.value as 'dark' | 'light' | 'satellite')}>
                <option value="dark">Koyu</option>
                <option value="light">Açık</option>
                <option value="satellite">Uydu</option>
              </select>
            </div>
            <div className="range-row">
              <label>3D yükseklik ölçeği</label>
              <input type="range" min={0.4} max={3} step={0.1} value={heightScale} onChange={(event) => setHeightScale(+event.target.value)} />
              <span className="kbd">{heightScale.toFixed(1)}x</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Skor ağırlıkları</h2>
          {Object.entries(weights).map(([key, value]) => (
            <div className="range-row" key={key}>
              <label>{WEIGHT_LABELS[key] || key}</label>
              <input type="range" min={0} max={50} step={1} value={value} onChange={(event) => setWeight(key as keyof typeof weights, +event.target.value)} />
              <span className="kbd">{value}</span>
            </div>
          ))}
          <p className="notice small" style={{ marginTop: 12 }}>
            Bu ağırlıklar arayüz taslağıdır; mevcut aday skorlarını henüz yeniden hesaplamaz.
          </p>
          <h3 style={{ marginTop: 16 }}>Veri yönetimi</h3>
          <button className="btn danger" onClick={() => { if (confirm('Kaydedilmiş saha düzenlemeleri sıfırlansın mı?')) resetSites(); }}>
            Saha düzenlemelerini sıfırla
          </button>
          <p className="muted small" style={{ marginTop: 12 }}>
            Mevcut çalışma listesinde {sites.length} aday saha var. Yedek alma ve geri yükleme işlemleri Yerel Çalışma Alanı sekmesinden yapılır.
          </p>
        </div>
      </div>
    </section>
  );
}
