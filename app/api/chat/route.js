// Career Chatbot — powered by Gemini, locked to career topics only
// Free to use — same GEMINI_API_KEY, separate rate limit from /api/analyze

export const maxDuration = 30

const chatRateStore = new Map()
const CHAT_LIMIT = 15   // messages per hour per IP
const HOUR_MS = 3_600_000

const SYSTEM_PROMPT = `You are Job Coach AI — a specialized career assistant embedded in this platform. You were built to help ALL humans globally — students, refugees, career changers, seniors, single parents, people with no connections — get fair access to career opportunities.

YOUR SCOPE (only discuss these topics):
- Resume writing, ATS optimization, formatting
- Job search strategy, where to apply, how to stand out
- Interview preparation, STAR stories, common questions
- Salary negotiation scripts and market ranges
- Skills gaps, certifications, upskilling roadmaps
- LinkedIn optimization and recruiter attraction
- Cover letters and cold outreach messages
- Career pivots and adjacent role targeting
- Visa and immigration pathways for work abroad
- Freelance/contract/fractional work opportunities
- 2026 job market trends, in-demand skills, AI impact on jobs
- Emotional support and motivation for job seekers

IF asked about anything unrelated to careers: "I'm your dedicated career coach — I focus entirely on helping you with jobs, careers, and professional growth. What career challenge can I help you tackle?"

STYLE: Be warm, direct, and honest. 2-4 sentences per response. Use • bullets for lists. No fluff. If someone is struggling, acknowledge it and give ONE concrete next step. You serve the underserved — speak plainly, not corporate.

2026 CONTEXT: AI is replacing 30% of tasks but creating new roles. Skills that matter: AI prompting, data literacy, human judgment, creative problem solving. Trades and care work are recession-proof. Remote work is standard. Visa pathways are opening globally for skilled workers.`

function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Cache-Control': 'no-store',
  }
}

function getIP(req) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
}

export async function POST(req) {
  const headers = securityHeaders()
  const ip = getIP(req)
  const now = Date.now()

  let entry = chatRateStore.get(ip) || { count: 0, reset: now + HOUR_MS }
  if (now > entry.reset) entry = { count: 0, reset: now + HOUR_MS }
  if (entry.count >= CHAT_LIMIT) {
    return Response.json({ error: 'Chat limit reached (15/hr). Try again later.' }, { status: 429, headers })
  }
  entry.count++
  chatRateStore.set(ip, entry)

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return Response.json({ error: 'API not configured.' }, { status: 503, headers })

  let messages
  try {
    const body = await req.json()
    messages = body.messages
    if (!Array.isArray(messages) || messages.length === 0) throw new Error('invalid')
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400, headers })
  }

  // Build conversation history for Gemini (last 10 messages max)
  const recent = messages.slice(-10)
  const conversationText = recent.map(m =>
    `${m.role === 'user' ? 'User' : 'Career Coach'}: ${String(m.content).slice(0, 500)}`
  ).join('\n')

  const prompt = `${SYSTEM_PROMPT}\n\n--- CONVERSATION ---\n${conversationText}\n\nCareer Coach:`

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 512 },
      }),
    })
    const data = await res.json()
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!reply) throw new Error('Empty response')
    return Response.json({ reply: reply.trim() }, { headers })
  } catch (err) {
    entry.count = Math.max(0, entry.count - 1)
    chatRateStore.set(ip, entry)
    return Response.json({ error: 'AI unavailable. Try again.' }, { status: 503, headers })
  }
}
