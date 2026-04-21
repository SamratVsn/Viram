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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] },
})

const STYLES = `
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.7)} }
  .input-field {
    width: 100%;
    background: #050505;
    border: 1px solid #1a1a1a;
    border-radius: 12px;
    padding: 13px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #cccccc;
    outline: none;
    transition: border-color 0.2s;
    resize: none;
  }
  .input-field::placeholder { color: #2a2a2a; }
  .input-field:focus         { border-color: #444444; }
`

const CHANNELS = [
  {
    Icon:   RiMailSendLine,
    title:  'Email us',
    body:   'For general questions, partnerships, or press enquiries. We read every message.',
    action: 'hello@viram.app',
    href:   'mailto:hello@viram.app',
    label:  'Send an email',
  },
  {
    Icon:   RiDiscordLine,
    title:  'Discord',
    body:   'Real-time community. Ask questions, share streaks, and get early access to features.',
    action: 'discord.gg/viram',
    href:   'https://discord.gg/viram',
    label:  'Open Discord',
  },
  {
    Icon:   RiTwitterXLine,
    title:  'Find us on X',
    body:   'Follow for product updates, focus challenges, and the occasional stoic thought.',
    action: '@viramapp',
    href:   'https://twitter.com/viramapp',
    label:  'Follow on X',
  },
  {
    Icon:   RiGithubLine,
    title:  'GitHub',
    body:   'Browse our SDKs and community integrations. PRs welcome.',
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

export default function Contact() {
  const [topic,   setTopic]   = useState('')
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [message, setMessage] = useState('')
  const [sent,    setSent]    = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!name || !email || !message) return
    // wire up your real form handler (e.g. Resend, Formspree) here
    setSent(true)
  }

  return (
    <>
      <style>{STYLES}</style>
      <NavBar />
      <div className="min-h-screen bg-black overflow-x-hidden pt-[70px]">

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="px-[5vw] pt-20 pb-16 border-b border-[#1a1a1a] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full"
              style={{ background: 'radial-gradient(ellipse,rgba(255,255,255,0.03) 0%,transparent 65%)', filter: 'blur(70px)' }}
            />
          </div>

          <div className="max-w-[640px] mx-auto text-center relative z-[2]">
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-[7px] text-[10px] tracking-[0.2em] text-[#cccccc] uppercase font-bold font-dm-sans px-[14px] py-[5px] rounded-full border border-[#2a2a2a] bg-white/[0.03] mb-6"
            >
              <span
                className="w-[6px] h-[6px] rounded-full bg-white inline-block"
                style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}
              />
              We're listening
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.08 } }}
              className="font-syne font-black leading-[1.0] tracking-[-0.04em] text-white mb-5"
              style={{ fontSize: 'clamp(40px,6vw,72px)' }}
            >
              Get in touch.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.16 } }}
              className="text-[15px] text-[#666666] font-dm-sans leading-[1.85] max-w-[440px] mx-auto"
            >
              Whether you're a developer with a question, a journalist writing about the
              attention economy, or just someone who wants to say hi — we're here.
            </motion.p>
          </div>
        </section>

        {/* ── CHANNELS ──────────────────────────────────────────────────── */}
        <section className="px-[5vw] py-[80px] border-b border-[#1a1a1a]">
          <div className="max-w-[1100px] mx-auto">
            <motion.div {...fadeUp(0)}
              className="inline-flex items-center gap-[7px] text-[10px] tracking-[0.2em] text-[#cccccc] uppercase font-bold font-dm-sans px-[14px] py-[5px] rounded-full border border-[#2a2a2a] bg-white/[0.03] mb-[22px]"
            >
              <RiChat1Line size={11} /> Channels
            </motion.div>
            <motion.h2 {...fadeUp(0.06)}
              className="font-syne font-black leading-[1.05] tracking-[-0.04em] text-white mb-14"
              style={{ fontSize: 'clamp(26px,4vw,48px)' }}
            >
              Pick your channel.
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px]">
              {CHANNELS.map(({ Icon, title, body, action, href, label }, i) => (
                <motion.a
                  key={title} href={href} target="_blank" rel="noreferrer"
                  {...fadeUp(i * 0.07)}
                  className="group p-6 rounded-[18px] border border-[#1a1a1a] bg-[#0a0a0a] flex flex-col no-underline transition-all duration-[250ms] hover:border-[#3a3a3a] hover:-translate-y-[3px]"
                >
                  <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center mb-5 border border-[#2a2a2a] bg-white/[0.03] text-[#888888] transition-all duration-200 group-hover:border-[#444444] group-hover:text-[#cccccc]">
                    <Icon size={18} />
                  </div>
                  <div className="font-syne text-sm font-black text-white mb-[7px]">{title}</div>
                  <div className="text-xs text-[#555555] leading-[1.7] font-dm-sans mb-5 flex-1">{body}</div>
                  <div className="mt-auto">
                    <div className="text-[11px] font-mono text-[#444444] mb-3 truncate">{action}</div>
                    <div className="inline-flex items-center gap-[5px] text-[11px] font-bold text-[#666666] font-dm-sans tracking-[0.04em] transition-colors duration-200 group-hover:text-white">
                      {label} <RiArrowRightUpLine size={10} />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ── FORM ──────────────────────────────────────────────────────── */}
        <section className="px-[5vw] py-[100px]">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

            {/* Left: copy */}
            <div className="lg:sticky lg:top-[100px]">
              <motion.div {...fadeUp(0)}
                className="inline-flex items-center gap-[7px] text-[10px] tracking-[0.2em] text-[#cccccc] uppercase font-bold font-dm-sans px-[14px] py-[5px] rounded-full border border-[#2a2a2a] bg-white/[0.03] mb-6"
              >
                <RiQuillPenLine size={11} /> Direct message
              </motion.div>

              <motion.h2 {...fadeUp(0.06)}
                className="font-syne font-black leading-[1.0] tracking-[-0.04em] text-white mb-5"
                style={{ fontSize: 'clamp(28px,4vw,52px)' }}
              >
                Send us a<br />
                <span
                  className="text-[#555555]"
                  style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic' }}
                >
                  message.
                </span>
              </motion.h2>

              <motion.p {...fadeUp(0.12)}
                className="text-[15px] text-[#444444] font-dm-sans leading-[1.85] max-w-[340px] mb-10"
              >
                We aim to respond within one business day. For urgent questions,
                Discord is faster.
              </motion.p>

              {/* Response time badge */}
              <motion.div {...fadeUp(0.16)}
                className="inline-flex items-center gap-3 px-5 py-[14px] rounded-[14px] border border-[#1a1a1a] bg-[#0a0a0a]"
              >
                <div className="w-8 h-8 rounded-full border border-[#2a2a2a] flex items-center justify-center flex-shrink-0 text-[#666666]">
                  <RiTimeLine size={15} />
                </div>
                <div>
                  <div className="text-[10px] text-[#444444] font-dm-sans uppercase tracking-[0.1em] font-bold mb-[2px]">
                    Avg. response time
                  </div>
                  <div className="font-syne font-black text-white text-[15px]">&lt; 24 hours</div>
                </div>
              </motion.div>
            </div>

            {/* Right: form */}
            <motion.div {...fadeUp(0.08)}>
              {sent ? (
                /* ── Success state ── */
                <div className="p-10 rounded-[22px] border border-[#2a2a2a] bg-[#0a0a0a] text-center">
                  <div className="w-14 h-14 rounded-full border border-[#2a2a2a] flex items-center justify-center mx-auto mb-6 text-white">
                    <RiCheckLine size={26} />
                  </div>
                  <div className="font-syne font-black text-white text-xl mb-3">Message sent.</div>
                  <p className="text-[14px] text-[#555555] font-dm-sans leading-[1.75] max-w-[280px] mx-auto mb-8">
                    We've got it. Expect a reply within 24 hours — usually much sooner.
                  </p>
                  <button
                    onClick={() => { setSent(false); setName(''); setEmail(''); setMessage(''); setTopic('') }}
                    className="text-[13px] text-[#666666] font-dm-sans font-semibold hover:text-white transition-colors duration-200"
                  >
                    Send another →
                  </button>
                </div>
              ) : (
                /* ── Form ── */
                <form
                  onSubmit={handleSubmit}
                  className="p-8 rounded-[22px] border border-[#1a1a1a] bg-[#0a0a0a] flex flex-col gap-5"
                >
                  {/* Topic pills */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#444444] uppercase tracking-[0.12em] font-dm-sans mb-[10px]">
                      Topic
                    </label>
                    <div className="flex flex-wrap gap-[7px]">
                      {TOPICS.map(t => (
                        <button
                          key={t} type="button"
                          onClick={() => setTopic(t)}
                          className={`px-[12px] py-[6px] rounded-full text-[11px] font-semibold font-dm-sans border transition-all duration-150 ${
                            topic === t
                              ? 'bg-white text-black border-white'
                              : 'bg-transparent text-[#444444] border-[#1a1a1a] hover:border-[#333333] hover:text-[#888888]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#444444] uppercase tracking-[0.12em] font-dm-sans mb-2">
                        Name
                      </label>
                      <input
                        className="input-field"
                        placeholder="Your name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#444444] uppercase tracking-[0.12em] font-dm-sans mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="input-field"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#444444] uppercase tracking-[0.12em] font-dm-sans mb-2">
                      Message
                    </label>
                    <textarea
                      className="input-field"
                      placeholder="What's on your mind?"
                      rows={6}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full py-[14px] rounded-full bg-white text-black text-sm font-black font-dm-sans tracking-[0.03em] flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#e8e8e8] hover:-translate-y-[2px] hover:shadow-[0_10px_32px_rgba(255,255,255,0.15)]"
                  >
                    <RiSendPlaneLine size={15} /> Send message
                  </button>

                  <p className="text-[11px] text-[#2a2a2a] font-dm-sans text-center leading-[1.6]">
                    No marketing, no spam. Your message goes directly to the team.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </section>

        {/* ── FOOTER STRIP ──────────────────────────────────────────────── */}
        <div className="border-t border-[#1a1a1a] px-[5vw] py-6 flex items-center justify-between flex-wrap gap-3">
          <Link to="/" className="font-syne font-black tracking-[0.18em] no-underline">
            <span className="text-white">VI</span><span className="text-[#3a3a3a]">RAM</span>
          </Link>
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

      </div>
    </>
  )
}