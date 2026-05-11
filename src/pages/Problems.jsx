import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  RiArrowLeftLine, RiErrorWarningLine, RiSmartphoneLine, RiBrainLine,
  RiTimeLine, RiEyeLine, RiEmotionUnhappyLine, RiMoonLine,
  RiBarChartLine, RiUserLine, RiGroupLine, RiNotification3Line,
  RiArrowUpLine, RiRefreshLine, RiArrowDownLine, RiRepeatLine,
  RiMentalHealthLine, RiAlertLine, RiCalendarLine, RiCalendar2Line,
  RiHistoryLine, RiLightbulbFlashLine, RiCodeSSlashLine, RiBookOpenLine,
  RiBodyScanLine, RiMoneyDollarCircleLine, RiMusic2Line, RiSeedlingLine,
  RiUserVoiceLine, RiVerifiedBadgeLine, RiShieldCheckLine, RiLockLine,
  RiHeartPulseLine, RiRoadMapLine, RiTimerFlashLine, RiUserHeartLine,
  RiCodeBoxLine, RiRocketLine,
} from 'react-icons/ri'

/* ─── Design Tokens ───────────────────────────────────────────────────────── */
const T = {
  bg:        '#F4EEE3',
  card:      '#F9F5EC',
  cardDeep:  '#F0E9D9',
  ink:       '#2A2218',
  charcoal:  '#5A4E42',
  muted:     '#8A7D72',
  faint:     '#B0A396',
  accent:    '#B8704E',
  accentBg:  'rgba(184,112,78,0.08)',
  accentBdr: 'rgba(184,112,78,0.18)',
  border:    'rgba(55,38,22,0.07)',
  borderMid: 'rgba(55,38,22,0.12)',
  shadow:    '0 4px 24px rgba(42,34,24,0.06)',
  shadowMd:  '0 8px 40px rgba(42,34,24,0.09)',
  shadowLg:  '0 16px 64px rgba(42,34,24,0.12)',
  rSm: '12px', rMd: '18px', rLg: '28px',
}

/* ─── Grain overlay SVG ───────────────────────────────────────────────────── */
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.065'/%3E%3C/svg%3E")`

/* ─── Animation helpers ───────────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-48px' },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
})

/* ─── Data ────────────────────────────────────────────────────────────────── */
const TICKER_STATS = [
  '📱 People check their phones 96× per day',
  '🧠 Attention span has collapsed to 8 seconds',
  '⏰ 2h 27m — average daily social media use in 2024',
  '💸 $227B+ earned from advertising YOUR attention in 2023',
  '😞 70% of users feel worse after scrolling Instagram',
  '😴 90% of teens use screens within 1 hour of bedtime',
  '👥 2.4× higher anxiety rates in heavy social media users',
  '📉 45 entire days lost per year to scrolling',
  '🎯 1,000+ PhD-level engineers optimising to keep you hooked',
  '😔 66% higher depression in teen girls using social media 5+ hrs/day',
]

