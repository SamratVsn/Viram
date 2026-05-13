import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiSparkling2Line, RiArrowRightSLine, RiRefreshLine,
  RiBookOpenLine, RiBrainLine, RiLeafLine, RiTimerFlashLine,
  RiMentalHealthLine, RiFlashlightLine, RiHeartPulseLine,
} from 'react-icons/ri'

/* ─── Tokens ────────────────────────────────────────────── */
const T = {
  bg:           '#F4EEE3',
  card:         '#F9F5EC',
  cardDeep:     '#EDE5D4',
  inkHigh:      '#2A2218',
  inkMid:       '#5A4E42',
  inkLow:       '#8A7B6E',
  inkGhost:     'rgba(55,38,22,0.15)',
  border:       'rgba(55,38,22,0.07)',
  borderMid:    'rgba(55,38,22,0.13)',
  accent:       '#B8704E',
  accentBg:     'rgba(184,112,78,0.08)',
  accentBorder: 'rgba(184,112,78,0.22)',
  accentDim:    'rgba(184,112,78,0.35)',
  green:        '#6B8F5E',
  greenBg:      'rgba(107,143,94,0.09)',
  greenBorder:  'rgba(107,143,94,0.22)',
  blue:         '#5E7A8F',
  blueBg:       'rgba(94,122,143,0.09)',
  blueBorder:   'rgba(94,122,143,0.22)',
  purple:       '#7A6E9A',
  purpleBg:     'rgba(122,110,154,0.09)',
  purpleBorder: 'rgba(122,110,154,0.22)',
  heading:      "'Cormorant Garamond', Georgia, serif",
  body:         "'Jost', system-ui, sans-serif",
  rSm:  '8px',
  rMd:  '14px',
  rLg:  '22px',
  rPill:'100px',
}
const ease = [0.22, 1, 0.36, 1]

/* ─── Category config ───────────────────────────────────── */
const CATEGORIES = {
  Neuroscience: {
    icon:   RiBrainLine,
    color:  T.purple,
    bg:     T.purpleBg,
    border: T.purpleBorder,
    desc:   'How your brain actually works',
  },
  'Deep Work': {
    icon:   RiTimerFlashLine,
    color:  T.accent,
    bg:     T.accentBg,
    border: T.accentBorder,
    desc:   'The science of focus',
  },
  Habits: {
    icon:   RiLeafLine,
    color:  T.green,
    bg:     T.greenBg,
    border: T.greenBorder,
    desc:   'How behaviour changes',
  },
  Mindfulness: {
    icon:   RiMentalHealthLine,
    color:  T.blue,
    bg:     T.blueBg,
    border: T.blueBorder,
    desc:   'Presence & awareness',
  },
  Philosophy: {
    icon:   RiFlashlightLine,
    color:  T.inkMid,
    bg:     'rgba(90,78,66,0.07)',
    border: 'rgba(90,78,66,0.18)',
    desc:   'Ideas that reframe everything',
  },
  Wellbeing: {
    icon:   RiHeartPulseLine,
    color:  '#A0634E',
    bg:     'rgba(160,99,78,0.08)',
    border: 'rgba(160,99,78,0.20)',
    desc:   'Body, mind, energy',
  },
}

