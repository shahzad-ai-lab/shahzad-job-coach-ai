export const maxDuration = 60

const MAX_RESUME = 12000
const MAX_JOB = 6000

function truncate(text, max) {
  return text.length > max ? text.slice(0, max) : text
}

// Direct REST call — no SDK, no version issues, 8s timeout per attempt
async function geminiRest(modelId, prompt, apiKey) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models/${modelId}:generateContent?key=${apiKey}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    })
    clearTimeout(timer)
    const data = await res.json()
    if (!res.ok) {
      const errMsg = data?.error?.message || `HTTP ${res.status}`
      throw Object.assign(new Error(errMsg), { status: res.status })
    }
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null
  } catch (err) {
    clearTimeout(timer)
    throw err
  }
}

// Try models in order — skip on any error, no waiting
async function callGemini(prompt) {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY not set')

  const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-pro']
  const errors = []

  for (const model of models) {
    try {
      const text = await geminiRest(model, prompt, key)
      if (text) {
        console.log(`Success with ${model}`)
        return text
      }
    } catch (err) {
      const msg = err?.message || ''
      errors.push(`${model}: ${msg.slice(0, 60)}`)
      console.warn(`${model} failed: ${msg.slice(0, 80)}`)
      // On 429 skip to next immediately — no sleeping, avoid timeout
      // On 404 skip to next
      // On abort (timeout) skip to next
    }
  }
  throw new Error(`All models failed. Errors: ${errors.join(' | ')}`)
}

function cleanJSON(raw) {
  return raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
}

export async function POST(request) {
  let resumeText, jobPosting
  try {
    const body = await request.json()
    resumeText = truncate((body.resumeText || '').trim(), MAX_RESUME)
    jobPosting = truncate((body.jobPosting || '').trim(), MAX_JOB)
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (!resumeText) return Response.json({ error: 'Resume text is required.' }, { status: 400 })
  if (!jobPosting) return Response.json({ error: 'Job posting is required.' }, { status: 400 })

  const prompt = `You are an expert career coach. Analyze the resume and job posting below.
Return ONLY a valid JSON object with exactly these 6 keys. No markdown, no code blocks, no extra text — raw JSON only.

RESUME:
${resumeText}

JOB POSTING:
${jobPosting}

JSON format (fill each value with detailed content):
{
  "coverLetter": "3-paragraph cover letter body. Confident, specific, human tone. No date or subject line.",
  "resumeRewrite": "Full rewritten resume optimized for this job. Action verbs, quantified achievements, matched keywords.",
  "skillsGap": "MATCHING SKILLS:\\n- list\\n\\nMISSING SKILLS:\\n- list\\n\\nTOP 3 RECOMMENDATIONS:\\n1. ...\\n2. ...\\n3. ...",
  "interviewPrep": "Q1: [question]\\nStrategy: [answer approach]\\n\\nQ2: [question]\\nStrategy: [answer approach]\\n\\n(5 total)",
  "starStories": "STORY 1:\\nSituation: ...\\nTask: ...\\nAction: ...\\nResult: ...\\n\\n(3 stories total)",
  "linkedinSummary": "3-4 sentence first-person LinkedIn About section. Compelling and professional."
}`

  let raw
  try {
    raw = await callGemini(prompt)
  } catch (err) {
    console.error('callGemini failed:', err.message)
    return Response.json(
      { error: 'AI unavailable right now. Please wait 1 minute and try again.' },
      { status: 503 }
    )
  }

  let parsed
  try {
    parsed = JSON.parse(cleanJSON(raw))
  } catch {
    // Gemini sometimes adds commentary — try to extract JSON block
    const match = raw.match(/\{[\s\S]*\}/)
    if (match) {
      try { parsed = JSON.parse(match[0]) } catch { /* fall through */ }
    }
    if (!parsed) {
      console.error('JSON parse failed. Raw snippet:', raw.slice(0, 200))
      return Response.json({ error: 'AI returned unexpected format. Please try again.' }, { status: 500 })
    }
  }

  const keys = ['coverLetter', 'resumeRewrite', 'skillsGap', 'interviewPrep', 'starStories', 'linkedinSummary']
  for (const key of keys) {
    if (!parsed[key] || typeof parsed[key] !== 'string') {
      parsed[key] = 'Content not generated. Please try again.'
    }
  }

  return Response.json(parsed)
}
