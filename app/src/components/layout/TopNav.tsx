import type { ReactNode } from 'react';

interface TopNavProps {
  title: string;
  subtitle?: string;
  controls?: ReactNode;
  onHomeClick?: () => void;
}

import { publicAssetUrl } from '../../utils/publicUrl';

export default function TopNav({ title, subtitle, controls, onHomeClick }: TopNavProps) {
  return (
    <header className="topbar">
      <div 
        className="brand" 
        onClick={onHomeClick} 
        style={{ cursor: onHomeClick ? 'pointer' : 'default' }}
      >
        <img 
          src={publicAssetUrl('apple-touch-icon.png')} 
          alt="PDHES Logo" 
          className="logo" 
        />
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      <div className="global-controls">
        {controls}
      </div>
    </header>
  );
}
