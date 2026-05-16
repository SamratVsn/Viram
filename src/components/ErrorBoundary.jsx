import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#F4EEE3', fontFamily: "'Jost', system-ui, sans-serif", padding: 24,
        }}>
          <div style={{ textAlign: 'center', maxWidth: 400 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
              background: 'rgba(184,112,78,0.08)', border: '1px solid rgba(184,112,78,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#B8704E', fontSize: 28,
            }}>!</div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24,
              fontWeight: 700, color: '#2A2218', marginBottom: 12,
            }}>Something went wrong</h1>
            <p style={{ fontSize: 14, color: '#5A4E42', lineHeight: 1.7, marginBottom: 24 }}>
              The app encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '11px 24px', borderRadius: 100,
                background: '#B8704E', border: 'none', color: '#FFF8F2',
                fontFamily: "'Jost', system-ui, sans-serif", fontWeight: 600,
                fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
