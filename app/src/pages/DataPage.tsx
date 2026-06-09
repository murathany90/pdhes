import { useState } from 'react';
import type { Site } from '../types/site';
import { useSiteStore } from '../stores/useSiteStore';
import { useAdminStore } from '../stores/useAdminStore';
import { CONTENT_DEFAULTS } from '../utils/constants';
import { num, moneyBn, moneyM } from '../utils/format';

export default function DataPage({ site }: { site?: Site }) {
  const { sites, selectedId, selectSite } = useSiteStore();
  const getContent = useAdminStore((state) => state.getContent);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  if (!site) return <div className="panel active"><p className="muted">Veri yükleniyor...</p></div>;

  const filteredSites = sites.filter(s => {
    const sType = s.pdhesType as string;
    if (typeFilter === 'ALL') return true;
    if (typeFilter === 'KAPALI_DEVRE') return sType === 'MUSTAKIL_PDHES';
    if (typeFilter === 'ACIK_DEVRE') return sType === 'YARI_PDHES';
    if (typeFilter === 'DENIZ_SUYU') return sType === 'MAKRO_DENIZ_PDHES' || sType === 'MIKRO_DENIZ_PDHES';
    return false;
  });

  return (
    <section className="panel active">
      <div className="hero">
        <div className="card">
          <div className="tag classic">Ön eleme veri seti</div>
          <h2 className="big-title" dangerouslySetInnerHTML={{ __html: getContent('home.heroTitle', CONTENT_DEFAULTS) }} />
          <p className="muted" dangerouslySetInnerHTML={{ __html: getContent('home.heroSub', CONTENT_DEFAULTS) }} />
          <div className="metric-row" style={{ marginTop: 16 }}>
            <div className="metric good"><span>En hızlı klasik rota</span><b>Gökçekaya</b></div>
            <div className="metric info"><span>Deniz suyu önceliği</span><b>Taşucu</b></div>
            <div className="metric warn"><span>Toplam aday</span><b>{filteredSites.length}</b></div>
            <div className="metric"><span>Yerleşim modeli</span><b>Kavramsal 3D</b></div>
          </div>
        </div>
        <div className="card">
          <h2>Veri eşleştirme mantığı</h2>
          <div className="pipeline">
            {[
              { n: '1', t: 'Kaynakları oku', d: 'JICA, TEİAŞ, DSİ, yükseklik modeli ve piyasa varsayımları birlikte değerlendirilir.' },
              { n: '2', t: 'Adayı puanla', d: 'Düşü (head), su yolu, aktif hacim, güç, maliyet, gelir ve risk notları çıkarılır.' },
              { n: '3', t: 'Haritayla eşleştir', d: 'Üst rezervuar, alt rezervuar/deniz, şebeke bağlantısı, erişim ve risk alanları işaretlenir.' },
              { n: '4', t: 'Yerleşimi üret', d: 'Rezervuar, cebri boru, yeraltı güç evi, denge bacası ve şalt sahası kavramsal olarak yerleştirilir.' },
              { n: '5', t: 'İnceleme paneli', d: 'Zaman çizelgesi, yatırım özeti, gelir duyarlılığı ve ön kontrol soruları tek ekranda toplanır.' },
            ].map((step) => (
              <div className="step" key={step.n}>
                <div className="num">{step.n}</div>
                <b>{step.t}</b>
                <p>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid cols-2" style={{ marginTop: 14 }}>
        <div className="card">
          <h2>Aday saha tablosu</h2>
          <p className="muted small">Satıra tıklayarak uygulamanın tüm panellerindeki seçili sahayı değiştirin.</p>
          
          <div style={{ display: 'flex', gap: 8, margin: '16px 0', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'Tümü' },
              { id: 'KAPALI_DEVRE', label: 'Kapalı Devre' },
              { id: 'ACIK_DEVRE', label: 'Açık Devre' },
              { id: 'DENIZ_SUYU', label: 'Deniz Suyu' },
            ].map(filter => (
              <button
                key={filter.id}
                className={`btn ${typeFilter === filter.id ? 'primary' : 'ghost'}`}
                style={{ minHeight: 32, padding: '6px 12px', fontSize: 13, borderRadius: 999 }}
                onClick={() => setTypeFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div style={{ overflow: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Saha</th>
                  <th>Konsept</th>
                  <th>Güç / enerji</th>
                  <th>Düşü (head)</th>
                  <th>Su yolu</th>
                  <th>Yatırım</th>
                  <th>Gelir</th>
                  <th>Skor</th>
                </tr>
              </thead>
              <tbody>
                {filteredSites.map((candidate) => (
                  <tr key={candidate.id} className={candidate.id === selectedId ? 'selected' : ''} onClick={() => selectSite(candidate.id)}>
                    <td><b>{candidate.name}</b><br /><span className="muted small">{candidate.region}</span></td>
                    <td><span className={`tag ${candidate.concept === 'sea' ? 'sea' : 'classic'}`}>{candidate.concept === 'sea' ? 'Deniz suyu' : 'Klasik'}</span></td>
                    <td><b>{num(candidate.powerMW)} MW</b><br /><span className="muted small">{candidate.energyGWh} GWh</span></td>
                    <td>{num(candidate.head, 1)} m</td>
                    <td>{candidate.tunnelKm} km</td>
                    <td>{moneyBn(candidate.capexBn)}</td>
                    <td>{moneyM(candidate.revenueM)}</td>
                    <td>
                      <span className="score">
                        <span className="scorebar"><i style={{ width: `${candidate.score}%` }} /></span>
                        <b>{candidate.score}</b>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2>Seçili saha veri kartı</h2>
          <h3>{site.name}</h3>
          <p className="muted">{site.thesis}</p>
          <div className="metric-row" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 12 }}>
            <div className="metric good"><span>Skor</span><b>{site.score}/100</b></div>
            <div className="metric info"><span>Yakın şebeke</span><b>{site.gridDistKm} km</b></div>
            <div className="metric warn"><span>Aktif hacim</span><b>{site.activeMcm} milyon m³</b></div>
            <div className="metric"><span>Geri ödeme</span><b>{site.payback} yıl</b></div>
          </div>
          <p style={{ marginTop: 12 }}>
            <span className={`tag ${site.concept === 'sea' ? 'sea' : 'classic'}`}>{site.conceptLabel}</span>
          </p>
          <p className="small"><b>Alt rezervuar:</b> <span className="muted">{site.lower}</span></p>
          <p className="small"><b>Üst rezervuar:</b> <span className="muted">{site.upper}</span></p>
          <div>{site.risks.map((risk) => <span key={risk} className="tag risk">{risk}</span>)}</div>
          <div className="notice" style={{ marginTop: 12 }}>
            Bu veriler fizibilite değildir; ön eleme, yatırım değerlendirmesi ve kavramsal gösterim için masaüstü seviyesinde hazırlanmıştır.
          </div>
        </div>
      </div>
    </section>
  );
}
