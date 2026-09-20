import React, { useMemo, useState } from 'react';
import { Activity, ArrowUpDown, ChevronDown, Eye, EyeOff, Gauge, Mountain, Search, Waves, X, Zap } from 'lucide-react';
import { describeFullness, fullnessRecordsByHes, fullnessSourceLabel, preferredFullnessRecord, resolveHistoricalFullness, resolveHesFullness } from '../data/fullnessSources';
import { hasVerifiedFlowDirection } from '../data/hydrology';
import { HesDetailPanel, hydrologyDisplay } from './HesDetail';
import { useHydrologyStore, type TabType } from '../store/useHydrologyStore';
import type { FullnessResult } from '../types/hydrology';

type SortKey = 'type' | 'name' | 'basin' | 'river' | 'power' | 'fullness' | 'source' | 'count' | 'forecast' | 'cascade';
type FullnessSource = string;
type Row = {
  id: string;
  type: 'hes' | 'river' | 'basin';
  name: string;
  basin: string;
  river: string;
  power: number;
  fullness: number | null;
  source: FullnessSource;
  count: number;
  forecast: boolean;
  cascadeCount: number;
  riverNames: string;
  fullnessStatus?: string;
  fullnessSourceClass?: string;
  details?: Record<string, unknown>;
};

type Column = { key: SortKey; label: string; className?: string; value: (row: Row) => React.ReactNode };

