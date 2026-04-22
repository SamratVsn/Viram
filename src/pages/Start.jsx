import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGoogleLogin, googleLogout } from '@react-oauth/google'
import { motion, AnimatePresence } from 'framer-motion'
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
} from 'react-icons/ri'

/* ── Global keyframes ─────────────────────────────────────────────────────── */
const STYLES = `
  @keyframes spin-slow  { from{transform:rotate(0deg)}         to{transform:rotate(360deg)}      }
  @keyframes spin-rev   { from{transform:rotate(0deg)}         to{transform:rotate(-360deg)}     }
  @keyframes pulse-dot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.7)} }
  @keyframes float      { 0%,100%{transform:translateY(0)}     50%{transform:translateY(-7px)}   }
  .auth-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid #1e1e1e;
    border-radius: 12px;
    padding: 13px 16px 13px 44px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #cccccc;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .auth-input::placeholder { color: #2e2e2e; }
  .auth-input:focus { border-color: #444; background: rgba(255,255,255,0.05); }
`

/* ── Decorative orb with two counter-rotating rings ──────────────────────── */
function LogoOrb() {
  return (
    <div className="relative mx-auto w-fit mb-7">
      {/* outer ring */}
      <svg className="absolute -inset-[22px] w-[calc(100%+44px)] h-[calc(100%+44px)]"
        style={{ animation: 'spin-slow 22s linear infinite' }} viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="75" fill="none"
          stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 10" />
      </svg>
      {/* inner ring */}
      <svg className="absolute -inset-[10px] w-[calc(100%+20px)] h-[calc(100%+20px)]"
        style={{ animation: 'spin-rev 14s linear infinite' }} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="56" fill="none"
          stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="6 6" />
      </svg>
      {/* core */}
      <div
        className="w-[76px] h-[76px] rounded-full bg-[#0a0a0a] border border-[#2a2a2a] flex items-center justify-center"
        style={{ animation: 'float 4.5s ease-in-out infinite' }}
      >
        <span className="font-syne font-black text-[20px] text-white tracking-[0.12em] select-none">VI</span>
      </div>
    </div>
  )
}

/* ── Input with leading icon ─────────────────────────────────────────────── */
function AuthInput({ icon: Icon, type = 'text', placeholder, value, onChange, right }) {
  return (
    <div className="relative">
      <Icon size={15} className="absolute left-[15px] top-1/2 -translate-y-1/2 text-[#333333]" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="auth-input"
      />
      {right && (
        <button
          type="button"
          onClick={right.onClick}
          className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#333333] hover:text-[#666666] transition-colors"
        >
          {right.icon}
        </button>
      )}
    </div>
  )
}

/* ── Google "G" SVG ─────────────────────────────────────────────────────── */
const GoogleG = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.705 17.64 9.2z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

