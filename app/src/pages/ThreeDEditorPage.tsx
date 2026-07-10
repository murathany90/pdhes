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

type DrawingTemplate = 'point' | 'square' | 'rounded' | 'rectangle' | 'oval';

export default function ThreeDEditorPage({ site, onDone }: ThreeDEditorPageProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { updateSite, baseSites, gridAssets } = useSiteStore();
  const { mapStyle, heightScale } = useSettingsStore();

  const [previewSite, setPreviewSite] = useState<Site | undefined>(site);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('none');
  const [drawingTemplate, setDrawingTemplate] = useState<DrawingTemplate>('point');
  const [draftCoords, setDraftCoords] = useState<[number, number][]>([]);
  const [message, setMessage] = useState('');

  // Draft drawing source setup
  const draftSourceId = 'draft-drawing-source';

  useEffect(() => {
    if (site) {
      setPreviewSite(site);
    }
  }, [site?.id]);

  const dynamicLayers: MapLayerVisibility = {
    ...EDITOR_LAYERS,
  };

  const { mapRef } = useMapLibre({
    containerRef: mapContainer,
    site: previewSite,
    sites: previewSite ? [previewSite] : [],
    selectedId: previewSite?.id || '',
    mapStyle,
    heightScale,
    gridAssets,
    layers: dynamicLayers,
    interactiveCandidates: false,
    draftingMode: drawingMode !== 'none' ? (drawingMode === 'upperReservoir' ? 'upper_reservoir' : drawingMode === 'lowerReservoir' ? 'lower_reservoir' : drawingMode) : undefined,
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
        if (drawingTemplate !== 'point') {
          let generatedCoords: [number, number][] = [];
          try {
            const vol = previewSite?.components_detail?.upper_reservoir?.active_volume_mcm || previewSite?.activeVolumeHm3 || 5;
            const areaM2 = vol * 1000000 / 25; // using 25m depth assumption

            if (drawingTemplate === 'square') {
              const radius = Math.sqrt(areaM2 / 2);
              generatedCoords = turf.circle([lng, lat], radius, { steps: 4, units: 'meters' }).geometry.coordinates[0] as [number, number][];
              generatedCoords = turf.transformRotate(turf.polygon([generatedCoords]), 45).geometry.coordinates[0] as [number, number][];
            } else if (drawingTemplate === 'rectangle') {
              const width = Math.sqrt(areaM2 / 1.3);
              const length = width * 1.3;
              const pt = turf.point([lng, lat]);
              const n = turf.destination(pt, length / 2, 0, {units: 'meters'}).geometry.coordinates[1];
              const s = turf.destination(pt, length / 2, 180, {units: 'meters'}).geometry.coordinates[1];
              const e = turf.destination(pt, width / 2, 90, {units: 'meters'}).geometry.coordinates[0];
              const w = turf.destination(pt, width / 2, -90, {units: 'meters'}).geometry.coordinates[0];
              generatedCoords = [[w, s], [e, s], [e, n], [w, n], [w, s]];
            } else if (drawingTemplate === 'oval') {
              const ySemiAxis = Math.sqrt(areaM2 / (1.5 * Math.PI));
              const xSemiAxis = ySemiAxis * 1.5;
              if (turf.ellipse) {
                generatedCoords = turf.ellipse([lng, lat], xSemiAxis, ySemiAxis, { units: 'meters' }).geometry.coordinates[0] as [number, number][];
              } else {
                generatedCoords = turf.circle([lng, lat], Math.sqrt(areaM2 / Math.PI), { steps: 36, units: 'meters' }).geometry.coordinates[0] as [number, number][];
              }
            } else if (drawingTemplate === 'rounded') {
              const r = Math.sqrt(areaM2 / Math.PI) * 0.9;
              const bbox = turf.bbox(turf.circle([lng, lat], r, { steps: 4, units: 'meters' }));
              const sq = turf.bboxPolygon(bbox);
              const buf = turf.buffer(sq, r * 0.2, { units: 'meters' });
              if (buf && buf.geometry && buf.geometry.type === 'Polygon') {
                generatedCoords = buf.geometry.coordinates[0] as [number, number][];
              } else if (buf && buf.geometry && buf.geometry.type === 'MultiPolygon') {
                generatedCoords = buf.geometry.coordinates[0][0] as [number, number][];
              }
            }
            setDraftCoords(generatedCoords);
          } catch (err) {
            console.error("Template error", err);
          }
        } else {
          // Line / Polygon modes: append to draft
          setDraftCoords((prev) => [...prev, [lng, lat]]);
        }
      }
    };
    
    const onDblClick = (e: any) => {
      if (drawingMode !== 'none') {
        e.preventDefault();
        const finishBtn = document.getElementById('finish-drawing-btn');
        if (finishBtn) finishBtn.click();
      }
    };

    map.on('click', onClick);
    map.on('dblclick', onDblClick);

    // Sync draftCoords to the draft layer safely
    const syncDraftLayer = () => {
      if (!map.isStyleLoaded()) return;

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
        map.addLayer({
          id: 'draft-text-layer',
          type: 'symbol',
          source: draftSourceId,
          filter: ['has', 'label'],
          layout: {
            'text-field': ['get', 'label'],
            'text-size': 13,
            'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
            'text-radial-offset': 1,
            'text-justify': 'auto',
            'text-font': ['Noto Sans Bold']
          },
          paint: {
            'text-color': '#ff0000',
            'text-halo-color': '#ffffff',
            'text-halo-width': 2
          }
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

          let measurementText = '';
          if (isPolygon && coords.length > 3) {
            try {
              const area = turf.area(turf.polygon([coords]));
              const volume = area * 25; // 25m default depth
              const formatNum = (n: number) => n.toLocaleString('tr-TR', { maximumFractionDigits: 0 });
              measurementText = drawingMode === 'upperReservoir'
                ? `Üst Rezervuar\n(${formatNum(area)} m²)\n(${formatNum(volume)} m³)`
                : drawingMode === 'lowerReservoir'
                  ? `Alt Rezervuar (${previewSite?.lowerReservoirName || site?.lowerReservoirName || 'Mevcut Göl/Deniz'})`
                  : `Alan: ${formatNum(area)} m²`;
            } catch(e) {}
          } else if (!isPolygon && coords.length > 1) {
            try {
              const length = turf.length(turf.lineString(coords), { units: 'kilometers' });
              measurementText = `Mesafe: ${length.toFixed(2)} km`;
            } catch(e) {}
          }

          source.setData({
            type: 'FeatureCollection',
            features: [
              { type: 'Feature', geometry: { type: 'LineString', coordinates: coords }, properties: {} },
              ...draftCoords.map(pt => ({ type: 'Feature' as const, geometry: { type: 'Point' as const, coordinates: pt }, properties: {} })),
              ...(measurementText && coords.length > 0 ? [{
                type: 'Feature' as const,
                geometry: { type: 'Point' as const, coordinates: coords[coords.length - 1] },
                properties: { label: measurementText }
              }] : [])
            ]
          });
        } else {
          source.setData({ type: 'FeatureCollection', features: [] });
        }
      }
    };

    if (map.isStyleLoaded()) {
      syncDraftLayer();
    } else {
      map.once('styledata', syncDraftLayer);
    }

    return () => {
      map.off('click', onClick);
      map.off('dblclick', onDblClick);
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

  const calculatePolyStats = (polygonCoords: [number, number][] | undefined, baseVolume: number | null, fallbackElevation: number | null, queryTerrain: boolean = true) => {
    let area_m2 = 0;
    let centroid: [number, number] | null = null;
    if (polygonCoords && polygonCoords.length > 2) {
      const closed = [...polygonCoords];
      if (closed[0][0] !== closed[closed.length - 1][0] || closed[0][1] !== closed[closed.length - 1][1]) {
        closed.push(closed[0]);
      }
      try {
        const poly = turf.polygon([closed]);
        area_m2 = turf.area(poly);
        centroid = turf.center(poly).geometry.coordinates as [number, number];
      } catch (e) {
        // ignore invalid poly
      }
    }
    
    // Varsayılan derinlik ~25m kabul edilerek hacim tahmini (eğer sıfırdan çizildiyse)
    const volume_m3 = area_m2 > 0 ? area_m2 * 25 : (baseVolume ? baseVolume * 1000000 : 0);

    let actualElevation = fallbackElevation || 0;
    if (queryTerrain && centroid && mapRef.current && mapRef.current.getTerrain()) {
      const ele = mapRef.current.queryTerrainElevation(centroid);
      if (ele !== null) {
        actualElevation = Math.round(ele);
      }
    }

    return { area: area_m2, volume: volume_m3, elevation: actualElevation };
  };

  const currentUpperPoly = drawingMode === 'upperReservoir' ? draftCoords : previewSite?.coordinates.upperReservoirPolygon;
  const rawOldStats = calculatePolyStats(site.coordinates.upperReservoirPolygon, site.activeVolumeHm3 || 0, site.components_detail?.upper_reservoir?.elevation_m || site.headM || 0, false);
  const upperOldStats = {
    area: rawOldStats.area,
    volume: site.components_detail?.upper_reservoir?.active_volume_mcm ? site.components_detail.upper_reservoir.active_volume_mcm * 1000000 : rawOldStats.volume,
    elevation: rawOldStats.elevation
  };
  const upperNewStats = calculatePolyStats(currentUpperPoly, previewSite?.activeVolumeHm3 || 0, previewSite?.components_detail?.upper_reservoir?.elevation_m || previewSite?.headM || 0, true);

  const formatNum = (num: number) => num.toLocaleString('tr-TR', { maximumFractionDigits: 0 });

  const renderComponentCard = (title: string, modeLine: DrawingMode, modePoint?: DrawingMode) => {
    const isDrawing = (modeLine !== 'none' && drawingMode === modeLine) || (modePoint !== 'none' && drawingMode === modePoint);
    return (
      <div className={`card ${isDrawing ? 'active' : ''}`} style={{ marginBottom: 12, padding: 12, background: isDrawing ? 'rgba(0, 150, 255, 0.08)' : 'var(--bg-card)', border: isDrawing ? '1px solid var(--blue)' : '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isDrawing ? 8 : 0 }}>
          <h3 style={{ margin: 0, fontSize: '13px' }}>{title}</h3>
          {isDrawing && (
            <button id="finish-drawing-btn" className="btn primary small" onClick={handleFinishDrawing}>✅ Bitir</button>
          )}
        </div>
        
        {!isDrawing ? (
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {modeLine && modeLine !== 'none' && <button className="btn outline small" onClick={() => { setDrawingMode(modeLine); setDrawingTemplate('point'); setDraftCoords([]); }}>{modeLine === 'penstockRoute' ? '〽️ Rota Çiz' : '📐 3D Şekil Çiz'}</button>}
            {modePoint && modePoint !== 'none' && <button className="btn outline small" onClick={() => { setDrawingMode(modePoint); setDraftCoords([]); }}>📍 Konum Seç</button>}
          </div>
        ) : modeLine === 'upperReservoir' && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
             <button className={`btn small ${drawingTemplate === 'point' ? 'primary' : 'outline'}`} onClick={() => { setDrawingTemplate('point'); setDraftCoords([]); }}>✏️ Serbest</button>
             <button className={`btn small ${drawingTemplate === 'square' ? 'primary' : 'outline'}`} onClick={() => { setDrawingTemplate('square'); setDraftCoords([]); }}>⬛ Kare</button>
             <button className={`btn small ${drawingTemplate === 'rectangle' ? 'primary' : 'outline'}`} onClick={() => { setDrawingTemplate('rectangle'); setDraftCoords([]); }}>▭ Dikdrt.</button>
             <button className={`btn small ${drawingTemplate === 'rounded' ? 'primary' : 'outline'}`} onClick={() => { setDrawingTemplate('rounded'); setDraftCoords([]); }}>🔲 Oval-Kr</button>
             <button className={`btn small ${drawingTemplate === 'oval' ? 'primary' : 'outline'}`} onClick={() => { setDrawingTemplate('oval'); setDraftCoords([]); }}>🕳️ Oval</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="panel active" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="map-layout" style={{ flex: 1, overflow: 'hidden' }}>
        <div className="map-stage">
          <div ref={mapContainer} style={{ position: 'absolute', inset: 0, cursor: drawingMode !== 'none' ? 'crosshair' : 'grab' }} />
        </div>
        
        <aside className="map-right" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <h2>3D Yerleşim Editörü (Etkileşimli)</h2>
          <p className="muted small" style={{ marginBottom: 12 }}>{site.name}</p>
          
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {renderComponentCard('Üst Rezervuar', 'upperReservoir')}
            {renderComponentCard('Alt Rezervuar', 'lowerReservoir')}
            {renderComponentCard('Türbin Odası', 'none', 'powerhouse')}
            {renderComponentCard('Şalt Sahası (3D)', 'none', 'switchyard')}
            {renderComponentCard('Enerji Nakil Hattı / Su Yolu', 'penstockRoute')}
            
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="card" style={{ padding: 12, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--muted)' }}>Üst Rezervuar Bilgisi (Eski)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '12px' }}>
                  <div><b>Alan:</b> {formatNum(upperOldStats.area)} m²</div>
                  <div><b>Hacim:</b> {formatNum(upperOldStats.volume)} m³</div>
                  <div><b>Kot:</b> {formatNum(upperOldStats.elevation)} m</div>
                </div>
              </div>
              <div className="card" style={{ padding: 12, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--muted)' }}>Üst Rezervuar Bilgisi (Yeni)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '12px' }}>
                  <div><b>Alan:</b> {formatNum(upperNewStats.area)} m²</div>
                  <div><b>Hacim:</b> {formatNum(upperNewStats.volume)} m³</div>
                  <div><b>Kot:</b> {formatNum(upperNewStats.elevation)} m</div>
                </div>
              </div>
            </div>

            {message && <div className="notice" style={{ marginTop: 12 }}>{message}</div>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
            <button className="btn outline" onClick={() => {
              if (!previewSite) return;
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(previewSite, null, 2));
              const dlAnchorElem = document.createElement('a');
              dlAnchorElem.setAttribute("href", dataStr);
              dlAnchorElem.setAttribute("download", `${previewSite.id}_yerlesim.json`);
              dlAnchorElem.click();
              setMessage('Yerleşim JSON olarak indirildi.');
            }}>⬇️ İndir (JSON)</button>
            <button className="btn" style={{ background: 'var(--yellow)', color: 'var(--bg)', border: 'none' }} onClick={handleAutoDraw}>✨ Kalanları Otomatik Çiz</button>
            <button className="btn primary" onClick={handleSave}>💾 Kaydet</button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn outline" style={{ flex: 1 }} onClick={handleReset}>Sıfırla</button>
              <button className="btn outline" style={{ flex: 1 }} onClick={onDone}>Çıkış</button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
