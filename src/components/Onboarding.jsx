import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiSmartphoneLine,
  RiTimerFlashLine,
  RiMoonLine,
  RiFireLine,
  RiBrainLine,
  RiAlarmWarningLine,
  RiCheckLine,
  RiRocketLine,
  RiSwordLine,
  RiShieldLine,
  RiHeartPulseLine,
  RiBookOpenLine,
  RiMentalHealthLine,
  RiLeafLine,
  RiQuillPenLine,
} from 'react-icons/ri'

/* ─── Design Tokens ─────────────────────────────────────── */
const T = {
  bg:           '#F4EEE3',
  card:         '#F9F5EC',
  cardDeep:     '#EDE5D4',
  sheet:        '#FDFAF4',        // right-panel "form paper" — slightly brighter
  inkHigh:      '#2A2218',
  inkMid:       '#5A4E42',
  inkLow:       '#8A7B6E',
  inkGhost:     'rgba(55,38,22,0.20)',
  border:       'rgba(55,38,22,0.07)',
  borderMid:    'rgba(55,38,22,0.13)',
  borderRule:   'rgba(55,38,22,0.06)',  // for ruled lines
  accent:       '#B8704E',
  accentBg:     'rgba(184,112,78,0.07)',
  accentBorder: 'rgba(184,112,78,0.22)',
  accentDim:    'rgba(184,112,78,0.45)',
  heading:      "'Cormorant Garamond', Georgia, serif",
  body:         "'Jost', system-ui, sans-serif",
  mono:         "'Courier New', Courier, monospace",
  rSm:          '8px',
  rMd:          '16px',
  rLg:          '24px',
  rPill:        '100px',
}

/* ─── Grain URL ─────────────────────────────────────────── */
const GRAIN =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

/* ─── Global styles ─────────────────────────────────────── */
const GLOBAL = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Jost:wght@300;400;500;600&display=swap');

  .viram-ob-bg::after {
    content:''; position:fixed; inset:0;
    background-image: ${GRAIN}; background-repeat:repeat;
    opacity:0.03; pointer-events:none; z-index:9999;
  }

  /* Ruled-line range slider */
  input[type=range].viram-slider {
    -webkit-appearance: none;
    width: 100%; height: 2px;
    background: ${T.borderMid};
    border-radius: 2px; outline: none;
    cursor: pointer;
  }
  input[type=range].viram-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px; height: 24px; border-radius: 50%;
    background: ${T.card};
    border: 2px solid ${T.accent};
    box-shadow: 0 2px 8px rgba(184,112,78,0.22), inset 0 1px 0 rgba(255,255,255,0.6);
    cursor: pointer;
    transition: transform 0.15s ease;
  }
  input[type=range].viram-slider::-webkit-slider-thumb:active {
    transform: scale(1.15);
  }
  input[type=range].viram-slider::-moz-range-thumb {
    width:24px; height:24px; border-radius:50%;
    background:${T.card}; border:2px solid ${T.accent};
    box-shadow:0 2px 8px rgba(184,112,78,0.22); cursor:pointer;
  }

  /* Progress bookmark */
  @keyframes ink-in {
    from { opacity:0; transform: scaleX(0); transform-origin: left; }
    to   { opacity:1; transform: scaleX(1); }
  }

  @keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%     { opacity:.4; transform:scale(.65); }
  }

  @keyframes float-slow {
    0%,100% { transform: translateY(0px); }
    50%     { transform: translateY(-6px); }
  }

  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* Ink-stroke selection animation */
  @keyframes ink-mark {
    0%   { clip-path: inset(0 100% 0 0); }
    100% { clip-path: inset(0 0% 0 0); }
  }
  .ink-underline::after {
    content:''; position:absolute; bottom:-1px; left:0; right:0; height:1px;
    background: ${T.accent}; animation: ink-mark 0.35s ease forwards;
  }

  /* Stamp */
  @keyframes stamp-in {
    0%   { opacity:0; transform: scale(1.4) rotate(-3deg); }
    60%  { transform: scale(0.95) rotate(0.5deg); }
    100% { opacity:1; transform: scale(1) rotate(0deg); }
  }
