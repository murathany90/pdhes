import { Check } from 'lucide-react';

interface Props {
  label: string;
  active: boolean;
  onChange: (active: boolean) => void;
  color?: string;
}

export default function LayerToggle({ label, active, onChange, color = 'var(--green)' }: Props) {
  return (
    <label 
      className="layer-toggle" 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        border: `1px solid ${active ? color : 'var(--line)'}`,
        borderRadius: '12px',
        background: active ? `${color}15` : 'var(--panel3)',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 0.2s',
        marginBottom: '8px'
      }}
    >
      <span style={{ fontWeight: 500, color: active ? 'var(--text)' : 'var(--muted)', fontSize: 14 }}>{label}</span>
      <input 
        type="checkbox" 
        checked={active} 
        onChange={(e) => onChange(e.target.checked)} 
        style={{ display: 'none' }}
      />
      <div 
        style={{
          width: 20,
          height: 20,
          borderRadius: 6,
          border: `1px solid ${active ? color : 'var(--muted)'}`,
          background: active ? color : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s'
        }}
      >
        {active && <Check size={14} color="#000" />}
      </div>
    </label>
  );
}
