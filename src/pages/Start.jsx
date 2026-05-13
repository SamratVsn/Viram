import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { getProfile, upsertProfile } from '../lib/db'
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiShieldKeyholeLine,
  RiUserLine,
  RiLogoutBoxLine,
  RiRocketLine,
  RiCheckLine,
  RiEyeLine,
  RiEyeOffLine,
  RiMailLine,
  RiLockPasswordLine,
  RiUserSmileLine,
  RiLeafLine,
} from 'react-icons/ri'

/* ─── Design Tokens ─────────────────────────────────────── */
const T = {
  bg:        '#F4EEE3',
  card:      '#F9F5EC',
  cardDeep:  '#F1EBD9',          // slightly deeper card for inset fields
  inkHigh:   '#2A2218',
  inkMid:    '#5A4E42',
  inkLow:    '#8A7B6E',
  inkGhost:  'rgba(55,38,22,0.18)',
  border:    'rgba(55,38,22,0.07)',
  borderMid: 'rgba(55,38,22,0.13)',
  accent:    '#B8704E',
  accentBg:  'rgba(184,112,78,0.08)',
  accentBorder: 'rgba(184,112,78,0.22)',
  heading:   "'Cormorant Garamond', Georgia, serif",
  body:      "'Jost', system-ui, sans-serif",
  rSm:       '10px',
  rMd:       '18px',
  rLg:       '26px',
  rPill:     '100px',
}

/* Grain SVG as data URI */
const GRAIN_URL =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

