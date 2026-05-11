import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { updateProfile } from '../lib/db'
import {
  RiArrowRightLine,
  RiArrowLeftLine,
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
  inkHigh:      '#2A2218',
  inkMid:       '#5A4E42',
  inkLow:       '#8A7B6E',
  border:       'rgba(55,38,22,0.07)',
  borderMid:    'rgba(55,38,22,0.13)',
  borderRule:   'rgba(55,38,22,0.055)',
  accent:       '#B8704E',
  accentBg:     'rgba(184,112,78,0.08)',
  accentBorder: 'rgba(184,112,78,0.22)',
  accentDim:    'rgba(184,112,78,0.38)',
  heading:      "'Cormorant Garamond', Georgia, serif",
  body:         "'Jost', system-ui, sans-serif",
  mono:         "'Courier New', Courier, monospace",
  rSm:  '8px',
  rMd:  '16px',
  rLg:  '24px',
  rPill:'100px',
}

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`
const ease = [0.22, 1, 0.36, 1]

/* ─── Global CSS ────────────────────────────────────────── */
const GLOBAL = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,500;1,600&family=Jost:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .viram-ob::after {
    content:''; position:fixed; inset:0;
    background-image:${GRAIN}; background-repeat:repeat;
    opacity:0.032; pointer-events:none; z-index:9999;
  }

  input[type=range].vslider {
    -webkit-appearance:none; width:100%; height:2px;
    background:${T.borderMid}; border-radius:2px; outline:none; cursor:pointer;
  }
  input[type=range].vslider::-webkit-slider-thumb {
    -webkit-appearance:none; width:26px; height:26px; border-radius:50%;
    background:${T.card}; border:2px solid ${T.accent};
    box-shadow:0 2px 10px rgba(184,112,78,0.26), inset 0 1px 0 rgba(255,255,255,0.7);
    cursor:pointer; transition:transform 0.14s ease;
  }
  input[type=range].vslider::-webkit-slider-thumb:active { transform:scale(1.18); }
  input[type=range].vslider::-moz-range-thumb {
    width:26px; height:26px; border-radius:50%;
    background:${T.card}; border:2px solid ${T.accent}; cursor:pointer;
  }

  @keyframes pulse-dot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.38;transform:scale(.65)} }
  @keyframes float-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

  /* ── Stamp finale ─────────────────────────────────────── */
  @keyframes stamp-slam {
    0%   { opacity:0; transform:translate(-50%,-50%) scale(1.65) rotate(-7deg); }
    55%  { transform:translate(-50%,-50%) scale(0.90) rotate(1.2deg); }
    72%  { transform:translate(-50%,-50%) scale(1.04) rotate(-0.6deg); }
    100% { opacity:1; transform:translate(-50%,-50%) scale(1) rotate(-2deg); }
  }
  .stamp-slam { animation: stamp-slam 0.58s cubic-bezier(0.22,1,0.36,1) forwards; }

  @keyframes ink-ring {
    0%   { transform:translate(-50%,-50%) scale(0.88) rotate(-2deg); opacity:0; }
    40%  { opacity:1; }
    100% { transform:translate(-50%,-50%) scale(1.18) rotate(-2deg); opacity:0; }
  }
  .ink-ring { animation: ink-ring 0.9s ease-out 0.32s forwards; }

  /* ── Margin note hand-lettered feel ──────────────────── */
  @keyframes ink-fade-in { from{opacity:0} to{opacity:1} }
  .margin-note { animation: ink-fade-in 0.7s ease forwards; }
`

/* ─── Archetypes ─────────────────────────────────────────── */
const ARCHETYPES = {
  study:      { title: 'THE SCHOLAR',   sub: 'Knowledge as power.',      icon: '📖' },
  deepwork:   { title: 'THE ARCHITECT', sub: 'Builder of worlds.',        icon: '⚒' },
  health:     { title: 'THE ATHLETE',   sub: 'Body as foundation.',       icon: '⚡' },
  discipline: { title: 'THE WARRIOR',   sub: 'Will as the weapon.',       icon: '⚔' },
  detox:      { title: 'THE MONK',      sub: 'Silence as practice.',      icon: '🌿' },
}

