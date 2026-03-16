# CLAUDE.md = GEMINI.md — MASTER BLUEPRINT (ULTRA COMPRESSED)
**Updated: March 15, 2026 — Session 30 FINAL | Rule: start session → "Read CLAUDE.md resume where left off"**

---

## OWNER + PROJECT
| | |
|-|-|
| Owner | Shahzad Muhammad · Mississauga ON Canada · Windows 11 · Vibe coder |
| Mission | Free AI tools for underserved humans globally — 8 billion people |
| Brand | **Alfalah AI** (الفلاح) — "Come to Success" — Arabic/Urdu/Islamic tradition |
| Domain | alfalah.app (owned — connect to Vercel when next hackathon launches) |
| Live | https://shahzad-job-coach-ai.vercel.app |
| GitHub | https://github.com/shahzad-ai-lab/shahzad-job-coach-ai |
| Stack | Next.js 14 + Gemini AI + Grok AI + Serper.dev + Vercel + Tailwind |
| H1 | $6,000 hackathon — SUBMITTED Mar 8, 2026 ✓ |
| Status | V2 DEMO LOCKED — 17 cards + PWA + 5-phase splash + 195 countries + RAG 9 files — LIVE |
| V3 | Build from scratch when next hackathon announced — React Native + Expo mobile-first |
| Rules | Free · No login · Zero storage · Bold vibrant galaxy gradients always |

---

## API KEYS (never commit to git — .env.local + Vercel env vars only)
| Var | Service |
|-----|---------|
| `GEMINI_API_KEY` | Google AI Studio — primary |
| `GEMINI_API_KEY_2` | Google AI Studio — backup key |
| `GROK_API_KEY` | xAI Grok-4-latest — final fallback |
| `SERPER_API_KEY` | Serper.dev Google Jobs — NOT YET ADDED to Vercel |

---

## FOLDER STRUCTURE (root is clean — everything in v1/ or v2/)
```
root/   CLAUDE.md · GEMINI.md · .env.local · package.json · next.config.js · tailwind.config.js · postcss.config.js
app/    page.js(~2100L) · layout.js · globals.css
        api/analyze/route.js(~700L) · api/chat/route.js · api/jobs/route.js
        api/upload/route.js · api/test/route.js
public/ manifest.json · icon-192.png ✅ · icon-512.png ✅
v1/     legacy docs · scripts · archive · media · credentials · test files
v2/     MASTER_CAREER_REFERENCE.md (640KB — read with offset+limit only)
        COMPANIES_BY_COUNTRY.md (500+ companies · 30+ countries · career URLs)
        ALL_COUNTRIES.md (195 UN countries · ISO codes · regions · tiers)
        OCCUPATIONS_ISCO08.md (436 ISCO-08 groups · BLS fastest-growing · 2026 roles)
        PLATFORM_BLUEPRINT.md (scoring algorithm · age pathways · competitor table)
        COMPETITOR_VISABRIDGE.md (VisaBridge intel · pricing · 238 countries)
        CERTIFICATIONS_2026.md (all-industry certs A-Z · Cloud/Security/Finance/Trades/AI)
        COUNTRY_PACKAGES_195.md (all 195 UN countries · GDP · visa · salary · laws · boards)
        GLOBAL_CAREER_INTELLIGENCE_2025.md (salary · ATS systems · job boards · trends)
        SESSION_RECORDS/  SESSION_LOG_S30.md · V2_DEMO_COMPLETE.md · V3_MOBILE_PLAN.md
        tools/            generate-icons.js (pure Node.js, no deps — regenerates PWA icons)
```

---

## AI FALLBACK CHAIN (both analyze + chat routes)
```
Gemini KEY1 → gemini-2.0-flash → gemini-flash-latest → gemini-2.0-flash-lite → gemini-1.5-flash
Gemini KEY2 → same 4 models
Grok       → grok-4-latest (api.x.ai — OpenAI-compatible endpoint)
```
tokens: 8192 | temp: 0.7 | timeout: 55s per call | rate limits: 9999 (disabled for dev)

---

