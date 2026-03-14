# CLAUDE.md + GEMINI.md — SINGLE MASTER BLUEPRINT
### Auto-loaded every session. One file = full project truth. Keep both files identical.
### RULE: Every 10 minutes during active work → paste latest update into this file.
**Last Updated: March 13, 2026**

---

## AUTO-SAVE PROTOCOL (Read This First Every Session)

**For Claude/Gemini:** Every ~10 minutes of active conversation, append a dated update block:
```
### UPDATE [DATE TIME]
- What was discussed/built/decided
- Any errors + fixes
- Files changed
- Next action
```
This prevents all work being lost if session hits token limit.

**For Shahzad:** When starting any new session say:
> "Read CLAUDE.md and resume where we left off"
> OR for Gemini: "Read GEMINI.md and resume where we left off"

---

## OWNER

| | |
|-|-|
| Name | Shahzad Muhammad |
| Location | Mississauga, Ontario, Canada |
| OS | Windows 11 Pro + VS Code |
| Style | Vibe coding — Claude/Gemini does all technical work |
| UI | Bold vibrant gradients always |
| Mission | Free AI tools for underserved populations globally |
| Status | Career professional → founder transition |

---

## PROJECT — JOB COACH AI

| | |
|-|-|
| Live App | https://shahzad-job-coach-ai.vercel.app |
| GitHub | https://github.com/shahzad-ai-lab/shahzad-job-coach-ai |
| Vercel | https://vercel.com/shahzadms-projects/shahzad-job-coach-ai |
| Stack | Next.js 14 + Google Gemini AI + Vercel + Tailwind CSS |
| Built | 48 hours — March 6–8, 2026 |
| Hackathon 1 | AI Hackathon — $6,000 prize — SUBMITTED March 8 ✓ |
| Status | Post-hackathon — V2 in planning — Next hackathon coming |
| Features | 12 AI career cards, file upload, rate limiting, user info bar |
| Philosophy | Free, no login, zero data storage |

### 12 AI Cards (Gemini JSON keys):
resumeScore · coverLetter · resumeRewrite · skillsGap · interviewPrep · introScripts · starStories · linkedinSummary · matchingJobs · thankYouEmail · salaryNegotiation · actionPlan

---

## EVERY FILE AND FOLDER — A TO Z

### ROOT FILES

| File | Type | What It Does | Status |
|------|------|-------------|--------|
| `.env.local` | ENV | Gemini API key for local dev. NEVER commit. Key = `GEMINI_API_KEY=AIzaSy...` | Safe in .gitignore |
| `.gitignore` | Git | Ignores: .env.local, node_modules/, .next/, *.log | Safe in .gitignore |
| `CLAUDE.md` | MD | Master blueprint for Claude sessions — auto-loaded | Updated every session |
| `GEMINI.md` | MD | THIS FILE — master blueprint for Gemini sessions — identical to CLAUDE.md | Updated every session |
| `SESSION_LOG.md` | MD | Full session history log Sessions 1–6 | Up to date |
| `STORY.md` | MD | Full project development narrative | Up to date (Sessions 1-8) |
| `EXECUTIVE_SUMMARY.md` | MD | Hackathon judge-facing doc, ~389 lines | Complete |
| `PROGRESS.md` | MD | Build tracker — status board, build log | Up to date (12 cards, V1 done) |
| `MASTER_CAREER_REFERENCE.md` | MD | 48-section global career database, 640KB, 10,200 lines, v4.0 | COMPLETE |
| `shahzad-job-coach-ai-master-guide.md` | MD | Original 24-section hackathon prep guide | Historical reference |
| `package.json` | JSON | Dependencies: next 14.2.5, react 18, @google/generative-ai, pdf-parse, mammoth, tailwindcss | Active |
| `package-lock.json` | JSON | Auto-generated npm lock — NEVER edit manually | Auto |
| `next.config.js` | JS | serverComponentsExternalPackages: ['pdf-parse','mammoth'] — critical for Vercel | Active |
| `tailwind.config.js` | JS | Scans ./app/**/*.{js,ts,jsx,tsx,mdx} for classes | Active |
| `postcss.config.js` | JS | Plugins: tailwindcss + autoprefixer | Active |
| `credentials.txt` | TXT | ⚠️ SENSITIVE: GitHub URL, API key (AIzaSy...), Vercel URL, password — NEVER commit | Add to .gitignore NOW |
| `deploy.ps1` | PS1 | git add route.js → commit → push (API-only deploy) | Working |
| `push.ps1` | PS1 | git add route.js + page.js → commit → push (full deploy) | Working |
| `build.ps1` | PS1 | npm run build (test build locally) | Working |
| `git-push.ps1` | PS1 | Initial repo setup: git init → first commit → git remote add → push. Run ONCE only — already done | Historical |
| `vercel-deploy.ps1` | PS1 | Direct Vercel CLI deploy (npm install -g vercel → vercel --prod). Emergency use | Working |
| `test-api.ps1` | PS1 | POSTs test resume+job to live API → prints response. Run after every deploy to verify | Working |
| `AI_Hackathon_all-projects.xlsx` | XLSX | All competitor projects submitted to March 2026 hackathon | Reference |
| `screencapture-...2026-03-07...png` | PNG | Screenshot of live app March 7, 2026 (before 12-card redesign) | Reference |
| `Maximize Your Job Search...mp4` | MP4 | Demo/promo video for hackathon and social media | Submitted |

