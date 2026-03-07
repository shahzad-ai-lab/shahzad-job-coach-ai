'use client'

import { useState, useRef, useEffect } from 'react'

const MAX_PASTE_CHARS = 12000

// ── Motivational Quotes ───────────────────────────────────────────
const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Your resume gets you the interview. Your story gets you the job.", author: "Job Coach AI" },
  { text: "Every expert was once a beginner. Keep going.", author: "Helen Hayes" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
  { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Your next chapter begins with a single application. Send it.", author: "Job Coach AI" },
  { text: "Rejection is redirection. Every no is closer to the yes.", author: "Job Coach AI" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Dream big. Start small. Act now.", author: "Robin Sharma" },
  { text: "You are one conversation away from a completely different life.", author: "Job Coach AI" },
  { text: "Confidence is not 'they will like me'. Confidence is 'I'll be fine if they don't'.", author: "Christina Grimmie" },
  { text: "A comfort zone is a beautiful place, but nothing ever grows there.", author: "Unknown" },
  { text: "Your skills are already impressive. Let the world see them.", author: "Job Coach AI" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Hustle in silence and let your LinkedIn speak for you.", author: "Job Coach AI" },
]

function detectOS() {
  if (typeof navigator === 'undefined') return 'Unknown'
  const ua = navigator.userAgent
  if (/Windows NT 10|Windows NT 11/.test(ua)) return 'Windows'
  if (/Macintosh|Mac OS X/.test(ua)) return 'macOS'
  if (/iPhone|iPad/.test(ua)) return 'iOS'
  if (/Android/.test(ua)) return 'Android'
  if (/Linux/.test(ua)) return 'Linux'
  return 'Unknown'
}
const CLIENT_HOURLY_LIMIT = 5
const HOUR_MS = 60 * 60 * 1000
const BACKOFF_HOURS = [1, 3, 6]

function getRateLimitState() {
  try {
    const raw = localStorage.getItem('jcai_rl')
    const s = raw ? JSON.parse(raw) : null
    const now = Date.now()
    if (!s) return { count: 0, windowReset: now + HOUR_MS, violations: 0, blockUntil: 0 }
    // Reset hourly window if expired but keep violations
    if (now > s.windowReset) return { count: 0, windowReset: now + HOUR_MS, violations: s.violations || 0, blockUntil: s.blockUntil || 0 }
    return s
  } catch { return { count: 0, windowReset: Date.now() + HOUR_MS, violations: 0, blockUntil: 0 } }
}

function saveRateLimitState(s) {
  try { localStorage.setItem('jcai_rl', JSON.stringify(s)) } catch {}
}

function checkAndIncrementRateLimit() {
  const s = getRateLimitState()
  const now = Date.now()
  // Still blocked?
  if (s.blockUntil > now) {
    const mins = Math.ceil((s.blockUntil - now) / 60000)
    const hrs = mins >= 60 ? Math.ceil(mins / 60) : null
    return { allowed: false, message: `Slow down! Come back in ${hrs ? hrs + ' hour' + (hrs > 1 ? 's' : '') : mins + ' min' + (mins > 1 ? 's' : '')}.` }
  }
  // Hourly limit hit?
  if (s.count >= CLIENT_HOURLY_LIMIT) {
    const backoffHrs = BACKOFF_HOURS[Math.min(s.violations, BACKOFF_HOURS.length - 1)]
    s.violations = (s.violations || 0) + 1
    s.blockUntil = now + backoffHrs * HOUR_MS
    saveRateLimitState(s)
    return { allowed: false, message: `${CLIENT_HOURLY_LIMIT} requests used this hour. Come back in ${backoffHrs} hour${backoffHrs > 1 ? 's' : ''}! This keeps the service free for everyone.` }
  }
  s.count += 1
  saveRateLimitState(s)
  return { allowed: true, remaining: CLIENT_HOURLY_LIMIT - s.count }
}

const CARDS = [
  { key: 'resumeScore',       title: 'Resume Score',       icon: '📊', g: 'linear-gradient(135deg,#00C6FF,#0072FF)' },
  { key: 'coverLetter',       title: 'Cover Letter',        icon: '✉️',  g: 'linear-gradient(135deg,#FF0099,#FF6B6B)' },
  { key: 'resumeRewrite',     title: 'Resume Rewrite',      icon: '📄',  g: 'linear-gradient(135deg,#7B2FBE,#C84B31)' },
  { key: 'skillsGap',         title: 'Skills Gap',          icon: '🎯',  g: 'linear-gradient(135deg,#FF6B35,#FACF39)' },
  { key: 'interviewPrep',     title: 'Interview Prep',      icon: '🎤',  g: 'linear-gradient(135deg,#11998E,#38EF7D)' },
  { key: 'introScripts',      title: 'Intro Scripts',       icon: '🗣️',  g: 'linear-gradient(135deg,#FC466B,#3F5EFB)' },
  { key: 'starStories',       title: 'STAR Stories',        icon: '⭐',  g: 'linear-gradient(135deg,#F7971E,#FFD200)' },
  { key: 'linkedinSummary',   title: 'LinkedIn Summary',    icon: '💼',  g: 'linear-gradient(135deg,#1CB5E0,#000851)' },
  { key: 'matchingJobs',      title: 'Matching Jobs',       icon: '🏢',  g: 'linear-gradient(135deg,#56CCF2,#2F80ED)' },
  { key: 'thankYouEmail',     title: 'Thank You Email',     icon: '💌',  g: 'linear-gradient(135deg,#DA22FF,#9733EE)' },
  { key: 'salaryNegotiation', title: 'Salary Negotiation',  icon: '💰',  g: 'linear-gradient(135deg,#11998E,#38EF7D)' },
  { key: 'actionPlan',        title: '30-60-90 Day Plan',   icon: '🗓️',  g: 'linear-gradient(135deg,#FF416C,#FF4B2B)' },
]

export default function Home() {
  const [resumeText, setResumeText]   = useState('')
  const [jobPosting, setJobPosting]   = useState('')
  const [results, setResults]         = useState(null)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [uploading, setUploading]     = useState(false)
  const [activeCard, setActiveCard]   = useState(null)
  const [copied, setCopied]           = useState('')
  const [fileName, setFileName]       = useState('')
  const [dragOver, setDragOver]       = useState(false)
  const [jobUploading, setJobUploading] = useState(false)
  const [jobFileName, setJobFileName]   = useState('')
  const [jobDragOver, setJobDragOver]   = useState(false)
  const [userInfo, setUserInfo]     = useState(null)
  const [weather, setWeather]       = useState('')
  const [quoteIdx, setQuoteIdx]     = useState(0)
  const [quoteFade, setQuoteFade]   = useState(true)
  const [remaining, setRemaining]   = useState(CLIENT_HOURLY_LIMIT)
  const fileRef    = useRef(null)
  const jobFileRef = useRef(null)

  // ── Fetch IP / location / weather on mount ────────────────────
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => {
        setUserInfo({
          ip: d.ip || '—',
          city: d.city || '—',
          region: d.region || '—',
          country: d.country_name || '—',
          postal: d.postal || '—',
          org: d.org || '—',
          os: detectOS(),
        })
        const loc = encodeURIComponent((d.city || '') + ',' + (d.country_code || ''))
        return fetch(`https://wttr.in/${loc}?format=%c+%C+%t&m`)
      })
      .then(r => r.text())
      .then(w => setWeather(w.trim()))
      .catch(() => {})
    // Show current remaining count from localStorage
    const s = getRateLimitState()
    setRemaining(Math.max(0, CLIENT_HOURLY_LIMIT - s.count))
  }, [])

  // ── Rotate quotes every 5 seconds ────────────────────────────
  useEffect(() => {
    const iv = setInterval(() => {
      setQuoteFade(false)
      setTimeout(() => { setQuoteIdx(i => (i + 1) % QUOTES.length); setQuoteFade(true) }, 400)
    }, 5000)
    return () => clearInterval(iv)
  }, [])


  function handleResumeChange(e) {
    const val = e.target.value
    if (val.length > MAX_PASTE_CHARS) { setError(`Resume capped at ${MAX_PASTE_CHARS.toLocaleString()} chars.`); setResumeText(val.slice(0, MAX_PASTE_CHARS)) }
    else { setError(''); setResumeText(val) }
  }

  function handleJobChange(e) {
    const val = e.target.value
    if (val.length > 6000) { setError('Job description capped at 6,000 characters.'); setJobPosting(val.slice(0, 6000)) }
    else { setError(''); setJobPosting(val) }
  }

  async function processFile(file) {
    if (!file) return
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    if (!['.pdf','.docx','.txt'].includes(ext)) { setError('Only PDF, DOCX, or TXT supported.'); return }
    if (file.size > 10 * 1024 * 1024) { setError(`File too large (${(file.size/1024/1024).toFixed(1)}MB). Max 10MB.`); return }
    setUploading(true); setError(''); setFileName(file.name)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResumeText(data.text)
    } catch (err) { setError(err.message); setFileName('') }
    finally { setUploading(false) }
  }

  function handleDrop(e) { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]) }

  async function processJobFile(file) {
    if (!file) return
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    if (!['.pdf','.docx','.txt'].includes(ext)) { setError('Only PDF, DOCX, or TXT supported.'); return }
    if (file.size > 10 * 1024 * 1024) { setError(`File too large (${(file.size/1024/1024).toFixed(1)}MB). Max 10MB.`); return }
    setJobUploading(true); setError(''); setJobFileName(file.name)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setJobPosting(data.text)
    } catch (err) { setError(err.message); setJobFileName('') }
    finally { setJobUploading(false) }
  }

  function handleJobDrop(e) { e.preventDefault(); setJobDragOver(false); processJobFile(e.dataTransfer.files[0]) }

  async function handleAnalyze() {
    if (!resumeText.trim()) { setError('Please add your resume text or upload a file.'); return }
    if (!jobPosting.trim()) { setError('Please paste the job description.'); return }
    // Client-side rate limit check
    const rl = checkAndIncrementRateLimit()
    if (!rl.allowed) { setError(rl.message); return }
    setError(''); setLoading(true); setResults(null); setActiveCard(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobPosting }),
      })
      const data = await res.json()
      if (data.error === 'rate_limited') throw new Error(data.message)
      if (data.error) throw new Error(data.error)
      setResults(data); setActiveCard('resumeScore')
      if (data._meta?.remaining !== undefined) setRemaining(data._meta.remaining)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  function copyToClipboard(text, key) {
    navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(''), 2000)
  }

  const s = {
    page: { minHeight: '100vh', background: 'linear-gradient(160deg,#0F0C29,#302B63,#24243E)', color: '#fff', fontFamily: "'Segoe UI',system-ui,sans-serif" },
    container: { maxWidth: 1000, margin: '0 auto', padding: '0 16px 80px' },
    card: { background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.12)' },
    textarea: { width: '100%', background: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: 12, padding: 12, fontSize: 13, resize: 'none', border: '1px solid rgba(255,255,255,0.15)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
    label: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 },
  }

  return (
    <main style={s.page}>
      {/* Rainbow top bar */}
      <div style={{ height: 5, background: 'linear-gradient(90deg,#FF0099,#FACF39,#00AEEF,#38EF7D,#FF6B35)' }} />

      {/* User Info Bar */}
      <div style={{ background:'rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'8px 20px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
          {/* Left: location + weather */}
          <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
            {userInfo ? (
              <>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)', display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ color:'#00AEEF' }}>📍</span>
                  <strong style={{ color:'rgba(255,255,255,0.75)' }}>{userInfo.city}, {userInfo.region}</strong>
                  <span style={{ color:'rgba(255,255,255,0.35)' }}>·</span>
                  {userInfo.country}
                  <span style={{ color:'rgba(255,255,255,0.35)' }}>·</span>
                  {userInfo.postal}
                </span>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)', display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ color:'#FACF39' }}>🖥️</span> {userInfo.os}
                </span>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)', display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ color:'#FF0099' }}>🌐</span>
                  <span style={{ fontFamily:'monospace', fontSize:11, color:'rgba(255,255,255,0.4)' }}>{userInfo.ip}</span>
                </span>
                {weather && (
                  <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)', display:'flex', alignItems:'center', gap:5 }}>
                    <span>{weather}</span>
                    <span style={{ color:'rgba(255,255,255,0.25)', fontSize:10 }}>in {userInfo.city}</span>
                  </span>
                )}
              </>
            ) : (
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.2)', fontStyle:'italic' }}>Detecting your location...</span>
            )}
          </div>
          {/* Right: usage meter */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>Free analyses:</span>
            <div style={{ display:'flex', gap:4 }}>
              {Array.from({ length: CLIENT_HOURLY_LIMIT }).map((_, i) => (
                <div key={i} style={{
                  width:10, height:10, borderRadius:'50%',
                  background: i < remaining
                    ? 'linear-gradient(135deg,#38EF7D,#11998E)'
                    : 'rgba(255,255,255,0.12)',
                  boxShadow: i < remaining ? '0 0 6px rgba(56,239,125,0.6)' : 'none',
                  transition:'all .3s',
                }} />
              ))}
            </div>
            <span style={{ fontSize:11, color: remaining > 0 ? '#38EF7D' : '#FF6B6B', fontWeight:700 }}>
              {remaining}/{CLIENT_HOURLY_LIMIT} left
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header style={{ padding: '52px 24px 36px', textAlign: 'center' }}>
        <div style={{ display:'inline-block', marginBottom:16, padding:'5px 18px', borderRadius:999, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', fontSize:11, fontWeight:700, letterSpacing:3, textTransform:'uppercase', color:'#FACF39' }}>
          AI-Powered Career Coach
        </div>
        <h1 style={{ fontSize:'clamp(2.8rem,9vw,5.5rem)', fontWeight:900, margin:'0 0 8px', background:'linear-gradient(135deg,#FF0099,#FACF39,#00AEEF)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1.05 }}>
          Job Coach AI 2026
        </h1>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:19, maxWidth:500, margin:'0 auto 28px', fontWeight:400 }}>
          Upload your resume. Paste the job.{' '}
          <strong style={{ color:'#fff', fontWeight:800 }}>Land the interview.</strong>
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap', marginBottom:16 }}>
          {['12 AI Tools','ATS Scoring','Salary Scripts','30-60-90 Plan'].map(t => (
            <span key={t} style={{ padding:'5px 14px', borderRadius:999, background:'rgba(255,255,255,0.1)', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.8)', border:'1px solid rgba(255,255,255,0.15)' }}>{t}</span>
          ))}
        </div>
        {/* Privacy Notice */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 18px', borderRadius:999, background:'rgba(56,239,125,0.1)', border:'1px solid rgba(56,239,125,0.25)', fontSize:12, color:'rgba(56,239,125,0.9)', fontWeight:600 }}>
          <span>🔒</span> Your data is never stored on our servers. Everything is processed in memory and cleared on refresh.
        </div>
        <div style={{ marginTop:8, fontSize:11, color:'rgba(255,255,255,0.3)' }}>
          Free tier: <strong style={{ color:'rgba(255,255,255,0.5)' }}>5 analyses per hour</strong> · Refresh page = all data gone
        </div>
      </header>

      <div style={s.container}>

        {/* Rotating Quote */}
        <div style={{ textAlign:'center', marginBottom:32, minHeight:80 }}>
          <div style={{
            opacity: quoteFade ? 1 : 0,
            transition: 'opacity 0.4s ease',
            display:'inline-block', maxWidth:720,
          }}>
            <p style={{
              fontSize:'clamp(1rem,2.5vw,1.25rem)', fontWeight:700, margin:'0 0 8px',
              background: ['linear-gradient(90deg,#FF0099,#FACF39)','linear-gradient(90deg,#00AEEF,#38EF7D)','linear-gradient(90deg,#FC466B,#3F5EFB)','linear-gradient(90deg,#F7971E,#FFD200)','linear-gradient(90deg,#DA22FF,#FF0099)'][quoteIdx % 5],
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              filter:`drop-shadow(0 0 18px ${['#FF0099','#00AEEF','#FC466B','#F7971E','#DA22FF'][quoteIdx % 5]}66)`,
              lineHeight:1.4,
            }}>
              &ldquo;{QUOTES[quoteIdx].text}&rdquo;
            </p>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.35)', margin:0, fontStyle:'italic' }}>
              — {QUOTES[quoteIdx].author}
            </p>
          </div>
          {/* Quote dots */}
          <div style={{ display:'flex', justifyContent:'center', gap:5, marginTop:10 }}>
            {QUOTES.map((_, i) => (
              <div key={i} style={{
                width: i === quoteIdx ? 18 : 5, height:5, borderRadius:999,
                background: i === quoteIdx ? 'linear-gradient(90deg,#FF0099,#FACF39)' : 'rgba(255,255,255,0.15)',
                transition:'all .4s',
              }} />
            ))}
          </div>
        </div>

        {/* Input Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:20, marginBottom:20 }}>

          {/* Resume Upload */}
          <div style={s.card}>
            <h2 style={{ margin:'0 0 16px', fontSize:20, fontWeight:800, background:'linear-gradient(90deg,#00C6FF,#0072FF)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', display:'flex', alignItems:'center', gap:8 }}>
              <span>📋</span> Your Resume
            </h2>

            {/* Drop Zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                cursor:'pointer', borderRadius:16,
                border:`2px dashed ${dragOver ? '#00AEEF' : 'rgba(255,255,255,0.25)'}`,
                padding:'24px 16px', textAlign:'center', marginBottom:16, transition:'all .2s',
                background: dragOver ? 'rgba(0,174,239,0.15)' : 'rgba(255,255,255,0.04)',
              }}
            >
              <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={e => processFile(e.target.files[0])} style={{ display:'none' }} />
              <div style={{ fontSize:36, marginBottom:8 }}>{uploading ? '⏳' : '📂'}</div>
              {uploading
                ? <p style={{ color:'#00AEEF', fontSize:14, fontWeight:700, margin:0 }}>Reading file...</p>
                : fileName
                  ? <p style={{ color:'#38EF7D', fontSize:13, fontWeight:700, margin:0 }}>✓ {fileName}</p>
                  : <>
                      <p style={{ color:'#fff', fontSize:15, fontWeight:700, margin:'0 0 6px' }}>Drop file here or click to upload</p>
                      <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12, margin:0 }}>PDF · DOCX · TXT · Max 10MB</p>
                    </>
              }
            </div>

            <p style={{ ...s.label, textAlign:'center' }}>— or paste your resume below —</p>
            <textarea value={resumeText} onChange={handleResumeChange} placeholder="Paste your resume text here..." style={{ ...s.textarea, height:160 }} />
            <p style={{ textAlign:'right', fontSize:11, color:'rgba(255,255,255,0.3)', margin:'4px 0 0' }}>{resumeText.length.toLocaleString()} / {MAX_PASTE_CHARS.toLocaleString()}</p>
          </div>

          {/* Job Description */}
          <div style={s.card}>
            <h2 style={{ margin:'0 0 16px', fontSize:20, fontWeight:800, background:'linear-gradient(90deg,#FF0099,#FF6B6B)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', display:'flex', alignItems:'center', gap:8 }}>
              <span>💼</span> Job Description
            </h2>

            {/* Job Drop Zone */}
            <div
              onDragOver={e => { e.preventDefault(); setJobDragOver(true) }}
              onDragLeave={() => setJobDragOver(false)}
              onDrop={handleJobDrop}
              onClick={() => jobFileRef.current?.click()}
              style={{
                cursor:'pointer', borderRadius:16,
                border:`2px dashed ${jobDragOver ? '#FF0099' : 'rgba(255,255,255,0.25)'}`,
                padding:'24px 16px', textAlign:'center', marginBottom:16, transition:'all .2s',
                background: jobDragOver ? 'rgba(255,0,153,0.15)' : 'rgba(255,255,255,0.04)',
              }}
            >
              <input ref={jobFileRef} type="file" accept=".pdf,.docx,.txt" onChange={e => processJobFile(e.target.files[0])} style={{ display:'none' }} />
              <div style={{ fontSize:36, marginBottom:8 }}>{jobUploading ? '⏳' : '📂'}</div>
              {jobUploading
                ? <p style={{ color:'#FF0099', fontSize:14, fontWeight:700, margin:0 }}>Reading file...</p>
                : jobFileName
                  ? <p style={{ color:'#38EF7D', fontSize:13, fontWeight:700, margin:0 }}>✓ {jobFileName}</p>
                  : <>
                      <p style={{ color:'#fff', fontSize:15, fontWeight:700, margin:'0 0 6px' }}>Drop file here or click to upload</p>
                      <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12, margin:0 }}>PDF · DOCX · TXT · Max 10MB</p>
                    </>
              }
            </div>

            <p style={{ ...s.label, textAlign:'center' }}>— or paste the job description below —</p>
            <textarea value={jobPosting} onChange={handleJobChange} placeholder="Paste the job description here..." style={{ ...s.textarea, height:160 }} />
            <p style={{ textAlign:'right', fontSize:11, color:'rgba(255,255,255,0.3)', margin:'4px 0 0' }}>{jobPosting.length.toLocaleString()} / 6,000</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background:'rgba(255,60,60,0.15)', border:'1px solid rgba(255,60,60,0.4)', color:'#FF9090', borderRadius:14, padding:'12px 20px', marginBottom:20, fontSize:13, display:'flex', alignItems:'center', gap:10 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Analyze Button */}
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              background: loading ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg,#FACF39,#FF9500)',
              color: loading ? 'rgba(255,255,255,0.5)' : '#1a0a00',
              fontWeight:900, fontSize:22, border:'none', cursor: loading ? 'not-allowed' : 'pointer',
              padding:'18px 60px', borderRadius:20,
              boxShadow: loading ? 'none' : '0 8px 40px rgba(250,207,57,0.5)',
              transition:'all .2s', display:'inline-flex', alignItems:'center', gap:12,
              letterSpacing:.5
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform='scale(1.06)'; e.currentTarget.style.boxShadow='0 12px 48px rgba(250,207,57,0.7)' } }}
            onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow= loading ? 'none' : '0 8px 40px rgba(250,207,57,0.5)' }}
          >
            <span style={{ fontSize:26 }}>{loading ? '✨' : '🚀'}</span>
            {loading ? 'Analyzing with AI...' : 'Analyze Now — Free'}
          </button>
          {loading && (
            <div style={{ marginTop:20 }}>
              <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:10 }}>
                {[0,1,2,3,4].map(i => (
                  <div key={i} style={{ width:9, height:9, borderRadius:'50%', background:'linear-gradient(135deg,#FF0099,#FACF39)', animation:'bounce .9s ease infinite', animationDelay:`${i*.13}s` }} />
                ))}
              </div>
              <p style={{ color:'rgba(255,255,255,0.5)', fontSize:14 }}>Generating 12 AI results — about 30 seconds...</p>
            </div>
          )}
        </div>

        {/* Results */}
        {results && (
          <div>
            <h2 style={{ textAlign:'center', fontSize:28, fontWeight:900, marginBottom:8, background:'linear-gradient(135deg,#FF0099,#FACF39,#00AEEF)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Your 12 AI Results
            </h2>
            <p style={{ textAlign:'center', color:'rgba(255,255,255,0.4)', fontSize:13, marginBottom:28 }}>Click any card to view · Copy button on each result</p>

            {/* Cards Grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:10, marginBottom:28 }}>
              {CARDS.map(card => (
                <button
                  key={card.key}
                  onClick={() => setActiveCard(card.key)}
                  style={{
                    borderRadius:16, padding:'14px 8px', textAlign:'center', cursor:'pointer',
                    background: activeCard === card.key ? card.g : 'rgba(255,255,255,0.06)',
                    border: activeCard === card.key ? '2px solid rgba(255,255,255,0.4)' : '2px solid rgba(255,255,255,0.08)',
                    boxShadow: activeCard === card.key ? '0 6px 20px rgba(0,0,0,0.4)' : 'none',
                    transform: activeCard === card.key ? 'scale(1.06)' : 'scale(1)',
                    transition:'all .2s', fontFamily:'inherit', color:'#fff'
                  }}
                >
                  <div style={{ fontSize:26, marginBottom:6 }}>{card.icon}</div>
                  <div style={{ fontSize:10, fontWeight:700, lineHeight:1.3, opacity: activeCard === card.key ? 1 : 0.8 }}>{card.title}</div>
                </button>
              ))}
            </div>

            {/* Active Result */}
            {activeCard && results[activeCard] && (() => {
              const card = CARDS.find(c => c.key === activeCard)
              return (
                <div style={{ ...s.card, border:'1px solid rgba(255,255,255,0.2)', boxShadow:'0 12px 48px rgba(0,0,0,0.4)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                    <h3 style={{ margin:0, fontSize:22, fontWeight:900, background:card.g, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontSize:28 }}>{card.icon}</span> {card.title}
                    </h3>
                    <button
                      onClick={() => copyToClipboard(results[activeCard], activeCard)}
                      style={{
                        background: copied === activeCard ? 'linear-gradient(135deg,#11998E,#38EF7D)' : 'rgba(255,255,255,0.12)',
                        color: '#fff', border:'1px solid rgba(255,255,255,0.2)', borderRadius:12,
                        padding:'9px 20px', cursor:'pointer', fontSize:13, fontWeight:700,
                        transition:'all .2s', fontFamily:'inherit'
                      }}
                    >
                      {copied === activeCard ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                  <div style={{ background:'rgba(0,0,0,0.3)', borderRadius:14, padding:20, fontSize:14, whiteSpace:'pre-wrap', lineHeight:1.75, color:'rgba(255,255,255,0.9)', maxHeight:540, overflowY:'auto', border:'1px solid rgba(255,255,255,0.08)' }}>
                    {results[activeCard]}
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {/* Privacy & Disclaimer */}
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'0 16px 40px' }}>
        <div style={{ borderRadius:16, border:'1px solid rgba(255,255,255,0.08)', padding:'20px 24px', background:'rgba(255,255,255,0.03)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20 }}>

            {/* Privacy */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <span style={{ fontSize:18 }}>🔒</span>
                <strong style={{ color:'rgba(255,255,255,0.8)', fontSize:13 }}>Privacy — Your Data Stays With You</strong>
              </div>
              <ul style={{ color:'rgba(255,255,255,0.4)', fontSize:12, lineHeight:1.7, margin:0, paddingLeft:16 }}>
                <li>We do <strong style={{ color:'rgba(255,255,255,0.6)' }}>NOT</strong> store your resume on any server</li>
                <li>We do <strong style={{ color:'rgba(255,255,255,0.6)' }}>NOT</strong> store the job description</li>
                <li>We do <strong style={{ color:'rgba(255,255,255,0.6)' }}>NOT</strong> store AI results or logs</li>
                <li>Data is processed in-memory and discarded immediately</li>
                <li>Refresh or close the page — everything is gone</li>
                <li>AI analysis provided by Google Gemini (Google Privacy Policy applies)</li>
              </ul>
            </div>

            {/* GRC / Compliance */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <span style={{ fontSize:18 }}>🛡️</span>
                <strong style={{ color:'rgba(255,255,255,0.8)', fontSize:13 }}>Security & Compliance (GRC)</strong>
              </div>
              <ul style={{ color:'rgba(255,255,255,0.4)', fontSize:12, lineHeight:1.7, margin:0, paddingLeft:16 }}>
                <li>All traffic encrypted via HTTPS (TLS 1.3)</li>
                <li>Rate limited: 5 requests/hour per IP — prevents abuse</li>
                <li>Progressive blocks: 1h → 3h → 6h on repeated violations</li>
                <li>Inputs sanitized — HTML, null bytes, injection patterns removed</li>
                <li>Security headers: X-Frame-Options, CSP, XSS-Protection</li>
                <li>Zero persistent storage — GDPR/PIPEDA friendly by design</li>
              </ul>
            </div>

            {/* Disclaimer */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <span style={{ fontSize:18 }}>⚠️</span>
                <strong style={{ color:'rgba(255,255,255,0.8)', fontSize:13 }}>Disclaimer</strong>
              </div>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:12, lineHeight:1.7, margin:0 }}>
                Job Coach AI 2026 is an AI-assisted tool for career guidance purposes only. All outputs are generated by artificial intelligence and should be reviewed and customized before use. This tool does not guarantee employment outcomes. Salary ranges are estimates and may not reflect local market conditions. Always verify information with qualified professionals. By using this tool, you accept that outputs are AI-generated and may contain inaccuracies.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ textAlign:'center', padding:'32px 16px', borderTop:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.35)', fontSize:13 }}>
        Built with love by{' '}
        <strong style={{ color:'#FF0099' }}>Shahzad</strong>
        {' · Job Coach AI 2026 · Powered by '}
        <strong style={{ color:'#FACF39' }}>Anthropic Claude Sonnet 4.6</strong>
      </footer>

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse-glow { 0%,100%{filter:drop-shadow(0 0 8px #FF009966)} 50%{filter:drop-shadow(0 0 24px #FF0099cc)} }
        *{box-sizing:border-box}
        textarea::placeholder{color:rgba(255,255,255,0.25)}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:rgba(255,255,255,0.05)}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:4px}
      `}</style>
    </main>
  )
}
