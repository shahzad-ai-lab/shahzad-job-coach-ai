'use client'

import { useState, useRef } from 'react'

const MAX_PASTE_CHARS = 12000

const CARDS = [
  { key: 'coverLetter',    title: 'Cover Letter',      icon: '✉️',  grad: 'from-violet-500 to-purple-600',   ring: 'ring-violet-500' },
  { key: 'resumeRewrite',  title: 'Resume Rewrite',    icon: '📄',  grad: 'from-blue-500 to-cyan-500',       ring: 'ring-blue-500'   },
  { key: 'skillsGap',      title: 'Skills Gap',        icon: '🎯',  grad: 'from-orange-400 to-pink-500',     ring: 'ring-orange-400' },
  { key: 'interviewPrep',  title: 'Interview Prep',    icon: '🎤',  grad: 'from-emerald-400 to-teal-500',    ring: 'ring-emerald-400'},
  { key: 'starStories',    title: 'STAR Stories',      icon: '⭐',  grad: 'from-yellow-400 to-orange-500',   ring: 'ring-yellow-400' },
  { key: 'linkedinSummary',title: 'LinkedIn Summary',  icon: '💼',  grad: 'from-sky-400 to-indigo-500',      ring: 'ring-sky-400'    },
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
      setError(`Resume text capped at ${MAX_PASTE_CHARS.toLocaleString()} characters.`)
      setResumeText(val.slice(0, MAX_PASTE_CHARS))
    } else {
      setError('')
      setResumeText(val)
    }
  }

  function handleJobChange(e) {
    const val = e.target.value
    if (val.length > 6000) {
      setError('Job posting capped at 6,000 characters.')
      setJobPosting(val.slice(0, 6000))
    } else {
      setError('')
      setJobPosting(val)
    }
  }

  async function processFile(file) {
    if (!file) return
    const allowed = ['.pdf', '.docx', '.txt']
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    if (!allowed.includes(ext)) { setError('Only PDF, DOCX, or TXT files are supported.'); return }
    if (file.size > 10 * 1024 * 1024) { setError(`File too large (${(file.size/1024/1024).toFixed(1)}MB). Max 10MB.`); return }
    setUploading(true)
    setError('')
    setFileName(file.name)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResumeText(data.text)
    } catch (err) {
      setError(err.message)
      setFileName('')
    } finally {
      setUploading(false)
    }
  }

  function handleFileInput(e) { processFile(e.target.files[0]) }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    processFile(e.dataTransfer.files[0])
  }

  async function handleAnalyze() {
    if (!resumeText.trim()) { setError('Please add your resume text or upload a file.'); return }
    if (!jobPosting.trim()) { setError('Please paste the job posting.'); return }
    setError('')
    setLoading(true)
    setResults(null)
    setActiveCard(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobPosting }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResults(data)
      setActiveCard('coverLetter')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard(text, key) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">

      {/* Animated background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-cyan-500 rounded-full opacity-15 blur-3xl animate-pulse" style={{animationDelay:'1s'}} />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-600 rounded-full opacity-15 blur-3xl animate-pulse" style={{animationDelay:'2s'}} />
      </div>

      {/* Header */}
      <header className="relative py-14 px-4 text-center">
        <div className="inline-block mb-4 px-4 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-widest uppercase text-violet-300">
          AI-Powered Career Coach
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
          Job Coach AI
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto">
          Upload your resume. Paste the job.{' '}
          <span className="text-white font-semibold">Land the interview.</span>
        </p>
        <div className="mt-6 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500" />
      </header>

      <div className="max-w-5xl mx-auto px-4 pb-20">

        {/* Input Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">

          {/* Resume Card */}
          <div className="relative group rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm hover:border-violet-500/50 transition-all duration-300">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Your Resume</span>
            </h2>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center mb-4 transition-all duration-200 ${
                dragOver
                  ? 'border-violet-400 bg-violet-500/10'
                  : 'border-white/20 hover:border-violet-400/60 hover:bg-white/5'
              }`}
            >
              <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFileInput} className="hidden" />
              <div className="text-3xl mb-2">{uploading ? '⏳' : '📂'}</div>
              {uploading ? (
                <p className="text-violet-300 text-sm font-medium animate-pulse">Reading file...</p>
              ) : fileName ? (
                <p className="text-emerald-400 text-sm font-medium truncate">✓ {fileName}</p>
              ) : (
                <>
                  <p className="text-white/70 text-sm font-medium">Drop file here or click to upload</p>
                  <p className="text-white/30 text-xs mt-1">PDF · DOCX · TXT · Max 10MB</p>
                </>
              )}
            </div>

            <p className="text-white/30 text-xs mb-2 text-center">— or paste below —</p>
            <textarea
              value={resumeText}
              onChange={handleResumeChange}
              placeholder="Paste your resume text here..."
              className="w-full h-40 bg-black/30 text-gray-200 rounded-xl p-3 text-sm resize-none border border-white/10 focus:outline-none focus:border-violet-500 transition placeholder-white/20"
            />
            <p className="text-right text-xs text-white/20 mt-1">{resumeText.length.toLocaleString()} / {MAX_PASTE_CHARS.toLocaleString()}</p>
          </div>

          {/* Job Posting Card */}
          <div className="relative group rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">💼</span>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Job Posting</span>
            </h2>
            <p className="text-white/30 text-xs mb-3">Paste the full job description:</p>
            <textarea
              value={jobPosting}
              onChange={handleJobChange}
              placeholder="Paste the job posting here..."
              className="w-full h-56 bg-black/30 text-gray-200 rounded-xl p-3 text-sm resize-none border border-white/10 focus:outline-none focus:border-cyan-500 transition placeholder-white/20"
            />
            <p className="text-right text-xs text-white/20 mt-1">{jobPosting.length.toLocaleString()} / 6,000</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl px-5 py-4 mb-6 text-sm">
            <span className="text-xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Analyze Button */}
        <div className="text-center mb-12">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="relative group inline-flex items-center gap-3 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-500 hover:via-purple-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xl px-14 py-5 rounded-2xl transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 active:scale-95"
          >
            <span className="text-2xl">{loading ? '✨' : '🚀'}</span>
            {loading ? 'Analyzing...' : 'Analyze Now'}
          </button>
          {loading && (
            <div className="mt-5">
              <div className="flex justify-center gap-2 mb-3">
                {[0,1,2,3,4].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{animationDelay:`${i*0.12}s`}} />
                ))}
              </div>
              <p className="text-white/40 text-sm">AI is generating all 6 results — about 20 seconds...</p>
            </div>
          )}
        </div>

        {/* Results */}
        {results && (
          <div className="animate-fadeIn">
            <h2 className="text-center text-2xl font-black mb-6 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Your Results are Ready
            </h2>

            {/* Card Tabs */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
              {CARDS.map((card) => (
                <button
                  key={card.key}
                  onClick={() => setActiveCard(card.key)}
                  className={`rounded-2xl p-3 text-center text-xs font-bold transition-all duration-200 border hover:scale-105 active:scale-95 ${
                    activeCard === card.key
                      ? `bg-gradient-to-b ${card.grad} border-white/20 shadow-lg ring-2 ${card.ring} ring-offset-2 ring-offset-[#0a0a0f] scale-105`
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="text-2xl mb-1">{card.icon}</div>
                  <div className="leading-tight">{card.title}</div>
                </button>
              ))}
            </div>

            {/* Active Card Content */}
            {activeCard && results[activeCard] && (
              <div className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-5">
                  <h3 className={`text-xl font-black bg-gradient-to-r ${CARDS.find(c=>c.key===activeCard)?.grad} bg-clip-text text-transparent`}>
                    {CARDS.find(c=>c.key===activeCard)?.icon}{' '}
                    {CARDS.find(c=>c.key===activeCard)?.title}
                  </h3>
                  <button
                    onClick={() => copyToClipboard(results[activeCard], activeCard)}
                    className={`flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-xl transition-all duration-200 ${
                      copied === activeCard
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/10 hover:bg-white/20 border border-white/10'
                    }`}
                  >
                    {copied === activeCard ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>
                <div className="bg-black/40 rounded-2xl p-5 text-gray-200 text-sm whitespace-pre-wrap leading-relaxed max-h-[520px] overflow-y-auto border border-white/5">
                  {results[activeCard]}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-white/20 text-sm py-10 border-t border-white/5">
        Built with love by <span className="text-violet-400 font-semibold">Shahzad</span> · Job Coach AI · Powered by Google Gemini
      </footer>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease both; }
      `}</style>
    </main>
  )
}
