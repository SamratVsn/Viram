import { supabase } from './supabase'

export async function getProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) { console.error('getProfile:', error); return null }
    if (!data) return null
    /* Map DB field names to what frontend expects */
    return {
      ...data,
      disciplineIndex: data.streak,
      disciplinePoints: data.discipline_points,
      lastLoginDate: data.last_login,
      goal: data.goal,
    }
  } catch (err) {
    console.error('getProfile:', err)
    return null
  }
}

export async function updateProfile(userId, updates) {
  try {
    /* Map frontend → DB field names */
    const db = { ...updates }
    if ('disciplineIndex' in db) { db.streak = db.disciplineIndex; delete db.disciplineIndex }
    if ('disciplinePoints' in db) { db.discipline_points = db.disciplinePoints; delete db.disciplinePoints }
    if ('lastLoginDate' in db) { db.last_login = db.lastLoginDate; delete db.lastLoginDate }

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...db }, { onConflict: 'id' })
    if (error) console.error('updateProfile:', error)
  } catch (err) {
    console.error('updateProfile:', err)
  }
}

export async function upsertProfile(userId, data) {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...data }, { onConflict: 'id' })
    if (error) console.error('upsertProfile:', error)
  } catch (err) {
    console.error('upsertProfile:', err)
  }
}

/* ─── Focus sessions ─────────────────────────────────────── */

export async function saveFocusSession({ userId, duration, xpEarned, coinsEarned, intent }) {
  try {
    const { error } = await supabase
      .from('focus_sessions')
      .insert({ user_id: userId, duration, xp_earned: xpEarned, coins_earned: coinsEarned, intent })
    if (error) console.error('saveFocusSession:', error)
  } catch (err) {
    console.error('saveFocusSession:', err)
  }
}

export async function getTodayFocus(userId) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { data, error } = await supabase
      .from('focus_sessions')
      .select('duration, xp_earned, coins_earned')
      .eq('user_id', userId)
      .gte('created_at', today.toISOString())
    if (error) { console.error('getTodayFocus:', error); return { mins: 0, xp: 0, sessions: 0 } }
    return {
      mins:     (data || []).reduce((s, r) => s + r.duration, 0),
      xp:       (data || []).reduce((s, r) => s + r.xp_earned, 0),
      sessions: (data || []).length,
    }
  } catch (err) {
    console.error('getTodayFocus:', err)
    return { mins: 0, xp: 0, sessions: 0 }
  }
}

/* ─── Confessions ────────────────────────────────────────── */

export async function saveConfession({ userId, text, trigger, app }) {
  try {
    const { data, error } = await supabase
      .from('confessions')
      .insert({ user_id: userId, text, trigger, app })
      .select()
    if (error) { console.error('saveConfession:', error); return null }
    return data?.[0] || null
  } catch (err) {
    console.error('saveConfession:', err)
    return null
  }
}

export async function deleteConfession(confessionId) {
  try {
    const { error } = await supabase
      .from('confessions')
      .delete()
      .eq('id', confessionId)
    if (error) console.error('deleteConfession:', error)
  } catch (err) {
    console.error('deleteConfession:', err)
  }
}

export async function clearAllConfessions(userId) {
  try {
    const { error } = await supabase
      .from('confessions')
      .delete()
      .eq('user_id', userId)
    if (error) console.error('clearAllConfessions:', error)
  } catch (err) {
    console.error('clearAllConfessions:', err)
  }
}

export async function getConfessions(userId, limit = 50) {
  try {
    const { data, error } = await supabase
      .from('confessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) { console.error('getConfessions:', error); return [] }
    return data || []
  } catch (err) {
    console.error('getConfessions:', err)
    return []
  }
}

export async function getTotalFocus(userId) {
  try {
    const { data, error } = await supabase
      .from('focus_sessions')
      .select('duration')
      .eq('user_id', userId)
    if (error) { console.error('getTotalFocus:', error); return 0 }
    return (data || []).reduce((s, r) => s + r.duration, 0)
  } catch (err) {
    console.error('getTotalFocus:', err)
    return 0
  }
}

/* ─── Intentions ─────────────────────────────────────────── */

export async function saveTodayIntention(userId, text) {
  try {
    const today = new Date().toISOString().split('T')[0]
    const { error } = await supabase
      .from('intentions')
      .upsert(
        { user_id: userId, text, date: today },
        { onConflict: 'user_id,date' }
      )
    if (error) console.error('saveTodayIntention:', error)
  } catch (err) {
    console.error('saveTodayIntention:', err)
  }
}

export async function getTodayIntention(userId) {
  try {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('intentions')
      .select('text')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle()
    if (error) { console.error('getTodayIntention:', error); return '' }
    return data?.text || ''
  } catch (err) {
    console.error('getTodayIntention:', err)
    return ''
  }
}
