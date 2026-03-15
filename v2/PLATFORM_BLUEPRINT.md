# JOB COACH AI 2026 — FULL PLATFORM BLUEPRINT
# "From Zero to Career Hero" — The World's Most Honest, Inclusive Career Intelligence Platform
# Serves: Age 10–100 · All 195 Countries · All ISCO levels 0–9 · Labor to C-Suite
# Updated: March 14, 2026

---

## VISION
Build what no one has built: a career intelligence platform that is simultaneously:
- HONEST (no false hope, market-calibrated scoring)
- INCLUSIVE (10-year-old student to 100-year-old retiree)
- GLOBAL (195 countries, 436+ occupation types, 30+ languages)
- ACTIONABLE (immediate next steps, not just scores)
- FREE (zero data stored, no login, no paywall)

---

## PLATFORM PAGES (Multi-Route Next.js App)

| Route | Title | Purpose |
|-------|-------|---------|
| `/` | Job Coach AI | Resume analyzer + 17 AI tools (existing) |
| `/assess` | Skills Assessment | 5-step quiz → 0-100 score → career map |
| `/careers` | Career Explorer | Browse 436 ISCO occupations A-Z |
| `/learn` | Learning Paths | Certification + course recommendations |
| `/countries` | Country Guide | Job market data for 195 countries |

---

## SKILLS ASSESSMENT ALGORITHM — REALITY-CALIBRATED SCORING

### Why Most Assessments Are WRONG (and How We Fix It)

**Problem with SkilledScore and similar tools:**
1. They reward CREDENTIALS over CAPABILITY
2. They don't account for MARKET SUPPLY vs DEMAND per country
3. They don't apply RECENCY DECAY (10-yr-old skills count less)
4. They ignore AGE BIAS that exists in real hiring
5. They don't distinguish PAPER SKILLS from DEMONSTRATED skills
6. They don't capture HIDDEN TRANSFERABLE SKILLS

**Our Fixes:**
1. Separate "Credential Score" from "Market Reality Score"
2. Country-calibrated scoring (score of 70 means different things in Lagos vs London)
3. Recency multiplier: skills used <2yr ago = 100%, 3-5yr = 75%, 6-10yr = 50%, 10+yr = 30%
4. Age-appropriate pathways (teen vs mid-career vs senior transition)
5. Practical experience weighted 2x over theoretical knowledge
6. Transferable skills detector questionnaire

---

## SCORING WEIGHTS (Total = 100 Points)

| Category | Max Points | Key Variables |
|----------|-----------|---------------|
| Education & Training | 15 | Level × Relevance × Recency |
| Work Experience | 20 | Years × Level × Relevance × Recency |
| Hard/Technical Skills | 25 | Count × Demand × Proficiency × Recency |
| Soft Skills & Leadership | 15 | Level × Evidence × Leadership scope |
| Languages | 10 | Count × Proficiency × Market value |
| Certifications | 10 | Count × Recognition × Relevance × Recency |
| Digital Literacy | 5 | Level × Relevance to target field |

---

## DETAILED SCORING RULES

### Education Score (0–15)
| Level | Raw Score | Recency Modifier |
|-------|-----------|-----------------|
| No formal education | 0 | N/A |
| Some primary school | 1 | N/A |
| Primary complete | 2 | N/A |
| Secondary (high school) | 5 | -0 |
| Vocational / Trade Certificate | 8 | -1 if 10+ yrs |
| Diploma / Associate | 10 | -1 if 10+ yrs |
| Bachelor's Degree | 12 | -1 if 15+ yrs + no upskilling |
| Master's / MBA | 14 | Stable |
| PhD / MD / JD / Professional | 15 | Stable |

**Relevance multiplier**: Field matches target role → ×1.0; Adjacent → ×0.8; Unrelated → ×0.6

### Experience Score (0–20)
| Years | Base Score | Relevance Modifier |
|-------|-----------|-------------------|
| 0 (student) | 0 | +2 if volunteer/project work |
| <1 year / Internship | 4 | +1 if in-field |
| 1–2 years | 7 | |
| 3–5 years | 11 | +1 if direct field match |
| 6–10 years | 15 | +2 if senior/lead level |
| 11–20 years | 17 | Recency decay: -2 if all in one narrow role |
| 20+ years | 19 | +1 if still active, -2 if >5yr gap |

**Employment gap penalty**: Gap >2yr = -2; Gap >5yr = -4 (with explanation pathway)

