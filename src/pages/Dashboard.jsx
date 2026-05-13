import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiFlashlightLine, RiTimerFlashLine, RiBookOpenLine,
  RiUserLine, RiSettings3Line,
  RiFireLine, RiLeafLine, RiCalendarCheckLine, RiChat3Line,
  RiDoubleQuotesL, RiArrowRightSLine, RiCoinLine, RiRadarLine,
  RiBarChartBoxLine, RiMentalHealthLine, RiRocketLine,
} from 'react-icons/ri'
import MorningIntention from '../components/MorningIntention'
import DigitalFast from '../components/DigitalFast'
import CuriositySeed from '../components/CuriositySeed'
import companionImg from '../assets/3dmodel.png'
import useViramData from '../hooks/useViramData'
import { updateProfile } from '../lib/db'

/* ─── Design Tokens ─────────────────────────────────────── */
const T = {
  bg:           '#F4EEE3',
  card:         '#F9F5EC',
  cardDeep:     '#EDE5D4',
  cardSunken:   '#E6DCC8',
  surface:      '#FFFFFF',
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
  gold:         '#D4A843',
  goldBg:       'rgba(212,168,67,0.10)',
  goldBorder:   'rgba(212,168,67,0.25)',
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

/* ─── CSS ───────────────────────────────────────────────── */
const GLOBAL = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,500;1,600&family=Jost:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  .viram-dash { background:${T.bg}; }
  .viram-dash::after {
    content:''; position:fixed; inset:0;
    background-image:${GRAIN}; background-size:180px;
    opacity:0.065; pointer-events:none; z-index:9999;
  }

  @keyframes float-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
  @keyframes spin-slow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes spin-rev   { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
  @keyframes value-pop  { 0%{transform:scale(1)} 40%{transform:scale(1.18)} 100%{transform:scale(1)} }
  .viram-scroll::-webkit-scrollbar { width:2px; }
  .viram-scroll::-webkit-scrollbar-track { background:transparent; }
  .viram-scroll::-webkit-scrollbar-thumb { background:${T.borderMid}; border-radius:2px; }

  .action-btn:hover { transform:translateY(-3px); box-shadow:0 14px 32px rgba(55,38,22,0.13) !important; }
  .action-btn { transition: transform 0.22s ease, box-shadow 0.22s ease; }

  .nav-item:hover { background:${T.accentBg}; color:${T.accent}; }
  .nav-item { transition: all 0.18s ease; }

  .dash-card { transition: box-shadow 0.3s ease, transform 0.22s ease; }
  .dash-card:hover { box-shadow:0 6px 20px rgba(42,34,24,0.10) !important; transform:translateY(-1px); }



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

function Card({ children, style = {}, accent = false, variant = 'default' }) {
  const variants = {
    default:  { bg: T.card,       shadow: '0 2px 12px rgba(55,38,22,0.06), inset 0 1px 0 rgba(255,255,255,0.55)' },
    raised:   { bg: T.surface,    shadow: '0 4px 20px rgba(42,34,24,0.10), inset 0 1px 0 rgba(255,255,255,0.8)' },
    sunken:   { bg: T.cardSunken, shadow: 'inset 0 1px 3px rgba(55,38,22,0.08)' },
  }
  const v = variants[variant] || variants.default
  return (
    <div
      className="dash-card"
      style={{
        background: v.bg,
        border: `1px solid ${accent ? T.accentBorder : T.border}`,
        borderRadius: T.rLg,
        boxShadow: v.shadow,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        ...style,
      }}
    >
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

/* ─── ValuePop — micro-moment on stat change ────────────── */
function ValuePop({ val, style = {} }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={val}
        initial={{ opacity:0, scale:0.6 }}
        animate={{ opacity:1, scale:1 }}
        exit={{ opacity:0 }}
        transition={{ duration:0.28, ease:[0.22,1,0.36,1] }}
        style={style}
      >
        {val}
      </motion.span>
    </AnimatePresence>
  )
}

/* ═══ DASHBOARD ═══════════════════════════════════════════ */
export default function Dashboard() {
  const navigate = useNavigate()
  const { user, focus, confessions, refresh } = useViramData()
  const [showCmp, setShowCmp] = useState(false)

  const todayFocusMins = focus?.mins || 0
  const totalXp = focus?.xp || 0
  const confessionCount = Array.isArray(confessions) ? confessions.length : 0
  const disciplineIndex = user?.disciplineIndex || 0

  const stats = {
    xp: totalXp,
    streak: disciplineIndex,
    focusMins: todayFocusMins,
    confessions: confessionCount,
    disciplinePoints: user?.disciplinePoints || 0,
    coins: user?.coins || 0,
  }

  const todayQuote = QUOTES[new Date().getDate() % QUOTES.length]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const displayName = user?.name?.split(' ')[0] || 'Scholar'

  useEffect(() => {  
    if (user) {
      const today = new Date().toDateString()
      if (user.lastLoginDate !== today) {
        updateProfile(user.id, {
          disciplinePoints: (user.disciplinePoints || 0) + 1,
          disciplineIndex: (user.disciplineIndex || 0) + 1,
          lastLoginDate: today,
        }).then(() => {
          refresh()
        })
      }
    }

    const t = setTimeout(() => setShowCmp(true), 600)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

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

                {/* ── Morning Intention anchor ─────────────── */}
                <MorningIntention />

                {/* ── Goal card ────────────────────────────── */}
                {user?.goal && (
                  <motion.div
                    initial={{ opacity:0, y:-8 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ duration:0.5, ease }}
                    style={{
                      display:'flex', alignItems:'center', gap:10,
                      padding:'12px 18px', marginBottom:12,
                      background:`linear-gradient(135deg, ${T.accentBg} 0%, ${T.card} 100%)`,
                      border:`1px solid ${T.accentBorder}`,
                      borderRadius:T.rLg,
                    }}
                  >
                    <RiRocketLine size={14} color={T.accent} style={{ flexShrink:0 }}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:T.body, fontSize:8, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:T.accent, marginBottom:3 }}>
                        My Goal
                      </div>
                      <div style={{ fontFamily:T.heading, fontStyle:'italic', fontWeight:500, fontSize:14, color:T.inkHigh, lineHeight:1.4 }}>
                        {user.goal}
                      </div>
                    </div>
                    <RiArrowRightSLine size={14} color={T.accentDim} style={{ flexShrink:0 }}/>
                  </motion.div>
                )}

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
                          {stats.streak} days clean · {stats.focusMins}m focused · {stats.coins} coins
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* ── Recovery Stats Row ───────────────────── */}
                <SectionLabel icon={RiRadarLine} label="Recovery Overview" />
                <Card style={{ marginBottom:18 }}>
                  <div style={{ padding:'16px 14px' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                        <div style={{ fontFamily:T.body, fontSize:8, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:T.inkLow }}>Clean Days</div>
                        <ProgressRing value={disciplineIndex} max={7} size={68} stroke={4} color={T.accent}>
                          <div style={{ textAlign:'center' }}>
                            <ValuePop val={disciplineIndex} style={{ fontFamily:T.heading, fontWeight:700, fontSize:22, color:T.inkHigh, lineHeight:1 }} />
                            <div style={{ fontFamily:T.body, fontWeight:300, fontSize:8, color:T.inkLow }}>/ 7</div>
                          </div>
                        </ProgressRing>
                        <div style={{ fontFamily:T.body, fontWeight:300, fontSize:9.5, color:T.inkLow, fontStyle:'italic', textAlign:'center' }}>
                          {disciplineIndex >= 7 ? 'Full week' : `${7 - disciplineIndex}d to go`}
                        </div>
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                        <div style={{ fontFamily:T.body, fontSize:8, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:T.inkLow }}>Focus Today</div>
                        <ProgressRing value={stats.focusMins} max={120} size={68} stroke={4} color={T.green}>
                          <div style={{ textAlign:'center' }}>
                            <ValuePop val={`${stats.focusMins}m`} style={{ fontFamily:T.heading, fontWeight:700, fontSize:17, color:T.inkHigh, lineHeight:1 }} />
                            <div style={{ fontFamily:T.body, fontWeight:300, fontSize:8, color:T.inkLow }}>/ 120</div>
                          </div>
                        </ProgressRing>
                        <div style={{ fontFamily:T.body, fontWeight:300, fontSize:9.5, color:T.inkLow, fontStyle:'italic', textAlign:'center' }}>
                          {stats.focusMins >= 60 ? 'Great session' : 'Keep building'}
                        </div>
                      </div>
                    </div>
                    {/* Bottom stat bar — gives the pills a home */}
                    <div style={{ display:'flex', gap:0, borderRadius:T.rMd, overflow:'hidden', border:`1px solid ${T.border}` }}>
                      {[
                        { icon:RiCalendarCheckLine, val:stats.disciplinePoints, label:'Discipline', c:T.accent, bg:T.accentBg },
                        { icon:RiCoinLine,          val:stats.coins,             label:'Coins',      c:T.gold,   bg:T.goldBg },
                        { icon:RiTimerFlashLine,    val:stats.focusMins,         label:'Focus Min',  c:T.green,  bg:T.greenBg },
                        { icon:RiFireLine,          val:stats.streak,            label:'Days Clean',  c:T.accent, bg:T.accentBg },
                        { icon:RiChat3Line,         val:stats.confessions,       label:'Confessed',  c:T.inkMid, bg:T.cardDeep },
                      ].map(({ icon:Icon, val, label, c, bg }, i) => (
                        <div key={label} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'10px 4px', background:bg, borderRight:i<4?`1px solid ${T.border}`:'none' }}>
                          <Icon size={11} color={c} />
                          <ValuePop val={val} style={{ fontFamily:T.heading, fontWeight:700, fontSize:15, color:T.inkHigh, lineHeight:1 }} />
                          <span style={{ fontFamily:T.body, fontWeight:300, fontSize:7.5, color:T.inkLow, letterSpacing:'0.06em', textTransform:'uppercase', whiteSpace:'nowrap' }}>{label}</span>
                        </div>
                      ))}
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

                {/* ── Digital Fast ──────────────────────────── */}
                <div style={{ marginBottom: 18 }}>
                  <DigitalFast onComplete={() => refresh()} />
                </div>

                {/* ── Curiosity Seed ───────────────────────── */}
                <div style={{ marginBottom: 18 }}>
                  <CuriositySeed />
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
            width:140, pointerEvents:'none', zIndex:15,
          }}>
            <img
              src={companionImg}
              alt="Viram companion"
              style={{
                width:'100%', objectFit:'contain', objectPosition:'bottom right',
                filter:'drop-shadow(0 8px 28px rgba(55,38,22,0.20))',
                userSelect:'none', display:'block',
              }}
            />
            {/* Speech bubble */}
            <div style={{
              position:'absolute', bottom:90, right:72,
              background:T.card, border:`1px solid ${T.borderMid}`,
              borderRadius:12, padding:'4px 14px',
              whiteSpace:'nowrap', zIndex:16,
              boxShadow:'0 4px 16px rgba(55,38,22,0.15)',
              fontFamily:T.heading, fontStyle:'italic',
              fontSize:13, color:T.inkHigh,
            }}>
              Hello {displayName} ✦
              <div style={{
                position:'absolute', bottom:-6, right:24,
                width:10, height:10, background:T.card,
                borderRight:`1px solid ${T.borderMid}`,
                borderBottom:`1px solid ${T.borderMid}`,
                transform:'rotate(45deg)',
              }} />
            </div>
          </div>
        )}

        {/* ── GOAL OVERLAY (persistent) ──────────────────── */}
        {user?.goal && (
          <motion.div
            initial={{ opacity:0, x:-20 }}
            animate={{ opacity:1, x:0 }}
            transition={{ delay:0.8, duration:0.5, ease }}
            style={{
              position:'fixed', bottom:68, left:14, zIndex:18,
              maxWidth:200, pointerEvents:'none',
            }}
          >
            <div style={{
              display:'flex', alignItems:'center', gap:6,
              padding:'6px 12px 6px 10px',
              background:`rgba(249,245,236,0.92)`,
              backdropFilter:'blur(10px)',
              border:`1px solid ${T.accentBorder}`,
              borderRadius:T.rPill,
              boxShadow:`0 4px 16px rgba(55,38,22,0.12)`,
            }}>
              <RiRocketLine size={10} color={T.accent} style={{ flexShrink:0 }}/>
              <span style={{
                fontFamily:T.heading, fontStyle:'italic', fontWeight:500,
                fontSize:11, color:T.inkHigh, lineHeight:1.2,
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
              }}>
                {user.goal.length > 28 ? user.goal.slice(0, 28) + '...' : user.goal}
              </span>
            </div>
          </motion.div>
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
            const isActive = id === 'home'
            const hasRoute = ['focus','confess','library','profile'].includes(id)
            return (
              <button
                key={id}
                className="nav-item"
                onClick={() => hasRoute && navigate(`/${id}`)}
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