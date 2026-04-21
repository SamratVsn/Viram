import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RiGamepadLine, RiRocketLine, RiPlayCircleLine,
  RiUserHeartLine, RiTimerFlashLine, RiShieldKeyholeLine,
  RiPuzzleLine, RiBookOpenLine, RiYoutubeLine,
  RiErrorWarningLine, RiArrowRightLine, RiSparkling2Line,
  RiChatQuoteLine, RiFireFill, RiStarFill,
  RiUser3Line, RiSmartphoneLine, RiPlayFill,
  RiTwitterXLine, RiInstagramLine, RiDiscordLine,
} from 'react-icons/ri'
import NavBar from '../components/NavBar'

// ── animation helper ─────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] },
})

// ── data ─────────────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  'FOCUS', 'DISCIPLINE', 'CLARITY', 'GROWTH', 'EVOLVE', 'DEEP WORK',
  'MOMENTUM', 'IDENTITY', 'FLOW STATE', 'WILLPOWER', 'PRESENCE', 'PURPOSE', 'MASTERY', 'SILENCE',
]

const FEATURES = [
  { Icon: RiUserHeartLine,     title: 'Living Avatar',        body: "Your habits manifest in your character's stats in real time. Watch yourself grow — or wither.",                      large: true },
  { Icon: RiTimerFlashLine,    title: 'Pomodoro Engine',      body: 'Deep work challenges with XP rewards. Complete without breaking = massive combo multiplier.'                              },
  { Icon: RiShieldKeyholeLine, title: 'Friction Accounting',  body: 'Log doomscrolling honestly. Make the invisible cost of distraction visible in your avatar stats.'                        },
  { Icon: RiPuzzleLine,        title: 'Mental Reset Puzzles', body: '90-second brain games to break the scroll loop and re-engage your prefrontal cortex.'                                    },
  { Icon: RiBookOpenLine,      title: 'Mind Library',         body: 'Distilled lessons from Atomic Habits, Deep Work, Digital Minimalism — actionable, never just quotes.'                    },
  { Icon: RiYoutubeLine,       title: 'Curated Resources',    body: 'Handpicked focus playlists and productivity content. Zero doomscrolling required.'                                       },
]

const PLAYLISTS = [
  { channel: 'Andrew Huberman Lab', title: 'Dopamine & Motivation — Master Your Focus',     meta: '2h 14m',        url: 'https://www.youtube.com/results?search_query=andrew+huberman+dopamine+focus' },
  { channel: 'Andrew Huberman Lab', title: 'The Science of Setting & Achieving Goals',       meta: 'Science-backed', url: 'https://www.youtube.com/results?search_query=huberman+lab+goals+focus+science' },
  { channel: 'Cal Newport',         title: 'Deep Work Philosophy — Study With Me',           meta: 'Knowledge',      url: 'https://www.youtube.com/results?search_query=deep+work+productivity+cal+newport' },
  { channel: 'Cal Newport',         title: 'Digital Minimalism — Quit Social Media',         meta: 'High Impact',    url: 'https://www.youtube.com/results?search_query=cal+newport+quit+social+media' },
  { channel: 'James Clear',         title: 'Atomic Habits — Build Systems That Stick',       meta: 'Bestseller',     url: 'https://www.youtube.com/results?search_query=atomic+habits+james+clear' },
  { channel: 'Marcus Aurelius',     title: 'Meditations — Stoic Wisdom for Modern Life',     meta: 'Timeless',       url: 'https://www.youtube.com/results?search_query=marcus+aurelius+meditations' },
  { channel: 'Daily Stoic',         title: 'Marcus Aurelius — Self Discipline & Resilience', meta: 'Stoicism',       url: 'https://www.youtube.com/results?search_query=marcus+aurelius+daily+stoic' },
  { channel: 'Magnetic Minds',      title: 'Binaural Beats — Alpha Waves for Focus',         meta: 'Neuroscience',   url: 'https://www.youtube.com/results?search_query=binaural+beats+focus' },
  { channel: 'Digital Wellness',    title: 'Break the Scroll — Reclaim Your Attention',      meta: 'Mental Health',  url: 'https://www.youtube.com/results?search_query=digital+minimalism+screen+time' },
]

