import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiFlashlightLine,
  RiTimerFlashLine,
  RiBookOpenLine,
  RiRadarLine,
  RiUserLine,
  RiSettings3Line,
  RiQuillPenLine,
  RiSparkling2Line,
  RiArrowRightSLine,
  RiHeartPulseLine,
  RiFireLine,
  RiMentalHealthLine,
  RiLeafLine,
  RiCalendarCheckLine,
  RiChat3Line,
  RiDoubleQuotesL,
  RiBarChartFill,
} from 'react-icons/ri'

/* ─── Tokens ─────────────────────────────────────────────── */
const T = {
  bg:           '#F4EEE3',
  card:         '#F9F5EC',
  cardDeep:     '#EDE5D4',
  cardSunken:   '#E6DCC8',
  inkHigh:      '#2A2218',
  inkMid:       '#5A4E42',
  inkLow:       '#8A7B6E',
  border:       'rgba(55,38,22,0.07)',
  borderMid:    'rgba(55,38,22,0.13)',
  borderRule:   'rgba(55,38,22,0.05)',
  accent:       '#B8704E',
  accentBg:     'rgba(184,112,78,0.08)',
  accentBorder: 'rgba(184,112,78,0.22)',
  accentDim:    'rgba(184,112,78,0.40)',
  heading:      "'Cormorant Garamond', Georgia, serif",
  body:         "'Jost', system-ui, sans-serif",
  mono:         "'Courier New', Courier, monospace",
  rSm: '8px', rMd: '14px', rLg: '22px', rPill: '100px',
}

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`
const ease  = [0.22, 1, 0.36, 1]

/* ─── Quotes ─────────────────────────────────────────────── */
const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "You will never find time for anything. If you want time, you must make it.", author: "Charles Buxton" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "Do the hard jobs first. The easy jobs will take care of themselves.", author: "Dale Carnegie" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
  { text: "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.", author: "John C. Maxwell" },
  { text: "You don't need more time. You need to decide.", author: "Seth Godin" },
]

/* ─── Global CSS ─────────────────────────────────────────── */
const GLOBAL = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,500;1,600&family=Jost:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  .viram-dash { background:${T.bg}; }
  .viram-dash::after {
    content:''; position:fixed; inset:0;
    background-image:${GRAIN}; background-repeat:repeat;
    opacity:0.032; pointer-events:none; z-index:9999;
  }

  @keyframes pulse-dot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.65)} }
  @keyframes float-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes spin-slow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes companion-bob {
    0%,100% { transform:translateY(0px) rotate(0deg); }
    30%     { transform:translateY(-10px) rotate(1.5deg); }
    60%     { transform:translateY(-4px) rotate(-0.5deg); }
  }
  @keyframes companion-enter {
    from { opacity:0; transform:translateY(48px) scale(0.82); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
  @keyframes quote-fade {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .companion { animation: companion-enter 0.9s cubic-bezier(0.22,1,0.36,1) 0.5s both, companion-bob 5.5s ease-in-out 1.5s infinite; }
  .quote-anim { animation: quote-fade 0.8s ease forwards; }

  .viram-scroll::-webkit-scrollbar { width:3px; }
  .viram-scroll::-webkit-scrollbar-track { background:transparent; }
  .viram-scroll::-webkit-scrollbar-thumb { background:${T.borderMid}; border-radius:3px; }
`

/* ─── Default state ──────────────────────────────────────── */
const DEFAULT_STATE = {
  disciplinePoints: 0,
  focusPoints:      0,
  energyPoints:     100,
  xp:               0,
  streak:           0,
  logs: [
    { text: 'Avatar forged — the journey begins', pts: null, ts: 'Today', type: 'milestone' },
  ],
}

/* ─── Section label ──────────────────────────────────────── */
function SectionLabel({ icon: Icon, label }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
      <Icon size={11} color={T.accentDim} />
      <span style={{ fontFamily:T.body, fontSize:9, fontWeight:600, letterSpacing:'0.22em', textTransform:'uppercase', color:T.inkLow }}>
        {label}
      </span>
      <div style={{ flex:1, height:1, background:T.border }} />
    </div>
  )
}

