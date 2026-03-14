# CLAUDE.md + GEMINI.md — MASTER BLUEPRINT (SUPER COMPRESSED)
### Auto-loaded every session. Keep CLAUDE.md = GEMINI.md 100% identical always.
**Last Updated: March 14, 2026 — Session 20 Complete**
**Rule: Start every new session with "Read CLAUDE.md and resume where we left off"**

---

## OWNER
| | |
|-|-|
| Name | Shahzad Muhammad |
| Location | Mississauga, Ontario, Canada |
| OS | Windows 11 Pro + VS Code |
| Style | Vibe coding — Claude does ALL technical work |
| UI | Bold vibrant gradients always. No plain/boring UI ever. |
| Mission | Free AI tools for underserved populations globally |

---

## PROJECT — JOB COACH AI
| | |
|-|-|
| Live App | https://shahzad-job-coach-ai.vercel.app |
| GitHub | https://github.com/shahzad-ai-lab/shahzad-job-coach-ai |
| Vercel | https://vercel.com/shahzadms-projects/shahzad-job-coach-ai |
| Stack | Next.js 14 + Google Gemini AI + Serper.dev + Vercel + Tailwind CSS |
| Hackathon 1 | $6,000 prize — SUBMITTED March 8 ✓ |
| Hackathon 2 | In progress — deploy March 16 |
| Status | MVP COMPLETE — 16 AI cards + chatbot + PWA + multi-language + live jobs |
| Philosophy | Free · No login · Zero data storage · Works for all humans globally |

---

## FOLDER STRUCTURE (current — Mar 14)
```
shahzad-job-coach-ai/          ← ROOT
├── CLAUDE.md                  ← THIS FILE (auto-loaded by Claude)
├── GEMINI.md                  ← IDENTICAL COPY (auto-loaded by Gemini)
├── .env.local                 ← NEVER COMMIT: GEMINI_API_KEY + SERPER_API_KEY
├── .gitignore                 ← blocks: .env.local, node_modules, .next, credentials.txt
├── package.json               ← next 14.2.5, react 18, @google/generative-ai, pdf-parse, mammoth
├── next.config.js             ← serverComponentsExternalPackages: pdf-parse, mammoth
├── tailwind.config.js         ← scans app/**
├── postcss.config.js
├── app/
│   ├── page.js                ← ENTIRE FRONTEND (~800 lines)
│   ├── layout.js              ← root layout, bg-gray-950
│   ├── globals.css            ← @tailwind only
│   └── api/
│       ├── analyze/route.js   ← CORE AI ENGINE (Gemini, RAG, rate limit, 14 cards)
│       ├── jobs/route.js      ← LIVE JOBS (Serper.dev Google Jobs API)
│       ├── upload/route.js    ← file parser: PDF/DOCX/TXT max 10MB
│       └── test/route.js      ← diagnostic: tests Gemini models
├── v1/                        ← LEGACY: all hackathon docs, scripts, archive, media
│   ├── _v1_archive/           ← exact V1 app snapshot
│   ├── SESSION_LOG.md, STORY.md, PROGRESS.md, EXECUTIVE_SUMMARY.md
│   ├── *.ps1 scripts, credentials.txt, *.xlsx, *.png, *.mp4
│   └── shahzad-job-coach-ai-master-guide.md
└── v2/
    └── MASTER_CAREER_REFERENCE.md  ← 640KB, 48-section career database, v4.0
```

---

## API KEYS — TWO SEPARATE KEYS REQUIRED
| Key | Service | Where to get | Where to add |
|-----|---------|-------------|--------------|
| `GEMINI_API_KEY` | Google AI Studio | aistudio.google.com | .env.local + Vercel env vars |
| `SERPER_API_KEY` | Serper.dev | serper.dev (free 2,500/mo) | .env.local + Vercel env vars |

**These are SEPARATE companies. Gemini key ≠ Serper key. Both needed for full app.**

---

## GEMINI API SETTINGS
| Setting | Value |
|---------|-------|
| Primary model | `gemini-flash-latest` |
| Fallback | `gemini-flash-lite-latest` |
| maxOutputTokens | 8192 |
| Temperature | 0.7 |
| Vercel timeout | 60s (`export const maxDuration = 60`) |
| Rate limit | 5/hr per IP → backoff 1h/3h/6h |
| Input limits | Resume: 6,000 chars / Job: 3,000 chars / Body: 50KB |

