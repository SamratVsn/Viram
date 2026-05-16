import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { RiHome4Line, RiArrowLeftLine } from "react-icons/ri";
import SEO from "../components/SEO";
import { supabase } from "../lib/supabase";

const EASE = [0.22, 1, 0.36, 1];
const up = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
});

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`;

export default function NotFound() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setAuthed(true);
    }).catch(() => {});
  }, []);

  return (
    <>
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist. Head back to Viram and stay on track." noIndex />
      <div
      style={{
        minHeight:      "100svh",
        background:     "#F4EEE3",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "48px 24px",
        position:       "relative",
        overflow:       "hidden",
        fontFamily:     "'Jost', sans-serif",
      }}
    >
      {/* Grain */}
      <div
        aria-hidden="true"
        style={{
          position:        "absolute",
          inset:           0,
          backgroundImage: GRAIN,
          backgroundSize:  "256px",
          opacity:         0.03,
          pointerEvents:   "none",
        }}
      />

      {/* Ruled lines */}
      {[15, 30, 45, 60, 75, 90].map(t => (
        <div
          key={t}
          aria-hidden="true"
          style={{
            position:     "absolute",
            left:         0,
            right:        0,
            top:          `${t}%`,
            height:       "1px",
            background:   "rgba(55,38,22,0.06)",
            pointerEvents:"none",
          }}
        />
      ))}

      <div
        style={{
          position:      "relative",
          zIndex:        1,
          maxWidth:      "400px",
          width:         "100%",
          textAlign:     "center",
        }}
      >
        {/* 404 numeral */}
        <motion.span
          {...up(0)}
          style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontWeight:    500,
            fontSize:      "clamp(96px, 26vw, 160px)",
            lineHeight:    1,
            letterSpacing: "-0.03em",
            color:         "#2A2218",
            display:       "block",
            marginBottom:  "24px",
          }}
        >
          404
        </motion.span>

        {/* Divider */}
        <motion.div
          {...up(0.08)}
          style={{
            width:      "48px",
            height:     "1px",
            background: "rgba(55,38,22,0.2)",
            margin:     "0 auto 28px",
          }}
        />

        {/* Heading */}
        <motion.h1
          {...up(0.14)}
          style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontWeight:    400,
            fontSize:      "clamp(18px, 4vw, 24px)",
            lineHeight:    1.4,
            color:         "#2A2218",
            marginBottom:  "12px",
            fontStyle:     "italic",
            letterSpacing: "0.01em",
          }}
        >
          Page not found.
        </motion.h1>

        {/* Body */}
        <motion.p
          {...up(0.18)}
          style={{
            fontFamily:    "'Jost', sans-serif",
            fontSize:      "13px",
            fontWeight:    300,
            lineHeight:    1.8,
            color:         "#5A4E42",
            marginBottom:  "48px",
            letterSpacing: "0.02em",
          }}
        >
          This page doesn't exist. Head back and stay on track.
        </motion.p>

        {/* Buttons */}
        <motion.div
          {...up(0.24)}
          style={{
            display:         "flex",
            gap:             "10px",
            justifyContent:  "center",
            flexWrap:        "wrap",
          }}
        >
          <Link
            to={authed ? "/dashboard" : "/start"}
            style={{
              display:        "inline-flex",
              alignItems:     "center",
              gap:            "7px",
              padding:        "12px 22px",
              borderRadius:   "12px",
              background:     "#B8704E",
              color:          "#FDF7EF",
              fontFamily:     "'Jost', sans-serif",
              fontSize:       "12px",
              fontWeight:     500,
              letterSpacing:  "0.05em",
              textDecoration: "none",
              boxShadow:      "0 4px 14px rgba(184,112,78,0.2)",
            }}
          >
            <RiHome4Line size={14} />
            {authed ? "Back to Dashboard" : "Get Started"}
          </Link>

          <button
            onClick={() => navigate(-1)}
            style={{
              display:       "inline-flex",
              alignItems:    "center",
              gap:           "7px",
              padding:       "12px 22px",
              borderRadius:  "12px",
              background:    "#F9F5EC",
              color:         "#5A4E42",
              fontFamily:    "'Jost', sans-serif",
              fontSize:      "12px",
              fontWeight:    500,
              letterSpacing: "0.05em",
              border:        "1px solid rgba(55,38,22,0.1)",
              cursor:        "pointer",
              boxShadow:     "0 2px 8px rgba(55,38,22,0.05)",
            }}
          >
            <RiArrowLeftLine size={14} />
            Go Back
          </button>

          <Link
            to="/"
            style={{
              display:       "inline-flex",
              alignItems:    "center",
              gap:           "7px",
              padding:       "12px 22px",
              borderRadius:  "12px",
              background:    "transparent",
              color:         "#8A7B6E",
              fontFamily:    "'Jost', sans-serif",
              fontSize:      "12px",
              fontWeight:    400,
              letterSpacing: "0.05em",
              textDecoration: "none",
              border:        "1px solid rgba(55,38,22,0.07)",
            }}
          >
            Back to Home
          </Link>
        </motion.div>

      </div>
    </div>
    </>
  );
}
