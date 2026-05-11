import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // eslint-disable-line no-unused-vars
import { RiQuillPenLine, RiCheckLine, RiSunLine } from 'react-icons/ri'

const T = {
  bg: '#F4EEE3', card: '#F9F5EC',
  inkHigh: '#2A2218', inkMid: '#5A4E42', inkLow: '#8A7B6E',
  border: 'rgba(55,38,22,0.07)', borderMid: 'rgba(55,38,22,0.13)',
  accent: '#B8704E', accentBg: 'rgba(184,112,78,0.08)', accentBorder: 'rgba(184,112,78,0.22)',
  green: '#6B8F5E',
  heading: "'Cormorant Garamond', Georgia, serif", body: "'Jost', system-ui, sans-serif",
  rLg: '22px', rPill: '100px',
}
const ease = [0.22, 1, 0.36, 1]
const STORAGE_KEY = 'viram_morning_intention'

export default function MorningIntention() {
  const [showModal, setShowModal] = useState(false)
  const [savedIntention, setSavedIntention] = useState('')
  const [input, setInput] = useState('')
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        if (data.date === new Date().toDateString()) {
          setSavedIntention(data.text)
          setInitialized(true)
          return
        }
      } catch { /* ignore */ }
    }
    setShowModal(true)
    setInitialized(true)
  }, [])

  function saveIntention() {
    if (!input.trim()) return
    const data = { text: input.trim(), date: new Date().toDateString(), timestamp: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setSavedIntention(input.trim())
    setShowModal(false)
  }

  if (!initialized) return null

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(28,21,16,0.72)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.84, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.6, ease }}
              style={{
                background: T.card, border: `1px solid ${T.border}`,
                borderTop: `3px solid ${T.accent}`, borderRadius: 28,
                padding: '36px 32px', maxWidth: 360, width: '100%',
                textAlign: 'center', boxShadow: '0 24px 64px rgba(28,21,16,0.40)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: T.accentBg, border: `1px solid ${T.accentBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 18px', color: T.accent,
              }}>
                <RiSunLine size={24} />
              </div>

              <div style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 24, color: T.inkHigh, lineHeight: 1.2, marginBottom: 8 }}>
                Morning Anchor
              </div>
              <p style={{ fontFamily: T.body, fontWeight: 300, fontSize: 13, color: T.inkMid, lineHeight: 1.7, marginBottom: 20 }}>
                What is the one thing you will achieve today instead of scrolling?
              </p>
              <textarea
                rows={3}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Write your intention..."
                style={{
                  width: '100%', background: T.bg,
                  border: `1px solid ${T.borderMid}`, borderRadius: 16,
                  padding: '14px 16px', fontFamily: T.heading, fontStyle: 'italic',
                  fontSize: 16, color: T.inkHigh, resize: 'none', outline: 'none',
                  marginBottom: 20, lineHeight: 1.6,
                }}
              />
              <motion.button
                whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                onClick={saveIntention}
                style={{
                  width: '100%', padding: '13px 24px', borderRadius: T.rPill,
                  background: T.accent, border: 'none', cursor: 'pointer',
                  fontFamily: T.body, fontWeight: 600, fontSize: 13,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: '#FFF8F2', opacity: input.trim() ? 1 : 0.5,
                  boxShadow: `0 4px 16px rgba(184,112,78,0.25)`,
                }}
              >
                Set Intention
              </motion.button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  marginTop: 10, background: 'none', border: 'none',
                  fontFamily: T.body, fontSize: 11, color: T.inkLow,
                  cursor: 'pointer', padding: '6px 12px',
                }}
              >
                Skip for today
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {savedIntention && !showModal && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 18px', marginBottom: 12,
            background: T.accentBg, border: `1px solid ${T.accentBorder}`,
            borderRadius: T.rLg,
          }}
        >
          <RiQuillPenLine size={14} color={T.accent} style={{ flexShrink: 0 }} />
          <span style={{
            fontFamily: T.heading, fontStyle: 'italic', fontWeight: 500,
            fontSize: 14, color: T.inkHigh, lineHeight: 1.4, flex: 1,
          }}>
            {savedIntention}
          </span>
          <RiCheckLine size={14} color={T.green} style={{ flexShrink: 0 }} />
        </motion.div>
      )}
    </>
  )
}
