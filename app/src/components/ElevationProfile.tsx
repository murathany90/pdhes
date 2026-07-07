import type { Site } from '../types/site';

interface ElevationProfileProps {
  site: Site | null;
}

export function ElevationProfile({ site }: ElevationProfileProps) {
  if (!site || !site.components_detail || !site.components_detail.upper_reservoir || !site.components_detail.lower_reservoir) {
    return (
      <div className="elevation-profile-empty">
        <p className="muted small">Lütfen bir santral seçin</p>
      </div>
    );
  }

  const upper = site.components_detail.upper_reservoir.elevation_m;
  const lower = site.components_detail.lower_reservoir.elevation_m;
  const head = site.head || (upper - lower);

  // Fallbacks if data is missing
  if (!upper || !lower) {
    return (
      <div className="elevation-profile-empty">
        <p className="muted small">Detaylı topoğrafik veri bulunamadı.</p>
      </div>
    );
  }

  // Define SVG dimensions
  const w = 280;
  const h = 140;
  const padding = 20;
    const chartH = h - padding * 2;

  // Determine min/max for Y scale
  const minY = Math.max(0, lower - 100);
  const maxY = upper + 100;
  const rangeY = maxY - minY;

  // Convert elevation to Y coordinate (inverted because SVG Y goes down)
  const getY = (elevation: number) => padding + chartH - ((elevation - minY) / rangeY) * chartH;

  // Key points
  const yUpper = getY(upper);
  const yLower = getY(lower);
  
  const xLeft = padding + 20;
  const xUpper = padding + 60;
  const xLower = w - padding - 60;
  const xRight = w - padding - 20;

  // Path data for the terrain cross-section
  // We'll draw a mountain shape from left to right
  const d = `
    M ${padding},${h - padding}
    L ${xLeft},${yUpper}
    L ${xUpper},${yUpper}
    C ${xUpper + 20},${yUpper} ${xLower - 20},${yLower} ${xLower},${yLower}
    L ${xRight},${yLower}
    L ${w - padding},${h - padding}
    Z
  `;

  // Water levels
  const waterUpper = `M ${xLeft},${yUpper} L ${xUpper},${yUpper}`;
  const waterLower = `M ${xLower},${yLower} L ${xRight},${yLower}`;

  return (
    <div className="elevation-profile-card">
      <h3 style={{ margin: '0 0 12px' }}>Topografik Kesit</h3>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} className="elevation-svg">
        <defs>
          <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--panel3)" />
            <stop offset="100%" stopColor="var(--panel1)" />
          </linearGradient>
        </defs>

        {/* Mountain Fill */}
        <path d={d} fill="url(#mountainGrad)" stroke="var(--line)" strokeWidth="1.5" />

        {/* Reservoirs */}
        <path d={waterUpper} stroke="#36d6ff" strokeWidth="4" strokeLinecap="round" />
        <path d={waterLower} stroke="#36d6ff" strokeWidth="4" strokeLinecap="round" />

        {/* Penstock Line */}
        <line 
          x1={xUpper} y1={yUpper} 
          x2={xLower} y2={yLower} 
          stroke="#ff944d" strokeWidth="2" strokeDasharray="4 4" 
        />

        {/* Points & Labels */}
        <circle cx={xUpper} cy={yUpper} r="4" fill="#ff944d" />
        <circle cx={xLower} cy={yLower} r="4" fill="#ff944d" />

        <text x={xUpper} y={yUpper - 10} fill="var(--text)" fontSize="10" textAnchor="middle" fontWeight="bold">
          {Math.round(upper)}m
        </text>
        <text x={xLower} y={yLower - 10} fill="var(--text)" fontSize="10" textAnchor="middle" fontWeight="bold">
          {Math.round(lower)}m
        </text>

        {/* Head Label */}
        <text x={w / 2} y={padding + 10} fill="var(--muted)" fontSize="11" textAnchor="middle">
          Düşü: {Math.round(head)}m
        </text>
      </svg>
    </div>
  );
}
