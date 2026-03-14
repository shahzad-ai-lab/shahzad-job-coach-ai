export const maxDuration = 60

const MAX_RESUME = 6000
const MAX_JOB = 3000
const MAX_BODY_BYTES = 50000
const HOURLY_LIMIT = 5
const HOUR_MS = 60 * 60 * 1000
// Progressive backoff: 1st violation = 1h, 2nd = 3h, 3rd+ = 6h
const BACKOFF_HOURS = [1, 3, 6]

// In-memory rate limit store (best-effort on Vercel serverless free tier)
// Entry: { count, windowReset, violations, blockUntil }
const ipStore = new Map()

function getRateLimitEntry(ip) {
  const now = Date.now()
  let entry = ipStore.get(ip)
  if (!entry) {
    entry = { count: 0, windowReset: now + HOUR_MS, violations: 0, blockUntil: 0 }
  } else if (now > entry.windowReset) {
    // New hourly window — reset count but keep violation history
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
  // Strip HTML tags
  let s = text.replace(/<[^>]*>/g, '')
  // Strip null bytes and non-printable control chars (keep newlines/tabs)
  s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  // Neutralize common prompt injection patterns
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
const API_VERSION = 'v1beta'

async function callGemini(prompt, apiKey) {
  const errors = []
  for (const { name, timeout } of MODELS) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)
    try {
      const url = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${name}:generateContent?key=${apiKey}`
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
        console.warn(`${name} failed: ${msg.slice(0, 80)}`)
      }
    } catch (err) {
      clearTimeout(timer)
      const msg = err.name === 'AbortError' ? 'timed out' : (err.message?.slice(0, 60) || 'error')
      errors.push(`${name}: ${msg}`)
      console.warn(`${name} exception: ${msg}`)
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

  // ── Rate Limiting ─────────────────────────────────────────────
  const forwarded = request.headers.get('x-forwarded-for') || ''
  const ip = forwarded.split(',')[0].trim() || 'unknown'
  const rateEntry = getRateLimitEntry(ip)
  const now = Date.now()

  // Check if IP is currently in a backoff block
  if (rateEntry.blockUntil > now) {
    const blockMins = Math.ceil((rateEntry.blockUntil - now) / 60000)
    const blockHours = blockMins >= 60 ? Math.ceil(blockMins / 60) : null
    const timeStr = blockHours ? `${blockHours} hour${blockHours !== 1 ? 's' : ''}` : `${blockMins} minute${blockMins !== 1 ? 's' : ''}`
    return Response.json(
      {
        error: 'rate_limited',
        message: `Slow down! Too many requests. Please come back in ${timeStr}. This keeps the service free for everyone.`,
        blockUntil: new Date(rateEntry.blockUntil).toISOString(),
        violations: rateEntry.violations,
      },
      { status: 429, headers: h }
    )
  }

  // Check if hourly limit exceeded — apply progressive backoff
  if (rateEntry.count >= HOURLY_LIMIT) {
    const backoffHours = BACKOFF_HOURS[Math.min(rateEntry.violations, BACKOFF_HOURS.length - 1)]
    rateEntry.violations += 1
    rateEntry.blockUntil = now + backoffHours * HOUR_MS
    ipStore.set(ip, rateEntry)
    return Response.json(
      {
        error: 'rate_limited',
        message: `You have made ${HOURLY_LIMIT} requests this hour. Please come back in ${backoffHours} hour${backoffHours !== 1 ? 's' : ''}. This keeps the service free for everyone.`,
        blockUntil: new Date(rateEntry.blockUntil).toISOString(),
        violations: rateEntry.violations,
      },
      { status: 429, headers: h }
    )
  }

  // ── Request Size Guard ────────────────────────────────────────
  const contentLength = parseInt(request.headers.get('content-length') || '0', 10)
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json({ error: 'Request too large.' }, { status: 413, headers: h })
  }

  // ── Parse & Sanitize Input ────────────────────────────────────
  let resumeText, jobPosting
  try {
    const body = await request.json()
    resumeText = truncate(sanitize(body.resumeText || ''), MAX_RESUME)
    jobPosting = truncate(sanitize(body.jobPosting || ''), MAX_JOB)
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400, headers: h })
  }

  if (!resumeText) return Response.json({ error: 'Resume text is required.' }, { status: 400, headers: h })
  if (!jobPosting) return Response.json({ error: 'Job description is required.' }, { status: 400, headers: h })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return Response.json({ error: 'API key not configured on server.' }, { status: 500, headers: h })

  // Increment rate count BEFORE the expensive call
  rateEntry.count += 1
  ipStore.set(ip, rateEntry)

  const prompt = `You are an expert career coach and ATS specialist. Analyze the resume and job posting. Return ONLY raw JSON with exactly these 12 keys. No markdown, no code blocks.

RESUME:
${resumeText}

JOB POSTING:
${jobPosting}

Return this JSON (fill every field with real detailed content):
{"coverLetter":"3-paragraph cover letter body, no date/subject, confident and specific tone","resumeRewrite":"full rewritten resume optimized for this job with strong action verbs and matched keywords","skillsGap":"HARD SKILLS MATCH:\\n- list matched hard skills\\n\\nHARD SKILLS MISSING:\\n- list missing hard skills\\n\\nSOFT SKILLS MATCH:\\n- list matched soft skills\\n\\nSOFT SKILLS MISSING:\\n- list missing soft skills\\n\\nTOP 3 ACTIONS:\\n1. ...\\n2. ...\\n3. ...","interviewPrep":"Q1: ...\\nStrategy: ...\\n\\nQ2: ...\\nStrategy: ...\\n\\nQ3: ...\\nStrategy: ...\\n\\nQ4: ...\\nStrategy: ...\\n\\nQ5: ...\\nStrategy: ...","starStories":"STORY 1:\\nS: ...\\nT: ...\\nA: ...\\nR: ...\\n\\nSTORY 2:\\nS: ...\\nT: ...\\nA: ...\\nR: ...\\n\\nSTORY 3:\\nS: ...\\nT: ...\\nA: ...\\nR: ...","linkedinSummary":"3-4 sentence first-person LinkedIn About section targeting this role","resumeScore":"ATS SCORE: XX/100\\n\\nKEYWORDS FOUND:\\n- keyword1\\n- keyword2\\n\\nKEYWORDS MISSING:\\n- keyword1\\n- keyword2\\n\\nHARD SKILLS SCORE: X/10\\nSOFT SKILLS SCORE: X/10\\nEXPERIENCE MATCH: X/10\\nEDUCATION MATCH: X/10\\n\\nSUMMARY: 2-3 sentences on strengths and gaps.","introScripts":"1-MINUTE INTRO (HR Screen):\\n[full script]\\n\\n2-MINUTE INTRO (Hiring Manager):\\n[full script]\\n\\n3-MINUTE INTRO (Technical Round):\\n[full script including tech stack and project example]","matchingJobs":"RECOMMENDED JOBS TO APPLY FOR:\\n\\n1. [Job Title] at [Company Type]\\nWhy: [reason]\\nAdd keywords: [keywords]\\n\\n2. [Job Title] at [Company Type]\\nWhy: [reason]\\nAdd keywords: [keywords]\\n\\n3. [Job Title] at [Company Type]\\nWhy: [reason]\\nAdd keywords: [keywords]\\n\\n4. [Job Title] at [Company Type]\\nWhy: [reason]\\nAdd keywords: [keywords]\\n\\n5. [Job Title] at [Company Type]\\nWhy: [reason]\\nAdd keywords: [keywords]","thankYouEmail":"SUBJECT: Thank you – [Role] Interview\\n\\nDear [Hiring Manager Name],\\n\\n[Paragraph 1: Thank them, reference something specific from the interview]\\n\\n[Paragraph 2: Reinforce your top 2 qualifications for the role]\\n\\n[Paragraph 3: Express enthusiasm and next steps]\\n\\nBest regards,\\n[Your Name]","salaryNegotiation":"SALARY RESEARCH:\\nExpected range for this role: $XX,000 – $XX,000\\n\\nOPENING STATEMENT:\\n[Script to use when they ask your salary expectations]\\n\\nCOUNTEROFFER SCRIPT:\\n[Script when they give you an offer below your target]\\n\\nBENEFITS TO NEGOTIATE:\\n- [benefit 1]\\n- [benefit 2]\\n- [benefit 3]\\n\\nNEVER SAY:\\n- [mistake 1]\\n- [mistake 2]","actionPlan":"30-DAY PLAN (Learn & Listen):\\n- Week 1: [actions]\\n- Week 2: [actions]\\n- Week 3: [actions]\\n- Week 4: [actions]\\n\\n60-DAY PLAN (Contribute):\\n- [key contributions and goals]\\n\\n90-DAY PLAN (Lead):\\n- [leadership actions and measurable outcomes]\\n\\nFIRST DAY CHECKLIST:\\n- [item 1]\\n- [item 2]\\n- [item 3]\\n- [item 4]\\n- [item 5]"}`

  let raw
  try {
    raw = await callGemini(prompt, apiKey)
  } catch (err) {
    // Refund the rate count on server/AI error — not the user's fault
    rateEntry.count = Math.max(0, rateEntry.count - 1)
    ipStore.set(ip, rateEntry)
    console.error('callGemini error:', err.message)
    return Response.json({ error: err.message }, { status: 503, headers: h })
  }

  const parsed = extractJSON(raw)
  if (!parsed) {
    // Refund count on parse failure too
    rateEntry.count = Math.max(0, rateEntry.count - 1)
    ipStore.set(ip, rateEntry)
    console.error('JSON parse failed. Raw:', raw?.slice(0, 300))
    return Response.json({ error: 'AI returned unexpected format. Please try again.' }, { status: 500, headers: h })
  }

  const keys = ['coverLetter','resumeRewrite','skillsGap','interviewPrep','starStories','linkedinSummary','resumeScore','introScripts','matchingJobs','thankYouEmail','salaryNegotiation','actionPlan']
  for (const key of keys) {
    if (!parsed[key] || typeof parsed[key] !== 'string') {
      parsed[key] = 'Not generated. Please try again.'
    }
  }

  const remaining = Math.max(0, HOURLY_LIMIT - rateEntry.count)
  return Response.json(
    { ...parsed, _meta: { remaining, windowReset: new Date(rateEntry.windowReset).toISOString() } },
    { headers: h }
  )
}
