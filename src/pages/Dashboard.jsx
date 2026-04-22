import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiFlashlightLine,
  RiTimerFlashLine,
  RiBookOpenLine,
  RiSparkling2Line,
  RiRadarLine,
  RiSmartphoneLine,
  RiLeafLine,
  RiFireFill,
  RiShieldKeyholeLine,
  RiCoinLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiUserLine,
  RiSettings3Line,
  RiLogoutBoxLine,
  RiCheckLine,
  RiSwordLine,
  RiStarFill,
  RiBarChartFill,
  RiCalendarCheckLine,
} from 'react-icons/ri'

/* ── Keyframes ────────────────────────────────────────────────────────────── */
const STYLES = `
  @keyframes pulse-dot  { 0%,100%{opacity:1;transform:scale(1)}  50%{opacity:.3;transform:scale(.7)} }
  @keyframes spin-slow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes float      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes scanline   { 0%{top:-20%} 100%{top:110%} }
  @keyframes xp-flash   { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-28px) scale(0.85)} }
  .xp-float { animation: xp-flash 1.4s ease-out forwards; }
`

/* ── Tier config ─────────────────────────────────────────────────────────── */
const TIER = (xp) => {
  if (xp >= 900) return { label: 'LEGENDARY',  threshold: 900,  next: 1000 }
  if (xp >= 600) return { label: 'HYPERDRIVE', threshold: 600,  next: 900  }
  if (xp >= 300) return { label: 'KINETIC',    threshold: 300,  next: 600  }
  if (xp >= 100) return { label: 'OPERATIVE',  threshold: 100,  next: 300  }
  return               { label: 'RISING',      threshold: 0,    next: 100  }
}

/* ── Default game state ──────────────────────────────────────────────────── */
const DEFAULT_G = {
  xp: 0, streak: 1, debt: 0, coins: 8,
  hp: 72, energy: 65, disc: 58, focus: 74, shieldHP: 80,
  logs: [
    { text: 'Avatar forged — journey begins', xp: 50,  color: '#ffffff' },
    { text: 'Profile calibrated',             xp: 20,  color: '#aaaaaa' },
  ],
}

/* ── Stat bar ─────────────────────────────────────────────────────────────── */
function StatBar({ label, value, max = 100 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div>
      <div className="flex justify-between mb-[5px]">
        <span className="text-[10px] text-[#555555] font-dm-sans tracking-[0.1em] uppercase">{label}</span>
        <span className="text-[10px] text-[#888888] font-syne font-black">{Math.round(value)}</span>
      </div>
      <div className="h-[3px] rounded-full bg-[#111111] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-white/80"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}

/* ── XP ring (SVG) ───────────────────────────────────────────────────────── */
function XPRing({ xp }) {
  const tier      = TIER(xp)
  const range     = tier.next - tier.threshold
  const progress  = xp - tier.threshold
  const pct       = range > 0 ? progress / range : 1
  const R         = 38
  const circ      = 2 * Math.PI * R
  const offset    = circ - circ * pct

  return (
    <div className="relative flex items-center justify-center">
      <svg width="100" height="100" viewBox="0 0 100 100">
        {/* track */}
        <circle cx="50" cy="50" r={R} fill="none" stroke="#111111" strokeWidth="3" />
        {/* progress */}
        <motion.circle
          cx="50" cy="50" r={R}
          fill="none" stroke="white" strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
        />
        {/* XP text */}
        <text x="50" y="46" textAnchor="middle" fill="white"
          fontSize="14" fontWeight="900" fontFamily="Syne, sans-serif"
          letterSpacing="-0.03em">{xp}</text>
        <text x="50" y="58" textAnchor="middle" fill="#333333"
          fontSize="8" fontFamily="DM Sans, sans-serif" fontWeight="700"
          letterSpacing="0.12em">XP</text>
      </svg>
    </div>
  )
}

/* ── Avatar figure (CSS) ─────────────────────────────────────────────────── */
function AvatarFigure({ name, hp }) {
  const initial = (name || '?').charAt(0).toUpperCase()
  return (
    <div className="relative mx-auto w-fit">
      <svg className="absolute -inset-[10px] w-[calc(100%+20px)] h-[calc(100%+20px)]"
        style={{ animation: 'spin-slow 18s linear infinite' }} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="56" fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 8" />
      </svg>
      <div
        className="w-[88px] h-[88px] rounded-full bg-[#0a0a0a] border border-[#2a2a2a] flex items-center justify-center relative overflow-hidden"
        style={{ animation: 'float 5s ease-in-out infinite' }}
      >
        {/* scanline */}
        <div className="absolute left-0 right-0 h-[25%] bg-gradient-to-b from-transparent via-white/[0.025] to-transparent pointer-events-none"
          style={{ animation: 'scanline 4s linear infinite' }} />
        <span className="font-syne font-black text-white text-3xl select-none tracking-tight">{initial}</span>
      </div>
      {/* HP ring indicator */}
      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center text-[8px] font-black font-syne ${
        hp > 60 ? 'bg-white text-black' : hp > 30 ? 'bg-[#888888] text-black' : 'bg-[#333333] text-white'
      }`}>
        {hp > 60 ? '▲' : hp > 30 ? '●' : '▼'}
      </div>
    </div>
  )
}

/* ── Action button ───────────────────────────────────────────────────────── */
function ActionBtn({ icon: Icon, label, sub, onClick, danger = false, accent = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-[6px] py-5 px-3 rounded-[18px] border transition-all duration-200 hover:-translate-y-[2px] text-center ${
        danger  ? 'border-[#2a2a2a] bg-[#0a0a0a] hover:border-[#3a3a3a] hover:bg-white/[0.03]' :
        accent  ? 'border-[#2a2a2a] bg-white text-black hover:bg-[#e8e8e8]' :
                  'border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#2a2a2a] hover:bg-white/[0.03]'
      }`}
    >
      <Icon size={22} className={accent ? 'text-black' : danger ? 'text-[#666666]' : 'text-[#888888]'} />
      <div className={`text-[12px] font-black font-syne leading-tight ${accent ? 'text-black' : 'text-white'}`}>{label}</div>
      <div className={`text-[10px] font-dm-sans leading-tight ${accent ? 'text-black/60' : 'text-[#333333]'}`}>{sub}</div>
    </button>
  )
}