### APP CODE FILES (`app/`)

| File | Lines | What It Does |
|------|-------|-------------|
| `app/globals.css` | 3 | @tailwind base/components/utilities — that's it |
| `app/layout.js` | 14 | Root layout. Title="Job Coach AI". Body=bg-gray-950 text-white |
| `app/page.js` | 549 | ENTIRE frontend. Rate limiting (localStorage jcai_rl), 12 CARDS array, Home() component, ipapi.co + wttr.in for user info bar, rotating quotes, usage dots, file upload, analyze button, results render |
| `app/api/analyze/route.js` | 228 | CORE AI ENGINE. Gemini call + rate limiting + security. Models: gemini-flash-latest → gemini-flash-lite-latest (fallback). sanitize() strips HTML+injection. extractJSON() strips markdown fences. Rate refund on AI failure. Returns 12 keys + _meta{remaining,windowReset} |
| `app/api/upload/route.js` | 65 | File parser. Accepts PDF (pdf-parse) + DOCX (mammoth) + TXT. Max 10MB / 12,000 chars. Returns {text, charCount} |
| `app/api/test/route.js` | 50 | Diagnostic. GET /api/test → tests 5 Gemini models → returns which one works. Use when API broken. Models tested: gemini-2.0-flash-lite, gemini-2.0-flash, gemini-2.0-flash-001, gemini-flash-latest, gemini-2.5-flash |

### AUTO-GENERATED & BACKUP FOLDERS (never edit, never commit)

| Folder | What It Is |
|--------|-----------|
| `.next/` | Next.js build output. Generated by `npm run build`. Contains BUILD_ID, route manifests, compiled server code, static chunks |
| `node_modules/` | All npm packages (~300MB). Generated by `npm install`. Key packages: next, react, @google/generative-ai, pdf-parse, mammoth, tailwindcss |
| `.git/` | Git version history. Branch=main. Remote=github.com/shahzad-ai-lab/shahzad-job-coach-ai |
| `_v1_archive/` | Exact copy of the V1 `app/` directory as it was submitted for the hackathon. Kept for safe reference. |

### CLAUDE MEMORY SYSTEM (outside project folder)

