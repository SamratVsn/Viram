import { useState } from 'react'
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
} from 'react-icons/ri'

/* ── Keyframes ────────────────────────────────────────────────────────────── */
const STYLES = `
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.7)} }
  @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes fadeSlide { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  input[type=range] {
    -webkit-appearance: none; width: 100%; height: 3px;
    background: #1e1e1e; border-radius: 3px; outline: none;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; width: 20px; height: 20px;
    border-radius: 50%; background: #ffffff; cursor: pointer;
    border: 2px solid #0a0a0a; box-shadow: 0 0 0 1px #444;
  }
  input[type=range]::-moz-range-thumb {
    width: 20px; height: 20px; border-radius: 50%;
    background: #ffffff; cursor: pointer; border: 2px solid #0a0a0a;
  }
`

/* ── Question definitions ─────────────────────────────────────────────────── */
/*
  Each step has: type 'range' | 'options' | 'multi' | 'text'
  key → stored in profile state
*/
const STEPS = [
  {
    key: 'screenTime',
    type: 'range',
    Icon: RiSmartphoneLine,
    label: 'Screen time',
    q: 'How many hours a day do you spend on your phone?',
    sub: 'Be brutally honest. This number sets your avatar\'s starting power. Inflating it only hurts you.',
    min: 0, max: 14, step: 0.5, unit: 'hrs',
    insight: (v) => v <= 2 ? 'That\'s disciplined. Your avatar starts powerful.' : v <= 5 ? 'Average range — plenty of room to improve.' : v <= 8 ? 'Above average. Your avatar will feel this.' : 'High impact on focus. Your avatar starts weakened — but that\'s fixable.',
  },
  {
    key: 'worstApp',
    type: 'options',
    Icon: RiAlarmWarningLine,
    label: 'Biggest thief',
    q: 'Which app steals the most of your time?',
    sub: 'This becomes your primary target. Viram will build a specific friction wall around it.',
    opts: [
      { icon: RiSmartphoneLine,  label: 'Instagram / TikTok',      sub: 'Short-form video loops',     val: 'reels'   },
      { icon: RiSmartphoneLine,  label: 'YouTube',                  sub: 'Long-form rabbit holes',     val: 'youtube' },
      { icon: RiSmartphoneLine,  label: 'WhatsApp / Messaging',     sub: 'Chat that never ends',       val: 'chat'    },
      { icon: RiSmartphoneLine,  label: 'Twitter / Reddit',         sub: 'Infinite scroll feeds',      val: 'feed'    },
      { icon: RiSmartphoneLine,  label: 'Games',                    sub: 'Session creep',              val: 'games'   },
      { icon: RiSmartphoneLine,  label: 'I don\'t know / All of them', sub: 'Honest answer',           val: 'all'     },
    ],
  },
  {
    key: 'focusPeak',
    type: 'options',
    Icon: RiTimerFlashLine,
    label: 'Peak focus',
    q: 'When do you feel sharpest?',
    sub: 'Viram will schedule your hardest challenges during this window.',
    opts: [
      { icon: RiMoonLine,        label: 'Early morning (5–8 AM)',   sub: 'Before the world wakes',     val: 'early'   },
      { icon: RiFireLine,        label: 'Morning (8–12 PM)',        sub: 'Classic deep work window',   val: 'morning' },
      { icon: RiTimerFlashLine,  label: 'Afternoon (12–5 PM)',      sub: 'Post-lunch momentum',        val: 'afternoon'},
      { icon: RiMoonLine,        label: 'Evening (5–10 PM)',        sub: 'Night owl territory',        val: 'evening' },
      { icon: RiAlarmWarningLine,label: 'I don\'t have a peak',    sub: 'We\'ll help you build one',  val: 'none'    },
    ],
  },
  {
    key: 'mission',
    type: 'options',
    Icon: RiRocketLine,
    label: 'Mission',
    q: 'What are you actually trying to build?',
    sub: 'This shapes your avatar\'s archetype and which challenges you\'ll face first.',
    opts: [
      { icon: RiBookOpenLine,    label: 'Academic focus',           sub: 'Exams, research, studying',  val: 'study'   },
      { icon: RiBrainLine,       label: 'Deep work / career',       sub: 'Code, writing, creation',    val: 'deepwork'},
      { icon: RiHeartPulseLine,  label: 'Health & fitness',         sub: 'Workouts, sleep, habits',    val: 'health'  },
      { icon: RiSwordLine,       label: 'General discipline',       sub: 'Willpower across the board', val: 'discipline'},
      { icon: RiShieldLine,      label: 'Digital detox',            sub: 'Just get off the phone',     val: 'detox'   },
    ],
  },
  {
    key: 'pastAttempts',
    type: 'options',
    Icon: RiShieldLine,
    label: 'Past attempts',
    q: 'What have you tried before?',
    sub: 'We won\'t suggest the same things that already failed you.',
    opts: [
      { icon: RiAlarmWarningLine, label: 'Screen time limits',      sub: 'You bypassed them',          val: 'limits'  },
      { icon: RiTimerFlashLine,   label: 'Pomodoro / timers',       sub: 'Works until it doesn\'t',    val: 'timers'  },
      { icon: RiBrainLine,        label: 'Willpower alone',         sub: 'Didn\'t stick',              val: 'willpower'},
      { icon: RiSmartphoneLine,   label: 'Other apps',              sub: 'None of them held',          val: 'apps'    },
      { icon: RiCheckLine,        label: 'Nothing yet',             sub: 'First real attempt',         val: 'nothing' },
    ],
  },
  {
    key: 'sleep',
    type: 'range',
    Icon: RiMoonLine,
    label: 'Sleep',
    q: 'How many hours of sleep do you get?',
    sub: 'Sleep is your avatar\'s regeneration stat. Less sleep = slower XP recovery.',
    min: 2, max: 12, step: 0.5, unit: 'hrs',
    insight: (v) => v >= 8 ? 'Optimal. High regeneration rate for your avatar.' : v >= 6 ? 'Acceptable. Slight regeneration penalty.' : v >= 4 ? 'Low. Your avatar will start fatigued.' : 'Critical. Maximum fatigue mode — we\'ll factor this in.',
  },
  {
    key: 'stressLevel',
    type: 'options',
    Icon: RiMentalHealthLine,
    label: 'Stress level',
    q: 'What\'s your honest stress level right now?',
    sub: 'This calibrates your daily challenge intensity. Viram should push you — not break you.',
    opts: [
      { icon: RiCheckLine,        label: 'Pretty calm',             sub: 'Life feels manageable',      val: 0 },
      { icon: RiFireLine,         label: 'Moderate pressure',       sub: 'Juggling things',            val: 1 },
      { icon: RiAlarmWarningLine, label: 'High stress',             sub: 'Running on edge',            val: 2 },
      { icon: RiBrainLine,        label: 'Burning out',             sub: 'Needs immediate attention',  val: 3 },
    ],
  },
  {
    key: 'avatarName',
    type: 'text',
    Icon: RiSwordLine,
    label: 'Avatar name',
    q: 'What will you name your avatar?',
    sub: 'This is who you\'re becoming. Choose something that means something to you.',
    placeholder: 'e.g. Shadow, Monk, Nova, Stoic…',
    maxLength: 20,
  },
]

