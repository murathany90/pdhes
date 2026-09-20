import React, { useEffect, useMemo } from 'react';
import { CalendarClock, ChevronLeft, ChevronRight, Pause, Play, Radio, X } from 'lucide-react';
import { formatDataDate } from '../data/hydrology';
import { getForecastTimestamps } from '../services/hydroData';
import { useHydrologyStore } from '../store/useHydrologyStore';

export const Timeline: React.FC = () => {
  const status = useHydrologyStore((s) => s.hydroDataStatus);
  const geoglows = useHydrologyStore((s) => s.geoglows);
  const selectedEntity = useHydrologyStore((s) => s.selectedEntity);
  const rivers = useHydrologyStore((s) => s.rivers);
  const relations = useHydrologyStore((s) => s.hes177Relations);
  const index = useHydrologyStore((s) => s.timelineIndex);
  const isPlaying = useHydrologyStore((s) => s.isPlayingTimeline);
  const setIndex = useHydrologyStore((s) => s.setTimelineIndex);
  const togglePlayback = useHydrologyStore((s) => s.toggleTimelinePlayback);
  const setTimelineOpen = useHydrologyStore((s) => s.setTimelineOpen);
  const selectedRiverId = selectedEntity?.type === 'river' ? selectedEntity.id : selectedEntity?.type === 'hes' ? relations?.byHesId?.[selectedEntity.id]?.riverSystemId ?? relations?.byHesId?.[selectedEntity.id]?.riverIds?.[0] : null;
  const selectedRiver = selectedRiverId ? rivers.features.find((feature) => String(feature.properties?.id ?? feature.id ?? '') === String(selectedRiverId)) : null;
  const forecastLocalIds = Array.isArray(selectedRiver?.properties?.geoglowsLocalRiverIds) ? selectedRiver.properties.geoglowsLocalRiverIds.map(String) : [String(selectedRiver?.properties?.representativeLocalRiverId ?? '')].filter(Boolean);
  const selectedForecastRecords = useMemo(() => (geoglows?.records ?? []).filter((record) => forecastLocalIds.includes(String(record.localRiverId ?? '')) && Array.isArray(record.data) && record.data.length > 1), [forecastLocalIds, geoglows?.records]);
  const timestamps = useMemo(() => getForecastTimestamps(selectedForecastRecords.length ? { records: selectedForecastRecords } : null), [selectedForecastRecords]);
  const activeIndex = Math.min(index, Math.max(0, timestamps.length - 1));
  const activeTimestamp = timestamps[activeIndex];
  const hasSelectedForecast = selectedForecastRecords.length > 0;

  useEffect(() => {
    if (index >= timestamps.length && timestamps.length) setIndex(0);
    if (isPlaying && timestamps.length < 2) togglePlayback();
  }, [index, isPlaying, setIndex, timestamps.length, togglePlayback]);
  useEffect(() => {
    if (!isPlaying || timestamps.length < 2) return;
    const timer = window.setInterval(() => setIndex((useHydrologyStore.getState().timelineIndex + 1) % timestamps.length), 1200);
    return () => window.clearInterval(timer);
  }, [isPlaying, setIndex, timestamps.length]);

  const panel = 'border-[var(--line)] bg-[var(--panel)] text-[var(--text)]';
  const shift = (delta: number) => { if (timestamps.length) setIndex((activeIndex + delta + timestamps.length) % timestamps.length); };

  if (!hasSelectedForecast || timestamps.length < 2) return null;

  return (
    <section className={`hydro-timeline-card pointer-events-auto w-full rounded-lg border ${panel}`} aria-label="Akış tahmini (GEOGLOWS)">
      <div className="hydro-timeline-heading"><div className="flex min-w-0 items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5 shrink-0 text-cyan-400" /><div className="min-w-0"><div className="hydro-timeline-title">Akış tahmini (GEOGLOWS)</div><div className="hydro-timeline-subtitle">Nehir tahmin adımları</div></div></div><div className="flex items-center gap-1"><span className={`hydro-timeline-step ${status === 'ready' || status === 'partial' ? 'ready' : ''}`}><Radio className="h-3 w-3" />{`${activeIndex + 1}/${timestamps.length}`}</span><button type="button" onClick={() => setTimelineOpen(false)} className="hydro-timeline-close" aria-label="Akış tahminini kapat" title="Kapat"><X className="h-3.5 w-3.5" /></button></div></div>
      <div className="hydro-timeline-controls"><button type="button" onClick={() => shift(-1)} className="hydro-timeline-nav" aria-label="Önceki tahmin zamanı"><ChevronLeft className="h-3.5 w-3.5" /></button><button type="button" onClick={togglePlayback} className="hydro-timeline-play" aria-label={isPlaying ? 'Durdur' : 'Oynat'}>{isPlaying ? <Pause className="h-3.5 w-3.5" fill="currentColor" /> : <Play className="ml-0.5 h-3.5 w-3.5" fill="currentColor" />}</button><input type="range" min="0" max={timestamps.length - 1} step="1" value={activeIndex} onChange={(event) => setIndex(Number(event.target.value))} className="timeline-range" aria-label="GEOGLOWS tahmin zamanı" /><button type="button" onClick={() => shift(1)} className="hydro-timeline-nav" aria-label="Sonraki tahmin zamanı"><ChevronRight className="h-3.5 w-3.5" /></button></div>
      <div className="hydro-timeline-footer"><span>{formatDataDate(activeTimestamp)}</span><span>GEOGLOWS tahmini</span></div>
    </section>
  );
};
