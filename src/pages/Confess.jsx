import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiArrowLeftLine,
  RiSendPlaneLine,
  RiDeleteBinLine,
  RiLockLine,
  RiTimeLine,
  RiLeafLine,
} from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'

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

/* ─── Pulse dot ───────────────────────────────────────────────────────────── */
const PulseDot = ({ color = '#B8704E' }) => (
  <motion.span
    animate={{ opacity: [1, 0.35, 1], scale: [1, 0.55, 1] }}
    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
    className="inline-block w-[5px] h-[5px] rounded-full flex-shrink-0"
    style={{ background: color }}
  />
)

/* ─── Storage key ─────────────────────────────────────────────────────────── */
const STORAGE_KEY = 'viram_confessions'
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function loadConfessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    // purge entries older than 30 days
    const now = Date.now()
    return parsed.filter(c => now - c.timestamp < THIRTY_DAYS)
  } catch {
    return []
  }
}

function saveConfessions(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {}
}

function daysRemaining(timestamp) {
  const diff = THIRTY_DAYS - (Date.now() - timestamp)
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)))
}

function timeAgo(timestamp) {
  const secs  = Math.floor((Date.now() - timestamp) / 1000)
  if (secs <    60)             return 'just now'
  if (secs <  3600)             return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400)             return `${Math.floor(secs / 3600)}h ago`
  const d = Math.floor(secs / 86400)
  return d === 1 ? 'yesterday' : `${d} days ago`
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

/* ─── Expiry bar ──────────────────────────────────────────────────────────── */
function ExpiryBar({ timestamp }) {
  const days = daysRemaining(timestamp)
  const pct  = (days / 30) * 100
  const color = days <= 3 ? '#B8704E' : days <= 10 ? '#C49A6C' : '#A89B8C'

  return (
    <div className="flex items-center gap-2 mt-3">
      <div
        className="flex-1 h-[2px] rounded-full overflow-hidden"
        style={{ background: 'rgba(55,38,22,0.07)' }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: color, opacity: 0.7 }}
        />
      </div>
      <span
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: '0.08em',
          color,
          whiteSpace: 'nowrap',
        }}
      >
        {days === 0 ? 'Expires today' : `${days}d left`}
      </span>
    </div>
  )
}

/* ─── Single confession card ─────────────────────────────────────────────── */
function ConfessionCard({ confession, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [hovered, setHovered]             = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0,  scale: 1     }}
      exit={{    opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.3 } }}
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-[18px] p-6 overflow-hidden transition-all duration-250"
      style={{
        background: hovered ? '#F9F5EC' : '#F5F0E8',
        border: `1px solid ${hovered ? 'rgba(55,38,22,0.14)' : 'rgba(55,38,22,0.09)'}`,
        boxShadow: hovered
          ? '0 6px 20px rgba(42,34,24,0.08), 0 2px 6px rgba(42,34,24,0.05)'
          : '0 1px 4px rgba(42,34,24,0.05)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirmDelete(false) }}
    >
      <Grain />

      {/* Top row: time + delete */}
      <div className="relative z-[1] flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-[6px]">
          <RiTimeLine size={11} style={{ color: '#C4B8A8' }} />
          <span
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.08em',
              color: '#C4B8A8',
            }}
          >
            {timeAgo(confession.timestamp)} · {formatDate(confession.timestamp)}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {confirmDelete ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2"
            >
              <span
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 10,
                  fontWeight: 500,
                  color: '#8A7E74',
                  letterSpacing: '0.04em',
                }}
              >
                Release this?
              </span>
              <button
                onClick={() => onDelete(confession.id)}
                className="px-3 py-1 rounded-full cursor-pointer text-[10px] font-semibold transition-all duration-150"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  letterSpacing: '0.06em',
                  background: '#B8704E',
                  color: '#F9F5EC',
                  border: 'none',
                }}
              >
                Release
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1 rounded-full cursor-pointer text-[10px] font-semibold transition-all duration-150"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  letterSpacing: '0.06em',
                  background: 'transparent',
                  color: '#A89B8C',
                  border: '1px solid rgba(55,38,22,0.12)',
                }}
              >
                Keep
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="delete"
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered ? 1 : 0 }}
              onClick={() => setConfirmDelete(true)}
              className="flex items-center justify-center w-7 h-7 rounded-full cursor-pointer transition-all duration-150"
              style={{
                background: 'rgba(184,112,78,0.08)',
                border: '1px solid rgba(184,112,78,0.15)',
                color: '#B8704E',
              }}
            >
              <RiDeleteBinLine size={12} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Confession text */}
      <p
        className="relative z-[1] leading-[1.85]"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 16,
          fontStyle: 'italic',
          color: '#2A2218',
          wordBreak: 'break-word',
        }}
      >
        {confession.text}
      </p>

      {/* Expiry bar */}
      <div className="relative z-[1]">
        <ExpiryBar timestamp={confession.timestamp} />
      </div>
    </motion.div>
  )
}

