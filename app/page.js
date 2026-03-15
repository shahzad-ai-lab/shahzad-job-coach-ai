'use client'

import { useState, useRef, useEffect, useMemo } from 'react'

// ── Constants ──────────────────────────────────────────────────────────────────
const MAX_PASTE_CHARS = 12000

// ── Top 10 World Languages ────────────────────────────────────────────────────
const LANGUAGES = [
  { code: 'en', label: 'English',    flag: '🇬🇧' },
  { code: 'zh', label: 'Chinese',    flag: '🇨🇳' },
  { code: 'hi', label: 'Hindi',      flag: '🇮🇳' },
  { code: 'es', label: 'Spanish',    flag: '🇪🇸' },
  { code: 'fr', label: 'French',     flag: '🇫🇷' },
  { code: 'ar', label: 'Arabic',     flag: '🇸🇦' },
  { code: 'bn', label: 'Bengali',    flag: '🇧🇩' },
  { code: 'pt', label: 'Portuguese', flag: '🇧🇷' },
  { code: 'ru', label: 'Russian',    flag: '🇷🇺' },
  { code: 'ur', label: 'Urdu',       flag: '🇵🇰' },
]
const CLIENT_HOURLY_LIMIT = 5
const HOUR_MS = 3_600_000
const BACKOFF_HOURS = [1, 3, 6]

// ── Stop words — comprehensive (removes ALL English filler, narrative, HR jargon) ──
const STOP_WORDS = new Set([
  // Articles, conjunctions, prepositions
  'the','and','or','a','an','is','are','was','were','be','been','have','has',
  'do','does','will','would','could','should','can','not','no','in','on','at',
  'by','for','with','as','from','to','of','i','you','we','they','my','your',
  'our','their','this','that','it','get','use','make','who','what','when',
  'where','how','why','which','all','any','each','more','some','such','than',
  'then','so','if','but','also','about','up','out','its','into','over','after',
  'just','may','other','new','one','two','had','him','her','his','she','he',
  'them','those','these','being','am','every','much','most','only','own',
  'same','too','very','both','few','now','here','there','again','further',
  'once','during','before','while','through','between','against','without',
  'within','along','following','across','behind','beyond','plus','except',
  'down','off','above','below','near','per','via','re','vs','etc','eg','ie',
  // Common HR/job-description narrative words
  'work','working','experience','years','year','team','using','role','ability',
  'strong','excellent','good','great','well','able','skills','skill','knowledge',
  'understanding','familiarity','including','related','required','preferred',
  'responsibilities','qualifications','looking','seeking','join','company',
  'position','job','opportunity','apply','reviewed','profile','thought','might',
  'interested','exciting','synthesis','serve','guardian','created','seen','huge',
  'based','startup','mission','driven','canadian','thought','profile','seen',
  'start','adoption','maturity','workflow', // keep radiology/medical as technical
  'passionate','passion','culture','values','growth','candidate','qualified',
  'demonstrated','established','developed','designed','implemented','maintained',
  'managed','led','drive','drives','driving','build','builds','building','built',
  'deliver','delivers','delivering','delivered','define','defined','defining',
  'ensure','ensures','ensuring','ensured','support','supports','supporting',
  'collaborate','communicate','identify','analyze','evaluate','implement',
  'responsible','ownership','accountable','impact','results','outcomes','goals',
  'objectives','requirements','expectations','fast','paced','environment',
  'professional','development','training','mentoring','mentorship','coaching',
  'learning','continuous','improvement','innovation','innovative','creative',
  'critical','thinking','problem','solving','solution','solutions','approach',
  'methodology','process','processes','procedure','policy','standard','best',
  'practice','practices','quality','performance','metrics','measure','reporting',
  'report','data','analysis','insight','decision','strategic','tactical',
  'execution','planning','plan','roadmap','timeline','deadline','priority',
  'resource','resources','budget','cost','value','benefit','benefits','risk',
  'challenge','issues','resolution','resolve','escalate','stakeholder','customer',
  'customers','client','clients','partner','partners','vendor','vendors',
  'internal','external','cross','functional','global','local','regional',
  'national','international','enterprise','organization','department','division',
  'group','individual','people','person','someone','anyone','everyone','nobody',
  'might','could','should','would','shall','need','needs','must','want','wants',
  'find','found','found','seen','see','look','looks','looked','feel','feels',
  'felt','think','thinks','thought','know','knows','knew','come','comes','came',
  'take','takes','took','give','gives','gave','show','shows','showed','tell',
  'tells','told','ask','asks','asked','seem','seems','seemed','leave','left',
  'let','lets','set','sets','put','puts','run','runs','ran','hold','held',
  'move','moves','moved','live','lives','lived','bring','brings','brought',
  'start','starts','started','turn','turns','turned','keep','keeps','kept',
  'write','writes','wrote','read','reads','sit','sits','sat','stand','stood',
  'hear','heard','try','tries','tried','call','calls','called','play','plays',
  'open','opens','opened','close','closes','closed','change','changes','changed',
  'type','types','typed','send','sends','sent','receive','received','create',
  'creates','update','updates','updated','delete','deletes','deleted','view',
  'views','viewed','access','accesses','accessed','check','checks','checked',
  'review','reviews','test','tests','tested','validate','validates','validated',
])

// Extract meaningful technical/professional keywords only (min 4 chars)
function extractKeywords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-+#/.]/g, ' ')
    .split(/\s+/)
    .map(w => w.replace(/^[-./]+|[-./]+$/g, ''))
    .filter(w => w.length > 3 && !STOP_WORDS.has(w) && !/^\d+$/.test(w))
}

// ── Rate limiting helpers ─────────────────────────────────────────────────────
function getRLS() {
  try {
    const s = JSON.parse(localStorage.getItem('jcai_rl') || 'null')
    const now = Date.now()
    if (!s) return { count: 0, windowReset: now + HOUR_MS, violations: 0, blockUntil: 0 }
    if (now > s.windowReset) return { count: 0, windowReset: now + HOUR_MS, violations: s.violations || 0, blockUntil: s.blockUntil || 0 }
    return s
  } catch { return { count: 0, windowReset: Date.now() + HOUR_MS, violations: 0, blockUntil: 0 } }
}

function saveRLS(s) { try { localStorage.setItem('jcai_rl', JSON.stringify(s)) } catch {} }

function checkRL() {
  const s = getRLS(); const now = Date.now()
  if (s.blockUntil > now) {
    const m = Math.ceil((s.blockUntil - now) / 60000), h = m >= 60 ? Math.ceil(m / 60) : null
    return { ok: false, msg: `Rate limited. Try in ${h ? h + 'h' : m + 'min'}.` }
  }
  if (s.count >= CLIENT_HOURLY_LIMIT) {
    const bh = BACKOFF_HOURS[Math.min(s.violations, BACKOFF_HOURS.length - 1)]
    s.violations++; s.blockUntil = now + bh * HOUR_MS; saveRLS(s)
    return { ok: false, msg: `${CLIENT_HOURLY_LIMIT}/hr limit reached. Try in ${bh}h.` }
  }
  s.count++; saveRLS(s)
  return { ok: true, remaining: CLIENT_HOURLY_LIMIT - s.count }
}

// ── Language detection ────────────────────────────────────────────────────────
const LANG_LABELS = {
  es: 'Español', ar: 'العربية', fr: 'Français', hi: 'हिन्दी',
  pt: 'Português', de: 'Deutsch', zh: '中文', ur: 'اردو',
  bn: 'বাংলা', sw: 'Kiswahili', ru: 'Русский', ja: '日本語',
}
function detectLang() {
  if (typeof navigator === 'undefined') return 'en'
  return (navigator.language || 'en').split('-')[0].toLowerCase()
}

// ── OS detection ──────────────────────────────────────────────────────────────
function detectOS() {
  if (typeof navigator === 'undefined') return 'Unknown'
  const ua = navigator.userAgent
  if (/Windows NT/.test(ua)) return 'Windows'
  if (/Macintosh|Mac OS X/.test(ua)) return 'macOS'
  if (/iPhone|iPad/.test(ua)) return 'iOS'
  if (/Android/.test(ua)) return 'Android'
  if (/Linux/.test(ua)) return 'Linux'
  return 'Unknown'
}

// ── Flag emoji from ISO 2-letter country code ────────────────────────────────
function countryFlag(code) {
  if (!code || code.length !== 2) return '🌍'
  return code.toUpperCase().split('').map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join('')
}

