# CLAUDE.md = GEMINI.md — MASTER BLUEPRINT (ULTRA COMPRESSED)
**Updated: March 15, 2026 — Session 30 | Rule: start session → "Read CLAUDE.md resume where left off"**

---

## OWNER + PROJECT
| | |
|-|-|
| Owner | Shahzad Muhammad · Mississauga ON Canada · Windows 11 · Vibe coder |
| Mission | Free AI tools for underserved humans globally |
| Brand | **Alfalah AI** (الفلاح) — "Come to Success" — Arabic/Urdu/Islamic tradition |
| Domain | alfalah.app (owned, connect when hackathon launches) |
| Live | https://shahzad-job-coach-ai.vercel.app |
| GitHub | https://github.com/shahzad-ai-lab/shahzad-job-coach-ai |
| Stack | Next.js 14 + Gemini AI + Serper.dev + Vercel + Tailwind |
| H1 | $6,000 hackathon — SUBMITTED Mar 8 ✓ |
| Status | 17 cards + PWA + 3-phase splash + country+industry picker + RAG 9 files + /assess — LIVE |
| Rules | Free · No login · Zero storage · Bold vibrant galaxy gradients always |

---

## API KEYS
| Var | Service | Notes |
|-----|---------|-------|
| `GEMINI_API_KEY` | Google AI Studio primary | aistudio.google.com |
| `GEMINI_API_KEY_2` | Google AI Studio backup | same studio, 2nd key |
| `GROK_API_KEY` | xAI Grok-4-latest | api.x.ai — OpenAI-compatible |
| `SERPER_API_KEY` | Serper.dev Google Jobs | serper.dev (free 2500/mo) — NOT YET ADDED |
All → `.env.local` + Vercel environment variables · NEVER commit keys to git

---

## FOLDER STRUCTURE
```
root/   CLAUDE.md · GEMINI.md · .env.local · package.json · next.config.js · tailwind/postcss
        (nothing else belongs in root — all tools/docs go inside v1/ or v2/)
app/    page.js(~1800L) · layout.js · globals.css
        api/analyze/route.js(~600L) · api/chat/route.js · api/jobs/route.js
        api/upload/route.js · api/test/route.js
public/ manifest.json · icon-192.png ✅ · icon-512.png ✅
v1/     legacy docs · scripts · archive · media · credentials · test files
v2/     MASTER_CAREER_REFERENCE.md (640KB, 48 sections — read with offset+limit only)
        COMPANIES_BY_COUNTRY.md (500+ companies · 30+ countries · career URLs)
        ALL_COUNTRIES.md (195 UN countries · ISO codes · regions · job market tiers)
        OCCUPATIONS_ISCO08.md (ISCO-08 436 unit groups · BLS fastest-growing · 2026 roles)
        PLATFORM_BLUEPRINT.md (scoring algorithm · age pathways · competitor table)
        COMPETITOR_VISABRIDGE.md (VisaBridge.com intel · pricing · 238 countries)
        CERTIFICATIONS_2026.md (all-industry certs A-Z · Cloud/Security/Finance/Trades/AI)
        COUNTRY_PACKAGES_195.md (all 195 UN countries · GDP · visa · salary · laws · boards)
        GLOBAL_CAREER_INTELLIGENCE_2025.md (salary data · ATS systems · job boards · trends)
        SESSION_RECORDS/  SESSION_LOG_S30.md · V2_DEMO_COMPLETE.md · V3_MOBILE_PLAN.md
        tools/            generate-icons.js
```

---

## AI FALLBACK CHAIN (both analyze + chat routes)
Gemini KEY1 → gemini-2.0-flash → gemini-flash-latest → gemini-2.0-flash-lite → gemini-1.5-flash
Gemini KEY2 → same 4 models
Grok fallback → grok-4-latest (api.x.ai, OpenAI-compatible)
tokens: 8192 | temp: 0.7 | timeout: 55s | rate: 9999 (disabled for dev)

---

## 17 AI CARDS + EXTRAS
| # | key | What it does |
|---|-----|-------------|
| 1 | resumeScore | ATS score + knockouts + composite weights + achievement density + anatomy check |
| 2 | recruiterPov | **6-second skim test** (200 apps on desk) + what noticed/missed + red flags + quick wins |
| 3 | coverLetter | **Top 1% cover letter** — hook + 3 quantified wins + specific why-them + confident ask |
| 4 | resumeRewrite | **3-step rebuild**: skim diagnosis → measurable wins extracted → top 3 wins in first half |
| 5 | skillsGap | Hard+soft matched/missing + industry certs with URLs + training links |
| 6 | interviewPrep | 5 Q&A + questions to ask |
| 7 | starStories | 3 STAR behavioral stories |
| 8 | linkedinSummary | LinkedIn About optimized |
| 9 | introScripts | 1/2/3-min intro scripts |
| 10 | matchingJobs | Titles + companies + boards + 7-country recruiters + freelance platforms |
| 11 | visaPathways | In-country vs outside-country — all visa routes + govt URLs |
| 12 | thankYouEmail | Post-interview email |
| 13 | salaryNegotiation | Salary table by level + negotiation scripts (local currency) |
| 14 | actionPlan | 30-60-90 day onboarding plan |
| 15 | coldOutreach | LinkedIn DM + cold email + follow-up |
| 16 | careerPivot | Pivot score + 3 adjacent roles + 90-day plan |
| 17 | countryLaws | Labor laws + resume compliance + tax/payroll + worker rights + GRC |
| + | liveJobs | Serper Google Jobs — auto-fetched after analysis, inside matchingJobs card |