/* ─── Seeds (productivity / recovery focused) ───────────── */
const SEEDS = [
  /* Neuroscience */
  {
    category: 'Neuroscience',
    headline: 'Dopamine is about wanting, not having.',
    fact: 'Dopamine is not released when you get a reward — it fires in anticipation of one. Social media exploits this: the scroll is the dopamine hit, not the content.',
    link: 'https://en.wikipedia.org/wiki/Dopamine',
    source: 'Neuroscience Research',
  },
  {
    category: 'Neuroscience',
    headline: 'Your brain physically shrinks under chronic distraction.',
    fact: 'Studies show that heavy multitaskers have less grey matter density in the anterior cingulate cortex — the region responsible for sustained attention and impulse control.',
    link: 'https://www.pnas.org/doi/10.1073/pnas.1011023107',
    source: 'PNAS, 2011',
  },
  {
    category: 'Neuroscience',
    headline: 'Boredom activates your brain\'s most powerful network.',
    fact: 'When you\'re bored, your brain\'s Default Mode Network activates — the same system behind creativity, empathy, and self-reflection. Boredom is not empty. It\'s full.',
    link: 'https://en.wikipedia.org/wiki/Default_mode_network',
    source: 'Nature Neuroscience',
  },
  {
    category: 'Neuroscience',
    headline: 'Every notification resets your focus clock.',
    fact: 'It takes an average of 23 minutes to fully regain deep focus after an interruption. A phone with 50 daily notifications can effectively destroy your entire productive capacity.',
    link: 'https://ics.uci.edu/~gmark/chi08-mark.pdf',
    source: 'UC Irvine Study',
  },
  {
    category: 'Neuroscience',
    headline: 'Sleep is when your brain cleans itself.',
    fact: 'The glymphatic system — your brain\'s waste-clearance mechanism — is almost exclusively active during deep sleep. Poor sleep literally leaves toxic proteins in your brain.',
    link: 'https://en.wikipedia.org/wiki/Glymphatic_system',
    source: 'Science Journal, 2013',
  },
  {
    category: 'Neuroscience',
    headline: 'Your attention is a finite daily resource.',
    fact: 'Decision fatigue is real: the quality of your decisions degrades after each one. This is why judges grant parole more often in the morning — and why protecting your mornings matters.',
    link: 'https://en.wikipedia.org/wiki/Decision_fatigue',
    source: 'PNAS Research',
  },

  /* Deep Work */
  {
    category: 'Deep Work',
    headline: 'The 4-hour creative limit.',
    fact: 'Research on elite performers — chess grandmasters, concert pianists, Olympic athletes — consistently shows that almost none sustain more than 4 hours of true deep work per day.',
    link: 'https://en.wikipedia.org/wiki/K._Anders_Ericsson',
    source: 'Anders Ericsson Research',
  },
  {
    category: 'Deep Work',
    headline: 'Flow states require 15 minutes of unbroken entry.',
    fact: 'Getting into a flow state requires roughly 15 uninterrupted minutes of focused work. One notification resets the counter entirely. Guard those first 15 minutes fiercely.',
    link: 'https://en.wikipedia.org/wiki/Flow_(psychology)',
    source: 'Mihaly Csikszentmihalyi',
  },
  {
    category: 'Deep Work',
    headline: 'Depth is becoming rare — and therefore valuable.',
    fact: 'As shallow work (emails, meetings, reactive tasks) dominates most careers, the ability to produce deep, cognitively demanding work becomes exponentially more valuable.',
    link: 'https://en.wikipedia.org/wiki/Deep_Work',
    source: 'Cal Newport',
  },
  {
    category: 'Deep Work',
    headline: 'Time blocking outperforms to-do lists.',
    fact: 'A to-do list tells you what to do. A time block tells you when. Research shows time-blocked work is completed 2-3x more reliably than tasks left unscheduled.',
    link: 'https://en.wikipedia.org/wiki/Timeblocking',
    source: 'Productivity Research',
  },
  {
    category: 'Deep Work',
    headline: 'The Pomodoro effect is neuroscience, not folklore.',
    fact: 'Working in focused bursts with deliberate breaks leverages your ultradian rhythm — a 90-minute biological cycle of high and low cognitive alertness.',
    link: 'https://en.wikipedia.org/wiki/Ultradian_rhythm',
    source: 'Chronobiology Research',
  },

  /* Habits */
  {
    category: 'Habits',
    headline: 'Habits run on a 3-part neurological loop.',
    fact: 'Every habit follows: Cue → Routine → Reward. Social media exploits all three simultaneously: boredom (cue), scroll (routine), variable likes (reward). Awareness of the loop is the first escape.',
    link: 'https://en.wikipedia.org/wiki/The_Power_of_Habit',
    source: 'Charles Duhigg',
  },
  {
    category: 'Habits',
    headline: 'Identity beats motivation every time.',
    fact: '"I\'m trying to quit Instagram" is weaker than "I\'m someone who doesn\'t scroll mindlessly." Framing change as identity — not willpower — is the single most effective behaviour-change technique.',
    link: 'https://en.wikipedia.org/wiki/Atomic_Habits',
    source: 'James Clear',
  },
  {
    category: 'Habits',
    headline: 'Habit stacking requires no extra willpower.',
    fact: 'Attaching a new habit to an existing one (after I pour my coffee, I will write for 10 minutes) uses neural pathways already built — requiring far less cognitive effort than building from scratch.',
    link: 'https://jamesclear.com/habit-stacking',
    source: 'James Clear',
  },
  {
    category: 'Habits',
    headline: 'The 2-minute rule eliminates procrastination.',
    fact: 'If a new habit takes less than 2 minutes to start, do it now. The goal isn\'t the 2 minutes — it\'s the act of beginning. Beginning is the hardest neurological step.',
    link: 'https://jamesclear.com/how-to-stop-procrastinating',
    source: 'GTD / James Clear',
  },
  {
    category: 'Habits',
    headline: 'Environment design beats willpower design.',
    fact: 'Removing your phone from your bedroom increases sleep quality more reliably than any resolve to "use it less." Change what\'s visible and you change what\'s inevitable.',
    link: 'https://en.wikipedia.org/wiki/Nudge_theory',
    source: 'Behavioural Economics',
  },

  /* Mindfulness */
  {
    category: 'Mindfulness',
    headline: 'The mind wanders 47% of the time.',
    fact: 'A Harvard study tracking 2,250 people found that the human mind wanders nearly half of all waking hours — and that mind-wandering, not the activity itself, is the primary predictor of unhappiness.',
    link: 'https://science.sciencemag.org/content/330/6006/932',
    source: 'Harvard / Science, 2010',
  },
  {
    category: 'Mindfulness',
    headline: '8 weeks of meditation physically changes your brain.',
    fact: 'MRI studies show that 8 weeks of mindfulness practice measurably increases grey matter density in the hippocampus (memory, learning) and decreases it in the amygdala (stress, anxiety).',
    link: 'https://en.wikipedia.org/wiki/Neuroplasticity',
    source: 'Harvard Medical School',
  },
  {
    category: 'Mindfulness',
    headline: 'You cannot think your way to presence.',
    fact: 'Presence is not achieved by thinking about the present moment — it arrives when you stop narrating experience and simply inhabit it. The observer and the observed must become one.',
    link: 'https://en.wikipedia.org/wiki/Mindfulness',
    source: 'Jon Kabat-Zinn',
  },
  {
    category: 'Mindfulness',
    headline: 'Deep breathing directly calms your nervous system.',
    fact: 'Extending your exhale longer than your inhale activates the parasympathetic nervous system within seconds. A 4-second inhale and 8-second exhale is measurably more effective than any app notification.',
    link: 'https://en.wikipedia.org/wiki/Diaphragmatic_breathing',
    source: 'Clinical Neuroscience',
  },

  /* Philosophy */
  {
    category: 'Philosophy',
    headline: 'Seneca on wasted time.',
    fact: '"It is not that we have a short time to live, but that we waste a great deal of it." Seneca wrote this 2,000 years ago. Nothing has changed — except the thing we waste it on.',
    link: 'https://en.wikipedia.org/wiki/On_the_Shortness_of_Life',
    source: 'Seneca, On the Shortness of Life',
  },
  {
    category: 'Philosophy',
    headline: 'The Stoics practised daily attention audits.',
    fact: 'Each evening, Marcus Aurelius would review his day: Where did I give my attention? Did I act with purpose? This practice — called evening reflection — is the original journaling.',
    link: 'https://en.wikipedia.org/wiki/Meditations',
    source: 'Marcus Aurelius, Meditations',
  },
  {
    category: 'Philosophy',
    headline: 'Thoreau saw distraction as theft.',
    fact: '"The cost of a thing is the amount of life which is required to be exchanged for it." By Thoreau\'s logic, one hour of mindless scrolling costs one hour of your finite life. Nothing more, nothing less.',
    link: 'https://en.wikipedia.org/wiki/Walden',
    source: 'Henry David Thoreau, Walden',
  },
  {
    category: 'Philosophy',
    headline: 'Pascal diagnosed the modern condition in 1654.',
    fact: '"All of humanity\'s problems stem from man\'s inability to sit quietly in a room alone." Pascal wrote this before smartphones, before television, before radio. The impulse to escape ourselves is ancient.',
    link: 'https://en.wikipedia.org/wiki/Blaise_Pascal',
    source: 'Blaise Pascal, Pensées',
  },
  {
    category: 'Philosophy',
    headline: 'Epictetus on what you control.',
    fact: 'The Stoic Dichotomy of Control: some things are in your power (thoughts, choices, responses) and some are not (others\' opinions, outcomes, the algorithm). Suffering comes from confusing the two.',
    link: 'https://en.wikipedia.org/wiki/Epictetus',
    source: 'Epictetus, Enchiridion',
  },

  /* Wellbeing */
  {
    category: 'Wellbeing',
    headline: 'Exercise is more effective than antidepressants for mild depression.',
    fact: 'A Duke University study found that 30 minutes of aerobic exercise 3x per week was as effective as sertraline (Zoloft) for reducing depression — with lower relapse rates at 10-month follow-up.',
    link: 'https://en.wikipedia.org/wiki/Exercise_and_mental_health',
    source: 'Duke University, 1999',
  },
  {
    category: 'Wellbeing',
    headline: 'Social connection predicts longevity more than smoking or obesity.',
    fact: 'A meta-analysis of 148 studies found that people with strong social relationships had a 50% increased likelihood of survival. Loneliness — not fat, not cigarettes — is the greatest health crisis.',
    link: 'https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1000316',
    source: 'PLOS Medicine, 2010',
  },
  {
    category: 'Wellbeing',
    headline: 'Spending time in nature lowers cortisol measurably.',
    fact: '20 minutes in a natural setting — not exercising, just sitting — significantly lowers cortisol (the primary stress hormone). This is the most time-efficient stress reduction technique known.',
    link: 'https://www.frontiersin.org/articles/10.3389/fpsyg.2019.00722',
    source: 'Frontiers in Psychology, 2019',
  },
  {
    category: 'Wellbeing',
    headline: 'Gratitude rewires your brain toward positive attention bias.',
    fact: 'Writing down 3 specific things you\'re grateful for, for 21 consecutive days, measurably shifts your brain\'s scanning pattern — training it to notice positive stimuli it previously filtered out.',
    link: 'https://en.wikipedia.org/wiki/Gratitude',
    source: 'Shawn Achor, The Happiness Advantage',
  },
]

