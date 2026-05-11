import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RiArrowLeftLine, RiUserLine, RiSmartphoneLine, RiTimerFlashLine,
  RiMoonLine, RiFireLine, RiBrainLine, RiAlarmWarningLine,
  RiSwordLine, RiShieldLine, RiHeartPulseLine, RiBookOpenLine,
  RiMentalHealthLine, RiLeafLine, RiRocketLine, RiCheckLine,
  RiQuillPenLine, RiRadarLine, RiCoinLine, RiZzzLine,
  RiEmotionLine, RiCalendarCheckLine, RiSparkling2Line, RiBarChartLine,
} from 'react-icons/ri'
import SkillTracker from '../components/SkillTracker'

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
  borderRule:   'rgba(55,38,22,0.055)',
  accent:       '#B8704E',
  accentBg:     'rgba(184,112,78,0.08)',
  accentBorder: 'rgba(184,112,78,0.22)',
  accentDim:    'rgba(184,112,78,0.40)',
  green:        '#6B8F5E',
  greenBg:      'rgba(107,143,94,0.10)',
  greenBorder:  'rgba(107,143,94,0.25)',
  red:          '#B85E5E',
  redBg:        'rgba(184,94,94,0.08)',
  heading:      "'Cormorant Garamond', Georgia, serif",
  body:         "'Jost', system-ui, sans-serif",
  rSm: '8px', rMd: '14px', rLg: '22px', rPill: '100px',
}

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`
const ease = [0.22, 1, 0.36, 1]

const STAT_LABELS = {
  vitality:   { label: 'Vitality',   icon: RiHeartPulseLine,  color: T.accent,  bg: T.accentBg,  border: T.accentBorder },
  energy:     { label: 'Energy',     icon: RiFireLine,        color: T.accent,  bg: T.accentBg,  border: T.accentBorder },
  discipline: { label: 'Discipline', icon: RiSwordLine,       color: T.green,   bg: T.greenBg,   border: T.greenBorder },
  focus:      { label: 'Focus',      icon: RiRadarLine,       color: T.green,   bg: T.greenBg,   border: T.greenBorder },
  shieldHP:   { label: 'Shield HP',  icon: RiShieldLine,      color: T.inkMid,  bg: T.cardDeep,  border: T.border },
  coins:      { label: 'Coins',      icon: RiCoinLine,        color: '#D4A843', bg: 'rgba(212,168,67,0.10)', border: 'rgba(212,168,67,0.25)' },
}

const ARCHETYPE_MAP = {
  study:      { title: 'THE SCHOLAR',   sub: 'Knowledge as power.',      icon: '📖' },
  deepwork:   { title: 'THE ARCHITECT', sub: 'Builder of worlds.',        icon: '⚒' },
  health:     { title: 'THE ATHLETE',   sub: 'Body as foundation.',       icon: '⚡' },
  discipline: { title: 'THE WARRIOR',   sub: 'Will as the weapon.',       icon: '⚔' },
  detox:      { title: 'THE MONK',      sub: 'Silence as practice.',      icon: '🌿' },
}

const APP_LABELS = {
  reels:   'Instagram / TikTok',
  youtube: 'YouTube',
  chat:    'WhatsApp / Messaging',
  feed:    'Twitter / Reddit',
  games:   'Games',
  all:     "I don't know / All of them",
}

const PEAK_LABELS = {
  early:     'Early morning (5–8 AM)',
  morning:   'Morning (8–12 PM)',
  afternoon: 'Afternoon (12–5 PM)',
  evening:   'Evening (5–10 PM)',
  none:      "I don't have a peak",
}

const MISSION_LABELS = {
  study:      'Academic focus',
  deepwork:   'Deep work / career',
  health:     'Health & fitness',
  discipline: 'General discipline',
  detox:      'Digital detox',
}

const ATTEMPT_LABELS = {
  limits:    'Screen time limits',
  timers:    'Pomodoro / timers',
  willpower: 'Willpower alone',
  apps:      'Other apps',
  nothing:   'Nothing yet',
}

const STRESS_LABELS = ['Pretty calm', 'Moderate pressure', 'High stress', 'Burning out']
const STRESS_COLORS = [T.green, T.accent, T.red, '#B85E5E']

function Grain() {
  return (
    <div style={{
      position:'absolute', inset:0, pointerEvents:'none', zIndex:0,
      backgroundImage: GRAIN, backgroundRepeat:'repeat',
      opacity:0.032, borderRadius:'inherit',
    }} />
  )
}

function Card({ children, style = {}, onClick }) {
  return (
    <motion.div
      whileHover={onClick ? { y: -2 } : {}}
      whileTap={onClick ? { scale: 0.99 } : {}}
      onClick={onClick}
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: T.rLg,
        boxShadow: `0 2px 12px rgba(55,38,22,0.06), inset 0 1px 0 rgba(255,255,255,0.55)`,
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      <Grain />
      <div style={{ position:'relative', zIndex:1 }}>{children}</div>
    </motion.div>
  )
}

function SectionLabel({ icon: Icon, label }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12, marginTop:18 }}>
      <Icon size={10} color={T.accentDim} />
      <span style={{ fontFamily:T.body, fontSize:9, fontWeight:600, letterSpacing:'0.22em', textTransform:'uppercase', color:T.inkLow }}>
        {label}
      </span>
      <div style={{ flex:1, height:1, background:T.border }} />
    </div>
  )
}

function StatBar({ label, value, icon: Icon, color, bg, border }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 0' }}>
      <div style={{
        width:34, height:34, borderRadius:'50%', flexShrink:0,
        background: bg, border:`1px solid ${border}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        color: color,
      }}>
        <Icon size={14} />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
          <span style={{ fontFamily:T.body, fontWeight:500, fontSize:12, color:T.inkMid }}>{label}</span>
          <span style={{ fontFamily:T.heading, fontWeight:700, fontSize:14, color:T.inkHigh }}>{value}</span>
        </div>
        <div style={{ height:4, borderRadius:T.rPill, background:T.border, overflow:'hidden' }}>
          <div style={{
            height:'100%', borderRadius:T.rPill,
            background: color, width:`${value}%`,
            transition:'width 1s cubic-bezier(0.22,1,0.36,1)',
          }} />
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value, color }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:12,
      padding:'12px 0',
      borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{
        width:30, height:30, borderRadius:'50%', flexShrink:0,
        background: T.cardDeep, border:`1px solid ${T.borderMid}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        color: color || T.inkLow,
      }}>
        <Icon size={12} />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:T.body, fontWeight:300, fontSize:10, color:T.inkLow, letterSpacing:'0.06em', marginBottom:1 }}>
          {label}
        </div>
        <div style={{ fontFamily:T.heading, fontWeight:600, fontSize:15, color:T.inkHigh }}>
          {value}
        </div>
      </div>
    </div>
  )
}

const GLOBAL = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,500;1,600&family=Jost:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  .viram-prof::after {
    content:''; position:fixed; inset:0;
    background-image:${GRAIN}; background-repeat:repeat;
    opacity:0.032; pointer-events:none; z-index:9999;
  }

  .viram-scroll::-webkit-scrollbar { width:2px; }
  .viram-scroll::-webkit-scrollbar-track { background:transparent; }
  .viram-scroll::-webkit-scrollbar-thumb { background:${T.borderMid}; border-radius:2px; }

  @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes spin-rev  { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
  @keyframes float-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
`

export default function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const p = localStorage.getItem('viram_profile')
    if (p) setProfile(JSON.parse(p))
    const u = localStorage.getItem('viram_user')
    if (u) setUser(JSON.parse(u))
  }, [])

  if (!profile) {
    return (
      <div style={{ minHeight:'100vh', background:T.bg, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
        <style>{GLOBAL}</style>
        <div style={{ fontFamily:T.heading, fontSize:22, color:T.inkLow }}>No profile found</div>
        <button
          onClick={() => navigate('/onboarding')}
          style={{
            padding:'10px 22px', borderRadius:T.rPill,
            background:T.accent, border:'none', cursor:'pointer',
            fontFamily:T.body, fontWeight:600, fontSize:12,
            letterSpacing:'0.08em', textTransform:'uppercase',
            color:'#FFF8F2',
          }}
        >
          Start Onboarding
        </button>
      </div>
    )
  }

  const archetype = ARCHETYPE_MAP[profile.mission] || ARCHETYPE_MAP.discipline
  const stressColor = STRESS_COLORS[profile.stressLevel] || T.inkLow
  const stressLabel = STRESS_LABELS[profile.stressLevel] || 'Unknown'
  const displayName = user?.name?.split(' ')[0] || profile.avatarName || 'Scholar'
  const initial = (user?.name || profile.avatarName || '?').charAt(0).toUpperCase()

  return (
    <>
      <style>{GLOBAL}</style>
      <div className="viram-prof" style={{ minHeight:'100vh', background:T.bg, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Ruled lines */}
        <div style={{
          position:'fixed', inset:0, pointerEvents:'none',
          backgroundImage:`repeating-linear-gradient(transparent, transparent 35px, ${T.borderRule} 35px, ${T.borderRule} 36px)`,
          backgroundPositionY:'56px',
        }} />

        {/* ─── Header ─────────────────────────────────────── */}
        <div style={{
          flexShrink:0, padding:'12px 18px',
          borderBottom:`1px solid ${T.border}`,
          background:`rgba(249,245,236,0.97)`,
          backdropFilter:'blur(14px)',
          position:'relative', zIndex:20,
          display:'flex', alignItems:'center', gap:12,
          boxShadow:`0 1px 0 rgba(55,38,22,0.04)`,
        }}>
          <motion.button
            whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
            onClick={() => navigate(-1)}
            style={{
              width:34, height:34, borderRadius:'50%',
              background:T.cardDeep, border:`1px solid ${T.borderMid}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              color:T.inkLow, cursor:'pointer', flexShrink:0, transition:'all 0.2s',
            }}
          >
            <RiArrowLeftLine size={14} />
          </motion.button>
          <div style={{ flex:1, fontFamily:T.heading, fontWeight:700, fontSize:19, letterSpacing:'0.14em', color:T.inkHigh }}>
            VI<span style={{ color:T.accent }}>RAM</span>
          </div>
          <div style={{ fontFamily:T.body, fontSize:10, fontWeight:600, letterSpacing:'0.16em', textTransform:'uppercase', color:T.accent }}>
            Profile
          </div>
        </div>

        {/* ─── Scrollable body ─────────────────────────────── */}
        <div className="viram-scroll" style={{ flex:1, overflowY:'auto', position:'relative', zIndex:1 }}>
          <div style={{ maxWidth:560, margin:'0 auto', padding:'18px 14px 100px' }}>

            {/* ── Hero Card ───────────────────────────────── */}
            <motion.div
              initial={{ opacity:0, y:12 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.5, ease }}
            >
              <Card>
                {/* Accent bar */}
                <div style={{ height:2.5, background:`linear-gradient(90deg, transparent 0%, ${T.accent} 40%, transparent 100%)`, opacity:0.5 }} />
                <div style={{ padding:'20px 20px 18px', textAlign:'center' }}>

                  {/* Avatar */}
                  <div style={{ position:'relative', width:80, height:80, margin:'0 auto 14px' }}>
                    <svg style={{ position:'absolute', inset:-10, width:100, height:100, animation:'spin-slow 22s linear infinite' }} viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="44" fill="none" stroke={T.accentBorder} strokeWidth="1" strokeDasharray="3 10" />
                    </svg>
                    <svg style={{ position:'absolute', inset:-4, width:88, height:88, animation:'spin-rev 15s linear infinite' }} viewBox="0 0 88 88">
                      <circle cx="44" cy="44" r="40" fill="none" stroke={T.border} strokeWidth="0.8" strokeDasharray="1 8" />
                    </svg>
                    <div style={{
                      width:80, height:80, borderRadius:'50%',
                      background: T.card,
                      border:`2px solid ${T.borderMid}`,
                      boxShadow:`0 6px 20px rgba(55,38,22,0.12), inset 0 1px 0 rgba(255,255,255,0.7)`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      overflow:'hidden', animation:'float-slow 5s ease-in-out infinite',
                    }}>
                      {user?.picture
                        ? <img src={user.picture} alt={displayName} style={{ width:'100%', height:'100%', objectFit:'cover', filter:'sepia(0.12)' }} />
                        : <span style={{ fontFamily:T.heading, fontWeight:700, fontStyle:'italic', fontSize:32, color:T.inkHigh }}>{initial}</span>
                      }
                    </div>
                  </div>

                  {/* Name */}
                  <div style={{ fontFamily:T.heading, fontWeight:700, fontStyle:'italic', fontSize:26, color:T.inkHigh, letterSpacing:'-0.01em', lineHeight:1.1 }}>
                    {profile.avatarName || displayName}
                  </div>

                  {/* Archetype stamp */}
                  <div style={{
                    display:'inline-flex', alignItems:'center', gap:8,
                    marginTop:8, padding:'5px 16px', borderRadius:T.rPill,
                    background:T.accentBg, border:`1px solid ${T.accentBorder}`,
                  }}>
                    <span style={{ fontFamily:T.body, fontSize:10, fontWeight:600, letterSpacing:'0.16em', color:T.accent }}>
                      {archetype.title}
                    </span>
                  </div>
                  <div style={{ fontFamily:T.heading, fontStyle:'italic', fontWeight:400, fontSize:12, color:T.inkLow, marginTop:4 }}>
                    {archetype.sub}
                  </div>

                  {/* User email */}
                  {user?.email && (
                    <div style={{ fontFamily:T.body, fontWeight:300, fontSize:11, color:T.inkLow, marginTop:10, letterSpacing:'0.02em' }}>
                      {user.email}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* ── Focus Stats ──────────────────────────────── */}
            <motion.div
              initial={{ opacity:0, y:12 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.08, duration:0.5, ease }}
            >
              <SectionLabel icon={RiTimerFlashLine} label="Focus Stats" />
              <Card style={{ padding:'14px 18px' }}>
                <div style={{ display:'flex', gap:16 }}>
                  <div style={{ flex:1, textAlign:'center' }}>
                    <div style={{ fontFamily:T.heading, fontWeight:700, fontSize:28, color:T.inkHigh, lineHeight:1 }}>
                      {user?.focusMins || 0}
                    </div>
                    <div style={{ fontFamily:T.body, fontWeight:300, fontSize:9, color:T.inkLow, marginTop:4, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                      Total Focus Mins
                    </div>
                  </div>
                  <div style={{ width:1, background:T.border }} />
                  <div style={{ flex:1, textAlign:'center' }}>
                    <div style={{ fontFamily:T.heading, fontWeight:700, fontSize:28, color:T.accent, lineHeight:1 }}>
                      {user?.focusPoints || 0}
                    </div>
                    <div style={{ fontFamily:T.body, fontWeight:300, fontSize:9, color:T.inkLow, marginTop:4, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                      Focus Points
                    </div>
                  </div>
                  <div style={{ width:1, background:T.border }} />
                  <div style={{ flex:1, textAlign:'center' }}>
                    <div style={{ fontFamily:T.heading, fontWeight:700, fontSize:28, color:T.green, lineHeight:1 }}>
                      {user?.disciplinePoints || 0}
                    </div>
                    <div style={{ fontFamily:T.body, fontWeight:300, fontSize:9, color:T.inkLow, marginTop:4, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                      Discipline
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* ── Stats ────────────────────────────────────── */}
            <motion.div
              initial={{ opacity:0, y:12 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.12, duration:0.5, ease }}
            >
              <SectionLabel icon={RiRadarLine} label="Avatar Stats" />
              <Card style={{ padding:'6px 18px 12px' }}>
                {Object.entries(STAT_LABELS).map(([key, meta]) => {
                  const val = profile[key]
                  if (val === undefined || val === null) return null
                  return <StatBar key={key} value={val} {...meta} />
                })}
              </Card>
            </motion.div>

            {/* ── Skill Tracker ────────────────────────────── */}
            <motion.div
              initial={{ opacity:0, y:12 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.16, duration:0.5, ease }}
            >
              <SkillTracker />
            </motion.div>

            {/* ── Onboarding Answers ───────────────────────── */}
            <motion.div
              initial={{ opacity:0, y:12 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.2, duration:0.5, ease }}
            >
              <SectionLabel icon={RiQuillPenLine} label="Onboarding Answers" />
              <Card style={{ padding:'6px 18px 6px' }}>
                <InfoRow
                  icon={RiSmartphoneLine}
                  label="Daily Screen Time"
                  value={`${profile.screenTime} hrs`}
                  color={profile.screenTime > 5 ? T.red : T.accent}
                />
                <InfoRow
                  icon={RiAlarmWarningLine}
                  label="Biggest Time Thief"
                  value={APP_LABELS[profile.worstApp] || profile.worstApp || '—'}
                  color={T.red}
                />
                <InfoRow
                  icon={RiTimerFlashLine}
                  label="Peak Focus Window"
                  value={PEAK_LABELS[profile.focusPeak] || profile.focusPeak || '—'}
                  color={T.green}
                />
                <InfoRow
                  icon={RiRocketLine}
                  label="Mission"
                  value={MISSION_LABELS[profile.mission] || profile.mission || '—'}
                  color={T.accent}
                />
                <InfoRow
                  icon={RiShieldLine}
                  label="Past Attempts"
                  value={ATTEMPT_LABELS[profile.pastAttempts] || profile.pastAttempts || '—'}
                  color={T.inkMid}
                />
                <InfoRow
                  icon={RiZzzLine}
                  label="Sleep"
                  value={`${profile.sleep} hrs`}
                  color={profile.sleep >= 7 ? T.green : T.red}
                />
                <InfoRow
                  icon={RiMentalHealthLine}
                  label="Stress Level"
                  value={stressLabel}
                  color={stressColor}
                />
              </Card>
            </motion.div>

            {/* ── Account ──────────────────────────────────── */}
            <motion.div
              initial={{ opacity:0, y:12 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.24, duration:0.5, ease }}
            >
              <SectionLabel icon={RiUserLine} label="Account" />
              <Card style={{ padding:'6px 18px 6px' }}>
                {user?.name && (
                  <InfoRow icon={RiUserLine} label="Name" value={user.name} color={T.accent} />
                )}
                {user?.email && (
                  <InfoRow icon={RiCalendarCheckLine} label="Email" value={user.email} color={T.inkMid} />
                )}
              </Card>
            </motion.div>

            {/* ── Footer ────────────────────────────────────── */}
            <motion.div
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              transition={{ delay:0.3 }}
              style={{ textAlign:'center', padding:'24px 0 12px' }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                <div style={{ flex:1, height:1, background:T.border }} />
                <span style={{ fontFamily:T.heading, fontStyle:'italic', fontSize:11, color:T.inkLow, letterSpacing:'0.02em' }}>
                  Viram · {new Date().getFullYear()}
                </span>
                <div style={{ flex:1, height:1, background:T.border }} />
              </div>
              <p style={{ fontFamily:T.body, fontSize:10, color:T.inkLow, letterSpacing:'0.04em' }}>
                Forged from your onboarding answers
              </p>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  )
}
