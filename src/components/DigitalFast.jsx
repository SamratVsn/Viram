import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { RiCheckLine, RiAlertLine, RiSwordLine } from 'react-icons/ri'

const T = {
  bg: '#F4EEE3', card: '#F9F5EC', cardDeep: '#EDE5D4',
  inkHigh: '#2A2218', inkMid: '#5A4E42', inkLow: '#8A7B6E',
  border: 'rgba(55,38,22,0.07)', borderMid: 'rgba(55,38,22,0.13)',
  accent: '#B8704E', accentBg: 'rgba(184,112,78,0.08)', accentBorder: 'rgba(184,112,78,0.22)',
  green: '#6B8F5E', greenBg: 'rgba(107,143,94,0.10)', greenBorder: 'rgba(107,143,94,0.25)',
  red: '#B85E5E', redBg: 'rgba(184,94,94,0.08)',
  heading: "'Cormorant Garamond', Georgia, serif", body: "'Jost', system-ui, sans-serif",
  rLg: '22px', rPill: '100px',
}
const FAST_DURATION = 120 * 60 * 1000
const STORAGE_KEY = 'viram_digital_fast'

function grantPoints(onComplete) {
  const user = JSON.parse(localStorage.getItem('viram_user') || '{}')
  user.disciplinePoints = (user.disciplinePoints || 0) + 10
  localStorage.setItem('viram_user', JSON.stringify(user))
  if (onComplete) onComplete()
}