/* ─── Empty state ─────────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-6"
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
        style={{
          background: 'rgba(184,112,78,0.08)',
          border: '1px solid rgba(184,112,78,0.14)',
        }}
      >
        <RiLeafLine size={22} style={{ color: '#C4B8A8' }} />
      </div>
      <p
        className="mb-2"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 20,
          fontWeight: 600,
          color: '#2A2218',
          letterSpacing: '-0.01em',
        }}
      >
        Nothing here yet.
      </p>
      <p
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 13,
          fontWeight: 400,
          color: '#A89B8C',
          lineHeight: 1.75,
          letterSpacing: '0.01em',
          maxWidth: 280,
          margin: '0 auto',
        }}
      >
        This space holds no judgment. Confess honestly — awareness is the first step toward change.
      </p>
    </motion.div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function Confess({ onBack }) {
  const [confessions, setConfessions] = useState([])
  const [draft,       setDraft]       = useState('')
  const [submitting,  setSubmitting]  = useState(false)
  const [charCount,   setCharCount]   = useState(0)
  const textareaRef                   = useRef(null)
  const MAX_CHARS                     = 400

  /* Load from localStorage on mount, purge expired */
  useEffect(() => {
    const loaded = loadConfessions()
    setConfessions(loaded)
    saveConfessions(loaded)           // persist after purge
  }, [])

  /* Auto-resize textarea */
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${ta.scrollHeight}px`
  }, [draft])

  const handleChange = (e) => {
    const val = e.target.value
    if (val.length > MAX_CHARS) return
    setDraft(val)
    setCharCount(val.length)
  }

  const handleSubmit = () => {
    const text = draft.trim()
    if (!text || submitting) return

    setSubmitting(true)

    setTimeout(() => {
      const newEntry = {
        id:        `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        text,
        timestamp: Date.now(),
      }
      const updated = [newEntry, ...confessions]
      setConfessions(updated)
      saveConfessions(updated)
      setDraft('')
      setCharCount(0)
      setSubmitting(false)

      // Award 1 coin for confession
      const cUser = JSON.parse(localStorage.getItem('viram_user') || '{}')
      cUser.coins = (cUser.coins || 0) + 1
      localStorage.setItem('viram_user', JSON.stringify(cUser))

      // Reset textarea height
      if (textareaRef.current) textareaRef.current.style.height = 'auto'
    }, 320)
  }

  const handleDelete = (id) => {
    const updated = confessions.filter(c => c.id !== id)
    setConfessions(updated)
    saveConfessions(updated)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
  }

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

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div
          className="relative z-[1] flex items-center justify-between px-6 h-[56px] flex-shrink-0"
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
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: '#2A2218',
            }}
          >
            Confessions
          </div>

          {/* Private indicator */}
          <div
            className="flex items-center gap-[6px] px-3 py-[4px] rounded-full"
            style={{
              background: 'rgba(184,112,78,0.08)',
              border: '1px solid rgba(184,112,78,0.14)',
            }}
          >
            <RiLockLine size={9} style={{ color: '#B8704E' }} />
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#B8704E',
              }}
            >
              Private
            </span>
          </div>
        </div>

        {/* ── Scrollable body ─────────────────────────────────────────── */}
        <div className="relative z-[1] flex-1 overflow-y-auto">
          <div className="max-w-[620px] mx-auto px-6 pt-8 pb-10">

            {/* ── Intro text ────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 text-center"
            >
              <h1
                className="mb-2 leading-[1.05]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(28px, 5vw, 40px)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: '#2A2218',
                }}
              >
                What did you do today<br />
                <span style={{ fontStyle: 'italic', color: '#A89B8C' }}>that you're not proud of?</span>
              </h1>
              <p
                className="mt-3"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 13,
                  fontWeight: 400,
                  color: '#A89B8C',
                  lineHeight: 1.75,
                  letterSpacing: '0.01em',
                  maxWidth: 380,
                  margin: '12px auto 0',
                }}
              >
                No judgment. No audience. Confessions disappear after 30 days —
                seen only by the user.
              </p>
            </motion.div>

            {/* ── Input card ────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-[22px] overflow-hidden mb-8"
              style={{
                background: '#F9F5EC',
                border: '1px solid rgba(55,38,22,0.12)',
                boxShadow: '0 4px 16px rgba(42,34,24,0.07), 0 1px 4px rgba(42,34,24,0.05)',
              }}
            >
              <Grain />

              {/* Terracotta top bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background: 'linear-gradient(90deg, #B8704E, rgba(184,112,78,0.3), transparent)',
                  opacity: 0.8,
                }}
              />

              <div className="relative z-[1] p-6">
                <div
                  className="mb-4 flex items-center gap-2"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#B8704E',
                  }}
                >
                  <PulseDot />
                  Today's confession
                </div>

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="I spent two hours scrolling when I should have been working on what matters..."
                  rows={3}
                  className="w-full resize-none outline-none bg-transparent leading-[1.85]"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 17,
                    fontStyle: draft ? 'italic' : 'normal',
                    color: '#2A2218',
                    caretColor: '#B8704E',
                    minHeight: 88,
                  }}
                />

                {/* Footer: char count + submit */}
                <div className="flex items-center justify-between mt-4 pt-4"
                  style={{ borderTop: '1px solid rgba(55,38,22,0.07)' }}>
                  <div className="flex items-center gap-3">
                    <span
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontSize: 11,
                        fontWeight: 400,
                        color: charCount > MAX_CHARS * 0.85 ? '#B8704E' : '#C4B8A8',
                        letterSpacing: '0.04em',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {charCount} / {MAX_CHARS}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontSize: 10,
                        color: '#C4B8A8',
                        letterSpacing: '0.04em',
                      }}
                    >
                      ⌘ + Enter to confess
                    </span>
                  </div>

                  <motion.button
                    whileHover={draft.trim() ? { y: -2 } : {}}
                    whileTap={draft.trim() ? { scale: 0.97 } : {}}
                    onClick={handleSubmit}
                    disabled={!draft.trim() || submitting}
                    className="flex items-center gap-2 px-5 py-[9px] rounded-full cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      background: '#2A2218',
                      color: '#F9F5EC',
                      border: 'none',
                      boxShadow: draft.trim()
                        ? '0 4px 14px rgba(42,34,24,0.16)'
                        : 'none',
                    }}
                  >
                    <motion.div
                      animate={submitting ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.5, ease: 'linear' }}
                    >
                      <RiSendPlaneLine size={13} />
                    </motion.div>
                    {submitting ? 'Confessing...' : 'Confess'}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* ── Past confessions ──────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.24 }}
            >
              {/* Section heading */}
              {confessions.length > 0 && (
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-[rgba(55,38,22,0.07)]" />
                  <span
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: '#C4B8A8',
                    }}
                  >
                    {confessions.length} {confessions.length === 1 ? 'Confession' : 'Confessions'}
                  </span>
                  <div className="flex-1 h-px bg-[rgba(55,38,22,0.07)]" />
                </div>
              )}

              <AnimatePresence mode="popLayout">
                {confessions.length === 0 ? (
                  <EmptyState key="empty" />
                ) : (
                  <div className="flex flex-col gap-3">
                    {confessions.map(c => (
                      <ConfessionCard
                        key={c.id}
                        confession={c}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>

              {/* Bottom note */}
              {confessions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center mt-10"
                >
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: 'italic',
                      fontSize: 13,
                      color: '#C4B8A8',
                      letterSpacing: '0.02em',
                      lineHeight: 1.75,
                    }}
                  >
                    Each confession fades after 30 days.<br />
                    The growth it prompted stays forever.
                  </p>
                </motion.div>
              )}
            </motion.div>

          </div>
        </div>
      </motion.div>
    </>
  )
}