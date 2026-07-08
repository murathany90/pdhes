import { useEffect, useRef, useState } from 'react';
import { useMapToolsStore } from '../stores/useMapToolsStore';
import { Ruler, Mountain, X, Copy, Globe } from 'lucide-react';
import { useSettingsStore } from '../stores/useSettingsStore';

export default function MapContextMenu() {
  const { map, contextMenu, closeContextMenu, setElevationResult, setMode } = useMapToolsStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

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
      // heightScale defaults to 1 if not set, exaggeration is * 1.3
      const actualEle = ele !== null ? (ele / ((heightScale || 1) * 1.3)) : null;
      setElevationResult(actualEle !== null ? Math.round(actualEle) : null);
    }
  };

  const handleCopy = () => {
    if (contextMenu.lngLat) {
      navigator.clipboard.writeText(`${contextMenu.lngLat.lat.toFixed(6)}, ${contextMenu.lngLat.lng.toFixed(6)}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGoogleEarth = () => {
    if (contextMenu.lngLat) {
      const url = `https://earth.google.com/web/@${contextMenu.lngLat.lat},${contextMenu.lngLat.lng},1500d,35y,0h,0t,0r`;
      window.open(url, '_blank');
      closeContextMenu();
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
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '6px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
        overflow: 'hidden',
        minWidth: '160px',
        fontSize: '12px',
        color: '#e2e8f0'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
          {contextMenu.lngLat.lat.toFixed(4)}, {contextMenu.lngLat.lng.toFixed(4)}
        </span>
        <button onClick={closeContextMenu} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <X size={12} />
        </button>
      </div>
      
      <div style={{ padding: '4px' }}>
        <button
          onClick={handleQueryElevation}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', textAlign: 'left', background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer', borderRadius: '4px' }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}
        >
          <Mountain size={14} color="#38bdf8" />
          <span>Rakım Sorgula</span>
        </button>
        
        <button
          onClick={handleMeasure}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', textAlign: 'left', background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer', borderRadius: '4px' }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}
        >
          <Ruler size={14} color="#34d399" />
          <span>Mesafe Ölç</span>
        </button>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '2px 0' }} />

        <button
          onClick={handleCopy}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', textAlign: 'left', background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer', borderRadius: '4px' }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}
        >
          <Copy size={14} color="#94a3b8" />
          <span>{copied ? 'Kopyalandı!' : 'Koordinatı Kopyala'}</span>
        </button>

        <button
          onClick={handleGoogleEarth}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', textAlign: 'left', background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer', borderRadius: '4px' }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}
        >
          <Globe size={14} color="#818cf8" />
          <span>Google Earth'te Aç</span>
        </button>
      </div>

      {contextMenu.elevationResult !== null && contextMenu.elevationResult !== undefined && (
        <div style={{ padding: '6px 10px', background: 'rgba(16, 185, 129, 0.1)', borderTop: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontWeight: 'bold', color: '#34d399', fontSize: '13px' }}>{contextMenu.elevationResult} m</span>
          <span style={{ fontSize: '10px', opacity: 0.5, color: '#d1fae5' }}>deniz seviyesi</span>
        </div>
      )}
    </div>
  );
}
