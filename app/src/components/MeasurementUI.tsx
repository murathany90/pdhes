import { useMapToolsStore } from '../stores/useMapToolsStore';
import { X, Trash2, LineChart } from 'lucide-react';
import * as turf from '@turf/turf';
import { useMemo, useState, useEffect } from 'react';
import TerrainProfileChart from './TerrainProfileChart';

export default function MeasurementUI() {
  const { map, mode, setMode, isDrawing, setIsDrawing, measurementPoints, clearMeasurement } = useMapToolsStore();
  const [showProfile, setShowProfile] = useState(false);
  const [mousePos, setMousePos] = useState<[number, number] | null>(null);

  // Stop drawing on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawing) {
        setIsDrawing(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawing, setIsDrawing]);

  useEffect(() => {
    if (mode !== 'measure' || !map) return;
    
    const onMouseMove = (e: any) => {
      if (isDrawing) {
        setMousePos([e.lngLat.lng, e.lngLat.lat]);
      }
    };
    
    map.on('mousemove', onMouseMove);
    return () => {
      map.off('mousemove', onMouseMove);
      setMousePos(null);
    };
  }, [map, mode]);

  useEffect(() => {
    if (!map) return;
    
    const sourceId = 'measure-points';
    
    const updateSource = () => {
      let coordinates = [...measurementPoints];
      if (mode === 'measure' && isDrawing && mousePos && coordinates.length > 0) {
        coordinates.push(mousePos);
      }
      
      const geojson: any = {
        type: 'FeatureCollection',
        features: []
      };

      if (coordinates.length > 0) {
        geojson.features.push({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates },
          properties: {}
        });
        
        coordinates.forEach(coord => {
          geojson.features.push({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: coord },
            properties: {}
          });
        });
      }

      const source = map.getSource(sourceId) as maplibregl.GeoJSONSource;
      if (source) {
        source.setData(geojson);
      } else if (map.isStyleLoaded()) {
        map.addSource(sourceId, { type: 'geojson', data: geojson });
        
        map.addLayer({
          id: 'measure-lines',
          type: 'line',
          source: sourceId,
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': '#10b981', 'line-width': 3, 'line-dasharray': [2, 2] }
        });
        
        map.addLayer({
          id: 'measure-circles',
          type: 'circle',
          source: sourceId,
          filter: ['==', '$type', 'Point'],
          paint: { 'circle-radius': 5, 'circle-color': '#10b981', 'circle-stroke-color': '#fff', 'circle-stroke-width': 2 }
        });
      }
    };

    updateSource();
    
    // Sometimes style needs to be fully loaded
    const onStyleLoad = () => updateSource();
    map.on('styledata', onStyleLoad);
    
    return () => {
      map.off('styledata', onStyleLoad);
      if (map.getLayer('measure-lines')) map.removeLayer('measure-lines');
      if (map.getLayer('measure-circles')) map.removeLayer('measure-circles');
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [map, mode, isDrawing, measurementPoints, mousePos]);

  const totalDistanceKm = useMemo(() => {
    if (measurementPoints.length < 2) return 0;
    const line = turf.lineString(measurementPoints);
    return turf.length(line, { units: 'kilometers' });
  }, [measurementPoints]);

  if (mode !== 'measure') return null;

  const handleClose = () => {
    setMode('default');
    setShowProfile(false);
  };

  return (
    <>
      <div style={{
        position: 'absolute',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '50px',
        padding: '8px 12px 8px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '10px', color: 'rgba(52, 211, 153, 0.7)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Mesafe Ölçümü
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', fontFamily: 'monospace' }}>
              {totalDistanceKm.toFixed(2)}
            </span>
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>km</span>
          </div>
        </div>

        <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {isDrawing && measurementPoints.length > 0 && (
            <button
              onClick={() => setIsDrawing(false)}
              title="Çizimi Bitir (ESC)"
              style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', cursor: 'pointer', marginRight: '4px' }}
            >
              Bitir
            </button>
          )}
          {measurementPoints.length >= 2 && !isDrawing && (
            <button
              onClick={() => setShowProfile(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', cursor: 'pointer', marginRight: '4px' }}
            >
              <LineChart size={14} />
              <span>Profil</span>
            </button>
          )}
          <button
            onClick={clearMeasurement}
            title="Temizle"
            style={{ padding: '8px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', borderRadius: '50%' }}
            onMouseOver={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'none'; }}
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={handleClose}
            title="Kapat"
            style={{ padding: '8px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', borderRadius: '50%' }}
            onMouseOver={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'none'; }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {showProfile && measurementPoints.length >= 2 && (
        <TerrainProfileChart onClose={() => setShowProfile(false)} />
      )}
    </>
  );
}
