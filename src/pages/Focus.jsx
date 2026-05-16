import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiArrowLeftLine, RiPlayFill, RiPauseFill,
  RiRefreshLine, RiCheckLine, RiFireLine,
  RiTimerFlashLine, RiSparkling2Line, RiQuillPenLine,
  RiLeafLine, RiAlarmWarningLine,
} from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import AdvancementToast, { checkCoinMilestone, ACHIEVEMENTS } from '../components/AdvancementToast'
import { supabase } from '../lib/supabase'
import { getTodayFocus, saveFocusSession, getProfile, updateProfile } from '../lib/db'
import { loadPrefs } from './Setting'

/* ─── Tokens ─────────────────────────────────────────────── */
const T = {
  /* Light (idle) */
  bg:           '#F4EEE3',
  card:         '#F9F5EC',
  cardDeep:     '#EDE5D4',
  inkHigh:      '#2A2218',
  inkMid:       '#5A4E42',
  inkLow:       '#8A7B6E',
  border:       'rgba(55,38,22,0.07)',
  borderMid:    'rgba(55,38,22,0.13)',
  accent:       '#B8704E',
  accentBg:     'rgba(184,112,78,0.09)',
  accentBorder: 'rgba(184,112,78,0.22)',
  /* Dark (running) */
  darkBg:       '#1C1510',
  darkCard:     '#251C15',
  darkBorder:   'rgba(255,235,210,0.07)',
  darkInkHigh:  '#F5EEE3',
  darkInkMid:   '#C4B09A',
  darkInkLow:   '#7A6A5A',
  /* Fonts */
  heading:      "'Cormorant Garamond', Georgia, serif",
  body:         "'Jost', system-ui, sans-serif",
  rSm: '8px', rMd: '14px', rLg: '22px', rXl: '32px', rPill: '100px',
}

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`
const ease = [0.22, 1, 0.36, 1]

const QUOTES = [
  { text: 'The successful warrior is the average person with laser-like focus.', author: 'Bruce Lee' },
  { text: 'Deep work is the ability to focus without distraction on a cognitively demanding task.', author: 'Cal Newport' },
  { text: 'You do not rise to your goals. You fall to your systems.', author: 'James Clear' },
  { text: 'In an age of distraction, paying attention is a form of rebellion.', author: 'Pico Iyer' },
  { text: 'Boredom is not the enemy. It is the doorway to presence.', author: 'Viram' },
  { text: 'Every minute you guard your attention is a minute you own your life.', author: 'Viram' },
]

/* Flow phases by time elapsed */
function getPhase(elapsed, total) {
  const pct = elapsed / total
  if (pct === 0)    return { label: 'Ready to focus',   sub: 'Take one slow breath before starting.' }
  if (pct < 0.12)   return { label: 'Settling in',       sub: 'Let the noise fade. You are here.' }
  if (pct < 0.55)   return { label: 'Deep flow',         sub: 'You\'re in it. Stay.' }
  if (pct < 0.85)   return { label: 'Peak focus',        sub: 'This is where growth happens.' }
  return              { label: 'Final stretch',           sub: 'Almost there. Hold the line.' }
}

const GLOBAL = `
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  @keyframes breath {
    0%,100% { transform:scale(1);    opacity:1;   }
    50%      { transform:scale(1.04); opacity:0.8; }
  }
  @keyframes breath-ring {
    0%,100% { filter:drop-shadow(0 0 8px rgba(184,112,78,0.25)); }
    50%      { filter:drop-shadow(0 0 22px rgba(184,112,78,0.55)); }
  }
  @keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1);   }
    50%     { opacity:.4; transform:scale(.6); }
  }
  @keyframes shimmer {
    from { background-position: -200% center; }
    to   { background-position:  200% center; }
  }
  @keyframes fade-up {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes complete-pop {
    0%   { opacity:0; transform:scale(0.82) translateY(20px); }
    60%  { transform:scale(1.03) translateY(-4px); }
    100% { opacity:1; transform:scale(1) translateY(0); }
  }
  @keyframes complete-glow {
    0%   { filter:drop-shadow(0 0 4px rgba(107,143,94,0.2)); }
    50%  { filter:drop-shadow(0 0 24px rgba(107,143,94,0.6)); }
    100% { filter:drop-shadow(0 0 4px rgba(107,143,94,0.2)); }
  }

  .breath-ring { animation: breath-ring 4s ease-in-out infinite; }
  .breath-time { animation: breath 4s ease-in-out infinite; }
  .complete-ring { animation: complete-glow 1.6s ease-in-out infinite; }

  .intent-input {
    background: transparent;
    border: none;
    outline: none;
    width: 100%;
    font-family: ${T.heading};
    font-style: italic;
    font-size: 17px;
    color: ${T.inkHigh};
    text-align: center;
    resize: none;
    line-height: 1.5;
  }
  .intent-input::placeholder { color: rgba(55,38,22,0.22); }
  .intent-input-dark {
    color: ${T.darkInkHigh};
  }
  .intent-input-dark::placeholder { color: rgba(245,238,227,0.2); }

  .dur-btn { transition: all 0.2s ease; }
  .dur-btn:hover:not(:disabled) { transform:translateY(-2px); }
`

export default function Focus() {
  const navigate   = useNavigate()
  const timerRef    = useRef(null)
  const inputRef    = useRef(null)
  const startTimeRef = useRef(null)
  const accumRef     = useRef(0)

  const prefs = loadPrefs()
  const [durMin, setDurMin]         = useState(prefs.defaultPomodoro)
  const [secs, setSecs]             = useState(prefs.defaultPomodoro * 60)
  const [running, setRunning]       = useState(false)
  const [elapsed, setElapsed]       = useState(0)
  const [done, setDone]             = useState(false)
  const [sessions, setSessions]     = useState(0)
  const [xpEarned, setXpEarned]    = useState(0)
  const [minsDone, setMinsDone]     = useState(0)
  const [intent, setIntent]         = useState('')
  const [intentLocked, setIntentLocked] = useState(false)
  const [quote, setQuote]           = useState(QUOTES[0])
  const [showComplete, setShowComplete] = useState(false)
  const [lastXp, setLastXp]         = useState(0)
  const [advancement, setAdvancement] = useState(null)

  const total  = durMin * 60
  const R      = 96
  const circ   = 2 * Math.PI * R
  const pct    = secs / total
  const offset = circ * pct
  const phase  = getPhase(elapsed, total)
  const isDark = running

  /* Load today's focus stats from Supabase + localStorage fallback */
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        getTodayFocus(user.id).then(today => {
          if (today.mins > 0) {
            setSessions(today.sessions)
            setMinsDone(today.mins)
            setXpEarned(today.xp)
          }
        }).catch(err => console.error('getTodayFocus:', err))
      }
    }).catch(err => console.error('getUser:', err))
    const saved = localStorage.getItem('viram_focus_today')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.date === new Date().toDateString()) {
        if (d.mins > 0) {
          setSessions(d.sessions || 0)
          setMinsDone(d.mins || 0)
          setXpEarned(d.xp || 0)
        }
      }
    }
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])
  }, [])

  function saveFocusStats(newSessions, newMins, newXp) {
    localStorage.setItem('viram_focus_today', JSON.stringify({
      date: new Date().toDateString(),
      sessions: newSessions,
      mins: newMins,
      xp: newXp,
    }))
    // TODO: remove localStorage fallback after migration
  }

  function setDuration(min) {
    if (running) return
    setDurMin(min)
    accumRef.current = 0
    startTimeRef.current = null
    setSecs(min * 60)
    setElapsed(0)
    setDone(false)
  }

  function toggleTimer() {
    if (done) return
    if (running) {
      clearInterval(timerRef.current)
      accumRef.current += Date.now() - startTimeRef.current
      setRunning(false)
    } else {
      if (!intentLocked && intent.trim()) setIntentLocked(true)
      startTimeRef.current = Date.now()
      setRunning(true)
      timerRef.current = setInterval(() => {
        const elapsedMs = accumRef.current + (Date.now() - startTimeRef.current)
        const elapsedSec = Math.floor(elapsedMs / 1000)
        const remaining = Math.max(0, durMin * 60 - elapsedSec)
        setSecs(remaining)
        setElapsed(elapsedSec)
        if (remaining <= 0) {
          clearInterval(timerRef.current)
          setRunning(false)
          completeSession()
        }
      }, 200)
    }
  }

  function resetTimer() {
    clearInterval(timerRef.current)
    setRunning(false)
    accumRef.current = 0
    startTimeRef.current = null
    setSecs(durMin * 60)
    setElapsed(0)
    setDone(false)
    setShowComplete(false)
    setIntentLocked(false)
  }

  function completeSession() {
    const xpGained = Math.round(30 + durMin * 1.4)
    const newSessions = sessions + 1
    const newMins     = minsDone + durMin
    const newXp       = xpEarned + xpGained

    setSessions(newSessions)
    setMinsDone(newMins)
    setXpEarned(newXp)
    setLastXp(xpGained)
    setDone(true)
    setShowComplete(true)
    saveFocusStats(newSessions, newMins, newXp)

    const coinsEarned = Math.floor(durMin / 5)

    /* Source of truth: Supabase profile */
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        saveFocusSession({ userId: authUser.id, duration: durMin, xpEarned: xpGained, coinsEarned, intent }).catch(err => console.error('saveFocusSession:', err))
        getProfile(authUser.id).then(profile => {
          const currentCoins = profile?.coins || 0
          const newCoins = currentCoins + coinsEarned
          const currentXp = profile?.xp || 0

          updateProfile(authUser.id, {
            coins: newCoins,
            xp: currentXp + xpGained,
          }).catch(err => console.error('updateProfile:', err))

          /* Mirror to localStorage */
          const lsUser = JSON.parse(localStorage.getItem('viram_user') || '{}')
          lsUser.coins = newCoins
          lsUser.focusMins = (lsUser.focusMins || 0) + durMin
          localStorage.setItem('viram_user', JSON.stringify(lsUser))

          const milestone = checkCoinMilestone(currentCoins, newCoins)
          setTimeout(() => {
            if (milestone) setAdvancement(milestone)
            else setAdvancement(ACHIEVEMENTS.focusSession(durMin))
          }, 1400)
        })
      } else {
        /* Fallback: localStorage only (no auth) */
        const lsUser = JSON.parse(localStorage.getItem('viram_user') || '{}')
        const oldCoins = lsUser.coins || 0
        lsUser.coins = oldCoins + coinsEarned
        lsUser.focusMins = (lsUser.focusMins || 0) + durMin
        localStorage.setItem('viram_user', JSON.stringify(lsUser))

        const milestone = checkCoinMilestone(oldCoins, lsUser.coins)
        setTimeout(() => {
          if (milestone) setAdvancement(milestone)
          else setAdvancement(ACHIEVEMENTS.focusSession(durMin))
        }, 1400)
      }
    })

    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])
    setTimeout(() => setShowComplete(false), 4500)
  }

  useEffect(() => () => clearInterval(timerRef.current), [])

  const mm = Math.floor(secs / 60)
  const ss = secs % 60

  /* ── Colors by mode ──────────────────────────────────────── */
  const bg       = isDark ? T.darkBg    : T.bg
  const cardC    = isDark ? T.darkCard  : T.card
  const inkH     = isDark ? T.darkInkHigh : T.inkHigh
  const inkM     = isDark ? T.darkInkMid  : T.inkMid
  const inkL     = isDark ? T.darkInkLow  : T.inkLow
  const borderC  = isDark ? T.darkBorder  : T.border
  const borderMC = isDark ? 'rgba(255,235,210,0.12)' : T.borderMid

  return (
    <>
      <SEO title="Focus Timer" description="Deep work sessions with Pomodoro timing. Stay focused, earn XP, and build your discipline streak with Viram." noIndex />
      <style>{GLOBAL}</style>

      <motion.div
        animate={{ background: bg }}
        transition={{ duration: 1.1, ease }}
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Grain */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: GRAIN, backgroundSize: '180px', backgroundRepeat: 'repeat', opacity: 0.065,
        }} />

        {/* Ambient glow when running */}
        <AnimatePresence>
          {isDark && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              style={{
                position: 'absolute', top: '30%', left: '50%',
                transform: 'translateX(-50%)',
                width: 360, height: 360, borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(184,112,78,0.12) 0%, transparent 70%)',
                filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0,
              }}
            />
          )}
        </AnimatePresence>

        {/* ── Header ──────────────────────────────────────────── */}
        <motion.div
          animate={{ borderBottomColor: borderC, background: isDark ? 'rgba(28,21,16,0.95)' : 'rgba(249,245,236,0.96)' }}
          transition={{ duration: 1 }}
          style={{
            flexShrink: 0, position: 'relative', zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 18px',
            borderBottom: `1px solid ${borderC}`,
            backdropFilter: 'blur(14px)',
            boxShadow: `0 1px 0 ${borderC}`,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
            onClick={() => { clearInterval(timerRef.current); navigate('/dashboard') }}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: isDark ? 'rgba(255,235,210,0.07)' : T.cardDeep,
              border: `1px solid ${borderMC}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: inkL, cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <RiArrowLeftLine size={15} />
          </motion.button>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: T.heading, fontWeight: 700, fontSize: 16,
              letterSpacing: '0.12em', color: inkH, lineHeight: 1,
            }}>
              VI<span style={{ color: T.accent }}>RAM</span>
            </div>
            <div style={{ fontFamily: T.body, fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: inkL, marginTop: 1 }}>
              Focus Engine
            </div>
          </div>

          {/* Today's session count */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 11px', borderRadius: T.rPill,
            background: T.accentBg, border: `1px solid ${T.accentBorder}`,
          }}>
            <RiFireLine size={10} color={T.accent} />
            <span style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 13, color: isDark ? T.darkInkHigh : T.inkHigh }}>{sessions}</span>
            <span style={{ fontFamily: T.body, fontWeight: 300, fontSize: 9, color: inkL }}>today</span>
          </div>
        </motion.div>

        {/* ── Body ────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 18px 32px' }}>

          {/* ── Intent field ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease }}
            style={{
              width: '100%', maxWidth: 380,
              background: cardC,
              border: `1px solid ${intentLocked ? T.accentBorder : borderC}`,
              borderLeft: `3px solid ${intentLocked ? T.accent : 'transparent'}`,
              borderRadius: T.rLg,
              padding: '13px 16px',
              marginBottom: 20,
              boxShadow: `0 2px 10px rgba(55,38,22,0.06)`,
              transition: 'border-color 0.4s ease, background 1s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <RiQuillPenLine size={10} color={intentLocked ? T.accent : inkL} />
              <span style={{ fontFamily: T.body, fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: intentLocked ? T.accent : inkL }}>
                {intentLocked ? 'Working on' : 'Set your intent'}
              </span>
              {intentLocked && (
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.accent, display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
                </div>
              )}
            </div>
            <textarea
              ref={inputRef}
              rows={1}
              placeholder="What are you protecting your time for?"
              value={intent}
              onChange={e => { if (!intentLocked) setIntent(e.target.value) }}
              className={`intent-input${isDark ? ' intent-input-dark' : ''}`}
              style={{ pointerEvents: intentLocked ? 'none' : 'auto' }}
            />
          </motion.div>

          {/* ── Duration selector ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5, ease }}
            style={{ display: 'flex', gap: 8, marginBottom: 28 }}
          >
            {[15, 25, 45, 60].map(min => {
              const active = durMin === min
              return (
                <button
                  key={min}
                  className="dur-btn"
                  onClick={() => setDuration(min)}
                  disabled={running}
                  style={{
                    padding: '7px 16px', borderRadius: T.rPill,
                    fontFamily: T.body, fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
                    background: active ? T.accent : cardC,
                    color: active ? '#FFF8F2' : inkL,
                    border: `1px solid ${active ? T.accent : borderMC}`,
                    boxShadow: active ? `0 4px 14px rgba(184,112,78,0.28)` : `0 1px 4px rgba(55,38,22,0.06)`,
                    cursor: running ? 'not-allowed' : 'pointer',
                    opacity: running && !active ? 0.4 : 1,
                    transition: 'all 0.25s ease',
                  }}
                >
                  {min}m
                </button>
              )
            })}
          </motion.div>

          {/* ── Timer ring ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.7, ease }}
            style={{ position: 'relative', width: 240, height: 240, marginBottom: 28, flexShrink: 0 }}
          >
            {/* Outer decorative ring */}
            <svg style={{ position: 'absolute', inset: -18, width: 'calc(100% + 36px)', height: 'calc(100% + 36px)', opacity: 0.35 }} viewBox="0 0 276 276">
              <circle cx="138" cy="138" r="132" fill="none" stroke={T.accent} strokeWidth="0.8" strokeDasharray="4 14"
                style={{ transformOrigin: 'center', animation: running ? 'none' : undefined }}
              />
            </svg>

            {/* SVG ring */}
            <svg
              viewBox="0 0 220 220"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}
              className={done ? 'complete-ring' : running ? 'breath-ring' : ''}
            >
              <defs>
                <linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={T.accent} />
                  <stop offset="100%" stopColor="rgba(184,112,78,0.5)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              {/* Track */}
              <circle cx="110" cy="110" r={R} fill="none" stroke={isDark ? 'rgba(255,235,210,0.07)' : 'rgba(55,38,22,0.07)'} strokeWidth="5" />
              {/* Segments tick marks */}
              {Array.from({ length: 60 }).map((_, i) => {
                const angle = (i / 60) * 360 * (Math.PI / 180)
                const isQuarter = i % 15 === 0
                const inner = R - (isQuarter ? 8 : 4)
                const outer = R + 1
                const x1 = 110 + inner * Math.cos(angle)
                const y1 = 110 + inner * Math.sin(angle)
                const x2 = 110 + outer * Math.cos(angle)
                const y2 = 110 + outer * Math.sin(angle)
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={isDark ? 'rgba(255,235,210,0.06)' : 'rgba(55,38,22,0.06)'}
                    strokeWidth={isQuarter ? 1.5 : 0.8}
                  />
                )
              })}
              {/* Progress */}
              <motion.circle
                cx="110" cy="110" r={R}
                fill="none"
                stroke={done ? '#6B8F5E' : 'url(#fg)'}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circ.toFixed(2)}
                animate={{ strokeDashoffset: done ? 0 : offset.toFixed(2) }}
                transition={{ duration: running ? 1 : 0.5, ease: 'linear' }}
                filter={running ? 'url(#glow)' : undefined}
              />
            </svg>

            {/* Center display */}
            <div
              className={running ? 'breath-time' : ''}
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 2,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${mm}:${ss}`}
                  initial={{ opacity: 0.6, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    fontFamily: T.heading,
                    fontSize: done ? 38 : 54,
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    color: done ? '#6B8F5E' : inkH,
                    lineHeight: 1,
                    transition: 'color 1s ease, font-size 0.4s ease',
                  }}
                >
                  {done
                    ? <RiCheckLine size={46} color="#6B8F5E" />
                    : `${mm}:${ss.toString().padStart(2, '0')}`
                  }
                </motion.div>
              </AnimatePresence>

              {/* Phase label */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase.label}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    fontFamily: T.body, fontSize: 9, fontWeight: 600,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: running ? T.accent : inkL,
                    marginTop: 6,
                  }}
                >
                  {done ? 'Complete' : phase.label}
                </motion.div>
              </AnimatePresence>

              {/* Breathing cue */}
              {running && !done && (
                <div style={{
                  fontFamily: T.body, fontSize: 8, fontWeight: 300,
                  color: isDark ? 'rgba(245,238,227,0.3)' : 'rgba(55,38,22,0.25)',
                  marginTop: 4, letterSpacing: '0.08em', fontStyle: 'italic',
                }}>
                  {phase.sub}
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Controls ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5, ease }}
            style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 28 }}
          >
            {/* Reset */}
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
              onClick={resetTimer}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                background: isDark ? 'rgba(255,235,210,0.06)' : T.cardDeep,
                border: `1px solid ${borderMC}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: inkL, cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <RiRefreshLine size={16} />
            </motion.button>

            {/* Play / Pause */}
            <motion.button
              whileHover={{ y: -2, boxShadow: `0 16px 38px rgba(184,112,78,0.35)` }}
              whileTap={{ y: 0, scale: 0.97 }}
              transition={{ duration: 0.26, ease }}
              onClick={done ? resetTimer : toggleTimer}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '13px 32px', borderRadius: T.rPill,
                background: done ? '#6B8F5E' : T.accent,
                border: 'none',
                color: '#FFF8F2',
                fontFamily: T.body, fontWeight: 700, fontSize: 13,
                letterSpacing: '0.09em', textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: `0 6px 22px rgba(184,112,78,0.28)`,
                transition: 'background 0.4s ease, box-shadow 0.25s ease',
              }}
            >
              {done
                ? <><RiRefreshLine size={15} /> New session</>
                : running
                  ? <><RiPauseFill size={15} /> Pause</>
                  : <><RiPlayFill  size={15} /> {secs < total ? 'Resume' : 'Begin'}</>
              }
            </motion.button>

            {/* Placeholder right side for balance */}
            <div style={{ width: 44, height: 44 }} />
          </motion.div>

          {/* ── Today's stats ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5, ease }}
            style={{
              width: '100%', maxWidth: 380,
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              gap: 10, marginBottom: 22,
            }}
          >
            {[
              { icon: RiTimerFlashLine, val: sessions,         label: 'Sessions', c: T.accent  },
              { icon: RiSparkling2Line, val: xpEarned,         label: 'XP',       c: T.inkMid  },
              { icon: RiLeafLine,       val: `${minsDone}m`,   label: 'Focused',  c: '#6B8F5E' },
            ].map(({ icon: Icon, val, label, c }) => (
              <div key={label} style={{
                background: cardC, border: `1px solid ${borderC}`,
                borderRadius: T.rLg, padding: '12px 10px',
                textAlign: 'center',
                boxShadow: `0 2px 8px rgba(55,38,22,0.05)`,
                transition: 'background 1s ease',
              }}>
                <Icon size={13} color={c} style={{ margin: '0 auto 5px', display: 'block' }} />
                <motion.div
                  key={val}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 0.35 }}
                  style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 24, color: inkH, lineHeight: 1 }}
                >
                  {val}
                </motion.div>
                <div style={{ fontFamily: T.body, fontWeight: 300, fontSize: 9, color: inkL, marginTop: 3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* ── Quote card ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5, ease }}
            style={{
              width: '100%', maxWidth: 380,
              background: cardC,
              border: `1px solid ${borderC}`,
              borderLeft: `3px solid ${T.accentBorder}`,
              borderRadius: T.rLg,
              padding: '16px 18px',
              boxShadow: `0 2px 10px rgba(55,38,22,0.05)`,
              transition: 'background 1s ease, border-color 1s ease',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={quote.text}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45 }}
              >
                <p style={{
                  fontFamily: T.heading, fontStyle: 'italic', fontWeight: 600,
                  fontSize: 14.5, color: inkM, lineHeight: 1.65, marginBottom: 8,
                }}>
                  "{quote.text}"
                </p>
                <div style={{
                  fontFamily: T.body, fontSize: 9.5, fontWeight: 500,
                  letterSpacing: '0.1em', textTransform: 'uppercase', color: inkL,
                }}>
                  — {quote.author}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>

        {/* ── Session complete overlay ─────────────────────── */}
        <AnimatePresence>
          {showComplete && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 60,
                background: 'rgba(28,21,16,0.72)',
                backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 24,
              }}
              onClick={() => setShowComplete(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.84, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.6, ease }}
                style={{
                  background: T.card,
                  border: `1px solid ${T.border}`,
                  borderTop: `3px solid #6B8F5E`,
                  borderRadius: T.rXl,
                  padding: '40px 36px',
                  maxWidth: 340, width: '100%',
                  textAlign: 'center',
                  boxShadow: `0 24px 64px rgba(28,21,16,0.40)`,
                }}
                onClick={e => e.stopPropagation()}
              >
                {/* Check mark */}
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'rgba(107,143,94,0.12)',
                  border: '1px solid rgba(107,143,94,0.30)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', color: '#6B8F5E',
                }}>
                  <RiCheckLine size={28} />
                </div>

                <div style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 34, letterSpacing: '-0.02em', color: T.inkHigh, lineHeight: 1, marginBottom: 10 }}>
                  Session complete.
                </div>
                <p style={{ fontFamily: T.body, fontWeight: 300, fontSize: 13.5, color: T.inkMid, lineHeight: 1.7, marginBottom: 24 }}>
                  {intent ? `"${intent}" — done.` : 'Your focus strengthens the practice.'}<br />
                  Your avatar grows stronger.
                </p>

                {/* XP badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '8px 20px', borderRadius: T.rPill,
                  background: T.accentBg, border: `1px solid ${T.accentBorder}`,
                  marginBottom: 28,
                }}>
                  <RiSparkling2Line size={13} color={T.accent} />
                  <span style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 18, color: T.inkHigh }}>+{lastXp}</span>
                  <span style={{ fontFamily: T.body, fontWeight: 300, fontSize: 11, color: T.inkLow }}>XP earned</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    onClick={() => { setShowComplete(false); resetTimer() }}
                    style={{
                      padding: '12px 24px', borderRadius: T.rPill,
                      background: T.accent, border: 'none',
                      color: '#FFF8F2', fontFamily: T.body, fontWeight: 600,
                      fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase',
                      cursor: 'pointer', boxShadow: `0 4px 16px rgba(184,112,78,0.25)`,
                    }}
                  >
                    Another round
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                      padding: '11px 24px', borderRadius: T.rPill,
                      background: 'transparent', border: `1px solid ${T.border}`,
                      color: T.inkLow, fontFamily: T.body, fontWeight: 500,
                      fontSize: 13, letterSpacing: '0.04em',
                      cursor: 'pointer',
                    }}
                  >
                    Back to dashboard
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      <AdvancementToast
        visible={!!advancement}
        onDismiss={() => setAdvancement(null)}
        {...advancement}
      />
    </>
  )
}