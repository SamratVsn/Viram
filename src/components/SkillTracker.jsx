import { useState, useEffect, useRef } from 'react'
import {
  RiAddLine, RiTimerFlashLine, RiPlayFill, RiPauseFill,
  RiCheckLine, RiDeleteBinLine, RiBookOpenLine, RiQuillPenLine,

} from 'react-icons/ri'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { updateProfile, getProfile } from '../lib/db'
import AdvancementToast, { checkCoinMilestone } from './AdvancementToast'

const T = {
  bg: '#F4EEE3', card: '#F9F5EC', cardDeep: '#EDE5D4',
  inkHigh: '#2A2218', inkMid: '#5A4E42', inkLow: '#8A7B6E',
  border: 'rgba(55,38,22,0.07)', borderMid: 'rgba(55,38,22,0.13)',
  accent: '#B8704E', accentBg: 'rgba(184,112,78,0.08)', accentBorder: 'rgba(184,112,78,0.22)',
  accentDim: 'rgba(184,112,78,0.40)',
  green: '#6B8F5E', greenBg: 'rgba(107,143,94,0.10)', greenBorder: 'rgba(107,143,94,0.25)',
  heading: "'Cormorant Garamond', Georgia, serif", body: "'Jost', system-ui, sans-serif",
  rSm: '8px', rMd: '14px', rLg: '22px', rPill: '100px',
}
const TWENTY_HOUR_MINUTES = 1200

function loadSkills() {
  try { return JSON.parse(localStorage.getItem('viram_skills') || '[]') } catch { return [] }
}

function saveSkills(skills) {
  localStorage.setItem('viram_skills', JSON.stringify(skills))
}

let idCounter = Date.now()
function genId() { return (++idCounter).toString(36) }

function MilestoneInput({ show, onSave }) {
  const [text, setText] = useState('')
  if (!show) return null
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      style={{ overflow: 'hidden', marginTop: 12 }}
    >
      <div style={{
        background: T.bg, borderRadius: T.rMd,
        padding: '12px 14px', border: `1px solid ${T.borderMid}`,
      }}>
        <div style={{ fontFamily: T.body, fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.inkLow, marginBottom: 6 }}>
          What exactly did you learn/build?
        </div>
        <textarea
          rows={2}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Describe your progress..."
          style={{
            width: '100%', background: T.card,
            border: `1px solid ${T.border}`, borderRadius: T.rSm,
            padding: '8px 10px', fontFamily: T.heading, fontStyle: 'italic',
            fontSize: 13, color: T.inkHigh, resize: 'none', outline: 'none',
            marginBottom: 8, lineHeight: 1.5,
          }}
        />
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { onSave(text.trim() || 'Focused session completed'); setText('') }}
          style={{
            padding: '7px 18px', borderRadius: T.rPill,
            background: T.accent, border: 'none', cursor: 'pointer',
            fontFamily: T.body, fontWeight: 600, fontSize: 10,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#FFF8F2',
          }}
        >
          Log Milestone
        </motion.button>
      </div>
    </motion.div>
  )
}

