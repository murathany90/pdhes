import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Route render failed', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <section className="panel active error-state">
        <div className="card" role="alert">
          <AlertTriangle size={28} aria-hidden="true" />
          <div>
            <h2>Bu bölüm görüntülenemedi</h2>
            <p className="muted">
              Beklenmeyen bir arayüz hatası oluştu. Yerel verileriniz silinmedi.
            </p>
          </div>
          <button type="button" className="btn primary" onClick={() => window.location.reload()}>
            <RefreshCw size={16} aria-hidden="true" />
            Yeniden yükle
          </button>
        </div>
      </section>
    );
  }
}
