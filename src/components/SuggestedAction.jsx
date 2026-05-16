import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { RiRocketLine, RiArrowRightSLine, RiTimerFlashLine, RiSunLine, RiMoonLine } from 'react-icons/ri'

const T = {
  bg: '#F4EEE3', card: '#F9F5EC', cardDeep: '#EDE5D4',
  inkHigh: '#2A2218', inkMid: '#5A4E42', inkLow: '#8A7B6E',
  border: 'rgba(55,38,22,0.07)', borderMid: 'rgba(55,38,22,0.13)',
  accent: '#B8704E', accentBg: 'rgba(184,112,78,0.08)', accentBorder: 'rgba(184,112,78,0.22)',
  green: '#6B8F5E', greenBg: 'rgba(107,143,94,0.10)',
  heading: "'Cormorant Garamond', Georgia, serif", body: "'Jost', system-ui, sans-serif",
  rLg: '22px', rPill: '100px',
}

export default function SuggestedAction({ focus, profile }) {
  const navigate = useNavigate()
  const [action, setAction] = useState(null)

  useEffect(() => {
    if (!focus) { setAction(generateAction(profile)); return }
    generateAction(profile, focus)
  }, [focus, profile])

  function generateAction(profile, todayFocus) {
    const todayMins = todayFocus?.mins || 0
    const sessions = todayFocus?.sessions || 0
    const worstApp = profile?.worstApp || ''
    const stress = profile?.stressLevel || 1
    const name = profile?.name?.split(' ')[0] || 'Scholar'

    if (todayMins === 0 && sessions === 0) {
      return {
        icon: RiTimerFlashLine,
        color: T.accent,
        bg: T.accentBg,
        border: T.accentBorder,
        headline: `Ready to begin, ${name}?`,
        body: `You haven't done a focus session yet today. A single 15-minute session breaks the seal — momentum follows action, not the other way around.`,
        action: 'Start 15 min Focus',
        route: '/focus',
        target: 15,
      }
    }

    const nextTarget = Math.min(todayMins + 10, 120)
    if (nextTarget <= 30) {
      return {
        icon: RiSunLine,
        color: T.green,
        bg: T.greenBg,
        border: 'rgba(107,143,94,0.25)',
        headline: `Today's stretch: ${nextTarget} min`,
        body: `Yesterday you did ${Math.max(todayMins - 5, 5)} minutes of focus. Today's suggested target is ${nextTarget} minutes. Small increments compound.`,
        action: 'Start Focus Session',
        route: '/focus',
        target: nextTarget,
      }
    }

    if (worstApp && stress <= 2) {
      return {
        icon: RiMoonLine,
        color: T.accent,
        bg: T.accentBg,
        border: T.accentBorder,
        headline: `Guard your ${profile?.focusPeak ? 'peak hours' : 'evening'}`,
        body: `Your biggest time thief is ${worstApp}. Try setting a 2-hour digital fast during your peak focus window — this alone can reclaim 10+ hours per week.`,
        action: 'Start Digital Fast',
        route: '#',
        target: null,
      }
    }

    return {
      icon: RiRocketLine,
      color: T.accent,
      bg: T.accentBg,
      border: T.accentBorder,
      headline: `Log a confession`,
      body: `Awareness is the first step. Logging even one slip-up today gives you data about your patterns — and earns you discipline points.`,
      action: 'Open Confessions',
      route: '/confess',
      target: null,
    }
  }

  if (!action) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 18px', marginBottom: 12,
        background: `linear-gradient(135deg, ${action.bg} 0%, ${T.card} 100%)`,
        border: `1px solid ${action.border}`,
        borderRadius: T.rLg, cursor: 'pointer',
        transition: 'all 0.22s ease',
      }}
      onClick={() => { if (action.route && action.route !== '#') navigate(action.route) }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        background: action.bg, border: `1px solid ${action.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: action.color,
      }}>
        <action.icon size={14} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: T.body, fontSize: 8, fontWeight: 600,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: T.accent, marginBottom: 2,
        }}>
          Suggested Action
        </div>
        <div style={{
          fontFamily: T.heading, fontStyle: 'italic', fontWeight: 500,
          fontSize: 14, color: T.inkHigh, lineHeight: 1.4,
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {action.body}
        </div>
      </div>
      <RiArrowRightSLine size={14} color={T.accentDim} style={{ flexShrink: 0 }} />
    </motion.div>
  )
}
