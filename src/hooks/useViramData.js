import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getProfile, getTodayFocus, getConfessions, getTodayIntention } from '../lib/db'

export default function useViramData() {
  const [data, setData] = useState({
    user: null, focus: null, confessions: [], intention: '', loading: true,
  })

  const load = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setData({ user: null, focus: null, confessions: [], intention: '', loading: false })
        return
      }
      const [profile, todayFocus, confessions, intention] = await Promise.all([
        getProfile(user.id),
        getTodayFocus(user.id),
        getConfessions(user.id),
        getTodayIntention(user.id),
      ])
      setData({ user: profile, focus: todayFocus, confessions, intention, loading: false })
    } catch (err) {
      console.error('useViramData:', err)
      setData(prev => ({ ...prev, loading: false }))
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { ...data, refresh: load }
}
