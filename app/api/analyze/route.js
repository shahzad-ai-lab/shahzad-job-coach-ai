import fs from 'fs'
import path from 'path'

export const maxDuration = 60

const MAX_RESUME = 6000
const MAX_JOB = 3000
const MAX_BODY_BYTES = 50000
const HOURLY_LIMIT = 5
const HOUR_MS = 60 * 60 * 1000
const BACKOFF_HOURS = [1, 3, 6]

const ipStore = new Map()

function getRateLimitEntry(ip) {
  const now = Date.now()
  let entry = ipStore.get(ip)
  if (!entry) {
    entry = { count: 0, windowReset: now + HOUR_MS, violations: 0, blockUntil: 0 }
  } else if (now > entry.windowReset) {
    entry.count = 0
    entry.windowReset = now + HOUR_MS
  }
  ipStore.set(ip, entry)
  return entry
}

function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cache-Control': 'no-store',
  }
}

function sanitize(text) {
  if (typeof text !== 'string') return ''
  let s = text.replace(/<[^>]*>/g, '')
  s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  const injectionPatterns = [
    /ignore\s+previous\s+instructions/gi,
    /system\s*:/gi,
    /\[INST\]/gi,
    /\[\/INST\]/gi,
    /<\|im_start\|>/gi,
    /###\s*instruction/gi,
    /you\s+are\s+now\s+a\s+/gi,
  ]
  for (const pattern of injectionPatterns) {
    s = s.replace(pattern, '[removed]')
  }
  return s.trim()
}

function truncate(text, max) {
  return text.length > max ? text.slice(0, max) : text
}

const MODELS = [
  { name: 'gemini-flash-latest',      timeout: 55000 },
  { name: 'gemini-flash-lite-latest', timeout: 55000 },
]

async function callGemini(prompt, apiKey) {
  const errors = []
  for (const { name, timeout } of MODELS) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${name}:generateContent?key=${apiKey}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          tools: [{ googleSearch: {} }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
        }),
      })
      clearTimeout(timer)
      const data = await res.json()
      if (res.ok) {
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) { console.log(`Success: ${name}`); return text }
        errors.push(`${name}: empty response`)
      } else {
        const msg = data?.error?.message || `HTTP ${res.status}`
        errors.push(`${name}: ${msg.slice(0, 80)}`)
      }
    } catch (err) {
      clearTimeout(timer)
      const msg = err.name === 'AbortError' ? 'timed out' : (err.message?.slice(0, 60) || 'error')
      errors.push(`${name}: ${msg}`)
    }
  }
  throw new Error(`All models failed: ${errors.join(' | ')}`)
}

function extractJSON(raw) {
  let cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()
  try { return JSON.parse(cleaned) } catch {}
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (match) { try { return JSON.parse(match[0]) } catch {} }
  return null
}

