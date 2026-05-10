import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiFlashlightLine, RiTimerFlashLine, RiBookOpenLine,
  RiUserLine, RiSettings3Line, RiQuillPenLine,
  RiSparkling2Line, RiFireLine, RiMentalHealthLine,
  RiLeafLine, RiCalendarCheckLine, RiChat3Line,
  RiDoubleQuotesL, RiHeartPulseLine,
  RiArrowRightSLine, RiCheckLine, RiAddLine,
  RiAlarmWarningLine, RiDropLine, RiZzzLine,
  RiSmartphoneLine, RiLockLine, RiRadarLine,
} from 'react-icons/ri'

/* ─── Design Tokens ─────────────────────────────────────── */
const T = {
  bg:           '#F4EEE3',
  card:         '#F9F5EC',
  cardDeep:     '#EDE5D4',
  cardSunken:   '#E6DCC8',
  inkHigh:      '#2A2218',
  inkMid:       '#5A4E42',
  inkLow:       '#8A7B6E',
  inkGhost:     'rgba(55,38,22,0.18)',
  border:       'rgba(55,38,22,0.07)',
  borderMid:    'rgba(55,38,22,0.13)',
  borderRule:   'rgba(55,38,22,0.05)',
  accent:       '#B8704E',
  accentBg:     'rgba(184,112,78,0.08)',
  accentBorder: 'rgba(184,112,78,0.22)',
  accentDim:    'rgba(184,112,78,0.40)',
  green:        '#6B8F5E',
  greenBg:      'rgba(107,143,94,0.10)',
  greenBorder:  'rgba(107,143,94,0.25)',
  red:          '#B85E5E',
  redBg:        'rgba(184,94,94,0.08)',
  redBorder:    'rgba(184,94,94,0.20)',
  heading:      "'Cormorant Garamond', Georgia, serif",
  body:         "'Jost', system-ui, sans-serif",
  rSm: '8px', rMd: '14px', rLg: '22px', rXl: '28px', rPill: '100px',
}

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`
const ease = [0.22, 1, 0.36, 1]

const QUOTES = [
  { text: "Every moment you resist is a vote for the life you want.", author: "Viram" },
  { text: "Boredom is not the enemy. It is the doorway.", author: "Blaise Pascal" },
  { text: "You cannot find yourself by going into your feed. You find yourself by going into your mind.", author: "Viram" },
  { text: "The cost of a thing is the amount of life which is required to be exchanged for it.", author: "Thoreau" },
  { text: "In the age of distraction, attention is rebellion.", author: "Viram" },
]

/* ─── Platform icons data ───────────────────────────────── */
const PLATFORMS = [
  { id: 'ig',  label: 'Instagram', color: '#C13584', bg: 'rgba(193,53,132,0.08)'  },
  { id: 'tw',  label: 'Twitter/X', color: '#1DA1F2', bg: 'rgba(29,161,242,0.08)'  },
  { id: 'tk',  label: 'TikTok',    color: '#69C9D0', bg: 'rgba(105,201,208,0.08)' },
  { id: 'yt',  label: 'YouTube',   color: '#FF0000', bg: 'rgba(255,0,0,0.08)'     },
  { id: 'fb',  label: 'Facebook',  color: '#1877F2', bg: 'rgba(24,119,242,0.08)'  },
]

/* ─── Heatmap hours ─────────────────────────────────────── */
const HOURS = ['6a','8a','10a','12p','2p','4p','6p','8p','10p']
const MOCK_HEAT = [0,0,1,2,1,3,4,5,3] // mock relapse intensity by hour

/* ─── CSS ───────────────────────────────────────────────── */
const GLOBAL = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,500;1,600&family=Jost:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  .viram-dash { background:${T.bg}; }
  .viram-dash::after {
    content:''; position:fixed; inset:0;
    background-image:${GRAIN}; background-repeat:repeat;
    opacity:0.032; pointer-events:none; z-index:9999;
  }

  @keyframes pulse-dot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.6)} }
  @keyframes float-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
  @keyframes spin-slow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes spin-rev   { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
  @keyframes bar-fill   { from{width:0%} to{width:var(--w)} }
  @keyframes ring-in    { from{stroke-dashoffset:var(--full)} to{stroke-dashoffset:var(--offset)} }

  .viram-scroll::-webkit-scrollbar { width:2px; }
  .viram-scroll::-webkit-scrollbar-track { background:transparent; }
  .viram-scroll::-webkit-scrollbar-thumb { background:${T.borderMid}; border-radius:2px; }

  .action-btn:hover { transform:translateY(-3px); box-shadow:0 14px 32px rgba(55,38,22,0.13) !important; }
  .action-btn { transition: transform 0.22s ease, box-shadow 0.22s ease; }

  .nav-item:hover { background:${T.accentBg}; color:${T.accent}; }
  .nav-item { transition: all 0.18s ease; }

  .heat-cell { transition: opacity 0.2s ease; }
  .heat-cell:hover { opacity:0.7 !important; }

  .intention-input {
    background: transparent;
    border: none;
    outline: none;
    width: 100%;
    font-family: ${T.heading};
    font-style: italic;
    font-size: 15px;
    color: ${T.inkHigh};
    resize: none;
    line-height: 1.6;
  }
  .intention-input::placeholder { color: ${T.inkGhost}; }
`

