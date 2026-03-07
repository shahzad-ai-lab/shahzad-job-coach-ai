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
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
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

  const prompt = `You are an expert career coach and ATS specialist. Analyze the resume and job posting. Return ONLY raw JSON with exactly these 12 keys. No markdown, no code blocks.

RESUME:
${resumeText}

JOB POSTING:
${jobPosting}

Return this JSON (fill every field with real detailed content):
{"coverLetter":"3-paragraph cover letter body, no date/subject, confident and specific tone","resumeRewrite":"full rewritten resume optimized for this job with strong action verbs and matched keywords","skillsGap":"HARD SKILLS MATCH:\\n- list matched hard skills\\n\\nHARD SKILLS MISSING:\\n- list missing hard skills\\n\\nSOFT SKILLS MATCH:\\n- list matched soft skills\\n\\nSOFT SKILLS MISSING:\\n- list missing soft skills\\n\\nTOP 3 ACTIONS:\\n1. ...\\n2. ...\\n3. ...","interviewPrep":"Q1: ...\\nStrategy: ...\\n\\nQ2: ...\\nStrategy: ...\\n\\nQ3: ...\\nStrategy: ...\\n\\nQ4: ...\\nStrategy: ...\\n\\nQ5: ...\\nStrategy: ...","starStories":"STORY 1:\\nS: ...\\nT: ...\\nA: ...\\nR: ...\\n\\nSTORY 2:\\nS: ...\\nT: ...\\nA: ...\\nR: ...\\n\\nSTORY 3:\\nS: ...\\nT: ...\\nA: ...\\nR: ...","linkedinSummary":"3-4 sentence first-person LinkedIn About section targeting this role","resumeScore":"ATS SCORE: XX/100\\n\\nKEYWORDS FOUND:\\n- keyword1\\n- keyword2\\n\\nKEYWORDS MISSING:\\n- keyword1\\n- keyword2\\n\\nHARD SKILLS SCORE: X/10\\nSOFT SKILLS SCORE: X/10\\nEXPERIENCE MATCH: X/10\\nEDUCATION MATCH: X/10\\n\\nSUMMARY: 2-3 sentences on strengths and gaps.","introScripts":"1-MINUTE INTRO (HR Screen):\\n[full script]\\n\\n2-MINUTE INTRO (Hiring Manager):\\n[full script]\\n\\n3-MINUTE INTRO (Technical Round):\\n[full script including tech stack and project example]","matchingJobs":"RECOMMENDED JOBS TO APPLY FOR:\\n\\n1. [Job Title] at [Company Type]\\nWhy: [reason]\\nAdd keywords: [keywords]\\n\\n2. [Job Title] at [Company Type]\\nWhy: [reason]\\nAdd keywords: [keywords]\\n\\n3. [Job Title] at [Company Type]\\nWhy: [reason]\\nAdd keywords: [keywords]\\n\\n4. [Job Title] at [Company Type]\\nWhy: [reason]\\nAdd keywords: [keywords]\\n\\n5. [Job Title] at [Company Type]\\nWhy: [reason]\\nAdd keywords: [keywords]","thankYouEmail":"SUBJECT: Thank you – [Role] Interview\\n\\nDear [Hiring Manager Name],\\n\\n[Paragraph 1: Thank them, reference something specific from the interview]\\n\\n[Paragraph 2: Reinforce your top 2 qualifications for the role]\\n\\n[Paragraph 3: Express enthusiasm and next steps]\\n\\nBest regards,\\n[Your Name]","salaryNegotiation":"SALARY RESEARCH:\\nExpected range for this role: $XX,000 – $XX,000\\n\\nOPENING STATEMENT:\\n[Script to use when they ask your salary expectations]\\n\\nCOUNTEROFFER SCRIPT:\\n[Script when they give you an offer below your target]\\n\\nBENEFITS TO NEGOTIATE:\\n- [benefit 1]\\n- [benefit 2]\\n- [benefit 3]\\n\\nNEVER SAY:\\n- [mistake 1]\\n- [mistake 2]","actionPlan":"30-DAY PLAN (Learn & Listen):\\n- Week 1: [actions]\\n- Week 2: [actions]\\n- Week 3: [actions]\\n- Week 4: [actions]\\n\\n60-DAY PLAN (Contribute):\\n- [key contributions and goals]\\n\\n90-DAY PLAN (Lead):\\n- [leadership actions and measurable outcomes]\\n\\nFIRST DAY CHECKLIST:\\n- [item 1]\\n- [item 2]\\n- [item 3]\\n- [item 4]\\n- [item 5]"}`

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

  const keys = ['coverLetter','resumeRewrite','skillsGap','interviewPrep','starStories','linkedinSummary','resumeScore','introScripts','matchingJobs','thankYouEmail','salaryNegotiation','actionPlan']
  for (const key of keys) {
    if (!parsed[key] || typeof parsed[key] !== 'string') {
      parsed[key] = 'Not generated. Please try again.'
    }
  }

  return Response.json(parsed)
}
