import { useRef, useState, useEffect } from 'react';
import { MapPin, Mountain, AlertTriangle, Droplets, Zap, Activity, Waypoints, Box, Layers } from 'lucide-react';
import { useMapLibre, type MapLayerVisibility } from '../hooks/useMapLibre';
import { FabPopover } from '../components/FabPopover';
import InfoAccordion from '../components/ui/InfoAccordion';
import { ElevationProfile } from '../components/ElevationProfile';
import MapContextMenu from '../components/MapContextMenu';
import MeasurementUI from '../components/MeasurementUI';
import ManualGeometryLayer from '../components/ManualGeometryLayer';
import { useSiteStore } from '../stores/useSiteStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { WORLD_EXAMPLES_DETAILED } from '../data/worldExamplesDetailed';
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
  const { mapStyle, setMapStyle, heightScale, setHeightScale, showPowerGrid, setShowPowerGrid } = useSettingsStore();
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [layers, setLayers] = useState<MapLayerVisibility>(DEFAULT_LAYERS);
  const [imageModalSiteId, setImageModalSiteId] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const site = sites.find((item) => item.id === selectedId) || sites[0];
  const worldExample = worldExampleFocusId ? WORLD_EXAMPLES_DETAILED.find((e) => e.id === worldExampleFocusId) : null;

  useEffect(() => {
    const handleShowImage = (e: any) => {
      setImageModalSiteId(e.detail);
      setImageLoadError(false);
    };
    window.addEventListener('show-3d-image', handleShowImage);
    return () => window.removeEventListener('show-3d-image', handleShowImage);
  }, []);

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
    onSelectSite: (id) => {
      selectSite(id);
      clearWorldExampleFocus();
    },
  });

  useEffect(() => {
    if (worldExampleFocusId && mapRef.current) {
      const example = WORLD_EXAMPLES_DETAILED.find((e) => e.id === worldExampleFocusId);
      if (example) {
        mapRef.current.flyTo({
          center: [example.lon || 0, example.lat || 0],
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
    }
  }, [worldExampleFocusId, mapRef]);

  if (!site) return <section className="panel active"><p className="muted">Veri yükleniyor...</p></section>;

  const layoutCls = `map-layout ${rightCollapsed ? 'collapsed-right' : ''}`;

  return (
    <section className="panel active no-pad">
      <div className={layoutCls}>
        
        {imageModalSiteId && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: '#1e293b', padding: 20, borderRadius: 8, maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto', position: 'relative' }}>
              <button onClick={() => setImageModalSiteId(null)} style={{ position: 'absolute', top: 10, right: 10, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
              <h2 style={{ marginTop: 0, marginBottom: 16 }}>3D Tesis Görseli</h2>
              {imageLoadError ? (
                <div style={{ padding: 40, textAlign: 'center', background: '#334155', borderRadius: 6 }}>
                  <p style={{ margin: 0, color: '#f87171', fontWeight: 'bold', fontSize: 18 }}>Şimdilik görsel yok</p>
                  <p style={{ marginTop: 8, color: '#cbd5e1' }}>Bu saha için henüz statik 3D görsel eklenmemiştir. (docs/pdhes_taslaklar/)</p>
                </div>
              ) : (
                <img 
                  src={imageModalSiteId === 'kamu-gokcekaya-pspp' ? 'pdhes_taslaklar/01-Gokcekaya_PDHES_taslak1.png' : `pdhes_taslaklar/${imageModalSiteId}.png`} 
                  alt="3D Tesis Görseli" 
                  style={{ maxWidth: '100%', maxHeight: 'calc(90vh - 100px)', display: 'block', borderRadius: 4 }}
                  onError={() => setImageLoadError(true)} 
                />
              )}
            </div>
          </div>
        )}

        <div className="map-stage">
          <div ref={mapContainer} style={{ position: 'absolute', inset: 0 }} />

          <MapContextMenu />
          <MeasurementUI />
          <ManualGeometryLayer map={mapRef.current} siteId={site.id} />

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
          <button
            type="button"
            className="btn minimalist-3d-toggle"
            style={{ top: '74px' }}
            onClick={() => {
              if (mapRef.current) {
                mapRef.current.flyTo({
                  center: [35, 39],
                  zoom: 5,
                  pitch: 0,
                  bearing: 0,
                  duration: 1500
                });
              }
            }}
            title="Tümünü Göster"
          >
            <MapPin size={18} />
            <b>Tümü</b>
          </button>

          <button
            type="button"
            className="btn minimalist-3d-toggle"
            style={{ 
              top: '116px', 
              background: showPowerGrid ? 'var(--bg-primary, #0f172a)' : undefined, 
              color: showPowerGrid ? 'var(--text-inverted, #fff)' : undefined 
            }}
            onClick={() => setShowPowerGrid(!showPowerGrid)}
            title={showPowerGrid ? "Elektrik Şebekesini Gizle" : "Elektrik Şebekesini Göster"}
          >
            <Zap size={18} />
            <b>Şebeke</b>
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
          <h2 style={{ marginTop: 0 }}>{worldExample ? 'PDHES Bilgileri' : 'Kavramsal Özet'}</h2>
          {worldExample ? (
            <div className="grid" style={{ gap: 6, marginBottom: 16 }}>
              <div className="metric good"><span>Tesis Adı</span><b style={{fontSize: 13}}>{worldExample.name}</b></div>
              <div className="metric info"><span>Ülke</span><b>{worldExample.country}</b></div>
              <div className="metric"><span>Tipi</span><b>{worldExample.type}</b></div>
              <div className="metric"><span>İşletme / Yapım</span><b>{worldExample.commissioningYear} / {worldExample.constructionPeriod}</b></div>
              <div className="metric warn"><span>Durumu</span><b>{worldExample.status}</b></div>
              
              <div className="metric info"><span>Güç / Enerji</span><b>{worldExample.capacityMw} MW / {worldExample.storageMwh} MWh</b></div>
              <div className="metric"><span>Düşü / Tam Yük Süresi</span><b>{worldExample.headM} m / {worldExample.fullLoadHours} saat</b></div>
              <div className="metric"><span>Verim</span><b>{worldExample.efficiency}</b></div>
              
              <div className="metric"><span>Alt Hacim</span><b>{worldExample.lowerResVolume}</b></div>
              <div className="metric"><span>Üst Hacim</span><b>{worldExample.upperResVolume}</b></div>
              <div className="metric"><span>Alt Rezervuar Tipi</span><b>{worldExample.lowerResNameType}</b></div>
              <div className="metric"><span>Üst Rezervuar Tipi</span><b>{worldExample.upperResNameType}</b></div>
              
              <div className="metric"><span>Pompa-Türbin Tipi</span><b>{worldExample.pumpTurbineType}</b></div>
              <div className="metric"><span>Pompa-Türbin Gücü</span><b>{worldExample.pumpTurbinePower}</b></div>
              
              <div className="metric good"><span>Yatırım Maliyeti</span><b>{worldExample.investmentCostUsd}</b></div>
              <div className="metric"><span>Birim Maliyet</span><b>{worldExample.costPerKwh} $/kWh</b></div>
              
              <div className="metric" style={{ gridColumn: '1 / -1' }}>
                <span>Kısa Analiz</span>
                <p className="muted" style={{ marginTop: 4, lineHeight: 1.4, fontSize: 12 }}>{worldExample.shortAnalysis}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid" style={{ gap: 6 }}>
                <div className="metric good"><span>Kapasite</span><b>{num(site.capacityMW)} MW</b></div>
                <div className="metric info"><span>Debi / düşü</span><b>{num(site.projectFlowCms)} m³/s / {num(site.headM)} m</b></div>
                <div className="metric"><span>Yatırım gideri</span><b>{moneyBn(site.capexUsdBn)}</b></div>
                <div className="metric"><span>Gelir / geri ödeme</span><b>{moneyM(site.annualRevenueUsdM)} / {site.paybackYear ? `${site.paybackYear} yıl` : 'Belirtilmedi'}</b></div>
              </div>
              <ElevationProfile site={site} />
            </>
          )}

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

          {!worldExample && (
            <div style={{ marginTop: 16 }}>
              <InfoAccordion title="Proje zaman çizelgesi" defaultOpen={false}>
                <div className="timeline">
                  {(site.timeline ?? []).map((event, index) => (
                    <div className="tl" key={`${event.date}-${index}`}>
                      <time>{event.date}</time>
                      <b style={{ display: 'block', marginTop: 3 }}>{event.title}</b>
                      <p>{event.text}</p>
                    </div>
                  ))}
                </div>
              </InfoAccordion>
            </div>
          )}

          </aside>
      </div>
    </section>
  );
}
