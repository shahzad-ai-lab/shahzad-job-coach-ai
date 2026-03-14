# CLAUDE.md = GEMINI.md — MASTER BLUEPRINT (ULTRA COMPRESSED)
**Updated: March 14, 2026 — Session 22 | Rule: start session → "Read CLAUDE.md resume where left off"**

---

## OWNER + PROJECT
| | |
|-|-|
| Owner | Shahzad Muhammad · Mississauga ON Canada · Windows 11 · Vibe coder |
| Mission | Free AI tools for underserved humans globally |
| Live | https://shahzad-job-coach-ai.vercel.app |
| GitHub | https://github.com/shahzad-ai-lab/shahzad-job-coach-ai |
| Vercel | https://vercel.com/shahzadms-projects/shahzad-job-coach-ai |
| Stack | Next.js 14 + Gemini AI + Serper.dev + Vercel + Tailwind |
| H1 | $6,000 hackathon — SUBMITTED Mar 8 ✓ |
| H2 | Deploy Mar 16 — MVP COMPLETE |
| Status | 16 cards + chatbot + PWA + multilang + live jobs — LIVE |
| Rules | Free · No login · Zero storage · Bold vibrant gradients always |

---

## API KEYS (2 separate — both needed)
| Var | Service | Get it | Add to |
|-----|---------|--------|--------|
| `GEMINI_API_KEY` | Google AI Studio | aistudio.google.com | .env.local + Vercel |
| `SERPER_API_KEY` | Serper.dev | serper.dev (free 2500/mo, no card) | .env.local + Vercel |

---

## FOLDER STRUCTURE
```
root/  CLAUDE.md · GEMINI.md · .env.local · package.json · next.config.js · tailwind/postcss
app/   page.js(~1150L) · layout.js · globals.css
       api/analyze/route.js · api/chat/route.js · api/jobs/route.js · api/upload/route.js · api/test/route.js
public/ manifest.json · [need: icon-192.png + icon-512.png]
v1/    legacy docs, scripts, archive, media, credentials
v2/    MASTER_CAREER_REFERENCE.md (640KB, 48 sections)
```

---

## GEMINI SETTINGS
model: `gemini-flash-latest` → fallback `gemini-flash-lite-latest` | tokens: 8192 | temp: 0.7 | timeout: 60s | rate: 5/hr/IP → backoff 1h/3h/6h | inputs: resume 6K · job 3K · body 50KB

---

## 16 AI CARDS + EXTRAS
| # | key | Title |
|---|-----|-------|
| 1 | resumeScore | ATS Score — score + thresholds + knockouts + composite weights + density + anatomy |
| 2 | recruiterPov | Recruiter POV — 6-sec impression + red flags + LinkedIn cross-check + engagement |
| 3 | coverLetter | Cover Letter |
| 4 | resumeRewrite | Resume Rewrite |
| 5 | skillsGap | Skills Gap — hard+soft matched/missing + certs with URLs |
| 6 | interviewPrep | Interview Prep — 5 Q&A + questions to ask |
| 7 | starStories | STAR Stories |
| 8 | linkedinSummary | LinkedIn About |
| 9 | introScripts | Intro Scripts 1/2/3 min |
| 10 | matchingJobs | Matching Jobs + freelance platforms |
| 11 | visaPathways | Global Visas — official govt URLs |
| 12 | thankYouEmail | Thank You Email |
| 13 | salaryNegotiation | Salary Strategy |
| 14 | actionPlan | 30-60-90 Plan |
| 15 | coldOutreach | Cold Outreach — LinkedIn DM + cold email + follow-up |
| 16 | careerPivot | Career Pivot — pivot score + 3 adjacent roles + 90-day plan |
| + | liveJobs | Live Jobs (Serper) — fresh postings, apply links |
| + | chatbot | Career Chatbot — floating 💬, career-locked, 15/hr, suggested Qs |

---

## WHAT'S DONE ✅ vs TODO
**DONE:** ATS algo (thresholds/knockouts/density/anatomy/recency) · 16 cards · chatbot · PWA manifest · multi-language · live jobs · security · RAG (MASTER_CAREER_REFERENCE) · file upload PDF/DOCX/TXT

**TODO:**
- [ ] Shahzad: add SERPER_API_KEY to .env.local + Vercel
- [ ] Add /public/icon-192.png + icon-512.png (any 192×192 + 512×512 PNG)
- [ ] Card 17: Company Intel (Serper news → Gemini brief before interview)
- [ ] Card 18: Real Salary Intel (Serper → actual current ranges)
- [ ] AI Mock Interview (Web Speech API + Gemini — voice practice)
- [ ] Book AI-900 $165 + SC-900 $165 — learn.microsoft.com

---

## SECURITY (all active)
client rate limit localStorage `jcai_rl` · server rate limit Map by IP · sanitize HTML+injection · headers DENY/CSP/nosniff/no-store · 50KB body guard · truncate inputs

---

## KNOWN FIXES (permanent)
| Error | Fix |
|-------|-----|
| 404 model | Use `gemini-flash-latest` |
| Vercel timeout | `export const maxDuration = 60` |
| JSON truncation | maxOutputTokens 8192 |
| SSE breaks | Use single JSON response (not streaming) |
| `tools:[{googleSearch}]` | NEVER add — kills Gemini calls silently |
| Edit not found | Read exact lines with offset+limit first |
| 640KB file | Read with offset+limit only |
| Stop words in ATS | STOP_WORDS 200+ words, minLen >3 |

---

## COMMANDS
`npm run dev` · `npm run build` · `git add . && git commit -m "msg" && git push origin main`
Test models: https://shahzad-job-coach-ai.vercel.app/api/test

---

## SESSION LOG (compressed)
S1-4 Mar6-8: V1 12cards deploy security H1 submitted | S5-6 Mar11-12: MASTER_REF v4 640KB | S7-14 Mar13: V2 RAG streaming(failed→reverted) 14cards wizard(removed) | S15-17 Mar13-14: stopwords ATScolors skillsGap certs freelance strictScoring | S18 Mar14: v1/v2 folders liveJobs Serper | S19 Mar14: ATS algo complete mobile guide | S20 Mar14: chatbot 16cards PWA multilang | S21 Mar14: liveJobs merged into MatchingJobs card, 7-country recruiters, fix langInstruction bug | S22 Mar14: Job Market Pulse bar (7-country hardcoded, animated pills), Your Market banner in Job Hunt panel, Live Jobs search moved post-results with country label, Quick Start 3-chip row above analyze button

---
*CLAUDE.md = GEMINI.md always · Update every ~10min · Build must pass before push*
