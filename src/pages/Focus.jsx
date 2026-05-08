import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiArrowLeftLine, RiPlayFill, RiPauseFill, RiRefreshLine } from 'react-icons/ri'
import { useNavigate } from "react-router-dom";

/* ─── Font loader ─────────────────────────────────────────────────────────── */
const FontLoader = () => (
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap"
  />
)

/* ─── Grain overlay ───────────────────────────────────────────────────────── */
const Grain = () => (
  <div
    aria-hidden="true"
    className="absolute inset-0 pointer-events-none z-0"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)' opacity='0.03'/%3E%3C/svg%3E")`,
    }}
  />
)

const QUOTES = [
  { text: 'The successful warrior is the average person with laser-like focus.', author: 'Bruce Lee' },
  { text: 'Deep work is the ability to focus without distraction.', author: 'Cal Newport' },
  { text: 'You do not rise to your goals. You fall to your systems.', author: 'James Clear' },
  { text: 'In an age of distraction, paying attention is luxury.', author: 'Pico Iyer' },
  { text: 'The quality of your attention determines the quality of your life.', author: 'Winifred Gallagher' },
  { text: 'Focus is the gateway to all achievement.', author: 'James Altucher' },
]

export default function Focus({ G, setG }) {
  const [durMin, setDurMin]         = useState(25)
  const [secs, setSecs]             = useState(25 * 60)
  const [running, setRunning]       = useState(false)
  const [phase, setPhase]           = useState('Ready to focus')
  const [sessions, setSessions]     = useState(0)
  const [xpEarned, setXpEarned]     = useState(0)
  const [minsDone, setMinsDone]     = useState(0)
  const [quote, setQuote]           = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)])
  const [sessionComplete, setSessionComplete] = useState(false)
  const timerRef                    = useRef(null)
  const total                       = durMin * 60
  const circumference               = 2 * Math.PI * 96

  const comboMultiplier = () => Math.round(Math.pow(1 + 0.15 * G.streak, 1.4) * 100) / 100

  const setDuration = (min) => {
    if (running) return
    setDurMin(min)
    setSecs(min * 60)
  }

  const toggleTimer = () => {
    if (running) {
      clearInterval(timerRef.current)
      setRunning(false)
      setPhase('Paused')
    } else {
      setRunning(true)
      setPhase('Deep focus...')
      timerRef.current = setInterval(() => {
        setSecs(s => {
          if (s <= 1) {
            clearInterval(timerRef.current)
            setRunning(false)
            completeSession()
            return 0
          }
          return s - 1
        })
      }, 1000)
    }
  }

  const resetTimer = () => {
    clearInterval(timerRef.current)
    setRunning(false)
    setSecs(total)
    setPhase('Ready to focus')
    setSessionComplete(false)
  }

  const completeSession = () => {
    const mult = comboMultiplier()
    const xpGained = Math.round((40 + durMin) * mult)
    
    setSessions(s => s + 1)
    setXpEarned(x => x + xpGained)
    setMinsDone(m => m + durMin)
    setSessionComplete(true)
    setPhase('Session Complete!')

    setG(g => ({
      ...g,
      xp: Math.min(999, g.xp + xpGained),
      energy: Math.min(100, g.energy + 10),
      disc: Math.min(100, g.disc + 7),
      hp: Math.min(100, g.hp + 6),
      debt: Math.max(0, g.debt - 18),
      streak: g.streak + 1,
      logs: [
        {
          text: `Deep work session complete (${durMin}min)`,
          xp: xpGained,
          color: '#B8704E',
        },
        ...g.logs,
      ],
    }))

    // Random new quote after completion
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])
  }

  useEffect(() => () => clearInterval(timerRef.current), [])

  const minutes = Math.floor(secs / 60)
  const seconds = secs % 60
  const progressPercent = secs / total
  const strokeOffset = circumference - circumference * (1 - progressPercent)

  const navigate = useNavigate();

  return (
    <>
      <FontLoader />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col overflow-hidden"
        style={{ background: '#F4EEE3' }}
      >
        <Grain />

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div
          className="relative z-[1] flex items-center gap-3 px-6 h-[56px] flex-shrink-0"
          style={{
            borderBottom: '1px solid rgba(55,38,22,0.07)',
            boxShadow: '0 1px 3px rgba(42,34,24,0.06)',
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer"
            style={{
              background: '#EDE8DF',
              border: '1px solid rgba(55,38,22,0.12)',
              color: '#8A7E74',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E0DAD0'
              e.currentTarget.style.color = '#2A2218'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#EDE8DF'
              e.currentTarget.style.color = '#8A7E74'
            }}
          >
            <RiArrowLeftLine size={16} />
          </motion.button>

          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: '#2A2218',
            }}
          >
            Focus Engine
          </div>
        </div>

        {/* ── Main content ──────────────────────────────────────────────── */}
        <div className="relative z-[1] flex-1 flex flex-col items-center justify-center px-6 text-center">

          {/* Duration buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-3 mb-12"
          >
            {[25, 30, 45, 60].map(min => (
              <motion.button
                key={min}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDuration(min)}
                disabled={running}
                className="px-4 py-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  background: durMin === min ? '#B8704E' : '#F9F5EC',
                  color: durMin === min ? '#F9F5EC' : '#8A7E74',
                  border: `1px solid ${durMin === min ? '#B8704E' : 'rgba(55,38,22,0.12)'}`,
                  boxShadow: durMin === min ? '0 4px 14px rgba(184,112,78,0.22)' : '0 1px 3px rgba(42,34,24,0.06)',
                }}
              >
                {min}m
              </motion.button>
            ))}
          </motion.div>

          {/* Timer circle ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-64 h-64 mb-12"
          >
            {/* Background circle */}
            <svg
              viewBox="0 0 220 220"
              className="absolute inset-0 -rotate-90"
              style={{ width: '100%', height: '100%' }}
            >
              <defs>
                <linearGradient id="focusGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#B8704E" />
                  <stop offset="100%" stopColor="rgba(184,112,78,0.4)" />
                </linearGradient>
              </defs>

              {/* Base circle */}
              <circle
                fill="none"
                stroke="rgba(55,38,22,0.07)"
                strokeWidth="6"
                cx="110"
                cy="110"
                r="96"
              />

              {/* Progress circle */}
              <motion.circle
                fill="none"
                stroke="url(#focusGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                cx="110"
                cy="110"
                r="96"
                strokeDasharray={circumference.toFixed(1)}
                strokeDashoffset={strokeOffset.toFixed(1)}
                animate={{ strokeDashoffset: strokeOffset.toFixed(1) }}
                transition={{ duration: running ? 1 : 0.3, ease: 'linear' }}
              />
            </svg>

            {/* Time display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                key={`${minutes}:${seconds.toString().padStart(2, '0')}`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5 }}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 56,
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: '#2A2218',
                  lineHeight: 1,
                }}
              >
                {minutes}:{seconds.toString().padStart(2, '0')}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#A89B8C',
                  marginTop: 8,
                }}
              >
                {phase}
              </motion.div>
            </div>
          </motion.div>

          {/* Quote card ──────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-[340px] mb-10 p-6 rounded-[18px]"
            style={{
              background: '#F9F5EC',
              border: '1px solid rgba(55,38,22,0.10)',
              boxShadow: '0 2px 10px rgba(42,34,24,0.05)',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={quote.text}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                <p
                  className="mb-[10px] italic leading-[1.75]"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 15,
                    color: '#5A4E42',
                    fontStyle: 'italic',
                  }}
                >
                  "{quote.text}"
                </p>
                <div
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    color: '#C4B8A8',
                    textTransform: 'uppercase',
                  }}
                >
                  — {quote.author}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Controls ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 mb-10"
          >
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTimer}
              className="flex items-center gap-2 px-8 py-3 rounded-full cursor-pointer font-semibold transition-all duration-200"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: '#2A2218',
                color: '#F9F5EC',
                boxShadow: '0 4px 16px rgba(42,34,24,0.14), 0 1px 4px rgba(42,34,24,0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(42,34,24,0.20), 0 2px 8px rgba(42,34,24,0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(42,34,24,0.14), 0 1px 4px rgba(42,34,24,0.08)'
              }}
            >
              {running ? <RiPauseFill size={15} /> : <RiPlayFill size={15} />}
              {running ? 'Pause' : secs < total ? 'Resume' : 'Start'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetTimer}
              className="flex items-center justify-center w-12 h-12 rounded-full cursor-pointer transition-all duration-200"
              style={{
                background: '#EDE8DF',
                border: '1px solid rgba(55,38,22,0.12)',
                color: '#8A7E74',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#E0DAD0'
                e.currentTarget.style.borderColor = 'rgba(55,38,22,0.18)'
                e.currentTarget.style.color = '#2A2218'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#EDE8DF'
                e.currentTarget.style.borderColor = 'rgba(55,38,22,0.12)'
                e.currentTarget.style.color = '#8A7E74'
              }}
            >
              <RiRefreshLine size={16} />
            </motion.button>
          </motion.div>

          {/* Stats grid ──────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-6"
          >
            {[
              { value: sessions, label: 'Sessions', color: '#B8704E' },
              { value: xpEarned, label: 'XP Earned', color: '#8A7E74' },
              { value: minsDone, label: 'Mins', color: '#5A4E42' },
            ].map(({ value, label, color }) => (
              <div key={label} className="text-center">
                <motion.div
                  key={value}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 28,
                    fontWeight: 600,
                    color,
                    letterSpacing: '-0.01em',
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {value}
                </motion.div>
                <div
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#C4B8A8',
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Session complete message ────────────────────────────────── */}
          <AnimatePresence>
            {sessionComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
              >
                <motion.div
                  animate={{ scale: [0.8, 1] }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center pointer-events-auto"
                >
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 48,
                      fontWeight: 600,
                      color: '#B8704E',
                      letterSpacing: '-0.02em',
                      marginBottom: 12,
                    }}
                  >
                    Session Complete ✓
                  </div>
                  <div
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 14,
                      fontWeight: 400,
                      color: '#5A4E42',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Your avatar grows stronger.
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  )
}