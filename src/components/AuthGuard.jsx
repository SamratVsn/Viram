import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthGuard({ children }) {
  const [state, setState] = useState({ loading: true, session: null })

  useEffect(() => {
    let cancelled = false

    /* Check current session */
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) setState({ loading: false, session })
    }).catch(() => {
      if (!cancelled) setState({ loading: false, session: null })
    })

    /* Listen for changes */
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) setState({ loading: false, session })
    })

    return () => { cancelled = true; subscription?.unsubscribe() }
  }, [])

  if (state.loading) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#F4EEE3',
        flexDirection: 'column', gap: 20,
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 35px, rgba(55,38,22,0.04) 35px, rgba(55,38,22,0.04) 36px)',
        }} />
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 700, fontSize: 22,
          letterSpacing: '0.14em', color: '#2A2218',
          position: 'relative',
        }}>
          VI<span style={{ color: '#B8704E' }}>RAM</span>
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          border: '2px solid rgba(55,38,22,0.08)',
          borderTopColor: '#B8704E',
          animation: 'ag-spin 0.8s linear infinite',
          position: 'relative',
        }} />
        <span style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 13, fontWeight: 300,
          color: '#8A7B6E', opacity: 0.6,
          letterSpacing: '0.06em', position: 'relative',
        }}>
          Preparing your journey&hellip;
        </span>
        <style>{`@keyframes ag-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    )
  }

  if (!state.session) return <Navigate to="/start" replace />

  return children
}
