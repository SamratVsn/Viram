import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  RiArrowLeftLine,
  RiBookOpenLine,
  RiSparkling2Line,
  RiSeedlingLine,
  RiBrainLine,
  RiMindMap,
  RiShieldLine,
  RiScissorsLine,
  RiLightbulbLine,
  RiTimerLine,
  RiSparklingLine,
  RiForbidLine,
  RiSmartphoneLine,
  RiRocketLine,
} from 'react-icons/ri'

/* ─── Font loader ─────────────────────────────────────────────────────────── */
const FontLoader = () => (
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap"
  />
)

/* ─── Animation helper ────────────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] },
})

/* ─── Grain overlay ───────────────────────────────────────────────────────── */
const Grain = () => (
  <div
    aria-hidden="true"
    className="absolute inset-0 pointer-events-none z-0 rounded-[inherit]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)' opacity='0.03'/%3E%3C/svg%3E")`,
    }}
  />
)

/* ─── Pulse dot ───────────────────────────────────────────────────────────── */
const PulseDot = ({ color = '#B8704E' }) => (
  <motion.span
    animate={{ opacity: [1, 0.35, 1], scale: [1, 0.55, 1] }}
    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
    className="inline-block w-[5px] h-[5px] rounded-full flex-shrink-0"
    style={{ background: color }}
  />
)

/* ─── Tag badge ───────────────────────────────────────────────────────────── */
function Tag({ children }) {
  return (
    <div
      className="inline-flex items-center gap-[6px] px-[14px] py-[5px] rounded-full mb-[22px]"
      style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#5A4E42',
        background: '#EDE8DF',
        border: '1px solid rgba(55,38,22,0.12)',
        boxShadow: '0 1px 3px rgba(42,34,24,0.06)',
      }}
    >
      {children}
    </div>
  )
}

/* ─── Author pill ─────────────────────────────────────────────────────────── */
function AuthorPill({ Icon, name }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="inline-flex items-center gap-[7px] px-[14px] py-[6px] rounded-full cursor-default transition-all duration-200"
      style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: 12,
        fontWeight: 400,
        color: hovered ? '#5A4E42' : '#8A7E74',
        background: '#F9F5EC',
        border: `1px solid ${hovered ? 'rgba(55,38,22,0.18)' : 'rgba(55,38,22,0.10)'}`,
        boxShadow: hovered
          ? '0 2px 8px rgba(42,34,24,0.07), 0 1px 3px rgba(42,34,24,0.04)'
          : '0 1px 3px rgba(42,34,24,0.05)',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon size={12} style={{ color: hovered ? '#B8704E' : '#C4B8A8' }} />
      {name}
    </div>
  )
}

/* ─── Icon map ────────────────────────────────────────────────────────────── */
const ICON_MAP = {
  'ri-seedling-line':    RiSeedlingLine,
  'ri-brain-line':       RiBrainLine,
  'ri-mind-map':         RiMindMap,
  'ri-shield-line':      RiShieldLine,
  'ri-scissors-cut-line':RiScissorsLine,
  'ri-lightbulb-line':   RiLightbulbLine,
  'ri-timer-line':       RiTimerLine,
  'ri-sparkling-line':   RiSparklingLine,
  'ri-forbid-line':      RiForbidLine,
  'ri-smartphone-line':  RiSmartphoneLine,
}
function DynIcon({ name, size = 14, color = '#8A7E74' }) {
  const C = ICON_MAP[name]
  return C ? <C size={size} style={{ color }} /> : null
}

/* ─── Data ────────────────────────────────────────────────────────────────── */
const CHAPTERS = [
  {
    num: '01', label: 'Atomic Habits', icon: 'ri-seedling-line', author: 'James Clear',
    title: 'Identity Over Goals',
    subtitle: 'The person you become determines the results you get. Not the other way around.',
    paras: [
      `There is a fundamental misunderstanding at the heart of most self-help advice: the belief that if you want to change your behaviour, you need to set better goals. James Clear spent years studying the science of habit formation, and his finding was both simple and devastating — goals have almost nothing to do with sustained behaviour change. The people who fail to quit their phones, finish their books, or build their bodies aren't failing because their goals were too small. They're failing because they're trying to change what they do without changing who they believe they are.`,
      `The real question isn't "how can I quit scrolling?" The real question is: "what kind of person am I?" A person who has no regard for their own attention will find themselves reaching for the phone within minutes. But a person who deeply believes they are someone who protects their focus — that person experiences scrolling differently. Every time they open Instagram out of boredom, they are voting against the identity they've built. The discomfort of contradiction becomes their teacher.`,
      `This is the mechanism Viram is built around. Your avatar isn't cosmetic. It is a visible, external representation of your internal identity — a mirror that shows you who your habits say you are right now, not who you wish you were. When your avatar's energy drains after a logged scroll session, your subconscious processes it as a real consequence. You are making the invisible cost of distraction visible. And over time, the accumulation of small votes rewires what you believe you're capable of.`,
    ],
    pullquote: { text: 'Every action you take is a vote for the type of person you wish to become.', source: 'James Clear · Atomic Habits' },
    insight: { icon: 'ri-lightbulb-line', label: 'Practical Application', title: 'The Identity Reframe', body: 'Before your next focus session, say quietly: "I am someone who does deep work." The subconscious cannot distinguish acted identity from real identity — it reinforces whatever pattern you repeat. Say it before every session for 21 days and notice what changes.' },
  },
  {
    num: '02', label: 'Deep Work', icon: 'ri-brain-line', author: 'Cal Newport',
    title: 'The Rarest Skill in the Modern Economy',
    subtitle: 'The ability to focus without distraction is becoming simultaneously rare and extraordinarily valuable.',
    paras: [
      `Cal Newport noticed something unusual about his colleagues. The most successful ones — the ones producing work that genuinely mattered — were not the most connected, the most responsive, or the most visible on social media. They were the most focused. They had, whether deliberately or by accident, built their working lives around what Newport calls "deep work": cognitively demanding activity performed in extended, distraction-free sessions that push your intellectual capabilities to their limit and create genuine, lasting value.`,
      `Shallow work — the emails, the notifications, the Slack messages, the reflexive phone checks — is what most people have accidentally optimised their professional lives around. It feels productive because it keeps you busy. It generates the sensation of motion without the substance of progress. Newport's uncomfortable observation is that most knowledge workers today have spent years becoming incredibly skilled at shallow tasks, and have allowed their capacity for deep concentration to slowly atrophy, like a muscle that hasn't been used.`,
      `The research Newport cites is striking. A 2009 McKinsey study found that high-skill knowledge workers now spend more than 60% of their time on shallow, easily automatable tasks. The people who resist this trend — who deliberately carve out uninterrupted hours for difficult, creative, cognitively demanding work — are not just marginally more productive. They are operating in a different league entirely. The gap between a distracted mind and a focused one is not arithmetic. It is exponential.`,
      `The Pomodoro system inside Viram is not arbitrary. It is designed around your brain's natural ultradian rhythm — the 90-minute cycles of high and low neural activity that govern how your attention actually functions. The 25-minute sessions are set at the point where concentration reaches its first peak. The breaks prevent the kind of mental fatigue that makes subsequent sessions increasingly shallow. This is not a productivity hack. It is working with your biology instead of against it.`,
    ],
    pullquote: { text: 'In an age of distraction, nothing can feel more luxurious than paying attention.', source: 'Pico Iyer · The Art of Stillness' },
    insight: { icon: 'ri-timer-line', label: 'Science', title: 'The Depth Equation', body: "Newport's formula is blunt: High-Quality Work Produced = Time Spent × Intensity of Focus. Doubling your time is hard. Doubling your intensity through distraction-free sessions is achievable tonight. The Pomodoro sessions in Viram are structured to maximise intensity — not just duration." },
  },
  {
    num: '03', label: 'The Power of Your Subconscious Mind', icon: 'ri-mind-map', author: 'Joseph Murphy',
    title: 'The Architecture of Belief',
    subtitle: 'What you tell yourself in the quiet moments becomes the structure your behaviour is built upon.',
    paras: [
      `Joseph Murphy wrote his landmark work in 1963, but modern neuroscience has done nothing to diminish its central claim — it has only given it a more precise vocabulary. The subconscious mind is not a metaphor. It is a real, documented system: the part of your brain that processes 11 million bits of information per second while your conscious mind handles perhaps 50. It runs your posture, your breathing, your emotional defaults, your habit loops, and — most critically — your self-concept. The story you carry about who you are is stored there, and it is running constantly.`,
      `Murphy's insight was that the subconscious cannot distinguish between an experience that is vividly imagined and one that has actually occurred. This is why elite athletes visualise performance. This is why meditation practices work. And this is why the identity-based approach to habit change is so powerful: when you repeatedly act as if you are a focused, disciplined person, your subconscious eventually updates its model of who you are — and then begins to make decisions that are consistent with that model, automatically, without effort.`,
      `The inverse is equally true. Every scroll session, every abandoned focus attempt, every moment you choose the easy dopamine hit over the harder thing — these are not neutral events. They are votes cast in the subconscious election of your self-concept. Over years, they accumulate into a settled belief: "I am someone who cannot focus." Changing behaviour without addressing this belief is like trying to fill a bucket with a hole in it. The first step is always to interrupt the story.`,
    ],
    pullquote: { text: 'Whatever we plant in our subconscious mind and nourish with repetition will one day become reality.', source: 'Joseph Murphy' },
    insight: { icon: 'ri-sparkling-line', label: 'Viram Connection', title: 'Why Your Avatar Has a Health Bar', body: 'The visual feedback of your avatar weakening after a scroll session is not gamification for its own sake. It is a subconscious intervention — making a consequence real that your brain previously treated as invisible. Over time, the brain updates: scrolling now feels like it has a cost. Because it does.' },
  },
  {
    num: '04', label: 'Digital Minimalism', icon: 'ri-shield-line', author: 'Cal Newport & Tristan Harris',
    title: 'The Slot Machine in Your Pocket',
    subtitle: 'These companies are not building tools. They are building desire machines calibrated to your most exploitable psychological vulnerabilities.',
    paras: [
      `Tristan Harris spent years inside Google as a design ethicist before concluding that the industry he worked in was engaged in something deeply troubling. The products he helped design were not neutral tools that people happened to use a lot. They were precision instruments, engineered by teams of psychologists, neuroscientists, and behavioural economists to maximise one thing above all else: the amount of time a human being spends looking at a screen. The metric is called "engagement." The mechanism is psychological exploitation.`,
      `The variable reward schedule — the core feature of every major social platform — is the same mechanism that makes slot machines the most profitable machines ever built. You don't know what you'll find when you pull the lever. Sometimes it's a photo of someone you haven't seen in years. Sometimes it's a piece of news that makes your blood pressure spike. Sometimes it's nothing. The randomness is not a bug. It is the entire architecture. Your brain releases dopamine not in response to the reward, but in anticipation of the uncertainty. You are not checking your phone. Your phone is checking you.`,
      `Understanding this changes how you relate to your own compulsive phone use. You are not weak. You are not lazy. You are a person with a healthy human brain, up against systems designed by some of the most talented engineers and psychologists alive, whose only goal is to make you incapable of putting the device down. The antidote, as Newport argues, is not willpower applied after the fact. It is the deliberate redesign of your environment so that the friction of addictive behaviour increases and the friction of intentional behaviour decreases. That is what Viram is built to do.`,
    ],
    pullquote: { text: 'We are not the customer. We are the product being sold to the highest bidder.', source: 'Tristan Harris · Center for Humane Technology' },
    insight: { icon: 'ri-forbid-line', label: 'The Antidote', title: 'Friction as Intervention', body: 'Logging a scroll session in Viram creates friction around mindless behaviour — you have to acknowledge it, name it, watch it cost your avatar something. This moment of conscious friction is more effective than any amount of motivation, because motivation is reactive. Architecture is proactive.' },
  },
  {
    num: '05', label: 'Essentialism', icon: 'ri-scissors-cut-line', author: 'Greg McKeown',
    title: 'The Ruthless Pursuit of Less',
    subtitle: 'Almost everything is noise. Almost nothing is signal. The Essentialist spends their life learning to tell the difference.',
    paras: [
      `Greg McKeown's central observation is one that most people feel but never articulate: the life we are living is not quite the life we intended to live. At some point, we said yes to too many things. A commitment here, an obligation there, a social media account that started as a useful tool and became an identity. The accumulation of half-intentional choices adds up, over years, to a life that feels full but hollow — busy in ways that don't seem to move anything that actually matters.`,
      `The Essentialist doesn't try to do everything better. The Essentialist tries to figure out which things, if done exceptionally well, would make everything else irrelevant. This is not a productivity strategy. It is a philosophy of living. It requires the kind of clarity that most of us avoid because the clarity reveals how much we need to give up — and giving things up feels like loss, even when it is the only path to gaining something meaningful.`,
      `The 90% rule McKeown describes is one of the most useful decision-making tools available. When evaluating a commitment — a new project, a new habit, a new platform — rate it honestly from zero to one hundred. If it is not a 90 or above, it is a no. Not a maybe. Not a not-right-now. A no. This single filter, applied consistently, eliminates the mediocre middle that swallows most people's time and energy before they even realise it has happened.`,
    ],
    pullquote: { text: 'The way of the Essentialist is the relentless pursuit of less but better.', source: 'Greg McKeown · Essentialism' },
    insight: { icon: 'ri-scissors-cut-line', label: 'Practice', title: 'Apply the 90% Rule Now', body: "Open your phone's screen time report. Look at every app you used this week. Ask honestly: does this score a 90 or above in terms of the value it adds to your life? Whatever doesn't make the cut, you already know what to do." },
  },
]

