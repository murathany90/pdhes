import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import type { CandidateFilters } from '../utils/pdhesFilters';
import type { Site } from '../types/site';
import { useSiteStore } from '../stores/useSiteStore';
import { moneyBn, moneyM, num } from '../utils/format';
import { getSiteTableMetrics } from '../utils/siteTableMetrics';
import {
  PDHES_TYPE_FILTERS,
  DEFAULT_DATA_FILTERS,
  matchesCandidateFilters,
} from '../utils/pdhesFilters';

import {
  CYCLE_TYPE_LABELS,
  INFRASTRUCTURE_TYPE_LABELS,
  PDHES_TYPE_LABELS,
} from '../utils/siteDerived';

function waterwayText(site: Site): string {
  if (site.totalWaterwayLengthM != null) return `${num(site.totalWaterwayLengthM)} m toplam su yolu`;
  if (site.tunnelLengthKm != null) return `${num(site.tunnelLengthKm, 1)} km tünel`;
  if (site.penstockLengthM != null) return `${num(site.penstockLengthM)} m cebri boru`;
  if (site.tailraceTunnelLengthM != null) return `${num(site.tailraceTunnelLengthM)} m kuyruk suyu`;
  return '-';
}

function originLabel(origin: 'source' | 'scenario'): string {
  return origin === 'source' ? 'Kaynak' : 'Senaryo';
}

