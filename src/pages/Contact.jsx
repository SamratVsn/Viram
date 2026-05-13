import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  RiMailSendLine,
  RiDiscordLine,
  RiTwitterXLine,
  RiGithubLine,
  RiArrowRightUpLine,
  RiTimeLine,
  RiQuillPenLine,
  RiCheckLine,
  RiSendPlaneLine,
  RiChat1Line,
} from 'react-icons/ri'
import NavBar from '../components/NavBar'

/* ─── Design Tokens ─────────────────────────────────────── */
const T = {
  bg:       '#F4EEE3',
  card:     '#F9F5EC',
  inkHigh:  '#2A2218',
  inkMid:   '#5A4E42',
  inkLow:   '#8A7B6E',
  inkGhost: 'rgba(55,38,22,0.18)',
  border:   'rgba(55,38,22,0.07)',
  accent:   '#B8704E',
  accentBg: 'rgba(184,112,78,0.08)',
  heading:  "'Cormorant Garamond', Georgia, serif",
  body:     "'Jost', system-ui, sans-serif",
  rSm:      '12px',
  rMd:      '18px',
  rLg:      '28px',
}

/* Grain SVG as data URI */
const GRAIN_URL =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

/* ─── Framer variants ────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-60px' },
  transition:  { duration: 0.88, delay, ease: [0.22, 1, 0.36, 1] },
})

const fadeIn = (delay = 0) => ({
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.88, delay, ease: [0.22, 1, 0.36, 1] },
})

/* ─── Channels ───────────────────────────────────────────── */
const CHANNELS = [
  {
    Icon:   RiMailSendLine,
    title:  'Email',
    body:   'For general questions, partnerships, or press enquiries. We read every message.',
    action: 'hello@viram.app',
    href:   'mailto:hello@viram.app',
    label:  'Send an email',
  },
  {
    Icon:   RiDiscordLine,
    title:  'Discord',
    body:   'Real-time community. Ask questions, share streaks, and get early feature access.',
    action: 'discord.gg/viram',
    href:   'https://discord.gg/viram',
    label:  'Open Discord',
  },
  {
    Icon:   RiTwitterXLine,
    title:  'X / Twitter',
    body:   'Follow for product updates, focus challenges, and the occasional stoic thought.',
    action: '@viramapp',
    href:   'https://twitter.com/viramapp',
    label:  'Follow on X',
  },
  {
    Icon:   RiGithubLine,
    title:  'GitHub',
    body:   'Browse our SDKs and community integrations. Pull requests are always welcome.',
    action: 'github.com/viram',
    href:   'https://github.com/viram',
    label:  'View on GitHub',
  },
]

const TOPICS = [
  'General enquiry',
  'Developer / API',
  'Partnership',
  'Press & media',
  'Bug report',
  'Feature request',
]

/* ─── Inline styles (non-Tailwind) ──────────────────────── */
const GLOBAL = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Jost:wght@300;400;500;600&display=swap');

  :root {
    --bg:      ${T.bg};
    --card:    ${T.card};
    --ink-hi:  ${T.inkHigh};
    --ink-mid: ${T.inkMid};
    --ink-low: ${T.inkLow};
    --border:  ${T.border};
    --accent:  ${T.accent};
    --r-sm:    ${T.rSm};
    --r-md:    ${T.rMd};
    --r-lg:    ${T.rLg};
  }

  /* Paper grain overlay — applied as ::after on .viram-bg */
  .viram-bg {
    background-color: var(--bg);
    position: relative;
  }
  .viram-bg::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: ${GRAIN_URL};
    background-repeat: repeat;
    opacity: 0.03;
    pointer-events: none;
    z-index: 9999;
  }

  /* Card grain */
  .viram-card {
    position: relative;
    overflow: hidden;
  }
  .viram-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: ${GRAIN_URL};
    background-repeat: repeat;
    opacity: 0.03;
    pointer-events: none;
    z-index: 1;
  }
  .viram-card > * { position: relative; z-index: 2; }

  /* Input / Textarea */
  .viram-input {
    width: 100%;
    background: ${T.bg};
    border: 1px solid rgba(55,38,22,0.12);
    border-radius: var(--r-sm);
    padding: 13px 16px;
    font-family: ${T.body};
    font-size: 14px;
    font-weight: 400;
    color: var(--ink-hi);
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s;
    resize: none;
    letter-spacing: 0.01em;
  }
  .viram-input::placeholder { color: rgba(55,38,22,0.25); }
  .viram-input:focus {
    border-color: rgba(184,112,78,0.45);
    box-shadow: 0 0 0 3px rgba(184,112,78,0.07);
  }

  /* Pulse dot */
  @keyframes pulse-dot {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: .4; transform: scale(.7); }
  }
