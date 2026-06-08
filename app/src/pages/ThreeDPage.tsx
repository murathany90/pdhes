import { useState } from 'react';
import type { Site } from '../types/site';
import { COMPONENTS } from '../utils/constants';

const COMPONENT_HELP: Record<string, string> = {
  upper_reservoir: 'Pompalama sırasında suyun depolandığı yüksek kotlu rezervuar.',
  lower_reservoir: 'Üretim sonrası suyun toplandığı alt rezervuar veya deniz alım yapısı.',
  powerhouse: 'Pompa-türbin ve motor-jeneratör gruplarının yer aldığı yeraltı güç evi.',
  surge_tank: 'Su darbesini sönümleyen denge bacası.',
  switchyard: 'Enerjinin iletim şebekesine bağlandığı şalt ve trafo alanı.',
  portal: 'Tünel erişimi, servis ve inşaat lojistiği için kullanılan giriş alanı.',
};

const DETAIL_LABELS: Record<string, string> = {
  elevation_m: 'Kot (m)',
  active_volume_mcm: 'Aktif hacim (Mm³)',
  dam_height_m: 'Gövde yüksekliği (m)',
  lining: 'Sızdırmazlık kaplaması',
  geology_note: 'Jeoloji notu',
  min_level_m: 'Minimum su seviyesi (m)',
  note: 'Not',
  diameter_m: 'Çap (m)',
  length_m: 'Uzunluk (m)',
  material: 'Malzeme',
  pressure_class: 'Basınç sınıfı',
  count: 'Adet',
  cavern_width_m: 'Kavern genişliği (m)',
  cavern_length_m: 'Kavern uzunluğu (m)',
  cavern_height_m: 'Kavern yüksekliği (m)',
  units: 'Ünite sayısı',
  turbine_type: 'Türbin tipi',
  type: 'Tip',
  height_m: 'Yükseklik (m)',
  voltage_kv: 'Gerilim (kV)',
  transformer_count: 'Trafo sayısı',
  connection_line_km: 'Bağlantı hattı (km)',
  excavation_type: 'Kazı yöntemi',
  corrosion_control: 'Korozyon önlemi',
};

const CONFIDENCE_LABELS: Record<string, string> = {
  reference_based: 'Referans veriye dayalı',
  gis_inferred: 'Coğrafi ön kestirim',
  dem_inferred: 'Yükselti modelinden türetilmiş',
  high: 'Yüksek',
  medium: 'Orta',
  low: 'Düşük',
};

function detailLabel(key: string) {
  return DETAIL_LABELS[key] || key.replaceAll('_', ' ');
}

export default function ThreeDPage({ site }: { site?: Site }) {
  const [activeComp, setActiveComp] = useState<string | null>(null);

  if (!site) return <section className="panel active"><p className="muted">Veri yükleniyor...</p></section>;

  const detailRecord = site.components_detail as unknown as Record<string, Record<string, unknown> | undefined>;
  const activeDetail = activeComp ? detailRecord[activeComp] : undefined;

  return (
    <section className="panel active">
      <div className="grid cols-2">
        <div className="card">
          <h2>3D kavramsal yerleşim</h2>
          <h3>{site.name}</h3>
          <p className="muted">
            Aşağıdaki bileşenler saha verilerinden türetilmiş kavramsal yerleşimi anlatır; gerçek mühendislik çizimi yerine ön inceleme ekranıdır.
          </p>
          <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
            {COMPONENTS.map((component) => {
              const isActive = activeComp === component.key;
              return (
                <div
                  key={component.key}
                  className={`site-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveComp(isActive ? null : component.key)}
                  style={{ borderLeft: `4px solid ${component.color}` }}
                >
                  <div className="row">
                    <b style={{ color: component.color }}>{component.label}</b>
                    <span className="muted small">incele</span>
                  </div>
                  {isActive && (
                    <p className="muted small" style={{ marginTop: 8 }}>{COMPONENT_HELP[component.key]}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="card">
          <h2>Bileşen detayları</h2>
          <p className="muted">Seçili bileşenin ön mühendislik varsayımları ve saha güven notları.</p>
          {activeComp && activeDetail ? (
            <div className="component-detail-list">
              {Object.entries(activeDetail).map(([key, value]) => (
                <div className="metric" key={key}>
                  <span>{detailLabel(key)}</span>
                  <b>{String(value)}</b>
                </div>
              ))}
            </div>
          ) : (
            <div className="notice">Detay görmek için soldaki bileşenlerden birini seçin.</div>
          )}
          <h3 style={{ marginTop: 16 }}>Güven etiketi</h3>
          <div className="notice">
            Konsept güveni: <b>{CONFIDENCE_LABELS[site.confidence] || site.confidence}</b><br />
            Konum doğruluğu: <b>{CONFIDENCE_LABELS[site.locationConfidence] || site.locationConfidence}</b><br />
            Son doğrulama: <b>{site.verifiedAt}</b>
          </div>
          <h3 style={{ marginTop: 16 }}>Saha yerleşim özeti</h3>
          <div className="grid cols-2">
            <div className="metric"><span>Üst rezervuar</span><b>{site.upper}</b></div>
            <div className="metric"><span>Alt rezervuar</span><b>{site.lower}</b></div>
            <div className="metric"><span>Düşü (head)</span><b>{site.head} m</b></div>
            <div className="metric"><span>Su yolu</span><b>{site.tunnelKm} km</b></div>
          </div>
        </div>
      </div>
    </section>
  );
}
