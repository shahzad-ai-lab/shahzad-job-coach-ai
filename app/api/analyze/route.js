export const maxDuration = 60

// Tighter limits = faster response = no timeout
const MAX_RESUME = 6000
const MAX_JOB = 3000

function truncate(text, max) {
  return text.length > max ? text.slice(0, max) : text
}

// gemini-flash-latest = CONFIRMED 200 OK. Give it full 55s timeout.
// gemini-flash-lite-latest = fallback (high demand but works)
const MODELS = [
  { name: 'gemini-flash-latest',     timeout: 55000 },
  { name: 'gemini-flash-lite-latest',timeout: 55000 },
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
          generationConfig: { temperature: 0.7, maxOutputTokens: 3000 },
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
  let resumeText, jobPosting
  try {
    const body = await request.json()
    resumeText = truncate((body.resumeText || '').trim(), MAX_RESUME)
    jobPosting = truncate((body.jobPosting || '').trim(), MAX_JOB)
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 })
  }

  if (!resumeText) return Response.json({ error: 'Resume text is required.' }, { status: 400 })
  if (!jobPosting) return Response.json({ error: 'Job posting is required.' }, { status: 400 })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return Response.json({ error: 'API key not configured on server.' }, { status: 500 })

  const prompt = `You are a career coach. Based on the resume and job posting below, return ONLY a raw JSON object with these 6 keys. No markdown, no explanation, just JSON.

RESUME:
${resumeText}

JOB POSTING:
${jobPosting}

JSON to return:
{"coverLetter":"3-paragraph cover letter body, no date/subject, confident tone","resumeRewrite":"rewritten resume optimized for this job with strong action verbs","skillsGap":"MATCHING SKILLS:\\n- ...\\n\\nMISSING SKILLS:\\n- ...\\n\\nTOP 3 ACTIONS:\\n1. ...","interviewPrep":"Q1: ...\\nStrategy: ...\\n\\nQ2: ...\\nStrategy: ...\\n\\nQ3: ...\\nStrategy: ...\\n\\nQ4: ...\\nStrategy: ...\\n\\nQ5: ...\\nStrategy: ...","starStories":"STORY 1:\\nS: ...\\nT: ...\\nA: ...\\nR: ...\\n\\nSTORY 2:\\nS: ...\\nT: ...\\nA: ...\\nR: ...\\n\\nSTORY 3:\\nS: ...\\nT: ...\\nA: ...\\nR: ...","linkedinSummary":"3-4 sentence first-person LinkedIn About section"}`

  let raw
  try {
    raw = await callGemini(prompt, apiKey)
  } catch (err) {
    console.error('callGemini error:', err.message)
    return Response.json({ error: err.message }, { status: 503 })
  }

  const parsed = extractJSON(raw)
  if (!parsed) {
    console.error('JSON parse failed. Raw:', raw?.slice(0, 300))
    return Response.json({ error: 'AI returned unexpected format. Please try again.' }, { status: 500 })
  }

  const keys = ['coverLetter', 'resumeRewrite', 'skillsGap', 'interviewPrep', 'starStories', 'linkedinSummary']
  for (const key of keys) {
    if (!parsed[key] || typeof parsed[key] !== 'string') {
      parsed[key] = 'Not generated. Please try again.'
    }
  }

  return Response.json(parsed)
}
