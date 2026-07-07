import { useState, useEffect, useMemo } from 'react';
import { Droplets, Mountain, Play, Square, Tag, Zap } from 'lucide-react';
import { useSiteStore } from '../stores/useSiteStore';
import { COMPONENTS } from '../utils/constants';
import type { Site } from '../types/site';
import LayerToggle from '../components/ui/LayerToggle';
import ScenarioSlider from '../components/ui/ScenarioSlider';
import ThreeDModel from '../components/ui/ThreeDModel';
import WarningBanner from '../components/ui/WarningBanner';

export default function ThreeDPage({ site: propSite }: { site?: Site }) {
  const { sites, selectedId } = useSiteStore();
  const site = propSite || sites.find((item) => item.id === selectedId);

  const initialLayers = useMemo(() => {
    return COMPONENTS.reduce((acc, c) => ({ ...acc, [c.key]: true }), {});
  }, []);

  const [layers, setLayers] = useState<Record<string, boolean>>(initialLayers);

  const [activeComponent, setActiveComponent] = useState('upper_reservoir');
  const [mode, setMode] = useState<'generate' | 'pump'>('generate');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const maxUnits = site?.components_detail?.powerhouse?.units || 4;
  const [activeUnits, setActiveUnits] = useState(maxUnits);

  // Reset state when site changes
  useEffect(() => {
    if (site) {
      setActiveComponent('upper_reservoir');
      setMode('generate');
      setIsPlaying(false);
      setActiveUnits(site?.components_detail?.powerhouse?.units || 4);
    }
  }, [site?.id]);

  const [showTerrain, setShowTerrain] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [terrainOpacity, setTerrainOpacity] = useState(70);

  if (!site) return <section className="panel active"><p className="muted">Veri yükleniyor...</p></section>;

  return (
    <section className="panel active no-pad threed-page">
      <div className="threed-layout">
        
        <div className="threed-left" style={{ padding: 0 }}>
          <ThreeDModel
            siteId={site.id}
            activeComponent={activeComponent}
            onSelectComponent={setActiveComponent}
            layers={layers}
            mode={mode}
            componentsDetail={site.components_detail}
            isPlaying={isPlaying}
            activeUnits={activeUnits}
            maxUnits={maxUnits}
            showTerrain={showTerrain}
            showLabels={showLabels}
            terrainOpacity={terrainOpacity / 100}
          />
        </div>

        {/* Sağ Panel: Kontroller */}
        <div className="threed-right">
          <h2 style={{ marginBottom: 4 }}>Kavramsal Tesis Yerleşimi</h2>
          <p className="muted" style={{ marginBottom: 24 }}>Seçili saha: <b>{site.name}</b></p>

          {/* Mode Toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button
              type="button"
              className={`btn ${mode === 'generate' ? 'primary' : 'ghost'}`}
              aria-pressed={mode === 'generate'}
              style={{ flex: 1, minHeight: 36, fontSize: 13 }}
              onClick={() => setMode('generate')}
            >
              <Zap size={16} aria-hidden="true" />
              Üretim modu
            </button>
            <button
              type="button"
              className={`btn ${mode === 'pump' ? 'primary' : 'ghost'}`}
              aria-pressed={mode === 'pump'}
              style={{ flex: 1, minHeight: 36, fontSize: 13 }}
              onClick={() => setMode('pump')}
            >
              <Droplets size={16} aria-hidden="true" />
              Pompalama modu
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
             <button
              type="button"
              className={`btn ${isPlaying ? 'danger-solid' : 'ghost'}`}
              aria-pressed={isPlaying}
              style={{ flex: 1, minHeight: 36, fontSize: 13 }}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Square size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
              {isPlaying ? 'Simülasyonu durdur' : 'Simülasyonu başlat'}
            </button>
          </div>
          
          <h3 style={{ marginBottom: 12 }}>Aktif Üniteler ({activeUnits}/{maxUnits})</h3>
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, flexWrap: 'wrap' }}>
            {Array.from({ length: maxUnits }).map((_, i) => (
               <button
                type="button"
                key={i}
                className={`btn ${i < activeUnits ? 'primary' : 'ghost'}`}
                aria-pressed={i < activeUnits}
                style={{ padding: '4px 12px', minHeight: 32, fontSize: 13, flex: 1 }}
                onClick={() => setActiveUnits(i + 1)}
              >
                Ünite {i + 1}
              </button>
            ))}
          </div>

          <h3 style={{ marginBottom: 12 }}>Katman Görünürlüğü</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button type="button" className="btn ghost" style={{ flex: 1, padding: '4px', fontSize: 12 }} onClick={() => setLayers(COMPONENTS.reduce((acc, c) => ({ ...acc, [c.key]: true }), {}))}>
              Tümünü Aç
            </button>
            <button type="button" className="btn ghost" style={{ flex: 1, padding: '4px', fontSize: 12 }} onClick={() => setLayers(COMPONENTS.reduce((acc, c) => ({ ...acc, [c.key]: false }), {}))}>
              Tümünü Kapat
            </button>
          </div>
          <div style={{ marginBottom: 24 }}>
            <LayerToggle 
              label={<><Mountain size={16} aria-hidden="true" /> 3D Arazi (Terrain)</>}
              color="#4c6b45"
              active={showTerrain} 
              onChange={setShowTerrain} 
            />
            <LayerToggle 
              label={<><Tag size={16} aria-hidden="true" /> İsim Etiketleri</>}
              color="#aaaaaa"
              active={showLabels} 
              onChange={setShowLabels} 
            />
            <div style={{ height: 8 }} />
            {COMPONENTS.map(c => (
              <LayerToggle 
                key={c.key} 
                label={c.label} 
                color={c.color}
                active={!!layers[c.key]} 
                onChange={(v) => setLayers(prev => ({...prev, [c.key]: v}))} 
              />
            ))}
          </div>

          <h3 style={{ marginBottom: 12 }}>Arazi Görünümü</h3>
          <div className="card" style={{ padding: 16, marginBottom: 24 }}>
            <ScenarioSlider 
              label="Arazi Şeffaflığı" 
              value={terrainOpacity} 
              min={0} max={100} step={5} unit="%" 
              onChange={setTerrainOpacity} 
            />
          </div>

          <h3 style={{ marginBottom: 12 }}>
            Bileşen Detayları: {COMPONENTS.find(c => c.key === activeComponent)?.label || activeComponent}
          </h3>
          <div className="card" style={{ padding: 16, marginBottom: 24 }}>
            {/* Generic description from constants */}
            <p style={{ fontSize: 13, color: 'var(--text)', marginBottom: 16, lineHeight: 1.5 }}>
              {COMPONENTS.find(c => c.key === activeComponent)?.description || 'Kavramsal yerleşim bileşeni.'}
            </p>

            {/* Dynamic data from site details */}
            {Object.entries((site.components_detail as any)[activeComponent] || {}).map(([k, v]) => (
              <p key={k} style={{ marginBottom: 8, fontSize: 14 }}>
                <b style={{ color: 'var(--text)' }}>{k.replace(/_/g, ' ').toUpperCase()}:</b>{' '}
                <span className="muted">{String(v)}</span>
              </p>
            ))}
            
            <div style={{ marginTop: 16 }}>
              <WarningBanner type="danger" message="Bu değerler ve 3D konumlar temsilidir." />
            </div>
          </div>

          <h3 style={{ marginTop: 16, marginBottom: 12 }}>Fare (Mouse) Kontrolleri</h3>
          <div className="card" style={{ padding: 16, backgroundColor: 'var(--surface-sunken)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--text)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <b style={{ minWidth: 120 }}>Sol Tık + Sürükle:</b> <span>Kamerayı Döndür</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <b style={{ minWidth: 120 }}>Sağ Tık + Sürükle:</b> <span>Modeli Kaydır (Pan)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <b style={{ minWidth: 120 }}>Tekerlek (Scroll):</b> <span>Yakınlaş / Uzaklaş</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
