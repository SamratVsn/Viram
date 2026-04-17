import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] },
})

const MARQUEE_ITEMS = ['FOCUS', 'DISCIPLINE', 'CLARITY', 'GROWTH', 'EVOLVE', 'DEEP WORK', 'MOMENTUM', 'IDENTITY', 'FLOW STATE', 'WILLPOWER', 'PRESENCE', 'PURPOSE', 'MASTERY', 'SILENCE']

const FEATURES = [
  { icon: 'ri-user-heart-line', color: '#9d7fff', bg: 'rgba(157,127,255,0.12)', title: 'Living Avatar', body: 'Your habits manifest in your character\'s stats in real time. Watch yourself grow — or wither.', large: true },
  { icon: 'ri-timer-flash-line', color: '#00d4a8', bg: 'rgba(0,212,168,0.12)', title: 'Pomodoro Engine', body: 'Deep work challenges with XP rewards. Complete without breaking = massive combo multiplier.' },
  { icon: 'ri-shield-keyhole-line', color: '#ff4d7d', bg: 'rgba(255,77,125,0.12)', title: 'Friction Accounting', body: 'Log doomscrolling honestly. Make the invisible cost of distraction visible.' },
  { icon: 'ri-puzzle-line', color: '#f5c842', bg: 'rgba(245,200,66,0.12)', title: 'Mental Reset Puzzles', body: '90-second brain games to break the scroll loop and re-engage your prefrontal cortex.' },
  { icon: 'ri-book-open-line', color: '#9d7fff', bg: 'rgba(157,127,255,0.12)', title: 'Mind Library', body: 'Distilled lessons from Atomic Habits, Deep Work, Digital Minimalism.' },
  { icon: 'ri-youtube-line', color: '#00d4a8', bg: 'rgba(0,212,168,0.12)', title: 'Curated Resources', body: 'Handpicked focus playlists and productivity content. Zero doomscrolling required.' },
]

const PLAYLISTS = [
  { bg: 'linear-gradient(135deg,#0d1a2e,#0a2040)', icon: 'ri-brain-line', iconColor: '#00d4a8', channel: 'Andrew Huberman Lab', title: 'Dopamine & Motivation — Master Your Focus', meta: ['ri-time-line', '2h 14m'], url: 'https://www.youtube.com/results?search_query=andrew+huberman+dopamine+focus' },
  { bg: 'linear-gradient(135deg,#1a1040,#0d1a40)', icon: 'ri-focus-3-line', iconColor: '#9d7fff', channel: 'Andrew Huberman Lab', title: 'The Science of Setting & Achieving Goals', meta: ['ri-star-fill', 'Science-backed'], url: 'https://www.youtube.com/results?search_query=huberman+lab+goals+focus+science' },
  { bg: 'linear-gradient(135deg,#201020,#100d30)', icon: 'ri-focus-3-line', iconColor: '#ff4d7d', channel: 'Cal Newport', title: 'Deep Work Philosophy — Study With Me', meta: ['ri-book-line', 'Knowledge'], url: 'https://www.youtube.com/results?search_query=deep+work+productivity+cal+newport' },
  { bg: 'linear-gradient(135deg,#0d2010,#182010)', icon: 'ri-eye-line', iconColor: '#00d4a8', channel: 'Cal Newport', title: 'Digital Minimalism — Quit Social Media', meta: ['ri-shield-line', 'High Impact'], url: 'https://www.youtube.com/results?search_query=cal+newport+quit+social+media+digital+minimalism' },
  { bg: 'linear-gradient(135deg,#201510,#10180d)', icon: 'ri-seedling-line', iconColor: '#f5c842', channel: 'James Clear', title: 'Atomic Habits — Build Systems That Stick', meta: ['ri-repeat-line', 'Bestseller'], url: 'https://www.youtube.com/results?search_query=atomic+habits+james+clear+summary' },
  { bg: 'linear-gradient(135deg,#151520,#0a0a18)', icon: 'ri-ancient-pavilion-line', iconColor: '#f59e0b', channel: 'Marcus Aurelius', title: 'Meditations — Stoic Wisdom for Modern Life', meta: ['ri-history-line', 'Timeless'], url: 'https://www.youtube.com/results?search_query=marcus+aurelius+meditations+stoicism' },
  { bg: 'linear-gradient(135deg,#1a1008,#100c04)', icon: 'ri-sword-line', iconColor: '#f5c842', channel: 'Daily Stoic', title: 'Marcus Aurelius — Self Discipline & Resilience', meta: ['ri-fire-fill', 'Stoicism'], url: 'https://www.youtube.com/results?search_query=marcus+aurelius+daily+stoic+discipline' },
  { bg: 'linear-gradient(135deg,#060d20,#0a1525)', icon: 'ri-equalizer-line', iconColor: '#4a9eff', channel: 'Magnetic Minds', title: 'Binaural Beats — Alpha Waves for Focus', meta: ['ri-headphone-line', 'Neuroscience'], url: 'https://www.youtube.com/results?search_query=binaural+beats+focus+study' },
  { bg: 'linear-gradient(135deg,#200810,#180a08)', icon: 'ri-smartphone-line', iconColor: '#ff8c6b', channel: 'Digital Wellness', title: 'Break the Scroll — Reclaim Your Attention', meta: ['ri-shield-line', 'Mental Health'], url: 'https://www.youtube.com/results?search_query=digital+minimalism+screen+time+productivity' },
]

