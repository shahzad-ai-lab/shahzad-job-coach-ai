export const maxDuration = 60

const MAX_RESUME = 12000
const MAX_JOB = 6000

function truncate(text, max) {
  return text.length > max ? text.slice(0, max) : text
}

// CONFIRMED working models — gemini-flash-latest verified 200 OK
const MODELS = [
  'gemini-flash-latest',     // CONFIRMED WORKING
  'gemini-flash-lite-latest',// fallback alias
  'gemini-pro-latest',       // fallback
  'gemini-2.5-flash',        // newest fallback
]
const API_VERSION = 'v1beta'

async function callGemini(prompt, apiKey) {
  const errors = []
  for (const model of MODELS) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 9000)
    try {
      const url = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${model}:generateContent?key=${apiKey}`
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
      if (res.ok) {
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) {
          console.log(`Success: ${model}`)
          return text
        }
        errors.push(`${model}: empty response`)
        continue
      }
      const errMsg = data?.error?.message || `HTTP ${res.status}`
      errors.push(`${model}: ${errMsg.slice(0, 80)}`)
      console.warn(`${model} failed: ${errMsg.slice(0, 80)}`)
      // On 429 try next model (different quota pool)
      // On 404 try next model
    } catch (err) {
      clearTimeout(timer)
      errors.push(`${model}: ${err.message?.slice(0, 60) || 'timeout'}`)
      console.warn(`${model} exception: ${err.message?.slice(0, 60)}`)
    }
  }
  throw new Error(`All models failed: ${errors.join(' | ')}`)
}

function extractJSON(raw) {
  // Remove markdown fences
  let cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()
  // Try direct parse
  try { return JSON.parse(cleaned) } catch {}
  // Extract first {...} block
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (match) {
    try { return JSON.parse(match[0]) } catch {}
  }
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
  if (!apiKey) return Response.json({ error: 'API key not configured.' }, { status: 500 })

  const prompt = `You are an expert career coach. Analyze the resume and job posting below.
Return ONLY a valid JSON object with exactly these 6 keys. No markdown, no code blocks, raw JSON only.

RESUME:
${resumeText}

JOB POSTING:
${jobPosting}

Return this exact JSON structure with detailed content for each field:
{
  "coverLetter": "Write a 3-paragraph cover letter body here. Confident, specific, human tone. No date or subject line.",
  "resumeRewrite": "Write the full rewritten resume here optimized for this job.",
  "skillsGap": "MATCHING SKILLS:\\n- skill1\\n- skill2\\n\\nMISSING SKILLS:\\n- skill1\\n- skill2\\n\\nTOP 3 RECOMMENDATIONS:\\n1. action\\n2. action\\n3. action",
  "interviewPrep": "Q1: question here\\nStrategy: answer strategy\\n\\nQ2: question\\nStrategy: strategy\\n\\nQ3: question\\nStrategy: strategy\\n\\nQ4: question\\nStrategy: strategy\\n\\nQ5: question\\nStrategy: strategy",
  "starStories": "STORY 1:\\nSituation: ...\\nTask: ...\\nAction: ...\\nResult: ...\\n\\nSTORY 2:\\nSituation: ...\\nTask: ...\\nAction: ...\\nResult: ...\\n\\nSTORY 3:\\nSituation: ...\\nTask: ...\\nAction: ...\\nResult: ...",
  "linkedinSummary": "Write 3-4 sentence first-person LinkedIn About section here."
}`

  let raw
  try {
    raw = await callGemini(prompt, apiKey)
  } catch (err) {
    console.error('callGemini error:', err.message)
    return Response.json({ error: 'AI service error: ' + err.message }, { status: 503 })
  }

  const parsed = extractJSON(raw)
  if (!parsed) {
    console.error('JSON extract failed. Raw snippet:', raw?.slice(0, 200))
    return Response.json({ error: 'AI returned unexpected format. Please try again.' }, { status: 500 })
  }

  const keys = ['coverLetter', 'resumeRewrite', 'skillsGap', 'interviewPrep', 'starStories', 'linkedinSummary']
  for (const key of keys) {
    if (!parsed[key] || typeof parsed[key] !== 'string') {
      parsed[key] = 'Content not generated for this section. Please try again.'
    }
  }

  return Response.json(parsed)
}