Location: `C:\Users\ShahzadMuhammad\.claude\projects\c--Project-Code-Claude-shahzad-job-coach-ai\`

| File | What It Is |
|------|-----------|
| `memory/MEMORY.md` | Index of memory files — auto-loaded by Claude |
| `memory/user_profile.md` | Shahzad profile: vibe coder, Windows 11, vibrant UI preference |
| `memory/project_jobcoach.md` | Project facts: URL, GitHub, hackathon details |
| `*.jsonl` (6 files) | Full conversation transcripts — every session ever run |

---

## GEMINI API TECHNICAL REFERENCE

| Setting | Value |
|---------|-------|
| Primary model | `gemini-flash-latest` |
| Fallback model | `gemini-flash-lite-latest` |
| API version | `v1beta` |
| maxOutputTokens | 8192 |
| Temperature | 0.7 |
| Vercel timeout | 60 seconds (maxDuration export) |
| Key env var | `GEMINI_API_KEY` |
| Rate limit | 5/hour per IP — progressive backoff 1h/3h/6h |
| Input limits | Resume: 6,000 chars / Job: 3,000 chars / Body: 50KB |

### Gemini Prompt (what gets sent):
Single prompt asking for ONLY raw JSON with 12 keys. Includes full resume + job posting. Each key has detailed format instructions (e.g., resumeScore format: ATS SCORE: XX/100, keywords found/missing, subscores). Returns one JSON object — no markdown.

### Security Layers:
1. Client-side rate limit (localStorage) — 5/hr, backoff 1h/3h/6h
2. Server-side rate limit (in-memory Map by IP) — same limits
3. Input sanitization — strips HTML, null bytes, 7 prompt injection patterns
4. Security headers on every response — X-Frame-Options DENY, X-XSS-Protection, CSP, no-store
5. Body size guard — 50KB max
6. Input truncation — resume 6K, job 3K chars

### All Errors Fixed (history):
| Error | Fix |
|-------|-----|
| 404 model not found | Changed to gemini-flash-latest |
| SDK version conflict | Pinned @google/generative-ai |
| 9s Vercel timeout | Added export const maxDuration = 60 |
| 12 parallel calls = quota exhaustion | Single combined prompt |
| sleep(15000) causing timeout | Removed sleep |
| JSON truncation | Raised maxOutputTokens 4096 → 8192 |
| Edit string not found (Claude tool) | Read exact lines first, match precisely |
| 640KB file too large to read | Use offset+limit in Read tool |

---

## SESSION HISTORY — ALL SESSIONS

| Session | Date | Built |
|---------|------|-------|
| 1 | Mar 6–7 | Base app, 6 cards, Vercel deploy |
| 2 | Mar 7–8 | 12 cards, UI redesign, file upload |
| 3 | Mar 8 | Security: rate limiting, sanitization, headers, STORY.md |
| 4 | Mar 7–8 | User info bar, rotating quotes, usage dots, welcome banner |
| 5 | Mar 11 | MASTER_CAREER_REFERENCE §22–29 (v1→v2, 21→29 sections) |
| 6 | Mar 11–12 | MASTER_CAREER_REFERENCE §30–48 COMPLETE (v2→v4, 48 sections) |
| 7 | Mar 13 | CLAUDE.md + GEMINI.md master blueprints. Hackathon Q&A answers. V2 planning started |

---

## HACKATHON Q&A ANSWERS (500 chars each — copy-paste ready)

**Q: $1M AI solution?**
I'd build a free AI Career Coach for the 1.4 billion people locked out of opportunity — no resume writer, no LinkedIn, no connections. One tool that speaks their language, knows their country's job market, visa paths, and skills gaps, and tells them exactly what to do next. Not another tool for Silicon Valley. For the refugee, the single mother, the factory worker whose job just vanished. Talent is universal. Opportunity is not. I'd fix that.

**Q: Certification, timeline, cost?**
I'm pursuing Microsoft AI-900 (Azure AI Fundamentals) and SC-900 (Security, Compliance & Identity). Timeline: 3 months for both. Support needed: exam vouchers ($165 each) and Microsoft Learn course access (free). Without scholarship: $330 total for both exams. Free study paths at learn.microsoft.com. Both validate core AI and cybersecurity literacy — my foundation. Next: AZ-500 and SC-200 for cloud security.

**Q: Where live + icons?**
Mississauga, Ontario, Canada — one of the world's most diverse cities, minutes from Toronto's tech hub. My icons: Elon Musk for betting everything on impossible ideas, Jensen Huang for making AI the new electricity, and Bruce Schneier for proving cybersecurity is a human problem, not just technical. They think in decades, not quarters. That mindset — build what matters, protect what's real — drives everything I do.

**Q: Founder or professional? Economic access? 12-month goals?**
Both — career professional transitioning into founder. Economic access means removing the zip-code lottery: your birthplace shouldn't determine your earning power. In 12 months I want to launch my AI career coaching platform commercially, earn Microsoft AI-900 and SC-900, land my first paying clients, and connect with founders who build for the underserved. Mississauga to global — that's the plan.

**Q: How found community? Top 3 challenges in 90 days?**
Found you through LinkedIn while researching AI communities in Toronto. My top 3 challenges to solve in 90 days: one — fund my Microsoft AI-900 and SC-900 exam vouchers; two — get my AI career coaching platform in front of real users and generate first revenue; three — break into Canada's tech network from Mississauga without the "who you know" barrier. Community is the shortcut I've been missing.

---

## CERTIFICATIONS ROADMAP

| Cert | Cost | Timeline | Link |
|------|------|---------|------|
| AI-900 Azure AI Fundamentals | $165 | 3 months | learn.microsoft.com |
| SC-900 Security & Compliance | $165 | 3 months | learn.microsoft.com |
| AZ-500 Azure Security Engineer | $165 | Month 4–6 | learn.microsoft.com |
| SC-200 Security Operations Analyst | $165 | Month 7–9 | learn.microsoft.com |

Total without scholarship: $330 (AI-900 + SC-900)

---

## V2 PLANNING (Next Hackathon)

**Status:** Hackathon 1 complete — now planning V2 release + entering next hackathon
**V2 Ideas (to be defined):**
- [ ] Define V2 features
- [ ] Identify next hackathon date/prize/requirements
- [ ] Build plan for V2

---

## COMMANDS CHEAT SHEET

| Task | Command |
|------|---------|
| Run locally | `npm run dev` → localhost:3000 |
| Build | `npm run build` |
| Deploy | `git push origin main` (auto-deploys to Vercel) |
| Full push | Run `push.ps1` |
| Emergency deploy | Run `vercel-deploy.ps1` |
| Test live API | Run `test-api.ps1` |
| Check Gemini models | https://shahzad-job-coach-ai.vercel.app/api/test |
| Install packages | `npm install` |

---

## WORKING RULES — PERMANENT

1. Update CLAUDE.md + GEMINI.md every ~10 min during active work
2. Write ALL work to .md files — never leave in chat only
3. One master file per topic — no fragmentation
4. Read offset+limit for MASTER_CAREER_REFERENCE.md (640KB — too large to read whole)
5. credentials.txt — NEVER commit to GitHub — add to .gitignore
6. Both CLAUDE.md and GEMINI.md = identical content always
7. When tokens low: save immediately + write "SAFE TO END SESSION"

---

## PENDING TASKS

- [ ] Git commit + push all changes
- [ ] Define V2 features for next hackathon
- [ ] Implement V2 super-fast, responsive architecture
- [ ] Book AI-900 exam ($165)
- [ ] Book SC-900 exam ($165)

---

## CONVERSATION LOG (Append updates here every ~10 minutes)

### SESSION 7 — March 13, 2026
**Discussed:** Hackathon community Q&A answers (5 questions, 500 chars each). Built CLAUDE.md + GEMINI.md as master blueprints. User wants both files as identical replicas covering every file/folder A to Z.
**Files changed:** CLAUDE.md (created/rewritten), GEMINI.md (created/rewritten), SESSION_LOG.md (updated)
**Key decisions:** CLAUDE.md auto-loads every Claude session. GEMINI.md auto-loads every Gemini session. Both = same content. V2 + next hackathon coming.
**Next:** Git commit + push. Define V2. Add credentials.txt to .gitignore.

---

### SESSION 8 — March 13, 2026
**Discussed:** Verified token limits (Google Gemini, 8192 output tokens). Synchronized `.md` files. Prepared V2 migration with focus on ultra-fast performance, vibrant UI, and facilitating humanity globally.
**Files changed:** CLAUDE.md, GEMINI.md, PROGRESS.md, STORY.md, task.md.
**Key decisions:** Centralized logs. Confirmed `credentials.txt` is secure in `.gitignore`. Moving immediately to Git push, then presenting V2 plan (super fast loading, highly attractive, humanity-focused scope).
**Next:** Auto-deploy via Vercel (push to GitHub), architect V2 features.

---

### SESSION 9 — March 13, 2026
**Discussed:** V2 Kickoff execution. Approved architecture for Gemini API Streaming, Web Grounding (Google Search), and local `MASTER_CAREER_REFERENCE.md` injection to avoid database storage. Kept Next.js instead of Python for speed/edge reasons.
**Files changed:** `_v1_archive/` (created), `CLAUDE.md`, `GEMINI.md`, `task.md`, `implementation_plan.md`, `app/api/analyze/route.js`, `app/page.js`.
**Key decisions:**
- Backed up entire V1 `app` directory to `_v1_archive/` so we never lose the hackathon state.
- Utilized `fs.readFileSync` for Master Reference file parsing into the Gemini context.
- Migrated `/api/analyze` to use Gemini `streamGenerateContent` with `alt=sse` decoded securely.
- Redesigned `app/page.js` to render a real-time markdown stream with a glowing CSS typing cursor and full glassmorphism depth.
**Next:** Pushed to production via Git to trigger Vercel deployment. Wait for user feedback on the V2 Streaming performance.

---
*Last Updated: March 13, 2026 | Both CLAUDE.md and GEMINI.md must stay identical*
