import { useState, useEffect, useRef } from 'react';
import { Zap, X, Settings, Globe, List } from 'lucide-react';
import { useSiteStore } from '../stores/useSiteStore';
import { useSettingsStore, type VoltageGroup, type ElementGroup } from '../stores/useSettingsStore';
import { WORLD_EXAMPLES } from '../data/worldExamples';
import { num } from '../utils/format';
import type { MapStyleKind } from '../utils/mapProviders';

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
        className={`fab-main ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Menüyü Aç"
      >
        {isOpen ? <X size={24} /> : <Zap size={24} />}
      </button>

      {isOpen && (
        <div className="fab-popover">
          <div className="fab-tabs">
            <button 
              className={`fab-tab ${activeTab === 'candidates' ? 'active' : ''}`}
              onClick={() => setActiveTab('candidates')}
            >
              <List size={16} /> Adaylar
            </button>
            <button 
              className={`fab-tab ${activeTab === 'world' ? 'active' : ''}`}
              onClick={() => setActiveTab('world')}
            >
              <Globe size={16} /> Dünya Örnekleri
            </button>
            <button 
              className={`fab-tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={16} /> Ayarlar
            </button>
            <button 
              className={`fab-tab ${activeTab === 'grid' ? 'active' : ''}`}
              onClick={() => setActiveTab('grid')}
            >
              <Zap size={16} /> Şebeke
            </button>
          </div>

          <div className="fab-content">
            {activeTab === 'candidates' && (
              <div className="fab-list-wrapper">
                <table className="fab-table">
                  <thead>
                    <tr>
                      <th>Aday Adı</th>
                      <th>Güç / Enerji</th>
                      <th>Düşü / Su Yolu</th>
                      <th>Puan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sites.slice(0, 20).map(site => (
                      <tr 
                        key={site.id} 
                        className={selectedSiteId === site.id ? 'active-row' : ''}
                        onClick={() => {
                          selectSite(site.id);
                        }}
                      >
                        <td>{site.name.replace(/PSPP/g, 'PDHES')}</td>
                        <td><div>{num(site.capacityMW)} MW</div><div style={{fontSize: '0.85em', color: 'var(--muted)'}}>{site.energyGWh ?? 'Belirtilmedi'} GWh</div></td>
                        <td><div>{num(site.headM, 1)} m</div><div style={{fontSize: '0.85em', color: 'var(--muted)'}}>{num(site.tunnelLengthKm, 1)} km</div></td>
                        <td>{site.score === null || site.score === undefined ? '-' : site.score.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'world' && (
              <div className="fab-list-wrapper">
                <table className="fab-table">
                  <thead>
                    <tr>
                      <th>Tesis Adı</th>
                      <th>Güç / Enerji</th>
                      <th>Düşü / Su Yolu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WORLD_EXAMPLES.map(ex => (
                      <tr key={ex.id} onClick={() => setWorldExampleFocus(ex.id)} style={{ cursor: 'pointer' }} className="hoverable-row">
                        <td>{ex.name}</td>
                        <td><div>{num(ex.capacityMw)} MW</div><div style={{fontSize: '0.85em', color: 'var(--muted)'}}>{ex.storageMwh ? num(ex.storageMwh) + ' MWh' : '-'}</div></td>
                        <td><div>{ex.headM ? `${num(ex.headM)} m` : '-'}</div><div style={{fontSize: '0.85em', color: 'var(--muted)'}}>-</div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="fab-settings">
                <div className="setting-group">
                  <h4>Harita Altlığı</h4>
                  <div className="map-style-picker">
                    {(['satellite', 'light', 'dark'] as MapStyleKind[]).map(style => (
                      <button 
                        key={style}
                        className={`style-btn ${mapStyle === style ? 'active' : ''}`}
                        onClick={() => setMapStyle(style)}
                      >
                        {style === 'satellite' ? 'Uydu' : style === 'light' ? 'Açık' : 'Koyu'}
                      </button>
                    ))}
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
                        { label: 'Orta', val: 1.3 },
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
              </div>
            )}

            {activeTab === 'grid' && (
              <div className="fab-settings">
                <div className="setting-group" style={{ marginBottom: 12 }}>
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
