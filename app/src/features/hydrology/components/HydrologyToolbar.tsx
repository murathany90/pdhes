import React, { useMemo, useState } from 'react';
import { ChevronDown, Info, Map as MapIcon, Menu, RefreshCw } from 'lucide-react';
import { formatDataDate } from '../data/hydrology';
import { fullnessRecordsByHes, preferredFullnessRecord, resolveHesFullness } from '../data/fullnessSources';
import { useHydrologyStore } from '../store/useHydrologyStore';

const basemapLabels = { dark: 'Karanlık', light: 'Açık', neutral: 'Nötr', satellite: 'Uydu', streets: 'Sokak' };

export const HesToolbar: React.FC = () => {
  const basemap = useHydrologyStore((state) => state.basemap);
  const setBasemap = useHydrologyStore((state) => state.setBasemap);
  const isSidebarOpen = useHydrologyStore((state) => state.isSidebarOpen);
  const toggleSidebar = useHydrologyStore((state) => state.toggleSidebar);
  const rivers = useHydrologyStore((state) => state.rivers);
  const hes177 = useHydrologyStore((state) => state.hes177);
  const basins = useHydrologyStore((state) => state.basins);
  const relations = useHydrologyStore((state) => state.hes177Relations);
  const manifest = useHydrologyStore((state) => state.hes177Manifest);
  const epias = useHydrologyStore((state) => state.epias);
  const fullnessPayload = useHydrologyStore((state) => state.fullness);
  const dataMode = useHydrologyStore((state) => state.dataMode);
  const dataStatus = useHydrologyStore((state) => state.hydroDataStatus);
  const hydroDataError = useHydrologyStore((state) => state.hydroDataError);
  const lastRefreshAt = useHydrologyStore((state) => state.lastRefreshAt);
  const refreshHydroData = useHydrologyStore((state) => state.refreshHydroData);
  const [basemapMenuOpen, setBasemapMenuOpen] = useState(false);

  const kpis = useMemo(() => {
    const totalPower = hes177.features.reduce((sum, feature) => sum + (Number(feature.properties?.installedPowerMw) || 0), 0);
    const fullnessByHes = fullnessRecordsByHes(fullnessPayload);
    const sources = hes177.features.map((feature) => {
      const properties = feature.properties ?? {};
      const id = String(properties.id ?? feature.id ?? '');
      const names = [properties.damName, properties.name].filter(Boolean).map((value) => String(value).toLocaleLowerCase('tr-TR'));
      const record = dataMode === 'epias' ? (epias?.records ?? []).find((candidate) => [candidate.hesId, candidate.hesID, candidate.entityId].filter(Boolean).map(String).includes(id) || [candidate.damName, candidate.dam_name, candidate.name].filter(Boolean).map((value) => String(value).toLocaleLowerCase('tr-TR')).some((name) => names.includes(name))) : undefined;
      const result = resolveHesFullness(id, properties, preferredFullnessRecord(fullnessByHes.get(id), record), dataMode);
      return result;
    });
    return {
      hes: hes177.features.length,
      power: totalPower,
      basins: Number(manifest?.basinCount ?? basins.features.length),
      rivers: Number(manifest?.logicalRiverCount ?? rivers.features.length),
      cascades: Number(manifest?.cascadeEdgeCount ?? relations?.cascadeEdges?.length ?? 0),
      located: Number(manifest?.coordinateCount ?? hes177.features.filter((feature) => Boolean(feature.geometry)).length),
      calculated: sources.filter((source) => source.sourceClass === 'calculated_storage' && source.fullnessPercent !== null).length,
      mock: sources.filter((source) => source.sourceClass === 'mock').length,
      epias: sources.filter((source) => source.source === 'epias').length,
      satellite: sources.filter((source) => source.sourceClass === 'satellite_altimetry' || source.sourceClass === 'satellite_area').length,
      stale: sources.filter((source) => source.status === 'stale').length,
      notApplicable: sources.filter((source) => source.status === 'not_applicable').length,
      unavailable: sources.filter((source) => source.status === 'unavailable').length,
      applicable: Number(fullnessPayload?.coverage?.applicableCount ?? sources.filter((source) => source.status !== 'not_applicable').length),
      available: Number(fullnessPayload?.coverage?.availableCount ?? sources.filter((source) => source.status === 'available').length) + Number(fullnessPayload?.coverage?.staleCount ?? sources.filter((source) => source.status === 'stale').length),
      latestObservationAt: fullnessPayload?.latestObservationAt ?? sources.map((source) => source.observedAt).filter(Boolean).sort().at(-1) ?? null,
    };
  }, [basins.features.length, dataMode, epias?.records, fullnessPayload, hes177.features, manifest, relations?.cascadeEdges?.length, rivers.features.length]);

  const statusLabel = dataStatus === 'ready' ? 'Veri hazır' : dataStatus === 'loading' ? 'Yükleniyor' : dataStatus === 'partial' ? 'Kısmi veri' : dataStatus === 'failed' ? 'Veri paketi yüklenemedi' : 'Veri bekleniyor';
  const pipelineRunAt = fullnessPayload?.pipelineRunAt ?? lastRefreshAt;

  return (
    <section className="hes-toolbar" aria-label="HES araç çubuğu">
      {!isSidebarOpen && <button type="button" onClick={toggleSidebar} className="toolbar-sidebar-toggle" title="Paneli aç" aria-label="Paneli aç"><Menu className="h-4 w-4" /></button>}
      <div className="hes-toolbar-title">
        <span className="text-xs font-semibold">HESLER</span>
        <span className="rounded-md bg-cyan-500/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[var(--primary)]">20 MW+</span>
        <span className="hidden font-mono text-[9px] text-[var(--muted)] sm:inline" title={hydroDataError ?? (pipelineRunAt ? `Pipeline çalışması: ${formatDataDate(pipelineRunAt)}` : undefined)}>{statusLabel}{kpis.latestObservationAt ? ` · Son gözlem ${formatDataDate(kpis.latestObservationAt)}` : ' · Gözlem yok'}</span>
      </div>

      <div className="hydro-kpis">
        <Kpi label="HES" value={kpis.hes.toLocaleString('tr-TR')} />
        <Kpi label="MW" value={Math.round(kpis.power).toLocaleString('tr-TR')} />
        <Kpi label="Doluluk" value={`${kpis.available}/${kpis.applicable}`} title={`Mevcut ${kpis.available} · Uygulanabilir ${kpis.applicable} · Hesaplanan ${kpis.calculated} · EPİAŞ ${kpis.epias} · Uydu ${kpis.satellite} · Eski ${kpis.stale} · Veri yok ${kpis.unavailable} · Uygulanamaz ${kpis.notApplicable}`} />
        <button type="button" className="hydro-kpi-info" title={`Havza ${kpis.basins} · Akarsu ${kpis.rivers} · Kaskat ${kpis.cascades} · Konumlu ${kpis.located}`} aria-label="Diğer HES göstergeleri"><Info className="h-3.5 w-3.5" /></button>
      </div>

      <div className="hes-toolbar-actions">
        <span className="hydro-status-badge" title={hydroDataError ?? 'Doluluk, kanonik resolver ve mevcut doğrulanmış kaynaklara göre gösterilir'}>{statusLabel}</span>
        <button type="button" onClick={() => void refreshHydroData()} disabled={dataStatus === 'loading'} className="hidden items-center gap-1.5 rounded-lg border border-cyan-500/35 px-2 py-1.5 text-[10px] font-medium text-[var(--primary)] transition hover:bg-cyan-500/8 disabled:opacity-50 sm:flex"><RefreshCw className={`h-3.5 w-3.5 ${dataStatus === 'loading' ? 'animate-spin' : ''}`} />Yenile</button>
        <div className="hydro-basemap-picker">
          <button type="button" onClick={() => setBasemapMenuOpen((open) => !open)} className="hydro-basemap-button" aria-expanded={basemapMenuOpen} aria-controls="hydro-basemap-menu" title={`Altlık: ${basemapLabels[basemap]}`}><MapIcon className="h-3.5 w-3.5 text-[var(--primary)]" /><span>Altlık</span><ChevronDown className="h-3 w-3" /></button>
          {basemapMenuOpen && <div id="hydro-basemap-menu" className="hydro-basemap-menu" role="group" aria-label="Harita altlığı">{Object.entries(basemapLabels).map(([value, label]) => <button type="button" key={value} aria-pressed={basemap === value} onClick={() => { setBasemap(value as typeof basemap); setBasemapMenuOpen(false); }}>{label}</button>)}</div>}
        </div>
      </div>
    </section>
  );
};

const Kpi: React.FC<{ label: string; value: string; className?: string; title?: string }> = ({ label, value, className = 'flex', title }) => (
  <div title={title} className={`hydro-kpi ${className}`}>
    <span className="font-mono text-[10px] font-semibold text-[var(--text)]">{value}</span>
    <span className="text-[8px] uppercase tracking-wide text-[var(--muted)]">{label}</span>
  </div>
);
