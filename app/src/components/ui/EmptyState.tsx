

export default function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
      <p>{message}</p>
    </div>
  );
}
