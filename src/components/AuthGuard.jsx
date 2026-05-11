import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthGuard({ children }) {
  const [state, setState] = useState({ loading: true, session: null })

  useEffect(() => {
    /* Check current session */
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({ loading: false, session })
    })

    /* Listen for changes */
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ loading: false, session })
    })

    return () => subscription?.unsubscribe()
  }, [])

  if (state.loading) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#F4EEE3',
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 18, color: '#5A4E42',
      }}>
        <span style={{ opacity: 0.6 }}>Loading&hellip;</span>
      </div>
    )
  }

  if (!state.session) return <Navigate to="/start" replace />

  return children
}