/* ── Stat calculator ──────────────────────────────────────────────────────── */
function calcStats(profile) {
  const st  = profile.screenTime  ?? 4
  const sl  = profile.sleep       ?? 7
  const str = profile.stressLevel ?? 1
  return {
    hp:        Math.max(15, Math.min(100, Math.round(100 - st * 5  - str * 6  + (sl - 5) * 3))),
    energy:    Math.max(15, Math.min(100, Math.round(100 - st * 4  - str * 5  + (sl - 5) * 4))),
    discipline:Math.max(20, Math.min(100, Math.round(100 - st * 6  - str * 4))),
    focus:     Math.max(20, Math.min(100, Math.round(100 - st * 7  - str * 3  + (sl - 5) * 2))),
    shieldHP:  Math.max(10, Math.min(100, Math.round(100 - st * 8))),
    coins:     Math.max(1,  Math.round(10 - st * 0.7)),
  }
}

/* ── StatBar mini ─────────────────────────────────────────────────────────── */
function StatBar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between mb-[4px]">
        <span className="text-[10px] text-[#555555] font-dm-sans uppercase tracking-[0.1em]">{label}</span>
        <span className="text-[10px] text-[#888888] font-syne font-black">{value}</span>
      </div>
      <div className="h-[2px] rounded-full bg-[#1a1a1a] overflow-hidden">
        <div className="h-full rounded-full bg-white/80 transition-all duration-[1000ms] ease-out"
          style={{ width: `${value}%` }}/>
      </div>
    </div>
  )
}