/* ─── Steps ─────────────────────────────────────────────── */
const STEPS = [
  {
    key:'screenTime', type:'range', Icon:RiSmartphoneLine, label:'Screen time',
    q:'How many hours a day do you spend on your phone?',
    sub:"Be brutally honest. This number becomes your avatar's starting burden — and your first target.",
    min:0, max:14, step:0.5, unit:'hrs',
    truth: {
      stat:'The average person unlocks their phone 96 times a day.',
      note:'Awareness is where every real change begins.',
    },
    insight: v =>
      v <= 2 ? 'Disciplined. Your avatar starts from a position of genuine strength.' :
      v <= 5 ? "Average range — there's real room to build from here." :
      v <= 8 ? 'Above average. Your avatar will carry this weight until you shed it.' :
               'High impact. Avatar starts weakened. Every great journey begins somewhere.',
  },
  {
    key:'worstApp', type:'options', autoAdvance:true, Icon:RiAlarmWarningLine, label:'Biggest thief',
    q:'Which app steals the most of your time?',
    sub:'This becomes your primary target. Viram builds a specific friction wall around it.',
    opts:[
      { icon:RiFireLine,         label:'Instagram / TikTok',         sub:'Short-form video loops',   val:'reels'   },
      { icon:RiSmartphoneLine,   label:'YouTube',                    sub:'Long-form rabbit holes',   val:'youtube' },
      { icon:RiTimerFlashLine,   label:'WhatsApp / Messaging',       sub:'Chat that never ends',     val:'chat'    },
      { icon:RiBrainLine,        label:'Twitter / Reddit',           sub:'Infinite scroll feeds',    val:'feed'    },
      { icon:RiSwordLine,        label:'Games',                      sub:'Session creep',            val:'games'   },
      { icon:RiAlarmWarningLine, label:"I don't know / All of them", sub:'Honest answer',            val:'all'     },
    ],
  },
  {
    key:'focusPeak', type:'options', autoAdvance:true, Icon:RiTimerFlashLine, label:'Peak focus',
    q:'When do you feel the sharpest?',
    sub:'Viram schedules your hardest challenges during this window, not against it.',
    opts:[
      { icon:RiMoonLine,         label:'Early morning  5–8 AM',  sub:'Before the world wakes',    val:'early'     },
      { icon:RiFireLine,         label:'Morning  8–12 PM',       sub:'Classic deep work window',  val:'morning'   },
      { icon:RiTimerFlashLine,   label:'Afternoon  12–5 PM',     sub:'Post-lunch momentum',       val:'afternoon' },
      { icon:RiMoonLine,         label:'Evening  5–10 PM',       sub:'Night owl territory',       val:'evening'   },
      { icon:RiAlarmWarningLine, label:"I don't have a peak",    sub:"We'll help you build one",  val:'none'      },
    ],
  },
  {
    key:'mission', type:'options', autoAdvance:true, Icon:RiRocketLine, label:'Mission',
    q:'What are you actually trying to build?',
    sub:'This shapes your archetype and the challenges you face first.',
    truth: {
      stat:'People with a defined mission are 3× more likely to follow through.',
      note:"Let's find yours.",
    },
    opts:[
      { icon:RiBookOpenLine,   label:'Academic focus',      sub:'Exams, research, studying',   val:'study'      },
      { icon:RiBrainLine,      label:'Deep work / career',  sub:'Code, writing, creation',     val:'deepwork'   },
      { icon:RiHeartPulseLine, label:'Health & fitness',    sub:'Workouts, sleep, habits',     val:'health'     },
      { icon:RiSwordLine,      label:'General discipline',  sub:'Willpower across the board',  val:'discipline' },
      { icon:RiShieldLine,     label:'Digital detox',       sub:'Just get off the phone',      val:'detox'      },
    ],
  },
  {
    key:'pastAttempts', type:'options', autoAdvance:true, Icon:RiShieldLine, label:'Past attempts',
    q:'What have you tried before?',
    sub:"We won't suggest what already failed you.",
    opts:[
      { icon:RiAlarmWarningLine, label:'Screen time limits', sub:'You bypassed them',           val:'limits'    },
      { icon:RiTimerFlashLine,   label:'Pomodoro / timers',  sub:"Works until it doesn't",      val:'timers'    },
      { icon:RiBrainLine,        label:'Willpower alone',    sub:"Didn't stick",                val:'willpower' },
      { icon:RiSmartphoneLine,   label:'Other apps',         sub:'None of them held',           val:'apps'      },
      { icon:RiCheckLine,        label:'Nothing yet',        sub:'First real attempt',          val:'nothing'   },
    ],
  },
  {
    key:'sleep', type:'range', Icon:RiMoonLine, label:'Sleep',
    q:'How many hours of sleep do you get each night?',
    sub:"Sleep is your avatar's regeneration stat. Less sleep = slower XP recovery.",
    min:2, max:12, step:0.5, unit:'hrs',
    insight: v =>
      v >= 8 ? 'Optimal. High regeneration rate.' :
      v >= 6 ? 'Acceptable. Slight regeneration penalty.' :
      v >= 4 ? 'Low. Avatar starts with a fatigue marker.' :
               "Critical — maximum fatigue. We'll build your plan around this.",
  },
  {
    key:'stressLevel', type:'options', autoAdvance:true, Icon:RiMentalHealthLine, label:'Stress level',
    q:"What's your honest stress level right now?",
    sub:'This calibrates your daily intensity. Viram should push you — not break you.',
    opts:[
      { icon:RiLeafLine,         label:'Pretty calm',        sub:'Life feels manageable',        val:0 },
      { icon:RiFireLine,         label:'Moderate pressure',  sub:'Juggling things',              val:1 },
      { icon:RiAlarmWarningLine, label:'High stress',        sub:'Running on edge',              val:2 },
      { icon:RiBrainLine,        label:'Burning out',        sub:'Needs immediate attention',    val:3 },
    ],
  },
  {
    key:'avatarName', type:'text', Icon:RiQuillPenLine, label:'Avatar name',
    q:'What will you name your avatar?',
    sub:"This is who you're becoming. Choose something that means something to you.",
    placeholder:'Monk, Nova, Stoic, Shadow…',
    maxLength:20,
  },
]

