import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { Zap, X, Settings, Globe, List } from 'lucide-react';
import { useSiteStore } from '../stores/useSiteStore';
import { useSettingsStore, type VoltageGroup, type ElementGroup } from '../stores/useSettingsStore';
import { WORLD_EXAMPLES_DETAILED } from '../data/worldExamplesDetailed';
import { num } from '../utils/format';
import type { MapStyleKind } from '../utils/mapProviders';
import { MAP_PROVIDERS } from '../utils/mapProviders';

interface FabPopoverProps {
  mapStyle: MapStyleKind;
  setMapStyle: (s: MapStyleKind) => void;
  terrain3d: boolean;
  setTerrain3d: (b: boolean) => void;
  heightScale: number;
  setHeightScale: (s: number) => void;
  selectedSiteId: string | null;
  selectSite: (id: string) => void;
}

const CANDIDATE_COLUMNS = ['Aday Adı', 'Güç / Enerji', 'Düşü / Su Yolu'];
const WORLD_COLUMNS = ['Tesis Adı', 'Güç / Enerji', 'Düşü / Verim (%)'];
const TABLE_GRID_COLUMNS = '60% 20% 20%';

export function FabPopover({
  mapStyle, setMapStyle,
  terrain3d, setTerrain3d,
  heightScale, setHeightScale,
  selectedSiteId, selectSite
}: FabPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'candidates' | 'world' | 'settings'>('candidates');
  const popoverRef = useRef<HTMLDivElement>(null);
  
  const sites = useSiteStore(state => state.sites);
  const setWorldExampleFocus = useSiteStore(state => state.setWorldExampleFocus);
  const { showPowerGrid, setShowPowerGrid, powerGridConfig, updatePowerGridVoltage, updatePowerGridElement } = useSettingsStore();

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, action: () => void) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    action();
  };

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="fab-container" ref={popoverRef}>
      <button
        type="button"
        className={`fab-main ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Menüyü Kapat' : 'Menüyü Aç'}
        aria-expanded={isOpen}
        title="Menüyü Aç"
      >
        {isOpen ? <X size={24} /> : <Zap size={24} />}
      </button>

      {isOpen && (
        <div className="fab-popover">
          <div className="fab-tabs" role="tablist" aria-label="Harita hızlı menüsü">
            <button 
              type="button"
              role="tab"
              id="fab-tab-candidates"
              aria-selected={activeTab === 'candidates'}
              aria-controls="fab-panel-candidates"
              className={`fab-tab ${activeTab === 'candidates' ? 'active' : ''}`}
              onClick={() => setActiveTab('candidates')}
            >
              <List size={16} /> <span className="fab-tab-label">Adaylar</span>
            </button>
            <button 
              type="button"
              role="tab"
              id="fab-tab-world"
              aria-selected={activeTab === 'world'}
              aria-controls="fab-panel-world"
              className={`fab-tab ${activeTab === 'world' ? 'active' : ''}`}
              onClick={() => setActiveTab('world')}
            >
              <Globe size={16} /> Dünya Örnekleri
            </button>
            <button 
              type="button"
              role="tab"
              id="fab-tab-settings"
              aria-selected={activeTab === 'settings'}
              aria-controls="fab-panel-settings"
              className={`fab-tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={16} /> <span className="fab-tab-label">Ayarlar</span>
            </button>
          </div>

          <div className="fab-content">
            {activeTab === 'candidates' && (
              <div id="fab-panel-candidates" className="fab-list-wrapper" role="tabpanel" aria-labelledby="fab-tab-candidates">
                <div className="fab-table-head" aria-hidden="true" style={{ gridTemplateColumns: TABLE_GRID_COLUMNS }}>
                  {CANDIDATE_COLUMNS.map((column) => <span key={column} className="fab-table-head-cell">{column}</span>)}
                </div>
                <div className="fab-table-scroll">
                  <table className="fab-table" aria-label="PDHES adayları">
                    <colgroup>
                      <col style={{ width: '60%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '20%' }} />
                    </colgroup>
                    <thead className="visually-hidden">
                      <tr>
                        {CANDIDATE_COLUMNS.map((column) => <th key={column}>{column}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {[...sites].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map(site => {
                        return (
                        <tr
                          key={site.id}
                          className={selectedSiteId === site.id ? 'active-row' : ''}
                          tabIndex={0}
                          aria-current={selectedSiteId === site.id ? 'true' : undefined}
                          onClick={() => {
                            selectSite(site.id);
                          }}
                          onKeyDown={(event) => handleRowKeyDown(event, () => selectSite(site.id))}
                        >
                          <td>{site.name.replace(/^KAMU[-\s_]?/i, '').replace(/PSPP/g, 'PDHES')}</td>
                          <td><div>{num(site.excelCalculated?.capacityMw ?? site.capacityMW)} MW</div><div className="fab-subvalue">{site.excelCalculated?.energyMwh ? num(site.excelCalculated.energyMwh / 1000, 1) + ' GWh' : (site.energyGWh ? num(site.energyGWh, 1) + ' GWh' : 'Belirtilmedi')}</div></td>
                          <td><div>{num(site.excelCalculated?.grossHeadM ?? site.headM, 1)} m</div><div className="fab-subvalue">{num(site.tunnelLengthKm, 1)} km</div></td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'world' && (
              <div id="fab-panel-world" className="fab-list-wrapper" role="tabpanel" aria-labelledby="fab-tab-world">
                <div className="fab-table-head" aria-hidden="true" style={{ gridTemplateColumns: TABLE_GRID_COLUMNS }}>
                  {WORLD_COLUMNS.map((column) => <span key={column} className="fab-table-head-cell">{column}</span>)}
                </div>
                <div className="fab-table-scroll">
                  <table className="fab-table" aria-label="Dünya PDHES örnekleri">
                    <colgroup>
                      <col style={{ width: '60%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '20%' }} />
                    </colgroup>
                    <thead className="visually-hidden">
                      <tr>
                        {WORLD_COLUMNS.map((column) => <th key={column}>{column}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {WORLD_EXAMPLES_DETAILED.map(ex => (
                        <tr
                          key={ex.id}
                          onClick={() => setWorldExampleFocus(ex.id)}
                          onKeyDown={(event) => handleRowKeyDown(event, () => setWorldExampleFocus(ex.id))}
                          tabIndex={0}
                          className="hoverable-row"
                        >
                          <td>{ex.name} <span className="fab-country">({ex.country})</span></td>
                          <td><div>{ex.capacityMw} MW</div><div className="fab-subvalue">{ex.storageMwh && ex.storageMwh !== '-' ? ex.storageMwh + ' MWh' : '-'}</div></td>
                          <td><div>{ex.headM && ex.headM !== '-' ? `${ex.headM} m` : '-'}</div><div className="fab-subvalue">{ex.efficiency || '-'}</div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div id="fab-panel-settings" className="fab-settings" role="tabpanel" aria-labelledby="fab-tab-settings">
                <div className="setting-group">
                  <h4>Harita Altlığı</h4>
                  <div className="map-style-picker" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <select 
                      value={mapStyle} 
                      onChange={(e) => setMapStyle(e.target.value as MapStyleKind)}
                      style={{ padding: '8px', borderRadius: '6px', background: 'var(--panel2)', color: 'var(--text)', border: '1px solid var(--line2)', cursor: 'pointer' }}
                    >
                      {(Object.keys(MAP_PROVIDERS) as MapStyleKind[]).map(style => (
                        <option key={style} value={style}>
                          {MAP_PROVIDERS[style].name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="setting-group">
                  <h4>3D Modu</h4>
                  <div className="segmented-control" role="group" aria-label="Harita boyutu">
                    <button
                      className={`segment-btn ${!terrain3d ? 'active' : ''}`}
                      onClick={() => setTerrain3d(false)}
                    >
                      2D Düz
                    </button>
                    <button
                      className={`segment-btn ${terrain3d ? 'active' : ''}`}
                      onClick={() => setTerrain3d(true)}
                    >
                      3D Arazi
                    </button>
                  </div>
                </div>

                {terrain3d && (
                  <div className="setting-group">
                    <h4>3D Kalitesi (Engebe)</h4>
                    <div className="quality-options" role="group" aria-label="3D arazi kalitesi">
                      {[
                        { label: 'Düşük', val: 1.0 },
                        { label: 'Orta', val: 1.1 },
                        { label: 'Yüksek', val: 2.2 },
                        { label: 'Ekstrem', val: 3.0 }
                      ].map(opt => (
                        <button
                          key={opt.val}
                          className={`quality-btn ${Math.abs(heightScale - opt.val) < 0.1 ? 'active' : ''}`}
                          onClick={() => setHeightScale(opt.val)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="setting-group" style={{ marginBottom: 12, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <h3 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Zap size={16} /> Şebeke (OSM Power Grid)</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input 
                      type="checkbox" 
                      id="pg-master-toggle" 
                      checked={showPowerGrid} 
                      onChange={(e) => setShowPowerGrid(e.target.checked)} 
                    />
                    <label htmlFor="pg-master-toggle" style={{ fontWeight: 'bold', margin: 0 }}>Şebeke Katmanını Göster</label>
                  </div>
                </div>

                <div className="setting-group" style={{ opacity: showPowerGrid ? 1 : 0.5, pointerEvents: showPowerGrid ? 'auto' : 'none' }}>
                  <h4 style={{ marginBottom: 12 }}>Gerilim Grupları Renk ve Kalınlık</h4>
                  
                  {[
                    { key: 'under33', label: '33 kV altı' },
                    { key: 'v33', label: '33 kV' },
                    { key: 'v154', label: '154 kV' },
                    { key: 'v400', label: '400 kV' },
                    { key: 'over500', label: '500 kV üstü' },
                    { key: 'unknown', label: 'Bilinmeyen kV' },
                    { key: 'external', label: 'Harici Katmanlar' },
                  ].map(({ key, label }) => {
                    const k = key as VoltageGroup;
                    const val = powerGridConfig.voltages[k];
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 12, height: 12, backgroundColor: val.color }} />
                        <span style={{ fontSize: 13, flex: 1 }}>{label}</span>
                        <input 
                          type="color" 
                          value={val.color} 
                          onChange={(e) => updatePowerGridVoltage(k, { color: e.target.value })}
                          style={{ width: 32, height: 24, padding: 0, border: '1px solid var(--border)' }}
                        />
                        <input 
                          type="number" 
                          min={0.5} max={10} step={0.5}
                          value={val.width} 
                          onChange={(e) => updatePowerGridVoltage(k, { width: parseFloat(e.target.value) || 1 })}
                          style={{ width: 48, fontSize: 13, padding: '2px 4px', border: '1px solid var(--border)', borderRadius: 4 }}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="setting-group" style={{ opacity: showPowerGrid ? 1 : 0.5, pointerEvents: showPowerGrid ? 'auto' : 'none', marginTop: 16 }}>
                  <h4 style={{ marginBottom: 12 }}>Eleman Grubu Stilleri</h4>
                  
                  {[
                    { key: 'lines', label: 'Hatlar', props: ['line', 'size'] },
                    { key: 'cables', label: 'Kablolar', props: ['line', 'size'] },
                    { key: 'substation', label: 'Trafo Merkezi', props: ['size'] },
                    { key: 'plant', label: 'Santraller', props: ['size'] },
                    { key: 'substationInner', label: 'Trafo Merkezi (İçi)', props: ['size'] },
                  ].map(({ key, label, props }) => {
                    const k = key as ElementGroup;
                    const val = powerGridConfig.elements[k];
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                        <input 
                          type="checkbox" 
                          checked={val.show} 
                          onChange={(e) => updatePowerGridElement(k, { show: e.target.checked })}
                        />
                        <span style={{ fontSize: 13, flex: 1 }}>{label}</span>
                        
                        {props.includes('line') && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Çizgi</span>
                            <input 
                              type="number" 
                              min={0.5} max={10} step={0.5}
                              value={val.line} 
                              onChange={(e) => updatePowerGridElement(k, { line: parseFloat(e.target.value) || 1 })}
                              style={{ width: 42, fontSize: 13, padding: '2px 4px', border: '1px solid var(--border)', borderRadius: 4 }}
                            />
                          </div>
                        )}
                        
                        {props.includes('size') && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Boyut</span>
                            <input 
                              type="number" 
                              min={0.1} max={5} step={0.1}
                              value={val.size} 
                              onChange={(e) => updatePowerGridElement(k, { size: parseFloat(e.target.value) || 0.1 })}
                              style={{ width: 42, fontSize: 13, padding: '2px 4px', border: '1px solid var(--border)', borderRadius: 4 }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