const TESTIMONIALS = [
  { quote: "I went from 6 hours of phone time to 90 minutes in two weeks. The avatar system made me viscerally uncomfortable watching my character's energy drain.", name: 'Arjun K.',  role: 'Software Engineer, 23', initials: 'A' },
  { quote: "I wrote my entire thesis during my Viram streak. The Pomodoro challenge became a genuine obsession — in the best possible way.",                          name: 'Priya S.',  role: 'PhD Student, 26',       initials: 'P' },
  { quote: "The Mind Library alone changed how I approach every morning. Atomic Habits as actionable lessons rather than motivational fluff.",                        name: 'Marcus T.', role: 'Entrepreneur, 31',       initials: 'M' },
  { quote: "Three months in, my screen time is down 62%. My output at work has doubled. I stopped blaming myself and started building systems.",                      name: 'Layla R.',  role: 'Product Designer, 27',  initials: 'L' },
  { quote: "The Stoic library content paired with the avatar mechanics clicked something in my brain. I now see every scroll as a vote I'm casting against myself.",  name: 'Dev M.',    role: 'Medical Student, 24',   initials: 'D' },
  { quote: "I've tried 11 productivity apps. Viram is the only one I kept using after week 2. The gamification isn't gimmicky — it actually works on your brain.",   name: 'Sarah K.',  role: 'Startup Founder, 29',   initials: 'S' },
]

const STATS = [
  { num: '2.4h', label: 'Daily screen time saved'        },
  { num: '87%',  label: 'Higher focus in 1 week'         },
  { num: '23×',  label: 'More engaging than trackers'     },
]

const PROB_STATS = [
  { num: '4.8h',   label: 'Average daily screen time'                         },
  { num: '$4.2B',  label: 'Spent annually to capture your attention'          },
  { num: '73%',    label: 'Teens report feeling addicted to social media'      },
  { num: '23 min', label: 'To regain focus after a single notification'        },
]

// ── keyframes (animations that can't live in Tailwind alone) ─────────────────
const KEYFRAMES = `
  @keyframes marquee       { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes marquee-testi { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes pulse-dot     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.7)} }
  @keyframes spin-slow     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes float-avatar  { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
  @keyframes scanline      { 0%{top:-10%} 100%{top:110%} }
  .testi-card:hover { filter: grayscale(1) brightness(1.25); }
`

// ── Tag badge shared component ────────────────────────────────────────────────
function Tag({ children, center = false }) {
  return (
    <div className={`inline-flex items-center gap-[7px] text-[10px] tracking-[0.2em] uppercase font-bold font-dm-sans text-[#cccccc] px-[14px] py-[5px] rounded-full border border-[#2a2a2a] bg-white/[0.03] mb-[22px] ${center ? 'mx-auto' : ''}`}>
      {children}
    </div>
  )
}

// ── StatBar ───────────────────────────────────────────────────────────────────
function StatBar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between mb-[5px]">
        <span className="text-[10px] text-[#555555] font-dm-sans tracking-[0.1em] uppercase font-medium">{label}</span>
        <span className="text-[10px] text-[#cccccc] font-syne font-black">{value}</span>
      </div>
      <div className="h-[3px] rounded-full bg-[#1a1a1a] overflow-hidden">
        <div
          className="h-full rounded-full bg-white opacity-90 transition-[width] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

