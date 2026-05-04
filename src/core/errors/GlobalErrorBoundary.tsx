// src/core/errors/GlobalErrorBoundary.tsx
// Error Boundary globale per LipariBank.
// DEVE essere un class component: React non ha ancora hook per
// getDerivedStateFromError e componentDidCatch.
// Libreria alternativa consigliata: react-error-boundary

import React, { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode; // Fallback UI personalizzabile
}

class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // getDerivedStateFromError: metodo statico che aggiorna lo state
  // quando viene catturato un errore. Permette di mostrare il fallback UI.
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  // componentDidCatch: chiamato dopo il render del fallback.
  // Usato per logging su servizi di monitoring (Sentry, Datadog).
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('GlobalErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    // In produzione: Sentry.captureException(error, { extra: errorInfo });
  }

  // Reset dell'error boundary: permette all'utente di riprovare
  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Fallback UI personalizzato se fornito, altrimenti quello di default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div role="alert" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>⚠️ Si è verificato un errore imprevisto</h2>
          <p>Il sistema bancario ha rilevato un problema tecnico.</p>
          <p>Se il problema persiste, contatta il supporto.</p>
          <button onClick={this.handleReset}>
            🔄 Riprova
          </button>
          {/* In development mostriamo i dettagli dell'errore */}
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '1rem', textAlign: 'left' }}>
              <summary>Dettagli errore (solo development)</summary>
              <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                {this.state.error?.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;