// ── Country job market pulse (instant, no API) — 12 markets + global fallback ──
function getMarketPulse(country = '', code = '') {
  const c = country.toLowerCase(), cc = code.toUpperCase()
  if (cc === 'CA' || c.includes('canada'))
    return { stats: 'Tech hiring +12% · Express Entry draws active · Toronto #1 hub · 68% remote', laws: 'ESA notice · CPP/EI deductions · T4 slips · NOC codes · Human Rights Code', gdp: '$2.1T USD (2026)', pop: '40M', it: '~900K IT professionals', industries: 'Tech · Finance · Clean Energy · Pharma · Mining · AI Research', future: '2030: AI+clean energy hub · 2050: Top-5 innovation economy · 2126: Post-AGI prosperity leader' }
  if (cc === 'US' || c.includes('united states'))
    return { stats: 'AI/ML roles +34% · H-1B April · NYC·SF·Austin top · Layoffs stabilizing', laws: 'At-will employment · W-2 vs 1099 · I-9 work auth · EEO · Non-compete varies', gdp: '$28.5T USD (2026)', pop: '340M', it: '~5M IT professionals', industries: 'Tech · Defense · Finance · Healthcare · AI · Space', future: '2030: AI+quantum superpower · 2050: Automation economy · 2126: Post-scarcity civilization' }
  if (cc === 'GB' || c.includes('united kingdom'))
    return { stats: 'Skilled Worker Visa · London fintech booming · NHS hiring · IR35 rules', laws: 'IR35 contractor · P60/P45 · 28 days leave · GDPR on CVs · Equality Act 2010', gdp: '$3.1T USD (2026)', pop: '68M', it: '~1.7M IT professionals', industries: 'Finance · Pharma · Defence · Creative · FinTech · AI Safety', future: '2030: AI safety research capital · FinTech leader · 2126: Global trading hub' }
  if (cc === 'AU' || c.includes('australia'))
    return { stats: '482 TSS Visa · Mining+tech hybrid · Melbourne overtaking Sydney', laws: 'Fair Work Act · 4wks leave · Superannuation 11% · TFN · Modern awards', gdp: '$1.8T USD (2026)', pop: '27M', it: '~750K IT professionals', industries: 'Mining · Finance · Agriculture · Tech · Tourism · Defence', future: '2030: APAC AI hub · Critical minerals leader · 2126: Green hydrogen economy' }
  if (cc === 'IN' || c.includes('india'))
    return { stats: 'GCC explosion · Bangalore+Hyderabad #1 · FAANG India · Moonlighting varies', laws: 'PF/ESI · Form 16 · 1-3mo notice standard · IT Act · NDA standard', gdp: '$4.1T USD (2026)', pop: '1.44B', it: '~5.5M IT professionals', industries: 'IT/BPO · Pharma · Space · Defence · Textiles · Agriculture', future: '2030: 3rd largest economy · Space tech leader · 2126: 2nd largest GDP globally' }
  if (cc === 'PK' || c.includes('pakistan'))
    return { stats: 'Remote exports growing · Upwork+Fiverr #1 · $5B IT target · Karachi+Lahore', laws: 'EOBI · PESSI/SESSI · NTN freelancers · FBR remittance tax · Labour Act', gdp: '$350B USD (2026)', pop: '240M', it: '~600K IT professionals', industries: 'IT Export · Textiles · Agriculture · CPEC · Pharma', future: '2030: $5B IT exports · CPEC hub · 2126: Major South Asian digital economy' }
  if (cc === 'AE' || c.includes('united arab') || c.includes('emirates'))
    return { stats: 'Golden Visa · Dubai tech booming · Tax-free · DIFC fintech hub', laws: 'Labour Law Decree 33 · MOHRE · Gratuity after 1yr · No income tax · WPS', gdp: '$510B USD (2026)', pop: '10M', it: '~450K IT professionals', industries: 'Oil & Gas · Finance · Tourism · Logistics · AI · Real Estate', future: '2030: AI economy top-10 · Metaverse hub · 2126: Post-oil knowledge economy leader' }
  if (cc === 'DE' || c.includes('germany'))
    return { stats: 'Skilled Immigration Act 2024 · EU Blue Card · Berlin startups growing', laws: 'Works councils · 24 days min leave · Kurzarbeit · GDPR strict · Social security 40%', gdp: '$4.5T USD (2026)', pop: '84M', it: '~1.2M IT professionals', industries: 'Auto · Engineering · Pharma · Finance · Chemicals · AI', future: '2030: Green industrial leader · Hydrogen economy · 2126: Engineering civilization anchor' }
  if (cc === 'SG' || c.includes('singapore'))
    return { stats: 'Employment Pass · SkillsFuture credits · MAS fintech · APAC HQ magnet', laws: 'Employment Act · CPF 17% employer · PDPA · Fair Consideration Framework', gdp: '$560B USD (2026)', pop: '6M', it: '~250K IT professionals', industries: 'Finance · Biotech · Logistics · Tech · Tourism · Education', future: '2030: AI governance capital · Smart City 2.0 · 2126: City-state model for world' }
  if (cc === 'NZ' || c.includes('new zealand'))
    return { stats: 'Accredited Employer Work Visa · Wellington+Auckland tech · Work-life balance', laws: 'Employment Relations Act · 4wks leave · KiwiSaver 3% · 90-day trial', gdp: '$250B USD (2026)', pop: '5.2M', it: '~120K IT professionals', industries: 'Agriculture · Tourism · Tech · Film · Education · Healthcare', future: '2030: Agri-tech leader · 100% clean energy · 2126: Model sustainable economy' }
  if (cc === 'NG' || c.includes('nigeria'))
    return { stats: 'Lagos tech booming · Andela+Flutterwave · Diaspora remote surging', laws: 'Labour Act · PENCOM pension · NSITF · PITA · NIN required', gdp: '$450B USD (2026)', pop: '220M', it: '~500K IT professionals', industries: 'Oil & Gas · Fintech · Agriculture · Telecom · Crypto · Entertainment', future: '2030: Africa tech capital · AfCFTA leader · 2126: 400M+ people — largest African economy' }
  if (cc === 'ZA' || c.includes('south africa'))
    return { stats: 'FinTech Cape Town · BPO strong · Load-shedding drives remote demand', laws: 'BCEA 45hr week · UIF · POPIA privacy · B-BBEE · NQF qualifications', gdp: '$400B USD (2026)', pop: '62M', it: '~300K IT professionals', industries: 'Mining · Finance · Tourism · BPO · Agriculture · FinTech', future: '2030: Africa financial hub · Renewables leader · 2126: Gateway to African growth economy' }
  return { stats: 'Remote work rising globally · AI+digital skills #1 · English opens all doors', laws: 'Know local notice period rights · Understand tax obligations · Verify work authorization', gdp: 'Global economy $110T+', pop: '8.1B', it: '60M+ IT professionals worldwide', industries: 'Tech · Finance · Healthcare · Education · Energy · AI', future: '2030: AI transforms 40% of jobs · 2050: Human-AI collaboration economy · 2126: Post-AGI civilization' }
}

// ── All individual card keys (used for API request) ───────────────────────────
const ALL_CARD_KEYS = ['resumeScore','recruiterPov','coverLetter','resumeRewrite','skillsGap','interviewPrep','introScripts','starStories','linkedinSummary','matchingJobs','visaPathways','thankYouEmail','salaryNegotiation','actionPlan','coldOutreach','careerPivot','countryLaws']

// ── 5 grouped super-cards ─────────────────────────────────────────────────────
const GROUPS = [
  {
    id: 'resume',
    title: 'Resume Power',
    icon: '📊',
    g: 'linear-gradient(135deg,#00C6FF,#0072FF)',
    desc: '4 tools — score, rewrite, profile',
    tabs: [
      { key: 'resumeScore',     label: 'ATS Score',      icon: '📊' },
      { key: 'recruiterPov',    label: 'Recruiter POV',  icon: '🚩' },
      { key: 'resumeRewrite',   label: 'Resume Rewrite', icon: '📄' },
      { key: 'linkedinSummary', label: 'LinkedIn',       icon: '💼' },
    ],
  },
  {
    id: 'jobhunt',
    title: 'Job Hunt',
    icon: '🔍',
    g: 'linear-gradient(135deg,#38EF7D,#00AEEF)',
    desc: '3 tools + live jobs + recruiters',
    tabs: [
      { key: 'matchingJobs',  label: 'Live Jobs & Match', icon: '🏢' },
      { key: 'careerPivot',   label: 'Career Pivot',      icon: '🔄' },
      { key: 'coldOutreach',  label: 'Cold Outreach',     icon: '📨' },
    ],
  },
  {
    id: 'interview',
    title: 'Interview Ready',
    icon: '🎤',
    g: 'linear-gradient(135deg,#FC466B,#3F5EFB)',
    desc: '3 tools — prep, stories, scripts',
    tabs: [
      { key: 'interviewPrep', label: 'Interview Prep', icon: '🎤' },
      { key: 'starStories',   label: 'STAR Stories',   icon: '⭐' },
      { key: 'introScripts',  label: 'Intro Scripts',  icon: '🗣️' },
    ],
  },
  {
    id: 'strategy',
    title: 'Career Strategy',
    icon: '🚀',
    g: 'linear-gradient(135deg,#FF6B35,#FACF39)',
    desc: '3 tools — skills, salary, plan',
    tabs: [
      { key: 'skillsGap',         label: 'Skills Gap',    icon: '🎯' },
      { key: 'salaryNegotiation', label: 'Salary',        icon: '💰' },
      { key: 'actionPlan',        label: '30-60-90 Plan', icon: '🗓️' },
    ],
  },
  {
    id: 'documents',
    title: 'Documents',
    icon: '✉️',
    g: 'linear-gradient(135deg,#DA22FF,#9733EE)',
    desc: '3 tools — letters, visa paths',
    tabs: [
      { key: 'coverLetter',   label: 'Cover Letter', icon: '✉️' },
      { key: 'thankYouEmail', label: 'Thank You',    icon: '💌' },
    ],
  },
  {
    id: 'legal',
    title: 'Legal & Global',
    icon: '⚖️',
    g: 'linear-gradient(135deg,#11998E,#38EF7D)',
    desc: '3 tools — laws, visas, compliance',
    tabs: [
      { key: 'countryLaws',  label: 'Labor Laws & GRC', icon: '⚖️' },
      { key: 'visaPathways', label: 'Global Visas',      icon: '🌍' },
      { key: 'salaryNegotiation', label: 'Salary Levels', icon: '💰' },
    ],
  },
]

