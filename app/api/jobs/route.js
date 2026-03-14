// Google Jobs live search via Serper.dev
// Free: 2,500 searches/month at serper.dev — set SERPER_API_KEY in .env.local

export const maxDuration = 30

const jobsRateStore = new Map()
const JOBS_LIMIT = 10   // searches per hour per IP
const HOUR_MS = 3_600_000

function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Cache-Control': 'no-store',
  }
}

function getIP(req) {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  )
}

export async function POST(req) {
  const headers = securityHeaders()

  // Rate limit
  const ip = getIP(req)
  const now = Date.now()
  let entry = jobsRateStore.get(ip) || { count: 0, reset: now + HOUR_MS }
  if (now > entry.reset) { entry = { count: 0, reset: now + HOUR_MS } }
  if (entry.count >= JOBS_LIMIT) {
    return Response.json({ error: 'Job search rate limit reached (10/hr). Try later.' }, { status: 429, headers })
  }
  entry.count++
  jobsRateStore.set(ip, entry)

  const apiKey = process.env.SERPER_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'SERPER_API_KEY not configured. Add it to .env.local and Vercel env vars.' }, { status: 503, headers })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400, headers })
  }

  const jobTitle = String(body.jobTitle || '').trim().slice(0, 200)
  const location = String(body.location || '').trim().slice(0, 100)
  const timeframe = String(body.timeframe || 'w2').trim()  // qdr:w2 = last 2 weeks

  if (!jobTitle) {
    return Response.json({ error: 'jobTitle is required' }, { status: 400, headers })
  }

  // Build query: "software engineer jobs toronto"
  const q = location
    ? `${jobTitle} jobs ${location}`
    : `${jobTitle} jobs`

  try {
    const serperRes = await fetch('https://google.serper.dev/jobs', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q,
        tbs: `qdr:${timeframe}`,   // last 2 weeks by default
        num: 10,
      }),
    })

    if (!serperRes.ok) {
      const errText = await serperRes.text()
      console.error('Serper error:', serperRes.status, errText)
      return Response.json({ error: `Search service error: ${serperRes.status}` }, { status: 502, headers })
    }

    const data = await serperRes.json()
    const jobs = (data.jobs || []).map(job => ({
      title:    job.title        || 'Untitled',
      company:  job.companyName  || 'Unknown Company',
      location: job.location     || location || 'Location not specified',
      via:      job.via          || '',
      link:     job.link         || '#',
      posted:   (job.extensions && job.extensions[0]) || '',
      jobType:  (job.extensions && job.extensions[1]) || '',
      salary:   (job.extensions && job.extensions.find(e => e.includes('$'))) || '',
      snippet:  job.description  || '',
    }))

    return Response.json({ jobs, query: q, count: jobs.length }, { headers })

  } catch (err) {
    console.error('Jobs fetch error:', err)
    return Response.json({ error: 'Failed to fetch jobs. Check SERPER_API_KEY.' }, { status: 500, headers })
  }
}