`

/* ─── Steps ─────────────────────────────────────────────── */
const STEPS = [
  {
    key: 'screenTime', type: 'range', Icon: RiSmartphoneLine,
    label: 'Screen time',
    q: 'How many hours a day do you spend on your phone?',
    sub: 'Be brutally honest. This number sets your avatar\'s starting power.',
    min: 0, max: 14, step: 0.5, unit: 'hrs',
    insight: v =>
      v <= 2 ? 'Disciplined. Your avatar starts from a position of strength.' :
      v <= 5 ? 'Average range — plenty of room to build from.' :
      v <= 8 ? 'Above average. Your avatar will carry this weight.' :
               'High impact. Your avatar starts weakened — but every journey begins somewhere.',
  },
  {
    key: 'worstApp', type: 'options', Icon: RiAlarmWarningLine,
    label: 'Biggest thief',
    q: 'Which app steals the most of your time?',
    sub: 'This becomes your primary target. Viram builds a friction wall around it.',
    opts: [
      { icon: RiFireLine,         label: 'Instagram / TikTok',         sub: 'Short-form video loops',    val: 'reels'    },
      { icon: RiSmartphoneLine,   label: 'YouTube',                    sub: 'Long-form rabbit holes',    val: 'youtube'  },
      { icon: RiTimerFlashLine,   label: 'WhatsApp / Messaging',       sub: 'Chat that never ends',      val: 'chat'     },
      { icon: RiBrainLine,        label: 'Twitter / Reddit',           sub: 'Infinite scroll feeds',     val: 'feed'     },
      { icon: RiSwordLine,        label: 'Games',                      sub: 'Session creep',             val: 'games'    },
      { icon: RiAlarmWarningLine, label: "I don't know / All of them", sub: 'Honest answer',             val: 'all'      },
    ],
  },
  {
    key: 'focusPeak', type: 'options', Icon: RiTimerFlashLine,
    label: 'Peak focus',
    q: 'When do you feel sharpest?',
    sub: 'Viram will schedule your hardest challenges during this window.',
    opts: [
      { icon: RiMoonLine,         label: 'Early morning  5–8 AM',  sub: 'Before the world wakes',      val: 'early'     },
      { icon: RiFireLine,         label: 'Morning  8–12 PM',       sub: 'Classic deep work window',    val: 'morning'   },
      { icon: RiTimerFlashLine,   label: 'Afternoon  12–5 PM',     sub: 'Post-lunch momentum',         val: 'afternoon' },
      { icon: RiMoonLine,         label: 'Evening  5–10 PM',       sub: 'Night owl territory',         val: 'evening'   },
      { icon: RiAlarmWarningLine, label: "I don't have a peak",    sub: "We'll help you build one",    val: 'none'      },
    ],
  },
  {
    key: 'mission', type: 'options', Icon: RiRocketLine,
    label: 'Mission',
    q: 'What are you actually trying to build?',
    sub: 'This shapes your avatar archetype and which challenges come first.',
    opts: [
      { icon: RiBookOpenLine,   label: 'Academic focus',       sub: 'Exams, research, studying',   val: 'study'      },
      { icon: RiBrainLine,      label: 'Deep work / career',   sub: 'Code, writing, creation',     val: 'deepwork'   },
      { icon: RiHeartPulseLine, label: 'Health & fitness',     sub: 'Workouts, sleep, habits',     val: 'health'     },
      { icon: RiSwordLine,      label: 'General discipline',   sub: 'Willpower across the board',  val: 'discipline' },
      { icon: RiShieldLine,     label: 'Digital detox',        sub: 'Just get off the phone',      val: 'detox'      },
    ],
  },
  {
    key: 'pastAttempts', type: 'options', Icon: RiShieldLine,
    label: 'Past attempts',
    q: 'What have you tried before?',
    sub: "We won't suggest the same things that already failed you.",
    opts: [
      { icon: RiAlarmWarningLine, label: 'Screen time limits', sub: 'You bypassed them',           val: 'limits'    },
      { icon: RiTimerFlashLine,   label: 'Pomodoro / timers',  sub: "Works until it doesn't",      val: 'timers'    },
      { icon: RiBrainLine,        label: 'Willpower alone',    sub: "Didn't stick",                val: 'willpower' },
      { icon: RiSmartphoneLine,   label: 'Other apps',         sub: 'None of them held',           val: 'apps'      },
      { icon: RiCheckLine,        label: 'Nothing yet',        sub: 'First real attempt',          val: 'nothing'   },
    ],
  },
  {
    key: 'sleep', type: 'range', Icon: RiMoonLine,
    label: 'Sleep',
    q: 'How many hours of sleep do you get?',
    sub: "Sleep is your avatar's regeneration stat. Less = slower XP recovery.",
    min: 2, max: 12, step: 0.5, unit: 'hrs',
    insight: v =>
      v >= 8 ? 'Optimal. High regeneration rate for your avatar.' :
      v >= 6 ? 'Acceptable. Slight regeneration penalty.' :
      v >= 4 ? 'Low. Your avatar will start with a fatigue marker.' :
               'Critical. Maximum fatigue. We\'ll factor this into your plan.',
  },
  {
    key: 'stressLevel', type: 'options', Icon: RiMentalHealthLine,
    label: 'Stress level',
    q: "What's your honest stress level right now?",
    sub: 'This calibrates daily challenge intensity. Viram should push you — not break you.',
    opts: [
      { icon: RiLeafLine,         label: 'Pretty calm',       sub: 'Life feels manageable',           val: 0 },
      { icon: RiFireLine,         label: 'Moderate pressure', sub: 'Juggling things',                 val: 1 },
      { icon: RiAlarmWarningLine, label: 'High stress',       sub: 'Running on edge',                 val: 2 },
      { icon: RiBrainLine,        label: 'Burning out',       sub: 'Needs immediate attention',       val: 3 },
    ],
  },
  {
    key: 'avatarName', type: 'text', Icon: RiQuillPenLine,
    label: 'Avatar name',
    q: 'What will you name your avatar?',
    sub: 'This is who you\'re becoming. Choose something that means something.',
    placeholder: 'Monk, Nova, Stoic, Shadow…',
    maxLength: 20,
  },
]

/* ─── Stat calculator ───────────────────────────────────── */
function calcStats(p) {
  const st = p.screenTime ?? 4, sl = p.sleep ?? 7, str = p.stressLevel ?? 1
  return {
    vitality:   Math.max(15, Math.min(100, Math.round(100 - st * 5  - str * 6  + (sl - 5) * 3))),
    energy:     Math.max(15, Math.min(100, Math.round(100 - st * 4  - str * 5  + (sl - 5) * 4))),
    discipline: Math.max(20, Math.min(100, Math.round(100 - st * 6  - str * 4))),
    focus:      Math.max(20, Math.min(100, Math.round(100 - st * 7  - str * 3  + (sl - 5) * 2))),
    shieldHP:   Math.max(10, Math.min(100, Math.round(100 - st * 8))),
    coins:      Math.max(1,  Math.round(10 - st * 0.7)),
  }
}

/* ─── StatBar — ruled-line style ────────────────────────── */
function StatBar({ label, value, delay = 0 }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <span style={{ fontFamily: T.body, fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.inkLow }}>
          {label}
        </span>
        <span style={{ fontFamily: T.mono, fontSize: 11, color: T.inkMid }}>{value}</span>
      </div>
      {/* Ruled track */}
      <div style={{ position: 'relative', height: 4, background: T.cardDeep, borderRadius: 2, overflow: 'hidden', border: `1px solid ${T.border}` }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position:     'absolute',
            left:         0, top: 0, bottom: 0,
            background:   value > 70 ? T.accent : value > 40 ? `rgba(184,112,78,0.55)` : `rgba(184,112,78,0.3)`,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  )
}

/* ─── Field row for profile sheet ───────────────────────── */
function SheetField({ label, value, accent = false }) {
  return (
    <div style={{ borderBottom: `1px dashed ${T.borderRule}`, paddingBottom: 6, marginBottom: 12 }}>
      <div style={{ fontFamily: T.body, fontSize: 8, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.inkLow, marginBottom: 3 }}>
        {label}
      </div>
      <div style={{
        fontFamily:    value ? T.heading : T.body,
        fontStyle:     value ? 'italic' : 'normal',
        fontWeight:    value ? 500 : 300,
        fontSize:      value ? 15 : 12,
        color:         accent ? T.accent : value ? T.inkHigh : `rgba(55,38,22,0.2)`,
        letterSpacing: '-0.01em',
        minHeight:     20,
      }}>
        {value || '—'}
      </div>
    </div>
  )
}

/* ─── Option card — ink-selection style ─────────────────── */
function OptionCard({ opt, selected, onClick }) {
  const Icon = opt.icon
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display:        'flex',
        alignItems:     'center',
        gap:            14,
        width:          '100%',
        padding:        '13px 16px',
        borderRadius:   T.rMd,
        border:         selected ? `1px solid ${T.accentBorder}` : `1px solid ${T.border}`,
        background:     selected ? T.accentBg : T.card,
        textAlign:      'left',
        cursor:         'pointer',
        transition:     'border-color 0.2s, background 0.2s',
        boxShadow:      selected ? `0 2px 12px rgba(184,112,78,0.10)` : `0 1px 4px rgba(55,38,22,0.04)`,
      }}
    >
      {/* Icon circle */}
      <div style={{
        width:          34,
        height:         34,
        borderRadius:   '50%',
        border:         selected ? `1px solid ${T.accentBorder}` : `1px solid ${T.borderMid}`,
        background:     selected ? `rgba(184,112,78,0.10)` : T.cardDeep,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        flexShrink:     0,
        color:          selected ? T.accent : T.inkLow,
        transition:     'all 0.2s',
      }}>
        <Icon size={14} />
      </div>

      {/* Labels */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.body, fontWeight: selected ? 500 : 400, fontSize: 13, color: selected ? T.inkHigh : T.inkMid, letterSpacing: '0.01em' }}>
          {opt.label}
        </div>
        {opt.sub && (
          <div style={{ fontFamily: T.body, fontWeight: 300, fontSize: 11, color: T.inkLow, marginTop: 1, letterSpacing: '0.01em' }}>
            {opt.sub}
          </div>
        )}
      </div>

      {/* Selection indicator — ink dot */}
      <div style={{
        width:        16,
        height:       16,
        borderRadius: '50%',
        border:       selected ? `2px solid ${T.accent}` : `1px solid ${T.borderMid}`,
        background:   selected ? T.accent : 'transparent',
        flexShrink:   0,
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'center',
        transition:   'all 0.2s',
      }}>
        {selected && <RiCheckLine size={9} color="#FFF8F2" />}
      </div>
    </motion.button>
  )
}

/* ─── Wax seal step icon ────────────────────────────────── */
function StepBadge({ Icon, label }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
      <div style={{
        width:          36,
        height:         36,
        borderRadius:   '50%',
        background:     T.accentBg,
        border:         `1px solid ${T.accentBorder}`,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        color:          T.accent,
        flexShrink:     0,
      }}>
        <Icon size={15} />
      </div>
      <span style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.inkLow }}>
        {label}
      </span>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────── */
export default function Onboarding() {
  const navigate  = useNavigate()
  const [step,    setStep]    = useState(0)
  const [profile, setProfile] = useState({ screenTime: 4, sleep: 7, stressLevel: 1, avatarName: '' })
  const [direction, setDirection] = useState(1)
  const inputRef = useRef(null)

  const cur      = STEPS[step]
  const progress = (step / STEPS.length) * 100
  const isLast   = step === STEPS.length - 1
  const val      = profile[cur.key]
  const setVal   = v => setProfile(p => ({ ...p, [cur.key]: v }))
  const hasValue = () => {
    if (cur.type === 'range') return true
    if (cur.type === 'text')  return (val ?? '').trim().length > 0
    return val !== undefined && val !== null && val !== ''
  }

  useEffect(() => {
    if (cur.type === 'text' && inputRef.current) inputRef.current.focus()
  }, [step])

  function goNext() {
    if (!hasValue()) return
    if (isLast) {
      const stats = calcStats(profile)
      localStorage.setItem('viram_profile', JSON.stringify({ ...profile, ...stats }))
      navigate('/dashboard')
      return
    }
    setDirection(1); setStep(s => s + 1)
  }

  function goBack() {
    if (step === 0) { navigate('/start'); return }
    setDirection(-1); setStep(s => s - 1)
  }

  const stats = calcStats(profile)

  const slideVariants = {
    enter:  d => ({ opacity: 0, x: d > 0 ? 32 : -32 }),
    center: { opacity: 1, x: 0 },
    exit:   d => ({ opacity: 0, x: d > 0 ? -32 : 32 }),
  }

  /* Resolve human-readable profile values for the sheet */
  const missionLabel  = STEPS.find(s => s.key === 'mission')?.opts?.find(o => o.val === profile.mission)?.label
  const peakLabel     = STEPS.find(s => s.key === 'focusPeak')?.opts?.find(o => o.val === profile.focusPeak)?.label
  const stressLabel   = STEPS.find(s => s.key === 'stressLevel')?.opts?.find(o => o.val === profile.stressLevel)?.label

  return (
    <>
      <style>{GLOBAL}</style>

      <div
        className="viram-ob-bg"
        style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}
      >

        {/* ── Top bar ──────────────────────────────────────── */}
        <div style={{
          flexShrink:     0,
          display:        'flex',
          alignItems:     'center',
          gap:            16,
          padding:        '14px 24px',
          borderBottom:   `1px solid ${T.border}`,
          background:     T.card,
          boxShadow:      `0 1px 0 rgba(55,38,22,0.04)`,
        }}>
          {/* Back button */}
          <button
            onClick={goBack}
            style={{
              width:          36,
              height:         36,
              borderRadius:   '50%',
              border:         `1px solid ${T.borderMid}`,
              background:     T.cardDeep,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              color:          T.inkLow,
              cursor:         'pointer',
              flexShrink:     0,
              transition:     'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.accentBorder; e.currentTarget.style.color = T.accent }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderMid; e.currentTarget.style.color = T.inkLow }}
          >
            <RiArrowLeftLine size={14} />
          </button>

          {/* Progress — bookmark tabs */}
          <div style={{ flex: 1, display: 'flex', gap: 4 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{
                flex:         i === step ? 2 : 1,
                height:       3,
                borderRadius: 2,
                background:   i < step ? T.accent : i === step ? T.accentDim : T.borderMid,
                transition:   'all 0.5s cubic-bezier(0.22,1,0.36,1)',
              }} />
            ))}
          </div>

          {/* Step counter */}
          <div style={{ fontFamily: T.body, fontSize: 11, fontWeight: 500, color: T.inkLow, flexShrink: 0, letterSpacing: '0.08em' }}>
            {step + 1}&thinsp;/&thinsp;{STEPS.length}
          </div>

          {/* VIRAM logotype */}
          <div style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 17, letterSpacing: '0.14em', color: T.inkHigh, flexShrink: 0, marginLeft: 8 }}>
            VI<span style={{ color: T.accent }}>RAM</span>
          </div>
        </div>

        {/* ── Main area ─────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ── LEFT: Question area ─────────────────────────── */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display:       'flex',
                  flexDirection: 'column',
                  maxWidth:      600,
                  width:         '100%',
                  margin:        '0 auto',
                  padding:       'clamp(32px,5vw,56px) clamp(20px,5vw,48px)',
                  flex:          1,
                }}
              >
                <StepBadge Icon={cur.Icon} label={cur.label} />

                {/* Question */}
                <h2 style={{
                  fontFamily:    T.heading,
                  fontWeight:    700,
                  fontSize:      'clamp(24px,4vw,36px)',
                  lineHeight:    1.1,
                  letterSpacing: '-0.02em',
                  color:         T.inkHigh,
                  marginBottom:  12,
                }}>
                  {cur.q}
                </h2>
                <p style={{ fontFamily: T.body, fontWeight: 300, fontSize: 14, color: T.inkMid, lineHeight: 1.85, marginBottom: 36, maxWidth: 480, letterSpacing: '0.01em' }}>
                  {cur.sub}
                </p>

                {/* ── RANGE ────────────────────────────────── */}
                {cur.type === 'range' && (
                  <div style={{ marginBottom: 32 }}>
                    {/* Big number display — like a planner's field value */}
                    <div style={{
                      textAlign:    'center',
                      marginBottom: 28,
                      padding:      '24px 0',
                      borderTop:    `1px solid ${T.border}`,
                      borderBottom: `1px solid ${T.border}`,
                      position:     'relative',
                    }}>
                      {/* Ruled lines behind the number */}
                      {[...Array(3)].map((_, i) => (
                        <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: 24 + i * 20, height: 1, background: T.borderRule }} />
                      ))}
                      <span style={{
                        fontFamily:    T.heading,
                        fontWeight:    700,
                        fontSize:      'clamp(64px,12vw,88px)',
                        lineHeight:    1,
                        letterSpacing: '-0.04em',
                        color:         T.inkHigh,
                        position:      'relative',
                        zIndex:        1,
                      }}>
                        {val}
                      </span>
                      <span style={{ fontFamily: T.body, fontWeight: 300, fontSize: 18, color: T.inkLow, marginLeft: 6, position: 'relative', zIndex: 1 }}>
                        {cur.unit}
                      </span>
                    </div>

                    <input
                      type="range"
                      className="viram-slider"
                      min={cur.min} max={cur.max} step={cur.step}
                      value={val ?? cur.min}
                      onChange={e => setVal(parseFloat(e.target.value))}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: T.body, fontSize: 11, color: T.inkLow }}>
                      <span>{cur.min}{cur.unit}</span>
                      <span>{cur.max}{cur.unit}</span>
                    </div>

                    {/* Insight — sticky-note style */}
                    {cur.insight && (
                      <div style={{
                        marginTop:    20,
                        padding:      '14px 18px',
                        background:   T.accentBg,
                        border:       `1px solid ${T.accentBorder}`,
                        borderLeft:   `3px solid ${T.accent}`,
                        borderRadius: T.rSm,
                      }}>
                        <p style={{ fontFamily: T.body, fontWeight: 300, fontSize: 12, fontStyle: 'italic', color: T.inkMid, lineHeight: 1.75, margin: 0 }}>
                          {cur.insight(val ?? cur.min)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── OPTIONS ──────────────────────────────── */}
                {cur.type === 'options' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
                    {cur.opts.map(opt => (
                      <OptionCard
                        key={String(opt.val)}
                        opt={opt}
                        selected={val === opt.val}
                        onClick={() => setVal(opt.val)}
                      />
                    ))}
                  </div>
                )}

                {/* ── TEXT ─────────────────────────────────── */}
                {cur.type === 'text' && (
                  <div style={{ marginBottom: 32 }}>
                    {/* Paper-form name field */}
                    <div style={{
                      background:   T.card,
                      border:       `1px solid ${T.borderMid}`,
                      borderRadius: T.rMd,
                      padding:      '20px 24px 16px',
                      boxShadow:    `0 2px 8px rgba(55,38,22,0.06), inset 0 1px 0 rgba(255,255,255,0.5)`,
                      position:     'relative',
                    }}>
                      <label style={{ fontFamily: T.body, fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.inkLow, display: 'block', marginBottom: 10 }}>
                        Avatar Name
                      </label>
                      {/* Ruled lines */}
                      {[0,1,2].map(i => (
                        <div key={i} style={{ position: 'absolute', left: 24, right: 24, top: 52 + i * 22, height: 1, background: T.borderRule }} />
                      ))}
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder={cur.placeholder}
                        value={val ?? ''}
                        onChange={e => setVal(e.target.value)}
                        maxLength={cur.maxLength}
                        style={{
                          width:         '100%',
                          background:    'transparent',
                          border:        'none',
                          outline:       'none',
                          fontFamily:    T.heading,
                          fontStyle:     'italic',
                          fontWeight:    500,
                          fontSize:      32,
                          color:         T.inkHigh,
                          letterSpacing: '-0.01em',
                          position:      'relative',
                          zIndex:        1,
                          padding:       0,
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, fontFamily: T.body, fontSize: 10, color: T.inkLow, position: 'relative', zIndex: 1 }}>
                        {(val ?? '').length}&thinsp;/&thinsp;{cur.maxLength}
                      </div>
                    </div>
                    <p style={{ marginTop: 12, fontFamily: T.body, fontWeight: 300, fontSize: 12, fontStyle: 'italic', color: T.inkLow, lineHeight: 1.7 }}>
                      This name will appear above your avatar on your dashboard.
                    </p>
                  </div>
                )}

                {/* ── Continue button ──────────────────────── */}
                <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                  <motion.button
                    onClick={goNext}
                    disabled={!hasValue()}
                    whileHover={hasValue() ? { y: -2, boxShadow: `0 14px 36px rgba(184,112,78,0.26)` } : {}}
                    whileTap={hasValue() ? { y: 0 } : {}}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      width:          '100%',
                      padding:        '15px 24px',
                      borderRadius:   T.rPill,
                      background:     hasValue() ? T.accent : T.cardDeep,
                      border:         `1px solid ${hasValue() ? T.accent : T.border}`,
                      color:          hasValue() ? '#FFF8F2' : T.inkLow,
                      fontFamily:     T.body,
                      fontWeight:     600,
                      fontSize:       13,
                      letterSpacing:  '0.10em',
                      textTransform:  'uppercase',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      gap:            8,
                      cursor:         hasValue() ? 'pointer' : 'not-allowed',
                      boxShadow:      hasValue() ? `0 4px 18px rgba(184,112,78,0.20)` : 'none',
                      transition:     'all 0.25s ease',
                    }}
                  >
                    {isLast
                      ? <><RiRocketLine size={14} /> Forge My Avatar</>
                      : <>Continue <RiArrowRightLine size={13} /></>
                    }
                  </motion.button>

                  {/* Subtle progress note */}
                  <p style={{ textAlign: 'center', marginTop: 14, fontFamily: T.body, fontWeight: 300, fontSize: 11, color: T.inkLow, letterSpacing: '0.04em' }}>
                    {STEPS.length - step - 1 > 0
                      ? `${STEPS.length - step - 1} question${STEPS.length - step - 1 > 1 ? 's' : ''} remaining`
                      : 'Last question — almost there.'}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── RIGHT: Profile Sheet panel (desktop) ─────── */}
          <div style={{
            display:      'none',    // overridden by @media via className
            width:        360,
            flexShrink:   0,
            borderLeft:   `1px solid ${T.border}`,
            background:   T.sheet,
            overflowY:    'auto',
            position:     'relative',
          }}
            className="viram-sheet-panel"
          >
            {/* Faint watermark / decorative ruled lines on sheet */}
            <div style={{
              position:    'absolute',
              inset:       0,
              backgroundImage: `repeating-linear-gradient(transparent, transparent 27px, ${T.borderRule} 27px, ${T.borderRule} 28px)`,
              backgroundPositionY: '48px',
              pointerEvents: 'none',
            }} />

            <div style={{ padding: '32px 28px', position: 'relative', zIndex: 1 }}>

              {/* Sheet header — printed-form aesthetic */}
              <div style={{
                display:       'flex',
                alignItems:    'center',
                justifyContent: 'space-between',
                marginBottom:  24,
                paddingBottom: 16,
                borderBottom:  `2px solid ${T.borderMid}`,
              }}>
                <div>
                  <div style={{ fontFamily: T.body, fontSize: 8, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: T.inkLow }}>
                    Viram · Profile Sheet
                  </div>
                  <div style={{ fontFamily: T.heading, fontWeight: 600, fontSize: 18, color: T.inkHigh, marginTop: 2, letterSpacing: '-0.01em' }}>
                    {profile.avatarName
                      ? <em style={{ fontStyle: 'italic' }}>{profile.avatarName}</em>
                      : <span style={{ color: T.inkLow, fontStyle: 'italic', fontWeight: 400 }}>Unnamed</span>
                    }
                  </div>
                </div>
                {/* Avatar initial disc */}
                <div style={{
                  width:          52,
                  height:         52,
                  borderRadius:   '50%',
                  background:     T.accentBg,
                  border:         `1px solid ${T.accentBorder}`,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  animation:      'float-slow 5s ease-in-out infinite',
                  flexShrink:     0,
                }}>
                  <span style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 22, color: T.accent, fontStyle: 'italic' }}>
                    {(profile.avatarName || '?').charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* ── Filled profile fields ─────────────── */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: T.body, fontSize: 8, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.accent, marginBottom: 14 }}>
                  Biography
                </div>
                <SheetField label="Mission"    value={missionLabel} />
                <SheetField label="Peak focus" value={peakLabel} />
                <SheetField label="Stress"     value={stressLabel} />
                <SheetField label="Screen time" value={profile.screenTime !== undefined ? `${profile.screenTime} hrs / day` : undefined} />
                <SheetField label="Sleep"      value={profile.sleep !== undefined ? `${profile.sleep} hrs / night` : undefined} />
              </div>

              {/* ── Stat bars ──────────────────────────── */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: T.body, fontSize: 8, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.accent, marginBottom: 14 }}>
                  Starting Stats
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <StatBar label="Vitality"   value={stats.vitality}   delay={0} />
                  <StatBar label="Focus"      value={stats.focus}      delay={0.1} />
                  <StatBar label="Discipline" value={stats.discipline} delay={0.2} />
                  <StatBar label="Energy"     value={stats.energy}     delay={0.3} />
                </div>
              </div>

              {/* ── Metric pills ──────────────────────── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
                {[
                  { label: 'Shield HP',    val: `${stats.shieldHP}%` },
                  { label: 'Start Coins',  val: `${stats.coins}` },
                ].map(({ label, val: v }) => (
                  <div key={label} style={{
                    padding:      '10px 12px',
                    borderRadius: T.rSm,
                    background:   T.accentBg,
                    border:       `1px solid ${T.accentBorder}`,
                  }}>
                    <div style={{ fontFamily: T.body, fontSize: 8, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.inkLow, marginBottom: 3 }}>{label}</div>
                    <div style={{ fontFamily: T.mono, fontSize: 16, color: T.accent }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* ── Condition note ────────────────────── */}
              <div style={{
                padding:      '12px 14px',
                borderRadius: T.rSm,
                background:   T.cardDeep,
                border:       `1px solid ${T.border}`,
                borderLeft:   `3px solid ${stats.vitality > 60 ? T.accent : 'rgba(184,112,78,0.4)'}`,
              }}>
                <div style={{ fontFamily: T.body, fontSize: 8, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.inkLow, marginBottom: 6 }}>
                  Assessment
                </div>
                <p style={{ fontFamily: T.body, fontWeight: 300, fontSize: 11, fontStyle: 'italic', color: T.inkMid, lineHeight: 1.75, margin: 0 }}>
                  {stats.vitality > 75
                    ? 'Strong foundation. Avatar enters at peak readiness.'
                    : stats.vitality > 50
                    ? 'Moderate baseline. Consistent sessions will raise this quickly.'
                    : stats.vitality > 30
                    ? 'Your current habits are reflected here. That\'s the entire point.'
                    : 'Honest data. Avatar starts wounded. Every quest begins somewhere.'}
                </p>
              </div>

              {/* ── Progress fraction ─────────────────── */}
              <div style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontFamily: T.body, fontSize: 10, color: T.inkLow }}>
                  <span>Profile completion</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div style={{ height: 3, background: T.cardDeep, borderRadius: 2, overflow: 'hidden', border: `1px solid ${T.border}` }}>
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '100%', background: T.accent, borderRadius: 2 }}
                  />
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* CSS to show the panel on large screens */}
        <style>{`
          @media (min-width: 1024px) {
            .viram-sheet-panel { display: block !important; }
          }
        `}</style>

      </div>
    </>
  )
}