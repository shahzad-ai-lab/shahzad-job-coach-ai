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

  let resumeText, jobPosting, requestedKeys
  try {
    const body = await request.json()
    resumeText = truncate(sanitize(body.resumeText || ''), MAX_RESUME)
    jobPosting = truncate(sanitize(body.jobPosting || ''), MAX_JOB)
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
      const combinedInput = (resumeText + ' ' + jobPosting + ' ' + (requestedKeys || []).join(' ')).toLowerCase()
      
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

  const keysToUse = requestedKeys || ['resumeScore','coverLetter','resumeRewrite','skillsGap','interviewPrep','starStories','linkedinSummary','introScripts','matchingJobs','thankYouEmail','salaryNegotiation','actionPlan','visaPathways','recruiterPov']

  const prompt = `You are an expert career coach and ATS specialist powered by Google Gemini. Analyze the resume and job posting below. Return ONLY a raw JSON object — no markdown, no code fences, no extra text before or after.

CRITICAL: Do NOT ask clarifying questions. Provide complete final answers immediately. Use newline characters (\\n) inside JSON strings. Do NOT use asterisks (*) for bold — use plain structured text with headers and bullet points (•).

${masterGuide ? `Use this career knowledge database to inform your analysis:\n${masterGuide}\n---` : ''}

RESUME:
${resumeText}

JOB POSTING:
${jobPosting}

Return a JSON object with EXACTLY these keys filled with detailed, expert content:

{
"resumeScore": "ATS SCORE: XX/100\\n\\nKEYWORDS FOUND:\\n• keyword1\\n• keyword2\\n\\nKEYWORDS MISSING:\\n• keyword1\\n• keyword2\\n\\nSCORES:\\nHard Skills: X/10\\nSoft Skills: X/10\\nExperience Match: X/10\\nEducation Match: X/10\\n\\nSUMMARY:\\n2-3 sentences on strengths and gaps.",
"coverLetter": "3-paragraph professional cover letter body (no date/header/subject). Paragraph 1: strong hook referencing the role. Paragraph 2: 2-3 specific achievements matching the job. Paragraph 3: confident call to action.",
"resumeRewrite": "Full rewritten resume optimized for ATS and this specific job. Include: Summary, Skills, Experience with bullet points using strong action verbs, Education.",
"skillsGap": "HARD SKILLS MATCH:\\n• list each\\n\\nHARD SKILLS MISSING:\\n• list each\\n\\nSOFT SKILLS MATCH:\\n• list each\\n\\nSOFT SKILLS MISSING:\\n• list each\\n\\nTOP 3 ACTIONS:\\n1. ...\\n2. ...\\n3. ...",
"interviewPrep": "Q1: [question]\\nStrategy: [how to answer]\\n\\nQ2: [question]\\nStrategy: [how to answer]\\n\\nQ3: [question]\\nStrategy: [how to answer]\\n\\nQ4: [question]\\nStrategy: [how to answer]\\n\\nQ5: [question]\\nStrategy: [how to answer]",
"starStories": "STORY 1 — [Situation title]\\nS: [Situation]\\nT: [Task]\\nA: [Action — 2-3 steps]\\nR: [Result with metric]\\n\\nSTORY 2 — [Situation title]\\nS: ...\\nT: ...\\nA: ...\\nR: ...\\n\\nSTORY 3 — [Situation title]\\nS: ...\\nT: ...\\nA: ...\\nR: ...",
"linkedinSummary": "3-4 sentence first-person LinkedIn About section targeting this role. Opens with a hook, includes top skills, ends with value proposition.",
"introScripts": "1-MINUTE INTRO (Phone Screen):\\n[Full script]\\n\\n2-MINUTE INTRO (Hiring Manager):\\n[Full script]\\n\\n3-MINUTE INTRO (Technical Round):\\n[Full script including specific project examples and tech stack]",
"matchingJobs": "RECOMMENDED ROLES TO APPLY:\\n\\n1. [Job Title] at [Company Type]\\nWhy: [reason]\\nKeywords to add: [keywords]\\n\\n2. [Job Title] at [Company Type]\\nWhy: [reason]\\nKeywords to add: [keywords]\\n\\n3. [Job Title] at [Company Type]\\nWhy: [reason]\\n\\n4. [Job Title]\\nWhy: [reason]\\n\\n5. [Job Title]\\nWhy: [reason]",
"thankYouEmail": "SUBJECT: Thank you — [Role] Interview\\n\\nDear [Hiring Manager Name],\\n\\n[Para 1: Thank them, reference something specific discussed]\\n\\n[Para 2: Reinforce top 2 qualifications]\\n\\n[Para 3: Enthusiasm and next steps]\\n\\nBest regards,\\n[Your Name]",
"salaryNegotiation": "MARKET SALARY RANGE:\\nExpected for this role: $XX,000 – $XX,000\\n\\nOPENING STATEMENT:\\n[Script to use when asked salary expectations]\\n\\nCOUNTEROFFER SCRIPT:\\n[Script when offer is below target]\\n\\nBENEFITS TO NEGOTIATE:\\n• Benefit 1\\n• Benefit 2\\n• Benefit 3\\n\\nNEVER SAY:\\n• Mistake 1\\n• Mistake 2",
"actionPlan": "30-DAY PLAN (Learn):\\n• Week 1: ...\\n• Week 2: ...\\n• Week 3: ...\\n• Week 4: ...\\n\\n60-DAY PLAN (Contribute):\\n• ...\\n\\n90-DAY PLAN (Lead):\\n• ...\\n\\nFIRST DAY CHECKLIST:\\n• ...\\n• ...\\n• ...",
"visaPathways": "VISA AND IMMIGRATION PATHWAYS:\\n\\nOption 1: [Visa type e.g. H-1B / Express Entry / Skilled Worker]\\nEligibility: [requirements]\\nProcess: [steps]\\nTimeline: [estimate]\\n\\nOption 2: [Visa type]\\nEligibility: [requirements]\\n\\nOption 3: [Digital Nomad / Remote Work option]\\nCountries: [list]\\nRequirements: [brief]\\n\\nKEY ADVICE: [2-3 sentences on best path for this candidate]",
"recruiterPov": "RECRUITER VERDICT: [Pass / Borderline / Reject]\\n\\nRED FLAG 1: [Issue]\\nFix: [Exact action to take]\\n\\nRED FLAG 2: [Issue]\\nFix: [Exact action to take]\\n\\nRED FLAG 3: [Issue]\\nFix: [Exact action to take]\\n\\nQUICK WINS (do these today):\\n• ...\\n• ...\\n• ..."
}`

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
