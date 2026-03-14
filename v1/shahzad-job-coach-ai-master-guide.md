# 🎯 Shahzad — Job Coach AI | Complete Master Reference Guide
### Owner: Shahzad | AI-Powered Job Application Assistant
### Stack: Next.js 14 + Gemini AI + Vercel | Built Twice: Practice Run → Real Hackathon
### Hackathon: March 6–8 | Submission Deadline: Sunday March 8, 12:00 PM EST Noon

---

## 📋 Table of Contents

1. Hackathon Mindset Rules
2. Critical Deadlines — Do Not Miss These
3. Product Overview
4. One Sentence Pitches
5. MVP Scope — What To Build vs What To Skip
6. 60-Second Demo Script
7. Submission Writeup — Ready To Copy Paste
8. Global Job Market Context
9. Tech Stack — Every Tool Justified
10. Complete File Structure — Every File and Its Reason
11. Architecture Diagram
12. 8-Hour Build Plan With Hard Checkpoints
13. Gemini API Setup — Free In 5 Minutes
14. Vercel Deployment Setup
15. Complete Codebase — Every File With Code
16. AI Prompt Engineering — All 5 Prompts
17. File Upload Handling
18. Error Handling — Every Failure Covered
19. File Size and Validation Limits
20. Cost Estimate — Everything Free
21. Build 1 vs Build 2 Tracker
22. Pre-Submission Checklist
23. Mistakes To Avoid
24. Troubleshooting Guide

---

## 1. Hackathon Mindset Rules

Read this before writing a single line of code.

The single most important rule:
Small + working + clear demo beats big + broken every single time.

| Rule | What It Means For This Project |
|------|-------------------------------|
| Ship early, polish later | Cover letter + gap analysis must work by Hour 3. Everything else is bonus. |
| One user, one problem | Person applying for a job right now who needs help fast |
| Show do not tell | Open app, upload resume, paste job posting, watch 6 outputs appear live |
| Judges decide in 60 seconds | The cover letter card appearing is your hook. Lead with it. |
| Demo must work on first try | Test the live URL 30 minutes before submission deadline |
| Video is not optional | If judges cannot watch your demo video they cannot score you |

Three questions every judge asks:
1. Does it actually work right now?
2. Would a real person use this today?
3. Did AI do something impressive here?

This project answers all three with yes.

---

## 2. Critical Deadlines

All times EST. Toronto is also EST in March.

| Action | Deadline | Note |
|--------|----------|------|
| Submit entry form | Thu Mar 5, 11:59 PM EST | Do this TONIGHT |
| Watch kickoff livestream | Fri Mar 6, 1:00 PM EST | Do NOT start coding before this |
| Start building | Fri Mar 6 after 1 PM EST | Rules say code must start AFTER kickoff |
| Mid-hackathon check-in | Sat Mar 7, 2:00 PM EST | Optional — post progress |
| Submit demo video and post | Sun Mar 8, 12:00 PM EST NOON | HARD DEADLINE no exceptions |
| Finals livestream | Sun Mar 8, 6:00 PM EST | Watch and celebrate |

Entry form needs:
- Team Name: Shahzad AI Lab
- Project Idea: Upload your resume and job posting to get a tailored cover letter, rewritten resume, skills gap analysis, interview scripts, and STAR stories in 60 seconds
- Category: SaaS Tool
- Tools: Google Gemini AI, Next.js, Vercel, Claude Code

Your build window is Saturday only — 8 focused hours.
Sunday morning is for recording demo video and submitting.

---

## 3. Product Overview

| Field | Value |
|-------|-------|
| Product Name | Job Coach AI |
| Tagline | Upload your resume. Paste the job. Land the interview. |
| Built By | Shahzad |
| Target User | Job seekers at any level — entry, mid, senior |
| Core Pain | Applying for jobs is time-consuming and most applications never get a response |
| AI Engine | Google Gemini 2.0 Flash (free) with fallback logic |
| Frontend | Next.js 14 + Tailwind CSS |
| Hosting | Vercel (free tier, auto-deploy) |
| File Upload | PDF, Word (.docx), plain text (.txt) |
| Total Cost | $0 |

What It Does — 6 Outputs From 2 Inputs:

User provides:
1. Their resume (uploaded file OR pasted text)
2. The job description (pasted text)
3. Their experience level (dropdown)

App delivers:
1. Tailored cover letter matching job description language
2. Rewritten resume bullets optimized for this specific role
3. Skills gap analysis — missing hard skills, soft skills, certifications, importance explained
4. Interview introduction scripts — 1 minute, 2 minute, 3 minute versions
5. STAR method stories — 3 to 7 stories calibrated to experience level
6. Hot job market data — which countries are hiring most for this role

---

## 4. One Sentence Pitches

Memorize the first one.

Demo pitch (say this while opening the app):
"Job Coach AI turns your resume and a job posting into a complete application package — cover letter, rewritten resume, skills gaps, interview scripts, and STAR stories — in under 60 seconds."

Submission form (1 sentence):
"Upload your resume and paste any job posting to instantly receive a tailored cover letter, resume rewrite, skills gap analysis, interview intro scripts, and STAR method stories."

To a judge who asks what it does:
"It is like having a career coach and resume writer available 24/7 for free. You give it your resume and the job you want. It tells you exactly what is missing and gives you everything you need to apply and interview confidently."

---

## 5. MVP Scope — What To Build vs What To Skip

CORE — Must work perfectly before anything else:

| Priority | Output | Why Core |
|----------|--------|----------|
| 1 | Cover Letter | Most visually impressive — judges see a full letter appear |
| 2 | Skills Gap Analysis | Most useful — tells users exactly what is missing |
| 3 | STAR Stories | Most unique — no other hackathon project will have this |

STANDARD — Build in Hours 4-5:

| Priority | Output | Notes |
|----------|--------|-------|
| 4 | Resume Rewrite | High value, takes more prompt tuning |
| 5 | Interview Scripts 1/2/3 min | Straightforward text output |

BONUS — Only if time allows:

| Priority | Output | Notes |
|----------|--------|-------|
| 6 | Job Market Insights by Country | Impressive data section, static content is fine |
| 7 | File upload PDF/Word | Nice to have — text paste works for demo |
| 8 | Copy to clipboard buttons | Polish feature |

NOT in scope — Do not build:
- User accounts or login
- Saving previous analyses
- Payments
- Database
- Email sending
- Multiple pages
- Mobile app

One page. Two inputs. Six output cards. That is the entire product.

---

## 6. 60-Second Demo Script

Practice this out loud three times. Time it. Stay under 90 seconds.

---

[Open browser to live Vercel URL. Have a real resume and real job posting ready.]

"Most people apply to jobs by sending the same resume to every company and wondering why they never hear back. Job Coach AI fixes that."

[Paste resume text into the resume field or upload a file]

"I am pasting my resume here — or you can upload a PDF or Word file."

[Paste a job description into the job description field]

"And here I paste the job description from any job board — LinkedIn, Indeed, wherever."

[Select experience level from dropdown]

"I select my experience level — let us say mid-level."

[Click the button]

"And I click Analyze My Application."

[Wait 8-12 seconds while loading spinner shows]

"It is calling Gemini AI right now and generating everything in parallel."

[Results appear — scroll slowly through each card]

"First — a complete cover letter written specifically for this job using the language from the posting itself."

[Scroll to gap analysis]

"Second — every skill, certification, and experience this job requires that my resume is missing, with an explanation of why each one matters."

[Scroll to STAR stories]

"Third — ready-to-use STAR method interview stories calibrated for my experience level. These are what interviewers actually want to hear."

[Scroll to interview scripts]

"And interview introduction scripts for 1 minute, 2 minutes, and 3 minutes."

[End — look at camera]

"Six outputs. Two inputs. Under 60 seconds. Free, no login, works for any job in any industry. This is Job Coach AI."

---

Demo tips:
- Use a real resume — even your own
- Use a real job posting you found online today
- Zoom in on the cover letter card — it should fill the screen impressively
- If API is slow say: "Gemini is generating all six outputs simultaneously right now..."
- Have a screenshot as backup in case live demo fails

---

## 7. Submission Writeup — Ready To Copy Paste

Copy this exactly into the submission post. Edit only the video link and live link.

```
Project Name: Job Coach AI

Team Name: Shahzad AI Lab

Team Members: Shahzad

What it does (1 sentence): Upload your resume and paste any job posting to instantly receive a tailored cover letter, rewritten resume bullets, skills gap analysis, interview introduction scripts, and STAR method stories — all in under 60 seconds.

Who it's for (1 sentence): Job seekers at any level who want to stop sending generic applications and start applying with confidence.

Demo video link: [YOUR VIDEO LINK HERE]

AI tools used: Google Gemini 2.0 Flash API for all AI generation, Claude Code in VS Code for development

Live link: [YOUR VERCEL URL HERE]

Biggest challenge you solved: Getting Gemini to generate six distinct high-quality outputs from two unstructured inputs reliably — without hallucinating job requirements or inventing experience the user does not have.
```

---

## 8. Global Job Market Context

Use this data in your demo to show real-world impact.

Top Countries Hiring Most Aggressively in 2026:

| Rank | Country | Hot Sectors | Demand |
|------|---------|-------------|--------|
| 1 | Canada | Tech, Healthcare, Trades, AI | Extreme |
| 2 | United States | AI/ML, Cybersecurity, Software, Finance | Extreme |
| 3 | Germany | Engineering, Manufacturing, IT, Healthcare | Very High |
| 4 | Australia | Mining, Healthcare, IT, Construction | Very High |
| 5 | United Kingdom | Finance, Tech, Healthcare, Education | High |
| 6 | UAE / Dubai | Tech, Finance, Construction, Hospitality | Very High |
| 7 | Singapore | Fintech, AI, Logistics, Biotech | Very High |
| 8 | Netherlands | Tech, Logistics, Agriculture, Finance | High |
| 9 | New Zealand | Healthcare, IT, Agriculture, Education | High |
| 10 | Sweden | Tech, Engineering, Gaming, Green Energy | High |

Hot Job Roles Globally in 2026:

| Role | Demand Level | Key Markets |
|------|-------------|-------------|
| AI/ML Engineer | Extreme | USA, Canada, UK, Singapore, Germany |
| Cybersecurity Analyst | Extreme | USA, Canada, Australia, UAE, UK |
| Cloud Architect | Very High | Global — all major markets |
| Data Scientist | Very High | USA, UK, Germany, Canada |
| Software Engineer | Very High | Global |
| Healthcare Nurses Doctors | Very High | Canada, Australia, Germany, UK |
| DevOps / SRE | High | USA, UK, Netherlands, Singapore |
| Product Manager | High | USA, UK, Canada, Australia |
| Skilled Trades | High | Canada, Australia, Germany, NZ |

Why This Section Makes Your App Win:
The Job Market card transforms Job Coach AI from a resume tool into a career strategy platform. When a user analyzes a Software Engineer job posting, show them the top 3 countries hiring for this role, salary range, and one immigration tip. No other hackathon project will have this.

---

## 9. Tech Stack — Every Tool Justified

| Tool | Purpose | Cost | Why This One |
|------|---------|------|-------------|
| Next.js 14 | Frontend + API routes | Free | Full-stack in one project, perfect for Vercel |
| Tailwind CSS | Styling | Free | Included in Next.js setup, fast to write |
| Google Gemini 2.0 Flash | AI generation | Free | 15 req/min, 1M tokens/day |
| Vercel | Hosting + deployment | Free | Connect GitHub, deploys in 2 minutes |
| pdf-parse | PDF text extraction | Free npm | Best PDF parser for Node.js |
| mammoth | Word .docx extraction | Free npm | Official docx parser, very reliable |
| Claude Code in VS Code | Writing all the code | Already paid | Your superpower — use it for everything |

Why Vercel Over Azure:
Azure Static Web Apps requires CLI setup, resource groups, app service plans, Key Vault — 45 minutes minimum. Vercel requires GitHub account and 2 minutes. In an 8-hour hackathon those 43 minutes matter.

Why Gemini 2.0 Flash:
Free with no credit card. Handles long resume and job description inputs. Returns structured text reliably. Fast enough for demo — 5 to 15 seconds per generation.

Model Selection Strategy:
- Cover letter: gemini-2.0-flash
- Resume rewrite: gemini-2.0-flash
- Gap analysis: gemini-2.0-flash
- Interview scripts: gemini-2.0-flash
- STAR stories: gemini-1.5-flash (slightly better quality for longer stories)
- Job market insights: static data — no API call needed

---

## 10. Complete File Structure — Every File and Its Reason

```
shahzad-job-coach-ai/
│
├── app/
│   ├── page.tsx                      # MAIN PAGE — entire UI lives here
│   ├── layout.tsx                    # Root layout, metadata, fonts
│   ├── globals.css                   # Tailwind base styles only
│   └── api/
│       ├── analyze/
│       │   └── route.ts              # MAIN API — calls Gemini, returns all 6 outputs
│       └── parse-file/
│           └── route.ts              # FILE PARSING API — PDF and Word extraction
│
├── components/
│   ├── LoadingState.tsx              # Spinner with rotating messages
│   ├── OutputCard.tsx                # Reusable card wrapper
│   ├── CoverLetterCard.tsx           # Formatted cover letter display with copy button
│   ├── GapAnalysisCard.tsx           # Skills gap with severity badges
│   ├── StarStoriesCard.tsx           # STAR stories with expand/collapse
│   ├── InterviewScriptsCard.tsx      # Tabbed 1/2/3 minute scripts
│   ├── ResumeRewriteCard.tsx         # Before/after bullet display
│   └── JobMarketCard.tsx             # Country and role demand data
│
├── lib/
│   ├── gemini.ts                     # Gemini client, model selection, retry logic
│   ├── prompts.ts                    # ALL 5 AI prompts — most important file
│   ├── fileParser.ts                 # PDF + Word + text extraction
│   ├── validator.ts                  # Input validation, size limits, sanitization
│   ├── rateLimiter.ts                # 10 requests per minute per IP
│   └── jobMarketData.ts              # Static country + role data — no API needed
│
├── types/
│   └── analysis.ts                   # TypeScript interfaces for all outputs
│
├── public/
│   └── sample-resume.txt             # Sample resume for judges to try demo
│
├── .env.local                        # GEMINI_API_KEY — never commit this
├── .env.example                      # Safe template — commit this
├── .gitignore                        # Must include .env.local
├── next.config.js                    # Body size limit for file uploads
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript config
└── package.json                      # All dependencies
```

Why Each File Exists:

| File | Reason |
|------|--------|
| app/api/analyze/route.ts | Keeps API key on server — never exposed to browser |
| app/api/parse-file/route.ts | Separate endpoint so file parsing errors do not crash the main analysis |
| lib/prompts.ts | All prompts in one place — easy to tune without touching other files |
| lib/fileParser.ts | Isolated file parsing — easy to debug when PDF breaks |
| lib/jobMarketData.ts | Static data — no API call, no latency, always works |
| types/analysis.ts | TypeScript safety — prevents runtime errors from bad AI responses |
| .env.example | Shows what variables are needed without exposing real keys |
| public/sample-resume.txt | Lets judges try demo without needing their own resume |

---

## 11. Architecture Diagram

```
BROWSER — User
     |
     |  1. User pastes resume + job description OR uploads file
     |  2. Selects experience level
     |  3. Clicks Analyze
     |
     v
NEXT.JS FRONTEND — Vercel CDN
app/page.tsx
     |
     |  4. File upload? POST to /api/parse-file first
     |  5. POST /api/analyze with resume text + job description + level
     |
     v
NEXT.JS API ROUTE — Vercel Serverless Function
app/api/analyze/route.ts
     |
     |-- lib/validator.ts     Validate inputs, check sizes, sanitize
     |-- lib/rateLimiter.ts   Block abuse (10 req/min/IP)
     |
     |  6. Build 5 prompts from lib/prompts.ts
     |  7. Call Gemini in parallel using Promise.allSettled
     |
     v
GOOGLE GEMINI API — Free Tier
     |
     |  8. Returns 5 structured responses
     |
     v
RESPONSE ASSEMBLY
     |
     |  9. Parse each response safely
     | 10. lib/jobMarketData.ts adds country data — no API call
     | 11. Return single JSON with all 6 outputs
     |
     v
BROWSER — React renders 6 output cards
     |
     | 12. User reads, copies, uses their complete application package
```

---

## 12. 8-Hour Build Plan With Hard Checkpoints

Saturday is your only build day. Follow this exactly.
If you miss a checkpoint, cut features — do not cut time.

### Hour 1 — Setup and First API Call

```
[ ] Get Gemini API key — aistudio.google.com — 5 minutes
[ ] npx create-next-app@latest shahzad-job-coach-ai --typescript --tailwind --app
[ ] cd shahzad-job-coach-ai
[ ] npm install @google/generative-ai pdf-parse mammoth
[ ] npm install -D @types/pdf-parse
[ ] Create .env.local — add GEMINI_API_KEY=your_key
[ ] echo ".env.local" >> .gitignore
[ ] Create lib/gemini.ts — basic client
[ ] Create lib/prompts.ts — cover letter prompt only
[ ] Create app/api/analyze/route.ts — single call, cover letter only
[ ] Test with curl or Postman — verify Gemini returns text
[ ] npm run dev — verify localhost:3000 loads
```

CHECKPOINT 1: Gemini returns a cover letter in the terminal.
If this takes more than 60 minutes something is wrong with the API key or package install. Fix before moving on.

### Hour 2 — All 5 Prompts Working

```
[ ] Add all 5 prompts to lib/prompts.ts
[ ] Create types/analysis.ts — TypeScript interfaces
[ ] Update route.ts — call all 5 prompts with Promise.allSettled
[ ] Add lib/jobMarketData.ts — static data only
[ ] Test: POST to /api/analyze returns all 6 outputs as JSON
[ ] Add lib/validator.ts — basic input checks
[ ] Add lib/rateLimiter.ts
```

CHECKPOINT 2: Single API call returns all 6 outputs as structured JSON verified in terminal.

### Hour 3 — Core 3 Cards Visible in Browser

```
[ ] Build app/page.tsx — textarea resume, textarea job description
[ ] Add experience level buttons
[ ] Add LoadingState.tsx — spinner with rotating messages
[ ] Add OutputCard.tsx — reusable card wrapper
[ ] Build CoverLetterCard.tsx — formatted letter with copy button
[ ] Build GapAnalysisCard.tsx — list with importance badges
[ ] Build StarStoriesCard.tsx — numbered expandable stories
[ ] Wire fetch call to /api/analyze
[ ] Test full flow: paste resume + paste job + click button + see 3 cards
```

CHECKPOINT 3: Full end-to-end flow works in browser. Resume in, 3 core cards visible on screen.
This is your MVP. If the hackathon ended right now you have something submittable.

### Hour 4 — Remaining Cards and File Upload

```
[ ] Build InterviewScriptsCard.tsx — 3 tabs for 1/2/3 min scripts
[ ] Build ResumeRewriteCard.tsx — before/after bullet display
[ ] Build JobMarketCard.tsx — country demand table
[ ] Add file upload to page.tsx
[ ] Create app/api/parse-file/route.ts
[ ] Create lib/fileParser.ts — PDF and Word extraction
[ ] Test file upload with a real PDF resume
```

CHECKPOINT 4: All 6 output cards visible. File upload works with PDF.

### Hour 5 — Error Handling and Polish

```
[ ] Error message for resume too short
[ ] Error message for file too large
[ ] Error message for unsupported file type
[ ] Error message for API timeout — show retry button
[ ] Handle Gemini overloaded — friendly message
[ ] Handle JSON parse failure — individual card error not full crash
[ ] Disable submit button when inputs too short
[ ] Loading spinner with rotating messages
[ ] Mobile responsive check — resize browser window
[ ] Try Sample button so judges can demo without their own resume
```

CHECKPOINT 5: No error crashes the app. Every failure shows a helpful message.

### Hour 6 — Deploy to Vercel

```
[ ] npm run build — must pass with zero TypeScript errors
[ ] git init && git add . && git commit -m "feat: shahzad job coach ai v1"
[ ] Create GitHub repo at github.com/new
[ ] git remote add origin YOUR_GITHUB_URL
[ ] git push -u origin main
[ ] Go to vercel.com — import GitHub repo
[ ] Add environment variable: GEMINI_API_KEY = your_actual_key
[ ] Click Deploy — wait 2-3 minutes
[ ] Open live Vercel URL
[ ] Test full flow on live URL with real resume
```

CHECKPOINT 6: App is live on Vercel URL. Full flow works end-to-end in production.

### Hour 7 — Test and Demo Prep

```
[ ] Test with your own resume + 2 real job postings
[ ] Test with entry level resume + junior job posting
[ ] Test with senior resume + director job posting
[ ] Test file upload with PDF, Word file, text file
[ ] Fix any bugs found during testing
[ ] Polish: consistent spacing, readable fonts, clean colors
[ ] Practice 60-second demo script out loud — time yourself
[ ] Take screenshot of best output as backup
[ ] Visit live URL to warm up Vercel serverless function
```

CHECKPOINT 7: App tested with real data. Demo script practiced. Screenshot saved.

### Hour 8 — Record Demo Video and Submit

```
[ ] Open screen recorder — OBS (free) or Loom (free)
[ ] Record 90-second demo using the script from Section 6
[ ] Watch recording — every card readable? Audio clear?
[ ] Upload to YouTube (unlisted) or Loom
[ ] Copy submission writeup from Section 7
[ ] Go to Submissions channel
[ ] Create post with writeup + video link + Vercel URL
[ ] Test video link in incognito window
[ ] Set phone alarm for 11 AM Sunday as reminder
[ ] Submit before Sunday 12 PM Noon EST
```

CHECKPOINT 8: Submission posted. Video plays. Live link works. Done.

---

## 13. Gemini API Setup — Free In 5 Minutes

Step by step:
1. Open https://aistudio.google.com in browser
2. Sign in with any Google account
3. Click "Get API Key" in top navigation
4. Click "Create API key"
5. Select any project or create new one
6. Copy the key — you see it only once
7. Create .env.local in project root
8. Add line: GEMINI_API_KEY=paste_your_key_here
9. Add .env.local to .gitignore immediately

Free Tier Limits:

| Limit | Value | Impact |
|-------|-------|--------|
| Requests per minute | 15 | Fine for demo — rate limit at 10/min in code |
| Tokens per day | 1,000,000 | About 86 full analyses per day |
| Input token limit | 1,048,576 | Handles very long resumes and job postings |
| Output token limit | 8,192 per call | Enough for all outputs |
| Cost | $0 | Zero |

If you hit rate limits during testing:
Add a 5 second delay between rapid test calls.
The rateLimiter in lib/rateLimiter.ts protects you at 10 requests/min/IP in production.

---

## 14. Vercel Deployment Setup

Initial Deploy — One Time:

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Build check — must pass
npm run build

# Push to GitHub
git init
git add .
git commit -m "feat: shahzad job coach ai v1"
git remote add origin https://github.com/YOUR_USERNAME/shahzad-job-coach-ai.git
git push -u origin main

# Go to vercel.com
# Click "Add New Project"
# Import your GitHub repo
# Add environment variable: GEMINI_API_KEY = your_actual_key
# Click Deploy — wait 2-3 minutes
# URL: https://shahzad-job-coach-ai.vercel.app
```

Every Update After First Deploy:
```bash
git add .
git commit -m "fix: what you changed"
git push
# Vercel auto-deploys in 60-90 seconds
```

Add API Key in Vercel Dashboard:
```
Vercel Dashboard
→ Your Project
→ Settings
→ Environment Variables
→ Add New
   Key:   GEMINI_API_KEY
   Value: your_actual_key_here
   Environment: Production + Preview + Development
→ Save → Redeploy
```

Verify Deployment:
```bash
curl -X POST https://shahzad-job-coach-ai.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"resume":"Software engineer with 5 years experience in React","jobDescription":"Senior frontend engineer with React expertise required","level":"mid"}'
```

---

## 15. Complete Codebase — Every File With Code

### package.json

```json
{
  "name": "shahzad-job-coach-ai",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18",
    "react-dom": "^18",
    "@google/generative-ai": "^0.21.0",
    "pdf-parse": "^1.1.1",
    "mammoth": "^1.7.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/pdf-parse": "^1.1.4",
    "tailwindcss": "^3",
    "autoprefixer": "^10",
    "postcss": "^8",
    "eslint": "^8",
    "eslint-config-next": "14.2.0"
  }
}
```

### .env.local — NEVER COMMIT

```
GEMINI_API_KEY=your_gemini_api_key_here
```

### .env.example — SAFE TO COMMIT

```
GEMINI_API_KEY=your_gemini_api_key_here
```

### .gitignore — Add These Lines

```
.env.local
.env*.local
node_modules/
.next/
```

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'mammoth'],
  },
}

module.exports = nextConfig
```

### types/analysis.ts

```typescript
export type ExperienceLevel = 'student' | 'entry' | 'mid' | 'senior' | 'career-change';

export interface GapItem {
  skill: string;
  type: 'hard-skill' | 'soft-skill' | 'certification' | 'experience';
  importance: 'critical' | 'important' | 'nice-to-have';
  explanation: string;
  howToGet: string;
}

export interface StarStory {
  title: string;
  usedFor: string;
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface InterviewScripts {
  oneMinute: string;
  twoMinute: string;
  threeMinute: string;
}

export interface ResumeBullet {
  original: string;
  rewritten: string;
  improvement: string;
}

export interface CountryDemand {
  country: string;
  flag: string;
  demandLevel: 'extreme' | 'very-high' | 'high' | 'moderate';
  keyReason: string;
  salaryRange: string;
  immigrationTip: string;
}

export interface JobAnalysis {
  coverLetter: string;
  resumeRewrites: ResumeBullet[];
  gapAnalysis: GapItem[];
  interviewScripts: InterviewScripts;
  starStories: StarStory[];
  jobMarket: CountryDemand[];
  metadata: {
    jobTitle: string;
    level: ExperienceLevel;
    generatedAt: string;
  };
}

export interface AnalyzeRequest {
  resume: string;
  jobDescription: string;
  level: ExperienceLevel;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: JobAnalysis;
  error?: string;
}
```

### lib/gemini.ts

