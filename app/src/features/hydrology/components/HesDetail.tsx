import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHydrologyStore } from '../store/useHydrologyStore';
import { describeFullness, fullnessSourceLabel } from '../data/fullnessSources';
import type { FullnessHistoryPoint, FullnessResult } from '../types/hydrology';
import { loadPdhesHesLinks, type PdhesHesLink } from '../services/pdhesHesLinks';

export type HesDetailData = {
  id: string;
  name: string;
  basin: string;
  river: string;
  power: number;
  fullness: number | null;
  source: string;
  details?: Record<string, unknown>;
  fullnessResult?: FullnessResult;
};

export type HesDetailSection = 'summary' | 'technical' | 'history';

const DISPLAY_LABELS: Record<string, string> = {
  'no-verified-fullness-source': 'Doğrulanmış doluluk verisi yok',
  'active-volume/(max-volume-min-volume)': 'Aktif hacimden hesaplanan tahmini doluluk',
  'current-volume/(max-volume-min-volume)': 'Mevcut hacimden hesaplanan tahmini doluluk',
  'run-of-river-no-reservoir': 'Nehir tipi tesis / rezervuar yok',
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
  unknown: 'Bilinmiyor',
  unavailable: 'Veri yok',
  available: 'Mevcut',
  stale: 'Eski',
  not_applicable: 'Uygulanamaz',
};

export function hydrologyDisplay(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  const text = String(value);
  return DISPLAY_LABELS[text] ?? text;
}

function formatMw(value: number): string {
  return `${Math.round(value).toLocaleString('tr-TR')} MW`;
}