/* ─── Stat calculator ───────────────────────────────────── */
function calcStats(p) {
  const st=p.screenTime??4, sl=p.sleep??7, str=p.stressLevel??1
  return {
    vitality:   Math.max(15,Math.min(100,Math.round(100-st*5 -str*6 +(sl-5)*3))),
    energy:     Math.max(15,Math.min(100,Math.round(100-st*4 -str*5 +(sl-5)*4))),
    discipline: Math.max(20,Math.min(100,Math.round(100-st*6 -str*4))),
    focus:      Math.max(20,Math.min(100,Math.round(100-st*7 -str*3 +(sl-5)*2))),
    shieldHP:   Math.max(10,Math.min(100,Math.round(100-st*8))),
    coins:      Math.max(1, Math.round(10-st*0.7)),
  }
}

/* ─── Option card ────────────────────────────────────────── */
function OptionCard({ opt, selected, onClick }) {
  const Icon = opt.icon
  return (
    <motion.button
      type="button" onClick={onClick}
      whileHover={{ x:4 }} whileTap={{ scale:0.985 }}
      transition={{ duration:0.2, ease }}
      style={{
        display:'flex', alignItems:'center', gap:14, width:'100%',
        padding:'13px 16px', borderRadius:T.rMd, textAlign:'left', cursor:'pointer',
        border:     selected ? `1px solid ${T.accentBorder}` : `1px solid ${T.border}`,
        background: selected ? T.accentBg : T.card,
        boxShadow:  selected
          ? `0 2px 16px rgba(184,112,78,0.12)`
          : `0 1px 4px rgba(55,38,22,0.04)`,
        transition:'border-color 0.18s, background 0.18s, box-shadow 0.18s',
      }}
    >
      <div style={{
        width:34, height:34, borderRadius:'50%', flexShrink:0,
        border:     selected ? `1px solid ${T.accentBorder}` : `1px solid ${T.borderMid}`,
        background: selected ? `rgba(184,112,78,0.10)` : T.cardDeep,
        display:'flex', alignItems:'center', justifyContent:'center',
        color:      selected ? T.accent : T.inkLow,
        transition:'all 0.18s',
      }}>
        <Icon size={14}/>
      </div>

      <div style={{ flex:1, minWidth:0 }}>
        <div style={{
          fontFamily:T.body, fontWeight:selected?500:400, fontSize:13,
          color:selected?T.inkHigh:T.inkMid, letterSpacing:'0.01em',
        }}>
          {opt.label}
        </div>
        {opt.sub && (
          <div style={{ fontFamily:T.body, fontWeight:300, fontSize:11, color:T.inkLow, marginTop:2 }}>
            {opt.sub}
          </div>
        )}
      </div>

      {/* Ink-dot radio */}
      <div style={{
        width:16, height:16, borderRadius:'50%', flexShrink:0,
        border:     selected ? `2px solid ${T.accent}` : `1px solid ${T.borderMid}`,
        background: selected ? T.accent : 'transparent',
        display:'flex', alignItems:'center', justifyContent:'center',
        transition:'all 0.18s',
      }}>
        {selected && <RiCheckLine size={9} color="#FFF8F2"/>}
      </div>
    </motion.button>
  )
}

