import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  RiCodeSSlashLine,
  RiGlobalLine,
  RiGithubLine,
  RiTwitterXLine,
  RiArrowRightUpLine,
  RiSparkling2Line,
  RiRocketLine,
  RiHeartLine,
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
  @keyframes float     { 0%,100%{transform:translateY(0px)}    50%{transform:translateY(-8px)}     }
  @keyframes spin-slow { from{transform:rotate(0deg)}          to{transform:rotate(360deg)}         }
`

const TEAM = [
  {
    name:     'Samrat Parajuli',
    handle:   '@SamratVsn',
    role:     'Co-Founder & Lead Developer',
    tags:     ['Android', 'Systems Engineering', 'Full Stack'],
    bio:      'Learning Android developer and systems engineer from Nepal. Building Viram from the ground up from the avatar engine to the focus session backend. Obsessed with clean architecture and making discipline feel like a game worth playing.',
    website:  'https://www.samratparajuli0.com.np',
    github:   'https://github.com/SamratVsn',
    twitter:  null,
    initials: 'SP',
    placeholder: false,
  },
  {
    name:     'Prince Timilsina',
    handle:   '@prince.env',
    role:     'Co-Founder',
    tags:     ['Website', 'Systems Engineering', 'Full Stack'],
    bio:      '.................',
    website:  null,
    github:   'https://github.com/PrinceTimilsina',
    twitter:  null,
    initials: 'PT',
    placeholder: false,
  },
]

const VALUES = [
  {
    Icon: RiHeartLine,
    title: 'Built with intention',
    body:  "Every feature exists to fight distraction, not feed it. We refuse to add anything that doesn't serve the mission.",
  },
  {
    Icon: RiCodeSSlashLine,
    title: 'Small team, big scope',
    body:  'Two builders. No VC money. No bloated roadmap. Just two people who got sick of being the product and decided to build the antidote.',
  },
  {
    Icon: RiRocketLine,
    title: 'Shipping fast',
    body:  'Viram is being built in public. Expect rough edges, fast iterations, and genuine curiosity about what actually helps people focus.',
  },
]

const STACK = [
  { label: 'React',  icon: 'ri-reactjs-line'     },
//   { label: 'Node.js',          icon: 'ri-server-line'      },
//   { label: 'PostgreSQL',       icon: 'ri-database-2-line'  },
  { label: 'Framer Motion',    icon: 'ri-magic-line'       },
  { label: 'Tailwind CSS',     icon: 'ri-paint-brush-line' },
]

function AvatarOrb({ initials, floating }) {
  return (
    <div className="relative flex-shrink-0">
      <svg
        className="absolute -inset-[10px] w-[calc(100%+20px)] h-[calc(100%+20px)]"
        style={{ animation: 'spin-slow 18s linear infinite' }}
        viewBox="0 0 140 140"
      >
        <circle cx="70" cy="70" r="66" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 9" />
      </svg>
      <div
        className="w-[110px] h-[110px] rounded-full bg-[#0a0a0a] border border-[#2a2a2a] flex items-center justify-center"
        style={{ animation: floating ? 'float 5s ease-in-out infinite' : 'none' }}
      >
        <span className="font-syne font-black text-[28px] text-white tracking-tight select-none">
          {initials}
        </span>
      </div>
    </div>
  )
}

export default function Developers() {
  return (
    <>
      <style>{STYLES}</style>
      <NavBar />
      <div className="min-h-screen bg-black overflow-x-hidden pt-[70px]">

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="px-[5vw] pt-20 pb-20 border-b border-[#1a1a1a] relative overflow-hidden text-center">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full"
              style={{ background: 'radial-gradient(ellipse,rgba(255,255,255,0.04) 0%,transparent 65%)', filter: 'blur(60px)' }}
            />
          </div>

          <div className="relative z-[2] max-w-[640px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-[7px] text-[10px] tracking-[0.2em] text-[#cccccc] uppercase font-bold font-dm-sans px-[14px] py-[5px] rounded-full border border-[#2a2a2a] bg-white/[0.03] mb-6"
            >
              <RiSparkling2Line size={11} /> The people behind it
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.08 } }}
              className="font-syne font-black leading-[0.96] tracking-[-0.04em] text-white mb-6"
              style={{ fontSize: 'clamp(42px, 7vw, 80px)' }}
            >
              Built by two<br />
              <span className="text-[#555555]">obsessed people.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.16 } }}
              className="text-[15px] text-[#888888] font-dm-sans leading-[1.85]"
            >
              No VC. No growth team. No dark patterns. Just two builders from Nepal who
              got tired of watching their own attention get sold — and decided to do
              something about it.
            </motion.p>
          </div>
        </section>

        {/* ── TEAM CARDS ────────────────────────────────────────────────── */}
        <section className="px-[5vw] py-[100px] border-b border-[#1a1a1a]">
          <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
            {TEAM.map((person, i) => (
              <motion.div
                key={person.name}
                {...fadeUp(i * 0.1)}
                className={`relative p-8 rounded-[24px] border bg-[#0a0a0a] flex flex-col gap-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${person.placeholder ? 'border-[#1a1a1a] opacity-60' : 'border-[#2a2a2a] hover:border-[#3a3a3a]'}`}
              >
                {/* top shimmer */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-white/20 via-white/5 to-transparent" />

                {/* Avatar + name */}
                <div className="flex items-center gap-6">
                  <AvatarOrb initials={person.initials} floating={!person.placeholder} />
                  <div>
                    <div className="font-syne font-black text-white text-xl leading-tight mb-[5px]">
                      {person.name}
                    </div>
                    <div className="text-[12px] text-[#444444] font-dm-sans tracking-[0.05em]">
                      {person.handle}
                    </div>
                  </div>
                </div>

                {/* Role */}
                <div className="inline-flex self-start items-center px-3 py-[5px] rounded-full border border-[#2a2a2a] bg-white/[0.03] text-[10px] font-bold text-[#888888] font-dm-sans tracking-[0.1em] uppercase">
                  {person.role}
                </div>

                {/* Skill tags */}
                <div className="flex flex-wrap gap-[7px]">
                  {person.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-[4px] rounded-full bg-white/[0.03] border border-[#1a1a1a] text-[11px] text-[#555555] font-dm-sans"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bio */}
                <p className="text-[14px] text-[#555555] font-dm-sans leading-[1.8] flex-1">
                  {person.bio}
                </p>

                {/* Links */}
                <div className="pt-4 border-t border-[#1a1a1a]">
                  {!person.placeholder ? (
                    <div className="flex items-center gap-4 flex-wrap">
                      {person.website && (
                        <a href={person.website} target="_blank" rel="noreferrer"
                          className="flex items-center gap-[5px] text-[12px] text-[#555555] font-dm-sans font-semibold no-underline transition-colors duration-200 hover:text-white"
                        >
                          <RiGlobalLine size={13} /> Website <RiArrowRightUpLine size={10} />
                        </a>
                      )}
                      {person.github && (
                        <a href={person.github} target="_blank" rel="noreferrer"
                          className="flex items-center gap-[5px] text-[12px] text-[#555555] font-dm-sans font-semibold no-underline transition-colors duration-200 hover:text-white"
                        >
                          <RiGithubLine size={13} /> GitHub <RiArrowRightUpLine size={10} />
                        </a>
                      )}
                      {person.twitter && (
                        <a href={person.twitter} target="_blank" rel="noreferrer"
                          className="flex items-center gap-[5px] text-[12px] text-[#555555] font-dm-sans font-semibold no-underline transition-colors duration-200 hover:text-white"
                        >
                          <RiTwitterXLine size={13} /> X <RiArrowRightUpLine size={10} />
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span
                        className="w-[6px] h-[6px] rounded-full bg-white/20 inline-block"
                        style={{ animation: 'pulse-dot 2.5s ease-in-out infinite' }}
                      />
                      <span className="text-[11px] text-[#333333] font-dm-sans">Profile details coming soon</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── VALUES ────────────────────────────────────────────────────── */}
        <section className="px-[5vw] py-[100px] border-b border-[#1a1a1a]">
          <div className="max-w-[900px] mx-auto">
            <motion.div {...fadeUp(0)}
              className="inline-flex items-center gap-[7px] text-[10px] tracking-[0.2em] text-[#cccccc] uppercase font-bold font-dm-sans px-[14px] py-[5px] rounded-full border border-[#2a2a2a] bg-white/[0.03] mb-[22px]"
            >
              <RiHeartLine size={11} /> How we build
            </motion.div>
            <motion.h2 {...fadeUp(0.06)}
              className="font-syne font-black leading-[1.05] tracking-[-0.04em] text-white mb-14"
              style={{ fontSize: 'clamp(26px,4vw,48px)' }}
            >
              The principles<br />we ship with.
            </motion.h2>

            <div className="flex flex-col gap-[2px]">
              {VALUES.map(({ Icon, title, body }, i) => (
                <motion.div key={title} {...fadeUp(i * 0.08)}
                  className="flex items-start gap-6 px-6 py-6 rounded-[14px] border border-[#1a1a1a] bg-white/[0.015] cursor-default transition-all duration-200 hover:bg-white/[0.035] hover:border-[#2a2a2a]"
                >
                  <div className="w-10 h-10 rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] flex items-center justify-center flex-shrink-0 text-[#888888]">
                    <Icon size={17} />
                  </div>
                  <div>
                    <div className="font-syne font-black text-white text-[15px] mb-[6px]">{title}</div>
                    <div className="text-[13px] text-[#555555] font-dm-sans leading-[1.75]">{body}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TECH STACK ────────────────────────────────────────────────── */}
        <section className="px-[5vw] py-[100px] border-b border-[#1a1a1a]">
          <div className="max-w-[900px] mx-auto">
            <motion.div {...fadeUp(0)}
              className="inline-flex items-center gap-[7px] text-[10px] tracking-[0.2em] text-[#cccccc] uppercase font-bold font-dm-sans px-[14px] py-[5px] rounded-full border border-[#2a2a2a] bg-white/[0.03] mb-[22px]"
            >
              <RiCodeSSlashLine size={11} /> Stack
            </motion.div>
            <motion.h2 {...fadeUp(0.06)}
              className="font-syne font-black leading-[1.05] tracking-[-0.04em] text-white mb-14"
              style={{ fontSize: 'clamp(26px,4vw,48px)' }}
            >
              What Viram<br />is made of.
            </motion.h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-[10px]">
              {STACK.map(({ label, icon }, i) => (
                <motion.div key={label} {...fadeUp(i * 0.06)}
                  className="flex items-center gap-3 px-5 py-4 rounded-[14px] border border-[#1a1a1a] bg-[#0a0a0a] cursor-default transition-all duration-200 hover:border-[#2a2a2a]"
                >
                  <i className={`${icon} text-[#444444] text-base`} />
                  <span className="font-dm-sans text-[13px] text-[#666666] font-semibold">{label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <section className="px-[5vw] py-[100px] text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(ellipse,rgba(255,255,255,0.03) 0%,transparent 60%)', filter: 'blur(70px)' }}
            />
          </div>

          <motion.h2 {...fadeUp(0)}
            className="font-syne font-black leading-[1.0] tracking-[-0.04em] text-white mb-5"
            style={{ fontSize: 'clamp(28px,5vw,56px)' }}
          >
            Want to say hi<br />or collaborate?
          </motion.h2>
          <motion.p {...fadeUp(0.06)}
            className="text-[15px] text-[#555555] font-dm-sans leading-[1.8] mb-10 max-w-[340px] mx-auto"
          >
            We're a small team, so we actually read every message we get.
          </motion.p>
          <motion.div {...fadeUp(0.12)} className="flex gap-3 justify-center flex-wrap">
            <Link to="/contact"
              className="px-8 py-[15px] rounded-full bg-white text-black text-[15px] font-bold font-dm-sans no-underline flex items-center gap-2 transition-all duration-200 shadow-[0_8px_40px_rgba(255,255,255,0.1)] hover:bg-[#e8e8e8] hover:-translate-y-[2px]"
            >
              Get in touch
            </Link>
            <a href="https://www.samratparajuli0.com.np" target="_blank" rel="noreferrer"
              className="px-7 py-[15px] rounded-full bg-white/[0.04] text-[#e8e8e8] border border-[#2a2a2a] text-[15px] font-semibold font-dm-sans no-underline flex items-center gap-2 transition-all duration-200 hover:bg-white/[0.08] hover:border-[#555555]"
            >
              <RiGlobalLine size={15} /> Samrat's site
            </a>
          </motion.div>
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