function numberOf(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatMw(value: number): string {
  return `${Math.round(value).toLocaleString('tr-TR')} MW`;
}

function fullnessCode(result: FullnessResult): string {
  if (result.fullnessPercent === null) return result.status === 'not_applicable' ? 'N/A' : '—';
  if (result.sourceClass === 'mock') return 'M';
  if (result.sourceClass === 'official' || result.sourceClass === 'official_live') return 'E';
  if (result.sourceClass === 'official_published') return 'D';
  if (result.sourceClass === 'satellite_altimetry' || result.sourceClass === 'satellite_area') return 'U';
  return 'H';
}

function volumeFullness(rows: Array<{ details?: Record<string, unknown> }>): number | null {
  const eligible = rows.map((row) => ({
    details: row.details,
    active: numberOf(row.details?.activeVolumeHm3),
    minimum: numberOf(row.details?.minVolumeHm3),
    maximum: numberOf(row.details?.maxVolumeHm3),
  })).filter((row) => row.details?.hydroPlantStorageType !== 'run_of_river' && row.active !== null && row.minimum !== null && row.maximum !== null && row.maximum > row.minimum);
  const usableVolume = eligible.reduce((sum, row) => sum + (row.maximum ?? 0) - (row.minimum ?? 0), 0);
  const activeVolume = eligible.reduce((sum, row) => sum + (row.active ?? 0), 0);
  return usableVolume > 0 ? Math.min(100, Math.max(0, (activeVolume / usableVolume) * 100)) : null;
}

function fullnessCell(row: Row): React.ReactNode {
  const result = row.details?.fullnessResult as FullnessResult | undefined;
  if (!result) return <span title="Doluluk verisi bulunamadı">—</span>;
  const described = describeFullness(result);
  const sourceLabel = `${fullnessSourceLabel(result)} · ${hydrologyDisplay(result.method)}`;
  if (row.fullness === null) return <span title={`${described.title} · ${sourceLabel}`}>—</span>;
  return <span title={`${described.title} · ${sourceLabel}`}>{`%${Math.round(row.fullness)} · ${row.source}`}</span>;
}

function hesNameCell(row: Row): React.ReactNode {
  return (
    <span className="hydro-hes-name-cell">
      <span className="hydro-hes-name"><Zap className="h-3 w-3 shrink-0 text-amber-400" /><span>{row.name}</span></span>
      <span className="hydro-hes-river">{row.river}</span>
      <span className="hydro-hes-basin">{row.basin}</span>
    </span>
  );
}

function isValidRiver(value: unknown): value is string {
  const normalized = String(value ?? '').trim().toLocaleLowerCase('tr-TR');
  return Boolean(normalized && !['—', 'bilinmiyor', 'akarsu adı doğrulanamadı'].includes(normalized));
}

export const Sidebar: React.FC = () => {
  const theme = useHydrologyStore((s) => s.theme);
  const currentTab = useHydrologyStore((s) => s.currentTab);
  const setTab = useHydrologyStore((s) => s.setTab);
  const searchQuery = useHydrologyStore((s) => s.searchQuery);
  const setSearchQuery = useHydrologyStore((s) => s.setSearchQuery);
  const selectedEntity = useHydrologyStore((s) => s.selectedEntity);
  const setSelectedEntity = useHydrologyStore((s) => s.setSelectedEntity);
  const timelineOpen = useHydrologyStore((s) => s.isTimelineOpen);
  const setTimelineOpen = useHydrologyStore((s) => s.setTimelineOpen);
  const toggleLayer = useHydrologyStore((s) => s.toggleLayer);
  const flowVisualization = useHydrologyStore((s) => s.flowVisualization);
  const toggleFlowVisualization = useHydrologyStore((s) => s.toggleFlowVisualization);
  const layers = useHydrologyStore((s) => s.layers);
  const rivers = useHydrologyStore((s) => s.rivers);
  const hes = useHydrologyStore((s) => s.hes177);
  const basins = useHydrologyStore((s) => s.basins);
  const geoglows = useHydrologyStore((s) => s.geoglows);
  const epias = useHydrologyStore((s) => s.epias);
  const fullnessPayload = useHydrologyStore((s) => s.fullness);
  const dataMode = useHydrologyStore((s) => s.dataMode);
  const fullnessHistory = useHydrologyStore((s) => s.fullnessHistory);
  const historicalDate = useHydrologyStore((s) => s.historicalDate);
  const dataStatus = useHydrologyStore((s) => s.hydroDataStatus);
  const hydroDataError = useHydrologyStore((s) => s.hydroDataError);
  const isLight = theme === 'light';
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [fullnessFilter, setFullnessFilter] = useState<'all' | 'available' | 'official' | 'satellite' | 'calculated' | 'stale' | 'unavailable' | 'not_applicable'>('all');
  const [layersOpen, setLayersOpen] = useState(false);
  const [detailSection, setDetailSection] = useState<'summary' | 'technical' | 'history'>('summary');
  const fullnessByHes = useMemo(() => fullnessRecordsByHes(fullnessPayload), [fullnessPayload]);

  const epiasByHes = useMemo(() => new Map(hes.features.flatMap((feature) => {
    const properties = feature.properties ?? {};
    const id = String(properties.id ?? feature.id ?? '');
    const names = [properties.damName, properties.name].filter(Boolean).map((value) => String(value).toLocaleLowerCase('tr-TR'));
    const record = (epias?.records ?? []).find((candidate) => {
      const ids = [candidate.hesId, candidate.hesID, candidate.entityId].filter(Boolean).map(String);
      const recordNames = [candidate.damName, candidate.dam_name, candidate.name].filter(Boolean).map((value) => String(value).toLocaleLowerCase('tr-TR'));
      return ids.includes(id) || recordNames.some((name) => names.includes(name));
    });
    return record ? [[id, record] as const] : [];
  })), [epias?.records, hes.features]);

  const hesRows = useMemo<Row[]>(() => hes.features.map((feature) => {
    const properties = feature.properties ?? {};
    const id = String(properties.id ?? feature.id ?? '');
    const currentFullness = resolveHesFullness(id, properties, preferredFullnessRecord(fullnessByHes.get(id), epiasByHes.get(id)), dataMode);
    const fullnessResult = historicalDate ? resolveHistoricalFullness(id, currentFullness, fullnessHistory, historicalDate) : currentFullness;
    return {
      id, type: 'hes' as const, name: String(properties.name ?? 'HES'), basin: String(properties.displayBasinName ?? properties.basinName ?? '—'), river: isValidRiver(properties.riverName) ? String(properties.riverName) : '—', power: numberOf(properties.installedPowerMw) ?? 0,
      fullness: fullnessResult.fullnessPercent, source: fullnessCode(fullnessResult), fullnessStatus: fullnessResult.status, fullnessSourceClass: fullnessResult.sourceClass, count: 1, forecast: false, cascadeCount: Number(Boolean(properties.cascadeToId)) + (Array.isArray(properties.cascadeFromIds) ? properties.cascadeFromIds.length : 0), riverNames: '', details: { ...properties, fullnessResult },
    };
  }), [dataMode, epiasByHes, fullnessByHes, fullnessHistory, hes.features, historicalDate]);

  const hesById = useMemo(() => new Map(hesRows.map((row) => [row.id, row])), [hesRows]);
  const basinLabels = useMemo(() => new Map(basins.features.map((feature) => [String(feature.properties?.basinId ?? feature.properties?.ID ?? feature.id ?? ''), String(feature.properties?.name ?? feature.properties?.HAVZA_ADI ?? 'Havza')])), [basins.features]);

  const riverRows = useMemo<Row[]>(() => rivers.features.map((feature) => {
    const properties = feature.properties ?? {};
    const id = String(properties.id ?? feature.id ?? '');
    const members = (Array.isArray(properties.hesIds) ? properties.hesIds : []).map(String).map((hesId) => hesById.get(hesId)).filter((row): row is Row => Boolean(row));
    const localIds = Array.isArray(properties.geoglowsLocalRiverIds) ? properties.geoglowsLocalRiverIds.map(String) : [];
    const forecast = (geoglows?.records ?? []).some((record) => localIds.includes(String(record.localRiverId ?? '')) && Array.isArray(record.data) && record.data.length > 1);
    const displayBasins = [...new Set(members.map((row) => row.basin).filter((name) => name !== '—'))];
    const fullness = volumeFullness(members);
    return {
      id, type: 'river' as const, name: String(properties.riverName ?? properties.name ?? 'Akarsu'), basin: displayBasins.join(' / ') || basinLabels.get(String(properties.basinId ?? '')) || '—', river: String(properties.riverName ?? properties.name ?? 'Akarsu'),
      power: members.reduce((sum, row) => sum + row.power, 0), fullness, source: (fullness === null ? '—' : 'H') as FullnessSource, count: members.length, forecast, cascadeCount: 0, riverNames: '', details: properties,
    };
  }).filter((row) => row.count > 0), [basinLabels, geoglows?.records, hesById, rivers.features]);

  const basinRows = useMemo<Row[]>(() => basins.features.map((feature) => {
    const properties = feature.properties ?? {};
    const id = String(properties.basinId ?? properties.HAVZA_ID ?? properties.ID ?? feature.id ?? '');
    const members = hesRows.filter((row) => String(row.details?.basinId ?? '') === id);
    const riverNames = [...new Set(members.map((row) => row.river).filter((name) => name !== '—'))];
    const fullness = volumeFullness(members);
    return {
      id, type: 'basin' as const, name: String(properties.name ?? properties.HAVZA_ADI ?? 'Havza'), basin: String(properties.name ?? properties.HAVZA_ADI ?? 'Havza'), river: '', power: members.reduce((sum, row) => sum + row.power, 0),
      fullness, source: (fullness === null ? '—' : 'H') as FullnessSource, count: members.length, forecast: false, cascadeCount: members.reduce((sum, row) => sum + row.cascadeCount, 0), riverNames: riverNames.slice(0, 3).join(', ') || '—', details: properties,
    };
  }).filter((row) => row.count > 0), [basins.features, hesRows]);

  const rows = currentTab === 'hes' ? hesRows : currentTab === 'rivers' ? riverRows : basinRows;
  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase('tr-TR');
    const bySource = currentTab !== 'hes' || fullnessFilter === 'all' ? rows : rows.filter((row) => {
      if (fullnessFilter === 'official') return row.fullnessSourceClass === 'official' || row.fullnessSourceClass === 'official_live' || row.fullnessSourceClass === 'official_published';
      if (fullnessFilter === 'satellite') return row.fullnessSourceClass === 'satellite_altimetry' || row.fullnessSourceClass === 'satellite_area';
      if (fullnessFilter === 'available') return row.fullnessStatus === 'available' || row.fullnessStatus === 'stale';
      return row.fullnessStatus === fullnessFilter || (fullnessFilter === 'calculated' && row.fullnessSourceClass === 'calculated_storage' && row.fullness !== null);
    });
    if (!query) return bySource;
    return bySource.filter((row) => `${row.name} ${row.basin} ${row.river} ${row.riverNames}`.toLocaleLowerCase('tr-TR').includes(query));
  }, [currentTab, fullnessFilter, rows, searchQuery]);
  const sortedRows = useMemo(() => [...filteredRows].sort((left, right) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    const numericKeys: SortKey[] = ['power', 'fullness', 'count', 'cascade'];
    if (numericKeys.includes(sortKey)) {
      const numeric = (row: Row) => sortKey === 'power' ? row.power : sortKey === 'fullness' ? row.fullness ?? -1 : sortKey === 'count' ? row.count : row.cascadeCount;
      return (numeric(left) - numeric(right)) * direction;
    }
    if (sortKey === 'forecast') return (Number(left.forecast) - Number(right.forecast)) * direction;
    const leftValue = sortKey === 'type' ? left.type : sortKey === 'name' ? left.name : sortKey === 'basin' ? left.basin : sortKey === 'river' ? left.river : sortKey === 'source' ? left.source : left.name;
    const rightValue = sortKey === 'type' ? right.type : sortKey === 'name' ? right.name : sortKey === 'basin' ? right.basin : sortKey === 'river' ? right.river : sortKey === 'source' ? right.source : right.name;
    return leftValue.localeCompare(rightValue, 'tr-TR') * direction;
  }), [filteredRows, sortDirection, sortKey]);

  const columns = useMemo<Column[]>(() => currentTab === 'hes' ? [
    { key: 'name', label: 'HES', value: hesNameCell }, { key: 'power', label: 'MW', className: 'text-right', value: (row) => formatMw(row.power) }, { key: 'fullness', label: 'Doluluk', className: 'text-right', value: fullnessCell },
  ] : currentTab === 'rivers' ? [
    { key: 'name', label: 'Akarsu adı', value: (row) => row.name }, { key: 'basin', label: 'Havza', value: (row) => row.basin }, { key: 'count', label: 'HES', className: 'text-right', value: (row) => row.count.toLocaleString('tr-TR') }, { key: 'power', label: 'MW', className: 'text-right', value: (row) => formatMw(row.power) }, { key: 'forecast', label: 'Tahmin', className: 'text-right', value: (row) => row.forecast ? 'Var' : 'Yok' }, { key: 'fullness', label: 'Doluluk', className: 'text-right', value: (row) => row.fullness === null ? '—' : `%${Math.round(row.fullness)}` },
  ] : [
    { key: 'name', label: 'Havza adı', value: (row) => row.name }, { key: 'count', label: 'HES', className: 'text-right', value: (row) => row.count.toLocaleString('tr-TR') }, { key: 'power', label: 'MW', className: 'text-right', value: (row) => formatMw(row.power) }, { key: 'river', label: 'Ana akarsular', value: (row) => row.riverNames }, { key: 'fullness', label: 'Doluluk', className: 'text-right', value: (row) => row.fullness === null ? '—' : `%${Math.round(row.fullness)}` }, { key: 'cascade', label: 'Kaskat', className: 'text-right', value: (row) => row.cascadeCount || '—' },
  ], [currentTab]);
  const gridTemplate = currentTab === 'hes' ? 'minmax(0,1.7fr) 4.4rem 4.6rem' : currentTab === 'rivers' ? 'minmax(0,1.5fr) minmax(0,.9fr) 2.2rem 4.15rem 2.8rem 3.55rem' : 'minmax(0,1.3fr) 2.2rem 4.15rem minmax(0,1.1fr) 3.55rem 2.8rem';
  const selectedHes = selectedEntity?.type === 'hes' ? hesRows.find((row) => row.id === selectedEntity.id) : null;
  const selectedFullness = selectedHes?.details?.fullnessResult as FullnessResult | undefined;
  const selectedRiver = selectedEntity?.type === 'river' ? riverRows.find((row) => row.id === selectedEntity.id) : null;
  const relatedRiverRows = selectedRiver ? hesRows.filter((row) => (selectedRiver.details?.hesIds as unknown[] ?? []).map(String).includes(row.id)) : [];
  const selectedRiverIds = selectedEntity?.type === 'hes'
    ? new Set((hesRows.find((row) => row.id === selectedEntity.id)?.details?.riverIds as unknown[] ?? []).map(String))
    : selectedEntity?.type === 'river' ? new Set([selectedEntity.id]) : new Set<string>();
  const selectedDirectionVerified = selectedRiverIds.size > 0 && rivers.features.some((feature) => selectedRiverIds.has(String(feature.properties?.id ?? feature.id ?? '')) && hasVerifiedFlowDirection(feature.properties));
  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode; count: number }> = [{ id: 'hes', label: 'HES', icon: <Mountain className="h-4 w-4" />, count: hesRows.length }, { id: 'rivers', label: 'Akarsular', icon: <Waves className="h-4 w-4" />, count: riverRows.length }, { id: 'basins', label: 'Havzalar', icon: <Gauge className="h-4 w-4" />, count: basinRows.length }];
  const layerControls: Array<{ key: keyof typeof layers; label: string }> = [{ key: 'basins', label: 'Havzalar' }, { key: 'rivers', label: 'Akarsular' }, { key: 'dams', label: 'Barajlar' }];
  const selectRow = (row: Row) => { setSelectedEntity({ type: row.type, id: row.id }); if (row.type === 'hes') setDetailSection('summary'); };
  const onSort = (key: SortKey) => { if (sortKey === key) setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc'); else { setSortKey(key); setSortDirection('asc'); } };

  const selectedHesPanel = selectedHes ? (
    <HesDetailPanel
      key={selectedHes.id}
      data={{ id: selectedHes.id, name: selectedHes.name, basin: selectedHes.basin, river: selectedHes.river, power: selectedHes.power, fullness: selectedHes.fullness, source: selectedHes.source, details: selectedHes.details }}
      fullness={selectedFullness}
      isLight={isLight}
      compact
      section="summary"
      onSectionChange={setDetailSection}
    />
  ) : null;

  const selectedHesDetail = selectedHes ? (
    <HesDetailPanel
      key={`detail-${selectedHes.id}`}
      data={{ id: selectedHes.id, name: selectedHes.name, basin: selectedHes.basin, river: selectedHes.river, power: selectedHes.power, fullness: selectedHes.fullness, source: selectedHes.source, details: selectedHes.details }}
      fullness={selectedFullness}
      isLight={isLight}
      section={detailSection}
      onSectionChange={setDetailSection}
      onBack={() => setDetailSection('summary')}
    />
  ) : null;

  return <aside className={`hydro-sidebar ${isLight ? 'light-scrollbar' : ''}`}>
    <div className={`hydro-sidebar-list-view ${detailSection !== 'summary' && selectedHes ? 'is-hidden' : ''}`}>
    <div className="hydro-sidebar-header">
      <div className="hydro-sidebar-titlebar"><div className="hydro-sidebar-title"><Activity className="h-4 w-4 text-cyan-400" />HESLER <span className="hydro-sidebar-count">{hesRows.length.toLocaleString('tr-TR')}</span></div><button onClick={() => useHydrologyStore.getState().toggleSidebar()} className="hydro-sidebar-close" aria-label="Paneli kapat" title="Paneli kapat"><X className="h-4 w-4" /></button></div>
      <div className="hydro-search-wrap"><Search className="hydro-search-icon" /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="HES, akarsu veya havza ara..." className="hydro-search" aria-label="HES, akarsu veya havza ara" />{searchQuery && <button type="button" className="hydro-search-clear" onClick={() => setSearchQuery('')} aria-label="Aramayı temizle" title="Aramayı temizle"><X className="h-3.5 w-3.5" /></button>}</div>
    </div>
    <div className="hydro-sidebar-controls">
      <div className="hydro-tabs">{tabs.map((tab) => <button key={tab.id} onClick={() => setTab(tab.id)} className={currentTab === tab.id ? 'active' : ''}>{tab.icon}<span>{tab.label}</span><span className="hydro-tab-count">{tab.count.toLocaleString('tr-TR')}</span></button>)}</div>
      <div className={`hydro-layer-controls ${layersOpen ? 'open' : ''}`}>
        <button type="button" className="hydro-layer-summary" onClick={() => setLayersOpen((open) => !open)} aria-expanded={layersOpen}><span>Katmanlar</span><ChevronDown className="h-3.5 w-3.5" /></button>
        {layersOpen && <div className="hydro-layer-options"><div className="hydro-layer-grid">{layerControls.map(({ key, label }) => <button key={key} onClick={() => toggleLayer(key)} className={layers[key] ? 'active' : ''} aria-pressed={layers[key]}>{layers[key] ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}{label}</button>)}</div><button type="button" onClick={toggleFlowVisualization} className={`hydro-flow-toggle ${flowVisualization ? 'active' : ''}`} aria-pressed={flowVisualization} title="GEOGLOWS akış tahmin ölçeğini aç/kapat"><Waves className="h-3 w-3" />{flowVisualization ? 'Akış / Debi açık' : 'Akış / Debi görünümü'}</button><div className="hydro-flow-explainer">Seçili HES’in bağlı olduğu akarsu sistemindeki tahmini akışı gösterir.{flowVisualization && !selectedDirectionVerified ? ' Yön verisi doğrulanmadığı için animasyon kapalı.' : ''}</div><div className="hydro-flow-legend" aria-label="Akış görünümü açıklaması"><span><i className="hydro-legend-line river" />Akarsu</span><span><i className="hydro-legend-line selected" />Seçili akarsu</span><span><i className="hydro-legend-line flow" />Akış yönü</span></div></div>}
      </div>
      {selectedHesPanel && <div className="hydro-selected-panel">{selectedHesPanel}</div>}
      {selectedRiver && relatedRiverRows.length > 0 && <div className="hydro-related-panel"><div className="hydro-related-heading"><div className="hydro-related-title">İlgili HES tesisleri</div>{selectedRiver.forecast && <button type="button" className={`hydro-related-flow ${timelineOpen ? 'active' : ''}`} onClick={() => setTimelineOpen(!timelineOpen)} aria-expanded={timelineOpen}>Akış tahmini</button>}</div>{relatedRiverRows.slice(0, 4).map((row) => <button key={row.id} onClick={() => selectRow(row)}>⚡ {row.name} · {formatMw(row.power)}</button>)}</div>}
    </div>
    <div className="hydro-list-header">
      <div className="hydro-list-filter"><span>{currentTab === 'hes' ? `${sortedRows.length.toLocaleString('tr-TR')} HES` : `${sortedRows.length.toLocaleString('tr-TR')} kayıt`}</span>{currentTab === 'hes' && <select value={fullnessFilter} onChange={(event) => setFullnessFilter(event.target.value as typeof fullnessFilter)} aria-label="Doluluk veri filtresi"><option value="all">Tüm doluluk</option><option value="available">Verisi var</option><option value="official">Resmî</option><option value="satellite">Uydu/türetilmiş</option><option value="calculated">Hacim hesabı</option><option value="stale">Eski</option><option value="unavailable">Veri yok</option><option value="not_applicable">Uygulanamaz</option></select>}</div>
      <div className={`hydro-column-header ${currentTab === 'hes' ? '' : 'wide-columns'}`} style={{ gridTemplateColumns: gridTemplate }}>{columns.map((column) => <button key={column.key} type="button" onClick={() => onSort(column.key)} className={column.className ?? ''} title={`${column.label} göre sırala`}>{column.label}{sortKey === column.key ? <ArrowUpDown className="ml-0.5 inline h-2.5 w-2.5" /> : null}</button>)}</div>
    </div>
    <div className="hydro-list-scroll">
      {dataStatus === 'loading' ? <div className="hydro-list-state">Kanonik HES verisi yükleniyor…</div> : dataStatus === 'failed' ? <div className="hydro-list-error" role="alert"><div>Veri paketi yüklenemedi</div><div>{hydroDataError ?? 'Kanonik manifest veya HES GeoJSON alınamadı.'}</div></div> : sortedRows.map((row) => <button key={row.id} onClick={() => selectRow(row)} className={`hydro-row ${selectedEntity?.type === row.type && selectedEntity.id === row.id ? 'selected' : ''} ${currentTab === 'hes' ? '' : 'wide-row'}`} style={{ gridTemplateColumns: gridTemplate }}>{columns.map((column) => { const content = column.value(row); return <span key={column.key} title={typeof content === 'string' ? content : undefined} className={column.key === 'name' ? 'name-cell' : column.key === 'river' ? 'river-cell' : column.className ?? 'muted-cell'}>{content}</span>; })}</button>)}
    </div>
    </div>
    {selectedHes && <div className={`hydro-sidebar-detail-view ${detailSection !== 'summary' ? 'is-visible' : ''}`}>{selectedHesDetail}</div>}
  </aside>;
};