### Hard Skills Score (0–25)
- Base: 2.5 pts per validated skill (up to 10 skills)
- **High-demand bonus** (+1 per skill): AI/ML, Cloud (AWS/Azure/GCP), Cybersecurity, Data Science, Blockchain, EV Tech, Renewable Energy, Skilled Trades
- **Trade skills bonus** (+1): Electrician, Plumber, Welder, HVAC — global shortage premium
- **Specificity bonus** (+0.5): Named certifiable tool (e.g., "TensorFlow" > "AI")
- **Recency modifier**: Not used in 3–5yr = ×0.75; 6–10yr = ×0.50; 10+yr = ×0.30

### Soft Skills Score (0–15)
| Skill | Points | Evidence |
|-------|--------|---------|
| Leadership (managed 5+ people) | 5 | Self-reported + role confirmation |
| Leadership (managed projects) | 3 | |
| Strong Communication | 3 | Language level + presentation experience |
| Problem-solving / Critical Thinking | 4 | Examples required |
| Teamwork / Collaboration | 3 | |

### Language Score (0–10)
| Scenario | Score |
|----------|-------|
| 1 language (native) | 3 |
| 2 languages (1 native + 1 intermediate) | 6 |
| 2 languages (1 native + 1 fluent) | 7 |
| 3+ languages | 10 |
| English proficiency (for non-native targeting English markets) | +1 bonus |

### Certification Score (0–10)
| Count | Score | Recognition Bonus |
|-------|-------|------------------|
| None | 0 | |
| 1 cert | 4 | +1 if globally recognized (AWS, CISA, PMP, CFA, etc.) |
| 2–3 certs | 7 | |
| 4+ certs | 10 | |

### Digital Literacy Score (0–5)
| Level | Score |
|-------|-------|
| No digital skills | 0 |
| Basic (email, WhatsApp, social media) | 1 |
| Intermediate (MS Office, Google Suite, video calls) | 2 |
| Advanced (specialized software, analytics, design tools) | 3 |
| Technical (coding, databases, server admin) | 4 |
| Expert (AI tools, cloud platforms, multi-language programming) | 5 |

---

## MARKET REALITY ADJUSTMENT (Applied After Raw Score)

### Country Market Calibration
The raw score is adjusted based on supply/demand in the user's country:
- **Undersupplied skills in user's country**: +5 (e.g., nursing in Canada, trades in Germany)
- **Oversupplied profile in user's country**: -5 (e.g., entry-level IT in India)
- **In-demand field globally + remote-capable**: +3
- **Language mismatch for target market**: -5

### Career Change Penalty / Opportunity Score
- Completely unrelated field change: -5 (honest about difficulty)
- Adjacent pivot: 0 (normal)
- Career change WITH 2+ transferable skill clusters: +3
- Career change WITH new certification: +5 (proactive upskilling)

### Final Adjusted Score = Raw Score ± Adjustments (capped 5–98)
Note: We never show 0-4 or 99-100 — those are vanity scores, not reality.

---

## SCORE INTERPRETATION

| Score | Label | Market Reality |
|-------|-------|---------------|
| 85–98 | 🏆 Expert / Elite | Immediately hireable at senior level. Top 10% of global applicants. |
| 70–84 | ⭐ Highly Competitive | Strong candidate. Minor gaps only. Apply confidently. |
| 55–69 | ✅ Competitive | Good foundation. Targeted upskilling closes gaps in 3–6 months. |
| 40–54 | 📈 Developing | Entry-mid level ready. 1–2 focused certifications + experience needed. |
| 25–39 | 🌱 Building | Entry path available. 6–12 months structured learning recommended. |
| 10–24 | 🚀 Starting | Foundation stage. Free resources exist. Every expert started here. |
| 5–9 | 💡 Zero to Hero | Pre-career. Explore, volunteer, and start building — this is Day 1. |

---

## CAREER RECOMMENDATION ENGINE

### Matching Algorithm
Given: finalScore + interestField + ageGroup + country + experienceLevel
Output: 5 ranked career recommendations

**Step 1**: Filter ISCO Major Groups by score range
- Score 5–20: Groups 6, 7, 8, 9 (trades, elementary, agriculture)
- Score 21–40: Groups 3, 4, 5 + entry Group 2 (technicians, clerical, service)
- Score 41–60: Groups 2, 3 (professionals entry/mid, technicians senior)
- Score 61–75: Groups 1, 2 (managers junior, professionals mid/senior)
- Score 76–98: Groups 1, 2 (senior managers, expert professionals)

**Step 2**: Apply field interest filter (tech/health/business/trades/creative/legal/education/science/service/agri)