// ── RenderText: converts markdown-like text to React elements ─────────────────
function RenderText({ text }) {
  if (!text) return null

  function parseInlineBold(str) {
    if (!str.includes('**')) return str
    const parts = str.split('**')
    return parts.map((p, i) =>
      i % 2 === 1
        ? <strong key={i} style={{ color: '#fff', fontWeight: 800 }}>{p}</strong>
        : p
    )
  }

  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={i} style={{ height: 10 }} />

        // # Heading 1
        if (/^#\s+/.test(trimmed)) {
          const content = trimmed.replace(/^#+\s*/, '')
          return (
            <div key={i} style={{ fontSize: 17, fontWeight: 800, color: '#00AEEF', borderBottom: '1px solid rgba(0,174,239,0.3)', paddingBottom: 6, marginTop: 18, marginBottom: 8 }}>
              {parseInlineBold(content)}
            </div>
          )
        }

        // ## Heading 2
        if (/^##\s+/.test(trimmed)) {
          const content = trimmed.replace(/^#+\s*/, '')
          return (
            <div key={i} style={{ fontSize: 15, fontWeight: 700, color: '#FACF39', marginTop: 14, marginBottom: 6 }}>
              {parseInlineBold(content)}
            </div>
          )
        }

        // Bullet: • - * at start
        if (/^[•\-\*]\s+/.test(trimmed)) {
          const content = trimmed.replace(/^[•\-\*]\s+/, '')
          return (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5, alignItems: 'flex-start', paddingLeft: 8 }}>
              <span style={{ color: '#FF0099', fontWeight: 900, flexShrink: 0, marginTop: 1 }}>•</span>
              <span style={{ color: 'rgba(255,255,255,0.88)', lineHeight: 1.6 }}>{parseInlineBold(content)}</span>
            </div>
          )
        }

        // Numbered list
        if (/^\d+\.\s+/.test(trimmed)) {
          const num = trimmed.match(/^(\d+)\./)[1]
          const content = trimmed.replace(/^\d+\.\s+/, '')
          return (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 5, alignItems: 'flex-start', paddingLeft: 8 }}>
              <span style={{ color: '#FACF39', fontWeight: 800, flexShrink: 0, minWidth: 20, marginTop: 1 }}>{num}.</span>
              <span style={{ color: 'rgba(255,255,255,0.88)', lineHeight: 1.6 }}>{parseInlineBold(content)}</span>
            </div>
          )
        }

        // ALL CAPS LABEL: pattern
        if (/^[A-Z][A-Z\s]{2,}:\s*/.test(trimmed)) {
          const colonIdx = trimmed.indexOf(':')
          const label = trimmed.slice(0, colonIdx)
          const rest = trimmed.slice(colonIdx + 1).trim()
          return (
            <div key={i} style={{ marginBottom: 6, lineHeight: 1.7 }}>
              <span style={{ color: '#FACF39', fontWeight: 800, letterSpacing: 0.5 }}>{label}: </span>
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>{parseInlineBold(rest)}</span>
            </div>
          )
        }

        // Plain line
        return (
          <div key={i} style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 3 }}>
            {parseInlineBold(trimmed)}
          </div>
        )
      })}
    </>
  )
}

// ── Shimmer overlay for loading cards ─────────────────────────────────────────
function ShimmerOverlay() {
  return (
    <div style={{
      position: 'absolute', inset: 0, borderRadius: 16, overflow: 'hidden',
      background: 'rgba(255,255,255,0.04)',
    }}>
      <div className="shimmer-bar" style={{
        position: 'absolute', top: 0, left: '-60%', width: '60%', height: '100%',
        background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)',
        animation: 'shimmer 1.4s ease-in-out infinite',
      }} />
    </div>
  )
}

