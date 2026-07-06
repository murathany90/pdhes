export default function PageLoadingState() {
  return (
    <section className="panel active loading-state" role="status" aria-live="polite">
      <span className="sr-only">İlgili bölüm yükleniyor.</span>
      <div className="loading-skeleton" aria-hidden="true">
        <div className="skeleton-block skeleton-title" />
        <div className="skeleton-grid">
          <div className="skeleton-block skeleton-card" />
          <div className="skeleton-block skeleton-card" />
          <div className="skeleton-block skeleton-card" />
        </div>
      </div>
    </section>
  );
}
