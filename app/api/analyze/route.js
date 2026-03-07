import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  try {
    const { resumeText, jobPosting } = await request.json()

    if (!resumeText || !jobPosting) {
      return Response.json({ error: 'Resume and job posting are required' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompts = {
      coverLetter: `You are an expert career coach. Write a compelling, personalized cover letter based on this resume and job posting. Make it sound human, confident, and specific. 3 paragraphs max.

RESUME:
${resumeText}

JOB POSTING:
${jobPosting}

Write only the cover letter body, no subject line or date.`,

      resumeRewrite: `You are an expert resume writer. Rewrite the resume below so it is optimized for this specific job posting. Use strong action verbs, quantify achievements where possible, and match keywords from the job posting.

RESUME:
${resumeText}

JOB POSTING:
${jobPosting}

Return the rewritten resume in clean text format.`,

      skillsGap: `You are a career advisor. Analyze the resume against the job posting and identify:
1. MATCHING SKILLS (what the candidate already has)
2. MISSING SKILLS (gaps to address)
3. TOP 3 RECOMMENDATIONS to close the gap fast

RESUME:
${resumeText}

JOB POSTING:
${jobPosting}

Be specific and actionable.`,

      interviewPrep: `You are an interview coach. Based on this resume and job posting, generate 5 likely interview questions the candidate will face, plus a strong answer strategy for each.

RESUME:
${resumeText}

JOB POSTING:
${jobPosting}

Format as: Question → Answer Strategy`,

      starStories: `You are a career coach. Based on this resume, write 3 STAR (Situation, Task, Action, Result) stories the candidate can use in interviews for this role. Make them specific and impressive.

RESUME:
${resumeText}

JOB POSTING:
${jobPosting}

Format each story clearly with STAR labels.`,

      linkedinSummary: `You are a LinkedIn branding expert. Write a powerful LinkedIn About section summary for this candidate targeting this type of role. Make it compelling, first-person, and 3-4 sentences.

RESUME:
${resumeText}

JOB POSTING:
${jobPosting}`,
    }

    const results = {}
    const keys = Object.keys(prompts)

    await Promise.all(
      keys.map(async (key) => {
        try {
          const result = await model.generateContent(prompts[key])
          results[key] = result.response.text()
        } catch (err) {
          results[key] = `Error generating ${key}. Please try again.`
        }
      })
    )

    return Response.json(results)
  } catch (error) {
    console.error('Analyze error:', error)
    return Response.json({ error: 'Failed to analyze. Please try again.' }, { status: 500 })
  }
}