---

## SERPER.DEV — WHAT IT DOES + WHY WE USE IT
Serper is a Google Search API. $0.001/search. 2,500/month free. Gives us REAL-TIME Google data.

**What Serper enables (vs Gemini which uses training data from the past):**
| Serper API Type | Endpoint | What we use it for |
|----------------|----------|-------------------|
| Google Jobs | `/jobs` | Live job postings, last 1-2 weeks, direct apply links ✅ BUILT |
| Google Search | `/search` | Real-time salary data, company intel, market demand |
| Google News | `/news` | Company news before interview, industry trends |

**Currently built with Serper:**
- `/api/jobs` — Live Jobs search: job title + location + timeframe → returns 10 jobs with apply links

**Planned with Serper (next MVP features):**
- Card 15: Company Intelligence (news + culture + CEO + funding before interview)
- Card 16: Real-Time Salary Intel (searches Glassdoor/LinkedIn/Indeed → synthesizes actual ranges)
- Market demand signal (is this job title growing or shrinking in 2026?)

---

## 16 AI CARDS + LIVE JOBS + CHATBOT (current state — Session 20)
All 16 cards powered by Gemini. Live Jobs powered by Serper. Chatbot = Gemini.

| # | Key | Title | What it produces |
|---|-----|-------|-----------------|
| 1 | resumeScore | ATS Score | Score + thresholds + keywords + knockout check + composite weights + achievement density + resume anatomy |
| 2 | recruiterPov | Recruiter POV | 6-second impression + red flags + LinkedIn cross-check + engagement signals |
| 3 | coverLetter | Cover Letter | 3-paragraph targeted letter |
| 4 | resumeRewrite | Resume Rewrite | Full ATS-optimized rewrite |
| 5 | skillsGap | Skills Gap | Hard/soft matched+missing + upskilling roadmap with URLs + certifications |
| 6 | interviewPrep | Interview Prep | 5 questions + answers + questions to ask |
| 7 | introScripts | Intro Scripts | 1/2/3 minute scripts |
| 8 | starStories | STAR Stories | 3 behavioral stories |
| 9 | linkedinSummary | LinkedIn | About section optimized |
| 10 | matchingJobs | Matching Jobs | Full-time roles + freelance platforms (Upwork/Toptal/Contra/etc) |
| 11 | visaPathways | Global Visas | 3 visa options with official government URLs |
| 12 | thankYouEmail | Thank You | Post-interview email |
| 13 | salaryNegotiation | Salary Strategy | Market range + negotiation scripts |
| 14 | actionPlan | 30-60-90 Plan | Week 1 + 30/60/90 day goals |
| 15 | coldOutreach | Cold Outreach | LinkedIn connection + DM + cold email + follow-up scripts |
| 16 | careerPivot | Career Pivot | Pivot score + 3 adjacent roles + 90-day plan |
| + | liveJobs | Live Jobs | Serper Google Jobs — fresh postings with apply links |
| + | chatbot | Career Chatbot | Floating 💬 button — Gemini AI, career-locked, 15/hr, suggested questions |

---

## ATS ALGORITHM — FULLY IMPLEMENTED (2026 standard)
✅ Composite weighted score (Skills 40%, Experience+Recency 25%, Soft 15%, Education 10%, Format 10%)
✅ Score thresholds shown (80%+=auto-shortlist, 60-79%=manual, 50-59%=borderline, <50%=auto-reject)
✅ Knockout question identification (work auth, visa, license, location requirements)
✅ Achievement density audit (count quantified bullets, rewrites weak ones)
✅ Resume anatomy check (length, single column, no graphics, file type, standard headings)
✅ Recency decay (flags skills used 3+ years ago)
✅ Semantic NLP matching via Gemini (not just keyword matching)
✅ 6-second recruiter scan simulation
✅ LinkedIn cross-check warning
✅ Engagement signals coaching (respond fast, update profile, apply within 48h)

---

## WHAT WE'RE MISSING — MVP ROADMAP TO #1 TOOL ON EARTH