const AUTHORS = [
  { name: 'James Clear',    Icon: RiSeedlingLine   },
  { name: 'Cal Newport',    Icon: RiBrainLine      },
  { name: 'Joseph Murphy',  Icon: RiMindMap        },
  { name: 'Tristan Harris', Icon: RiSmartphoneLine },
  { name: 'Greg McKeown',   Icon: RiScissorsLine   },
]

/* ─── Hover-lift card wrapper ─────────────────────────────────────────────── */
function LiftCard({ children, className = '', style = {} }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className={`relative transition-all duration-[280ms] ${className}`}
      style={{
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 20px 60px rgba(42,34,24,0.10), 0 6px 20px rgba(42,34,24,0.07)'
          : '0 1px 3px rgba(42,34,24,0.06)',
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  )
}

/* ─── Chapter divider ─────────────────────────────────────────────────────── */
function ChapterDivider() {
  return (
    <motion.div {...fadeUp(0)} className="flex items-center gap-4 my-[72px]">
      <div className="flex-1 h-px bg-[rgba(55,38,22,0.07)]" />
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: '#F9F5EC',
          border: '1px solid rgba(55,38,22,0.12)',
          boxShadow: '0 1px 3px rgba(42,34,24,0.06)',
        }}
      >
        <RiSparkling2Line size={14} style={{ color: '#C4B8A8' }} />
      </div>
      <div className="flex-1 h-px bg-[rgba(55,38,22,0.07)]" />
    </motion.div>
  )
}

