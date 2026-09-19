import React, { useEffect, useState } from 'react';
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

function formatMw(value: number): string {
  return `${Math.round(value).toLocaleString('tr-TR')} MW`;
}

function numberOf(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatDate(value: unknown): string {
  if (typeof value !== 'string' || !value) return 'â€”';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('tr-TR');
}

function storageLabel(value: unknown): string {
  const map: Record<string, string> = { storage: 'DepolamalÄ±', run_of_river: 'Nehir tipi', regulator: 'RegÃ¼latÃ¶r', mixed: 'Karma', unknown: 'Bilinmiyor' };
  return map[String(value ?? 'unknown')] ?? 'Bilinmiyor';
}

/** Compact selected-HES summary: decision info only, always open. */
export function HesSummaryCard({ data, fullness, isLight, technicalOpen, onToggleTechnical, historyOpen, onToggleHistory }: {
  data: HesDetailData; fullness: FullnessResult | undefined; isLight: boolean;
  technicalOpen: boolean; onToggleTechnical: () => void; historyOpen: boolean; onToggleHistory: () => void;
}): React.ReactNode {
  const described = fullness ? describeFullness(fullness) : null;
  return (
    <div className={`rounded-xl border p-2 ${isLight ? 'border-cyan-200 bg-cyan-50' : 'border-cyan-500/20 bg-cyan-500/5'}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[11px] font-semibold text-cyan-400">âš¡ {data.name}</span>
        <span className="shrink-0 font-mono text-[11px] font-bold text-sky-300" title={described?.title ?? ''}>
          {data.fullness === null ? 'â€”' : `%${Math.round(data.fullness)}`} {data.source}
        </span>
      </div>
      <div className="mt-0.5 text-[11px] font-semibold">{formatMw(data.power)}</div>
      <div className="truncate text-[9px] text-slate-500">{data.river} Â· {data.basin}</div>
      <div className="mt-1 text-[9px] text-slate-500" title={described?.title ?? ''}>
        {fullness ? (
          <span>Kaynak: {String(fullness.provider ?? fullnessSourceLabel(fullness))} Â· </span>
        ) : null}
        <span>GÃ¶zlem: {fullness && typeof fullness.observedAt === 'string' && fullness.observedAt ? `${formatDate(fullness.observedAt)} Â· ${fullness.freshnessDays ?? 'â€”'} gÃ¼n` : 'â€”'}</span>
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-1">
        <button type="button" onClick={onToggleHistory} aria-expanded={historyOpen} className={`rounded-lg px-1 py-1 text-[9px] transition ${historyOpen ? 'bg-cyan-500/15 text-cyan-300' : 'bg-[var(--panel2)] text-[var(--muted)]'}`}>GeÃ§miÅŸ</button>
        <button type="button" onClick={onToggleTechnical} aria-expanded={technicalOpen} className={`rounded-lg px-1 py-1 text-[9px] transition ${technicalOpen ? 'bg-cyan-500/15 text-cyan-300' : 'bg-[var(--panel2)] text-[var(--muted)]'}`}>Teknik bilgiler</button>
      </div>
    </div>
  );
}

/** Engineering details, collapsed by default. */
export function HesTechnicalDetails({ data, fullness }: { data: HesDetailData; fullness: FullnessResult | undefined }): React.ReactNode {
  const details = data.details ?? {};
  const rows: Array<[string, string]> = [
    ['Baraj', String(details.damName ?? 'â€”')],
    ['Depolama', storageLabel(fullness?.storageType ?? details.storageType)],
    ['SaÄŸlayÄ±cÄ±', typeof fullness?.provider === 'string' && fullness.provider ? fullness.provider : 'â€”'],
    ['YÃ¶ntem', fullness?.method ?? 'â€”'],
    ['GÃ¼ven', `${fullness?.confidence ?? 'â€”'}${fullness?.isEstimated ? ' Â· tahmini' : ''}`],
    ['Min / max kot', `${numberOf(details.minWaterLevelM)?.toLocaleString('tr-TR') ?? 'â€”'} / ${numberOf(details.maxWaterLevelM)?.toLocaleString('tr-TR') ?? 'â€”'} m`],
    ['Min / max hacim', `${numberOf(details.minVolumeHm3)?.toLocaleString('tr-TR') ?? 'â€”'} / ${numberOf(details.maxVolumeHm3)?.toLocaleString('tr-TR') ?? 'â€”'} hmÂ³`],
    ['Aktif hacim', numberOf(details.activeVolumeHm3) !== null ? `${Number(details.activeVolumeHm3).toLocaleString('tr-TR')} hmÂ³` : 'â€”'],
    ['Debi', numberOf(details.unitFlowM3s) !== null ? `${Number(details.unitFlowM3s).toLocaleString('tr-TR')} mÂ³/sn` : 'â€”'],
    ['Kaskat', String(details.cascadeName ?? 'â€”')],
    ['ResmÃ® havza', String(details.officialBasinName ?? 'â€”')],
    ['GÃ¶sterim havzasÄ±', String(details.displayBasinName ?? details.basinName ?? 'â€”')],
  ];
  return (
    <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 rounded-lg border border-[var(--line)] bg-[var(--panel2)] p-2 text-[9px] text-slate-500">
      {rows.map(([label, value]) => <span key={label}>{label}: <b className="font-semibold text-[var(--text)]">{value}</b></span>)}
    </div>
  );
}

function CompactTrend({ points, isLight }: { points: FullnessHistoryPoint[]; isLight: boolean }): React.ReactNode {
  if (points.length === 0) return <div className="mt-1 text-[9px] text-[var(--muted)]">GeÃ§miÅŸ gÃ¶zlem yok</div>;
  if (points.length === 1) {
    const only = points[0];
    return <div className="mt-1 text-[9px] text-[var(--muted)]">1 gÃ¶zlem mevcut Â· trend iÃ§in en az 2 gÃ¶zlem gerekli Â· %{Math.round(only.value)} ({only.date})</div>;
  }
  const width = 240;
  const height = 80;
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1e-9, max - min);
  const path = points.map((point, index) => `${index ? 'L' : 'M'}${((index / (points.length - 1)) * width).toFixed(1)},${(height - ((point.value - min) / span) * height).toFixed(1)}`).join(' ');
  const first = values[0];
  const last = values[values.length - 1];
  const delta = last - first;
  return (
    <div className="mt-1">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[80px] w-full" role="img" aria-label="Doluluk trendi">
        <path d={path} fill="none" stroke={isLight ? '#087f9a' : '#22d3ee'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="mt-0.5 flex justify-between font-mono text-[8px] text-[var(--muted)]">
        <span>%{Math.round(first)} Â· {points[0].date}</span>
        <span className={delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{delta >= 0 ? '+' : ''}{delta.toFixed(1)}</span>
        <span>%{Math.round(last)} Â· {points[points.length - 1].date}</span>
      </div>
    </div>
  );
}

/** Time series accordion: lazy-loads history only when opened. */
export function HesHistoryPanel({ hesId, isLight }: { hesId: string; isLight: boolean }): React.ReactNode {
  const fullnessHistory = useHydrologyStore((s) => s.fullnessHistory);
  const historyStatus = useHydrologyStore((s) => s.historyStatus);
  const historicalDate = useHydrologyStore((s) => s.historicalDate);
  const setHistoricalDate = useHydrologyStore((s) => s.setHistoricalDate);
  const loadFullnessHistory = useHydrologyStore((s) => s.loadFullnessHistory);
  const [range, setRange] = useState<7 | 30 | 90 | 365>(30);
  const [calendarOpen, setCalendarOpen] = useState(false);
  useEffect(() => {
    void loadFullnessHistory();
  }, [hesId, loadFullnessHistory]);
  const allPoints = fullnessHistory?.records?.find((record) => record.hesId === hesId)?.points ?? [];
  const points = allPoints.filter((point) => {
    const latest = Date.parse(allPoints.at(-1)?.date ?? '');
    const date = Date.parse(point.date);
    return Number.isFinite(latest) && Number.isFinite(date) ? latest - date <= range * 86400000 : true;
  });
  return (
    <div className="mt-1 rounded-lg border border-[var(--line)] bg-[var(--panel2)] p-2">
      <div className="flex items-center justify-between gap-1" aria-label="Trend aralÄ±ÄŸÄ±">
        <div className="flex gap-1">
          {([7, 30, 90, 365] as const).map((days) => (
            <button key={days} type="button" onClick={() => setRange(days)} aria-pressed={range === days} className={`rounded px-1.5 py-0.5 font-mono text-[8px] ${range === days ? 'bg-cyan-500/15 text-cyan-400' : 'text-[var(--muted)]'}`}>{days === 365 ? '1Y' : `${days}G`}</button>
          ))}
        </div>
        <button type="button" onClick={() => setCalendarOpen((open) => !open)} aria-expanded={calendarOpen} aria-label="Takvim" title="Tarih seÃ§" className="rounded px-1.5 py-0.5 text-[10px] text-[var(--muted)]">ğŸ“…</button>
      </div>
      {calendarOpen && (
        <div className="mt-1 flex items-center gap-1">
          <input type="date" value={historicalDate ?? ''} onChange={(event) => setHistoricalDate(event.target.value || null)} aria-label="Tarihsel gÃ¶rÃ¼nÃ¼m tarihi" className="min-w-0 flex-1 rounded border border-[var(--line)] bg-[var(--panel)] px-1 py-1 text-[9px] text-[var(--text)]" />
        </div>
      )}
      {historicalDate && (
        <button type="button" onClick={() => setHistoricalDate(null)} className="mt-1 text-[8px] text-amber-400 underline">Tarihsel gÃ¶rÃ¼nÃ¼mden Ã§Ä±k / BugÃ¼n</button>
      )}
      {historyStatus === 'loading' ? <div className="mt-1 text-[9px] text-[var(--muted)]">TarihÃ§e yÃ¼kleniyorâ€¦</div> : <CompactTrend points={points} isLight={isLight} />}
    </div>
  );
}

/** Selected-HES detail: summary always open, technical + history collapsed. */
export function HesDetailPanel({ data, fullness, isLight }: { data: HesDetailData; fullness: FullnessResult | undefined; isLight: boolean }): React.ReactNode {
  const [technicalOpen, setTechnicalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [pdhesLink, setPdhesLink] = useState<PdhesHesLink | null>(null);
  useEffect(() => { void loadPdhesHesLinks().then((links) => setPdhesLink(links.find((link) => link.hesId === data.id) ?? null)).catch(() => setPdhesLink(null)); }, [data.id]);
  return (
    <div className="hydro-detail mb-2">
      <HesSummaryCard data={data} fullness={fullness} isLight={isLight} technicalOpen={technicalOpen} onToggleTechnical={() => setTechnicalOpen((open) => !open)} historyOpen={historyOpen} onToggleHistory={() => setHistoryOpen((open) => !open)} />
      {technicalOpen && <HesTechnicalDetails data={data} fullness={fullness} />}
      {historyOpen && <HesHistoryPanel key={data.id} hesId={data.id} isLight={isLight} />}
      {pdhesLink && <a className="hydro-pdhes-backlink" href="/data">PDHES aday detayına dön</a>}
    </div>
  );
}