export default function DataPage({ site }: { site?: Site }) {
  const { sites, selectedId, selectSite } = useSiteStore();
  const [filters, setFilters] = useState<CandidateFilters>(DEFAULT_DATA_FILTERS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!site) return <div className="panel active"><p className="muted">Veri yükleniyor...</p></div>;

  const filteredSites = sites
    .filter((candidate) => matchesCandidateFilters(candidate, filters))
    .sort((a, b) => a.order - b.order);

  const updateFilter = <K extends keyof CandidateFilters>(key: K, value: CandidateFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="panel active">
      <div className="grid data-layout full-width">
        <div className="card table-card">
          <h2>Aday saha tablosu</h2>
          <p className="muted small">Varsayılan sıra önce açık çevrim adayları, sonra skorla seçilen deniz suyu prototiplerini gösterir.</p>

          <div className="editor-form" style={{ marginBottom: 14, marginTop: 16 }}>
            <div className="form-row">
              <label className="form-group">
                PDHES Türü
                <select className="select" value={filters.pdhesType} onChange={(event) => updateFilter('pdhesType', event.target.value as CandidateFilters['pdhesType'])}>
                  {PDHES_TYPE_FILTERS.map((filter) => <option key={filter.id} value={filter.id}>{filter.label}</option>)}
                </select>
              </label>
            </div>
          </div>

          <div className="candidate-table-wrap">
            <table className="candidate-table">
              <colgroup>
                <col className="col-order" style={{ width: '40px' }} />
                <col className="col-site" style={{ width: '180px' }} />
                <col className="col-source" style={{ width: '100px' }} />
                <col className="col-power" style={{ width: '120px' }} />
                <col className="col-waterway" style={{ width: '140px' }} />
                <col className="col-money" style={{ width: '100px' }} />
                <col className="col-money" style={{ width: '100px' }} />
                <col className="col-reservoir" style={{ width: '220px' }} />
                <col className="col-classification" style={{ width: '180px' }} />
                <col className="col-score" style={{ width: '120px' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Sıra</th>
                  <th>Saha</th>
                  <th>PDHES Türü</th>
                  <th>Güç / Enerji</th>
                  <th>Düşü (head) / Su Yolu</th>
                  <th>Yatırım</th>
                  <th>Gelir</th>
                  <th>Alt / üst rezervuar</th>
                  <th>Teknik sınıflandırma</th>
                  <th>Skor (Senaryo)</th>
                </tr>
              </thead>
              <tbody>
                {filteredSites.map((candidate) => {
                  const metrics = getSiteTableMetrics(candidate);
                  return (
                    <React.Fragment key={candidate.id}>
                      <tr className={`main-row ${candidate.id === selectedId ? 'selected' : ''}`} onClick={() => { selectSite(candidate.id); setExpandedId(expandedId === candidate.id ? null : candidate.id); }}>
                        <td>{candidate.order}</td>
                        <td>
                          <button
                            type="button"
                            className="site-row-button"
                            aria-current={candidate.id === selectedId ? 'true' : undefined}
                            onClick={(e) => { e.stopPropagation(); selectSite(candidate.id); setExpandedId(expandedId === candidate.id ? null : candidate.id); }}
                          >
                            <b>{candidate.name}</b>
                            <span className="muted small">{candidate.province}</span>
                          </button>
                        </td>
                        <td>
                          <span className={`source-chip ${candidate.pdhesType === 'SEA_WATER' ? 'sea' : 'generic'}`}>
                            {PDHES_TYPE_LABELS[candidate.pdhesType]}
                          </span>
                        </td>
                        <td>
                          <b>{num(candidate.capacityMW)} MW</b>
                          <span className="muted small">{candidate.energyGWh ? `${num(candidate.energyGWh * 1000)} MWh` : '-'}</span>
                        </td>
                        <td>
                          <b>{candidate.headM ? `${num(candidate.headM)} m` : '-'}</b>
                          <span className="muted small">{waterwayText(candidate)}</span>
                        </td>
                        <td>
                          <b>{metrics.investmentUsdBn ? moneyBn(metrics.investmentUsdBn) : '-'}</b>
                          {metrics.investmentUsdBn != null && <span className="muted small">{originLabel(metrics.investmentOrigin)}</span>}
                        </td>
                        <td>
                          <b>{metrics.revenueUsdM ? moneyM(metrics.revenueUsdM) : '-'}</b>
                          {metrics.revenueUsdM != null && <span className="muted small">{originLabel(metrics.revenueOrigin)}</span>}
                        </td>
                        <td><b>{candidate.lowerReservoirName}</b><br /><span className="muted small">{candidate.upperReservoirDescription}</span></td>
                        <td>
                          {CYCLE_TYPE_LABELS[candidate.technicalClassification.cycleType]}<br />
                          <span className="muted small">{INFRASTRUCTURE_TYPE_LABELS[candidate.technicalClassification.infrastructureType]}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <b style={{ minWidth: '24px' }}>{metrics.scenarioScore || 0}</b>
                            <div style={{ flex: 1, height: '6px', background: 'var(--line)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, metrics.scenarioScore || 0))}%`, background: 'var(--green)' }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                      {candidate.id === expandedId && (
                        <tr className="expanded-details-row">
                          <td colSpan={10}>
                            <div className="expanded-details-content">
                              <p className="muted" style={{ marginBottom: 12 }}>{candidate.thesis}</p>
                              <div className="metric-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                                <div className="metric"><span>Geri ödeme</span><b>{candidate.paybackYear ? `${candidate.paybackYear} yıl` : (metrics.investmentUsdBn && metrics.revenueUsdM ? `~${Math.round((metrics.investmentUsdBn * 1000) / metrics.revenueUsdM)} yıl` : '-')}</b></div>
                                <div className="metric">
                                  <span>Yaklaşık depolama kapasitesi</span>
                                  <b>{candidate.activeVolumeHm3 ? `${candidate.activeVolumeHm3} hm³` : (candidate.projectFlowCms ? `~${(candidate.projectFlowCms * 7 * 3600 / 1000000).toFixed(1)} hm³` : '-')}</b>
                                </div>
                              </div>
                              <div style={{ marginTop: '16px' }}>
                                <button
                                  type="button"
                                  className="btn primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    selectSite(candidate.id);
                                    navigate('/map');
                                  }}
                                >
                                  <MapPin size={16} />
                                  Konum Göster
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
