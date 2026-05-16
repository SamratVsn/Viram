import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  RiArrowLeftLine,
  RiArrowRightSLine,
  RiUserLine,
  RiLogoutBoxLine,
  RiShieldLine,
  RiTimerLine,
  RiNotificationLine,
  RiDownloadLine,
  RiDeleteBinLine,
  RiAlertLine,
  RiCheckLine,
  RiSunLine,
  RiRefreshLine,
  RiVolumeUpLine,
  RiVolumeMuteLine,
  RiFireLine,
  RiBarChartLine,
} from 'react-icons/ri'
import { supabase } from '../lib/supabase'
import { updateProfile, getProfile, clearAllConfessions } from '../lib/db'
import useViramData from '../hooks/useViramData'
import SEO from '../components/SEO'

/* ─── Grain ───────────────────────────────────────────────────────────────── */
const Grain = () => (
  <div
    aria-hidden="true"
    className="absolute inset-0 pointer-events-none z-0 rounded-[inherit]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)' opacity='0.06'/%3E%3C/svg%3E")`,
      backgroundSize: '180px',
    }}
  />
)

/* ─── Storage helpers (exported for Focus etc.) ──────────────────────────── */
const PREFS_KEY = 'viram_prefs'

export const DEFAULT_PREFS = {
  defaultPomodoro:   25,
  soundEnabled:      true,
  autoStartBreak:    false,
  dailyReminder:     false,
  streakAlert:       true,
  theme:             'parchment',
  showXPAnimations:  true,
  confessionsLocked: false,
}

export function loadPrefs() {
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREFS_KEY) || '{}') }
  } catch { return { ...DEFAULT_PREFS } }
}

function savePrefs(p) {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(p)) } catch {}
}

async function exportData() {
  const data = {
    exported_at:  new Date().toISOString(),
    preferences:  loadPrefs(),
  }
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      const profile = await getProfile(authUser.id)
      if (profile) data.profile = profile
    }
  } catch (e) {
    console.error('exportData profile fetch:', e)
    data.user    = JSON.parse(localStorage.getItem('viram_user')    || 'null')
    data.profile = JSON.parse(localStorage.getItem('viram_profile') || 'null')
  }
  data.confessions = JSON.parse(localStorage.getItem('viram_confessions') || '[]')

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `viram-data-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/* ─── Toast notification ──────────────────────────────────────────────────── */
function Toast({ message, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0,  x: '-50%' }}
          exit={{    opacity: 0, y: 10,  x: '-50%' }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-1/2 z-[300] flex items-center gap-2 px-5 py-3 rounded-full pointer-events-none"
          style={{
            background: '#2A2218',
            color: '#F9F5EC',
            fontFamily: "'Jost', sans-serif",
            fontSize: 13, fontWeight: 500, letterSpacing: '0.02em',
            boxShadow: '0 8px 28px rgba(42,34,24,0.22)',
            whiteSpace: 'nowrap',
          }}
        >
          <RiCheckLine size={14} style={{ color: '#B8704E' }} />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Section label ───────────────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div
      className="px-1 mb-[10px]"
      style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: 10, fontWeight: 600,
        letterSpacing: '0.20em', textTransform: 'uppercase',
        color: '#C4B8A8',
      }}
    >
      {children}
    </div>
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
        boxShadow: '0 2px 10px rgba(42,34,24,0.05)',
      }}
    >
      <Grain />
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}

