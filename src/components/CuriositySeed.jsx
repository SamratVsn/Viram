import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // eslint-disable-line no-unused-vars
import { RiSparkling2Line, RiArrowRightSLine, RiRefreshLine, RiBookOpenLine } from 'react-icons/ri'

const T = {
  bg: '#F4EEE3', card: '#F9F5EC', cardDeep: '#EDE5D4',
  inkHigh: '#2A2218', inkMid: '#5A4E42', inkLow: '#8A7B6E',
  border: 'rgba(55,38,22,0.07)', borderMid: 'rgba(55,38,22,0.13)',
  accent: '#B8704E', accentBg: 'rgba(184,112,78,0.08)', accentBorder: 'rgba(184,112,78,0.22)',
  green: '#6B8F5E',
  heading: "'Cormorant Garamond', Georgia, serif", body: "'Jost', system-ui, sans-serif",
  rSm: '8px', rLg: '22px', rPill: '100px',
}
const ease = [0.22, 1, 0.36, 1]

const SEEDS = [
  { category: 'Coding', fact: 'The first "computer bug" was an actual moth found inside the Harvard Mark II in 1947.', link: 'https://en.wikipedia.org/wiki/Software_bug' },
  { category: 'Coding', fact: 'Python was named after Monty Python’s Flying Circus — not the snake.', link: 'https://en.wikipedia.org/wiki/Python_(programming_language)' },
  { category: 'Coding', fact: 'The first computer programmer was Ada Lovelace, who wrote an algorithm for a machine that didn\'t exist yet.', link: 'https://en.wikipedia.org/wiki/Ada_Lovelace' },
  { category: 'Coding', fact: 'There are over 700 programming languages in existence today.', link: 'https://en.wikipedia.org/wiki/List_of_programming_languages' },
  { category: 'Coding', fact: 'The QWERTY keyboard was designed to slow typists down — to prevent mechanical jams.', link: 'https://en.wikipedia.org/wiki/QWERTY' },
  { category: 'Coding', fact: 'Git\'s original name was "information manager from hell" before Linus Torvalds renamed it.', link: 'https://en.wikipedia.org/wiki/Git' },
  { category: 'Science', fact: 'Honey never spoils. Archaeologists found 3000-year-old honey in Egyptian tombs that was still edible.', link: 'https://en.wikipedia.org/wiki/Honey' },
  { category: 'Science', fact: 'A day on Venus is longer than a year on Venus (243 Earth days vs 225 Earth days).', link: 'https://en.wikipedia.org/wiki/Venus' },
  { category: 'Science', fact: 'Octopuses have three hearts, nine brains, and blue blood.', link: 'https://en.wikipedia.org/wiki/Octopus' },
  { category: 'Science', fact: 'Bananas are technically berries, but strawberries are not.', link: 'https://en.wikipedia.org/wiki/Berry' },
  { category: 'Science', fact: 'The human brain can store about 2.5 petabytes of information — equivalent to 3 million hours of TV.', link: 'https://en.wikipedia.org/wiki/Human_brain' },
  { category: 'Science', fact: 'Light takes about 8 minutes and 20 seconds to travel from the Sun to Earth.', link: 'https://en.wikipedia.org/wiki/Light' },
  { category: 'Philosophy', fact: 'The word "philosophy" comes from Greek: "philo" (love) and "sophia" (wisdom) — love of wisdom.', link: 'https://en.wikipedia.org/wiki/Philosophy' },
  { category: 'Philosophy', fact: 'Socrates never wrote anything. Everything we know about him comes from Plato\'s writings.', link: 'https://en.wikipedia.org/wiki/Socrates' },
  { category: 'Philosophy', fact: 'The Stoic practice of "premeditatio malorum" means visualizing worst-case scenarios to reduce anxiety.', link: 'https://en.wikipedia.org/wiki/Premeditatio_malorum' },
  { category: 'Philosophy', fact: 'The Chinese philosopher Lao Tzu is believed to have written the Tao Te Ching — but his existence is debated.', link: 'https://en.wikipedia.org/wiki/Laozi' },
  { category: 'Philosophy', fact: 'Descartes\' "I think, therefore I am" was his answer to radical doubt — the one thing he could not doubt.', link: 'https://en.wikipedia.org/wiki/Cogito,_ergo_sum' },
  { category: 'Philosophy', fact: 'The "Ship of Theseus" paradox asks: if you replace every part of a ship, is it still the same ship?', link: 'https://en.wikipedia.org/wiki/Ship_of_Theseus' },
]

