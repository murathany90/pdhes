import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function InfoAccordion({ title, children, defaultOpen = false }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const generatedId = useId();
  const triggerId = `accordion-trigger-${generatedId}`;
  const contentId = `accordion-panel-${generatedId}`;

  return (
    <div className={`accordion ${isOpen ? 'open' : ''}`} style={{
      border: '1px solid var(--line)',
      borderRadius: '12px',
      marginBottom: '12px',
      background: 'var(--panel3)',
      overflow: 'hidden'
    }}>
      <button 
        id={triggerId}
        type="button"
        className="accordion-header" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          background: 'transparent',
          border: 'none',
          color: 'var(--text)',
          fontWeight: 600,
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <span style={{ whiteSpace: 'normal', wordBreak: 'break-word', paddingRight: '12px', flex: '1 1 auto', minWidth: 0 }}>{title}</span>
        {isOpen
          ? <ChevronUp size={18} className="muted" aria-hidden="true" />
          : <ChevronDown size={18} className="muted" aria-hidden="true" />}
      </button>
      {isOpen && (
        <div
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          className="accordion-content"
          style={{
          padding: '0 16px 16px 16px',
          color: 'var(--muted)',
          lineHeight: 1.6
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
