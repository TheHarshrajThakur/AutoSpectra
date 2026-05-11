import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("3D Context Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          width: '100%', height: '100%', minHeight: '300px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '1rem', background: '#0a0a0a',
          borderRadius: '1.5rem', border: '1px dashed rgba(255,255,255,0.1)'
        }}>
          <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontWeight: 800, letterSpacing: '0.2em' }}>
            ENGINE CONTEXT INTERRUPTED
          </span>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              padding: '0.5rem 1rem', background: 'rgba(59,130,246,0.1)', 
              border: '1px solid #3b82f6', color: '#3b82f6', 
              fontSize: '0.5rem', fontWeight: 800, borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            REBOOT SYSTEM
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
