import { useState } from 'react';
import type { CandidateFilters } from '../utils/pdhesFilters';
import type { Site } from '../types/site';
import { useSiteStore } from '../stores/useSiteStore';
import { moneyBn, moneyM, num } from '../utils/format';
import { getSiteTableMetrics } from '../utils/siteTableMetrics';
import {
  CONCEPT_TYPE_FILTERS,
  DEFAULT_DATA_FILTERS,
  INFRASTRUCTURE_TYPE_FILTERS,
  SOURCE_GROUP_FILTERS,
  matchesCandidateFilters,
} from '../utils/pdhesFilters';
import WarningBanner from '../components/ui/WarningBanner';
import {
  CONCEPT_TYPE_LABELS,
  COORDINATE_CONFIDENCE_LABELS,
  CYCLE_TYPE_LABELS,
  GRID_SUPPLY_TYPE_LABELS,
  INFRASTRUCTURE_TYPE_LABELS,
  PRIMARY_PURPOSE_LABELS,
  SOURCE_GROUP_LABELS,
} from '../utils/siteDerived';

function waterwayText(site: Site): string {
  if (site.tunnelLengthKm !== null && site.tunnelLengthKm !== undefined) return `${num(site.tunnelLengthKm, 1)} km tünel`;
  if (site.penstockLengthM !== null && site.penstockLengthM !== undefined) return `${num(site.penstockLengthM)} m cebri boru`;
  if (site.tailraceTunnelLengthM !== null && site.tailraceTunnelLengthM !== undefined) return `${num(site.tailraceTunnelLengthM)} m kuyruk suyu`;
  return 'Su yolu belirtilmedi';
}

function originLabel(origin: 'source' | 'scenario'): string {
  return origin === 'source' ? 'Kaynak' : 'Senaryo';
}

