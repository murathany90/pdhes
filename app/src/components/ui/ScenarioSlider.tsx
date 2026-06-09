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
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: 14 }}>
        <span style={{ color: 'var(--muted)' }}>{label}</span>
        <b style={{ color: 'var(--text)' }}>{value}{unit}</b>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))} 
        style={{
          width: '100%',
          accentColor: 'var(--green)'
        }}
      />
    </div>
  );
}