// ── Circular progress ring ─────────────────────────────────────────────────────
function CircleRing({ score }) {
  const r = 42, circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color = score >= 70 ? '#38EF7D' : score >= 45 ? '#FACF39' : '#FF416C'
  return (
    <svg width={100} height={100} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={8} />
      <circle
        cx={50} cy={50} r={r} fill="none"
        stroke={color} strokeWidth={8}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <text x={50} y={50} textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize={20} fontWeight="900" fontFamily="inherit">
        {score}
      </text>
      <text x={50} y={68} textAnchor="middle" dominantBaseline="central"
        fill="rgba(255,255,255,0.5)" fontSize={9} fontFamily="inherit">
        / 100
      </text>
    </svg>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Home() {
  const [splash, setSplash]           = useState(true)
  const [splashPct, setSplashPct]     = useState(0)
  const [resumeText, setResumeText]   = useState('')
  const [jobText, setJobText]         = useState('')
  const [results, setResults]         = useState(null)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [errorDismissed, setErrorDismissed] = useState(false)
  const [uploading, setUploading]     = useState(false)
  const [fileName, setFileName]       = useState('')
  const [dragOver, setDragOver]       = useState(false)
  const [jobUploading, setJobUploading] = useState(false)
  const [jobFileName, setJobFileName] = useState('')
  const [jobDragOver, setJobDragOver] = useState(false)
  const [activeGroup, setActiveGroup] = useState(null)
  const [activeTab, setActiveTab]     = useState(null)
  const [copied, setCopied]           = useState('')
  const [userInfo, setUserInfo]       = useState(null)
  const [weather, setWeather]         = useState('')
  const [remaining, setRemaining]     = useState(CLIENT_HOURLY_LIMIT)
  const [userLang, setUserLang]       = useState('en')
  // ── Chatbot state ───────────────────────────────────────────────────────────
  const [chatOpen, setChatOpen]       = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "السلام عليكم! I'm Alfalah AI 🌟\nAsk me anything about resumes, job search, interviews, salary, skills, visas, or how to use this platform. Free, always — for all humanity." }
  ])
  const [chatInput, setChatInput]     = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef(null)

  // ── Auto Live Jobs (merged into Matching Jobs card) ──────────────────────────
  const [autoJobs, setAutoJobs]       = useState(null)
  const [autoJobsLoading, setAutoJobsLoading] = useState(false)
  // ── Live Jobs state (standalone search) ─────────────────────────────────────
  const [liveJobs, setLiveJobs]       = useState(null)
  const [jobsLoading, setJobsLoading] = useState(false)
  const [jobsError, setJobsError]     = useState('')
  const [searchTitle, setSearchTitle] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [timeframe, setTimeframe]     = useState('w2')

  const fileRef    = useRef(null)
  const jobFileRef = useRef(null)
  const resultsRef = useRef(null)

  // ── Splash screen: auto-dismiss after 1.8s with progress bar ───────────────
  useEffect(() => {
    let frame
    const start = Date.now()
    const duration = 1800
    function tick() {
      const elapsed = Date.now() - start
      const pct = Math.min(100, Math.round((elapsed / duration) * 100))
      setSplashPct(pct)
      if (elapsed < duration) { frame = requestAnimationFrame(tick) }
      else { setSplash(false) }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  // ── Fetch location + weather ────────────────────────────────────────────────
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => {
        setUserInfo({ city: d.city || '—', region: d.region || '—', country: d.country_name || '—', countryCode: d.country_code || '', lat: d.latitude ? d.latitude.toFixed(4) : null, lng: d.longitude ? d.longitude.toFixed(4) : null, os: detectOS(), timezone: d.timezone || '', currency: d.currency || '' })
        if (d.city && d.country_name) setSearchLocation(`${d.city}, ${d.country_name}`)
        const loc = encodeURIComponent((d.city || '') + ',' + (d.country_code || ''))
        return fetch(`https://wttr.in/${loc}?format=%c+%C+%t&m`)
      })
      .then(r => r.text())
      .then(w => setWeather(w.trim()))
      .catch(() => {})
    const s = getRLS()
    setRemaining(Math.max(0, CLIENT_HOURLY_LIMIT - s.count))
    const lang = detectLang()
    setUserLang(lang)
  }, [])

  // ── Instant ATS Score (client-side, zero API) ───────────────────────────────
  const atsScore = useMemo(() => {
    if (!resumeText.trim() || !jobText.trim()) return null
    const resumeKws = new Set(extractKeywords(resumeText))
    const jobKws    = extractKeywords(jobText)
    const uniqueJobKws = [...new Set(jobKws)]
    if (uniqueJobKws.length === 0) return null
    const matched  = uniqueJobKws.filter(w => resumeKws.has(w))
    const missing  = uniqueJobKws.filter(w => !resumeKws.has(w)).slice(0, 20)
    const score    = Math.min(100, Math.round((matched.length / uniqueJobKws.length) * 100))
    const label    = score >= 70 ? 'Strong Match' : score >= 45 ? 'Partial Match' : 'Weak Match'
    return { score, label, matched: matched.slice(0, 20), missing }
  }, [resumeText, jobText])

  // ── File handlers ───────────────────────────────────────────────────────────
  async function processFile(file, forJob = false) {
    if (!file) return
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    if (!['.pdf', '.docx', '.txt'].includes(ext)) { setError('Only PDF, DOCX, or TXT supported.'); return }
    if (file.size > 10 * 1024 * 1024) { setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 10MB.`); return }
    forJob ? setJobUploading(true) : setUploading(true)
    setError(''); setErrorDismissed(false)
    forJob ? setJobFileName(file.name) : setFileName(file.name)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      forJob ? setJobText(data.text) : setResumeText(data.text)
    } catch (err) {
      setError(err.message)
      forJob ? setJobFileName('') : setFileName('')
    } finally {
      forJob ? setJobUploading(false) : setUploading(false)
    }
  }

  // ── Analyze ─────────────────────────────────────────────────────────────────
  async function handleAnalyze() {
    if (!resumeText.trim()) { setError('Please add your resume text or upload a file.'); setErrorDismissed(false); return }
    if (!jobText.trim())    { setError('Please paste the job description.'); setErrorDismissed(false); return }
    const rl = checkRL()
    if (!rl.ok) { setError(rl.msg); setErrorDismissed(false); return }
    setError(''); setErrorDismissed(false); setLoading(true); setResults({}); setActiveGroup(null); setActiveTab(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobPosting: jobText, requestedKeys: ALL_CARD_KEYS, lang: userLang, userCountry: userInfo?.country || '' }),
      })
      if (!res.ok) {
        let msg = 'Analysis failed'
        try { const d = await res.json(); msg = d.message || d.error || msg } catch {}
        throw new Error(msg)
      }
      const data = await res.json()
      setResults(data)
      const s = getRLS(); setRemaining(Math.max(0, CLIENT_HOURLY_LIMIT - s.count))
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
      // Auto-fetch live jobs using first meaningful line of job posting
      const titleLine = jobText.split('\n').map(l => l.trim()).find(l => l.length > 3 && l.length < 80) || ''
      const loc = searchLocation || (userInfo ? `${userInfo.city}, ${userInfo.country}` : '')
      autoFetchJobs(titleLine, loc)
    } catch (err) { setError(err.message); setErrorDismissed(false) }
    finally { setLoading(false) }
  }

  // ── Auto-fetch live jobs after analysis (merged into Matching Jobs card) ─────
  async function autoFetchJobs(jobTitle, location) {
    if (!jobTitle) return
    setAutoJobsLoading(true); setAutoJobs(null)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, location, timeframe: 'w' }),
      })
      const data = await res.json()
      if (res.ok) setAutoJobs(data.jobs || [])
      else setAutoJobs([])
    } catch { setAutoJobs([]) }
    finally { setAutoJobsLoading(false) }
  }

  // ── Share / Download ────────────────────────────────────────────────────────
  // ── Chatbot ─────────────────────────────────────────────────────────────────
  async function sendChat(e) {
    e?.preventDefault()
    const text = chatInput.trim()
    if (!text || chatLoading) return
    const userMsg = { role: 'user', content: text }
    const updated = [...chatMessages, userMsg]
    setChatMessages(updated)
    setChatInput('')
    setChatLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      })
      const data = await res.json()
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply || data.error || 'Sorry, try again.' }])
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again.' }])
    } finally {
      setChatLoading(false)
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  // ── Live Jobs: search Google Jobs via Serper ────────────────────────────────
  async function fetchLiveJobs() {
    if (!searchTitle.trim()) { setJobsError('Enter a job title to search.'); return }
    setJobsLoading(true); setJobsError(''); setLiveJobs(null)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle: searchTitle.trim(), location: searchLocation.trim(), timeframe }),
      })
      const data = await res.json()
      if (!res.ok) { setJobsError(data.error || 'Search failed.'); return }
      setLiveJobs(data.jobs || [])
    } catch (e) {
      setJobsError('Network error — check connection.')
    } finally {
      setJobsLoading(false)
    }
  }

  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: 'Alfalah AI — Come to Success', url }) } catch {}
    } else {
      navigator.clipboard.writeText(url)
        .then(() => { setError(''); setCopied('__share__'); setTimeout(() => setCopied(''), 2000) })
        .catch(() => {})
    }
  }

  function downloadReport() {
    if (!results) return
    let content = 'JOB COACH AI 2026 — COMPREHENSIVE CAREER REPORT\n'
    content += '=================================================\n\n'
    GROUPS.forEach(group => {
      group.tabs.forEach(tab => {
        if (results[tab.key]) {
          content += `\n--- ${group.title.toUpperCase()} · ${tab.label.toUpperCase()} ---\n`
          content += results[tab.key] + '\n'
        }
      })
    })
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'Job_Coach_AI_Report.txt'; a.click()
    URL.revokeObjectURL(url)
  }

  function copyToClipboard(text, key) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  // ── Shared styles ───────────────────────────────────────────────────────────
  const glass = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(12px)',
    borderRadius: 20,
    padding: 24,
    border: '1px solid rgba(255,255,255,0.1)',
  }
  const textarea = {
    width: '100%', background: 'rgba(255,255,255,0.07)', color: '#fff',
    borderRadius: 12, padding: 12, fontSize: 13, resize: 'none',
    border: '1px solid rgba(255,255,255,0.15)', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6,
  }

  const visibleError = error && !errorDismissed

  return (
    <>
      {/* ── Splash Screen ───────────────────────────────────────────────────── */}
      {splash && (
        <div
          onClick={() => setSplash(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999, cursor: 'pointer',
            background: 'linear-gradient(160deg,#0F0C29,#302B63,#24243E)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 24,
          }}
        >
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            background: 'linear-gradient(135deg,#FF0099,#FACF39,#00AEEF,#38EF7D)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 44, fontWeight: 900, color: '#0F0C29',
            boxShadow: '0 0 40px rgba(255,0,153,0.5)',
            animation: 'pulse-glow 1.8s ease-in-out infinite',
          }}>ا</div>
          <h1 style={{
            fontSize: 'clamp(2rem,8vw,4rem)', fontWeight: 900, margin: 0,
            background: 'linear-gradient(135deg,#FF0099,#FACF39,#00AEEF,#38EF7D)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Alfalah AI
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, margin: 0, fontStyle: 'italic' }}>
            الفلاح — Come to Success
          </p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>
            17 Free AI Career Tools · 195 Countries
          </p>
          {/* Progress bar */}
          <div style={{ width: 240, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 4,
              background: 'linear-gradient(90deg,#FF0099,#FACF39,#00AEEF)',
              width: `${splashPct}%`, transition: 'width 0.1s linear',
            }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, margin: 0 }}>
            Click anywhere to skip
          </p>
        </div>
      )}

      {/* ── Main page ───────────────────────────────────────────────────────── */}
      <main style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg,#0F0C29,#302B63,#24243E)',
        color: '#fff', fontFamily: "'Segoe UI',system-ui,sans-serif",
      }}>
        {/* Rainbow top bar */}
        <div style={{ height: 5, background: 'linear-gradient(90deg,#FF0099,#FACF39,#00AEEF,#38EF7D,#FF6B35)' }} />

        {/* ── Nav Bar ───────────────────────────────────────────────────────── */}
        <nav style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 16px', position: 'sticky', top: 0, zIndex: 500 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 6, height: 50, flexWrap: 'nowrap' }}>
            {/* Logo */}
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginRight: 10, flexShrink: 0 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: 'linear-gradient(135deg,#FF0099,#FACF39,#00AEEF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 900, color: '#0F0C29', boxShadow: '0 0 12px rgba(255,0,153,0.4)',
              }}>ا</div>
              <div style={{ lineHeight: 1.1 }}>
                <div style={{ fontWeight: 900, fontSize: 13, background: 'linear-gradient(135deg,#FF0099,#FACF39,#00AEEF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Alfalah AI</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic', letterSpacing: 0.5 }}>Come to Success</div>
              </div>
            </a>
            {/* Nav links */}
            <a href="/" style={{ padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)', textDecoration: 'none', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'nowrap' }}>
              📄 Resume
            </a>
            <a href="/assess" style={{ padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, color: '#0F0C29', textDecoration: 'none', background: 'linear-gradient(135deg,#FACF39,#FF6B35)', whiteSpace: 'nowrap', boxShadow: '0 0 10px rgba(250,207,57,0.3)' }}>
              ⚡ Assessment
            </a>
            {/* Language selector */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>🌐</span>
              <select
                value={userLang}
                onChange={e => setUserLang(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8, color: '#fff', fontSize: 12, padding: '4px 8px',
                  cursor: 'pointer', outline: 'none', fontFamily: 'inherit',
                  maxWidth: 130,
                }}
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code} style={{ background: '#1a1a2e', color: '#fff' }}>
                    {l.flag} {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </nav>

        {/* ── User Info Bar ─────────────────────────────────────────────────── */}
        <div style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '8px 20px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', fontSize: 12 }}>
              {userInfo ? (
                <>
                  <span style={{ color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ color: '#00AEEF' }}>📍</span>
                    <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{userInfo.city}, {userInfo.region}</strong>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
                    {userInfo.country}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: '#FACF39' }}>🖥️</span> {userInfo.os}
                  </span>
                  {weather && (
                    <span style={{ color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>{weather}</span>
                    </span>
                  )}
                </>
              ) : (
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>Detecting location...</span>
              )}
            </div>
            {/* Usage dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Free uses:</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: CLIENT_HOURLY_LIMIT }).map((_, i) => (
                  <div key={i} style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: i < remaining ? 'linear-gradient(135deg,#38EF7D,#11998E)' : 'rgba(255,255,255,0.12)',
                    boxShadow: i < remaining ? '0 0 6px rgba(56,239,125,0.6)' : 'none',
                    transition: 'all .3s',
                  }} />
                ))}
              </div>
              <span style={{ fontSize: 11, color: remaining > 0 ? '#38EF7D' : '#FF6B6B', fontWeight: 700 }}>
                {remaining}/{CLIENT_HOURLY_LIMIT}
              </span>
            </div>
          </div>
        </div>

        {/* ── Job Market Pulse ──────────────────────────────────────────────── */}
        {userInfo && (() => {
          const c = userInfo.country || ''
          let pulse = '🌍 Global market — Remote work rising · AI skills most in-demand · English + digital literacy open doors worldwide'
          if (c.includes('Canada')) pulse = '🇨🇦 Canada — Tech hiring up 12% · Express Entry draws active · Toronto #1 tech hub · Remote work: 68% of tech roles'
          else if (c.includes('United States') || c.includes('USA')) pulse = '🇺🇸 USA — AI/ML roles up 34% · H-1B lottery: April · NYC/SF/Austin top markets · Layoffs stabilizing Q1 2026'
          else if (c.includes('United Kingdom') || c.includes('UK')) pulse = '🇬🇧 UK — Skilled Worker visa active · London fintech booming · NHS hiring surge · IR35 freelance rules apply'
          else if (c.includes('Australia')) pulse = '🇦🇺 Australia — 482 visa popular · Mining + tech hybrid roles hot · Melbourne overtaking Sydney for tech'
          else if (c.includes('India')) pulse = '🇮🇳 India — GCC hiring explosion · Bangalore/Hyderabad top · FAANG India campuses growing · Moonlighting policy varies'
          else if (c.includes('Pakistan') || c.includes('United Arab') || c.includes('UAE')) pulse = '🇦🇪 UAE/Gulf — Golden Visa available · Dubai tech scene booming · Tax-free salaries · Remote + onsite hybrid common'
          return (
            <div style={{
              background: 'linear-gradient(90deg,rgba(0,174,239,0.12),rgba(250,207,57,0.08),rgba(56,239,125,0.08))',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              padding: '0',
              overflow: 'hidden',
            }}>
              <div style={{ maxWidth: 1200, margin: '0 auto', padding: '9px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  fontSize: 10, fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase',
                  color: '#FACF39', whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  Market Pulse
                </span>
                <div style={{
                  flex: 1, overflowX: 'auto', display: 'flex', gap: 8, scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}>
                  {pulse.split('·').map((segment, i) => (
                    <span key={i} style={{
                      display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
                      fontSize: 12, fontWeight: i === 0 ? 800 : 500,
                      color: i === 0 ? '#fff' : 'rgba(255,255,255,0.65)',
                      padding: i === 0 ? '3px 10px 3px 0' : '3px 10px',
                      borderRadius: i === 0 ? 0 : 20,
                      background: i === 0 ? 'none' : 'rgba(255,255,255,0.06)',
                      border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      animation: 'fade-in 0.4s ease',
                      animationDelay: `${i * 0.08}s`,
                      animationFillMode: 'both',
                    }}>
                      {segment.trim()}
                    </span>
                  ))}
                </div>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                  background: '#38EF7D',
                  boxShadow: '0 0 8px rgba(56,239,125,0.8)',
                  animation: 'pulse-glow 2s ease-in-out infinite',
                }} />
              </div>
            </div>
          )
        })()}

        {/* ── Country Hero Banner ──────────────────────────────────────────── */}
        {userInfo?.countryCode && (() => {
          const pulse = getMarketPulse(userInfo.country, userInfo.countryCode)
          const flag = countryFlag(userInfo.countryCode)
          return (
            <div style={{
              background: 'linear-gradient(135deg,rgba(0,114,255,0.08),rgba(250,207,57,0.06),rgba(56,239,125,0.06))',
              borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '18px 20px',
            }}>
              <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                {/* Top row: flag + country + coords + currency */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
                  <span style={{ fontSize: 40, lineHeight: 1 }}>{flag}</span>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>
                      {userInfo.country}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 3 }}>
                      <span>🏙️ {userInfo.city}, {userInfo.region}</span>
                      {userInfo.lat && <span>📡 {userInfo.lat}°N {userInfo.lng}°E</span>}
                      {userInfo.timezone && <span>🕐 {userInfo.timezone}</span>}
                      {userInfo.currency && <span>💱 {userInfo.currency}</span>}
                    </div>
                  </div>
                  {/* Quick stats pills */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginLeft: 'auto' }}>
                    {[
                      { label: 'GDP', val: pulse.gdp },
                      { label: 'Population', val: pulse.pop },
                      { label: 'IT Workforce', val: pulse.it },
                    ].map(s => (
                      <div key={s.label} style={{ padding: '5px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#FACF39' }}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Bottom rows: industries + future */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 10 }}>
                  <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(0,174,239,0.07)', border: '1px solid rgba(0,174,239,0.15)' }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#00AEEF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>🏭 Key Industries 2026</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{pulse.industries}</div>
                  </div>
                  <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(56,239,125,0.06)', border: '1px solid rgba(56,239,125,0.15)' }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#38EF7D', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>🚀 100-Year Career Roadmap</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{pulse.future}</div>
                  </div>
                  <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(250,207,57,0.06)', border: '1px solid rgba(250,207,57,0.15)' }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#FACF39', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>⚖️ Legal Essentials</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{pulse.laws}</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <header style={{ padding: '28px 16px 16px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block', marginBottom: 14, padding: '4px 16px', borderRadius: 999,
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#FACF39',
          }}>
            الفلاح · 17 Free AI Tools · 195 Countries
          </div>
          <h1 style={{
            fontSize: 'clamp(2.4rem,8vw,5rem)', fontWeight: 900, margin: '0 0 6px',
            background: 'linear-gradient(135deg,#FF0099,#FACF39,#00AEEF,#38EF7D)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.05,
          }}>
            Alfalah AI
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, margin: '0 auto 4px', fontStyle: 'italic', letterSpacing: 0.5 }}>
            Come to Success — الفلاح
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, maxWidth: 480, margin: '0 auto 14px' }}>
            Upload your resume. Paste the job.{' '}
            <strong style={{ color: '#fff' }}>Land the interview.</strong>
          </p>

          {/* ── Welcome Banner ─────────────────────────────────────────────── */}
          {!results && (
            <div style={{
              maxWidth: 780, margin: '12px auto 0', padding: '18px 24px', borderRadius: 18,
              background: 'linear-gradient(135deg,rgba(255,0,153,0.08),rgba(0,174,239,0.08))',
              border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left',
              animation: 'fade-in 0.6s ease',
            }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, margin: '0 0 8px' }}>
                In an era of <strong style={{ color: '#FACF39' }}>AI layoffs and global career migration</strong>, Alfalah AI's 17 free tools help anyone — from Karachi to Canada, Lagos to London — compete at the highest level. Explore visa pathways, crush ATS filters, and build your 30-60-90 day plan with AI guidance backed by real global career data.
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                100% free · Zero data stored · Built with heart and mind
              </p>
            </div>
          )}

          {/* ── Skills Assessment CTA Banner ─────────────────────────────────── */}
          {!results && (
            <a href="/assess" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              maxWidth: 780, margin: '14px auto 0', padding: '14px 22px', borderRadius: 16,
              background: 'linear-gradient(135deg,rgba(250,207,57,0.12),rgba(255,107,53,0.10))',
              border: '1px solid rgba(250,207,57,0.25)', textDecoration: 'none',
              animation: 'fade-in 0.8s ease', gap: 14, flexWrap: 'wrap',
              boxShadow: '0 0 24px rgba(250,207,57,0.08)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 30 }}>⚡</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#FACF39', marginBottom: 2 }}>
                    No resume yet? Take the Free Skills Assessment
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                    Get your 0–100 career score · Age 10 to 100 · 195 countries · ISCO-08 career map
                  </div>
                </div>
              </div>
              <div style={{
                padding: '8px 20px', borderRadius: 10, fontWeight: 800, fontSize: 13,
                background: 'linear-gradient(135deg,#FACF39,#FF6B35)', color: '#0F0C29',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                Start Assessment →
              </div>
            </a>
          )}
        </header>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 12px 40px' }}>

          {/* ── Instant ATS Score ─────────────────────────────────────────── */}
          {atsScore && (
            <div style={{ ...glass, marginBottom: 24, animation: 'fade-in 0.4s ease' }}>
              <div style={{ marginBottom: 14 }}>
                <h2 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: 1, textTransform: 'uppercase' }}>
                  ⚡ Quick Word Match Score — Instant, No API
                </h2>
                <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                  Measures exact technical keyword overlap only. The AI card <strong style={{ color: '#FACF39' }}>ATS Score</strong> below gives the full semantic, skills & experience analysis — they will differ.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                <CircleRing score={atsScore.score} />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{
                    fontSize: 18, fontWeight: 900, marginBottom: 8,
                    color: atsScore.score >= 70 ? '#38EF7D' : atsScore.score >= 45 ? '#FACF39' : '#FF416C',
                  }}>
                    {atsScore.label} — {atsScore.found}/{atsScore.total} technical keywords matched
                  </div>
                  {atsScore.matched.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, color: '#38EF7D', marginBottom: 6, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                        ✓ Keywords Found in Resume
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {atsScore.matched.map(kw => (
                          <span key={kw} style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(56,239,125,0.22)', border: '1px solid rgba(56,239,125,0.5)', fontSize: 11, color: '#38EF7D', fontWeight: 700 }}>{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {atsScore.missing.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, color: '#FF6B6B', marginBottom: 6, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                        ✗ Keywords Missing — Add These to Your Resume
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {atsScore.missing.map(kw => (
                          <span key={kw} style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(255,65,108,0.3)', border: '1px solid rgba(255,65,108,0.6)', fontSize: 11, color: '#FFB3B3', fontWeight: 700 }}>{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Input Grid ───────────────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20, marginBottom: 20 }}>

            {/* Resume Upload */}
            <div style={glass}>
              <h2 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 800, background: 'linear-gradient(90deg,#00C6FF,#0072FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📋</span> Your Resume
              </h2>
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]) }}
                onClick={() => fileRef.current?.click()}
                style={{
                  cursor: 'pointer', borderRadius: 14,
                  border: `2px dashed ${dragOver ? '#00AEEF' : 'rgba(255,255,255,0.22)'}`,
                  padding: '20px 14px', textAlign: 'center', marginBottom: 12,
                  background: dragOver ? 'rgba(0,174,239,0.12)' : 'rgba(255,255,255,0.03)',
                  transition: 'all .2s',
                }}
              >
                <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={e => processFile(e.target.files[0])} style={{ display: 'none' }} />
                <div style={{ fontSize: 30, marginBottom: 6 }}>{uploading ? '⏳' : '📂'}</div>
                {uploading
                  ? <p style={{ color: '#00AEEF', fontSize: 13, fontWeight: 700, margin: 0 }}>Reading file...</p>
                  : fileName
                    ? <p style={{ color: '#38EF7D', fontSize: 12, fontWeight: 700, margin: 0 }}>✓ {fileName}</p>
                    : <>
                        <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>Drop file or click to upload</p>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>PDF · DOCX · TXT · Max 10MB</p>
                      </>
                }
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', margin: '0 0 8px' }}>— or paste below —</p>
              <textarea
                value={resumeText}
                onChange={e => { const v = e.target.value; setResumeText(v.length > MAX_PASTE_CHARS ? v.slice(0, MAX_PASTE_CHARS) : v) }}
                placeholder="Paste your resume text here..."
                style={{ ...textarea, height: 150 }}
              />
              <p style={{ textAlign: 'right', fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: '4px 0 0' }}>
                {resumeText.length.toLocaleString()} / {MAX_PASTE_CHARS.toLocaleString()}
              </p>
            </div>

            {/* Job Description */}
            <div style={glass}>
              <h2 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 800, background: 'linear-gradient(90deg,#FF0099,#FF6B6B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>💼</span> Job Description
              </h2>
              <div
                onDragOver={e => { e.preventDefault(); setJobDragOver(true) }}
                onDragLeave={() => setJobDragOver(false)}
                onDrop={e => { e.preventDefault(); setJobDragOver(false); processFile(e.dataTransfer.files[0], true) }}
                onClick={() => jobFileRef.current?.click()}
                style={{
                  cursor: 'pointer', borderRadius: 14,
                  border: `2px dashed ${jobDragOver ? '#FF0099' : 'rgba(255,255,255,0.22)'}`,
                  padding: '20px 14px', textAlign: 'center', marginBottom: 12,
                  background: jobDragOver ? 'rgba(255,0,153,0.12)' : 'rgba(255,255,255,0.03)',
                  transition: 'all .2s',
                }}
              >
                <input ref={jobFileRef} type="file" accept=".pdf,.docx,.txt" onChange={e => processFile(e.target.files[0], true)} style={{ display: 'none' }} />
                <div style={{ fontSize: 30, marginBottom: 6 }}>{jobUploading ? '⏳' : '📂'}</div>
                {jobUploading
                  ? <p style={{ color: '#FF0099', fontSize: 13, fontWeight: 700, margin: 0 }}>Reading file...</p>
                  : jobFileName
                    ? <p style={{ color: '#38EF7D', fontSize: 12, fontWeight: 700, margin: 0 }}>✓ {jobFileName}</p>
                    : <>
                        <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>Drop file or click to upload</p>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>PDF · DOCX · TXT · Max 10MB</p>
                      </>
                }
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', margin: '0 0 8px' }}>— or paste below —</p>
              <textarea
                value={jobText}
                onChange={e => { const v = e.target.value; setJobText(v.length > 6000 ? v.slice(0, 6000) : v) }}
                placeholder="Paste the job description here..."
                style={{ ...textarea, height: 150 }}
              />
              <p style={{ textAlign: 'right', fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: '4px 0 0' }}>
                {jobText.length.toLocaleString()} / 6,000
              </p>
            </div>
          </div>

          {/* ── Error Banner ─────────────────────────────────────────────────── */}
          {visibleError && (
            <div style={{
              background: 'rgba(255,60,60,0.15)', border: '1px solid rgba(255,60,60,0.4)',
              color: '#FF9090', borderRadius: 14, padding: '12px 18px', marginBottom: 20,
              fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
              animation: 'fade-in 0.3s ease',
            }}>
              <span>⚠️ {error}</span>
              <button onClick={() => setErrorDismissed(true)} style={{ background: 'none', border: 'none', color: '#FF9090', cursor: 'pointer', fontSize: 18, padding: '0 4px', fontFamily: 'inherit' }}>×</button>
            </div>
          )}

          {/* ── Quick Start chips ─────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
            {[
              '📋 Upload Resume + Paste Job → Get 16 AI Reports',
              '🌍 Includes: Visa Paths · Local Recruiters · Live Jobs',
              '🔒 Zero data stored · No login · 100% free',
            ].map((chip, i) => (
              <span key={i} style={{
                fontSize: 12, fontWeight: 600,
                padding: '7px 16px', borderRadius: 999,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.14)',
                color: 'rgba(255,255,255,0.7)',
                letterSpacing: 0.2,
                animation: 'fade-in 0.5s ease',
                animationDelay: `${i * 0.1}s`,
                animationFillMode: 'both',
              }}>
                {chip}
              </span>
            ))}
          </div>

          {/* ── Analyze Button ────────────────────────────────────────────────── */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              style={{
                background: loading ? 'rgba(255,255,255,0.18)' : 'linear-gradient(135deg,#FACF39,#FF9500)',
                color: loading ? 'rgba(255,255,255,0.4)' : '#1a0a00',
                fontWeight: 900, fontSize: 20, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                padding: '18px 56px', borderRadius: 20,
                boxShadow: loading ? 'none' : '0 8px 40px rgba(250,207,57,0.45)',
                transition: 'all .2s', display: 'inline-flex', alignItems: 'center', gap: 12,
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 48px rgba(250,207,57,0.65)' } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 8px 40px rgba(250,207,57,0.45)' }}
            >
              <span style={{ fontSize: 24 }}>{loading ? '✨' : '🚀'}</span>
              {loading ? 'Generating all 16 AI tools...' : 'Analyse My Profile — 16 AI Tools'}
            </button>
            {loading && (
              <div style={{ marginTop: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      width: 9, height: 9, borderRadius: '50%',
                      background: 'linear-gradient(135deg,#FF0099,#FACF39)',
                      animation: 'bounce .9s ease infinite',
                      animationDelay: `${i * 0.13}s`,
                    }} />
                  ))}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: 0 }}>
                  AI generating all 16 tools — takes about 20–35 seconds...
                </p>
              </div>
            )}
          </div>

          {/* ── Results Section ───────────────────────────────────────────────── */}
          {results !== null && (
            <div ref={resultsRef} style={{ animation: 'fade-in 0.5s ease' }}>
              {/* Results Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>
                <h2 style={{ fontSize: 26, fontWeight: 900, margin: 0, background: 'linear-gradient(135deg,#FF0099,#FACF39,#00AEEF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  AI Results
                </h2>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    onClick={handleShare}
                    style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', transition: 'all .2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  >
                    {copied === '__share__' ? '✓ Copied!' : '🔗 Share'}
                  </button>
                  <button
                    onClick={downloadReport}
                    disabled={Object.keys(results).length === 0}
                    style={{ padding: '8px 16px', borderRadius: 10, background: 'linear-gradient(135deg,#00C6FF,#0072FF)', border: 'none', color: '#fff', fontWeight: 700, cursor: Object.keys(results).length === 0 ? 'not-allowed' : 'pointer', fontSize: 13, fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(0,198,255,0.35)', transition: 'all .2s', opacity: Object.keys(results).length === 0 ? 0.5 : 1 }}
                    onMouseEnter={e => { if (Object.keys(results).length > 0) e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    📥 Download .txt
                  </button>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 20 }}>
                Select a category · then choose a tool inside
              </p>

              {/* ── 5 Group Cards ──────────────────────────────────────────── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
                {GROUPS.map(group => {
                  const isActive = activeGroup === group.id
                  const readyCount = group.tabs.filter(t => !!results[t.key]).length
                  const allReady = readyCount === group.tabs.length
                  return (
                    <button key={group.id}
                      onClick={() => {
                        setActiveGroup(isActive ? null : group.id)
                        setActiveTab(isActive ? null : group.tabs[0].key)
                      }}
                      style={{
                        borderRadius: 18, padding: '20px 14px', textAlign: 'center', cursor: 'pointer',
                        background: isActive ? group.g : 'rgba(255,255,255,0.06)',
                        border: `2px solid ${isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
                        boxShadow: isActive ? '0 8px 32px rgba(0,0,0,0.5)' : 'none',
                        transform: isActive ? 'scale(1.04) translateY(-2px)' : 'scale(1)',
                        transition: 'all .3s ease', fontFamily: 'inherit', color: '#fff',
                        position: 'relative', overflow: 'hidden',
                      }}
                      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.transform = 'scale(1.03) translateY(-2px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' } }}
                      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' } }}
                    >
                      {loading && !allReady && <ShimmerOverlay />}
                      {/* Ready badge */}
                      <div style={{ position: 'absolute', top: 8, right: 10, fontSize: 10, fontWeight: 800,
                        color: allReady ? '#38EF7D' : 'rgba(255,255,255,0.3)' }}>
                        {readyCount}/{group.tabs.length}
                      </div>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{group.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 900, marginBottom: 4 }}>{group.title}</div>
                      <div style={{ fontSize: 10, color: isActive ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{group.desc}</div>
                    </button>
                  )
                })}
              </div>

              {/* ── Active Group Panel ─────────────────────────────────────── */}
              {activeGroup && (() => {
                const group = GROUPS.find(g => g.id === activeGroup)
                const tab = group.tabs.find(t => t.key === activeTab) || group.tabs[0]
                const content = results[tab.key]
                return (
                  <div style={{ ...glass, border: `1px solid rgba(255,255,255,0.2)`, boxShadow: '0 16px 56px rgba(0,0,0,0.6)', animation: 'fade-in 0.25s ease' }}>
                    {/* Group header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                      <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, background: group.g, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 26 }}>{group.icon}</span> {group.title}
                      </h3>
                      <button onClick={() => content && copyToClipboard(content, tab.key)} disabled={!content}
                        style={{ background: copied === tab.key ? 'linear-gradient(135deg,#11998E,#38EF7D)' : 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '7px 16px', cursor: content ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', opacity: content ? 1 : 0.4 }}>
                        {copied === tab.key ? '✓ Copied!' : '📋 Copy'}
                      </button>
                    </div>

                    {/* Inner tabs */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
                      {group.tabs.map(t => {
                        const isActiveTab = activeTab === t.key
                        const hasResult = !!results[t.key]
                        return (
                          <button key={t.key} onClick={() => setActiveTab(t.key)}
                            style={{
                              padding: '8px 16px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit',
                              background: isActiveTab ? group.g : 'rgba(255,255,255,0.07)',
                              border: `1px solid ${isActiveTab ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.12)'}`,
                              color: '#fff', fontSize: 12, fontWeight: isActiveTab ? 800 : 500,
                              display: 'flex', alignItems: 'center', gap: 6, transition: 'all .2s',
                            }}>
                            <span>{t.icon}</span> {t.label}
                            {hasResult && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38EF7D', boxShadow: '0 0 5px rgba(56,239,125,0.9)', display: 'inline-block' }} />}
                          </button>
                        )
                      })}
                    </div>

                    {/* Content area */}
                    <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 14, padding: 22, fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.92)', maxHeight: 520, overflowY: 'auto', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {content
                        ? <RenderText text={content} />
                        : loading
                          ? <span style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>Generating {tab.label}...<span className="typing-cursor" /></span>
                          : <span style={{ color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>No result yet for {tab.label}</span>
                      }
                    </div>

                    {/* Your Market banner — shown inside Job Hunt group */}
                    {activeGroup === 'jobhunt' && userInfo?.country && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 14px', marginBottom: 16, borderRadius: 10,
                        background: 'rgba(56,239,125,0.07)',
                        border: '1px solid rgba(56,239,125,0.2)',
                      }}>
                        <span style={{ fontSize: 13 }}>📍</span>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
                          Showing results for your market:
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#38EF7D' }}>
                          {userInfo.country}
                        </span>
                      </div>
                    )}

                    {/* Live Jobs — shown inside Job Hunt → Live Jobs & Match tab */}
                    {activeGroup === 'jobhunt' && activeTab === 'matchingJobs' && (
                      <div style={{ marginTop: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(56,239,125,0.08)', borderRadius: 10, border: '1px solid rgba(56,239,125,0.2)', marginBottom: 12 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF4444', boxShadow: '0 0 8px rgba(255,68,68,0.8)', display: 'inline-block', animation: 'pulse-glow 1.5s ease-in-out infinite' }} />
                          <span style={{ fontWeight: 800, fontSize: 14, color: '#38EF7D' }}>LIVE JOBS — Posted This Week</span>
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginLeft: 4 }}>Auto-searched from Google Jobs</span>
                          {autoJobsLoading && <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                            {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#38EF7D', animation: 'bounce .9s ease infinite', animationDelay: `${i*0.2}s` }} />)}
                          </div>}
                        </div>
                        {autoJobsLoading && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontStyle: 'italic', margin: 0 }}>Searching Google Jobs...</p>}
                        {autoJobs && autoJobs.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, margin: 0 }}>No live jobs auto-found. Add SERPER_API_KEY to Vercel to activate, or search manually below.</p>}
                        {autoJobs && autoJobs.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {autoJobs.map((job, i) => (
                              <div key={i} style={{ background: 'rgba(56,239,125,0.05)', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(56,239,125,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: 160 }}>
                                  <div style={{ fontWeight: 800, fontSize: 13, color: '#fff', marginBottom: 2 }}>{job.title}</div>
                                  <div style={{ fontSize: 12, color: '#38EF7D', fontWeight: 700, marginBottom: 3 }}>{job.company}</div>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 11 }}>
                                    {job.location && <span style={{ color: 'rgba(255,255,255,0.45)' }}>📍 {job.location}</span>}
                                    {job.posted   && <span style={{ color: '#FACF39' }}>🕐 {job.posted}</span>}
                                    {job.salary   && <span style={{ color: '#38EF7D' }}>💰 {job.salary}</span>}
                                    {job.via      && <span style={{ color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>{job.via}</span>}
                                  </div>
                                </div>
                                {job.link && job.link !== '#' && (
                                  <a href={job.link} target="_blank" rel="noopener noreferrer" style={{ background: 'linear-gradient(135deg,#38EF7D,#11998E)', color: '#001a0e', fontWeight: 800, fontSize: 12, padding: '7px 12px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                    Apply →
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          )}

          {/* ── Live Jobs from Google ─────────────────────────────────────────── */}
          {results !== null && (
          <div style={{ ...glass, marginTop: 40, border: '1px solid rgba(56,239,125,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <span style={{ fontSize: 28 }}>🔍</span>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, background: 'linear-gradient(135deg,#38EF7D,#00AEEF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Search More Jobs{userInfo?.country ? ` in ${userInfo.country}` : ''} — Fresh from Google
                </h2>
                <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                  Real job postings · Posted in last 1–2 weeks · Direct apply links
                </p>
              </div>
            </div>

            {/* Search inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 12 }}>
              <input
                value={searchTitle}
                onChange={e => setSearchTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchLiveJobs()}
                placeholder="Job title (e.g. Software Engineer)"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
              />
              <input
                value={searchLocation}
                onChange={e => setSearchLocation(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchLiveJobs()}
                placeholder="Location (e.g. Toronto, Canada)"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
              />
              <select
                value={timeframe}
                onChange={e => setTimeframe(e.target.value)}
                style={{ background: 'rgba(30,20,50,0.95)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}
              >
                <option value="d">Past 24 hours</option>
                <option value="w">Past 1 week</option>
                <option value="w2">Past 2 weeks</option>
                <option value="m">Past 1 month</option>
              </select>
            </div>

            <button
              onClick={fetchLiveJobs}
              disabled={jobsLoading}
              style={{
                background: jobsLoading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#38EF7D,#00AEEF)',
                color: jobsLoading ? 'rgba(255,255,255,0.4)' : '#001a0e',
                fontWeight: 800, fontSize: 15, border: 'none',
                cursor: jobsLoading ? 'not-allowed' : 'pointer',
                padding: '12px 32px', borderRadius: 12,
                boxShadow: jobsLoading ? 'none' : '0 6px 24px rgba(56,239,125,0.35)',
                transition: 'all .2s', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16,
              }}
            >
              <span>{jobsLoading ? '⏳' : '🔍'}</span>
              {jobsLoading ? 'Searching Google Jobs...' : 'Search Fresh Jobs'}
            </button>

            {/* Error */}
            {jobsError && (
              <div style={{ background: 'rgba(255,60,60,0.15)', border: '1px solid rgba(255,60,60,0.3)', borderRadius: 10, padding: '10px 14px', color: '#FF9090', fontSize: 13, marginBottom: 14 }}>
                ⚠️ {jobsError}
              </div>
            )}

            {/* Job cards */}
            {liveJobs !== null && (
              liveJobs.length === 0
                ? <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, fontStyle: 'italic' }}>No jobs found for this search. Try a broader title or different location.</p>
                : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '0 0 4px' }}>
                      Found {liveJobs.length} jobs · Powered by Google Jobs
                    </p>
                    {liveJobs.map((job, i) => (
                      <div key={i} style={{
                        background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '16px 18px',
                        border: '1px solid rgba(56,239,125,0.12)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                        gap: 14, flexWrap: 'wrap',
                      }}>
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{job.title}</div>
                          <div style={{ fontSize: 13, color: '#38EF7D', fontWeight: 700, marginBottom: 4 }}>{job.company}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 11 }}>
                            {job.location && <span style={{ color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 4 }}>📍 {job.location}</span>}
                            {job.posted   && <span style={{ color: '#FACF39', display: 'flex', alignItems: 'center', gap: 4 }}>🕐 {job.posted}</span>}
                            {job.jobType  && <span style={{ color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 4 }}>💼 {job.jobType}</span>}
                            {job.salary   && <span style={{ color: '#38EF7D', display: 'flex', alignItems: 'center', gap: 4 }}>💰 {job.salary}</span>}
                            {job.via      && <span style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>{job.via}</span>}
                          </div>
                          {job.snippet && (
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '8px 0 0', lineHeight: 1.6, maxHeight: 54, overflow: 'hidden' }}>
                              {job.snippet.slice(0, 180)}{job.snippet.length > 180 ? '…' : ''}
                            </p>
                          )}
                        </div>
                        {job.link && job.link !== '#' && (
                          <a
                            href={job.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: 'linear-gradient(135deg,#FF0099,#FF6B35)',
                              color: '#fff', fontWeight: 800, fontSize: 13,
                              padding: '10px 18px', borderRadius: 10,
                              textDecoration: 'none', whiteSpace: 'nowrap',
                              boxShadow: '0 4px 14px rgba(255,0,153,0.35)',
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              flexShrink: 0,
                            }}
                          >
                            Apply Now →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
            )}
          </div>
          )}

          {/* ── Privacy / Disclaimer footer card ────────────────────────────── */}
          <div style={{ ...glass, marginTop: 40, padding: '20px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span>🔒</span>
                  <strong style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Privacy — Your Data Stays With You</strong>
                </div>
                <ul style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1.7, margin: 0, paddingLeft: 16 }}>
                  <li>We do <strong style={{ color: 'rgba(255,255,255,0.6)' }}>NOT</strong> store your resume on any server</li>
                  <li>We do <strong style={{ color: 'rgba(255,255,255,0.6)' }}>NOT</strong> store the job description or AI results</li>
                  <li>Data is processed in-memory and discarded immediately</li>
                  <li>Refresh or close — everything is gone</li>
                  <li>AI analysis is processed via a third-party AI service — no data is retained after processing</li>
                </ul>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span>🛡️</span>
                  <strong style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Security & Compliance</strong>
                </div>
                <ul style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1.7, margin: 0, paddingLeft: 16 }}>
                  <li>All traffic encrypted via HTTPS (TLS 1.3)</li>
                  <li>Rate limited: 5 requests/hour per IP</li>
                  <li>Progressive blocks: 1h → 3h → 6h on violations</li>
                  <li>Inputs sanitized — HTML + injection patterns removed</li>
                  <li>Zero persistent storage — GDPR/PIPEDA friendly</li>
                </ul>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span>⚠️</span>
                  <strong style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Disclaimer</strong>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                  All outputs are generated by AI and should be reviewed before use. This tool does not guarantee employment outcomes. Salary ranges are estimates. Always verify with qualified professionals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Chatbot Floating Button + Panel ────────────────────────────────── */}
        {/* Floating button */}
        <button
          onClick={() => setChatOpen(o => !o)}
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
            width: 60, height: 60, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: chatOpen ? 'linear-gradient(135deg,#FF416C,#FF4B2B)' : 'linear-gradient(135deg,#00C6FF,#0072FF)',
            boxShadow: '0 6px 28px rgba(0,114,255,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, transition: 'all .3s',
            animation: chatOpen ? 'none' : 'pulse-glow 2.5s ease-in-out infinite',
          }}
          title="Chat with Alfalah AI"
        >
          {chatOpen ? '✕' : '🌟'}
        </button>

        {/* Chat panel */}
        {chatOpen && (
          <div style={{
            position: 'fixed', bottom: 96, right: 24, zIndex: 999,
            width: 'min(380px, calc(100vw - 32px))',
            height: 520,
            background: 'rgba(15,12,41,0.97)',
            backdropFilter: 'blur(20px)',
            borderRadius: 20, border: '1px solid rgba(0,198,255,0.35)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            animation: 'fade-in 0.25s ease',
          }}>
            {/* Chat header */}
            <div style={{
              padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)',
              background: 'linear-gradient(135deg,rgba(0,198,255,0.15),rgba(0,114,255,0.1))',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#FF0099,#FACF39,#00AEEF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#0F0C29', flexShrink: 0 }}>ا</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>Alfalah AI</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>الفلاح · Career + App Help · Free · Private</div>
              </div>
              <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#38EF7D', boxShadow: '0 0 8px rgba(56,239,125,0.8)' }} />
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{
                    maxWidth: '85%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg,#0072FF,#00C6FF)'
                      : 'rgba(255,255,255,0.07)',
                    border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    fontSize: 13, lineHeight: 1.6, color: '#fff', whiteSpace: 'pre-wrap',
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: 'flex', gap: 5, padding: '8px 14px' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#00C6FF', animation: 'bounce .9s ease infinite', animationDelay: `${i*0.2}s` }} />
                  ))}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested questions */}
            {chatMessages.length <= 1 && (
              <div style={{ padding: '0 10px 8px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['What does Alfalah AI do?', 'How do I improve my ATS score?', 'What salary should I ask for?', 'How do I get a work visa?'].map(q => (
                  <button key={q} onClick={() => { setChatInput(q); setTimeout(() => document.getElementById('chat-input')?.focus(), 50) }}
                    style={{ fontSize: 11, padding: '5px 10px', borderRadius: 20, background: 'rgba(0,198,255,0.12)', border: '1px solid rgba(0,198,255,0.25)', color: '#00C6FF', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={sendChat} style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 8 }}>
              <input
                id="chat-input"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask anything about your career..."
                disabled={chatLoading}
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 12, padding: '9px 13px', color: '#fff', fontSize: 13,
                  outline: 'none', fontFamily: 'inherit',
                }}
              />
              <button type="submit" disabled={chatLoading || !chatInput.trim()}
                style={{
                  background: 'linear-gradient(135deg,#00C6FF,#0072FF)', border: 'none',
                  borderRadius: 12, width: 40, height: 40, cursor: chatLoading || !chatInput.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                  opacity: chatInput.trim() ? 1 : 0.4, flexShrink: 0,
                }}>
                ➤
              </button>
            </form>
          </div>
        )}

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <footer style={{ textAlign: 'center', padding: '28px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
          <strong style={{ color: '#FF0099', fontSize: 14 }}>Alfalah AI</strong>
          {' · '}
          <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.4)' }}>الفلاح — Come to Success</span>
          {' · Built by '}
          <strong style={{ color: '#FACF39' }}>Shahzad</strong>
          {' · Mississauga, Canada · '}
          <strong style={{ color: '#00AEEF' }}>Free for All Humanity · 195 Countries</strong>
        </footer>

        {/* ── Global CSS ─────────────────────────────────────────────────────── */}
        <style>{`
          * { box-sizing: border-box; }
          @keyframes fade-in { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
          @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
          @keyframes pulse-glow { 0%,100%{filter:drop-shadow(0 0 8px #FF009966)} 50%{filter:drop-shadow(0 0 28px #FF0099cc)} }
          @keyframes typing { 0%,100%{opacity:1} 50%{opacity:0} }
          @keyframes shimmer { 0%{left:-60%} 100%{left:120%} }
          .typing-cursor::after { content:'▋'; animation:typing 1s infinite steps(1); color:#00AEEF; margin-left:5px; }
          textarea::placeholder { color:rgba(255,255,255,0.22); }
          ::-webkit-scrollbar { width:6px; }
          ::-webkit-scrollbar-track { background:rgba(255,255,255,0.04); }
          ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.18); border-radius:4px; }
        `}</style>
      </main>
    </>
  )
}
