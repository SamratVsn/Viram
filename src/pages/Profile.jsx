import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiArrowLeftLine, RiUserLine, RiSmartphoneLine, RiTimerFlashLine,
  RiAlarmWarningLine, RiShieldLine,
  RiMentalHealthLine, RiRocketLine, RiQuillPenLine, RiZzzLine, RiEditLine,
  RiCalendarCheckLine,
} from 'react-icons/ri'
import SkillTracker from '../components/SkillTracker'
import useViramData from '../hooks/useViramData'
import { getTotalFocus, updateProfile } from '../lib/db'
import { supabase } from '../lib/supabase'

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

const WORST_APP_OPTIONS = [
  { val:'reels', icon:'📱', label:'Instagram / TikTok', sub:'Endless scroll' },
  { val:'youtube', icon:'▶', label:'YouTube', sub:'Video rabbit hole' },
  { val:'chat', icon:'💬', label:'WhatsApp / Messaging', sub:'Constant pings' },
  { val:'feed', icon:'📡', label:'Twitter / Reddit', sub:'Doomscroll' },
  { val:'games', icon:'🎮', label:'Games', sub:'One more round' },
  { val:'all', icon:'🌀', label:'All of them', sub:'Hard to pick one' },
]

const FOCUS_PEAK_OPTIONS = [
  { val:'early', label:'Early morning (5–8 AM)' },
  { val:'morning', label:'Morning (8–12 PM)' },
  { val:'afternoon', label:'Afternoon (12–5 PM)' },
  { val:'evening', label:'Evening (5–10 PM)' },
  { val:'none', label:"I don't have a peak" },
]

const MISSION_OPTIONS = [
  { val:'study', label:'Academic focus' },
  { val:'deepwork', label:'Deep work / career' },
  { val:'health', label:'Health & fitness' },
  { val:'discipline', label:'General discipline' },
  { val:'detox', label:'Digital detox' },
]

const ATTEMPT_OPTIONS = [
  { val:'limits', label:'Screen time limits' },
  { val:'timers', label:'Pomodoro / timers' },
  { val:'willpower', label:'Willpower alone' },
  { val:'apps', label:'Other apps' },
  { val:'nothing', label:'Nothing yet' },
]

function calcStats(p) {
  const st = p.screenTime ?? 4
  const sl = p.sleep ?? 7
  const str = p.stressLevel ?? 1
  return {
    vitality:   Math.max(15, Math.min(100, Math.round(100 - st*5  - str*6 + (sl-5)*3))),
    energy:     Math.max(15, Math.min(100, Math.round(100 - st*4  - str*5 + (sl-5)*4))),
    discipline: Math.max(20, Math.min(100, Math.round(100 - st*6  - str*4))),
    focus:      Math.max(20, Math.min(100, Math.round(100 - st*7  - str*3 + (sl-5)*2))),
    shieldHP:   Math.max(10, Math.min(100, Math.round(100 - st*8))),
    coins:      Math.max(1,  Math.round(10 - st*0.7)),
  }
}

