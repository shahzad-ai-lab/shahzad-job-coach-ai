import fs from 'fs'
import path from 'path'

export const maxDuration = 60

const MAX_RESUME = 6000
const MAX_JOB = 3000
const MAX_BODY_BYTES = 50000
const HOURLY_LIMIT = 9999  // disabled for dev — per-IP limit re-enabled in production
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

// ── Multi-provider AI fallback chain ──────────────────────────────────────────
// Order: Gemini KEY1 → Gemini KEY2 → Grok (xAI) → error
// Add GEMINI_API_KEY_2 and GROK_API_KEY to Vercel env vars to activate backups

async function callAI(prompt, env) {
  const { gemini1, gemini2, grok } = env
  const errors = []

  // ── Gemini models to try (used for both key1 and key2) ──────────────────────
  const GEMINI_MODELS = [
    'gemini-2.0-flash',
    'gemini-flash-latest',
    'gemini-2.0-flash-lite',
    'gemini-1.5-flash',
  ]

  // ── Helper: call one Gemini model with one key ──────────────────────────────
  async function tryGemini(model, key, label) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 55000)
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: 'POST', signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
          }),
        }
      )
      clearTimeout(timer)
      const data = await res.json()
      if (res.ok) {
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) { console.log(`✓ ${label}/${model}`); return text }
        errors.push(`${label}/${model}: empty`)
      } else {
        const msg = (data?.error?.message || `HTTP ${res.status}`).slice(0, 80)
        errors.push(`${label}/${model}: ${msg}`)
      }
    } catch (err) {
      clearTimeout(timer)
      errors.push(`${label}/${model}: ${err.name === 'AbortError' ? 'timeout' : (err.message || 'error').slice(0,50)}`)
    }
    return null
  }

  // ── Helper: call Grok (OpenAI-compatible API) ───────────────────────────────
  async function tryGrok(key) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 55000)
    try {
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST', signal: controller.signal,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          model: 'grok-4-latest',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7, max_tokens: 8192,
        }),
      })
      clearTimeout(timer)
      const data = await res.json()
      if (res.ok) {
        const text = data?.choices?.[0]?.message?.content
        if (text) { console.log('✓ grok-3-mini'); return text }
        errors.push('grok-3-mini: empty')
      } else {
        errors.push(`grok-3-mini: ${(data?.error?.message || `HTTP ${res.status}`).slice(0,80)}`)
      }
    } catch (err) {
      clearTimeout(timer)
      errors.push(`grok-3-mini: ${err.name === 'AbortError' ? 'timeout' : (err.message||'error').slice(0,50)}`)
    }
    return null
  }

  // ── Chain: try each provider in order ──────────────────────────────────────
  // 1. Gemini primary key
  if (gemini1) {
    for (const model of GEMINI_MODELS) {
      const result = await tryGemini(model, gemini1, 'G1')
      if (result) return result
    }
  }

  // 2. Gemini secondary key (if provided)
  if (gemini2) {
    for (const model of GEMINI_MODELS) {
      const result = await tryGemini(model, gemini2, 'G2')
      if (result) return result
    }
  }

  // 3. Grok fallback (if provided)
  if (grok) {
    const result = await tryGrok(grok)
    if (result) return result
  }

  throw new Error(`All providers failed: ${errors.slice(0, 5).join(' | ')}`)
}

