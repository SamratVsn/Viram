import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiRocketLine,
  RiHomeLine,
  RiBookOpenLine,
  RiInformationLine,
  RiMailLine,
  RiMenuLine,
  RiCloseLine,
  RiArrowRightLine,
} from "react-icons/ri";

/* ─── Grain SVG texture overlay ─────────────────────────────────────────── */
const Grain = () => (
  <div
    aria-hidden="true"
    className="absolute inset-0 pointer-events-none z-0 rounded-[inherit]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)' opacity='0.03'/%3E%3C/svg%3E")`,
    }}
  />
);

/* ─── Nav links config ───────────────────────────────────────────────────── */
const NAV_LINKS = [
  { to: "/",        label: "Home",    Icon: RiHomeLine        },
  { to: "/library", label: "Library", Icon: RiBookOpenLine    },
  { to: "/about",   label: "About",   Icon: RiInformationLine },
  { to: "/contact", label: "Contact", Icon: RiMailLine        },
];

/* ─── Desktop nav link — animated underline via framer ───────────────────── */
function DesktopLink({ to, label, active }) {
  const [hovered, setHovered] = useState(false);
  const lit = hovered || active;

  return (
    <Link
      to={to}
      className="relative no-underline flex flex-col pb-[3px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="font-[Jost] text-[13px] font-normal uppercase tracking-[0.08em] transition-colors duration-300"
        style={{ color: lit ? "#2A2218" : "#5A4E42" }}
      >
        {label}
      </span>
      <motion.span
        className="absolute bottom-0 left-0 h-px bg-[#B8704E]"
        animate={{ width: lit ? "100%" : "0%" }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      />
    </Link>
  );
}

/* ─── Mobile drawer link ─────────────────────────────────────────────────── */
function DrawerLink({ to, label, Icon, active, index }) {
  const [hovered, setHovered] = useState(false);
  const lit = hovered || active;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 + 0.12, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={to}
        className="no-underline flex items-center gap-[14px] py-4 pr-7 transition-all duration-300"
        style={{
          paddingLeft: lit ? 34 : 28,
          background: lit ? "rgba(184,112,78,0.04)" : "transparent",
          color: lit ? "#2A2218" : "#5A4E42",
          borderBottom: "1px solid rgba(55,38,22,0.07)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Icon chip */}
        <div
          className="flex items-center justify-center w-9 h-9 flex-shrink-0 rounded-xl transition-all duration-300"
          style={{
            background: active ? "rgba(184,112,78,0.10)" : "#F4EEE3",
            border: `1px solid ${active ? "rgba(184,112,78,0.20)" : "rgba(55,38,22,0.07)"}`,
          }}
        >
          <Icon size={15} style={{ color: active ? "#B8704E" : "#A89B8C" }} />
        </div>

        <span className="flex-1 font-[Jost] text-[15px] font-normal tracking-[0.04em]">
          {label}
        </span>

        {active && (
          <motion.span
            animate={{ opacity: [1, 0.35, 1], scale: [1, 0.55, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            className="flex-shrink-0 w-[5px] h-[5px] rounded-full bg-[#B8704E]"
          />
        )}
      </Link>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function NavBar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [scrollPct,  setScrollPct]  = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location                    = useLocation();
  const ticking                     = useRef(false);

  /* Scroll listener */
  useEffect(() => {
    const el = document.getElementById("s-land") || window;
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const top    = el === window ? window.scrollY : el.scrollTop;
        const height = el === window
          ? document.body.scrollHeight - window.innerHeight
          : el.scrollHeight - el.clientHeight;
        setScrolled(top > 40);
        setScrollPct(Math.min(100, (top / Math.max(height, 1)) * 100));
        ticking.current = false;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    if (el !== window) window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (el !== window) window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* Close on route change */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      {/* ── Nav bar ──────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between h-[72px] px-[5vw] relative overflow-hidden"
        style={{
          background: scrolled ? "rgba(244,238,227,0.88)" : "#F4EEE3",
          borderBottom: `1px solid ${scrolled ? "rgba(55,38,22,0.12)" : "rgba(55,38,22,0.07)"}`,
          backdropFilter: scrolled ? "blur(18px) saturate(1.4)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(18px) saturate(1.4)" : "none",
          boxShadow: scrolled
            ? "0 2px 10px rgba(42,34,24,0.07), 0 1px 4px rgba(42,34,24,0.04)"
            : "none",
          transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
        }}
      >
        <Grain />

        {/* ── Logo ── */}
        <Link to="/" className="relative z-[1] no-underline flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-baseline"
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "0.22em",
                color: "#2A2218",
                lineHeight: 1,
              }}
            >
              VI
            </span>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 22,
                fontWeight: 400,
                letterSpacing: "0.22em",
                color: "#A89B8C",
                lineHeight: 1,
              }}
            >
              RAM
            </span>
          </motion.div>

          {/* Beta pill */}
          <div
            className="flex items-center gap-[5px] px-[9px] py-[3px] rounded-full"
            style={{
              background: "rgba(184,112,78,0.10)",
              border: "1px solid rgba(184,112,78,0.15)",
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.35, 1], scale: [1, 0.55, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block w-[5px] h-[5px] rounded-full bg-[#B8704E]"
            />
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#B8704E",
                lineHeight: 1,
              }}
            >
              Beta
            </span>
          </div>
        </Link>

        {/* ── Desktop links ── */}
        <div className="hidden md:flex items-center gap-9 relative z-[1]">
          {NAV_LINKS.map(({ to, label }) => (
            <DesktopLink key={to} to={to} label={label} active={isActive(to)} />
          ))}
        </div>

        {/* ── Desktop CTA ── */}
        <div className="hidden md:flex items-center gap-4 relative z-[1]">
          <div className="w-px h-5 bg-[rgba(55,38,22,0.12)]" />
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.975 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/start"
              className="no-underline flex items-center gap-2 px-[22px] py-[10px] rounded-[28px]"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "#F9F5EC",
                background: "#2A2218",
                boxShadow: "0 2px 10px rgba(42,34,24,0.14), 0 1px 4px rgba(42,34,24,0.08)",
                transition: "box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 6px 28px rgba(42,34,24,0.16), 0 2px 8px rgba(42,34,24,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 2px 10px rgba(42,34,24,0.14), 0 1px 4px rgba(42,34,24,0.08)";
              }}
            >
              <RiRocketLine size={13} />
              Start Journey
            </Link>
          </motion.div>
        </div>

        {/* ── Mobile hamburger ── */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.22 }}
          onClick={() => setMobileOpen(true)}
          className="flex md:hidden items-center justify-center w-10 h-10 relative z-[1] cursor-pointer rounded-xl"
          style={{
            background: "#F9F5EC",
            border: "1px solid rgba(55,38,22,0.12)",
            boxShadow: "0 1px 3px rgba(42,34,24,0.06)",
            color: "#5A4E42",
          }}
        >
          <RiMenuLine size={18} />
        </motion.button>
      </motion.nav>

      {/* ── Scroll progress thread ── */}
      <div
        aria-hidden="true"
        className="fixed z-[199] pointer-events-none top-[72px] left-0 h-px"
        style={{
          width: `${scrollPct}%`,
          background: "linear-gradient(90deg, #B8704E, rgba(184,112,78,0.3))",
          opacity: scrolled ? 1 : 0,
          transition: "opacity 0.4s ease, width 0.12s linear",
        }}
      />

      {/* ── Mobile overlay + drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="fixed inset-0 z-[195] cursor-pointer"
              style={{
                background: "rgba(42,34,24,0.22)",
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
              }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[198] flex flex-col overflow-hidden"
              style={{
                width: "min(320px, 82vw)",
                background: "#F9F5EC",
                borderLeft: "1px solid rgba(55,38,22,0.12)",
                boxShadow: "0 14px 40px rgba(42,34,24,0.10), 0 4px 12px rgba(42,34,24,0.06)",
              }}
            >
              <Grain />

              {/* Drawer header */}
              <div
                className="relative z-[1] flex items-center justify-between px-7 h-[72px] flex-shrink-0"
                style={{ borderBottom: "1px solid rgba(55,38,22,0.07)" }}
              >
                <div className="flex items-baseline">
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, letterSpacing: "0.22em", color: "#2A2218" }}>VI</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, letterSpacing: "0.22em", color: "#A89B8C" }}>RAM</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.90 }}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer"
                  style={{
                    background: "#F4EEE3",
                    border: "1px solid rgba(55,38,22,0.12)",
                    color: "#5A4E42",
                  }}
                >
                  <RiCloseLine size={16} />
                </motion.button>
              </div>

              {/* Section label */}
              <div className="relative z-[1] px-7 pt-6 pb-3">
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#A89B8C",
                  }}
                >
                  Navigation
                </p>
              </div>

              {/* Links */}
              <div className="relative z-[1] flex-1 overflow-y-auto">
                {NAV_LINKS.map(({ to, label, Icon }, i) => (
                  <DrawerLink
                    key={to}
                    to={to}
                    label={label}
                    Icon={Icon}
                    active={isActive(to)}
                    index={i}
                  />
                ))}
              </div>

              {/* Drawer CTA footer */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-[1] flex-shrink-0 p-6 pb-8"
                style={{ borderTop: "1px solid rgba(55,38,22,0.07)" }}
              >
                <Link
                  to="/start"
                  className="no-underline flex items-center justify-center gap-2 w-full py-[14px] px-6 rounded-[18px]"
                  style={{
                    background: "#2A2218",
                    color: "#F9F5EC",
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    boxShadow: "0 6px 28px rgba(42,34,24,0.16), 0 2px 8px rgba(42,34,24,0.08)",
                  }}
                >
                  <RiRocketLine size={14} />
                  Start Your Journey
                  <RiArrowRightLine size={14} className="opacity-50 ml-1" />
                </Link>

                <p
                  className="mt-4 text-center"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 11,
                    fontWeight: 300,
                    letterSpacing: "0.06em",
                    color: "#A89B8C",
                    lineHeight: 1.7,
                  }}
                >
                  Free to start — no credit card needed.
                </p>

                {/* Decorative rule */}
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex-1 h-px bg-[rgba(55,38,22,0.07)]" />
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      fontSize: 12,
                      color: "#A89B8C",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Viram · 2026
                  </span>
                  <div className="flex-1 h-px bg-[rgba(55,38,22,0.07)]" />
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}