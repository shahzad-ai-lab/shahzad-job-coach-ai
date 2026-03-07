export const maxDuration = 60

const MAX_RESUME = 6000
const MAX_JOB = 3000

function truncate(text, max) {
  return text.length > max ? text.slice(0, max) : text
}

const MODELS = [
  { name: 'gemini-flash-latest',      timeout: 55000 },
  { name: 'gemini-flash-lite-latest', timeout: 55000 },
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
          generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
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

  const prompt = `You are an expert career coach and ATS specialist. Analyze the resume and job posting. Return ONLY raw JSON with exactly these 9 keys. No markdown, no code blocks.

RESUME:
${resumeText}

JOB POSTING:
${jobPosting}

Return this JSON (fill every field with real detailed content):
{"coverLetter":"3-paragraph cover letter body, no date/subject, confident and specific tone","resumeRewrite":"full rewritten resume optimized for this job with strong action verbs and matched keywords","skillsGap":"HARD SKILLS MATCH:\\n- list matched hard skills\\n\\nHARD SKILLS MISSING:\\n- list missing hard skills\\n\\nSOFT SKILLS MATCH:\\n- list matched soft skills\\n\\nSOFT SKILLS MISSING:\\n- list missing soft skills\\n\\nTOP 3 ACTIONS:\\n1. ...\\n2. ...\\n3. ...","interviewPrep":"Q1: ...\\nStrategy: ...\\n\\nQ2: ...\\nStrategy: ...\\n\\nQ3: ...\\nStrategy: ...\\n\\nQ4: ...\\nStrategy: ...\\n\\nQ5: ...\\nStrategy: ...","starStories":"STORY 1:\\nS: ...\\nT: ...\\nA: ...\\nR: ...\\n\\nSTORY 2:\\nS: ...\\nT: ...\\nA: ...\\nR: ...\\n\\nSTORY 3:\\nS: ...\\nT: ...\\nA: ...\\nR: ...","linkedinSummary":"3-4 sentence first-person LinkedIn About section targeting this role","resumeScore":"ATS SCORE: XX/100\\n\\nKEYWORDS FOUND:\\n- list exact keywords from job posting found in resume\\n\\nKEYWORDS MISSING:\\n- list important keywords from job posting missing from resume\\n\\nHARD SKILLS: X/10\\nSOFT SKILLS: X/10\\nEXPERIENCE MATCH: X/10\\nEDUCATION MATCH: X/10\\n\\nSCORE BREAKDOWN:\\nWhat is strong and what needs improvement in 2-3 sentences.","introScripts":"1-MINUTE INTRO (HR Screen):\\nHello, my name is [Name]. I am a [title] with [X] years of experience in [key skills]. Most recently at [company] where I [key achievement]. I am excited about this [role] because [specific reason]. I believe my background in [skill] directly matches what you are looking for.\\n\\n2-MINUTE INTRO (Hiring Manager):\\nThank you for meeting with me. I am [Name], a [title] specializing in [area]. Over [X] years I have [key accomplishment 1] and [key accomplishment 2]. At [company] I [specific project with result]. I am particularly drawn to this role because [company-specific reason]. My goal is to [contribution to team/company].\\n\\n3-MINUTE INTRO (Technical Round):\\nHi, I am [Name]. Technically I specialize in [hard skills list]. I have built [type of systems/products]. One project I am proud of: [specific technical project, tech stack used, problem solved, measurable result]. I stay current by [learning habits]. For this role the technical challenge I find most exciting is [specific technical aspect of the job].","matchingJobs":"JOBS TO APPLY FOR NEXT:\\n\\n1. [Job Title] at [Type of Company]\\nWhy match: [reason]\\nKeywords to add: [keywords]\\n\\n2. [Job Title] at [Type of Company]\\nWhy match: [reason]\\nKeywords to add: [keywords]\\n\\n3. [Job Title] at [Type of Company]\\nWhy match: [reason]\\nKeywords to add: [keywords]\\n\\n4. [Job Title] at [Type of Company]\\nWhy match: [reason]\\nKeywords to add: [keywords]\\n\\n5. [Job Title] at [Type of Company]\\nWhy match: [reason]\\nKeywords to add: [keywords]"}`

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

  const keys = ['coverLetter','resumeRewrite','skillsGap','interviewPrep','starStories','linkedinSummary','resumeScore','introScripts','matchingJobs']
  for (const key of keys) {
    if (!parsed[key] || typeof parsed[key] !== 'string') {
      parsed[key] = 'Not generated. Please try again.'
    }
  }

  return Response.json(parsed)
}
