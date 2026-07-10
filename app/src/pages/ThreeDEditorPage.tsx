import { useEffect, useRef, useState } from 'react';
import { useMapLibre, type MapLayerVisibility } from '../hooks/useMapLibre';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useSiteStore } from '../stores/useSiteStore';
import type { Site } from '../types/site';
import * as turf from '@turf/turf';

interface ThreeDEditorPageProps {
  site?: Site;
  onDone: () => void;
}

const EDITOR_LAYERS: MapLayerVisibility = {
  candidates: false,
  projectLayout: true,
  risk: true,
  waterPath: true,
  powerGrid: true,
  terrain3d: true,
  upperReservoir: true,
  lowerReservoir: true,
  powerhouse: true,
  surgeTank: true,
  switchyard3d: true,
  portal: true,
};

type DrawingMode = 'none' | 'upperReservoir' | 'lowerReservoir' | 'powerhouse' | 'switchyard' | 'penstockRoute';

export default function ThreeDEditorPage({ site, onDone }: ThreeDEditorPageProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { updateSite, baseSites, gridAssets } = useSiteStore();
  const { mapStyle, heightScale } = useSettingsStore();

  const [previewSite, setPreviewSite] = useState<Site | undefined>(site);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('none');
  const [draftCoords, setDraftCoords] = useState<[number, number][]>([]);
  const [message, setMessage] = useState('');

  // Draft drawing source setup
  const draftSourceId = 'draft-drawing-source';

  useEffect(() => {
    if (site) {
      setPreviewSite(site);
    }
  }, [site?.id]);

  const { mapRef } = useMapLibre({
    containerRef: mapContainer,
    site: previewSite,
    sites: previewSite ? [previewSite] : [],
    selectedId: previewSite?.id || '',
    mapStyle,
    heightScale,
    gridAssets,
    layers: EDITOR_LAYERS,
    interactiveCandidates: false,
  });

  // Setup click handler and draft layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const onClick = (e: any) => {
      if (drawingMode === 'none') return;
      
      const lng = Number(e.lngLat.lng.toFixed(6));
      const lat = Number(e.lngLat.lat.toFixed(6));
      
      if (drawingMode === 'powerhouse' || drawingMode === 'switchyard') {
        // Point modes: instant placement
        setPreviewSite((prev) => {
          if (!prev) return prev;
          const newSite = { ...prev };
          newSite.coordinates = { ...newSite.coordinates };
          if (drawingMode === 'powerhouse') {
            newSite.coordinates.powerhouse = { ...newSite.coordinates.powerhouse, point: [lng, lat] };
          } else if (drawingMode === 'switchyard') {
            newSite.coordinates.switchyard = { ...newSite.coordinates.switchyard, point: [lng, lat] };
          }
          return newSite;
        });
        setMessage(`${drawingMode === 'powerhouse' ? 'Türbin Odası' : 'Şalt Sahası'} konumu ayarlandı.`);
        setDrawingMode('none');
      } else {
        // Line / Polygon modes: append to draft
        setDraftCoords((prev) => [...prev, [lng, lat]]);
      }
    };
    
    map.on('click', onClick);

    // Sync draftCoords to the draft layer
    if (!map.getSource(draftSourceId)) {
      map.addSource(draftSourceId, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({
        id: 'draft-line-layer',
        type: 'line',
        source: draftSourceId,
        paint: { 'line-color': '#ff0000', 'line-width': 3, 'line-dasharray': [2, 2] }
      });
      map.addLayer({
        id: 'draft-point-layer',
        type: 'circle',
        source: draftSourceId,
        paint: { 'circle-radius': 4, 'circle-color': '#ff0000' }
      });
    }

    const source = map.getSource(draftSourceId) as maplibregl.GeoJSONSource;
    if (source) {
      if (draftCoords.length > 0) {
        const isPolygon = drawingMode === 'upperReservoir' || drawingMode === 'lowerReservoir';
        const coords = [...draftCoords];
        if (isPolygon && coords.length > 2) {
          coords.push(coords[0]); // Close polygon visually
        }
        source.setData({
          type: 'FeatureCollection',
          features: [
            { type: 'Feature', geometry: { type: 'LineString', coordinates: coords }, properties: {} },
            ...draftCoords.map(pt => ({ type: 'Feature' as const, geometry: { type: 'Point' as const, coordinates: pt }, properties: {} }))
          ]
        });
      } else {
        source.setData({ type: 'FeatureCollection', features: [] });
      }
    }

    return () => {
      map.off('click', onClick);
    };
  }, [mapRef.current, drawingMode, draftCoords]);

  if (!site || !previewSite) {
    return <section className="panel active"><p className="muted">Düzenlenecek 3D yerleşim bulunamadı.</p></section>;
  }

  const handleFinishDrawing = () => {
    if (draftCoords.length === 0) {
      setDrawingMode('none');
      return;
    }

    setPreviewSite((prev) => {
      if (!prev) return prev;
      const newSite = { ...prev };
      newSite.coordinates = { ...newSite.coordinates };

      if (drawingMode === 'upperReservoir') {
        newSite.coordinates.upperReservoirPolygon = draftCoords;
        newSite.coordinates.upperReservoir = { ...newSite.coordinates.upperReservoir, point: draftCoords[0] };
      } else if (drawingMode === 'lowerReservoir') {
        newSite.coordinates.lowerReservoirPolygon = draftCoords;
        newSite.coordinates.lowerReservoir = { ...newSite.coordinates.lowerReservoir, point: draftCoords[0] };
      } else if (drawingMode === 'penstockRoute') {
        newSite.coordinates.penstockRoute = draftCoords;
      }
      return newSite;
    });

    setDraftCoords([]);
    setDrawingMode('none');
    setMessage('Çizim başarıyla tamamlandı.');
  };

  const handleAutoDraw = () => {
    const upper = previewSite.coordinates.upperReservoir.point;
    const lower = previewSite.coordinates.lowerReservoir.point;
    if (!upper || !lower) {
      setMessage("Hata: Otomatik çizim için önce Üst ve Alt rezervuar konumlarının belli olması gerekir.");
      return;
    }

    const line = turf.lineString([upper, lower]);
    const length = turf.length(line, { units: 'kilometers' });
    
    // Basit bir orantısal yerleşim:
    const surgeTankPt = turf.along(line, length * 0.2, { units: 'kilometers' }).geometry.coordinates as [number, number];
    const powerhousePt = turf.along(line, length * 0.8, { units: 'kilometers' }).geometry.coordinates as [number, number];
    // Şalt sahasını santrale yakın ama biraz offsetli koyalım
    const switchyardPt = turf.along(line, length * 0.85, { units: 'kilometers' }).geometry.coordinates as [number, number];
    
    const penstock = [upper, surgeTankPt, powerhousePt, lower];

    setPreviewSite((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        coordinates: {
          ...prev.coordinates,
          surgeTank: { ...prev.coordinates.surgeTank, point: surgeTankPt },
          powerhouse: { ...prev.coordinates.powerhouse, point: powerhousePt },
          switchyard: { ...prev.coordinates.switchyard, point: switchyardPt },
          penstockRoute: penstock,
        }
      };
    });
    setMessage("Kalan bileşenler (Denge Bacası, Türbin, Şalt ve Su Yolu) otomatik yerleştirildi!");
  };

  const handleSave = () => {
    if (previewSite) {
      updateSite(site.id, previewSite);
      setMessage('Yerleşim yerel çalışma alanına başarıyla kaydedildi.');
    }
  };

  const handleReset = () => {
    const base = baseSites.find((item) => item.id === site.id);
    if (base) {
      setPreviewSite(base);
      setDraftCoords([]);
      setDrawingMode('none');
      setMessage('Varsayılan veriler yüklendi.');
    }
  };

  const renderComponentCard = (title: string, modeLine: DrawingMode, modePoint?: DrawingMode) => {
    const isDrawing = drawingMode === modeLine || drawingMode === modePoint;
    return (
      <div className={`card ${isDrawing ? 'active' : ''}`} style={{ marginBottom: 12, padding: 12, background: isDrawing ? 'rgba(0, 150, 255, 0.1)' : 'var(--bg-card)', border: isDrawing ? '1px solid var(--blue)' : '1px solid var(--border)' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '13px' }}>{title}</h3>
        {isDrawing ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <p className="muted small" style={{ flex: 1, margin: 0 }}>Haritaya tıklayarak çiziminizi yapın...</p>
            <button className="btn primary small" onClick={handleFinishDrawing}>✅ Bitir</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            {modeLine && modeLine !== 'none' && <button className="btn outline small" onClick={() => { setDrawingMode(modeLine); setDraftCoords([]); }}>{modeLine === 'penstockRoute' ? '〽️ Rota Çiz' : '📐 3D Şekil Çiz'}</button>}
            {modePoint && modePoint !== 'none' && <button className="btn outline small" onClick={() => { setDrawingMode(modePoint); setDraftCoords([]); }}>📍 Konum Seç</button>}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="panel active" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="map-layout" style={{ flex: 1, overflow: 'hidden' }}>
        <aside className="map-left" style={{ width: '420px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <h2>3D Yerleşim Editörü (Etkileşimli)</h2>
          <p className="muted small" style={{ marginBottom: 12 }}>{site.name}</p>
          
          <div style={{ flex: 1 }}>
            {renderComponentCard('Üst Rezervuar', 'upperReservoir')}
            {renderComponentCard('Alt Rezervuar', 'lowerReservoir')}
            {renderComponentCard('Türbin Odası', 'none', 'powerhouse')}
            {renderComponentCard('Şalt Sahası (3D)', 'none', 'switchyard')}
            {renderComponentCard('Enerji Nakil Hattı / Su Yolu', 'penstockRoute')}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            <button className="btn" style={{ background: 'var(--yellow)', color: 'var(--bg)' }} onClick={handleAutoDraw}>✨ Kalanları Otomatik Çiz</button>
            <button className="btn primary" onClick={handleSave}>💾 Kaydet</button>
            <button className="btn ghost" onClick={handleReset}>Sıfırla</button>
            <button className="btn ghost" onClick={onDone}>Çıkış</button>
          </div>
          
          {message && <div className="notice" style={{ marginTop: 12 }}>{message}</div>}
        </aside>

        <div className="map-stage">
          <div ref={mapContainer} style={{ position: 'absolute', inset: 0, cursor: drawingMode !== 'none' ? 'crosshair' : 'grab' }} />
        </div>
      </div>
    </section>
  );
}
