import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('StudentHub Caught Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-primary, #0b1a14)',
            color: 'var(--text-primary, #FFFFFF)',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: 480,
              padding: '2rem',
              backgroundColor: 'var(--bg-card, #17644D)',
              border: '1px solid var(--border-subtle, rgba(241, 234, 215, 0.22))',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: 'rgba(248, 113, 113, 0.2)',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertCircle size={28} />
            </div>

            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                Something went wrong
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary, #F1EAD7)', opacity: 0.85 }}>
                {this.state.error?.message || 'An unexpected error occurred while loading this view.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="btn btn-primary"
                style={{ gap: '0.4rem', fontSize: '0.85rem' }}
              >
                <RefreshCw size={14} /> Reload Page
              </button>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="btn btn-secondary"
                style={{ gap: '0.4rem', fontSize: '0.85rem' }}
              >
                <Home size={14} /> Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