## 5-PHASE SPLASH SCREEN (IP auto-detect flow)
| Phase | Trigger | What user sees |
|-------|---------|---------------|
| `loading` | mount | Progress bar 1.8s · IP lookup runs in background via ipResultRef |
| `detecting` | bar completes, IP not yet ready | 📡 spinner + "Skip → Pick manually" button |
| `detected` | IP resolves | Big flag + country name + "Yes correct" / "Change country" |
| `country` | user clicks Change, or IP fails/timeout | Full 195-country searchable grid |
| `industry` | country selected | 15 industry tiles → dismisses splash |

**Key fix (S30):** `ipResultRef` caches IP result at arrival. Separate `useEffect` watches `splashPhase==='detecting'` and starts fresh 3s fallback timer from that moment (not from mount). Prevents infinite hang.

---

## COUNTRY + INDUSTRY SELECTION
- `COUNTRY_LIST_195` — all 195 UN countries, ISO-2 code, flag generated via `countryFlag()`
- `INDUSTRY_PICKER` — 15 industries (IT/Healthcare/Finance/Engineering/Education/Trades/Marketing/Legal/HR/Logistics/Creative/Hospitality/Government/Science/Other)
- Both stored in state: `selectedCountry` · `selectedIndustry`
- Sent to API: `userCountry` + `userCountryCode` + `userIndustry` + `userIndustryLabel`

---

## RAG SYSTEM (9 files — all local, Gemini only writes narrative)
| File | Size | Injected for |
|------|------|-------------|
| MASTER_CAREER_REFERENCE.md | 640KB | Career knowledge base (visa/future/tech/health/finance triggers) |
| COUNTRY_PACKAGES_195.md | 63KB | User's selected country full data package |
| CERTIFICATIONS_2026.md | 19KB | Industry-specific certs for user's selected industry |
| COMPANIES_BY_COUNTRY.md | 29KB | Top companies + career URLs for job's country |
| OCCUPATIONS_ISCO08.md | 55KB | ISCO-08 role profile + fastest-growing + emerging roles |
| ALL_COUNTRIES.md | 13KB | (reference) |
| PLATFORM_BLUEPRINT.md | 12KB | (reference) |
| COMPETITOR_VISABRIDGE.md | 7KB | (reference) |
| GLOBAL_CAREER_INTELLIGENCE_2025.md | 44KB | (reference) |

---

## COUNTRY-AWARE AI GUIDANCE
**Job IN user's country** → local hiring requirements, ATS norms, licensing, background checks, permits
**Job OUTSIDE user's country** → ALL pathways: skilled worker visa, employer-sponsored, working holiday, intra-company transfer, temp worker, digital nomad, NON-immigration, treaty visas — with official govt URLs
**Salary card** → local currency + country-specific ranges
**Country Laws card** → user's selected country labor law, notice periods, GRC
**Skills Gap** → certifications recognized + valued in user's country

---

## 17 AI CARDS + EXTRAS (all free, no login, zero data stored)
| # | key | What it does |
|---|-----|-------------|
| 1 | resumeScore | ATS score + knockouts + composite weights + achievement density + anatomy check + recency decay |
| 2 | recruiterPov | **6-second skim test** (200 apps on desk) — exactly what noticed vs buried + red flags + quick wins |
| 3 | coverLetter | **Top 1%** — specific hook + 3 quantified wins + researched why-them + confident ask + explanation |
| 4 | resumeRewrite | **3-step rebuild**: skim diagnosis → measurable wins extracted → top 3 in first half + ATS keyword audit |
| 5 | skillsGap | Hard+soft matched/missing + industry certs with URLs + upskilling roadmap |
| 6 | interviewPrep | 5 Q&A + questions to ask interviewer |
| 7 | starStories | 3 STAR behavioral stories with metrics |
| 8 | linkedinSummary | LinkedIn About section optimized |
| 9 | introScripts | 1/2/3-min intro scripts |
| 10 | matchingJobs | Titles + companies + boards + 7-country recruiters + freelance platforms |
| 11 | visaPathways | In-country vs outside — ALL visa routes + official govt URLs |
| 12 | thankYouEmail | Post-interview thank you email |
| 13 | salaryNegotiation | Salary table by level (Entry→Exec) + scripts (local currency) |
| 14 | actionPlan | 30-60-90 day onboarding plan |
| 15 | coldOutreach | LinkedIn DM + cold email + follow-up |
| 16 | careerPivot | Pivot score + 3 adjacent roles + 90-day plan |
| 17 | countryLaws | Labor laws + resume compliance + tax/payroll + worker rights + GRC |
| + | liveJobs | Serper Google Jobs — auto-fetched after analysis, inside matchingJobs |