/* ── Option card ─────────────────────────────────────────────────────────── */
function OptionCard({ opt, selected, onClick, multi }) {
  const Icon = opt.icon
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-4 w-full px-4 py-[14px] rounded-[14px] border text-left transition-all duration-150 ${
        selected
          ? 'border-white bg-white/[0.06]'
          : 'border-[#1a1a1a] bg-white/[0.02] hover:border-[#2e2e2e] hover:bg-white/[0.04]'
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border transition-colors duration-150 ${
        selected ? 'border-[#555555] bg-white/[0.08]' : 'border-[#1a1a1a]'
      }`}>
        <Icon size={15} className={selected ? 'text-white' : 'text-[#444444]'}/>
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-[13px] font-bold font-dm-sans ${selected ? 'text-white' : 'text-[#888888]'}`}>
          {opt.label}
        </div>
        {opt.sub && (
          <div className="text-[11px] text-[#333333] font-dm-sans mt-[1px]">{opt.sub}</div>
        )}
      </div>
      {multi && (
        <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all ${
          selected ? 'bg-white border-white' : 'border-[#2a2a2a]'
        }`}>
          {selected && <RiCheckLine size={10} className="text-black"/>}
        </div>
      )}
      {!multi && (
        <div className={`w-4 h-4 rounded-full border transition-all flex-shrink-0 ${
          selected ? 'border-white bg-white' : 'border-[#2a2a2a]'
        }`}>
          {selected && <div className="w-full h-full rounded-full bg-black scale-50"/>}
        </div>
      )}
    </button>
  )
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function Questions() {
  const navigate  = useNavigate()
  const [step,    setStep]    = useState(0)
  const [profile, setProfile] = useState({
    screenTime: 4, sleep: 7, stressLevel: 1, avatarName: '',
  })
  const [direction, setDirection] = useState(1)   // 1 = forward, -1 = backward

  const cur       = STEPS[step]
  const progress  = ((step) / STEPS.length) * 100
  const isLast    = step === STEPS.length - 1

  /* value helpers */
  const val      = profile[cur.key]
  const setVal   = (v) => setProfile(p => ({ ...p, [cur.key]: v }))
  const hasValue = () => {
    if (cur.type === 'range') return true
    if (cur.type === 'text')  return (val ?? '').trim().length > 0
    return val !== undefined && val !== null && val !== ''
  }

  function goNext() {
    if (!hasValue()) return
    if (isLast) {
      const stats = calcStats(profile)
      localStorage.setItem('viram_profile', JSON.stringify({ ...profile, ...stats }))
      navigate('/dashboard')
      return
    }
    setDirection(1)
    setStep(s => s + 1)
  }

  function goBack() {
    if (step === 0) { navigate('/start'); return }
    setDirection(-1)
    setStep(s => s - 1)
  }

  const slideVariants = {
    enter:  (d) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit:   (d) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
  }

  const stats = calcStats(profile)

  return (
    <>
      <style>{STYLES}</style>

      <div className="min-h-screen bg-black flex flex-col overflow-hidden">

        {/* ── Top bar ─────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 flex items-center gap-4 px-5 py-4 border-b border-[#111111]">
          <button onClick={goBack}
            className="w-9 h-9 rounded-full border border-[#1a1a1a] flex items-center justify-center text-[#555555] hover:text-white hover:border-[#333333] transition-all duration-200 flex-shrink-0"
          >
            <RiArrowLeftLine size={15}/>
          </button>

          {/* progress pills */}
          <div className="flex gap-[5px] flex-1">
            {STEPS.map((_, i) => (
              <div key={i}
                className={`h-[3px] rounded-full transition-all duration-500 ${
                  i < step  ? 'bg-white flex-1' :
                  i === step ? 'bg-white/60 flex-[2]' :
                               'bg-[#1a1a1a] flex-1'
                }`}
              />
            ))}
          </div>

          <div className="text-[11px] text-[#333333] font-dm-sans font-bold tracking-[0.08em] flex-shrink-0">
            {step + 1} / {STEPS.length}
          </div>
        </div>

        {/* ── Main area ───────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

          {/* Left: question */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col max-w-[580px] w-full mx-auto px-6 py-10 flex-1"
              >
                {/* step label */}
                <div className="inline-flex items-center gap-2 mb-6 self-start">
                  <div className="w-8 h-8 rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-center">
                    <cur.Icon size={15} className="text-[#666666]"/>
                  </div>
                  <span className="text-[10px] text-[#444444] font-dm-sans uppercase tracking-[0.16em] font-bold">
                    {cur.label}
                  </span>
                </div>

                {/* question */}
                <h2 className="font-syne font-black text-white leading-[1.1] tracking-[-0.03em] mb-3"
                  style={{ fontSize: 'clamp(22px, 4vw, 32px)' }}>
                  {cur.q}
                </h2>
                <p className="text-[14px] text-[#555555] font-dm-sans leading-[1.75] mb-8">
                  {cur.sub}
                </p>

                {/* ── Range ── */}
                {cur.type === 'range' && (
                  <div className="mb-8">
                    <div className="text-center mb-6">
                      <span className="font-syne font-black text-white"
                        style={{ fontSize: 'clamp(52px, 10vw, 72px)', lineHeight: 1, letterSpacing: '-0.04em' }}>
                        {val}
                      </span>
                      <span className="font-syne font-black text-[#333333] text-2xl ml-2">{cur.unit}</span>
                    </div>
                    <input type="range"
                      min={cur.min} max={cur.max} step={cur.step}
                      value={val ?? cur.min}
                      onChange={e => setVal(parseFloat(e.target.value))}
                      className="w-full mb-3"
                    />
                    <div className="flex justify-between text-[11px] text-[#333333] font-dm-sans">
                      <span>{cur.min}{cur.unit}</span>
                      <span>{cur.max}{cur.unit}</span>
                    </div>
                    {/* live insight */}
                    {cur.insight && (
                      <div className="mt-5 px-4 py-3 rounded-[12px] border border-[#1a1a1a] bg-white/[0.02]">
                        <p className="text-[12px] text-[#666666] font-dm-sans leading-[1.65] italic">
                          {cur.insight(val ?? cur.min)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Options ── */}
                {cur.type === 'options' && (
                  <div className="flex flex-col gap-[8px] mb-8">
                    {cur.opts.map(opt => (
                      <OptionCard
                        key={opt.val}
                        opt={opt}
                        selected={val === opt.val}
                        onClick={() => setVal(opt.val)}
                        multi={false}
                      />
                    ))}
                  </div>
                )}

                {/* ── Text ── */}
                {cur.type === 'text' && (
                  <div className="mb-8">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={cur.placeholder}
                        value={val ?? ''}
                        onChange={e => setVal(e.target.value)}
                        maxLength={cur.maxLength}
                        className="w-full bg-white/[0.03] border border-[#1a1a1a] rounded-[14px] px-5 py-4 text-white font-syne font-black text-xl outline-none focus:border-[#444444] transition-colors placeholder:text-[#222222]"
                        style={{ letterSpacing: '-0.02em' }}
                        autoFocus
                      />
                      <div className="absolute right-4 bottom-4 text-[11px] text-[#222222] font-dm-sans">
                        {(val ?? '').length}/{cur.maxLength}
                      </div>
                    </div>
                    <p className="mt-3 text-[12px] text-[#333333] font-dm-sans italic">
                      This name will appear above your avatar on your dashboard.
                    </p>
                  </div>
                )}

                {/* Continue button */}
                <button
                  onClick={goNext}
                  disabled={!hasValue()}
                  className={`mt-auto py-[15px] rounded-full text-sm font-black font-dm-sans flex items-center justify-center gap-2 transition-all duration-200 ${
                    hasValue()
                      ? 'bg-white text-black hover:bg-[#e8e8e8] hover:-translate-y-[2px] hover:shadow-[0_10px_32px_rgba(255,255,255,0.15)]'
                      : 'bg-white/[0.05] text-[#333333] cursor-not-allowed'
                  }`}
                >
                  {isLast ? (
                    <><RiRocketLine size={15}/> Forge My Avatar</>
                  ) : (
                    <>Continue <RiArrowRightLine size={14}/></>
                  )}
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Right: live avatar preview panel (desktop) ─────────────── */}
          <div className="hidden lg:flex w-[340px] flex-shrink-0 border-l border-[#0f0f0f] flex-col">
            <div className="p-8 flex flex-col gap-6 sticky top-0">

              {/* Label */}
              <div className="flex items-center gap-2">
                <span className="w-[6px] h-[6px] rounded-full bg-white"
                  style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}/>
                <span className="text-[10px] text-[#333333] font-dm-sans uppercase tracking-[0.16em] font-bold">
                  Live Avatar Preview
                </span>
              </div>

              {/* Avatar card */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-[20px] p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"/>

                {/* Avatar circle */}
                <div className="relative mb-5 mx-auto w-fit">
                  <svg className="absolute -inset-[8px] w-[calc(100%+16px)] h-[calc(100%+16px)]"
                    style={{ animation: 'spin-slow 14s linear infinite' }} viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="44" fill="none"
                      stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 6"/>
                  </svg>
                  <div className="w-[80px] h-[80px] rounded-full bg-[#111] border border-[#2a2a2a] flex items-center justify-center"
                    style={{ animation: 'float 4s ease-in-out infinite' }}>
                    <span className="font-syne font-black text-white text-[22px] select-none">
                      {(profile.avatarName || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Name + level */}
                <div className="text-center mb-5">
                  <div className="font-syne font-black text-white text-base leading-tight">
                    {profile.avatarName || 'Unnamed'}
                  </div>
                  <div className="text-[11px] text-[#444444] font-dm-sans mt-[2px]">
                    Level 1 · Awakening
                  </div>
                </div>

                {/* Stat bars */}
                <div className="flex flex-col gap-[10px]">
                  <StatBar label="Vitality"   value={stats.hp}/>
                  <StatBar label="Focus"      value={stats.focus}/>
                  <StatBar label="Discipline" value={stats.discipline}/>
                  <StatBar label="Energy"     value={stats.energy}/>
                </div>

                {/* mini metric pills */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {[
                    { label: 'Shield HP', val: `${stats.shieldHP}%` },
                    { label: 'Start coins', val: `${stats.coins}` },
                  ].map(({ label, val }) => (
                    <div key={label} className="px-3 py-2 rounded-[10px] bg-white/[0.03] border border-[#1a1a1a]">
                      <div className="text-[9px] text-[#333333] font-dm-sans uppercase tracking-[0.1em] mb-[2px]">{label}</div>
                      <div className="font-syne font-black text-white text-sm">{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insight based on current step */}
              <div className="px-4 py-3 rounded-[12px] border border-[#111] bg-white/[0.015]">
                <div className="text-[10px] text-[#333333] font-dm-sans uppercase tracking-[0.12em] font-bold mb-1">
                  Impact
                </div>
                <p className="text-[12px] text-[#444444] font-dm-sans leading-[1.65]">
                  {stats.hp > 75
                    ? 'Strong foundation. Your avatar starts in peak condition.'
                    : stats.hp > 50
                    ? 'Moderate baseline. Consistent sessions will raise this fast.'
                    : stats.hp > 30
                    ? 'Your habits are showing. The avatar reflects real cost — that\'s the point.'
                    : 'This is honest data. Your avatar starts wounded. It can only go up from here.'}
                </p>
              </div>

              {/* progress fraction */}
              <div className="flex items-center justify-between text-[11px] text-[#222222] font-dm-sans">
                <span>{step + 1} of {STEPS.length} questions</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="h-[2px] rounded-full bg-[#111] overflow-hidden">
                <div className="h-full rounded-full bg-white/50 transition-all duration-500"
                  style={{ width: `${progress}%` }}/>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}