/* ── Log entry ───────────────────────────────────────────────────────────── */
function LogEntry({ entry, index }) {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="flex items-center gap-3 px-4 py-[12px] bg-[#0a0a0a] rounded-[12px] border border-[#111111]"
    >
      <div className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: entry.color }} />
      <div className="flex-1 text-[12px] text-[#666666] font-dm-sans leading-snug">{entry.text}</div>
      <div className={`text-[11px] font-black font-syne flex-shrink-0 ${entry.xp >= 0 ? 'text-[#888888]' : 'text-[#444444]'}`}>
        {entry.xp > 0 ? '+' : ''}{entry.xp} XP
      </div>
    </motion.div>
  )
}

/* ── Tab nav item ────────────────────────────────────────────────────────── */
function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-[3px] px-4 py-[10px] rounded-xl transition-all duration-200 ${
        active ? 'text-white' : 'text-[#333333] hover:text-[#666666]'
      }`}
    >
      <Icon size={20} />
      <span className="text-[9px] font-bold font-dm-sans uppercase tracking-[0.1em]">{label}</span>
    </button>
  )
}

/* ── XP float popup ──────────────────────────────────────────────────────── */
function XPFloat({ amount, id }) {
  return (
    <div key={id}
      className="xp-float absolute top-0 left-1/2 -translate-x-1/2 font-syne font-black text-white text-sm pointer-events-none z-50 whitespace-nowrap"
    >
      {amount > 0 ? `+${amount} XP` : `${amount} XP`}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const navigate = useNavigate()
  const [tab,   setTab]   = useState('home')
  const [G,     setG]     = useState(DEFAULT_G)
  const [user,  setUser]  = useState(null)
  const [floats, setFloats] = useState([])

  /* Load from localStorage */
  useEffect(() => {
    const storedUser    = localStorage.getItem('viram_user')
    const storedProfile = localStorage.getItem('viram_profile')
    if (storedUser)    setUser(JSON.parse(storedUser))
    if (storedProfile) {
      const p = JSON.parse(storedProfile)
      setG(prev => ({
        ...prev,
        hp:       p.hp        ?? prev.hp,
        energy:   p.energy    ?? prev.energy,
        disc:     p.discipline?? prev.disc,
        focus:    p.focus     ?? prev.focus,
        shieldHP: p.shieldHP  ?? prev.shieldHP,
        coins:    p.coins     ?? prev.coins,
        avatarName: p.avatarName ?? '',
      }))
    }
  }, [])

  /* XP float helper */
  function spawnFloat(amount) {
    const id = Date.now()
    setFloats(f => [...f, { id, amount }])
    setTimeout(() => setFloats(f => f.filter(x => x.id !== id)), 1500)
  }

  /* Combo multiplier */
  const comboMult = () => Math.round(Math.pow(1 + 0.15 * G.streak, 1.4) * 100) / 100
  const tier      = TIER(G.xp)
  const ceff      = (G.coins * (1 - G.debt / 200)).toFixed(1)

  /* Actions */
  function doReport() {
    const m = comboMult(), gain = Math.round(12 * m)
    setG(g => ({
      ...g, xp: Math.min(999, g.xp + gain), disc: Math.min(100, g.disc + 2),
      logs: [{ text: 'Progress reported — HQ acknowledged', xp: gain, color: '#cccccc' }, ...g.logs],
    }))
    spawnFloat(gain)
  }

  function doFocus() { navigate('/focus') }

  function doScroll() {
    const loss = -16
    setG(g => ({
      ...g, disc: Math.max(0, g.disc - 10), energy: Math.max(0, g.energy - 6),
      hp: Math.max(5, g.hp - 5), debt: Math.min(100, g.debt + 22),
      logs: [{ text: 'Friction logged — scroll session confessed', xp: loss, color: '#555555' }, ...g.logs],
    }))
    spawnFloat(loss)
  }

  function doClear() {
    const gain = 18
    setG(g => ({
      ...g, debt: Math.max(0, g.debt - 35), hp: Math.min(100, g.hp + 8),
      disc: Math.min(100, g.disc + 4),
      logs: [{ text: '5-min reset protocol completed', xp: gain, color: '#aaaaaa' }, ...g.logs],
    }))
    spawnFloat(gain)
  }

  const displayName = G.avatarName || user?.name?.split(' ')[0] || 'Unnamed'

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{STYLES}</style>

      <div className="fixed inset-0 bg-black flex flex-col overflow-hidden">

        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-[#111111] bg-black/95 backdrop-blur-xl z-10">
          <div className="font-syne font-black tracking-[0.16em] text-lg">
            <span className="text-white">VI</span><span className="text-[#2a2a2a]">RAM</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-[6px] px-3 py-[5px] rounded-full border border-[#1a1a1a] bg-white/[0.02]">
              <span className="w-[5px] h-[5px] rounded-full bg-white inline-block"
                style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
              <span className="text-[10px] text-[#555555] font-dm-sans font-bold tracking-[0.1em]">
                {tier.label}
              </span>
            </div>
            {user?.picture
              ? <img src={user.picture} alt="" className="w-7 h-7 rounded-full border border-[#2a2a2a] grayscale" />
              : <div className="w-7 h-7 rounded-full border border-[#2a2a2a] bg-[#111] flex items-center justify-center">
                  <RiUserLine size={13} className="text-[#555555]" />
                </div>
            }
          </div>
        </div>

        {/* ── SCROLLABLE BODY ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ════════════ HOME TAB ════════════ */}
            {tab === 'home' && (
              <motion.div key="home"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                className="p-4 space-y-3 pb-24"
              >
                {/* ── Avatar + stats card ─────────────────────────────── */}
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-[22px] p-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                  <div className="flex items-start gap-5">
                    {/* Avatar figure */}
                    <div className="flex flex-col items-center gap-3 flex-shrink-0">
                      <AvatarFigure name={displayName} hp={G.hp} />
                      <div>
                        <div className="font-syne font-black text-white text-sm text-center leading-tight">{displayName}</div>
                        <div className="text-[10px] text-[#333333] font-dm-sans text-center">LV 1 · {tier.label}</div>
                      </div>
                    </div>

                    {/* Stats + XP ring */}
                    <div className="flex-1 flex flex-col gap-3 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-col gap-[10px] flex-1">
                          <StatBar label="Health"     value={G.hp} />
                          <StatBar label="Energy"     value={G.energy} />
                          <StatBar label="Discipline" value={G.disc} />
                          <StatBar label="Focus"      value={G.focus} />
                        </div>
                        {/* XP ring */}
                        <div className="flex-shrink-0 relative">
                          <XPRing xp={G.xp} />
                          {floats.map(f => <XPFloat key={f.id} id={f.id} amount={f.amount} />)}
                        </div>
                      </div>

                      {/* Streak + combo row */}
                      <div className="flex gap-2">
                        <div className="flex items-center gap-[5px] px-3 py-[5px] rounded-full border border-[#1a1a1a] bg-white/[0.02]">
                          <RiFireFill size={11} className="text-[#888888]" />
                          <span className="text-[11px] font-black font-syne text-white">{G.streak}d</span>
                          <span className="text-[10px] text-[#333333] font-dm-sans">streak</span>
                        </div>
                        <div className="flex items-center gap-[5px] px-3 py-[5px] rounded-full border border-[#1a1a1a] bg-white/[0.02]">
                          <span className="text-[11px] font-black font-syne text-white">{comboMult()}×</span>
                          <span className="text-[10px] text-[#333333] font-dm-sans">combo</span>
                        </div>
                        <div className="flex items-center gap-[5px] px-3 py-[5px] rounded-full border border-[#1a1a1a] bg-white/[0.02] ml-auto">
                          <RiCoinLine size={11} className="text-[#888888]" />
                          <span className="text-[11px] font-black font-syne text-white">{ceff}</span>
                          <span className="text-[10px] text-[#333333] font-dm-sans">/min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Friction debt bar ────────────────────────────────── */}
                {G.debt > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-[16px] px-4 py-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <RiSmartphoneLine size={13} className="text-[#555555]" />
                        <span className="text-[11px] text-[#555555] font-dm-sans font-bold uppercase tracking-[0.1em]">Friction Debt</span>
                      </div>
                      <span className="text-[11px] font-black font-syne text-[#888888]">{Math.round(G.debt)}%</span>
                    </div>
                    <div className="h-[3px] rounded-full bg-[#111111] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-white/40"
                        animate={{ width: `${G.debt}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <p className="text-[11px] text-[#333333] font-dm-sans mt-2">
                      Coin rate throttled. Run a reset to clear.
                    </p>
                  </motion.div>
                )}

                {/* ── HUD metrics row ──────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: RiShieldKeyholeLine , label: 'Shield HP',   val: `${Math.round(G.shieldHP)}%`,  sub: 'Distraction armor'    },
                    { icon: RiCoinLine,            label: 'Coin Rate',   val: `${ceff}/min`,                  sub: G.debt > 0 ? 'Debt throttled' : 'Full output' },
                  ].map(({ icon: Icon, label, val, sub }) => (
                    <div key={label} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-[16px] p-4">
                      <div className="flex items-center gap-[6px] mb-2">
                        <Icon size={13} className="text-[#555555]" />
                        <span className="text-[10px] text-[#444444] font-dm-sans uppercase tracking-[0.1em] font-bold">{label}</span>
                      </div>
                      <div className="font-syne font-black text-white text-xl">{val}</div>
                      <div className="text-[11px] text-[#333333] font-dm-sans mt-[2px]">{sub}</div>
                    </div>
                  ))}
                </div>

                {/* ── Action grid ──────────────────────────────────────── */}
                <div>
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <RiFlashlightLine size={12} className="text-[#333333]" />
                    <span className="text-[10px] text-[#333333] font-dm-sans uppercase tracking-[0.14em] font-bold">Actions</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <ActionBtn icon={RiTimerFlashLine} label="Focus Session"    sub="Pomodoro engine"   onClick={doFocus}   accent />
                    <ActionBtn icon={RiRadarLine}       label="Report to HQ"     sub={`+${Math.round(12 * comboMult())} XP`} onClick={doReport} />
                    <ActionBtn icon={RiSmartphoneLine}  label="Confess Friction" sub="Log scroll debt"   onClick={doScroll}  danger />
                    <ActionBtn icon={RiLeafLine}        label="Clear Debt"       sub="5-min reset"       onClick={doClear}  />
                  </div>
                </div>

                {/* ── Recent log ───────────────────────────────────────── */}
                <div>
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <RiBarChartFill size={12} className="text-[#333333]" />
                    <span className="text-[10px] text-[#333333] font-dm-sans uppercase tracking-[0.14em] font-bold">Recent Activity</span>
                  </div>
                  <div className="space-y-[6px]">
                    <AnimatePresence>
                      {G.logs.slice(0, 5).map((l, i) => (
                        <LogEntry key={`${l.text}-${i}`} entry={l} index={i} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ════════════ DEBRIEF TAB ════════════ */}
            {tab === 'log' && (
              <motion.div key="log"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                className="p-4 pb-24"
              >
                <div className="mb-5">
                  <h2 className="font-syne font-black text-white text-xl tracking-[-0.02em]">Mission Debrief</h2>
                  <p className="text-[13px] text-[#444444] font-dm-sans mt-1">Full activity intelligence log.</p>
                </div>

                {/* stats summary bar */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { label: 'Total XP',  val: G.xp,                                    icon: RiStarFill       },
                    { label: 'Streak',    val: `${G.streak}d`,                           icon: RiFireFill       },
                    { label: 'Sessions',  val: G.logs.filter(l => l.xp > 0).length,     icon: RiCalendarCheckLine },
                  ].map(({ label, val, icon: Icon }) => (
                    <div key={label} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-[14px] p-3 text-center">
                      <Icon size={14} className="text-[#444444] mx-auto mb-1" />
                      <div className="font-syne font-black text-white text-base">{val}</div>
                      <div className="text-[10px] text-[#333333] font-dm-sans">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-[6px]">
                  {G.logs.map((l, i) => (
                    <LogEntry key={i} entry={l} index={i} />
                  ))}
                  {G.logs.length === 0 && (
                    <div className="text-center py-14 text-[#222222] font-dm-sans text-sm">
                      No activity yet. Start a session.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ════════════ PROFILE TAB ════════════ */}
            {tab === 'profile' && (
              <motion.div key="profile"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                className="p-4 pb-24 space-y-3"
              >
                {/* user card */}
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-[22px] p-6 flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <AvatarFigure name={displayName} hp={G.hp} />
                  <div className="mt-4 font-syne font-black text-white text-lg">{displayName}</div>
                  {user?.email && (
                    <div className="text-[12px] text-[#333333] font-dm-sans mt-1">{user.email}</div>
                  )}
                  <div className="inline-flex items-center gap-[6px] mt-3 px-3 py-[5px] rounded-full border border-[#2a2a2a] bg-white/[0.02]">
                    <span className="w-[5px] h-[5px] rounded-full bg-white"
                      style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
                    <span className="text-[10px] text-[#555555] font-dm-sans font-bold tracking-[0.1em]">
                      {tier.label} · LV 1
                    </span>
                  </div>
                </div>

                {/* full stat sheet */}
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-[20px] p-5 space-y-[12px]">
                  <div className="text-[10px] text-[#333333] font-dm-sans uppercase tracking-[0.14em] font-bold mb-1">Stat Sheet</div>
                  <StatBar label="Health"     value={G.hp} />
                  <StatBar label="Energy"     value={G.energy} />
                  <StatBar label="Discipline" value={G.disc} />
                  <StatBar label="Focus"      value={G.focus} />
                  <StatBar label="Shield HP"  value={G.shieldHP} />
                </div>

                {/* actions */}
                <div className="space-y-[6px]">
                  {[
                    { icon: RiSettings3Line, label: 'Settings',     onClick: () => {} },
                    {
                      icon: RiLogoutBoxLine,
                      label: 'Sign out',
                      onClick: () => {
                        localStorage.removeItem('viram_user')
                        localStorage.removeItem('viram_profile')
                        navigate('/start')
                      }
                    },
                  ].map(({ icon: Icon, label, onClick }) => (
                    <button key={label} onClick={onClick}
                      className="w-full flex items-center gap-4 px-4 py-[14px] rounded-[14px] border border-[#1a1a1a] bg-[#0a0a0a] text-[#555555] hover:text-white hover:border-[#2a2a2a] transition-all duration-200"
                    >
                      <Icon size={16} />
                      <span className="text-[13px] font-semibold font-dm-sans">{label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── BOTTOM NAV ────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 flex justify-around items-center px-2 py-1 border-t border-[#111111] bg-black/95 backdrop-blur-xl">
          <NavItem icon={RiFlashlightLine}  label="Home"    active={tab === 'home'}    onClick={() => setTab('home')} />
          <NavItem icon={RiTimerFlashLine}  label="Focus"   active={false}             onClick={doFocus} />
          <NavItem icon={RiRadarLine}       label="Debrief" active={tab === 'log'}     onClick={() => setTab('log')} />
          <NavItem icon={RiBookOpenLine}    label="Library" active={false}             onClick={() => navigate('/library')} />
          <NavItem icon={RiUserLine}        label="Profile" active={tab === 'profile'} onClick={() => setTab('profile')} />
        </div>

      </div>
    </>
  )
}