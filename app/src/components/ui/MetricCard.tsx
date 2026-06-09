

interface MetricCardProps {
  label: string;
  value: string | number;
  variant?: 'default' | 'capacity' | 'capex' | 'risk' | 'grid' | 'uncertainty';
}

export default function MetricCard({ label, value, variant = 'default' }: MetricCardProps) {
  return (
    <div className={`metric ${variant !== 'default' ? variant : ''}`}>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