/* ── Main component ───────────────────────────────────────────────────────── */
export default function Start() {
  const navigate = useNavigate()

  /* auth state */
  const [tab,      setTab]      = useState('signup')   // 'signup' | 'login'
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [pass,     setPass]     = useState('')
  const [showPass, setShowPass] = useState(false)
  const [user,     setUser]     = useState(null)
  const [status,   setStatus]   = useState('')          // '' | 'success' | 'error' | 'loading'
  const [isNew,    setIsNew]    = useState(false)
  const [errMsg,   setErrMsg]   = useState('')

  /* restore session */
  useEffect(() => {
    const stored = localStorage.getItem('viram_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  /* redirect after success */
  useEffect(() => {
    if (status === 'success') {
      const t = setTimeout(() => navigate('/questions'), 1800)
      return () => clearTimeout(t)
    }
  }, [status, navigate])

  /* Google OAuth */
  const googleLogin = useGoogleLogin({
    onSuccess: async (token) => {
      try {
        setStatus('loading')
        const res  = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token.access_token}` },
        })
        const info = await res.json()
        const existed = !!localStorage.getItem('viram_user')
        localStorage.setItem('viram_user', JSON.stringify(info))
        setUser(info)
        setIsNew(!existed)
        setStatus('success')
      } catch {
        setStatus('error')
        setErrMsg('Could not fetch profile. Try again.')
      }
    },
    onError: () => { setStatus('error'); setErrMsg('Google sign-in failed.') },
  })

  /* Email submit (stub — wire to your backend) */
  function handleEmailSubmit(e) {
    e.preventDefault()
    setErrMsg('')
    if (!email || !pass || (tab === 'signup' && !name)) {
      setErrMsg('Please fill in all fields.')
      return
    }
    // ── replace with real auth call ──
    const mock = { name: name || email.split('@')[0], email, picture: null }
    const existed = tab === 'login'
    localStorage.setItem('viram_user', JSON.stringify(mock))
    setUser(mock)
    setIsNew(!existed)
    setStatus('success')
  }

  function handleLogout() {
    googleLogout()
    localStorage.removeItem('viram_user')
    setUser(null); setStatus(''); setIsNew(false); setErrMsg('')
  }

  const isLoading = status === 'loading'

  return (
    <>
      <style>{STYLES}</style>

      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10 relative overflow-hidden">

        {/* Background grid + glow */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="sg" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sg)"/>
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
            style={{ background:'radial-gradient(ellipse,rgba(255,255,255,0.035) 0%,transparent 65%)', filter:'blur(80px)' }}/>
        </div>

        <AnimatePresence mode="wait">

          {/* ── SUCCESS ─────────────────────────────────────────────────── */}
          {status === 'success' && (
            <motion.div key="success"
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
              className="relative flex flex-col items-center text-center w-full max-w-[400px] bg-[#0a0a0a] border border-[#1a1a1a] rounded-[28px] p-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"/>
              <div className="w-16 h-16 rounded-full border border-[#2a2a2a] flex items-center justify-center mb-6">
                <RiCheckLine size={28} className="text-white"/>
              </div>
              <div className="font-syne font-black text-white text-2xl mb-2">
                {isNew ? 'Welcome aboard.' : 'Welcome back.'}
              </div>
              <p className="text-[14px] text-[#555555] font-dm-sans leading-[1.75] mb-6">
                {isNew
                  ? "Let's build your avatar. Setting up your profile…"
                  : 'Good to have you back. Redirecting…'}
              </p>
              <div className="flex items-center gap-2 text-[12px] text-[#333333] font-dm-sans">
                <span className="w-[6px] h-[6px] rounded-full bg-white inline-block"
                  style={{ animation:'pulse-dot 1.2s ease-in-out infinite' }}/>
                Taking you to /questions
              </div>
            </motion.div>
          )}

          {/* ── ALREADY SIGNED IN ───────────────────────────────────────── */}
          {status !== 'success' && user && (
            <motion.div key="signed-in"
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0 }} transition={{ duration:0.45 }}
              className="relative w-full max-w-[400px] bg-[#0a0a0a] border border-[#1a1a1a] rounded-[28px] p-10 flex flex-col items-center text-center overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"/>
              <LogoOrb />
              <div className="inline-flex items-center gap-[6px] text-[10px] tracking-[0.18em] text-[#cccccc] uppercase font-bold font-dm-sans px-[14px] py-[5px] rounded-full border border-[#2a2a2a] bg-white/[0.03] mb-6">
                <span className="w-[6px] h-[6px] rounded-full bg-white"
                  style={{ animation:'pulse-dot 2s ease-in-out infinite' }}/>
                Signed in
              </div>
              {user.picture
                ? <img src={user.picture} alt={user.name}
                    className="w-14 h-14 rounded-full border border-[#2a2a2a] mb-3 grayscale"/>
                : <div className="w-14 h-14 rounded-full border border-[#2a2a2a] bg-[#111] flex items-center justify-center mb-3 text-[#888888]">
                    <RiUserLine size={22}/>
                  </div>
              }
              <div className="font-syne font-black text-white text-lg">{user.name}</div>
              <div className="text-[12px] text-[#444444] font-dm-sans mt-[2px] mb-7">{user.email}</div>
              <button onClick={() => navigate('/dashboard')}
                className="w-full py-[13px] rounded-full bg-white text-black text-sm font-black font-dm-sans flex items-center justify-center gap-2 mb-3 transition-all duration-200 hover:bg-[#e8e8e8] hover:-translate-y-[2px] hover:shadow-[0_10px_32px_rgba(255,255,255,0.15)]"
              >
                <RiRocketLine size={14}/> Continue to Viram
              </button>
              <button onClick={handleLogout}
                className="w-full py-[13px] rounded-full border border-[#1a1a1a] text-[#555555] text-sm font-semibold font-dm-sans flex items-center justify-center gap-2 transition-all duration-200 hover:border-[#333333] hover:text-[#888888]"
              >
                <RiLogoutBoxLine size={14}/> Sign out
              </button>
            </motion.div>
          )}

          {/* ── AUTH FORM ───────────────────────────────────────────────── */}
          {status !== 'success' && !user && (
            <motion.div key="auth"
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0 }} transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
              className="relative w-full max-w-[440px] bg-[#0a0a0a] border border-[#1a1a1a] rounded-[28px] overflow-hidden"
            >
              {/* shimmer */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"/>

              <div className="p-8 md:p-10">
                <LogoOrb />

                {/* headline */}
                <h1 className="font-syne font-black text-white text-center leading-[1.0] tracking-[-0.04em] mb-2"
                  style={{ fontSize:'clamp(26px,5vw,34px)' }}>
                  {tab === 'signup' ? 'Forge your identity.' : 'Welcome back.'}
                </h1>
                <p className="text-[13px] text-[#555555] font-dm-sans text-center leading-[1.7] mb-7 max-w-[280px] mx-auto">
                  {tab === 'signup'
                    ? 'Build an avatar that reflects your real habits. No excuses.'
                    : 'Your avatar has been waiting. Log back into your journey.'}
                </p>

                {/* tab switcher */}
                <div className="flex p-1 mb-7 rounded-xl bg-white/[0.03] border border-[#1a1a1a]">
                  {[['signup','Sign Up'],['login','Log In']].map(([t, lbl]) => (
                    <button key={t} onClick={() => { setTab(t); setErrMsg('') }}
                      className={`flex-1 py-[10px] rounded-[10px] text-sm font-bold font-dm-sans transition-all duration-200 ${
                        tab === t
                          ? 'bg-white text-black shadow-[0_2px_12px_rgba(0,0,0,0.4)]'
                          : 'text-[#444444] hover:text-[#888888]'
                      }`}
                    >{lbl}</button>
                  ))}
                </div>

                {/* Google */}
                <button
                  onClick={() => googleLogin()}
                  disabled={isLoading}
                  className="w-full py-[13px] rounded-full bg-white/[0.04] border border-[#2a2a2a] text-white text-sm font-semibold font-dm-sans flex items-center justify-center gap-3 mb-5 transition-all duration-200 hover:border-[#444444] hover:bg-white/[0.07] hover:-translate-y-[1px] disabled:opacity-40"
                >
                  <GoogleG />
                  {isLoading ? 'Connecting…' : `${tab === 'signup' ? 'Sign up' : 'Log in'} with Google`}
                </button>

                {/* divider */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-[#161616]"/>
                  <span className="text-[10px] text-[#2a2a2a] font-dm-sans uppercase tracking-[0.14em]">or with email</span>
                  <div className="flex-1 h-px bg-[#161616]"/>
                </div>

                {/* email form */}
                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-[10px]">
                  <AnimatePresence>
                    {tab === 'signup' && (
                      <motion.div
                        key="name-field"
                        initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
                        exit={{ opacity:0, height:0 }} transition={{ duration:0.22 }}
                        className="overflow-hidden"
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
                      icon: showPass ? <RiEyeOffLine size={15}/> : <RiEyeLine size={15}/>,
                    }}
                  />

                  {/* error */}
                  {errMsg && (
                    <p className="text-[12px] text-[#666666] font-dm-sans text-center">{errMsg}</p>
                  )}

                  <button type="submit"
                    className="mt-1 w-full py-[14px] rounded-full bg-white text-black text-sm font-black font-dm-sans flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#e8e8e8] hover:-translate-y-[2px] hover:shadow-[0_10px_32px_rgba(255,255,255,0.15)]"
                  >
                    {tab === 'signup' ? 'Create Account' : 'Log In'}
                    <RiArrowRightLine size={14}/>
                  </button>
                </form>

                {/* trust + back */}
                <div className="mt-6 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-[6px]">
                    <RiShieldKeyholeLine size={11} className="text-[#2a2a2a]"/>
                    <span className="text-[11px] text-[#2a2a2a] font-dm-sans">We never post or store anything without permission.</span>
                  </div>
                  <Link to="/"
                    className="flex items-center gap-[5px] text-[12px] text-[#333333] font-dm-sans font-semibold no-underline hover:text-white transition-colors duration-200"
                  >
                    <RiArrowLeftLine size={12}/> Back to home
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </>
  )
}