### TIER 1 — BUILD NEXT (high impact, low effort)
| Feature | Status | How to build |
|---------|--------|-------------|
| **Chatbot** | ✅ DONE | /api/chat, floating button, career-locked |
| **Cards 15-16** (Cold Outreach + Career Pivot) | ✅ DONE | Gemini prompt |
| **PWA** | ✅ DONE | manifest.json + layout.js meta |
| **Multi-language** | ✅ DONE | browser lang detect → Gemini |
| **Card 17: Company Intel** | TODO | Serper `/news` + `/search` → Gemini brief |
| **Card 18: Real Salary Intel** | TODO | Serper → synthesize actual ranges |
| **Market Demand Score** | TODO | Serper news → trend analysis |

### TIER 2 — BUILD SOON (medium effort, major differentiation)
| Feature | What it does | How to build |
|---------|-------------|-------------|
| **Card 17: Cold Outreach DM** | LinkedIn message to hiring manager (beyond thank you) | Gemini prompt — no extra API |
| **Card 18: Portfolio Gap** | What GitHub projects to build to get this exact job | Gemini + Serper search job postings for patterns |
| **Card 19: Career Pivot Map** | What adjacent roles this candidate can realistically move to | Gemini analysis |
| **Multi-language support** | Spanish, Arabic, French, Hindi — serve 5B more people | `navigator.language` detect → pass to Gemini |
| **Job comparison tool** | Upload 2 job descriptions → AI picks which one to pursue | Second textarea → modified prompt |

### TIER 3 — FUTURE MOAT (complex, unique)
| Feature | What it does | Why nobody has it free |
|---------|-------------|----------------------|
| **AI Mock Interview** | Voice/text Q&A drill — real-time feedback | Web Speech API + Gemini (free) |
| **Resume version manager** | Save different resume versions per job type | localStorage only (no backend, privacy preserved) |
| **Networking script generator** | LinkedIn connection requests, follow-up sequences | Gemini prompt |
| **Reference letter writer** | Professional reference request emails | Gemini prompt |

### COMPETITOR GAP ANALYSIS
| What they charge | Their price | We offer |
|-----------------|-------------|---------|
| Jobscan ATS scan | $50/month | ✅ FREE + deeper (anatomy + knockouts + density) |
| Zety resume builder | $25/month | ✅ FREE full rewrite |
| Final Round AI interview | $200/month | ✅ FREE prep (text, adding voice soon) |
| LinkedIn Premium insights | $40/month | ✅ FREE recruiter POV + engagement signals |
| Teal HQ job tracker | $29/month | ✅ FREE (no tracking needed — live search via Serper) |
| Pathrise career coaching | $5,000 success fee | FREE AI coaching (human touch = our only gap) |

**Our edge: 14+ tools FREE + real-time data (Serper) + global (visa) + zero login + mobile PWA + serves ALL humans (refugee, widow, student, senior, career changer)**

---

## MOBILE APP — GUIDE FOR DAUGHTER
**Goal: Same app on Android + iOS. Same Gemini key (stays on Vercel server — phone never sees it).**

**Option A: PWA — Fastest (30 min, $0, no app store)**
- I add manifest.json to Next.js → users tap "Add to Home Screen" → native app experience
- Works Android + iOS. No app store. No cost. Do this first.

**Option B: Expo React Native — Full App**
```bash
npm install -g expo-cli
npx create-expo-app JobCoachMobile
cd JobCoachMobile && npx expo start     # scan QR → runs on phone immediately
```
- Same JavaScript/React she knows from web
- Calls same Vercel URLs: `https://shahzad-job-coach-ai.vercel.app/api/analyze`
- Test FREE via Expo Go app on any phone
- Publish: Google Play $25 one-time | App Store $99/year (needs Mac)
- NO new AI key — Gemini stays on server

---

## SECURITY LAYERS (all active)
1. Client rate limit: localStorage `jcai_rl` — 5/hr, backoff 1h/3h/6h
2. Server rate limit: in-memory Map by IP — same limits
3. Input sanitization: strips HTML, null bytes, 7 injection patterns
4. Security headers: X-Frame-Options DENY, CSP, no-store, nosniff
5. Body guard: 50KB max
6. Input truncation: resume 6K, job 3K chars