export default function DigitalFast({ onComplete }) {
  const [status, setStatus] = useState('idle')
  const [remaining, setRemaining] = useState(FAST_DURATION)
  const pollRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.status === 'running') {
          const elapsed = Date.now() - data.startTime
          if (elapsed >= FAST_DURATION) {
            setStatus('completed')
            setRemaining(0)
            grantPoints(onComplete)
          } else {
            setStatus('running')
            setRemaining(FAST_DURATION - elapsed)
          }
        } else if (data.status === 'broken') {
          setStatus('broken')
          setRemaining(0)
        }
      } catch { /* ignore */ }
    }
  }, [])

  useEffect(() => {
    function handleVisibility() {
      if (status !== 'running') return
      if (document.visibilityState === 'hidden') {
        clearInterval(pollRef.current)
        setStatus('broken')
        setRemaining(0)
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          startTime: Date.now(),
          status: 'broken',
        }))
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [status])

  useEffect(() => {
    if (status === 'running') {
      pollRef.current = setInterval(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (!saved) return
        const data = JSON.parse(saved)
        if (data.status === 'broken') {
          clearInterval(pollRef.current)
          setStatus('broken')
          setRemaining(0)
          return
        }
        const elapsed = Date.now() - data.startTime
        const rem = Math.max(0, FAST_DURATION - elapsed)
        setRemaining(rem)
        if (rem <= 0) {
          clearInterval(pollRef.current)
          setStatus('completed')
          setRemaining(0)
          grantPoints(onComplete)
        }
      }, 500)
    }
    return () => clearInterval(pollRef.current)
  }, [status])

  function startFast() {
    const startTime = Date.now()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ startTime, status: 'running' }))
    setStatus('running')
    setRemaining(FAST_DURATION)
  }

  function resetFast() {
    localStorage.removeItem(STORAGE_KEY)
    setStatus('idle')
    setRemaining(FAST_DURATION)
  }

  const hrs = Math.floor(remaining / 3600000)
  const mins = Math.floor((remaining % 3600000) / 60000)
  const secs = Math.floor((remaining % 60000) / 1000)
  const pct = 1 - remaining / FAST_DURATION

  return (
    <>
      <style>{`
        @keyframes pulse-fast { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.04); } }
        @keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
      `}</style>

      <div style={{
        background: T.card, border: `1px solid ${
          status === 'completed' ? T.greenBorder :
          status === 'broken' ? 'rgba(184,94,94,0.25)' :
          status === 'running' ? T.accentBorder : T.border
        }`,
        borderRadius: T.rLg, padding: '18px 20px',
        boxShadow: `0 2px 12px rgba(55,38,22,0.06), inset 0 1px 0 rgba(255,255,255,0.55)`,
        position: 'relative', overflow: 'hidden',
      }}>
        {status === 'running' && (
          <div style={{
            position: 'absolute', top: 0, left: 0, height: 2.5,
            width: `${pct * 100}%`,
            background: `linear-gradient(90deg, ${T.accent}, ${T.green})`,
            transition: 'width 1s linear',
          }} />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: status !== 'idle' ? 14 : 0 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: status === 'completed' ? T.greenBg :
                        status === 'broken' ? T.redBg :
                        status === 'running' ? T.accentBg : T.cardDeep,
            border: `1px solid ${
              status === 'completed' ? T.greenBorder :
              status === 'broken' ? 'rgba(184,94,94,0.25)' :
              status === 'running' ? T.accentBorder : T.borderMid
            }`,
            color: status === 'completed' ? T.green :
                   status === 'broken' ? T.red :
                   status === 'running' ? T.accent : T.inkLow,
          }}>
            {status === 'completed' ? <RiCheckLine size={16} /> :
             status === 'broken' ? <RiAlertLine size={16} /> :
             <RiSwordLine size={16} />}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: T.heading, fontWeight: 700, fontSize: 15,
              color: T.inkHigh, lineHeight: 1.2,
            }}>
              {status === 'completed' ? 'Fast Completed!' :
               status === 'broken' ? 'Fast Broken' :
               '2-Hour Digital Fast'}
            </div>
            <div style={{
              fontFamily: T.body, fontWeight: 300, fontSize: 10.5,
              color: status === 'running' ? T.accent : T.inkLow,
              marginTop: 1,
            }}>
              {status === 'completed' ? '+10 Discipline Points earned' :
               status === 'broken' ? 'You left the tab — discipline wavered' :
               status === 'running' ? 'Stay on this tab to succeed' :
               'No scrolling. Full focus. 120 min challenge.'}
            </div>
          </div>

          {status === 'idle' && (
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
              onClick={startFast}
              style={{
                padding: '9px 20px', borderRadius: T.rPill,
                background: T.accent, border: 'none', cursor: 'pointer',
                fontFamily: T.body, fontWeight: 600, fontSize: 11,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#FFF8F2', whiteSpace: 'nowrap',
                boxShadow: `0 4px 14px rgba(184,112,78,0.25)`,
              }}
            >
              Start Fast
            </motion.button>
          )}
        </div>

        {(status === 'running' || status === 'completed' || status === 'broken') && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{
              fontFamily: T.heading, fontWeight: 700, fontSize: 32,
              letterSpacing: '-0.02em', lineHeight: 1,
              color: status === 'completed' ? T.green :
                     status === 'broken' ? T.red : T.inkHigh,
              animation: status === 'broken' ? 'shake 0.5s ease-in-out' : undefined,
            }}>
              {status === 'completed' ? 'Done' :
               status === 'broken' ? 'Broken' :
               `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {status === 'running' && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontFamily: T.body, fontSize: 9, color: T.inkLow,
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: T.accent, display: 'inline-block',
                    animation: 'pulse-fast 2s ease-in-out infinite',
                  }} />
                  Tracking
                </div>
              )}

              {status === 'running' && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={resetFast}
                  style={{
                    padding: '6px 14px', borderRadius: T.rPill,
                    background: 'transparent', border: `1px solid ${T.borderMid}`,
                    cursor: 'pointer', color: T.inkLow, fontFamily: T.body,
                    fontSize: 10, fontWeight: 500,
                  }}
                >
                  Cancel
                </motion.button>
              )}

              {(status === 'completed' || status === 'broken') && (
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                  onClick={resetFast}
                  style={{
                    padding: '7px 16px', borderRadius: T.rPill,
                    background: T.accent, border: 'none', cursor: 'pointer',
                    fontFamily: T.body, fontWeight: 600, fontSize: 10,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: '#FFF8F2',
                    boxShadow: `0 4px 14px rgba(184,112,78,0.25)`,
                  }}
                >
                  Try Again
                </motion.button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
