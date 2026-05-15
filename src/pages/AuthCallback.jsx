import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { upsertProfile, getProfile } from '../lib/db'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    let handled = false

    const timeout = setTimeout(() => {
      if (!cancelled && !handled) {
        cancelled = true
        navigate('/start', { replace: true })
      }
    }, 8000)

    async function handleSession(session) {
      if (handled || cancelled) return
      handled = true
      clearTimeout(timeout)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || cancelled) return
        await upsertProfile(user.id, {
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
          picture: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        })
        const profile = await getProfile(user.id)
        if (cancelled) return
        navigate(profile?.onboarded ? '/dashboard' : '/onboarding', { replace: true })
      } catch (err) {
        console.error('AuthCallback:', err)
        if (!cancelled) navigate('/start', { replace: true })
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) handleSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) handleSession(session)
    })

    return () => { cancelled = true; clearTimeout(timeout); subscription?.unsubscribe() }
  }, [navigate])

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
        width: 40, height: 40, borderRadius: '50%',
        border: '2px solid rgba(55,38,22,0.10)',
        borderTopColor: '#B8704E',
        animation: 'spin-slow 0.8s linear infinite',
      }} />
      <span style={{ opacity: 0.6 }}>Signing you in&hellip;</span>
    </div>
  )
}
