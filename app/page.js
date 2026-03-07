'use client'

import { useState, useRef } from 'react'

const MAX_PASTE_CHARS = 12000

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
  const fileRef = useRef(null)

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

  async function handleAnalyze() {
    if (!resumeText.trim()) { setError('Please add your resume text or upload a file.'); return }
    if (!jobPosting.trim()) { setError('Please paste the job description.'); return }
    setError(''); setLoading(true); setResults(null); setActiveCard(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobPosting }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResults(data); setActiveCard('resumeScore')
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
        <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
          {['12 AI Tools','ATS Scoring','Salary Scripts','30-60-90 Plan'].map(t => (
            <span key={t} style={{ padding:'5px 14px', borderRadius:999, background:'rgba(255,255,255,0.1)', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.8)', border:'1px solid rgba(255,255,255,0.15)' }}>{t}</span>
          ))}
        </div>
      </header>

      <div style={s.container}>
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
            <p style={s.label}>Paste the full job description:</p>
            <textarea value={jobPosting} onChange={handleJobChange} placeholder="Paste the job description here..." style={{ ...s.textarea, height:240 }} />
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

      {/* Footer */}
      <footer style={{ textAlign:'center', padding:'32px 16px', borderTop:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.35)', fontSize:13 }}>
        Built with love by{' '}
        <strong style={{ color:'#FF0099' }}>Shahzad</strong>
        {' · Job Coach AI 2026 · Powered by '}
        <strong style={{ color:'#FACF39' }}>Anthropic Claude Sonnet 4.6</strong>
      </footer>

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        *{box-sizing:border-box}
        textarea::placeholder{color:rgba(255,255,255,0.25)}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:rgba(255,255,255,0.05)}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:4px}
      `}</style>
    </main>
  )
}
