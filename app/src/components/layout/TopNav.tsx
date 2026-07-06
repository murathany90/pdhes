import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface TopNavProps {
  title: string;
  subtitle?: string;
  controls?: ReactNode;
  homeHref?: string;
}

import { publicAssetUrl } from '../../utils/publicUrl';

export default function TopNav({ title, subtitle, controls, homeHref = '/pdhes' }: TopNavProps) {
  return (
    <header className="topbar">
      <Link className="brand" to={homeHref} aria-label="PDHES ana sayfası">
        <img 
          src={publicAssetUrl('apple-touch-icon.png')} 
          alt=""
          className="logo" 
        />
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </Link>
      <div className="global-controls">
        {controls}
      </div>
    </header>
  );
}
