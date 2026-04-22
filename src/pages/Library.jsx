import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

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
    insight: { icon: 'ri-timer-line', label: 'Science', title: 'The Depth Equation', body: 'Newport\'s formula is blunt: High-Quality Work Produced = Time Spent × Intensity of Focus. Doubling your time is hard. Doubling your intensity through distraction-free sessions is achievable tonight. The Pomodoro sessions in Viram are structured to maximise intensity — not just duration.' },
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
    insight: { icon: 'ri-scissors-cut-line', label: 'Practice', title: 'Apply the 90% Rule Now', body: 'Open your phone\'s screen time report. Look at every app you used this week. Ask honestly: does this score a 90 or above in terms of the value it adds to your life? Whatever doesn\'t make the cut, you already know what to do.' },
  },
]

const AUTHORS = [
  { icon: 'ri-seedling-line',    name: 'James Clear'    },
  { icon: 'ri-brain-line',      name: 'Cal Newport'    },
  { icon: 'ri-mind-map',        name: 'Joseph Murphy'  },
  { icon: 'ri-smartphone-line', name: 'Tristan Harris' },
  { icon: 'ri-scissors-cut-line', name: 'Greg McKeown' },
]

// Global CSS — only for things Tailwind can't handle inline
const STYLES = `
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.7)} }
  .lib-prose {
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: #888888;
    line-height: 1.9;
    letter-spacing: 0.005em;
  }
  .lib-prose strong { color: #cccccc; font-weight: 600; }
`

export default function Library() {
  const storedUser = localStorage.getItem('viram_user');
  const isLoggedIn = !!storedUser;
  return (
    <>
      <style>{STYLES}</style>

      <div className="fixed inset-0 bg-black z-10 flex flex-col overflow-hidden">

        {/* ── Top bar ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-[14px] border-b border-[#1a1a1a] bg-black/95 backdrop-blur-xl sticky top-0 z-50 flex-shrink-0">
          <Link
            to={isLoggedIn ? "/dashboard" : "/"}
            className="flex items-center gap-2 text-[13px] font-semibold text-[#888888] hover:text-white transition-colors duration-200 font-dm-sans no-underline"
          >
            <i className="ri-arrow-left-line" /> Back
          </Link>

          <div className="font-syne text-[15px] font-black flex items-center gap-2 text-white tracking-wide">
            <i className="ri-book-open-line text-[#888888]" /> Mind Library
          </div>

          {/* spacer to keep title centred */}
          <div className="w-[60px]" />
        </div>

        {/* ── Scrollable body ─────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <div className="text-center px-6 pt-20 pb-16 relative overflow-hidden border-b border-[#1a1a1a]">
            {/* Radial glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] rounded-full"
                style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.03) 0%, transparent 65%)', filter: 'blur(60px)' }}
              />
            </div>

            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-[7px] text-[10px] tracking-[0.2em] text-[#cccccc] uppercase font-bold font-dm-sans px-[14px] py-[5px] rounded-full border border-[#2a2a2a] bg-white/[0.03] mb-6"
            >
              <span
                className="w-[6px] h-[6px] rounded-full bg-white inline-block"
                style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}
              />
              Viram Mind Library
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
              className="font-syne font-black leading-[1.02] tracking-[-0.04em] text-white mb-5"
              style={{ fontSize: 'clamp(32px, 6vw, 62px)' }}
            >
              The Knowledge That<br />
              <span className="text-[#555555]">Changes Everything</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.18 } }}
              className="text-[17px] text-[#555555] max-w-[580px] mx-auto leading-[1.75] mb-8 font-dm-sans"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic' }}
            >
              This is not a collection of quotes. This is a distillation of the most important
              ideas on attention, identity, and human potential — structured to actually change
              how you think and act.
            </motion.p>

            {/* Author pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.28 } }}
              className="flex flex-wrap gap-[10px] justify-center"
            >
              {AUTHORS.map(a => (
                <div
                  key={a.name}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-[#2a2a2a] text-sm text-[#888888] font-dm-sans transition-all duration-200 hover:border-[#555555] hover:text-[#cccccc]"
                >
                  <i className={`${a.icon} text-[#555555]`} />{a.name}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Chapters ─────────────────────────────────────────────────── */}
          <div className="max-w-[720px] mx-auto px-6 py-16 pb-28">
            {CHAPTERS.map((ch, idx) => (
              <div key={ch.num}>
                <motion.article
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-4"
                >
                  {/* Chapter badge */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="inline-flex items-center gap-2 px-3 py-[5px] rounded-full bg-white/[0.03] border border-[#2a2a2a] text-[10px] tracking-[0.16em] text-[#888888] uppercase font-bold font-dm-sans">
                      <i className={ch.icon} /> Chapter {ch.num} — {ch.label}
                    </div>
                  </div>

                  {/* Chapter heading */}
                  <h2
                    className="font-syne font-black tracking-[-0.03em] text-white mb-2 leading-[1.15]"
                    style={{ fontSize: 'clamp(22px, 3.5vw, 34px)' }}
                  >
                    {ch.title}
                  </h2>
                  <p
                    className="text-[#666666] text-[16px] mb-8 leading-[1.65]"
                    style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic' }}
                  >
                    {ch.subtitle}
                  </p>

                  {/* Body paragraphs */}
                  {ch.paras.map((p, i) => (
                    <p key={i} className="lib-prose mb-5">{p}</p>
                  ))}

                  {/* Pull quote */}
                  <div className="relative border-l-[2px] border-white pl-6 py-4 my-10 bg-white/[0.02] rounded-r-xl">
                    {/* decorative opening quote */}
                    <div
                      className="absolute -top-3 left-4 text-[56px] text-white/10 leading-none select-none"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      "
                    </div>
                    <p
                      className="text-[19px] text-white leading-[1.65] mb-2"
                      style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic' }}
                    >
                      {ch.pullquote.text}
                    </p>
                    <p className="text-[11px] text-[#555555] font-bold tracking-[0.12em] font-dm-sans uppercase">
                      {ch.pullquote.source}
                    </p>
                  </div>

                  {/* Insight card */}
                  <div className="relative bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl p-5 my-6 overflow-hidden">
                    {/* top accent line — BNW gradient */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-white/40 via-white/10 to-transparent" />

                    <div className="flex items-center gap-2 text-[10px] tracking-[0.14em] text-[#888888] uppercase font-bold font-dm-sans mb-[10px]">
                      <i className={ch.insight.icon} /> {ch.insight.label}
                    </div>
                    <div className="font-syne text-[14px] font-black text-white mb-2">
                      {ch.insight.title}
                    </div>
                    <div className="text-[13px] text-[#666666] leading-[1.75] font-dm-sans">
                      {ch.insight.body}
                    </div>
                  </div>
                </motion.article>

                {/* Divider between chapters */}
                {idx < CHAPTERS.length - 1 && (
                  <div className="flex items-center gap-4 my-16">
                    <div className="flex-1 h-px bg-[#1a1a1a]" />
                    <div className="w-8 h-8 rounded-full bg-[#0a0a0a] border border-[#2a2a2a] flex items-center justify-center">
                      <i className="ri-sparkling-line text-[#3a3a3a] text-xs" />
                    </div>
                    <div className="flex-1 h-px bg-[#1a1a1a]" />
                  </div>
                )}
              </div>
            ))}

            {/* End note */}
            <div className="text-center mt-20 pt-10 border-t border-[#1a1a1a]">
              <p
                className="text-[#555555] text-[16px] leading-[1.8] max-w-[420px] mx-auto"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic' }}
              >
                The knowledge exists. The question is always the same: what will you do
                with it when you close this page?
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}