/* ─── Global styles ─────────────────────────────────────── */
const GLOBAL = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Jost:wght@300;400;500;600&display=swap');

  /* Grain overlay on page */
  .viram-bg::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: ${GRAIN_URL};
    background-repeat: repeat;
    opacity: 0.03;
    pointer-events: none;
    z-index: 9999;
  }

  /* Grain on cards */
  .viram-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: ${GRAIN_URL};
    background-repeat: repeat;
    opacity: 0.035;
    pointer-events: none;
    z-index: 1;
    border-radius: inherit;
  }
  .viram-card > * { position: relative; z-index: 2; }

  /* Auth input */
  .viram-input {
    width: 100%;
    background: ${T.cardDeep};
    border: 1px solid rgba(55,38,22,0.10);
    border-radius: ${T.rSm};
    padding: 13px 16px 13px 44px;
    font-family: ${T.body};
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.01em;
    color: ${T.inkHigh};
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  .viram-input::placeholder { color: rgba(55,38,22,0.25); }
  .viram-input:focus {
    border-color: rgba(184,112,78,0.40);
    box-shadow: 0 0 0 3px rgba(184,112,78,0.07);
  }

  /* Animations */
  @keyframes float-slow {
    0%,100% { transform: translateY(0px) rotate(-1deg); }
    50%      { transform: translateY(-9px) rotate(1deg); }
  }
  @keyframes drift {
    0%   { transform: translate(0, 0) rotate(0deg); }
    33%  { transform: translate(6px, -8px) rotate(2deg); }
    66%  { transform: translate(-4px, 5px) rotate(-1deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
  @keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%     { opacity:.4; transform:scale(.7); }
  }
  @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes spin-rev  { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
`

/* ─── Framer ease ───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1]

/* ─── Background decoration ─────────────────────────────── */
function PageBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* warm radial wash */}
      <div style={{
        position:   'absolute',
        top:        '-20%',
        left:       '50%',
        transform:  'translateX(-50%)',
        width:      700,
        height:     700,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(184,112,78,0.07) 0%, transparent 65%)',
        filter:     'blur(60px)',
      }} />
      {/* subtle paper lines (ruled notepad feel) */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.025 }}>
        <defs>
          <pattern id="lines" width="1" height="36" patternUnits="userSpaceOnUse">
            <line x1="0" y1="35.5" x2="9999" y2="35.5" stroke={T.inkHigh} strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lines)" />
      </svg>
      {/* floating organic shapes */}
      <div style={{
        position:     'absolute',
        top:          '12%',
        right:        '8%',
        width:        160,
        height:       160,
        borderRadius: '62% 38% 46% 54% / 60% 44% 56% 40%',
        border:       `1px solid rgba(184,112,78,0.10)`,
        animation:    'drift 18s ease-in-out infinite',
      }} />
      <div style={{
        position:     'absolute',
        bottom:       '15%',
        left:         '6%',
        width:        110,
        height:       110,
        borderRadius: '44% 56% 60% 40% / 50% 60% 40% 50%',
        border:       `1px solid rgba(55,38,22,0.06)`,
        animation:    'drift 24s ease-in-out infinite reverse',
      }} />
    </div>
  )
}

/* ─── Logo mark ─────────────────────────────────────────── */
function LogoMark() {
  return (
    <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 32px' }}>
      {/* outer dashed ring */}
      <svg
        style={{ position: 'absolute', inset: -20, width: 'calc(100% + 40px)', height: 'calc(100% + 40px)', animation: 'spin-slow 30s linear infinite' }}
        viewBox="0 0 160 160"
      >
        <circle cx="80" cy="80" r="74" fill="none" stroke={T.accentBorder} strokeWidth="1" strokeDasharray="4 12" />
      </svg>
      {/* inner ring */}
      <svg
        style={{ position: 'absolute', inset: -8, width: 'calc(100% + 16px)', height: 'calc(100% + 16px)', animation: 'spin-rev 18s linear infinite' }}
        viewBox="0 0 112 112"
      >
        <circle cx="56" cy="56" r="52" fill="none" stroke={T.border} strokeWidth="1" strokeDasharray="2 8" />
      </svg>
      {/* core disc */}
      <div style={{
        width:          80,
        height:         80,
        borderRadius:   '50%',
        background:     T.card,
        border:         `1px solid ${T.borderMid}`,
        boxShadow:      `0 4px 20px rgba(55,38,22,0.08), inset 0 1px 0 rgba(255,255,255,0.6)`,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        animation:      'float-slow 5.5s ease-in-out infinite',
      }}>
        <span style={{
          fontFamily:    T.heading,
          fontWeight:    700,
          fontSize:      22,
          letterSpacing: '0.14em',
          color:         T.inkHigh,
          userSelect:    'none',
        }}>VI</span>
      </div>
    </div>
  )
}

/* ─── Input with leading icon ───────────────────────────── */
function AuthInput({ icon: Icon, type = 'text', placeholder, value, onChange, right }) {
  return (
    <div style={{ position: 'relative' }}>
      <Icon
        size={14}
        style={{
          position:  'absolute',
          left:      15,
          top:       '50%',
          transform: 'translateY(-50%)',
          color:     T.inkLow,
          pointerEvents: 'none',
        }}
      />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="viram-input"
      />
      {right && (
        <button
          type="button"
          onClick={right.onClick}
          tabIndex={-1}
          style={{
            position:   'absolute',
            right:      13,
            top:        '50%',
            transform:  'translateY(-50%)',
            background: 'none',
            border:     'none',
            padding:    0,
            cursor:     'pointer',
            color:      T.inkLow,
          }}
        >
          {right.icon}
        </button>
      )}
    </div>
  )
}

/* ─── Inline divider ─────────────────────────────────────── */
function OrDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
      <div style={{ flex: 1, height: 1, background: T.border }} />
      <span style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.inkLow }}>
        or with email
      </span>
      <div style={{ flex: 1, height: 1, background: T.border }} />
    </div>
  )
}

/* ─── Google "G" SVG ─────────────────────────────────────── */
const GoogleG = () => (
  <svg width="15" height="15" viewBox="0 0 18 18">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.705 17.64 9.2z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

/* ─── Shared card shell ─────────────────────────────────── */
function CardShell({ children, style = {} }) {
  return (
    <div
      className="viram-card"
      style={{
        position:     'relative',
        overflow:     'hidden',
        background:   T.card,
        border:       `1px solid ${T.border}`,
        borderRadius: T.rLg,
        boxShadow:    `0 8px 40px rgba(55,38,22,0.10), 0 1px 0 rgba(255,255,255,0.7) inset`,
        width:        '100%',
        maxWidth:     460,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────── */
export default function Start() {
  const navigate = useNavigate()

  const [tab,      setTab]      = useState('signup')
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [pass,     setPass]     = useState('')
  const [showPass, setShowPass] = useState(false)
  const [user,     setUser]     = useState(null)
  const [status,   setStatus]   = useState('')
  const [isNew,    setIsNew]    = useState(false)
  const [errMsg,   setErrMsg]   = useState('')
  const [onboarded, setOnboarded] = useState(false)

  useEffect(() => {
    let cancelled = false
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled || !session) return
      const profile = await getProfile(session.user.id)
      if (cancelled) return
      const metaName = session.user.user_metadata?.full_name || session.user.user_metadata?.name
      const metaPicture = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture
      setUser({
        name: metaName || profile?.name || session.user.email?.split('@')[0] || 'User',
        email: session.user.email,
        picture: metaPicture || profile?.picture || null,
      })
      setOnboarded(profile?.onboarded === true || checkLocalOnboarded())
    }).catch(err => console.error('Session check:', err))
    return () => { cancelled = true }
  }, [navigate])

  function checkLocalOnboarded() {
    try {
      const raw = localStorage.getItem('viram_profile')
      if (!raw) return false
      return JSON.parse(raw)?.onboarded === true
    } catch { return false }
  }

  useEffect(() => {
    if (status === 'success') {
      const t = setTimeout(async () => {
        if (isNew) {
          navigate('/onboarding', { replace: true })
        } else {
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            const profile = await getProfile(session.user.id)
            navigate(profile?.onboarded ? '/dashboard' : '/onboarding', { replace: true })
          } else {
            navigate('/dashboard', { replace: true })
          }
        }
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [status, navigate, isNew])

  const handleGoogleLogin = async () => {
    try {
      setStatus('loading')
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/callback` },
      })
      if (error) throw error
    } catch (err) {
      console.error('Google sign-in:', err)
      setStatus('error'); setErrMsg('Google sign-in failed.')
    }
  }

  async function handleEmailSubmit(e) {
    e.preventDefault()
    setErrMsg('')
    setStatus('loading')

    if (!email.trim() || !pass.trim() || (tab === 'signup' && !name.trim())) {
      setErrMsg('Please fill in all fields.')
      setStatus('')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrMsg('Please enter a valid email address.')
      setStatus('')
      return
    }

    if (pass.length < 6) {
      setErrMsg('Password must be at least 6 characters.')
      setStatus('')
      return
    }

    try {
      if (tab === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: pass,
          options: { data: { name: name.trim() } },
        })
        if (error) throw error

        if (data?.user) {
          await upsertProfile(data.user.id, { name: name.trim() })
        }

        setUser({ name: name.trim(), email: email.trim(), picture: null })
        setIsNew(true)
        setStatus('success')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: pass,
        })
        if (error) throw error

        setUser({ name: email.trim().split('@')[0], email: email.trim(), picture: null })
        setIsNew(false)
        setStatus('success')
      }
    } catch (err) {
      setErrMsg(err.message || 'Authentication failed.')
      setStatus('')
    }
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('signOut:', err)
    }
    /* Clear any remaining localStorage data */
    ;['viram_user', 'viram_focus_today', 'viram_confessions', 'viram_morning_intention',
      'viram_digital_fast', 'viram_skills', 'viram_profile', 'viram_morning_coin_date',
    ].forEach(k => localStorage.removeItem(k))
    setUser(null); setStatus(''); setIsNew(false); setErrMsg('')
    setName(''); setEmail(''); setPass(''); setShowPass(false); setTab('signup'); setOnboarded(false)
    navigate('/')
  }

  const isLoading = status === 'loading'

  return (
    <>
      <style>{GLOBAL}</style>

      <div
        className="viram-bg"
        style={{
          minHeight:      '100vh',
          background:     T.bg,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        '40px 20px',
          position:       'relative',
          overflow:       'hidden',
        }}
      >
        <PageBackground />

        {/* Nav wordmark */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '20px 6vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 20, letterSpacing: '0.14em', color: T.inkHigh }}>
              VI<span style={{ color: T.accent }}>RAM</span>
            </span>
          </Link>
          <Link
            to="/"
            style={{
              fontFamily:    T.body,
              fontSize:      12,
              fontWeight:    500,
              color:         T.inkLow,
              textDecoration: 'none',
              display:       'flex',
              alignItems:    'center',
              gap:           5,
              letterSpacing: '0.04em',
            }}
          >
            <RiArrowLeftLine size={12} /> Back
          </Link>
        </div>

        <AnimatePresence mode="wait">

          {/* ── SUCCESS ──────────────────────────────────────── */}
          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6, ease }}
              style={{ width: '100%', maxWidth: 460 }}
            >
              <CardShell>
                <div style={{ padding: '52px 44px', textAlign: 'center' }}>
                  <div style={{
                    width:          60,
                    height:         60,
                    borderRadius:   '50%',
                    background:     T.accentBg,
                    border:         `1px solid ${T.accentBorder}`,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    margin:         '0 auto 24px',
                    color:          T.accent,
                  }}>
                    <RiCheckLine size={24} />
                  </div>
                  <div style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 32, color: T.inkHigh, marginBottom: 10, letterSpacing: '-0.01em' }}>
                    {isNew ? 'Welcome aboard.' : 'Welcome back.'}
                  </div>
                  <p style={{ fontFamily: T.body, fontWeight: 300, fontSize: 14, color: T.inkMid, lineHeight: 1.85, maxWidth: 260, margin: '0 auto 28px' }}>
                    {isNew ? 'Setting up your profile and building your avatar…' : 'Your focus space is ready. Redirecting you now.'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: T.body, fontSize: 12, color: T.inkLow }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.accent, display: 'inline-block', animation: 'pulse-dot 1.4s ease-in-out infinite' }} />
                    Taking you to onboarding
                  </div>
                </div>
              </CardShell>
            </motion.div>
          )}

          {/* ── ALREADY SIGNED IN ────────────────────────────── */}
          {status !== 'success' && user && (
            <motion.div
              key="signed-in"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease }}
              style={{ width: '100%', maxWidth: 460 }}
            >
              <CardShell>
                <div style={{ padding: '48px 40px', textAlign: 'center' }}>
                  <LogoMark />

                  {/* status chip */}
                  <div style={{
                    display:       'inline-flex',
                    alignItems:    'center',
                    gap:           7,
                    fontFamily:    T.body,
                    fontSize:      10,
                    fontWeight:    600,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color:         T.accent,
                    background:    T.accentBg,
                    border:        `1px solid ${T.accentBorder}`,
                    borderRadius:  T.rPill,
                    padding:       '5px 14px',
                    marginBottom:  24,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.accent, animation: 'pulse-dot 2s ease-in-out infinite' }} />
                    Signed in
                  </div>

                  {/* Avatar */}
                  <div style={{ marginBottom: 6 }}>
                    {user.picture
                      ? <img src={user.picture} alt={user.name} style={{ width: 56, height: 56, borderRadius: '50%', border: `2px solid ${T.border}`, margin: '0 auto', display: 'block', filter: 'sepia(0.15)' }} />
                      : <div style={{ width: 56, height: 56, borderRadius: '50%', border: `1px solid ${T.borderMid}`, background: T.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: T.accent }}>
                          <RiUserLine size={22} />
                        </div>
                    }
                  </div>
                  <div style={{ fontFamily: T.heading, fontWeight: 600, fontSize: 22, color: T.inkHigh, marginBottom: 4 }}>{user.name}</div>
                  <div style={{ fontFamily: T.body, fontWeight: 300, fontSize: 12, color: T.inkLow, marginBottom: 32, letterSpacing: '0.02em' }}>{user.email}</div>

                  {/* CTAs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <motion.button
                      onClick={() => navigate(onboarded ? '/dashboard' : '/onboarding')}
                      whileHover={{ y: -2, boxShadow: `0 14px 36px rgba(184,112,78,0.28)` }}
                      whileTap={{ y: 0 }}
                      transition={{ duration: 0.28, ease }}
                      style={{
                        width:          '100%',
                        padding:        '14px 24px',
                        borderRadius:   T.rPill,
                        background:     T.accent,
                        border:         'none',
                        color:          '#FFF8F2',
                        fontFamily:     T.body,
                        fontWeight:     600,
                        fontSize:       13,
                        letterSpacing:  '0.08em',
                        textTransform:  'uppercase',
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        gap:            8,
                        cursor:         'pointer',
                        boxShadow:      `0 4px 18px rgba(184,112,78,0.22)`,
                      }}
                    >
                      <RiRocketLine size={14} /> Continue to Viram
                    </motion.button>
                    <button
                      onClick={handleLogout}
                      style={{
                        width:          '100%',
                        padding:        '13px 24px',
                        borderRadius:   T.rPill,
                        background:     'transparent',
                        border:         `1px solid ${T.border}`,
                        color:          T.inkLow,
                        fontFamily:     T.body,
                        fontWeight:     500,
                        fontSize:       13,
                        letterSpacing:  '0.04em',
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        gap:            7,
                        cursor:         'pointer',
                        transition:     'border-color 0.2s, color 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = T.accentBorder; e.currentTarget.style.color = T.accent }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.inkLow }}
                    >
                      <RiLogoutBoxLine size={13} /> Sign out
                    </button>
                  </div>
                </div>
              </CardShell>
            </motion.div>
          )}

          {/* ── AUTH FORM ─────────────────────────────────────── */}
          {status !== 'success' && !user && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.72, ease }}
              style={{ width: '100%', maxWidth: 460 }}
            >
              <CardShell>
                <div style={{ padding: 'clamp(32px, 5vw, 48px) clamp(24px, 5vw, 44px)' }}>
                  <LogoMark />

                  {/* Headline */}
                  <h1 style={{
                    fontFamily:    T.heading,
                    fontWeight:    700,
                    fontSize:      'clamp(28px, 5vw, 38px)',
                    lineHeight:    1.0,
                    letterSpacing: '-0.02em',
                    color:         T.inkHigh,
                    textAlign:     'center',
                    marginBottom:  10,
                  }}>
                    {tab === 'signup' ? (
                      <>Forge your <em style={{ fontStyle: 'italic', color: T.accent }}>identity.</em></>
                    ) : (
                      <>Welcome <em style={{ fontStyle: 'italic', color: T.accent }}>back.</em></>
                    )}
                  </h1>
                  <p style={{
                    fontFamily:   T.body,
                    fontWeight:   300,
                    fontSize:     14,
                    color:        T.inkMid,
                    textAlign:    'center',
                    lineHeight:   1.85,
                    maxWidth:     300,
                    margin:       '0 auto 28px',
                    letterSpacing: '0.01em',
                  }}>
                    {tab === 'signup'
                      ? 'Build an avatar that reflects your real habits. No noise, no distraction.'
                      : 'Your focus space has been waiting. Step back into your practice.'}
                  </p>

                  {/* Tab switcher */}
                  <div style={{
                    display:      'flex',
                    padding:      4,
                    marginBottom: 24,
                    borderRadius: T.rMd,
                    background:   T.cardDeep,
                    border:       `1px solid ${T.border}`,
                  }}>
                    {[['signup', 'Sign up'], ['login', 'Log in']].map(([t, lbl]) => (
                      <button
                        key={t}
                        onClick={() => { setTab(t); setErrMsg(''); if (t === 'login') setName('') }}
                        style={{
                          flex:          1,
                          padding:       '10px 16px',
                          borderRadius:  14,
                          fontFamily:    T.body,
                          fontWeight:    tab === t ? 600 : 400,
                          fontSize:      13,
                          letterSpacing: '0.03em',
                          border:        'none',
                          cursor:        'pointer',
                          transition:    'all 0.22s ease',
                          background:    tab === t ? T.card : 'transparent',
                          color:         tab === t ? T.inkHigh : T.inkLow,
                          boxShadow:     tab === t ? `0 2px 10px rgba(55,38,22,0.08), inset 0 1px 0 rgba(255,255,255,0.5)` : 'none',
                        }}
                      >{lbl}</button>
                    ))}
                  </div>

                  {/* Google OAuth */}
                  <motion.button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    whileHover={{ y: -1, boxShadow: `0 8px 24px rgba(55,38,22,0.10)` }}
                    whileTap={{ y: 0 }}
                    transition={{ duration: 0.25, ease }}
                    style={{
                      width:          '100%',
                      padding:        '13px 20px',
                      borderRadius:   T.rPill,
                      background:     T.cardDeep,
                      border:         `1px solid ${T.borderMid}`,
                      color:          T.inkHigh,
                      fontFamily:     T.body,
                      fontWeight:     500,
                      fontSize:       13,
                      letterSpacing:  '0.03em',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      gap:            10,
                      cursor:         isLoading ? 'not-allowed' : 'pointer',
                      opacity:        isLoading ? 0.55 : 1,
                      marginBottom:   20,
                      boxShadow:      `0 2px 8px rgba(55,38,22,0.06)`,
                    }}
                  >
                    <GoogleG />
                    {isLoading ? 'Connecting…' : `${tab === 'signup' ? 'Sign up' : 'Log in'} with Google`}
                  </motion.button>

                  <OrDivider />

                  {/* Email form */}
                  <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
                    <AnimatePresence>
                      {tab === 'signup' && (
                        <motion.div
                          key="name-field"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.28, ease }}
                          style={{ overflow: 'hidden' }}
                        >
                          <AuthInput
                            icon={RiUserSmileLine}
                            placeholder="Display name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AuthInput
                      icon={RiMailLine}
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />

                    <AuthInput
                      icon={RiLockPasswordLine}
                      type={showPass ? 'text' : 'password'}
                      placeholder="Password"
                      value={pass}
                      onChange={e => setPass(e.target.value)}
                      right={{
                        onClick: () => setShowPass(p => !p),
                        icon: showPass
                          ? <RiEyeOffLine size={14} color={T.inkLow} />
                          : <RiEyeLine    size={14} color={T.inkLow} />,
                      }}
                    />

                    {/* Error message */}
                    <AnimatePresence>
                      {errMsg && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          style={{ fontFamily: T.body, fontSize: 12, color: T.accent, textAlign: 'center', margin: 0 }}
                        >
                          {errMsg}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={!isLoading ? { y: -2, boxShadow: `0 14px 36px rgba(184,112,78,0.28)` } : {}}
                      whileTap={!isLoading ? { y: 0 } : {}}
                      transition={{ duration: 0.28, ease }}
                      style={{
                        marginTop:      6,
                        width:          '100%',
                        padding:        '14px 24px',
                        borderRadius:   T.rPill,
                        background:     isLoading ? T.cardDeep : T.accent,
                        border:         isLoading ? `1px solid ${T.border}` : 'none',
                        color:          isLoading ? T.inkLow : '#FFF8F2',
                        fontFamily:     T.body,
                        fontWeight:     600,
                        fontSize:       13,
                        letterSpacing:  '0.1em',
                        textTransform:  'uppercase',
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        gap:            8,
                        cursor:         isLoading ? 'not-allowed' : 'pointer',
                        boxShadow:      isLoading ? 'none' : `0 4px 18px rgba(184,112,78,0.22)`,
                      }}
                    >
                      {isLoading ? (
                        <>Connecting&hellip;</>
                      ) : (
                        <>{tab === 'signup' ? 'Create account' : 'Log in'} <RiArrowRightLine size={14} /></>
                      )}
                    </motion.button>
                  </form>

                  {/* Trust footer */}
                  <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <RiShieldKeyholeLine size={11} color={T.inkLow} />
                      <span style={{ fontFamily: T.body, fontWeight: 300, fontSize: 11, color: T.inkLow, letterSpacing: '0.02em' }}>
                        We never post or store anything without permission.
                      </span>
                    </div>
                    {/* Separator line */}
                    <div style={{ width: '100%', height: 1, background: T.border, margin: '4px 0' }} />
                    {/* Philosophy note — new addition */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: T.accentBg, border: `1px solid ${T.accentBorder}`, borderRadius: T.rSm, padding: '10px 14px' }}>
                      <RiLeafLine size={13} color={T.accent} style={{ flexShrink: 0, marginTop: 1 }} />
                      <p style={{ fontFamily: T.body, fontWeight: 300, fontSize: 11, color: T.inkMid, lineHeight: 1.7, margin: 0 }}>
                        Viram is built to be calm, not compulsive. No streaks that shame you. No dark patterns.
                      </p>
                    </div>
                  </div>
                </div>
              </CardShell>

              {/* Below-card back link */}
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Link
                  to="/"
                  style={{
                    fontFamily:    T.body,
                    fontWeight:    400,
                    fontSize:      12,
                    color:         T.inkLow,
                    textDecoration: 'none',
                    display:       'inline-flex',
                    alignItems:    'center',
                    gap:           5,
                    letterSpacing: '0.04em',
                  }}
                >
                  <RiArrowLeftLine size={11} /> Back to home
                </Link>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </>
  )
}