/* ─── Pull quote card ─────────────────────────────────────────────────────── */
function PullQuote({ text, source }) {
  return (
    <motion.div
      {...fadeUp(0.04)}
      className="relative my-11 px-8 py-7 rounded-[18px] overflow-hidden"
      style={{
        background: '#F9F5EC',
        border: '1px solid rgba(55,38,22,0.10)',
        borderLeft: '3px solid #B8704E',
        boxShadow: '0 6px 24px rgba(42,34,24,0.07), 0 2px 8px rgba(42,34,24,0.04)',
      }}
    >
      <Grain />
      {/* Decorative quotation mark */}
      <div
        className="absolute top-2 left-5 text-[72px] leading-none pointer-events-none select-none z-0"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: 'rgba(184,112,78,0.10)',
        }}
      >
        "
      </div>
      <p
        className="relative z-[1] mb-[14px] italic leading-[1.7]"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 19,
          color: '#2A2218',
        }}
      >
        {text}
      </p>
      <div
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#C4B8A8',
        }}
      >
        {source}
      </div>
    </motion.div>
  )
}

/* ─── Insight card ────────────────────────────────────────────────────────── */
function InsightCard({ icon, label, title, body }) {
  return (
    <LiftCard
      className="my-7 rounded-[18px] overflow-hidden"
      style={{
        background: '#EDE8DF',
        border: '1px solid rgba(55,38,22,0.07)',
      }}
    >
      <Grain />
      {/* Terracotta accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, #B8704E, rgba(184,112,78,0.3), transparent)',
          opacity: 0.8,
        }}
      />
      <div className="relative z-[1] p-6">
        {/* Label row */}
        <div
          className="flex items-center gap-[6px] mb-[10px]"
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#B8704E',
          }}
        >
          <DynIcon name={icon} size={11} color="#B8704E" />
          {label}
        </div>
        {/* Title */}
        <div
          className="mb-[8px]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 18,
            fontWeight: 600,
            color: '#2A2218',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </div>
        {/* Body */}
        <div
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 13,
            fontWeight: 400,
            color: '#5A4E42',
            lineHeight: 1.8,
            letterSpacing: '0.01em',
          }}
        >
          {body}
        </div>
      </div>
    </LiftCard>
  )
}

