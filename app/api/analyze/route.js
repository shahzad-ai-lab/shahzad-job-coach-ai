import { GoogleGenerativeAI } from '@google/generative-ai'

export const maxDuration = 60

const MAX_TEXT_CHARS = 12000

function truncate(text, max = MAX_TEXT_CHARS) {
  if (text.length <= max) return text
  return text.slice(0, max) + '\n[truncated to fit limits]'
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function is429(err) {
  const msg = err?.message || ''
  return msg.includes('429') || msg.includes('quota') || msg.includes('rate') || err?.status === 429
}

// ── Gemini fallback chain (separate quota per model) ──────────────────────────
const GEMINI_MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro',
  'gemini-pro',
]

async function tryGemini(prompt) {
  if (!process.env.GEMINI_API_KEY) return null
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, { apiVersion: 'v1' })
  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent(prompt)
      console.log(`Gemini success with model: ${modelName}`)
      return result.response.text().trim()
    } catch (err) {
      console.warn(`Gemini ${modelName} failed: ${err?.message?.slice(0, 80)}`)
      if (is429(err)) await sleep(15000)
    }
  }
  return null
}

// ── Groq fallback (free tier: llama models, very fast) ────────────────────────
async function tryGroq(prompt) {
  if (!process.env.GROQ_API_KEY) return null
  const models = ['llama-3.3-70b-versatile', 'llama3-70b-8192', 'mixtral-8x7b-32768']
  for (const model of models) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 4096,
        }),
      })
      if (!res.ok) {
        const txt = await res.text()
        console.warn(`Groq ${model} failed: ${res.status} ${txt.slice(0, 80)}`)
        if (res.status === 429) await sleep(10000)
        continue
      }
      const data = await res.json()
      console.log(`Groq success with model: ${model}`)
      return data.choices[0]?.message?.content?.trim() || null
    } catch (err) {
      console.warn(`Groq ${model} error: ${err?.message?.slice(0, 80)}`)
    }
  }
  return null
}

// ── OpenRouter fallback (has free models) ─────────────────────────────────────
async function tryOpenRouter(prompt) {
  if (!process.env.OPENROUTER_API_KEY) return null
  const models = [
    'meta-llama/llama-3.3-70b-instruct:free',
    'mistralai/mistral-7b-instruct:free',
    'google/gemma-2-9b-it:free',
  ]
  for (const model of models) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://shahzad-job-coach-ai.vercel.app',
          'X-Title': 'Job Coach AI',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4096,
        }),
      })
      if (!res.ok) {
        console.warn(`OpenRouter ${model} failed: ${res.status}`)
        continue
      }
      const data = await res.json()
      const text = data.choices?.[0]?.message?.content?.trim()
      if (text) {
        console.log(`OpenRouter success with model: ${model}`)
        return text
      }
    } catch (err) {
      console.warn(`OpenRouter ${model} error: ${err?.message?.slice(0, 80)}`)
    }
  }
  return null
}

// ── Master call with all providers ───────────────────────────────────────────
async function callAI(prompt) {
  const raw = await tryGemini(prompt)
    ?? await tryGroq(prompt)
    ?? await tryOpenRouter(prompt)
  if (!raw) throw new Error('All AI providers failed or quota exceeded. Please try again in a few minutes.')
  return raw
}

function parseResponse(raw) {
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
  return JSON.parse(cleaned)
}

export async function POST(request) {
  try {
    const body = await request.json()
    const resumeText = truncate((body.resumeText || '').trim())
    const jobPosting = truncate((body.jobPosting || '').trim(), 6000)

    if (!resumeText) return Response.json({ error: 'Resume text is required.' }, { status: 400 })
    if (!jobPosting) return Response.json({ error: 'Job posting is required.' }, { status: 400 })

    const prompt = `You are an expert career coach and resume writer. Analyze the resume and job posting below, then return a JSON object with exactly these 6 keys. Each value must be a detailed, high-quality string.

RESUME:
${resumeText}

JOB POSTING:
${jobPosting}

Return ONLY valid JSON with these exact keys (no markdown, no code blocks, just raw JSON):
{
  "coverLetter": "3-paragraph personalized cover letter body (no date/subject). Confident, specific, human tone.",
  "resumeRewrite": "Full rewritten resume optimized for this job. Strong action verbs, keywords matched, achievements quantified.",
  "skillsGap": "Section 1: MATCHING SKILLS (bullet list). Section 2: MISSING SKILLS (bullet list). Section 3: TOP 3 RECOMMENDATIONS to close the gap.",
  "interviewPrep": "5 likely interview questions with answer strategies. Format: Q1: [question]\\nStrategy: [answer approach]",
  "starStories": "3 STAR stories (Situation/Task/Action/Result) the candidate can use for this role. Label each section.",
  "linkedinSummary": "3-4 sentence first-person LinkedIn About summary targeting this role. Compelling and professional."
}`

    let raw
    try {
      raw = await callAI(prompt)
    } catch (err) {
      return Response.json({ error: err.message }, { status: 503 })
    }

    let parsed
    try {
      parsed = parseResponse(raw)
    } catch {
      console.error('JSON parse error. Raw:', raw.slice(0, 300))
      return Response.json({ error: 'AI returned unexpected format. Please try again.' }, { status: 500 })
    }

    const required = ['coverLetter', 'resumeRewrite', 'skillsGap', 'interviewPrep', 'starStories', 'linkedinSummary']
    for (const key of required) {
      if (!parsed[key]) parsed[key] = 'No content generated for this section. Please try again.'
    }

    return Response.json(parsed)
  } catch (error) {
    console.error('Analyze route error:', error?.message || error)
    return Response.json({ error: 'Unexpected error. Please try again.' }, { status: 500 })
  }
}
