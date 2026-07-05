import { useState } from 'react';
import type { Site } from '../types/site';
import { useSiteStore } from '../stores/useSiteStore';
import { num, moneyBn, moneyM } from '../utils/format';
import {
  matchesPdhesType,
  PDHES_TYPE_FILTERS,
  type PdhesTypeFilter,
} from '../utils/pdhesFilters';

export default function DataPage({ site }: { site?: Site }) {
  const { sites, selectedId, selectSite } = useSiteStore();
  const [typeFilter, setTypeFilter] = useState<PdhesTypeFilter>('ALL');

  if (!site) return <div className="panel active"><p className="muted">Veri yükleniyor...</p></div>;

  const filteredSites = sites.filter((candidate) =>
    matchesPdhesType(candidate.pdhesType, typeFilter),
  );

  return (
    <section className="panel active">
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 14 }}>
        <div className="card">
          <h2>Aday saha tablosu</h2>
          <p className="muted small">Satıra tıklayarak uygulamanın tüm panellerindeki seçili sahayı değiştirin.</p>
          
          <div style={{ display: 'flex', gap: 8, margin: '16px 0', flexWrap: 'wrap' }}>
            {PDHES_TYPE_FILTERS.map((filter) => (
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
            <div className="metric good"><span>Skor / Konsept</span><b>{site.score} - {site.concept === 'sea' ? 'Deniz' : 'Klasik'}</b></div>
            <div className="metric info"><span>Kapasite / Enerji</span><b>{num(site.powerMW)} MW / {site.energyGWh} GWh</b></div>
            <div className="metric warn"><span>Yatırım / Gelir</span><b>{moneyBn(site.capexBn)} / {moneyM(site.revenueM)}</b></div>
            <div className="metric"><span>Geri ödeme</span><b>{site.payback} yıl</b></div>
            <div className="metric"><span>Düşü (Head)</span><b>{num(site.head, 1)} m</b></div>
            <div className="metric"><span>Su yolu (Tünel)</span><b>{site.tunnelKm} km</b></div>
            <div className="metric"><span>Aktif hacim</span><b>{site.activeMcm} milyon m³</b></div>
            <div className="metric"><span>Şebeke mesafesi</span><b>{site.gridDistKm} km</b></div>
          </div>

          <p className="small"><b>Alt rezervuar:</b> <span className="muted">{site.lower}</span></p>
          <p className="small"><b>Üst rezervuar:</b> <span className="muted">{site.upper}</span></p>
          <div>{site.risks.map((risk) => <span key={risk} className="tag risk">{risk}</span>)}</div>
          <div className="notice" style={{ marginTop: 12 }}>
            Bu veriler fizibilite değildir; eğitim, ön eleme ve kavramsal karşılaştırma için masaüstü seviyesinde hazırlanmıştır.
          </div>
        </div>
      </div>
    </section>
  );
}
