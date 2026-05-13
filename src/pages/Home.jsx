import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      navigate(session ? '/dashboard' : '/start', { replace: true })
    }).catch(() => navigate('/start', { replace: true }))
  }, [navigate])

  return null
}
