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

  const prompt = `You are a brutally honest career coach and senior ATS specialist. This is a REALITY CHECK tool — no false hope, no sugarcoating. Be strict. Candidates deserve truth, not comfort.

RULES: Return ONLY raw JSON. No markdown. No code fences. Use \\n for newlines inside strings. No asterisks (*) — use • for bullets. Be specific, not generic.

${masterGuide ? `CAREER KNOWLEDGE BASE (use this for certifications, salary, visa data):\n${masterGuide}\n---` : ''}

RESUME:
${resumeText}

JOB POSTING:
${jobPosting}

Return JSON with EXACTLY these keys. Every field must be detailed, honest, and specific to THIS resume and THIS job:

{
"resumeScore": "ATS SCORE: XX/100\\n\\nBe strict — most resumes score 40-75. Only award 90+ if it is genuinely exceptional.\\n\\nKEYWORDS FOUND:\\n• [list actual keywords from job found in resume]\\n\\nKEYWORDS MISSING:\\n• [list actual keywords from job NOT in resume]\\n\\nSCORES (be strict, 10=perfect):\\nHard Skills Match: X/10\\nSoft Skills Match: X/10\\nExperience Level Match: X/10\\nEducation Match: X/10\\nATS Formatting: X/10\\n\\nHONEST SUMMARY:\\n[2-3 sentences — state REAL strengths AND real gaps. Do not inflate.]",

"recruiterPov": "RECRUITER VERDICT: [STRONG PASS / PASS / BORDERLINE / REJECT — be honest]\\n\\nWhy a recruiter would pass or reject in 6 seconds:\\n\\nRED FLAG 1: [Specific issue]\\nFix immediately: [Exact action]\\n\\nRED FLAG 2: [Specific issue]\\nFix immediately: [Exact action]\\n\\nRED FLAG 3: [Specific issue]\\nFix immediately: [Exact action]\\n\\nWHAT WORKS WELL:\\n• [Genuine strengths]\\n\\nQUICK WINS (do today before applying):\\n• ...\\n• ...\\n• ...",

"coverLetter": "3-paragraph cover letter body (no date/header). Paragraph 1: specific hook naming the company and role. Paragraph 2: 2-3 quantified achievements matching exact job requirements. Paragraph 3: confident call to action.",

"resumeRewrite": "# REWRITTEN RESUME\\n\\n## PROFESSIONAL SUMMARY\\n[2-3 lines targeting this exact role with top 3 matching skills]\\n\\n## CORE SKILLS\\n[List technical skills matching the job — 2 columns format]\\n\\n## EXPERIENCE\\n[Rewrite each role with strong action verbs and metrics matching this job's keywords]\\n\\n## EDUCATION & CERTIFICATIONS\\n[List with years]",

"skillsGap": "# SKILLS GAP ANALYSIS\\n\\n## HARD SKILLS — MATCHED\\n• [Each technical skill candidate HAS that matches job]\\n\\n## HARD SKILLS — MISSING (Priority Gaps)\\n• [Each technical skill job requires that candidate LACKS — be thorough]\\n\\n## SOFT SKILLS — MATCHED\\n• [Leadership, communication etc. evidenced in resume]\\n\\n## SOFT SKILLS — MISSING\\n• [Soft skills job requires not evidenced]\\n\\n## UPSKILLING ROADMAP\\n1. [Most critical gap] — Course: [specific course name] — URL: [real URL e.g. coursera.org, udemy.com, linkedin.com/learning]\\n2. [Second gap] — Certification: [name] — URL: [real URL]\\n3. [Third gap] — Resource: [name] — URL: [real URL]\\n\\n## CERTIFICATIONS TO PURSUE\\n• [Cert name relevant to this role] — Provider: [name] — Cost: [~$X] — URL: [official URL]\\n• [Second cert] — Provider: [name] — URL: [official URL]\\n• [Third cert] — Provider: [name] — URL: [official URL]",

"interviewPrep": "## LIKELY INTERVIEW QUESTIONS\\n\\nQ1: [Role-specific technical question]\\nStrategy: [How to answer — be specific]\\nSample answer opening: [First 2 sentences]\\n\\nQ2: [Behavioral question based on job requirements]\\nStrategy: [STAR method tip]\\n\\nQ3: [Technical deep-dive question]\\nStrategy: [What they want to hear]\\n\\nQ4: [Culture/situational question]\\nStrategy: [Key points to make]\\n\\nQ5: [Hardest question — about a gap or weakness]\\nStrategy: [How to handle honestly]\\n\\n## QUESTIONS TO ASK THE INTERVIEWER\\n• [Smart question 1]\\n• [Smart question 2]\\n• [Smart question 3]",

"starStories": "## STAR BEHAVIORAL STORIES\\n\\n## STORY 1 — [Title matching a key job requirement]\\nSituation: [Context — 1 sentence]\\nTask: [What you needed to accomplish]\\nAction: [3-4 specific steps you took]\\nResult: [Quantified outcome — numbers matter]\\n\\n## STORY 2 — [Title]\\nSituation: ...\\nTask: ...\\nAction: ...\\nResult: ...\\n\\n## STORY 3 — [Title]\\nSituation: ...\\nTask: ...\\nAction: ...\\nResult: ...",

"linkedinSummary": "First-person LinkedIn About section (3-4 sentences). Opens with a bold hook. Names top 3 technical skills. States impact delivered. Ends with what you are seeking. Optimized for this role's keywords.",

"introScripts": "## INTRODUCTION SCRIPTS\\n\\n## 1-MINUTE (Phone Screen)\\n[Full natural-sounding script]\\n\\n## 2-MINUTE (Hiring Manager)\\n[Full script — adds 1-2 specific achievements]\\n\\n## 3-MINUTE (Technical Round)\\n[Full script — adds specific tech stack, project example, and what you want to contribute]",

"matchingJobs": "## FULL-TIME ROLES TO TARGET\\n\\n1. [Exact job title] — [Industry/Company type]\\nWhy you match: [specific reason]\\nWhere to apply: [LinkedIn / Indeed / company careers]\\nKeywords to add to resume: [keywords]\\n\\n2. [Job title] — [Industry]\\nWhy: [reason]\\nWhere: [platform]\\n\\n3. [Job title]\\nWhy: [reason]\\nWhere: [platform]\\n\\n## FREELANCE / CONTRACT / FRACTIONAL OPPORTUNITIES\\n\\n• Upwork (upwork.com) — Best for: [relevant category for this profile]\\n• Toptal (toptal.com) — Best for: top 3% engineers/finance/design — [relevant or not for this candidate]\\n• Flexiple (flexiple.com) — Best for: tech contractors\\n• Gun.io (gun.io) — Best for: software engineers\\n• Contra (contra.com) — Best for: independent professionals\\n• LinkedIn Services (linkedin.com/services) — Best for: consulting/advisory\\n• [1-2 industry-specific platforms relevant to this candidate]\\n\\nFREELANCE STRATEGY: [2 sentences on how this specific candidate can position themselves for contract work]",

"thankYouEmail": "SUBJECT: Thank you — [Role] Interview\\n\\nDear [Name],\\n\\n[Para 1: Thank them and reference ONE specific thing discussed in the interview]\\n\\n[Para 2: Reinforce your top 2 most relevant qualifications for this exact role]\\n\\n[Para 3: Restate enthusiasm and confirm you are ready for next steps]\\n\\nBest regards,\\n[Your Name]",

"salaryNegotiation": "## SALARY STRATEGY\\n\\nMARKET RANGE FOR THIS ROLE:\\nEntry level: $XX,000 | Mid: $XX,000 | Senior: $XX,000 | Your target: $XX,000\\n[Use location and industry data — be specific]\\n\\nOPENING STATEMENT (when asked):\\n[Exact script to say]\\n\\nCOUNTEROFFER SCRIPT (when offer is low):\\n[Exact script to say]\\n\\nBENEFITS TO NEGOTIATE IF SALARY IS FIXED:\\n• [Benefit 1 — e.g. extra vacation]\\n• [Benefit 2 — e.g. remote days]\\n• [Benefit 3 — e.g. learning budget]\\n\\nNEVER SAY:\\n• [Mistake 1]\\n• [Mistake 2]\\n• [Mistake 3]",

"actionPlan": "## 30-60-90 DAY ONBOARDING PLAN\\n\\n## FIRST WEEK CHECKLIST\\n• [Day 1 action]\\n• [Day 2-3 action]\\n• [Day 4-5 action]\\n\\n## 30-DAY GOALS (Learn)\\n• Week 1: [specific]\\n• Week 2: [specific]\\n• Week 3: [specific]\\n• Week 4: [specific — first deliverable]\\n\\n## 60-DAY GOALS (Contribute)\\n• [Specific contribution 1]\\n• [Specific contribution 2]\\n• [First win to demonstrate value]\\n\\n## 90-DAY GOALS (Lead/Own)\\n• [Measurable outcome 1]\\n• [Measurable outcome 2]\\n• [How you prove yourself in this role]",

"visaPathways": "## VISA AND IMMIGRATION OPTIONS\\n\\n## OPTION 1: [Most relevant visa — e.g. H-1B / Express Entry / Skilled Worker Visa]\\nEligibility: [requirements]\\nProcess: [key steps]\\nTimeline: [realistic estimate]\\nOfficial link: [real government URL]\\n\\n## OPTION 2: [Second option]\\nEligibility: [requirements]\\nTimeline: [estimate]\\nOfficial link: [URL]\\n\\n## OPTION 3: REMOTE / DIGITAL NOMAD\\nBest countries for this profile: [list 3 with visa names]\\nRequirements: [brief]\\n\\n## KEY ADVICE\\n[2-3 honest sentences on best path for this specific candidate's situation]"
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