function SkillCard({ skill, onDelete, onUpdate }) {
  const [running, setRunning] = useState(false)
  const [mins, setMins] = useState(0)
  const [secs, setSecs] = useState(0)
  const [showMilestone, setShowMilestone] = useState(false)
  const timerRef = useRef(null)
  const startRef = useRef(null)
  const accumRef = useRef(0)
  const sessionMinsRef = useRef(0)
  const userIdRef = useRef(null)

  const [advancement, setAdvancement] = useState(null)
  const progress = Math.min(skill.totalMinutes / TWENTY_HOUR_MINUTES, 1)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) userIdRef.current = user.id
    })
    return () => clearInterval(timerRef.current)
  }, [])

  function toggleTimer() {
    if (running) {
      clearInterval(timerRef.current)
      accumRef.current += Date.now() - startRef.current
      setRunning(false)
    } else {
      startRef.current = Date.now()
      setRunning(true)
      timerRef.current = setInterval(() => {
        const elapsedMs = accumRef.current + (Date.now() - startRef.current)
        const elapsedSec = Math.floor(elapsedMs / 1000)
        setMins(Math.floor(elapsedSec / 60))
        setSecs(elapsedSec % 60)
        sessionMinsRef.current = Math.round(elapsedSec / 60)
      }, 200)
    }
  }

  function stopAndLog() {
    clearInterval(timerRef.current)
    const elapsedMs = accumRef.current + (Date.now() - startRef.current)
    accumRef.current = 0
    startRef.current = null
    const sessionMin = Math.max(1, Math.round(Math.floor(elapsedMs / 1000) / 60))
    sessionMinsRef.current = sessionMin
    setRunning(false)
    setMins(0)
    setSecs(0)
    setShowMilestone(true)
  }

  function saveMilestone(milestoneText) {
    const skills = loadSkills()
    const idx = skills.findIndex(s => s.id === skill.id)
    if (idx === -1) return

    const sessionMin = sessionMinsRef.current
    skills[idx].totalMinutes += sessionMin
    skills[idx].milestones = [...(skills[idx].milestones || []), {
      text: milestoneText,
      timestamp: Date.now(),
      duration: sessionMin,
    }]
    saveSkills(skills)
    setShowMilestone(false)

    if (userIdRef.current) {
      getProfile(userIdRef.current).then(profile => {
        const currentCoins = profile?.coins || 0
        const coinsToAdd = Math.floor(sessionMin / 5)
        const newCoins = currentCoins + coinsToAdd

        updateProfile(userIdRef.current, { coins: newCoins })

        /* Mirror to localStorage */
        const lsUser = JSON.parse(localStorage.getItem('viram_user') || '{}')
        lsUser.coins = newCoins
        lsUser.focusMins = (lsUser.focusMins || 0) + sessionMin
        localStorage.setItem('viram_user', JSON.stringify(lsUser))

        if (onUpdate) onUpdate()

        const milestone = checkCoinMilestone(currentCoins, newCoins)
        if (milestone) {
          setTimeout(() => setAdvancement(milestone), 600)
        }
      })
    } else {
      /* Fallback: localStorage only (no auth) */
      const lsUser = JSON.parse(localStorage.getItem('viram_user') || '{}')
      const oldCoins = lsUser.coins || 0
      const coinsToAdd = Math.floor(sessionMin / 5)
      lsUser.coins = oldCoins + coinsToAdd
      lsUser.focusMins = (lsUser.focusMins || 0) + sessionMin
      localStorage.setItem('viram_user', JSON.stringify(lsUser))

      if (onUpdate) onUpdate()

      const milestone = checkCoinMilestone(oldCoins, lsUser.coins)
      if (milestone) {
        setTimeout(() => setAdvancement(milestone), 600)
      }
    }
  }

  const progressPct = Math.round(progress * 100)

  return (
    <div style={{
      background: T.card,
      border: `1px solid ${running ? T.accentBorder : T.border}`,
      borderRadius: T.rLg, padding: '16px 18px',
      boxShadow: running ? `0 0 0 1px ${T.accentBorder}, 0 4px 16px rgba(184,112,78,0.10)` : `0 2px 8px rgba(55,38,22,0.05)`,
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RiBookOpenLine size={13} color={T.accent} />
          <span style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 16, color: T.inkHigh }}>
            {skill.name}
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(skill.id)}
          style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'transparent', border: 'none',
            cursor: 'pointer', color: T.inkLow, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            opacity: 0.5, transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
        >
          <RiDeleteBinLine size={13} />
        </motion.button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: T.body, fontWeight: 300, fontSize: 10, color: T.inkLow }}>
            {skill.totalMinutes} / {TWENTY_HOUR_MINUTES} min
          </span>
          <span style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 12, color: progress >= 1 ? T.green : T.accent }}>
            {progressPct}%
          </span>
        </div>
        <div style={{ height: 5, borderRadius: T.rPill, background: T.border, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: T.rPill,
            background: progress >= 1 ? T.green : T.accent,
            width: `${progressPct}%`,
            transition: 'width 1s cubic-bezier(0.22,1,0.36,1)',
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          fontFamily: T.heading, fontWeight: 700, fontSize: 22,
          color: running ? T.accent : T.inkHigh, lineHeight: 1, flex: 1,
          letterSpacing: '-0.02em',
        }}>
          {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {running ? (
            <>
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={toggleTimer}
                style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: T.accentBg, border: `1px solid ${T.accentBorder}`,
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: T.accent,
                }}
              >
                <RiPauseFill size={14} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={stopAndLog}
                style={{
                  padding: '7px 14px', borderRadius: T.rPill,
                  background: T.green, border: 'none',
                  cursor: 'pointer', fontFamily: T.body, fontWeight: 600,
                  fontSize: 10, letterSpacing: '0.06em', color: '#FFF8F2',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <RiCheckLine size={12} />
                Done
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.93 }}
              onClick={toggleTimer}
              style={{
                padding: '7px 18px', borderRadius: T.rPill,
                background: T.accent, border: 'none', cursor: 'pointer',
                fontFamily: T.body, fontWeight: 600, fontSize: 11,
                letterSpacing: '0.06em', color: '#FFF8F2',
                display: 'flex', alignItems: 'center', gap: 5,
                boxShadow: `0 3px 10px rgba(184,112,78,0.20)`,
              }}
            >
              <RiPlayFill size={12} />
              Focus
            </motion.button>
          )}
        </div>
      </div>

      {skill.milestones && skill.milestones.length > 0 && (
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
          {skill.milestones.slice(-3).reverse().map((m, i) => (
            <div key={i} style={{
              display: 'flex', gap: 8, padding: '5px 0',
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: 4, height: 4, borderRadius: '50%',
                background: T.accent, marginTop: 7, flexShrink: 0,
              }} />
              <div>
                <div style={{ fontFamily: T.body, fontWeight: 400, fontSize: 11.5, color: T.inkMid, lineHeight: 1.4 }}>
                  {m.text}
                </div>
                <div style={{ fontFamily: T.body, fontWeight: 300, fontSize: 9, color: T.inkLow, marginTop: 1 }}>
                  {m.duration} min · {new Date(m.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <MilestoneInput
        show={showMilestone}
        onSave={saveMilestone}
      />

      <AdvancementToast
        visible={!!advancement}
        onDismiss={() => setAdvancement(null)}
        {...advancement}
      />
    </div>
  )
}

export default function SkillTracker() {
  const [skills, setSkills] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')

  function reloadSkills() {
    setSkills(loadSkills())
  }

  useEffect(() => {
    reloadSkills()
  }, [])

  function addSkill() {
    if (!newName.trim()) return
    const skill = {
      id: genId(),
      name: newName.trim(),
      totalMinutes: 0,
      createdAt: Date.now(),
      milestones: [],
    }
    const updated = [...skills, skill]
    saveSkills(updated)
    setSkills(updated)
    setNewName('')
    setShowAdd(false)
  }

  function deleteSkill(id) {
    const updated = skills.filter(s => s.id !== id)
    saveSkills(updated)
    setSkills(updated)
  }

  const totalSkillMinutes = skills.reduce((sum, s) => sum + s.totalMinutes, 0)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <RiTimerFlashLine size={11} color={T.accentDim} />
        <span style={{
          fontFamily: T.body, fontSize: 9, fontWeight: 600,
          letterSpacing: '0.22em', textTransform: 'uppercase', color: T.inkLow,
        }}>
          Skill Profile
        </span>
        <div style={{ flex: 1, height: 1, background: T.border }} />
        {skills.length > 0 && (
          <span style={{
            fontFamily: T.heading, fontWeight: 600, fontSize: 12,
            color: T.inkLow, letterSpacing: '-0.01em',
          }}>
            {totalSkillMinutes} / 1200 min
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {skills.map(skill => (
          <SkillCard key={skill.id} skill={skill} onDelete={deleteSkill} onUpdate={reloadSkills} />
        ))}
      </div>

      {showAdd ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: 10, padding: '14px 16px',
            background: T.card, border: `1px solid ${T.borderMid}`,
            borderRadius: T.rLg,
          }}
        >
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSkill()}
            placeholder="Name your skill (e.g. Python, Guitar)"
            style={{
              width: '100%', background: T.bg,
              border: `1px solid ${T.border}`, borderRadius: T.rSm,
              padding: '10px 12px', fontFamily: T.heading,
              fontSize: 15, color: T.inkHigh, outline: 'none',
              marginBottom: 10,
            }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={addSkill}
              style={{
                padding: '7px 18px', borderRadius: T.rPill,
                background: T.accent, border: 'none', cursor: 'pointer',
                fontFamily: T.body, fontWeight: 600, fontSize: 11,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#FFF8F2',
              }}
            >
              Add
            </motion.button>
            <button
              onClick={() => { setShowAdd(false); setNewName('') }}
              style={{
                padding: '7px 14px', borderRadius: T.rPill,
                background: 'transparent', border: `1px solid ${T.borderMid}`,
                cursor: 'pointer', fontFamily: T.body, fontSize: 11,
                color: T.inkLow,
              }}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowAdd(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            marginTop: 10, padding: '10px 16px', borderRadius: T.rLg,
            background: T.card, border: `1px dashed ${T.borderMid}`,
            cursor: 'pointer', width: '100%',
            fontFamily: T.body, fontSize: 12, fontWeight: 500,
            color: T.inkLow, transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = T.accentBg
            e.currentTarget.style.borderColor = T.accentBorder
            e.currentTarget.style.color = T.accent
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = T.card
            e.currentTarget.style.borderColor = T.borderMid
            e.currentTarget.style.color = T.inkLow
          }}
        >
          <RiAddLine size={14} />
          Add a skill to track
        </motion.button>
      )}

      {skills.some(s => s.milestones && s.milestones.length > 0) && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <RiQuillPenLine size={10} color={T.accentDim} />
            <span style={{
              fontFamily: T.body, fontSize: 9, fontWeight: 600,
              letterSpacing: '0.22em', textTransform: 'uppercase', color: T.inkLow,
            }}>
              Milestone Log
            </span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {skills.flatMap(s =>
              (s.milestones || []).map((m, i) => ({
                ...m,
                skillName: s.name,
                key: `${s.id}-${i}`,
              }))
            ).sort((a, b) => b.timestamp - a.timestamp).map(m => (
              <div key={m.key} style={{
                display: 'flex', gap: 10, padding: '10px 14px',
                background: T.card, border: `1px solid ${T.border}`,
                borderRadius: T.rMd, alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: T.accent, marginTop: 5, flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: T.body, fontWeight: 400, fontSize: 12,
                    color: T.inkMid, lineHeight: 1.5,
                  }}>
                    {m.text}
                  </div>
                  <div style={{
                    display: 'flex', gap: 10, marginTop: 4,
                    fontFamily: T.body, fontWeight: 300, fontSize: 9.5,
                    color: T.inkLow,
                  }}>
                    <span>{m.skillName}</span>
                    <span>{m.duration} min</span>
                    <span>{new Date(m.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