---

## TOP RECRUITER 3-STEP METHODOLOGY (in every prompt)
**STEP 1** — 6-second skim: What is NOTICED vs MISSED in top third of page 1?
**STEP 2** — Measurable wins: Every bullet needs a NUMBER (%, $, time saved, team size, revenue)
**STEP 3** — Reorder: Top 3 strongest results MUST be in first half of page 1. Reorganize ruthlessly.
**BONUS** — ATS keywords: Insert job description keywords naturally AFTER human optimization
**RESULT** — Top 1%: Specific wins > generic duties · Numbers > adjectives · Results > responsibilities

---

## RED COLOR NEGATIVE HIGHLIGHTING (RenderText component)
Patterns detected: `MISSING · FAIL · REJECT · RED FLAG · GAP · WEAK · BURIED · NOT FOUND · ABSENT · LACKING`
- Headings matching patterns → red heading color
- Bullets under negative headings → `✗` red marker + red text + red background tint
- ALL CAPS labels with negative pattern → red highlight
- Positive sections (FOUND · MATCHED · PASS · STRENGTH · WORKS WELL) → stay normal colors
- Implementation: `negativeSection` flag tracked with closure in `lines.map()`

---

## 2026 RESUME INTELLIGENCE (injected into every analysis)
- ATS 2026 scans EXPERIENCE PATTERNS not just keywords — align with C-suite priorities
- 6.2-second scan: Cognitive Hierarchy Trick — anchor points guide recruiter eye
- Interactive PDFs: portfolio/GitHub hyperlinks +35% response rate — flag if missing
- Impact-first bullets: STAR method mandatory — flag all duty bullets, rewrite with metrics
- Personal Branding: "My Values" / "Day in My Life" trending for startup/creative roles
- Market trend 2026: "Career Co-pilots" — AI + human expertise replacing single-doc services

---

## COUNTRY HERO BANNER
`getMarketPulse(country, code)` — 12 full markets (CA/US/GB/AU/IN/PK/AE/DE/SG/NZ/NG/ZA) + global fallback
Fields: `stats · laws · gdp · pop · it · industries · future`

---

## MOBILE APP STATUS
- PWA fully store-ready: manifest.json ✅ · icon-192.png ✅ · icon-512.png ✅ · HTTPS ✅
- **FREE now**: pwabuilder.com → APK → Amazon Appstore (free) + Samsung Galaxy Store (free)
- **$25**: Google Play Console (one-time) · **$99/yr**: Apple App Store
- **iOS free**: Safari → "Add to Home Screen" = native app experience
- **V3**: React Native + Expo — build from scratch when next hackathon announced

---

## WHAT'S DONE ✅ (S1–S30 complete)
- 17 AI cards · PWA store-ready · 5-phase smart splash (IP detect → confirm → 195 countries → industry)
- Multi-provider AI chain: Gemini KEY1 + KEY2 + Grok-4-latest
- All rate limits disabled for dev (re-enable before production)
- Country-aware AI: in-country vs outside-country visa guidance
- Industry-aware cert injection via CERTIFICATIONS_2026.md RAG
- 195-country data package via COUNTRY_PACKAGES_195.md RAG
- Top recruiter 3-step methodology baked into recruiterPov + resumeRewrite + coverLetter
- RED color all negatives/missing in results (RenderText)
- /assess page: 5-step quiz · 7 ISCO categories · 0-100 score · 70+ career recs
- Country Hero Banner · Scrolling galaxy ticker · Rainbow top bar
- Sticky nav (Resume Analyzer ↔ Skills Assessment)
- Folder clean: root only configs · v2/ all data + records · v1/ legacy
- CLAUDE.md + GEMINI.md always synced

**MULTILINGUAL:** System COMMENTED OUT — LANGUAGES array + T translations + tx() preserved for V3

---

