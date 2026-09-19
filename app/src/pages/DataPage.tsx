import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CandidateFilters } from "../utils/pdhesFilters";
import type { Site } from "../types/site";
import type { PdhesCandidateExcelCalculatedData } from "../utils/pdhes/types";
import { useSiteStore } from "../stores/useSiteStore";
import { loadLinkedHesSummary, type LinkedHesSummary } from "../features/hydrology/services/pdhesHesLinks";
import { fullnessSourceLabel } from "../features/hydrology/data/fullnessSources";
import {
  DEFAULT_DATA_FILTERS,
  matchesCandidateFilters,
  PDHES_TYPE_FILTERS,
} from "../utils/pdhesFilters";
import {
  EMPTY_VALUE,
  formatCount,
  formatCurrencyMUsd,
  formatFlowCms,
  formatGwh,
  formatMeters,
  formatMwh,
  formatMw,
  formatPercent,
  formatScore,
  formatUsdPerKw,
  formatUsdPerMwh,
  formatVolumeHm3,
  formatYears,
} from "../utils/pdhes/formatters";

const TABLE_COLUMN_COUNT = 13;

type SortKey = "score" | "payback";
type SortState = {
  key: SortKey | null;
  direction: "asc" | "desc";
};

function excelFor(site: Site): PdhesCandidateExcelCalculatedData | undefined {
  return site.excelCalculated;
}

function formatHours(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return EMPTY_VALUE;
  return `${formatCount(value)} saat`;
}

function finiteValues(values: Array<number | null | undefined>) {
  return values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
}

function average(values: Array<number | null | undefined>): number | null {
  const usable = finiteValues(values);
  if (usable.length === 0) return null;
  return usable.reduce((sum, value) => sum + value, 0) / usable.length;
}

function sum(values: Array<number | null | undefined>): number | null {
  const usable = finiteValues(values);
  if (usable.length === 0) return null;
  return usable.reduce((total, value) => total + value, 0);
}

function compareNullable(a: number | undefined, b: number | undefined, direction: "asc" | "desc") {
  const aMissing = typeof a !== "number" || !Number.isFinite(a);
  const bMissing = typeof b !== "number" || !Number.isFinite(b);
  if (aMissing && bMissing) return 0;
  if (aMissing) return 1;
  if (bMissing) return -1;
  return direction === "asc" ? a - b : b - a;
}

function scoreClass(score: number | undefined) {
  if (typeof score !== "number" || !Number.isFinite(score)) {
    return "neutral";
  }
  if (score >= 85) return "strong";
  if (score >= 70) return "good";
  if (score >= 55) return "medium";
  return "low";
}

function paybackClass(paybackYears: number | undefined) {
  if (typeof paybackYears !== "number" || !Number.isFinite(paybackYears)) {
    return "neutral";
  }
  if (paybackYears <= 7) return "strong";
  if (paybackYears <= 12) return "good";
  return "low";
}

function SortHeader({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  sort: SortState;
  onSort: (key: SortKey) => void;
}) {
  const active = sort.key === sortKey;
  const directionText = active ? (sort.direction === "asc" ? "artan" : "azalan") : "sıralanmamış";

  return (
    <button
      type="button"
      className={`table-sort-button ${active ? "active" : ""}`}
      onClick={() => onSort(sortKey)}
      aria-label={`${label} sütununu sırala (${directionText})`}
    >
      {label}
      <span aria-hidden="true">{active ? (sort.direction === "asc" ? "↑" : "↓") : "↕"}</span>
    </button>
  );
}

