import { useEffect, useState, useMemo } from 'react';
import { useMapToolsStore } from '../stores/useMapToolsStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import * as turf from '@turf/turf';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { X, Loader2 } from 'lucide-react';

interface TerrainProfileChartProps {
  onClose: () => void;
}

interface ProfilePoint {
  distance: number;
  elevation: number;
}

export default function TerrainProfileChart({ onClose }: TerrainProfileChartProps) {
  const { map, measurementPoints } = useMapToolsStore();
  const [data, setData] = useState<ProfilePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!map || measurementPoints.length < 2) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    const calculateProfile = () => {
      try {
        const line = turf.lineString(measurementPoints);
        const totalLength = turf.length(line, { units: 'kilometers' });
        
        // Sample points every 100 meters (0.1 km)
        const sampleInterval = 0.1; 
        const samples = Math.ceil(totalLength / sampleInterval);
        
        const profileData: ProfilePoint[] = [];
        
        const heightScale = useSettingsStore.getState().heightScale;
        const exaggeration = (heightScale || 1) * 1.3;
        
        for (let i = 0; i <= samples; i++) {
          const dist = Math.min(i * sampleInterval, totalLength);
          const pt = turf.along(line, dist, { units: 'kilometers' });
          const lngLat: [number, number] = [pt.geometry.coordinates[0], pt.geometry.coordinates[1]];
          
          const ele = map.queryTerrainElevation(lngLat);
          const actualEle = ele !== null ? (ele / exaggeration) : null;
          
          profileData.push({
            distance: Number(dist.toFixed(2)),
            elevation: actualEle !== null ? Math.round(actualEle) : 0,
          });
        }

        if (isMounted) {
          setData(profileData);
          setLoading(false);
        }
      } catch (err) {
        console.error('Profile calculation error:', err);
        if (isMounted) {
          setError('Profil oluşturulurken bir hata oluştu.');
          setLoading(false);
        }
      }
    };

    // Small timeout to allow UI to render the loading state first
    setTimeout(calculateProfile, 50);

    return () => {
      isMounted = false;
    };
  }, [map, measurementPoints]);

  const yDomain = useMemo(() => {
    if (!data.length) return [0, 100];
    const elevations = data.map(d => d.elevation);
    const min = Math.min(...elevations);
    const max = Math.max(...elevations);
    const padding = (max - min) * 0.1 || 50;
    return [Math.max(0, Math.floor(min - padding)), Math.ceil(max + padding)];
  }, [data]);

  return (
    <div style={{
      position: 'absolute',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '768px',
      zIndex: 40,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: 'rgba(255,255,255,0.9)' }}>Arazi Kot Profili</h3>
        <button 
          onClick={onClose} 
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}
          onMouseOver={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'none'; }}
        >
          <X size={16} />
        </button>
      </div>
      
      <div style={{ height: '192px', padding: '16px' }}>
        {loading && (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', gap: '8px' }}>
            <Loader2 size={24} className="animate-spin" />
            <span style={{ fontSize: '12px' }}>Arazi verisi hesaplanıyor...</span>
          </div>
        )}
        
        {error && (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorElevation" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis 
                dataKey="distance" 
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                tickFormatter={(val) => `${val}km`}
                stroke="rgba(255,255,255,0.2)"
                minTickGap={30}
              />
              <YAxis 
                domain={yDomain}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                tickFormatter={(val) => `${val}m`}
                stroke="rgba(255,255,255,0.2)"
                width={50}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                itemStyle={{ color: '#60a5fa' }}
                labelStyle={{ color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}
                labelFormatter={(label) => `Mesafe: ${label} km`}
                formatter={(value: any) => [`${value} m`, 'Rakım']}
              />
              <Area 
                type="monotone" 
                dataKey="elevation" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorElevation)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
