import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar({ onStartJourney }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const el = document.getElementById('s-land')
    if (!el) return
    const h = () => setScrolled(el.scrollTop > 40)
    el.addEventListener('scroll', h)
    return () => el.removeEventListener('scroll', h)
  }, [])

  const linkStyle = {
    fontSize: 14,
    color: '#8888a8',
    fontWeight: 500,
    textDecoration: 'none',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'color 0.2s',
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5vw', height: 70,
        background: scrolled ? 'rgba(7,7,13,0.9)' : '#000000',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        transition: 'background 0.3s, backdrop-filter 0.3s',
      }}
    >
      {/* Text Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <span style={{
          fontFamily: "'Georgia', serif",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '0.18em',
          color: '#ffffff',
          lineHeight: 1,
        }}>
          VI
        </span>
        <span style={{
          fontFamily: "'Georgia', serif",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '0.18em',
          color: '#7c5cfc',
          lineHeight: 1,
        }}>
          RAM
        </span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <Link
          to="/"
          style={linkStyle}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = '#8888a8'}
        >
          The Problem
        </Link>

        <Link
          to="/"
          style={linkStyle}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = '#8888a8'}
        >
          Features
        </Link>

        <Link
          to="/"
          style={linkStyle}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = '#8888a8'}
        >
          Resources
        </Link>

        <Link
          to="/"
          style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: 5 }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = '#8888a8'}
        >
          <i className="ri-book-open-line" style={{ color: '#00d4a8', fontSize: 15 }} />
          Library
        </Link>
      </div>

      {/* CTA */}
      <button
        onClick={onStartJourney}
        style={{
          padding: '9px 22px', borderRadius: 40,
          background: 'linear-gradient(135deg, #7c5cfc, #4a35c9)',
          color: '#fff', fontSize: 13, fontWeight: 600,
          border: 'none', cursor: 'none', fontFamily: "'DM Sans', sans-serif",
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,92,252,0.45)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        Start Your Journey
      </button>
    </motion.nav>
  )
}