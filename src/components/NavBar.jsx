import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.getElementById("s-land");
    if (!el) return;
    const h = () => setScrolled(el.scrollTop > 40);
    el.addEventListener("scroll", h);
    return () => el.removeEventListener("scroll", h);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-[5vw] h-[70px] transition-all duration-400
        ${scrolled
          ? "bg-black/90 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-black"
        }`}
    >
      {/* Logo */}
      <Link to="/" className="no-underline flex items-center">
        <span className="font-syne text-xl font-black tracking-[0.18em] text-white leading-none">
          VI
        </span>
        <span className="font-syne text-xl font-black tracking-[0.18em] text-[#444444] leading-none">
          RAM
        </span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-8">
        {[
          { to: "/", label: "Home" },
          { to: "/library", label: "Library" },
          { to: "/developers", label: "Developers" },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="text-[13px] text-[#666666] font-medium no-underline font-dm-sans tracking-[0.02em] transition-colors duration-200 hover:text-white"
          >
            {label}
          </Link>
        ))}

        <Link
          to="/contact"
          className="flex items-center gap-[5px] text-[13px] text-[#666666] font-medium no-underline font-dm-sans tracking-[0.02em] transition-colors duration-200 hover:text-white"
        >
          <i className="ri-book-open-line text-[#888888] text-sm" />
          Contact
        </Link>
      </div>

      {/* CTA */}
      <Link
        to = "/start"
        className="px-[22px] py-[9px] rounded-full bg-white text-black text-xs font-bold font-dm-sans tracking-[0.04em] border-none cursor-pointer transition-all duration-150 hover:-translate-y-px hover:bg-[#e8e8e8] hover:shadow-[0_8px_24px_rgba(255,255,255,0.15)]"
      >
        Start Your Journey
      </Link>
    </motion.nav>
  );
}