function SummaryCards({ sites }: { sites: Site[] }) {
  const excelRows = sites
    .map(excelFor)
    .filter((excel): excel is PdhesCandidateExcelCalculatedData => Boolean(excel));
  const summary = {
    candidateCount: excelRows.length,
    totalCapacityMw: sum(excelRows.map((excel) => excel.capacityMw)),
    totalEnergyMwh: sum(excelRows.map((excel) => excel.energyMwh)),
    averagePayback: average(excelRows.map((excel) => excel.paybackYears)),
  };

  return (
    <div className="candidate-summary-grid" aria-label="Excel kaynaklı aday özeti">
      <div className="metric info"><span>Toplam Aday Sayısı</span><b>{summary.candidateCount}</b></div>
      <div className="metric good"><span>Toplam Kurulu Güç</span><b>{formatMw(summary.totalCapacityMw)}</b></div>
      <div className="metric info"><span>Toplam Depolama Enerjisi</span><b>{formatMwh(summary.totalEnergyMwh)}</b></div>
      <div className="metric"><span>Ortalama Geri Ödeme</span><b>{formatYears(summary.averagePayback)}</b></div>
    </div>
  );
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="excel-detail-metric">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function CandidateDetailPanel({ candidate }: { candidate: Site }) {
  const [linkedHes, setLinkedHes] = useState<LinkedHesSummary | null>(null);
  useEffect(() => {
    let active = true;
    setLinkedHes(null);
    void loadLinkedHesSummary(candidate.id).then((summary) => {
      if (active) setLinkedHes(summary);
    }).catch(() => {
      if (active) setLinkedHes(null);
    });
    return () => { active = false; };
  }, [candidate.id]);
  const excel = excelFor(candidate);
  if (!excel) {
    return (
      <div className="excel-detail-panel">
        <p className="muted">Bu aday için Excel hesap verisi eşleşmedi.</p>
      </div>
    );
  }

  const groups = [
    {
      title: "Teknik Parametreler",
      items: [
        ["Proje Debisi (m³/s)", formatFlowCms(excel.designFlowCms)],
        ["Net Düşü (m)", formatMeters(excel.netHeadM)],
        ["Üst Aktif Hacim (hm³)", formatVolumeHm3(excel.upperActiveVolumeHm3)],
        ["Çevrim Verimi %", formatPercent(excel.roundTripEfficiencyPct)],
        ["Pompa Gücü (MW)", formatMw(excel.pumpPowerMw)],
        ["Pompaj Enerjisi/Çevrim (MWh)", formatMwh(excel.pumpingEnergyPerCycleMwh)],
        ["Yıllık Çevrim", formatCount(excel.annualCycles)],
        ["Yıllık Üretim (GWh)", formatGwh(excel.annualGenerationGwh)],
      ],
    },
    {
      title: "Piyasa ve Gelir Parametreleri",
      items: [
        ["Pik Fiyat ($/MWh)", formatUsdPerMwh(excel.peakPriceUsdMwh)],
        ["Dip Fiyat ($/MWh)", formatUsdPerMwh(excel.offPeakPriceUsdMwh)],
        ["Brüt Üretim Geliri (M USD)", formatCurrencyMUsd(excel.grossGenerationRevenueMUsd)],
        ["Pompaj Enerji Maliyeti (M USD)", formatCurrencyMUsd(excel.pumpingEnergyCostMUsd)],
        ["Net Arbitraj Geliri (M USD)", formatCurrencyMUsd(excel.netArbitrageRevenueMUsd)],
        ["Yan Hizmet Geliri (M USD)", formatCurrencyMUsd(excel.ancillaryServiceRevenueMUsd)],
        ["Kapasite Mekanizması Geliri (M USD)", formatCurrencyMUsd(excel.capacityMechanismRevenueMUsd)],
        ["Yıllık Toplam Gelir (M USD)", formatCurrencyMUsd(excel.annualTotalRevenueMUsd)],
      ],
    },
    {
      title: "Yatırım ve Geri Ödeme",
      items: [
        ["CAPEX Yoğunluğu ($/kW)", formatUsdPerKw(excel.capexIntensityUsdKw)],
        ["CAPEX (M USD)", formatCurrencyMUsd(excel.capexMUsd)],
        ["O&M (M USD/yıl)", formatCurrencyMUsd(excel.omMUsdPerYear)],
        ["Net Nakit Akımı (M USD/yıl)", formatCurrencyMUsd(excel.netCashFlowMUsdPerYear)],
        ["Geri Ödeme (yıl)", formatYears(excel.paybackYears, "Hesaplanamaz")],
      ],
    },
  ];

  const link = linkedHes?.link;
  const fullnessResult = linkedHes?.fullness;
  const linkedName = String(linkedHes?.hes?.properties.name ?? linkedHes?.hes?.properties.damName ?? link?.hesId ?? '');

  return (
    <div className="excel-detail-panel">
      <div className="excel-detail-title">
        <div>
          <span className="muted small">Seçili Aday</span>
          <h3>{excel.candidateName}</h3>
        </div>
      </div>
      <div className="excel-detail-groups">
        {groups.map((group) => (
          <section className="excel-detail-group" key={group.title}>
            <h3>{group.title}</h3>
            <div className="excel-detail-grid">
              {group.items.map(([label, value]) => (
                <DetailMetric key={label} label={label} value={value} />
              ))}
            </div>
          </section>
        ))}
      </div>
      {link && <section className="pdhes-hes-link" aria-label="Mevcut alt rezervuar">
        <h3>Mevcut alt rezervuar</h3>
        <div className="pdhes-hes-link-grid">
          <span>HES/baraj adı <b>{linkedName}</b></span>
          <span>Güncel doluluk <b>{fullnessResult?.fullnessPercent == null ? 'Veri yok' : `%${Math.round(fullnessResult.fullnessPercent)}`}</b></span>
          <span>Kaynak <b>{fullnessResult ? fullnessSourceLabel(fullnessResult) : 'Kanonik HES verisi'}</b></span>
          <span>Gözlem tarihi <b>{fullnessResult?.observedAt ? new Date(fullnessResult.observedAt).toLocaleDateString('tr-TR') : '—'}</b></span>
        </div>
        <a className="btn ghost location-btn" href={`/hes?hes=${encodeURIComponent(link.hesId)}`}>HES haritasında aç</a>
      </section>}
    </div>
  );
}

export default function DataPage({ site }: { site?: Site }) {
  const { sites, selectedId, selectSite, clearWorldExampleFocus } = useSiteStore();
  const [filters, setFilters] = useState<CandidateFilters>(DEFAULT_DATA_FILTERS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortState>({ key: null, direction: "asc" });
  const navigate = useNavigate();

  const filteredSites = useMemo(() => {
    const candidates = sites.filter((candidate) => matchesCandidateFilters(candidate, filters));
    const sorted = [...candidates].sort((a, b) => {
      if (!sort.key) return (excelFor(a)?.no ?? a.order) - (excelFor(b)?.no ?? b.order);
      const aValue = sort.key === "score" ? excelFor(a)?.totalScore : excelFor(a)?.paybackYears;
      const bValue = sort.key === "score" ? excelFor(b)?.totalScore : excelFor(b)?.paybackYears;
      const nullableCompare = compareNullable(aValue, bValue, sort.direction);
      return nullableCompare || ((excelFor(a)?.no ?? a.order) - (excelFor(b)?.no ?? b.order));
    });
    return sorted;
  }, [filters, sites, sort]);

  if (!site) return <div className="panel active"><p className="muted">Veri yükleniyor...</p></div>;

  const updateFilter = <K extends keyof CandidateFilters>(key: K, value: CandidateFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const updateSort = (key: SortKey) => {
    setSort((current) => {
      if (current.key === key) {
        return { key, direction: current.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: key === "score" ? "desc" : "asc" };
    });
  };

  const openCandidate = (candidate: Site) => {
    selectSite(candidate.id);
    setExpandedId((current) => (current === candidate.id ? null : candidate.id));
  };

  return (
    <section className="panel active">
      <div className="grid data-layout full-width">
        <div className="card table-card">
          <h2>PDHES Adayları Tablosu</h2>

          <SummaryCards sites={sites} />

          <div className="editor-form candidate-filter-form">
            <div className="form-row">
              <label className="form-group">
                PDHES Türü
                <select
                  className="select"
                  value={filters.pdhesType}
                  onChange={(event) => updateFilter("pdhesType", event.target.value as CandidateFilters["pdhesType"])}
                >
                  {PDHES_TYPE_FILTERS.map((filter) => <option key={filter.id} value={filter.id}>{filter.label}</option>)}
                </select>
              </label>
            </div>
          </div>

          <div className="candidate-table-wrap">
            <table className="candidate-table excel-candidate-table">
              <colgroup>
                <col className="col-order" />
                <col className="col-site" />
                <col className="col-type" />
                <col className="col-power" />
                <col className="col-hours" />
                <col className="col-energy" />
                <col className="col-elevation" />
                <col className="col-elevation" />
                <col className="col-head" />
                <col className="col-head" />
                <col className="col-score" />
                <col className="col-payback" />
                <col className="col-action" />
              </colgroup>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Aday Adı</th>
                  <th>Tip</th>
                  <th>Kapasite (MW)</th>
                  <th>Depolama Süresi (saat)</th>
                  <th>Enerji (MWh)</th>
                  <th>Alt Rezervuar Kotu (m)</th>
                  <th>Üst Rezervuar Kotu (m)</th>
                  <th>Brüt Düşü (m)</th>
                  <th>Net Düşü (m)</th>
                  <th><SortHeader label="Toplam Skor" sortKey="score" sort={sort} onSort={updateSort} /></th>
                  <th><SortHeader label="Geri Ödeme (yıl)" sortKey="payback" sort={sort} onSort={updateSort} /></th>
                  <th>Konum</th>
                </tr>
              </thead>
              <tbody>
                {filteredSites.length === 0 ? (
                  <tr>
                    <td colSpan={TABLE_COLUMN_COUNT} className="empty-table-cell" data-empty-state="candidate-filter">
                      <b>Bu filtreyle eşleşen aday bulunamadı.</b>
                      <span>Filtreyi değiştirerek diğer PDHES türlerini görüntüleyebilirsiniz.</span>
                    </td>
                  </tr>
                ) : filteredSites.map((candidate) => {
                  const excel = excelFor(candidate);
                  const score = scoreClass(excel?.totalScore);
                  const payback = paybackClass(excel?.paybackYears);
                  return (
                    <React.Fragment key={candidate.id}>
                      <tr
                        className={`main-row ${candidate.id === selectedId ? "selected" : ""}`}
                        onClick={() => openCandidate(candidate)}
                      >
                        <td>{excel?.no ?? candidate.order}</td>
                        <td>
                          <button
                            type="button"
                            className="site-row-button"
                            aria-current={candidate.id === selectedId ? "true" : undefined}
                            onClick={(event) => {
                              event.stopPropagation();
                              openCandidate(candidate);
                            }}
                          >
                            <b>{excel?.candidateName ?? candidate.name}</b>
                            <span className="muted small">{excel?.region ?? candidate.province}</span>
                          </button>
                        </td>
                        <td><span className={`source-chip ${candidate.pdhesType === "SEA_WATER" ? "sea" : "generic"}`}>{excel?.type ?? candidate.pdhesType}</span></td>
                        <td><b>{formatMw(excel?.capacityMw ?? candidate.capacityMW)}</b></td>
                        <td>{formatHours(excel?.storageHours)}</td>
                        <td><b>{formatMwh(excel?.energyMwh ?? (candidate.energyGWh ? candidate.energyGWh * 1000 : undefined))}</b></td>
                        <td>{formatMeters(excel?.lowerReservoirElevationM)}</td>
                        <td>{formatMeters(excel?.upperReservoirElevationM)}</td>
                        <td>{formatMeters(excel?.grossHeadM)}</td>
                        <td>{formatMeters(excel?.netHeadM ?? candidate.headM)}</td>
                        <td>
                          <span className={`score-badge ${score}`}>
                            <b>{formatScore(excel?.totalScore)}</b>
                          </span>
                        </td>
                        <td>
                          <span className={`score-badge ${payback}`}>
                            <b>{formatYears(excel?.paybackYears)}</b>
                          </span>
                        </td>
                        <td className="location-cell">
                          <button
                            type="button"
                            className="btn compact location-btn"
                            onClick={(event) => {
                              event.stopPropagation();
                              clearWorldExampleFocus();
                              selectSite(candidate.id);
                              navigate("/map");
                            }}
                          >
                            Konum
                          </button>
                        </td>
                      </tr>
                      {candidate.id === expandedId && (
                        <tr className="expanded-details-row">
                          <td colSpan={TABLE_COLUMN_COUNT}>
                            <CandidateDetailPanel candidate={candidate} />
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
