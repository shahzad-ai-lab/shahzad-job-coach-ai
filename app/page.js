'use client'

import { useState } from 'react'

const CARDS = [
  { key: 'coverLetter', title: 'Cover Letter', icon: '✉️', color: 'from-blue-600 to-blue-800' },
  { key: 'resumeRewrite', title: 'Resume Rewrite', icon: '📄', color: 'from-purple-600 to-purple-800' },
  { key: 'skillsGap', title: 'Skills Gap Analysis', icon: '🎯', color: 'from-orange-600 to-orange-800' },
  { key: 'interviewPrep', title: 'Interview Prep', icon: '🎤', color: 'from-green-600 to-green-800' },
  { key: 'starStories', title: 'STAR Stories', icon: '⭐', color: 'from-yellow-600 to-yellow-800' },
  { key: 'linkedinSummary', title: 'LinkedIn Summary', icon: '💼', color: 'from-cyan-600 to-cyan-800' },
]

export default function Home() {
  const [resumeText, setResumeText] = useState('')
  const [jobPosting, setJobPosting] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [activeCard, setActiveCard] = useState(null)
  const [copied, setCopied] = useState('')

  async function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResumeText(data.text)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
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
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-10 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Job Coach AI</h1>
        <p className="text-gray-300 text-lg">Upload your resume. Paste the job. Land the interview.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Inputs */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Resume */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Your Resume</h2>
            <label className="block mb-3 cursor-pointer">
              <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                {uploading ? 'Uploading...' : 'Upload File (PDF / DOCX / TXT)'}
              </span>
              <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" disabled={uploading} />
            </label>
            <p className="text-gray-500 text-sm mb-2">or paste below:</p>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              className="w-full h-48 bg-gray-800 text-gray-100 rounded-xl p-3 text-sm resize-none border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Job Posting */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Job Posting</h2>
            <p className="text-gray-500 text-sm mb-2">Paste the full job description:</p>
            <textarea
              value={jobPosting}
              onChange={(e) => setJobPosting(e.target.value)}
              placeholder="Paste the job posting here..."
              className="w-full h-56 bg-gray-800 text-gray-100 rounded-xl p-3 text-sm resize-none border border-gray-700 focus:outline-none focus:border-blue-500 mt-8"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 rounded-xl px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Analyze Button */}
        <div className="text-center mb-10">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold text-lg px-12 py-4 rounded-2xl transition shadow-lg"
          >
            {loading ? 'Analyzing with AI...' : 'Analyze Now'}
          </button>
          {loading && <p className="text-gray-400 text-sm mt-3">Generating all 6 results — this takes about 15 seconds...</p>}
        </div>

        {/* Results */}
        {results && (
          <div>
            {/* Card Tabs */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
              {CARDS.map((card) => (
                <button
                  key={card.key}
                  onClick={() => setActiveCard(card.key)}
                  className={`rounded-xl p-3 text-center text-xs font-medium transition border ${
                    activeCard === card.key
                      ? 'bg-gradient-to-b ' + card.color + ' border-white/20 shadow-lg scale-105'
                      : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-1">{card.icon}</div>
                  <div>{card.title}</div>
                </button>
              ))}
            </div>

            {/* Active Card Content */}
            {activeCard && results[activeCard] && (
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">
                    {CARDS.find(c => c.key === activeCard)?.icon}{' '}
                    {CARDS.find(c => c.key === activeCard)?.title}
                  </h3>
                  <button
                    onClick={() => copyToClipboard(results[activeCard], activeCard)}
                    className="bg-gray-700 hover:bg-gray-600 text-sm px-4 py-2 rounded-lg transition"
                  >
                    {copied === activeCard ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 text-gray-200 text-sm whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                  {results[activeCard]}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-gray-600 text-sm py-8">
        Built by Shahzad — Job Coach AI — Powered by Google Gemini
      </div>
    </main>
  )
}