/* ─── Archetype Stamp Overlay ────────────────────────────── */
function ArchetypeStamp({ archetype, avatarName, stats, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0, transition:{ duration:0.3 } }}
      style={{
        position:'fixed', inset:0, zIndex:1000,
        background:`rgba(244,238,227,0.96)`,
        backdropFilter:'blur(6px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer',
      }}
      onClick={onDone}
    >
      {/* Ruled paper lines on the overlay itself */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        backgroundImage:`repeating-linear-gradient(transparent, transparent 35px, rgba(55,38,22,0.04) 35px, rgba(55,38,22,0.04) 36px)`,
      }}/>

      <div style={{ position:'relative', textAlign:'center', userSelect:'none' }}>

        {/* Pre-stamp copy */}
        <motion.div
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.06, duration:0.6, ease }}
          style={{ marginBottom:52 }}
        >
          <div style={{
            fontFamily:T.body, fontWeight:300, fontSize:11,
            color:T.inkLow, letterSpacing:'0.22em', textTransform:'uppercase',
          }}>
            Avatar forged
          </div>
          {avatarName && (
            <div style={{
              fontFamily:T.heading, fontWeight:600, fontStyle:'italic',
              fontSize:26, color:T.inkHigh, marginTop:6, letterSpacing:'-0.01em',
            }}>
              {avatarName}
            </div>
          )}
        </motion.div>

        {/* Stamp container — positioned */}
        <div style={{ position:'relative', width:240, height:240, margin:'0 auto' }}>

          {/* Ink ripple ring — fires just after stamp lands */}
          <div className="ink-ring" style={{
            position:'absolute', top:'50%', left:'50%',
            width:240, height:240,
            borderRadius:'50%',
            border:`2px solid ${T.accentBorder}`,
          }}/>

          {/* The stamp itself */}
          <div className="stamp-slam" style={{
            position:'absolute', top:'50%', left:'50%',
            width:220, height:220, borderRadius:'50%',
            background:T.accentBg,
            border:`4px solid ${T.accent}`,
            outline:`2px solid ${T.accentBorder}`,
            outlineOffset:5,
            boxShadow:`0 0 0 1px ${T.accentBorder}, 0 24px 64px rgba(184,112,78,0.22)`,
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            padding:28, gap:4,
          }}>
            {/* Top arc text */}
            <svg width="180" height="40" viewBox="0 0 180 40" style={{ position:'absolute', top:22 }}>
              <path id="arc-top" d="M 20,30 A 70,70 0 0,1 160,30" fill="none"/>
              <text style={{ fontFamily:T.body, fontSize:9, fontWeight:600, letterSpacing:'0.22em', fill:T.accentDim, textTransform:'uppercase' }}>
                <textPath href="#arc-top" startOffset="50%" textAnchor="middle">VIRAM · PROFILE</textPath>
              </text>
            </svg>

            {/* Central content */}
            <div style={{ fontFamily:T.body, fontWeight:600, fontSize:9, letterSpacing:'0.26em', textTransform:'uppercase', color:T.accentDim, marginTop:24 }}>
              Archetype
            </div>
            <div style={{
              fontFamily:T.heading, fontWeight:700,
              fontSize: archetype.title.length > 12 ? 18 : 22,
              letterSpacing:'0.04em', color:T.inkHigh,
              lineHeight:1.1, textAlign:'center', marginTop:4,
            }}>
              {archetype.title}
            </div>
            <div style={{
              fontFamily:T.heading, fontStyle:'italic', fontWeight:400,
              fontSize:12, color:T.accent, marginTop:6, letterSpacing:'0.01em',
            }}>
              {archetype.sub}
            </div>

            {/* Bottom arc text */}
            <svg width="180" height="40" viewBox="0 0 180 40" style={{ position:'absolute', bottom:20 }}>
              <path id="arc-bot" d="M 20,10 A 70,70 0 0,0 160,10" fill="none"/>
              <text style={{ fontFamily:T.body, fontSize:8, fontWeight:500, letterSpacing:'0.18em', fill:T.accentDim }}>
                <textPath href="#arc-bot" startOffset="50%" textAnchor="middle">EST. {new Date().getFullYear()}</textPath>
              </text>
            </svg>
          </div>
        </div>

        {/* Stat chips that appear after stamp settles */}
        <motion.div
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.9, duration:0.55, ease }}
          style={{ marginTop:44, display:'flex', gap:10, justifyContent:'center' }}
        >
          {[
            { label:'Vitality',   val:stats.vitality   },
            { label:'Focus',      val:stats.focus      },
            { label:'Discipline', val:stats.discipline },
          ].map(({ label, val }) => (
            <div key={label} style={{
              padding:'8px 14px', borderRadius:T.rPill,
              background:T.card, border:`1px solid ${T.border}`,
              boxShadow:`0 2px 8px rgba(55,38,22,0.06)`,
            }}>
              <div style={{ fontFamily:T.body, fontSize:8, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:T.inkLow, marginBottom:2 }}>
                {label}
              </div>
              <div style={{ fontFamily:T.heading, fontWeight:600, fontSize:16, color:T.inkHigh }}>
                {val}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay:1.6, duration:0.5 }}
          style={{ marginTop:28, fontFamily:T.body, fontWeight:300, fontSize:11, color:T.inkLow, letterSpacing:'0.06em' }}
        >
          Tap anywhere to enter your dashboard →
        </motion.p>
      </div>
    </motion.div>
  )
}