const CORE_PROBLEMS = [
  {
    Icon: RiSmartphoneLine, accent: T.accent,
    stat: '96×', statLabel: 'daily phone checks', source: 'Asurion, 2023',
    title: 'The Compulsive Check Loop',
    body: 'The average person picks up their phone 96 times a day — once every 10 minutes. Each unlock is a micro-dose of anticipation. Platforms engineer variable reward schedules identical to slot machines: sometimes a notification, sometimes nothing. The uncertainty is the addiction.',
  },
  {
    Icon: RiBrainLine, accent: '#7A6040',
    stat: '200%', statLabel: 'dopamine spike from likes', source: 'Harvard Neuroscience Lab',
    title: 'Dopamine Hijacking',
    body: 'Receiving a like triggers the same dopamine pathway as cocaine and gambling. Platforms discovered that withholding and then delivering notifications in batches maximises the neurochemical hit. Your brain\'s reward system is being deliberately overloaded — and then depleted.',
  },
  {
    Icon: RiTimeLine, accent: T.accent,
    stat: '23 min', statLabel: 'to recover focus after interruption', source: 'UC Irvine, Gloria Mark',
    title: 'The Focus Debt',
    body: 'A single notification costs you 23 minutes of deep focus recovery — even if you ignore it. The mere presence of your phone on a desk reduces cognitive capacity. Heavy users accumulate "focus debt" that can never fully be repaid, systematically destroying their ability to do meaningful work.',
  },
  {
    Icon: RiEyeLine, accent: '#8A6030',
    stat: '8 sec', statLabel: 'average human attention span', source: 'Microsoft Research, 2015',
    title: 'Shrinking Attention',
    body: 'In 2000, the average human attention span was 12 seconds. By 2015 it had collapsed to 8 seconds — shorter than a goldfish. The cause: habitual short-form content rewires the prefrontal cortex to demand constant novelty. Deep reading, long-form thinking, and sustained focus become neurologically painful.',
  },
  {
    Icon: RiEmotionUnhappyLine, accent: '#7A6040',
    stat: '2.4×', statLabel: 'higher anxiety in heavy users', source: 'APA, J. of Social & Clinical Psychology',
    title: 'Manufactured Anxiety',
    body: 'Heavy social media use correlates with 2.4× higher anxiety and depression rates. Platforms are optimised for outrage, envy, and social comparison — three states that guarantee you keep scrolling. Rage-bait and highlight reels are not bugs. They are the business model.',
  },
  {
    Icon: RiMoonLine, accent: '#5A7060',
    stat: '1hr+', statLabel: 'less deep sleep per night', source: 'JAMA Pediatrics, 2019',
    title: 'Sleep Architecture Collapse',
    body: '90% of teens use social media within an hour of sleep. Blue light suppresses melatonin for 3+ hours. Worse: the emotional arousal from content — social comparison, conflict, FOMO — elevates cortisol. Chronic sleep deprivation compresses the immune system, emotional regulation, and memory consolidation.',
  },
  {
    Icon: RiBarChartLine, accent: '#8A6030',
    stat: '88%', statLabel: 'of women compare themselves to curated images', source: 'Dove Real Beauty Report, 2023',
    title: 'The Comparison Trap',
    body: 'Instagram\'s internal research found that 1 in 3 teen girls report their body image worsens when they use the platform. Algorithmic amplification favours the most physically "ideal" content. The feed is a hall of mirrors designed to make you feel inadequate so you keep consuming.',
  },
  {
    Icon: RiUserLine, accent: T.accent,
    stat: '73%', statLabel: 'feel they waste too much time', source: 'Pew Research Center, 2023',
    title: 'Identity Erosion',
    body: 'Every hour spent scrolling is a vote against who you want to become. The subconscious records each session as evidence: "I am someone who runs from difficulty, chooses comfort over growth." Over months and years, this calcifies into a core belief — and the algorithm happily feeds it.',
  },
  {
    Icon: RiGroupLine, accent: '#5A7060',
    stat: '3×', statLabel: 'lonelier despite more "connections"', source: 'Cigna U.S. Loneliness Index',
    title: 'The Loneliness Paradox',
    body: 'Despite following thousands of people, heavy social media users report feeling 3× lonelier than light users. Digital interactions suppress the neurological drive to seek real-world connection — the kind that releases oxytocin, reduces cortisol, and actually fulfils the human need for belonging.',
  },
]

const BRAIN_STAGES = [
  { num: '01', Icon: RiNotification3Line, title: 'The Trigger', body: 'A notification, a boredom spike, or habitual muscle memory fires the cingulate cortex. Your hand reaches for the phone before you consciously decide to.' },
  { num: '02', Icon: RiArrowUpLine, title: 'Dopamine Spike', body: 'The nucleus accumbens floods with dopamine in anticipation — not on receipt. The expecting is the reward. Your brain marks this as a survival-priority behaviour.' },
  { num: '03', Icon: RiRefreshLine, title: 'Variable Reward', body: 'Sometimes a like. Sometimes nothing. Sometimes a viral post. The unpredictability is deliberate — it\'s the slot machine mechanism that prevents satiation.' },
  { num: '04', Icon: RiArrowDownLine, title: 'Dopamine Crash', body: 'The spike collapses. Your baseline drops. Real-world activities feel dull by comparison. The only relief is another scroll. This is tolerance — the same mechanism as hard drugs.' },
  { num: '05', Icon: RiRepeatLine, title: 'Compulsive Return', body: 'The depleted baseline drives you back. Each cycle strengthens the neural pathway and weakens your prefrontal cortex\'s ability to override the impulse. The loop tightens.' },
]

const MENTAL_HEALTH_DATA = [
  { stat: '153%', label: 'Rise in teen girl suicide attempts since 2010', source: 'CDC, 2023' },
  { stat: '66%', label: 'Higher depression with 5+ hrs/day social media use', source: 'San Diego State University' },
  { stat: '40%', label: 'Of teens feel pressured to post only perfect content', source: 'Common Sense Media' },
  { stat: '37%', label: 'Of teens aged 12–17 have experienced cyberbullying', source: 'Pew Research Center' },
  { stat: '69%', label: 'Of millennials experience FOMO driven by social media', source: 'Strategy Online' },
  { stat: '70%', label: 'Feel worse about their lives after using Instagram', source: 'RealSelf Annual Survey' },
]