---

## TOP RECRUITER 3-STEP METHODOLOGY (injected into every analysis)
**STEP 1** — 6-second skim: Recruiter has 200 apps. What is NOTICED vs MISSED in top third?
**STEP 2** — Measurable wins: Every bullet needs a NUMBER. Extract + add metrics: %, $, time, team size.
**STEP 3** — Reorder: Top 3 strongest results MUST be in first half of page 1. Reorganize ruthlessly.
**BONUS** — ATS keywords: Insert job description keywords naturally after human optimization.
**RESULT** — Top 1% candidate: Specific wins > generic duties. Numbers > adjectives. Results > responsibilities.

---

## 2026 RESUME INTELLIGENCE (injected into every AI analysis)
- **ATS 2026**: Scans experience PATTERNS not just keywords — align with C-suite priorities
- **6.2-second scan**: Cognitive Hierarchy Trick — anchor points (bolded metrics + logos) guide eye
- **Interactive PDFs**: portfolio/GitHub hyperlinks +35% response rate
- **Impact-first bullets**: STAR method mandatory — flag all duty bullets, rewrite with metrics
- **Personal Branding**: "My Values" / "Day in My Life" trending for startup/creative roles
- **Market trend 2026**: "Career Co-pilots" — AI + human expertise replacing single-doc services

---

## RAG SYSTEM (9 files, all local — Gemini only generates narrative)
| File | Size | Used for |
|------|------|---------|
| MASTER_CAREER_REFERENCE.md | 640KB | Career knowledge base — read with offset+limit only |
| COMPANIES_BY_COUNTRY.md | 29KB | Top companies + career URLs by country |
| ALL_COUNTRIES.md | 13KB | 195 countries · ISO codes · regions |
| OCCUPATIONS_ISCO08.md | 55KB | 436 ISCO-08 job groups · BLS fastest-growing |
| PLATFORM_BLUEPRINT.md | 12KB | Scoring algorithm · competitor analysis |
| COMPETITOR_VISABRIDGE.md | 7KB | VisaBridge intel · pricing · 238 countries |
| CERTIFICATIONS_2026.md | 19KB | All-industry certs A-Z · 2026 emerging |
| COUNTRY_PACKAGES_195.md | 63KB | 195 countries · GDP · visa · salary · laws |
| GLOBAL_CAREER_INTELLIGENCE_2025.md | 44KB | Salary data · ATS systems · job boards |

---

## 3-PHASE SPLASH SCREEN
Phase 1 — Loading (1.8s progress bar) → auto-advances
Phase 2 — Country picker: "STEP 1 OF 2" — 20 countries grid — pickCountry() → goes to phase 3
Phase 3 — Industry picker: "STEP 2 OF 2" — 15 industries — pickIndustry() → dismisses splash
State: `splashPhase`: 'loading' | 'country' | 'industry' · `selectedCountry` · `selectedIndustry`
API receives: `userCountry` + `userCountryCode` + `userIndustry` + `userIndustryLabel`

---

## COUNTRY-AWARE AI GUIDANCE (analyze/route.js)
- **Job IN user's country**: local hiring requirements, ATS norms, licensing, permits, background checks
- **Job OUTSIDE user's country**: ALL pathways — skilled worker visa, employer-sponsored, working holiday, intra-company transfer, temp worker, digital nomad, NON-immigration, treaty visas — with govt URLs
- Salary card uses local currency + country-specific ranges
- Country Laws card focuses on user's selected country labor law
- Skills Gap prioritizes certifications recognized in user's country

---

## COUNTRY HERO BANNER (live on app)
Data: `getMarketPulse(country, code)` — 12 markets (CA/US/GB/AU/IN/PK/AE/DE/SG/NZ/NG/ZA) + global fallback
Fields: `stats · laws · gdp · pop · it · industries · future`

---

