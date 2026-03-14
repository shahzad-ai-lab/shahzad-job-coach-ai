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

  let resumeText, jobPosting
  try {
    const body = await request.json()
    resumeText = truncate(sanitize(body.resumeText || ''), MAX_RESUME)
    jobPosting = truncate(sanitize(body.jobPosting || ''), MAX_JOB)
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400, headers: h })
  }

  if (!resumeText || !jobPosting) return Response.json({ error: 'Resume and Job descriptions are required.' }, { status: 400, headers: h })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return Response.json({ error: 'API key not configured.' }, { status: 500, headers: h })

  // Read Master Reference (if available) to inject proprietary knowledge
  let masterGuide = ''
  try {
    const p = path.join(process.cwd(), 'MASTER_CAREER_REFERENCE.md')
    if (fs.existsSync(p)) masterGuide = fs.readFileSync(p, 'utf-8').slice(0, 30000) // First 30k chars as seed
  } catch (e) {
    console.warn("Could not read MASTER_CAREER_REFERENCE.md", e)
  }

  rateEntry.count += 1
  ipStore.set(ip, rateEntry)

  const prompt = `You are an expert career coach and ATS specialist. 
Analyze the resume and job posting carefully in the context of global best practices.
If you lack specific details about a country's market context, visas, or salaries, USE THE GOOGLE SEARCH TOOL to find live data and augment your answer.

Use this proprietary career knowledge to aid your analysis:
${masterGuide}

---
RESUME:
${resumeText}

---
JOB POSTING:
${jobPosting}

---
You MUST output your response using EXACTLY the following 12 section headers, preceded by "### ", and followed by your detailed analysis. Do not use JSON. Do not deviate from the keys:

### resumeScore
[Content: ATS SCORE /100, keywords found/missing, summary]
### coverLetter
[Content: 3-paragraph tailored cover letter]
### resumeRewrite
[Content: Full rewritten resume]
### skillsGap
[Content: Hard/soft skills matching and top 3 actions]
### interviewPrep
[Content: 5 expected questions and strategies]
### starStories
[Content: 3 tailored STAR behavioral stories]
### linkedinSummary
[Content: Tailored LinkedIn About section]
### introScripts
[Content: 1-min, 2-min, 3-min introduction scripts]
### matchingJobs
[Content: 5 similar roles to consider]
### thankYouEmail
[Content: Post-interview email template]
### salaryNegotiation
[Content: Market salary research (search if needed), scripts, what to avoid]
### actionPlan
[Content: 30-60-90 day onboarding plan]
`

  for (const { name, timeout } of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${name}:streamGenerateContent?alt=sse&key=${apiKey}`
      const reqBody = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
      })

      if (!res.ok) {
        console.warn(`Model ${name} failed with status: ${res.status}`)
        continue
      }

      // Stream the SSE response directly to the client as a readable stream
      const stream = new ReadableStream({
        async start(controller) {
          const reader = res.body.getReader()
          const decoder = new TextDecoder()
          let buffer = ''
          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              buffer += decoder.decode(value, { stream: true })
              const lines = buffer.split('\\n')
              buffer = lines.pop()
              for (let line of lines) {
                line = line.trim()
                if (line.startsWith('data: ')) {
                  const dataStr = line.slice(6).trim()
                  if (dataStr === '[DONE]') continue
                  try {
                    const data = JSON.parse(dataStr)
                    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
                    if (text) controller.enqueue(new TextEncoder().encode(text))
                  } catch (e) { } // Ignore malformed JSON in partial blocks
                }
              }
            }
          } catch (e) {
            console.error(e)
          } finally {
            controller.close()
          }
        }
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          ...h
        }
      })
    } catch (e) {
      console.warn(`Model ${name} stream fetch failed`, e)
    }
  }

  // Refund count if completely failed
  rateEntry.count = Math.max(0, rateEntry.count - 1)
  ipStore.set(ip, rateEntry)
  return Response.json({ error: 'AI failed to generate response. Please try again.' }, { status: 500, headers: h })
}