function extractJSON(raw) {
  // Step 1: Strip markdown code fences
  let cleaned = raw
    .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '') // strip control chars
    .trim()

  // Step 2: Try clean parse
  try { return JSON.parse(cleaned) } catch {}

  // Step 3: Extract first {...} block
  const start = cleaned.indexOf('{')
  if (start === -1) return null
  const block = cleaned.slice(start)

  // Step 4: Try the full block
  try { return JSON.parse(block) } catch {}

  // Step 5: Try last-resort greedy match
  const match = block.match(/\{[\s\S]*\}/)
  if (match) { try { return JSON.parse(match[0]) } catch {} }

  // Step 6: Handle truncated JSON — find last complete key:value pair and close
  try {
    let partial = block
    // Find last complete "key": "value" entry (ends with quote or })
    const lastComma = partial.lastIndexOf('",\n')
    if (lastComma > 10) {
      partial = partial.slice(0, lastComma + 1) + '\n"_truncated": "Some results may be missing — please try again."}'
      return JSON.parse(partial)
    }
  } catch {}

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
    // Language: English only (multilingual system reserved for v3)
    langInstruction = ''
    const userCountry     = typeof body.userCountry     === 'string' ? body.userCountry.slice(0, 60)     : ''
    const userCountryCode = typeof body.userCountryCode === 'string' ? body.userCountryCode.slice(0, 5)   : ''
    const userIndustry    = typeof body.userIndustry    === 'string' ? body.userIndustry.slice(0, 40)     : ''
    const userIndustryLabel = typeof body.userIndustryLabel === 'string' ? body.userIndustryLabel.slice(0, 60) : ''
    if (userCountry) {
      langInstruction += `\nUSER SELECTED COUNTRY: ${userCountry} (${userCountryCode})\n`
      langInstruction += `USER SELECTED INDUSTRY: ${userIndustryLabel || 'General'}\n`
      langInstruction += `\nCOUNTRY-AWARE GUIDANCE RULES:\n`
      langInstruction += `• For matchingJobs — show recruiters and job boards for ${userCountry} or nearest regional market FIRST\n`
      langInstruction += `• For countryLaws — focus on ${userCountry} labor law, notice periods, worker rights, GRC compliance\n`
      langInstruction += `• For salaryNegotiation — use ${userCountry} salary ranges and local currency benchmarks\n`
      langInstruction += `• For visaPathways — CRITICAL: detect if job posting is IN ${userCountry} or OUTSIDE ${userCountry}:\n`
      langInstruction += `  - IF JOB IS IN ${userCountry} (same as user's country): Focus on local hiring requirements, work permit conditions for immigrants already there, ATS norms, background check rules, union requirements, professional licensing\n`
      langInstruction += `  - IF JOB IS OUTSIDE ${userCountry} (user wants to relocate): List ALL pathways: skilled worker visa, employer-sponsored visa, working holiday visa, intra-company transfer, temporary foreign worker program, digital nomad visa, non-immigration work authorization, treaty trader/investor visa — with official government URLs\n`
      langInstruction += `• For skillsGap certifications — prioritize certifications recognized and valued in ${userCountry}\n\n`
    }
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400, headers: h })
  }

  if (!resumeText || !jobPosting) return Response.json({ error: 'Resume and Job descriptions are required.' }, { status: 400, headers: h })

  const aiEnv = {
    gemini1: process.env.GEMINI_API_KEY   || null,
    gemini2: process.env.GEMINI_API_KEY_2 || null,
    grok:    process.env.GROK_API_KEY     || null,
  }
  if (!aiEnv.gemini1 && !aiEnv.gemini2 && !aiEnv.grok) {
    return Response.json({ error: 'No AI API key configured.' }, { status: 500, headers: h })
  }

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

  // ── Country Companies RAG ─────────────────────────────────────────────────
  let companyIntel = ''
  try {
    const cp = path.join(process.cwd(), 'v2', 'COMPANIES_BY_COUNTRY.md')
    if (fs.existsSync(cp)) {
      const companyText = fs.readFileSync(cp, 'utf-8')
      const countrySections = companyText.split(/^## /m)
      // Extract userCountry from langInstruction context (already parsed above)
      const body2UserCountry = typeof langInstruction === 'string'
        ? (langInstruction.match(/USER LOCATION: ([^.]+)\./) || [])[1]?.trim().toUpperCase() || ''
        : ''
      const jobText = (jobPosting + ' ' + resumeText).toUpperCase()
      // Try to find matching country section
      const countryKeys = {
        'AUSTRALIA': ['AUSTRALIA','SYDNEY','MELBOURNE','BRISBANE','PERTH'],
        'BRAZIL': ['BRAZIL','SÃO PAULO','RIO DE JANEIRO'],
        'CANADA': ['CANADA','TORONTO','VANCOUVER','CALGARY','MONTREAL','OTTAWA'],
        'CHINA': ['CHINA','BEIJING','SHANGHAI','SHENZHEN','GUANGZHOU'],
        'DENMARK': ['DENMARK','COPENHAGEN'],
        'FINLAND': ['FINLAND','HELSINKI'],
        'FRANCE': ['FRANCE','PARIS','LYON'],
        'GERMANY': ['GERMANY','BERLIN','MUNICH','FRANKFURT','HAMBURG'],
        'INDIA': ['INDIA','BANGALORE','MUMBAI','HYDERABAD','DELHI','PUNE','CHENNAI'],
        'INDONESIA': ['INDONESIA','JAKARTA'],
        'IRELAND': ['IRELAND','DUBLIN'],
        'ISRAEL': ['ISRAEL','TEL AVIV'],
        'ITALY': ['ITALY','MILAN','ROME'],
        'JAPAN': ['JAPAN','TOKYO','OSAKA'],
        'MEXICO': ['MEXICO','CIUDAD DE MEXICO'],
        'NETHERLANDS': ['NETHERLANDS','AMSTERDAM'],
        'NEW ZEALAND': ['NEW ZEALAND','AUCKLAND','WELLINGTON'],
        'NIGERIA': ['NIGERIA','LAGOS','ABUJA'],
        'PAKISTAN': ['PAKISTAN','KARACHI','LAHORE','ISLAMABAD'],
        'SAUDI ARABIA': ['SAUDI','RIYADH','JEDDAH'],
        'SINGAPORE': ['SINGAPORE'],
        'SOUTH AFRICA': ['SOUTH AFRICA','JOHANNESBURG','CAPE TOWN'],
        'SOUTH KOREA': ['SOUTH KOREA','KOREA','SEOUL'],
        'SPAIN': ['SPAIN','MADRID','BARCELONA'],
        'SWEDEN': ['SWEDEN','STOCKHOLM'],
        'SWITZERLAND': ['SWITZERLAND','ZURICH','GENEVA'],
        'TAIWAN': ['TAIWAN','TAIPEI'],
        'TURKEY': ['TURKEY','ISTANBUL'],
        'UNITED ARAB EMIRATES': ['UAE','DUBAI','ABU DHABI','EMIRATES'],
        'UNITED KINGDOM': ['UNITED KINGDOM','UK','LONDON','MANCHESTER','EDINBURGH'],
        'UNITED STATES': ['UNITED STATES','USA','US ','NEW YORK','SAN FRANCISCO','SEATTLE','AUSTIN','CHICAGO','BOSTON'],
        'VIETNAM': ['VIETNAM','HO CHI MINH','HANOI'],
      }
      let matchedCountry = ''
      for (const [key, aliases] of Object.entries(countryKeys)) {
        if (aliases.some(a => body2UserCountry.includes(a) || jobText.includes(a))) {
          matchedCountry = key; break
        }
      }
      if (!matchedCountry) matchedCountry = 'UNITED STATES' // global fallback
      const section = countrySections.find(s => s.startsWith(matchedCountry))
      if (section) {
        companyIntel = `TOP COMPANIES IN ${matchedCountry} (with career pages — use these in matchingJobs):\n## ${section.slice(0, 4000)}`
      }
      // Also always include Global Remote section
      const remoteSection = countrySections.find(s => s.startsWith('GLOBAL REMOTE'))
      if (remoteSection) companyIntel += `\n\nGLOBAL REMOTE-FIRST COMPANIES:\n## ${remoteSection.slice(0, 1000)}`
    }
  } catch (e) {
    console.warn("Could not read COMPANIES_BY_COUNTRY.md", e)
  }

  // ── Occupation Intelligence RAG ───────────────────────────────────────────
  let occupationIntel = ''
  try {
    const op = path.join(process.cwd(), 'v2', 'OCCUPATIONS_ISCO08.md')
    if (fs.existsSync(op)) {
      const occText = fs.readFileSync(op, 'utf-8')
      // Extract fastest-growing + emerging roles sections always (high value)
      const fastSection = occText.match(/# FASTEST-GROWING OCCUPATIONS[\s\S]{0,3000}/)
      const emergingSection = occText.match(/# EMERGING 2026 JOB TITLES[\s\S]{0,1500}/)
      const demandSection = occText.match(/# OCCUPATION-COUNTRY MAPPING[\s\S]{0,2000}/)
      // Find occupation-specific section from job posting keywords
      const jobWords = jobPosting.toLowerCase()
      let roleSection = ''
      const roleKeywords = [
        { k: ['software','developer','engineer','programming','code','backend','frontend','fullstack'], sec: 'MAJOR GROUP 2 — PROFESSIONALS' },
        { k: ['nurse','nursing','clinical','hospital','patient','medical','health'], sec: '## 2221 Nursing' },
        { k: ['data science','machine learning','ai engineer','data analyst'], sec: '## 2120 Mathematicians' },
        { k: ['accountant','accounting','cpa','finance','audit'], sec: '## 2411 Accountants' },
        { k: ['sales','account executive','business development','revenue'], sec: '## 3322 Commercial Sales' },
        { k: ['teacher','education','instructor','professor','lecturer'], sec: '## 2310 University' },
        { k: ['manager','director','vp ','vice president','head of'], sec: 'MAJOR GROUP 1 — MANAGERS' },
        { k: ['lawyer','attorney','legal','law','counsel'], sec: '## 2611 Lawyers' },
        { k: ['construction','civil','structural','site'], sec: '## 2142 Civil Engineers' },
        { k: ['electrician','electrical','wiring','power'], sec: '## 7411 Building and Related Electricians' },
        { k: ['truck','driver','logistics','freight','delivery'], sec: '## 8332 Heavy Truck' },
      ]
      for (const { k, sec } of roleKeywords) {
        if (k.some(kw => jobWords.includes(kw))) {
          const match = occText.indexOf(sec)
          if (match >= 0) { roleSection = occText.slice(match, match + 1200); break }
        }
      }
      occupationIntel = [
        roleSection ? `OCCUPATION PROFILE:\n${roleSection}` : '',
        fastSection ? fastSection[0] : '',
        emergingSection ? emergingSection[0] : '',
        demandSection ? demandSection[0] : '',
      ].filter(Boolean).join('\n---\n').slice(0, 5000)
    }
  } catch (e) {
    console.warn("Could not read OCCUPATIONS_ISCO08.md", e)
  }

  // ── Country Package RAG (COUNTRY_PACKAGES_195.md) ─────────────────────────
  let countryPackageIntel = ''
  try {
    const cpp = path.join(process.cwd(), 'v2', 'COUNTRY_PACKAGES_195.md')
    if (fs.existsSync(cpp) && userCountry) {
      const cpText = fs.readFileSync(cpp, 'utf-8')
      // Find the country's section by ISO code or name
      const codeSearch = userCountryCode ? new RegExp(`\\|\\s*${userCountryCode}\\s*\\|`, 'i') : null
      const nameSearch = new RegExp(userCountry.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      // Split into per-country rows and find matching block
      const lines = cpText.split('\n')
      const matchedLines = []
      let inSection = false
      let sectionHeader = ''
      for (const line of lines) {
        // Section headers like ## AFRICA, ## AMERICAS etc
        if (/^## /.test(line)) { sectionHeader = line; inSection = false }
        // Table rows with country data
        if ((codeSearch && codeSearch.test(line)) || nameSearch.test(line)) {
          if (matchedLines.length === 0 && sectionHeader) matchedLines.push(sectionHeader)
          matchedLines.push(line)
          inSection = true
        } else if (inSection && line.trim() && !line.startsWith('|---')) {
          // Keep a few follow-up lines for context
          if (matchedLines.length < 20) matchedLines.push(line)
          else inSection = false
        }
      }
      if (matchedLines.length > 0) {
        countryPackageIntel = `COUNTRY DATA PACKAGE — ${userCountry.toUpperCase()} (from 195-country intelligence database):\n${matchedLines.join('\n').slice(0, 3000)}`
      }
      // Also grab salary benchmarks section
      const salaryMatch = cpText.match(/## SALARY BENCHMARKS[\s\S]{0,2000}/)
      if (salaryMatch) countryPackageIntel += `\n\n${salaryMatch[0].slice(0, 1500)}`
      // Digital nomad section if user is outside job's country
      const nomadMatch = cpText.match(/## DIGITAL NOMAD[\s\S]{0,1500}/)
      if (nomadMatch) countryPackageIntel += `\n\n${nomadMatch[0].slice(0, 1000)}`
      countryPackageIntel = countryPackageIntel.slice(0, 5000)
    }
  } catch (e) {
    console.warn("Could not read COUNTRY_PACKAGES_195.md", e)
  }

  // ── Certifications RAG (CERTIFICATIONS_2026.md) ───────────────────────────
  let certIntel = ''
  try {
    const certp = path.join(process.cwd(), 'v2', 'CERTIFICATIONS_2026.md')
    if (fs.existsSync(certp)) {
      const certText = fs.readFileSync(certp, 'utf-8')
      const certSections = certText.split(/^## /m)
      // Map industry ID to certification section keywords
      const industryCertMap = {
        'tech':        ['CLOUD','CYBERSECURITY','NETWORKING','DATA','DEVOPS','DEVELOPER','AI'],
        'healthcare':  ['HEALTHCARE','MEDICAL'],
        'finance':     ['FINANCE','ACCOUNTING'],
        'engineering': ['CLOUD','DEVOPS','ENGINEERING'],
        'education':   ['LANGUAGE','PROFESSIONAL DEVELOPMENT'],
        'trades':      ['TRADES','SAFETY'],
        'marketing':   ['MARKETING','DATA'],
        'legal':       ['LEGAL','COMPLIANCE'],
        'hr':          ['HR','HUMAN RESOURCES'],
        'logistics':   ['SUPPLY CHAIN','PROJECT MANAGEMENT'],
        'creative':    ['DEVELOPER','MARKETING'],
        'hospitality': ['LANGUAGE','PROFESSIONAL DEVELOPMENT'],
        'government':  ['COMPLIANCE','SAFETY','PROJECT MANAGEMENT'],
        'science':     ['DATA','CLOUD','AI'],
        'other':       ['CLOUD','PROJECT MANAGEMENT','DATA','AI'],
      }
      const targetSecs = industryCertMap[userIndustry] || industryCertMap['other']
      // Also always include 2026 emerging certs
      const alwaysInclude = ['2026 EMERGING']
      const relevant = certSections.filter(s => {
        const h = s.split('\n')[0].toUpperCase()
        return targetSecs.some(k => h.includes(k)) || alwaysInclude.some(k => h.includes(k))
      })
      if (relevant.length > 0) {
        certIntel = `CERTIFICATIONS FOR ${userIndustryLabel || 'THIS INDUSTRY'} (2026 — prioritize these in skillsGap):\n## ${relevant.join('\n## ').slice(0, 4000)}`
      } else {
        // fallback: first 2 sections
        certIntel = `CERTIFICATIONS 2026 (top sections):\n## ${certSections.slice(1, 3).join('\n## ').slice(0, 2000)}`
      }
    }
  } catch (e) {
    console.warn("Could not read CERTIFICATIONS_2026.md", e)
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

TOP RECRUITER 3-STEP METHODOLOGY (mandatory — apply to resumeRewrite, recruiterPov, coverLetter):
STEP 1 — 6-SECOND SKIM: Recruiter has 200 applications. Skim for 6 seconds. What is NOTICED? What is MISSED? If best wins are NOT in top third of page = candidate is invisible. Identify exactly what stands out vs what is buried.
STEP 2 — MEASURABLE ACCOMPLISHMENTS: Every bullet needs a NUMBER. Extract all wins from resume. Add metrics: %, $, time saved, team size, revenue, users, rank. No number = not a win. Turn "managed team" → "led 8-person team, delivered project 3 weeks early saving $40K". Ask about/infer every accomplishment.
STEP 3 — REORDER FOR TOP THIRD: The 3 strongest quantified results MUST appear in the first half of page 1 — in the summary OR first job bullets. Recruiters stop reading after page 1 top half. Reorganize ruthlessly. Weak bullets go to bottom or cut entirely.
BONUS — ATS KEYWORD STRATEGY: After human optimization, insert strategic keywords from job description naturally into the rebuilt content. Keywords in summary + skills section + first job = maximum ATS weight. Never stuff — weave them in.
RESULT = TOP 1% CANDIDATE: Specific wins beat generic duties. Numbers beat adjectives. Results beat responsibilities. First half of page 1 = your entire career value proposition.
---

${masterGuide ? `CAREER KNOWLEDGE BASE (use this for certifications, salary, visa data):\n${masterGuide}\n---` : ''}
${countryPackageIntel ? `${countryPackageIntel}\n---` : ''}
${certIntel ? `${certIntel}\n---` : ''}
${companyIntel ? `${companyIntel}\n---` : ''}
${occupationIntel ? `OCCUPATION & JOB MARKET INTELLIGENCE (ISCO-08/ILO/BLS 2026):\n${occupationIntel}\n---` : ''}

RESUME:
${resumeText}

JOB POSTING:
${jobPosting}

Return JSON with EXACTLY these keys. Every field must be detailed, honest, and specific to THIS resume and THIS job:

{
"resumeScore": "## ATS SCORE: XX/100\\n\\nBe strict. Most resumes score 40-75. Only award 90+ if genuinely exceptional.\\n\\n## SCORE INTERPRETATION\\n• 80-100%: Auto-shortlisted — recruiter sees your profile\\n• 60-79%: Manual review — recruiter decides in 6 seconds\\n• 50-59%: Borderline — likely filtered unless manually searched\\n• Below 50%: Auto-rejected — never seen by a human\\n\\n## KEYWORDS FOUND (in resume)\\n• [list actual keywords from job found in resume — be specific]\\n\\n## KEYWORDS MISSING (critical gaps)\\n• [list actual keywords from job NOT in resume — be thorough]\\n\\n## KNOCKOUT QUESTIONS (auto-disqualifiers — check these first)\\n• [Any work authorization / visa requirement mentioned in job?]\\n• [Any required years of experience as a hard requirement?]\\n• [Any required license or certification as a hard requirement?]\\n• [Any location/relocation requirement?]\\nVerdict: [PASSES ALL KNOCKOUTS / FAILS KNOCKOUT: state which one]\\n\\n## COMPOSITE SCORE BREAKDOWN\\nHard Skills Match (40% weight): X/10 → weighted: XX pts\\nExperience & Recency (25% weight): X/10 → weighted: XX pts\\n  - Note recency: [which key skills were used recently vs 3+ years ago]\\nSoft Skills & Leadership (15% weight): X/10 → weighted: XX pts\\nEducation & Certifications (10% weight): X/10 → weighted: XX pts\\nATS Formatting (10% weight): X/10 → weighted: XX pts\\n\\n## ACHIEVEMENT DENSITY CHECK\\nBullets with quantified results (numbers/% in resume): [X out of ~Y total bullets]\\nVerdict: [STRONG — X% of bullets have metrics / WEAK — only X bullets have numbers, add more]\\nExamples of weak bullets to fix:\\n• [paste actual weak bullet from resume]\\nRewrite: [quantified version]\\n\\n## RESUME ANATOMY CHECK (2026 ATS Standards)\\n• Length: [1 page / 2 pages / TOO LONG — X pages] → [PASS / FAIL — rule: <10yr=1pg, 10+yr=2pg]\\n• Layout: [Single column / Multi-column] → [PASS / FAIL — multi-column scrambles parsers]\\n• Graphics/Tables/Icons: [None detected / Found] → [PASS / FAIL — graphics break ATS parsing]\\n• File format recommendation: [.docx safer for ATS / .pdf safe if clean]\\n• Headings used: [standard: Summary, Experience, Skills, Education = PASS / non-standard = FAIL]\\n\\n## HONEST SUMMARY\\n[3 sentences — state the real score, the real reason it would pass or fail, and the single most important fix]",

"recruiterPov": "## RECRUITER VERDICT: [STRONG PASS / PASS / BORDERLINE / REJECT]\\n\\n## 6-SECOND SKIM TEST (200 applications on desk — brutal honesty)\\nYou are a recruiter. You have 6 seconds. You skim the TOP THIRD of this resume only.\\n\\nWHAT YOU NOTICED (visible in 6 seconds):\\n• [Exactly what jumps out — job title, company name, one metric if present, layout]\\n• [What the recruiter's eye lands on first]\\n• [What creates a positive or negative first signal]\\n\\nWHAT YOU MISSED (buried — invisible in 6 seconds):\\n• [Important wins, skills, or experience that is buried in the middle or bottom]\\n• [The strongest achievement that the recruiter never saw]\\n• [Keywords that should be prominent but aren't]\\n\\nVERDICT AFTER 6 SECONDS: [Keep reading / Borderline / In the NO pile]\\nReason: [1 honest sentence — what decided it]\\n\\n## RED FLAGS (reasons to reject)\\n\\nRED FLAG 1: [Specific issue from THIS resume]\\nFix immediately: [Exact action — be specific]\\n\\nRED FLAG 2: [Specific issue]\\nFix immediately: [Exact action]\\n\\nRED FLAG 3: [Specific issue]\\nFix immediately: [Exact action]\\n\\n## WHAT WORKS WELL (genuine strengths)\\n• [Strength 1 — specific, not generic]\\n• [Strength 2]\\n• [Strength 3]\\n\\n## WINS BURIED IN WRONG PLACE\\n[List 2-3 accomplishments that exist in the resume but are in the bottom half — these need to move to the top third immediately]\\n\\n## LINKEDIN CROSS-CHECK WARNING\\n[Does the resume match what a recruiter finds on LinkedIn? Inconsistencies? Alignment tip.]\\n\\n## DO THESE 3 THINGS TODAY (before applying)\\n1. [Most urgent — move this specific thing to top third]\\n2. [Add this specific number/metric to this specific bullet]\\n3. [Remove or fix this specific thing that hurts you]\\n\\n## ENGAGEMENT SIGNALS THAT BOOST RANKING\\n• Apply within 24-48 hours of posting (early applicants score higher in ATS)\\n• Update LinkedIn in last 30 days (signals active search — recruiters filter by this)\\n• Respond to recruiter messages within 24 hours (boosts your engagement score)",

"coverLetter": "# TOP 1% COVER LETTER\\n\\nDear [Hiring Manager Name or Hiring Team],\\n\\n[PARAGRAPH 1 — THE HOOK (2-3 sentences). Name the company AND the specific role. Reference ONE specific thing about the company that shows you researched them — a product, recent news, mission, or specific team. End with your single strongest result that directly matches what they need. Generic openers = trash pile. Be specific or be ignored.]\\n\\n[PARAGRAPH 2 — YOUR 3 WINS (4-5 sentences). Three quantified accomplishments that directly answer the job requirements. Each win: strong verb + specific action + measurable result. Format: 'At [Company], I [did what] which [resulted in specific metric].' Pick wins that mirror the exact language of the job description. This is the paragraph that gets you interviews.]\\n\\n[PARAGRAPH 3 — WHY THEM, CONFIDENT ASK (2-3 sentences). One specific reason you want THIS company (not 'I am passionate about...' — say something real about their work, culture, or problem they're solving). End with a direct, confident ask for a conversation — not begging, not 'I would be honored' — state you'd like to discuss how you can contribute specifically.]\\n\\nBest regards,\\n[Your Name]\\n[Phone] | [Email] | [LinkedIn]\\n\\n---\\n## WHY THIS LETTER IS TOP 1%\\n• Hook names the company + shows research = recruiter knows you're serious\\n• 3 wins with numbers = proof not promises\\n• Mirrors job description language = passes keyword scan\\n• Specific 'why them' = not copy-paste generic\\n• Confident ask = signals someone who knows their value\\n• Total length: under 300 words = recruiters actually read it",

"resumeRewrite": "# TOP 1% RESUME REBUILD — 3-STEP PROCESS\\n\\n## STEP 1 — 6-SECOND SKIM DIAGNOSIS\\nWhat recruiter sees in 6 seconds RIGHT NOW (before rebuild):\\n• [What is currently in top third]\\nWhat the recruiter MISSES right now:\\n• [Top wins buried in middle/bottom — name them specifically]\\nProblem to fix: [1 sentence — why this resume is invisible in 6 seconds]\\n\\n## STEP 2 — MEASURABLE WINS EXTRACTED\\n[Pull every accomplishment from resume. Add/infer metrics. No number = no win.]\\n• Original: [paste weak bullet] → Rebuilt: [quantified version with %, $, time, size]\\n• Original: [paste weak bullet] → Rebuilt: [quantified version]\\n• Original: [paste weak bullet] → Rebuilt: [quantified version]\\n• [Continue for all bullets — be thorough]\\nNOTE: If no metric exists in resume, use ranges or estimates clearly marked (~): ~$50K saved, ~20% improvement\\n\\n## STEP 3 — REBUILT RESUME (top 3 wins in FIRST HALF of page 1)\\n\\n[FULL NAME]\\n[Target Job Title] | [Email] | [Phone] | [LinkedIn URL] | [Portfolio/GitHub if relevant]\\n[City, Country] | [Work Authorization status if relevant]\\n\\n## PROFESSIONAL SUMMARY (first thing recruiter reads — 3 strongest wins here)\\n[Hook line: #1 quantified result that matches this exact job]\\n[Win 2: second strongest result with metric]\\n[Win 3: third strongest result with metric]\\n[4th line: ATS keywords woven in naturally + what you're targeting]\\n\\n## CORE SKILLS (ATS pass — exact keywords from job description)\\n[Skill 1] · [Skill 2] · [Skill 3] · [Skill 4] · [Skill 5] · [Skill 6]\\n[Skill 7] · [Skill 8] · [Skill 9] · [Skill 10] · [Skill 11] · [Skill 12]\\n\\n## PROFESSIONAL EXPERIENCE\\n\\n[Job Title] | [Company Name] | [City] | [Month Year – Month Year]\\n• [Impact-first bullet: strong verb + what you did + quantified result — matches job keyword]\\n• [Impact-first bullet with metric]\\n• [Impact-first bullet with metric]\\n• [Impact-first bullet — leadership/scope if applicable]\\n\\n[Previous Job Title] | [Company] | [Dates]\\n• [Rewritten impact bullet]\\n• [Rewritten impact bullet]\\n• [Rewritten impact bullet]\\n\\n## EDUCATION & CERTIFICATIONS\\n[Degree] — [Institution] — [Year]\\n[Certification name] — [Provider] — [Year or In Progress]\\n\\n## ATS KEYWORD AUDIT\\nStrategic keywords inserted: [list the exact keywords placed from job description]\\nPlacement: Summary + Skills section + First job bullets = maximum ATS weight\\nResult: Resume now passes ATS AND wins the 6-second human skim",

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
    raw = await callAI(prompt, aiEnv)
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