/* ─── Main export ─────────────────────────────────────────────────────────── */
export default function Library() {
  const isLoggedIn = typeof localStorage !== 'undefined' && !!localStorage.getItem('viram_user')

  return (
    <>
      <FontLoader />

      <div
        className="min-h-svh overflow-x-hidden"
        style={{ background: '#F4EEE3', color: '#2A2218' }}
      >

        {/* ── Sticky top bar ────────────────────────────────────────────── */}
        <div
          className="sticky top-0 z-50 flex items-center justify-between h-[56px] px-[5vw] relative overflow-hidden"
          style={{
            background: 'rgba(244,238,227,0.90)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(55,38,22,0.07)',
            boxShadow: '0 1px 3px rgba(42,34,24,0.06)',
          }}
        >
          <Grain />

          {/* Back link */}
          <BackLink to={isLoggedIn ? '/dashboard' : '/'} />

          {/* Centre wordmark */}
          <div
            className="flex items-center gap-[7px] relative z-[1]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            <RiBookOpenLine size={14} style={{ color: '#A89B8C' }} />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#2A2218',
                letterSpacing: '0.06em',
              }}
            >
              Mind Library
            </span>
          </div>

          {/* Chapter count */}
          <div
            className="flex items-center gap-[6px] relative z-[1]"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.10em',
              color: '#A89B8C',
            }}
          >
            <PulseDot />
            {CHAPTERS.length} Chapters
          </div>
        </div>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden text-center px-[5vw] pt-[88px] pb-[96px]"
          style={{ borderBottom: '1px solid rgba(55,38,22,0.07)' }}
        >
          {/* Dot grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.25]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(42,34,24,0.10) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          {/* Warm ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(184,112,78,0.06) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-[2]">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <Tag><RiBookOpenLine size={11} /> Viram Mind Library</Tag>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.08 } }}
              className="mb-5 leading-[0.96]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: '#2A2218',
                fontSize: 'clamp(42px, 6vw, 76px)',
              }}
            >
              The Knowledge That<br />
              <span style={{ color: '#A89B8C', fontStyle: 'italic' }}>Changes Everything</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.16 } }}
              className="max-w-[560px] mx-auto mb-10 italic"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(15px, 1.3vw, 18px)',
                color: '#5A4E42',
                lineHeight: 1.8,
              }}
            >
              This is not a collection of quotes. This is a distillation of the most important
              ideas on attention, identity, and human potential — structured to actually change
              how you think and act.
            </motion.p>

            {/* Author pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.26 } }}
              className="flex flex-wrap gap-[10px] justify-center"
            >
              {AUTHORS.map(({ name, Icon }) => (
                <AuthorPill key={name} Icon={Icon} name={name} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Chapter content ───────────────────────────────────────────── */}
        <div className="max-w-[740px] mx-auto px-[5vw] pt-[80px] pb-[120px]">
          {CHAPTERS.map((ch, idx) => (
            <div key={ch.num}>
              <motion.article {...fadeUp(0)}>

                {/* Chapter badge row */}
                <div className="flex items-center gap-[10px] mb-5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: '#EDE8DF',
                      border: '1px solid rgba(55,38,22,0.12)',
                      boxShadow: '0 1px 3px rgba(42,34,24,0.06)',
                    }}
                  >
                    <DynIcon name={ch.icon} size={15} color="#A89B8C" />
                  </div>
                  <div>
                    <div
                      className="mb-[2px]"
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontSize: 9,
                        fontWeight: 600,
                        letterSpacing: '0.20em',
                        textTransform: 'uppercase',
                        color: '#C4B8A8',
                      }}
                    >
                      Chapter {ch.num}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontSize: 11,
                        fontWeight: 500,
                        letterSpacing: '0.10em',
                        textTransform: 'uppercase',
                        color: '#8A7E74',
                      }}
                    >
                      {ch.label} — {ch.author}
                    </div>
                  </div>
                </div>

                {/* Chapter title */}
                <h2
                  className="mb-[10px] leading-[1.08]"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    color: '#2A2218',
                    fontSize: 'clamp(24px, 3.5vw, 38px)',
                  }}
                >
                  {ch.title}
                </h2>

                {/* Subtitle */}
                <p
                  className="mb-9 italic leading-[1.65]"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 17,
                    color: '#8A7E74',
                  }}
                >
                  {ch.subtitle}
                </p>

                {/* Body paragraphs */}
                {ch.paras.map((p, i) => (
                  <p
                    key={i}
                    className="mb-5 leading-[1.9]"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 15,
                      fontWeight: 400,
                      color: '#5A4E42',
                      letterSpacing: '0.005em',
                    }}
                  >
                    {p}
                  </p>
                ))}

                <PullQuote text={ch.pullquote.text} source={ch.pullquote.source} />

                <InsightCard
                  icon={ch.insight.icon}
                  label={ch.insight.label}
                  title={ch.insight.title}
                  body={ch.insight.body}
                />
              </motion.article>

              {idx < CHAPTERS.length - 1 && <ChapterDivider />}
            </div>
          ))}

          {/* ── End note ────────────────────────────────────────────────── */}
          <motion.div
            {...fadeUp(0)}
            className="text-center mt-20 pt-12"
            style={{ borderTop: '1px solid rgba(55,38,22,0.07)' }}
          >
            {/* Glowing orb */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: 'rgba(184,112,78,0.10)',
                border: '1px solid rgba(184,112,78,0.18)',
                boxShadow: '0 2px 8px rgba(42,34,24,0.07)',
              }}
            >
              <RiBookOpenLine size={26} style={{ color: '#B8704E' }} />
            </div>

            <p
              className="max-w-[420px] mx-auto mb-7 italic leading-[1.85]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18,
                color: '#5A4E42',
              }}
            >
              The knowledge exists. The question is always the same: what will you do
              with it when you close this page?
            </p>

            <CTAButton to={isLoggedIn ? '/dashboard' : '/start'}>
              <RiRocketLine size={14} /> Forge Your Avatar
            </CTAButton>
          </motion.div>
        </div>

        {/* ── Footer echo ───────────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden flex items-center justify-between flex-wrap gap-3 px-[5vw] py-7"
          style={{
            borderTop: '1px solid rgba(55,38,22,0.07)',
            background: '#EDE8DF',
          }}
        >
          <Grain />

          {/* Wordmark */}
          <div className="relative z-[1]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '0.18em', color: '#2A2218' }}>VI</span>
            <span style={{ fontSize: 17, fontWeight: 400, letterSpacing: '0.18em', color: '#C4B8A8' }}>RAM</span>
          </div>

          <div
            className="relative z-[1]"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 12,
              fontWeight: 400,
              color: '#A89B8C',
              letterSpacing: '0.04em',
            }}
          >
            Mind Library · {CHAPTERS.length} Chapters
          </div>

          <div className="relative z-[1] flex items-center gap-[6px]"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              fontWeight: 400,
              color: '#A89B8C',
              letterSpacing: '0.06em',
            }}
          >
            <PulseDot />
            Always growing
          </div>
        </div>
      </div>
    </>
  )
}

/* ─── Small reusable pieces ───────────────────────────────────────────────── */
function BackLink({ to }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      to={to}
      className="relative z-[1] no-underline flex items-center gap-[6px] transition-all duration-200"
      style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: '0.04em',
        color: hovered ? '#2A2218' : '#8A7E74',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.span
        animate={{ x: hovered ? -2 : 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <RiArrowLeftLine size={14} />
      </motion.span>
      Back
    </Link>
  )
}

function CTAButton({ to, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      animate={{ y: hovered ? -2 : 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="inline-block"
    >
      <Link
        to={to}
        className="inline-flex items-center gap-[7px] no-underline px-7 py-3 rounded-[28px]"
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#F9F5EC',
          background: '#2A2218',
          boxShadow: hovered
            ? '0 10px 32px rgba(42,34,24,0.18), 0 3px 10px rgba(42,34,24,0.10)'
            : '0 4px 16px rgba(42,34,24,0.14), 0 1px 4px rgba(42,34,24,0.08)',
          transition: 'box-shadow 0.28s ease',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
      </Link>
    </motion.div>
  )
}