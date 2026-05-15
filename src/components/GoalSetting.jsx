import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { updateProfile, getProfile } from '../lib/db'
import {
  RiRocketLine, RiQuillPenLine, RiArrowRightLine,
} from 'react-icons/ri'

const T = {
  bg:           '#F4EEE3',
  card:         '#F9F5EC',
  cardDeep:     '#EDE5D4',
  inkHigh:      '#2A2218',
  inkMid:       '#5A4E42',
  inkLow:       '#8A7B6E',
  border:       'rgba(55,38,22,0.07)',
  borderMid:    'rgba(55,38,22,0.13)',
  borderRule:   'rgba(55,38,22,0.055)',
  accent:       '#B8704E',
  accentBg:     'rgba(184,112,78,0.08)',
  accentBorder: 'rgba(184,112,78,0.22)',
  accentDim:    'rgba(184,112,78,0.38)',
  heading:      "'Cormorant Garamond', Georgia, serif",
  body:         "'Jost', system-ui, sans-serif",
  rSm:  '8px',
  rMd:  '16px',
  rLg:  '24px',
  rPill:'100px',
}

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`
const ease = [0.22, 1, 0.36, 1]

const GLOBAL = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .viram-gs::after {
    content:''; position:fixed; inset:0;
    background-image:${GRAIN}; background-repeat:repeat;
    opacity:0.032; pointer-events:none; z-index:9999;
  }
`

const SUGGESTIONS = [
  "I want to break free from my phone and focus on what matters.",
  "I want to write a book without distraction.",
  "I want to study for exams without checking social media.",
  "I want to reclaim my mornings from the scroll.",
  "I want to be present with my family instead of my screen.",
  "I want to build a business without burning out.",
  "I want to read 30 books this year.",
  "I want to code without the constant urge to check notifications.",
]

