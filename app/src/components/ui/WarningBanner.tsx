

export default function WarningBanner({ message, type = 'info' }: { message: string, type?: 'info' | 'warning' | 'danger' }) {
  const className = type === 'danger' ? 'danger-notice' : 'notice';
  return (
    <div className={className}>
      {message}
    </div>
  );
}