```typescript
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export function getFlashModel(): GenerativeModel {
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  });
}

export function getFlash15Model(): GenerativeModel {
  return genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 8192,
    },
  });
}

export async function generateWithRetry(
  prompt: string,
  useHigherQuality: boolean = false,
  maxRetries: number = 2
): Promise<string> {
  const model = useHigherQuality ? getFlash15Model() : getFlashModel();
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini');
      }
      return text.trim();
    } catch (err: any) {
      lastError = err;
      if (err.message?.includes('429') || err.message?.includes('quota')) {
        throw new Error('API rate limit reached. Please wait 60 seconds and try again.');
      }
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError || new Error('Gemini generation failed after retries');
}

export function safeParseJSON<T>(text: string): T {
  const clean = text
    .replace(/```json\n?/gi, '')
    .replace(/```\n?/gi, '')
    .trim();
  return JSON.parse(clean) as T;
}
```

### lib/prompts.ts

```typescript
import { ExperienceLevel } from '@/types/analysis';

const levelContext: Record<ExperienceLevel, string> = {
  student: 'Student with no professional work experience. Focus on academic projects, volunteer work, clubs, and transferable skills.',
  entry: 'Applicant has 0-2 years of professional experience. Focus on early career achievements and learning trajectory.',
  mid: 'Applicant has 3-7 years of professional experience. Focus on measurable impact and growing responsibility.',
  senior: 'Applicant has 8+ years of experience. Focus on leadership, strategy, and organizational impact.',
  'career-change': 'Applicant is changing careers. Focus on transferable skills and reframing past experience for the new field.',
};

export function coverLetterPrompt(resume: string, jobDescription: string, level: ExperienceLevel): string {
  return `You are an expert career coach and professional resume writer.

Write a compelling personalized cover letter for the following applicant.

APPLICANT BACKGROUND:
${resume}

JOB POSTING:
${jobDescription}

EXPERIENCE LEVEL CONTEXT:
${levelContext[level]}

REQUIREMENTS:
- Exactly 3 paragraphs
- Opening: Hook that shows genuine interest and names the role specifically
- Middle: Connect 2-3 specific experiences from the resume to requirements from the job posting
- Closing: Strong call to action, confident but not arrogant
- Tone: Professional, warm, confident
- Length: 250-350 words
- Use keywords from the job posting naturally
- Do NOT use generic phrases like "I am writing to express my interest"
- Do NOT invent experience not in the resume

Return ONLY the cover letter text. No commentary, no labels, no explanation.`;
}

export function resumeRewritePrompt(resume: string, jobDescription: string, level: ExperienceLevel): string {
  return `You are an expert ATS-optimized resume writer.

Rewrite the work experience bullet points from this resume to better match the job description.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

LEVEL CONTEXT:
${levelContext[level]}

REQUIREMENTS:
- Rewrite each bullet using STAR format where possible
- Add quantifiable metrics where the resume is vague
- Mirror keywords from the job description naturally
- Keep bullets concise — one line each
- Do NOT invent skills or experience not in the original resume

Return a JSON array with this exact structure:
[
  {
    "original": "exact original bullet point text",
    "rewritten": "improved ATS-optimized version",
    "improvement": "one sentence explaining what improved and why"
  }
]

Return ONLY valid JSON. No explanation, no markdown fences.`;
}

export function gapAnalysisPrompt(resume: string, jobDescription: string, level: ExperienceLevel): string {
  return `You are a senior technical recruiter and career strategist.

Analyze what is missing from this resume compared to what the job posting requires.

RESUME:
${resume}

JOB POSTING:
${jobDescription}

EXPERIENCE LEVEL:
${levelContext[level]}

REQUIREMENTS:
- Identify every missing hard skill, soft skill, certification, and experience
- Rate importance: "critical" means will likely be screened out, "important" means reduces chances significantly, "nice-to-have" means minor advantage
- Explain WHY each gap matters for this specific role in 1-2 sentences
- Provide a concrete action to address each gap
- Include 5-12 gaps total
- Be honest but constructive

Return a JSON array with this exact structure:
[
  {
    "skill": "name of the skill or certification",
    "type": "hard-skill" or "soft-skill" or "certification" or "experience",
    "importance": "critical" or "important" or "nice-to-have",
    "explanation": "why this matters for this specific role",
    "howToGet": "specific action to address this gap"
  }
]

Return ONLY valid JSON. No explanation, no markdown fences.`;
}

export function interviewScriptsPrompt(resume: string, jobDescription: string, level: ExperienceLevel): string {
  return `You are an expert interview coach.

Create three versions of a personal introduction for a job interview.

APPLICANT BACKGROUND:
${resume}

JOB THEY ARE APPLYING FOR:
${jobDescription}

EXPERIENCE LEVEL:
${levelContext[level]}

REQUIREMENTS:
- 1-minute version: 130-150 words. Concise, energetic, hits key experience and why this role.
- 2-minute version: 260-300 words. Expands on career journey and 2 key achievements.
- 3-minute version: 390-450 words. Full story arc — background, growth, why this company.
- All versions must answer "Tell me about yourself"
- End each version with a bridge to the specific role they are applying for
- Use first person, natural conversational language
- Do NOT start any version with "My name is"
- Draw from actual resume content only

Return a JSON object with this exact structure:
{
  "oneMinute": "full script text here",
  "twoMinute": "full script text here",
  "threeMinute": "full script text here"
}

Return ONLY valid JSON. No explanation, no markdown fences.`;
}

export function starStoriesPrompt(resume: string, jobDescription: string, level: ExperienceLevel): string {
  const storyCount: Record<ExperienceLevel, string> = {
    student: '3 stories — focus on academic projects, team work, and problem solving',
    entry: '4 stories — mix of academic and early professional experience',
    mid: '5 stories — professional achievements with measurable results',
    senior: '7 stories — leadership, strategy, mentoring, and organizational impact',
    'career-change': '4 stories — highlight transferable skills from previous career',
  };

  return `You are a master interview coach specializing in behavioral interviews.

Create STAR method interview stories based on this applicant's background.

APPLICANT BACKGROUND:
${resume}

JOB THEY ARE APPLYING FOR:
${jobDescription}

EXPERIENCE LEVEL: ${levelContext[level]}

NUMBER AND FOCUS: ${storyCount[level]}

REQUIREMENTS:
- Each story must be based ONLY on actual experience in the resume
- Situation: Set the context briefly (1-2 sentences)
- Task: What was the specific challenge or responsibility (1-2 sentences)
- Action: What specific actions did YOU take — use "I" not "we" (2-3 sentences)
- Result: Quantifiable outcome where possible (1-2 sentences)
- Each story answers a different type of behavioral question
- Stories should feel natural and conversational when spoken aloud

Return a JSON array with this exact structure:
[
  {
    "title": "brief title for this story",
    "usedFor": "behavioral question this answers",
    "situation": "text",
    "task": "text",
    "action": "text",
    "result": "text"
  }
]

Return ONLY valid JSON. No explanation, no markdown fences.`;
}
```

### lib/jobMarketData.ts

```typescript
import { CountryDemand } from '@/types/analysis';

const JOB_CATEGORIES: Record<string, string[]> = {
  tech: ['software', 'developer', 'engineer', 'programmer', 'devops', 'cloud', 'data', 'ai', 'ml', 'cyber', 'security', 'it ', 'sre', 'architect'],
  healthcare: ['nurse', 'doctor', 'physician', 'pharmacist', 'therapist', 'medical', 'clinical', 'health'],
  finance: ['accountant', 'analyst', 'banker', 'finance', 'investment', 'audit', 'cpa', 'cfa'],
  trades: ['electrician', 'plumber', 'carpenter', 'welder', 'mechanic', 'hvac', 'construction'],
  management: ['manager', 'director', 'vp', 'vice president', 'head of', 'lead', 'executive'],
};

const COUNTRY_DATA: Record<string, CountryDemand[]> = {
  tech: [
    { country: 'Canada', flag: '🇨🇦', demandLevel: 'extreme', keyReason: 'Government AI investment boom driving massive tech hiring — especially in Toronto and Vancouver', salaryRange: 'CAD $80,000 – $180,000', immigrationTip: 'Global Talent Stream offers work permits in under 2 weeks for tech workers' },
    { country: 'United States', flag: '🇺🇸', demandLevel: 'extreme', keyReason: 'Silicon Valley, NYC, Austin, Seattle — largest absolute tech job market globally', salaryRange: 'USD $100,000 – $300,000+', immigrationTip: 'H-1B visa required for most foreign workers — highly competitive lottery system' },
    { country: 'Germany', flag: '🇩🇪', demandLevel: 'very-high', keyReason: 'Critical tech talent shortage — Opportunity Card visa introduced specifically to attract skilled workers', salaryRange: 'EUR €55,000 – €120,000', immigrationTip: 'EU Blue Card and Opportunity Card make immigration straightforward for tech workers' },
    { country: 'UAE', flag: '🇦🇪', demandLevel: 'very-high', keyReason: 'Dubai and Abu Dhabi positioning as global tech hubs with zero income tax', salaryRange: 'AED 120,000 – 400,000 (zero tax)', immigrationTip: 'Golden Visa program available for tech professionals — 10-year residency' },
    { country: 'Australia', flag: '🇦🇺', demandLevel: 'high', keyReason: 'Skills in Demand visa actively recruiting tech professionals with priority processing', salaryRange: 'AUD $90,000 – $180,000', immigrationTip: 'Skills in Demand visa — strong pathway to permanent residency' },
  ],
  healthcare: [
    { country: 'Canada', flag: '🇨🇦', demandLevel: 'extreme', keyReason: 'Healthcare worker shortage across all provinces — especially nurses and family physicians', salaryRange: 'CAD $70,000 – $250,000', immigrationTip: 'Most provinces have dedicated healthcare streams in Provincial Nominee Programs' },
    { country: 'Germany', flag: '🇩🇪', demandLevel: 'extreme', keyReason: 'Aging population creating severe healthcare shortage — recruiting globally', salaryRange: 'EUR €45,000 – €120,000', immigrationTip: 'Recognition of foreign medical credentials required but process is well-defined' },
    { country: 'United Kingdom', flag: '🇬🇧', demandLevel: 'very-high', keyReason: 'NHS facing persistent staffing crisis — healthcare on shortage occupation list', salaryRange: 'GBP £28,000 – £90,000', immigrationTip: 'Health and Care Worker visa offers reduced fees and fast processing for NHS roles' },
    { country: 'Australia', flag: '🇦🇺', demandLevel: 'very-high', keyReason: 'Regional and remote healthcare shortages — government offers incentives for rural postings', salaryRange: 'AUD $75,000 – $200,000', immigrationTip: 'Healthcare professionals on priority occupation list — faster visa processing' },
    { country: 'New Zealand', flag: '🇳🇿', demandLevel: 'high', keyReason: 'Consistent demand — strong nurse and GP shortage throughout country', salaryRange: 'NZD $60,000 – $150,000', immigrationTip: 'Accredited Employer Work Visa — straightforward for healthcare professionals' },
  ],
  finance: [
    { country: 'UAE', flag: '🇦🇪', demandLevel: 'extreme', keyReason: 'Dubai as global financial hub with zero income tax — attracting major banks and funds', salaryRange: 'AED 150,000 – 600,000 (zero tax)', immigrationTip: 'Employer sponsorship common — Golden Visa for senior finance professionals' },
    { country: 'Singapore', flag: '🇸🇬', demandLevel: 'very-high', keyReason: 'Asia Pacific financial center — major banks and family offices expanding rapidly', salaryRange: 'SGD $80,000 – $300,000', immigrationTip: 'Employment Pass accessible for finance professionals — strong expat infrastructure' },
    { country: 'United Kingdom', flag: '🇬🇧', demandLevel: 'very-high', keyReason: 'London remains Europe top financial center despite Brexit', salaryRange: 'GBP £45,000 – £200,000+', immigrationTip: 'Skilled Worker visa for finance roles — salary thresholds apply' },
    { country: 'Canada', flag: '🇨🇦', demandLevel: 'high', keyReason: 'Toronto is a growing financial hub — strong demand for CPA and CFA holders', salaryRange: 'CAD $60,000 – $180,000', immigrationTip: 'Express Entry — finance professionals score well under Federal Skilled Worker' },
    { country: 'Australia', flag: '🇦🇺', demandLevel: 'high', keyReason: 'Sydney and Melbourne financial sectors growing — superannuation industry unique demand', salaryRange: 'AUD $70,000 – $200,000', immigrationTip: 'Skills in Demand visa — accountants and analysts on shortage list' },
  ],
  general: [
    { country: 'Canada', flag: '🇨🇦', demandLevel: 'very-high', keyReason: 'Immigration-driven growth strategy — actively seeking workers across all sectors', salaryRange: 'Varies by role and province', immigrationTip: 'Express Entry ranks candidates — higher skills and language scores improve chances' },
    { country: 'Australia', flag: '🇦🇺', demandLevel: 'very-high', keyReason: 'Skills shortage across many industries — government expanded migration program', salaryRange: 'Varies by role', immigrationTip: 'Skills Assessment required for most occupations before applying for skilled migration' },
    { country: 'Germany', flag: '🇩🇪', demandLevel: 'high', keyReason: 'Workforce shrinking due to demographics — welcoming skilled workers from outside EU', salaryRange: 'EUR €35,000 – €90,000', immigrationTip: 'Opportunity Card introduced 2024 — allows job seekers to move to Germany and find work' },
    { country: 'United Kingdom', flag: '🇬🇧', demandLevel: 'high', keyReason: 'Points-based immigration system open to global talent in most sectors', salaryRange: 'GBP £25,000 – £80,000', immigrationTip: 'Skilled Worker visa requires employer sponsorship — salary threshold of £26,200' },
    { country: 'Netherlands', flag: '🇳🇱', demandLevel: 'high', keyReason: 'English widely spoken — strong international business environment across industries', salaryRange: 'EUR €40,000 – €100,000', immigrationTip: 'Highly Skilled Migrant visa — employer must be recognized sponsor' },
  ],
};

export function getJobMarketData(jobDescription: string): CountryDemand[] {
  const lower = jobDescription.toLowerCase();
  for (const [category, keywords] of Object.entries(JOB_CATEGORIES)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return COUNTRY_DATA[category] || COUNTRY_DATA.general;
    }
  }
  return COUNTRY_DATA.general;
}
```

### lib/fileParser.ts

```typescript
export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    if (!data.text || data.text.trim().length < 50) {
      throw new Error('PDF appears to be image-based. Please paste your resume as text instead.');
    }
    return data.text.trim();
  } catch (err: any) {
    if (err.message.includes('image-based')) throw err;
    throw new Error('Could not read PDF. The file may be corrupted or password-protected. Please paste your resume as text.');
  }
}

export async function parseDocx(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    if (!result.value || result.value.trim().length < 50) {
      throw new Error('Word document appears to be empty. Please paste your resume as text instead.');
    }
    return result.value.trim();
  } catch (err: any) {
    if (err.message.includes('empty')) throw err;
    throw new Error('Could not read Word document. Please save as .docx format or paste your resume as text.');
  }
}

export async function parseFile(buffer: Buffer, filename: string, mimeType: string): Promise<string> {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (mimeType === 'application/pdf' || ext === 'pdf') return parsePDF(buffer);
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || ext === 'docx') return parseDocx(buffer);
  if (mimeType === 'text/plain' || ext === 'txt') return buffer.toString('utf-8').trim();
  throw new Error(`Unsupported file type .${ext}. Please upload PDF, Word (.docx), or text (.txt) files.`);
}
```

### lib/validator.ts

```typescript
import { AnalyzeRequest, ExperienceLevel } from '@/types/analysis';

const VALID_LEVELS: ExperienceLevel[] = ['student', 'entry', 'mid', 'senior', 'career-change'];

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: AnalyzeRequest;
}

export function validateAnalyzeRequest(body: any): ValidationResult {
  if (!body || typeof body !== 'object') return { valid: false, error: 'Invalid request format.' };

  const resume = (body.resume || '').trim();
  const jobDescription = (body.jobDescription || '').trim();

  if (resume.length < 100) return { valid: false, error: 'Resume is too short. Please provide your full resume (minimum 100 characters).' };
  if (resume.length > 15000) return { valid: false, error: 'Resume is too long. Please limit to 15,000 characters.' };
  if (jobDescription.length < 50) return { valid: false, error: 'Job description is too short. Please paste the complete job posting.' };
  if (jobDescription.length > 10000) return { valid: false, error: 'Job description is too long. Please limit to 10,000 characters.' };
  if (!body.level || !VALID_LEVELS.includes(body.level)) return { valid: false, error: 'Please select your experience level.' };

  const sanitize = (t: string) => t.replace(/<script[^>]*>.*?<\/script>/gi, '').replace(/javascript:/gi, '').trim();

  return {
    valid: true,
    sanitized: {
      resume: sanitize(resume),
      jobDescription: sanitize(jobDescription),
      level: body.level as ExperienceLevel,
    },
  };
}

export function validateFile(filename: string, mimeType: string, sizeBytes: number): { valid: boolean; error?: string } {
  const MAX_SIZE = 5 * 1024 * 1024;
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext || !['pdf', 'docx', 'txt'].includes(ext)) return { valid: false, error: `File type .${ext} is not supported. Please upload PDF, Word (.docx), or text (.txt) files.` };
  if (sizeBytes > MAX_SIZE) return { valid: false, error: `File is ${(sizeBytes / 1024 / 1024).toFixed(1)}MB. Maximum allowed size is 5MB.` };
  if (sizeBytes < 100) return { valid: false, error: 'File appears to be empty. Please check your file and try again.' };
  return { valid: true };
}
```

### lib/rateLimiter.ts

```typescript
interface RequestRecord { count: number; resetAt: number; }
const requests = new Map<string, RequestRecord>();

setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of requests.entries()) {
    if (now > record.resetAt + 60000) requests.delete(ip);
  }
}, 5 * 60 * 1000);

export const rateLimiter = {
  check(ip: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const record = requests.get(ip);
    if (!record || now > record.resetAt) {
      requests.set(ip, { count: 1, resetAt: now + 60000 });
      return { allowed: true };
    }
    if (record.count >= 10) {
      return { allowed: false, retryAfter: Math.ceil((record.resetAt - now) / 1000) };
    }
    record.count++;
    return { allowed: true };
  },
};
```

### app/api/analyze/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { validateAnalyzeRequest } from '@/lib/validator';
import { rateLimiter } from '@/lib/rateLimiter';
import { generateWithRetry, safeParseJSON } from '@/lib/gemini';
import { coverLetterPrompt, resumeRewritePrompt, gapAnalysisPrompt, interviewScriptsPrompt, starStoriesPrompt } from '@/lib/prompts';
import { getJobMarketData } from '@/lib/jobMarketData';
import { JobAnalysis, ResumeBullet, GapItem, InterviewScripts, StarStory } from '@/types/analysis';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const rateCheck = rateLimiter.check(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: `Too many requests. Please wait ${rateCheck.retryAfter} seconds.` },
      { status: 429 }
    );
  }

  let body: any;
  try { body = await req.json(); } catch {
    return NextResponse.json({ success: false, error: 'Invalid request format.' }, { status: 400 });
  }

  const validation = validateAnalyzeRequest(body);
  if (!validation.valid || !validation.sanitized) {
    return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
  }

  const { resume, jobDescription, level } = validation.sanitized;

  try {
    const [coverLetterResult, resumeRewriteResult, gapResult, interviewResult, starResult] =
      await Promise.allSettled([
        generateWithRetry(coverLetterPrompt(resume, jobDescription, level), false),
        generateWithRetry(resumeRewritePrompt(resume, jobDescription, level), false),
        generateWithRetry(gapAnalysisPrompt(resume, jobDescription, level), false),
        generateWithRetry(interviewScriptsPrompt(resume, jobDescription, level), false),
        generateWithRetry(starStoriesPrompt(resume, jobDescription, level), true),
      ]);

    const coverLetter = coverLetterResult.status === 'fulfilled'
      ? coverLetterResult.value
      : 'Cover letter generation failed. Please try again.';

    const resumeRewrites: ResumeBullet[] = resumeRewriteResult.status === 'fulfilled'
      ? safeParseJSON<ResumeBullet[]>(resumeRewriteResult.value) : [];

    const gapAnalysis: GapItem[] = gapResult.status === 'fulfilled'
      ? safeParseJSON<GapItem[]>(gapResult.value) : [];

    const interviewScripts: InterviewScripts = interviewResult.status === 'fulfilled'
      ? safeParseJSON<InterviewScripts>(interviewResult.value)
      : { oneMinute: '', twoMinute: '', threeMinute: '' };

    const starStories: StarStory[] = starResult.status === 'fulfilled'
      ? safeParseJSON<StarStory[]>(starResult.value) : [];

    const jobMarket = getJobMarketData(jobDescription);

    const result: JobAnalysis = {
      coverLetter,
      resumeRewrites,
      gapAnalysis,
      interviewScripts,
      starStories,
      jobMarket,
      metadata: {
        jobTitle: 'this role',
        level,
        generatedAt: new Date().toISOString(),
      },
    };

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (err: any) {
    console.error('Analysis error:', err);
    if (err.message?.includes('rate limit') || err.message?.includes('quota')) {
      return NextResponse.json({ success: false, error: 'AI service is busy. Please wait 60 seconds and try again.' }, { status: 429 });
    }
    return NextResponse.json({ success: false, error: 'Analysis failed. Please try again.' }, { status: 500 });
  }
}
```

### app/api/parse-file/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { validateFile } from '@/lib/validator';
import { parseFile } from '@/lib/fileParser';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ success: false, error: 'No file provided.' }, { status: 400 });

    const validation = validateFile(file.name, file.type, file.size);
    if (!validation.valid) return NextResponse.json({ success: false, error: validation.error }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await parseFile(buffer, file.name, file.type);
    return NextResponse.json({ success: true, text }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'File parsing failed.' }, { status: 500 });
  }
}
```

### app/layout.tsx

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Job Coach AI by Shahzad — Land Your Next Interview',
  description: 'Upload your resume and paste any job posting to get a tailored cover letter, skills gap analysis, interview scripts, and STAR stories in 60 seconds.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### app/page.tsx — Full Main UI

```typescript
'use client';
import { useState, useRef } from 'react';
import { AnalyzeResponse, ExperienceLevel } from '@/types/analysis';

const LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: 'student', label: '🎓 Student' },
  { value: 'entry', label: '🌱 Entry (0-2 yrs)' },
  { value: 'mid', label: '💼 Mid (3-7 yrs)' },
  { value: 'senior', label: '🚀 Senior (8+ yrs)' },
  { value: 'career-change', label: '🔄 Career Change' },
];

const LOADING_MSGS = [
  'Reading your resume...', 'Analyzing job requirements...', 'Writing your cover letter...',
  'Finding skills gaps...', 'Crafting STAR stories...', 'Building interview scripts...',
  'Checking global job demand...', 'Almost ready...',
];

const SAMPLE_RESUME = `Sarah Chen | sarah@email.com

EXPERIENCE
Software Engineer — TechCorp Inc (2022–Present)
- Built React dashboard used by 5,000 daily active users
- Reduced API response time by 40% through query optimization
- Led team of 3 junior developers on mobile feature rollout

Junior Developer — StartupXYZ (2021–2022)
- Developed 15+ RESTful API endpoints in Node.js
- Implemented automated testing increasing coverage from 45% to 78%

EDUCATION
Bachelor of Computer Science — University of Toronto (2021)