---

## COMMANDS
| Task | Command |
|------|---------|
| Run locally | `npm run dev` → localhost:3000 |
| Build check | `npm run build` |
| Deploy | `git add . && git commit -m "msg" && git push origin main` |
| Check models | https://shahzad-job-coach-ai.vercel.app/api/test |

---

## KNOWN ERRORS + FIXES (permanent reference)
| Error | Fix |
|-------|-----|
| 404 model not found | Use `gemini-flash-latest` not `gemini-2.0-flash` |
| Vercel 9s timeout | `export const maxDuration = 60` in route.js |
| JSON truncation | maxOutputTokens = 8192 |
| SSE stream breaks on Vercel | Reverted to single JSON response (not streaming) |
| `tools:[{googleSearch}]` kills API | Removed — gemini-flash-latest doesn't support it |
| Edit string not found | Read exact lines first with offset+limit, then edit |
| 640KB file too large | Read with offset+limit in chunks |
| Stop words showing as missing keywords | STOP_WORDS expanded to 200+ words, min length >3 chars |

---

## CERTIFICATIONS ROADMAP (Shahzad)
| Cert | Cost | Timeline |
|------|------|---------|
| AI-900 Azure AI Fundamentals | $165 | 3 months |
| SC-900 Security & Compliance | $165 | 3 months |
| AZ-500 Azure Security Engineer | $165 | Month 4–6 |
| SC-200 Security Operations Analyst | $165 | Month 7–9 |

---

## SESSION HISTORY (compressed)
| Sessions | Date | What was built |
|----------|------|---------------|
| 1–4 | Mar 6–8 | V1: 12 cards, file upload, deploy, security, user info bar — HACKATHON SUBMITTED ✓ |
| 5–6 | Mar 11–12 | MASTER_CAREER_REFERENCE.md v4.0 (48 sections, 640KB) |
| 7–8 | Mar 13 | CLAUDE.md/GEMINI.md blueprints, hackathon Q&A, V2 planning |
| 9–14 | Mar 13 | V2 build: streaming (failed), RAG, 14 cards, wizard (removed), V1 stability restore |
| 15 | Mar 13 | Removed wizard, fixed download .txt, markdown rendering, enforced Guide |
| 16–17 | Mar 14 | ATS stop words fix, red/green keyword colors, strict scoring, skillsGap hard+soft, certs with URLs, freelance platforms |
| 18 | Mar 14 | v1/v2 folder structure, Live Jobs (Serper), CLAUDE.md updates |
| 19 | Mar 14 | ATS algo complete (thresholds, knockouts, density, anatomy, recency, LinkedIn), mobile guide |
| 20 | Mar 14 | Chatbot (/api/chat, floating panel, career-locked), Cards 15-16 (coldOutreach, careerPivot), PWA (manifest.json), multi-language, layout.js SEO |

---

## PENDING TASKS
- [ ] **Shahzad: add SERPER_API_KEY** to .env.local + Vercel env vars (serper.dev — free 2,500/month, no credit card)
- [ ] Add PWA icons: /public/icon-192.png + /public/icon-512.png (any 192×192 and 512×512 PNG)
- [ ] Build Card 17: Company Intelligence (Serper news → Gemini brief)
- [ ] Build Card 18: Real Salary Intel (Serper → actual ranges)
- [ ] Daughter: Expo mobile app OR PWA already works (just add to home screen)
- [ ] Book AI-900 exam ($165) — learn.microsoft.com
- [ ] Book SC-900 exam ($165) — learn.microsoft.com

---

## WORKING RULES — PERMANENT
1. CLAUDE.md + GEMINI.md = identical always. Update every ~10 min during work.
2. `npm run build` must pass before every git push
3. Never commit .env.local or credentials.txt
4. Read MASTER_CAREER_REFERENCE.md with offset+limit (640KB — never read whole)
5. When tokens low: save to CLAUDE.md + write "SAFE TO END SESSION"
6. Bold vibrant gradients always — never plain/boring UI
7. No `tools:[{googleSearch}]` in Gemini API body — it breaks the call

---
*Last Updated: March 14, 2026 | CLAUDE.md = GEMINI.md always*
