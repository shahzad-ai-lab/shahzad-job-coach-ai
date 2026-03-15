# CLAUDE.md = GEMINI.md — MASTER BLUEPRINT (ULTRA COMPRESSED)
**Updated: March 14, 2026 — Session 26 | Rule: start session → "Read CLAUDE.md resume where left off"**

---

## OWNER + PROJECT
| | |
|-|-|
| Owner | Shahzad Muhammad · Mississauga ON Canada · Windows 11 · Vibe coder |
| Mission | Free AI tools for underserved humans globally |
| Live | https://shahzad-job-coach-ai.vercel.app |
| GitHub | https://github.com/shahzad-ai-lab/shahzad-job-coach-ai |
| Stack | Next.js 14 + Gemini AI + Serper.dev + Vercel + Tailwind |
| H1 | $6,000 hackathon — SUBMITTED Mar 8 ✓ |
| Status | 17 cards + chatbot + PWA + multilang + live jobs + country hero — LIVE |
| Rules | Free · No login · Zero storage · Bold vibrant gradients always |

---

## API KEYS
| Var | Service | Get it |
|-----|---------|--------|
| `GEMINI_API_KEY` | Google AI Studio | aistudio.google.com |
| `SERPER_API_KEY` | Serper.dev | serper.dev (free 2500/mo, no card) |
Both → `.env.local` + Vercel environment variables

---

## FOLDER STRUCTURE
```
root/  CLAUDE.md · GEMINI.md · .env.local · package.json · next.config.js · tailwind/postcss
app/   page.js(~1570L) · layout.js · globals.css
       api/analyze/route.js(~360L) · api/chat/route.js · api/jobs/route.js · api/upload/route.js · api/test/route.js
public/ manifest.json · [NEED: icon-192.png + icon-512.png for stores]
v1/    legacy docs, scripts, archive, media, credentials
v2/    MASTER_CAREER_REFERENCE.md (640KB, 48 sections — read with offset+limit only)
       COMPANIES_BY_COUNTRY.md (500+ companies · 30+ countries · career URLs · Forbes/Fortune 500)
       ALL_COUNTRIES.md (195 UN countries · ISO-2/3 codes · regions · capitals · job market tiers)
       OCCUPATIONS_ISCO08.md (ISCO-08 all 436 unit groups · 200+ job descriptions · BLS fastest-growing · 2026 emerging roles)
```

---

## GEMINI SETTINGS
model: `gemini-flash-latest` → fallback `gemini-flash-lite-latest` | tokens: 8192 | temp: 0.7 | timeout: 60s | rate: 5/hr/IP → backoff 1h/3h/6h | inputs: resume 6K · job 3K · body 50KB

---

## 17 AI CARDS + EXTRAS
| # | key | What it does |
|---|-----|-------------|
| 1 | resumeScore | ATS score + thresholds (80+=shortlist, <50=reject) + knockouts + composite weights + achievement density + anatomy check + recency decay |
| 2 | recruiterPov | 6.2-sec impression + red flags + LinkedIn cross-check + engagement signals |
| 3 | coverLetter | 3-para targeted cover letter |
| 4 | resumeRewrite | Full rewrite with impact-first STAR bullets |
| 5 | skillsGap | Hard+soft matched/missing + certs with URLs + training links |
| 6 | interviewPrep | 5 Q&A + questions to ask |
| 7 | starStories | 3 STAR behavioral stories |
| 8 | linkedinSummary | LinkedIn About optimized |
| 9 | introScripts | 1/2/3-min intro scripts |
| 10 | matchingJobs | Titles + companies + boards + 7-country recruiters + freelance platforms |
| 11 | visaPathways | Visa options + govt URLs |
| 12 | thankYouEmail | Post-interview email |
| 13 | salaryNegotiation | Salary table by level (Entry→Exec) + negotiation scripts |
| 14 | actionPlan | 30-60-90 day onboarding plan |
| 15 | coldOutreach | LinkedIn DM + cold email + follow-up |
| 16 | careerPivot | Pivot score + 3 adjacent roles + 90-day plan |
| 17 | countryLaws | Labor laws + resume compliance + tax/payroll + worker rights + GRC |
| + | liveJobs | Serper Google Jobs — fresh postings, apply links, post-results only |
| + | chatbot | Floating 💬 career-locked chatbot, 15/hr, suggested Qs |

---

## 2026 RESUME INTELLIGENCE (injected into every AI analysis)
- **ATS pattern scanning**: 2026 ATS reads experience patterns, not just keywords — align with C-suite priorities
- **6.2-second scan**: Cognitive Hierarchy Trick — anchor points (bolded metrics + logos) guide recruiter eye
- **Interactive PDFs**: portfolio/GitHub hyperlinks +35% response rate — flag if missing
- **Impact-first bullets**: STAR method mandatory — flag all duty bullets, rewrite with metrics
- **Personal Branding**: "My Values" / "Day in My Life" trending for startup/creative roles
- **Canada specialists**: Resume Target · Careers By Design (Toronto/Vancouver nuances)
- **USA specialists**: ResumeSpice (recruiter-built, 2-day turnaround)
- **Top 2026 providers**: Resumeble (ATS+LinkedIn+recruiter outreach) · TopResume (60-day guarantee + Job Search Concierge) · Kickresume (AI Full-Service + Career Maps) · TopStack (pay-after-delivery + C-Suite)
- **Market trend**: "Career Co-pilots" — AI + human expertise replacing single-doc services

