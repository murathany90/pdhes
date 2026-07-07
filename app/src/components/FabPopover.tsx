import { useState, useEffect, useRef } from 'react';
import { Zap, X, Settings, Globe, List } from 'lucide-react';
import { useSiteStore } from '../stores/useSiteStore';
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
          </div>

          <div className="fab-content">
            {activeTab === 'candidates' && (
              <div className="fab-list-wrapper">
                <table className="fab-table">
                  <thead>
                    <tr>
                      <th>Aday Adı</th>
                      <th>Kurulu Güç</th>
                      <th>Düşü</th>
                      <th>Depolama</th>
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
                        <td>{num(site.powerMW)} MW</td>
                        <td>{num(site.head, 1)} m</td>
                        <td>{site.energyGWh * 1000} MWh</td>
                        <td>{site.score.toFixed(1)}</td>
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
                      <th>Kurulu Güç</th>
                      <th>Düşü</th>
                      <th>Depolama</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WORLD_EXAMPLES.map(ex => (
                      <tr key={ex.id}>
                        <td>{ex.name}</td>
                        <td>{num(ex.capacityMw)} MW</td>
                        <td>{ex.headM ? `${num(ex.headM)} m` : '-'}</td>
                        <td>{ex.storageMwh ? `${num(ex.storageMwh)} MWh` : '-'}</td>
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
          </div>
        </div>
      )}
    </div>
  );
}
