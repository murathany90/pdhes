import type { ReactNode } from 'react';

interface TopNavProps {
  title: string;
  subtitle?: string;
  controls?: ReactNode;
}

export default function TopNav({ title, subtitle, controls }: TopNavProps) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="logo">PDHES</div>
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