SKILLS: JavaScript, TypeScript, React, Node.js, Python, SQL, Git, AWS basics`;

export default function Home() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [level, setLevel] = useState<ExperienceLevel>('mid');
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState('');
  const [activeTab, setActiveTab] = useState<'1min' | '2min' | '3min'>('1min');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('File too large. Maximum 5MB.'); return; }
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(ext || '')) { setError('Please upload PDF, Word (.docx), or text (.txt) files.'); return; }

    if (ext === 'txt') {
      setResume(await file.text());
      setUploadedFile(file.name);
      setError('');
      return;
    }

    setUploadedFile(`Uploading ${file.name}...`);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/parse-file', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) { setResume(data.text); setUploadedFile(file.name); setError(''); }
      else { setError(data.error || 'Could not parse file. Please paste your resume as text.'); setUploadedFile(''); }
    } catch { setError('File upload failed. Please paste your resume as text.'); setUploadedFile(''); }
  };

  const handleAnalyze = async () => {
    setError(''); setResult(null); setLoading(true);
    let idx = 0;
    setLoadingMsg(LOADING_MSGS[0]);
    const interval = setInterval(() => { idx = (idx + 1) % LOADING_MSGS.length; setLoadingMsg(LOADING_MSGS[idx]); }, 2000);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription, level }),
      });
      const data: AnalyzeResponse = await res.json();
      if (!res.ok || !data.success) { setError(data.error || 'Analysis failed.'); return; }
      setResult(data);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch { setError('Network error. Please check your connection.'); }
    finally { clearInterval(interval); setLoading(false); }
  };

  const copy = (text: string) => navigator.clipboard.writeText(text).catch(() => {});
  const canSubmit = resume.trim().length >= 100 && jobDescription.trim().length >= 50 && !loading;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">

      <div className="text-center pt-14 pb-8 px-4">
        <div className="inline-block bg-indigo-600/20 border border-indigo-400/30 rounded-full px-4 py-1 text-indigo-300 text-xs mb-4">
          Free · No login · Powered by Gemini AI
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tight">🎯 Job Coach AI</h1>
        <p className="text-indigo-200 text-xl max-w-2xl mx-auto leading-relaxed">
          Upload your resume. Paste the job.<br />Get everything you need to land the interview.
        </p>
        <p className="text-slate-500 text-sm mt-2">by Shahzad</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center mb-6">
          {[['✉️','Cover Letter'],['🔍','Gap Analysis'],['⭐','STAR Stories'],['🎤','Interview Scripts'],['📝','Resume Rewrite'],['🌍','Job Market']].map(([icon,label]) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl py-3 px-1 text-xs">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-slate-300">{label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-white/8 rounded-2xl p-5 border border-white/15">
            <div className="flex items-center justify-between mb-3">
              <label className="font-semibold text-sm">📄 Your Resume</label>
              <div className="flex gap-2">
                <button onClick={() => fileInputRef.current?.click()} className="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors">Upload File</button>
                <button onClick={() => { setResume(SAMPLE_RESUME); setUploadedFile('sample-resume.txt'); setError(''); }} className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">Try Sample</button>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" />
            {uploadedFile && (
              <div className="flex items-center gap-2 mb-2 text-xs text-green-400">
                <span>✅ {uploadedFile}</span>
                <button onClick={() => { setResume(''); setUploadedFile(''); }} className="text-red-400">✕</button>
              </div>
            )}
            <textarea value={resume} onChange={e => setResume(e.target.value)} placeholder="Paste your resume here, or upload PDF/Word above..." className="w-full bg-transparent placeholder-slate-500 text-sm resize-none outline-none min-h-[140px] leading-relaxed" maxLength={15000} />
            <div className="flex justify-between mt-2 pt-2 border-t border-white/10 text-xs text-slate-500">
              <span>PDF, Word (.docx), or .txt · Max 5MB</span>
              <span className={resume.length > 14000 ? 'text-red-400' : ''}>{resume.length} / 15,000</span>
            </div>
          </div>

          <div className="bg-white/8 rounded-2xl p-5 border border-white/15">
            <label className="font-semibold text-sm mb-3 block">💼 Job Description</label>
            <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste the full job posting here — copy everything including requirements, responsibilities, and company description..." className="w-full bg-transparent placeholder-slate-500 text-sm resize-none outline-none min-h-[120px] leading-relaxed" maxLength={10000} />
            <div className="flex justify-end mt-2 pt-2 border-t border-white/10">
              <span className={`text-xs ${jobDescription.length > 9500 ? 'text-red-400' : 'text-slate-500'}`}>{jobDescription.length} / 10,000</span>
            </div>
          </div>

          <div className="bg-white/8 rounded-2xl p-5 border border-white/15">
            <label className="font-semibold text-sm mb-3 block">🎯 Your Experience Level</label>
            <div className="grid grid-cols-5 gap-2">
              {LEVELS.map(l => (
                <button key={l.value} onClick={() => setLevel(l.value)} className={`py-2.5 px-2 rounded-xl text-xs font-medium transition-all border ${level === l.value ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="bg-red-900/40 border border-red-500/50 rounded-xl p-4 text-red-300 text-sm">⚠️ {error}</div>}

          <button onClick={handleAnalyze} disabled={!canSubmit} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-2xl font-black text-lg transition-all shadow-xl">
            {loading ? '⚙️ Analyzing...' : '🚀 Analyze My Application'}
          </button>
          {!canSubmit && !loading && <p className="text-center text-slate-500 text-xs">Add resume (min 100 chars) and job description (min 50 chars) to continue</p>}
        </div>
      </div>

      {loading && (
        <div className="max-w-xl mx-auto px-4 pb-8 text-center">
          <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-indigo-300 animate-pulse">{loadingMsg}</p>
          <p className="text-slate-500 text-xs mt-2">Generating 6 outputs in parallel — usually 10-20 seconds</p>
        </div>
      )}

      {result?.data && (
        <div ref={resultsRef} className="max-w-3xl mx-auto px-4 pb-20 space-y-5">
          <div className="text-center py-2">
            <span className="inline-block bg-green-600/20 border border-green-500/30 rounded-full px-5 py-1.5 text-green-300 text-sm">✅ Your complete application package is ready</span>
          </div>

          {/* Cover Letter */}
          <div className="bg-white/8 border border-white/15 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-indigo-600/20 border-b border-indigo-500/20">
              <h3 className="font-bold text-indigo-200">✉️ Tailored Cover Letter</h3>
              <button onClick={() => copy(result.data!.coverLetter)} className="text-xs px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg">📋 Copy</button>
            </div>
            <div className="p-5"><p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">{result.data.coverLetter}</p></div>
          </div>

          {/* Gap Analysis */}
          <div className="bg-white/8 border border-white/15 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 bg-red-600/20 border-b border-red-500/20">
              <h3 className="font-bold text-red-200">🔍 Skills Gap Analysis</h3>
              <p className="text-slate-400 text-xs mt-0.5">What is missing from your resume for this specific role</p>
            </div>
            <div className="p-5 space-y-3">
              {result.data.gapAnalysis.map((gap, i) => (
                <div key={i} className={`rounded-xl p-4 border ${gap.importance === 'critical' ? 'bg-red-900/20 border-red-500/30' : gap.importance === 'important' ? 'bg-amber-900/20 border-amber-500/30' : 'bg-slate-800/40 border-slate-600/30'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white text-sm">{gap.skill}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${gap.importance === 'critical' ? 'bg-red-600/40 text-red-300' : gap.importance === 'important' ? 'bg-amber-600/40 text-amber-300' : 'bg-slate-600/40 text-slate-300'}`}>{gap.importance}</span>
                    <span className="text-xs text-slate-500 bg-slate-700/40 px-2 py-0.5 rounded-full">{gap.type}</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{gap.explanation}</p>
                  <p className="text-indigo-400 text-xs mt-1.5">💡 {gap.howToGet}</p>
                </div>
              ))}
            </div>
          </div>

          {/* STAR Stories */}
          <div className="bg-white/8 border border-white/15 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 bg-yellow-600/20 border-b border-yellow-500/20">
              <h3 className="font-bold text-yellow-200">⭐ STAR Method Interview Stories</h3>
              <p className="text-slate-400 text-xs mt-0.5">Behavioral interview answers — memorize and deliver these</p>
            </div>
            <div className="p-5 space-y-3">
              {result.data.starStories.map((story, i) => (
                <details key={i} className="group bg-slate-800/40 rounded-xl border border-slate-600/30">
                  <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none">
                    <div><p className="font-semibold text-white text-sm">{story.title}</p><p className="text-slate-400 text-xs mt-0.5">❓ {story.usedFor}</p></div>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <div className="px-4 pb-4 border-t border-slate-700/50 pt-3 space-y-3">
                    {[['S — Situation','text-blue-300',story.situation],['T — Task','text-purple-300',story.task],['A — Action','text-green-300',story.action],['R — Result','text-yellow-300',story.result]].map(([label,color,text]) => (
                      <div key={label}><p className={`text-xs font-bold ${color} mb-1`}>{label}</p><p className="text-slate-200 text-sm leading-relaxed">{text}</p></div>
                    ))}
                    <button onClick={() => copy(`${story.title}\n\nS: ${story.situation}\nT: ${story.task}\nA: ${story.action}\nR: ${story.result}`)} className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg mt-1">📋 Copy Story</button>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Interview Scripts */}
          <div className="bg-white/8 border border-white/15 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 bg-green-600/20 border-b border-green-500/20">
              <h3 className="font-bold text-green-200">🎤 Interview Introduction Scripts</h3>
              <p className="text-slate-400 text-xs mt-0.5">"Tell me about yourself" — answered for every scenario</p>
            </div>
            <div className="p-5">
              <div className="flex gap-2 mb-4">
                {(['1min','2min','3min'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${activeTab === tab ? 'bg-green-600 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}>
                    {tab === '1min' ? '⚡ 1 Minute' : tab === '2min' ? '📖 2 Minutes' : '🎬 3 Minutes'}
                  </button>
                ))}
              </div>
              <div className="bg-slate-800/40 rounded-xl p-4 relative">
                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                  {activeTab === '1min' ? result.data.interviewScripts.oneMinute : activeTab === '2min' ? result.data.interviewScripts.twoMinute : result.data.interviewScripts.threeMinute}
                </p>
                <button onClick={() => copy(activeTab === '1min' ? result.data!.interviewScripts.oneMinute : activeTab === '2min' ? result.data!.interviewScripts.twoMinute : result.data!.interviewScripts.threeMinute)} className="absolute top-3 right-3 text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg">📋</button>
              </div>
            </div>
          </div>

          {/* Resume Rewrite */}
          {result.data.resumeRewrites.length > 0 && (
            <div className="bg-white/8 border border-white/15 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 bg-purple-600/20 border-b border-purple-500/20">
                <h3 className="font-bold text-purple-200">📝 Resume Bullet Rewrites</h3>
                <p className="text-slate-400 text-xs mt-0.5">ATS-optimized versions of your experience bullets</p>
              </div>
              <div className="p-5 space-y-3">
                {result.data.resumeRewrites.map((bullet, i) => (
                  <div key={i} className="bg-slate-800/40 rounded-xl p-4 border border-slate-600/30">
                    <p className="text-xs text-slate-500 mb-1">Before:</p>
                    <p className="text-slate-400 text-sm line-through mb-2">{bullet.original}</p>
                    <p className="text-xs text-green-400 mb-1">After:</p>
                    <p className="text-green-300 text-sm font-medium mb-2">{bullet.rewritten}</p>
                    <p className="text-xs text-slate-500 italic">💡 {bullet.improvement}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Job Market */}
          <div className="bg-white/8 border border-white/15 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 bg-blue-600/20 border-b border-blue-500/20">
              <h3 className="font-bold text-blue-200">🌍 Global Job Market — Where To Apply</h3>
              <p className="text-slate-400 text-xs mt-0.5">Countries actively hiring for this type of role in 2026</p>
            </div>
            <div className="p-5 space-y-3">
              {result.data.jobMarket.map((c, i) => (
                <div key={i} className="bg-slate-800/40 rounded-xl p-4 border border-slate-600/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{c.flag}</span>
                      <span className="font-semibold text-white">{c.country}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.demandLevel === 'extreme' ? 'bg-red-600/40 text-red-300' : c.demandLevel === 'very-high' ? 'bg-orange-600/40 text-orange-300' : 'bg-yellow-600/40 text-yellow-300'}`}>
                      {c.demandLevel === 'extreme' ? '🔥🔥 Extreme' : c.demandLevel === 'very-high' ? '🔥 Very High' : '📈 High'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs mb-1">{c.keyReason}</p>
                  <p className="text-green-400 text-xs font-medium">💰 {c.salaryRange}</p>
                  <p className="text-blue-400 text-xs mt-1">✈️ {c.immigrationTip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-2">
            <button onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-slate-400 hover:text-white text-sm underline transition-colors">
              ← Analyze a different job
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
```

---

## 16. AI Prompt Engineering — Design Decisions

Why 5 Separate Prompts Instead of One Big Prompt:
One big prompt asking for all 6 outputs would hit token limits, produce lower quality on each section, and make debugging impossible. Five separate prompts running in Promise.allSettled means each output gets full model attention, and if one fails the other four still return successfully.

Why Promise.allSettled Instead of Promise.all:
Promise.all fails completely if any single API call fails. During a hackathon demo with Gemini under load, one call might timeout. Promise.allSettled runs all 5 in parallel and returns whatever succeeded. Partial success beats total failure every time.

Token Estimate Per Full Request:
- Cover Letter: ~1,900 tokens
- Resume Rewrite: ~2,100 tokens
- Gap Analysis: ~2,200 tokens
- Interview Scripts: ~2,400 tokens
- STAR Stories: ~3,000 tokens
- Total per request: ~11,600 tokens
- Free daily limit: 1,000,000 tokens
- Analyses per day for free: ~86

---

## 17. File Upload Handling

Supported Formats:

| Format | Extension | Parser | Notes |
|--------|-----------|--------|-------|
| PDF | .pdf | pdf-parse | Text-based PDFs only — scanned image PDFs fail gracefully |
| Word | .docx | mammoth | Modern Word format only — old .doc not supported |
| Plain text | .txt | Buffer.toString | Always works — recommend as fallback |

Why dynamic import for pdf-parse:
pdf-parse has a known issue with Next.js App Router when imported statically. Using `const pdfParse = (await import('pdf-parse')).default` inside the function resolves this.

---

## 18. Error Handling — Every Failure Covered

Input Errors:

| Error | Message Shown |
|-------|---------------|
| Resume too short | Resume is too short. Please provide your full resume (minimum 100 characters). |
| Resume too long | Resume is too long. Please limit to 15,000 characters. |
| Job description too short | Job description is too short. Please paste the complete job posting. |
| Job description too long | Job description is too long. Please limit to 10,000 characters. |
| No level selected | Please select your experience level. |

File Upload Errors:

| Error | Message Shown |
|-------|---------------|
| File too large | File is X.XMB. Maximum allowed size is 5MB. |
| Wrong file type | File type .xxx is not supported. Please upload PDF, Word (.docx), or text (.txt). |
| Empty file | File appears to be empty. Please check your file and try again. |
| Image-based PDF | PDF appears to be image-based. Please paste your resume as text instead. |
| Corrupted file | Could not read PDF. The file may be corrupted or password-protected. |

API Errors:

| Error | Message Shown |
|-------|---------------|
| Rate limit | Too many requests. Please wait X seconds and try again. |
| Gemini overloaded | AI service is busy. Please wait 60 seconds and try again. |
| JSON parse failure | Individual card shows error — other cards still display |
| Network timeout | Network error. Please check your connection and try again. |
| Unknown error | Analysis failed. Please try again. |

---

## 19. File Size and Validation Limits

| Input | Minimum | Maximum | Error Shown |
|-------|---------|---------|-------------|
| Resume text | 100 chars | 15,000 chars | Below textarea |
| Job description text | 50 chars | 10,000 chars | Below textarea |
| Uploaded file | 100 bytes | 5MB | Above file input |
| Request body | — | 5MB (next.config.js) | 413 from server |

---

## 20. Cost Estimate — Everything Free

| Service | Tier | Cost |
|---------|------|------|
| Vercel hosting | Hobby free | $0 |
| Vercel serverless functions | 100GB-hours/month free | $0 |
| Gemini 2.0 Flash API | 1M tokens/day free | $0 |
| Gemini 1.5 Flash API | 1M tokens/day free | $0 |
| GitHub repository | Free | $0 |
| pdf-parse npm | Open source | $0 |
| mammoth npm | Open source | $0 |
| Claude Code in VS Code | Already paid by Shahzad | $0 additional |
| Total | | $0 |

---

## 21. Build Tracker — Practice Run vs Real Hackathon

| Milestone | Build 1 Practice | Build 2 Real |
|-----------|-----------------|--------------|
| Start time | | |
| Gemini API key obtained | __ min | __ min |
| Next.js scaffold created | __ min | __ min |
| First Gemini response in terminal | __ min | __ min |
| All 5 prompts returning JSON | __ hrs | __ hrs |
| Cover letter visible in browser | __ hrs | __ hrs |
| All 6 cards visible in browser | __ hrs | __ hrs |
| File upload working PDF | __ hrs | __ hrs |
| Error handling complete | __ hrs | __ hrs |
| First Vercel deploy | __ hrs | __ hrs |
| Live URL end-to-end test passed | __ hrs | __ hrs |
| Demo video recorded | __ hrs | __ hrs |
| Total build time | __ hrs | __ hrs |
| Longest bug to fix | | |
| What surprised you | | |
| What was faster second time | N/A | |
| Live URL | | |

---

## 22. Pre-Submission Checklist

Technical:
```
[ ] npm run build passes with zero errors
[ ] Live Vercel URL opens without errors
[ ] Cover letter generates on live URL
[ ] Gap analysis generates on live URL
[ ] STAR stories generate on live URL
[ ] Interview scripts generate on live URL
[ ] Resume rewrite generates on live URL
[ ] Job market cards display on live URL
[ ] File upload works with real PDF on live URL
[ ] Error message shows for empty resume
[ ] Error message shows for file too large
[ ] Try Sample button works
[ ] App works on mobile — tested on phone
[ ] GEMINI_API_KEY set in Vercel environment variables
[ ] .env.local NOT committed to GitHub
```

Demo Video:
```
[ ] Video is under 2 minutes
[ ] Every output card clearly readable
[ ] Audio is clear
[ ] Video uploaded to YouTube unlisted or Loom
[ ] Video link opens without login
[ ] Video plays all the way through
[ ] You show a real resume and real job posting
```

Submission Post:
```
[ ] Project Name: Job Coach AI
[ ] Team Name: Shahzad AI Lab
[ ] Team Members: Shahzad
[ ] What it does — 1 sentence filled in
[ ] Who it is for — 1 sentence filled in
[ ] Demo video link pasted and tested
[ ] AI tools used listed
[ ] Live Vercel link pasted and tested
[ ] Biggest challenge filled in
[ ] Submitted before Sunday March 8, 12:00 PM Noon EST
[ ] Video link tested in incognito window
```

---

## 23. Mistakes To Avoid

| Mistake | Prevention |
|---------|-----------|
| Building all 6 outputs before testing any | Test cover letter alone first — Checkpoint 1 |
| Using Promise.all instead of Promise.allSettled | One timeout kills everything — use allSettled |
| Committing .env.local to GitHub | Add to .gitignore before first commit — do it now |
| Forgetting GEMINI_API_KEY in Vercel | Check immediately after first deploy |
| Image-based PDF breaks demo | Always have Try Sample button as fallback |
| Gemini cold start surprises during demo | Visit live URL 5 minutes before demo |
| Demo video over 2 minutes | Practice and time it — judges have strict limits |
| Broken video link in submission | Test in incognito before submitting |
| Submitting after noon on Sunday | Phone alarm at 11 AM Sunday — submit by then |
| Not testing on mobile | Test Vercel URL on phone before recording |

---

## 24. Troubleshooting Guide

Gemini returns empty string:
Prompt is too long or model is overloaded. Resume plus JD combined should be under 12,000 characters. The generateWithRetry function retries twice with exponential backoff — already built in.

JSON.parse fails on Gemini output:
Gemini added text before or after JSON despite instructions. The safeParseJSON function strips markdown fences. If it still fails the Promise.allSettled approach returns that card as empty without crashing the other cards. Log the raw output with console.log to debug the specific prompt.

pdf-parse throws Cannot read properties of undefined:
Known issue with pdf-parse and Next.js App Router static imports. Already handled in fileParser.ts with dynamic import. If you see this error check that you are using the dynamic import version.

Vercel function timeout — 504 error:
Generating 5 outputs in parallel can take 15-25 seconds on slow Gemini days. The export const maxDuration = 60 in route.ts is already included. Vercel Hobby plan allows 60 second functions.

GEMINI_API_KEY undefined in Vercel production:
Environment variable not added in Vercel dashboard. Go to Vercel Dashboard, Project, Settings, Environment Variables, add GEMINI_API_KEY, then redeploy. This is the most common production issue.

npm run build fails with Module not found pdf-parse:
Run npm install pdf-parse @types/pdf-parse and ensure serverComponentsExternalPackages includes pdf-parse and mammoth in next.config.js.

File upload shows File parsing failed for valid PDF:
PDF is image-based — contains no extractable text. This is a real limitation. The error message already tells the user to paste as text. No code fix needed — it is by design.

Rate limit during testing — 429 error:
You made 15+ requests in one minute to Gemini free tier. Wait 60 seconds. The rateLimiter.ts caps at 10 req/min per IP to prevent this.

mammoth fails on old .doc files:
mammoth only supports .docx not old .doc binary format. Error message already tells user to save as .docx. No code fix needed.

App crashes completely when one card fails:
You used regular try/catch that throws instead of Promise.allSettled. The route.ts already uses Promise.allSettled — individual failures return empty data for that card not a 500 error.

---

*Complete Master Reference Document — A to Z*
*Built by Shahzad | March 2026*
*Product: Job Coach AI*
*Stack: Next.js 14 · Google Gemini AI · Vercel · pdf-parse · mammoth · Tailwind CSS*
*Built with: Claude Code in VS Code*
*Build this twice: Practice Run first then Real Hackathon second*
*Fill in the Build Tracker as you go*

================================================================================
SECTION 19 — COMPLETE A TO Z MASTER WORKFLOW
The single source of truth. No other document needed.
Built by Shahzad + Claude Code + Claude.ai | March 2026
================================================================================

---

PART A — EVERYTHING YOU WILL USE (FULL INVENTORY)

HUMAN ON THIS PROJECT: Shahzad
AI ASSISTANTS:
  - Claude.ai (claude.ai web) — planning, architecture, this document, all decisions
  - Claude Code in VS Code — writes every line of code, fixes every error
  - Gemini 2.0 Flash API — the AI brain inside the live application

CODE EDITOR: Visual Studio Code with Claude Code extension

LANGUAGES:
  - TypeScript — all application code (Next.js frontend + API routes)
  - CSS — via Tailwind utility classes only, no custom CSS files needed
  - JSON — configuration files, API responses
  - HCL (Terraform) — NOT needed for this project (Vercel handles infra)
  - Bash — terminal commands only (npm, git, vercel cli)
  NOTE: Python was considered. Decision: TypeScript/Next.js chosen because
  file upload handling, streaming, and Vercel deployment are native and zero-config.
  Python (FastAPI) would need separate frontend + CORS setup + extra deployment steps.
  Next.js does frontend + backend in one project = faster hackathon build.

FRONTEND: Next.js 14 App Router + React 18 + Tailwind CSS
BACKEND: Next.js API Routes (serverless functions, runs on Node.js 20)
AI ENGINE: Google Gemini 2.0 Flash via @google/generative-ai npm package
FILE PARSING: pdf-parse (PDF) + mammoth (Word .docx)
HOSTING: Vercel free tier (auto-deploy from GitHub)
VERSION CONTROL: GitHub free tier
SECURITY: HTTPS enforced by Vercel, input sanitization, rate limiting, no secrets in code

TOTAL TOOLS COUNT: 4 platforms (VS Code, GitHub, Vercel, Google AI Studio)
TOTAL LANGUAGES: 1 primary (TypeScript)
TOTAL COST: $0

---

PART B — WHAT YOU ARE NOT USING AND WHY

NO DATABASE
  Why: Stateless app. Each request is independent. No user data stored.
  Security benefit: Nothing to breach. No PII stored anywhere.

NO LOGIN / AUTH
  Why: Not needed for hackathon MVP. Adds hours of complexity.
  Security note: No user accounts = no credential theft risk.

NO DOCKER
  Why: Vercel handles containerization automatically for Next.js.

NO PYTHON / FLASK / FASTAPI
  Why: Would need separate frontend deployment. More moving parts = more failure points.
  When Python makes sense: If you were building a CLI tool or pure API with no UI.

NO REDIS / CACHING
  Why: Gemini responses are per-user per-request. Nothing to cache.

NO PAID SERVICES
  Why: All free tiers cover hackathon scale completely.

NO ENVIRONMENT CONFIG FILES OTHER THAN .env.local
  Why: Vercel dashboard handles production env vars. One source of truth.

---

PART C — SECURITY ARCHITECTURE (UNBREAKABLE FOR PUBLIC APP)

This app is public (no login) but must be secure. Here is every protection layer.

LAYER 1 — HTTPS EVERYWHERE
  Vercel enforces HTTPS on all URLs automatically.
  HTTP requests are redirected to HTTPS.
  TLS 1.3 used by default.
  No configuration needed — Vercel handles this.

LAYER 2 — API KEY PROTECTION
  GEMINI_API_KEY stored ONLY in Vercel Environment Variables.
  Never in code. Never in GitHub. Never in client-side code.
  .env.local is in .gitignore — never committed.
  The API key is only accessible server-side in API routes.
  Client (browser) never sees the key.

LAYER 3 — INPUT VALIDATION (lib/validator.ts)
  Resume text: minimum 50 chars, maximum 15,000 chars
  Job description: minimum 50 chars, maximum 8,000 chars
  Experience level: must be one of three enum values
  All inputs trimmed and length-checked before reaching Gemini

LAYER 4 — INPUT SANITIZATION (add to lib/validator.ts)
  Strip all HTML tags from text inputs
  Strip script injection attempts
  Strip null bytes
  Normalize unicode to prevent encoding attacks
  Add this sanitize function to validator.ts:

  export function sanitizeText(input: string): string {
    return input
      .replace(/<[^>]*>/g, '')           // strip HTML tags
      .replace(/javascript:/gi, '')       // strip JS protocol
      .replace(/on\w+\s*=/gi, '')         // strip event handlers
      .replace(/\0/g, '')                 // strip null bytes
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ') // normalize to printable ASCII
      .trim();
  }

LAYER 5 — RATE LIMITING (lib/rateLimiter.ts)
  5 requests per minute per IP address
  Prevents API abuse and runaway Gemini costs
  In-memory map — resets on server restart (fine for hackathon)
  Returns HTTP 429 with clear error message

LAYER 6 — FILE UPLOAD PROTECTION
  Accept only .pdf .docx .doc .txt extensions
  Maximum file size: 5MB (enforced client-side and server-side)
  File content validated after parsing (must produce readable text)
  No files stored on server — parsed in memory and discarded
  Add file size check to API route:
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum 5MB.' }, { status: 400 });
    }

LAYER 7 — SECURITY HEADERS (add to next.config.js)
  These headers protect against common web attacks:

  module.exports = {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
            {
              key: 'Content-Security-Policy',
              value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data:;"
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload'
            },
          ],
        },
      ];
    },
    webpack: (config) => {
      config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
      return config;
    },
  };

  What each header does:
  X-Frame-Options DENY — prevents clickjacking attacks
  X-Content-Type-Options nosniff — prevents MIME type sniffing
  Referrer-Policy — controls what URL info is shared
  Permissions-Policy — disables camera/mic/location access
  Content-Security-Policy — controls what scripts can run
  Strict-Transport-Security — forces HTTPS for 2 years

LAYER 8 — NO SENSITIVE DATA IN LOGS
  Never log resume text or job descriptions
  Never log API keys
  Only log errors and request metadata
  console.error('Gemini error:', err.message) — NOT err (which could contain prompt data)

LAYER 9 — DEPENDENCY SECURITY
  All packages are well-maintained and widely used
  pdf-parse: 4M+ weekly downloads
  mammoth: 1M+ weekly downloads
  @google/generative-ai: official Google package
  Run npm audit before deploying to check for vulnerabilities
  If vulnerabilities found: npm audit fix

LAYER 10 — VERCEL PLATFORM SECURITY
  Vercel runs each API request in an isolated serverless function
  No persistent server process that can be compromised
  DDoS protection built into Vercel's edge network
  Automatic SSL certificate renewal

WHAT THIS APP DOES NOT NEED TO PROTECT AGAINST:
  SQL injection — no database
  NoSQL injection — no database
  Session hijacking — no sessions
  CSRF — no state-changing authenticated actions
  Stored XSS — no data storage

---

PART D — COMPLETE STEP BY STEP WORKFLOW
Both Shahzad and Claude Code follow this exact sequence.

PRE-HACKATHON (Do Before Friday Kickoff)

STEP 1 — Submit Entry Form (Tonight, Thursday March 5)
  WHO: Shahzad
  WHAT: Fill out hackathon entry form
  HOW: Use answers from Section 2 of this document
  TIME: 5 minutes
  CRITICAL: No form = no competition. No exceptions.

STEP 2 — Get Gemini API Key (Tonight or Friday)
  WHO: Shahzad
  WHAT: Create free Gemini API key
  HOW:
    1. Open browser → go to aistudio.google.com
    2. Sign in with Google account
    3. Click Get API Key
    4. Click Create API Key in new project
    5. Copy the key — save it in a secure note
    6. Do NOT put it in any code file yet
  TIME: 5 minutes
  VERIFY: Key looks like AIzaSy... (39 characters)

STEP 3 — Create GitHub Repository (Tonight or Friday)
  WHO: Shahzad
  WHAT: Create empty GitHub repo
  HOW:
    1. Go to github.com
    2. Click New Repository
    3. Name: shahzad-job-coach-ai
    4. Visibility: Public (required for Vercel free tier)
    5. Add README: No
    6. Click Create Repository
    7. Copy the repo URL shown on screen
  TIME: 3 minutes

STEP 4 — Create Vercel Account (Tonight or Friday)
  WHO: Shahzad
  WHAT: Create free Vercel account connected to GitHub
  HOW:
    1. Go to vercel.com
    2. Click Sign Up
    3. Choose Continue with GitHub
    4. Authorize Vercel to access your GitHub
  TIME: 3 minutes
  NOTE: Do not deploy anything yet. Just create the account.

STEP 5 — Prepare VS Code (Friday, before kickoff)
  WHO: Shahzad
  WHAT: Make sure VS Code and Claude Code are ready
  CHECKLIST:
    [ ] VS Code is installed and updated
    [ ] Claude Code extension is installed and logged in
    [ ] Node.js 20 LTS is installed (run: node --version, should show v20.x.x)
    [ ] npm is installed (run: npm --version, should show 10.x.x)
    [ ] Git is installed (run: git --version)
    [ ] Azure CLI installed (optional, not needed for this project)
  TIME: 15 minutes if any installs needed

STEP 6 — Watch Kickoff Livestream (Friday March 6, 1 PM EST)
  WHO: Shahzad
  WHAT: Watch kickoff, confirm rules, note any changes
  NOTE: You CANNOT start coding until after this livestream officially starts

---

BUILD DAY — SATURDAY MARCH 7

This is your one build day. Follow every step in order.
Do not skip ahead. Do not build step 5 before step 3 works.

STEP 7 — Create Next.js Project (Hour 1, ~15 min)
  WHO: Shahzad opens terminal in VS Code
  CLAUDE CODE ROLE: Assist if errors occur
  COMMANDS TO RUN IN ORDER:

  cd ~/Desktop   (or wherever you want the project)

  npx create-next-app@latest shahzad-job-coach-ai \
    --typescript \
    --tailwind \
    --app \
    --no-src-dir \
    --import-alias "@/*"

  When prompted:
    Would you like to use ESLint? → Yes
    Would you like to use Turbopack? → No (use standard webpack)

  cd shahzad-job-coach-ai

  VERIFY: You should see these folders:
    app/
    public/
    node_modules/
    package.json
    tsconfig.json
    tailwind.config.ts

STEP 8 — Install All Dependencies (Hour 1, ~5 min)
  COMMANDS:
  npm install @google/generative-ai pdf-parse mammoth
  npm install --save-dev @types/pdf-parse

  VERIFY:
  npm list @google/generative-ai   → should show version
  npm list pdf-parse               → should show version
  npm list mammoth                 → should show version

STEP 9 — Create Environment File (Hour 1, ~2 min)
  COMMANDS:
  echo "GEMINI_API_KEY=paste_your_key_here" > .env.local
  echo ".env.local" >> .gitignore

  Then open .env.local in VS Code and replace paste_your_key_here with your actual key.

  VERIFY:
  cat .gitignore   → should include .env.local
  cat .env.local   → should show your key (never share this)

STEP 10 — Create All Folders (Hour 1, ~2 min)
  COMMANDS:
  mkdir -p components lib types app/api/analyze

  VERIFY:
  ls   → you should see app/ components/ lib/ types/

STEP 11 — Create All Files Using Claude Code (Hour 1-2, ~45 min)
  WHO: Shahzad uses Claude Code in VS Code to create each file
  HOW: Open Claude Code chat → say "Create this file" → paste file content from Section 12

  ORDER TO CREATE FILES:
    1. types/analysis.ts
    2. lib/prompt.ts
    3. lib/gemini.ts
    4. lib/parseFile.ts
    5. lib/validator.ts
    6. lib/rateLimiter.ts
    7. next.config.js  (use the security headers version from Part C)
    8. app/api/analyze/route.ts
    9. components/LoadingSpinner.tsx
    10. components/OutputCard.tsx
    11. app/layout.tsx
    12. app/page.tsx  (save this for last — it imports all components)

  CLAUDE CODE INSTRUCTIONS TO USE:
  For each file say:
  "Create the file [filename] with this exact content: [paste content from Section 12]"

  Claude Code will create the file, check for TypeScript errors, and suggest fixes.

STEP 12 — First Local Test (Hour 2, ~10 min)
  COMMANDS:
  npm run dev

  Open browser: http://localhost:3000
  You should see the Job Coach AI UI with 3 input steps.

  WHAT TO CHECK:
    [ ] Page loads without white screen
    [ ] File upload button is visible
    [ ] Job description textarea is visible
    [ ] Experience level buttons are visible
    [ ] Submit button is visible
    [ ] No red errors in browser console (F12 → Console tab)

  If white screen: check terminal for errors. Share error with Claude Code.

STEP 13 — Test API Endpoint (Hour 2, ~15 min)
  Open a new terminal tab.
  Test with curl (paste your own resume text):

  curl -X POST http://localhost:3000/api/analyze \
    -H "Content-Type: application/json" \
    -d '{
      "resumeText": "Software Engineer with 5 years experience in JavaScript, React, Node.js. Worked at TechCorp 2019-2024. Led team of 3 developers. Built customer portal used by 10,000 users.",
      "jobDescription": "We are looking for a Senior Software Engineer with 5+ years experience in React and Node.js. Must have team leadership experience. Cloud experience preferred.",
      "experienceLevel": "mid"
    }'

  EXPECTED RESULT: JSON object with coverLetter, tailoredResumeBullets, gapAnalysis, interviewScripts, starStories, quickWinTips

  IF YOU GET ERROR 500: Check terminal — Gemini API key issue. Verify .env.local has correct key.
  IF YOU GET ERROR 422: Gemini returned non-JSON. Check prompt.ts for syntax issues.
  IF YOU GET ERROR 400: Validation failing. Check the input text lengths.

STEP 14 — Test File Upload (Hour 2-3, ~20 min)
  In the browser at localhost:3000:
    1. Click the upload area
    2. Select a real PDF resume file
    3. Paste a real job description
    4. Select Mid Level
    5. Click Generate

  EXPECTED: Loading spinner → all 6 output sections appear

  Common issues and fixes:
  - PDF shows "File parsed but text is empty" → PDF is image-based, not text-based.
    Tell user to paste text instead. This is handled by validator.
  - DOCX throws error → Check mammoth is installed. Run npm list mammoth.
  - Timeout after 30 seconds → Gemini is slow on long inputs. Reduce resume to 5000 chars for testing.

STEP 15 — Build All UI Output Components (Hour 3-5)
  By this step the API works. Now make the UI display all 6 outputs correctly.
  Use Claude Code to check component rendering issues.
  Test each section appears with real data.

  VERIFY each section works:
    [ ] Cover Letter displays full text with copy button
    [ ] Tailored Resume shows bullet points per role
    [ ] Gap Analysis shows items with importance badges (critical/important/nice_to_have)
    [ ] Interview Scripts shows 3 tabs (1min/2min/3min) and switches correctly
    [ ] STAR Stories shows all stories with S/T/A/R breakdown
    [ ] Quick Win Tips shows 5 numbered tips
    [ ] Try Again button scrolls back to top and clears all state

STEP 16 — Add Security Headers and Error Handling (Hour 5-6)
  Update next.config.js with full security headers from Part C.
  Verify in browser: F12 → Network tab → click any request → Headers → Response Headers
  You should see: x-frame-options, x-content-type-options, strict-transport-security

  Add file size check to API route (max 5MB).
  Test error states:
    [ ] Submit with empty resume → shows validation error
    [ ] Submit with empty job description → shows validation error
    [ ] Submit with very short text → shows minimum length error

STEP 17 — Production Build Check (Hour 6, ~10 min)
  COMMAND:
  npm run build

  MUST PASS WITH ZERO ERRORS.
  Warnings are okay. Errors are not.

  Most common build errors and fixes:

  Error: Type error: Property X does not exist on type Y
  Fix: Ask Claude Code to fix the TypeScript type. Usually add optional chaining or type assertion.

  Error: Module not found: pdf-parse
  Fix: npm install pdf-parse --save then add to next.config.js webpack externals.

  Error: useRef/useState used in Server Component
  Fix: Add 'use client' directive at top of the file.

  Error: Image component requires width and height
  Fix: Not using Image component in this project. If you added one, add width and height props.

  After npm run build succeeds, run:
  npm run start
  Test at http://localhost:3000 one more time.

STEP 18 — Push to GitHub (Hour 6, ~5 min)
  COMMANDS:
  git init
  git add .
  git commit -m "feat: shahzad job coach ai v1 - complete build"
  git branch -M main
  git remote add origin YOUR_GITHUB_REPO_URL
  git push -u origin main

  VERIFY: Go to github.com/your-username/shahzad-job-coach-ai
  You should see all your files.
  CRITICAL CHECK: .env.local should NOT be visible on GitHub.
  If you see it, stop everything and run:
  git rm --cached .env.local
  git commit -m "remove env file"
  git push

STEP 19 — Deploy to Vercel (Hour 6-7, ~10 min)
  1. Go to vercel.com
  2. Click Add New → Project
  3. Find shahzad-job-coach-ai in the list → click Import
  4. Framework Preset: Next.js (should auto-detect)
  5. Root Directory: ./ (default)
  6. DO NOT click Deploy yet
  7. Click Environment Variables section
  8. Add:
     Name: GEMINI_API_KEY
     Value: your actual Gemini API key
  9. NOW click Deploy
  10. Wait 2-3 minutes
  11. Click Visit to open your live URL

  YOUR LIVE URL: shahzad-job-coach-ai.vercel.app

STEP 20 — Test Live Production URL (Hour 7, ~15 min)
  Test with a REAL resume PDF file.
  Test with a REAL job posting.
  Verify all 6 sections appear.
  Verify copy buttons work.
  Verify experience level switching works.
  Verify error messages show for empty inputs.
  Verify page works on mobile (resize browser or use phone).

  CHECK SECURITY HEADERS ON LIVE URL:
  Go to: https://securityheaders.com
  Enter your Vercel URL
  Should score A or B grade

STEP 21 — Record Demo Video (Hour 7, ~20 min)
  Use any screen recorder. Options:
  - Windows: Win + G (Game Bar) built in
  - Mac: Cmd + Shift + 5 built in
  - Browser: Loom (free at loom.com)
  - OBS Studio (free, overkill but works)

  DEMO VIDEO SCRIPT (90 seconds max):
  Use the script from Section 6 of this document word for word.

  RECORDING CHECKLIST:
    [ ] Browser zoomed to 125% so text is readable
    [ ] Use a real resume — not placeholder text
    [ ] Use a real job posting from LinkedIn or Indeed
    [ ] Show file upload working
    [ ] Show generate button click
    [ ] Show loading spinner
    [ ] Scroll through all 6 outputs slowly
    [ ] Show copy button on cover letter
    [ ] Show interview script tabs switching
    [ ] Total video time: under 2 minutes

  If live demo API is slow during recording: pre-generate the result, refresh and
  show results loading from a cached state. Or just wait — 10-15 seconds is fine.

STEP 22 — Submit (Sunday March 8, before 12 PM Noon EST)
  Go to the hackathon Submissions channel.
  Create ONE post with:
    - Video uploaded directly to the post (not just a link)
    - Copy the submission template from Section 7 of this document
    - Fill in your live Vercel URL
    - Fill in your demo video link

  SUBMIT BY 11:30 AM to give yourself a 30-minute buffer.
  Do not submit at 11:59 AM. Do not risk it.

---

PART E — ALTERNATIVE PLANS (IF THINGS GO WRONG)

ROADBLOCK 1: Gemini API key does not work
Alternative: Sign up for a second Google account and get a new key.
Takes 5 minutes. You have 15 requests/min free on each account.

ROADBLOCK 2: PDF parsing completely broken
Alternative: Remove file upload entirely. Make it paste-only.
Change the UI so the upload button becomes a larger textarea.
The app still works — just no file upload.
Do this if you spend more than 30 minutes fighting pdf-parse.

ROADBLOCK 3: Gemini times out or returns garbage JSON
Alternative: Split the one big API call into two smaller calls.
Call 1: Generate coverLetter + tailoredResumeBullets + gapAnalysis
Call 2: Generate interviewScripts + starStories + quickWinTips
Show results progressively. Users see first 3 outputs in 8 seconds, then next 3 in 8 more.

ROADBLOCK 4: Vercel deployment fails
Alternative: Deploy to GitHub Pages (static export) or use Railway.app.
Railway.app is also free, auto-deploys from GitHub, supports Node.js.
Go to railway.app → New Project → Deploy from GitHub.

ROADBLOCK 5: TypeScript errors blocking the build
Alternative: Rename all .tsx and .ts files to .jsx and .js.
Change tsconfig.json to allow JavaScript.
Or: Ask Claude Code to add @ts-ignore above every error line temporarily.
Get it deployed first. Fix types after.

ROADBLOCK 6: mammoth DOCX parsing throws runtime error
Alternative: Remove DOCX support. Support PDF and plain text only.
Change the file accept attribute to ".pdf,.txt" only.
Less than 5% of users will have a problem with this.

ROADBLOCK 7: App is too slow — Gemini takes 20+ seconds
Alternative: Switch to gemini-1.5-flash-8b (smallest, fastest free model).
Change model name in lib/gemini.ts from 'gemini-2.0-flash' to 'gemini-1.5-flash-8b'.
Output quality slightly lower but response time drops to 5-8 seconds.

ROADBLOCK 8: Running out of time — only 4 hours left
Emergency MVP: Cut to 3 outputs only.
Keep: Cover Letter + Tailored Resume + Gap Analysis.
Remove: Interview Scripts, STAR Stories, Quick Win Tips from UI.
Hide them by commenting out in page.tsx. The API still generates them.
Three perfect outputs beats six broken ones.

ROADBLOCK 9: No internet at submission time
Alternative: Have the app running locally on your machine as backup demo.
Record the video showing localhost:3000.
Mention in submission that live URL is also available.

---

PART F — CLAUDE CODE INSTRUCTIONS
How to work with Claude Code in VS Code effectively

SETUP:
1. Open VS Code
2. Open your project folder: File → Open Folder → shahzad-job-coach-ai
3. Click the Claude Code icon in the sidebar (or Ctrl+Shift+P → Claude Code)
4. Make sure you are signed in

HOW TO CREATE A FILE WITH CLAUDE CODE:
Say: "Create the file types/analysis.ts with this content:"
Then paste the content from Section 12.
Claude Code creates the file and checks for errors automatically.

HOW TO FIX AN ERROR WITH CLAUDE CODE:
Copy the full error message from the terminal.
Say: "I have this error: [paste error]. Here is the file that is failing: [paste file content]. Fix it."
Claude Code will identify the problem and rewrite the file correctly.

HOW TO ASK CLAUDE CODE TO REVIEW SECURITY:
Say: "Review this API route for security vulnerabilities and fix any issues: [paste route.ts content]"

HOW TO ASK CLAUDE CODE TO OPTIMIZE:
Say: "This component renders slowly. Review it and optimize React rendering: [paste component]"

HOW TO ASK CLAUDE CODE TO WRITE A TEST:
Say: "Write a simple test for this function: [paste function]"

WHEN CLAUDE CODE IS WRONG:
Claude Code can make mistakes. Always:
1. Read what it writes before running it
2. Run the code and see if it works
3. If it breaks something, say "That broke the app. Here is the new error. Revert to the previous approach."

CLAUDE CODE LIMITATIONS IN THIS PROJECT:
- Cannot access Vercel dashboard (you do that manually)
- Cannot access Google AI Studio (you do that manually)
- Cannot run npm commands for you (you run them in terminal)
- Cannot upload files to GitHub (you do git commands in terminal)

---

PART G — HOW SHAHZAD AND AI SPLIT THE WORK

SHAHZAD DOES:
  - Submit entry form (only you can do this)
  - Get Gemini API key (requires your Google account)
  - Create GitHub repo (requires your GitHub account)
  - Create Vercel account (requires your GitHub)
  - Run all terminal commands (npm, git, vercel)
  - Add API keys to Vercel dashboard (requires your Vercel account)
  - Test the app with real files
  - Record demo video (your voice, your screen)
  - Submit to hackathon (your account)
  - Make all product decisions

CLAUDE.AI (THIS CHAT) DOES:
  - Architecture decisions and planning
  - This master document
  - Prompt engineering for Gemini
  - Security architecture design
  - Troubleshooting guidance
  - All written content (demo scripts, submission copy)

CLAUDE CODE IN VS CODE DOES:
  - Create every code file
  - Fix TypeScript errors
  - Debug API issues
  - Optimize components
  - Review security vulnerabilities
  - Suggest improvements during build

GEMINI 2.0 FLASH DOES (inside the app):
  - Generate cover letters
  - Rewrite resume bullets
  - Analyze skill gaps
  - Write interview scripts
  - Create STAR stories
  - Generate quick win tips

---

PART H — COMPLETE FILE CHECKLIST

Before deploying, every file below must exist and npm run build must pass.

CONFIGURATION FILES:
  [ ] package.json
  [ ] tsconfig.json (auto-created by create-next-app)
  [ ] next.config.js (with security headers from Part C)
  [ ] tailwind.config.ts (auto-created, no changes needed)
  [ ] postcss.config.js (auto-created, no changes needed)
  [ ] .env.local (your Gemini key — never commit)
  [ ] .env.example (template without real key — commit this)
  [ ] .gitignore (must include .env.local)

TYPE DEFINITIONS:
  [ ] types/analysis.ts

LIBRARY FILES:
  [ ] lib/prompt.ts
  [ ] lib/gemini.ts
  [ ] lib/parseFile.ts
  [ ] lib/validator.ts
  [ ] lib/rateLimiter.ts

API ROUTES:
  [ ] app/api/analyze/route.ts

COMPONENTS:
  [ ] components/LoadingSpinner.tsx
  [ ] components/OutputCard.tsx

APP FILES:
  [ ] app/layout.tsx
  [ ] app/page.tsx
  [ ] app/globals.css (auto-created, keep as is)

TOTAL: 18 files (6 auto-created, 12 you create)

---

PART I — WHAT GOOD OUTPUT LOOKS LIKE

When your app works correctly, a test with a real resume should produce:

COVER LETTER: 3-4 paragraphs, professional tone, mentions the company by name (if in job description), uses keywords from the job posting, ends with a specific call to action.

TAILORED RESUME BULLETS: 2-3 roles shown, each with 3-5 bullets that start with strong action verbs (Led, Built, Developed, Improved, Reduced), include numbers/percentages where possible.

GAP ANALYSIS: 3-8 items. Critical items listed first. Each explains WHY it matters for this specific role and HOW to close the gap (specific course, certification, or practice).

INTERVIEW SCRIPTS: 3 different length versions that sound like a real person talking, not a bullet list. Each ends with connection to why they want this specific role.

STAR STORIES: Grounded in the actual resume content. Each story has all 4 parts. Result includes numbers. usedFor field matches a real interview question type.

QUICK WINS: Specific to this application. Examples:
  "The job posting mentions Kubernetes 6 times — add it to your skills section if you have any exposure"
  "Your resume says you managed a team but does not say how many people — add the number"
  "Remove the objective statement — it is outdated and wastes space that could show achievements"

---

PART J — FINAL PRE-SUBMISSION CHECKLIST

Complete every item before submitting Sunday morning.

TECHNICAL:
  [ ] npm run build passes with zero errors
  [ ] App works on live Vercel URL
  [ ] File upload works with PDF
  [ ] File upload works with DOCX
  [ ] Text paste works without file upload
  [ ] All 6 output sections display with real data
  [ ] Copy button works on cover letter
  [ ] Interview script tabs switch correctly
  [ ] Error messages show for empty inputs
  [ ] Mobile view is usable (resize browser to 375px wide)
  [ ] No API keys visible in GitHub
  [ ] Security headers present (check securityheaders.com)

DEMO VIDEO:
  [ ] Under 2 minutes
  [ ] Shows real resume being uploaded
  [ ] Shows real job description being pasted
  [ ] Shows generate button clicked
  [ ] Shows all 6 outputs on screen
  [ ] Video file is under 500MB
  [ ] Video plays without login

SUBMISSION POST:
  [ ] Project Name filled in
  [ ] Team Name: Shahzad AI Lab
  [ ] Team Members: Shahzad
  [ ] What it does: one sentence from Section 7
  [ ] Who it is for: one sentence from Section 7
  [ ] Demo video: uploaded directly to post
  [ ] AI tools used: filled in from Section 7
  [ ] Live link: your Vercel URL
  [ ] Biggest challenge: filled in from Section 7
  [ ] Post submitted BEFORE 11:30 AM EST Sunday March 8

DONE. SHIP IT.

---

================================================================================
END OF SECTION 19
================================================================================

MASTER DOCUMENT SUMMARY

This file contains everything needed to build Job Coach AI from zero to deployed.
No other document is needed.

Sections 1-18: Core build guide, code, deployment, troubleshooting
Section 19: Complete A to Z workflow, security, tools, file checklist, alternative plans

Built by Shahzad + Claude.ai + Claude Code | March 2026
Product: Job Coach AI — https://shahzad-job-coach-ai.vercel.app
Stack: Next.js 14 + TypeScript + Tailwind + Gemini 2.0 Flash + Vercel
Cost: $0

================================================================================
SECTION 20 — INTELLIGENCE LAYER: KEYWORDS, SKILLS, CERTIFICATIONS & AI IMPACT
The Resume Intelligence Engine — Built from Shahzad's LinkedIn Research + 2026 Market Data
North America Focus | USA + Canada | Valid 2026–2040
================================================================================

This section powers the AI prompt engine in Job Coach AI.
Every keyword, skill, certification, and occupation listed here feeds directly into:
- Resume gap analysis accuracy
- Cover letter keyword matching
- STAR story relevance scoring
- Gap analysis criticality ratings
- Certification recommendation logic

---

PART A — RESUME SCORING FORMULA
The exact calculation Job Coach AI uses to score any resume against any job description.

OVERALL RESUME SCORE = (Keyword Match × 0.35) + (Experience Relevance × 0.25) + (Quantified Achievements × 0.20) + (Skills Coverage × 0.15) + (Format & Structure × 0.05)

KEYWORD MATCH SCORE (35% weight)
Count how many keywords from the job description appear in the resume.
Score = (Keywords matched / Total keywords in job description) × 100
Industry benchmark: 60%+ to pass ATS screening. 80%+ to rank in top 10%.

EXPERIENCE RELEVANCE SCORE (25% weight)
For each job listed, score 0-10 on direct relevance to target role.
Average across all positions.
Weight recent positions 2x more than positions older than 7 years.

QUANTIFIED ACHIEVEMENTS SCORE (20% weight)
Count bullet points that contain numbers, percentages, dollar values, or timeframes.
Score = (Quantified bullets / Total bullets) × 100
Target: minimum 60% of bullets should be quantified.

SKILLS COVERAGE SCORE (15% weight)
Hard skills present / Hard skills required by job = raw score
Add bonus points for certifications that map to required skills.

FORMAT AND STRUCTURE SCORE (5% weight)
Binary checklist: 1 point each for contact info, summary, experience, education, skills, certifications sections present and clean.

---

MANDATORY — NO COMPROMISE (Must Have in Every Resume)

These items are non-negotiable. A resume missing any of these is immediately disqualified by ATS or recruiter.

CONTACT SECTION:
Full legal name
Professional email address (firstname.lastname@domain.com format)
Phone number with country code for international applications
LinkedIn profile URL (customized, not default)
City and province/state (full address not needed)
GitHub URL for technical roles
Portfolio URL for design/frontend roles

PROFESSIONAL SUMMARY (3-4 lines):
Years of experience stated explicitly
Top 2-3 technical skills most relevant to target role
One quantified career achievement
Target role or career direction stated clearly

WORK EXPERIENCE (each role):
Company name, job title, start month/year, end month/year
3-6 bullet points per role
Every bullet starts with a strong action verb
At least 60% of bullets include a number, percentage, or dollar value
Most recent role: 5-6 bullets minimum
Roles older than 10 years: 2-3 bullets acceptable

EDUCATION:
Degree name, institution, graduation year
GPA only if above 3.5 or within 3 years of graduation
Relevant coursework only if less than 2 years of work experience

SKILLS SECTION:
Separated into Hard Skills and Soft Skills
Hard skills listed with proficiency level (Expert / Proficient / Familiar)
No skill listed that cannot be demonstrated in an interview

CERTIFICATIONS SECTION:
Certification name, issuing body, year obtained, expiry date if applicable
Active certifications only — expired certs move to education section

---

EXCELLENT TO HAVE (Strong Differentiator — Significantly Improves Score)

ACHIEVEMENTS SECTION (separate from experience):
Top 3-5 career highlights across all roles
Format: Action + Context + Result + Number
Example: "Reduced cloud infrastructure costs by 34% ($2.1M annual saving) by redesigning multi-cloud architecture across 3 AWS regions"

PROJECTS SECTION (mandatory for tech roles):
Project name, your role, technologies used, measurable outcome
GitHub link or live demo link
1-3 sentence description maximum

VOLUNTEER / COMMUNITY (especially for Canadian market):
Relevant technical volunteering
Open source contributions
Community leadership or mentoring

PUBLICATIONS OR SPEAKING:
LinkedIn articles, conference talks, technical blog posts
Demonstrates thought leadership — rare and high-value

---

GOOD TO HAVE (Improves Ranking Among Equal Candidates)

Professional headshot on LinkedIn (linked from resume)
Custom LinkedIn URL matching your name exactly
Recommendations from managers or senior colleagues on LinkedIn
Awards or recognition section
Languages spoken (especially French for Canadian market)
Professional associations membership (ISACA, PMI, IEEE, CIPS)

---

NICE TO HAVE (Marginal Benefit — Only If Space Allows)

Interests section that connects to role (e.g., cybersecurity CTF competitions)
Patents or intellectual property
Media mentions or press features
Courses in progress (show commitment to learning)

---

WHAT TO REMOVE (These Hurt More Than They Help)

Objective statement — replace with professional summary
References available upon request — assumed, wastes space
Full street address — city and region only
Photo on resume (in North America — increases bias risk and adds no value)
Irrelevant work experience older than 15 years
Generic soft skills without evidence (team player, hard worker, detail oriented)
Tables and columns in resume (destroys ATS parsing)
Headers and footers with contact info (ATS cannot read them)
Graphics, icons, progress bars for skills (ATS ignores visual elements)
Multiple fonts or colors (ATS penalty, recruiter distraction)

---

PART B — TRENDING KEYWORDS BY ROLE CATEGORY (2026, NORTH AMERICA FOCUS)

These are the exact keywords Job Coach AI should inject into cover letters and resume bullets when they match the job description. Pulled from Shahzad's LinkedIn research, LinkedIn Skills on the Rise 2026, and real job posting analysis.

AI AND MACHINE LEARNING ENGINEERING:
Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), Vector Databases, Prompt Engineering, LangChain, LangGraph, LlamaIndex, OpenAI API, Anthropic Claude API, Google Gemini API, Model Fine-Tuning, RLHF, PEFT, LoRA, QLoRA, Embeddings, Semantic Search, Pinecone, Weaviate, Chroma, pgvector, Hugging Face Transformers, PyTorch, TensorFlow, JAX, Keras, Scikit-learn, MLOps, Model Deployment, Model Monitoring, Model Evaluation, A/B Testing for Models, Feature Engineering, Data Annotation, Data Labeling, ONNX, TensorRT, Quantization, Knowledge Graphs, Multi-Agent Systems, CrewAI, AutoGen, Semantic Kernel, Model Context Protocol (MCP), Agentic AI, Computer Use, Tool Use, Function Calling, Structured Outputs, Guardrails, AI Safety, Responsible AI, Explainable AI (XAI), Bias Detection, Fairness Metrics

CLOUD COMPUTING AND INFRASTRUCTURE:
AWS, Azure, Google Cloud Platform (GCP), Multi-Cloud, Hybrid Cloud, Cloud Architecture, Infrastructure as Code (IaC), Terraform, Bicep, CloudFormation, Pulumi, AWS CDK, Kubernetes, Helm, Docker, Container Orchestration, Serverless, AWS Lambda, Azure Functions, Google Cloud Functions, EKS, AKS, GKE, EC2, S3, RDS, DynamoDB, Azure SQL, Cosmos DB, VPC, Virtual Networks, Load Balancing, Auto Scaling, Route 53, CloudFront, Azure CDN, Cloud Security, FinOps, Cloud Cost Optimization, Reserved Instances, Spot Instances, Right-Sizing, Cloud Migration, Lift and Shift, Replatforming, Refactoring, Landing Zone, Well-Architected Framework, AWS Control Tower, Azure Landing Zones, Cloud Governance, Policy as Code, Open Policy Agent (OPA)

CYBERSECURITY:
Zero Trust Architecture, SIEM, SOAR, EDR, XDR, MDR, Threat Intelligence, MITRE ATT&CK, CVSS, CVE, Vulnerability Management, Penetration Testing, Red Team, Blue Team, Purple Team, Incident Response, Digital Forensics, Malware Analysis, Reverse Engineering, OSINT, Threat Hunting, Cloud Security, Identity and Access Management (IAM), Privileged Access Management (PAM), MFA, SAML, OAuth, OIDC, Zero Trust Network Access (ZTNA), CASB, SASE, Data Loss Prevention (DLP), Encryption, PKI, TLS, Key Management, GRC, ISO 27001, SOC 2, NIST CSF, CIS Controls, PCI DSS, HIPAA, GDPR, PIPEDA, CCPA, FedRAMP, Risk Assessment, Threat Modeling, STRIDE, PASTA, Security Architecture, AppSec, OWASP, DAST, SAST, DevSecOps, Shift Left Security, SBOM, Supply Chain Security, Post-Quantum Cryptography, ML-KEM, ML-DSA, Security Awareness Training, Phishing Simulation, Cyber Risk Quantification, FAIR Model, CISO, vCISO, Security Operations Center (SOC)

DEVOPS AND PLATFORM ENGINEERING:
CI/CD, GitHub Actions, GitLab CI, Jenkins, ArgoCD, Flux, GitOps, Platform Engineering, Internal Developer Platform (IDP), Backstage, Ansible, Chef, Puppet, Salt, Configuration Management, Observability, Prometheus, Grafana, Datadog, New Relic, Splunk, ELK Stack, OpenTelemetry, Site Reliability Engineering (SRE), SLI, SLO, SLA, Error Budgets, Chaos Engineering, Chaos Monkey, Load Testing, Performance Testing, k6, JMeter, Locust, Blue-Green Deployment, Canary Deployment, Feature Flags, Release Management, Change Management, Runbook Automation, Incident Management, On-Call, PagerDuty, Post-Mortem, Blameless Culture, DORA Metrics, Lead Time, Deployment Frequency, MTTR, Change Failure Rate, Shift Left, Developer Experience (DevEx), Golden Paths

SOFTWARE ENGINEERING AND DEVELOPMENT:
TypeScript, JavaScript, Python, Go (Golang), Rust, Java, C#, C++, Kotlin, Swift, React, Next.js, Vue.js, Angular, Node.js, FastAPI, Django, Flask, Spring Boot, .NET, GraphQL, REST API, gRPC, WebSockets, Microservices, Event-Driven Architecture, CQRS, Event Sourcing, Domain-Driven Design (DDD), Clean Architecture, SOLID Principles, Design Patterns, System Design, Distributed Systems, Message Queues, Kafka, RabbitMQ, Redis, PostgreSQL, MySQL, MongoDB, Elasticsearch, Web Assembly, PWA, Accessibility (WCAG), Performance Optimization, Core Web Vitals, Testing, TDD, BDD, Unit Testing, Integration Testing, E2E Testing, Jest, Cypress, Playwright, Selenium, Code Review, Technical Debt Management, Refactoring, Legacy Modernization, API Design, OpenAPI, Swagger, SDK Development, Monorepo, Nx, Turborepo, Webpack, Vite, ESBuild

DATA ENGINEERING AND ANALYTICS:
Apache Spark, PySpark, Apache Kafka, Apache Airflow, dbt (data build tool), Dagster, Prefect, Databricks, Snowflake, BigQuery, Redshift, Azure Synapse, Delta Lake, Apache Iceberg, Apache Hudi, Data Lakehouse, Data Mesh, Data Contracts, Data Catalog, Data Lineage, Great Expectations, Data Quality, ETL, ELT, Reverse ETL, Real-Time Streaming, Batch Processing, Data Warehouse, Data Pipeline, Feature Store, MLflow, Weights and Biases, DVC, Power BI, Tableau, Looker, Metabase, Superset, Data Storytelling, A/B Testing, Statistical Analysis, SQL, dbt, Dimensional Modeling, Star Schema, Slowly Changing Dimensions, CDC (Change Data Capture)

NETWORKING:
BGP, OSPF, MPLS, SD-WAN, SASE, Zero Trust Network, Network Automation, Python Netmiko, NAPALM, Ansible Network, Cisco IOS, Juniper JunOS, Arista EOS, 5G, Wi-Fi 6E, Network Segmentation, Microsegmentation, DNS, DHCP, IPAM, Load Balancing, F5, Nginx, HAProxy, CDN, Network Monitoring, SNMP, NetFlow, Packet Analysis, Wireshark, Network Security, Firewall, Palo Alto, Fortinet, Check Point, IDS/IPS, NAC, Network Virtualization, NSX, VXLAN, Software Defined Networking (SDN), NFV, Cloud Networking, VPC, ExpressRoute, Direct Connect, Transit Gateway

IOT AND EDGE:
IoT Architecture, Edge Computing, Fog Computing, MQTT, CoAP, OPC-UA, LwM2M, AWS IoT Core, Azure IoT Hub, Google Cloud IoT, Digital Twin, Edge AI, TinyML, ONNX Runtime, TensorFlow Lite, Arduino, Raspberry Pi, ESP32, STM32, FreeRTOS, Zephyr, OTA Updates, Embedded Security, Secure Boot, SCADA, ICS, OT Security, IEC 62443, 5G NR, NB-IoT, LoRaWAN, Predictive Maintenance, Industrial IoT (IIoT), Industry 4.0, Smart Manufacturing, Smart Grid, Connected Vehicles, V2X

PROJECT AND PROGRAM MANAGEMENT:
Agile, Scrum, SAFe, Kanban, PRINCE2, PMP, PMI, OKRs, JIRA, Confluence, Azure DevOps, Monday.com, Asana, Notion, Risk Management, Stakeholder Management, Change Management, RACI Matrix, Project Charter, Statement of Work (SOW), Work Breakdown Structure (WBS), Critical Path Method (CPM), Earned Value Management (EVM), Sprint Planning, Retrospective, Daily Standup, Release Planning, Program Increment (PI), Roadmapping, Dependencies Management, RAID Log, Issue Management, Budget Management, Resource Planning, Portfolio Management, Benefits Realization, Business Case Development, Technical Program Manager (TPM), Delivery Management

---

PART C — HARD SKILLS MASTER LIST (2026 NORTH AMERICA)

PROGRAMMING LANGUAGES (Ranked by 2026 Demand):
Tier 1 (Essential): Python, TypeScript/JavaScript, SQL, Go, Java
Tier 2 (High Value): Rust, C#, Kotlin, Swift, C/C++, Bash/Shell
Tier 3 (Specialized): R, Scala, Julia, MATLAB, Solidity, Move, Haskell

AI AND ML FRAMEWORKS:
PyTorch, TensorFlow, JAX, Keras, Scikit-learn, XGBoost, LightGBM, Hugging Face Transformers, LangChain, LlamaIndex, CrewAI, AutoGen, Semantic Kernel, OpenAI SDK, Anthropic SDK, Google Generative AI SDK, ONNX, TensorRT, DeepSpeed, FSDP, Ray, Dask, Weights and Biases, MLflow, DVC, Optuna, Hydra

CLOUD PLATFORMS AND TOOLS:
AWS (EC2, S3, Lambda, EKS, RDS, DynamoDB, SageMaker, Bedrock, CloudFormation, CDK, IAM, VPC, Route53, CloudFront, CloudWatch, Cost Explorer)
Azure (Virtual Machines, Blob Storage, Functions, AKS, SQL Database, Cosmos DB, Azure AI, OpenAI Service, Bicep, ARM Templates, Entra ID, Virtual Network, Application Gateway, Monitor, Cost Management)
GCP (Compute Engine, Cloud Storage, Cloud Functions, GKE, Cloud SQL, Firestore, Vertex AI, Gemini API, Deployment Manager, Cloud Run, IAM, VPC, Cloud Load Balancing, Cloud Monitoring, Cost Management)
Multi-Cloud: Terraform, Pulumi, Ansible, CrossPlane, Kubernetes, Helm

DATABASE TECHNOLOGIES:
Relational: PostgreSQL, MySQL, Microsoft SQL Server, Oracle, SQLite
NoSQL: MongoDB, Cassandra, DynamoDB, Cosmos DB, Firebase
In-Memory: Redis, Memcached
Search: Elasticsearch, OpenSearch, Solr
Time-Series: InfluxDB, TimescaleDB, Prometheus (metrics storage)
Graph: Neo4j, Amazon Neptune, Azure Cosmos DB Gremlin
Vector: Pinecone, Weaviate, Chroma, Qdrant, Milvus, pgvector, Redis VSS
NewSQL: CockroachDB, TiDB, Google Spanner, YugabyteDB
Data Warehouse: Snowflake, BigQuery, Redshift, Azure Synapse, Databricks

DEVOPS AND AUTOMATION TOOLS:
Version Control: Git, GitHub, GitLab, Bitbucket
CI/CD: GitHub Actions, GitLab CI, Jenkins, CircleCI, ArgoCD, Flux, Tekton, Harness
Containerization: Docker, Podman, Buildah, Skopeo
Orchestration: Kubernetes, Helm, Kustomize, OpenShift, Rancher, k3s
Configuration: Ansible, Terraform, Chef, Puppet, Salt, Pulumi, CDK
Monitoring: Prometheus, Grafana, Datadog, New Relic, Dynatrace, Splunk, ELK Stack, OpenTelemetry, Jaeger, Zipkin
Security: Vault, SOPS, Sealed Secrets, OPA, Kyverno, Checkov, Trivy, Snyk, Falco

CYBERSECURITY TOOLS:
SIEM: Splunk, Microsoft Sentinel, IBM QRadar, Elastic SIEM, Chronicle, Sumo Logic
EDR/XDR: CrowdStrike Falcon, Microsoft Defender, SentinelOne, Carbon Black, Palo Alto Cortex XDR
Vulnerability: Qualys, Tenable Nessus, Rapid7 InsightVM, OpenVAS
Pen Testing: Metasploit, Burp Suite, Nmap, Wireshark, Kali Linux, Cobalt Strike, Bloodhound, Mimikatz
Cloud Security: Prisma Cloud, Wiz, Aqua Security, Lacework, AWS Security Hub, Microsoft Defender for Cloud
IAM: Okta, CyberArk, BeyondTrust, SailPoint, Saviynt, Azure Entra, AWS IAM, HashiCorp Vault
SOAR: Splunk SOAR (Phantom), Microsoft Sentinel Automation, IBM SOAR, Palo Alto XSOAR

NETWORKING TOOLS:
Cisco IOS, Cisco NXOS, Juniper JunOS, Arista EOS, Fortinet FortiOS, Palo Alto PAN-OS
Automation: Ansible (network modules), NAPALM, Netmiko, Nornir, Python-netconf
Monitoring: SolarWinds, PRTG, Nagios, Zabbix, LibreNMS, ntopng
SD-WAN: Cisco Meraki, VMware VeloCloud, Palo Alto Prisma SD-WAN, Fortinet SD-WAN

DEVELOPMENT TOOLS:
IDEs: VS Code, JetBrains Suite (IntelliJ, PyCharm, GoLand, WebStorm), Xcode, Visual Studio
AI Assistants: Claude Code, GitHub Copilot, Cursor, Tabnine, Codeium
Testing: Jest, Pytest, JUnit, Cypress, Playwright, Selenium, Postman, k6, JMeter, Locust
Collaboration: GitHub, GitLab, Jira, Confluence, Linear, Notion, Figma, Miro
Package Management: npm, yarn, pnpm, pip, Poetry, Conda, Cargo, Go Modules, Maven, Gradle

---

PART D — SOFT SKILLS MASTER LIST (2026)
These must appear in resumes WITH evidence, not as standalone claims.

COMMUNICATION:
Technical writing (documentation, runbooks, architecture docs, RFPs)
Executive communication (translating technical to non-technical)
Presentation skills (board-level, stakeholder, client-facing)
Active listening
Cross-cultural communication
Written communication (email, Slack, async-first environments)
Data storytelling (translating data insights to business decisions)

LEADERSHIP:
Team leadership (state team size and outcome)
Mentoring and coaching (state seniority of mentees and growth achieved)
Conflict resolution
Decision making under uncertainty
Organizational change management
Stakeholder alignment
Influencing without authority
Hiring and talent development

PROBLEM SOLVING:
Systems thinking
Root cause analysis
First principles reasoning
Hypothesis-driven problem solving
Design thinking
Risk assessment and prioritization
Trade-off analysis

COLLABORATION:
Cross-functional collaboration (name the functions)
Agile team participation
Remote and distributed team effectiveness
Client and vendor relationship management
Partnership development

ADAPTABILITY:
Learning agility (demonstrate with certifications or self-taught skills)
Ambiguity tolerance
Pivot under pressure
Rapid onboarding to new domains

BUSINESS ACUMEN:
Budget management and P&L awareness
ROI quantification for technology investments
Business case development
Customer success orientation
Revenue impact awareness
Cost optimization mindset

SPECIFIC TO 2026 MARKET (HIGHEST VALUE SOFT SKILLS):
AI literacy — ability to evaluate, prompt, and govern AI tools
Responsible AI judgment — knowing when AI output needs human review
Data governance mindset — treating data as a strategic asset
Security-first thinking — embedding security in all technical decisions
Continuous learning — demonstrably acquiring new skills regularly (certifications as evidence)

---

PART E — CERTIFICATIONS MASTER LIST (2026)
Ranked by 2026 market demand, salary impact, and future relevance through 2030.

MANDATORY TIER — Compulsory For Serious Candidates in That Domain:

CLOUD:
AWS Certified Solutions Architect – Associate (SAA-C03)
AWS Certified Solutions Architect – Professional (SAP-C02)
Microsoft Certified: Azure Solutions Architect Expert (AZ-305)
Microsoft Certified: Azure Administrator Associate (AZ-104)
Google Professional Cloud Architect
HashiCorp Certified: Terraform Associate
AWS Certified DevOps Engineer – Professional

CYBERSECURITY:
CISSP — Certified Information Systems Security Professional (gold standard, 5+ years)
CISM — Certified Information Security Manager (management track)
CEH — Certified Ethical Hacker (entry to mid)
CompTIA Security+ (entry level, widely recognized)
CompTIA CySA+ (analyst track)
OSCP — Offensive Security Certified Professional (technical red team)
ISC2 CC — Certified in Cybersecurity (free in 2026, entry level)
Microsoft SC-100 — Microsoft Cybersecurity Architect Expert
Microsoft SC-200 — Security Operations Analyst Associate
Google Professional Cloud Security Engineer
AWS Certified Security – Specialty

AI AND ML:
Google Professional Machine Learning Engineer
Microsoft Azure AI Engineer Associate (AI-102)
AWS Certified AI Practitioner
AWS Certified Machine Learning – Specialty
Deep Learning Specialization (deeplearning.ai, widely respected)
TensorFlow Developer Certificate (Google)
IBM AI Engineering Professional Certificate

PROJECT MANAGEMENT:
PMP — Project Management Professional
PMI-ACP — Agile Certified Practitioner
PRINCE2 Foundation and Practitioner
CSM — Certified ScrumMaster
SAFe SPC — SAFe Program Consultant
ITIL 4 Foundation (IT service management)

DATA AND ANALYTICS:
Databricks Certified Associate Developer for Apache Spark
Google Professional Data Engineer
AWS Certified Data Analytics – Specialty
Microsoft Certified: Azure Data Engineer Associate (DP-203)
Snowflake SnowPro Core Certification
dbt Analytics Engineering Certification

NETWORKING:
CCNA — Cisco Certified Network Associate
CCNP Enterprise
CCIE — Cisco Certified Internetwork Expert (elite)
CompTIA Network+
Juniper JNCIA, JNCIS, JNCIP
Palo Alto Networks PCNSE

EMERGING HIGH-VALUE CERTIFICATIONS (2026 Rising Fast):

AI Safety and Governance:
Responsible AI Institute Certification
IAPP AI Governance Professional (AIGP) — fastest growing compliance cert of 2026
Montreal AI Ethics Certification

Cloud Native and Kubernetes:
CKA — Certified Kubernetes Administrator
CKAD — Certified Kubernetes Application Developer
CKS — Certified Kubernetes Security Specialist
AWS Certified Kubernetes – Specialty

Post-Quantum Cryptography:
NIST PQC migration specialist designations (emerging 2026)
ISC2 Quantum Security (upcoming)

FinOps:
FinOps Certified Practitioner (FinOps Foundation)
FinOps Certified Engineer

Platform Engineering:
CNCF platform engineering certifications (emerging 2026)
Backstage certified contributors

Zero Trust:
Certified Zero Trust Professional (CrowdStrike Academy)
ZTCA — Zero Trust Certified Architect (Illumio)

Blockchain and Web3:
Certified Blockchain Professional (CBP)
Ethereum Developer Certification
Solana Developer Certification (rising)

DevSecOps:
DevSecOps Foundation (DSOF)
Certified DevSecOps Professional (CDP)
GitLab Certified Associate

CERTIFICATION INVESTMENT PRIORITY GUIDE:

If you have ZERO certifications and want the highest ROI first:
1. ISC2 CC (free, entry cybersecurity, doors open immediately)
2. AWS Cloud Practitioner (free exam vouchers often available, cloud foundation)
3. CompTIA Security+ (if targeting cybersecurity)
4. Azure Fundamentals AZ-900 (free learning paths, widely recognized)

If you are mid-career targeting $120K–180K roles:
1. AWS Solutions Architect Associate OR Azure Solutions Architect Expert
2. CISSP (if cybersecurity) OR PMP (if management)
3. AI/ML certification matching your domain
4. Kubernetes CKA

If you are senior targeting $180K+ or leadership roles:
1. CISSP + CISM combination (cybersecurity leadership)
2. AWS Solutions Architect Professional + AWS DevOps Professional
3. IAPP AIGP (AI governance, fastest growing in 2026)
4. FinOps Certified Practitioner

---

PART F — OCCUPATIONS AND HOW AI IS RESHAPING EACH ONE
2026 Reality + 5/10/15/20 Year Trajectory

TIER 1 — AI Supercharges These Roles (Demand Exploding, Salaries Rising)

AI ENGINEER (NEW ROLE, HIGHEST DEMAND):
2026: Builds production AI systems using LLMs, RAG, agents. Median salary Canada $140K-$180K. US $160K-$220K.
5 years: Core infrastructure role at every organization. Will specialize into Agent Architect, AI Safety Engineer, AI Ops.
10 years: As common as Software Engineer today. Mandatory at every company over 50 people.
20 years: Foundational discipline like electrical engineering. University departments fully formed.

CYBERSECURITY ANALYST (ALL LEVELS):
2026: AI handles tier-1 alert triage. Humans focus on complex investigations and threat hunting.
5 years: Every SOC analyst uses AI co-pilot. Roles split into AI-Augmented Analyst and AI Governance Analyst.
10 years: Threat intelligence fully AI-assisted. Human role: strategic judgment, adversary psychology, governance.
20 years: Cybersecurity is embedded in AI systems themselves. Humans govern AI-vs-AI warfare.

CLOUD ARCHITECT:
2026: AI generates IaC code. Architects focus on multi-cloud strategy, cost optimization, governance.
5 years: Architects become AI system designers — designing clouds that run AI at scale.
10 years: FinOps and security governance become primary architect concerns. Coding diminishes.
20 years: Cloud architect merges with AI infrastructure architect as a single hybrid discipline.

DATA SCIENTIST:
2026: AI automates EDA, feature engineering, model selection. Scientists focus on problem framing and business translation.
5 years: Two paths emerge: Applied AI Scientist (builds with LLMs) and Classical Data Scientist (statistics, experimentation).
10 years: Automated ML handles 80% of model building. Scientists govern, evaluate, and interpret.
20 years: Data science merges with decision science. Purely technical data scientists largely replaced by AI.

SITE RELIABILITY ENGINEER (SRE):
2026: AI handles automated runbooks, first-response incident diagnosis, capacity planning.
5 years: SREs design AI-powered observability systems. Human SREs manage AI agents that manage systems.
10 years: Autonomous infrastructure manages itself. SREs become reliability architects.
20 years: Self-healing systems. SREs become exception handlers for scenarios AI cannot resolve.

TIER 2 — AI Transforms These Roles (Skills Must Evolve or Role Diminishes)

SOFTWARE DEVELOPER:
2026: AI writes 40-60% of code. Developers focus on system design, requirements translation, code review.
5 years: Developers who do not use AI tools earn 30-40% less than those who do. Productivity gap is permanent.
10 years: Individual contributor coders largely replaced by small AI-augmented teams.
20 years: Software development becomes system orchestration. Code writing is a secondary skill.

DATABASE ADMINISTRATOR:
2026: AI auto-tunes queries, generates migration scripts, suggests indexes. DBAs focus on architecture and governance.
5 years: Traditional DBA role shrinks by 30%. Vector DBA and AI Database Architect emerge.
10 years: Autonomous database management handles routine operations. DBAs become data strategy roles.
20 years: Most database operations fully autonomous. Human DBAs govern AI-managed data estates.

NETWORK ENGINEER:
2026: AI generates configurations, diagnoses faults, optimizes routing. Engineers focus on architecture.
5 years: Network automation engineers replace traditional network engineers at 3:1 ratio.
10 years: Intent-based networking means engineers describe what they want, AI configures how.
20 years: Self-configuring, self-healing networks. Network engineers govern AI network systems.

TIER 3 — AI Creates New Adjacent Roles (Watch These Emerging Now)

PROMPT ENGINEER:
2026: Hottest new title. $100K-$160K. Designs prompts, evaluates outputs, builds prompt libraries.
5 years: Evolves into AI Interaction Designer. Model-specific skills become transferable.
10 years: Embedded into every technical role. Standalone prompt engineering commoditizes.
20 years: Absorbed into AI system design as a core competency.

AGENTIC AI DEVELOPER:
2026: Builds multi-agent systems using LangGraph, CrewAI, AutoGen. Explosive demand.
5 years: Every software team has an agentic AI specialist.
10 years: Standard software engineering specialization.
20 years: Core computer science curriculum.

FINOPS ENGINEER:
2026: Cloud waste is the fastest-growing IT cost problem. FinOps is mandatory.
5 years: Every organization with cloud spend over $1M/year has dedicated FinOps function.
10 years: AI-automated FinOps handles routine optimization. Humans govern exceptions.
20 years: Cost optimization AI is embedded in cloud platforms natively.

AI GOVERNANCE ANALYST:
2026: New role created by regulatory pressure. IAPP AIGP certification emerging.
5 years: Mandatory in every organization deploying AI in regulated industries.
10 years: Established profession with full regulatory framework.
20 years: As established as financial compliance or legal compliance today.

---

PART G — 2026 MARKET REALITIES: NORTH AMERICA SALARY BENCHMARKS

These ranges inform Job Coach AI's career advice and gap analysis recommendations.

CANADA (CAD, Toronto/Vancouver/Montreal):
Entry Level (0-2 years):
  Software Developer: $65K-$90K
  Data Analyst: $60K-$80K
  Cybersecurity Analyst: $65K-$85K
  Cloud/DevOps Junior: $70K-$90K

Mid Level (3-7 years):
  Software Engineer: $100K-$140K
  Data Scientist: $105K-$145K
  Security Analyst/Engineer: $100K-$135K
  Cloud/DevOps Engineer: $110K-$150K
  AI/ML Engineer: $120K-$165K

Senior Level (8+ years):
  Senior Software Engineer: $140K-$190K
  Security Architect / CISSP: $150K-$210K
  Cloud Architect: $155K-$220K
  AI/ML Lead or Principal: $170K-$240K
  CISO: $200K-$300K+
  CTO: $200K-$400K+

USA (USD, Major Tech Hubs: NYC, SF, Seattle, Austin, Chicago):
Entry Level (0-2 years):
  Software Developer: $80K-$120K
  Data Analyst: $70K-$100K
  Cybersecurity Analyst: $75K-$100K
  Cloud/DevOps Junior: $85K-$115K

Mid Level (3-7 years):
  Software Engineer: $130K-$185K
  Data Scientist: $140K-$190K
  Security Analyst/Engineer: $120K-$165K
  Cloud/DevOps Engineer: $140K-$195K
  AI/ML Engineer: $160K-$230K

Senior Level (8+ years):
  Senior Software Engineer: $185K-$280K
  Security Architect / CISSP: $180K-$260K
  Cloud Architect: $185K-$270K
  AI/ML Lead or Principal: $220K-$350K+
  CISO: $250K-$500K+
  CTO: $300K-$1M+ (equity dependent)

SALARY PREMIUM BY CERTIFICATION (2026 Data):
CISSP: +$20K-$35K average salary premium
AWS Solutions Architect Professional: +$18K-$28K
CISM: +$22K-$32K
PMP: +$12K-$20K
CKA (Kubernetes): +$15K-$22K
OSCP: +$18K-$28K (pentesting roles)
FinOps Certified: +$10K-$18K
IAPP AIGP: +$15K-$25K (fastest growing premium of 2026)
No certification but strong GitHub portfolio: +$10K-$20K vs same experience without portfolio

---

PART H — INDUSTRY-SPECIFIC JOB APPLICATION KEYWORDS
Use these when the user specifies their target industry.

FINANCIAL SERVICES AND BANKING:
Regulatory compliance, Basel III, OSFI guidelines, FINTRAC, AML/KYC, fraud detection, risk modeling, algorithmic trading, core banking systems, SWIFT, ISO 20022, PCI DSS, data governance, financial crime, model risk management, stress testing, liquidity risk, credit risk, operational risk, quantitative analysis, Python quant, Bloomberg API, market data, trade settlement, clearing and settlement

HEALTHCARE AND LIFE SCIENCES:
HIPAA, PHIPA (Canada), HL7, FHIR, EHR/EMR systems (Epic, Cerner), clinical data management, medical device software (IEC 62304), FDA 21 CFR Part 11, Health Canada regulations, clinical trial data, biopharma informatics, genomics, bioinformatics, population health, health informatics, telemedicine, healthcare AI, drug-drug interaction detection, diagnostic imaging AI, NLP for clinical notes

GOVERNMENT AND PUBLIC SECTOR:
FedRAMP, CMMC, PBMM (Canada), Protected B, ITAR, security clearance, GC Cloud, GCDOCS, shared services, ATIP, privacy by design, accessibility WCAG, bilingual services, public procurement, PSPC, TBIPS, ProServices, enterprise architecture for government, ServiceNow ITSM, cloud brokering

RETAIL AND ECOMMERCE:
PCI DSS, payment processing, Shopify, Magento, order management systems, inventory management, demand forecasting, personalization engines, recommendation systems, customer data platforms (CDP), loyalty programs, A/B testing, conversion rate optimization, omnichannel, supply chain visibility, last-mile delivery, fraud prevention, customer lifetime value (CLV), ROAS, CAC

MANUFACTURING AND INDUSTRIAL:
Industry 4.0, IIoT, SCADA, MES (Manufacturing Execution System), ERP (SAP, Oracle), OPC-UA, predictive maintenance, digital twin, computer vision for quality control, IEC 62443, OT security, automation, robotics, PLC programming, Six Sigma, lean manufacturing, supply chain optimization, logistics optimization

TELECOMMUNICATIONS:
5G, network slicing, NFV, SDN, OSS/BSS, MVNO, LTE, VoIP, SIP, IMS, billing systems, number portability, regulatory compliance (CRTC Canada, FCC USA), network planning, spectrum management, subscriber data management, churn prediction, network performance management

ENERGY AND UTILITIES:
NERC CIP, smart grid, SCADA security, energy management systems (EMS), OT/IT convergence, renewable energy integration, battery management systems, demand response, grid modernization, asset management, predictive maintenance, digital substation, AMI, metering data management, ESG reporting

---

PART I — RESUME BULLET FORMULA TEMPLATES
Job Coach AI uses these formulas to rewrite resume bullets for maximum impact.

THE STAR FORMULA FOR BULLETS:
[Strong Action Verb] + [What You Did] + [How/Context] + [Measurable Result]

Strong Action Verbs by Category:

BUILDING AND CREATING: Architected, Built, Designed, Developed, Engineered, Implemented, Deployed, Launched, Created, Established, Introduced, Pioneered, Spearheaded

IMPROVING AND OPTIMIZING: Accelerated, Enhanced, Improved, Optimized, Reduced, Eliminated, Automated, Streamlined, Modernized, Transformed, Upgraded, Refactored, Migrated

LEADING AND MANAGING: Led, Managed, Directed, Oversaw, Coordinated, Mentored, Coached, Guided, Championed, Facilitated, Orchestrated, Supervised

ANALYZING AND SOLVING: Analyzed, Identified, Diagnosed, Investigated, Resolved, Debugged, Audited, Assessed, Evaluated, Benchmarked

DELIVERING VALUE: Delivered, Achieved, Drove, Generated, Secured, Saved, Grew, Increased, Scaled, Expanded, Reduced

EXAMPLE BULLETS BY ROLE (use as templates):

Cloud Architect:
Architected multi-cloud hybrid infrastructure across AWS and Azure for 200-server migration, reducing operational costs by 34% ($2.1M annual savings) while improving uptime from 99.5% to 99.98%.

Security Engineer:
Reduced mean time to detect (MTTD) security incidents from 72 hours to 4 hours by implementing Microsoft Sentinel SIEM with custom KQL detection rules across 15,000 endpoints.

DevOps Engineer:
Reduced deployment frequency from bi-weekly to 47 deployments per day by building GitHub Actions CI/CD pipelines with automated SAST scanning, container security checks, and progressive canary deployments.

Data Engineer:
Built real-time data pipeline processing 2.3 million events per hour using Apache Kafka, PySpark, and Databricks Delta Lake, reducing data latency from 6 hours to under 3 minutes.

Software Engineer:
Refactored 200,000-line monolith into 12 microservices using Domain-Driven Design, reducing average API response time by 67% and enabling independent team deployments.

AI/ML Engineer:
Fine-tuned Llama 3 70B using QLoRA on proprietary customer data, achieving 89% accuracy on domain-specific classification tasks versus 61% baseline, deployed via FastAPI on AWS SageMaker.

Cybersecurity Analyst (SOC):
Triaged 2,400+ weekly SIEM alerts using Splunk SOAR playbooks and custom correlation rules, achieving 94% true-positive rate while reducing analyst workload by 60%.

Project Manager:
Delivered $8.2M cloud migration program 3 weeks ahead of schedule and $400K under budget by implementing earned value management and weekly risk reviews with 12 vendor stakeholders.

---

PART J — LINKEDIN PROFILE OPTIMIZATION (Companion to Resume)

JOB COACH AI SHOULD RECOMMEND THESE ALONGSIDE RESUME IMPROVEMENTS.

HEADLINE FORMULA (Most Visible Element):
[Current Role] | [Top Skill 1] + [Top Skill 2] | [Unique Value Proposition] | [Status]

Example:
"Cloud Architect | AWS + Azure Multi-Cloud | $50M+ Infrastructure Delivered | Open to Senior Roles in Toronto or Remote"

ABOUT SECTION FORMULA (First 3 lines most critical):
Line 1: Who you are and what you do (one sentence, no fluff)
Line 2: Your superpower — the specific thing you do better than most
Line 3: The outcome you deliver for organizations (include a number)

Then: 3-5 bullet points on your core skills and specializations
Then: What you are looking for or working toward
Then: How to contact you

FEATURED SECTION:
Pin your best LinkedIn article
Pin a project or portfolio link
Pin a certification announcement post

ACTIVITY SECTION:
Post original content minimum once per week
Comment thoughtfully on 3 posts per day in your domain
Engagement drives profile visibility in recruiter searches

SKILLS SECTION (LinkedIn SEO):
Maximum 50 skills allowed — use all 50
Top 3 skills should be your most in-demand keywords
Ask 3 former managers or colleagues for skill endorsements
Skills with 99+ endorsements rank higher in recruiter search

RECOMMENDATIONS:
Minimum 3 recommendations from managers or senior peers
Ask for recommendations that describe a specific project and outcome
Reciprocate — giving recommendations builds goodwill and visibility

---

PART K — THE KEYWORDS JOB COACH AI INJECTS AUTOMATICALLY

These are always injected into cover letters when they match the job description, and flagged in gap analysis when missing from the resume.

UNIVERSAL HIGH-VALUE KEYWORDS (appear in 80%+ of senior IT job postings):
Cross-functional collaboration, stakeholder management, enterprise architecture, cloud-native, digital transformation, agile methodology, continuous improvement, data-driven decision making, scalable solutions, high availability, disaster recovery, business continuity, security by design, shift left, automation first, observable systems, infrastructure as code, zero trust, cost optimization, ROI

AI-ERA KEYWORDS (appearing in 2026 job postings that did not exist in 2023):
AI-augmented workflows, agentic AI, RAG pipeline, vector search, LLM integration, responsible AI, AI governance, model evaluation, prompt engineering, multi-agent orchestration, AI ops, foundation model deployment, context window management, embedding strategy, semantic caching

CANADIAN MARKET SPECIFIC:
Bilingual (English/French) for federal and Quebec-based roles
Security clearance (Secret or Top Secret for government and defense roles)
PIPEDA compliance for privacy roles
OSFI guidelines for financial sector roles
CRTC compliance for telecommunications roles
Ontario/BC/Alberta privacy legislation for provincial roles

---

END OF SECTION 20

================================================================================
MASTER DOCUMENT IS NOW COMPLETE
================================================================================

Total sections: 20
Total content: Resume scoring formula, complete skill inventories, certification rankings,
occupation trajectories through 2040, salary benchmarks, bullet templates, LinkedIn optimization,
full codebase, deployment guide, security architecture, 8-hour build plan.

This is the single reference document for:
1. Building Job Coach AI (Sections 1-19)
2. Training Job Coach AI's intelligence layer (Section 20)
3. Understanding the 2026 career market it serves (Section 20)

Built by Shahzad + Claude.ai + Claude Code | March 2026
Stack: Next.js 14 + TypeScript + Tailwind + Gemini 2.0 Flash + Vercel

================================================================================
SECTION 21 — SHAHZAD'S LINKEDIN INTELLIGENCE LAYER
Extracted from Shahzad MS LinkedIn Articles | March 2026
Source: The Great IT Transformation + Agentic AI Zero-to-Hero + LinkedIn Skills on the Rise 2026
North America Focus | USA + Canada | 2026–2040 Horizon
================================================================================

This section is the AI intelligence engine for Job Coach AI.
Every keyword, tool, certification, occupation, skill, and trend below feeds directly into:
  - Resume gap analysis engine
  - Cover letter keyword injection
  - Certification recommendation logic
  - Career trajectory advice
  - Interview preparation suggestions
  - Salary expectation calibration

---

PART A — CLAUDE OPUS 4.6 AND THE AI MODEL LANDSCAPE (2026)
Why This Matters for Job Coach AI: These are the tools your users are expected to know.

CLAUDE OPUS 4.6 SPECIFICATIONS (Anthropic):
128,000 output tokens — entire architecture documents in one response
1,000,000 token context window (beta) — entire codebase in memory
Adaptive Thinking — auto-calibrates reasoning depth to task complexity
Agentic Capability — plans, executes subtasks in parallel, runs tools, calls APIs
Computer Use — operates computers like a human (click, type, navigate, configure)
2.5x faster inference in Fast Mode
80.8% on SWE-bench Verified (world-class software engineering benchmark)
90.2% on BigLaw Bench (precision for compliance and legal-technical work)
65.4% on Terminal-Bench 2.0 (real command-line operations)
500+ high-severity vulnerabilities found in production codebases that survived years of expert review
$1 billion run rate for Claude Code in 6 months
Compaction API for infinite conversations
Deployed at: Uber, Salesforce, Spotify, Accenture, Novo Nordisk, Snowflake, Ramp

COMPETING AI MODELS (2026 — All Transforming IT):
OpenAI GPT-4.5 / o3 — strong reasoning, coding excellence, Microsoft-integrated
Google Gemini 2.0 Ultra — deep Google Workspace and GCP integration, long context
Meta Llama 4 — open-source, deployable on-premise, enterprise self-hosted
Mistral Large 3 — European, privacy-focused, GDPR-native, on-premise deployable
Amazon Nova Pro — AWS-native, cost-optimized for Bedrock workloads
xAI Grok 3 — real-time data access, strong in analytics

AI MODEL CAPABILITIES EVERY IT PROFESSIONAL MUST KNOW IN 2026:
Prompt engineering, context window management, token optimization, model fine-tuning, RAG (Retrieval-Augmented Generation), embeddings, semantic search, function calling, structured outputs, tool use, agentic workflows, multi-agent orchestration, model evaluation, guardrails, responsible AI, AI governance, bias detection, model context protocol (MCP), computer use, adaptive thinking, RLHF, PEFT, LoRA, QLoRA, quantization, ONNX, TensorRT

---

PART B — AGENTIC AI COMPLETE INTELLIGENCE LAYER
From Shahzad's Zero-to-Hero Agentic AI Article | February 2026

WHAT AGENTIC AI IS (JOB COACH AI MUST EXPLAIN THIS IN GAP ANALYSIS):
Reactive AI = chatbot that answers prompts
Agentic AI = AI given a GOAL that independently reasons, plans, uses tools, executes multi-step tasks, and completes workflows with minimal human intervention
Four pillars: Reasoning + Planning + Tool Use + Memory
Multi-agent systems: specialized agents collaborate like high-performing human teams

2026 AGENTIC AI MARKET NUMBERS (Feed into salary and career advice):
Global agentic AI market: $7.8 billion today → $52 billion by 2030
$300 billion global spending on AI systems in 2026
Gartner: 40% of enterprise applications will embed AI agents by end of 2026 (from <5% in 2025)
1.3 million+ new roles globally created because of AI agents
Google Cloud projects agentic AI at $1 trillion market realization by 2040
38% of organizations piloting agentic solutions — only 11% in active production (Deloitte)
89% of organizations still operate on industrial-era models (McKinsey)
Gartner predicts 40% of agentic AI projects will be cancelled by end of 2027 (governance failure, not tech failure)

AGENTIC AI FRAMEWORKS — EVERY DEVELOPER MUST KNOW THESE IN 2026:

Open-Source Free Frameworks:
LangChain — most widely adopted framework for custom AI agents, tool use, memory, reasoning
LangGraph — stateful, graph-based agent workflows, industry standard for complex orchestration
CrewAI — multi-agent collaboration, specialized roles, goals, and crews
AutoGen / AG2 (Microsoft) — conversational multi-agent, debate and collaborate to resolve tasks
Semantic Kernel (Microsoft) — .NET + Python, enterprise Microsoft ecosystem integration
LlamaIndex — data-focused agents, RAG pipelines, vector database integration
OpenAI Agents SDK — OpenAI-native agent construction
Hugging Face — open-source model hub, run agents with Llama, Mistral, Falcon for free

No-Code/Low-Code Agentic Platforms:
n8n (self-hosted, free) — most powerful free agentic workflow builder, 400+ integrations
Botpress (free tier) — visual drag-and-drop, CRM and email integrations
Microsoft Copilot Studio (free trial) — Microsoft 365 ecosystem, Teams, SharePoint, Dynamics
MindStudio (free tier) — no-code, deployed as web apps, browser extensions, API endpoints
Gumloop (freemium) — visual node-based, AI-first automation, marketing and content
Voiceflow (free tier) — conversational AI agents, customer service and sales
Relevance AI (free tier) — multi-agent builder for HR, sales, marketing, ops
ChatGPT Custom GPTs — custom agents with knowledge base, instructions, API connections
Google Gemini (free tier) — integrated with Gmail, Drive, Docs, Sheets, Calendar

Paid Production Platforms:
Lindy ($49/month) — no-code business automation, sales, support, internal operations
n8n Cloud ($20/month) — self-hostable, flexible, full data control
Zapier AI Agents ($19/month) — non-technical users, wide app integrations
Make/Integromat ($9/month) — visual workflow, wide integration library
Clay ($149/month) — sales and growth, data enrichment, prospecting at scale
IBM watsonx Orchestrate (enterprise) — multi-agent orchestration, large enterprise governance
Salesforce AgentForce (per-use) — CRM-embedded agentic automation, Salesforce ecosystem
Microsoft Copilot Enterprise ($30/user/month) — Microsoft 365 native, Teams, Outlook, SharePoint, Dynamics
Vellum (enterprise) — production-grade deployment with evaluation, versioning, observability

AGENTIC AI BY INDUSTRY — WHAT IS HAPPENING RIGHT NOW:

Healthcare & Life Sciences:
Autonomously reviewing patient records, flagging anomalies, scheduling follow-ups
Processing insurance claims, monitoring clinical trial data
Medical research agents scan thousands of papers, generate hypothesis reports in hours vs months
Patient intake agents handle scheduling, insurance verification, pre-visit questionnaires

Financial Services & Banking:
Monitoring transaction streams in real time, detecting fraud patterns
Triggering compliance flags, generating regulatory reports
Executing portfolio rebalancing within defined risk parameters
Credit risk agents analyze applications, pull external data, produce decision recommendations in seconds

Legal & Compliance:
Legal research agents search case law, identify precedents, draft contract language
Flag compliance gaps across thousands of documents simultaneously
70%+ reduction in document review time vs human-only teams
Contract drafting, review, redlining, regulatory monitoring

Manufacturing & Supply Chain:
Monitor production line sensor data, predict equipment failures before occurrence
Automatically trigger maintenance work orders
Rebalance supply chain logistics in real time when disruptions detected
Procurement agents identify vendors, compare pricing, initiate purchase orders within pre-approved parameters

Education & EdTech:
Personalized learning agents adapt curriculum in real time to student performance
Identify knowledge gaps, generate practice exercises, provide immediate feedback
Flag at-risk students to human educators
Administrative agents: enrollment, scheduling, grade reporting, parent communications

Retail & E-Commerce:
Inventory agents monitor stock across thousands of SKUs, trigger reorders
Optimize pricing dynamically, manage supplier relationships
Customer service agents handle returns, complaints, product inquiries 24/7 in multiple languages

Government & Public Sector:
Document processing agents for permit applications, benefits claims, licensing renewals
Citizen service agents for 24/7 government services assistance
AWS, Oracle, and Cisco delivering agentic solutions for federal workflows
Network traffic management, data entry automation, document review at massive scale

Technology & Software Engineering:
Coding agents write code, run tests, identify bugs, suggest fixes, deploy changes
DevOps agents monitor system health, detect incidents, execute runbooks
Engineering teams spending dramatically less time on foundational code
Dramatically more time on system design, quality validation, strategic oversight

Marketing & Sales:
Research agents monitor competitor activity, summarize industry news, generate weekly briefings
Outreach agents personalize sales emails at scale using real-time prospect data
Content agents draft blog posts, social media, ad copy for human review
Lead qualification agents engage prospects, ask qualifying questions, route high-potential leads

Real Estate & Property Management:
Property management agents handle tenant communications, maintenance routing, lease renewal
Market analysis agents continuously monitor comparable sales, assess valuations, generate investment reports

---

PART C — LINKEDIN SKILLS ON THE RISE 2026
Official Source: https://news.linkedin.com/2026/Skills-on-the-rise-2026
Data: December 2024 – November 2025 | Markets: USA, Canada, UK, Australia, Singapore

KEY INSIGHT FROM LINKEDIN DATA:
Nearly half of all recruiters on LinkedIn now use SKILLS DATA to filter candidates
Not job titles. Not degrees. Not years of experience. Just: Can you do the work?
LinkedIn COO Dan Shapero: "Those who embrace AI, are curious with the technology, and use it in their daily work will be seen as the future leaders at each company."

THREE FORCES DRIVING ALL RISING SKILLS:
1. AI deployment — not just understanding AI, but BUILDING with it
2. Operational intelligence — using data to optimize real business processes
3. Human leadership — communicating, aligning, and managing through change

UNITED STATES — FASTEST RISING SKILLS 2026:
AI Engineering cluster: Data Annotation, FastAPI, Google Gemini, LangChain, Model Training and Fine-Tuning, OpenAI API Integration, Retrieval-Augmented Generation (RAG), Vector Databases, PySpark, Matplotlib, PyTorch, MLOps
AI Business Strategy cluster: AI for Business, Data Governance, Responsible AI, Tech-Enabled Business Transformation
Other rising: Operational Efficiency, Financial Operations and Analysis, Cybersecurity and Risk Management, Leadership and People Management, Business Revenue Growth

CANADA — FASTEST RISING IT SKILLS 2026:

Cluster 1 — AI Engineering and Implementation:
Prompt Engineering, Data Annotation, LangChain, OpenAI API Integration, Retrieval-Augmented Generation (RAG), Vector Databases, Model Training and Fine-Tuning, Azure Databricks, CI/CD Pipelines, FastAPI, PySpark, PyTorch, MLOps

Cluster 2 — Data and AI Strategy:
AI for Business, Data Governance, Responsible AI, Data Interpretation, Data Integration, Cloud Infrastructure, Software Infrastructure, PIPEDA Compliance

Cluster 3 — Stakeholder Management and Client Engagement (UNIQUELY STRONG IN CANADA):
Client Communication, Onboarding, Customer Interaction, Cross-Functional Collaboration, Business Partner Communication, Stakeholder Alignment, Executive Communication

Cluster 4 — Cloud Infrastructure and DevOps:
Cloud Infrastructure (AWS, Azure, GCP), API Integration, Full-Stack Development, UI Engineering, DevOps, CI/CD Pipelines, Workflow Management, Product Operations

Cluster 5 — Cybersecurity and Risk/Compliance:
GRC (Governance, Risk, Compliance), Cyber Risk Management, Ethical Decision Making, OSFI Guidelines, Operational Security, Vulnerability Management

UNITED KINGDOM — FASTEST RISING SKILLS 2026:
AI/ML cluster: Prompt Engineering, Chatbot Development, Large Language Models, Regression Analysis, MLOps
Data Strategy cluster: Data-Driven Decision Making, Data Storytelling, Business Process Automation, Process Optimization, Workflow Management
Operations and Risk cluster: GRC, Cyber Risk Management, Ethical Decision Making, Statutory Reporting, Operational Excellence
Leadership cluster: Project Management, Cross-Functional Collaboration, DEIB, Cross-Cultural Communication
Commercial cluster: Strategic Planning, Technology Roadmapping, Sales Negotiation, Revenue Growth Strategy, Relationship Management

AUSTRALIA — FASTEST RISING SKILLS 2026:
AI/ML/Data: Prompt Engineering, Data Analysis and Insights, Model Training and Fine-Tuning, Data Platforms, Forecasting, Workflow Automation
Tech Engineering: Full-Stack Development, API Integration, DevOps, Cloud Infrastructure, UI Engineering
Communication: Stakeholder Collaboration, Client Communication, Brand Storytelling, Cross-Cultural Communication
People Development: Onboarding Design, Mentoring, Learning Program Design, Team Development, Cross-Functional Leadership
Governance: GRC, Ethical Decision Making, ESG Strategy, Policy Development

SINGAPORE — FASTEST RISING SKILLS 2026:
AI/ML/Data Engineering: Large Language Models, Generative AI, Computer Vision, Robotics, Data Engineering, Model Training
Software/Cloud: Full-Stack, Back-End, DevOps, Mobile App Development, Cloud Systems
Strategic Business: Strategic Leadership, Business Transformation, Business Development, Business Acumen
Financial: Financial Modeling, Forecasting, Risk-Adjusted Planning

---

PART D — COMPLETE KEYWORD MASTER LIST BY IT DOMAIN
Pulled from Shahzad's Great IT Transformation Article + LinkedIn Data + 2026 Job Postings

DOMAIN 1 — SOFTWARE DEVELOPMENT AND ENGINEERING KEYWORDS:

All Levels:
Junior Developer, Trainee Software Engineer, Mid-level Software Developer, Senior Software Engineer, Lead Engineer, Tech Lead, Principal Engineer, Staff Engineer, Distinguished Engineer, Fellow, Software Architect, Full-Stack Developer, Front-End Developer, Back-End Developer, Mobile Developer, iOS Developer, Android Developer, Cross-Platform Developer, Embedded Systems Developer, Firmware Engineer, Game Developer, Graphics Engineer, Compiler Engineer, Programming Language Designer, SDK Developer, API Developer, Integration Engineer, Platform Engineer, Open Source Maintainer

Technical Keywords:
TypeScript, JavaScript, Python, Go, Golang, Rust, Java, C#, C++, Kotlin, Swift, Bash, Shell, R, Scala, Julia, MATLAB, Solidity, Move, Haskell
React, Next.js, Vue.js, Angular, Node.js, FastAPI, Django, Flask, Spring Boot, .NET, GraphQL, REST API, gRPC, WebSockets
Microservices, Event-Driven Architecture, CQRS, Event Sourcing, Domain-Driven Design, DDD, Clean Architecture, SOLID Principles, Design Patterns, System Design, Distributed Systems
Message Queues, Apache Kafka, RabbitMQ, Redis, PostgreSQL, MySQL, MongoDB, Elasticsearch
WebAssembly, PWA, Accessibility, WCAG, Performance Optimization, Core Web Vitals
TDD, BDD, Unit Testing, Integration Testing, E2E Testing, Jest, Cypress, Playwright, Selenium
Monorepo, Nx, Turborepo, Webpack, Vite, ESBuild, OpenAPI, Swagger

AI Applied to Software Development:
Claude Code, GitHub Copilot, Cursor, Tabnine, Codeium
Generates boilerplate and scaffolding, reviews code with explanations, refactors messy code into clean patterns
Generates complete feature implementations from requirements, writes and explains all test types
Identifies edge cases, translates business requirements into technical specifications
Full technical design documents from high-level requirements, architecture decision records (ADRs)
Analyzes trade-offs, automates code review, generates migration plans
Legacy system modernization, monolith to microservices migration
For senior roles: synthesizes research papers into architecture recommendations, models complex system interactions, generates comprehensive RFPs

DOMAIN 2 — AI AND MACHINE LEARNING KEYWORDS:

Occupations:
ML Engineer, AI Engineer, Data Scientist, Research Scientist, Applied Scientist, NLP Engineer, Computer Vision Engineer, MLOps Engineer, AI Product Manager, Prompt Engineer, AI Safety Engineer, AI Ethics Researcher, Reinforcement Learning Engineer, Foundation Model Researcher, AI Infrastructure Engineer, Feature Engineering Specialist, Model Evaluation Engineer, Fine-Tuning Specialist, AI Integration Engineer, Conversational AI Designer, Recommendation Systems Engineer, AI Solutions Architect

Technical Keywords:
PyTorch, TensorFlow, JAX, Keras, Scikit-learn, XGBoost, LightGBM, Hugging Face Transformers, LangChain, LlamaIndex, CrewAI, AutoGen, Semantic Kernel
OpenAI SDK, Anthropic SDK, Google Generative AI SDK, ONNX, TensorRT, DeepSpeed, FSDP, Ray, Dask
Weights and Biases, MLflow, DVC, Optuna, Hydra
Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), Vector Databases, Prompt Engineering, Model Fine-Tuning, RLHF, PEFT, LoRA, QLoRA, Embeddings, Semantic Search
Pinecone, Weaviate, Chroma, Qdrant, Milvus, pgvector, Redis VSS
Model Evaluation, A/B Testing for Models, Feature Engineering, Data Annotation, Data Labeling
Multi-Agent Systems, Agentic AI, Computer Use, Tool Use, Function Calling, Structured Outputs, Guardrails, AI Safety, Responsible AI, Explainable AI (XAI), Bias Detection, Fairness Metrics, Model Context Protocol (MCP)

AI Applied to ML Engineering:
Research synthesis: Upload 50 arxiv papers → structured literature review, key innovations table, research gap analysis
Model architecture design from task description with hyperparameter starting points
Complete PyTorch/TensorFlow/JAX training scripts with distributed training, mixed precision, gradient checkpointing
Diagnoses exploding gradients, data imbalance, overfitting, underfitting from loss curves and logs
Complete MLflow/Weights and Biases/Kubeflow pipeline code generation
Feature engineering: analyzes dataset, suggests uncovered features, flags data quality issues
Prompt Engineers: Claude helps design, evaluate, iterate prompt libraries, generates red-teaming scenarios, evaluates prompt robustness

DOMAIN 3 — CYBERSECURITY KEYWORDS:

Occupations:
Security Analyst Tier 1/2/3, SOC Analyst, Penetration Tester, Ethical Hacker, Red Team Operator, Blue Team Analyst, Purple Team Specialist, Vulnerability Researcher, Malware Analyst, Reverse Engineer, Incident Responder, Digital Forensics Analyst, Threat Intelligence Analyst, Security Engineer, AppSec Engineer, Cloud Security Engineer, Network Security Engineer, IAM Engineer, PKI/Cryptography Engineer, Security Architect, CISO, GRC Analyst, Data Privacy Officer, DPO, Compliance Analyst, Bug Bounty Hunter, Threat Hunter, OSINT Analyst, Security Awareness Trainer

Technical Keywords:
SIEM (Splunk, Microsoft Sentinel, IBM QRadar, Elastic SIEM, Chronicle, Sumo Logic)
EDR/XDR (CrowdStrike Falcon, Microsoft Defender, SentinelOne, Carbon Black, Palo Alto Cortex XDR)
SOAR (Splunk SOAR/Phantom, Microsoft Sentinel Automation, IBM SOAR, Palo Alto XSOAR)
Vulnerability (Qualys, Tenable Nessus, Rapid7 InsightVM, OpenVAS)
Pen Testing (Metasploit, Burp Suite, Nmap, Wireshark, Kali Linux, Cobalt Strike, Bloodhound, Mimikatz)
Cloud Security (Prisma Cloud, Wiz, Aqua Security, Lacework, AWS Security Hub, Microsoft Defender for Cloud)
IAM (Okta, CyberArk, BeyondTrust, SailPoint, Saviynt, Azure Entra, AWS IAM, HashiCorp Vault)
Zero Trust Architecture, MITRE ATT&CK, CVSS, CVE, Vulnerability Management, OSINT, Threat Hunting
Cloud Security, IAM, PAM, MFA, SAML, OAuth, OIDC, ZTNA, CASB, SASE, DLP, Encryption, PKI, TLS, Key Management
GRC, ISO 27001, SOC 2, NIST CSF, CIS Controls, PCI DSS, HIPAA, GDPR, PIPEDA, CCPA, FedRAMP
Risk Assessment, Threat Modeling, STRIDE, PASTA, AppSec, OWASP, DAST, SAST, DevSecOps, Shift Left Security
SBOM, Supply Chain Security, Post-Quantum Cryptography, ML-KEM, ML-DSA, Security Awareness Training, Phishing Simulation
Cyber Risk Quantification, FAIR Model, CISO, vCISO, Security Operations Center (SOC), Wazuh, OpenSearch, Kibana, Tailscale VPN

Landmark 2026 Achievement:
February 2026: Using Claude Opus 4.6, security researchers found 500+ high-severity vulnerabilities in major production open-source libraries — bugs that survived years of expert review undetected.

AI Applied to Cybersecurity:
SOC Analysts: Processes thousands of SIEM alerts simultaneously, correlates events across disparate log sources, generates incident reports, suggests containment actions with confidence scores
Reduces MTTD and MTTR dramatically
Pen Testers: Generates custom exploitation paths, writes custom payloads and PoC exploit code, analyzes source code for vulnerability patterns, generates comprehensive pentest reports automatically
Vulnerability Researchers: Deep static analysis of large codebases, cross-references CVE databases and MITRE ATT&CK, generates PoC code, maps exploitation chains
GRC Analysts: Maps controls to all frameworks simultaneously, generates gap analyses, drafts security policies, automates evidence collection for audits
Threat Intelligence: Synthesizes threat feeds, dark web intelligence, industry reports into actionable briefings, maps TTPs to MITRE ATT&CK automatically

DOMAIN 4 — CLOUD COMPUTING AND INFRASTRUCTURE KEYWORDS:

Occupations:
Cloud Architect, Cloud Engineer, AWS Solutions Architect, Azure Solutions Architect, GCP Architect, Multi-Cloud Architect, Cloud Security Engineer, FinOps Engineer, Cloud Migration Engineer, Cloud DevOps Engineer, IaC Engineer, SRE, Platform Engineer, Kubernetes Engineer, Container Orchestration Specialist, Cloud DBA, Serverless Architect, Cloud Network Engineer, Cloud Compliance Engineer, Cloud Storage Engineer

Technical Keywords:
AWS (EC2, S3, Lambda, EKS, RDS, DynamoDB, SageMaker, Bedrock, CloudFormation, CDK, IAM, VPC, Route53, CloudFront, CloudWatch, Cost Explorer, Control Tower)
Azure (VMs, Blob Storage, Functions, AKS, SQL Database, Cosmos DB, Azure AI, OpenAI Service, Bicep, ARM Templates, Entra ID, Virtual Network, Application Gateway, Monitor, Cost Management, Landing Zones)
GCP (Compute Engine, Cloud Storage, Cloud Functions, GKE, Cloud SQL, Firestore, Vertex AI, Gemini API, Deployment Manager, Cloud Run, IAM, VPC, Cloud Load Balancing, Cloud Monitoring)
Terraform, Pulumi, Ansible, CrossPlane, Kubernetes, Helm, Docker, Serverless, Infrastructure as Code
FinOps, Cloud Cost Optimization, Reserved Instances, Spot Instances, Right-Sizing
Cloud Migration, Lift and Shift, Replatforming, Refactoring, Landing Zone, Well-Architected Framework
Cloud Governance, Policy as Code, Open Policy Agent (OPA), AWS SCPs, Azure Policy

AI Applied to Cloud:
IaC generation: describe infrastructure in plain English → complete Terraform, CloudFormation, Bicep, or Pulumi code with best practices
Architecture diagram to code: upload whiteboard photo → full IaC implementation generated
Cost optimization: feed AWS Cost Explorer or Azure Cost Management export → identifies waste, reserved instance opportunities, right-sizing, projected savings
Real example: enterprise uploads 6 months of billing data across AWS, Azure, GCP → Claude identifies $2.3M/year in waste
Migration planning: "Migrate 200-server on-premise estate to Azure" → phased migration plan with dependency mapping, risk assessment, rollback strategies
Policy-as-code: generates OPA policies, AWS SCPs, Azure Policy definitions from plain-language compliance requirements

DOMAIN 5 — DEVOPS, DEVSECOPS AND PLATFORM ENGINEERING KEYWORDS:

Occupations:
DevOps Engineer, DevSecOps Engineer, Platform Engineer, Release Engineer, Build Engineer, CI/CD Pipeline Engineer, Automation Engineer, Infrastructure Engineer, Configuration Management Engineer, GitOps Engineer, Deployment Engineer, Chaos Engineer, SRE, Production Engineer, Observability Engineer, Monitoring Engineer, On-Call Engineer, Change Management Engineer

Technical Keywords:
CI/CD, GitHub Actions, GitLab CI, Jenkins, CircleCI, ArgoCD, Flux, Tekton, Harness, GitOps
Docker, Podman, Buildah, Kubernetes, Helm, Kustomize, OpenShift, Rancher, k3s
Ansible, Terraform, Chef, Puppet, Salt, Pulumi, CDK, Configuration Management
Prometheus, Grafana, Datadog, New Relic, Dynatrace, Splunk, ELK Stack, OpenTelemetry, Jaeger, Zipkin, SLI, SLO, SLA, Error Budgets
Chaos Engineering, Chaos Monkey, Blue-Green Deployment, Canary Deployment, Feature Flags, DORA Metrics, Lead Time, Deployment Frequency, MTTR, Change Failure Rate
Vault, SOPS, Sealed Secrets, OPA, Kyverno, Checkov, Trivy, Snyk, Falco, Backstage, Internal Developer Platform (IDP)
Developer Experience (DevEx), Golden Paths, DevSecOps, Shift Left, SBOM

AI Applied to DevOps — The 3am Scenario:
Production is down. Alerts firing across 12 dashboards. Paste error logs, recent deployment diff, and infrastructure diagram into Claude.
In 90 seconds: probable root cause ranked by confidence, immediate mitigation steps, commands to run, what to tell your CTO.
Pipeline generation: "Create a CI/CD pipeline for a Python microservice deploying to Kubernetes on GKE with SAST scanning, DAST testing, and progressive delivery" → complete GitHub Actions YAML generated
Post-mortem analysis: feed incident timeline, logs, metrics → structured post-mortem with 5-why root cause analysis and action items
SLI/SLO design: generates Prometheus/Grafana configurations to measure meaningful service levels

DOMAIN 6 — NETWORKING AND TELECOMMUNICATIONS KEYWORDS:

Occupations:
Network Engineer, Network Architect, NOC Engineer, WAN Engineer, LAN Engineer, SD-WAN Engineer, BGP/OSPF/MPLS Specialist, Wireless Network Engineer, 5G Engineer, Telecommunications Engineer, VoIP Engineer, Unified Communications Engineer, Network Security Engineer, Firewall Engineer, Load Balancer Engineer, CDN Engineer, DNS Engineer, Network Automation Engineer, SDN Engineer, NFV Engineer, Network Performance Engineer, Packet Analyst, IPAM Specialist

Technical Keywords:
BGP, OSPF, MPLS, SD-WAN, SASE, Zero Trust Network, Network Automation, Python Netmiko, NAPALM, Ansible Network
Cisco IOS, Juniper JunOS, Arista EOS, Cisco NXOS, Fortinet FortiOS, Palo Alto PAN-OS
5G, Wi-Fi 6E, Network Segmentation, Microsegmentation, DNS, DHCP, IPAM, Load Balancing, F5, Nginx, HAProxy, CDN
Network Monitoring, SNMP, NetFlow, Packet Analysis, Wireshark, Network Security, Firewall, Palo Alto, Fortinet, Check Point, IDS/IPS, NAC
Network Virtualization, NSX, VXLAN, SDN, NFV, Cloud Networking, VPC, ExpressRoute, Direct Connect, Transit Gateway
SolarWinds, PRTG, Nagios, Zabbix, LibreNMS, ntopng, Cisco Meraki, VMware VeloCloud, Prisma SD-WAN

AI Applied to Networking:
Configuration generation: "Configure a BGP peering between two ISPs with route filtering for AS 64512" → complete Cisco IOS/Juniper/Arista configuration
Troubleshooting: paste show commands, interface statistics, routing tables → diagnoses issue with step-by-step verification commands
Network design: describe organization size, traffic patterns, compliance requirements → complete network topology with equipment recommendations, IP addressing scheme, redundancy design
Change management: generates complete MoPs (Method of Procedure) including rollback procedures
Automation scripts: generates Python/Ansible/NAPALM scripts for configuration management, auditing, compliance validation

DOMAIN 7 — DATABASE AND DATA ENGINEERING KEYWORDS:

Occupations:
DBA, SQL Developer, Database Architect, Database Performance Engineer, Data Engineer, ETL Developer, Data Pipeline Engineer, Data Warehouse Engineer, DataOps Engineer, Database Migration Specialist, NoSQL Engineer, Graph Database Engineer, Time-Series Database Engineer, In-Memory Database Engineer, NewSQL Engineer, Vector Database Engineer, Data Modeler, MDM Specialist, Data Governance Analyst, Data Quality Engineer, Data Catalog Manager

Technical Keywords:
PostgreSQL, MySQL, Microsoft SQL Server, Oracle, SQLite, MongoDB, Cassandra, DynamoDB, Cosmos DB, Firebase
Redis, Memcached, Elasticsearch, OpenSearch, Solr, InfluxDB, TimescaleDB, Prometheus
Neo4j, Amazon Neptune, Cosmos DB Gremlin, CockroachDB, TiDB, Google Spanner, YugabyteDB, Snowflake, BigQuery, Redshift, Azure Synapse, Databricks
Pinecone, Weaviate, Chroma, Qdrant, Milvus, pgvector, Redis VSS (Vector Databases)
Apache Spark, PySpark, Apache Kafka, Apache Airflow, dbt, Dagster, Prefect, Delta Lake, Apache Iceberg, Apache Hudi
Data Lakehouse, Data Mesh, Data Contracts, Data Catalog, Data Lineage, Great Expectations, Data Quality
ETL, ELT, Reverse ETL, Real-Time Streaming, Batch Processing, CDC (Change Data Capture)
Feature Store, MLflow, Weights and Biases, DVC, Dimensional Modeling, Star Schema, Slowly Changing Dimensions

AI Applied to Data:
Query optimization: paste slow query + EXPLAIN plan → identifies problem (missing index, bad join order, N+1, full table scan) and generates optimized version
Schema design: describe data requirements in plain English → designs normalized schemas, partitioning strategies, indexing plans
Data pipeline design: generates complete Apache Spark, dbt, Apache Airflow, or Prefect pipeline code from data flow descriptions
Vector database design: for RAG pipelines, designs optimal embedding storage, chunking strategies, similarity search configurations
Data contract generation, backup and recovery procedures, stored procedure conversion between platforms

DOMAIN 8 — DATA SCIENCE AND ANALYTICS KEYWORDS:

Occupations:
Data Scientist, Senior Data Scientist, Data Analyst, Senior Data Analyst, BI Developer, BI Architect, Analytics Engineer, Quantitative Analyst, Statistical Analyst, Operations Research Analyst, Econometrician, Fraud Analyst, Risk Analyst, Marketing Analyst, Product Analyst, Customer Analytics Specialist, Geospatial Analyst, Real-Time Analytics Engineer, Reporting Analyst, Data Visualization Engineer, Dashboard Developer, Tableau/Power BI/Looker Specialist

Technical Keywords:
Power BI, Tableau, Looker, Metabase, Superset, Data Storytelling, A/B Testing, Statistical Analysis, SQL, dbt
EDA, Feature Engineering, Model Selection, Statistical Test Selection, Hypothesis Testing
Customer Lifetime Value (CLV), Cohort Analysis, Funnel Analysis, Retention Analysis, Churn Prediction
Regression, Classification, Clustering, Time Series Forecasting, Anomaly Detection
R, Python, Matplotlib, Seaborn, Plotly, Pandas, NumPy, SciPy

AI Applied to Data Science:
EDA: upload dataset description → generates complete EDA Python script with statistical summaries, distribution plots, correlation analysis, anomaly flagging
Statistical test selection: describe research question and data → recommends appropriate test, explains assumptions, generates code
SQL query generation: "Show me top 10 customer segments by LTV, cohorted by acquisition month, with 12-month retention rates" → complete optimized SQL
Insight narration: converts data visualizations into written narratives for non-technical stakeholders
A/B test design and analysis with proper power calculations and statistical rigor

DOMAIN 9 — SYSTEMS ADMINISTRATION AND IT OPERATIONS KEYWORDS:

Occupations:
Sysadmin, Linux Administrator, Windows Server Administrator, Active Directory Administrator, Exchange/M365 Administrator, IT Operations Manager, IT Support Engineer L1/L2/L3, Help Desk Analyst, Service Desk Manager, Desktop Support Technician, Field Service Technician, Endpoint Management Engineer, Patch Management Specialist, IT Asset Manager, ITSM Manager, Change Manager, Problem Manager, Configuration Manager (CMDB), ITIL Process Owner, Virtualization Administrator, Storage Administrator, Backup Administrator

Technical Keywords:
PowerShell, Bash, Python scripting, Active Directory, M365, Exchange, ITIL 4, ServiceNow, ITSM
VMware, Hyper-V, vSphere, SAN, NAS, Backup and Recovery, Patch Management, Endpoint Management
CMDB, Change Management, Problem Management, Incident Management, Service Catalog, RACI Matrix
Windows Server, Linux (RHEL, Ubuntu, CentOS), Group Policy, GPO, DNS, DHCP, NTP, NFS, SMB

AI Applied to Sysadmin — L1 to L3 Compression:
AI is transformational for L1 Help Desk: feed symptoms and get structured diagnostic paths
L1 analysts with Claude can resolve L2 and L3 issues, compressing traditional career progression timeline
Generates complete PowerShell, Bash, Python scripts for any administrative task
ITSM ticket handling: analyzes tickets, categorizes, prioritizes, suggests resolution steps
Documentation generation: converts tribal knowledge and configuration notes into formal runbooks and SOPs

DOMAIN 10 — ENTERPRISE ARCHITECTURE AND IT STRATEGY KEYWORDS:

Occupations:
Enterprise Architect, Solution Architect, Business Architect, Data Architect, Integration Architect, Security Architect, Application Architect, Technical Program Manager (TPM), IT Director, VP of Engineering, CTO, CIO, IT Strategy Consultant, Digital Transformation Lead, Innovation Manager, Technology Evangelist, IT Portfolio Manager, Technology Advisor

Technical Keywords:
TOGAF, Business Architecture, Information Architecture, Application Architecture, Technology Architecture
Technology Roadmapping, Digital Transformation Strategy, Build vs Buy Analysis, Technology Radar
OKRs, Portfolio Management, Benefits Realization, Business Case Development
Merger and Acquisition Technical Due Diligence, Executive Presentations, Board-Level Communication
Integration Architecture, Event-Driven Architecture, Microservices Architecture, API-First Strategy
ITIL 4, COBIT, SABSA, Zachman Framework, ArchiMate

AI Applied to Enterprise Architecture:
TOGAF-aligned architecture artifacts from business description
Multi-year technology roadmaps from business objectives with initiative prioritization
Board-level presentations: converts technical strategies into executive communication
M&A technical due diligence: analyzes target company's technology stack for risk and integration complexity

DOMAIN 11 — IOT, EDGE COMPUTING AND EMBEDDED SYSTEMS KEYWORDS:

Occupations:
IoT Engineer, IoT Solutions Architect, Edge Computing Engineer, Embedded Systems Engineer, Firmware Developer, RTOS Developer, Hardware/Software Integration Engineer, IoT Security Engineer, OT Engineer, SCADA Engineer, ICS Engineer, Robotics Software Engineer, Automotive Software Engineer, Smart Home Engineer, Wearables Developer, Industrial IoT Specialist, Digital Twin Engineer, 5G Application Engineer, Edge AI Engineer

Technical Keywords:
MQTT, CoAP, OPC-UA, LwM2M, AWS IoT Core, Azure IoT Hub, Google Cloud IoT, Digital Twin
Edge AI, TinyML, ONNX Runtime, TensorFlow Lite, Arduino, Raspberry Pi, ESP32, STM32, FreeRTOS, Zephyr
OTA Updates, Embedded Security, Secure Boot, SCADA, ICS, OT Security, IEC 62443
5G NR, NB-IoT, LoRaWAN, Predictive Maintenance, Industrial IoT, Industry 4.0, Smart Manufacturing, Smart Grid, Connected Vehicles, V2X
NVIDIA Jetson, Coral TPU, TinyML deployment, computer vision for quality control, PLC programming, Six Sigma, lean manufacturing

DOMAIN 12 — QUANTUM COMPUTING KEYWORDS:

Occupations:
Quantum Software Engineer, Quantum Algorithm Researcher, Quantum Hardware Engineer, Quantum Error Correction Researcher, Quantum Cryptography Specialist, Post-Quantum Cryptography Engineer, Quantum ML Engineer, Quantum Cloud Engineer

Technical Keywords:
Post-Quantum Cryptography (PQC), NIST PQC Standards, ML-KEM (Kyber), ML-DSA (Dilithium), SLH-DSA (SPHINCS+)
AWS Braket, Azure Quantum, IBM Quantum, Qiskit, Cirq, PennyLane
Superposition, Entanglement, Interference, Quantum Error Correction, Qubit
Cryptographic exposure assessment, PQC migration planning, quantum-safe algorithms

WHY THIS MATTERS NOW: Post-quantum cryptography migration is mandatory for every organization with sensitive long-lived data. Claude helps every security team understand exposure and build migration roadmap — even without quantum expertise.

DOMAIN 13 — BLOCKCHAIN AND WEB3 KEYWORDS:

Occupations:
Blockchain Developer, Smart Contract Developer, DApp Developer, Blockchain Architect, DeFi Engineer, NFT Platform Engineer, Consensus Mechanism Engineer, Blockchain Security Auditor, Tokenomics Designer, Web3 Full-Stack Developer, Cross-Chain Bridge Engineer, Layer 2 Engineer, Decentralized Identity Engineer

Technical Keywords:
Solidity, Rust/Anchor, Move, Web3.js, ethers.js, viem, ERC-20, ERC-721, ERC-1155
Ethereum, Solana, Polkadot, Avalanche, Layer 2 (Arbitrum, Optimism, Polygon)
DeFi, NFT, DAO, DID (Decentralized Identity), IPFS, Chainlink, Gas Optimization
Smart Contract Security (reentrancy, integer overflow, access control failures), Audit, Tokenomics

---

PART E — GEOGRAPHIC HIRING INTELLIGENCE (FROM SHAHZAD'S ARTICLES)

NORTH AMERICA (USA + CANADA) — Primary Target Market:
Highest AI adoption rates globally. Enterprise transformation at scale.
Claude Code reached $1 billion run rate in 6 months.
USA sets the pace. Every other geography follows.
Canada: uniquely combines technical AI deployment with human-centered leadership skills
Canada AI ecosystem anchored in Toronto, Montreal, Edmonton — Vector Institute, Scale AI, hundreds of scale-ups
Canadian enterprises: banking, insurance, government, telecom demand IT professionals who can communicate transformation to executives
Canadian compliance priorities: PIPEDA, OSFI guidelines, CRTC compliance, provincial privacy legislation
Security clearance valuable for government and defense roles (Secret and Top Secret)
French language valuable for federal and Quebec-based roles

SOUTH ASIA (India, Pakistan, Bangladesh, Sri Lanka):
World's largest IT talent pool
Claude amplifies individual engineers to perform at levels previously requiring teams
Solo developer with Claude can produce output of 3–5 person team
Freelancers can compete for enterprise-grade contracts, startups can scale without hiring armies

EAST ASIA (China, Japan, South Korea, Taiwan):
Japan: acute software developer shortage projected at 790,000 by 2030
Korean chaebols and Japanese enterprises accelerating digital transformation with AI
Taiwan's semiconductor industry: AI for complex design documentation and compliance

SOUTHEAST ASIA (Singapore, Indonesia, Vietnam, Philippines, Malaysia):
Singapore is model of AI-accelerated digital economy
Indonesia and Vietnam: massive young IT workforces leapfrogging traditional skill development
Philippines BPO industry transforming: IT support shifting toward higher-value work

MIDDLE EAST (UAE, Saudi Arabia, Qatar, Kuwait):
Vision 2030 and UAE D33 agenda driving massive IT investment
Huge demand for cloud architects, cybersecurity professionals, AI engineers
Claude helps regional talent accelerate capability development for national technology goals

AFRICA (Nigeria, Kenya, South Africa, Egypt, Ghana):
Africa's youngest population and fastest-growing internet user base
Claude democratizes world-class technical mentorship
Developer in Lagos or Nairobi with Claude has same AI capability as Fortune 500 developer

EUROPE (UK, Germany, France, Netherlands, Poland, Romania):
Focus: AI governance, privacy-compliant AI (GDPR), enterprise automation
Strong demand for AI integration specialists working within European regulatory frameworks

LATIN AMERICA (Brazil, Mexico, Colombia, Argentina):
Growing nearshore IT outsourcing destination
Claude accelerates capability development for higher-value work competition

---

PART F — AI CAREER TRAJECTORY BY AGE GROUP
From Shahzad's LinkedIn Research

Ages 14–17 (Students):
Claude teaches programming from first principles at the right level
Explains any concept, reviews homework and projects, introduces real-world tools
Students using Claude now will arrive at university already operating at graduate level

Ages 18–22 (University / Early Career):
Claude is the tutor, senior mentor, code reviewer, and project manager — all in one
Students produce professional-quality portfolio projects
Graduate with practical experience previously requiring 2–3 years of employment

Ages 23–30 (Early Professional):
Fastest acceleration possible
Junior developers using Claude perform at mid-senior level
Mid-level engineers tackle senior work
10-year trajectory to senior engineer compresses to 4–5 years for AI-augmented professionals

Ages 31–45 (Established Professional):
Greatest risk AND greatest opportunity simultaneously
AI-augmented professionals become disproportionately productive
Those who don't integrate risk being outcompeted by AI-augmented juniors
Action: integrate Claude immediately, go deep

Ages 46–60 (Senior Professional):
Domain expertise is enormously valuable — and Claude amplifies it
50-year-old cybersecurity veteran with Claude can perform analysis work of an entire team
Combination of irreplaceable experience and AI capability is powerful competitive position

Ages 61+ (Expert / Advisory):
Expert knowledge encoded into AI workflows creates institutional value
Former CISOs, CTOs, senior architects using Claude to encapsulate expertise can scale advisory impact exponentially

---

PART G — INTEGRATION ROADMAP FOR CLAUDE IN ANY IT ROLE
From Shahzad's Great IT Transformation Article

Phase 1 — Access (Week 1):
Claude.ai Pro ($20/month) — browser-based, full Opus 4.6 access
Claude Code CLI — for developers, terminal-native AI assistance
API access — for building integrations into existing tools
AWS Bedrock / Google Vertex AI / Microsoft Azure — enterprise deployment

Phase 2 — Learn Your Use Cases (Weeks 2–4):
Identify 3 most time-consuming tasks in your role
Test Claude on each with real work examples
Learn prompt patterns that work for your domain
Build a personal prompt library

Phase 3 — Build Workflows (Month 2):
Integrate Claude into existing tools via API
Build automated pipelines for repetitive tasks
Create templates for common document types
Share effective prompts with your team

Phase 4 — Scale and Lead (Month 3+):
Become the AI champion in your team or organization
Train colleagues on effective AI use
Identify department-level automation opportunities
Build business cases for enterprise AI adoption

Phase 5 — Architect the Future:
Design AI-augmented workflows for your organization
Build custom AI tools on top of Claude API
Create institutional knowledge systems using Claude
Position as AI integration specialist — hottest hybrid role of 2026

---

PART H — COMPLETE FREE LEARNING RESOURCE DIRECTORY
From Shahzad's LinkedIn Skills on the Rise 2026 Articles

World-Class Free Learning Platforms:
MIT OpenCourseWare → https://ocw.mit.edu/
Harvard Free Courses → https://pll.harvard.edu/catalog/free
Yale Open Courses → https://oyc.yale.edu/
Stanford Online Free → https://online.stanford.edu/free-courses
edX Free → https://www.edx.org/search?price=Free
Coursera Free → https://www.coursera.org/courses?query=free
Khan Academy → https://www.khanacademy.org/
FutureLearn Free Audit → https://www.futurelearn.com/
FreeCodeCamp → https://www.freecodecamp.org/
The Odin Project → https://www.theodinproject.com/
Kaggle Learn → https://www.kaggle.com/learn
fast.ai → https://www.fast.ai/
Codecademy Free Tier → https://www.codecademy.com/
W3Schools → https://www.w3schools.com/
CS50 Harvard (Python) → https://cs50.harvard.edu/python/2022/
Automate the Boring Stuff with Python → https://automatetheboringstuff.com/

Tech Company Free Learning Portals:
Google Cloud Skills Boost → https://www.cloudskillsboost.google/
Google Digital Garage → https://learndigital.withgoogle.com/digitalgarage
Microsoft Learn → https://learn.microsoft.com/
AWS Skill Builder Free → https://skillbuilder.aws/
IBM SkillsBuild → https://skillsbuild.org/
Meta Blueprint → https://www.facebook.com/business/learn
Salesforce Trailhead → https://trailhead.salesforce.com/
HubSpot Academy → https://academy.hubspot.com/
Databricks Academy → https://www.databricks.com/learn/training/free
NVIDIA Deep Learning Institute → https://www.nvidia.com/en-us/training/

AI-Specific Free Hubs:
DeepLearning.AI Short Courses → https://www.deeplearning.ai/short-courses/
Hugging Face Courses → https://huggingface.co/learn
LangChain Academy → https://academy.langchain.com/
OpenAI Cookbook → https://cookbook.openai.com/
Anthropic Claude Documentation → https://docs.anthropic.com/
Weights and Biases Courses → https://www.wandb.courses/
AI Safety Fundamentals → https://aisafetyfundamentals.com/
Montreal AI Ethics Institute → https://montrealethics.ai/
Responsible AI Institute → https://www.responsible.ai/resources/

Cybersecurity Free Training:
TryHackMe → https://tryhackme.com/
Hack The Box → https://www.hackthebox.com/
Cybrary Free Tier → https://www.cybrary.it/
SANS Cyber Aces → https://www.sans.org/cyberaces/
ISC2 CC Free Certification → https://www.isc2.org/certifications/cc
NIST Cybersecurity Framework → https://www.nist.gov/cyberframework
NCSC UK Free Training → https://www.ncsc.gov.uk/section/skills-knowledge/free-training-resources

Agentic AI Specific:
DeepLearning.AI: AI Agents in LangGraph → https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/
DeepLearning.AI: Multi AI Agent Systems with CrewAI → https://www.deeplearning.ai/short-courses/multi-ai-agent-systems-with-crewai/
DeepLearning.AI: Building Agentic RAG with LlamaIndex → https://www.deeplearning.ai/short-courses/building-agentic-rag-with-llamaindex/
LangChain Academy → https://academy.langchain.com/
AutoGen Documentation → https://microsoft.github.io/autogen/
Anthropic MCP Documentation → https://docs.anthropic.com/en/docs/mcp
Pinecone Learning Center → https://www.pinecone.io/learn/
Weaviate Academy → https://weaviate.io/developers/academy
Hugging Face Agents Course → https://huggingface.co/learn/agents-course/
Lablab.ai Hackathons → https://lablab.ai/
Analytics Vidhya: 15 Free AI Agent Courses → https://www.analyticsvidhya.com/blog/2025/10/free-ai-agent-courses/

Cloud Specific:
AWS Cloud Practitioner Essentials → https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials
Microsoft Azure Fundamentals → https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-cloud-concepts/
Google Cloud Skills Boost → https://www.cloudskillsboost.google/
Azure Databricks → https://learn.microsoft.com/en-us/azure/databricks/getting-started/
FinOps Foundation → https://www.finops.org/resources/

Career Development:
UiPath Academy → https://academy.uipath.com/
LinkedIn Learning AI Decision Playbook (Free until March 23, 2026) → https://www.linkedin.com/learning/
Coursera: AI For Everyone by Andrew Ng → https://www.coursera.org/learn/ai-for-everyone
IBM AI Fundamentals Badge → https://skills.yourlearning.ibm.com/activity/MDL-211
Scale AI Workforce Programs → https://scale.com/spellbook
CFI Free Financial Modeling Intro → https://corporatefinanceinstitute.com/resources/
Postman Learning Center → https://learning.postman.com/

YouTube Channels (From Shahzad's Research):
Andrej Karpathy — deepest technical AI explanations → https://www.youtube.com/@AndrejKarpathy
3Blue1Brown — math and AI foundations → https://www.youtube.com/@3blue1brown
AI Jason — practical agentic AI builds → https://www.youtube.com/@AIJasonZ
TechWorldwithNana — DevOps and Cloud → https://www.youtube.com/@TechWorldwithNana
NetworkChuck — Cybersecurity → https://www.youtube.com/@NetworkChuck
Fireship — Web Dev and Tech → https://www.youtube.com/@Fireship
Sentdex — Python and ML → https://www.youtube.com/@sentdex
Sam Witteveen — LangChain and agent frameworks → https://www.youtube.com/@samwitteveenai
Nicholas Renotte — hands-on AI builds → https://www.youtube.com/@NicholasRenotte
Data with Zach — Data Science → https://www.youtube.com/@DataWithZach
Matt Wolfe — no-code AI tools → https://www.youtube.com/@mreflow
Data Independent — LangChain tutorials → https://www.youtube.com/@DataIndependent
Patrick Loeber (Python Engineer) → https://www.youtube.com/@patloeber

Communities to Join:
LangChain Discord → https://discord.gg/6adMQxSpJS
CrewAI Discord → https://discord.com/invite/X4JWnZnxPb
Hugging Face Forums → https://discuss.huggingface.co/
Lablab.ai Hackathons → https://lablab.ai/
r/LangChain → https://www.reddit.com/r/LangChain/
r/MachineLearning → https://www.reddit.com/r/MachineLearning/

Research and Reports:
LinkedIn Skills on the Rise 2026 Official → https://news.linkedin.com/2026/Skills-on-the-rise-2026
LinkedIn US Skills Deep Dive → https://www.linkedin.com/pulse/linkedin-skills-rise-2026-fastest-growing-us-linkedin-news-isgdf
Deloitte: Agentic AI Strategy → https://www.deloitte.com/us/en/insights/topics/technology-management/tech-trends/2026/agentic-ai-strategy.html
IBM Think: AI and Tech Trends 2026 → https://www.ibm.com/think/news/ai-tech-trends-predictions-2026
MIT Sloan: AI Trends 2026 → https://sloanreview.mit.edu/article/five-trends-in-ai-and-data-science-for-2026/
MachineLearningMastery: 7 Agentic AI Trends → https://machinelearningmastery.com/7-agentic-ai-trends-to-watch-in-2026/

People to Follow (From Shahzad's Articles):
Andrej Karpathy — AI engineering, former Tesla AI Director
Harrison Chase — LangChain creator
Andrew Ng — DeepLearning.AI founder
Yohei Nakajima — BabyAGI creator
Greg Brockman — OpenAI co-founder

---

PART I — THE HONEST REALITY CHECK
From Shahzad's Agentic AI Article — Facts, Not Hype

WHAT IS WORKING IN 2026 (REAL PRODUCTION ROI):
Task-specific agents with clearly defined boundaries
Customer service automation, document processing, code generation, research summarization, data monitoring
Proven use cases with real production deployments generating real returns

WHAT IS STILL FAILING:
Overly ambitious, poorly governed agents with undefined scope
40% of agentic AI projects will be cancelled by end of 2027 (Gartner prediction)
Reason: poor governance, unclear objectives, unrealistic expectations — NOT technology failure

THE WINNING FORMULA:
Start with ONE narrow, well-defined, high-volume, repetitive workflow
Automate it completely
Prove value with measurable ROI
Expand to next workflow
Repeat

GOVERNANCE IS NON-NEGOTIABLE:
Organizations treating agentic AI as governance-first — trust, auditability, human oversight built in from day one — are the ones scaling successfully.
Those treating it as a pure technology experiment are generating cautionary tales.

THE CAREER OPPORTUNITY WINDOW:
Professionals who become agentic AI experts in the next 12 months will have career advantages compounding for the next decade.
This is what it felt like to learn web development in 1996, data science in 2012, cloud computing in 2015.
The window where you can go from novice to recognized expert before market saturates is open RIGHT NOW.
Knowledge is free. Tools are free. Community is generous. Only variable remaining: your decision to start.

THE BIGGEST INSIGHT FROM ALL OF SHAHZAD'S RESEARCH:
"The professionals whose careers are accelerating right now are those who have stopped asking 'will AI take my job?' and started asking 'how can I work with AI better than anyone else in my field?'"

"Those who embrace AI, are curious with the technology, and use it in their daily work will be seen as the future leaders at each company." — LinkedIn COO Dan Shapero

"The most protected career position in 2026 is not the one with the highest technical skills. It is the one that combines technical fluency with human irreplaceability."

---

PART J — JOB COACH AI PROMPT INJECTION RULES
How to use Section 21 inside the Gemini prompt engine

When job description contains these keywords → inject these corresponding insights:

IF job description mentions: LangChain, LlamaIndex, CrewAI, AutoGen, LangGraph
INJECT INTO GAP ANALYSIS: "Agentic AI frameworks are the hottest technical cluster in North America 2026. These appear in LinkedIn's top rising skills for Canada and the US. Prioritize: LangChain Academy (free), DeepLearning.AI Agentic AI courses (free)."

IF job description mentions: Prompt Engineering, RAG, Vector Database, Embeddings
INJECT INTO COVER LETTER: These are the top-ranked skills in LinkedIn Skills on the Rise 2026 for Canada and the US. Use them prominently in opening paragraph.

IF job description mentions: Responsible AI, AI Governance, Data Governance, PIPEDA, OSFI
INJECT INTO GAP ANALYSIS: "AI Governance is the fastest-emerging compliance specialty of 2026. The IAPP AIGP certification is the fastest-growing cert of 2026 in North America. Salary premium: +$15K–$25K."

IF job description mentions: FinOps, Cloud Cost Optimization
INJECT INTO GAP ANALYSIS: "FinOps Certified Practitioner (finops.org) is a fast-rising cert. Every organization with cloud spend over $1M/year is building a FinOps function. Real example: AI found $2.3M/year in cloud waste for one enterprise."

IF job description mentions: Zero Trust, ZTNA, SASE
INJECT INTO GAP ANALYSIS: "Zero Trust Architecture is mandatory for 2026+ security roles. Certified Zero Trust Professional from CrowdStrike Academy and ZTCA from Illumio are emerging certs."

IF job description mentions: Post-Quantum, PQC, Quantum Cryptography
INJECT INTO GAP ANALYSIS: "Post-quantum cryptography migration is mandatory for every organization with sensitive long-lived data. NIST approved ML-KEM, ML-DSA, SLH-DSA in 2024. This is a rare specialty with almost no supply and high enterprise demand."

IF job description mentions: Terraform, Pulumi, IaC, CloudFormation
INJECT INTO COVER LETTER: "HashiCorp Certified Terraform Associate is a top-tier certification commanding $18K–$28K salary premium."

IF resume mentions: Wazuh, SIEM, SOC, Threat Hunting
INJECT INTO TAILORED BULLETS: These align with Shahzad's documented expertise. Use MITRE ATT&CK framework mapping and MTTD/MTTR quantification in every cybersecurity bullet.

---

END OF SECTION 21

================================================================================
MASTER DOCUMENT TOTAL SECTIONS: 21
================================================================================

Sections 1–19:  Complete build guide, all source code, deployment, security, 8-hour plan
Section 20:     Resume intelligence engine — scoring formula, hard/soft skills, certifications, occupation trajectories, salary benchmarks, bullet templates
Section 21:     Shahzad's LinkedIn Intelligence Layer — AI models, agentic AI market data, LinkedIn Skills on the Rise 2026 (all 5 markets), complete keyword/occupation master list by domain, geographic hiring intelligence, career trajectory by age, free learning resources, prompt injection rules

Built by Shahzad + Claude.ai + Claude Code | March 2026
Shahzad MS: CTO | 34-Year Enterprise Technology SME | CISSP, SC-100 | Microsoft AI Winner
Stack: Next.js 14 + TypeScript + Tailwind + Gemini 2.0 Flash + Vercel | Cost: $0

================================================================================
SECTION 22 — COMPLETE SKILLS UNIVERSE + BLIND SPOTS + MVP BUILD CLOCK
The Final Intelligence Layer | Everything Missing + Build Realism
Shahzad + Claude.ai | March 2026
================================================================================

---

PART A — EVERY HARD SKILL BY CATEGORY
The complete master list. Every skill Job Coach AI should recognize, score, and recommend.

PROGRAMMING LANGUAGES — ALL LEVELS:
Beginner Friendly: Python, JavaScript, HTML/CSS, SQL, Scratch, Markdown, YAML, JSON
Intermediate: TypeScript, Java, C#, PHP, Ruby, Bash, PowerShell, Kotlin, Swift, Go (Golang)
Advanced/Specialist: Rust, C, C++, Assembly, Scala, R, Julia, MATLAB, Haskell, Erlang, Elixir, Clojure, OCaml, F#, Dart, Lua, Groovy, Perl, COBOL (legacy banking), FORTRAN (scientific), PL/SQL, T-SQL, HCL, Bicep, VHDL, Verilog, SystemVerilog, Solidity, Move, Cairo, Clarity, WebAssembly (Wasm)

WEB DEVELOPMENT — FRONTEND:
HTML5, CSS3, JavaScript ES2024, TypeScript, React 18/19, Next.js 14/15, Vue.js 3, Nuxt.js, Angular 17+, Svelte, SvelteKit, Solid.js, Astro, Remix, Qwik, HTMX
CSS Frameworks: Tailwind CSS, Bootstrap, Material UI, shadcn/ui, Radix UI, Chakra UI, Ant Design, styled-components, Emotion, CSS Modules
Build Tools: Vite, Webpack 5, ESBuild, Parcel, Rollup, Turbopack
Testing: Jest, Vitest, Cypress, Playwright, Testing Library, Storybook
State Management: Redux Toolkit, Zustand, Jotai, Recoil, MobX, TanStack Query
Animation: Framer Motion, GSAP, Three.js, React Three Fiber, Lottie

WEB DEVELOPMENT — BACKEND:
Node.js, Express.js, Fastify, NestJS, Hono, Elysia
Python: FastAPI, Django, Flask, Starlette, Litestar
Java: Spring Boot 3, Quarkus, Micronaut, Jakarta EE
C#/.NET: ASP.NET Core 8, Blazor, Minimal APIs
Go: Gin, Echo, Fiber, Chi, standard library
Rust: Axum, Actix-web, Warp, Rocket
PHP: Laravel 11, Symfony, WordPress (REST API)
Ruby: Ruby on Rails 7
API Standards: REST, GraphQL, gRPC, tRPC, WebSockets, Server-Sent Events, SOAP, OpenAPI 3.1, Swagger, Postman
Authentication: JWT, OAuth 2.0, OIDC, SAML 2.0, Passkeys, WebAuthn, MFA, TOTP

MOBILE DEVELOPMENT:
Native iOS: Swift, SwiftUI, UIKit, Xcode, TestFlight, App Store Connect
Native Android: Kotlin, Jetpack Compose, Android Studio, Google Play Console
Cross-Platform: React Native, Flutter, Dart, Expo, Capacitor, Ionic
Desktop: Electron, Tauri, Flutter Desktop, .NET MAUI, WPF, WinUI 3, macOS AppKit
Progressive Web Apps (PWA): Service Workers, Web App Manifest, Push Notifications, Offline-first

CLOUD AND INFRASTRUCTURE — COMPLETE:
AWS Services: EC2, ECS, EKS, Lambda, S3, RDS, Aurora, DynamoDB, DocumentDB, ElastiCache, SQS, SNS, EventBridge, API Gateway, AppSync, Cognito, IAM, Organizations, Control Tower, CloudTrail, Config, GuardDuty, Security Hub, Inspector, Macie, Shield, WAF, CloudFront, Route 53, VPC, Transit Gateway, Direct Connect, Site-to-Site VPN, CloudFormation, CDK, SAM, CodePipeline, CodeBuild, CodeDeploy, CodeStar, Elastic Beanstalk, Amplify, AppRunner, SageMaker, Bedrock, Rekognition, Textract, Comprehend, Polly, Transcribe, Translate, Lex, Kendra, OpenSearch Service, Athena, Glue, EMR, Kinesis, MSK, Redshift, QuickSight, Lake Formation, DataZone, Cost Explorer, Trusted Advisor, Compute Optimizer
Azure Services: Virtual Machines, VMSS, AKS, Container Apps, App Service, Functions, Blob Storage, ADLS Gen2, Azure SQL, Managed Instance, Cosmos DB, Cache for Redis, Service Bus, Event Hubs, Event Grid, API Management, Front Door, CDN, Application Gateway, VNet, ExpressRoute, Bastion, Firewall, DDoS Protection, Entra ID, PIM, RBAC, Key Vault, Defender for Cloud, Sentinel, Monitor, Log Analytics, Application Insights, DevOps, Pipelines, Repos, Artifacts, Boards, Test Plans, Azure AI Studio, OpenAI Service, Cognitive Services, AI Search, ML, Databricks, Synapse Analytics, Data Factory, Purview, Cost Management, Advisor, Bicep, ARM, Terraform, Policy
GCP Services: Compute Engine, Cloud Run, GKE, Cloud Functions, Cloud Storage, Cloud SQL, AlloyDB, Spanner, Bigtable, Firestore, Memorystore, Pub/Sub, Eventarc, Cloud Endpoints, Cloud Armor, Cloud CDN, Cloud Load Balancing, VPC, Cloud Interconnect, Cloud VPN, IAM, Security Command Center, Chronicle, Vertex AI, Gemini API, AutoML, Vision AI, Natural Language AI, Speech-to-Text, Text-to-Speech, Translation, Dialogflow, Document AI, BigQuery, Dataflow, Dataproc, Composer, Looker, Data Catalog, Cloud Logging, Cloud Monitoring, Error Reporting, Deployment Manager, Cloud Build, Artifact Registry, Cloud Deploy, Cost Management

INFRASTRUCTURE AS CODE AND AUTOMATION:
Terraform, Pulumi, AWS CDK, Azure Bicep, AWS CloudFormation, Google Cloud Deployment Manager, Ansible, Chef, Puppet, SaltStack, Vagrant, Packer, Crossplane, Cluster API, Helm, Kustomize, Flux, ArgoCD, Helmfile

CONTAINERIZATION AND ORCHESTRATION:
Docker, Docker Compose, Docker Swarm, Podman, Buildah, Skopeo, Kubernetes, Helm, Kustomize, Karpenter, KEDA (Kubernetes Event-Driven Autoscaling), Istio, Linkerd, Consul Connect, OpenShift, Rancher, k3s, k3d, kind, minikube, EKS, AKS, GKE, Talos Linux, Flatcar Linux, CoreOS

OBSERVABILITY AND MONITORING:
Prometheus, Grafana, Grafana Loki, Grafana Tempo, Alertmanager, VictoriaMetrics, Thanos, Cortex, Datadog, New Relic, Dynatrace, AppDynamics, Splunk, Elastic Stack (ELK), OpenSearch, Kibana, Logstash, Beats, Fluentd, Fluent Bit, OpenTelemetry, Jaeger, Zipkin, AWS CloudWatch, Azure Monitor, Google Cloud Monitoring, PagerDuty, OpsGenie, VictorOps, StatusPage, Honeycomb, Lightstep, eBPF (Cilium, Falco, Tetragon)

SECURITY TOOLS — COMPLETE:
SIEM: Splunk Enterprise Security, Microsoft Sentinel, IBM QRadar, Elastic SIEM, Google Chronicle, Exabeam, LogRhythm, Securonix, Sumo Logic
EDR/XDR/MDR: CrowdStrike Falcon, Microsoft Defender for Endpoint, SentinelOne, Carbon Black, Palo Alto Cortex XDR, Cybereason, Trend Micro Vision One, Sophos Intercept X
SOAR: Splunk SOAR (Phantom), Microsoft Sentinel Playbooks, Palo Alto XSOAR, IBM SOAR, Swimlane, Tines, Torq
Vulnerability Management: Qualys VMDR, Tenable Nessus, Tenable.io, Rapid7 InsightVM, OpenVAS, Trivy, Grype, Snyk, Checkmarx, Veracode, Fortify, SonarQube, Semgrep
Penetration Testing: Metasploit Framework, Burp Suite Pro, Nmap, Nessus, Wireshark, Kali Linux, Parrot OS, Cobalt Strike, Bloodhound, Mimikatz, Responder, CrackMapExec, Impacket, PowerSploit, Covenant, Havoc C2, Sliver C2, Empire, Nikto, SQLmap, Hydra, John the Ripper, Hashcat, Volatility, Autopsy
Cloud Security: Prisma Cloud (Palo Alto), Wiz, Aqua Security, Lacework, Orca Security, Sysdig, Tenable Cloud Security, AWS Security Hub, Microsoft Defender for Cloud, Google Security Command Center, CloudSploit, ScoutSuite, Prowler, Steampipe
IAM and PAM: Okta, CyberArk, BeyondTrust, SailPoint, Saviynt, Azure Entra ID, AWS IAM Identity Center, HashiCorp Vault, Delinea (Thycotic/Centrify), One Identity, ForgeRock, Ping Identity
Network Security: Palo Alto Networks NGFW, Fortinet FortiGate, Check Point, Cisco Firepower, Juniper SRX, Zscaler, Netskope, Illumio, Guardicore, ExtraHop, Darktrace, Vectra AI
Email Security: Proofpoint, Mimecast, Microsoft Defender for Office 365, Abnormal Security, Tessian
Web Application Security: OWASP ZAP, Burp Suite, HCL AppScan, Imperva, Cloudflare WAF, AWS WAF, Akamai, F5 NGINX App Protect

NETWORKING TOOLS AND TECHNOLOGIES:
Protocols: TCP/IP, UDP, BGP, OSPF, EIGRP, IS-IS, MPLS, VXLAN, EVPN, STP, RSTP, MSTP, 802.1Q (VLANs), 802.1X (NAC), 802.11ax (Wi-Fi 6), 802.11be (Wi-Fi 7), LACP, VRRP, HSRP, GLBP, DNS, DHCP, NTP, SNMP, NetFlow, sFlow, IPFIX, GRE, IPsec, SSL/TLS 1.3, SSH, HTTPS
Vendors: Cisco (IOS, IOS-XE, IOS-XR, NX-OS, Meraki), Juniper (JunOS, Mist), Arista (EOS, CloudVision), Palo Alto (PAN-OS, Panorama, Prisma), Fortinet (FortiOS, FortiManager, FortiAnalyzer), Check Point (Gaia OS, SmartConsole), F5 (BIG-IP, NGINX), A10 Networks, Citrix NetScaler/ADC, VMware NSX, Nutanix Flow, HPE Aruba, Extreme Networks
SD-WAN: Cisco Meraki, VMware VeloCloud (now Broadcom), Palo Alto Prisma SD-WAN, Fortinet Secure SD-WAN, Versa Networks, Silver Peak (HPE), Aryaka
Tools: Cisco Packet Tracer, GNS3, EVE-NG, Wireshark, tcpdump, iperf3, mtr, traceroute, nmap, netstat, ss, Ansible (network modules), NAPALM, Netmiko, Nornir, PyATS, Genie, Batfish, SolarWinds, PRTG, Nagios, Zabbix, LibreNMS, Ntopng, Netflow Analyzer, ManageEngine OpManager, Cisco DNA Center, Cisco CX Cloud

DATABASE TECHNOLOGIES — COMPLETE:
Relational/SQL: PostgreSQL 16, MySQL 8, MariaDB, Microsoft SQL Server 2022, Oracle Database 23c, IBM Db2, SQLite, CockroachDB, TiDB, Google Spanner, YugabyteDB, PlanetScale, Neon, Supabase
NoSQL Document: MongoDB Atlas, Couchbase, CouchDB, RavenDB, FerretDB
NoSQL Key-Value: Redis 7, Memcached, DragonflyDB, KeyDB, AWS ElastiCache, Azure Cache for Redis
NoSQL Column-Family: Apache Cassandra 5, Amazon Keyspaces, Azure Managed Instance for Apache Cassandra, ScyllaDB, HBase
NoSQL Graph: Neo4j, Amazon Neptune, Azure Cosmos DB Gremlin, ArangoDB, TigerGraph, JanusGraph, Dgraph
Time-Series: InfluxDB 3, TimescaleDB, Prometheus (TSDB), Victoria Metrics, QuestDB, TDengine, Grafana Mimir
Search: Elasticsearch 8, OpenSearch 2, Solr, Typesense, Meilisearch, Algolia
In-Memory/Cache: Redis (also serves as vector, search, cache), Apache Ignite, Hazelcast, GridGain
Vector Databases: Pinecone, Weaviate, Chroma, Qdrant, Milvus, Zilliz, Redis Vector Search (RediSearch), pgvector (PostgreSQL extension), LanceDB, Vespa, Marqo, Turbopuffer
Analytical/Warehouse: Snowflake, Google BigQuery, Amazon Redshift, Azure Synapse Analytics, Databricks Delta Lake, Apache Hive, Presto, Trino, DuckDB, Apache Doris, ClickHouse, StarRocks, Apache Druid, Firebolt, Starburst
Stream Processing: Apache Kafka, Apache Flink, Apache Spark Streaming, AWS Kinesis, Azure Event Hubs, Google Pub/Sub, Redpanda, Pulsar, NATS
ORM/Query Tools: SQLAlchemy, Prisma, Drizzle ORM, TypeORM, Hibernate, Entity Framework, Django ORM, GORM, Ent (Go), Diesel (Rust), dbt, Great Expectations, Monte Carlo (data observability)

ML AND AI TOOLS — COMPLETE:
Model Training: PyTorch 2.x, TensorFlow 2.x, JAX/Flax, Keras 3, MXNet, PaddlePaddle
Classical ML: Scikit-learn, XGBoost, LightGBM, CatBoost, H2O.ai, RAPIDS (GPU-accelerated)
Deep Learning: Transformers (Hugging Face), PEFT, TRL, Accelerate, DeepSpeed, FSDP, Megatron-LM, Nanotron, LLM.int8(), bitsandbytes, Flash Attention 2, xFormers
LLM Frameworks: LangChain, LangGraph, LlamaIndex, LlamaHub, Haystack, DSPy, Outlines, Guidance, Instructor
Agent Frameworks: CrewAI, AutoGen/AG2, Semantic Kernel, OpenAI Agents SDK, Google ADK (Agent Development Kit), Amazon Bedrock Agents, Microsoft Copilot Studio, n8n, Flowise, Dify, Superagent
LLM Serving: vLLM, TGI (Text Generation Inference), Ollama, LMStudio, llama.cpp, ExLlamaV2, GGUF format, GPTQ, AWQ, MLX (Apple Silicon)
Model Registry and MLOps: MLflow, Weights and Biases, Neptune.ai, DVC, ClearML, BentoML, Seldon Core, KServe, Ray Serve, Triton Inference Server, NVIDIA NIM
Feature Store: Feast, Tecton, Vertex AI Feature Store, AWS SageMaker Feature Store
Data Versioning: DVC, LakeFS, Delta Lake, Apache Iceberg, Hudi
Evaluation: RAGAS, DeepEval, Evals (OpenAI), PromptFoo, TruLens, Langfuse, Helicone, Braintrust, Phoenix (Arize)
Model Hub: Hugging Face Hub, Ollama Registry, NVIDIA NGC, AWS SageMaker JumpStart, Azure AI Model Catalog
Embedding Models: OpenAI text-embedding-3, Cohere Embed v3, Google Gecko, Voyage AI, Nomic Embed, BGE (BAAI), E5, Sentence Transformers
Multimodal: GPT-4o, Claude claude-sonnet-4-6, Gemini 2.0 Flash, LLaVA, Qwen-VL, InternVL, Pixtral, Phi-3 Vision, DALL-E 3, Stable Diffusion XL, Flux.1, Midjourney API, Sora API, Runway ML Gen-3, ElevenLabs, Whisper, Bark, F5-TTS

DATA ENGINEERING TOOLS — COMPLETE:
Orchestration: Apache Airflow, Prefect, Dagster, Mage.ai, Kestra, Windmill, Temporal, Argo Workflows, Luigi, ZenML
Batch Processing: Apache Spark, PySpark, Dask, Ray, Polars, Pandas, DuckDB (local), Rapids cuDF
Stream Processing: Apache Kafka, Apache Flink, Spark Streaming, AWS Kinesis, Azure Stream Analytics, Google Dataflow (Apache Beam)
Data Integration/ETL: dbt (data build tool), Fivetran, Airbyte, Stitch, Meltano, Talend, Informatica, MuleSoft, Apache NiFi, StreamSets, Debezium (CDC)
Data Quality: Great Expectations, Monte Carlo, Soda, Anomalo, Lightup, Datafold
Data Catalog/Governance: Apache Atlas, Collibra, Alation, Atlan, DataHub (LinkedIn), OpenMetadata, Amundsen, AWS Glue Data Catalog, Azure Purview, Google Dataplex
Data Lakehouse: Delta Lake, Apache Iceberg, Apache Hudi, AWS Lake Formation, Azure Data Lake Storage Gen2, Google Cloud Storage
Formats: Parquet, Avro, ORC, Arrow, JSON, CSV, Protocol Buffers, MessagePack, Flatbuffers

DEVOPS AND PLATFORM TOOLS — COMPLETE:
Version Control: Git, GitHub, GitLab, Bitbucket, Azure DevOps Repos, Gitea, Forgejo
CI/CD: GitHub Actions, GitLab CI/CD, Jenkins, CircleCI, Travis CI, TeamCity, Bamboo, Concourse, Drone, Tekton, ArgoCD, Flux, Harness, Spinnaker, GoCD, Azure Pipelines, AWS CodePipeline, Google Cloud Build
Package Management: npm, yarn, pnpm, pip, Poetry, Conda, Conda-forge, Cargo, Go modules, Maven, Gradle, NuGet, Homebrew, apt, yum, dnf, Nix, Guix
Code Quality: ESLint, Prettier, Black, Ruff, isort, mypy, pylint, Flake8, SonarQube, SonarCloud, CodeClimate, DeepSource, Snyk Code, Semgrep, Trivy, Gitleaks, detect-secrets, pre-commit hooks
Artifact Management: JFrog Artifactory, Nexus Repository, AWS ECR, Azure Container Registry, Google Artifact Registry, Docker Hub, GitHub Container Registry, Harbor
Secret Management: HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, Google Secret Manager, Doppler, Infisical, SOPS, Sealed Secrets, External Secrets Operator
Developer Tools: Visual Studio Code, JetBrains IDEs, Neovim, tmux, zsh/oh-my-zsh, fish shell, Warp Terminal, iTerm2, Windows Terminal, WSL2, Dev Containers, GitHub Codespaces, GitPod, Coder

FINTECH AND FINANCIAL SYSTEMS:
Bloomberg Terminal, Bloomberg API, Refinitiv Eikon, FactSet, Capital IQ, SWIFT network, ISO 20022, FIX Protocol, FPML, XBRL, IBAN/BIC, PCI DSS compliance, SOX (Sarbanes-Oxley), Basel III/IV, OSFI B-10/B-13, MiFID II, Dodd-Frank, AML/KYC systems, FINTRAC reporting, Core Banking Systems (Temenos T24, FIS Profile, Finacle, Mambu), Payment Processing (Stripe, Adyen, Braintree, Square, Visa/Mastercard APIs, Interac e-Transfer), Open Banking APIs, PSD2, FAPI (Financial-grade API), Algorithmic Trading, Quantitative Finance, Risk Modeling (VaR, CVaR, Stress Testing), Monte Carlo Simulation, Bloomberg Quant

HEALTHCARE AND LIFE SCIENCES SYSTEMS:
HL7 v2, HL7 FHIR R4, SMART on FHIR, DICOM, CDA/CCDA, EHR Systems (Epic, Cerner/Oracle Health, Meditech, Allscripts, eClinicalWorks, Athenahealth), HIPAA Technical Safeguards, HITECH, PHIPA (Canada), Alberta HIA, PIPEDA for health data, ICD-10/11, SNOMED CT, LOINC, RxNorm, NPI (National Provider Identifier), Medical Billing (CPT codes, DRG), Clinical Trial Management Systems (CTMS), Electronic Data Capture (EDC), FDA 21 CFR Part 11, Health Canada regulations, ICH GCP, IEC 62304 (medical device software), ISO 13485 (medical devices QMS), CE Marking for medical devices, FDA 510(k) clearance process

GOVERNMENT AND PUBLIC SECTOR SYSTEMS:
FedRAMP (US), PBMM (Canada Protected B Medium Integrity Medium Availability), ITSG-33, GC Cloud Framework, GCdocs, GCcollab, GC Notify, Digital Identity (DIACC, Pan-Canadian Trust Framework), ATIP (Access to Information and Privacy), Privacy Act, PIPEDA, FOIPA, TBS IT Standards, PSPC procurement, ProServices, TBIPS, Shared Services Canada, ServiceNow (Government), Oracle ERP (Government), SAP (Government), Microsoft 365 Government Community Cloud (GCC), Azure Government, AWS GovCloud, Security clearance levels (Reliability, Secret, Top Secret, TS/SCI), ITSG-06 (Cryptographic Algorithms), CCCS guidance

ERP AND ENTERPRISE SYSTEMS:
SAP (S/4HANA, ECC, BW, Ariba, SuccessFactors, Concur, Fieldglass, SAP Cloud Platform, SAP BTP), Oracle (EBS, Fusion Cloud ERP, JD Edwards, PeopleSoft, NetSuite, HCM, SCM, EPM), Microsoft (Dynamics 365, Power Platform, Power Apps, Power Automate, Power BI, Azure, Microsoft 365), Workday (HCM, Financials, Adaptive Planning), ServiceNow (ITSM, ITOM, SecOps, HR Service Delivery, CSM, GRC), Salesforce (Sales Cloud, Service Cloud, Marketing Cloud, Commerce Cloud, Health Cloud, Financial Services Cloud, Platform, Apex, LWC), HubSpot CRM, Zendesk, Freshworks, Atlassian Suite (Jira, Confluence, Bitbucket, Bamboo), Monday.com, Asana, ClickUp, Notion, Airtable, Smartsheet

QA AND TESTING TOOLS — COMPLETE:
Test Management: TestRail, Zephyr, Xray, qTest, Azure Test Plans, Jira (Xray plugin)
Unit Testing: JUnit 5, TestNG, Pytest, Jest, Vitest, Mocha, Jasmine, NUnit, xUnit, Go testing, Cargo test
Integration Testing: Spring Test, Testcontainers, WireMock, MockServer, Pact (contract testing)
E2E Testing: Playwright, Cypress, Selenium WebDriver, WebdriverIO, Puppeteer, Nightwatch, TestCafe, Robot Framework
Mobile Testing: Appium, Detox, Espresso, XCUITest, AWS Device Farm, BrowserStack, Sauce Labs
API Testing: Postman, Insomnia, Bruno, Hoppscotch, REST Assured, Karate, SoapUI, K6 (also performance), Artillery
Performance Testing: k6, Apache JMeter, Gatling, Locust, Artillery, Blazemeter, Azure Load Testing, AWS Distributed Load Testing
Security Testing: OWASP ZAP, Burp Suite, Nikto, SQLmap, DAST tools, Semgrep (SAST), CodeQL, Checkmarx, Veracode
Accessibility Testing: axe-core, WAVE, Lighthouse, Pa11y, Deque Axe DevTools
Visual Testing: Percy, Chromatic, Applitools
Chaos Engineering: Chaos Monkey, LitmusChaos, Chaos Mesh, Gremlin, AWS Fault Injection Simulator, Azure Chaos Studio

---

PART B — COMPLETE SOFT SKILLS MASTER LIST WITH EVIDENCE REQUIREMENTS
Every soft skill must be proven with a specific example. Generic claims are worthless.

COMMUNICATION SKILLS (with evidence format):
Technical Writing — Evidence: authored runbooks, architecture docs, API documentation, RFPs, incident reports
Executive Communication — Evidence: presented to C-suite, board, or steering committees. State how many people and their seniority.
Data Storytelling — Evidence: converted analytical findings into business decisions with revenue or cost impact
Presentation Skills — Evidence: conference talks, webinars, all-hands presentations, client demos
Active Listening — Evidence: facilitated requirements gathering, conflict resolution, or stakeholder alignment sessions
Cross-Cultural Communication — Evidence: worked with distributed teams across multiple countries or time zones
Written Communication — Evidence: technical documentation, policy documents, training materials used by others
Public Speaking — Evidence: meetups, conferences, lunch-and-learns, training delivery
Negotiation — Evidence: vendor negotiations with dollar value saved, scope change management, contract discussions
Conflict Resolution — Evidence: resolved a specific team or stakeholder conflict with named outcome

LEADERSHIP SKILLS (with evidence format):
Team Leadership — Evidence: managed team of [N] people. Always include team size.
People Management — Evidence: performance reviews, career development, hiring, promotion recommendations
Mentoring and Coaching — Evidence: mentored [N] junior/mid professionals. Describe growth achieved.
Technical Leadership — Evidence: led technical decisions for projects with specific scope and outcome
Organizational Change Management — Evidence: led adoption of new technology, process, or structure across teams
Stakeholder Alignment — Evidence: aligned [N] stakeholders across [N] departments on [specific decision]
Influencing Without Authority — Evidence: drove adoption of a change you had no direct authority to mandate
Hiring and Talent Development — Evidence: interviews conducted, offers made, team built
Strategic Thinking — Evidence: contributed to multi-year roadmap or major architectural decision
Crisis Management — Evidence: led incident response, disaster recovery, or critical production issue resolution. Include resolution time.
Decision Making Under Uncertainty — Evidence: made a major decision with incomplete information, with positive outcome
Delegation — Evidence: successfully delegated with measurable outcome and development of team member

PROBLEM SOLVING SKILLS:
Systems Thinking — breaking complex problems into components and understanding interactions
Root Cause Analysis — 5-why methodology, fishbone diagrams, RCA documentation
First Principles Reasoning — building solutions from fundamentals, not analogy
Hypothesis-Driven Problem Solving — forming hypotheses, testing, measuring, iterating
Design Thinking — empathize, define, ideate, prototype, test lifecycle
Risk Assessment — identifying and quantifying risk before it occurs
Trade-Off Analysis — articulating technical and business trade-offs with structured reasoning
Critical Thinking — challenging assumptions, evaluating evidence, identifying cognitive biases
Analytical Thinking — breaking ambiguous problems into measurable components
Creative Problem Solving — generating non-obvious solutions to constrained problems
Debugging Mindset — systematic elimination approach to finding root cause of failures
Pattern Recognition — identifying recurring patterns across systems, incidents, or business problems

COLLABORATION SKILLS:
Cross-Functional Collaboration — name the functions and outcomes (Engineering, Product, Design, Legal, Finance, Operations)
Remote and Distributed Team Effectiveness — asynchronous communication, documentation-first culture, virtual whiteboarding
Agile Team Participation — sprint ceremonies, retrospective contributions, pair programming, mob programming
Client and Vendor Relationship Management — specific relationships managed, contracts negotiated
Partnership Development — external partnerships built with measurable outcomes
Community Building — internal communities of practice, external open-source communities
Knowledge Sharing — lunch-and-learns, internal wikis, documentation culture
Feedback Culture — giving and receiving direct, constructive feedback in both directions

ADAPTABILITY SKILLS:
Learning Agility — demonstrate with certifications obtained, technologies self-taught, career pivots
Ambiguity Tolerance — worked in startup or rapid change environment
Pivot Under Pressure — changed direction mid-project with positive outcome
Rapid Onboarding — became productive in new domain or technology within specific timeframe
Resilience — recovered from project failure or major setback with specific learning demonstrated
Growth Mindset — evidence of seeking feedback, investing in self-development, embracing stretch assignments

BUSINESS AND COMMERCIAL SKILLS:
Business Acumen — understanding of how IT decisions impact revenue, cost, risk, and competitive position
Budget Management — managed budget of $X with evidence of efficiency or savings
P&L Awareness — understanding of profit and loss impact of technical decisions
ROI Quantification — ability to translate technical investments into business value with numbers
Business Case Development — authored business cases that were approved and funded
Revenue Impact — technical decisions that directly contributed to revenue growth
Cost Optimization — documented cost reductions with dollar values
Customer Success Orientation — external client-facing or internal service delivery with satisfaction metrics
Entrepreneurial Thinking — identifying opportunities for value creation within constraints
Vendor Management — managed vendor relationships, SLAs, contracts, performance reviews

EMERGING CRITICAL SOFT SKILLS FOR 2026:
AI Literacy — ability to evaluate, prompt, govern, and explain AI tools to non-technical audiences
Responsible AI Judgment — knowing when AI output requires human review and when it can be trusted
Data Ethics — treating data with appropriate care for privacy, bias, and security implications
Digital Dexterity — rapidly adopting new digital tools and workflows
Psychological Safety — creating environments where teams speak up, fail safely, and innovate
Inclusive Leadership — building diverse teams, amplifying underrepresented voices, equitable decision making
Well-Being Leadership — recognizing and addressing team burnout, especially in high-pressure environments
Continuous Learning Mindset — demonstrably acquiring new skills regularly, shown through certifications and projects
Security Mindset — treating every system, interaction, and decision through a security lens
Privacy by Design Thinking — embedding privacy considerations from the start of every project
Sustainability Thinking — considering environmental impact of technology decisions (Green IT, FinOps)

---

PART C — COMPLETE CERTIFICATIONS UNIVERSE BY DOMAIN
Every certification worth knowing in 2026. Ranked by value and demand.

CLOUD CERTIFICATIONS — COMPLETE LIST:

AWS (ranked by difficulty and value):
AWS Cloud Practitioner (CLF-C02) — entry, everyone should have this
AWS Solutions Architect Associate (SAA-C03) — most popular cloud cert in North America
AWS Developer Associate (DVA-C02) — developer track
AWS SysOps Administrator Associate (SOA-C02) — operations track
AWS Solutions Architect Professional (SAP-C02) — senior, high salary impact
AWS DevOps Engineer Professional (DOP-C02) — senior DevOps
AWS Advanced Networking Specialty — networking specialists
AWS Security Specialty (SCS-C02) — security + cloud combination
AWS Database Specialty — database specialists
AWS Machine Learning Specialty (MLS-C01) — ML engineers
AWS Data Analytics Specialty — data engineers
AWS Certified AI Practitioner (AIF-C01) — new 2024, rising fast

Azure (ranked by difficulty and value):
AZ-900 Azure Fundamentals — entry, free learning paths
AZ-104 Azure Administrator Associate — mid-level operations
AZ-204 Azure Developer Associate — developer track
AZ-305 Azure Solutions Architect Expert — senior architect, requires AZ-104
AZ-400 Azure DevOps Engineer Expert — DevOps, requires AZ-104 or AZ-204
SC-900 Security Fundamentals — entry security
SC-200 Security Operations Analyst — SOC and SIEM
SC-300 Identity and Access Administrator — IAM specialist
SC-400 Information Protection Administrator — DLP and compliance
SC-100 Cybersecurity Architect Expert (Shahzad's cert) — senior security architect
AI-900 Azure AI Fundamentals — entry AI
AI-102 Azure AI Engineer Associate — AI developer
AI-050 Copilot Studio (new 2025) — agentic AI on Microsoft
DP-900 Data Fundamentals — entry data
DP-203 Data Engineer Associate — data engineers
DP-300 Database Administrator Associate — Azure DBA
DP-700 Fabric Data Engineer Associate (new 2024) — Microsoft Fabric
PL-900 Power Platform Fundamentals — entry
PL-200 Power Platform Functional Consultant — business applications
MS-900 Microsoft 365 Fundamentals — entry M365

Google Cloud (ranked by difficulty and value):
Cloud Digital Leader — entry
Associate Cloud Engineer — associate level
Professional Cloud Architect — senior, most respected GCP cert
Professional Cloud Developer — developer track
Professional Cloud DevOps Engineer — DevOps
Professional Cloud Security Engineer — security
Professional Cloud Network Engineer — networking
Professional Data Engineer — data engineering
Professional Machine Learning Engineer — ML engineering
Professional Cloud Database Engineer — database
Professional Workspace Administrator — Google Workspace

Multi-Cloud and Cloud-Agnostic:
HashiCorp Certified Terraform Associate (003) — essential for IaC
HashiCorp Certified Vault Associate — secrets management
Certified Kubernetes Administrator (CKA)
Certified Kubernetes Application Developer (CKAD)
Certified Kubernetes Security Specialist (CKS)
FinOps Certified Practitioner (FOCP) — FinOps Foundation
FinOps Certified Engineer (FOCE)
Linux Foundation Certified Systems Administrator (LFCS)
Linux Foundation Certified Engineer (LFCE)
Red Hat Certified Engineer (RHCE)
Red Hat Certified Architect (RHCA)
VMware Certified Professional (VCP-DCV, VCP-NV, VCP-DTM)
Nutanix Certified Professional (NCP)

CYBERSECURITY CERTIFICATIONS — COMPLETE LIST:

Entry Level (0-2 years):
CompTIA IT Fundamentals (ITF+) — pre-security foundation
CompTIA A+ — IT support foundation
CompTIA Network+ — networking foundation
CompTIA Security+ (SY0-701) — industry-standard entry cybersecurity, almost universally required
ISC2 CC — Certified in Cybersecurity (FREE in 2026, entry level, strong starting point)
Google Cybersecurity Certificate (Coursera) — entry, widely recognized
Microsoft SC-900 Security Fundamentals — Azure security entry
(ISC)2 Systems Security Certified Practitioner (SSCP) — 1 year experience required
ISACA Cybersecurity Fundamentals Certificate — entry governance
eLearnSecurity eJPT (eLearnSecurity Junior Penetration Tester) — entry pentesting

Mid Level (2-5 years):
CompTIA CySA+ (CS0-003) — analyst track, threat detection and response
CompTIA CASP+ (CAS-004) — advanced, non-managerial senior
CompTIA PenTest+ — offensive security, mid level
EC-Council Certified Ethical Hacker (CEH v13) — widely recognized, especially in Asia and Middle East
GIAC Security Essentials (GSEC) — respected technical cert
GIAC Certified Incident Handler (GCIH) — incident response specialization
GIAC Certified Enterprise Defender (GCED) — defensive operations
GIAC Web Application Penetration Tester (GWAPT) — web app security
Certified Cloud Security Professional (CCSP) — cloud security, co-developed by (ISC)2 and CSA
AWS Certified Security Specialty
Microsoft SC-200 Security Operations Analyst
Microsoft SC-300 Identity and Access Administrator
Microsoft SC-400 Information Protection Administrator
Palo Alto Networks PCNSA (Network Security Administrator)
Palo Alto Networks PCNSE (Network Security Engineer)
Fortinet NSE 4/6/7/8 — firewall and network security
Check Point Certified Security Administrator (CCSA)
Check Point Certified Security Expert (CCSE)
Splunk Core Certified User/Power User — SIEM operations
CrowdStrike CCFA/CCFH — EDR specialization
ISACA CDPSE — privacy and data protection

Senior/Expert Level (5+ years):
CISSP — Certified Information Systems Security Professional — the gold standard globally
CISM — Certified Information Security Manager — management and governance track
CGEIT — Certified in the Governance of Enterprise IT
CRISC — Certified in Risk and Information Systems Control
CISA — Certified Information Systems Auditor — audit track
OSCP — Offensive Security Certified Professional — most respected hands-on pentesting cert
OSCE3 — Offensive Security Experienced Expert — elite pentesting
OSEP — Offensive Security Experienced Penetration Tester — advanced evasion
OSWE — Offensive Security Web Expert — web application exploitation
OSED — Offensive Security Exploit Developer — exploit development
GIAC Certified Penetration Tester (GPEN) — respected pentesting
GIAC Exploit Researcher and Advanced Penetration Tester (GXPN) — elite
GIAC Cloud Threat Detection (GCTD) — cloud-specific threat detection
Microsoft SC-100 Cybersecurity Architect Expert — Shahzad holds this
SABSA Chartered Security Architect — enterprise security architecture
Certified Cloud Security Professional (CCSP)
Certified Authorization Professional (CAP) — (ISC)2 government focus
CREST certifications — UK/international pentesting standards
Tiger Scheme — UK government-certified penetration testing

Emerging 2026 Security Certifications:
IAPP AI Governance Professional (AIGP) — FASTEST GROWING CERT OF 2026. AI governance, compliance, risk for AI systems. Essential for anyone in compliance, legal, GRC, or AI deployment.
IAPP Certified Information Privacy Professional/US (CIPP/US) — US privacy law
IAPP Certified Information Privacy Professional/Canada (CIPP/C) — Canadian privacy law (PIPEDA)
IAPP Certified Information Privacy Professional/Europe (CIPP/E) — GDPR
IAPP Certified Information Privacy Manager (CIPM) — privacy program management
IAPP Certified Information Privacy Technologist (CIPT) — privacy in technology
Zero Trust Certified Architect (ZTCA) — Illumio, rising fast
Certified Zero Trust Professional — CrowdStrike Academy
OffSec Cloud Certified Professional (OSCP Cloud extension)
Certified Quantum Security Professional (CQSP) — emerging, preparing for PQC era
DevSecOps Foundation (DSOF) — DevOps Institute
Certified DevSecOps Professional (CDP) — Practical DevSecOps, hands-on

AI AND DATA CERTIFICATIONS:

AI Certifications:
Google Professional Machine Learning Engineer — most respected ML cert for GCP
Microsoft Azure AI Engineer Associate (AI-102) — production AI on Azure
AWS Certified AI Practitioner (AIF-C01) — cloud AI entry
AWS Certified Machine Learning Specialty (MLS-C01) — data science and ML on AWS
TensorFlow Developer Certificate (Google) — framework-specific
DeepLearning.AI Deep Learning Specialization — 5-course, industry recognized
DeepLearning.AI Machine Learning Specialization (Andrew Ng) — widely recognized
DeepLearning.AI MLOps Specialization — production ML operations
IBM AI Engineering Professional Certificate (Coursera)
NVIDIA Deep Learning Institute Certifications — GPU-accelerated AI
Hugging Face AI Certification (emerging 2026)
LangChain Certified (emerging 2026)
Databricks Generative AI Engineer Associate (new 2024)
Databricks Machine Learning Associate/Professional
Snowflake ML Certification (emerging)
IAPP AI Governance Professional (AIGP) — dual value: AI + privacy

Data Engineering Certifications:
dbt Certified Analytics Engineer — most respected dbt cert
Databricks Certified Associate Developer for Apache Spark
Databricks Data Engineer Professional
Databricks Data Analyst Associate
Snowflake SnowPro Core — Snowflake fundamentals
Snowflake SnowPro Advanced: Architect/Data Engineer/Administrator
Google Professional Data Engineer
AWS Certified Data Analytics Specialty
Microsoft DP-203 Azure Data Engineer Associate
Microsoft DP-700 Fabric Data Engineer Associate
Apache Kafka CCDAK (Confluent Certified Developer for Apache Kafka)
Confluent Certified Operator for Apache Kafka (CCOAK)
Astronomer Certification for Apache Airflow (ACAA)
Monte Carlo Data Reliability Engineer

Analytics and BI Certifications:
Microsoft PL-300 Power BI Data Analyst Associate
Tableau Desktop Specialist/Certified Associate
Salesforce Tableau CRM and Einstein Discovery Consultant
Looker Certified Business Analyst
Google Analytics 4 Certificate
HubSpot Marketing Analytics Certificate

NETWORKING CERTIFICATIONS — COMPLETE:

Cisco Track (most recognized globally):
CCNA (200-301) — entry, covers everything, essential
CCNP Enterprise — mid-senior enterprise networking
CCNP Security — security focus
CCNP Data Center — data center networking
CCNP Service Provider — ISP/carrier
CCNP Collaboration — voice/video/UC
CCNP Wireless — Wi-Fi specialization
CCIE Enterprise Infrastructure — elite, respected globally
CCIE Security — elite security networking
CCIE Data Center — elite data center
CCDE (Cisco Certified Design Expert) — architecture level
Cisco Meraki CMNA, CMNO — cloud-managed networking
Cisco DNA Specialist certifications

Other Vendor Networking:
Juniper JNCIA-Junos (entry)
Juniper JNCIS-ENT, JNCIP-ENT, JNCIE-ENT — enterprise track
Juniper JNCIS-SEC, JNCIP-SEC, JNCIE-SEC — security track
Juniper Mist AI certifications — AI-driven networking
Arista ACE-A, ACE-P, ACE-L2 — Arista EOS specialization
Palo Alto PCNSA, PCNSE — network security
Fortinet NSE 1-8 program — tiered certification path
F5 Certified BIG-IP Administrator
CompTIA Network+ — vendor neutral, widely recognized
CompTIA Security+ (networking component)
Wireshark Certified Network Analyst (WCNA)
SD-WAN Association certifications (SDCA, SDCP)
VMware VCP-NV — NSX network virtualization
Nutanix NCP-MCI — hyperconverged infrastructure

PROJECT MANAGEMENT CERTIFICATIONS:

Traditional PM:
PMP — Project Management Professional (PMI) — gold standard PM cert globally
CAPM — Certified Associate in Project Management (entry PMP)
PgMP — Program Management Professional
PfMP — Portfolio Management Professional
PMI-RMP — Risk Management Professional
PMI-ACP — Agile Certified Practitioner
PMI-SP — Scheduling Professional
PRINCE2 Foundation and Practitioner
PRINCE2 Agile Foundation and Practitioner
MSP (Managing Successful Programmes)
MoP (Management of Portfolios)
MoR (Management of Risk)
APM Project Management Qualification (PMQ)

Agile and Scrum:
CSM — Certified ScrumMaster (Scrum Alliance)
CSPO — Certified Scrum Product Owner
CSP — Certified Scrum Professional
PSM I/II/III — Professional Scrum Master (Scrum.org)
PSPO I/II/III — Professional Scrum Product Owner
SPS — Scaled Professional Scrum
PAL-I — Professional Agile Leadership
PSD — Professional Scrum Developer
SAFe SPC — SAFe Program Consultant (5.1)
SAFe Agilist (SA) — SAFe overview
SAFe Scrum Master (SSM)
SAFe Product Owner/Product Manager (POPM)
SAFe Release Train Engineer (RTE)
SAFe DevOps Practitioner (SDP)
ICAgile certifications (ICP, ICP-ACC, ICP-ATF, ICP-BAF)
Kanban Management Professional (KMP I/II)
PMI-ACP
Certified Agile Leadership (CAL)

IT Service Management:
ITIL 4 Foundation — essential for IT operations globally
ITIL 4 Managing Professional (4 modules)
ITIL 4 Strategic Leader (2 modules)
ITIL 4 Master — highest ITIL designation
COBIT 2019 Foundation and Design/Implementation
ISO/IEC 20000 Lead Implementer/Auditor
VeriSM Foundation

DevOps and Platform:
DevOps Foundation (DASA)
DevOps Professional (DASA)
DevSecOps Foundation (DSOF)
DevOps Institute DevOps Leader (DOL)
SRE Foundation (SREFL)
Site Reliability Engineering (SRE) Practitioner
Platform Engineering Practitioner (PEP)
GitLab Certified Associate/Professional
GitHub Actions Certification
GitHub Administration Certification

ENTERPRISE ARCHITECTURE CERTIFICATIONS:
TOGAF 9.2 Foundation (Level 1) and Practitioner (Level 2) — most recognized EA framework
ArchiMate 3 Practitioner — architecture modeling language
Zachman Framework Certifications
SABSA Foundation/Practitioner/Master — security architecture
AWS Certified Solutions Architect Professional (for cloud architects)
Microsoft Azure Solutions Architect Expert (AZ-305)
OpenCA Certifications
FEAC Certified Enterprise Architect (CEA) — US government focus
BIAN (Banking Industry Architecture Network) Certifications — financial sector
TM Forum Certifications — telecommunications sector

GRC AND COMPLIANCE CERTIFICATIONS:
ISACA CISA — Certified Information Systems Auditor
ISACA CISM — Certified Information Security Manager
ISACA CGEIT — Certified in Governance of Enterprise IT
ISACA CRISC — Certified in Risk and Information Systems Control
ISACA CDPSE — Certified Data Privacy Solutions Engineer
ISACA CISA
IIA CIA — Certified Internal Auditor
IIA CRMA — Certification in Risk Management Assurance
IIA CGAP — Certified Government Auditing Professional
ISO 27001 Lead Implementer (PECB, BSI)
ISO 27001 Lead Auditor
ISO 27005 Risk Manager
ISO 22301 Business Continuity Lead Implementer
PCI DSS QSA — Qualified Security Assessor (most expensive, most valuable in retail/finance)
PCI DSS PA-QSA — Payment Application QSA
PCI DSS ISA — Internal Security Assessor
HIPAA Certified Security Professional (HCISPP from ISC2)
FedRAMP training (US government cloud)
SOC 2 practitioner knowledge (not a formal cert but a demonstrated skill)
IAPP CIPP/US, CIPP/C, CIPP/E, CIPM, CIPT — privacy certifications
IAPP AIGP — AI Governance Professional (fastest growing 2026)

---

PART D — OCCUPATIONS COMPLETE UNIVERSE
Every role Job Coach AI should recognize and tailor output for.

TECHNOLOGY C-SUITE AND EXECUTIVE:
Chief Technology Officer (CTO), Chief Information Officer (CIO), Chief Digital Officer (CDO), Chief Data Officer (CDO/CDAO), Chief AI Officer (CAIO) — new 2024-2026, Chief Information Security Officer (CISO), Chief Privacy Officer (CPO), VP of Engineering, VP of Technology, VP of Data and Analytics, VP of Infrastructure, VP of Product, VP of IT, Head of Engineering, Head of Platform, Head of Security, Head of Data, Head of AI/ML, Head of Cloud, Director of Engineering, Director of IT, Director of Security, Director of Data Engineering, Director of Cloud Infrastructure, Director of DevOps, Director of Product Management, Engineering Manager, Technical Director, Global Head of Technology

ENGINEERING MANAGEMENT:
Engineering Manager, Senior Engineering Manager, Staff Engineering Manager, Senior Staff Engineering Manager, Distinguished Engineering Manager, Technical Lead Manager (TLM), Director of Engineering, Senior Director of Engineering, VP of Engineering

INDIVIDUAL CONTRIBUTOR — SOFTWARE ENGINEERING:
Software Engineer I/II/III (SWE), Senior Software Engineer, Staff Software Engineer, Senior Staff Software Engineer, Principal Software Engineer, Distinguished Software Engineer, Fellow, Software Engineer Intern, Associate Software Engineer, Junior Software Engineer, Mid-Level Software Engineer, Software Developer, Application Developer, Web Developer, Full-Stack Developer, Front-End Developer, Back-End Developer, Mobile Developer, iOS Developer, Android Developer, React Native Developer, Flutter Developer, Desktop Developer, Embedded Software Engineer, Firmware Engineer, Systems Programmer, Kernel Developer, Compiler Engineer, Language Designer, Game Developer, Graphics Engineer, Rendering Engineer, Shader Engineer, Engine Programmer, Audio Engineer (games), Tools Engineer, Build Engineer

PLATFORM AND INFRASTRUCTURE ENGINEERING:
Platform Engineer, Senior Platform Engineer, Staff Platform Engineer, Infrastructure Engineer, Senior Infrastructure Engineer, Infrastructure Architect, Cloud Engineer, Senior Cloud Engineer, Cloud Architect, Solutions Architect, Solutions Engineer, DevOps Engineer, Senior DevOps Engineer, Staff DevOps Engineer, DevSecOps Engineer, Site Reliability Engineer (SRE), Senior SRE, Staff SRE, Principal SRE, Production Engineer, Release Engineer, Release Manager, Build Engineer, Systems Engineer, Network Engineer, Network Architect, Network Administrator, NOC Engineer, Storage Engineer, Storage Administrator, Data Center Engineer, Data Center Technician, Data Center Manager, Colocation Engineer, Virtualization Engineer, HPC Engineer (High Performance Computing)

SECURITY ENGINEERING AND OPERATIONS:
Security Engineer, Application Security Engineer (AppSec), Cloud Security Engineer, Network Security Engineer, IAM Engineer, PKI Engineer, Cryptography Engineer, Security Architect, Security Operations Analyst (SOC L1/L2/L3), Threat Intelligence Analyst, Threat Hunter, Incident Responder, Digital Forensics Analyst, Malware Analyst, Reverse Engineer, Vulnerability Researcher, Penetration Tester, Red Team Operator, Red Team Lead, Blue Team Analyst, Purple Team Specialist, Security Awareness Trainer, GRC Analyst, Risk Analyst, Compliance Analyst, Data Privacy Analyst, Data Protection Officer (DPO), Privacy Engineer, CISO, Deputy CISO, vCISO, Bug Bounty Hunter, OSINT Analyst, Cyber Threat Intelligence (CTI) Analyst, Security Consultant, Forensics Consultant, Security Researcher, Exploit Developer

AI, ML AND DATA SCIENCE:
Machine Learning Engineer (MLE), Senior MLE, Staff MLE, Principal MLE, ML Researcher, Research Scientist, Applied Scientist, Senior Research Scientist, Principal Research Scientist, AI Engineer, Senior AI Engineer, Staff AI Engineer, AI Architect, AI Solutions Architect, AI Infrastructure Engineer, NLP Engineer, Computer Vision Engineer, Reinforcement Learning Engineer, Foundation Model Researcher, Multimodal AI Engineer, AI Safety Engineer, AI Safety Researcher, AI Ethics Researcher, AI Governance Analyst, Responsible AI Lead, Data Scientist, Senior Data Scientist, Staff Data Scientist, Principal Data Scientist, Lead Data Scientist, Head of Data Science, Quantitative Analyst (Quant), Quantitative Researcher, Quant Developer, Statistical Analyst, Econometrician, Decision Scientist, Behavioral Scientist (tech), Research Analyst, AI Product Manager, Prompt Engineer, AI Interaction Designer, Conversational AI Designer, Recommendation Systems Engineer, Feature Engineering Specialist, Model Evaluation Engineer, Fine-Tuning Specialist, AI Integration Engineer, MLOps Engineer, Senior MLOps Engineer, Staff MLOps Engineer, AI Platform Engineer, LLMOps Engineer, GenAI Engineer, RAG Engineer, Agentic AI Developer, Multi-Agent Systems Engineer

DATA ENGINEERING AND ANALYTICS:
Data Engineer, Senior Data Engineer, Staff Data Engineer, Principal Data Engineer, Lead Data Engineer, Data Platform Engineer, Analytics Engineer, DataOps Engineer, ETL Developer, ETL Architect, Data Pipeline Engineer, Data Warehouse Engineer, Data Lakehouse Engineer, Streaming Data Engineer, Database Administrator (DBA), Database Architect, Database Performance Engineer, Database Migration Specialist, NoSQL Engineer, Vector Database Engineer, Data Analyst, Senior Data Analyst, Lead Data Analyst, Business Intelligence Developer, BI Architect, BI Engineer, Analytics Developer, Reporting Analyst, Data Visualization Engineer, Dashboard Developer, Power BI Developer, Tableau Developer, Looker Developer, Quantitative Analyst, Data Modeler, MDM Specialist, Data Governance Analyst, Data Quality Engineer, Data Catalog Manager, Chief Data Officer, Data Product Manager, Data Steward, Analytics Manager, Head of Analytics, Data Science Manager

QA AND TESTING:
QA Engineer, Software Test Engineer, Senior QA Engineer, QA Lead, QA Manager, QA Architect, SDET (Software Development Engineer in Test), Test Automation Engineer, Senior Test Automation Engineer, Performance Test Engineer, Load Test Engineer, Security Tester, Penetration Tester (web applications), Accessibility Tester, Mobile QA Engineer, API Test Engineer, Test Architect, UAT Coordinator, Test Manager, Head of Quality, VP of Quality Assurance, Manual Test Engineer, Exploratory Test Engineer, Chaos Engineer

PRODUCT MANAGEMENT:
Product Manager (PM), Senior PM, Lead PM, Group PM, Principal PM, Director of Product Management, VP of Product, Chief Product Officer (CPO), Product Owner (PO), Senior PO, Technical Product Manager (TPM), AI Product Manager, Platform Product Manager, Data Product Manager, Security Product Manager, Growth PM, Monetization PM, Associate PM (APM), Product Analyst, Product Strategist, Product Marketing Manager (PMM)

TECHNICAL PROGRAM AND PROJECT MANAGEMENT:
Technical Program Manager (TPM), Senior TPM, Staff TPM, Principal TPM, Engineering Program Manager (EPM), IT Project Manager, Senior Project Manager, Program Manager, Senior Program Manager, Director of Program Management, PMO Manager, PMO Analyst, Scrum Master, Senior Scrum Master, Release Train Engineer (RTE), Agile Coach, Delivery Manager, IT Delivery Manager, Change Manager, IT Portfolio Manager, Business Relationship Manager (BRM)

ENTERPRISE ARCHITECTURE AND STRATEGY:
Enterprise Architect, Senior Enterprise Architect, Chief Enterprise Architect, Solution Architect, Solutions Engineer, Domain Architect, Business Architect, Data Architect, Integration Architect, Security Architect, Application Architect, Cloud Architect, Network Architect, Storage Architect, AI Architect, Digital Transformation Architect, Chief Architect, IT Strategy Consultant, Digital Strategy Consultant, Technology Advisor, Innovation Manager, Technology Evangelist, IT Portfolio Manager, Business Analyst (IT), Senior Business Analyst, Systems Analyst, IT Consultant, Management Consultant (Technology), Transformation Lead, Digital Lead

IT OPERATIONS AND SUPPORT:
IT Support Specialist (L1/L2/L3), Help Desk Analyst, Service Desk Analyst, IT Support Engineer, Desktop Support Technician, Field Service Technician, Field Service Engineer, Systems Administrator (Sysadmin), Senior Sysadmin, Linux Administrator, Windows Server Administrator, Active Directory Administrator, Exchange Administrator, M365 Administrator, Google Workspace Administrator, IT Operations Manager, IT Operations Analyst, NOC Analyst, NOC Engineer, NOC Manager, ITSM Analyst, ITSM Manager, ServiceNow Administrator, ServiceNow Developer, ServiceNow Architect, ITIL Process Owner, Change Manager, Problem Manager, Incident Manager, Configuration Manager, IT Asset Manager, Software Asset Manager, CMDB Manager, Patch Management Specialist, Endpoint Management Engineer, Printing Services Administrator, Unified Communications Administrator, Video Conferencing Administrator, VoIP Engineer

SALES, PRE-SALES AND CONSULTING:
IT Sales Engineer, Senior Sales Engineer, Pre-Sales Consultant, Solutions Consultant, Technical Account Manager (TAM), Enterprise Account Executive (EAE), Strategic Account Manager, Customer Success Manager (CSM), Customer Success Engineer, Implementation Consultant, Professional Services Consultant, Professional Services Manager, IT Consultant, Technology Consultant, Digital Transformation Consultant, Management Consultant (Technology), Strategy Consultant (Technology), Engagement Manager, Partner Manager, Alliances Manager, Channel Manager, Business Development Manager (Technology), IT Procurement Specialist, Vendor Manager

TECHNICAL WRITING AND DEVELOPER RELATIONS:
Technical Writer, Senior Technical Writer, Principal Technical Writer, API Documentation Specialist, Developer Advocate, Senior Developer Advocate, Developer Relations Engineer (DevRel), Developer Relations Manager, Head of Developer Relations, Knowledge Base Manager, Documentation Engineer, Content Strategist (Technical), Information Developer, UX Writer, Information Architect (IA), Learning and Development (L&D) Specialist (Technical)

UX/UI AND DESIGN:
UX Designer, Senior UX Designer, Lead UX Designer, Principal UX Designer, UI Designer, Senior UI Designer, Visual Designer, Product Designer, Senior Product Designer, Lead Product Designer, Interaction Designer, Motion Designer (tech), UX Researcher, Senior UX Researcher, User Researcher, Design Systems Engineer, Accessibility Engineer, Design Engineer, Front-End Design Engineer, Design Technologist, UX Strategist, Design Director, Head of Design, VP of Design, Chief Design Officer

EMERGING ROLES (2024-2026 AND BEYOND):
Chief AI Officer (CAIO) — mandatory C-suite addition at enterprise companies
AI Governance Lead — ensuring responsible AI deployment and regulatory compliance
AI Ops Engineer (LLMOps) — production operations for LLM-based systems
RAG Architect — specializes in retrieval-augmented generation pipeline design
Agentic AI Developer — builds multi-agent autonomous systems
Prompt Engineer — designs and evaluates prompts for production LLM systems
AI Interaction Designer — designs human-AI interaction patterns
AI Safety Engineer — ensures AI systems behave safely and as intended
AI Red Teamer — adversarial testing of AI systems for vulnerabilities and misuse
Synthetic Data Engineer — generates high-quality synthetic training data
Model Evaluator — systematically evaluates LLM outputs for quality, safety, and accuracy
Digital Twin Engineer — creates and maintains digital replicas of physical systems
FinOps Engineer — manages and optimizes cloud financial operations
Platform Engineer — builds internal developer platforms reducing cognitive load
Developer Experience (DevEx) Engineer — improves developer tooling and workflows
Green IT/Sustainability Engineer — reduces environmental impact of technology operations
Quantum Security Engineer — prepares organizations for post-quantum cryptography
Edge AI Engineer — deploys ML models to edge hardware
NLP Engineer for Low-Resource Languages — critical for global AI expansion
Multimodal AI Engineer — works with text, image, audio, video AI systems simultaneously
AI Policy Analyst — translates AI regulations into organizational policy
Chief Privacy Technologist — emerging role combining privacy law and technology

---

PART E — BLIND SPOTS JOB COACH AI MUST COVER

BLIND SPOT 1: ATS (Applicant Tracking System) Intelligence
Most resumes are rejected before a human sees them. Job Coach AI must teach this.

How ATS works:
Job postings are fed into ATS (Workday, Taleo, Greenhouse, Lever, iCIMS, Jobvite, SuccessFactors, BambooHR, Ashby, Rippling, Notion Hire)
ATS extracts keywords and scores resumes against job description
Resumes below the threshold are rejected automatically — never seen by human recruiter
ATS cannot read: tables, columns, headers/footers, graphics, text boxes, progress bars, icons
ATS struggles with: two-column layouts, non-standard section names, unusual fonts, PDFs with embedded images

ATS Optimization Rules for Job Coach AI output:
Use exact keyword phrases from job description (not synonyms)
Use standard section headings (Experience, Education, Skills, Certifications)
Use a single-column layout
Name sections exactly: Work Experience not Career History, not Professional Journey
Spell out acronyms at first use: CISSP (Certified Information Systems Security Professional)
Match seniority language: if job says "3+ years of experience with Kubernetes" and resume says "2 years with K8s" — that is a miss on two dimensions
Use plain text formatting — no borders, no tables in the main body, no columns

BLIND SPOT 2: The LinkedIn Recruiter Search Algorithm
LinkedIn's recruiter search works differently from resume ATS.

How LinkedIn recruiters search:
Keyword search: exact terms in title, headline, and skills sections rank highest
Boolean search: recruiter types: "cloud architect" AND "Azure" AND "Toronto" AND "open to work"
Seniority filter: your current title is the primary signal
Location filter: set to your actual current city
Activity signal: profiles that posted or engaged in the past 30 days rank higher
Open to Work: dramatically increases recruiter contact rate (especially green banner for casual search)
Profile completeness score: incomplete profiles are deprioritized in search results

Job Coach AI recommendation for every user:
Add every relevant skill from the job description to your LinkedIn skills section (up to 50 maximum)
Your LinkedIn headline should match the exact job title you are targeting
Set location to match where you want to work — not where you currently are
Enable Open to Work if actively looking (either public badge or recruiter-only visibility)
Post one piece of content per week to stay algorithmically active

BLIND SPOT 3: The Canadian Market Specific Gap
Unique factors Job Coach AI must flag for Canadian applications.

Canada-specific signals that differentiate candidates:
French/English bilingualism — adds 15-30% salary premium for federal and Quebec roles
Security clearance — Reliability, Secret, Top Secret. Required for federal government roles and many defense contracts. Takes 3-12 months to obtain. Start early.
Canadian professional associations: CIPS (Canadian Information Processing Society), ISACA Canada chapters, ISC2 Canada chapters, ISSA Canada chapters
Work authorization: Canadian citizen, permanent resident, open work permit, LMIA-required work permit — must be explicitly addressed if not obvious from profile
Soft skills emphasis unique to Canada: stakeholder management, cross-cultural communication, bilingual client communication are top-ranked skills on LinkedIn Skills on the Rise 2026 Canada
Canadian privacy law: PIPEDA (federal), PHIPA (Ontario health), HIA (Alberta health), Act respecting the protection of personal information in the private sector (Quebec Bill 64/Law 25) — knowing the applicable law for the industry is a differentiator

BLIND SPOT 4: The Hidden Job Market
70-80% of jobs in North America are filled through referrals or direct outreach — never posted publicly.

Job Coach AI should mention in Quick Win Tips:
If targeting a specific company, identify 3 employees in similar roles on LinkedIn
Connect and engage with their content before asking for anything
Ask for a 15-minute informational conversation about their experience at the company — not a job referral
Build the relationship over 4-8 weeks before anything transactional
Hiring managers often create roles for exceptional candidates they meet before posting — being in the right conversation at the right time is the hidden job market

BLIND SPOT 5: Salary Negotiation Intelligence
Most candidates leave money on the table. Job Coach AI should mention this in Quick Win Tips.

North America salary negotiation facts:
The first offer is rarely the best offer — 84% of employers expect negotiation
The candidate who anchors first gets a better outcome on average
Never give a number first — counter: "I'd like to understand the full comp package before discussing a specific number"
Total compensation includes: base salary, signing bonus, annual bonus (% and target), equity (RSUs, options), benefits, RRSP/401K match, vacation days, remote work flexibility, professional development budget
The range effect: when a range is given, employers anchor to the bottom
Counter-offer strategy: always have a competing offer (real or implied) to increase leverage
In Canada: do not disclose your current salary in applications — many provinces have legislation or norms against it

BLIND SPOT 6: Quantification Coaching
Every resume bullet should have a number. Most don't.

The most common bullets without numbers and how to fix them:
"Managed a team" → "Managed a team of 8 engineers across 3 time zones"
"Improved performance" → "Improved API response time by 67%, from 340ms to 112ms average"
"Deployed infrastructure" → "Deployed and managed cloud infrastructure supporting 2.3M daily active users across 3 AWS regions"
"Reduced costs" → "Reduced annual cloud spend by 34% ($1.8M) through reserved instance strategy and rightsizing 200+ EC2 instances"
"Implemented security" → "Implemented zero trust network architecture, reducing the attack surface by 78% and achieving ISO 27001 certification within 9 months"
"Led migration" → "Led migration of 47 legacy applications from on-premises to Azure, completing 6 weeks ahead of schedule with zero production incidents"

BLIND SPOT 7: The Career Gap Problem
Many candidates have employment gaps or career pivots. Job Coach AI should address this.

How to handle career gaps:
Gaps under 6 months: do not address in resume, address verbally in interview if asked
Gaps of 6-18 months: include a one-line explanation in the resume gap period (e.g., "Career transition — completed AWS Solutions Architect and CISSP certifications")
Gaps over 18 months: include a brief entry in experience section with what you did (freelancing, caregiving, education, health recovery — keep it factual and brief)
Career pivots: use a functional skills-based summary at the top of the resume. Lead with skills and certifications, not chronological experience.
Return to work after a decade+: certifications are the fastest credibility signal. ISC2 CC and AWS Cloud Practitioner are achievable in 4-6 weeks and immediately signal current relevance.

BLIND SPOT 8: Executive Resume vs Individual Contributor Resume
These are completely different documents that most people conflate.

Executive Resume (Director+):
Opens with an executive summary that reads like a business leader, not a technician
Focuses on organizational impact, P&L ownership, team size, budget managed, strategic decisions
Metrics are revenue, cost, headcount, customer impact — not technical benchmarks
Downplays technical specifics, elevates business outcomes
Board readiness language: governance, fiduciary responsibility, stakeholder management, transformation leadership
Length: 2-3 pages acceptable for 20+ year executives

Individual Contributor Resume (Engineer/Analyst):
Technical keywords and certifications front and center
Specific technologies, frameworks, and tools explicitly named
Metrics are system performance, reliability, security, efficiency, development velocity
Projects section is critical — show what you built
Length: 1-2 pages maximum, even for senior engineers with 15 years of experience

BLIND SPOT 9: The Cover Letter Nobody Reads vs The One That Gets Read
Most cover letters are ignored. The ones that work follow a specific structure.

The cover letter formula that actually gets read:
Paragraph 1 (2-3 sentences): Open with a specific statement about why THIS company, not all companies. Reference something specific they have done — a product launch, a technology decision, a mission statement phrase. Then state your interest in the specific role.
Paragraph 2 (3-4 sentences): Your most relevant achievement with a number. Connect it directly to a specific requirement in the job posting. This is the transfer of credibility moment.
Paragraph 3 (2-3 sentences): A second relevant achievement or skill that addresses a specific pain point or requirement in the job posting. Show you read the entire job description, not just the title.
Closing (1-2 sentences): Clear call to action. Express genuine enthusiasm. "I would welcome the opportunity to discuss how my experience in [X] can contribute to [Company]'s goal of [Y]."
What never to say: "I am excited to apply for this position" as the opening line. "I believe I am a good fit" — every candidate believes this. "I have always admired your company" — cliché and unverifiable.

BLIND SPOT 10: Video Resume and AI Portfolio (2026 Emerging Trend)
Some companies now accept or even prefer video introductions or AI-demonstrated portfolios.

Job Coach AI should mention:
Loom or LinkedIn Video Introduction — 60-90 seconds, professional background, good lighting, practiced delivery
GitHub portfolio for engineers — pinned repositories with clear READMEs, working demos, architecture documentation
AI project demo — if claiming AI skills, a working AI project (even a Job Coach AI-style tool) is the strongest possible signal
Deployed portfolio — projects on live URLs (Vercel, Netlify, Railway) show production readiness
Technical blog — 5-10 posts on your domain demonstrates deep knowledge and communicates it clearly
LinkedIn content — regular posts about your domain signal expertise to both recruiters and hiring managers before the interview process starts

---

PART F — MVP BUILD REALITY CLOCK
Shahzad + Claude.ai + Claude Code | What Can Be Built and in How Many Hours

REALISTIC ASSESSMENT:
You have one full build day (Saturday, ~10 hours available with focus).
Claude Code writes code in real-time in VS Code.
Shahzad runs commands, tests, makes product decisions, handles accounts.
Claude.ai (this chat) handles architecture, prompts, troubleshooting guidance.

MVP DEFINITION (What Must Work to Call This Done):
A live, publicly accessible URL.
User can paste or upload resume text.
User can paste job description.
User can click one button.
Three core outputs appear: Cover Letter, Tailored Resume Bullets, Gap Analysis.
Copy button works on each output.
Does not break on empty input.

HOUR-BY-HOUR BUILD CLOCK:

Hour 1 (0:00 – 1:00): Foundation
0:00 – 0:15: npx create-next-app — project scaffold. Install dependencies.
0:15 – 0:30: Create folder structure, environment file, .gitignore. Paste Gemini API key.
0:30 – 0:50: Create types/analysis.ts and lib/prompt.ts with Claude Code.
0:50 – 1:00: Test Gemini API key with a single curl call from terminal. Verify JSON response.
Checkpoint 1: Gemini returns valid JSON to terminal. Nothing in browser yet.

Hour 2 (1:00 – 2:00): Backend
1:00 – 1:20: Create lib/gemini.ts and lib/validator.ts with Claude Code.
1:20 – 1:35: Create lib/rateLimiter.ts and lib/parseFile.ts with Claude Code.
1:35 – 2:00: Create app/api/analyze/route.ts with Claude Code. Test with curl POST to localhost:3000.
Checkpoint 2: API accepts text input and returns all 6 outputs as JSON. No UI yet.

Hour 3 (2:00 – 3:00): UI Foundation
2:00 – 2:20: Create app/layout.tsx and components/LoadingSpinner.tsx with Claude Code.
2:20 – 2:50: Create components/OutputCard.tsx with Claude Code.
2:50 – 3:00: Build basic app/page.tsx with input form only. No output display yet.
Checkpoint 3: Page loads in browser. Form visible. Submit button sends request. Loading spinner shows.

Hour 4 (3:00 – 4:00): Core Output Display
3:00 – 3:30: Add Cover Letter output section to page.tsx with copy button. Test with real resume.
3:30 – 4:00: Add Tailored Resume Bullets output section. Add Gap Analysis output section.
Checkpoint 4: THREE CORE OUTPUTS WORKING. MVP functionality achieved.
DECISION POINT AT HOUR 4: If these three work perfectly, you have a submittable MVP. Hours 5-8 are polish and bonus features.

Hour 5 (4:00 – 5:00): Bonus Outputs (If Hour 4 Complete)
4:00 – 4:30: Add Interview Scripts with tab switching (1min/2min/3min).
4:30 – 5:00: Add STAR Stories output section.
Checkpoint 5: 5 of 6 outputs working.

Hour 6 (5:00 – 6:00): Quick Wins + Security + Error Handling
5:00 – 5:20: Add Quick Win Tips output section. Now all 6 outputs complete.
5:20 – 5:40: Update next.config.js with security headers. Add file size validation.
5:40 – 6:00: Test all error states (empty inputs, bad file type, network error). Fix what breaks.
Checkpoint 6: All 6 outputs + security headers + graceful error messages.

Hour 7 (6:00 – 7:00): Production Build and Deploy
6:00 – 6:15: npm run build. Fix any TypeScript errors Claude Code cannot auto-fix.
6:15 – 6:30: git init, git add ., git commit, git push to GitHub.
6:30 – 7:00: Vercel import, add GEMINI_API_KEY environment variable, deploy, verify live URL.
Checkpoint 7: Live URL working. Test with real resume on mobile browser.

Hour 8 (7:00 – 8:00): Demo and Submit
7:00 – 7:30: Record demo video using real resume and real job posting. Keep under 2 minutes.
7:30 – 7:45: Write submission post using template from Section 7. Include live URL and video.
7:45 – 8:00: Submit to hackathon. Verify submission is visible. Done.

TOTAL BUILD TIME: 8 focused hours.
TOTAL COST: $0.
RESULT: Production-deployed, publicly accessible AI career coaching tool with 6 outputs.

WHAT COULD BE BUILT IN ADDITIONAL TIME:
With 4 extra hours (12 total): Add salary range estimation by role and location. Add LinkedIn headline optimizer. Add role-specific keyword frequency analysis (count how many times each keyword appears in JD vs resume).
With 8 extra hours (16 total): Add PDF export of all outputs. Add interview question generator based on gap analysis. Add before/after resume score comparison. Add company research section using Gemini web grounding.
With 16 extra hours (24 total): Add multi-language support (French for Canadian market). Add industry-specific templates (finance, healthcare, government). Add voice input for job description pasting. Add progressive enhancement — show outputs as each section completes rather than waiting for all 6.
With 32 extra hours (2 full weekends): Add Wazuh-like SIEM-inspired logging dashboard showing which keywords were matched and missed (Shahzad's cybersecurity background directly applicable). Add A/B testing of cover letter styles. Add interview simulation mode — Gemini generates a question, user answers, Gemini evaluates the answer and suggests improvement. Add career trajectory planner — given your current role and certifications, suggest a 2/5/10 year advancement path.

WHAT WILL BREAK AND HOW TO HANDLE IT:

The three most likely failures during the hackathon build:
1. Gemini returns non-JSON output (probability: medium)
   Fix: add responseMimeType: application/json to the API call. Add try/catch with fallback parsing. Add retry logic (max 2 retries).
2. PDF parsing fails silently (probability: high for image-based PDFs)
   Fix: check extracted text length. If under 100 characters, show error message: "This PDF appears to be image-based. Please paste your resume text in the text box below." Have the text paste fallback always visible, not hidden.
3. TypeScript build fails at hour 6 (probability: medium)
   Fix: ask Claude Code to resolve each error one by one. If a complex type issue blocks progress, add // @ts-ignore as a temporary measure and document it for post-hackathon cleanup. Never let TypeScript errors delay submission.

THE CORE MVP PRINCIPLE:
A deployed, working, real app with 3 outputs beats an undeployed, polished app with 6 outputs.
Judges cannot evaluate what they cannot access.
Ship early. Polish later. Submit on time.

IF SOMETHING CATASTROPHICALLY BREAKS AT HOUR 7:
Plan B: Deploy to Railway.app instead of Vercel.
Plan C: Deploy to Render.com free tier.
Plan D: Screen record localhost:3000 working with real data. Submit that video with a note that "deployment is in progress due to a technical issue" and include the GitHub repo link so judges can verify the code is complete.

THE WINNING MINDSET:
This is not a competition to build the most features. It is a competition to demonstrate the clearest value to a judge in 2 minutes. Your demo video is your product. Your live URL is your proof. Everything else is noise.

---

END OF SECTION 22

================================================================================
MASTER DOCUMENT IS COMPLETE — FINAL SUMMARY
================================================================================

SECTION COUNT: 22 total sections

WHAT THIS DOCUMENT CONTAINS:
Sections 1–11:  Complete project foundation, tech stack decisions, cost optimization
Sections 12–16: All source code, file structure, Gemini integration, complete codebase
Sections 17–18: Troubleshooting, error handling, deployment guide
Section 19:     Complete A to Z workflow, security architecture, step-by-step build plan
Section 20:     Resume intelligence engine — scoring formulas, skills, certifications, salary benchmarks, bullet templates
Section 21:     Shahzad's LinkedIn intelligence — AI models, agentic AI market data, LinkedIn Skills on the Rise 2026 (all 5 markets), keyword master lists, geographic intelligence, free learning resources
Section 22:     Complete skills universe (every hard skill by category), complete soft skills list with evidence requirements, complete certifications universe by domain, complete occupations list (all 150+ IT roles), 10 blind spots with fixes, MVP build reality clock (hour-by-hour plan)

TOTAL LINES: 4,500+
TOTAL COST TO BUILD: $0
TOTAL BUILD TIME WITH CLAUDE CODE: 8 hours
RESULT: Production-deployed AI career coaching tool serving every IT professional in North America

Built by Shahzad + Claude.ai + Claude Code | March 2026
Shahzad MS: CTO | 34-Year Enterprise Technology SME | CISSP, SC-100 | Microsoft AI Winner
Stack: Next.js 14 + TypeScript + Tailwind + Gemini 2.0 Flash + Vercel
