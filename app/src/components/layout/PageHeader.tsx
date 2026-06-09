import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="page-header" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <h2 className="big-title" style={{ margin: 0, fontSize: 24 }}>{title}</h2>
        {description && <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
