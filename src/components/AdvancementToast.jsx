import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiSparkling2Line, RiTimerFlashLine, RiSwordLine,
  RiLeafLine, RiFireLine, RiMedalLine, RiStarLine,
  RiShieldLine, RiFlashlightLine, RiHeartPulseLine,
} from 'react-icons/ri'

/* ─── Design tokens (matches Viram system) ──────────────── */
const T = {
  bg:      '#F4EEE3',
  card:    '#F9F5EC',
  inkHigh: '#2A2218',
  inkMid:  '#5A4E42',
  inkLow:  '#8A7B6E',
  border:  'rgba(55,38,22,0.08)',
  heading: "'Cormorant Garamond', Georgia, serif",
  body:    "'Jost', system-ui, sans-serif",
}

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`
const ease = [0.22, 1, 0.36, 1]

/* ─── Tier palette ──────────────────────────────────────── */
const TIERS = {
  bronze:   { primary: '#B8704E', dim: 'rgba(184,112,78,0.12)',  border: 'rgba(184,112,78,0.28)', glow: 'rgba(184,112,78,0.18)' },
  silver:   { primary: '#8A9BAE', dim: 'rgba(138,155,174,0.12)', border: 'rgba(138,155,174,0.30)', glow: 'rgba(138,155,174,0.20)' },
  gold:     { primary: '#C9973A', dim: 'rgba(201,151,58,0.12)',  border: 'rgba(201,151,58,0.32)', glow: 'rgba(201,151,58,0.22)' },
  emerald:  { primary: '#5E8F6B', dim: 'rgba(94,143,107,0.12)', border: 'rgba(94,143,107,0.28)', glow: 'rgba(94,143,107,0.18)' },
}

/* ─── CSS ───────────────────────────────────────────────── */
const GLOBAL = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

  @keyframes vt-float {
    0%,100% { transform: translateY(0px) rotate(var(--r,0deg)); opacity: var(--oa, 0.55); }
    50%      { transform: translateY(-14px) rotate(calc(var(--r,0deg) + 3deg)); opacity: var(--ob, 0.85); }
  }
  @keyframes vt-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes vt-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes vt-spin-rev {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }
  @keyframes vt-pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%     { opacity:.4; transform:scale(.6); }
  }
  @keyframes vt-rise {
    0%   { opacity: 0.7; transform: translateY(0) scale(1); }
    100% { opacity: 0;   transform: translateY(-60px) scale(0.5); }
  }
  @keyframes vt-xpbar {
    from { width: 0%; }
    to   { width: var(--xpw); }
  }

  .vt-shimmer-text {
    background: linear-gradient(
      90deg,
      var(--tc) 0%,
      #fff8f0 45%,
      var(--tc) 55%,
      var(--tc) 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: vt-shimmer 2.4s linear infinite;
  }
  .vt-ring-outer { animation: vt-spin     28s linear infinite; }
  .vt-ring-inner { animation: vt-spin-rev 18s linear infinite; }
  .vt-particle   { animation: vt-rise var(--dur, 2.2s) ease-out var(--delay, 0s) infinite; }
  .vt-float      { animation: vt-float var(--fd, 4s) ease-in-out var(--fdelay, 0s) infinite; }
  .vt-dot-pulse  { animation: vt-pulse 2s ease-in-out infinite; }
`

/* ─── Floating particles ────────────────────────────────── */
function Particles({ color }) {
  const dots = [
    { x: '18%', y: '72%', size: 3, dur: '2.8s', delay: '0s'    },
    { x: '35%', y: '80%', size: 2, dur: '2.2s', delay: '0.4s'  },
    { x: '52%', y: '75%', size: 4, dur: '3.1s', delay: '0.8s'  },
    { x: '68%', y: '78%', size: 2, dur: '2.5s', delay: '0.2s'  },
    { x: '82%', y: '70%', size: 3, dur: '2.9s', delay: '0.6s'  },
    { x: '26%', y: '85%', size: 2, dur: '2.4s', delay: '1.0s'  },
    { x: '74%', y: '82%', size: 3, dur: '2.7s', delay: '0.3s'  },
  ]
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 'inherit' }}>
      {dots.map((d, i) => (
        <div
          key={i}
          className="vt-particle"
          style={{
            position: 'absolute',
            left: d.x, top: d.y,
            width: d.size, height: d.size,
            borderRadius: '50%',
            background: color,
            '--dur': d.dur,
            '--delay': d.delay,
          }}
        />
      ))}
    </div>
  )
}