/* ─── Point stat card ────────────────────────────────────── */
function PointCard({ icon: Icon, label, value, caption, accent = false, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity:0, y:10 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.55, delay, ease }}
      style={{
        background:     accent ? T.accentBg : T.card,
        border:         `1px solid ${accent ? T.accentBorder : T.border}`,
        borderTop:      `3px solid ${accent ? T.accent : T.borderMid}`,
        borderRadius:   T.rLg,
        padding:        '16px 14px',
        boxShadow:      `0 2px 10px rgba(55,38,22,0.06)`,
        display:        'flex',
        flexDirection:  'column',
        gap:            8,
      }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:7 }}>
        <div style={{
          width:28, height:28, borderRadius:'50%',
          background:     accent ? `rgba(184,112,78,0.15)` : T.cardDeep,
          border:         `1px solid ${accent ? T.accentBorder : T.borderMid}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          color:          accent ? T.accent : T.inkLow,
          flexShrink:     0,
        }}>
          <Icon size={13} />
        </div>
        <span style={{ fontFamily:T.body, fontSize:9, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color: accent ? T.accent : T.inkLow }}>
          {label}
        </span>
      </div>
      <div style={{ fontFamily:T.heading, fontWeight:700, fontSize:34, letterSpacing:'-0.03em', color:T.inkHigh, lineHeight:1 }}>
        {value}
      </div>
      <div style={{ fontFamily:T.body, fontWeight:300, fontSize:11, fontStyle:'italic', color:T.inkLow, lineHeight:1.5 }}>
        {caption}
      </div>
    </motion.div>
  )
}

/* ─── Action card ────────────────────────────────────────── */
function ActionCard({ icon: Icon, label, sub, onClick, variant = 'default' }) {
  const styles = {
    default: { bg:T.card,     border:T.border,      iconBg:T.cardDeep,    iconColor:T.inkLow,  labelColor:T.inkHigh, subColor:T.inkLow  },
    accent:  { bg:T.accent,   border:T.accent,       iconBg:'rgba(255,248,242,0.18)', iconColor:'#FFF8F2', labelColor:'#FFF8F2', subColor:'rgba(255,248,242,0.7)' },
    warm:    { bg:T.accentBg, border:T.accentBorder, iconBg:`rgba(184,112,78,0.14)`,  iconColor:T.accent,  labelColor:T.inkHigh, subColor:T.inkMid  },
  }
  const s = styles[variant]
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y:-3, boxShadow:`0 14px 32px rgba(55,38,22,0.12)` }}
      whileTap={{ y:-1 }}
      transition={{ duration:0.24, ease }}
      style={{
        display:'flex', flexDirection:'column', alignItems:'flex-start',
        gap:10, padding:'18px 16px', borderRadius:T.rLg,
        background:s.bg, border:`1px solid ${s.border}`,
        cursor:'pointer', textAlign:'left',
        boxShadow:`0 2px 8px rgba(55,38,22,0.06)`,
      }}
    >
      <div style={{
        width:34, height:34, borderRadius:'50%',
        background:s.iconBg, border:`1px solid ${s.border}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        color:s.iconColor, flexShrink:0,
      }}>
        <Icon size={15} />
      </div>
      <div>
        <div style={{ fontFamily:T.body, fontWeight:600, fontSize:13, color:s.labelColor, marginBottom:3, letterSpacing:'0.01em' }}>
          {label}
        </div>
        <div style={{ fontFamily:T.body, fontWeight:300, fontSize:11, color:s.subColor, lineHeight:1.55 }}>
          {sub}
        </div>
      </div>
    </motion.button>
  )
}

/* ─── Bottom nav item ────────────────────────────────────── */
function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display:'flex', flexDirection:'column', alignItems:'center', gap:4,
        padding:'9px 14px', borderRadius:T.rMd, cursor:'pointer',
        background:  active ? T.accentBg       : 'transparent',
        border:      active ? `1px solid ${T.accentBorder}` : '1px solid transparent',
        color:       active ? T.accent          : T.inkLow,
        transition:  'all 0.22s ease',
      }}
    >
      <Icon size={19} />
      <span style={{ fontFamily:T.body, fontSize:9, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase' }}>
        {label}
      </span>
    </button>
  )
}