function Grain() {
  return (
    <div style={{
      position:'absolute', inset:0, pointerEvents:'none', zIndex:0,
      backgroundImage: GRAIN, backgroundSize:'180px', backgroundRepeat:'repeat',
      opacity:0.065, borderRadius:'inherit',
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
    background-size:180px; opacity:0.065; pointer-events:none; z-index:9999;
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
  const { user: profileData, loading } = useViramData()
  const [totalFocusMins, setTotalFocusMins] = useState(0)
  const [authEmail, setAuthEmail] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editProfile, setEditProfile] = useState(null)

  useEffect(() => {
    if (profileData?.id) {
      getTotalFocus(profileData.id).then(setTotalFocusMins)
    }
    supabase.auth.getUser().then(({ data: { user: au } }) => {
      if (au?.email) setAuthEmail(au.email)
    })
  }, [profileData?.id])

  if (loading || !profileData) {
    return (
      <div style={{ minHeight:'100vh', background:T.bg, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
        <style>{GLOBAL}</style>
        <div style={{ fontFamily:T.heading, fontSize:22, color:T.inkLow }}>{loading ? 'Loading…' : 'No profile found'}</div>
        {!loading && (
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
        )}
      </div>
    )
  }

  function handleOpenEdit() {
    setEditProfile({ ...profileData })
    setShowEditModal(true)
  }

  async function handleSaveEdit() {
    if (!editProfile) return
    const stats = calcStats(editProfile)
    const updated = { ...editProfile, ...stats }
    await updateProfile(profileData.id, updated)
    setShowEditModal(false)
    setEditProfile(null)
  }

  const archetype = ARCHETYPE_MAP[profileData.mission] || ARCHETYPE_MAP.discipline
  const stressColor = STRESS_COLORS[profileData.stressLevel] || T.inkLow
  const stressLabel = STRESS_LABELS[profileData.stressLevel] || 'Unknown'
  const displayName = profileData.name?.split(' ')[0] || profileData.avatarName || 'Scholar'
  const initial = (profileData.name || profileData.avatarName || '?').charAt(0).toUpperCase()

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
                      {profileData?.picture
                        ? <img src={profileData.picture} alt={displayName} style={{ width:'100%', height:'100%', objectFit:'cover', filter:'sepia(0.12)' }} />
                        : <span style={{ fontFamily:T.heading, fontWeight:700, fontStyle:'italic', fontSize:32, color:T.inkHigh }}>{initial}</span>
                      }
                    </div>
                  </div>

                  {/* Name */}
                  <div style={{ fontFamily:T.heading, fontWeight:700, fontStyle:'italic', fontSize:26, color:T.inkHigh, letterSpacing:'-0.01em', lineHeight:1.1 }}>
                    {profileData.avatarName || displayName}
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
                  {authEmail && (
                    <div style={{ fontFamily:T.body, fontWeight:300, fontSize:11, color:T.inkLow, marginTop:10, letterSpacing:'0.02em' }}>
                      {authEmail}
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
                      {totalFocusMins}
                    </div>
                    <div style={{ fontFamily:T.body, fontWeight:300, fontSize:9, color:T.inkLow, marginTop:4, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                      Total Focus Mins
                    </div>
                  </div>
                  <div style={{ width:1, background:T.border }} />
                  <div style={{ flex:1, textAlign:'center' }}>
                    <div style={{ fontFamily:T.heading, fontWeight:700, fontSize:28, color:'#D4A843', lineHeight:1 }}>
                      {profileData?.coins || 0}
                    </div>
                    <div style={{ fontFamily:T.body, fontWeight:300, fontSize:9, color:T.inkLow, marginTop:4, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                      Coins
                    </div>
                  </div>
                  <div style={{ width:1, background:T.border }} />
                  <div style={{ flex:1, textAlign:'center' }}>
                    <div style={{ fontFamily:T.heading, fontWeight:700, fontSize:28, color:T.green, lineHeight:1 }}>
                      {profileData?.disciplinePoints || 0}
                    </div>
                    <div style={{ fontFamily:T.body, fontWeight:300, fontSize:9, color:T.inkLow, marginTop:4, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                      Discipline
                    </div>
                  </div>
                </div>
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
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12, marginTop:18 }}>
                <RiQuillPenLine size={10} color={T.accentDim} />
                <span style={{ fontFamily:T.body, fontSize:9, fontWeight:600, letterSpacing:'0.22em', textTransform:'uppercase', color:T.inkLow }}>
                  Onboarding Answers
                </span>
                <div style={{ flex:1, height:1, background:T.border }} />
                <motion.button
                  whileHover={{ y:-1 }} whileTap={{ scale:0.95 }}
                  onClick={handleOpenEdit}
                  style={{
                    display:'flex', alignItems:'center', gap:5,
                    padding:'5px 12px', borderRadius:T.rPill,
                    background:T.accentBg, border:`1px solid ${T.accentBorder}`,
                    fontFamily:T.body, fontWeight:600, fontSize:9,
                    letterSpacing:'0.08em', textTransform:'uppercase',
                    color:T.accent, cursor:'pointer',
                  }}
                >
                  <RiEditLine size={10} />
                  Edit
                </motion.button>
              </div>
              <Card style={{ padding:'6px 18px 6px' }}>
                <InfoRow
                  icon={RiSmartphoneLine}
                  label="Daily Screen Time"
                  value={`${profileData.screenTime} hrs`}
                  color={profileData.screenTime > 5 ? T.red : T.accent}
                />
                <InfoRow
                  icon={RiAlarmWarningLine}
                  label="Biggest Time Thief"
                  value={APP_LABELS[profileData.worstApp] || profileData.worstApp || '—'}
                  color={T.red}
                />
                <InfoRow
                  icon={RiTimerFlashLine}
                  label="Peak Focus Window"
                  value={PEAK_LABELS[profileData.focusPeak] || profileData.focusPeak || '—'}
                  color={T.green}
                />
                <InfoRow
                  icon={RiRocketLine}
                  label="Mission"
                  value={MISSION_LABELS[profileData.mission] || profileData.mission || '—'}
                  color={T.accent}
                />
                <InfoRow
                  icon={RiShieldLine}
                  label="Past Attempts"
                  value={ATTEMPT_LABELS[profileData.pastAttempts] || profileData.pastAttempts || '—'}
                  color={T.inkMid}
                />
                <InfoRow
                  icon={RiZzzLine}
                  label="Sleep"
                  value={`${profileData.sleep} hrs`}
                  color={profileData.sleep >= 7 ? T.green : T.red}
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
                  {profileData?.name && (
                  <InfoRow icon={RiUserLine} label="Name" value={profileData.name} color={T.accent} />
                )}
                {authEmail && (
                  <InfoRow icon={RiCalendarCheckLine} label="Email" value={authEmail} color={T.inkMid} />
                )}
              </Card>
            </motion.div>

            {/* ── Edit Profile Modal ──────────────────────── */}
            <AnimatePresence>
              {showEditModal && editProfile && (
                <motion.div
                  initial={{ opacity:0 }}
                  animate={{ opacity:1 }}
                  exit={{ opacity:0 }}
                  transition={{ duration:0.3 }}
                  style={{
                    position:'fixed', inset:0, zIndex:200,
                    background:'rgba(28,21,16,0.72)', backdropFilter:'blur(8px)',
                    display:'flex', alignItems:'center', justifyContent:'center', padding:16,
                  }}
                >
                  <motion.div
                    initial={{ opacity:0, scale:0.9, y:30 }}
                    animate={{ opacity:1, scale:1, y:0 }}
                    exit={{ opacity:0, scale:0.95, y:20 }}
                    transition={{ duration:0.4, ease }}
                    style={{
                      background:T.card, borderRadius:28,
                      border:`1px solid ${T.border}`,
                      borderTop:`3px solid ${T.accent}`,
                      width:'100%', maxWidth:460, maxHeight:'90vh',
                      display:'flex', flexDirection:'column',
                      boxShadow:'0 24px 64px rgba(28,21,16,0.40)',
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div style={{
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      padding:'20px 24px 0',
                    }}>
                      <div style={{ fontFamily:T.heading, fontWeight:700, fontSize:20, color:T.inkHigh }}>
                        Edit Profile
                      </div>
                      <motion.button
                        whileHover={{ rotate:90 }} whileTap={{ scale:0.9 }}
                        onClick={() => { setShowEditModal(false); setEditProfile(null) }}
                        style={{
                          width:30, height:30, borderRadius:'50%',
                          background:T.cardDeep, border:`1px solid ${T.borderMid}`,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          color:T.inkLow, cursor:'pointer', fontSize:14, lineHeight:1,
                        }}
                      >
                        ✕
                      </motion.button>
                    </div>

                    {/* Form body */}
                    <div className="viram-scroll" style={{
                      flex:1, overflowY:'auto', padding:'18px 24px 20px',
                    }}>
                      {/* Screen Time */}
                      <div style={{ marginBottom:20 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                          <span style={{ fontFamily:T.body, fontWeight:600, fontSize:11, color:T.inkMid, letterSpacing:'0.06em' }}>
                            Daily Screen Time
                          </span>
                          <span style={{ fontFamily:T.heading, fontWeight:700, fontSize:16, color:T.accent }}>
                            {editProfile.screenTime}h
                          </span>
                        </div>
                        <input
                          type="range" min={0} max={14} step={0.5}
                          value={editProfile.screenTime}
                          onChange={e => setEditProfile(p => ({ ...p, screenTime: parseFloat(e.target.value) }))}
                          style={{ width:'100%', accentColor:T.accent }}
                        />
                      </div>

                      {/* Worst App */}
                      <div style={{ marginBottom:20 }}>
                        <span style={{ fontFamily:T.body, fontWeight:600, fontSize:11, color:T.inkMid, letterSpacing:'0.06em', display:'block', marginBottom:8 }}>
                          Biggest Time Thief
                        </span>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                          {WORST_APP_OPTIONS.map(opt => (
                            <button
                              key={opt.val}
                              onClick={() => setEditProfile(p => ({ ...p, worstApp: opt.val }))}
                              style={{
                                padding:'8px 10px', borderRadius:12, cursor:'pointer', textAlign:'left',
                                background: editProfile.worstApp === opt.val ? T.accentBg : T.cardDeep,
                                border: `1px solid ${editProfile.worstApp === opt.val ? T.accentBorder : T.border}`,
                                fontFamily:T.body, fontSize:11, color:T.inkHigh,
                                transition:'all 0.15s ease',
                              }}
                            >
                              <span style={{ fontSize:14, marginRight:4 }}>{opt.icon}</span>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Peak Focus */}
                      <div style={{ marginBottom:20 }}>
                        <span style={{ fontFamily:T.body, fontWeight:600, fontSize:11, color:T.inkMid, letterSpacing:'0.06em', display:'block', marginBottom:8 }}>
                          Peak Focus Window
                        </span>
                        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                          {FOCUS_PEAK_OPTIONS.map(opt => (
                            <button
                              key={opt.val}
                              onClick={() => setEditProfile(p => ({ ...p, focusPeak: opt.val }))}
                              style={{
                                padding:'8px 12px', borderRadius:10, cursor:'pointer', textAlign:'left',
                                background: editProfile.focusPeak === opt.val ? T.accentBg : T.cardDeep,
                                border: `1px solid ${editProfile.focusPeak === opt.val ? T.accentBorder : T.border}`,
                                fontFamily:T.body, fontSize:11, color:T.inkHigh,
                              }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Mission */}
                      <div style={{ marginBottom:20 }}>
                        <span style={{ fontFamily:T.body, fontWeight:600, fontSize:11, color:T.inkMid, letterSpacing:'0.06em', display:'block', marginBottom:8 }}>
                          Mission
                        </span>
                        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                          {MISSION_OPTIONS.map(opt => (
                            <button
                              key={opt.val}
                              onClick={() => setEditProfile(p => ({ ...p, mission: opt.val }))}
                              style={{
                                padding:'8px 12px', borderRadius:10, cursor:'pointer', textAlign:'left',
                                background: editProfile.mission === opt.val ? T.accentBg : T.cardDeep,
                                border: `1px solid ${editProfile.mission === opt.val ? T.accentBorder : T.border}`,
                                fontFamily:T.body, fontSize:11, color:T.inkHigh,
                              }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Past Attempts */}
                      <div style={{ marginBottom:20 }}>
                        <span style={{ fontFamily:T.body, fontWeight:600, fontSize:11, color:T.inkMid, letterSpacing:'0.06em', display:'block', marginBottom:8 }}>
                          Past Attempts
                        </span>
                        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                          {ATTEMPT_OPTIONS.map(opt => (
                            <button
                              key={opt.val}
                              onClick={() => setEditProfile(p => ({ ...p, pastAttempts: opt.val }))}
                              style={{
                                padding:'8px 12px', borderRadius:10, cursor:'pointer', textAlign:'left',
                                background: editProfile.pastAttempts === opt.val ? T.accentBg : T.cardDeep,
                                border: `1px solid ${editProfile.pastAttempts === opt.val ? T.accentBorder : T.border}`,
                                fontFamily:T.body, fontSize:11, color:T.inkHigh,
                              }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sleep */}
                      <div style={{ marginBottom:20 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                          <span style={{ fontFamily:T.body, fontWeight:600, fontSize:11, color:T.inkMid, letterSpacing:'0.06em' }}>
                            Sleep
                          </span>
                          <span style={{ fontFamily:T.heading, fontWeight:700, fontSize:16, color:T.green }}>
                            {editProfile.sleep}h
                          </span>
                        </div>
                        <input
                          type="range" min={2} max={12} step={0.5}
                          value={editProfile.sleep}
                          onChange={e => setEditProfile(p => ({ ...p, sleep: parseFloat(e.target.value) }))}
                          style={{ width:'100%', accentColor:T.green }}
                        />
                      </div>

                      {/* Stress Level */}
                      <div style={{ marginBottom:20 }}>
                        <span style={{ fontFamily:T.body, fontWeight:600, fontSize:11, color:T.inkMid, letterSpacing:'0.06em', display:'block', marginBottom:8 }}>
                          Stress Level
                        </span>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                          {STRESS_LABELS.map((label, i) => (
                            <button
                              key={i}
                              onClick={() => setEditProfile(p => ({ ...p, stressLevel: i }))}
                              style={{
                                padding:'8px 10px', borderRadius:12, cursor:'pointer', textAlign:'center',
                                background: editProfile.stressLevel === i ? T.accentBg : T.cardDeep,
                                border: `1px solid ${editProfile.stressLevel === i ? T.accentBorder : T.border}`,
                                fontFamily:T.body, fontSize:10, color:T.inkHigh,
                              }}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Avatar Name */}
                      <div style={{ marginBottom:8 }}>
                        <span style={{ fontFamily:T.body, fontWeight:600, fontSize:11, color:T.inkMid, letterSpacing:'0.06em', display:'block', marginBottom:6 }}>
                          Avatar Name
                        </span>
                        <input
                          type="text"
                          maxLength={20}
                          value={editProfile.avatarName || ''}
                          onChange={e => setEditProfile(p => ({ ...p, avatarName: e.target.value }))}
                          placeholder="Monk, Nova, Stoic…"
                          style={{
                            width:'100%', padding:'10px 14px', borderRadius:12,
                            background:T.bg, border:`1px solid ${T.borderMid}`,
                            fontFamily:T.heading, fontStyle:'italic', fontSize:15, color:T.inkHigh,
                            outline:'none',
                          }}
                        />
                      </div>
                    </div>

                    {/* Footer buttons */}
                    <div style={{
                      display:'flex', gap:10, padding:'0 24px 20px',
                    }}>
                      <motion.button
                        whileHover={{ y:-1 }} whileTap={{ scale:0.97 }}
                        onClick={() => { setShowEditModal(false); setEditProfile(null) }}
                        style={{
                          flex:1, padding:'12px 20px', borderRadius:T.rPill,
                          background:T.cardDeep, border:`1px solid ${T.borderMid}`,
                          fontFamily:T.body, fontWeight:600, fontSize:11,
                          letterSpacing:'0.08em', textTransform:'uppercase',
                          color:T.inkLow, cursor:'pointer',
                        }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ y:-1 }} whileTap={{ scale:0.97 }}
                        onClick={handleSaveEdit}
                        style={{
                          flex:1, padding:'12px 20px', borderRadius:T.rPill,
                          background:T.accent, border:'none',
                          fontFamily:T.body, fontWeight:600, fontSize:11,
                          letterSpacing:'0.08em', textTransform:'uppercase',
                          color:'#FFF8F2', cursor:'pointer',
                          boxShadow:'0 4px 16px rgba(184,112,78,0.25)',
                        }}
                      >
                        Save Changes
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

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