export default function DataPage({ site }: { site?: Site }) {
  const { sites, selectedId, selectSite } = useSiteStore();
  const [filters, setFilters] = useState<CandidateFilters>(DEFAULT_DATA_FILTERS);

  if (!site) return <div className="panel active"><p className="muted">Veri yükleniyor...</p></div>;

  const filteredSites = sites
    .filter((candidate) => matchesCandidateFilters(candidate, filters))
    .sort((a, b) => a.order - b.order);

  const updateFilter = <K extends keyof CandidateFilters>(key: K, value: CandidateFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="panel active">
      <div className="grid data-layout">
        <div className="card">
          <h2>Aday saha tablosu</h2>
          <p className="muted small">Varsayılan sıra önce JICA/EİE 16 adayını, sonra skorla seçilen 4 deniz tipi prototipi gösterir.</p>

          <div style={{ display: 'flex', gap: 8, margin: '16px 0', flexWrap: 'wrap' }}>
            {SOURCE_GROUP_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                aria-pressed={filters.sourceGroup === filter.id}
                className={`btn ${filters.sourceGroup === filter.id ? 'primary' : 'ghost'}`}
                style={{ minHeight: 32, padding: '6px 12px', fontSize: 13 }}
                onClick={() => updateFilter('sourceGroup', filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="editor-form" style={{ marginBottom: 14 }}>
            <div className="form-row">
              <label className="form-group">
                Konsept
                <select className="select" value={filters.conceptType} onChange={(event) => updateFilter('conceptType', event.target.value as CandidateFilters['conceptType'])}>
                  {CONCEPT_TYPE_FILTERS.map((filter) => <option key={filter.id} value={filter.id}>{filter.label}</option>)}
                </select>
              </label>
              <label className="form-group">
                Altyapı
                <select className="select" value={filters.infrastructureType} onChange={(event) => updateFilter('infrastructureType', event.target.value as CandidateFilters['infrastructureType'])}>
                  {INFRASTRUCTURE_TYPE_FILTERS.map((filter) => <option key={filter.id} value={filter.id}>{filter.label}</option>)}
                </select>
              </label>
            </div>
          </div>

          <div className="candidate-table-wrap">
            <table className="candidate-table">
              <colgroup>
                <col className="col-order" />
                <col className="col-site" />
                <col className="col-source" />
                <col className="col-power" />
                <col className="col-waterway" />
                <col className="col-money" />
                <col className="col-money" />
                <col className="col-score" />
                <col className="col-reservoir" />
                <col className="col-classification" />
              </colgroup>
              <thead>
                <tr>
                  <th>Sıra</th>
                  <th>Saha</th>
                  <th>Kaynak grubu</th>
                  <th>Güç / Enerji</th>
                  <th>Düşü (head) / Su Yolu</th>
                  <th>Yatırım</th>
                  <th>Gelir</th>
                  <th>Kaynak / Senaryo Skoru</th>
                  <th>Alt / üst rezervuar</th>
                  <th>Teknik sınıflandırma</th>
                </tr>
              </thead>
              <tbody>
                {filteredSites.map((candidate) => {
                  const metrics = getSiteTableMetrics(candidate);
                  return (
                    <tr key={candidate.id} className={candidate.id === selectedId ? 'selected' : ''}>
                      <td>{candidate.order}</td>
                      <td>
                        <button
                          type="button"
                          className="site-row-button"
                          aria-current={candidate.id === selectedId ? 'true' : undefined}
                          onClick={() => selectSite(candidate.id)}
                        >
                          <b>{candidate.name}</b>
                          <span className="muted small">{candidate.province}</span>
                        </button>
                      </td>
                      <td>
                        <span className={`source-chip ${candidate.sourceGroup === 'SEA_WATER_PROTOTYPE_TOP4' ? 'sea' : 'jica'}`}>
                          {SOURCE_GROUP_LABELS[candidate.sourceGroup]}
                        </span>
                      </td>
                      <td>
                        <b>{num(candidate.capacityMW)} MW</b>
                        <span className="muted small">{candidate.energyGWh ? `${num(candidate.energyGWh)} GWh` : 'Enerji belirtilmedi'}</span>
                      </td>
                      <td>
                        <b>{num(candidate.headM)} m</b>
                        <span className="muted small">{waterwayText(candidate)}</span>
                      </td>
                      <td>
                        <b>{moneyBn(metrics.investmentUsdBn)}</b>
                        <span className="muted small">{originLabel(metrics.investmentOrigin)}</span>
                      </td>
                      <td>
                        <b>{moneyM(metrics.revenueUsdM)}</b>
                        <span className="muted small">{originLabel(metrics.revenueOrigin)}</span>
                      </td>
                      <td>
                        <b>Kaynak: {metrics.sourceScore ?? 'Belirtilmedi'}</b>
                        <span className="muted small">Senaryo: {metrics.scenarioScore}</span>
                      </td>
                      <td><b>{candidate.lowerReservoirName}</b><br /><span className="muted small">{candidate.upperReservoirDescription}</span></td>
                      <td>
                        {CYCLE_TYPE_LABELS[candidate.technicalClassification.cycleType]}<br />
                        <span className="muted small">{INFRASTRUCTURE_TYPE_LABELS[candidate.technicalClassification.infrastructureType]}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2>Seçili saha veri kartı</h2>
          <h3>{site.name}</h3>
          <p className="muted">{site.thesis}</p>
          <div className="metric-row" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 12 }}>
            <div className="metric good"><span>Kaynak grubu</span><b>{SOURCE_GROUP_LABELS[site.sourceGroup]}</b></div>
            <div className="metric info"><span>Kapasite</span><b>{num(site.capacityMW)} MW</b></div>
            <div className="metric warn"><span>Debi / düşü</span><b>{num(site.projectFlowCms)} m³/s / {num(site.headM)} m</b></div>
            <div className="metric"><span>Skor</span><b>{site.score ?? 'Belirtilmedi'}</b></div>
            <div className="metric"><span>Yatırım / Gelir</span><b>{moneyBn(site.capexUsdBn)} / {moneyM(site.annualRevenueUsdM)}</b></div>
            <div className="metric"><span>Geri ödeme</span><b>{site.paybackYear ? `${site.paybackYear} yıl` : 'Belirtilmedi'}</b></div>
            <div className="metric"><span>Aktif hacim</span><b>{site.activeVolumeHm3 ? `${site.activeVolumeHm3} hm³` : 'Senaryo varsayımı'}</b></div>
            <div className="metric"><span>Koordinat güveni</span><b>{COORDINATE_CONFIDENCE_LABELS[site.coordinates.coordinateConfidence]}</b></div>
          </div>

          <p className="small"><b>Alt rezervuar:</b> <span className="muted">{site.lowerReservoirName}</span></p>
          <p className="small"><b>Üst rezervuar:</b> <span className="muted">{site.upperReservoirDescription}</span></p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="tag">{CONCEPT_TYPE_LABELS[site.technicalClassification.conceptType]}</span>
            <span className="tag">{GRID_SUPPLY_TYPE_LABELS[site.technicalClassification.gridSupplyType]}</span>
            <span className="tag">{PRIMARY_PURPOSE_LABELS[site.technicalClassification.primaryPurpose]}</span>
          </div>
          <div style={{ marginTop: 12 }}>{site.risks.map((risk) => <span key={risk} className="tag risk">{risk}</span>)}</div>
          <div style={{ marginTop: 12 }}>
            <WarningBanner
              type="warning"
              message={site.coordinates.coordinateNote}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
