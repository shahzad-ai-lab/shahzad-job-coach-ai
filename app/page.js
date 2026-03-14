'use client'

import { useState, useRef, useEffect, useMemo } from 'react'

// ── Constants ──────────────────────────────────────────────────────────────────
const MAX_PASTE_CHARS = 12000
const CLIENT_HOURLY_LIMIT = 5
const HOUR_MS = 3_600_000
const BACKOFF_HOURS = [1, 3, 6]

// ── Stop words for client-side ATS scoring ────────────────────────────────────
const STOP_WORDS = new Set([
  'the','and','or','a','an','is','are','was','were','be','been','have','has',
  'do','does','will','would','could','should','can','not','no','in','on','at',
  'by','for','with','as','from','to','of','i','you','we','they','my','your',
  'our','their','this','that','it','get','use','make','who','what','when',
  'where','how','why','which','all','any','each','more','some','such','than',
  'then','so','if','but','also','about','up','out','its','into','over','after',
  'just','may','other','new','one','two','has','had','him','her','his','she',
  'he','they','them','those','these','been','being','am','every','much','most',
  'only','own','same','too','very','both','few','more','most','other','some',
  'now','here','there','again','further','once','during','before','while',
  'through','between','against','without','within','along','following','across',
  'behind','beyond','plus','except','up','down','off','above','below','near',
  'per','via','re','vs','etc','eg','ie','work','working','experience','years',
  'year','team','using','role','ability','strong','excellent','good','great',
  'well','able','skills','skill','knowledge','understanding','familiarity',
  'including','related','required','preferred','responsibilities','qualifications',
  'looking','seeking','join','company','position','job','opportunity','apply',
])

function extractKeywords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-+#]/g, ' ')
    .split(/\s+/)
    .map(w => w.replace(/^[-]+|[-]+$/g, ''))
    .filter(w => w.length > 2 && !STOP_WORDS.has(w) && !/^\d+$/.test(w))
}

// ── Rate limiting helpers ─────────────────────────────────────────────────────
function getRLS() {
  try {
    const s = JSON.parse(localStorage.getItem('jcai_rl') || 'null')
    const now = Date.now()
    if (!s) return { count: 0, windowReset: now + HOUR_MS, violations: 0, blockUntil: 0 }
    if (now > s.windowReset) return { count: 0, windowReset: now + HOUR_MS, violations: s.violations || 0, blockUntil: s.blockUntil || 0 }
    return s
  } catch { return { count: 0, windowReset: Date.now() + HOUR_MS, violations: 0, blockUntil: 0 } }
}

function saveRLS(s) { try { localStorage.setItem('jcai_rl', JSON.stringify(s)) } catch {} }

function checkRL() {
  const s = getRLS(); const now = Date.now()
  if (s.blockUntil > now) {
    const m = Math.ceil((s.blockUntil - now) / 60000), h = m >= 60 ? Math.ceil(m / 60) : null
    return { ok: false, msg: `Rate limited. Try in ${h ? h + 'h' : m + 'min'}.` }
  }
  if (s.count >= CLIENT_HOURLY_LIMIT) {
    const bh = BACKOFF_HOURS[Math.min(s.violations, BACKOFF_HOURS.length - 1)]
    s.violations++; s.blockUntil = now + bh * HOUR_MS; saveRLS(s)
    return { ok: false, msg: `${CLIENT_HOURLY_LIMIT}/hr limit reached. Try in ${bh}h.` }
  }
  s.count++; saveRLS(s)
  return { ok: true, remaining: CLIENT_HOURLY_LIMIT - s.count }
}

// ── OS detection ──────────────────────────────────────────────────────────────
function detectOS() {
  if (typeof navigator === 'undefined') return 'Unknown'
  const ua = navigator.userAgent
  if (/Windows NT/.test(ua)) return 'Windows'
  if (/Macintosh|Mac OS X/.test(ua)) return 'macOS'
  if (/iPhone|iPad/.test(ua)) return 'iOS'
  if (/Android/.test(ua)) return 'Android'
  if (/Linux/.test(ua)) return 'Linux'
  return 'Unknown'
}

