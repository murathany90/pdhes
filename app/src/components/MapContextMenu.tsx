import { useEffect, useRef } from 'react';
import { useMapToolsStore } from '../stores/useMapToolsStore';
import { Ruler, Mountain, X } from 'lucide-react';
import { useSettingsStore } from '../stores/useSettingsStore';

export default function MapContextMenu() {
  const { map, contextMenu, closeContextMenu, setElevationResult, setMode } = useMapToolsStore();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu if clicked outside
  useEffect(() => {
    if (!contextMenu.isOpen) return;
    
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeContextMenu();
      }
    };
    
    // Slight delay to prevent immediate close on the same click that opened it
    setTimeout(() => document.addEventListener('click', handleClick), 10);
    return () => document.removeEventListener('click', handleClick);
  }, [contextMenu.isOpen, closeContextMenu]);

  if (!contextMenu.isOpen || !contextMenu.lngLat) return null;

  const handleQueryElevation = () => {
    if (map && contextMenu.lngLat) {
      const ele = map.queryTerrainElevation(contextMenu.lngLat);
      const heightScale = useSettingsStore.getState().heightScale;
      const actualEle = ele !== null ? (ele / (heightScale * 1.3)) : null;
      setElevationResult(actualEle !== null ? Math.round(actualEle) : null);
    }
  };

  const handleMeasure = () => {
    setMode('measure');
    closeContextMenu();
  };

  return (
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        left: contextMenu.x,
        top: contextMenu.y,
        zIndex: 50,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        minWidth: '180px',
        fontSize: '13px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
          {contextMenu.lngLat.lat.toFixed(4)}, {contextMenu.lngLat.lng.toFixed(4)}
        </span>
        <button onClick={closeContextMenu} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
          <X size={14} />
        </button>
      </div>
      
      <div style={{ padding: '4px' }}>
        <button
          onClick={handleQueryElevation}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', textAlign: 'left', background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer', borderRadius: '4px' }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}
        >
          <Mountain size={15} color="#38bdf8" />
          <span>Buranın Rakımı Ne?</span>
        </button>
        
        <button
          onClick={handleMeasure}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', textAlign: 'left', background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer', borderRadius: '4px' }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}
        >
          <Ruler size={15} color="#34d399" />
          <span>Mesafe Ölç (Cetvel)</span>
        </button>
      </div>

      {contextMenu.elevationResult !== null && contextMenu.elevationResult !== undefined && (
        <div style={{ padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderTop: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 'bold', color: '#34d399', fontSize: '14px' }}>{contextMenu.elevationResult} m</span>
          <span style={{ fontSize: '11px', opacity: 0.6, color: '#d1fae5' }}>deniz seviyesinden</span>
        </div>
      )}
      {contextMenu.elevationResult === null && (
        <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderTop: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5', fontSize: '11px' }}>
          Rakım verisi alınamadı (Arazi yüklü değil).
        </div>
      )}
    </div>
  );
}
