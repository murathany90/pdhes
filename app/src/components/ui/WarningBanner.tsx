export default function WarningBanner({ message, type = 'info' }: { message: string, type?: 'info' | 'warning' | 'danger' }) {
  return (
    <div className={`alert alert-${type}`} role={type === 'danger' ? 'alert' : 'status'}>
      {message}
    </div>
  );
}