// ── AvatarCard ────────────────────────────────────────────────────────────────
function AvatarCard({ avatarStats, heroOffset }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0, transition: { delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] } }}
      className="relative z-[2]"
      style={{
        transform: `translate(${heroOffset.x * 0.35}px, ${heroOffset.y * 0.35}px)`,
        transition: 'transform 0.12s ease-out',
      }}
    >
      {/* Card body */}
      <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-[28px] p-8 relative overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)]">

        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[28px]">
          <div
            className="absolute left-0 right-0 h-[30%] bg-gradient-to-b from-transparent via-white/[0.02] to-transparent"
            style={{ animation: 'scanline 4s linear infinite' }}
          />
        </div>

        {/* Line texture */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[28px] opacity-[0.025]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 19px,#fff 20px)' }}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[10px] tracking-[0.18em] text-[#555555] uppercase font-dm-sans mb-[3px]">Active Avatar</div>
            <div className="font-syne text-base font-black text-white">The Focused Mind</div>
          </div>
          <div className="flex items-center gap-[6px] px-3 py-[5px] rounded-full bg-white/5 border border-[#2a2a2a]">
            <span className="w-[6px] h-[6px] rounded-full bg-white inline-block" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
            <span className="text-[10px] text-[#cccccc] font-bold font-dm-sans tracking-[0.12em]">LIVE</span>
          </div>
        </div>

        {/* Avatar circle */}
        <div className="relative mb-7">
          <div
            className="w-28 h-28 rounded-full bg-[#1a1a1a] border border-[#3a3a3a] mx-auto flex items-center justify-center relative"
            style={{ animation: 'float-avatar 4s ease-in-out infinite' }}
          >
            <RiUser3Line size={46} className="text-[#cccccc]" />
            <svg
              className="absolute -inset-[7px] w-[calc(100%+14px)] h-[calc(100%+14px)]"
              style={{ animation: 'spin-slow 12s linear infinite' }}
              viewBox="0 0 126 126"
            >
              <circle cx="63" cy="63" r="59" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 7" />
            </svg>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white px-[14px] py-1 rounded-full text-[10px] font-black text-black font-syne tracking-[0.08em] whitespace-nowrap">
            LV 14 · DISCIPLINE MONK
          </div>
        </div>

        {/* Stat bars */}
        <div className="flex flex-col gap-3 mb-[22px]">
          <StatBar label="Focus"      value={avatarStats.focus} />
          <StatBar label="Discipline" value={avatarStats.discipline} />
          <StatBar label="Clarity"    value={avatarStats.clarity} />
        </div>

        {/* Mini cards */}
        <div className="grid grid-cols-2 gap-[10px]">
          {[
            { Icon: RiFireFill,       label: 'Streak', val: '12 days' },
            { Icon: RiTimerFlashLine, label: 'Today',  val: '3h 40m'  },
          ].map(({ Icon, label, val }) => (
            <div key={label} className="p-[10px_12px] rounded-xl bg-white/[0.03] border border-[#1a1a1a]">
              <div className="flex items-center gap-[5px] mb-1">
                <Icon size={11} className="text-[#cccccc]" />
                <span className="text-[10px] text-[#555555] font-dm-sans uppercase tracking-[0.1em]">{label}</span>
              </div>
              <div className="font-syne font-black text-sm text-white">{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating XP pill */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
        className="absolute -top-[14px] -right-[14px] bg-white px-4 py-2 rounded-full text-xs font-black text-black font-syne shadow-[0_8px_24px_rgba(255,255,255,0.12)] whitespace-nowrap"
      >
        +240 XP
      </motion.div>

      {/* Floating alert pill */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.75 } }}
        className="absolute -bottom-[14px] -left-[14px] bg-[#0a0a0a] border border-[#2a2a2a] px-[14px] py-2 rounded-full text-[11px] font-semibold text-[#cccccc] font-dm-sans shadow-[0_8px_24px_rgba(0,0,0,0.5)] flex items-center gap-[6px] whitespace-nowrap"
      >
        <RiSmartphoneLine size={13} /> 47 min saved today
      </motion.div>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function LandingPage({ onStart, onDemo, onLibrary, onProblem }) {
  const parallaxRef = useRef({ x: 0, y: 0 })
  const [heroOffset, setHeroOffset]   = useState({ x: 0, y: 0 })
  const [avatarStats, setAvatarStats] = useState({ focus: 72, discipline: 58, clarity: 84 })

  // Mouse parallax
  useEffect(() => {
    const onMove = (e) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      parallaxRef.current = {
        x: ((e.clientX - cx) / cx) * 18,
        y: ((e.clientY - cy) / cy) * 10,
      }
    }
    let raf
    const animate = () => {
      setHeroOffset(prev => ({
        x: prev.x + (parallaxRef.current.x - prev.x) * 0.06,
        y: prev.y + (parallaxRef.current.y - prev.y) * 0.06,
      }))
      raf = requestAnimationFrame(animate)
    }
    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(animate)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  // Avatar stat ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setAvatarStats({
        focus:      68 + Math.floor(Math.random() * 14),
        discipline: 55 + Math.floor(Math.random() * 18),
        clarity:    80 + Math.floor(Math.random() * 12),
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <NavBar />
    <div id="s-land" className="relative z-10 overflow-y-auto overflow-x-hidden pt-[70px] bg-black">
      <style>{KEYFRAMES}</style>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="min-h-screen grid grid-cols-1 md:grid-cols-2 items-center px-[5vw] py-[60px] relative overflow-hidden gap-[60px]">

        {/* BG grid + glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div
            className="absolute top-[10%] right-[20%] w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 65%)',
              filter: 'blur(40px)',
              transform: `translate(${heroOffset.x * 0.4}px, ${heroOffset.y * 0.4}px)`,
            }}
          />
        </div>

        {/* Left: copy */}
        <div className="relative z-[2]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Tag>
              <RiGamepadLine size={11} /> Productivity Reimagined
            </Tag>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.08 } }}
            className="font-syne font-black leading-[0.96] tracking-[-0.04em] mb-6 text-white"
            style={{
              fontSize: 'clamp(48px, 6.5vw, 82px)',
              transform: `translate(${heroOffset.x * 0.2}px, ${heroOffset.y * 0.2}px)`,
              transition: 'transform 0.12s ease-out',
            }}
          >
            Turn Your <br />Goals<br /><span className="text-[#888888]">Into  <br />a MileStone <br /></span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.16 } }}
            className="text-[15px] text-[#888888] leading-[1.85] mb-9 max-w-[400px] font-dm-sans"
          >
            Your dopamine hijacked by social media. Your attention sold to advertisers.
            Viram takes it back — and makes discipline feel{' '}
            <em className="text-[#e8e8e8] italic">electric.</em>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.22 } }}
            className="flex gap-[10px] flex-wrap mb-[52px]"
          >
            <button
              onClick={onStart}
              className="px-7 py-[13px] rounded-full bg-white text-black border-none text-sm font-bold cursor-pointer font-dm-sans flex items-center gap-[7px] transition-all duration-200 hover:-translate-y-[2px] hover:bg-[#e8e8e8] hover:shadow-[0_10px_32px_rgba(255,255,255,0.15)]"
            >
              <RiRocketLine size={15} /> Start Your Journey
            </button>
            <button
              onClick={onDemo}
              className="px-7 py-[13px] rounded-full bg-white/[0.04] text-[#e8e8e8] border border-[#2a2a2a] text-sm font-semibold cursor-pointer font-dm-sans flex items-center gap-[7px] transition-all duration-200 hover:border-[#555555] hover:bg-white/[0.08]"
            >
              <RiPlayCircleLine size={15} /> Preview Dashboard
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
            className="flex border-t border-[#1a1a1a] pt-7 flex-wrap gap-y-4"
          >
            {STATS.map(({ num, label }, i) => (
              <div
                key={label}
                className={`flex-1 min-w-[80px] ${i > 0 ? 'pl-6' : ''} ${i < STATS.length - 1 ? 'pr-6 border-r border-[#1a1a1a]' : ''}`}
              >
                <div className="font-syne text-[28px] font-black text-white tracking-[-0.03em]">{num}</div>
                <div className="text-[11px] text-[#3a3a3a] mt-1 font-dm-sans leading-[1.4]">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: avatar card */}
        <AvatarCard avatarStats={avatarStats} heroOffset={heroOffset} />
      </section>

      {/* ── MARQUEE ───────────────────────────────────────────────────────── */}
      <div className="border-t border-[#1a1a1a] border-b relative overflow-hidden bg-white/[0.01]">
        <div className="absolute left-0 top-0 bottom-0 w-[100px] bg-gradient-to-r from-black to-transparent z-[2]" />
        <div className="absolute right-0 top-0 bottom-0 w-[100px] bg-gradient-to-l from-black to-transparent z-[2]" />
        <div className="py-[14px] overflow-hidden">
          <div
            className="inline-flex whitespace-nowrap"
            style={{ animation: 'marquee 32s linear infinite' }}
          >
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-3 px-[22px]">
                <span className="font-syne text-[10px] font-black tracking-[0.24em] uppercase text-[#3a3a3a]">{item}</span>
                <span className="w-[3px] h-[3px] rounded-full bg-[#2a2a2a] flex-shrink-0" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── THE PROBLEM ───────────────────────────────────────────────────── */}
      <section className="px-[5vw] py-[100px] border-t border-[#1a1a1a]" id="problem">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[80px] items-center">
          <div>
            <motion.div {...fadeUp(0)}>
              <Tag><RiErrorWarningLine size={11} /> The Problem</Tag>
            </motion.div>
            <motion.h2
              {...fadeUp(0.06)}
              className="font-syne font-black leading-[1.0] tracking-[-0.04em] text-white mb-6"
              style={{ fontSize: 'clamp(36px,5vw,62px)' }}
            >
              You're not<br />lazy. You're<br /><span className="text-[#888888]">engineered</span><br />to scroll.
            </motion.h2>
            <motion.p {...fadeUp(0.12)} className="text-[15px] text-[#888888] leading-[1.85] font-dm-sans mb-6">
              Billion-dollar teams optimize every pixel of TikTok, Instagram, and YouTube to
              hijack your dopamine system. Your willpower was never the enemy — the incentive
              mismatch was.
            </motion.p>
            <motion.button
              {...fadeUp(0.18)}
              onClick={onProblem}
              className="inline-flex items-center gap-[6px] text-[13px] text-[#cccccc] bg-transparent border border-[#2a2a2a] rounded-full px-[18px] py-2 cursor-pointer font-dm-sans font-semibold transition-all duration-200 hover:bg-white/[0.06] hover:border-[#555555]"
            >
              Read the full manifesto <RiArrowRightLine size={14} />
            </motion.button>
          </div>

          <div className="flex flex-col gap-[2px]">
            {PROB_STATS.map(({ num, label }, i) => (
              <motion.div
                key={label}
                {...fadeUp(i * 0.08)}
                className="px-6 py-5 rounded-[14px] border border-[#1a1a1a] bg-white/[0.02] flex items-center gap-5 cursor-default transition-all duration-200 hover:bg-white/[0.04] hover:border-[#3a3a3a]"
              >
                <div className="font-syne font-black text-[32px] text-white tracking-[-0.03em] min-w-[110px] flex-shrink-0">{num}</div>
                <div className="text-[13px] text-[#888888] leading-[1.5] font-dm-sans">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="px-[5vw] py-[100px] border-t border-[#1a1a1a]" id="features">
        <div className="max-w-[1100px] mx-auto">
          <motion.div {...fadeUp(0)}>
            <Tag><RiSparkling2Line size={11} /> How It Works</Tag>
          </motion.div>
          <motion.h2
            {...fadeUp(0.06)}
            className="font-syne font-black leading-[1.05] tracking-[-0.04em] text-white mb-14"
            style={{ fontSize: 'clamp(28px,4.5vw,52px)' }}
          >
            Everything designed to<br />rewire your reward system.
          </motion.h2>

          {/* Bento grid — large card spans 2 rows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px]">
            {/* Large hero feature */}
            <motion.div
              {...fadeUp(0)}
              className="md:row-span-2 p-8 rounded-[22px] border border-[#2a2a2a] bg-gradient-to-br from-[#0a0a0a] to-black flex flex-col justify-between min-h-[300px] cursor-default transition-all duration-[250ms] hover:border-[#555555] hover:-translate-y-1"
            >
              <div>
                <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center mb-[22px] border border-[#2a2a2a] bg-white/[0.04]">
                  <RiUserHeartLine size={24} className="text-[#cccccc]" />
                </div>
                <div className="font-syne text-xl font-black mb-3 text-white">Living Avatar</div>
                <div className="text-sm text-[#888888] leading-[1.75] font-dm-sans">
                  Your habits manifest in your character's stats in real time. Every deep work
                  session fuels your avatar. Every scroll drains it. Watch yourself grow — or wither.
                </div>
              </div>
              <div className="mt-7 px-[18px] py-[14px] rounded-[14px] bg-white/[0.03] border border-[#1a1a1a]">
                <div className="text-[10px] text-[#aaaaaa] uppercase tracking-[0.14em] font-bold mb-[6px] font-dm-sans">Your stats right now</div>
                <div className="font-syne font-black text-[28px] text-white">LV 14</div>
                <div className="text-[11px] text-[#555555] font-dm-sans">Discipline Monk · 2,340 XP</div>
              </div>
            </motion.div>

            {/* Regular feature cards */}
            {FEATURES.slice(1).map(({ Icon, title, body }, i) => (
              <motion.div
                key={title}
                {...fadeUp((i + 1) * 0.06)}
                className="p-6 rounded-[18px] border border-[#1a1a1a] bg-[#0a0a0a] cursor-default transition-all duration-[250ms] hover:border-[#3a3a3a] hover:-translate-y-[3px]"
              >
                <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center mb-4 border border-[#2a2a2a] bg-white/[0.04]">
                  <Icon size={19} className="text-[#cccccc]" />
                </div>
                <div className="font-syne text-sm font-black mb-[7px] text-white">{title}</div>
                <div className="text-xs text-[#555555] leading-[1.65] font-dm-sans">{body}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESOURCES ─────────────────────────────────────────────────────── */}
      {/*   UI from doc 3: centered heading + Instrument Serif italic + 3-col grid */}
      <section className="px-[5vw] py-[100px] border-t border-[#1a1a1a]" id="resources">
        <div className="max-w-[1100px] mx-auto">

          {/* Centered heading block — from doc 3's layout */}
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <div className="inline-flex items-center gap-[7px] text-[11px] tracking-[0.22em] text-[#cccccc] uppercase font-bold mb-7 font-dm-sans">
              <RiYoutubeLine size={11} /> Resources
            </div>
            <h2
              className="font-syne font-black text-white leading-[0.88] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(38px, 8.5vw, 70px)' }}
            >
              Providing<br />resources that<br />actually
              <span
                className="block italic text-[#888888] leading-[1.25]"
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 'clamp(28px, 6vw, 56px)',
                }}
              >
                move the needle.
              </span>
            </h2>
            <p
              className="max-w-[620px] mx-auto mt-7 leading-[1.7] text-[#aaaaaa] italic"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 'clamp(15px, 1.3vw, 18px)' }}
            >
              Not dopamine junk — but{' '}
              <strong className="not-italic text-white underline" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                curated knowledge
              </strong>{' '}
              that builds you. Every playlist below has been selected for its ability to deepen
              focus, rewire habits, or accelerate real growth.
            </p>
          </motion.div>

          {/* 3-column playlist grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
            {PLAYLISTS.map((pl, i) => (
              <motion.div
                key={pl.title}
                {...fadeUp(i * 0.04)}
                onClick={() => window.open(pl.url, '_blank')}
                className="rounded-[20px] border border-[#1a1a1a] bg-[#0a0a0a] overflow-hidden cursor-pointer transition-all duration-[250ms] hover:border-[#555555] hover:-translate-y-1"
              >
                {/* Thumbnail — BNW gradient */}
                <div className="aspect-video relative overflow-hidden bg-[#0d0d0d]">
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, #0d0d0d 0%, #1c1c1c 50%, #0a0a0a 100%)` }}
                  />
                  {/* Subtle grid texture on thumbnail */}
                  <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 11px,#fff 12px),repeating-linear-gradient(90deg,transparent,transparent 11px,#fff 12px)' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[52px] h-[52px] rounded-full bg-white/90 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                      <RiPlayFill size={22} className="text-black ml-[3px]" />
                    </div>
                  </div>
                  <div className="absolute top-[10px] right-[10px] bg-black/80 border border-[#2a2a2a] rounded-[6px] px-2 py-[3px] flex items-center gap-[5px] text-[10px] font-bold text-[#cccccc] font-dm-sans">
                    <RiYoutubeLine size={10} /> YT
                  </div>
                </div>

                {/* Card body */}
                <div className="p-[14px_16px_16px] border-t border-[#1a1a1a]">
                  <div className="text-[9px] text-[#aaaaaa] uppercase tracking-[0.16em] font-black mb-[5px] font-dm-sans">{pl.channel}</div>
                  <div className="text-sm font-bold mb-[6px] leading-[1.35] text-white font-syne">{pl.title}</div>
                  <div className="text-[10px] text-[#555555] font-dm-sans">{pl.meta}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      {/*   Grayscale hover effect from doc 3 */}
      <section className="py-[100px] overflow-hidden border-t border-[#1a1a1a]">
        <div className="text-center mb-14 px-[5vw]">
          <motion.div {...fadeUp(0)} className="flex justify-center">
            <Tag center><RiChatQuoteLine size={11} /> Results</Tag>
          </motion.div>
          <motion.h2
            {...fadeUp(0.06)}
            className="font-syne font-black leading-[1.05] tracking-[-0.04em] text-white"
            style={{ fontSize: 'clamp(26px,4vw,48px)' }}
          >
            People who chose<br />the harder path.
          </motion.h2>
        </div>

        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-[100px] bg-gradient-to-r from-black to-transparent z-[2] pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-[100px] bg-gradient-to-l from-black to-transparent z-[2] pointer-events-none" />

          <div
            id="testi-track"
            className="inline-flex gap-4 px-4 py-2 whitespace-nowrap"
            style={{ animation: 'marquee-testi 44s linear infinite' }}
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div
                key={i}
                className="testi-card w-[310px] flex-shrink-0 p-[22px_24px] rounded-[20px] border border-[#1a1a1a] bg-white/[0.025] whitespace-normal inline-block align-top cursor-default transition-all duration-[350ms] hover:border-[#555555] hover:bg-white/[0.06] hover:-translate-y-1"
                onMouseEnter={() => { document.getElementById('testi-track').style.animationPlayState = 'paused' }}
                onMouseLeave={() => { document.getElementById('testi-track').style.animationPlayState = 'running' }}
              >
                <div className="flex gap-[2px] mb-3">
                  {[...Array(5)].map((_, j) => <RiStarFill key={j} size={9} className="text-white" />)}
                </div>
                <p className="font-dm-sans italic text-sm text-[#cccccc] leading-[1.75] mb-[18px]">"{t.quote}"</p>
                <div className="flex items-center gap-[10px]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-syne text-xs font-black bg-[#1a1a1a] text-[#cccccc] border border-[#2a2a2a] flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white font-dm-sans">{t.name}</div>
                    <div className="text-[10px] text-[#555555] font-dm-sans">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="px-[5vw] py-[100px] pb-[120px] text-center border-t border-[#1a1a1a] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(ellipse,rgba(255,255,255,0.04) 0%,transparent 60%)', filter: 'blur(60px)' }}
          />
        </div>

        <motion.div {...fadeUp(0)} className="flex justify-center">
          <Tag><RiSparkling2Line size={11} /> Your move</Tag>
        </motion.div>

        <motion.h2
          {...fadeUp(0.06)}
          className="font-syne font-black leading-[1.0] tracking-[-0.04em] text-white mb-5"
          style={{ fontSize: 'clamp(32px,5.5vw,64px)' }}
        >
          Every day you wait<br />is a day on their terms.
        </motion.h2>

        <motion.p {...fadeUp(0.12)} className="max-w-[400px] mx-auto mb-10 text-[#888888] leading-[1.8] text-[15px] font-dm-sans">
          Stop watching other people live. Build the discipline system your future self
          will thank you for.
        </motion.p>

        <motion.div {...fadeUp(0.18)} className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={onStart}
            className="px-[34px] py-[15px] rounded-full bg-white text-black border-none text-[15px] font-bold cursor-pointer font-dm-sans flex items-center gap-2 transition-all duration-200 shadow-[0_8px_40px_rgba(255,255,255,0.1)] hover:bg-[#e8e8e8] hover:-translate-y-[2px] hover:shadow-[0_14px_50px_rgba(255,255,255,0.18)]"
          >
            <RiRocketLine size={16} /> Forge Your Avatar Now
          </button>
        </motion.div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#1a1a1a] px-[5vw] pt-[60px] pb-10 bg-black/40">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand col */}
          <div>
            <div className="mb-4 font-syne text-xl font-black tracking-[0.18em]">
              <span className="text-white">VI</span>
              <span className="text-[#3a3a3a]">RAM</span>
            </div>
            <p className="text-[13px] text-[#555555] leading-[1.75] max-w-[230px] mb-[22px] font-dm-sans">
              The productivity system that fights back against the attention economy.
            </p>
            <div className="flex gap-2">
              {[RiTwitterXLine, RiInstagramLine, RiDiscordLine, RiYoutubeLine].map((Icon, k) => (
                <div
                  key={k}
                  className="w-8 h-8 rounded-full border border-[#1a1a1a] flex items-center justify-center cursor-default transition-all duration-200 hover:border-[#555555] hover:bg-white/[0.06]"
                >
                  <Icon size={13} className="text-[#555555]" />
                </div>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {[
            { title: 'Product',    links: [{ label: 'Get Started', to: '/' }, { label: 'Mind Library', to: '/' }, { label: 'Features', to: '/' }, { label: 'Dashboard', to: '/' }] },
            { title: 'Resources',  links: [{ label: 'Playlists', to: '/' }, { label: 'Deep Work', to: '/' }, { label: 'Atomic Habits', to: '/' }, { label: 'Digital Detox', to: '/' }] },
            { title: 'Philosophy', links: [{ label: 'The Problem', to: '/' }, { label: 'Our Manifesto', to: '/' }, { label: 'Privacy', to: '/' }, { label: 'Sign Up Free', to: '/' }] },
          ].map(col => (
            <div key={col.title}>
              <div className="text-[10px] tracking-[0.16em] uppercase text-[#2a2a2a] font-black mb-[18px] font-dm-sans">{col.title}</div>
              {col.links.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="block text-[13px] text-[#555555] mb-[11px] no-underline font-dm-sans transition-colors duration-200 hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Footer bottom bar */}
        <div className="max-w-[1100px] mx-auto mt-10 pt-6 border-t border-[#1a1a1a] flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-[#3a3a3a] font-dm-sans">
            © 2026 Viram. Built for those who refuse to be the product.
          </div>
          <div className="flex items-center gap-[7px] text-xs text-[#3a3a3a] font-dm-sans">
            <span
              className="w-[6px] h-[6px] rounded-full bg-white inline-block"
              style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}
            />
            Systems online
          </div>
        </div>
      </footer>
    </div>
   </> 
)
}