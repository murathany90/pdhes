import { useRef, useState, useEffect } from 'react';
import { MapPin, Mountain, AlertTriangle, Droplets, Zap, Activity, Waypoints, Box, Layers } from 'lucide-react';
import { useMapLibre, type MapLayerVisibility } from '../hooks/useMapLibre';
import { FabPopover } from '../components/FabPopover';
import { ElevationProfile } from '../components/ElevationProfile';
import { useSiteStore } from '../stores/useSiteStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { COMPONENTS } from '../utils/constants';
import { WORLD_EXAMPLES } from '../data/worldExamples';
import { num, moneyBn, moneyM } from '../utils/format';

const DEFAULT_LAYERS: MapLayerVisibility = {
  candidates: true,
  projectLayout: true,
  risk: true,
  waterPath: true,
  gridConnection: true,
  grid400: true,
  grid154: false,
  substations: true,
  terrain3d: true,
};

const LAYER_LABELS: Array<{ key: keyof MapLayerVisibility; label: string; Icon: any }> = [
  { key: 'candidates', label: 'Sahalar', Icon: MapPin },
  { key: 'projectLayout', label: 'Yerleşim', Icon: Mountain },
  { key: 'terrain3d', label: '3D Arazi', Icon: Layers },
  { key: 'risk', label: 'Risk Alanı', Icon: AlertTriangle },
  { key: 'waterPath', label: 'Su Yolu', Icon: Droplets },
  { key: 'gridConnection', label: 'Bağlantı', Icon: Waypoints },
  { key: 'grid400', label: '400 kV', Icon: Zap },
  { key: 'grid154', label: '154 kV', Icon: Activity },
  { key: 'substations', label: 'Trafolar', Icon: Box },
];

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { sites, selectedId, selectSite, gridAssets, fetchGridAssets, worldExampleFocusId, clearWorldExampleFocus } = useSiteStore();
  const { mapStyle, setMapStyle, heightScale, setHeightScale } = useSettingsStore();
    const [rightCollapsed, setRightCollapsed] = useState(false);
  const [layers, setLayers] = useState<MapLayerVisibility>(DEFAULT_LAYERS);
  const site = sites.find((item) => item.id === selectedId) || sites[0];

  useEffect(() => {
    fetchGridAssets();
  }, [fetchGridAssets]);

  const { mapRef } = useMapLibre({
    containerRef: mapContainer,
    site,
    sites,
    selectedId,
    mapStyle,
    heightScale,
    gridAssets,
    layers,
    onSelectSite: selectSite,
  });

  useEffect(() => {
    if (worldExampleFocusId && mapRef.current) {
      const example = WORLD_EXAMPLES.find((e) => e.id === worldExampleFocusId);
      if (example) {
        mapRef.current.flyTo({
          center: [example.lon, example.lat],
          zoom: 8,
          pitch: 0,
          bearing: 0,
          duration: 1500,
        });
        
        // Wait for flyTo to start and then trigger the click event on the marker to open the popup
        setTimeout(() => {
          const markerEl = document.getElementById(`we-marker-${example.id}`);
          if (markerEl && (markerEl as any)._popup) {
            const popup = (markerEl as any)._popup;
            if (!popup.isOpen()) {
              popup.addTo(mapRef.current);
            }
          }
        }, 300);
      }
      clearWorldExampleFocus();
    }
  }, [worldExampleFocusId, mapRef, clearWorldExampleFocus]);

  if (!site) return <section className="panel active"><p className="muted">Veri yükleniyor...</p></section>;

  const layoutCls = `map-layout ${rightCollapsed ? 'collapsed-right' : ''}`;

  return (
    <section className="panel active no-pad">
      <div className={layoutCls}>
        

        <div className="map-stage">
          <div ref={mapContainer} style={{ position: 'absolute', inset: 0 }} />

          <FabPopover 
            mapStyle={mapStyle} 
            setMapStyle={setMapStyle} 
            terrain3d={layers.terrain3d} 
            setTerrain3d={(val) => setLayers(c => ({...c, terrain3d: val}))} 
            heightScale={heightScale} 
            setHeightScale={setHeightScale} 
            selectedSiteId={selectedId} 
            selectSite={selectSite} 
          />

          <button
            type="button"
            className="btn minimalist-3d-toggle"
            onClick={() => setLayers(c => ({...c, terrain3d: !c.terrain3d}))}
            title={layers.terrain3d ? "2D Görünüme Geç" : "3D Araziye Geç"}
          >
            <Layers size={18} />
            <b>{layers.terrain3d ? "3D" : "2D"}</b>
          </button>


          {rightCollapsed && (
            <button
              type="button"
              className="btn ghost floating-toggle right"
              aria-label="Kapasite özeti panelini aç"
              title="Kapasite özeti panelini aç"
              onClick={() => setRightCollapsed(false)}
            >
              ‹
            </button>
          )}
        </div>

        <aside className="map-right" aria-label="Kapasite özeti">
          <button
            type="button"
            className="btn ghost panel-toggle"
            aria-label="Kapasite özeti panelini kapat"
            title="Kapasite özeti panelini kapat"
            onClick={() => setRightCollapsed(true)}
          >
            ›
          </button>
          <h2 style={{ marginTop: 0 }}>Kavramsal kapasite özeti</h2>
          <div className="grid" style={{ gap: 6 }}>
            <div className="metric good"><span>Kapasite</span><b>{num(site.powerMW)} MW / {site.energyGWh} GWh</b></div>
            <div className="metric info"><span>Düşü / su yolu</span><b>{num(site.head, 1)} m / {site.tunnelKm} km</b></div>
            <div className="metric warn"><span>Yatırım gideri</span><b>{moneyBn(site.capexBn)}</b></div>
            <div className="metric"><span>Gelir / geri ödeme</span><b>{moneyM(site.revenueM)} / {site.payback} yıl</b></div>
          </div>

          
          <ElevationProfile site={site} />

          <h3 style={{ marginTop: 16 }}>Harita katmanları</h3>
          <div className="layer-grid">
            {LAYER_LABELS.map(({ key, label, Icon }) => (
              <button
                type="button"
                key={key}
                className={`layer-btn ${layers[key] ? 'active' : ''}`}
                onClick={() => setLayers((current) => ({ ...current, [key]: !current[key] }))}
                aria-label={label}
                aria-pressed={layers[key]}
              >
                <Icon size={14} aria-hidden="true" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <h3 style={{ marginTop: 16 }}>Proje zaman çizelgesi</h3>
          <div className="timeline">
            {site.timeline.map((event, index) => (
              <div className="tl" key={`${event.date}-${index}`}>
                <time>{event.date}</time>
                <b style={{ display: 'block', marginTop: 3 }}>{event.title}</b>
                <p>{event.text}</p>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: 16 }}>Yerleşim bileşenleri</h3>
          <div className="legend">
            {COMPONENTS.map((component) => (
              <span className="tag" key={component.key}>
                <i className="sw" style={{ background: component.color }} />
                {component.label}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