/* ─── Avatar disc ────────────────────────────────────────── */
function AvatarDisc({ name }) {
  const initial = (name || '?').charAt(0).toUpperCase()
  return (
    <div style={{ position:'relative', width:56, height:56, flexShrink:0 }}>
      <svg style={{ position:'absolute', inset:-8, width:72, height:72, animation:'spin-slow 24s linear infinite' }}
        viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="32" fill="none" stroke={T.accentBorder} strokeWidth="1" strokeDasharray="3 10" />
      </svg>
      <div style={{
        width:56, height:56, borderRadius:'50%',
        background:T.card, border:`1.5px solid ${T.borderMid}`,
        boxShadow:`0 4px 14px rgba(55,38,22,0.10), inset 0 1px 0 rgba(255,255,255,0.7)`,
        display:'flex', alignItems:'center', justifyContent:'center',
        animation:'float-slow 5s ease-in-out infinite',
      }}>
        <span style={{ fontFamily:T.heading, fontWeight:700, fontStyle:'italic', fontSize:22, color:T.inkHigh, userSelect:'none' }}>
          {initial}
        </span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const navigate = useNavigate()
  const [tab,   setTab]   = useState('home')
  const [state, setState] = useState(DEFAULT_STATE)
  const [user,  setUser]  = useState(null)
  const [showCmp, setShowCmp] = useState(false)

  /* Pick one quote per day (deterministic by date) */
  const todayQuote = QUOTES[new Date().getDate() % QUOTES.length]

  useEffect(() => {
    const u = localStorage.getItem('viram_user')
    const p = localStorage.getItem('viram_profile')
    if (u) setUser(JSON.parse(u))
    if (p) {
      const parsed = JSON.parse(p)
      setState(prev => ({
        ...prev,
        avatarName: parsed.avatarName ?? '',
      }))
    }
    const t = setTimeout(() => setShowCmp(true), 700)
    return () => clearTimeout(t)
  }, [])

  const displayName = state.avatarName || user?.name?.split(' ')[0] || 'Scholar'

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <>
      <style>{GLOBAL}</style>

      <div className="viram-dash" style={{ position:'fixed', inset:0, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Ruled paper background lines */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:`repeating-linear-gradient(transparent, transparent 35px, ${T.borderRule} 35px, ${T.borderRule} 36px)`,
          backgroundPositionY:'56px',
        }} />

        {/* ── HEADER ──────────────────────────────────────── */}
        <div style={{
          flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'13px 20px', borderBottom:`1px solid ${T.border}`,
          background:`rgba(249,245,236,0.96)`, backdropFilter:'blur(12px)',
          position:'relative', zIndex:20,
          boxShadow:`0 1px 0 rgba(55,38,22,0.04)`,
        }}>
          {/* Wordmark + greeting */}
          <div>
            <div style={{ fontFamily:T.heading, fontWeight:700, fontSize:20, letterSpacing:'0.14em', color:T.inkHigh, lineHeight:1 }}>
              VI<span style={{ color:T.accent }}>RAM</span>
            </div>
            <div style={{ fontFamily:T.body, fontWeight:300, fontSize:11, color:T.inkLow, marginTop:1 }}>
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
              <em style={{ fontFamily:T.heading, fontStyle:'italic', fontSize:12, color:T.inkMid }}>{displayName}</em>
            </div>
          </div>

          {/* Settings */}
          <motion.button
            onClick={() => navigate('/settings')}
            whileHover={{ rotate:22 }}
            whileTap={{ scale:0.9 }}
            transition={{ duration:0.28, ease }}
            style={{
              width:36, height:36, borderRadius:'50%',
              background:T.cardDeep, border:`1px solid ${T.borderMid}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              color:T.inkLow, cursor:'pointer',
            }}
          >
            <RiSettings3Line size={16} />
          </motion.button>
        </div>

        {/* ── BODY ────────────────────────────────────────── */}
        <div className="viram-scroll" style={{ flex:1, overflowY:'auto', position:'relative', zIndex:1 }}>
          <AnimatePresence mode="wait">

            {/* ═══════ HOME ═══════ */}
            {tab === 'home' && (
              <motion.div key="home"
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                transition={{ duration:0.26 }}
                style={{ padding:'16px 16px 130px' }}
              >

                {/* ── Quote of the day ────────────────────── */}
                <motion.div
                  key={todayQuote.text}
                  className="quote-anim"
                  style={{
                    background:T.card, border:`1px solid ${T.border}`,
                    borderLeft:`3px solid ${T.accent}`, borderRadius:T.rLg,
                    padding:'18px 18px 16px', marginBottom:14,
                    boxShadow:`0 2px 10px rgba(55,38,22,0.06), inset 0 1px 0 rgba(255,255,255,0.5)`,
                    position:'relative',
                  }}
                >
                  <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                    <RiDoubleQuotesL size={18} color={T.accentBorder} style={{ flexShrink:0, marginTop:2 }} />
                    <div>
                      <div style={{ fontFamily:T.body, fontSize:9, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:T.accent, marginBottom:8 }}>
                        Quote of the day
                      </div>
                      <p style={{ fontFamily:T.heading, fontWeight:600, fontStyle:'italic', fontSize:16, color:T.inkHigh, lineHeight:1.5, marginBottom:8 }}>
                        "{todayQuote.text}"
                      </p>
                      <p style={{ fontFamily:T.body, fontWeight:300, fontSize:11, color:T.inkLow, letterSpacing:'0.04em' }}>
                        — {todayQuote.author}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* ── Avatar row + streak ─────────────────── */}
                <div style={{
                  background:T.card, border:`1px solid ${T.border}`,
                  borderRadius:T.rLg, padding:'16px 18px', marginBottom:14,
                  boxShadow:`0 3px 16px rgba(55,38,22,0.06), inset 0 1px 0 rgba(255,255,255,0.6)`,
                  position:'relative', overflow:'hidden',
                }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, transparent, ${T.accent}, transparent)`, opacity:0.38 }} />
                  <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                    <AvatarDisc name={displayName} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:T.heading, fontWeight:700, fontStyle:'italic', fontSize:20, color:T.inkHigh, letterSpacing:'-0.01em' }}>
                        {displayName}
                      </div>
                      <div style={{ fontFamily:T.body, fontWeight:300, fontSize:11, color:T.inkLow, marginTop:3 }}>
                        Keep the streak alive. Every session counts.
                      </div>
                      {/* XP + streak mini pills */}
                      <div style={{ display:'flex', gap:7, marginTop:10, flexWrap:'wrap' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 11px', borderRadius:T.rPill, background:T.accentBg, border:`1px solid ${T.accentBorder}` }}>
                          <RiFireLine size={11} color={T.accent} />
                          <span style={{ fontFamily:T.heading, fontWeight:600, fontSize:13, color:T.inkHigh }}>
                            {state.streak}
                          </span>
                          <span style={{ fontFamily:T.body, fontWeight:300, fontSize:10, color:T.inkLow }}>day streak</span>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 11px', borderRadius:T.rPill, background:T.card, border:`1px solid ${T.border}` }}>
                          <RiSparkling2Line size={11} color={T.accentDim} />
                          <span style={{ fontFamily:T.heading, fontWeight:600, fontSize:13, color:T.inkHigh }}>
                            {state.xp}
                          </span>
                          <span style={{ fontFamily:T.body, fontWeight:300, fontSize:10, color:T.inkLow }}>XP total</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Points system ───────────────────────── */}
                <SectionLabel icon={RiBarChartFill} label="Your Points" />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:18 }}>
                  <PointCard
                    icon={RiCalendarCheckLine}
                    label="Discipline"
                    value={state.disciplinePoints}
                    caption="Attend daily"
                    accent
                    delay={0}
                  />
                  <PointCard
                    icon={RiTimerFlashLine}
                    label="Focus"
                    value={state.focusPoints}
                    caption="Per 10 min"
                    delay={0.07}
                  />
                  <PointCard
                    icon={RiHeartPulseLine}
                    label="Energy"
                    value={state.energyPoints}
                    caption="Stay active"
                    delay={0.14}
                  />
                </div>

                {/* ── Actions ─────────────────────────────── */}
                <SectionLabel icon={RiFlashlightLine} label="Actions" />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
                  <ActionCard
                    icon={RiTimerFlashLine}
                    label="Focus Session"
                    sub="Enter deep work mode"
                    onClick={() => navigate('/focus')}
                    variant="accent"
                  />
                  <ActionCard
                    icon={RiLeafLine}
                    label="The Problem"
                    sub="Reminders & motivation"
                    onClick={() => navigate('/problem')}
                    variant="warm"
                  />
                  <ActionCard
                    icon={RiChat3Line}
                    label="Confess"
                    sub="Problems & misdoings"
                    onClick={() => navigate('/confess')}
                    variant="default"
                  />
                  <ActionCard
                    icon={RiMentalHealthLine}
                    label="Reflect"
                    sub="End-of-day debrief"
                    onClick={() => navigate('/library')}
                    variant="default"
                  />
                </div>

              </motion.div>
            )}

            {/* ═══════ DEBRIEF ═══════ */}
            {tab === 'debrief' && (
              <motion.div key="debrief"
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                transition={{ duration:0.26 }}
                style={{ padding:'22px 16px 130px' }}
              >
                <div style={{ marginBottom:26 }}>
                  <div style={{ fontFamily:T.body, fontSize:9, fontWeight:600, letterSpacing:'0.22em', textTransform:'uppercase', color:T.accent, marginBottom:8 }}>
                    Intelligence Log
                  </div>
                  <h2 style={{ fontFamily:T.heading, fontWeight:700, fontSize:30, letterSpacing:'-0.02em', color:T.inkHigh, lineHeight:1 }}>
                    Debrief<em style={{ color:T.accent, fontStyle:'italic' }}>.</em>
                  </h2>
                  <p style={{ fontFamily:T.body, fontWeight:300, fontSize:13, color:T.inkMid, marginTop:7, lineHeight:1.75 }}>
                    Your full activity history.
                  </p>
                </div>

                {/* Points summary */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8, marginBottom:22 }}>
                  {[
                    { label:'Discipline', value:state.disciplinePoints, icon:RiCalendarCheckLine },
                    { label:'Focus',      value:state.focusPoints,      icon:RiTimerFlashLine   },
                    { label:'Energy',     value:state.energyPoints,     icon:RiHeartPulseLine   },
                  ].map(({ label, value, icon:Icon }) => (
                    <div key={label} style={{
                      background:T.card, border:`1px solid ${T.border}`,
                      borderRadius:T.rMd, padding:'14px 12px', textAlign:'center',
                      boxShadow:`0 2px 8px rgba(55,38,22,0.05)`,
                    }}>
                      <Icon size={14} color={T.accentDim} style={{ margin:'0 auto 6px', display:'block' }} />
                      <div style={{ fontFamily:T.heading, fontWeight:700, fontSize:24, color:T.inkHigh }}>{value}</div>
                      <div style={{ fontFamily:T.body, fontWeight:300, fontSize:9, color:T.inkLow, marginTop:2, letterSpacing:'0.08em', textTransform:'uppercase' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── COMPANION ───────────────────────────────────── */}
        {showCmp && (
          <div className="companion" style={{
            position:'fixed', bottom:62, right:0,
            width:120, pointerEvents:'none', zIndex:15,
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
          padding:'7px 10px', borderTop:`1px solid ${T.border}`,
          background:`rgba(249,245,236,0.97)`, backdropFilter:'blur(14px)',
          position:'relative', zIndex:20,
          boxShadow:`0 -1px 0 rgba(55,38,22,0.04)`,
        }}>
          <NavItem
            icon={RiFlashlightLine}
            label="Home"
            active={tab === 'home'}
            onClick={() => setTab('home')}
          />
          <NavItem
            icon={RiTimerFlashLine}
            label="Focus"
            active={false}
            onClick={() => navigate('/focus')}
          />
          <NavItem
            icon={RiChat3Line}
            label="Confess"
            active={false}
            onClick={() => navigate('/confess')}
          />
          <NavItem
            icon={RiBookOpenLine}
            label="Library"
            active={false}
            onClick={() => navigate('/library')}
          />
          <NavItem
            icon={RiUserLine}
            label="Profile"
            active={false}
            onClick={() => navigate('/profile')}
          />
        </div>

      </div>
    </>
  )
}