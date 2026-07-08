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
        const exaggeration = heightScale * 1.3;
        
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
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl z-40 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
        <h3 className="text-sm font-semibold text-white/90">Arazi Kot Profili</h3>
        <button onClick={onClose} className="p-1 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/10">
          <X size={16} />
        </button>
      </div>
      
      <div className="h-48 p-4">
        {loading && (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/50 gap-2">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-xs">Arazi verisi hesaplanıyor...</span>
          </div>
        )}
        
        {error && (
          <div className="w-full h-full flex items-center justify-center text-red-400 text-sm">
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