// ── Cards definition ──────────────────────────────────────────────────────────
const CARDS = [
  { key: 'resumeScore',       title: 'ATS Score',        icon: '📊', g: 'linear-gradient(135deg,#00C6FF,#0072FF)' },
  { key: 'recruiterPov',      title: 'Recruiter POV',    icon: '🚩', g: 'linear-gradient(135deg,#FF416C,#FF4B2B)' },
  { key: 'coverLetter',       title: 'Cover Letter',     icon: '✉️',  g: 'linear-gradient(135deg,#FF0099,#FF6B6B)' },
  { key: 'resumeRewrite',     title: 'Resume Rewrite',   icon: '📄',  g: 'linear-gradient(135deg,#7B2FBE,#C84B31)' },
  { key: 'skillsGap',         title: 'Skills Gap',       icon: '🎯',  g: 'linear-gradient(135deg,#FF6B35,#FACF39)' },
  { key: 'interviewPrep',     title: 'Interview Prep',   icon: '🎤',  g: 'linear-gradient(135deg,#11998E,#38EF7D)' },
  { key: 'introScripts',      title: 'Intro Scripts',    icon: '🗣️',  g: 'linear-gradient(135deg,#FC466B,#3F5EFB)' },
  { key: 'starStories',       title: 'STAR Stories',     icon: '⭐',  g: 'linear-gradient(135deg,#F7971E,#FFD200)' },
  { key: 'linkedinSummary',   title: 'LinkedIn',         icon: '💼',  g: 'linear-gradient(135deg,#1CB5E0,#000851)' },
  { key: 'matchingJobs',      title: 'Matching Jobs',    icon: '🏢',  g: 'linear-gradient(135deg,#56CCF2,#2F80ED)' },
  { key: 'visaPathways',      title: 'Global Visas',     icon: '🌍',  g: 'linear-gradient(135deg,#38EF7D,#00AEEF)' },
  { key: 'thankYouEmail',     title: 'Thank You',        icon: '💌',  g: 'linear-gradient(135deg,#DA22FF,#9733EE)' },
  { key: 'salaryNegotiation', title: 'Salary Strategy',  icon: '💰',  g: 'linear-gradient(135deg,#11998E,#38EF7D)' },
  { key: 'actionPlan',        title: '30-60-90 Plan',    icon: '🗓️',  g: 'linear-gradient(135deg,#FF416C,#FF4B2B)' },
]

// ── RenderText: converts markdown-like text to React elements ─────────────────
function RenderText({ text }) {
  if (!text) return null

  function parseInlineBold(str) {
    if (!str.includes('**')) return str
    const parts = str.split('**')
    return parts.map((p, i) =>
      i % 2 === 1
        ? <strong key={i} style={{ color: '#fff', fontWeight: 800 }}>{p}</strong>
        : p
    )
  }

  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={i} style={{ height: 10 }} />

        // # Heading 1
        if (/^#\s+/.test(trimmed)) {
          const content = trimmed.replace(/^#+\s*/, '')
          return (
            <div key={i} style={{ fontSize: 17, fontWeight: 800, color: '#00AEEF', borderBottom: '1px solid rgba(0,174,239,0.3)', paddingBottom: 6, marginTop: 18, marginBottom: 8 }}>
              {parseInlineBold(content)}
            </div>
          )
        }

        // ## Heading 2
        if (/^##\s+/.test(trimmed)) {
          const content = trimmed.replace(/^#+\s*/, '')
          return (
            <div key={i} style={{ fontSize: 15, fontWeight: 700, color: '#FACF39', marginTop: 14, marginBottom: 6 }}>
              {parseInlineBold(content)}
            </div>
          )
        }

        // Bullet: • - * at start
        if (/^[•\-\*]\s+/.test(trimmed)) {
          const content = trimmed.replace(/^[•\-\*]\s+/, '')
          return (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5, alignItems: 'flex-start', paddingLeft: 8 }}>
              <span style={{ color: '#FF0099', fontWeight: 900, flexShrink: 0, marginTop: 1 }}>•</span>
              <span style={{ color: 'rgba(255,255,255,0.88)', lineHeight: 1.6 }}>{parseInlineBold(content)}</span>
            </div>
          )
        }

        // Numbered list
        if (/^\d+\.\s+/.test(trimmed)) {
          const num = trimmed.match(/^(\d+)\./)[1]
          const content = trimmed.replace(/^\d+\.\s+/, '')
          return (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 5, alignItems: 'flex-start', paddingLeft: 8 }}>
              <span style={{ color: '#FACF39', fontWeight: 800, flexShrink: 0, minWidth: 20, marginTop: 1 }}>{num}.</span>
              <span style={{ color: 'rgba(255,255,255,0.88)', lineHeight: 1.6 }}>{parseInlineBold(content)}</span>
            </div>
          )
        }

        // ALL CAPS LABEL: pattern
        if (/^[A-Z][A-Z\s]{2,}:\s*/.test(trimmed)) {
          const colonIdx = trimmed.indexOf(':')
          const label = trimmed.slice(0, colonIdx)
          const rest = trimmed.slice(colonIdx + 1).trim()
          return (
            <div key={i} style={{ marginBottom: 6, lineHeight: 1.7 }}>
              <span style={{ color: '#FACF39', fontWeight: 800, letterSpacing: 0.5 }}>{label}: </span>
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>{parseInlineBold(rest)}</span>
            </div>
          )
        }

        // Plain line
        return (
          <div key={i} style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 3 }}>
            {parseInlineBold(trimmed)}
          </div>
        )
      })}
    </>
  )
}