## TODO (remaining)
- [ ] Add `SERPER_API_KEY` to Vercel env vars (live jobs currently empty)
- [ ] Re-enable rate limits before production launch (set back to 5/hr or 15/hr)
- [ ] Pay $25 → Google Play Console when ready to publish Android
- [ ] alfalah.app domain → CNAME to Vercel when next hackathon launches
- [ ] Book AI-900 ($165) + SC-900 ($165) at learn.microsoft.com (Shahzad personal goal)

---

## SECURITY (all active)
client RL: localStorage `jcai_rl` · server RL: Map by IP · sanitize HTML+injection
headers: DENY/CSP/nosniff/XSS · 50KB body guard · input truncation (6K resume, 3K job)

---

## KNOWN FIXES (permanent — never repeat)
| Error | Fix |
|-------|-----|
| 404 model | Use `gemini-flash-latest` not `gemini-pro` |
| Vercel timeout | `export const maxDuration = 60` |
| JSON truncation | maxOutputTokens 8192 |
| SSE streaming | NEVER — single JSON response only |
| `tools:[{googleSearch}]` | NEVER add — silently kills all Gemini calls |
| Edit not found | Read exact lines with offset+limit first |
| 640KB file | Read with offset+limit only |
| Stop words in ATS | STOP_WORDS 200+ words, minLen >3 |
| langInstruction undefined | Declare `let langInstruction = ''` OUTSIDE try block |
| Git push blocked | Never put API keys in .md files — use placeholders |
| Splash stuck on detecting | `detectTimeout` fired at mount before 'detecting' phase. Fix: `ipResultRef` + separate useEffect watching splashPhase==='detecting' starts fresh 3s timer |

---

## COMMANDS
```
npm run dev          → localhost:3000
npm run build        → production build check
git add . && git commit -m "msg" && git push origin main  → auto-deploys to Vercel
```
Test: https://shahzad-job-coach-ai.vercel.app/api/test

---

## SESSION LOG (compressed — all 30 sessions)
S1-4 Mar6-8: V1 12cards deploy security H1 submitted |
S5-6 Mar11-12: MASTER_REF v4 640KB 48sections |
S7-14 Mar13: V2 RAG streaming(failed→reverted) 14cards wizard(removed) |
S15-17 Mar13-14: stopwords ATScolors skillsGap certs freelance strictScoring |
S18 Mar14: v1/v2 folders liveJobs Serper |
S19 Mar14: ATS algo complete |
S20 Mar14: chatbot 16cards PWA multilang |
S21 Mar14: liveJobs merged matchingJobs 7-country recruiters fix-langInstruction |
S22 Mar14: MarketPulse bar YourMarket banner post-results liveJobs quickStart chips |
S23 Mar14: CountryHero banner GDP+IT+industries+100yr getMarketPulse 12markets 2026ResumeIntelligence manifest store-ready |
S24 Mar14: COMPANIES_BY_COUNTRY.md 500+ companies 30+ countries |
S25 Mar14: ALL_COUNTRIES.md OCCUPATIONS_ISCO08.md ISCO-08 436 groups |
S26 Mar14: PLATFORM_BLUEPRINT.md /assess page 5-step quiz 7-categories 0-100 score nav |
S27 Mar14: COMPETITOR_VISABRIDGE.md full intel |
S28 Mar14: Alfalah AI rebrand galaxy ticker translations system |
S29 Mar14: lang removed(preserved) extractJSON 6-step 4-model fallback chain CLAUDE.md compressed |
S30 Mar15: GEMINI_KEY2+GROK multi-provider · chatbot removed · 5-phase splash IP-detect · COUNTRY_LIST_195 · CERTIFICATIONS_2026.md · COUNTRY_PACKAGES_195.md · GLOBAL_CAREER_INTELLIGENCE_2025.md · country+industry RAG · visa in/out-country guidance · top recruiter 3-step methodology · recruiterPov+resumeRewrite+coverLetter top 1% · RED negative highlighting · icon-192+512 PWA store-ready · folder cleanup root clean · session records v2/SESSION_RECORDS/ · fix splash hang (ipResultRef + phase-scoped timeout) · CLAUDE.md+GEMINI.md fully updated

---
*CLAUDE.md = GEMINI.md always · Update every session · Build must pass before push*
