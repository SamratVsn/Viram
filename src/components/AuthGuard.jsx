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
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 18, color: '#5A4E42',
        flexDirection: 'column', gap: 16,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '2px solid rgba(55,38,22,0.10)',
          borderTopColor: '#B8704E',
          animation: 'as-spin 0.8s linear infinite',
        }} />
        <span style={{ opacity: 0.6 }}>Loading&hellip;</span>
        <style>{`@keyframes as-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    )
  }

  if (!state.session) return <Navigate to="/start" replace />

  return children
}