export default function GoalSetting() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [saveError, setSaveError] = useState('')
  const inputRef = useRef(null)

  const hasValue = input.trim().length > 0

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        getProfile(user.id).then(profile => {
          if (profile?.goal) setInput(profile.goal)
        }).catch(() => {})
      }
    }).catch(() => {})
  }, [])

  function pickSuggestion(suggestion) {
    setInput(suggestion)
    inputRef.current?.focus()
  }

  async function saveGoal() {
    if (!hasValue || saving) return
    setSaving(true)
    setSaveError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await updateProfile(user.id, { goal: input.trim() })
      }
      setFadeOut(true)
      setTimeout(() => navigate('/dashboard'), 600)
    } catch (err) {
      setSaveError(err?.message || 'Failed to save goal.')
      setSaving(false)
    }
  }

  return (
    <>
      <style>{GLOBAL}</style>
      <div className="viram-gs" style={{
        minHeight:'100vh', background:T.bg,
        display:'flex', flexDirection:'column',
        overflow:'hidden', position:'relative',
      }}>
        <div style={{
          position:'fixed', inset:0, pointerEvents:'none',
          backgroundImage:`repeating-linear-gradient(transparent, transparent 35px, ${T.borderRule} 35px, ${T.borderRule} 36px)`,
          backgroundPositionY:'60px',
        }}/>

        <div style={{
          flexShrink:0, display:'flex', alignItems:'center',
          justifyContent:'space-between',
          padding:'13px 22px', borderBottom:`1px solid ${T.border}`,
          background:T.card,
          position:'relative', zIndex:10,
        }}>
          <div style={{
            fontFamily:T.heading, fontWeight:700, fontSize:17,
            letterSpacing:'0.14em', color:T.inkHigh,
          }}>
            VI<span style={{ color:T.accent }}>RAM</span>
          </div>
          <div style={{ fontFamily:T.body, fontSize:10, fontWeight:500, color:T.inkLow, letterSpacing:'0.06em' }}>
            one last step
          </div>
        </div>

        <div style={{ flex:1, display:'flex', overflow:'hidden', position:'relative' }}>
          <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={fadeOut ? 'out' : 'in'}
                initial={{ opacity:0, y:20 }}
                animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-20 }}
                transition={{ duration:0.5, ease }}
                style={{
                  display:'flex', flexDirection:'column', flex:1,
                  maxWidth:600, width:'100%', margin:'0 auto',
                  padding:'clamp(40px,6vh,64px) clamp(20px,4vw,52px)',
                }}
              >
                <div style={{
                  display:'inline-flex', alignItems:'center', gap:10,
                  marginBottom:20, alignSelf:'flex-start',
                }}>
                  <div style={{
                    width:34, height:34, borderRadius:'50%',
                    background:T.accentBg, border:`1px solid ${T.accentBorder}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:T.accent,
                  }}>
                    <RiRocketLine size={14}/>
                  </div>
                  <span style={{
                    fontFamily:T.body, fontSize:10, fontWeight:600,
                    letterSpacing:'0.2em', textTransform:'uppercase', color:T.inkLow,
                  }}>
                    Your Goal
                  </span>
                </div>

                <h2 style={{
                  fontFamily:T.heading, fontWeight:700,
                  fontSize:'clamp(28px,5vw,40px)', lineHeight:1.08,
                  letterSpacing:'-0.02em', color:T.inkHigh, marginBottom:12,
                }}>
                  What brings you here?
                </h2>
                <p style={{
                  fontFamily:T.body, fontWeight:300, fontSize:14,
                  color:T.inkMid, lineHeight:1.85, marginBottom:36,
                  maxWidth:480, letterSpacing:'0.01em',
                }}>
                  Set a clear intention. This becomes your north star — something to return to every day when distraction pulls you away.
                </p>

                <div style={{
                  background:T.card, border:`1px solid ${T.borderMid}`,
                  borderRadius:T.rMd, padding:'24px 22px 18px',
                  boxShadow:`0 2px 10px rgba(55,38,22,0.06), inset 0 1px 0 rgba(255,255,255,0.6)`,
                  position:'relative', marginBottom:12,
                }}>
                  {[0,1,2,3].map(i => (
                    <div key={i} style={{
                      position:'absolute', left:22, right:22,
                      top:56+i*28, height:1, background:T.borderRule,
                    }}/>
                  ))}
                  <label htmlFor="goal-input" style={{
                    fontFamily:T.body, fontSize:9, fontWeight:600,
                    letterSpacing:'0.22em', textTransform:'uppercase',
                    color:T.accent, display:'block', marginBottom:14,
                  }}>
                    I want to
                  </label>
                  <textarea
                    id="goal-input"
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="write your goal here..."
                    rows={3}
                    maxLength={200}
                    style={{
                      width:'100%', background:'transparent', border:'none',
                      outline:'none', resize:'none',
                      fontFamily:T.heading, fontStyle:'italic', fontWeight:500,
                      fontSize:20, color:T.inkHigh, letterSpacing:'-0.01em',
                      position:'relative', zIndex:1, padding:0, lineHeight:1.5,
                    }}
                  />
                  <div style={{
                    display:'flex', justifyContent:'flex-end', marginTop:8,
                    fontFamily:T.body, fontSize:10, color:T.inkLow,
                    position:'relative', zIndex:1,
                  }}>
                    {input.length}&thinsp;/&thinsp;200
                  </div>
                </div>

                <p style={{
                  fontFamily:T.body, fontWeight:300, fontSize:11,
                  color:T.inkLow, fontStyle:'italic', marginBottom:24,
                  lineHeight:1.6,
                }}>
                  This will appear on your dashboard every day — a reminder of why you started.
                </p>

                <div style={{ marginTop:'auto', paddingTop:8 }}>
                  <motion.button
                    onClick={saveGoal}
                    disabled={!hasValue || saving}
                    whileHover={hasValue && !saving ? { y:-2, boxShadow:`0 14px 36px rgba(184,112,78,0.26)` } : {}}
                    whileTap={hasValue && !saving ? { y:0 } : {}}
                    transition={{ duration:0.28, ease }}
                    style={{
                      width:'100%', padding:'16px 24px', borderRadius:T.rPill,
                      background: hasValue && !saving ? T.accent : T.cardDeep,
                      border:`1px solid ${hasValue && !saving ? T.accent : T.border}`,
                      color: hasValue && !saving ? '#FFF8F2' : T.inkLow,
                      fontFamily:T.body, fontWeight:600, fontSize:13,
                      letterSpacing:'0.10em', textTransform:'uppercase',
                      display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                      cursor: hasValue && !saving ? 'pointer' : 'not-allowed',
                      boxShadow: hasValue && !saving ? `0 4px 18px rgba(184,112,78,0.20)` : 'none',
                      transition:'all 0.22s ease',
                    }}
                  >
                    {saving ? 'Saving...' : <><RiRocketLine size={14}/> Begin My Journey</>}
                  </motion.button>
                  {saveError && (
                    <p style={{ fontFamily:T.body, fontSize:11, color:T.accent, textAlign:'center', marginTop:10 }}>
                      {saveError}
                    </p>
                  )}
                </div>

                <div style={{
                  marginTop:28, paddingTop:20,
                  borderTop:`1px solid ${T.border}`,
                }}>
                  <div style={{
                    fontFamily:T.body, fontSize:9, fontWeight:600,
                    letterSpacing:'0.18em', textTransform:'uppercase',
                    color:T.inkLow, marginBottom:12,
                    display:'flex', alignItems:'center', gap:8,
                  }}>
                    <RiQuillPenLine size={10}/> Not sure what to write?
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    {SUGGESTIONS.map((s, i) => (
                      <motion.button
                        key={i}
                        type="button"
                        onClick={() => pickSuggestion(s)}
                        whileHover={{ x:4 }}
                        whileTap={{ scale:0.99 }}
                        transition={{ duration:0.2, ease }}
                        style={{
                          display:'flex', alignItems:'center', gap:10,
                          padding:'10px 14px', borderRadius:T.rSm,
                          border:`1px solid ${T.border}`,
                          background:T.card,
                          cursor:'pointer', textAlign:'left',
                          fontFamily:T.body, fontWeight:300, fontSize:11.5,
                          color:T.inkMid, lineHeight:1.5, letterSpacing:'0.01em',
                          transition:'all 0.18s',
                        }}
                      >
                        <RiArrowRightLine size={10} color={T.accentDim} style={{ flexShrink:0 }}/>
                        <span>{s}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}