const WHISTLEBLOWERS = [
  { name: 'Tristan Harris', role: 'Former Design Ethicist, Google', quote: 'Never before in history have a handful of designers at a few tech companies had such a direct effect on how two billion people spend their time.' },
  { name: 'Frances Haugen', role: 'Former Product Manager, Facebook/Meta', quote: 'Facebook knows that its content algorithms push users toward more extreme content, and that Instagram makes body-image issues worse for teen girls — and chose profit over user safety.' },
  { name: 'Chamath Palihapitiya', role: 'Former VP of Growth, Facebook', quote: 'I feel tremendous guilt. I think we all knew in the back of our minds — even if we didn\'t admit it — we were exploiting a vulnerability in human psychology.' },
]

const TIME_COSTS = [
  { label: 'Per day', value: '2h 27m', Icon: RiTimeLine },
  { label: 'Per week', value: '17 hrs', Icon: RiCalendarLine },
  { label: 'Per year', value: '45 days', Icon: RiCalendar2Line },
  { label: 'Per decade', value: '1.25 yrs', Icon: RiHistoryLine },
]

const VIRAM_SOLUTIONS = [
  { Icon: RiUserHeartLine, title: 'Your Avatar Feels Your Choices', body: 'Every session of scrolling costs your avatar energy. The invisible cost becomes visceral. You\'re no longer choosing between "scroll" and "nothing" — you\'re choosing between your avatar thriving or decaying.' },
  { Icon: RiTimerFlashLine, title: 'Discipline Engineered to Feel Like a Game', body: 'Pomodoro sessions earn XP. Streaks build multipliers. Focus milestones unlock avatar upgrades. We weaponise the same dopamine mechanics the platforms use — and point them at your actual goals.' },
  { Icon: RiRoadMapLine, title: 'Goals That Actually Compound', body: 'Every micro-action maps to a milestone that maps to a life outcome. You don\'t just "be less on your phone." You build a business, master a skill, transform a body — with Viram as the system.' },
  { Icon: RiBrainLine, title: 'Rewire, Not Restrict', body: 'We don\'t block apps. Restriction creates rebellion. We replace shallow dopamine loops with deep-work loops that compound into mastery, identity, and genuine self-respect.' },
]

const SECTIONS = [
  { id: 'core-problems', label: 'The Problems' },
  { id: 'dopamine-loop', label: 'The Addiction Loop' },
  { id: 'mental-health', label: 'Mental Health' },
  { id: 'stolen-time', label: 'The Cost' },
  { id: 'whistleblowers', label: 'Whistleblowers' },
  { id: 'sleep', label: 'Sleep' },
  { id: 'answer', label: 'The Answer' },
]

/* ─── Sub-components ──────────────────────────────────────────────────────── */

function GrainLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{
      backgroundImage: GRAIN_SVG,
      backgroundRepeat: 'repeat',
      opacity: 1,
      zIndex: 1,
    }} />
  )
}

function TickerBar() {
  const doubled = [...TICKER_STATS, ...TICKER_STATS]
  return (
    <div className="relative w-full overflow-hidden py-3 border-y" style={{ borderColor: T.border, background: T.cardDeep }}>
      <GrainLayer />
      <div className="relative z-10 flex gap-0" style={{
        animation: 'tickerScroll 70s linear infinite',
        width: 'max-content',
      }}>
        {doubled.map((s, i) => (
          <span key={i} className="flex-shrink-0 px-8 text-xs font-semibold tracking-wide"
            style={{ color: T.faint, whiteSpace: 'nowrap', fontFamily: "'Jost', sans-serif" }}>
            {s}
            <span className="mx-6 opacity-30">·</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes tickerScroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  )
}

function SectionTag({ children, Icon }) {
  return (
    <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold mb-6 px-4 py-2 rounded-full border"
      style={{ background: T.accentBg, borderColor: T.accentBdr, color: T.accent, fontFamily: "'Jost', sans-serif" }}>
      {Icon && <Icon size={11} />}
      {children}
    </div>
  )
}

function Divider() {
  return <div className="w-12 h-[1px] mx-auto my-4" style={{ background: T.accent, opacity: 0.4 }} />
}

function ProblemCard({ p, delay }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div {...fadeUp(delay)}
      className="relative p-7 overflow-hidden cursor-default"
      style={{
        background: hovered ? T.card : T.card,
        borderRadius: T.rMd,
        border: `1px solid ${hovered ? T.borderMid : T.border}`,
        boxShadow: hovered ? T.shadowMd : T.shadow,
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
        backgroundImage: GRAIN_SVG,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top rule */}
      <div className="absolute top-0 left-0 right-0 h-[1px] transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${p.accent}55, transparent)`, opacity: hovered ? 1 : 0.5 }} />

      <div className="flex items-start gap-4 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${p.accent}12`, color: p.accent, border: `1px solid ${p.accent}20` }}>
          <p.Icon size={18} />
        </div>
        <div>
          <div className="font-bold leading-none" style={{ fontSize: 28, color: p.accent, fontFamily: "'Cormorant Garamond', serif" }}>{p.stat}</div>
          <div className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: T.faint, fontFamily: "'Jost', sans-serif" }}>{p.statLabel}</div>
        </div>
      </div>

      <div className="font-semibold mb-2" style={{ fontSize: 15, color: T.ink, fontFamily: "'Cormorant Garamond', serif", letterSpacing: '-0.01em' }}>{p.title}</div>
      <div className="text-[12.5px] leading-[1.85] mb-4" style={{ color: T.charcoal, fontFamily: "'Jost', sans-serif" }}>{p.body}</div>

      <div className="inline-flex items-center gap-1.5 text-[10px] px-3 py-1 rounded-full"
        style={{ background: `${p.accent}0a`, color: `${p.accent}99`, border: `1px solid ${p.accent}18`, fontFamily: "'Jost', sans-serif" }}>
        <RiVerifiedBadgeLine size={10} />
        {p.source}
      </div>
    </motion.div>
  )
}

/* ─── Reading progress bar ────────────────────────────────────────────────── */
function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] origin-left pointer-events-none"
      style={{ scaleX, background: 'linear-gradient(90deg, #B8704E, #D4A08A)' }}
    />
  )
}