`

/* ─── Chip / pill label ─────────────────────────────────── */
function Chip({ children, icon: Icon }) {
  return (
    <div style={{
      display:       'inline-flex',
      alignItems:    'center',
      gap:           6,
      fontFamily:    T.body,
      fontSize:      10,
      fontWeight:    600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color:         T.accent,
      background:    T.accentBg,
      border:        `1px solid rgba(184,112,78,0.18)`,
      borderRadius:  100,
      padding:       '5px 14px',
      marginBottom:  22,
    }}>
      {Icon && <Icon size={10} />}
      {children}
    </div>
  )
}

/* ─── Divider ────────────────────────────────────────────── */
function Divider() {
  return (
    <div style={{ borderTop: `1px solid ${T.border}`, margin: '0' }} />
  )
}

/* ─── Component ─────────────────────────────────────────── */
export default function Contact() {
  const [topic,   setTopic]   = useState('')
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [message, setMessage] = useState('')
  const [sent,    setSent]    = useState(false)
  const [sending, setSending] = useState(false)
  const [sendErr, setSendErr] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setSendErr('Please enter a valid email address.')
      return
    }

    setSending(true)
    setSendErr('')

    const subject = encodeURIComponent(`[Viram] ${topic || 'General enquiry'}`)
    const body = encodeURIComponent(
      `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`
    )
    window.location.href = `mailto:hello@viram.app?subject=${subject}&body=${body}`
    setSent(true)
    setSending(false)
  }

  return (
    <>
      <style>{GLOBAL}</style>
      <NavBar />

      <div className="viram-bg" style={{ minHeight: '100vh', overflowX: 'hidden' }}>

        {/* ── HERO ─────────────────────────────────────────── */}
        <section style={{
          padding:      'clamp(72px,10vw,120px) 6vw clamp(64px,8vw,96px)',
          borderBottom: `1px solid ${T.border}`,
          textAlign:    'center',
        }}>
          <motion.div {...fadeIn(0)}>
            <Chip>We're listening</Chip>
          </motion.div>

          <motion.h1 {...fadeIn(0.08)} style={{
            fontFamily:    T.heading,
            fontWeight:    700,
            fontSize:      'clamp(44px,7vw,84px)',
            lineHeight:    1.0,
            letterSpacing: '-0.02em',
            color:         T.inkHigh,
            marginBottom:  20,
          }}>
            Get in touch<span style={{ color: T.accent }}>.</span>
          </motion.h1>

          <motion.p {...fadeIn(0.16)} style={{
            fontFamily:  T.body,
            fontWeight:  300,
            fontSize:    16,
            lineHeight:  1.9,
            color:       T.inkMid,
            maxWidth:    460,
            margin:      '0 auto',
            letterSpacing: '0.01em',
          }}>
            Whether you're a developer with a question, a journalist writing about
            the attention economy, or just someone who wants to say hello — we're here.
          </motion.p>
        </section>

        {/* ── CHANNELS ─────────────────────────────────────── */}
        <section style={{ padding: 'clamp(64px,9vw,100px) 6vw', borderBottom: `1px solid ${T.border}` }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            <motion.div {...fadeUp(0)}><Chip icon={RiChat1Line}>Channels</Chip></motion.div>

            <motion.h2 {...fadeUp(0.06)} style={{
              fontFamily:    T.heading,
              fontWeight:    600,
              fontSize:      'clamp(28px,4vw,48px)',
              lineHeight:    1.05,
              letterSpacing: '-0.02em',
              color:         T.inkHigh,
              marginBottom:  52,
            }}>
              Pick your channel.
            </motion.h2>

            <div style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap:                 16,
            }}>
              {CHANNELS.map(({ Icon, title, body, action, href, label }, i) => (
                <motion.a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  {...fadeUp(i * 0.07)}
                  whileHover={{ y: -3, boxShadow: `0 12px 40px rgba(55,38,22,0.10)` }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="viram-card"
                  style={{
                    display:         'flex',
                    flexDirection:   'column',
                    textDecoration:  'none',
                    background:      T.card,
                    border:          `1px solid ${T.border}`,
                    borderRadius:    T.rLg,
                    padding:         28,
                    boxShadow:       `0 2px 12px rgba(55,38,22,0.04)`,
                    transition:      'box-shadow 0.3s',
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width:        44,
                    height:       44,
                    borderRadius: T.rSm,
                    border:       `1px solid rgba(184,112,78,0.2)`,
                    background:   T.accentBg,
                    display:      'flex',
                    alignItems:   'center',
                    justifyContent: 'center',
                    color:        T.accent,
                    marginBottom: 20,
                    flexShrink:   0,
                  }}>
                    <Icon size={18} />
                  </div>

                  <div style={{ fontFamily: T.heading, fontWeight: 600, fontSize: 18, color: T.inkHigh, marginBottom: 8 }}>
                    {title}
                  </div>
                  <div style={{ fontFamily: T.body, fontWeight: 300, fontSize: 13, color: T.inkMid, lineHeight: 1.75, flex: 1, marginBottom: 20 }}>
                    {body}
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ fontFamily: T.body, fontSize: 11, color: T.inkLow, marginBottom: 10, letterSpacing: '0.04em' }}>
                      {action}
                    </div>
                    <div style={{
                      display:     'inline-flex',
                      alignItems:  'center',
                      gap:         5,
                      fontFamily:  T.body,
                      fontWeight:  500,
                      fontSize:    12,
                      color:       T.accent,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}>
                      {label} <RiArrowRightUpLine size={11} />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ── FORM ─────────────────────────────────────────── */}
        <section style={{ padding: 'clamp(72px,10vw,120px) 6vw' }}>
          <div style={{
            maxWidth:             1080,
            margin:               '0 auto',
            display:              'grid',
            gridTemplateColumns:  'repeat(auto-fit, minmax(300px, 1fr))',
            gap:                  'clamp(48px,6vw,96px)',
            alignItems:           'start',
          }}>

            {/* Left: copy */}
            <div style={{ position: 'sticky', top: 110 }}>
              <motion.div {...fadeUp(0)}><Chip icon={RiQuillPenLine}>Direct message</Chip></motion.div>

              <motion.h2 {...fadeUp(0.06)} style={{
                fontFamily:    T.heading,
                fontWeight:    700,
                fontSize:      'clamp(32px,4.5vw,58px)',
                lineHeight:    1.0,
                letterSpacing: '-0.02em',
                color:         T.inkHigh,
                marginBottom:  20,
              }}>
                Send us a<br />
                <em style={{ color: T.accent, fontStyle: 'italic' }}>message.</em>
              </motion.h2>

              <motion.p {...fadeUp(0.12)} style={{
                fontFamily:  T.body,
                fontWeight:  300,
                fontSize:    15,
                color:       T.inkMid,
                lineHeight:  1.9,
                maxWidth:    320,
                marginBottom: 36,
                letterSpacing: '0.01em',
              }}>
                We aim to respond within one business day. For urgent questions,
                Discord is usually faster.
              </motion.p>

              {/* Response time badge */}
              <motion.div {...fadeUp(0.16)} className="viram-card" style={{
                display:      'inline-flex',
                alignItems:   'center',
                gap:          16,
                padding:      '16px 22px',
                background:   T.card,
                border:       `1px solid ${T.border}`,
                borderRadius: T.rMd,
                boxShadow:    `0 2px 12px rgba(55,38,22,0.05)`,
              }}>
                <div style={{
                  width:          38,
                  height:         38,
                  borderRadius:   '50%',
                  border:         `1px solid rgba(184,112,78,0.2)`,
                  background:     T.accentBg,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  color:          T.accent,
                  flexShrink:     0,
                }}>
                  <RiTimeLine size={15} />
                </div>
                <div>
                  <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.inkLow, marginBottom: 2 }}>
                    Avg. response time
                  </div>
                  <div style={{ fontFamily: T.heading, fontWeight: 600, fontSize: 18, color: T.inkHigh }}>
                    &lt; 24 hours
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: form */}
            <motion.div {...fadeUp(0.1)}>
              {sent ? (
                /* ── Success state ── */
                <div className="viram-card" style={{
                  padding:      52,
                  background:   T.card,
                  border:       `1px solid ${T.border}`,
                  borderRadius: T.rLg,
                  textAlign:    'center',
                  boxShadow:    `0 4px 24px rgba(55,38,22,0.06)`,
                }}>
                  <div style={{
                    width:          56,
                    height:         56,
                    borderRadius:   '50%',
                    border:         `1px solid rgba(184,112,78,0.3)`,
                    background:     T.accentBg,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    margin:         '0 auto 24px',
                    color:          T.accent,
                  }}>
                    <RiCheckLine size={24} />
                  </div>
                  <div style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 26, color: T.inkHigh, marginBottom: 12 }}>
                    Message sent.
                  </div>
                  <p style={{ fontFamily: T.body, fontWeight: 300, fontSize: 14, color: T.inkMid, lineHeight: 1.8, maxWidth: 280, margin: '0 auto 32px' }}>
                    We've got it. Expect a reply within 24 hours — usually much sooner.
                  </p>
                  <button
                    onClick={() => { setSent(false); setName(''); setEmail(''); setMessage(''); setTopic('') }}
                    style={{
                      background:    'none',
                      border:        'none',
                      fontFamily:    T.body,
                      fontWeight:    500,
                      fontSize:      13,
                      color:         T.accent,
                      cursor:        'pointer',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Send another →
                  </button>
                </div>
              ) : (
                /* ── Form ── */
                <form
                  onSubmit={handleSubmit}
                  className="viram-card"
                  style={{
                    padding:      36,
                    background:   T.card,
                    border:       `1px solid ${T.border}`,
                    borderRadius: T.rLg,
                    boxShadow:    `0 4px 24px rgba(55,38,22,0.06)`,
                    display:      'flex',
                    flexDirection: 'column',
                    gap:          28,
                  }}
                >
                  {/* Topic pills */}
                  <div>
                    <label style={{ display: 'block', fontFamily: T.body, fontWeight: 600, fontSize: 10, color: T.inkMid, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12 }}>
                      Topic
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {TOPICS.map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTopic(t)}
                          style={{
                            padding:       '7px 14px',
                            borderRadius:  100,
                            fontFamily:    T.body,
                            fontWeight:    500,
                            fontSize:      11,
                            letterSpacing: '0.04em',
                            border:        topic === t ? `1px solid ${T.accent}` : `1px solid rgba(55,38,22,0.12)`,
                            background:    topic === t ? T.accentBg : 'transparent',
                            color:         topic === t ? T.accent : T.inkMid,
                            cursor:        'pointer',
                            transition:    'all 0.2s ease',
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hairline divider */}
                  <Divider />

                  {/* Name + Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {[
                      { label: 'Name', type: 'text', placeholder: 'Your name',       val: name,  set: setName },
                      { label: 'Email', type: 'email', placeholder: 'you@example.com', val: email, set: setEmail },
                    ].map(({ label, type, placeholder, val, set }) => (
                      <div key={label}>
                        <label style={{ display: 'block', fontFamily: T.body, fontWeight: 600, fontSize: 10, color: T.inkMid, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>
                          {label}
                        </label>
                        <input
                          type={type}
                          className="viram-input"
                          placeholder={placeholder}
                          value={val}
                          onChange={e => set(e.target.value)}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  {/* Message */}
                  <div>
                    <label style={{ display: 'block', fontFamily: T.body, fontWeight: 600, fontSize: 10, color: T.inkMid, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>
                      Message
                    </label>
                    <textarea
                      className="viram-input"
                      placeholder="What's on your mind?"
                      rows={6}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <Divider />

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    whileHover={{ y: -2, boxShadow: `0 14px 36px rgba(184,112,78,0.28)` }}
                    whileTap={{ y: 0, boxShadow: 'none' }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      width:          '100%',
                      padding:        '15px 24px',
                      borderRadius:   100,
                      background:     T.accent,
                      border:         'none',
                      color:          '#FFF8F2',
                      fontFamily:     T.body,
                      fontWeight:     600,
                      fontSize:       13,
                      letterSpacing:  '0.1em',
                      textTransform:  'uppercase',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      gap:            8,
                      cursor:         'pointer',
                      boxShadow:      `0 4px 18px rgba(184,112,78,0.22)`,
                    }}
                  >
                    <RiSendPlaneLine size={14} /> Send message
                  </motion.button>

                  <p style={{ fontFamily: T.body, fontWeight: 300, fontSize: 11, color: T.inkLow, textAlign: 'center', lineHeight: 1.6, letterSpacing: '0.02em' }}>
                    No marketing, no spam. Your message goes directly to the team.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </section>

        {/* ── FOOTER STRIP ─────────────────────────────────── */}
        <div style={{
          borderTop:      `1px solid ${T.border}`,
          padding:        '24px 6vw',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          flexWrap:       'wrap',
          gap:            12,
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 20, letterSpacing: '0.14em', color: T.inkHigh }}>
              VI<span style={{ color: T.accent }}>RAM</span>
            </span>
          </Link>

          <div style={{ fontFamily: T.body, fontWeight: 300, fontSize: 12, color: T.inkLow, letterSpacing: '0.02em' }}>
            © 2026 Viram. Built for those who refuse to be the product.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: T.body, fontSize: 12, color: T.inkLow }}>
            <span
              style={{
                width:        7,
                height:       7,
                borderRadius: '50%',
                background:   T.accent,
                display:      'inline-block',
                animation:    'pulse-dot 2.4s ease-in-out infinite',
              }}
            />
            Systems online
          </div>
        </div>

      </div>
    </>
  )
}