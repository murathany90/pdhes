import { useId } from 'react';

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}

export default function ScenarioSlider({ label, value, min, max, step = 1, unit = '', onChange }: Props) {
  const inputId = useId();

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: 14 }}>
        <label htmlFor={inputId} style={{ color: 'var(--muted)' }}>{label}</label>
        <output htmlFor={inputId} style={{ color: 'var(--text)', fontWeight: 700 }}>{value}{unit}</output>
      </div>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={`${value}${unit}`}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          accentColor: 'var(--green)'
        }}
      />
    </div>
  );
}
