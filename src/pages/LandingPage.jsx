import { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RiGamepadLine,
  RiRocketLine,
  RiPlayCircleLine,
  RiUserHeartLine,
  RiTimerFlashLine,
  RiShieldKeyholeLine,
  RiPuzzleLine,
  RiBookOpenLine,
  RiYoutubeLine,
  RiErrorWarningLine,
  RiArrowRightLine,
  RiSparkling2Line,
  RiChatQuoteLine,
  RiFireFill,
  RiStarFill,
  RiUser3Line,
  RiSmartphoneLine,
  RiPlayFill,
  RiTwitterXLine,
  RiInstagramLine,
  RiDiscordLine,
} from "react-icons/ri";
import NavBar from "../components/NavBar";

// ─── Minimal style block ──────────────────────────────────────────────────────
// Tailwind can't generate: custom keyframes, font imports, CSS variables,
// or the body::before grain overlay. Everything else uses Tailwind classes.
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

  /* ── Design tokens ── */
  :root {
    --bg:          #F4EEE3;
    --bg-card:     #F9F5EC;
    --bg-inset:    #EDE5D5;
    --border:      rgba(55,38,22,0.07);
    --border-mid:  rgba(55,38,22,0.14);
    --text-hi:     #2A2218;
    --text-mid:    #5A4E42;
    --text-lo:     #8A7F74;
    --text-ghost:  #BAB1A7;
    --accent:      #B8704E;
    --amber:       #C79B3A;
    --shadow-xs:   0 1px 3px rgba(45,28,12,0.07), 0 1px 2px rgba(45,28,12,0.04);
    --shadow-sm:   0 2px 8px rgba(45,28,12,0.08), 0 1px 3px rgba(45,28,12,0.04);
    --shadow-md:   0 6px 24px rgba(45,28,12,0.09), 0 2px 8px rgba(45,28,12,0.05);
    --shadow-lg:   0 16px 48px rgba(45,28,12,0.10), 0 4px 16px rgba(45,28,12,0.05);
    --shadow-lift: 0 22px 64px rgba(45,28,12,0.13), 0 6px 22px rgba(45,28,12,0.07);
    --r-sm:        12px;
    --r-md:        18px;
    --r-lg:        28px;
    --r-xl:        38px;
  }

  /* ── Keyframes ── */
  @keyframes marquee       { from { transform: translateX(0) }    to { transform: translateX(-50%) } }
  @keyframes marquee-testi { from { transform: translateX(0) }    to { transform: translateX(-50%) } }
  @keyframes pulse-dot     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.6)} }
  @keyframes spin-slow     { from { transform: rotate(0deg) }     to { transform: rotate(360deg) } }
  @keyframes float-avatar  { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-8px) } }

  /* ── Two font utilities Tailwind cannot generate without config ── */
  .font-display { font-family: 'Cormorant Garamond', serif; }
  .font-body    { font-family: 'Jost', sans-serif; }

  /* ── Full-page paper grain — the key tactile layer ── */
  body { background: var(--bg); }
  body::before {
    content: '';
    position: fixed; inset: 0;
    pointer-events: none; z-index: 9999; opacity: 0.032;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }
