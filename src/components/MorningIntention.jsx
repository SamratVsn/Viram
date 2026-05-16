import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiQuillPenLine, RiCheckLine, RiSunLine, RiMoonLine, RiEmotionLine, RiEmotionUnhappyLine, RiEmotionNormalLine } from 'react-icons/ri'
import { supabase } from '../lib/supabase'
import { saveTodayIntention, updateProfile, getProfile, getTodayIntention, saveIntentionCheckin, getIntentionCheckin } from '../lib/db'
import AdvancementToast, { checkCoinMilestone } from './AdvancementToast'

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
  const [advancement, setAdvancement] = useState(null)
  const [showCheckin, setShowCheckin] = useState(false)
  const [checkinAnswer, setCheckinAnswer] = useState(null)
  const userIdRef = useRef(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        userIdRef.current = user.id
        getTodayIntention(user.id).then(supabaseText => {
          if (supabaseText) {
            setSavedIntention(supabaseText)
            setInitialized(true)
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
              try {
                const local = JSON.parse(stored)
                if (local.date === new Date().toDateString() && local.timestamp > Date.now() - 60000) {
                  setSavedIntention(local.text)
                }
              } catch { /* ignore */ }
            }
            // Check if already answered today
            getIntentionCheckin(user.id, new Date().toISOString().split('T')[0]).then(answer => {
              if (answer) {
                setCheckinAnswer(answer)
              } else {
                // Show check-in anytime intention is set (not just evening)
                setShowCheckin(true)
              }
            })
            return
          }
          fallback()
        }).catch(() => fallback())
      } else {
        fallback()
      }
    })
    function fallback() {
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
    }
  }, [])

  function handleCheckin(answer) {
    setCheckinAnswer(answer)
    setShowCheckin(false)
    if (userIdRef.current) {
      const today = new Date().toISOString().split('T')[0]
      saveIntentionCheckin(userIdRef.current, today, answer)
    }
  }

  function saveIntention() {
    if (!input.trim()) return
    const text = input.trim()
    const data = { text, date: new Date().toDateString(), timestamp: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setSavedIntention(text)
    setShowModal(false)

    // TODO: remove localStorage fallback after migration
    if (userIdRef.current) {
      saveTodayIntention(userIdRef.current, text)
    }

    // Award 1 coin for setting morning intention (once per day)
    const coinKey = 'viram_morning_coin_date'
    if (localStorage.getItem(coinKey) !== new Date().toDateString()) {
      if (userIdRef.current) {
        getProfile(userIdRef.current).then(profile => {
          const currentCoins = profile?.coins || 0
          const newCoins = currentCoins + 1

          updateProfile(userIdRef.current, { coins: newCoins })

          /* Mirror to localStorage */
          const lsUser = JSON.parse(localStorage.getItem('viram_user') || '{}')
          lsUser.coins = newCoins
          localStorage.setItem('viram_user', JSON.stringify(lsUser))
          localStorage.setItem(coinKey, new Date().toDateString())

          const milestone = checkCoinMilestone(currentCoins, newCoins)
          if (milestone) {
            setTimeout(() => setAdvancement(milestone), 600)
          }
        })
      } else {
        /* Fallback: localStorage only (no auth) */
        const lsUser = JSON.parse(localStorage.getItem('viram_user') || '{}')
        const oldCoins = lsUser.coins || 0
        lsUser.coins = oldCoins + 1
        localStorage.setItem('viram_user', JSON.stringify(lsUser))
        localStorage.setItem(coinKey, new Date().toDateString())

        const milestone = checkCoinMilestone(oldCoins, lsUser.coins)
        if (milestone) {
          setTimeout(() => setAdvancement(milestone), 600)
        }
      }
    }
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
            cursor: 'pointer',
          }}
          onClick={() => setShowCheckin(true)}
        >
          <RiQuillPenLine size={14} color={T.accent} style={{ flexShrink: 0 }} />
          <span style={{
            fontFamily: T.heading, fontStyle: 'italic', fontWeight: 500,
            fontSize: 14, color: T.inkHigh, lineHeight: 1.4, flex: 1,
          }}>
            {savedIntention}
          </span>
          {checkinAnswer && (
            <span style={{
              fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 600,
              color: checkinAnswer === 'yes' ? T.green : checkinAnswer === 'partial' ? T.accent : '#B85E5E',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              {checkinAnswer === 'yes' ? '✓ Lived it' : checkinAnswer === 'partial' ? '~ Partial' : '✗ Missed'}
            </span>
          )}
          {!checkinAnswer && <RiMoonLine size={14} color={T.accentDim} style={{ flexShrink: 0 }} />}
        </motion.div>
      )}

      {/* ── End-of-day check-in ────────────────────────────── */}
      <AnimatePresence>
        {showCheckin && savedIntention && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease }}
            style={{
              padding: '16px 18px', marginBottom: 12,
              background: T.card, border: `1px solid ${T.borderMid}`,
              borderRadius: T.rLg,
            }}
          >
            <div style={{
              fontFamily: T.heading, fontWeight: 600, fontSize: 15,
              color: T.inkHigh, marginBottom: 4, textAlign: 'center',
            }}>
              Did you live by your intention today?
            </div>
            <p style={{
              fontFamily: T.body, fontWeight: 300, fontSize: 11,
              color: T.inkMid, textAlign: 'center', marginBottom: 14,
              fontStyle: 'italic',
            }}>
              "{savedIntention}"
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              {[
                { id: 'yes', icon: RiEmotionLine, label: 'Yes', color: T.green, bg: 'rgba(107,143,94,0.10)', border: 'rgba(107,143,94,0.25)' },
                { id: 'partial', icon: RiEmotionNormalLine, label: 'Partially', color: T.accent, bg: T.accentBg, border: T.accentBorder },
                { id: 'no', icon: RiEmotionUnhappyLine, label: 'No', color: '#B85E5E', bg: 'rgba(184,94,94,0.08)', border: 'rgba(184,94,94,0.20)' },
              ].map(({ id, icon: Icon, label, color, bg, border }) => (
                <motion.button
                  key={id}
                  whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleCheckin(id)}
                  style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 5,
                    padding: '10px 8px', borderRadius: 14,
                    background: checkinAnswer === id ? bg : T.cardDeep,
                    border: `1px solid ${checkinAnswer === id ? border : T.border}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Icon size={18} color={color} />
                  <span style={{
                    fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 600,
                    color: checkinAnswer === id ? color : T.inkLow,
                    letterSpacing: '0.04em',
                  }}>
                    {checkinAnswer === id ? '✓ ' : ''}{label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AdvancementToast
        visible={!!advancement}
        onDismiss={() => setAdvancement(null)}
        {...advancement}
      />
    </>
  )
}