function numberOf(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatDate(value: unknown): string {
  if (typeof value !== 'string' || !value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('tr-TR');
}

function storageLabel(value: unknown): string {
  const map: Record<string, string> = {
    storage: 'Depolamalı',
    run_of_river: 'Nehir tipi',
    regulator: 'Regülatör',
    mixed: 'Karma',
    unknown: 'Bilinmiyor',
  };
  return map[String(value ?? 'unknown')] ?? 'Bilinmiyor';
}

export function HesSummaryCard({ data, fullness, isLight, compact, section, onSectionChange, flowForecastAvailable, flowForecastOpen, onToggleFlowForecast }: {
  data: HesDetailData;
  fullness: FullnessResult | undefined;
  isLight: boolean;
  compact?: boolean;
  section: HesDetailSection;
  onSectionChange: (section: HesDetailSection) => void;
  flowForecastAvailable: boolean;
  flowForecastOpen: boolean;
  onToggleFlowForecast: () => void;
}): React.ReactNode {
  const described = fullness ? describeFullness(fullness) : null;
  const damName = typeof data.details?.damName === 'string' ? data.details.damName : null;
  return (
    <div className={`hydro-summary-card ${compact ? 'hydro-summary-compact' : ''} ${isLight ? 'border-cyan-200 bg-cyan-50' : 'border-cyan-500/20 bg-cyan-500/5'}`}>
      <div className="hydro-summary-title-row">
        <span className="hydro-summary-name">⚡ {data.name}</span>
        <span className="hydro-summary-fullness" title={described?.title ?? ''}>{data.fullness === null ? '—' : `%${Math.round(data.fullness)}`} {data.source}</span>
      </div>
      <div className="hydro-summary-power">{formatMw(data.power)}</div>
      <div className="hydro-summary-location"><span>{data.river}</span><span>·</span><span>{data.basin}</span></div>
      {!compact && <>
        {damName && <div className="hydro-summary-storage">Baraj: {damName}</div>}
        <div className="hydro-summary-storage">Depo tipi: {storageLabel(fullness?.storageType ?? data.details?.storageType ?? data.details?.hydroPlantStorageType)}</div>
        <div className="hydro-summary-meta" title={described?.title ?? ''}>
          {fullness ? <span>Kaynak: {String(fullness.provider ?? fullnessSourceLabel(fullness))} · </span> : null}
          <span>Gözlem: {fullness?.observedAt ? `${formatDate(fullness.observedAt)} · ${fullness.freshnessDays ?? '—'} gün` : '—'}</span>
        </div>
      </>}
      <div className="hydro-summary-actions">
        <button type="button" onClick={() => onSectionChange('history')} aria-expanded={section === 'history'} className={`hydro-summary-action ${section === 'history' ? 'active' : ''}`}>Geçmiş</button>
        <button type="button" onClick={() => onSectionChange('technical')} aria-expanded={section === 'technical'} className={`hydro-summary-action ${section === 'technical' ? 'active' : ''}`}>Teknik</button>
        {flowForecastAvailable && <button type="button" onClick={onToggleFlowForecast} aria-expanded={flowForecastOpen} className={`hydro-summary-action ${flowForecastOpen ? 'active' : ''}`}>Akış tahmini</button>}
      </div>
    </div>
  );
}

export function HesTechnicalDetails({ data, fullness }: { data: HesDetailData; fullness: FullnessResult | undefined }): React.ReactNode {
  const details = data.details ?? {};
  const rows: Array<[string, string]> = [
    ['Baraj', String(details.damName ?? '—')],
    ['Depolama', storageLabel(fullness?.storageType ?? details.storageType ?? details.hydroPlantStorageType)],
    ['Sağlayıcı', typeof fullness?.provider === 'string' && fullness.provider ? fullness.provider : '—'],
    ['Yöntem', hydrologyDisplay(fullness?.method)],
    ['Güven', `${hydrologyDisplay(fullness?.confidence)}${fullness?.isEstimated ? ' · tahmini' : ''}`],
    ['Min / max kot', `${numberOf(details.minWaterLevelM)?.toLocaleString('tr-TR') ?? '—'} / ${numberOf(details.maxWaterLevelM)?.toLocaleString('tr-TR') ?? '—'} m`],
    ['Min / max hacim', `${numberOf(details.minVolumeHm3)?.toLocaleString('tr-TR') ?? '—'} / ${numberOf(details.maxVolumeHm3)?.toLocaleString('tr-TR') ?? '—'} hm³`],
    ['Aktif hacim', numberOf(details.activeVolumeHm3) !== null ? `${Number(details.activeVolumeHm3).toLocaleString('tr-TR')} hm³` : '—'],
    ['Debi', numberOf(details.unitFlowM3s) !== null ? `${Number(details.unitFlowM3s).toLocaleString('tr-TR')} m³/sn` : '—'],
    ['Kaskat', String(details.cascadeName ?? '—')],
    ['Resmî havza', String(details.officialBasinName ?? '—')],
    ['Gösterim havzası', String(details.displayBasinName ?? details.basinName ?? '—')],
  ];
  return <dl className="hydro-detail-grid">{rows.map(([label, value]) => <React.Fragment key={label}><dt>{label}</dt><dd>{value}</dd></React.Fragment>)}</dl>;
}

function CompactTrend({ points, isLight }: { points: FullnessHistoryPoint[]; isLight: boolean }): React.ReactNode {
  if (points.length === 0) return <div className="hydro-history-empty">Bu aralıkta gözlem yok.</div>;
  if (points.length === 1) return <div className="hydro-history-empty">1 gözlem mevcut, trend oluşturulamıyor.<span>%{Math.round(points[0].value)} · {points[0].date}</span></div>;
  const width = 240; const height = 80;
  const values = points.map((point) => point.value); const min = Math.min(...values); const max = Math.max(...values); const span = Math.max(1e-9, max - min);
  const path = points.map((point, index) => `${index ? 'L' : 'M'}${((index / (points.length - 1)) * width).toFixed(1)},${(height - ((point.value - min) / span) * height).toFixed(1)}`).join(' ');
  const delta = values.at(-1)! - values[0];
  return <div className="hydro-history-chart"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Doluluk trendi"><path d={path} fill="none" stroke={isLight ? '#087f9a' : '#22d3ee'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg><div className="hydro-history-meta"><span>%{Math.round(values[0])} · {points[0].date}</span><span className={delta >= 0 ? 'positive' : 'negative'}>{delta >= 0 ? '+' : ''}{delta.toFixed(1)}</span><span>%{Math.round(values.at(-1)!)} · {points.at(-1)!.date}</span></div></div>;
}

export function HesHistoryPanel({ hesId, isLight }: { hesId: string; isLight: boolean }): React.ReactNode {
  const fullnessHistory = useHydrologyStore((s) => s.fullnessHistory);
  const historyStatus = useHydrologyStore((s) => s.historyStatus);
  const historicalDate = useHydrologyStore((s) => s.historicalDate);
  const setHistoricalDate = useHydrologyStore((s) => s.setHistoricalDate);
  const loadFullnessHistory = useHydrologyStore((s) => s.loadFullnessHistory);
  const [range, setRange] = useState<7 | 30 | 90 | 365>(30);
  const [calendarOpen, setCalendarOpen] = useState(false);
  useEffect(() => { void loadFullnessHistory(); }, [hesId, loadFullnessHistory]);
  const allPoints = fullnessHistory?.records?.find((record) => record.hesId === hesId)?.points ?? [];
  const referenceDate = historicalDate ? new Date(`${historicalDate}T23:59:59`) : new Date();
  const referenceMs = referenceDate.getTime();
  const points = allPoints.filter((point) => {
    const dateMs = Date.parse(point.date);
    return Number.isFinite(dateMs) && dateMs <= referenceMs && referenceMs - dateMs <= range * 86400000;
  }).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  return <div className="hydro-history-panel">
    <div className="hydro-history-controls" aria-label="Trend aralığı">
      <div className="hydro-history-range">{([7, 30, 90, 365] as const).map((days) => <button key={days} type="button" onClick={() => setRange(days)} aria-pressed={range === days} className={range === days ? 'active' : ''}>{days === 365 ? '1Y' : `${days}G`}</button>)}</div>
      <button type="button" onClick={() => setCalendarOpen((open) => !open)} aria-expanded={calendarOpen} aria-label="Tarih seç" title="Tarih seç">📅</button>
    </div>
    {calendarOpen && <input type="date" value={historicalDate ?? ''} onChange={(event) => setHistoricalDate(event.target.value || null)} aria-label="Tarihsel görünüm tarihi" className="hydro-history-calendar" />}
    {historicalDate && <button type="button" onClick={() => setHistoricalDate(null)} className="hydro-history-reset">Tarihsel görünümden çık · Bugün</button>}
    <div className="hydro-history-reference">Aralık: {referenceDate.toLocaleDateString('tr-TR')} tarihine göre</div>
    {historyStatus === 'loading' ? <div className="hydro-history-empty">Geçmiş yükleniyor…</div> : <CompactTrend points={points} isLight={isLight} />}
  </div>;
}

export function HesDetailPanel({ data, fullness, isLight, section = 'summary', compact = false, onSectionChange, onBack }: { data: HesDetailData; fullness: FullnessResult | undefined; isLight: boolean; section?: HesDetailSection; compact?: boolean; onSectionChange?: (section: HesDetailSection) => void; onBack?: () => void }): React.ReactNode {
  const [localSection, setLocalSection] = useState<HesDetailSection>(section);
  const activeSection = onSectionChange ? section : localSection;
  const changeSection = (next: HesDetailSection) => { if (onSectionChange) onSectionChange(next); else setLocalSection(next); };
  const [pdhesLink, setPdhesLink] = useState<PdhesHesLink | null>(null);
  const geoglows = useHydrologyStore((s) => s.geoglows); const rivers = useHydrologyStore((s) => s.rivers); const relations = useHydrologyStore((s) => s.hes177Relations);
  const flowForecastOpen = useHydrologyStore((s) => s.isTimelineOpen); const setTimelineOpen = useHydrologyStore((s) => s.setTimelineOpen);
  const flowForecastAvailable = useMemo(() => {
    const relation = relations?.byHesId?.[data.id]; const riverId = relation?.riverSystemId ?? relation?.riverIds?.[0];
    const river = riverId ? rivers.features.find((feature) => String(feature.properties?.id ?? feature.id ?? '') === String(riverId)) : null;
    const localIds = Array.isArray(data.details?.geoglowsLocalRiverIds) ? data.details.geoglowsLocalRiverIds.map(String) : Array.isArray(river?.properties?.geoglowsLocalRiverIds) ? river.properties.geoglowsLocalRiverIds.map(String) : [String(river?.properties?.representativeLocalRiverId ?? '')].filter(Boolean);
    return (geoglows?.records ?? []).some((record) => localIds.includes(String(record.localRiverId ?? '')) && Array.isArray(record.data) && record.data.length > 1);
  }, [data.details, data.id, geoglows?.records, relations?.byHesId, rivers.features]);
  useEffect(() => { void loadPdhesHesLinks().then((links) => setPdhesLink(links.find((link) => link.hesId === data.id) ?? null)).catch(() => setPdhesLink(null)); }, [data.id]);
  return <div className={`hydro-detail ${compact ? 'hydro-detail-compact' : ''}`}>
    {onBack && <button type="button" className="hydro-detail-back" onClick={onBack}>← HES listesine dön</button>}
    <HesSummaryCard data={data} fullness={fullness} isLight={isLight} compact={compact} section={activeSection} onSectionChange={changeSection} flowForecastAvailable={flowForecastAvailable} flowForecastOpen={flowForecastOpen} onToggleFlowForecast={() => setTimelineOpen(!flowForecastOpen)} />
    {activeSection === 'technical' && <HesTechnicalDetails data={data} fullness={fullness} />}
    {activeSection === 'history' && <HesHistoryPanel key={data.id} hesId={data.id} isLight={isLight} />}
    {!compact && pdhesLink && <Link className="hydro-pdhes-backlink" to="/data">PDHES aday detayına dön</Link>}
  </div>;
}