---

## COUNTRY HERO BANNER (live on app)
Shows after location detects: flag + country name + GPS + timezone + currency + GDP + population + IT workforce + key industries + 100-year roadmap + legal essentials
Data: `getMarketPulse(country, code)` — 12 markets (CA/US/GB/AU/IN/PK/AE/DE/SG/NZ/NG/ZA) + global fallback
Fields per market: `stats · laws · gdp · pop · it · industries · future`

---

## WHAT'S DONE ✅ vs TODO
**DONE:** ATS algo · 17 cards · chatbot · PWA manifest · multilang · live jobs · security · RAG (4 data files) · file upload · Country Hero Banner · getMarketPulse 12 markets · 2026 Resume Intel · 195 countries · ISCO-08 436 occupations + descriptions · 500+ companies per country with career URLs

**TODO:**
- [ ] Shahzad: add SERPER_API_KEY to .env.local + Vercel env vars
- [ ] Add /public/icon-192.png + icon-512.png (any 192×192 + 512×512 PNG) — REQUIRED for stores
- [ ] Book AI-900 $165 + SC-900 $165 — learn.microsoft.com

---

## MOBILE APP — PUBLISH TO STORES (no new code needed)
App is full PWA (manifest.json + apple meta + HTTPS). To submit to stores:
1. **pwabuilder.com** → enter `https://shahzad-job-coach-ai.vercel.app` → Package for Stores
2. Downloads: Android TWA APK + iOS Xcode project
3. Google Play Console: $25 one-time | Apple App Store: $99/year
4. **Prerequisite**: icon-192.png + icon-512.png must exist in /public/ first

---

## SECURITY (all active)
client RL: localStorage `jcai_rl` 5/hr · server RL: Map by IP · sanitize HTML+injection · headers DENY/CSP/nosniff · 50KB body guard · input truncation

---

## KNOWN FIXES (permanent — never repeat these mistakes)
| Error | Fix |
|-------|-----|
| 404 model | Use `gemini-flash-latest` |
| Vercel timeout | `export const maxDuration = 60` |
| JSON truncation | maxOutputTokens 8192 |
| SSE streaming | NEVER use — single JSON response only |
| `tools:[{googleSearch}]` | NEVER add — silently kills all Gemini calls |
| Edit not found | Read exact lines with offset+limit first |
| 640KB file | Read with offset+limit only |
| Stop words in ATS | STOP_WORDS 200+ words, minLen >3 |
| langInstruction undefined | Declare `let langInstruction = ''` OUTSIDE try block |

---

## COMMANDS
`npm run dev` → localhost:3000 | `npm run build` | `git add . && git commit -m "msg" && git push origin main`
Test models: https://shahzad-job-coach-ai.vercel.app/api/test

---

## SESSION LOG (compressed)
S1-4 Mar6-8: V1 12cards deploy security H1 submitted | S5-6 Mar11-12: MASTER_REF v4 640KB 48sections | S7-14 Mar13: V2 RAG streaming(failed→reverted) 14cards wizard(removed) | S15-17 Mar13-14: stopwords ATScolors skillsGap certs freelance strictScoring | S18 Mar14: v1/v2 folders liveJobs Serper | S19 Mar14: ATS algo complete | S20 Mar14: chatbot 16cards PWA multilang | S21 Mar14: liveJobs merged matchingJobs 7-country recruiters fix-langInstruction | S22 Mar14: MarketPulse bar YourMarket banner post-results liveJobs quickStart chips | S23 Mar14: CountryHero banner GDP+IT+industries+100yr, getMarketPulse 12markets, 2026ResumeIntelligence injected prompts, manifest store-ready, mobile app guide | S24 Mar14: COMPANIES_BY_COUNTRY.md (500+ companies · 30+ countries · Forbes/Fortune 500 + career URLs), country-company RAG injector | S25 Mar14: ALL_COUNTRIES.md (195 UN countries · ISO codes · regions · job market tiers), OCCUPATIONS_ISCO08.md (ISCO-08 full 436 unit groups · 200+ job descriptions · BLS fastest-growing · 2026 emerging roles · occupation-country demand mapping), occupation RAG injector (auto-detects role from job posting → injects ISCO profile + growth data + fastest-growing list) | S26 Mar14: PLATFORM_BLUEPRINT.md (full scoring algorithm docs · age pathways · competitor analysis), app/assess/page.js NEW ROUTE /assess (5-step quiz · 7-category ISCO scoring · 0-100 market score · 70+ career recs · recency decay · age-specific paths 10-100yr), nav bar on main page (Resume Analyzer ↔ Skills Assessment), CTA banner on home page → live at /assess

---
*CLAUDE.md = GEMINI.md always · Update every ~10min · Build must pass before push*