**Step 3**: Apply age-appropriate path
- Under 18: Internship → apprenticeship → certification pathway
- 18–24: Entry level → fast-track growth pathway
- 25–44: Target role → 90-day action plan
- 45–54: Lateral move or upskilling → senior pathway
- 55+: Consulting / part-time / knowledge transfer / phased retirement pathway

**Step 4**: Country-specific companies from COMPANIES_BY_COUNTRY.md

**Step 5**: Calculate match score (0–100) for each recommendation
- Perfect field + score + country match = 95+
- Good match with minor gaps = 75–94
- Pivot match with transferable skills = 55–74

---

## AGE-SPECIFIC CAREER PATHS

### Under 18 (Explorer)
- Focus: Interest discovery, not job finding
- Tools: "What do you like?" → ISCO exploration → Internship/volunteer matching
- Key message: "Every great career started with curiosity. Explore first."
- Output: 3 exploration paths + 3 free learning resources

### 18–24 (Launcher)
- Focus: First job or degree/trade choice
- Key insight: Trade apprenticeship can outearns bachelor's degree by age 28
- Output: 5 entry roles + apprenticeship vs. university comparison

### 25–34 (Builder)
- Focus: Climbing or pivoting
- Key insight: This is the highest ROI decade for upskilling
- Output: Target role + 90-day plan + salary negotiation intel

### 35–44 (Optimizer)
- Focus: Senior roles, management, or entrepreneur path
- Key insight: Experience premium kicks in; leadership matters more than certs now
- Output: Leadership pathway + consultant track option

### 45–54 (Reinventor)
- Focus: Career change, senior individual contributor, or management
- Key insight: Age bias is real — strategy needed, not just skills
- Output: Honest bias assessment + pivot strategy + network-first approach

### 55–64 (Senior Expert)
- Focus: Expert consulting, board roles, knowledge transfer, phased retirement
- Key insight: The "Experience Economy" values wisdom + judgment over speed
- Output: Consulting track + part-time options + legacy/mentoring path

### 65+ (Wisdom Path)
- Focus: Purpose-driven work, mentoring, entrepreneurship, volunteering
- Output: Flexible work options + legacy impact roles

---

## HIDDEN TRANSFERABLE SKILLS DETECTOR
Questions that surface skills people don't know they have:

1. "Have you ever taught or explained something to someone?" → Teaching/Training
2. "Have you managed a budget (family, club, project)?" → Financial Management
3. "Have you organized an event or coordinated people?" → Project Management
4. "Do people come to you to solve problems?" → Consulting/Advisory
5. "Have you sold anything (formal or informal)?" → Sales
6. "Have you cared for children, elderly, or patients?" → Healthcare/Social Work
7. "Have you built, repaired, or made something with your hands?" → Trades
8. "Have you written reports, proposals, or social content?" → Communications
9. "Have you negotiated prices or contracts?" → Negotiation/Procurement
10. "Do you use any software daily (any software)?" → Digital literacy baseline

---

## WHAT COMPETITORS DO WRONG (and Our Difference)

| Tool | Problem | Our Solution |
|------|---------|-------------|
| SkilledScore | Credential-focused, ignores market reality | Market-calibrated score |
| LinkedIn Skills | Self-reported, no validation | Cross-referenced with ISCO + job postings |
| Indeed Assessments | USA-centric | 195-country aware |
| Coursera Skills | Learning platform bias (sells courses) | Neutral, honest gap analysis |
| Reed/CV-Library | UK/Europe only | Global from zero |
| Most ATS systems | Eliminate humans, not match them | Humanizing, not gatekeeping |

**Our Unique Value:**
1. Honest 0-100 market-calibrated score (not vanity)
2. Age-appropriate paths (10 to 100)
3. Zero-baseline path (truly starting from nothing)
4. Country-specific company + salary data
5. ISCO-08 internationally recognized standard
6. Free, private, no data stored

---

## FUTURE FEATURES (V3+)

| Feature | Description | Complexity |
|---------|-------------|-----------|
| AI Mock Interview | Voice-based practice with Gemini | High |
| Skill Verification | Mini-tests to validate claims | Medium |
| Progress Tracking | Score over time with milestones | Medium |
| Team/HR Dashboard | Bulk assess teams | High |
| School Edition | Curriculum-aligned for 10-18 | Medium |
| API for Partners | Embed in job boards | Medium |
| Multilingual Assessment | 28 languages (ESCO standard) | Medium |

---
*Platform Blueprint v1.0 | Job Coach AI 2026 | Updated Session 25*
