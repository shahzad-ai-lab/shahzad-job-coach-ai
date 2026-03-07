import { GoogleGenerativeAI } from '@google/generative-ai'

export const maxDuration = 60

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, { apiVersion: 'v1' })

const MAX_TEXT_CHARS = 12000

function truncate(text, max = MAX_TEXT_CHARS) {
  if (text.length <= max) return text
  return text.slice(0, max) + '\n[truncated to fit limits]'
}

export async function POST(request) {
  try {
    const body = await request.json()
    const resumeText = truncate((body.resumeText || '').trim())
    const jobPosting = truncate((body.jobPosting || '').trim(), 6000)

    if (!resumeText) {
      return Response.json({ error: 'Resume text is required.' }, { status: 400 })
    }
    if (!jobPosting) {
      return Response.json({ error: 'Job posting is required.' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

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

    let raw = ''
    try {
      const result = await model.generateContent(prompt)
      raw = result.response.text().trim()
    } catch (apiErr) {
      console.error('Gemini API error:', apiErr?.message || apiErr)
      return Response.json(
        { error: `AI service error: ${apiErr?.message || 'Please try again.'}` },
        { status: 502 }
      )
    }

    // Strip markdown code fences if Gemini wraps response
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch (parseErr) {
      console.error('JSON parse error. Raw response:', raw.slice(0, 500))
      return Response.json(
        { error: 'AI returned an unexpected format. Please try again.' },
        { status: 500 }
      )
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