/* ─── Section navigation ─────────────────────────────────────────────────── */
function SectionNav({ sections, activeSection, onSectionClick }) {
  return (
    <div className="flex justify-center" style={{ margin: '0 auto', maxWidth: 880 }}>
      <div className="flex gap-1.5 overflow-x-auto px-2 py-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => onSectionClick(s.id)}
            className="px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider whitespace-nowrap transition-all duration-200 flex-shrink-0"
            style={{
              fontFamily: "'Jost', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              background: activeSection === s.id ? T.accentBg : 'rgba(244,238,227,0.8)',
              color: activeSection === s.id ? T.accent : T.faint,
              border: `1px solid ${activeSection === s.id ? T.accentBdr : T.border}`,
            }}
            onMouseEnter={e => { if (activeSection !== s.id) e.currentTarget.style.background = 'rgba(184,112,78,0.06)' }}
            onMouseLeave={e => { if (activeSection !== s.id) e.currentTarget.style.background = 'rgba(244,238,227,0.8)' }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function ProblemPage({ onBack }) {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0])
  const heroY       = useTransform(heroScroll, [0, 0.6], [0, 40])

  const [activeSection, setActiveSection] = useState('')
  const handleBack = () => navigate('/dashboard')

  const handleSectionClick = useCallback((id) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }, { threshold: 0.15, rootMargin: '-80px 0px -40% 0px' })

    const els = document.querySelectorAll('[data-section]')
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const pageStyle = {
    background: T.bg,
    backgroundImage: GRAIN_SVG,
    fontFamily: "'Jost', sans-serif",
    color: T.ink,
    minHeight: '100vh',
  }

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto" style={pageStyle}>

      <ReadingProgress />

      {/* ── Sticky nav ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 border-b"
        style={{ background: 'rgba(244,238,227,0.92)', backdropFilter: 'blur(16px)', borderColor: T.border }}>
        <button onClick={handleBack}
          className="flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:-translate-x-0.5"
          style={{ color: T.charcoal, fontFamily: "'Jost', sans-serif" }}
          onMouseEnter={e => e.currentTarget.style.color = T.ink}
          onMouseLeave={e => e.currentTarget.style.color = T.charcoal}>
          <RiArrowLeftLine size={16} />
          Back to Dashboard
        </button>
        <div className="font-bold text-sm flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17 }}>
          <span style={{ color: T.accent }}>V</span>
          <span style={{ color: T.charcoal }}>IRAM</span>
          <span className="mx-2" style={{ color: T.border, opacity: 0.8 }}>·</span>
          <span style={{ color: T.faint, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: "'Jost', sans-serif", fontWeight: 600 }}>The Wake-Up Call</span>
        </div>
        {/* spacer */}
        <div style={{ width: 120 }} />
      </div>

      {/* ── Ticker ─────────────────────────────────────────────────────── */}
      <TickerBar />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <div ref={heroRef} className="relative px-[6vw] pt-28 pb-24 overflow-hidden text-center">
        <motion.div style={{ opacity: heroOpacity, y: heroY }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <SectionTag Icon={RiErrorWarningLine}>The Attention Economy</SectionTag>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em', color: T.ink, marginBottom: 28 }}>
            Your mind is<br />
            <span style={{ color: T.accent }}>the product</span><br />
            being sold.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ maxWidth: 620, margin: '0 auto 56px', color: T.charcoal, lineHeight: 1.9, fontSize: 'clamp(15px, 1.5vw, 18px)', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
            Social media platforms deploy armies of neuroscientists, behavioural economists, and
            psychologists with one mandate: maximise the time you spend staring at a screen. You are
            not the user. You are the inventory. And your attention is being auctioned to the highest bidder.
          </motion.p>

          {/* Hero stats */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.28 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ maxWidth: 880, margin: '0 auto' }}>
            {[
              { num: '2h 27m', label: 'Average daily social media use', src: 'DataReportal 2024' },
              { num: '45 days', label: 'Lost every single year to scrolling', src: 'DataReportal 2024' },
              { num: '$227B', label: 'Earned selling your attention in 2023', src: 'Statista 2023' },
              { num: '1,000+', label: 'Engineers hired to keep you scrolling', src: 'The Social Dilemma' },
            ].map(s => (
              <div key={s.label} className="p-6 text-center"
                style={{ background: T.card, borderRadius: T.rMd, border: `1px solid ${T.border}`, boxShadow: T.shadow, backgroundImage: GRAIN_SVG }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: T.accent, marginBottom: 4 }}>{s.num}</div>
                <div style={{ fontSize: 11, color: T.charcoal, lineHeight: 1.5, marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 9, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.src}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Section nav ──────────────────────────────────────────────────── */}
      <div style={{ padding: '24px 6vw 0', maxWidth: 1160, margin: '0 auto' }}>
        <SectionNav sections={SECTIONS} activeSection={activeSection} onSectionClick={handleSectionClick} />
      </div>

      {/* ── Pull quote ──────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, background: T.cardDeep, backgroundImage: GRAIN_SVG }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '64px 6vw', textAlign: 'center' }}>
          <div style={{ fontSize: 64, color: T.accent, opacity: 0.2, fontFamily: 'Georgia', lineHeight: 1, marginBottom: 16 }}>"</div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 'clamp(18px, 2vw, 26px)', color: T.ink, lineHeight: 1.75, marginBottom: 20 }}>
            We have created tools that are ripping apart the social fabric of how society works.
          </p>
          <div style={{ fontSize: 13, color: T.charcoal }}>
            <span style={{ color: T.accent, fontWeight: 600 }}>Chamath Palihapitiya</span>
            <span style={{ margin: '0 10px', opacity: 0.35 }}>—</span>
            Former VP of Growth, Facebook
          </div>
        </div>
      </div>

      {/* ── Nine Core Problems ──────────────────────────────────────────── */}
      <div data-section="core-problems" style={{ padding: '96px 6vw', maxWidth: 1160, margin: '0 auto' }}>
        <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: 64 }}>
          <SectionTag Icon={RiErrorWarningLine}>What It's Actually Doing to You</SectionTag>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: T.ink, fontSize: 'clamp(26px, 3.5vw, 48px)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Nine ways your feed<br />
            <span style={{ color: T.accent }}>is dismantling your life.</span>
          </h2>
          <Divider />
          <p style={{ maxWidth: 520, margin: '16px auto 0', color: T.charcoal, fontSize: 13, lineHeight: 1.9 }}>
            Every problem below is backed by peer-reviewed research, government data, or internal platform documents leaked by whistleblowers. This isn't opinion. It's evidence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {CORE_PROBLEMS.map((p, i) => <ProblemCard key={p.title} p={p} delay={i * 0.04} />)}
        </div>
      </div>

      {/* ── Dopamine Loop ───────────────────────────────────────────────── */}
      <div data-section="dopamine-loop" style={{ background: T.cardDeep, backgroundImage: GRAIN_SVG, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '96px 6vw' }}>
          <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionTag Icon={RiBrainLine}>Neuroscience of Addiction</SectionTag>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: T.ink, fontSize: 'clamp(24px, 3vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 16 }}>
              The loop running in<br />
              <span style={{ color: T.accent }}>your brain right now.</span>
            </h2>
            <Divider />
            <p style={{ maxWidth: 480, margin: '16px auto 0', color: T.charcoal, fontSize: 13, lineHeight: 1.9 }}>
              This five-stage neurochemical cycle is structurally identical to substance addiction. The platforms reverse-engineered it intentionally.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {BRAIN_STAGES.map((s, i) => (
              <motion.div key={s.num} {...fadeUp(i * 0.07)}
                className="p-6 text-center group"
                style={{ background: T.card, borderRadius: T.rMd, border: `1px solid ${T.border}`, boxShadow: T.shadow, backgroundImage: GRAIN_SVG, transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = T.shadowMd; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = T.shadow; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: T.accentBg, color: T.accent, border: `1px solid ${T.accentBdr}` }}>
                  <s.Icon size={18} />
                </div>
                <div style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.accent, marginBottom: 6, fontWeight: 700 }}>Stage {s.num}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 14, color: T.ink, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 11, color: T.charcoal, lineHeight: 1.75 }}>{s.body}</div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.3)} style={{ marginTop: 40, padding: '28px 36px', borderRadius: T.rMd, border: `1px solid ${T.accentBdr}`, background: T.accentBg, backgroundImage: GRAIN_SVG, textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: T.charcoal, lineHeight: 1.9 }}>
              <span style={{ color: T.accent, fontWeight: 600 }}>The critical insight: </span>
              each cycle through this loop physically thickens the neural pathway — making the next pull more automatic.
              After months of use, the prefrontal cortex literally
              <span style={{ color: T.ink, fontWeight: 600 }}> shrinks in grey matter density</span>. This is not a metaphor. It is measurable on an MRI.
              <span style={{ color: T.faint }}> (Source: UCSF Department of Psychiatry, 2022)</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Mental Health Crisis ─────────────────────────────────────────── */}
      <div data-section="mental-health" style={{ padding: '96px 6vw' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: 56 }}>
            <SectionTag Icon={RiMentalHealthLine}>The Mental Health Emergency</SectionTag>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: T.ink, fontSize: 'clamp(24px, 3vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 8 }}>
              The numbers that should<br />
              <span style={{ color: T.accent }}>terrify every parent.</span>
            </h2>
            <Divider />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {MENTAL_HEALTH_DATA.map((d, i) => (
              <motion.div key={d.label} {...fadeUp(i * 0.06)}
                style={{ padding: '28px', background: T.card, borderRadius: T.rMd, border: `1px solid ${T.border}`, boxShadow: T.shadow, backgroundImage: GRAIN_SVG, transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = T.shadowMd; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = T.shadow; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 'clamp(28px, 2.5vw, 36px)', color: T.accent, marginBottom: 8 }}>{d.stat}</div>
                <div style={{ fontSize: 13, color: T.charcoal, lineHeight: 1.65, marginBottom: 12 }}>{d.label}</div>
                <div className="inline-flex items-center gap-1.5 text-[10px] px-3 py-1 rounded-full"
                  style={{ background: T.accentBg, color: `${T.accent}99`, border: `1px solid ${T.accentBdr}` }}>
                  <RiVerifiedBadgeLine size={10} />
                  {d.source}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Teen crisis callout */}
          <motion.div {...fadeUp(0.2)} style={{ padding: '36px 40px', borderRadius: T.rLg, border: `1px solid ${T.accentBdr}`, background: T.accentBg, backgroundImage: GRAIN_SVG, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${T.accent}, rgba(184,112,78,0.2), transparent)` }} />
            <div className="flex items-start gap-6 flex-wrap md:flex-nowrap">
              <div style={{ flexShrink: 0 }}>
                <div style={{ width: 60, height: 60, borderRadius: T.rMd, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${T.accent}14`, color: T.accent }}>
                  <RiAlertLine size={28} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, color: T.accent, marginBottom: 10 }}>The Teen Mental Health Crisis</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: T.ink, fontSize: 18, marginBottom: 12 }}>
                  Adolescent rates of anxiety, depression, self-harm, and suicide have all spiked sharply since 2012 — exactly when smartphone ownership became ubiquitous.
                </h3>
                <p style={{ fontSize: 13, color: T.charcoal, lineHeight: 1.85 }}>
                  Dr. Jean Twenge (San Diego State University) and Dr. Jonathan Haidt (NYU Stern) have independently documented the correlation across 12 countries.
                  Facebook's own internal research — suppressed for years and eventually leaked — confirmed that Instagram was a direct causal factor for body dysmorphia and depression in teen girls. They knew. They shipped it anyway.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Stolen Time ─────────────────────────────────────────────────── */}
      <div data-section="stolen-time" style={{ background: T.cardDeep, backgroundImage: GRAIN_SVG, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: '96px 6vw' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: 56 }}>
            <SectionTag Icon={RiTimeLine}>The Compounding Cost</SectionTag>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: T.ink, fontSize: 'clamp(24px, 3vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              What 2 hours a day<br />
              <span style={{ color: T.accent }}>actually costs you.</span>
            </h2>
            <Divider />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {TIME_COSTS.map((t, i) => (
              <motion.div key={t.label} {...fadeUp(i * 0.06)} style={{ padding: '28px 20px', background: T.card, borderRadius: T.rMd, border: `1px solid ${T.border}`, boxShadow: T.shadow, textAlign: 'center', backgroundImage: GRAIN_SVG }}>
                <t.Icon size={24} style={{ color: T.accent, marginBottom: 12, display: 'block', margin: '0 auto 12px' }} />
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 26, color: T.ink, marginBottom: 4 }}>{t.value}</div>
                <div style={{ fontSize: 11, color: T.faint }}>{t.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.2)} style={{ padding: '36px 40px', background: T.card, borderRadius: T.rLg, border: `1px solid ${T.border}`, boxShadow: T.shadow, backgroundImage: GRAIN_SVG }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiLightbulbFlashLine size={16} style={{ color: T.accent }} />
              In those 45 days per year, you could have:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { Icon: RiCodeSSlashLine, text: 'Become a proficient programmer from zero — and launched a product' },
                { Icon: RiBookOpenLine, text: 'Read 24 books — enough to outlearn 97% of your peers in any field' },
                { Icon: RiBodyScanLine, text: 'Trained consistently enough to transform your physical health entirely' },
                { Icon: RiMoneyDollarCircleLine, text: 'Built a side business generating passive income on evenings and weekends' },
                { Icon: RiMusic2Line, text: 'Learned an instrument to intermediate level — or a new language' },
                { Icon: RiSeedlingLine, text: 'Compounded a meditation practice that rewires baseline anxiety levels' },
              ].map(item => (
                <div key={item.text} className="flex items-start gap-3 p-4" style={{ borderRadius: T.rSm, border: `1px solid ${T.border}`, background: T.bg, backgroundImage: GRAIN_SVG }}>
                  <item.Icon size={16} style={{ color: T.accent, marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: T.charcoal, lineHeight: 1.75 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Whistleblowers ──────────────────────────────────────────────── */}
      <div data-section="whistleblowers" style={{ padding: '96px 6vw' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: 56 }}>
            <SectionTag Icon={RiUserVoiceLine}>From the Inside</SectionTag>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: T.ink, fontSize: 'clamp(24px, 3vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              The people who built it<br />
              <span style={{ color: T.accent }}>are terrified of it.</span>
            </h2>
            <Divider />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WHISTLEBLOWERS.map((w, i) => (
              <motion.div key={w.name} {...fadeUp(i * 0.08)}
                style={{ padding: '32px', background: T.card, borderRadius: T.rMd, border: `1px solid ${T.border}`, boxShadow: T.shadow, position: 'relative', overflow: 'hidden', backgroundImage: GRAIN_SVG, transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = T.shadowMd; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = T.shadow; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${T.accent}40, transparent)` }} />
                <div style={{ fontSize: 48, color: T.accent, opacity: 0.12, fontFamily: 'Georgia', lineHeight: 1, marginBottom: 16 }}>"</div>
                <p style={{ color: T.charcoal, lineHeight: 1.9, marginBottom: 24, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 15 }}>
                  {w.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.accentBg, color: T.accent, flexShrink: 0 }}>
                    <RiUserVoiceLine size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>{w.name}</div>
                    <div style={{ fontSize: 11, color: T.faint }}>{w.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sleep section ───────────────────────────────────────────────── */}
      <div data-section="sleep" style={{ background: T.cardDeep, backgroundImage: GRAIN_SVG, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: '80px 6vw' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <motion.div {...fadeUp(0)}>
            <div style={{ padding: '40px 44px', background: T.card, borderRadius: T.rLg, border: `1px solid ${T.border}`, boxShadow: T.shadow, backgroundImage: GRAIN_SVG, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: 2, background: `linear-gradient(180deg, ${T.accent}, rgba(184,112,78,0.1))` }} />
              <div className="flex flex-wrap gap-8 items-center">
                <div>
                  <div style={{ width: 72, height: 72, borderRadius: T.rMd, display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.accentBg, color: T.accent }}>
                    <RiMoonLine size={34} />
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <SectionTag>Sleep Architecture</SectionTag>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: T.ink, fontSize: 22, marginBottom: 12 }}>
                    You're not just tired. Your brain is chemically broken.
                  </h3>
                  <p style={{ fontSize: 13, color: T.charcoal, lineHeight: 1.9 }}>
                    Blue-light exposure within 2 hours of sleep suppresses melatonin production for up to 3 additional hours.
                    But the deeper damage is emotional: anxiety, comparison, and social conflict triggered by content elevates
                    cortisol at exactly the moment it should be falling. Deep REM — responsible for memory consolidation, emotional
                    processing, and cellular repair — is compressed or eliminated. You wake exhausted even after 8 hours. This is not laziness.
                    <span style={{ color: T.ink, fontWeight: 600 }}> This is your brain in withdrawal.</span>
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    { val: '90%', label: 'teens use screens before bed' },
                    { val: '1hr+', label: 'less deep sleep nightly' },
                    { val: '58%', label: 'check phone immediately on waking' },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 22, color: T.accent }}>{s.val}</div>
                      <div style={{ fontSize: 10, color: T.faint, maxWidth: 160, marginLeft: 'auto' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Engineering confession ──────────────────────────────────────── */}
      <div style={{ padding: '80px 6vw' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <motion.div {...fadeUp(0)} style={{ padding: '48px', background: T.card, borderRadius: T.rLg, border: `1px solid ${T.border}`, boxShadow: T.shadow, textAlign: 'center', backgroundImage: GRAIN_SVG }}>
            <RiCodeBoxLine size={36} style={{ color: T.accent, marginBottom: 16, display: 'block', margin: '0 auto 16px' }} />
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: T.ink, fontSize: 24, marginBottom: 20 }}>
              This was engineered. On purpose.
            </h3>
            <p style={{ fontSize: 13, color: T.charcoal, lineHeight: 1.95, marginBottom: 28 }}>
              "Pull-to-refresh" was modelled directly on a slot machine lever. Infinite scroll was designed to eliminate
              the natural stopping point a page break provides. Notification batching was reverse-engineered from operant
              conditioning studies on rats. The red notification badge triggers the same neural alarm as blood in peripheral
              vision — a survival response millions of years old, now weaponised to make you check Instagram.
              <span style={{ color: T.accent }}> None of this happened by accident.</span>
              Every design decision was A/B tested against a single metric: time on app.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'Pull-to-refresh = Slot machine lever',
                'Infinite scroll = Eliminated stopping cues',
                'Red badge = Survival threat response',
                'Variable notifications = Operant conditioning',
              ].map(tag => (
                <span key={tag} style={{ fontSize: 10, fontWeight: 600, padding: '6px 14px', borderRadius: 100, background: T.accentBg, color: `${T.accent}cc`, border: `1px solid ${T.accentBdr}` }}>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── The Viram Answer ────────────────────────────────────────────── */}
      <div data-section="answer" style={{ background: T.cardDeep, backgroundImage: GRAIN_SVG, borderTop: `1px solid ${T.border}`, padding: '96px 6vw 112px' }}>
        <div style={{ maxWidth: 840, margin: '0 auto', textAlign: 'center' }}>
          <motion.div {...fadeUp(0)}>
            <SectionTag>The Answer</SectionTag>
          </motion.div>

          <motion.h2 {...fadeUp(0.06)} style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: T.ink, fontSize: 'clamp(28px, 3.5vw, 50px)', lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: 20 }}>
            The problem is not<br />
            <span style={{ color: T.accent }}>your willpower.</span>
          </motion.h2>

          <motion.p {...fadeUp(0.10)} style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 'clamp(16px, 1.6vw, 20px)', color: T.charcoal, lineHeight: 1.9, maxWidth: 640, margin: '0 auto 16px' }}>
            You are fighting billion-dollar systems built by the most talented engineers alive,
            whose only job is to make you incapable of putting the device down.
          </motion.p>

          <motion.p {...fadeUp(0.13)} style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 14, color: T.muted, lineHeight: 1.9, maxWidth: 600, margin: '0 auto 56px' }}>
            You don't beat a system with willpower. You beat it with a better system —
            one that makes discipline feel electric, that turns your own psychology against
            distraction instead of surrendering it to the feed. That's Viram.
          </motion.p>

          <motion.div {...fadeUp(0.16)} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14" style={{ textAlign: 'left' }}>
            {VIRAM_SOLUTIONS.map((s) => (
              <div key={s.title}
                style={{ padding: '28px', background: T.card, borderRadius: T.rMd, border: `1px solid ${T.border}`, boxShadow: T.shadow, backgroundImage: GRAIN_SVG, transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = T.shadowMd; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = T.shadow; e.currentTarget.style.transform = 'translateY(0)' }}>
                <s.Icon size={22} style={{ color: T.accent, marginBottom: 14, display: 'block' }} />
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 16, color: T.ink, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 12.5, color: T.charcoal, lineHeight: 1.8 }}>{s.body}</div>
              </div>
            ))}
          </motion.div>

          {/* Trust signals */}
          <motion.div {...fadeUp(0.22)} className="flex items-center justify-center gap-8 flex-wrap">
            {[
              { Icon: RiShieldCheckLine, label: 'Evidence-based' },
              { Icon: RiLockLine, label: 'Privacy-first' },
              { Icon: RiHeartPulseLine, label: 'No dark patterns' },
            ].map(t => (
              <div key={t.label} className="flex items-center gap-2" style={{ fontSize: 12, color: T.faint }}>
                <t.Icon size={14} style={{ color: T.accent }} />
                {t.label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

    </div>
  )
}