/* ─── Helpers ───────────────────────────────────────────── */
function SectionLabel({ icon: Icon, label, action, onAction }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
      <Icon size={10} color={T.accentDim} />
      <span style={{ fontFamily:T.body, fontSize:9, fontWeight:600, letterSpacing:'0.22em', textTransform:'uppercase', color:T.inkLow }}>
        {label}
      </span>
      <div style={{ flex:1, height:1, background:T.border }} />
      {action && (
        <button onClick={onAction} style={{ fontFamily:T.body, fontSize:9, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:T.accent, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:3 }}>
          {action} <RiArrowRightSLine size={10} />
        </button>
      )}
    </div>
  )
}

function Card({ children, style = {}, accent = false }) {
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${accent ? T.accentBorder : T.border}`,
      borderRadius: T.rLg,
      boxShadow: `0 2px 12px rgba(55,38,22,0.06), inset 0 1px 0 rgba(255,255,255,0.55)`,
      position: 'relative',
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  )
}

function AvatarDisc({ name, picture }) {
  const initial = (name || '?').charAt(0).toUpperCase()
  return (
    <div style={{ position:'relative', width:52, height:52, flexShrink:0 }}>
      <svg style={{ position:'absolute', inset:-8, width:68, height:68, animation:'spin-slow 22s linear infinite' }} viewBox="0 0 68 68">
        <circle cx="34" cy="34" r="30" fill="none" stroke={T.accentBorder} strokeWidth="1" strokeDasharray="3 9" />
      </svg>
      <svg style={{ position:'absolute', inset:-3, width:58, height:58, animation:'spin-rev 15s linear infinite' }} viewBox="0 0 58 58">
        <circle cx="29" cy="29" r="26" fill="none" stroke={T.border} strokeWidth="0.8" strokeDasharray="1 7" />
      </svg>
      <div style={{
        width:52, height:52, borderRadius:'50%',
        background: T.card,
        border:`1.5px solid ${T.borderMid}`,
        boxShadow:`0 4px 14px rgba(55,38,22,0.10), inset 0 1px 0 rgba(255,255,255,0.7)`,
        display:'flex', alignItems:'center', justifyContent:'center',
        overflow:'hidden', animation:'float-slow 5s ease-in-out infinite',
      }}>
        {picture
          ? <img src={picture} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover', filter:'sepia(0.12)' }} />
          : <span style={{ fontFamily:T.heading, fontWeight:700, fontStyle:'italic', fontSize:20, color:T.inkHigh }}>{initial}</span>
        }
      </div>
    </div>
  )
}

/* ─── Progress Ring ─────────────────────────────────────── */
function ProgressRing({ value, max, size = 64, stroke = 4, color = T.accent, children }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  const offset = circ * (1 - pct)
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.border} strokeWidth={stroke} />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition:'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {children}
      </div>
    </div>
  )
}

/* ─── Mini bar chart ────────────────────────────────────── */
function MiniBar({ label, value, max, color, bg }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
        <span style={{ fontFamily:T.body, fontWeight:400, fontSize:11, color:T.inkMid }}>{label}</span>
        <span style={{ fontFamily:T.heading, fontWeight:600, fontSize:13, color:T.inkHigh }}>{value}h</span>
      </div>
      <div style={{ height:5, borderRadius:T.rPill, background:bg, overflow:'hidden' }}>
        <div style={{
          height:'100%', borderRadius:T.rPill,
          background:color, width:`${pct}%`,
          transition:'width 1.1s cubic-bezier(0.22,1,0.36,1)',
        }} />
      </div>
    </div>
  )
}

/* ─── Heatmap ───────────────────────────────────────────── */
function HeatmapRow({ hours, data }) {
  const max = Math.max(...data, 1)
  return (
    <div style={{ display:'flex', gap:5, alignItems:'flex-end' }}>
      {data.map((val, i) => {
        const intensity = val / max
        return (
          <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
            <div
              className="heat-cell"
              title={`${hours[i]}: ${val} relapse${val !== 1 ? 's' : ''}`}
              style={{
                height: 28,
                borderRadius: 4,
                background: val === 0
                  ? T.cardDeep
                  : `rgba(184,112,78,${0.15 + intensity * 0.7})`,
                width: '100%',
                border: `1px solid ${val === 0 ? T.border : T.accentBorder}`,
              }}
            />
            <span style={{ fontFamily:T.body, fontSize:8, color:T.inkLow, letterSpacing:'0.04em' }}>{hours[i]}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ═══ DASHBOARD ═══════════════════════════════════════════ */
export default function Dashboard() {
  const navigate = useNavigate()
  const [tab, setTab]             = useState('home')
  const [user, setUser]           = useState(null)
  const [intention, setIntention] = useState('')
  const [intentionSet, setIntentionSet] = useState(false)
  const [cleanDays, setCleanDays] = useState(4)
  const [focusPoints, setFocusPoints]       = useState(0)
  const [disciplineIndex, setDisciplineIndex] = useState(0)
  const [todayFocusMins, setTodayFocusMins]   = useState(0)
  const [showCmp, setShowCmp]                 = useState(false)
  const intentionRef                          = useRef(null)

  const stats = {
    xp:          340,
    streak:      cleanDays,
    focusMins:   todayFocusMins,
    confessions: 3,
    disciplinePoints: disciplineIndex,
    focusPoints:      focusPoints,
    energyPoints:     91,
  }

  /* Usage data (hours saved this week) */
  const usage = [
    { label:'Instagram', value:1.2, max:6, color:'#C13584', bg:'rgba(193,53,132,0.10)' },
    { label:'TikTok',    value:0.4, max:6, color:'#69C9D0', bg:'rgba(105,201,208,0.10)' },
    { label:'Twitter/X', value:0.8, max:6, color:'#1DA1F2', bg:'rgba(29,161,242,0.10)'  },
  ]

  const todayQuote = QUOTES[new Date().getDate() % QUOTES.length]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const displayName = user?.name?.split(' ')[0] || 'Scholar'

  useEffect(() => {
    const u = localStorage.getItem('viram_user')
    if (u) {
      const parsed = JSON.parse(u)
      setUser(parsed)
      setDisciplineIndex(parsed.disciplineIndex || 0)
      setFocusPoints(parsed.focusPoints || 0)
    }
    const saved = localStorage.getItem('viram_intention')
    if (saved) { setIntention(saved); setIntentionSet(true) }
    const ft = localStorage.getItem('viram_focus_today')
    if (ft) {
      const f = JSON.parse(ft)
      if (f.date === new Date().toDateString()) setTodayFocusMins(f.mins || 0)
    }
    const t = setTimeout(() => setShowCmp(true), 600)
    return () => clearTimeout(t)
  }, [])

  function saveIntention() {
    if (!intention.trim()) return
    localStorage.setItem('viram_intention', intention)
    setIntentionSet(true)
  }

  /* ── NAV ITEMS ─────────────────────────────────────────── */
  const NAV = [
    { id:'home',    icon:RiFlashlightLine,  label:'Home'    },
    { id:'focus',   icon:RiTimerFlashLine,  label:'Focus',   route:'/focus'   },
    { id:'confess', icon:RiChat3Line,       label:'Confess', route:'/confess' },
    { id:'library', icon:RiBookOpenLine,    label:'Library', route:'/library' },
    { id:'profile', icon:RiUserLine,        label:'Profile', route:'/profile' },
  ]

  return (
    <>
      <style>{GLOBAL}</style>
      <div className="viram-dash" style={{ position:'fixed', inset:0, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Ruled lines */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:`repeating-linear-gradient(transparent, transparent 35px, ${T.borderRule} 35px, ${T.borderRule} 36px)`,
          backgroundPositionY:'56px',
        }} />

        {/* ── HEADER ──────────────────────────────────────── */}
        <div style={{
          flexShrink:0, padding:'12px 18px',
          borderBottom:`1px solid ${T.border}`,
          background:`rgba(249,245,236,0.97)`,
          backdropFilter:'blur(14px)',
          position:'relative', zIndex:20,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          boxShadow:`0 1px 0 rgba(55,38,22,0.04)`,
        }}>
          <div>
            <div style={{ fontFamily:T.heading, fontWeight:700, fontSize:19, letterSpacing:'0.14em', color:T.inkHigh, lineHeight:1 }}>
              VI<span style={{ color:T.accent }}>RAM</span>
            </div>
            <div style={{ fontFamily:T.body, fontWeight:300, fontSize:10.5, color:T.inkLow, marginTop:1 }}>
              {greeting},{' '}
              <em style={{ fontFamily:T.heading, fontStyle:'italic', fontSize:12, color:T.inkMid }}>{displayName}</em>
            </div>
          </div>

          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {/* Streak pill */}
            <div style={{
              display:'flex', alignItems:'center', gap:5,
              padding:'5px 12px', borderRadius:T.rPill,
              background:T.accentBg, border:`1px solid ${T.accentBorder}`,
            }}>
              <RiFireLine size={11} color={T.accent} />
              <span style={{ fontFamily:T.heading, fontWeight:700, fontSize:14, color:T.inkHigh }}>{stats.streak}</span>
              <span style={{ fontFamily:T.body, fontWeight:300, fontSize:9, color:T.inkLow }}>days</span>
            </div>

            {/* Settings */}
            <motion.button
              onClick={() => navigate('/settings')}
              whileHover={{ rotate:22 }} whileTap={{ scale:0.9 }}
              transition={{ duration:0.26, ease }}
              style={{
                width:34, height:34, borderRadius:'50%',
                background:T.cardDeep, border:`1px solid ${T.borderMid}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                color:T.inkLow, cursor:'pointer',
              }}
            >
              <RiSettings3Line size={15} />
            </motion.button>
          </div>
        </div>

        {/* ── BODY ────────────────────────────────────────── */}
        <div className="viram-scroll" style={{ flex:1, overflowY:'auto', position:'relative', zIndex:1 }}>
          <AnimatePresence mode="wait">

            {/* ══════════ HOME TAB ══════════ */}
            <motion.div key="home"
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                transition={{ duration:0.3 }}
                style={{ padding:'14px 14px 120px' }}
              >

                {/* ── Hero identity card ───────────────────── */}
                <Card style={{ marginBottom:12 }}>
                  {/* Subtle accent bar top */}
                  <div style={{ height:2.5, background:`linear-gradient(90deg, transparent 0%, ${T.accent} 40%, transparent 100%)`, opacity:0.5 }} />
                  <div style={{ padding:'16px 18px' }}>
                    <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                      <AvatarDisc name={displayName} picture={user?.picture} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontFamily:T.heading, fontWeight:700, fontStyle:'italic', fontSize:22, color:T.inkHigh, letterSpacing:'-0.01em', lineHeight:1 }}>
                          {displayName}
                        </div>
                        <div style={{ fontFamily:T.body, fontWeight:300, fontSize:10.5, color:T.inkLow, marginTop:3 }}>
                          {stats.xp} XP · {stats.focusMins} focus mins today
                        </div>

                        {/* Stat pills */}
                        <div style={{ display:'flex', gap:6, marginTop:9, flexWrap:'wrap' }}>
                          {[
                            { icon:RiCalendarCheckLine, val:stats.disciplinePoints, label:'Discipline', c:T.accent,     bg:T.accentBg,  border:T.accentBorder },
                            { icon:RiTimerFlashLine,    val:stats.focusPoints,      label:'Focus',      c:'#6B8F5E',    bg:T.greenBg,   border:T.greenBorder  },
                            { icon:RiHeartPulseLine,    val:stats.energyPoints,     label:'Energy',     c:T.inkMid,     bg:T.cardDeep,  border:T.border       },
                          ].map(({ icon:Icon, val, label, c, bg, border }) => (
                            <div key={label} style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:T.rPill, background:bg, border:`1px solid ${border}` }}>
                              <Icon size={10} color={c} />
                              <span style={{ fontFamily:T.heading, fontWeight:700, fontSize:13, color:T.inkHigh }}>{val}</span>
                              <span style={{ fontFamily:T.body, fontWeight:300, fontSize:9, color:T.inkLow }}>{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* ── Daily Intention ──────────────────────── */}
                <Card style={{ marginBottom:12, border:`1px solid ${intentionSet ? T.greenBorder : T.border}` }}>
                  <div style={{ padding:'14px 18px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                      <RiQuillPenLine size={12} color={intentionSet ? T.green : T.accentDim} />
                      <span style={{ fontFamily:T.body, fontSize:9, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color: intentionSet ? T.green : T.inkLow }}>
                        Today's Intention
                      </span>
                      {intentionSet && (
                        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:4 }}>
                          <RiCheckLine size={10} color={T.green} />
                          <span style={{ fontFamily:T.body, fontSize:9, color:T.green }}>Set</span>
                        </div>
                      )}
                    </div>

                    <textarea
                      ref={intentionRef}
                      className="intention-input"
                      rows={2}
                      placeholder="What will you protect your attention for today?"
                      value={intention}
                      onChange={e => { setIntention(e.target.value); setIntentionSet(false) }}
                    />

                    {!intentionSet && intention.trim() && (
                      <motion.button
                        initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
                        onClick={saveIntention}
                        style={{
                          marginTop:10, padding:'7px 18px', borderRadius:T.rPill,
                          background:T.accent, border:'none', cursor:'pointer',
                          fontFamily:T.body, fontWeight:600, fontSize:11,
                          letterSpacing:'0.08em', textTransform:'uppercase',
                          color:'#FFF8F2',
                        }}
                      >
                        Commit
                      </motion.button>
                    )}
                  </div>
                </Card>

                {/* ── Recovery Stats Row ───────────────────── */}
                <SectionLabel icon={RiRadarLine} label="Recovery Overview" />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:18 }}>

                  {/* Clean days ring */}
                  <Card>
                    <div style={{ padding:'16px 14px', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                      <div style={{ fontFamily:T.body, fontSize:9, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:T.inkLow }}>
                        Clean Days
                      </div>
                      <ProgressRing value={cleanDays} max={7} size={72} stroke={4} color={T.accent}>
                        <div style={{ textAlign:'center' }}>
                          <div style={{ fontFamily:T.heading, fontWeight:700, fontSize:22, color:T.inkHigh, lineHeight:1 }}>{cleanDays}</div>
                          <div style={{ fontFamily:T.body, fontWeight:300, fontSize:8, color:T.inkLow }}>/ 7 day</div>
                        </div>
                      </ProgressRing>
                      <div style={{ fontFamily:T.body, fontWeight:300, fontSize:10, color:T.inkLow, fontStyle:'italic', textAlign:'center' }}>
                        {cleanDays >= 7 ? 'Full week clean 🌿' : `${7 - cleanDays} more to go`}
                      </div>
                    </div>
                  </Card>

                  {/* Focus time ring */}
                  <Card>
                    <div style={{ padding:'16px 14px', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                      <div style={{ fontFamily:T.body, fontSize:9, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:T.inkLow }}>
                        Focus Today
                      </div>
                      <ProgressRing value={stats.focusMins} max={120} size={72} stroke={4} color={T.green}>
                        <div style={{ textAlign:'center' }}>
                          <div style={{ fontFamily:T.heading, fontWeight:700, fontSize:18, color:T.inkHigh, lineHeight:1 }}>{stats.focusMins}m</div>
                          <div style={{ fontFamily:T.body, fontWeight:300, fontSize:8, color:T.inkLow }}>/ 120m</div>
                        </div>
                      </ProgressRing>
                      <div style={{ fontFamily:T.body, fontWeight:300, fontSize:10, color:T.inkLow, fontStyle:'italic', textAlign:'center' }}>
                        {stats.focusMins >= 60 ? 'Great session today' : 'Keep building'}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* ── Usage reduced this week ──────────────── */}
                <SectionLabel icon={RiSmartphoneLine} label="Screen Time Reduced" action="See all" onAction={() => navigate('/problems')} />
                <Card style={{ marginBottom:18 }}>
                  <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:13 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <div>
                        <div style={{ fontFamily:T.heading, fontWeight:700, fontSize:28, color:T.inkHigh, lineHeight:1 }}>
                          3.6<span style={{ fontSize:14, fontWeight:400, color:T.inkLow }}> hrs</span>
                        </div>
                        <div style={{ fontFamily:T.body, fontWeight:300, fontSize:11, color:T.green, marginTop:2 }}>
                          ↓ saved vs. last week
                        </div>
                      </div>
                      <div style={{ padding:'6px 12px', borderRadius:T.rPill, background:T.greenBg, border:`1px solid ${T.greenBorder}` }}>
                        <span style={{ fontFamily:T.body, fontWeight:600, fontSize:10, color:T.green }}>This Week</span>
                      </div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                      {usage.map(u => <MiniBar key={u.label} {...u} />)}
                    </div>
                  </div>
                </Card>

                {/* ── Trigger Heatmap ──────────────────────── */}
                <SectionLabel icon={RiAlarmWarningLine} label="Relapse Heatmap" action="Full report" onAction={() => navigate('/problems')} />
                <Card style={{ marginBottom:18 }}>
                  <div style={{ padding:'14px 16px' }}>
                    <div style={{ fontFamily:T.body, fontWeight:300, fontSize:11, color:T.inkMid, marginBottom:12, lineHeight:1.6 }}>
                      When you're most vulnerable today — avoid these windows.
                    </div>
                    <HeatmapRow hours={HOURS} data={MOCK_HEAT} />
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:12 }}>
                      <div style={{ width:8, height:8, borderRadius:2, background:T.cardDeep, border:`1px solid ${T.border}` }} />
                      <span style={{ fontFamily:T.body, fontSize:9, color:T.inkLow }}>No urge</span>
                      <div style={{ width:8, height:8, borderRadius:2, background:`rgba(184,112,78,0.85)`, marginLeft:8 }} />
                      <span style={{ fontFamily:T.body, fontSize:9, color:T.inkLow }}>High urge</span>
                    </div>
                  </div>
                </Card>

                {/* ── Actions grid ─────────────────────────── */}
                <SectionLabel icon={RiFlashlightLine} label="Actions" />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:18 }}>
                  {[
                    { icon:RiTimerFlashLine, label:'Focus Mode',   sub:'Enter deep work',      route:'/focus',   variant:'primary' },
                    { icon:RiChat3Line,      label:'Confess',      sub:'Log a slip-up',         route:'/confess', variant:'warm'    },
                    { icon:RiLeafLine,       label:'My Triggers',  sub:'Patterns & insights',   route:'/problems',variant:'subtle'  },
                    { icon:RiBookOpenLine,   label:'Library',      sub:'Reading & reflection',  route:'/library', variant:'subtle'  },
                  ].map(({ icon:Icon, label, sub, route, variant }) => {
                    const styles = {
                      primary: { bg:T.accent,    border:T.accent,       ic:'rgba(255,248,242,0.2)', icC:'#FFF8F2', lC:'#FFF8F2', sC:'rgba(255,248,242,0.65)' },
                      warm:    { bg:T.accentBg,  border:T.accentBorder, ic:'rgba(184,112,78,0.14)', icC:T.accent,  lC:T.inkHigh, sC:T.inkMid   },
                      subtle:  { bg:T.card,      border:T.border,       ic:T.cardDeep,             icC:T.inkLow,  lC:T.inkHigh, sC:T.inkLow   },
                    }
                    const s = styles[variant]
                    return (
                      <button
                        key={label}
                        className="action-btn"
                        onClick={() => navigate(route)}
                        style={{
                          display:'flex', flexDirection:'column', alignItems:'flex-start',
                          gap:10, padding:'16px 14px', borderRadius:T.rLg,
                          background:s.bg, border:`1px solid ${s.border}`,
                          cursor:'pointer', textAlign:'left',
                          boxShadow:`0 2px 8px rgba(55,38,22,0.06)`,
                        }}
                      >
                        <div style={{ width:32, height:32, borderRadius:'50%', background:s.ic, border:`1px solid ${s.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:s.icC }}>
                          <Icon size={14} />
                        </div>
                        <div>
                          <div style={{ fontFamily:T.body, fontWeight:600, fontSize:12.5, color:s.lC, marginBottom:3, letterSpacing:'0.01em' }}>{label}</div>
                          <div style={{ fontFamily:T.body, fontWeight:300, fontSize:10.5, color:s.sC, lineHeight:1.55 }}>{sub}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* ── Quote of the day ─────────────────────── */}
                <Card>
                  <div style={{ padding:'18px 20px' }}>
                    <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                      <RiDoubleQuotesL size={20} color={T.accentBorder} style={{ flexShrink:0, marginTop:2 }} />
                      <div>
                        <div style={{ fontFamily:T.body, fontSize:9, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:T.accent, marginBottom:8 }}>
                          Today's Reflection
                        </div>
                        <p style={{ fontFamily:T.heading, fontWeight:600, fontStyle:'italic', fontSize:15, color:T.inkHigh, lineHeight:1.55, marginBottom:8 }}>
                          "{todayQuote.text}"
                        </p>
                        <p style={{ fontFamily:T.body, fontWeight:300, fontSize:10.5, color:T.inkLow, letterSpacing:'0.04em' }}>
                          — {todayQuote.author}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

              </motion.div>
          </AnimatePresence>
        </div>

        {/* ── COMPANION ───────────────────────────────────── */}
        {showCmp && (
          <div className="companion" style={{
            position:'fixed', bottom:58, right:0,
            width:110, pointerEvents:'none', zIndex:15,
          }}>
            <img
              src="/src/assets/3dmodel.png"
              alt="Viram companion"
              style={{
                width:'100%', objectFit:'contain', objectPosition:'bottom right',
                filter:'drop-shadow(0 8px 28px rgba(55,38,22,0.20))',
                userSelect:'none',
              }}
            />
          </div>
        )}

        {/* ── BOTTOM NAV ──────────────────────────────────── */}
        <div style={{
          flexShrink:0, display:'flex', justifyContent:'space-around', alignItems:'center',
          padding:'6px 8px', borderTop:`1px solid ${T.border}`,
          background:`rgba(249,245,236,0.98)`, backdropFilter:'blur(16px)',
          position:'relative', zIndex:20,
          boxShadow:`0 -1px 0 rgba(55,38,22,0.04)`,
        }}>
          {[
            { id:'home',    icon:RiFlashlightLine,  label:'Home'    },
            { id:'focus',   icon:RiTimerFlashLine,  label:'Focus'   },
            { id:'confess', icon:RiChat3Line,       label:'Confess' },
            { id:'profile', icon:RiUserLine,        label:'Profile' },
            { id:'library', icon:RiBookOpenLine,    label:'Library' },
          ].map(({ id, icon:Icon, label }) => {
            const isActive = tab === id
            const hasRoute = ['focus','confess','library','profile'].includes(id)
            return (
              <button
                key={id}
                className="nav-item"
                onClick={() => hasRoute ? navigate(`/${id}`) : setTab(id)}
                style={{
                  display:'flex', flexDirection:'column', alignItems:'center', gap:3,
                  padding:'7px 12px', borderRadius:T.rMd, cursor:'pointer',
                  background: isActive ? T.accentBg : 'transparent',
                  border: isActive ? `1px solid ${T.accentBorder}` : '1px solid transparent',
                  color: isActive ? T.accent : T.inkLow,
                }}
              >
                <Icon size={18} />
                <span style={{ fontFamily:T.body, fontSize:8.5, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase' }}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>

      </div>
    </>
  )
}