## MOBILE APP STATUS
PWA fully store-ready: manifest.json ✅ · icon-192.png ✅ · icon-512.png ✅ · HTTPS ✅
**FREE publishing path**: pwabuilder.com → APK → Amazon Appstore (free) + Samsung Galaxy Store (free)
**Paid**: Google Play $25 one-time · Apple App Store $99/year
**iOS free**: Share URL → Safari → "Add to Home Screen" = native app experience
**v3 mobile**: React Native + Expo — build from scratch when next hackathon announced

---

## WHAT'S DONE ✅ vs TODO
**DONE S1-30:**
- 17 AI cards · PWA · 3-phase splash · country+industry picker · RAG 9 files
- Multi-provider AI chain (Gemini KEY1+KEY2+Grok) · All rate limits disabled for dev
- Country-aware prompts (in-country vs outside) · Industry-aware cert injection
- /assess page (5-step quiz · 7 categories · 0-100 score · 70+ career recs)
- Country Hero Banner · 6-second skim methodology · Top 1% resume rebuild
- Cover letter top 1% · Recruiter 3-step method baked into all prompts
- icon-192.png + icon-512.png generated ✅ · Session records in v2/SESSION_RECORDS/
- Root folder clean: only config files + CLAUDE.md/GEMINI.md

**LANG:** Multilingual system COMMENTED OUT — preserved in code for v3

**TODO:**
- [ ] Add SERPER_API_KEY to .env.local + Vercel (live jobs currently empty)
- [ ] Pay $25 → Google Play Console when ready
- [ ] Book AI-900 $165 + SC-900 $165 — learn.microsoft.com
- [ ] Re-enable rate limits before production launch
- [ ] alfalah.app domain → connect to Vercel when next hackathon launches

---

## SECURITY (all active)
client RL: localStorage `jcai_rl` 9999/hr (disabled) · server RL: Map by IP 9999/hr (disabled)
sanitize HTML+injection · headers DENY/CSP/nosniff · 50KB body guard · input truncation

---

## KNOWN FIXES (permanent — never repeat these mistakes)
| Error | Fix |
|-------|-----|
| 404 model | Use `gemini-flash-latest` not `gemini-pro` |
| Vercel timeout | `export const maxDuration = 60` |
| JSON truncation | maxOutputTokens 8192 |
| SSE streaming | NEVER use — single JSON response only |
| `tools:[{googleSearch}]` | NEVER add — silently kills all Gemini calls |
| Edit not found | Read exact lines with offset+limit first |
| 640KB file | Read with offset+limit only |
| Stop words in ATS | STOP_WORDS 200+ words, minLen >3 |
| langInstruction undefined | Declare `let langInstruction = ''` OUTSIDE try block |
| Git push blocked | Never put API keys in .md session logs — use placeholders |

---

## COMMANDS
`npm run dev` → localhost:3000 | `npm run build` | `git add . && git commit -m "msg" && git push origin main`
Test models: https://shahzad-job-coach-ai.vercel.app/api/test

---

## SESSION LOG (compressed)
S1-4 Mar6-8: V1 12cards deploy security H1 submitted | S5-6 Mar11-12: MASTER_REF v4 640KB 48sections | S7-14 Mar13: V2 RAG streaming(failed→reverted) 14cards wizard(removed) | S15-17 Mar13-14: stopwords ATScolors skillsGap certs freelance strictScoring | S18 Mar14: v1/v2 folders liveJobs Serper | S19 Mar14: ATS algo complete | S20 Mar14: chatbot 16cards PWA multilang | S21 Mar14: liveJobs merged matchingJobs 7-country recruiters fix-langInstruction | S22 Mar14: MarketPulse bar YourMarket banner post-results liveJobs quickStart chips | S23 Mar14: CountryHero banner GDP+IT+industries+100yr getMarketPulse 12markets 2026ResumeIntelligence manifest | S24 Mar14: COMPANIES_BY_COUNTRY.md 500+ companies | S25 Mar14: ALL_COUNTRIES.md OCCUPATIONS_ISCO08.md | S26 Mar14: PLATFORM_BLUEPRINT.md /assess page nav | S27 Mar14: COMPETITOR_VISABRIDGE.md | S28 Mar14: Alfalah AI rebrand galaxy ticker | S29 Mar14: lang removed extractJSON 6-step 4-model fallback chain CLAUDE.md compressed | S30 Mar15: GEMINI_KEY2+GROK_KEY multi-provider · chatbot removed · 3-phase splash country+industry picker · CERTIFICATIONS_2026.md · COUNTRY_PACKAGES_195.md · country-aware RAG · visa in/out-country guidance · icon-192+512 generated PWA store-ready · top recruiter 3-step methodology baked into recruiterPov+resumeRewrite+coverLetter · folder cleanup root clean · session records in v2/SESSION_RECORDS/

---
*CLAUDE.md = GEMINI.md always · Update every session · Build must pass before push*