// ── Shimmer overlay for loading cards ─────────────────────────────────────────
function ShimmerOverlay() {
  return (
    <div style={{
      position: 'absolute', inset: 0, borderRadius: 16, overflow: 'hidden',
      background: 'rgba(255,255,255,0.04)',
    }}>
      <div className="shimmer-bar" style={{
        position: 'absolute', top: 0, left: '-60%', width: '60%', height: '100%',
        background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)',
        animation: 'shimmer 1.4s ease-in-out infinite',
      }} />
    </div>
  )
}

// ── Circular progress ring ─────────────────────────────────────────────────────
function CircleRing({ score }) {
  const r = 42, circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color = score >= 70 ? '#38EF7D' : score >= 45 ? '#FACF39' : '#FF416C'
  return (
    <svg width={100} height={100} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={8} />
      <circle
        cx={50} cy={50} r={r} fill="none"
        stroke={color} strokeWidth={8}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <text x={50} y={50} textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize={20} fontWeight="900" fontFamily="inherit">
        {score}
      </text>
      <text x={50} y={68} textAnchor="middle" dominantBaseline="central"
        fill="rgba(255,255,255,0.5)" fontSize={9} fontFamily="inherit">
        / 100
      </text>
    </svg>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Home() {
  const [splash, setSplash]           = useState(true)
  const [splashPct, setSplashPct]     = useState(0)
  const [resumeText, setResumeText]   = useState('')
  const [jobText, setJobText]         = useState('')
  const [results, setResults]         = useState(null)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [errorDismissed, setErrorDismissed] = useState(false)
  const [uploading, setUploading]     = useState(false)
  const [fileName, setFileName]       = useState('')
  const [dragOver, setDragOver]       = useState(false)
  const [jobUploading, setJobUploading] = useState(false)
  const [jobFileName, setJobFileName] = useState('')
  const [jobDragOver, setJobDragOver] = useState(false)
  const [activeCard, setActiveCard]   = useState(null)
  const [copied, setCopied]           = useState('')
  const [userInfo, setUserInfo]       = useState(null)
  const [weather, setWeather]         = useState('')
  const [remaining, setRemaining]     = useState(CLIENT_HOURLY_LIMIT)

  const fileRef    = useRef(null)
  const jobFileRef = useRef(null)
  const resultsRef = useRef(null)

  // ── Splash screen: auto-dismiss after 1.8s with progress bar ───────────────
  useEffect(() => {
    let frame
    const start = Date.now()
    const duration = 1800
    function tick() {
      const elapsed = Date.now() - start
      const pct = Math.min(100, Math.round((elapsed / duration) * 100))
      setSplashPct(pct)
      if (elapsed < duration) { frame = requestAnimationFrame(tick) }
      else { setSplash(false) }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  // ── Fetch location + weather ────────────────────────────────────────────────
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => {
        setUserInfo({ city: d.city || '—', region: d.region || '—', country: d.country_name || '—', os: detectOS() })
        const loc = encodeURIComponent((d.city || '') + ',' + (d.country_code || ''))
        return fetch(`https://wttr.in/${loc}?format=%c+%C+%t&m`)
      })
      .then(r => r.text())
      .then(w => setWeather(w.trim()))
      .catch(() => {})
    const s = getRLS()
    setRemaining(Math.max(0, CLIENT_HOURLY_LIMIT - s.count))
  }, [])

  // ── Instant ATS Score (client-side, zero API) ───────────────────────────────
  const atsScore = useMemo(() => {
    if (!resumeText.trim() || !jobText.trim()) return null
    const resumeKws = new Set(extractKeywords(resumeText))
    const jobKws    = extractKeywords(jobText)
    const uniqueJobKws = [...new Set(jobKws)]
    if (uniqueJobKws.length === 0) return null
    const matched  = uniqueJobKws.filter(w => resumeKws.has(w))
    const missing  = uniqueJobKws.filter(w => !resumeKws.has(w)).slice(0, 20)
    const score    = Math.min(100, Math.round((matched.length / uniqueJobKws.length) * 100))
    const label    = score >= 70 ? 'Strong Match' : score >= 45 ? 'Partial Match' : 'Weak Match'
    return { score, label, matched: matched.slice(0, 20), missing }
  }, [resumeText, jobText])

  // ── File handlers ───────────────────────────────────────────────────────────
  async function processFile(file, forJob = false) {
    if (!file) return
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    if (!['.pdf', '.docx', '.txt'].includes(ext)) { setError('Only PDF, DOCX, or TXT supported.'); return }
    if (file.size > 10 * 1024 * 1024) { setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 10MB.`); return }
    forJob ? setJobUploading(true) : setUploading(true)
    setError(''); setErrorDismissed(false)
    forJob ? setJobFileName(file.name) : setFileName(file.name)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      forJob ? setJobText(data.text) : setResumeText(data.text)
    } catch (err) {
      setError(err.message)
      forJob ? setJobFileName('') : setFileName('')
    } finally {
      forJob ? setJobUploading(false) : setUploading(false)
    }
  }

  // ── Analyze ─────────────────────────────────────────────────────────────────
  async function handleAnalyze() {
    if (!resumeText.trim()) { setError('Please add your resume text or upload a file.'); setErrorDismissed(false); return }
    if (!jobText.trim())    { setError('Please paste the job description.'); setErrorDismissed(false); return }
    const rl = checkRL()
    if (!rl.ok) { setError(rl.msg); setErrorDismissed(false); return }
    setError(''); setErrorDismissed(false); setLoading(true); setResults({}); setActiveCard(CARDS[0].key)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobPosting: jobText, requestedKeys: CARDS.map(c => c.key) }),
      })
      if (!res.ok) {
        let msg = 'Analysis failed'
        try { const d = await res.json(); msg = d.message || d.error || msg } catch {}
        throw new Error(msg)
      }
      const data = await res.json()
      setResults(data)
      const s = getRLS(); setRemaining(Math.max(0, CLIENT_HOURLY_LIMIT - s.count))
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) { setError(err.message); setErrorDismissed(false) }
    finally { setLoading(false) }
  }

  // ── Share / Download ────────────────────────────────────────────────────────
  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: 'Job Coach AI 2026', url }) } catch {}
    } else {
      navigator.clipboard.writeText(url)
        .then(() => { setError(''); setCopied('__share__'); setTimeout(() => setCopied(''), 2000) })
        .catch(() => {})
    }
  }

  function downloadReport() {
    if (!results) return
    let content = 'JOB COACH AI 2026 — COMPREHENSIVE CAREER REPORT\n'
    content += '=================================================\n\n'
    CARDS.forEach(card => {
      if (results[card.key]) {
        content += `\n--- ${card.title.toUpperCase()} ---\n`
        content += results[card.key] + '\n'
      }
    })
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'Job_Coach_AI_Report.txt'; a.click()
    URL.revokeObjectURL(url)
  }

  function copyToClipboard(text, key) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  // ── Shared styles ───────────────────────────────────────────────────────────
  const glass = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(12px)',
    borderRadius: 20,
    padding: 24,
    border: '1px solid rgba(255,255,255,0.1)',
  }
  const textarea = {
    width: '100%', background: 'rgba(255,255,255,0.07)', color: '#fff',
    borderRadius: 12, padding: 12, fontSize: 13, resize: 'none',
    border: '1px solid rgba(255,255,255,0.15)', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6,
  }

  const visibleError = error && !errorDismissed

  return (
    <>
      {/* ── Splash Screen ───────────────────────────────────────────────────── */}
      {splash && (
        <div
          onClick={() => setSplash(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999, cursor: 'pointer',
            background: 'linear-gradient(160deg,#0F0C29,#302B63,#24243E)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 24,
          }}
        >
          <div style={{ fontSize: 64, animation: 'pulse-glow 1.8s ease-in-out infinite' }}>🚀</div>
          <h1 style={{
            fontSize: 'clamp(2rem,8vw,4rem)', fontWeight: 900, margin: 0,
            background: 'linear-gradient(135deg,#FF0099,#FACF39,#00AEEF)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Job Coach AI 2026
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: 0 }}>
            AI Career Coach · 14 Free Tools
          </p>
          {/* Progress bar */}
          <div style={{ width: 240, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 4,
              background: 'linear-gradient(90deg,#FF0099,#FACF39,#00AEEF)',
              width: `${splashPct}%`, transition: 'width 0.1s linear',
            }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, margin: 0 }}>
            Click anywhere to skip
          </p>
        </div>
      )}

      {/* ── Main page ───────────────────────────────────────────────────────── */}
      <main style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg,#0F0C29,#302B63,#24243E)',
        color: '#fff', fontFamily: "'Segoe UI',system-ui,sans-serif",
      }}>
        {/* Rainbow top bar */}
        <div style={{ height: 5, background: 'linear-gradient(90deg,#FF0099,#FACF39,#00AEEF,#38EF7D,#FF6B35)' }} />

        {/* ── User Info Bar ─────────────────────────────────────────────────── */}
        <div style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '8px 20px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', fontSize: 12 }}>
              {userInfo ? (
                <>
                  <span style={{ color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ color: '#00AEEF' }}>📍</span>
                    <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{userInfo.city}, {userInfo.region}</strong>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
                    {userInfo.country}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: '#FACF39' }}>🖥️</span> {userInfo.os}
                  </span>
                  {weather && (
                    <span style={{ color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>{weather}</span>
                    </span>
                  )}
                </>
              ) : (
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>Detecting location...</span>
              )}
            </div>
            {/* Usage dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Free uses:</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: CLIENT_HOURLY_LIMIT }).map((_, i) => (
                  <div key={i} style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: i < remaining ? 'linear-gradient(135deg,#38EF7D,#11998E)' : 'rgba(255,255,255,0.12)',
                    boxShadow: i < remaining ? '0 0 6px rgba(56,239,125,0.6)' : 'none',
                    transition: 'all .3s',
                  }} />
                ))}
              </div>
              <span style={{ fontSize: 11, color: remaining > 0 ? '#38EF7D' : '#FF6B6B', fontWeight: 700 }}>
                {remaining}/{CLIENT_HOURLY_LIMIT}
              </span>
            </div>
          </div>
        </div>

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <header style={{ padding: '28px 16px 16px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block', marginBottom: 14, padding: '4px 16px', borderRadius: 999,
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#FACF39',
          }}>
            AI Career Coach · 14 Free Tools
          </div>
          <h1 style={{
            fontSize: 'clamp(2.4rem,8vw,5rem)', fontWeight: 900, margin: '0 0 10px',
            background: 'linear-gradient(135deg,#FF0099,#FACF39,#00AEEF)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.05,
          }}>
            Job Coach AI 2026
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, maxWidth: 480, margin: '0 auto 14px' }}>
            Upload your resume. Paste the job.{' '}
            <strong style={{ color: '#fff' }}>Land the interview.</strong>
          </p>

          {/* ── Welcome Banner ─────────────────────────────────────────────── */}
          {!results && (
            <div style={{
              maxWidth: 780, margin: '12px auto 0', padding: '18px 24px', borderRadius: 18,
              background: 'linear-gradient(135deg,rgba(255,0,153,0.08),rgba(0,174,239,0.08))',
              border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left',
              animation: 'fade-in 0.6s ease',
            }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, margin: '0 0 8px' }}>
                In an era of <strong style={{ color: '#FACF39' }}>AI layoffs and global career migration</strong>, these 14 tools help anyone — from Mississauga to Mumbai — compete at the highest level. Explore visa pathways, crush ATS filters, and build your 30-60-90 day plan with AI guidance backed by real global career data.
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                100% free · Zero data stored · Powered by Google Gemini AntiGravity
              </p>
            </div>
          )}
        </header>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 12px 40px' }}>

          {/* ── Instant ATS Score ─────────────────────────────────────────── */}
          {atsScore && (
            <div style={{ ...glass, marginBottom: 24, animation: 'fade-in 0.4s ease' }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase' }}>
                ⚡ Instant ATS Score — Computed Locally (No API)
              </h2>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                <CircleRing score={atsScore.score} />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{
                    fontSize: 18, fontWeight: 900, marginBottom: 8,
                    color: atsScore.score >= 70 ? '#38EF7D' : atsScore.score >= 45 ? '#FACF39' : '#FF416C',
                  }}>
                    {atsScore.label}
                  </div>
                  {atsScore.matched.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Matched Keywords
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {atsScore.matched.map(kw => (
                          <span key={kw} style={{ padding: '3px 9px', borderRadius: 999, background: 'rgba(56,239,125,0.15)', border: '1px solid rgba(56,239,125,0.3)', fontSize: 11, color: '#38EF7D', fontWeight: 600 }}>{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {atsScore.missing.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Missing Keywords
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {atsScore.missing.map(kw => (
                          <span key={kw} style={{ padding: '3px 9px', borderRadius: 999, background: 'rgba(255,65,108,0.15)', border: '1px solid rgba(255,65,108,0.3)', fontSize: 11, color: '#FF6B6B', fontWeight: 600 }}>{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Input Grid ───────────────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20, marginBottom: 20 }}>

            {/* Resume Upload */}
            <div style={glass}>
              <h2 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 800, background: 'linear-gradient(90deg,#00C6FF,#0072FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📋</span> Your Resume
              </h2>
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]) }}
                onClick={() => fileRef.current?.click()}
                style={{
                  cursor: 'pointer', borderRadius: 14,
                  border: `2px dashed ${dragOver ? '#00AEEF' : 'rgba(255,255,255,0.22)'}`,
                  padding: '20px 14px', textAlign: 'center', marginBottom: 12,
                  background: dragOver ? 'rgba(0,174,239,0.12)' : 'rgba(255,255,255,0.03)',
                  transition: 'all .2s',
                }}
              >
                <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={e => processFile(e.target.files[0])} style={{ display: 'none' }} />
                <div style={{ fontSize: 30, marginBottom: 6 }}>{uploading ? '⏳' : '📂'}</div>
                {uploading
                  ? <p style={{ color: '#00AEEF', fontSize: 13, fontWeight: 700, margin: 0 }}>Reading file...</p>
                  : fileName
                    ? <p style={{ color: '#38EF7D', fontSize: 12, fontWeight: 700, margin: 0 }}>✓ {fileName}</p>
                    : <>
                        <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>Drop file or click to upload</p>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>PDF · DOCX · TXT · Max 10MB</p>
                      </>
                }
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', margin: '0 0 8px' }}>— or paste below —</p>
              <textarea
                value={resumeText}
                onChange={e => { const v = e.target.value; setResumeText(v.length > MAX_PASTE_CHARS ? v.slice(0, MAX_PASTE_CHARS) : v) }}
                placeholder="Paste your resume text here..."
                style={{ ...textarea, height: 150 }}
              />
              <p style={{ textAlign: 'right', fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: '4px 0 0' }}>
                {resumeText.length.toLocaleString()} / {MAX_PASTE_CHARS.toLocaleString()}
              </p>
            </div>

            {/* Job Description */}
            <div style={glass}>
              <h2 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 800, background: 'linear-gradient(90deg,#FF0099,#FF6B6B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>💼</span> Job Description
              </h2>
              <div
                onDragOver={e => { e.preventDefault(); setJobDragOver(true) }}
                onDragLeave={() => setJobDragOver(false)}
                onDrop={e => { e.preventDefault(); setJobDragOver(false); processFile(e.dataTransfer.files[0], true) }}
                onClick={() => jobFileRef.current?.click()}
                style={{
                  cursor: 'pointer', borderRadius: 14,
                  border: `2px dashed ${jobDragOver ? '#FF0099' : 'rgba(255,255,255,0.22)'}`,
                  padding: '20px 14px', textAlign: 'center', marginBottom: 12,
                  background: jobDragOver ? 'rgba(255,0,153,0.12)' : 'rgba(255,255,255,0.03)',
                  transition: 'all .2s',
                }}
              >
                <input ref={jobFileRef} type="file" accept=".pdf,.docx,.txt" onChange={e => processFile(e.target.files[0], true)} style={{ display: 'none' }} />
                <div style={{ fontSize: 30, marginBottom: 6 }}>{jobUploading ? '⏳' : '📂'}</div>
                {jobUploading
                  ? <p style={{ color: '#FF0099', fontSize: 13, fontWeight: 700, margin: 0 }}>Reading file...</p>
                  : jobFileName
                    ? <p style={{ color: '#38EF7D', fontSize: 12, fontWeight: 700, margin: 0 }}>✓ {jobFileName}</p>
                    : <>
                        <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>Drop file or click to upload</p>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>PDF · DOCX · TXT · Max 10MB</p>
                      </>
                }
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', margin: '0 0 8px' }}>— or paste below —</p>
              <textarea
                value={jobText}
                onChange={e => { const v = e.target.value; setJobText(v.length > 6000 ? v.slice(0, 6000) : v) }}
                placeholder="Paste the job description here..."
                style={{ ...textarea, height: 150 }}
              />
              <p style={{ textAlign: 'right', fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: '4px 0 0' }}>
                {jobText.length.toLocaleString()} / 6,000
              </p>
            </div>
          </div>

          {/* ── Error Banner ─────────────────────────────────────────────────── */}
          {visibleError && (
            <div style={{
              background: 'rgba(255,60,60,0.15)', border: '1px solid rgba(255,60,60,0.4)',
              color: '#FF9090', borderRadius: 14, padding: '12px 18px', marginBottom: 20,
              fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
              animation: 'fade-in 0.3s ease',
            }}>
              <span>⚠️ {error}</span>
              <button onClick={() => setErrorDismissed(true)} style={{ background: 'none', border: 'none', color: '#FF9090', cursor: 'pointer', fontSize: 18, padding: '0 4px', fontFamily: 'inherit' }}>×</button>
            </div>
          )}

          {/* ── Analyze Button ────────────────────────────────────────────────── */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              style={{
                background: loading ? 'rgba(255,255,255,0.18)' : 'linear-gradient(135deg,#FACF39,#FF9500)',
                color: loading ? 'rgba(255,255,255,0.4)' : '#1a0a00',
                fontWeight: 900, fontSize: 20, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                padding: '18px 56px', borderRadius: 20,
                boxShadow: loading ? 'none' : '0 8px 40px rgba(250,207,57,0.45)',
                transition: 'all .2s', display: 'inline-flex', alignItems: 'center', gap: 12,
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 48px rgba(250,207,57,0.65)' } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 8px 40px rgba(250,207,57,0.45)' }}
            >
              <span style={{ fontSize: 24 }}>{loading ? '✨' : '🚀'}</span>
              {loading ? 'Generating all 14 outputs...' : 'Generate 14 Results'}
            </button>
            {loading && (
              <div style={{ marginTop: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      width: 9, height: 9, borderRadius: '50%',
                      background: 'linear-gradient(135deg,#FF0099,#FACF39)',
                      animation: 'bounce .9s ease infinite',
                      animationDelay: `${i * 0.13}s`,
                    }} />
                  ))}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: 0 }}>
                  AI is generating all 14 career tools — about 15–30 seconds...
                </p>
              </div>
            )}
          </div>

          {/* ── Results Section ───────────────────────────────────────────────── */}
          {results !== null && (
            <div ref={resultsRef} style={{ animation: 'fade-in 0.5s ease' }}>
              {/* Results Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>
                <h2 style={{ fontSize: 26, fontWeight: 900, margin: 0, background: 'linear-gradient(135deg,#FF0099,#FACF39,#00AEEF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  AI Results
                </h2>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    onClick={handleShare}
                    style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', transition: 'all .2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  >
                    {copied === '__share__' ? '✓ Copied!' : '🔗 Share'}
                  </button>
                  <button
                    onClick={downloadReport}
                    disabled={Object.keys(results).length === 0}
                    style={{ padding: '8px 16px', borderRadius: 10, background: 'linear-gradient(135deg,#00C6FF,#0072FF)', border: 'none', color: '#fff', fontWeight: 700, cursor: Object.keys(results).length === 0 ? 'not-allowed' : 'pointer', fontSize: 13, fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(0,198,255,0.35)', transition: 'all .2s', opacity: Object.keys(results).length === 0 ? 0.5 : 1 }}
                    onMouseEnter={e => { if (Object.keys(results).length > 0) e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    📥 Download .txt
                  </button>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginBottom: 20 }}>
                Click any card to view · Green dot = result ready
              </p>

              {/* Card chips grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 10, marginBottom: 24 }}>
                {CARDS.map(card => {
                  const hasResult = !!(results[card.key])
                  const isActive  = activeCard === card.key
                  return (
                    <button
                      key={card.key}
                      onClick={() => setActiveCard(card.key)}
                      style={{
                        borderRadius: 16, padding: '14px 8px', textAlign: 'center', cursor: 'pointer',
                        background: isActive ? card.g : 'rgba(255,255,255,0.06)',
                        border: `2px solid ${isActive ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        boxShadow: isActive ? '0 6px 20px rgba(0,0,0,0.4)' : 'none',
                        transform: isActive ? 'scale(1.06)' : 'scale(1)',
                        transition: 'all .3s cubic-bezier(0.25,0.8,0.25,1)',
                        fontFamily: 'inherit', color: '#fff', position: 'relative', overflow: 'hidden',
                      }}
                      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.transform = 'scale(1.04) translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(0,0,0,0.4)' } }}
                      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' } }}
                    >
                      {/* Loading shimmer or ready indicator */}
                      {loading && !hasResult && <ShimmerOverlay />}
                      {hasResult && (
                        <div style={{
                          position: 'absolute', top: 7, right: 7, width: 8, height: 8,
                          borderRadius: '50%', background: '#38EF7D',
                          boxShadow: '0 0 6px rgba(56,239,125,0.8)',
                        }} />
                      )}
                      <div style={{ fontSize: 24, marginBottom: 5 }}>{card.icon}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.3, opacity: isActive ? 1 : 0.8 }}>{card.title}</div>
                    </button>
                  )
                })}
              </div>

              {/* Active card content panel */}
              {activeCard && (() => {
                const card = CARDS.find(c => c.key === activeCard)
                const content = results[activeCard]
                return (
                  <div style={{ ...glass, border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 12px 48px rgba(0,0,0,0.6)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                      <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, background: card.g, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 26 }}>{card.icon}</span> {card.title}
                      </h3>
                      <button
                        onClick={() => content && copyToClipboard(content, activeCard)}
                        disabled={!content}
                        style={{
                          background: copied === activeCard ? 'linear-gradient(135deg,#11998E,#38EF7D)' : 'rgba(255,255,255,0.1)',
                          color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10,
                          padding: '8px 18px', cursor: content ? 'pointer' : 'not-allowed',
                          fontSize: 13, fontWeight: 700, transition: 'all .2s', fontFamily: 'inherit',
                          opacity: content ? 1 : 0.4,
                        }}
                      >
                        {copied === activeCard ? '✓ Copied!' : '📋 Copy'}
                      </button>
                    </div>
                    <div style={{
                      background: 'rgba(0,0,0,0.35)', borderRadius: 14, padding: 22,
                      fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.92)',
                      maxHeight: 550, overflowY: 'auto',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                      {content
                        ? <RenderText text={content} />
                        : loading
                          ? <span style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                              Generating {card.title}...<span className="typing-cursor" />
                            </span>
                          : <span style={{ color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
                              No result for {card.title}
                            </span>
                      }
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* ── Privacy / Disclaimer footer card ────────────────────────────── */}
          <div style={{ ...glass, marginTop: 40, padding: '20px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span>🔒</span>
                  <strong style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Privacy — Your Data Stays With You</strong>
                </div>
                <ul style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1.7, margin: 0, paddingLeft: 16 }}>
                  <li>We do <strong style={{ color: 'rgba(255,255,255,0.6)' }}>NOT</strong> store your resume on any server</li>
                  <li>We do <strong style={{ color: 'rgba(255,255,255,0.6)' }}>NOT</strong> store the job description or AI results</li>
                  <li>Data is processed in-memory and discarded immediately</li>
                  <li>Refresh or close — everything is gone</li>
                  <li>AI analysis provided by Google Gemini (Google Privacy Policy applies)</li>
                </ul>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span>🛡️</span>
                  <strong style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Security & Compliance</strong>
                </div>
                <ul style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1.7, margin: 0, paddingLeft: 16 }}>
                  <li>All traffic encrypted via HTTPS (TLS 1.3)</li>
                  <li>Rate limited: 5 requests/hour per IP</li>
                  <li>Progressive blocks: 1h → 3h → 6h on violations</li>
                  <li>Inputs sanitized — HTML + injection patterns removed</li>
                  <li>Zero persistent storage — GDPR/PIPEDA friendly</li>
                </ul>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span>⚠️</span>
                  <strong style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Disclaimer</strong>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                  All outputs are generated by AI and should be reviewed before use. This tool does not guarantee employment outcomes. Salary ranges are estimates. Always verify with qualified professionals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <footer style={{ textAlign: 'center', padding: '28px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
          Built by{' '}
          <strong style={{ color: '#FF0099' }}>Shahzad</strong>
          {' · Mississauga, Ontario · Powered by '}
          <strong style={{ color: '#FACF39' }}>Google Gemini AntiGravity</strong>
          {' · Free for All Humanity'}
        </footer>

        {/* ── Global CSS ─────────────────────────────────────────────────────── */}
        <style>{`
          * { box-sizing: border-box; }
          @keyframes fade-in { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
          @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
          @keyframes pulse-glow { 0%,100%{filter:drop-shadow(0 0 8px #FF009966)} 50%{filter:drop-shadow(0 0 28px #FF0099cc)} }
          @keyframes typing { 0%,100%{opacity:1} 50%{opacity:0} }
          @keyframes shimmer { 0%{left:-60%} 100%{left:120%} }
          .typing-cursor::after { content:'▋'; animation:typing 1s infinite steps(1); color:#00AEEF; margin-left:5px; }
          textarea::placeholder { color:rgba(255,255,255,0.22); }
          ::-webkit-scrollbar { width:6px; }
          ::-webkit-scrollbar-track { background:rgba(255,255,255,0.04); }
          ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.18); border-radius:4px; }
        `}</style>
      </main>
    </>
  )
}