`;

// ─── Animation helper ─────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── Data ─────────────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  "FOCUS",
  "DISCIPLINE",
  "CLARITY",
  "GROWTH",
  "EVOLVE",
  "DEEP WORK",
  "MOMENTUM",
  "IDENTITY",
  "FLOW STATE",
  "WILLPOWER",
  "PRESENCE",
  "PURPOSE",
  "MASTERY",
  "SILENCE",
];

const FEATURES = [
  {
    Icon: RiUserHeartLine,
    title: "Living Avatar",
    body: "Your habits manifest in your character's stats in real time. Every deep work session fuels your avatar. Every scroll drains it.",
  },
  {
    Icon: RiTimerFlashLine,
    title: "Pomodoro Engine",
    body: "Deep work challenges with XP rewards. Complete without breaking = massive combo multiplier.",
  },
  {
    Icon: RiShieldKeyholeLine,
    title: "Friction Accounting",
    body: "Log doomscrolling honestly. Make the invisible cost of distraction visible in your avatar stats.",
  },
  {
    Icon: RiPuzzleLine,
    title: "Mental Reset Puzzles",
    body: "90-second brain games to break the scroll loop and re-engage your prefrontal cortex.",
  },
  {
    Icon: RiBookOpenLine,
    title: "Mind Library",
    body: "Distilled lessons from Atomic Habits, Deep Work, Digital Minimalism — actionable, never just quotes.",
  },
  {
    Icon: RiYoutubeLine,
    title: "Curated Resources",
    body: "Handpicked focus playlists and productivity content. Zero doomscrolling required.",
  },
];

const PLAYLISTS = [
  {
    channel: "Andrew Huberman Lab",
    title: "Dopamine & Motivation — Master Your Focus",
    meta: "2h 14m",
    url: "https://www.youtube.com/results?search_query=andrew+huberman+dopamine+focus",
  },
  {
    channel: "Andrew Huberman Lab",
    title: "The Science of Setting & Achieving Goals",
    meta: "Science-backed",
    url: "https://www.youtube.com/results?search_query=huberman+lab+goals+focus+science",
  },
  {
    channel: "Cal Newport",
    title: "Deep Work Philosophy — Study With Me",
    meta: "Knowledge",
    url: "https://www.youtube.com/results?search_query=deep+work+productivity+cal+newport",
  },
  {
    channel: "Cal Newport",
    title: "Digital Minimalism — Quit Social Media",
    meta: "High Impact",
    url: "https://www.youtube.com/results?search_query=cal+newport+quit+social+media",
  },
  {
    channel: "James Clear",
    title: "Atomic Habits — Build Systems That Stick",
    meta: "Bestseller",
    url: "https://www.youtube.com/results?search_query=atomic+habits+james+clear",
  },
  {
    channel: "Marcus Aurelius",
    title: "Meditations — Stoic Wisdom for Modern Life",
    meta: "Timeless",
    url: "https://www.youtube.com/results?search_query=marcus+aurelius+meditations",
  },
  {
    channel: "Daily Stoic",
    title: "Marcus Aurelius — Self Discipline & Resilience",
    meta: "Stoicism",
    url: "https://www.youtube.com/results?search_query=marcus+aurelius+daily+stoic",
  },
  {
    channel: "Magnetic Minds",
    title: "Binaural Beats — Alpha Waves for Focus",
    meta: "Neuroscience",
    url: "https://www.youtube.com/results?search_query=binaural+beats+focus",
  },
  {
    channel: "Digital Wellness",
    title: "Break the Scroll — Reclaim Your Attention",
    meta: "Mental Health",
    url: "https://www.youtube.com/results?search_query=digital+minimalism+screen+time",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I went from 6 hours of phone time to 90 minutes in two weeks. The avatar system made me viscerally uncomfortable watching my character's energy drain.",
    name: "Arjun K.",
    role: "Software Engineer, 23",
    initials: "A",
  },
  {
    quote:
      "I wrote my entire thesis during my Viram streak. The Pomodoro challenge became a genuine obsession — in the best possible way.",
    name: "Priya S.",
    role: "PhD Student, 26",
    initials: "P",
  },
  {
    quote:
      "The Mind Library alone changed how I approach every morning. Atomic Habits as actionable lessons rather than motivational fluff.",
    name: "Marcus T.",
    role: "Entrepreneur, 31",
    initials: "M",
  },
  {
    quote:
      "Three months in, my screen time is down 62%. My output at work has doubled. I stopped blaming myself and started building systems.",
    name: "Layla R.",
    role: "Product Designer, 27",
    initials: "L",
  },
  {
    quote:
      "The Stoic library content paired with the avatar mechanics clicked something in my brain. I now see every scroll as a vote I'm casting against myself.",
    name: "Dev M.",
    role: "Medical Student, 24",
    initials: "D",
  },
  {
    quote:
      "I've tried 11 productivity apps. Viram is the only one I kept using after week 2. The gamification isn't gimmicky — it actually works on your brain.",
    name: "Sarah K.",
    role: "Startup Founder, 29",
    initials: "S",
  },
];

const STATS = [
  { num: "2.4h", label: "Daily screen time saved" },
  { num: "87%", label: "Higher focus in 1 week" },
  { num: "23×", label: "More engaging than trackers" },
];

const PROB_STATS = [
  { num: "4.8h", label: "Average daily screen time" },
  { num: "$4.2B", label: "Spent annually to capture your attention" },
  { num: "73%", label: "Teens report feeling addicted to social media" },
  { num: "23 min", label: "To regain focus after a single notification" },
];

// ─── Tag Badge ────────────────────────────────────────────────────────────────
function Tag({ children }) {
  return (
    <div className="inline-flex items-center gap-1.5 mb-5 px-3.5 py-1.5 rounded-full font-body text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--text-lo)] bg-[var(--bg-inset)] border border-[var(--border-mid)] shadow-[var(--shadow-xs)]">
      {children}
    </div>
  );
}

// ─── Stat Bar ─────────────────────────────────────────────────────────────────
function StatBar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="font-body text-[10px] font-medium tracking-[0.12em] uppercase text-[var(--text-lo)]">
          {label}
        </span>
        <span className="font-display text-[10px] font-bold text-[var(--text-mid)]">
          {value}%
        </span>
      </div>
      <div className="h-[2px] rounded-full bg-[var(--bg-inset)] overflow-hidden">
        {/* width is dynamic → must be inline style */}
        <div
          className="h-full rounded-full opacity-70 transition-[width] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: `${value}%`,
            background:
              "linear-gradient(90deg, var(--text-lo), var(--text-mid))",
          }}
        />
      </div>
    </div>
  );
}

// ─── Avatar Card ──────────────────────────────────────────────────────────────
function AvatarCard({ avatarStats, heroOffset }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: { delay: 0.2, duration: 0.85, ease: [0.22, 1, 0.36, 1] },
      }}
      className="relative z-[2]"
      style={{
        transform: `translate(${heroOffset.x * 0.28}px, ${heroOffset.y * 0.28}px)`,
        transition: "transform 0.14s ease-out",
      }}
    >
      {/* Card */}
      <div className="relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--r-xl)] p-8 shadow-[var(--shadow-lg)]">
        {/* Paper grain on card surface */}
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.8'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "150px 150px",
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-body text-[10px] font-medium tracking-[0.18em] uppercase text-[var(--text-ghost)] mb-0.5">
              Active Avatar
            </div>
            <div className="font-display text-[17px] font-bold text-[var(--text-hi)]">
              The Focused Mind
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-inset)] border border-[var(--border-mid)]">
            <span
              className="w-[5px] h-[5px] rounded-full bg-[var(--text-lo)] inline-block"
              style={{ animation: "pulse-dot 2.8s ease-in-out infinite" }}
            />
            <span className="font-body text-[9px] font-semibold tracking-[0.16em] text-[var(--text-lo)]">
              LIVE
            </span>
          </div>
        </div>

        {/* Avatar circle */}
        <div className="relative mb-7">
          <div
            className="relative w-[108px] h-[108px] rounded-full mx-auto bg-[var(--bg-inset)] border border-[var(--border-mid)] flex items-center justify-center shadow-[var(--shadow-sm)]"
            style={{ animation: "float-avatar 4.5s ease-in-out infinite" }}
          >
            <RiUser3Line size={42} className="text-[var(--text-lo)]" />
            <svg
              className="absolute"
              style={{
                inset: -8,
                width: "calc(100% + 16px)",
                height: "calc(100% + 16px)",
                animation: "spin-slow 18s linear infinite",
              }}
              viewBox="0 0 126 126"
            >
              <circle
                cx="63"
                cy="63"
                r="59"
                fill="none"
                stroke="var(--border-mid)"
                strokeWidth="0.8"
                strokeDasharray="2 9"
              />
            </svg>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-[var(--text-hi)] text-[var(--bg)] px-3.5 py-[3px] rounded-full font-body text-[10px] font-semibold tracking-[0.08em] whitespace-nowrap shadow-[var(--shadow-sm)]">
            LV 99 · Focused Human
          </div>
        </div>

        {/* Stat bars */}
        <div className="flex flex-col gap-3.5 mb-5">
          <StatBar label="Focus" value={avatarStats.focus} />
          <StatBar label="Discipline" value={avatarStats.discipline} />
          <StatBar label="Clarity" value={avatarStats.clarity} />
        </div>

        {/* Mini cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { Icon: RiFireFill, label: "Streak", val: "12 days" },
            { Icon: RiTimerFlashLine, label: "Today", val: "3h 40m" },
          ].map(({ Icon, label, val }) => (
            <div
              key={label}
              className="p-2.5 rounded-[var(--r-sm)] bg-[var(--bg-inset)] border border-[var(--border)] shadow-[var(--shadow-xs)]"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={11} className="text-[var(--text-lo)]" />
                <span className="font-body text-[9px] font-medium tracking-[0.12em] uppercase text-[var(--text-ghost)]">
                  {label}
                </span>
              </div>
              <div className="font-display text-[16px] font-bold text-[var(--text-hi)]">
                {val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* XP pill */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
        className="absolute -top-3.5 -right-3.5 bg-[var(--text-hi)] text-[var(--bg)] px-4 py-1.5 rounded-full font-body text-[11px] font-semibold tracking-[0.06em] whitespace-nowrap shadow-[0_8px_28px_rgba(42,34,24,0.20)]"
      >
        +240 XP
      </motion.div>

      {/* Saved pill */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.75 } }}
        className="absolute -bottom-3.5 -left-3.5 flex items-center gap-1.5 whitespace-nowrap bg-[var(--bg-card)] border border-[var(--border-mid)] px-3.5 py-1.5 rounded-full font-body text-[11px] font-medium text-[var(--text-mid)] shadow-[var(--shadow-md)]"
      >
        <RiSmartphoneLine size={13} /> 47 min saved today
      </motion.div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LandingPage() {
  const parallaxRef = useRef({ x: 0, y: 0 });
  const [heroOffset, setHeroOffset] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const [avatarStats, setAvatarStats] = useState({
    focus: 72,
    discipline: 58,
    clarity: 84,
  });

  useEffect(() => {
    const onMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      parallaxRef.current = {
        x: ((e.clientX - cx) / cx) * 14,
        y: ((e.clientY - cy) / cy) * 8,
      };
    };
    let raf;
    const tick = () => {
      setHeroOffset((prev) => ({
        x: prev.x + (parallaxRef.current.x - prev.x) * 0.055,
        y: prev.y + (parallaxRef.current.y - prev.y) * 0.055,
      }));
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setAvatarStats({
        focus: 68 + Math.floor(Math.random() * 14),
        discipline: 55 + Math.floor(Math.random() * 18),
        clarity: 80 + Math.floor(Math.random() * 12),
      });
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <NavBar />
      <style>{STYLES}</style>

      <div className="font-body bg-[var(--bg)] text-[var(--text-hi)] relative z-[10] overflow-x-hidden">
        {/* ──────────────────────────────────────────────────── HERO */}
        <section
          className="relative overflow-hidden min-h-[100svh] grid items-center gap-16 px-[5vw] py-[60px]"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {/* Warm ambient radial */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 75% 40%, rgba(184,112,78,0.05) 0%, transparent 72%)",
            }}
          />
          {/* Dot grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.28]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(55,38,22,0.12) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Left: copy */}
          <div className="relative z-[2]">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Tag>
                <RiGamepadLine size={11} /> Productivity Reimagined
              </Tag>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.08 } }}
              className="font-display font-bold leading-[0.96] tracking-[-0.02em] mb-6 text-[var(--text-hi)] text-[clamp(50px,6vw,84px)]"
              style={{
                transform: `translate(${heroOffset.x * 0.18}px, ${heroOffset.y * 0.18}px)`,
                transition: "transform 0.14s ease-out",
              }}
            >
              Turn Your <br />
              Goals
              <br />
              <span className="text-[var(--text-lo)] italic">
                Into a<br />
                MileStone
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.16 } }}
              className="text-[15px] text-[var(--text-mid)] leading-[1.9] mb-9 max-w-[400px] font-light"
            >
              Your dopamine hijacked by social media. Your attention sold to
              advertisers. Viram takes it back - and makes discipline feel{" "}
              <em className="not-italic font-display text-[17px] font-semibold text-[var(--text-hi)]">
                automatic.
              </em>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.22 } }}
              className="flex flex-wrap gap-2.5 mb-[52px]"
            >
              {/* ★ PRIMARY CTA — terracotta accent appears only here and in the footer CTA */}
              <button
                onClick={() => navigate('/start')}
                className="inline-flex items-center gap-1.5 cursor-pointer px-7 py-3 rounded-full bg-[var(--accent)] text-[#FAF5EC] border-0 text-sm font-medium tracking-[0.02em] shadow-[0_6px_20px_rgba(184,112,78,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(184,112,78,0.36)] active:scale-[0.975]"
              >
                <RiRocketLine size={15} /> Start Your Journey
              </button>
              <button
                onClick={() => navigate('/start')}
                className="inline-flex items-center gap-1.5 cursor-pointer px-7 py-3 rounded-full bg-[var(--bg-card)] text-[var(--text-mid)] border border-[var(--border-mid)] text-sm font-light shadow-[var(--shadow-xs)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(55,38,22,0.22)] hover:shadow-[var(--shadow-sm)] active:scale-[0.975]"
              >
                <RiPlayCircleLine size={15} /> Preview Dashboard
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
              className="flex flex-wrap gap-y-4 border-t border-[var(--border)] pt-7"
            >
              {STATS.map(({ num, label }, i) => (
                <div
                  key={label}
                  className={`flex-[1_1_80px] ${i > 0 ? "pl-6" : ""} ${i < STATS.length - 1 ? "pr-6 border-r border-[var(--border)]" : ""}`}
                >
                  <div className="font-display text-[30px] font-bold tracking-[-0.02em] text-[var(--text-hi)]">
                    {num}
                  </div>
                  <div className="text-[11px] text-[var(--text-ghost)] mt-0.5 leading-[1.5]">
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: avatar card */}
          <AvatarCard avatarStats={avatarStats} heroOffset={heroOffset} />
        </section>

        {/* ──────────────────────────────────────────────────── MARQUEE */}
        <div className="border-t border-b border-[var(--border)] bg-[var(--bg-inset)] relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--bg-inset)] to-transparent z-[2]" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--bg-inset)] to-transparent z-[2]" />
          <div className="py-3.5 overflow-hidden">
            <div
              className="inline-flex whitespace-nowrap"
              style={{ animation: "marquee 38s linear infinite" }}
            >
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-3 px-5">
                  <span className="font-body text-[9px] font-semibold tracking-[0.28em] uppercase text-[var(--text-ghost)]">
                    {item}
                  </span>
                  <span className="w-[2px] h-[2px] rounded-full bg-[var(--border-mid)] shrink-0 inline-block" />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────── THE PROBLEM */}
        <section
          className="px-[5vw] py-[108px] border-t border-[var(--border)]"
          id="problem"
        >
          <div
            className="max-w-[1100px] mx-auto grid gap-20 items-center"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            <div>
              <motion.div {...fadeUp(0)}>
                <Tag>
                  <RiErrorWarningLine size={11} /> The Problem
                </Tag>
              </motion.div>
              <motion.h2
                {...fadeUp(0.06)}
                className="font-display font-bold leading-[1.0] tracking-[-0.02em] text-[var(--text-hi)] mb-6 text-[clamp(36px,5vw,64px)]"
              >
                You're not
                <br />
                lazy. You're
                <br />
                <span className="text-[var(--text-lo)] italic">
                  engineered
                  <br />
                  to scroll.
                </span>
              </motion.h2>
              <motion.p
                {...fadeUp(0.12)}
                className="text-[15px] text-[var(--text-mid)] leading-[1.9] font-light mb-6"
              >
                Billion-dollar teams optimize every pixel of TikTok, Instagram,
                and YouTube to hijack your dopamine system. Your willpower was
                never the enemy — the incentive mismatch was.
              </motion.p>
              <motion.button
                {...fadeUp(0.18)}
                onClick={() => {}}
                className="inline-flex items-center gap-1.5 cursor-pointer px-[18px] py-2 rounded-full text-[13px] font-light text-[var(--text-mid)] bg-[var(--bg-card)] border border-[var(--border-mid)] shadow-[var(--shadow-xs)] transition-all duration-200 hover:border-[rgba(55,38,22,0.22)] hover:shadow-[var(--shadow-sm)] hover:-translate-y-px active:scale-[0.975]"
              >
                Read the full manifesto <RiArrowRightLine size={14} />
              </motion.button>
            </div>

            <div className="flex flex-col gap-1.5">
              {PROB_STATS.map(({ num, label }, i) => (
                <motion.div
                  key={label}
                  {...fadeUp(i * 0.07)}
                  className="flex items-center gap-5 px-6 py-5 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-xs)] cursor-default transition-all duration-[280ms] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                >
                  <div className="font-display font-bold text-[32px] tracking-[-0.02em] text-[var(--text-hi)] min-w-[110px] shrink-0">
                    {num}
                  </div>
                  <div className="text-[13px] font-light text-[var(--text-mid)] leading-[1.6]">
                    {label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────── FEATURES */}
        <section
          className="px-[5vw] py-[72px] md:py-[108px] border-t border-[var(--border)]"
          id="features"
        >
          <div className="max-w-[1100px] mx-auto">
            <motion.div {...fadeUp(0)}>
              <Tag>
                <RiSparkling2Line size={11} /> How It Works
              </Tag>
            </motion.div>
            <motion.h2
              {...fadeUp(0.06)}
              className="font-display font-bold leading-[1.05] tracking-[-0.02em] text-[var(--text-hi)] mb-10 md:mb-14 text-[clamp(28px,4.5vw,54px)]"
            >
              Everything designed to
              <br />
              <em className="italic text-[var(--text-lo)]">
                rewire your reward system.
              </em>
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Hero feature — spans 2 rows on lg only */}
              <motion.div
                {...fadeUp(0)}
                className="sm:col-span-2 lg:col-span-1 lg:row-span-2 flex flex-col justify-between p-6 md:p-8 rounded-[var(--r-lg)] min-h-[260px] lg:min-h-[300px] cursor-default border border-[var(--border)] shadow-[var(--shadow-sm)] transition-all duration-[280ms] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                style={{
                  background:
                    "linear-gradient(145deg, var(--bg-card) 0%, var(--bg-inset) 100%)",
                }}
              >
                <div>
                  <div className="w-[50px] h-[50px] rounded-[14px] flex items-center justify-center mb-5 bg-[var(--bg)] border border-[var(--border-mid)] shadow-[var(--shadow-xs)]">
                    <RiUserHeartLine
                      size={22}
                      className="text-[var(--text-mid)]"
                    />
                  </div>
                  <div className="font-display text-[22px] font-bold mb-3 text-[var(--text-hi)] tracking-[-0.01em]">
                    Living Avatar
                  </div>
                  <div className="text-[14px] font-light text-[var(--text-mid)] leading-[1.8]">
                    Your habits manifest in your character's stats in real time.
                    Every deep work session fuels your avatar. Every scroll
                    drains it. Watch yourself grow — or wither.
                  </div>
                </div>
                <div className="mt-7 p-4 rounded-[var(--r-sm)] bg-[var(--bg)] border border-[var(--border)] shadow-[var(--shadow-xs)]">
                  <div className="text-[10px] font-medium tracking-[0.16em] uppercase text-[var(--text-lo)] mb-1.5">
                    Your stats right now
                  </div>
                  <div className="font-display font-bold text-[28px] text-[var(--text-hi)]">
                    LV 14
                  </div>
                  <div className="text-[11px] font-light text-[var(--text-ghost)] mt-0.5">
                    Focused Human · 2,340 XP
                  </div>
                </div>
              </motion.div>

              {FEATURES.slice(1).map(({ Icon, title, body }, i) => (
                <motion.div
                  key={title}
                  {...fadeUp((i + 1) * 0.055)}
                  className="p-5 md:p-6 rounded-[var(--r-md)] cursor-default bg-[var(--bg-card)] border border-[var(--border)] shadow-[var(--shadow-xs)] transition-all duration-[280ms] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                >
                  <div className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center mb-4 bg-[var(--bg-inset)] border border-[var(--border)] shadow-[var(--shadow-xs)]">
                    <Icon size={18} className="text-[var(--text-lo)]" />
                  </div>
                  <div className="font-display text-[16px] font-bold mb-1.5 text-[var(--text-hi)]">
                    {title}
                  </div>
                  <div className="text-[12px] font-light text-[var(--text-lo)] leading-[1.75]">
                    {body}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────── RESOURCES */}
        <section
          className="px-[5vw] py-[108px] border-t border-[var(--border)]"
          id="resources"
        >
          <div className="max-w-[1100px] mx-auto">
            <motion.div {...fadeUp(0)} className="text-center mb-14">
              <div className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.24em] text-[var(--text-lo)] uppercase font-medium mb-6">
                <RiYoutubeLine size={11} /> Resources
              </div>
              <h2 className="font-display font-bold text-[var(--text-hi)] leading-[0.92] tracking-[-0.02em] text-[clamp(36px,8vw,72px)]">
                Providing
                <br />
                resources that
                <br />
                actually
                <span className="block italic text-[var(--text-lo)] font-normal leading-[1.25] text-[clamp(26px,6vw,58px)]">
                  move the needle.
                </span>
              </h2>
              <p className="max-w-[560px] mx-auto mt-6 leading-[1.8] text-[var(--text-mid)] italic font-display text-[clamp(15px,1.2vw,18px)] font-normal">
                Not dopamine junk — but{" "}
                <strong className="not-italic text-[var(--text-hi)] underline underline-offset-[3px] decoration-[var(--border-mid)]">
                  curated knowledge
                </strong>{" "}
                that builds you. Every playlist below has been selected for its
                ability to deepen focus, rewire habits, or accelerate real
                growth.
              </p>
            </motion.div>

            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              }}
            >
              {PLAYLISTS.map((pl, i) => (
                <motion.div
                  key={pl.title}
                  {...fadeUp(i * 0.04)}
                  onClick={() => window.open(pl.url, "_blank")}
                  className="rounded-[var(--r-lg)] overflow-hidden cursor-pointer bg-[var(--bg-card)] border border-[var(--border)] shadow-[var(--shadow-xs)] transition-all duration-[280ms] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                >
                  {/* Thumbnail */}
                  <div
                    className="relative overflow-hidden bg-[var(--bg-inset)]"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(135deg, #EDE5D5 0%, #E0D8C8 50%, #E8E0D0 100%)",
                      }}
                    />
                    <div
                      className="absolute inset-0 opacity-[0.04]"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(0deg, transparent, transparent 14px, rgba(55,38,22,0.6) 15px)",
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-[46px] h-[46px] rounded-full flex items-center justify-center shadow-[var(--shadow-md)] opacity-[0.88]"
                        style={{ background: "var(--text-hi)" }}
                      >
                        <RiPlayFill
                          size={18}
                          className="text-[var(--bg)] ml-0.5"
                        />
                      </div>
                    </div>
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-[3px] rounded-[6px] bg-[rgba(42,34,24,0.65)] border border-[rgba(255,255,255,0.08)]">
                      <RiYoutubeLine size={10} className="text-[#F0E8DA]" />
                      <span className="font-body text-[9px] font-semibold tracking-[0.08em] text-[#F0E8DA]">
                        YT
                      </span>
                    </div>
                  </div>
                  <div className="px-4 pt-3 pb-4 border-t border-[var(--border)]">
                    <div className="text-[9px] font-medium tracking-[0.18em] uppercase text-[var(--text-lo)] mb-1">
                      {pl.channel}
                    </div>
                    <div className="font-display text-[14px] font-bold mb-1.5 leading-[1.35] text-[var(--text-hi)] tracking-[-0.01em]">
                      {pl.title}
                    </div>
                    <div className="text-[10px] font-light text-[var(--text-ghost)]">
                      {pl.meta}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────── TESTIMONIALS */}
        <section className="py-[108px] overflow-hidden border-t border-[var(--border)]">
          <div className="text-center mb-14 px-[5vw]">
            <motion.div {...fadeUp(0)} className="flex justify-center">
              <Tag>
                <RiChatQuoteLine size={11} /> Results
              </Tag>
            </motion.div>
            <motion.h2
              {...fadeUp(0.06)}
              className="font-display font-bold leading-[1.05] tracking-[-0.02em] text-[var(--text-hi)] text-[clamp(26px,4vw,50px)]"
            >
              People who chose
              <br />
              <em className="italic text-[var(--text-lo)]">the harder path.</em>
            </motion.h2>
          </div>

          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--bg)] to-transparent z-[2] pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--bg)] to-transparent z-[2] pointer-events-none" />
            <div
              id="testi-track"
              className="inline-flex gap-4 px-4 py-2 whitespace-nowrap"
              style={{ animation: "marquee-testi 50s linear infinite" }}
            >
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <div
                  key={i}
                  className="w-[308px] shrink-0 inline-block align-top whitespace-normal p-5 rounded-[var(--r-lg)] cursor-default bg-[var(--bg-card)] border border-[var(--border)] shadow-[var(--shadow-xs)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] hover:border-[var(--border-mid)]"
                  onMouseEnter={() => {
                    document.getElementById(
                      "testi-track",
                    ).style.animationPlayState = "paused";
                  }}
                  onMouseLeave={() => {
                    document.getElementById(
                      "testi-track",
                    ).style.animationPlayState = "running";
                  }}
                >
                  {/* Stars — warm amber only; never terracotta */}
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <RiStarFill
                        key={j}
                        size={9}
                        style={{ color: "var(--amber)" }}
                      />
                    ))}
                  </div>
                  <p className="font-display italic text-[15px] font-normal text-[var(--text-mid)] leading-[1.75] mb-4">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-display text-[13px] font-bold bg-[var(--bg-inset)] text-[var(--text-mid)] border border-[var(--border-mid)]">
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-[12px] font-medium text-[var(--text-hi)]">
                        {t.name}
                      </div>
                      <div className="text-[10px] font-light text-[var(--text-ghost)]">
                        {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────── FINAL CTA */}
        <section className="relative overflow-hidden px-[5vw] py-[108px] pb-[128px] text-center border-t border-[var(--border)]">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(184,112,78,0.06) 0%, transparent 68%)",
            }}
          />
          <motion.div {...fadeUp(0)} className="flex justify-center">
            <Tag>
              <RiSparkling2Line size={11} /> Your move
            </Tag>
          </motion.div>
          <motion.h2
            {...fadeUp(0.06)}
            className="font-display font-bold leading-[1.0] tracking-[-0.02em] text-[var(--text-hi)] mb-5 text-[clamp(32px,5.5vw,66px)]"
          >
            Every day you wait
            <br />
            <em className="italic text-[var(--text-lo)]">
              is a day on their terms.
            </em>
          </motion.h2>
          <motion.p
            {...fadeUp(0.12)}
            className="max-w-[380px] mx-auto mb-10 text-[var(--text-mid)] leading-[1.9] text-[15px] font-light"
          >
            Stop watching other people live. Build the discipline system your
            future self will thank you for.
          </motion.p>
          <motion.div
            {...fadeUp(0.18)}
            className="flex gap-3 justify-center flex-wrap"
          >
            {/* ★ FINAL PRIMARY CTA — the second and last terracotta button */}
            <button
              onClick={() => navigate('/start')}
              className="inline-flex items-center gap-2 cursor-pointer px-10 py-4 rounded-full bg-[var(--accent)] text-[#FAF5EC] border-0 text-[15px] font-medium tracking-[0.02em] shadow-[0_8px_28px_rgba(184,112,78,0.30)] transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_14px_40px_rgba(184,112,78,0.38)] active:scale-[0.975]"
            >
              <RiRocketLine size={16} /> Forge Your Avatar Now
            </button>
          </motion.div>
        </section>

        {/* ──────────────────────────────────────────────────── FOOTER */}
        <footer className="border-t border-[var(--border)] bg-[var(--bg-inset)] px-[5vw] pt-[60px] pb-10">
          <div
            className="max-w-[1100px] mx-auto grid gap-10"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            }}
          >
            {/* Brand */}
            <div>
              <div className="font-display text-[22px] font-bold tracking-[0.12em] mb-4">
                <span className="text-[var(--text-hi)]">VI</span>
                <span className="text-[var(--text-ghost)]">RAM</span>
              </div>
              <p className="text-[13px] font-light text-[var(--text-lo)] leading-[1.8] max-w-[220px] mb-5">
                The productivity system that fights back against the attention
                economy.
              </p>
              <div className="flex gap-2">
                {[
                  RiTwitterXLine,
                  RiInstagramLine,
                  RiDiscordLine,
                  RiYoutubeLine,
                ].map((Icon, k) => (
                  <div
                    key={k}
                    className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-[var(--bg-card)] border border-[var(--border-mid)] shadow-[var(--shadow-xs)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]"
                  >
                    <Icon size={13} className="text-[var(--text-lo)]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {[
              {
                title: "Product",
                links: ["Get Started", "Mind Library", "Features", "Dashboard"],
              },
              {
                title: "Resources",
                links: [
                  "Playlists",
                  "Deep Work",
                  "Scriptures",
                  "Digital Detox",
                ],
              },
              {
                title: "Philosophy",
                links: [
                  "The Problem",
                  "Our Manifesto",
                  "Privacy",
                  "Sign Up Free",
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <div className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[var(--text-ghost)] mb-4">
                  {col.title}
                </div>
                {col.links.map((label) => (
                  <Link
                    key={label}
                    to="/"
                    className="block text-[13px] font-light text-[var(--text-lo)] mb-2.5 no-underline transition-colors duration-200 hover:text-[var(--text-hi)]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="max-w-[1100px] mx-auto mt-10 pt-6 border-t border-[var(--border)] flex items-center justify-between flex-wrap gap-3">
            <div className="text-[12px] font-light text-[var(--text-ghost)]">
              © 2026 Viram. Built for those who refuse to be the product.
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-light text-[var(--text-ghost)]">
              <span
                className="w-[5px] h-[5px] rounded-full bg-[var(--text-lo)] inline-block"
                style={{ animation: "pulse-dot 3s ease-in-out infinite" }}
              />
              Systems online
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
