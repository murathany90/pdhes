

interface ScorePillProps {
  score: number;
  label?: string;
}

export default function ScorePill({ score, label }: ScorePillProps) {
  const colorClass = score >= 80 ? 'cat-closed' : score >= 60 ? 'cat-open' : 'cat-uncertainty';
  return (
    <span className={`pill ${colorClass}`}>
      {label && `${label}: `}<b>{score}</b>
    </span>
  );
}
