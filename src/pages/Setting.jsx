import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  RiArrowLeftLine,
  RiArrowRightSLine,
  RiUserLine,
  RiLogoutBoxLine,
  RiSettingsLine,
  RiShieldLine,
} from 'react-icons/ri'

/* ─── Font loader ─────────────────────────────────────────────────────────── */
const FontLoader = () => (
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap"
  />
)

/* ─── Grain ───────────────────────────────────────────────────────────────── */
const Grain = () => (
  <div
    aria-hidden="true"
    className="absolute inset-0 pointer-events-none z-0 rounded-[inherit]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)' opacity='0.03'/%3E%3C/svg%3E")`,
    }}
  />
)

/* ─── Section label ───────────────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div
      className="px-1 mb-2"
      style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.20em',
        textTransform: 'uppercase',
        color: '#C4B8A8',
      }}
    >
      {children}
    </div>
  )
}

/* ─── Settings row ────────────────────────────────────────────────────────── */
function SettingsRow({ Icon, label, sublabel, onClick, variant = 'default', showArrow = true, isLast = false }) {
  const [hovered, setHovered] = useState(false)

  const isDanger  = variant === 'danger'
  const iconColor = isDanger
    ? (hovered ? '#B8704E' : '#C4A898')
    : (hovered ? '#2A2218' : '#8A7E74')
  const textColor = isDanger
    ? (hovered ? '#B8704E' : '#5A4E42')
    : (hovered ? '#2A2218' : '#5A4E42')

  return (
    <motion.button
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="relative w-full flex items-center gap-4 px-5 py-[15px] text-left cursor-pointer transition-all duration-200 outline-none"
      style={{
        background: hovered
          ? (isDanger ? 'rgba(184,112,78,0.05)' : '#F9F5EC')
          : 'transparent',
        borderBottom: isLast ? 'none' : '1px solid rgba(55,38,22,0.06)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon chip */}
      <div
        className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 transition-all duration-200"
        style={{
          background: isDanger && hovered
            ? 'rgba(184,112,78,0.10)'
            : hovered ? '#EDE8DF' : '#F0EBE2',
          border: `1px solid ${
            isDanger && hovered
              ? 'rgba(184,112,78,0.20)'
              : 'rgba(55,38,22,0.09)'
          }`,
        }}
      >
        <Icon size={16} style={{ color: iconColor, transition: 'color 0.2s ease' }} />
      </div>

      {/* Label block */}
      <div className="flex-1 min-w-0">
        <div
          className="transition-colors duration-200"
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.01em',
            color: textColor,
          }}
        >
          {label}
        </div>
        {sublabel && (
          <div
            className="mt-[2px]"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              fontWeight: 400,
              color: '#C4B8A8',
              letterSpacing: '0.02em',
            }}
          >
            {sublabel}
          </div>
        )}
      </div>

      {/* Arrow */}
      {showArrow && (
        <RiArrowRightSLine
          size={16}
          className="flex-shrink-0 transition-all duration-200"
          style={{
            color: hovered ? (isDanger ? '#B8704E' : '#8A7E74') : '#D4CCBF',
            transform: hovered ? 'translateX(2px)' : 'translateX(0)',
          }}
        />
      )}
    </motion.button>
  )
}

/* ─── Settings group card ─────────────────────────────────────────────────── */
function SettingsGroup({ children }) {
  return (
    <div
      className="relative rounded-[18px] overflow-hidden"
      style={{
        background: '#F9F5EC',
        border: '1px solid rgba(55,38,22,0.10)',
        boxShadow: '0 2px 10px rgba(42,34,24,0.05), 0 1px 3px rgba(42,34,24,0.04)',
      }}
    >
      <Grain />
      <div className="relative z-[1]">
        {children}
      </div>
    </div>
  )
}

/* ─── Logout confirmation modal ───────────────────────────────────────────── */
function LogoutModal({ onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
      style={{ background: 'rgba(42,34,24,0.22)', backdropFilter: 'blur(6px)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1     }}
        exit={{    opacity: 0, y: 24, scale: 0.98   }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[360px] rounded-[24px] overflow-hidden p-8 text-center"
        style={{
          background: '#F9F5EC',
          border: '1px solid rgba(55,38,22,0.12)',
          boxShadow: '0 20px 60px rgba(42,34,24,0.14), 0 6px 20px rgba(42,34,24,0.08)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <Grain />

        {/* Terracotta accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, #B8704E, rgba(184,112,78,0.3), transparent)',
          }}
        />

        <div className="relative z-[1]">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{
              background: 'rgba(184,112,78,0.09)',
              border: '1px solid rgba(184,112,78,0.18)',
            }}
          >
            <RiLogoutBoxLine size={22} style={{ color: '#B8704E' }} />
          </div>

          <h3
            className="mb-2"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22,
              fontWeight: 600,
              color: '#2A2218',
              letterSpacing: '-0.01em',
            }}
          >
            Sign out of Viram?
          </h3>

          <p
            className="mb-8"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 13,
              fontWeight: 400,
              color: '#8A7E74',
              lineHeight: 1.75,
              letterSpacing: '0.01em',
            }}
          >
            Your progress is saved. Come back when you're ready to focus.
          </p>

          <div className="flex flex-col gap-3">
            {/* Confirm */}
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              className="w-full py-[13px] rounded-[14px] cursor-pointer transition-all duration-200"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: '#2A2218',
                color: '#F9F5EC',
                border: 'none',
                boxShadow: '0 4px 14px rgba(42,34,24,0.16)',
              }}
            >
              Sign Out
            </motion.button>

            {/* Cancel */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="w-full py-[13px] rounded-[14px] cursor-pointer transition-all duration-200"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: '0.04em',
                background: 'transparent',
                color: '#8A7E74',
                border: '1px solid rgba(55,38,22,0.12)',
              }}
            >
              Stay
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function Settings({ onBack }) {
  const navigate              = useNavigate()
  const [showLogout, setShowLogout] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('viram_user')
    localStorage.removeItem('viram_profile')
    navigate('/start')
  }

  return (
    <>
      <FontLoader />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col overflow-hidden"
        style={{ background: '#F4EEE3' }}
      >
        <Grain />

        {/* ── Header ────────────────────────────────────────────────── */}
        <div
          className="relative z-[1] flex items-center justify-between px-6 h-[56px] flex-shrink-0"
          style={{
            borderBottom: '1px solid rgba(55,38,22,0.07)',
            boxShadow: '0 1px 3px rgba(42,34,24,0.06)',
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer"
            style={{
              background: '#EDE8DF',
              border: '1px solid rgba(55,38,22,0.12)',
              color: '#8A7E74',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#E0DAD0'
              e.currentTarget.style.color = '#2A2218'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#EDE8DF'
              e.currentTarget.style.color = '#8A7E74'
            }}
          >
            <RiArrowLeftLine size={16} />
          </motion.button>

          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: '#2A2218',
            }}
          >
            Settings
          </div>

          {/* Spacer to keep title centred */}
          <div className="w-9 h-9" />
        </div>

        {/* ── Scrollable body ───────────────────────────────────────── */}
        <div className="relative z-[1] flex-1 overflow-y-auto">
          <div className="max-w-[480px] mx-auto px-5 pt-8 pb-16 flex flex-col gap-7">

            {/* Page heading */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(28px, 6vw, 36px)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: '#2A2218',
                  lineHeight: 1.1,
                }}
              >
                Your space,<br />
                <span style={{ fontStyle: 'italic', color: '#A89B8C' }}>your rules.</span>
              </div>
              <p
                className="mt-3"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 13,
                  fontWeight: 400,
                  color: '#A89B8C',
                  lineHeight: 1.7,
                  letterSpacing: '0.01em',
                }}
              >
                More options coming soon. Keep building.
              </p>
            </motion.div>

            {/* ── Account group ─────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <SectionLabel>Account</SectionLabel>
              <SettingsGroup>
                <SettingsRow
                  Icon={RiUserLine}
                  label="Edit Profile"
                  sublabel="Name, avatar, preferences"
                  onClick={() => navigate('/profile')}
                  isLast
                />
              </SettingsGroup>
            </motion.div>

            {/* ── Placeholder group ──────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <SectionLabel>Privacy & Data</SectionLabel>
              <SettingsGroup>
                <SettingsRow
                  Icon={RiShieldLine}
                  label="Privacy"
                  sublabel="Coming soon"
                  onClick={() => {}}
                  isLast
                />
              </SettingsGroup>
            </motion.div>

            {/* ── Sign out group ─────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.20, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <SectionLabel>Session</SectionLabel>
              <SettingsGroup>
                <SettingsRow
                  Icon={RiLogoutBoxLine}
                  label="Sign out"
                  sublabel="You'll be taken to the start screen"
                  onClick={() => setShowLogout(true)}
                  variant="danger"
                  isLast
                />
              </SettingsGroup>
            </motion.div>

            {/* ── Footer note ───────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 pt-2"
            >
              <div className="flex-1 h-px bg-[rgba(55,38,22,0.07)]" />
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontSize: 12,
                  color: '#C4B8A8',
                  letterSpacing: '0.02em',
                }}
              >
                Viram · 2026
              </span>
              <div className="flex-1 h-px bg-[rgba(55,38,22,0.07)]" />
            </motion.div>

          </div>
        </div>

        {/* ── Logout confirmation ───────────────────────────────────── */}
        {showLogout && (
          <LogoutModal
            onConfirm={handleLogout}
            onCancel={() => setShowLogout(false)}
          />
        )}
      </motion.div>
    </>
  )
}