export async function POST(request) {
  const h = securityHeaders()

  const forwarded = request.headers.get('x-forwarded-for') || ''
  const ip = forwarded.split(',')[0].trim() || 'unknown'
  const rateEntry = getRateLimitEntry(ip)
  const now = Date.now()

  if (rateEntry.blockUntil > now) {
    const blockMins = Math.ceil((rateEntry.blockUntil - now) / 60000)
    return Response.json({ error: 'rate_limited', message: `Slow down! Come back in ${blockMins} minutes.` }, { status: 429, headers: h })
  }

  if (rateEntry.count >= HOURLY_LIMIT) {
    const backoffHours = BACKOFF_HOURS[Math.min(rateEntry.violations, BACKOFF_HOURS.length - 1)]
    rateEntry.violations += 1
    rateEntry.blockUntil = now + backoffHours * HOUR_MS
    ipStore.set(ip, rateEntry)
    return Response.json({ error: 'rate_limited', message: `Hourly limit reached. Come back in ${backoffHours} hours.` }, { status: 429, headers: h })
  }

  const contentLength = parseInt(request.headers.get('content-length') || '0', 10)
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json({ error: 'Request too large.' }, { status: 413, headers: h })
  }

  let resumeText, jobPosting, deepDiveGoal, requestedKeys
  try {
    const body = await request.json()
    resumeText = truncate(sanitize(body.resumeText || ''), MAX_RESUME)
    jobPosting = truncate(sanitize(body.jobPosting || ''), MAX_JOB)
    deepDiveGoal = truncate(sanitize(body.deepDiveGoal || ''), 1000)
    requestedKeys = Array.isArray(body.requestedKeys) && body.requestedKeys.length > 0 ? body.requestedKeys : null
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400, headers: h })
  }

  if (!resumeText || !jobPosting) return Response.json({ error: 'Resume and Job descriptions are required.' }, { status: 400, headers: h })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return Response.json({ error: 'API key not configured.' }, { status: 500, headers: h })

  // ── Lightweight Semantic Router (RAG) ───────────────────────────
  let masterGuide = ''
  try {
    const p = path.join(process.cwd(), 'MASTER_CAREER_REFERENCE.md')
    if (fs.existsSync(p)) {
      const fullText = fs.readFileSync(p, 'utf-8')
      const sections = fullText.split(/(?=^## )/m)
      
      let relevantSections = [sections[0]] 
      const combinedInput = (resumeText + ' ' + jobPosting + ' ' + deepDiveGoal + ' ' + (requestedKeys || []).join(' ')).toLowerCase()
      
      const triggers = [
        { k: ['visa', 'immigrat', 'relocat', 'move', 'country', 'sponsor', 'visapathways'], match: 'VISA' },
        { k: ['future', 'trend', 'ai ', 'automation', '203'], match: 'FUTURE' },
        { k: ['student', 'kid', 'child', 'teen', 'senior', 'widow', 'orphan', 'no skill', 'zero skill'], match: 'INCLUSIVITY' },
        { k: ['software', 'code', 'develop', 'engineer', 'tech', 'data'], match: 'TECHNOLOGY' },
        { k: ['nurse', 'doctor', 'medic', 'health', 'clinic'], match: 'HEALTHCARE' },
        { k: ['finance', 'bank', 'account', 'tax', 'audit'], match: 'FINANCE' },
      ]

      const activeTriggers = new Set()
      for (const t of triggers) {
        if (t.k.some(keyword => combinedInput.includes(keyword))) activeTriggers.add(t.match)
      }

      for (let i = 1; i < sections.length; i++) {
        const sec = sections[i]
        const header = sec.split('\n')[0].toUpperCase()
        let shouldInclude = false
        if (activeTriggers.has('VISA') && header.includes('VISA')) shouldInclude = true
        if (activeTriggers.has('FUTURE') && header.includes('FUTURE')) shouldInclude = true
        if (activeTriggers.has('INCLUSIVITY') && header.includes('INCLUSIVITY')) shouldInclude = true
        if (activeTriggers.has('TECHNOLOGY') && (header.includes('TECHNOLOGY') || header.includes('SOFTWARE'))) shouldInclude = true
        if (activeTriggers.has('HEALTHCARE') && header.includes('HEALTHCARE')) shouldInclude = true
        if (activeTriggers.has('FINANCE') && header.includes('FINANCE')) shouldInclude = true
        if (shouldInclude) relevantSections.push(sec)
      }

      masterGuide = relevantSections.join('\n').slice(0, 45000)
    }
  } catch (e) {
    console.warn("Could not read MASTER_CAREER_REFERENCE.md", e)
  }

  rateEntry.count += 1
  ipStore.set(ip, rateEntry)

  const ALL_PROMPT_SECTIONS = {
    resumeScore: "### resumeScore\n[Content: ATS SCORE /100, keywords found/missing, summary]",
    coverLetter: "### coverLetter\n[Content: 3-paragraph tailored cover letter]",
    resumeRewrite: "### resumeRewrite\n[Content: Full rewritten resume]",
    skillsGap: "### skillsGap\n[Content: Hard/soft skills matching and top 3 actions]",
    interviewPrep: "### interviewPrep\n[Content: 5 expected questions and strategies]",
    starStories: "### starStories\n[Content: 3 tailored STAR behavioral stories]",
    linkedinSummary: "### linkedinSummary\n[Content: Tailored LinkedIn About section]",
    introScripts: "### introScripts\n[Content: 1-min, 2-min, 3-min introduction scripts]",
    matchingJobs: "### matchingJobs\n[Content: 5 similar roles to consider]",
    thankYouEmail: "### thankYouEmail\n[Content: Post-interview email template]",
    salaryNegotiation: "### salaryNegotiation\n[Content: Market salary research (search if needed), scripts, what to avoid]",
    actionPlan: "### actionPlan\n[Content: 30-60-90 day onboarding plan]",
    visaPathways: "Analyze the candidate's likely location vs target job. Provide 3 specific Visa/Immigration pathways or remote work digital nomad options (e.g., H1-B, Express Entry, D8) using the Master Guide knowledge.",
    recruiterPov: "Act as a ruthless Fortune 500 tech recruiter. List the top 3 instant 'Red Flags' or rejection reasons in this resume, and exactly how the candidate must fix them immediately."
  }

  const keysToUse = requestedKeys || Object.keys(ALL_PROMPT_SECTIONS)
  const jsonFormatHint = keysToUse.map(k => `"${k}": "[${ALL_PROMPT_SECTIONS[k]}]"`).join(',\n')

  const prompt = `You are an expert career coach and ATS specialist. 
Analyze the resume and job posting carefully in the context of global best practices.
If you lack specific details about a country's market context, visas, or salaries, USE THE GOOGLE SEARCH TOOL to find live data and augment your answer.

CRITICAL USER CONTEXT (DEEP DIVE GOAL):
The user has provided this specific goal/context for you. You MUST prioritize tailoring your analysis to solve this specific goal:
"${deepDiveGoal || 'No specific deep dive goal provided. Provide standard excellent coaching.'}"

Use this proprietary career knowledge to aid your analysis:
${masterGuide}

---
RESUME:
${resumeText}

---
JOB POSTING:
${jobPosting}

---
Return ONLY raw JSON with exactly these keys: ${JSON.stringify(keysToUse)}. No markdown around the JSON. Fill every field with massive, beautifully formatted text. Use \n characters for newlines inside the JSON strings.

{
${jsonFormatHint}
}
`

  let raw
  try {
    raw = await callGemini(prompt, apiKey)
  } catch (err) {
    rateEntry.count = Math.max(0, rateEntry.count - 1)
    ipStore.set(ip, rateEntry)
    return Response.json({ error: err.message }, { status: 503, headers: h })
  }

  const parsed = extractJSON(raw)
  if (!parsed) {
    rateEntry.count = Math.max(0, rateEntry.count - 1)
    ipStore.set(ip, rateEntry)
    return Response.json({ error: 'AI returned unexpected format. Please try again.' }, { status: 500, headers: h })
  }

  for (const key of keysToUse) {
    if (!parsed[key] || typeof parsed[key] !== 'string') {
      parsed[key] = 'Not generated. Please try again or provide more clear inputs.'
    }
  }

  return Response.json(parsed, { headers: h })
}
