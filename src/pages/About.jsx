import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  RiCodeSSlashLine,
  RiGlobalLine,
  RiGithubLine,
  RiTwitterXLine,
  RiArrowRightUpLine,
  RiSparkling2Line,
  RiRocketLine,
  RiHeartLine,
  RiPaintBrushLine,
  RiMagicLine,
  RiReactjsLine,
} from "react-icons/ri";
import NavBar from "../components/NavBar";

/* ─── Font loader ─────────────────────────────────────────────────────────── */
const FontLoader = () => (
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap"
  />
);

/* ─── Grain overlay ───────────────────────────────────────────────────────── */
const Grain = () => (
  <div
    aria-hidden="true"
    className="absolute inset-0 pointer-events-none z-0 rounded-[inherit]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)' opacity='0.03'/%3E%3C/svg%3E")`,
    }}
  />
);

/* ─── Pulse dot ───────────────────────────────────────────────────────────── */
const PulseDot = ({ color = "#B8704E" }) => (
  <motion.span
    animate={{ opacity: [1, 0.35, 1], scale: [1, 0.55, 1] }}
    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
    className="inline-block w-[5px] h-[5px] rounded-full flex-shrink-0"
    style={{ background: color }}
  />
);

/* ─── Tag badge ───────────────────────────────────────────────────────────── */
function Tag({ children }) {
  return (
    <div
      className="inline-flex items-center gap-[6px] px-[14px] py-[5px] rounded-full mb-[22px]"
      style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "#5A4E42",
        background: "#EDE8DF",
        border: "1px solid rgba(55,38,22,0.12)",
        boxShadow: "0 1px 3px rgba(42,34,24,0.06)",
      }}
    >
      {children}
    </div>
  );
}

/* ─── Animation helper ────────────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ─── Data ────────────────────────────────────────────────────────────────── */
const TEAM = [
  {
    name: "Samrat Parajuli",
    handle: "@SamratVsn",
    role: "Co-Founder, CTO & Lead Developer",
    tags: ["Android", "Systems Engineering", "Kotlin"],
    bio: "Specializing in Android ecosystems and systems engineering, I thrive on solving complex backend challenges and building native mobile experiences with Kotlin and Jetpack Compose. As the Lead Developer of Viram, I focus on scaling robust focus infrastructure and implementing clean, MVVM-based architectures. With a background spanning over 26 projects, I view coding as a craft—dedicated to building software that is as reliable as it is engaging. I believe discipline shouldn't be a chore; it should be an experience.",
    website: "https://www.samratparajuli0.com.np",
    github: "https://github.com/SamratVsn",
    twitter: "https://x.com/SamratVsn",
    initials: "SP",
  },
  {
    name: "Prince Timilsina",
    handle: "@prince.env",
    role: "Co-Founder, CEO & Product Strategist",
    tags: ["Website", "Intelligent Systems", "Full Stack"],
    bio: "Passionate about technology, problem-solving, and continuous learning, I enjoy building creative projects, exploring new tools, and turning ideas into reality through code. I’m deeply interested in innovation and tech entrepreneurship, always looking for ways to create solutions that make a real impact. One day, while simply thinking about how productivity could be improved, I came up with an idea that kept evolving into something bigger and better. That idea eventually became, 'Viram' — a project built from curiosity, creativity, and the desire to help people work and think more effectively.",
    website: null,
    github: "https://github.com/PrinceTimilsina",
    twitter: null,
    initials: "PT",
  },
];

const VALUES = [
  {
    Icon: RiHeartLine,
    title: "Built with intention",
    body: "Every feature exists to fight distraction, not feed it. We refuse to add anything that doesn't serve the mission.",
  },
  {
    Icon: RiCodeSSlashLine,
    title: "Small team, big scope",
    body: "Two builders. No VC money. No bloated roadmap. Just two people who got sick of being the product and decided to build the antidote.",
  },
  {
    Icon: RiRocketLine,
    title: "Shipping fast",
    body: "Viram is being built in public. Expect rough edges, fast iterations, and genuine curiosity about what actually helps people focus.",
  },
];

const STACK = [
  { label: "React", Icon: RiReactjsLine },
  { label: "Framer Motion", Icon: RiMagicLine },
  { label: "Tailwind CSS", Icon: RiPaintBrushLine },
];

/* ─── Floating avatar orb ─────────────────────────────────────────────────── */
function AvatarOrb({ initials }) {
  return (
    <div className="relative flex-shrink-0 w-[110px] h-[110px]">
      {/* Spinning dashed ring */}
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-[10px] w-[calc(100%+20px)] h-[calc(100%+20px)]"
        viewBox="0 0 140 140"
      >
        <circle
          cx="70"
          cy="70"
          r="66"
          fill="none"
          stroke="rgba(184,112,78,0.18)"
          strokeWidth="1"
          strokeDasharray="4 9"
        />
      </motion.svg>

      {/* Floating circle */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="w-[110px] h-[110px] rounded-full flex items-center justify-center"
        style={{
          background: "#EDE8DF",
          border: "1px solid rgba(55,38,22,0.12)",
          boxShadow: "0 4px 16px rgba(42,34,24,0.10)",
        }}
      >
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 28,
            fontWeight: 600,
            color: "#2A2218",
            letterSpacing: "-0.02em",
            userSelect: "none",
          }}
        >
          {initials}
        </span>
      </motion.div>
    </div>
  );
}

/* ─── Team card ───────────────────────────────────────────────────────────── */
function TeamCard({ person, delay }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      {...fadeUp(delay)}
      className="relative flex flex-col gap-6 p-8 rounded-[28px] overflow-hidden transition-all duration-300"
      style={{
        background: "#F9F5EC",
        border: `1px solid ${hovered ? "rgba(55,38,22,0.18)" : "rgba(55,38,22,0.10)"}`,
        boxShadow: hovered
          ? "0 20px 60px rgba(42,34,24,0.10), 0 6px 20px rgba(42,34,24,0.07)"
          : "0 2px 10px rgba(42,34,24,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Grain />

      {/* Top shimmer line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, rgba(184,112,78,0.3), rgba(184,112,78,0.08), transparent)",
        }}
      />

      {/* Avatar + name */}
      <div className="relative z-[1] flex items-center gap-6">
        <AvatarOrb initials={person.initials} />
        <div>
          <div
            className="leading-tight mb-[5px]"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22,
              fontWeight: 600,
              color: "#2A2218",
              letterSpacing: "-0.01em",
            }}
          >
            {person.name}
          </div>
          <div
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: "0.06em",
              color: "#A89B8C",
            }}
          >
            {person.handle}
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div className="relative z-[1] self-start">
        <div
          className="inline-flex items-center px-3 py-[5px] rounded-full"
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#8A7E74",
            background: "#EDE8DF",
            border: "1px solid rgba(55,38,22,0.10)",
          }}
        >
          {person.role}
        </div>
      </div>

      {/* Skill tags */}
      <div className="relative z-[1] flex flex-wrap gap-[7px]">
        {person.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-[4px] rounded-full"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              fontWeight: 400,
              color: "#A89B8C",
              background: "#EDE8DF",
              border: "1px solid rgba(55,38,22,0.08)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bio */}
      <p
        className="relative z-[1] flex-1 leading-[1.85]"
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 14,
          fontWeight: 400,
          color: "#5A4E42",
          letterSpacing: "0.01em",
        }}
      >
        {person.bio}
      </p>

      {/* Links */}
      <div
        className="relative z-[1] pt-4 flex items-center gap-5 flex-wrap"
        style={{ borderTop: "1px solid rgba(55,38,22,0.07)" }}
      >
        {person.website && (
          <ExternalLink
            href={person.website}
            Icon={RiGlobalLine}
            label="Website"
          />
        )}
        {person.github && (
          <ExternalLink
            href={person.github}
            Icon={RiGithubLine}
            label="GitHub"
          />
        )}
        {person.twitter && (
          <ExternalLink href={person.twitter} Icon={RiTwitterXLine} label="X" />
        )}
      </div>
    </motion.div>
  );
}

/* ─── External link ───────────────────────────────────────────────────────── */
function ExternalLink({ href, Icon, label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="no-underline flex items-center gap-[5px] transition-all duration-200"
      style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.04em",
        color: hovered ? "#2A2218" : "#8A7E74",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon size={13} style={{ color: hovered ? "#B8704E" : "#C4B8A8" }} />
      {label}
      <RiArrowRightUpLine size={10} style={{ opacity: hovered ? 1 : 0.5 }} />
    </a>
  );
}

/* ─── Value row ───────────────────────────────────────────────────────────── */
function ValueRow({ Icon, title, body, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      {...fadeUp(delay)}
      className="flex items-start gap-6 px-6 py-6 rounded-[18px] transition-all duration-250 cursor-default"
      style={{
        background: hovered ? "#F9F5EC" : "transparent",
        border: `1px solid ${hovered ? "rgba(55,38,22,0.12)" : "rgba(55,38,22,0.07)"}`,
        boxShadow: hovered ? "0 2px 10px rgba(42,34,24,0.06)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-250"
        style={{
          background: hovered ? "rgba(184,112,78,0.10)" : "#EDE8DF",
          border: `1px solid ${hovered ? "rgba(184,112,78,0.20)" : "rgba(55,38,22,0.10)"}`,
        }}
      >
        <Icon size={17} style={{ color: hovered ? "#B8704E" : "#A89B8C" }} />
      </div>
      <div>
        <div
          className="mb-[6px]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 18,
            fontWeight: 600,
            color: "#2A2218",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 13,
            fontWeight: 400,
            color: "#5A4E42",
            lineHeight: 1.78,
            letterSpacing: "0.01em",
          }}
        >
          {body}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Stack chip ──────────────────────────────────────────────────────────── */
function StackChip({ label, Icon, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      {...fadeUp(delay)}
      className="flex items-center gap-3 px-5 py-4 rounded-[14px] cursor-default transition-all duration-200"
      style={{
        background: "#F9F5EC",
        border: `1px solid ${hovered ? "rgba(55,38,22,0.18)" : "rgba(55,38,22,0.10)"}`,
        boxShadow: hovered
          ? "0 4px 14px rgba(42,34,24,0.08)"
          : "0 1px 3px rgba(42,34,24,0.05)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon size={16} style={{ color: hovered ? "#B8704E" : "#C4B8A8" }} />
      <span
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.04em",
          color: hovered ? "#2A2218" : "#8A7E74",
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

/* ─── CTA button ──────────────────────────────────────────────────────────── */
function CTAButton({ to, children, variant = "primary" }) {
  const [hovered, setHovered] = useState(false);
  const isPrimary = variant === "primary";
  return (
    <motion.div
      animate={{ y: hovered ? -2 : 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="inline-block"
    >
      <Link
        to={to}
        className="no-underline inline-flex items-center gap-2 px-8 py-[14px] rounded-[28px] transition-shadow duration-300"
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: "0.06em",
          ...(isPrimary
            ? {
                background: "#2A2218",
                color: "#F9F5EC",
                boxShadow: hovered
                  ? "0 10px 32px rgba(42,34,24,0.20), 0 3px 10px rgba(42,34,24,0.10)"
                  : "0 4px 16px rgba(42,34,24,0.14), 0 1px 4px rgba(42,34,24,0.08)",
              }
            : {
                background: "#F9F5EC",
                color: "#5A4E42",
                border: "1px solid rgba(55,38,22,0.14)",
                boxShadow: hovered
                  ? "0 6px 20px rgba(42,34,24,0.10)"
                  : "0 1px 3px rgba(42,34,24,0.06)",
              }),
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
      </Link>
    </motion.div>
  );
}

/* ─── Main export ─────────────────────────────────────────────────────────── */
export default function About() {
  return (
    <>
      <FontLoader />
      <NavBar />

      <div
        className="min-h-screen overflow-x-hidden pt-[72px]"
        style={{ background: "#F4EEE3", color: "#2A2218" }}
      >
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden text-center px-[5vw] pt-20 pb-20"
          style={{ borderBottom: "1px solid rgba(55,38,22,0.07)" }}
        >
          {/* Dot grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.22]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(42,34,24,0.10) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Warm glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(184,112,78,0.07) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-[2] max-w-[640px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <Tag>
                <RiSparkling2Line size={11} /> The people behind it
              </Tag>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.08 } }}
              className="mb-6 leading-[0.96]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#2A2218",
                fontSize: "clamp(44px, 7vw, 82px)",
              }}
            >
              Built by two
              <br />
              <span style={{ color: "#A89B8C", fontStyle: "italic" }}>
                obsessed people.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.16 } }}
              className="leading-[1.85]"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 15,
                fontWeight: 400,
                color: "#5A4E42",
                letterSpacing: "0.01em",
              }}
            >
              No VC. No growth team. No dark patterns. Just two builders from
              Nepal who got tired of watching their own attention get sold — and
              decided to do something about it.
            </motion.p>
          </div>
        </section>

        {/* ── Team cards ────────────────────────────────────────────────── */}
        <section
          className="px-[5vw] py-[100px]"
          style={{ borderBottom: "1px solid rgba(55,38,22,0.07)" }}
        >
          <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
            {TEAM.map((person, i) => (
              <TeamCard key={person.name} person={person} delay={i * 0.1} />
            ))}
          </div>
        </section>

        {/* ── Values ────────────────────────────────────────────────────── */}
        <section
          className="px-[5vw] py-[100px]"
          style={{ borderBottom: "1px solid rgba(55,38,22,0.07)" }}
        >
          <div className="max-w-[900px] mx-auto">
            <motion.div {...fadeUp(0)}>
              <Tag>
                <RiHeartLine size={11} /> How we build
              </Tag>
            </motion.div>

            <motion.h2
              {...fadeUp(0.06)}
              className="mb-14 leading-[1.05]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#2A2218",
                fontSize: "clamp(28px, 4vw, 52px)",
              }}
            >
              The principles
              <br />
              <span style={{ color: "#A89B8C", fontStyle: "italic" }}>
                we ship with.
              </span>
            </motion.h2>

            <div className="flex flex-col gap-[3px]">
              {VALUES.map(({ Icon, title, body }, i) => (
                <ValueRow
                  key={title}
                  Icon={Icon}
                  title={title}
                  body={body}
                  delay={i * 0.08}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Tech stack ────────────────────────────────────────────────── */}
        <section
          className="px-[5vw] py-[100px]"
          style={{ borderBottom: "1px solid rgba(55,38,22,0.07)" }}
        >
          <div className="max-w-[900px] mx-auto">
            <motion.div {...fadeUp(0)}>
              <Tag>
                <RiCodeSSlashLine size={11} /> Stack
              </Tag>
            </motion.div>

            <motion.h2
              {...fadeUp(0.06)}
              className="mb-14 leading-[1.05]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#2A2218",
                fontSize: "clamp(28px, 4vw, 52px)",
              }}
            >
              What Viram
              <br />
              <span style={{ color: "#A89B8C", fontStyle: "italic" }}>
                is made of.
              </span>
            </motion.h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-[10px]">
              {STACK.map(({ label, Icon }, i) => (
                <StackChip
                  key={label}
                  label={label}
                  Icon={Icon}
                  delay={i * 0.06}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-[5vw] py-[100px] text-center">
          {/* Warm ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(184,112,78,0.06) 0%, transparent 65%)",
            }}
          />

          <motion.h2
            {...fadeUp(0)}
            className="relative z-[1] mb-5 leading-[1.0]"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#2A2218",
              fontSize: "clamp(30px, 5vw, 58px)",
            }}
          >
            Want to say hi
            <br />
            <span style={{ color: "#A89B8C", fontStyle: "italic" }}>
              or collaborate?
            </span>
          </motion.h2>

          <motion.p
            {...fadeUp(0.06)}
            className="relative z-[1] max-w-[340px] mx-auto mb-10 leading-[1.8]"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 15,
              fontWeight: 400,
              color: "#8A7E74",
              letterSpacing: "0.01em",
            }}
          >
            We're a small team, so we actually read every message we get.
          </motion.p>

          <motion.div
            {...fadeUp(0.12)}
            className="relative z-[1] flex gap-3 justify-center flex-wrap"
          >
            <CTAButton to="/contact" variant="primary">
              Get in touch
            </CTAButton>
            <CTAButton to="https://www.samratparajuli0.com.np" variant="secondary" target="_blank" rel="noopener noreferrer">
              <RiGlobalLine size={15} /> Samrat's site
            </CTAButton>
          </motion.div>
        </section>

        {/* ── Footer strip ──────────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden flex items-center justify-between flex-wrap gap-3 px-[5vw] py-6"
          style={{
            borderTop: "1px solid rgba(55,38,22,0.07)",
            background: "#EDE8DF",
          }}
        >
          <Grain />

          <Link
            to="/"
            className="relative z-[1] no-underline"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            <span
              style={{
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: "0.18em",
                color: "#2A2218",
              }}
            >
              VI
            </span>
            <span
              style={{
                fontSize: 17,
                fontWeight: 400,
                letterSpacing: "0.18em",
                color: "#C4B8A8",
              }}
            >
              RAM
            </span>
          </Link>

          <div
            className="relative z-[1]"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 12,
              fontWeight: 400,
              color: "#A89B8C",
              letterSpacing: "0.03em",
            }}
          >
            © 2026 Viram. Built for those who refuse to be the product.
          </div>

          <div
            className="relative z-[1] flex items-center gap-[6px]"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              fontWeight: 400,
              color: "#A89B8C",
              letterSpacing: "0.06em",
            }}
          >
            <PulseDot />
            Systems online
          </div>
        </div>
      </div>
    </>
  );
}