const TESTIMONIALS = [
  { quote: 'I went from 6 hours of phone time to 90 minutes in two weeks. The avatar system made me viscerally uncomfortable watching my character\'s energy drain.', name: 'Arjun K.', role: 'Software Engineer, 23', initials: 'A', color: '#9d7fff' },
  { quote: 'I wrote my entire thesis during my Viram streak. The Pomodoro challenge became a genuine obsession — in the best possible way.', name: 'Priya S.', role: 'PhD Student, 26', initials: 'P', color: '#00d4a8' },
  { quote: 'The Mind Library alone changed how I approach every morning. Atomic Habits as actionable lessons rather than motivational fluff.', name: 'Marcus T.', role: 'Entrepreneur, 31', initials: 'M', color: '#f59e0b' },
  { quote: 'Three months in, my screen time is down 62%. My output at work has doubled. I stopped blaming myself and started building systems.', name: 'Layla R.', role: 'Product Designer, 27', initials: 'L', color: '#ff4d7d' },
  { quote: 'The Stoic library content paired with the avatar mechanics clicked something in my brain. I now see every scroll as a vote I\'m casting against myself.', name: 'Dev M.', role: 'Medical Student, 24', initials: 'D', color: '#00d4a8' },
  { quote: 'I\'ve tried 11 productivity apps. Viram is the only one I kept using after week 2. The gamification isn\'t gimmicky — it actually works on your brain.', name: 'Sarah K.', role: 'Startup Founder, 29', initials: 'S', color: '#9d7fff' },
]

const STATS = [
  { num: '2.4h', label: 'Daily screen time saved' },
  { num: '87%', label: 'Higher focus in 1 week' },
  { num: '23×', label: 'More engaging than trackers' },
]

// Inline CSS keyframes injected once
const GLOBAL_CSS = `
  @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
  @keyframes marquee-testi { from { transform: translateX(0) } to { transform: translateX(-50%) } }
  @keyframes pulse-dot { 0%,100% { opacity:1; transform: scale(1) } 50% { opacity:.4; transform: scale(0.7) } }
  @keyframes spin-slow { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
  @keyframes float { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-12px) } }
  @keyframes scanline { 0% { top: -10% } 100% { top: 110% } }
`

