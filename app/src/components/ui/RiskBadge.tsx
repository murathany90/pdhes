

interface RiskBadgeProps {
  level: 'high' | 'medium' | 'low';
  label: string;
}

export default function RiskBadge({ level, label }: RiskBadgeProps) {
  const levelClass = level === 'high' ? 'cat-proto' : level === 'medium' ? 'cat-open' : 'cat-closed';
  return (
    <span className={`tag ${levelClass}`}>
      {label}
    </span>
  );
}