/* ─── Deterministic daily seed ──────────────────────────── */
function getDailySeed() {
  const day = Math.floor(Date.now() / 86400000)
  return SEEDS[day % SEEDS.length]
}

/* ─── Saved today check ─────────────────────────────────── */
function getSavedSeed() {
  try {
    const s = JSON.parse(localStorage.getItem('viram_curiosity') || 'null')
    if (s && s.date === new Date().toDateString()) return s.seed
  } catch { /* ignore */ }
  return null
}
function saveSeed(seed) {
  localStorage.setItem('viram_curiosity', JSON.stringify({ date: new Date().toDateString(), seed }))
}

/* ═══ COMPONENT ════════════════════════════════════════════ */
export default function CuriositySeed() {
  const [seed, setSeed]         = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [saved, setSaved]       = useState(false)

  useEffect(() => {
    const existing = getSavedSeed()
    if (existing) {
      setSeed(existing)
      setRevealed(true)
      setSaved(true)
    } else {
      setSeed(getDailySeed())
    }
  }, [])

  function reveal() {
    setRevealed(true)
    saveSeed(seed)
    setSaved(true)
  }

  function nextSeed() {
    const pool   = SEEDS.filter(s => s.headline !== seed?.headline)
    const next   = pool[Math.floor(Math.random() * pool.length)]
    setSeed(next)
    saveSeed(next)
  }

  if (!seed) return null

  const cat = CATEGORIES[seed.category] || CATEGORIES['Deep Work']
  const CatIcon = cat.icon

  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: T.rLg,
      overflow: 'hidden',
      boxShadow: `0 2px 12px rgba(55,38,22,0.06), inset 0 1px 0 rgba(255,255,255,0.55)`,
    }}>

      {/* Top accent line */}
      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)`, opacity: 0.5 }} />

      <div style={{ padding: '16px 18px' }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <RiSparkling2Line size={10} color={T.accentDim} />
          <span style={{ fontFamily: T.body, fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.inkLow }}>
            Curiosity Seed
          </span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
          {/* Category badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: T.rPill,
            background: cat.bg, border: `1px solid ${cat.border}`,
          }}>
            <CatIcon size={9} color={cat.color} />
            <span style={{ fontFamily: T.body, fontSize: 8.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: cat.color }}>
              {seed.category}
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">

          {/* ── UNREVEALED state ─────────────────────────── */}
          {!revealed && (
            <motion.div
              key="unrevealed"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease }}
            >
              {/* Blurred preview */}
              <div style={{ position: 'relative', marginBottom: 16 }}>
                <p style={{
                  fontFamily: T.heading, fontWeight: 600, fontStyle: 'italic',
                  fontSize: 16, color: T.inkHigh, lineHeight: 1.55,
                  filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none',
                  marginBottom: 4,
                }}>
                  {seed.headline}
                </p>
                {/* Overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    fontFamily: T.body, fontWeight: 300, fontSize: 11,
                    color: T.inkLow, fontStyle: 'italic', letterSpacing: '0.04em',
                  }}>
                    Something worth knowing awaits…
                  </div>
                </div>
              </div>

              <p style={{
                fontFamily: T.body, fontWeight: 300, fontSize: 12,
                color: T.inkMid, lineHeight: 1.65, marginBottom: 16,
              }}>
                Replace the urge to scroll with one moment of genuine discovery.
              </p>

              <motion.button
                whileHover={{ y: -2, boxShadow: `0 10px 28px rgba(184,112,78,0.28)` }}
                whileTap={{ scale: 0.97 }}
                onClick={reveal}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '11px 26px', borderRadius: T.rPill,
                  background: T.accent, border: 'none', cursor: 'pointer',
                  fontFamily: T.body, fontWeight: 600, fontSize: 11.5,
                  letterSpacing: '0.09em', textTransform: 'uppercase',
                  color: '#FFF8F2',
                  boxShadow: `0 4px 16px rgba(184,112,78,0.22)`,
                  transition: 'box-shadow 0.25s ease',
                }}
              >
                <RiSparkling2Line size={12} />
                Reveal today's seed
              </motion.button>
            </motion.div>
          )}

          {/* ── REVEALED state ───────────────────────────── */}
          {revealed && (
            <motion.div
              key={seed.headline}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease }}
            >
              {/* Headline */}
              <p style={{
                fontFamily: T.heading, fontWeight: 700, fontStyle: 'italic',
                fontSize: 17, color: T.inkHigh, lineHeight: 1.45, marginBottom: 10,
                letterSpacing: '-0.01em',
              }}>
                "{seed.headline}"
              </p>

              {/* Divider */}
              <div style={{ height: 1, background: T.border, marginBottom: 12 }} />

              {/* Body fact */}
              <p style={{
                fontFamily: T.body, fontWeight: 300, fontSize: 12.5,
                color: T.inkMid, lineHeight: 1.75, marginBottom: 14,
              }}>
                {seed.fact}
              </p>

              {/* Source + actions row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>

                {/* Source pill */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: T.rPill,
                  background: T.cardDeep, border: `1px solid ${T.borderMid}`,
                }}>
                  <span style={{ fontFamily: T.body, fontSize: 9, fontWeight: 500, color: T.inkLow, letterSpacing: '0.06em' }}>
                    {seed.source}
                  </span>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <motion.a
                    href={seed.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -1 }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '6px 13px', borderRadius: T.rPill,
                      background: cat.bg, border: `1px solid ${cat.border}`,
                      fontFamily: T.body, fontSize: 10.5, fontWeight: 500,
                      color: cat.color, textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    <RiBookOpenLine size={10} />
                    Read more
                    <RiArrowRightSLine size={11} />
                  </motion.a>

                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                    onClick={nextSeed}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '6px 13px', borderRadius: T.rPill,
                      background: 'transparent', border: `1px solid ${T.borderMid}`,
                      cursor: 'pointer', fontFamily: T.body, fontSize: 10.5,
                      fontWeight: 500, color: T.inkLow,
                      transition: 'all 0.2s',
                    }}
                  >
                    <RiRefreshLine size={10} />
                    Next
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}