export default function LandingPage({ onStart, onDemo, onLibrary, onProblem }) {
  const parallaxRef = useRef({ x: 0, y: 0 })
  const [heroOffset, setHeroOffset] = useState({ x: 0, y: 0 })
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

  // Animate avatar stats slowly
  useEffect(() => {
    const interval = setInterval(() => {
      setAvatarStats({
        focus: 68 + Math.floor(Math.random() * 14),
        discipline: 55 + Math.floor(Math.random() * 18),
        clarity: 80 + Math.floor(Math.random() * 12),
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div id="s-land" style={{ position: 'relative', zIndex: 10, overflowY: 'auto', overflowX: 'hidden', paddingTop: 70, background: '#07070d' }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        padding: '60px 5vw 60px',
        position: 'relative',
        overflow: 'hidden',
        gap: 40,
      }}>
        {/* Background noise texture feel */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {/* Grid lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          {/* Glows */}
          <div style={{ position: 'absolute', top: '10%', right: '20%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(124,92,252,0.08) 0%, transparent 65%)', filter: 'blur(40px)', transform: `translate(${heroOffset.x * 0.4}px, ${heroOffset.y * 0.4}px)` }} />
          <div style={{ position: 'absolute', bottom: '10%', left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,212,168,0.05) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        </div>

        {/* LEFT — Copy */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 10, letterSpacing: '0.2em', color: '#00d4a8', textTransform: 'uppercase', fontWeight: 700, padding: '5px 14px', borderRadius: 40, border: '1px solid rgba(0,212,168,0.25)', background: 'rgba(0,212,168,0.07)', marginBottom: 28, fontFamily: "'DM Sans', sans-serif" }}>
            <i className="ri-gamepad-line" style={{ fontSize: 11 }} /> Productivity Reimagined
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.08 } }}
            style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 900, lineHeight: 0.96,
              letterSpacing: '-0.04em', marginBottom: 24,
              fontSize: 'clamp(48px, 6.5vw, 82px)', color: '#fff',
              transform: `translate(${heroOffset.x * 0.2}px, ${heroOffset.y * 0.2}px)`,
            }}>
            Reclaim<br />
            Your<br />
            <span style={{ background: 'linear-gradient(135deg, #9d7fff 0%, #00d4a8 60%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Attention.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.16 } }}
            style={{ fontSize: 15, color: '#7878a0', lineHeight: 1.85, marginBottom: 36, maxWidth: 400, fontFamily: "'DM Sans', sans-serif" }}>
            Your dopamine hijacked by social media. Your attention sold to advertisers.
            Viram takes it back — and makes discipline feel <em style={{ color: '#eeeef8', fontStyle: 'italic' }}>electric.</em>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.22 } }}
            style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 52 }}>
            <button onClick={onStart}
              style={{ padding: '13px 28px', borderRadius: 50, background: 'linear-gradient(135deg,#7c5cfc,#3d2aad)', color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'none', boxShadow: '0 4px 32px rgba(124,92,252,0.45)', transition: 'all 0.2s', fontFamily: "'DM Sans',sans-serif", display: 'flex', alignItems: 'center', gap: 7 }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 44px rgba(124,92,252,0.6)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 32px rgba(124,92,252,0.45)' }}>
              <i className="ri-rocket-line" /> Start Your Journey
            </button>
            <button onClick={onDemo}
              style={{ padding: '13px 28px', borderRadius: 50, background: 'rgba(255,255,255,0.04)', color: '#eeeef8', border: '1px solid rgba(255,255,255,0.12)', fontSize: 14, fontWeight: 600, cursor: 'none', transition: 'all 0.2s', fontFamily: "'DM Sans',sans-serif", display: 'flex', alignItems: 'center', gap: 7 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}>
              <i className="ri-play-circle-line" /> Preview Dashboard
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}
            style={{ display: 'flex', gap: 0, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 28 }}>
            {STATS.map(({ num, label }, i) => (
              <div key={label} style={{ flex: 1, paddingRight: 24, borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', paddingLeft: i > 0 ? 24 : 0 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>{num}</div>
                <div style={{ fontSize: 11, color: '#4a4a68', marginTop: 4, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — Avatar card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] } }}
          style={{
            position: 'relative', zIndex: 2,
            transform: `translate(${heroOffset.x * 0.35}px, ${heroOffset.y * 0.35}px)`,
            transition: 'transform 0.12s ease-out',
          }}>
          {/* Main avatar card */}
          <div style={{
            background: 'linear-gradient(145deg, #131325, #0e0e1c)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 28,
            padding: '32px 28px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}>
            {/* Scanline effect */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 28 }}>
              <div style={{ position: 'absolute', left: 0, right: 0, height: '30%', background: 'linear-gradient(to bottom, transparent, rgba(124,92,252,0.03), transparent)', animation: 'scanline 4s linear infinite' }} />
            </div>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.18em', color: '#5a5a78', textTransform: 'uppercase', fontFamily: "'DM Sans',sans-serif", marginBottom: 3 }}>Active Avatar</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 800, color: '#fff' }}>The Focused Mind</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: 'rgba(0,212,168,0.1)', border: '1px solid rgba(0,212,168,0.2)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4a8', display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
                <span style={{ fontSize: 10, color: '#00d4a8', fontWeight: 700, fontFamily: "'DM Sans',sans-serif", letterSpacing: '0.12em' }}>LIVE</span>
              </div>
            </div>

            {/* Avatar visual */}
            <div style={{ position: 'relative', marginBottom: 28 }}>
              <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, #1a1040, #0d1a30)', border: '2px solid rgba(157,127,255,0.3)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', animation: 'float 4s ease-in-out infinite' }}>
                <i className="ri-user-3-line" style={{ fontSize: 48, color: '#9d7fff' }} />
                {/* XP ring */}
                <svg style={{ position: 'absolute', inset: -6, width: 'calc(100% + 12px)', height: 'calc(100% + 12px)', animation: 'spin-slow 12s linear infinite' }} viewBox="0 0 132 132">
                  <circle cx="66" cy="66" r="62" fill="none" stroke="rgba(157,127,255,0.15)" strokeWidth="1.5" strokeDasharray="4 8" />
                </svg>
              </div>
              {/* Level badge */}
              <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#7c5cfc,#4a35c9)', padding: '4px 14px', borderRadius: 20, fontSize: 10, fontWeight: 800, color: '#fff', fontFamily: "'Syne',sans-serif", letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
                LV 14 · DISCIPLINE MONK
              </div>
            </div>

            {/* Stats bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 22 }}>
              {[
                { label: 'Focus', value: avatarStats.focus, color: '#9d7fff' },
                { label: 'Discipline', value: avatarStats.discipline, color: '#00d4a8' },
                { label: 'Clarity', value: avatarStats.clarity, color: '#ff4d7d' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 10, color: '#5a5a78', fontFamily: "'DM Sans',sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
                    <span style={{ fontSize: 10, color, fontFamily: "'Syne',sans-serif", fontWeight: 800 }}>{value}</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 4, background: color, width: `${value}%`, transition: 'width 1.2s cubic-bezier(0.22,1,0.36,1)', opacity: 0.85 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Today's streak */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { icon: 'ri-fire-fill', color: '#f5c842', label: 'Streak', val: '12 days' },
                { icon: 'ri-timer-flash-line', color: '#00d4a8', label: 'Today', val: '3h 40m' },
              ].map(({ icon, color, label, val }) => (
                <div key={label} style={{ padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                    <i className={icon} style={{ fontSize: 11, color }} />
                    <span style={{ fontSize: 10, color: '#5a5a78', fontFamily: "'DM Sans',sans-serif", textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
                  </div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: '#fff' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating XP pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
            style={{ position: 'absolute', top: -14, right: -14, background: 'linear-gradient(135deg,#00d4a8,#00a882)', padding: '8px 16px', borderRadius: 20, fontSize: 12, fontWeight: 800, color: '#fff', fontFamily: "'Syne',sans-serif", boxShadow: '0 8px 24px rgba(0,212,168,0.4)', whiteSpace: 'nowrap' }}>
            +240 XP
          </motion.div>

          {/* Floating alert pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.75 } }}
            style={{ position: 'absolute', bottom: -14, left: -14, background: '#131325', border: '1px solid rgba(255,77,125,0.3)', padding: '8px 14px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: '#ff4d7d', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 8px 24px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            <i className="ri-smartphone-line" style={{ fontSize: 12 }} /> 47 min saved today
          </motion.div>
        </motion.div>

        {/* Mobile: stack columns */}
        <style>{`@media(max-width:768px){#hero-grid{grid-template-columns:1fr !important}}`}</style>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(90deg,#07070d,transparent)', zIndex: 2 }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(-90deg,#07070d,transparent)', zIndex: 2 }} />
        <div style={{ padding: '14px 0', overflow: 'hidden' }}>
          <div style={{ display: 'inline-flex', animation: 'marquee 32s linear infinite', whiteSpace: 'nowrap' }}>
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '0 22px' }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#4a4a68' }}>{item}</span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(124,92,252,0.5)', flexShrink: 0 }} />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── THE PROBLEM — full-width dramatic statement ── */}
      <section style={{ padding: '100px 5vw', borderBottom: '1px solid rgba(255,255,255,0.04)', position: 'relative', overflow: 'hidden' }} id="problem">
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: '-10%', top: '20%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,77,125,0.04) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <motion.div {...fadeUp(0)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 10, letterSpacing: '0.2em', color: '#ff4d7d', textTransform: 'uppercase', fontWeight: 700, marginBottom: 20, fontFamily: "'DM Sans',sans-serif" }}>
              <i className="ri-error-warning-line" /> The Problem
            </motion.div>
            <motion.h2 {...fadeUp(0.06)} style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.04em', color: '#fff', fontSize: 'clamp(36px,5vw,62px)', marginBottom: 24 }}>
              You're not<br />lazy. You're<br />
              <span style={{ color: '#ff4d7d' }}>engineered</span><br />to scroll.
            </motion.h2>
            <motion.p {...fadeUp(0.12)} style={{ fontSize: 15, color: '#7878a0', lineHeight: 1.85, fontFamily: "'DM Sans',sans-serif", marginBottom: 24 }}>
              Billion-dollar teams optimize every pixel of TikTok, Instagram, and YouTube to hijack your dopamine system. Your willpower was never the enemy — the incentive mismatch was.
            </motion.p>
            <motion.button {...fadeUp(0.18)} onClick={onProblem}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#ff4d7d', background: 'none', border: '1px solid rgba(255,77,125,0.3)', borderRadius: 40, padding: '8px 18px', cursor: 'none', fontFamily: "'DM Sans',sans-serif", fontWeight: 600, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,77,125,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,77,125,0.6)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'rgba(255,77,125,0.3)' }}>
              Read the full manifesto <i className="ri-arrow-right-line" />
            </motion.button>
          </div>

          {/* Right side: stark stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { num: '4.8h', label: 'Average daily screen time', color: '#ff4d7d' },
              { num: '$4.2B', label: 'Spent annually to capture your attention', color: '#f5c842' },
              { num: '73%', label: 'Teens report feeling addicted to social media', color: '#9d7fff' },
              { num: '23 min', label: 'To regain focus after a single notification', color: '#00d4a8' },
            ].map(({ num, label, color }, i) => (
              <motion.div key={label} {...fadeUp(i * 0.08)}
                style={{ padding: '20px 24px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: 20, transition: 'background 0.2s, border-color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)' }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 32, color, letterSpacing: '-0.03em', minWidth: 100, flexShrink: 0 }}>{num}</div>
                <div style={{ fontSize: 13, color: '#7878a0', lineHeight: 1.5, fontFamily: "'DM Sans',sans-serif" }}>{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '100px 5vw' }} id="features">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp(0)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 10, letterSpacing: '0.2em', color: '#9d7fff', textTransform: 'uppercase', fontWeight: 700, marginBottom: 14, fontFamily: "'DM Sans',sans-serif" }}>
            <i className="ri-sparkling-line" /> How It Works
          </motion.div>
          <motion.h2 {...fadeUp(0.06)} style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.04em', color: '#fff', marginBottom: 56, fontSize: 'clamp(28px,4.5vw,52px)' }}>
            Everything designed to<br />rewire your reward system.
          </motion.h2>

          {/* Asymmetric grid: first card is large */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: 14 }}>
            {/* Large hero feature */}
            <motion.div {...fadeUp(0)}
              style={{ gridColumn: '1 / 2', gridRow: '1 / 3', padding: 32, borderRadius: 22, border: '1px solid rgba(157,127,255,0.2)', background: 'linear-gradient(145deg, rgba(157,127,255,0.07), rgba(124,92,252,0.03))', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 300, transition: 'border-color 0.25s, transform 0.25s', cursor: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(157,127,255,0.45)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(157,127,255,0.2)'; e.currentTarget.style.transform = 'none' }}>
              <div>
                <div style={{ width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, fontSize: 26, background: 'rgba(157,127,255,0.12)', color: '#9d7fff' }}>
                  <i className="ri-user-heart-line" />
                </div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 12, color: '#fff' }}>Living Avatar</div>
                <div style={{ fontSize: 14, color: '#7878a0', lineHeight: 1.75, fontFamily: "'DM Sans',sans-serif" }}>Your habits manifest in your character's stats in real time. Every deep work session fuels your avatar. Every scroll drains it. Watch yourself grow — or wither.</div>
              </div>
              <div style={{ marginTop: 28, padding: '14px 18px', borderRadius: 14, background: 'rgba(157,127,255,0.08)', border: '1px solid rgba(157,127,255,0.12)' }}>
                <div style={{ fontSize: 10, color: '#9d7fff', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>Your stats right now</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 28, color: '#fff' }}>LV 14</div>
                <div style={{ fontSize: 11, color: '#5a5a78', fontFamily: "'DM Sans',sans-serif" }}>Discipline Monk · 2,340 XP</div>
              </div>
            </motion.div>

            {/* Regular features */}
            {FEATURES.slice(1).map((f, i) => (
              <motion.div key={f.title} {...fadeUp((i + 1) * 0.06)}
                style={{ padding: 24, borderRadius: 18, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', transition: 'border-color 0.25s, transform 0.25s', cursor: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(255,255,255,0.16)`; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 19, background: f.bg, color: f.color }}>
                  <i className={f.icon} />
                </div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, marginBottom: 7, color: '#fff' }}>{f.title}</div>
                <div style={{ fontSize: 12, color: '#6b6b88', lineHeight: 1.65, fontFamily: "'DM Sans',sans-serif" }}>{f.body}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESOURCES ── */}
      <section style={{ padding: '100px 5vw', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)' }} id="resources">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, alignItems: 'start', marginBottom: 56 }}>
            <div style={{ position: 'sticky', top: 100 }}>
              <motion.div {...fadeUp(0)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 10, letterSpacing: '0.2em', color: '#00d4a8', textTransform: 'uppercase', fontWeight: 700, marginBottom: 18, fontFamily: "'DM Sans',sans-serif" }}>
                <i className="ri-youtube-line" /> Resources
              </motion.div>
              <motion.h2 {...fadeUp(0.06)} style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.04em', color: '#fff', fontSize: 'clamp(32px,4vw,52px)', marginBottom: 16 }}>
                Content that<br />actually<br />
                <span style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontStyle: 'italic', fontWeight: 400, color: '#00d4a8' }}>moves the needle.</span>
              </motion.h2>
              <motion.p {...fadeUp(0.12)} style={{ fontSize: 14, color: '#6b6b88', lineHeight: 1.8, fontFamily: "'DM Sans',sans-serif" }}>
                Not dopamine junk — curated knowledge that builds you. Every playlist selected for its ability to deepen focus, rewire habits, or accelerate real growth.
              </motion.p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {PLAYLISTS.map((pl, i) => (
                <motion.div key={pl.title} {...fadeUp(i * 0.04)}
                  onClick={() => window.open(pl.url, '_blank')}
                  style={{ borderRadius: 18, border: '1px solid rgba(255,255,255,0.07)', background: '#0c0c1a', overflow: 'hidden', transition: 'border-color 0.25s, transform 0.25s', cursor: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'none' }}>
                  <div style={{ aspectRatio: '16/9', position: 'relative', background: pl.bg, overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#111' }}>
                        <i className="ri-play-fill" style={{ marginLeft: 2 }} />
                      </div>
                    </div>
                    <div style={{ position: 'absolute', top: 8, right: 8, background: '#cc0000', borderRadius: 5, padding: '2px 7px', display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 800, color: '#fff' }}>
                      <i className="ri-youtube-fill" />YT
                    </div>
                  </div>
                  <div style={{ padding: '12px 14px 14px' }}>
                    <div style={{ fontSize: 9, color: '#00d4a8', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 800, marginBottom: 5, fontFamily: "'DM Sans',sans-serif" }}>{pl.channel}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 7, lineHeight: 1.35, color: '#fff', fontFamily: "'Syne',sans-serif" }}>{pl.title}</div>
                    <div style={{ fontSize: 10, color: 'rgba(107,107,136,0.8)', display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'DM Sans',sans-serif" }}>
                      <i className={pl.meta[0]} />{pl.meta[1]}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '100px 0', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ textAlign: 'center', marginBottom: 56, padding: '0 5vw' }}>
          <motion.div {...fadeUp(0)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 10, letterSpacing: '0.2em', color: '#00d4a8', textTransform: 'uppercase', fontWeight: 700, marginBottom: 14, fontFamily: "'DM Sans',sans-serif" }}>
            <i className="ri-chat-quote-line" /> Results
          </motion.div>
          <motion.h2 {...fadeUp(0.06)} style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.04em', color: '#fff', fontSize: 'clamp(26px,4vw,48px)' }}>
            People who chose<br />the harder path.
          </motion.h2>
        </div>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(90deg,#07070d,transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(-90deg,#07070d,transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ display: 'inline-flex', gap: 16, padding: '8px 16px', animation: 'marquee-testi 44s linear infinite', whiteSpace: 'nowrap' }}>
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i}
                style={{ width: 310, flexShrink: 0, padding: '22px 24px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.025)', whiteSpace: 'normal', display: 'inline-block', verticalAlign: 'top', transition: 'all 0.35s', cursor: 'none' }}
                onMouseEnter={e => {
                  e.currentTarget.parentElement.style.animationPlayState = 'paused'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.parentElement.style.animationPlayState = 'running'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.025)'
                  e.currentTarget.style.transform = 'none'
                }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                  {[...Array(5)].map((_, j) => <i key={j} className="ri-star-fill" style={{ color: '#f5c842', fontSize: 10 }} />)}
                </div>
                <p style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontStyle: 'italic', fontSize: 14, color: '#d0d0e8', lineHeight: 1.75, marginBottom: 18 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 800, background: `${t.color}18`, color: t.color }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: "'DM Sans',sans-serif" }}>{t.name}</div>
                    <div style={{ fontSize: 10, color: '#4a4a68', fontFamily: "'DM Sans',sans-serif" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '80px 5vw 120px', textAlign: 'center', position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(124,92,252,0.07) 0%, transparent 60%)', filter: 'blur(60px)' }} />
        </div>
        <motion.div {...fadeUp(0)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 10, letterSpacing: '0.2em', color: '#9d7fff', textTransform: 'uppercase', fontWeight: 700, marginBottom: 22, padding: '5px 14px', borderRadius: 40, border: '1px solid rgba(157,127,255,0.25)', background: 'rgba(157,127,255,0.06)', fontFamily: "'DM Sans',sans-serif" }}>
          <i className="ri-sparkling-line" /> Your move
        </motion.div>
        <motion.h2 {...fadeUp(0.06)} style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.04em', color: '#fff', marginBottom: 20, fontSize: 'clamp(32px,5.5vw,64px)' }}>
          Every day you wait<br />is a day on their terms.
        </motion.h2>
        <motion.p {...fadeUp(0.12)} style={{ maxWidth: 400, margin: '0 auto 40px', color: '#6b6b88', lineHeight: 1.8, fontSize: 15, fontFamily: "'DM Sans',sans-serif" }}>
          Stop watching other people live. Build the discipline system your future self will thank you for.
        </motion.p>
        <motion.div {...fadeUp(0.18)} style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onStart}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 34px', borderRadius: 50, background: 'linear-gradient(135deg,#7c5cfc,#3d2aad)', color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'none', boxShadow: '0 8px 40px rgba(124,92,252,0.4)', transition: 'all 0.2s', fontFamily: "'DM Sans',sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 50px rgba(124,92,252,0.55)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(124,92,252,0.4)' }}>
            <i className="ri-rocket-line" /> Forge Your Avatar Now
          </button>
          <button onClick={onLibrary}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 28px', borderRadius: 50, background: 'rgba(255,255,255,0.04)', color: '#eeeef8', border: '1px solid rgba(255,255,255,0.1)', fontSize: 14, fontWeight: 600, cursor: 'none', transition: 'all 0.2s', fontFamily: "'DM Sans',sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}>
            <i className="ri-book-open-line" style={{ color: '#00d4a8' }} /> Explore the Library
          </button>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '60px 5vw 40px', background: 'rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40 }}>
          <div>
            {/* VIRAM text logo in footer */}
            <div style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 700, letterSpacing: '0.18em', color: '#ffffff', lineHeight: 1 }}>VI</span>
              <span style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 700, letterSpacing: '0.18em', color: '#7c5cfc', lineHeight: 1 }}>RAM</span>
            </div>
            <p style={{ fontSize: 13, color: '#4a4a68', lineHeight: 1.75, maxWidth: 230, marginBottom: 22, fontFamily: "'DM Sans',sans-serif" }}>
              The productivity system that fights back against the attention economy.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {['ri-twitter-x-line', 'ri-instagram-line', 'ri-discord-line', 'ri-youtube-line'].map(icon => (
                <div key={icon} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'none', transition: 'border-color 0.2s, background 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,92,252,0.5)'; e.currentTarget.style.background = 'rgba(124,92,252,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'transparent' }}>
                  <i className={icon} style={{ fontSize: 13, color: '#6b6b88' }} />
                </div>
              ))}
            </div>
          </div>
          {[
            {
              title: 'Product',
              links: [
                { label: 'Get Started', to: '/start' },
                { label: 'Mind Library', to: '/library' },
                { label: 'Features', to: '/features' },
                { label: 'Dashboard', to: '/dashboard' },
              ]
            },
            {
              title: 'Resources',
              links: [
                { label: 'Playlists', to: '/resources' },
                { label: 'Deep Work', to: '/resources' },
                { label: 'Atomic Habits', to: '/resources' },
                { label: 'Digital Detox', to: '/resources' },
              ]
            },
            {
              title: 'Philosophy',
              links: [
                { label: 'The Problem', to: '/problem' },
                { label: 'Our Manifesto', to: '/manifesto' },
                { label: 'Privacy', to: '/privacy' },
                { label: 'Sign Up Free', to: '/start' },
              ]
            },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#3a3a58', fontWeight: 800, marginBottom: 18, fontFamily: "'DM Sans',sans-serif" }}>{col.title}</div>
              {col.links.map(({ label, to }) => (
                <Link key={label} to={to}
                  style={{ display: 'block', fontSize: 13, color: '#6b6b88', marginBottom: 11, cursor: 'none', transition: 'color 0.2s', textDecoration: 'none', fontFamily: "'DM Sans',sans-serif" }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#6b6b88'}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1100, margin: '40px auto 0', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: '#3a3a58', fontFamily: "'DM Sans',sans-serif" }}>© 2026 Viram. Built for those who refuse to be the product.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#3a3a58', fontFamily: "'DM Sans',sans-serif" }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4a8', display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            Systems online
          </div>
        </div>
      </footer>
    </div>
  )
}