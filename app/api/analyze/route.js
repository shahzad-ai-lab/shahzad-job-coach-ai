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

  let resumeText, jobPosting, requestedKeys, langInstruction = ''
  try {
    const body = await request.json()
    resumeText = truncate(sanitize(body.resumeText || ''), MAX_RESUME)
    jobPosting = truncate(sanitize(body.jobPosting || ''), MAX_JOB)
    requestedKeys = Array.isArray(body.requestedKeys) && body.requestedKeys.length > 0 ? body.requestedKeys : null
    const lang = typeof body.lang === 'string' && body.lang.length <= 5 ? body.lang : 'en'
    langInstruction = lang !== 'en' ? `\nIMPORTANT: Respond in the user's language (detected: ${lang}). Keep all JSON keys in English but write all VALUES in ${lang}.\n` : ''
    const userCountry = typeof body.userCountry === 'string' ? body.userCountry.slice(0, 60) : ''
    if (userCountry) langInstruction += `\nUSER LOCATION: ${userCountry}. For matchingJobs — show recruiters ONLY for ${userCountry} or nearest market. Do NOT list other countries.\n`
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400, headers: h })
  }

  if (!resumeText || !jobPosting) return Response.json({ error: 'Resume and Job descriptions are required.' }, { status: 400, headers: h })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return Response.json({ error: 'API key not configured.' }, { status: 500, headers: h })

  // ── Lightweight Semantic Router (RAG) ───────────────────────────
  let masterGuide = ''
  try {
    const p = path.join(process.cwd(), 'v2', 'MASTER_CAREER_REFERENCE.md')
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

  const keysToUse = requestedKeys || ['resumeScore','recruiterPov','coverLetter','resumeRewrite','skillsGap','interviewPrep','starStories','linkedinSummary','introScripts','matchingJobs','thankYouEmail','salaryNegotiation','actionPlan','visaPathways','coldOutreach','careerPivot','countryLaws']

  const prompt = `${langInstruction}You are a brutally honest career coach and senior ATS specialist. This is a REALITY CHECK tool — no false hope, no sugarcoating. Be strict. Candidates deserve truth, not comfort.

RULES: Return ONLY raw JSON. No markdown. No code fences. Use \\n for newlines inside strings. No asterisks (*) — use • for bullets. Be specific, not generic.

2026 RESUME INTELLIGENCE — APPLY TO ALL YOUR ANALYSIS:
• ATS 2026 scans EXPERIENCE PATTERNS not just keywords — align content with C-suite priorities, not keyword stuffing
• Recruiters spend exactly 6.2 seconds on first scan — evaluate ANCHOR POINTS: bolded metrics, company logos, layout hierarchy (Cognitive Hierarchy Trick)
• Interactive PDFs with portfolio/GitHub hyperlinks increase response rates by 35% — flag if missing
• IMPACT-FIRST bullets mandatory: every bullet must have quantified result (STAR method) — flag all "duty" bullets with rewrites
• Personal Branding sections ("My Values" / "A Day in My Life") trending for startup and creative roles — recommend where relevant
• Canada market leaders: Resume Target (resumetarget.com) · Careers By Design — specialize Toronto/Vancouver nuances
• USA market: ResumeSpice (built by real recruiters) — 2-day turnaround, phone consultation model
• Top providers 2026: Resumeble (ATS-optimized + LinkedIn + recruiter outreach) · TopResume (60-day interview guarantee + Job Search Concierge) · Kickresume (AI Full-Service + Career Maps) · TopStack (pay-after-delivery + C-Suite branding)
• Market trend 2026: "Career Co-pilots" — AI + human expertise combined, replacing single-document services
---

${masterGuide ? `CAREER KNOWLEDGE BASE (use this for certifications, salary, visa data):\n${masterGuide}\n---` : ''}

RESUME:
${resumeText}

JOB POSTING:
${jobPosting}

Return JSON with EXACTLY these keys. Every field must be detailed, honest, and specific to THIS resume and THIS job:

{
"resumeScore": "## ATS SCORE: XX/100\\n\\nBe strict. Most resumes score 40-75. Only award 90+ if genuinely exceptional.\\n\\n## SCORE INTERPRETATION\\n• 80-100%: Auto-shortlisted — recruiter sees your profile\\n• 60-79%: Manual review — recruiter decides in 6 seconds\\n• 50-59%: Borderline — likely filtered unless manually searched\\n• Below 50%: Auto-rejected — never seen by a human\\n\\n## KEYWORDS FOUND (in resume)\\n• [list actual keywords from job found in resume — be specific]\\n\\n## KEYWORDS MISSING (critical gaps)\\n• [list actual keywords from job NOT in resume — be thorough]\\n\\n## KNOCKOUT QUESTIONS (auto-disqualifiers — check these first)\\n• [Any work authorization / visa requirement mentioned in job?]\\n• [Any required years of experience as a hard requirement?]\\n• [Any required license or certification as a hard requirement?]\\n• [Any location/relocation requirement?]\\nVerdict: [PASSES ALL KNOCKOUTS / FAILS KNOCKOUT: state which one]\\n\\n## COMPOSITE SCORE BREAKDOWN\\nHard Skills Match (40% weight): X/10 → weighted: XX pts\\nExperience & Recency (25% weight): X/10 → weighted: XX pts\\n  - Note recency: [which key skills were used recently vs 3+ years ago]\\nSoft Skills & Leadership (15% weight): X/10 → weighted: XX pts\\nEducation & Certifications (10% weight): X/10 → weighted: XX pts\\nATS Formatting (10% weight): X/10 → weighted: XX pts\\n\\n## ACHIEVEMENT DENSITY CHECK\\nBullets with quantified results (numbers/% in resume): [X out of ~Y total bullets]\\nVerdict: [STRONG — X% of bullets have metrics / WEAK — only X bullets have numbers, add more]\\nExamples of weak bullets to fix:\\n• [paste actual weak bullet from resume]\\nRewrite: [quantified version]\\n\\n## RESUME ANATOMY CHECK (2026 ATS Standards)\\n• Length: [1 page / 2 pages / TOO LONG — X pages] → [PASS / FAIL — rule: <10yr=1pg, 10+yr=2pg]\\n• Layout: [Single column / Multi-column] → [PASS / FAIL — multi-column scrambles parsers]\\n• Graphics/Tables/Icons: [None detected / Found] → [PASS / FAIL — graphics break ATS parsing]\\n• File format recommendation: [.docx safer for ATS / .pdf safe if clean]\\n• Headings used: [standard: Summary, Experience, Skills, Education = PASS / non-standard = FAIL]\\n\\n## HONEST SUMMARY\\n[3 sentences — state the real score, the real reason it would pass or fail, and the single most important fix]",

"recruiterPov": "## RECRUITER VERDICT: [STRONG PASS / PASS / BORDERLINE / REJECT]\\n\\n## 6-SECOND FIRST IMPRESSION (what the recruiter sees before reading)\\n[Describe what jumps out in the first glance — headline, top job, layout, length. This is what determines if they keep reading.]\\n\\n## RED FLAGS (reasons to reject)\\n\\nRED FLAG 1: [Specific issue]\\nFix immediately: [Exact action]\\n\\nRED FLAG 2: [Specific issue]\\nFix immediately: [Exact action]\\n\\nRED FLAG 3: [Specific issue]\\nFix immediately: [Exact action]\\n\\n## WHAT WORKS WELL (genuine strengths)\\n• [Strength 1 — be specific, not generic]\\n• [Strength 2]\\n• [Strength 3]\\n\\n## LINKEDIN CROSS-CHECK WARNING\\n[Does the resume match what a recruiter would find on LinkedIn? Any date/title inconsistencies they should fix? Tip on LinkedIn profile alignment.]\\n\\n## QUICK WINS (do these TODAY before applying)\\n• [Win 1 — 5 minutes or less]\\n• [Win 2 — 5 minutes or less]\\n• [Win 3 — 5 minutes or less]\\n\\n## ENGAGEMENT SIGNALS THAT BOOST RANKING\\n• Respond to recruiter messages within 24 hours (boosts engagement score)\\n• Update LinkedIn profile in the last 30 days (signals active job search)\\n• Apply within 24-48 hours of posting (freshness signal — early applicants score higher)",

"coverLetter": "3-paragraph cover letter body (no date/header). Paragraph 1: specific hook naming the company and role. Paragraph 2: 2-3 quantified achievements matching exact job requirements. Paragraph 3: confident call to action.",

"resumeRewrite": "# REWRITTEN RESUME\\n\\n## PROFESSIONAL SUMMARY\\n[2-3 lines targeting this exact role with top 3 matching skills]\\n\\n## CORE SKILLS\\n[List technical skills matching the job — 2 columns format]\\n\\n## EXPERIENCE\\n[Rewrite each role with strong action verbs and metrics matching this job's keywords]\\n\\n## EDUCATION & CERTIFICATIONS\\n[List with years]",

"skillsGap": "# SKILLS GAP ANALYSIS\\n\\n## HARD SKILLS — MATCHED\\n• [Each technical skill candidate HAS that matches job]\\n\\n## HARD SKILLS — MISSING (Priority Gaps)\\n• [Each technical skill job requires that candidate LACKS — be thorough]\\n\\n## SOFT SKILLS — MATCHED\\n• [Leadership, communication etc. evidenced in resume]\\n\\n## SOFT SKILLS — MISSING\\n• [Soft skills job requires not evidenced]\\n\\n## UPSKILLING ROADMAP\\n1. [Most critical gap] — Course: [specific course name] — URL: [real URL e.g. coursera.org, udemy.com, linkedin.com/learning]\\n2. [Second gap] — Certification: [name] — URL: [real URL]\\n3. [Third gap] — Resource: [name] — URL: [real URL]\\n\\n## CERTIFICATIONS TO PURSUE\\n• [Cert name relevant to this role] — Provider: [name] — Cost: [~$X] — URL: [official URL]\\n• [Second cert] — Provider: [name] — URL: [official URL]\\n• [Third cert] — Provider: [name] — URL: [official URL]",

"interviewPrep": "## LIKELY INTERVIEW QUESTIONS\\n\\nQ1: [Role-specific technical question]\\nStrategy: [How to answer — be specific]\\nSample answer opening: [First 2 sentences]\\n\\nQ2: [Behavioral question based on job requirements]\\nStrategy: [STAR method tip]\\n\\nQ3: [Technical deep-dive question]\\nStrategy: [What they want to hear]\\n\\nQ4: [Culture/situational question]\\nStrategy: [Key points to make]\\n\\nQ5: [Hardest question — about a gap or weakness]\\nStrategy: [How to handle honestly]\\n\\n## QUESTIONS TO ASK THE INTERVIEWER\\n• [Smart question 1]\\n• [Smart question 2]\\n• [Smart question 3]",

"starStories": "## STAR BEHAVIORAL STORIES\\n\\n## STORY 1 — [Title matching a key job requirement]\\nSituation: [Context — 1 sentence]\\nTask: [What you needed to accomplish]\\nAction: [3-4 specific steps you took]\\nResult: [Quantified outcome — numbers matter]\\n\\n## STORY 2 — [Title]\\nSituation: ...\\nTask: ...\\nAction: ...\\nResult: ...\\n\\n## STORY 3 — [Title]\\nSituation: ...\\nTask: ...\\nAction: ...\\nResult: ...",

"linkedinSummary": "First-person LinkedIn About section (3-4 sentences). Opens with a bold hook. Names top 3 technical skills. States impact delivered. Ends with what you are seeking. Optimized for this role's keywords.",

"introScripts": "## INTRODUCTION SCRIPTS\\n\\n## 1-MINUTE (Phone Screen)\\n[Full natural-sounding script]\\n\\n## 2-MINUTE (Hiring Manager)\\n[Full script — adds 1-2 specific achievements]\\n\\n## 3-MINUTE (Technical Round)\\n[Full script — adds specific tech stack, project example, and what you want to contribute]",

"matchingJobs": "## BEST-FIT JOB TITLES TO SEARCH (use these exact titles when applying)\\n1. [Most precise job title matching resume+JD] — Search on: LinkedIn · Indeed · Glassdoor\\n2. [Second title — slightly broader] — Search on: [platforms]\\n3. [Third title — stretch role] — Search on: [platforms]\\n4. [Fourth — adjacent industry same skills] — Search on: [platforms]\\n5. [Fifth — remote/global version of role] — Search on: Remote.co · We Work Remotely · Otta\\n\\n## TOP COMPANIES HIRING THIS PROFILE NOW\\n• [Company 1] — Why: [1 line reason] — Careers: [careers.company.com or LinkedIn]\\n• [Company 2] — Why: [reason] — Careers: [URL]\\n• [Company 3] — Why: [reason] — Careers: [URL]\\n• [Company 4] — Why: [reason] — Careers: [URL]\\n• [Company 5] — Why: [reason] — Careers: [URL]\\n\\n## TOP JOB BOARDS FOR THIS PROFILE\\n• [Board 1 most relevant to this industry] — URL — Why best for this role\\n• [Board 2] — URL\\n• [Board 3 — niche/specialized for this field] — URL\\n• LinkedIn Jobs (linkedin.com/jobs) — Best for: networking + direct apply\\n• Indeed (indeed.com) — Best for: volume search\\n• Glassdoor (glassdoor.com) — Best for: salary + culture research before applying\\n\\n## TOP RECRUITERS & STAFFING FIRMS (by market — pick your country)\\n\\n### CANADA\\n• Hays Canada (hays.ca) · Robert Half (roberthalf.ca) · Randstad CA (randstad.ca)\\n• Michael Page CA (michaelpage.ca) · Adecco CA (adecco.ca) · LHH Knightsbridge (lhhknightsbridge.com)\\n• Fuze HR (fuzehr.com) · Procom (procom.ca) · Insight Global CA · The Headhunters (theheadhunters.ca)\\n\\n### USA\\n• Korn Ferry (kornferry.com) · Spencer Stuart (spencerstuart.com) · Heidrick & Struggles (heidrick.com)\\n• Robert Half (roberthalf.com) · Randstad USA (randstad.com) · Kelly Services (kellyservices.com)\\n• Insight Global (insightglobal.com) · Apex Group · Beacon Hill · Creative Circle\\n\\n### UK\\n• Hays UK (hays.co.uk) · Reed (reed.co.uk) · Michael Page UK (michaelpage.co.uk)\\n• Harvey Nash (harveynash.com) · Robert Walters UK (robertwalters.co.uk) · Odgers Berndtson\\n• Morgan McKinley (morganmckinley.com) · Badenoch & Clark · Korn Ferry UK · Marks Sattin\\n\\n### AUSTRALIA\\n• Hays AU (hays.com.au) · Michael Page AU (michaelpage.com.au) · Hudson (hudson.com)\\n• Talent International (talentinternational.com) · Chandler Macleod · Davidson Recruitment\\n• Finite IT (finiterecruitment.com.au) · Robert Half AU · Randstad AU · Watermark Search\\n\\n### UAE / MIDDLE EAST\\n• Hays ME (hays.ae) · Michael Page ME (michaelpage.ae) · Nadia Global (nadiaglobal.com)\\n• Charterhouse ME (charterhouseme.com) · BAC Middle East (bacme.com) · Gulf Talent (gulftalent.com)\\n• Robert Half ME · Cobalt (cobaltrecruits.com) · Tiger Recruitment · RecruitMe (recruitme.ae)\\n\\n### INDIA\\n• Naukri (naukri.com) · TeamLease (teamleaseskills.com) · Randstad India (randstad.in)\\n• ABC Consultants (abcconsultants.net) · Korn Ferry India · Michael Page India\\n• Adecco India (adecco.co.in) · Quess Corp (quesscorp.com) · Mafoi · CareerNet\\n\\n### GLOBAL / REMOTE\\n• Toptal (toptal.com) · Andela (andela.com) · Turing (turing.com) · Arc.dev (arc.dev)\\n• Remote.com (remote.com) · Deel Talent (letsdeel.com) · X-Team (x-team.com)\\n• Lemon.io (lemon.io) · Crossover (crossover.com) · Braintrust (usebraintrust.com)\\n\\n## RECRUITER OUTREACH STRATEGY FOR THIS PROFILE\\n[2-3 specific sentences: which country/market is best for this candidate, which recruiter type to target first, and exact search term to use on LinkedIn to find the right recruiter]\\n\\n## FREELANCE / CONTRACT / FRACTIONAL\\n• Upwork (upwork.com) — [relevant category] · Contra (contra.com) · Flexiple (flexiple.com)\\n• Toptal (toptal.com) — top 3% only · Gun.io (gun.io) — engineers · LinkedIn Services\\n• [1 industry-specific platform] — URL\\nSTRATEGY: [1 sentence on positioning for contract work]",

"thankYouEmail": "SUBJECT: Thank you — [Role] Interview\\n\\nDear [Name],\\n\\n[Para 1: Thank them and reference ONE specific thing discussed in the interview]\\n\\n[Para 2: Reinforce your top 2 most relevant qualifications for this exact role]\\n\\n[Para 3: Restate enthusiasm and confirm you are ready for next steps]\\n\\nBest regards,\\n[Your Name]",

"salaryNegotiation": "## SALARY INTELLIGENCE — [ROLE TITLE] in [LOCATION/COUNTRY]\\n\\n## SALARY BY LEVEL (local currency + USD equivalent)\\n| Level | Experience | Salary Range | Total Comp |\\n|-------|-----------|--------------|------------|\\n| Entry Level | 0-2 yrs | [local range] (~$XX-XXK USD) | +benefits |\\n| Mid Level | 3-5 yrs | [local range] (~$XX-XXK USD) | +equity possible |\\n| Senior | 6-10 yrs | [local range] (~$XX-XXK USD) | +bonus |\\n| Lead/Principal | 10-15 yrs | [local range] (~$XX-XXK USD) | +RSU/options |\\n| Consultant/Exec | 15+ yrs | [local range] (~$XXX-XXXK USD) | +carried interest |\\n\\n## YOUR LEVEL ASSESSMENT\\nBased on resume: [entry/mid/senior/lead] — estimated value: [range]\\nGap to next level: [what skills/years needed]\\n\\n## NEGOTIATION STRATEGY\\nYOUR TARGET: [specific number based on assessment]\\nFLOOR (walk away below): [number]\\nANCHOR (open with): [number — 15-20% above target]\\n\\nOPENING SCRIPT: [exact words to say when asked salary expectations]\\n\\nCOUNTEROFFER SCRIPT: [exact words when offer comes in low]\\n\\n## TOTAL COMP BEYOND BASE\\n• Equity/RSU: [typical for this role/level]\\n• Bonus: [typical % for this role]\\n• Benefits to negotiate: [4-5 specific items]\\n• Remote days · Learning budget · Sign-on bonus · Extra vacation\\n\\n## NEVER SAY IN SALARY TALKS\\n• [Mistake 1] · [Mistake 2] · [Mistake 3]",

"actionPlan": "## 30-60-90 DAY ONBOARDING PLAN\\n\\n## FIRST WEEK CHECKLIST\\n• [Day 1 action]\\n• [Day 2-3 action]\\n• [Day 4-5 action]\\n\\n## 30-DAY GOALS (Learn)\\n• Week 1: [specific]\\n• Week 2: [specific]\\n• Week 3: [specific]\\n• Week 4: [specific — first deliverable]\\n\\n## 60-DAY GOALS (Contribute)\\n• [Specific contribution 1]\\n• [Specific contribution 2]\\n• [First win to demonstrate value]\\n\\n## 90-DAY GOALS (Lead/Own)\\n• [Measurable outcome 1]\\n• [Measurable outcome 2]\\n• [How you prove yourself in this role]",

"visaPathways": "## VISA AND IMMIGRATION OPTIONS\\n\\n## OPTION 1: [Most relevant visa — e.g. H-1B / Express Entry / Skilled Worker Visa]\\nEligibility: [requirements]\\nProcess: [key steps]\\nTimeline: [realistic estimate]\\nOfficial link: [real government URL]\\n\\n## OPTION 2: [Second option]\\nEligibility: [requirements]\\nTimeline: [estimate]\\nOfficial link: [URL]\\n\\n## OPTION 3: REMOTE / DIGITAL NOMAD\\nBest countries for this profile: [list 3 with visa names]\\nRequirements: [brief]\\n\\n## KEY ADVICE\\n[2-3 honest sentences on best path for this specific candidate's situation]",

"coldOutreach": "## COLD OUTREACH MESSAGES\\n\\n## LINKEDIN CONNECTION REQUEST (300 chars max)\\n[Natural, non-salesy message. Reference something real about their work or the company. End with a specific reason to connect — not just 'I'd love to connect'.]\\n\\n## LINKEDIN DM (after connection accepted)\\n[Follow-up message: 1 sentence compliment, 1 sentence your value, 1 specific ask — e.g. 15-min call or referral request. Under 150 words.]\\n\\n## EMAIL TO HIRING MANAGER (cold)\\nSubject: [Specific subject line — not 'Job Application']\\n\\n[Para 1: One sentence hook — why you're reaching out to THIS person at THIS company]\\n[Para 2: Your top 2 relevant achievements in 2 sentences]\\n[Para 3: Specific ask — informational interview, referral, or application review]\\n\\n## FOLLOW-UP MESSAGE (if no reply after 1 week)\\n[Short, confident, adds new value — not just 'just checking in']\\n\\n## KEY RULES FOR COLD OUTREACH\\n• [Rule 1 specific to this candidate's situation]\\n• [Rule 2]\\n• [Rule 3 — biggest mistake to avoid]",

"careerPivot": "## CAREER PIVOT MAP\\n\\n## YOUR PIVOT SCORE\\nHow pivot-ready is this candidate for a career change: [EASY / MODERATE / CHALLENGING]\\nReason: [honest 1-sentence assessment]\\n\\n## TOP 3 ADJACENT ROLES YOU CAN TARGET NOW\\n\\n### PIVOT 1: [Role title] — [Industry]\\nTransferable skills you already have: [list 3-4 from resume]\\nSkills gap to bridge: [1-2 missing skills]\\nTime to qualify: [honest estimate — weeks/months]\\nWhere to apply: [platform]\\nWhy this works: [specific reason based on resume]\\n\\n### PIVOT 2: [Role title] — [Industry]\\nTransferable skills: [list]\\nGap to bridge: [skills]\\nTime: [estimate]\\nWhere: [platform]\\n\\n### PIVOT 3: [Role title — more ambitious, 6-12 month target]\\nTransferable skills: [list]\\nGap to bridge: [skills]\\nTime: [estimate]\\nWhere: [platform]\\n\\n## 90-DAY PIVOT ACTION PLAN\\n• Month 1: [specific action — course, project, networking]\\n• Month 2: [specific action]\\n• Month 3: [apply to first pivot role with new profile]\\n\\n## WHAT TO PUT ON YOUR RESUME FOR THE PIVOT\\n[Specific advice on how to reframe existing experience for the target role]",

"countryLaws": "## EMPLOYMENT LAWS & COMPLIANCE — [COUNTRY from user location or job posting]\\n\\n## EMPLOYMENT LAW ESSENTIALS\\n• Notice Period: [standard notice period for this role/level in this country]\\n• Termination rules: [wrongful dismissal protections, severance formula]\\n• Probation period: [standard and candidate's rights during it]\\n• Non-compete: [enforceability in this country — strong/weak/banned]\\n• NDA: [standard? what to watch for]\\n\\n## RESUME & CV COMPLIANCE FOR THIS COUNTRY\\n• Standard format: [CV vs Resume · length norms · photo required/optional/forbidden]\\n• What to INCLUDE that's country-specific: [e.g., SIN/TFN, NIN, work permit status]\\n• What to OMIT: [e.g., age, marital status, photo — varies by country law]\\n• Reference norms: [provided upfront vs on-request · how many typical]\\n• Background check norms: [criminal, credit, education verification standards]\\n\\n## TAX & PAYROLL OBLIGATIONS\\n• Key deductions from paycheck: [country-specific: CPP/EI, NI, PF/ESI, etc.]\\n• Tax forms to know: [T4/W-2/P60/Form 16 etc.]\\n• Freelance/contractor tax rules: [IR35/1099/self-assessment/NTN etc.]\\n• Employer social contributions: [% and what it covers]\\n\\n## WORKER RIGHTS & BENEFITS (statutory minimums)\\n• Annual leave: [minimum days by law]\\n• Sick leave: [entitlement]\\n• Parental leave: [maternity/paternity/parental]\\n• Overtime rules: [rate and trigger hours]\\n• Minimum wage: [current rate in local currency]\\n\\n## GRC — GOVERNANCE, RISK & COMPLIANCE\\n• Data privacy law: [GDPR/PIPEDA/PDPA etc. — what candidates must know]\\n• Workplace safety legislation: [key act name]\\n• Anti-discrimination law: [protected grounds in this country]\\n• Union/collective bargaining: [how common in this industry/country]\\n• Compliance red flags for this role: [any sector-specific compliance — finance, health, etc.]\\n\\n## PRACTICAL ADVICE FOR THIS CANDIDATE\\n[3 bullet points specific to this candidate's situation, country, and role type]"
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