/* ─── Main component ─────────────────────────────────────── */
export default function Onboarding() {
  const navigate    = useNavigate()
  const [step,      setStep]      = useState(0)
  const [profile,   setProfile]   = useState({ screenTime:4, sleep:7, stressLevel:1, avatarName:'' })
  const [direction, setDirection] = useState(1)
  const [showStamp, setShowStamp] = useState(false)
  const inputRef    = useRef(null)
  const lastRangeVal= useRef(null)
  const advTimer    = useRef(null)

  const cur      = STEPS[step]
  const total    = STEPS.length
  const progress = Math.round((step / total) * 100)
  const isLast   = step === total - 1
  const val      = profile[cur.key]
  const setVal   = v => setProfile(p => ({ ...p, [cur.key]:v }))
  const hasValue = () => {
    if (cur.type==='range') return true
    if (cur.type==='text')  return (val??'').trim().length > 0
    return val !== undefined && val !== null && val !== ''
  }

  const stats     = calcStats(profile)
  const archetype = ARCHETYPES[profile.mission] ?? ARCHETYPES.discipline

  useEffect(() => {
    if (cur.type==='text' && inputRef.current) inputRef.current.focus()
  }, [step])

  /* ── Idea 2: Haptic on range crossing integer ───────── */
  const handleRange = useCallback(e => {
    const v = parseFloat(e.target.value)
    setVal(v)
    if (typeof navigator?.vibrate === 'function') {
      if (lastRangeVal.current !== null && Math.floor(v) !== Math.floor(lastRangeVal.current))
        navigator.vibrate(7)
    }
    lastRangeVal.current = v
  }, [cur.key])

  /* ── Auto-advance for option steps ─────────────────── */
  function pickOption(v) {
    setVal(v)
    if (cur.autoAdvance) {
      clearTimeout(advTimer.current)
      advTimer.current = setTimeout(() => advance(v), 310)
    }
  }

  function advance(overrideVal) {
    const pVal = overrideVal ?? profile[cur.key]
    if (!cur.autoAdvance && !hasValue()) return
    if (isLast) {
      const finalStats = { ...calcStats(profile), disciplineIndex: 1, disciplinePoints: 0 }
      localStorage.setItem('viram_profile', JSON.stringify({ ...profile, ...finalStats }))
      // TODO: remove localStorage fallback after migration
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          updateProfile(user.id, { ...profile, ...finalStats, onboarded: true })
        }
      })
      setShowStamp(true)
      return
    }
    setDirection(1)
    setStep(s => s+1)
  }

  function goBack() {
    if (step===0) { navigate('/start'); return }
    setDirection(-1)
    setStep(s => s-1)
  }

  const slide = {
    enter:  d => ({ opacity:0, x: d>0 ?  36 : -36 }),
    center: { opacity:1, x:0 },
    exit:   d => ({ opacity:0, x: d>0 ? -36 :  36 }),
  }

  return (
    <>
      <style>{GLOBAL}</style>

      <div className="viram-ob" style={{
        minHeight:'100vh', background:T.bg,
        display:'flex', flexDirection:'column',
        overflow:'hidden', position:'relative',
      }}>

        {/* Background ruled lines */}
        <div style={{
          position:'fixed', inset:0, pointerEvents:'none',
          backgroundImage:`repeating-linear-gradient(transparent, transparent 35px, ${T.borderRule} 35px, ${T.borderRule} 36px)`,
          backgroundPositionY:'60px',
        }}/>

        {/* ── Archetype stamp overlay ───────────────── */}
        <AnimatePresence>
          {showStamp && (
            <ArchetypeStamp
              archetype={archetype}
              avatarName={profile.avatarName}
              stats={stats}
              onDone={() => navigate('/dashboard')}
            />
          )}
        </AnimatePresence>

        {/* ── Top bar ───────────────────────────────── */}
        <div style={{
          flexShrink:0, display:'flex', alignItems:'center', gap:14,
          padding:'13px 22px', borderBottom:`1px solid ${T.border}`,
          background:T.card, boxShadow:`0 1px 0 rgba(55,38,22,0.03)`,
          position:'relative', zIndex:10,
        }}>
          <button
            onClick={goBack}
            style={{
              width:34, height:34, borderRadius:'50%', border:`1px solid ${T.borderMid}`,
              background:T.cardDeep, display:'flex', alignItems:'center', justifyContent:'center',
              color:T.inkLow, cursor:'pointer', flexShrink:0, transition:'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=T.accentBorder; e.currentTarget.style.color=T.accent }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=T.borderMid;    e.currentTarget.style.color=T.inkLow  }}
          >
            <RiArrowLeftLine size={13}/>
          </button>

          {/* Step pills */}
          <div style={{ flex:1, display:'flex', gap:4 }}>
            {STEPS.map((_,i) => (
              <div key={i} style={{
                flex:       i===step ? 2.5 : 1,
                height:     3, borderRadius:2,
                background: i<step ? T.accent : i===step ? T.accentDim : T.borderMid,
                transition:'all 0.5s cubic-bezier(0.22,1,0.36,1)',
              }}/>
            ))}
          </div>

          <div style={{ fontFamily:T.body, fontSize:11, fontWeight:500, color:T.inkLow, flexShrink:0, letterSpacing:'0.06em' }}>
            {step+1}&thinsp;/&thinsp;{total}
          </div>
          <div style={{ fontFamily:T.heading, fontWeight:700, fontSize:17, letterSpacing:'0.14em', color:T.inkHigh, flexShrink:0, marginLeft:6 }}>
            VI<span style={{ color:T.accent }}>RAM</span>
          </div>
        </div>

        {/* ── Question area + margin note ────────────── */}
        <div style={{ flex:1, display:'flex', overflow:'hidden', position:'relative' }}>

          {/* ── Idea 5: Rotated margin completion note ── */}
          <div style={{
            position:'absolute',
            left:0, top:0, bottom:0,
            width:36,
            display:'flex', alignItems:'center', justifyContent:'center',
            pointerEvents:'none', zIndex:5,
            borderRight:`1px solid ${T.border}`,
          }}>
            {/* The margin text, re-keyed on step so it re-animates on each advance */}
            <div
              key={`margin-${step}`}
              className="margin-note"
              style={{
                fontFamily:    `'Cormorant Garamond', Georgia, serif`,
                fontStyle:     'italic',
                fontWeight:    400,
                fontSize:      11,
                color:         progress >= 50 ? T.accent : T.inkLow,
                letterSpacing: '0.14em',
                whiteSpace:    'nowrap',
                transform:     'rotate(-90deg)',
                transformOrigin:'center center',
                opacity:       progress === 0 ? 0.3 : 0.7,
                transition:    'color 0.6s ease',
                userSelect:    'none',
              }}
            >
              {progress}% complete
            </div>
          </div>

          {/* ── Scrollable question column ────────────── */}
          <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', paddingLeft:36 }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration:0.38, ease }}
                style={{
                  display:'flex', flexDirection:'column', flex:1,
                  maxWidth:600, width:'100%', margin:'0 auto',
                  padding:'clamp(28px,5vh,52px) clamp(20px,4vw,52px)',
                }}
              >
                {/* Step badge */}
                <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:26, alignSelf:'flex-start' }}>
                  <div style={{
                    width:34, height:34, borderRadius:'50%',
                    background:T.accentBg, border:`1px solid ${T.accentBorder}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:T.accent,
                  }}>
                    <cur.Icon size={14}/>
                  </div>
                  <span style={{ fontFamily:T.body, fontSize:10, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:T.inkLow }}>
                    {cur.label}
                  </span>
                </div>

                {/* Question */}
                <h2 style={{
                  fontFamily:T.heading, fontWeight:700,
                  fontSize:'clamp(24px,4vw,36px)', lineHeight:1.08,
                  letterSpacing:'-0.02em', color:T.inkHigh, marginBottom:10,
                }}>
                  {cur.q}
                </h2>
                <p style={{
                  fontFamily:T.body, fontWeight:300, fontSize:14,
                  color:T.inkMid, lineHeight:1.85, marginBottom:32,
                  maxWidth:480, letterSpacing:'0.01em',
                }}>
                  {cur.sub}
                </p>

                {/* Truth card */}
                {cur.truth && (
                  <motion.div
                    initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay:0.22, duration:0.5, ease }}
                    style={{
                      marginBottom:24, padding:'14px 18px',
                      background:T.accentBg,
                      border:`1px solid ${T.accentBorder}`,
                      borderLeft:`3px solid ${T.accent}`,
                      borderRadius:T.rSm,
                    }}
                  >
                    <div style={{ fontFamily:T.heading, fontWeight:600, fontSize:14, color:T.inkHigh, fontStyle:'italic', marginBottom:5 }}>
                      "{cur.truth.stat}"
                    </div>
                    <div style={{ fontFamily:T.body, fontWeight:300, fontSize:11, color:T.inkMid }}>
                      {cur.truth.note}
                    </div>
                  </motion.div>
                )}

                {/* ── RANGE ──────────────────────────── */}
                {cur.type==='range' && (
                  <div style={{ marginBottom:28 }}>
                    {/* Big ruled number */}
                    <div style={{
                      textAlign:'center', marginBottom:28,
                      padding:'22px 0', position:'relative',
                      borderTop:`1px solid ${T.border}`,
                      borderBottom:`1px solid ${T.border}`,
                    }}>
                      {[...Array(4)].map((_,i) => (
                        <div key={i} style={{
                          position:'absolute', left:0, right:0,
                          top:18+i*19, height:1, background:T.borderRule,
                        }}/>
                      ))}
                      <span style={{
                        fontFamily:T.heading, fontWeight:700,
                        fontSize:'clamp(60px,11vw,82px)',
                        lineHeight:1, letterSpacing:'-0.04em',
                        color:T.inkHigh, position:'relative', zIndex:1,
                      }}>
                        {val}
                      </span>
                      <span style={{
                        fontFamily:T.body, fontWeight:300, fontSize:16,
                        color:T.inkLow, marginLeft:6,
                        position:'relative', zIndex:1,
                      }}>
                        {cur.unit}
                      </span>
                    </div>

                    <input type="range" className="vslider"
                      min={cur.min} max={cur.max} step={cur.step}
                      value={val??cur.min}
                      onChange={handleRange}
                    />
                    <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontFamily:T.body, fontSize:11, color:T.inkLow }}>
                      <span>{cur.min}{cur.unit}</span>
                      <span>{cur.max}{cur.unit}</span>
                    </div>

                    {cur.insight && (
                      <div style={{
                        marginTop:18, padding:'13px 17px',
                        background:T.accentBg, border:`1px solid ${T.accentBorder}`,
                        borderLeft:`3px solid ${T.accent}`, borderRadius:T.rSm,
                      }}>
                        <p style={{ fontFamily:T.body, fontWeight:300, fontSize:12, fontStyle:'italic', color:T.inkMid, lineHeight:1.8, margin:0 }}>
                          {cur.insight(val??cur.min)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── OPTIONS ────────────────────────── */}
                {cur.type==='options' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:28 }}>
                    {cur.opts.map(opt => (
                      <OptionCard
                        key={String(opt.val)}
                        opt={opt}
                        selected={val===opt.val}
                        onClick={() => pickOption(opt.val)}
                      />
                    ))}
                  </div>
                )}

                {/* ── TEXT ───────────────────────────── */}
                {cur.type==='text' && (
                  <div style={{ marginBottom:28 }}>
                    <div style={{
                      background:T.card, border:`1px solid ${T.borderMid}`,
                      borderRadius:T.rMd, padding:'20px 24px 16px',
                      boxShadow:`0 2px 10px rgba(55,38,22,0.06), inset 0 1px 0 rgba(255,255,255,0.6)`,
                      position:'relative',
                    }}>
                      <label style={{ fontFamily:T.body, fontSize:9, fontWeight:600, letterSpacing:'0.22em', textTransform:'uppercase', color:T.inkLow, display:'block', marginBottom:12 }}>
                        Avatar Name
                      </label>
                      {[0,1,2].map(i => (
                        <div key={i} style={{ position:'absolute', left:24, right:24, top:52+i*26, height:1, background:T.borderRule }}/>
                      ))}
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder={cur.placeholder}
                        value={val??''}
                        onChange={e => setVal(e.target.value)}
                        maxLength={cur.maxLength}
                        style={{
                          width:'100%', background:'transparent', border:'none', outline:'none',
                          fontFamily:T.heading, fontStyle:'italic', fontWeight:500,
                          fontSize:30, color:T.inkHigh, letterSpacing:'-0.01em',
                          position:'relative', zIndex:1, padding:0,
                        }}
                      />
                      <div style={{ display:'flex', justifyContent:'flex-end', marginTop:10, fontFamily:T.body, fontSize:10, color:T.inkLow, position:'relative', zIndex:1 }}>
                        {(val??'').length}&thinsp;/&thinsp;{cur.maxLength}
                      </div>
                    </div>
                    <p style={{ marginTop:10, fontFamily:T.body, fontWeight:300, fontSize:12, fontStyle:'italic', color:T.inkLow, lineHeight:1.7 }}>
                      This name will appear above your avatar on your dashboard.
                    </p>
                  </div>
                )}

                {/* ── Continue button ─────────────────── */}
                {/* Show for range/text always; for options only when no autoAdvance or val already set */}
                {(cur.type !== 'options' || !cur.autoAdvance) && (
                  <div style={{ marginTop:'auto', paddingTop:8 }}>
                    <motion.button
                      onClick={() => advance()}
                      disabled={!hasValue()}
                      whileHover={hasValue() ? { y:-2, boxShadow:`0 14px 36px rgba(184,112,78,0.26)` } : {}}
                      whileTap={hasValue()   ? { y:0 } : {}}
                      transition={{ duration:0.28, ease }}
                      style={{
                        width:'100%', padding:'15px 24px', borderRadius:T.rPill,
                        background: hasValue() ? T.accent : T.cardDeep,
                        border:`1px solid ${hasValue() ? T.accent : T.border}`,
                        color:      hasValue() ? '#FFF8F2' : T.inkLow,
                        fontFamily:T.body, fontWeight:600, fontSize:13,
                        letterSpacing:'0.10em', textTransform:'uppercase',
                        display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                        cursor:     hasValue() ? 'pointer' : 'not-allowed',
                        boxShadow:  hasValue() ? `0 4px 18px rgba(184,112,78,0.20)` : 'none',
                        transition:'all 0.22s ease',
                      }}
                    >
                      {isLast
                        ? <><RiRocketLine size={14}/> Forge My Avatar</>
                        : <>Continue <RiArrowRightLine size={13}/></>
                      }
                    </motion.button>

                    <p style={{
                      textAlign:'center', marginTop:12,
                      fontFamily:T.body, fontWeight:300, fontSize:11, color:T.inkLow, letterSpacing:'0.04em',
                    }}>
                      {total-step-1 > 0
                        ? `${total-step-1} question${total-step-1>1?'s':''} remaining`
                        : 'Last question — almost there.'}
                    </p>
                  </div>
                )}

                {/* Auto-advance hint */}
                {cur.type==='options' && cur.autoAdvance && (
                  <p style={{ marginTop:4, textAlign:'center', fontFamily:T.body, fontWeight:300, fontSize:11, color:T.inkLow, fontStyle:'italic', letterSpacing:'0.02em' }}>
                    Select an option to continue
                  </p>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </>
  )
}