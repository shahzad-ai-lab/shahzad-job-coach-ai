'use client'

import { useState, useRef } from 'react'

const MAX_PASTE_CHARS = 12000

// 60-30-10 Dopamine Brights palette
// 60% background: Cream #F7F3EE
// 30% secondary: Sky Blue #00AEEF (headers, sections)
// 10% CTA accent: Sunny Yellow #FACF39 (main button)
// Text: Deep Navy #112D4E
// Highlights: Electric Pink #FF0099

const CARDS = [
  { key: 'resumeScore',    title: 'Resume Score',      icon: '📊', bg: '#00AEEF', ring: '#00AEEF' },
  { key: 'coverLetter',    title: 'Cover Letter',      icon: '✉️',  bg: '#FF0099', ring: '#FF0099' },
  { key: 'resumeRewrite',  title: 'Resume Rewrite',    icon: '📄',  bg: '#7B2FBE', ring: '#7B2FBE' },
  { key: 'skillsGap',      title: 'Skills Gap',        icon: '🎯',  bg: '#FF6B35', ring: '#FF6B35' },
  { key: 'interviewPrep',  title: 'Interview Prep',    icon: '🎤',  bg: '#00C896', ring: '#00C896' },
  { key: 'introScripts',   title: 'Intro Scripts',     icon: '🗣️',  bg: '#FF0099', ring: '#FF0099' },
  { key: 'starStories',    title: 'STAR Stories',      icon: '⭐',  bg: '#FACF39', ring: '#FACF39' },
  { key: 'linkedinSummary',title: 'LinkedIn Summary',  icon: '💼',  bg: '#00AEEF', ring: '#00AEEF' },
  { key: 'matchingJobs',   title: 'Matching Jobs',     icon: '🏢',  bg: '#FF6B35', ring: '#FF6B35' },
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
    if (val.length > MAX_PASTE_CHARS) {
      setError(`Resume capped at ${MAX_PASTE_CHARS.toLocaleString()} characters.`)
      setResumeText(val.slice(0, MAX_PASTE_CHARS))
    } else { setError(''); setResumeText(val) }
  }

  function handleJobChange(e) {
    const val = e.target.value
    if (val.length > 6000) {
      setError('Job posting capped at 6,000 characters.')
      setJobPosting(val.slice(0, 6000))
    } else { setError(''); setJobPosting(val) }
  }

  async function processFile(file) {
    if (!file) return
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    if (!['.pdf','.docx','.txt'].includes(ext)) { setError('Only PDF, DOCX, or TXT supported.'); return }
    if (file.size > 10 * 1024 * 1024) { setError(`File too large (${(file.size/1024/1024).toFixed(1)}MB). Max 10MB.`); return }
    setUploading(true); setError(''); setFileName(file.name)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResumeText(data.text)
    } catch (err) { setError(err.message); setFileName('') }
    finally { setUploading(false) }
  }

  function handleFileInput(e) { processFile(e.target.files[0]) }
  function handleDrop(e) { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]) }

  async function handleAnalyze() {
    if (!resumeText.trim()) { setError('Please add your resume text or upload a file.'); return }
    if (!jobPosting.trim()) { setError('Please paste the job posting.'); return }
    setError(''); setLoading(true); setResults(null); setActiveCard(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobPosting }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResults(data)
      setActiveCard('resumeScore')
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  function copyToClipboard(text, key) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <main style={{ background: '#F7F3EE', color: '#112D4E', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* Subtle top accent bar */}
      <div style={{ height: 5, background: 'linear-gradient(90deg, #FACF39, #FF0099, #00AEEF)' }} />

      {/* Header */}
      <header style={{ padding: '48px 24px 32px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block', marginBottom: 16, padding: '4px 16px',
          borderRadius: 999, background: '#00AEEF20', border: '1px solid #00AEEF60',
          fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#00AEEF'
        }}>
          AI-Powered Career Coach
        </div>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 900, margin: '0 0 12px',
          background: 'linear-gradient(135deg, #FF0099, #FACF39, #00AEEF)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1
        }}>Job Coach AI</h1>
        <p style={{ color: '#112D4E99', fontSize: 18, maxWidth: 480, margin: '0 auto 24px' }}>
          Upload your resume. Paste the job.{' '}
          <strong style={{ color: '#112D4E' }}>Land the interview.</strong>
        </p>
        <div style={{ width: 80, height: 4, borderRadius: 4, background: 'linear-gradient(90deg, #FF0099, #00AEEF)', margin: '0 auto' }} />
      </header>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px 80px' }}>

        {/* Input Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 20 }}>

          {/* Resume */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '2px solid #00AEEF30', boxShadow: '0 4px 20px #00AEEF15' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 800, color: '#00AEEF', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📋</span> Your Resume
            </h2>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                cursor: 'pointer', borderRadius: 14, border: `2px dashed ${dragOver ? '#00AEEF' : '#00AEEF50'}`,
                padding: '20px 16px', textAlign: 'center', marginBottom: 14, transition: 'all .2s',
                background: dragOver ? '#00AEEF10' : '#F7F3EE'
              }}
            >
              <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFileInput} style={{ display: 'none' }} />
              <div style={{ fontSize: 28, marginBottom: 6 }}>{uploading ? '⏳' : '📂'}</div>
              {uploading
                ? <p style={{ color: '#00AEEF', fontSize: 13, fontWeight: 600, margin: 0 }}>Reading file...</p>
                : fileName
                  ? <p style={{ color: '#00C896', fontSize: 13, fontWeight: 600, margin: 0 }}>✓ {fileName}</p>
                  : <>
                      <p style={{ color: '#112D4E', fontSize: 13, fontWeight: 600, margin: '0 0 4px' }}>Drop file or click to upload</p>
                      <p style={{ color: '#112D4E60', fontSize: 11, margin: 0 }}>PDF · DOCX · TXT · Max 10MB</p>
                    </>
              }
            </div>
            <p style={{ color: '#112D4E60', fontSize: 11, textAlign: 'center', margin: '0 0 8px' }}>— or paste below —</p>
            <textarea
              value={resumeText} onChange={handleResumeChange}
              placeholder="Paste your resume text here..."
              style={{
                width: '100%', height: 160, background: '#F7F3EE', color: '#112D4E', borderRadius: 12,
                padding: 12, fontSize: 13, resize: 'none', border: '1px solid #00AEEF30',
                outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit'
              }}
            />
            <p style={{ textAlign: 'right', fontSize: 11, color: '#112D4E40', margin: '4px 0 0' }}>
              {resumeText.length.toLocaleString()} / {MAX_PASTE_CHARS.toLocaleString()}
            </p>
          </div>

          {/* Job Posting */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '2px solid #FF009930', boxShadow: '0 4px 20px #FF009915' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 800, color: '#FF0099', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>💼</span> Job Posting
            </h2>
            <p style={{ color: '#112D4E60', fontSize: 11, margin: '0 0 8px' }}>Paste the full job description:</p>
            <textarea
              value={jobPosting} onChange={handleJobChange}
              placeholder="Paste the job posting here..."
              style={{
                width: '100%', height: 220, background: '#F7F3EE', color: '#112D4E', borderRadius: 12,
                padding: 12, fontSize: 13, resize: 'none', border: '1px solid #FF009930',
                outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit'
              }}
            />
            <p style={{ textAlign: 'right', fontSize: 11, color: '#112D4E40', margin: '4px 0 0' }}>
              {jobPosting.length.toLocaleString()} / 6,000
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#FF000010', border: '1px solid #FF000040', color: '#CC0000', borderRadius: 14, padding: '12px 20px', marginBottom: 20, fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* CTA Button — 10% Accent = Sunny Yellow */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              background: loading ? '#ccc' : 'linear-gradient(135deg, #FACF39, #FF9500)',
              color: '#112D4E', fontWeight: 900, fontSize: 20, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              padding: '18px 56px', borderRadius: 18, boxShadow: loading ? 'none' : '0 8px 32px #FACF3960',
              transition: 'all .2s', transform: loading ? 'none' : 'scale(1)',
              display: 'inline-flex', alignItems: 'center', gap: 10
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'scale(1.05)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            <span style={{ fontSize: 24 }}>{loading ? '✨' : '🚀'}</span>
            {loading ? 'Analyzing...' : 'Analyze Now'}
          </button>
          {loading && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
                {[0,1,2,3,4].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%', background: '#FF0099',
                    animation: 'bounce .8s ease infinite', animationDelay: `${i * 0.12}s`
                  }} />
                ))}
              </div>
              <p style={{ color: '#112D4E80', fontSize: 13 }}>AI is generating 9 results — about 25 seconds...</p>
            </div>
          )}
        </div>

        {/* Results */}
        {results && (
          <div>
            <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 900, marginBottom: 24,
              background: 'linear-gradient(135deg, #FF0099, #FACF39)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>Your Results are Ready</h2>

            {/* Card Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
              {CARDS.map(card => (
                <button
                  key={card.key}
                  onClick={() => setActiveCard(card.key)}
                  style={{
                    borderRadius: 16, padding: '12px 8px', textAlign: 'center', cursor: 'pointer',
                    border: activeCard === card.key ? `2px solid ${card.bg}` : '2px solid #00000010',
                    background: activeCard === card.key
                      ? `linear-gradient(135deg, ${card.bg}20, ${card.bg}10)`
                      : '#fff',
                    boxShadow: activeCard === card.key ? `0 4px 16px ${card.bg}40` : '0 2px 8px #00000010',
                    transform: activeCard === card.key ? 'scale(1.04)' : 'scale(1)',
                    transition: 'all .2s', fontFamily: 'inherit'
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{card.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: activeCard === card.key ? card.bg : '#112D4E', lineHeight: 1.2 }}>
                    {card.title}
                  </div>
                </button>
              ))}
            </div>

            {/* Active Card */}
            {activeCard && results[activeCard] && (() => {
              const card = CARDS.find(c => c.key === activeCard)
              return (
                <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: `2px solid ${card.bg}40`, boxShadow: `0 8px 32px ${card.bg}20` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: card.bg, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{card.icon}</span> {card.title}
                    </h3>
                    <button
                      onClick={() => copyToClipboard(results[activeCard], activeCard)}
                      style={{
                        background: copied === activeCard ? '#00C89620' : '#F7F3EE',
                        color: copied === activeCard ? '#00C896' : '#112D4E',
                        border: `1px solid ${copied === activeCard ? '#00C896' : '#00000020'}`,
                        borderRadius: 10, padding: '8px 18px', cursor: 'pointer',
                        fontSize: 13, fontWeight: 600, transition: 'all .2s', fontFamily: 'inherit'
                      }}
                    >
                      {copied === activeCard ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                  <div style={{
                    background: '#F7F3EE', borderRadius: 14, padding: 20, fontSize: 14,
                    whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#112D4E',
                    maxHeight: 520, overflowY: 'auto', border: `1px solid ${card.bg}20`
                  }}>
                    {results[activeCard]}
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '32px 16px', borderTop: '1px solid #00000010', color: '#112D4E60', fontSize: 13 }}>
        Built with love by{' '}
        <strong style={{ color: '#FF0099' }}>Shahzad</strong>
        {' · Job Coach AI 2026 · Powered by '}
        <strong style={{ color: '#00AEEF' }}>Anthropic Claude Sonnet 4.6</strong>
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </main>
  )
}
