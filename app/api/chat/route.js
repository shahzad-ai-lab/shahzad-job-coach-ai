// Alfalah AI — Career + App Chatbot powered by Gemini
// Free to use — same GEMINI_API_KEY, separate rate limit from /api/analyze

export const maxDuration = 30

const chatRateStore = new Map()
const CHAT_LIMIT = 9999   // disabled for dev — re-enable per-IP in production
const HOUR_MS = 3_600_000

const SYSTEM_PROMPT = `You are Alfalah AI — "الفلاح" means "Come to Success" in Arabic. You are the AI assistant embedded in the Alfalah AI career platform, built to help ALL humans globally — students, refugees, career changers, seniors, single parents, people from any country — get fair access to career opportunities.

YOUR SCOPE (discuss all of these):
- How to use Alfalah AI tools (resume analyzer, skills assessment, all 17 AI cards)
- Resume writing, ATS optimization, formatting
- Job search strategy, where to apply, how to stand out
- Interview preparation, STAR stories, common questions
- Salary negotiation scripts and market ranges by country
- Skills gaps, certifications, upskilling roadmaps
- LinkedIn optimization and recruiter attraction
- Cover letters and cold outreach messages
- Career pivots and adjacent role targeting
- Visa and immigration pathways for work abroad (all 195 countries)
- Freelance/contract/fractional work opportunities
- 2026 job market trends, in-demand skills, AI impact on jobs
- Country-specific job markets, top companies, hiring culture
- Emotional support and motivation for job seekers

ABOUT THE PLATFORM:
- 17 free AI tools: ATS Score, Recruiter POV, Cover Letter, Resume Rewrite, Skills Gap, Interview Prep, STAR Stories, LinkedIn Summary, Intro Scripts, Matching Jobs, Visa Pathways, Thank You Email, Salary Negotiation, Action Plan, Cold Outreach, Career Pivot, Country Laws
- /assess page: Free 0-100 skills assessment — 7 categories, 195 countries, age 10 to 100
- 100% free, no login, zero data stored, all humanity welcome

IF completely off-topic: "I'm Alfalah AI — your career success partner. Ask me about careers, jobs, immigration, or how to use this platform!"

STYLE: Warm, direct, honest. 2-4 sentences per response. Use • bullets for lists. Speak plainly — you serve the underserved from 195 countries.

2026 CONTEXT: AI replacing 30% of tasks but creating new roles. Skills that matter: AI prompting, data literacy, human judgment. Trades + care work recession-proof. Remote work standard. Visa pathways opening globally.

ALFALAH MEANING: الفلاح (Al-Falah) = Success, Prosperity — used across Arabic, Urdu, Islamic tradition. This platform embodies that mission.`

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

  const gemini1 = process.env.GEMINI_API_KEY   || null
  const gemini2 = process.env.GEMINI_API_KEY_2 || null
  const grokKey = process.env.GROK_API_KEY     || null
  if (!gemini1 && !gemini2 && !grokKey) {
    return Response.json({ error: 'No AI API key configured.' }, { status: 503, headers })
  }

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
    `${m.role === 'user' ? 'User' : 'Alfalah AI'}: ${String(m.content).slice(0, 500)}`
  ).join('\n')

  const prompt = `${SYSTEM_PROMPT}\n\n--- CONVERSATION ---\n${conversationText}\n\nAlfalah AI:`

  const CHAT_MODELS = ['gemini-2.0-flash', 'gemini-flash-latest', 'gemini-2.0-flash-lite', 'gemini-1.5-flash']

  // Try Gemini keys first (key1, then key2)
  for (const key of [gemini1, gemini2].filter(Boolean)) {
    for (const model of CHAT_MODELS) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
          {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.8, maxOutputTokens: 512 },
            }),
          }
        )
        const data = await res.json()
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (reply) return Response.json({ reply: reply.trim() }, { headers })
      } catch {}
    }
  }

  // Grok fallback
  if (grokKey) {
    try {
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${grokKey}` },
        body: JSON.stringify({
          model: 'grok-4-latest',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8, max_tokens: 512,
        }),
      })
      const data = await res.json()
      const reply = data?.choices?.[0]?.message?.content
      if (reply) return Response.json({ reply: reply.trim() }, { headers })
    } catch {}
  }

  entry.count = Math.max(0, entry.count - 1)
  chatRateStore.set(ip, entry)
  return Response.json({ error: 'AI unavailable. Try again in a moment.' }, { status: 503, headers })
}