function getRandomSeed(exclude) {
  const pool = exclude ? SEEDS.filter(s => s.fact !== exclude.fact) : SEEDS
  return pool[Math.floor(Math.random() * pool.length)]
}

export default function CuriositySeed() {
  const [seed, setSeed] = useState(null)
  const [show, setShow] = useState(false)

  function discover() {
    setSeed(getRandomSeed(seed))
    setShow(true)
  }

  const categoryColors = {
    Coding: { bg: 'rgba(184,112,78,0.10)', border: 'rgba(184,112,78,0.22)', color: T.accent },
    Science: { bg: T.greenBg || 'rgba(107,143,94,0.10)', border: 'rgba(107,143,94,0.25)', color: T.green || '#6B8F5E' },
    Philosophy: { bg: 'rgba(42,34,24,0.06)', border: 'rgba(42,34,24,0.12)', color: T.inkMid },
  }
  const cc = seed ? categoryColors[seed.category] || categoryColors.Coding : {}

  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: T.rLg, padding: '18px 20px',
      boxShadow: `0 2px 12px rgba(55,38,22,0.06), inset 0 1px 0 rgba(255,255,255,0.55)`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: seed ? 14 : 16 }}>
        <RiSparkling2Line size={13} color={T.accentDim} />
        <span style={{
          fontFamily: T.body, fontSize: 9, fontWeight: 600,
          letterSpacing: '0.22em', textTransform: 'uppercase', color: T.inkLow,
        }}>
          Curiosity Seed
        </span>
        <div style={{ flex: 1, height: 1, background: T.border }} />
      </div>

      <AnimatePresence mode="wait">
        {seed && show ? (
          <motion.div
            key={seed.fact}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease }}
          >
            {/* Category badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: T.rPill,
              background: cc.bg || T.cardDeep, border: `1px solid ${cc.border || T.border}`,
              marginBottom: 10,
            }}>
              <span style={{
                fontFamily: T.body, fontSize: 9, fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: cc.color || T.inkLow,
              }}>
                {seed.category}
              </span>
            </div>

            <p style={{
              fontFamily: T.heading, fontWeight: 600, fontStyle: 'italic',
              fontSize: 15, color: T.inkHigh, lineHeight: 1.6, marginBottom: 14,
            }}>
              "{seed.fact}"
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <motion.a
                href={seed.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ gap: 10 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontFamily: T.body, fontSize: 11, fontWeight: 500,
                  color: T.accent, textDecoration: 'none',
                  padding: '6px 14px', borderRadius: T.rPill,
                  background: T.accentBg, border: `1px solid ${T.accentBorder}`,
                  transition: 'all 0.2s',
                }}
              >
                <RiBookOpenLine size={11} />
                Learn More
                <RiArrowRightSLine size={12} />
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                onClick={discover}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '6px 14px', borderRadius: T.rPill,
                  background: 'transparent', border: `1px solid ${T.borderMid}`,
                  cursor: 'pointer', fontFamily: T.body, fontSize: 10,
                  fontWeight: 500, color: T.inkLow,
                  transition: 'all 0.2s',
                }}
              >
                <RiRefreshLine size={11} />
                Another
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center' }}
          >
            <p style={{
              fontFamily: T.body, fontWeight: 300, fontSize: 12.5,
              color: T.inkMid, lineHeight: 1.6, marginBottom: 14,
            }}>
              Replace the urge to scroll with a moment of genuine discovery.
            </p>
            <motion.button
              whileHover={{ y: -2, boxShadow: `0 8px 24px rgba(184,112,78,0.25)` }}
              whileTap={{ scale: 0.97 }}
              onClick={discover}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 28px', borderRadius: T.rPill,
                background: T.accent, border: 'none', cursor: 'pointer',
                fontFamily: T.body, fontWeight: 600, fontSize: 12,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#FFF8F2',
                boxShadow: `0 4px 14px rgba(184,112,78,0.20)`,
              }}
            >
              <RiSparkling2Line size={13} />
              Discover
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
