import { useState } from 'react';
import { useSiteStore } from '../stores/useSiteStore';
import { COMPONENTS } from '../utils/constants';
import LayerToggle from '../components/ui/LayerToggle';
import ScenarioSlider from '../components/ui/ScenarioSlider';
import ThreeDModel from '../components/ui/ThreeDModel';

export default function ThreeDPage({ site: propSite }: { site?: any }) {
  const { sites, selectedId } = useSiteStore();
  const site = propSite || sites.find((item) => item.id === selectedId);

  const [layers, setLayers] = useState<Record<string, boolean>>({
    upper_reservoir: true,
    lower_reservoir: true,
    powerhouse: true,
    tunnel: true,
    surge_tank: true,
    switchyard: true,
  });

  const [activeComponent, setActiveComponent] = useState('upper_reservoir');
  const [mode, setMode] = useState<'generate' | 'pump'>('generate');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const maxUnits = site?.components_detail?.powerhouse?.units || 4;
  const [activeUnits, setActiveUnits] = useState(maxUnits);

  const [showTerrain, setShowTerrain] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [terrainOpacity, setTerrainOpacity] = useState(70);

  if (!site) return <section className="panel active"><p className="muted">Veri yükleniyor...</p></section>;

  return (
    <section className="panel active no-pad" style={{ height: '100%', overflow: 'hidden' }}>
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
              className={`btn ${mode === 'generate' ? 'primary' : 'ghost'}`}
              style={{ flex: 1, minHeight: 36, fontSize: 13 }}
              onClick={() => setMode('generate')}
            >
              ⚡ Üretim Modu
            </button>
            <button
              className={`btn ${mode === 'pump' ? 'primary' : 'ghost'}`}
              style={{ flex: 1, minHeight: 36, fontSize: 13 }}
              onClick={() => setMode('pump')}
            >
              💧 Pompalama Modu
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
             <button
              className={`btn ${isPlaying ? 'primary' : 'ghost'}`}
              style={{ flex: 1, minHeight: 36, fontSize: 13, background: isPlaying ? '#ef4444' : undefined, borderColor: isPlaying ? '#ef4444' : undefined }}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? '⏹ Simülasyonu Durdur' : '▶️ Simülasyonu Başlat'}
            </button>
          </div>
          
          <h3 style={{ marginBottom: 12 }}>Aktif Üniteler ({activeUnits}/{maxUnits})</h3>
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, flexWrap: 'wrap' }}>
            {Array.from({ length: maxUnits }).map((_, i) => (
               <button
                key={i}
                className={`btn ${i < activeUnits ? 'primary' : 'ghost'}`}
                style={{ padding: '4px 12px', minHeight: 32, fontSize: 13, flex: 1 }}
                onClick={() => setActiveUnits(i + 1)}
              >
                Ünite {i + 1}
              </button>
            ))}
          </div>

          <h3 style={{ marginBottom: 12 }}>Katman Görünürlüğü</h3>
          <div style={{ marginBottom: 24 }}>
            <LayerToggle 
              label="⛰️ 3D Arazi (Terrain)" 
              color="#4c6b45"
              active={showTerrain} 
              onChange={setShowTerrain} 
            />
            <LayerToggle 
              label="🏷️ İsim Etiketleri" 
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
            {Object.entries((site.components_detail as any)[activeComponent] || {}).map(([k, v]) => (
              <p key={k} style={{ marginBottom: 8, fontSize: 14 }}>
                <b style={{ color: 'var(--text)' }}>{k.replace(/_/g, ' ').toUpperCase()}:</b>{' '}
                <span className="muted">{String(v)}</span>
              </p>
            ))}
            {Object.keys((site.components_detail as any)[activeComponent] || {}).length === 0 && (
              <p className="muted" style={{ fontSize: 13 }}>Bu bileşen için detay verisi bulunmuyor.</p>
            )}
          </div>

          <h3 style={{ marginTop: 16, marginBottom: 12 }}>Güven Etiketi</h3>
          <div className="notice">
            Konsept güveni: <b>{site.confidence}</b><br />
            Konum doğruluğu: <b>{site.locationConfidence}</b><br />
            Son doğrulama: <b>{site.verifiedAt}</b>
          </div>

        </div>
      </div>
    </section>
  );
}