/* ─── Badge icon with spinning rings ───────────────────── */
function BadgeIcon({ icon: Icon, tier, size = 72 }) {
  const c = TIERS[tier] || TIERS.bronze
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0, margin: '0 auto' }}>
      {/* Outer dashed ring */}
      <svg
        className="vt-ring-outer"
        style={{ position: 'absolute', inset: -(size * 0.28), width: size * 1.56, height: size * 1.56 }}
        viewBox="0 0 112 112"
      >
        <circle cx="56" cy="56" r="52" fill="none" stroke={c.border} strokeWidth="1" strokeDasharray="4 12" />
      </svg>
      {/* Inner ring */}
      <svg
        className="vt-ring-inner"
        style={{ position: 'absolute', inset: -(size * 0.12), width: size * 1.24, height: size * 1.24 }}
        viewBox="0 0 89 89"
      >
        <circle cx="44.5" cy="44.5" r="41" fill="none" stroke={c.dim.replace('0.12', '0.35')} strokeWidth="0.8" strokeDasharray="2 8" />
      </svg>
      {/* Glow */}
      <div style={{
        position: 'absolute', inset: -8,
        borderRadius: '50%',
        background: `radial-gradient(ellipse, ${c.glow} 0%, transparent 70%)`,
        filter: 'blur(8px)',
      }} />
      {/* Core disc */}
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: `linear-gradient(135deg, ${T.card} 0%, ${c.dim.replace('0.12', '0.06')} 100%)`,
        border: `1.5px solid ${c.border}`,
        boxShadow: `0 8px 32px ${c.glow}, inset 0 1px 0 rgba(255,255,255,0.7)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: c.primary,
        position: 'relative', zIndex: 1,
      }}>
        <Icon size={size * 0.42} />
      </div>
    </div>
  )
}

/* ─── XP Progress bar ───────────────────────────────────── */
function XPBar({ current, max, color, delay = 0.7 }) {
  const pct = Math.min((current / max) * 100, 100)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.inkLow }}>
          Progress
        </span>
        <span style={{ fontFamily: T.heading, fontSize: 13, fontWeight: 600, color: T.inkHigh }}>
          {current} / {max}
        </span>
      </div>
      <div style={{ height: 5, borderRadius: 100, background: 'rgba(55,38,22,0.07)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.1, delay, ease }}
          style={{ height: '100%', borderRadius: 100, background: color }}
        />
      </div>
    </div>
  )
}

/* ─── Stat chip ─────────────────────────────────────────── */
function Chip({ icon: Icon, label, color, bg, border }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 13px', borderRadius: 100,
      background: bg, border: `1px solid ${border}`,
    }}>
      <Icon size={11} color={color} />
      <span style={{ fontFamily: T.body, fontSize: 11, fontWeight: 500, color: T.inkMid, letterSpacing: '0.03em' }}>
        {label}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function AdvancementToast({
  visible,
  onDismiss,
  autoHide    = 7000,
  /* Content */
  type        = 'milestone',   // 'milestone' | 'focus' | 'streak' | 'detox' | 'custom'
  tier        = 'bronze',      // 'bronze' | 'silver' | 'gold' | 'emerald'
  title       = 'Achievement Unlocked',
  subtitle    = '',
  rank        = '',            // big italic label under title e.g. "The Focused One"
  xpGained    = null,          // number — shown as "+42 XP"
  xpCurrent   = null,          // for progress bar
  xpMax       = null,          // for progress bar
  chips       = [],            // [{ icon, label }] small stat pills
  icon        = null,          // override icon
}) {
  const c = TIERS[tier] || TIERS.bronze

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(onDismiss, autoHide)
    return () => clearTimeout(t)
  }, [visible, onDismiss, autoHide])

  /* Default icons per type */
  const defaultIcon = {
    milestone: RiMedalLine,
    focus:     RiTimerFlashLine,
    streak:    RiFireLine,
    detox:     RiShieldLine,
    custom:    RiSparkling2Line,
  }[type] || RiSparkling2Line
  const IconComp = icon || defaultIcon

  return (
    <>
      <style>{GLOBAL}</style>
      <AnimatePresence>
        {visible && (
          /* Backdrop */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onDismiss}
            style={{
              position: 'fixed', inset: 0, zIndex: 400,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(28,21,16,0.62)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              padding: 24, cursor: 'pointer',
            }}
          >
            {/* Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.82, y: 36 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={  { opacity: 0, scale: 0.9,   y: -14 }}
              transition={{ duration: 0.65, ease }}
              onClick={e => e.stopPropagation()}
              style={{
                background: T.card,
                borderRadius: 30,
                border: `1px solid ${T.border}`,
                borderTop: `2.5px solid ${c.primary}`,
                boxShadow: `0 32px 80px rgba(28,21,16,0.36), 0 0 0 1px rgba(255,255,255,0.08) inset`,
                maxWidth: 380, width: '100%',
                overflow: 'hidden', position: 'relative',
                cursor: 'default',
              }}
            >
              {/* Grain */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN, backgroundRepeat: 'repeat', opacity: 0.04, pointerEvents: 'none', zIndex: 0 }} />

              {/* Particles */}
              <Particles color={c.primary} />

              {/* Top gradient wash */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 160,
                background: `radial-gradient(ellipse at 50% 0%, ${c.glow} 0%, transparent 70%)`,
                pointerEvents: 'none', zIndex: 0,
              }} />

              {/* Content */}
              <div style={{ position: 'relative', zIndex: 1, padding: '44px 32px 36px', textAlign: 'center' }}>

                {/* Type label */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.45, ease }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '4px 14px', borderRadius: 100,
                    background: c.dim, border: `1px solid ${c.border}`,
                    marginBottom: 28,
                  }}
                >
                  <span className="vt-dot-pulse" style={{ width: 5, height: 5, borderRadius: '50%', background: c.primary, display: 'inline-block' }} />
                  <span style={{ fontFamily: T.body, fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: c.primary }}>
                    {{ milestone:'Milestone Reached', focus:'Focus Complete', streak:'Streak Achieved', detox:'Detox Badge', custom:'Achievement' }[type]}
                  </span>
                </motion.div>

                {/* Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -8 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.18, duration: 0.6, ease }}
                  style={{ marginBottom: 28 }}
                >
                  <BadgeIcon icon={IconComp} tier={tier} size={72} />
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease }}
                >
                  <div
                    className="vt-shimmer-text"
                    style={{
                      fontFamily: T.heading, fontWeight: 700,
                      fontSize: 34, lineHeight: 1, letterSpacing: '-0.02em',
                      marginBottom: rank ? 8 : 12,
                      '--tc': c.primary,
                    }}
                  >
                    {title}
                  </div>

                  {/* Rank name */}
                  {rank && (
                    <div style={{
                      fontFamily: T.heading, fontStyle: 'italic', fontWeight: 400,
                      fontSize: 18, color: T.inkMid, letterSpacing: '0.02em',
                      marginBottom: 12,
                    }}>
                      {rank}
                    </div>
                  )}
                </motion.div>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38, duration: 0.5, ease }}
                  style={{
                    fontFamily: T.body, fontWeight: 300, fontSize: 13.5,
                    color: T.inkMid, lineHeight: 1.7,
                    marginBottom: 24,
                    maxWidth: 290, margin: '0 auto 24px',
                  }}
                >
                  {subtitle}
                </motion.p>

                {/* XP gained badge */}
                {xpGained && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.44, duration: 0.45, ease }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      padding: '8px 18px', borderRadius: 100,
                      background: c.dim, border: `1px solid ${c.border}`,
                      marginBottom: 20,
                    }}
                  >
                    <RiSparkling2Line size={13} color={c.primary} />
                    <span style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 20, color: T.inkHigh, lineHeight: 1 }}>
                      +{xpGained}
                    </span>
                    <span style={{ fontFamily: T.body, fontWeight: 300, fontSize: 11, color: T.inkLow }}>XP earned</span>
                  </motion.div>
                )}

                {/* Chips row */}
                {chips.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.45, ease }}
                    style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}
                  >
                    {chips.map((ch, i) => (
                      <Chip
                        key={i}
                        icon={ch.icon || RiLeafLine}
                        label={ch.label}
                        color={c.primary}
                        bg={c.dim}
                        border={c.border}
                      />
                    ))}
                  </motion.div>
                )}

                {/* XP progress bar */}
                {xpCurrent !== null && xpMax !== null && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55, duration: 0.4 }}
                    style={{ marginBottom: 26 }}
                  >
                    <XPBar current={xpCurrent} max={xpMax} color={c.primary} delay={0.7} />
                  </motion.div>
                )}

                {/* Divider */}
                <div style={{ height: 1, background: 'rgba(55,38,22,0.07)', margin: '0 0 22px' }} />

                {/* CTA */}
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.62, duration: 0.45, ease }}
                  whileHover={{ y: -2, boxShadow: `0 14px 36px rgba(42,34,24,0.22)` }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onDismiss}
                  style={{
                    width: '100%', padding: '13px 24px', borderRadius: 100,
                    background: T.inkHigh, border: 'none', cursor: 'pointer',
                    fontFamily: T.body, fontWeight: 600, fontSize: 12,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#F9F5EC',
                    boxShadow: '0 4px 18px rgba(42,34,24,0.18)',
                    transition: 'box-shadow 0.25s ease',
                  }}
                >
                  Keep going
                </motion.button>

                {/* Tap to dismiss hint */}
                <div style={{ marginTop: 14, fontFamily: T.body, fontWeight: 300, fontSize: 10, color: T.inkLow, letterSpacing: '0.06em' }}>
                  Tap anywhere to continue
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   MILESTONE DEFINITIONS
══════════════════════════════════════════════════════════ */
export const COIN_MILESTONES = [
  {
    threshold: 10,
    props: {
      type:     'milestone',
      tier:     'bronze',
      title:    'First Blood',
      rank:     'The Beginner',
      subtitle: 'Ten coins earned. Something has shifted — discipline is beginning to take root inside you.',
      xpGained: 40,
      chips:    [{ icon: RiLeafLine, label: 'First milestone' }, { icon: RiFlashlightLine, label: '10 coins' }],
    },
  },
  {
    threshold: 25,
    props: {
      type:     'milestone',
      tier:     'silver',
      title:    'Focused Mind',
      rank:     'The Practitioner',
      subtitle: '25 coins. Your focus is no longer an accident — it is a habit forming in real time.',
      xpGained: 80,
      chips:    [{ icon: RiSparkling2Line, label: 'Silver tier' }, { icon: RiHeartPulseLine, label: 'Habit forming' }],
    },
  },
  {
    threshold: 50,
    props: {
      type:     'milestone',
      tier:     'gold',
      title:    'Iron Will',
      rank:     'The Dedicated',
      subtitle: '50 coins earned. This is not luck. This is not motivation. This is who you are becoming.',
      xpGained: 150,
      chips:    [{ icon: RiStarLine, label: 'Gold tier' }, { icon: RiFireLine, label: '50 coins' }],
    },
  },
  {
    threshold: 100,
    props: {
      type:     'milestone',
      tier:     'emerald',
      title:    'Sovereign',
      rank:     'The Legendary',
      subtitle: '100 coins. You are not the person you were when you started. The mind is yours again.',
      xpGained: 300,
      chips:    [{ icon: RiShieldLine, label: 'Emerald tier' }, { icon: RiMedalLine, label: 'Legendary' }],
    },
  },
]

export function checkCoinMilestone(oldCoins, newCoins) {
  const hit = COIN_MILESTONES.find(m => oldCoins < m.threshold && newCoins >= m.threshold)
  return hit ? hit.props : null
}

export const ACHIEVEMENTS = {
  focusSession: (mins = 25) => ({
    type:     'focus',
    tier:     'bronze',
    title:    'Deep Focus',
    rank:     'The Undistracted',
    subtitle: `${mins}-minute session complete. Your mind is getting sharper with every rep.`,
    xpGained: Math.round(30 + mins * 1.4),
    chips:    [{ icon: RiTimerFlashLine, label: `${mins} min session` }],
  }),

  streakReached: (days) => ({
    type:     'streak',
    tier:     days >= 14 ? 'gold' : days >= 7 ? 'silver' : 'bronze',
    title:    `${days}-Day Streak`,
    rank:     days >= 14 ? 'The Relentless' : days >= 7 ? 'The Consistent' : 'The Starter',
    subtitle: `${days} clean days in a row. Every day you chose presence over the feed.`,
    xpGained: days * 12,
    chips:    [{ icon: RiFireLine, label: `${days} days clean` }],
  }),

  detoxComplete: (hours = 2) => ({
    type:     'detox',
    tier:     'emerald',
    title:    'Digital Detox',
    rank:     'The Protector',
    subtitle: `${hours}-hour digital fast complete. You broke the scroll cycle. That takes strength.`,
    xpGained: hours * 30,
    chips:    [{ icon: RiShieldLine, label: `${hours}h detox` }, { icon: RiLeafLine, label: 'Cycle broken' }],
  }),
}