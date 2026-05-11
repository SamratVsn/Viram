import { useState, useCallback } from 'react'

function loadAll() {
  let user = null
  try {
    const raw = localStorage.getItem('viram_user')
    if (raw) user = JSON.parse(raw)
  } catch {}

  let focus = null
  try {
    const raw = localStorage.getItem('viram_focus_today')
    if (raw) {
      const p = JSON.parse(raw)
      if (p.date === new Date().toDateString()) focus = p
    }
  } catch {}

  let confessions = []
  try {
    const raw = localStorage.getItem('viram_confessions')
    if (raw) confessions = JSON.parse(raw)
  } catch {}

  let intention = null
  try {
    const raw = localStorage.getItem('viram_morning_intention')
    if (raw) {
      const p = JSON.parse(raw)
      if (p.date === new Date().toDateString()) intention = p
    }
  } catch {}

  return { user, focus, confessions, intention }
}

export default function useViramData() {
  const [data, setData] = useState(loadAll)
  const refresh = useCallback(() => setData(loadAll()), [])
  return { ...data, refresh }
}