/* ─── TapRow — navigate or action ────────────────────────────────────────── */
function TapRow({ Icon, label, sublabel, onClick, variant = 'default', showArrow = true, isLast = false }) {
  const [hovered, setHovered] = useState(false)
  const isDanger = variant === 'danger'

  return (
    <motion.button
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-[14px] text-left cursor-pointer outline-none transition-all duration-200"
      style={{
        background: hovered ? (isDanger ? 'rgba(184,112,78,0.05)' : '#F5F0E8') : 'transparent',
        borderBottom: isLast ? 'none' : '1px solid rgba(55,38,22,0.06)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 transition-all duration-200"
        style={{
          background: isDanger && hovered ? 'rgba(184,112,78,0.10)' : hovered ? '#EDE8DF' : '#F0EBE2',
          border: `1px solid ${isDanger && hovered ? 'rgba(184,112,78,0.20)' : 'rgba(55,38,22,0.09)'}`,
        }}
      >
        <Icon size={16} style={{
          color: isDanger ? (hovered ? '#B8704E' : '#C4A898') : (hovered ? '#2A2218' : '#8A7E74'),
          transition: 'color 0.2s',
        }} />
      </div>

      <div className="flex-1 min-w-0">
        <div style={{
          fontFamily: "'Jost', sans-serif", fontSize: 14, fontWeight: 500,
          letterSpacing: '0.01em',
          color: isDanger ? (hovered ? '#B8704E' : '#5A4E42') : (hovered ? '#2A2218' : '#5A4E42'),
          transition: 'color 0.2s',
        }}>
          {label}
        </div>
        {sublabel && (
          <div style={{
            fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 400,
            color: '#C4B8A8', letterSpacing: '0.02em', marginTop: 2,
          }}>
            {sublabel}
          </div>
        )}
      </div>

      {showArrow && (
        <RiArrowRightSLine size={16} style={{
          color: hovered ? (isDanger ? '#B8704E' : '#8A7E74') : '#D4CCBF',
          transform: hovered ? 'translateX(2px)' : 'translateX(0)',
          transition: 'all 0.2s', flexShrink: 0,
        }} />
      )}
    </motion.button>
  )
}

/* ─── ToggleRow ───────────────────────────────────────────────────────────── */
function ToggleRow({ Icon, label, sublabel, value, onChange, isLast = false }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="flex items-center gap-4 px-5 py-[14px] cursor-pointer select-none transition-all duration-200"
      style={{
        background: hovered ? '#F5F0E8' : 'transparent',
        borderBottom: isLast ? 'none' : '1px solid rgba(55,38,22,0.06)',
      }}
      onClick={() => onChange(!value)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 transition-all duration-200"
        style={{
          background: value ? 'rgba(184,112,78,0.10)' : (hovered ? '#EDE8DF' : '#F0EBE2'),
          border: `1px solid ${value ? 'rgba(184,112,78,0.20)' : 'rgba(55,38,22,0.09)'}`,
        }}
      >
        <Icon size={16} style={{ color: value ? '#B8704E' : (hovered ? '#2A2218' : '#8A7E74'), transition: 'color 0.2s' }} />
      </div>

      <div className="flex-1 min-w-0">
        <div style={{
          fontFamily: "'Jost', sans-serif", fontSize: 14, fontWeight: 500,
          letterSpacing: '0.01em', color: hovered ? '#2A2218' : '#5A4E42', transition: 'color 0.2s',
        }}>
          {label}
        </div>
        {sublabel && (
          <div style={{
            fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 400,
            color: '#C4B8A8', letterSpacing: '0.02em', marginTop: 2,
          }}>
            {sublabel}
          </div>
        )}
      </div>

      {/* Toggle pill */}
      <div
        onClick={e => { e.stopPropagation(); onChange(!value) }}
        className="relative flex-shrink-0 w-11 h-6 rounded-full cursor-pointer transition-colors duration-300"
        style={{ background: value ? '#B8704E' : 'rgba(55,38,22,0.14)' }}
      >
        <motion.div
          animate={{ x: value ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          className="absolute top-[3px] w-[18px] h-[18px] rounded-full"
          style={{ background: '#F9F5EC', boxShadow: '0 1px 4px rgba(42,34,24,0.22)' }}
        />
      </div>
    </div>
  )
}

/* ─── SegmentRow — multi-select chips ────────────────────────────────────── */
function SegmentRow({ Icon, label, sublabel, options, value, onChange, isLast = false }) {
  return (
    <div
      className="flex items-start gap-4 px-5 py-[14px]"
      style={{ borderBottom: isLast ? 'none' : '1px solid rgba(55,38,22,0.06)' }}
    >
      <div
        className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 mt-[2px]"
        style={{ background: '#F0EBE2', border: '1px solid rgba(55,38,22,0.09)' }}
      >
        <Icon size={16} style={{ color: '#8A7E74' }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-[10px]">
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, fontWeight: 500, letterSpacing: '0.01em', color: '#5A4E42' }}>
            {label}
          </span>
          {sublabel && (
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 400, color: '#C4B8A8', letterSpacing: '0.02em' }}>
              {sublabel}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-[6px]">
          {options.map(opt => (
            <motion.button
              key={opt.value}
              whileTap={{ scale: 0.96 }}
              onClick={() => onChange(opt.value)}
              className="px-4 py-[6px] rounded-full cursor-pointer transition-all duration-200"
              style={{
                fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
                background: value === opt.value ? '#B8704E' : '#EDE8DF',
                color:      value === opt.value ? '#F9F5EC' : '#8A7E74',
                border:     `1px solid ${value === opt.value ? '#B8704E' : 'rgba(55,38,22,0.10)'}`,
                boxShadow:  value === opt.value ? '0 3px 10px rgba(184,112,78,0.22)' : 'none',
              }}
            >
              {opt.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Confirm / danger modal ──────────────────────────────────────────────── */
function ConfirmModal({ icon: Icon, title, body, confirmLabel, cancelLabel = 'Cancel', onConfirm, onCancel, danger = false }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
      style={{ background: 'rgba(42,34,24,0.28)', backdropFilter: 'blur(7px)', WebkitBackdropFilter: 'blur(7px)' }}
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
          boxShadow: '0 20px 60px rgba(42,34,24,0.18)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <Grain />
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, ${danger ? '#B8704E' : '#8A7E74'}, transparent)` }}
        />

        <div className="relative z-[1]">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{
              background: danger ? 'rgba(184,112,78,0.09)' : 'rgba(138,126,116,0.09)',
              border: `1px solid ${danger ? 'rgba(184,112,78,0.18)' : 'rgba(138,126,116,0.18)'}`,
            }}
          >
            <Icon size={22} style={{ color: danger ? '#B8704E' : '#8A7E74' }} />
          </div>

          <h3 className="mb-[10px]" style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600,
            color: '#2A2218', letterSpacing: '-0.01em',
          }}>
            {title}
          </h3>
          <p className="mb-8" style={{
            fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 400,
            color: '#8A7E74', lineHeight: 1.75, letterSpacing: '0.01em',
          }}>
            {body}
          </p>

          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              className="w-full py-[13px] rounded-[14px] cursor-pointer"
              style={{
                fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                background: danger ? '#B8704E' : '#2A2218', color: '#F9F5EC', border: 'none',
                boxShadow: `0 4px 14px ${danger ? 'rgba(184,112,78,0.28)' : 'rgba(42,34,24,0.16)'}`,
              }}
            >
              {confirmLabel}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="w-full py-[13px] rounded-[14px] cursor-pointer"
              style={{
                fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 500,
                letterSpacing: '0.04em', background: 'transparent', color: '#8A7E74',
                border: '1px solid rgba(55,38,22,0.12)',
              }}
            >
              {cancelLabel}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Main ────────────────────────────────────────────────────────────────── */
export default function Settings({ G }) {
  const navigate              = useNavigate()
  const [prefs, setPrefs]     = useState(loadPrefs)
  const [modal, setModal]     = useState(null)
  const [toast, setToast]     = useState({ visible: false, message: '' })
  const { user: profileData, loading: profileLoading } = useViramData()

  const showToast = (msg) => {
    setToast({ visible: true, message: msg })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2200)
  }

  const setPref = (key, val) => {
    const next = { ...prefs, [key]: val }
    setPrefs(next)
    savePrefs(next)
    showToast('Preference saved')
  }

  /* ── Actions ─────────────────────────────────────────────────────────── */
  const userId = profileData?.id

  const doLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (e) {
      console.error('doLogout:', e)
    }
    ;['viram_user', 'viram_profile', 'viram_confessions', PREFS_KEY].forEach(k => localStorage.removeItem(k))
    navigate('/start')
  }

  const doResetAvatar = async () => {
    if (userId) {
      try {
        await updateProfile(userId, {
          xp: 0, coins: 0, discipline_points: 0, streak: 0,
          last_login: null,
        })
      } catch (e) {
        console.error('doResetAvatar:', e)
      }
    }
    localStorage.setItem('viram_profile', JSON.stringify({}))
    localStorage.setItem('viram_user', JSON.stringify({}))
    showToast('Avatar reset — start from zero')
    setModal(null)
  }

  const doClearConfessions = async () => {
    if (userId) {
      try {
        await clearAllConfessions(userId)
      } catch (e) {
        console.error('doClearConfessions:', e)
      }
    }
    localStorage.removeItem('viram_confessions')
    showToast('Confessions cleared')
    setModal(null)
  }

  const doClearAll = async () => {
    try {
      await supabase.auth.signOut()
    } catch (e) {
      console.error('doClearAll:', e)
    }
    ;['viram_user', 'viram_profile', 'viram_confessions', PREFS_KEY].forEach(k => localStorage.removeItem(k))
    navigate('/start')
  }

  /* ── Read profile ─────────────────────────────────────────────────────── */
  const profile   = profileData || {}
  const displayName = profile.avatarName || profile.name?.split(' ')[0] || 'Viram User'
  const initials    = (profile.name || profile.avatarName || 'VU').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const ARCHETYPE_MAP = {
    study:      'THE SCHOLAR',
    deepwork:   'THE ARCHITECT',
    health:     'THE ATHLETE',
    discipline: 'THE WARRIOR',
    detox:      'THE MONK',
  }
  const archetypeTitle = ARCHETYPE_MAP[profile.mission] || ''

  /* ── Sections (declarative list makes adding later easy) ──────────────── */
  const sections = [
    {
      id: 'focus',
      label: 'Focus Engine',
      delay: 0.06,
      content: (
        <SettingsGroup>
          <SegmentRow
            Icon={RiTimerLine}
            label="Default session"
            sublabel="minutes"
            options={[
              { label: '15m', value: 15 },
              { label: '30m', value: 30 },
              { label: '45m', value: 45 },
              { label: '60m', value: 60 },
            ]}
            value={prefs.defaultPomodoro}
            onChange={v => setPref('defaultPomodoro', v)}
          />
          <ToggleRow
            Icon={prefs.soundEnabled ? RiVolumeUpLine : RiVolumeMuteLine}
            label="Session sounds"
            sublabel="Bell chime when a session completes"
            value={prefs.soundEnabled}
            onChange={v => setPref('soundEnabled', v)}
          />
          <ToggleRow
            Icon={RiRefreshLine}
            label="Auto-start break"
            sublabel="Begin rest timer immediately after focus"
            value={prefs.autoStartBreak}
            onChange={v => setPref('autoStartBreak', v)}
            isLast
          />
        </SettingsGroup>
      ),
    },
    {
      id: 'reminders',
      label: 'Reminders',
      delay: 0.10,
      content: (
        <SettingsGroup>
          <ToggleRow
            Icon={RiNotificationLine}
            label="Daily focus reminder"
            sublabel="Browser notification to start your session"
            value={prefs.dailyReminder}
            onChange={v => {
              if (v && 'Notification' in window) {
                Notification.requestPermission().then(p => {
                  if (p === 'granted') setPref('dailyReminder', true)
                  else showToast('Allow notifications in browser settings')
                })
              } else {
                setPref('dailyReminder', v)
              }
            }}
          />
          <ToggleRow
            Icon={RiFireLine}
            label="Streak alert"
            sublabel="Remind me before my daily streak breaks"
            value={prefs.streakAlert}
            onChange={v => setPref('streakAlert', v)}
            isLast
          />
        </SettingsGroup>
      ),
    },
    {
      id: 'appearance',
      label: 'Appearance',
      delay: 0.14,
      content: (
        <SettingsGroup>
          <SegmentRow
            Icon={RiSunLine}
            label="Theme"
            options={[
              { label: '☀ Parchment', value: 'parchment' },
              { label: '⬛ Dark',      value: 'dark'      },
              { label: '⚙ System',    value: 'system'    },
            ]}
            value={prefs.theme}
            onChange={v => setPref('theme', v)}
          />
          <ToggleRow
            Icon={RiBarChartLine}
            label="XP animations"
            sublabel="Floating +XP numbers when you make progress"
            value={prefs.showXPAnimations}
            onChange={v => setPref('showXPAnimations', v)}
            isLast
          />
        </SettingsGroup>
      ),
    },
    {
      id: 'data',
      label: 'Data & Privacy',
      delay: 0.18,
      content: (
        <SettingsGroup>
          <ToggleRow
            Icon={RiShieldLine}
            label="Lock confessions"
            sublabel="Require device auth before viewing confessional"
            value={prefs.confessionsLocked}
            onChange={v => setPref('confessionsLocked', v)}
          />
          <TapRow
            Icon={RiDownloadLine}
            label="Export my data"
            sublabel="Download a JSON copy of all your Viram data"
            onClick={() => { exportData(); showToast('Data exported successfully') }}
          />
          <TapRow
            Icon={RiDeleteBinLine}
            label="Clear confessions"
            sublabel="Permanently remove all confessional entries"
            onClick={() => setModal('clear_confessions')}
            variant="danger"
            isLast
          />
        </SettingsGroup>
      ),
    },
    {
      id: 'avatar',
      label: 'Avatar & Progress',
      delay: 0.22,
      content: (
        <SettingsGroup>
          <TapRow
            Icon={RiRefreshLine}
            label="Reset avatar"
            sublabel="Wipe XP, streak & all stats — begin from zero"
            onClick={() => setModal('reset_avatar')}
            variant="danger"
            isLast
          />
        </SettingsGroup>
      ),
    },
    {
      id: 'account',
      label: 'Account',
      delay: 0.26,
      content: (
        <SettingsGroup>
          <TapRow
            Icon={RiUserLine}
            label="Edit profile"
            sublabel="Name, handle, avatar preferences"
            onClick={() => navigate('/profile')}
          />
          <TapRow
            Icon={RiAlertLine}
            label="Erase all data"
            sublabel="Delete everything and start fresh — irreversible"
            onClick={() => setModal('clear_all')}
            variant="danger"
          />
          <TapRow
            Icon={RiLogoutBoxLine}
            label="Sign out"
            sublabel="You'll return to the start screen"
            onClick={() => setModal('logout')}
            variant="danger"
            showArrow={false}
            isLast
          />
        </SettingsGroup>
      ),
    },
  ]

  return (
    <>
      <SEO title="Settings" description="Customize your Viram experience — focus timer preferences, reminders, appearance, and data management." noIndex />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col overflow-hidden"
        style={{ background: '#F4EEE3' }}
      >
        <Grain />

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div
          className="relative z-[1] flex items-center justify-between px-6 h-[56px] flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(55,38,22,0.07)', boxShadow: '0 1px 3px rgba(42,34,24,0.06)' }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer"
            style={{ background: '#EDE8DF', border: '1px solid rgba(55,38,22,0.12)', color: '#8A7E74', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E0DAD0'; e.currentTarget.style.color = '#2A2218' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#EDE8DF'; e.currentTarget.style.color = '#8A7E74' }}
          >
            <RiArrowLeftLine size={16} />
          </motion.button>

          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600, letterSpacing: '0.04em', color: '#2A2218' }}>
            Settings
          </div>

          <div className="w-9 h-9" />
        </div>

        {/* ── Scrollable body ─────────────────────────────────────────── */}
        <div className="relative z-[1] flex-1 overflow-y-auto">
          <div className="max-w-[500px] mx-auto px-5 pt-8 pb-20 flex flex-col gap-7">

            {/* ── Profile card ──────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate('/profile')}
                className="relative rounded-[22px] overflow-hidden p-5 cursor-pointer transition-shadow duration-200"
                style={{
                  background: '#F9F5EC',
                  border: '1px solid rgba(55,38,22,0.12)',
                  boxShadow: '0 4px 16px rgba(42,34,24,0.07)',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(42,34,24,0.10)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(42,34,24,0.07)'}
              >
                <Grain />
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, #B8704E, rgba(184,112,78,0.25), transparent)' }} />

                <div className="relative z-[1] flex items-center gap-4">
                  {/* Avatar orb */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                    style={{ background: '#EDE8DF', border: '1px solid rgba(55,38,22,0.14)' }}
                  >
                    {profile.picture
                      ? <img src={profile.picture} alt={displayName} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: '#2A2218' }}>
                          {initials}
                        </span>
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: '#2A2218', letterSpacing: '-0.01em' }}>
                      {displayName}
                    </div>
                    {archetypeTitle && (
                      <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 500, color: '#B8704E', letterSpacing: '0.06em', marginTop: 1 }}>
                        {archetypeTitle}
                      </div>
                    )}
                    <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 400, color: '#A89B8C', letterSpacing: '0.04em', marginTop: 1 }}>
                      Tap to edit profile
                    </div>
                  </div>

                  {/* Live XP if avatar data is passed in */}
                  {G && (
                    <div className="text-right flex-shrink-0 mr-1">
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: '#B8704E', lineHeight: 1 }}>
                        {G.xp ?? 0}
                      </div>
                      <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C4B8A8', marginTop: 3 }}>
                        XP
                      </div>
                    </div>
                  )}

                  <RiArrowRightSLine size={16} style={{ color: '#D4CCBF', flexShrink: 0 }} />
                </div>
              </motion.div>
            </motion.div>

            {/* ── Dynamic sections ────────────────────────────────────── */}
            {sections.map(({ id, label, delay, content }) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <SectionLabel>{label}</SectionLabel>
                {content}
              </motion.div>
            ))}

            {/* ── Footer ──────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32 }}
              className="text-center pt-2 pb-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-[rgba(55,38,22,0.07)]" />
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 12, color: '#C4B8A8', letterSpacing: '0.02em' }}>
                  Viram · 2026
                </span>
                <div className="flex-1 h-px bg-[rgba(55,38,22,0.07)]" />
              </div>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 400, color: '#C4B8A8', letterSpacing: '0.04em', lineHeight: 1.7 }}>
                Built for those who refuse to be the product.
              </p>
            </motion.div>

          </div>
        </div>
      </motion.div>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {modal === 'logout' && (
          <ConfirmModal key="logout"
            icon={RiLogoutBoxLine}
            title="Sign out of Viram?"
            body="Your progress is saved locally. Come back when you're ready to focus."
            confirmLabel="Sign Out"
            cancelLabel="Stay"
            onConfirm={doLogout}
            onCancel={() => setModal(null)}
          />
        )}
        {modal === 'reset_avatar' && (
          <ConfirmModal key="reset_avatar"
            icon={RiRefreshLine}
            title="Reset your avatar?"
            body="All XP, streaks, energy, and stats return to zero. This cannot be undone."
            confirmLabel="Reset Avatar"
            cancelLabel="Keep Progress"
            onConfirm={doResetAvatar}
            onCancel={() => setModal(null)}
            danger
          />
        )}
        {modal === 'clear_confessions' && (
          <ConfirmModal key="clear_confessions"
            icon={RiDeleteBinLine}
            title="Clear all confessions?"
            body="Every entry in your confessional will be permanently removed. This cannot be undone."
            confirmLabel="Clear All"
            cancelLabel="Keep Them"
            onConfirm={doClearConfessions}
            onCancel={() => setModal(null)}
            danger
          />
        )}
        {modal === 'clear_all' && (
          <ConfirmModal key="clear_all"
            icon={RiAlertLine}
            title="Erase everything?"
            body="Your profile, avatar, confessions, and all preferences will be permanently wiped. There is no recovery."
            confirmLabel="Erase Everything"
            cancelLabel="Go Back"
            onConfirm={doClearAll}
            onCancel={() => setModal(null)}
            danger
          />
        )}
      </AnimatePresence>

      <Toast message={toast.message} visible={toast.visible} />
    </>
  )
}