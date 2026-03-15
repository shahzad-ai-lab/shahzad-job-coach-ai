'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

// ── Scoring weights (total = 100) ─────────────────────────────────────────────
const W = { education: 15, experience: 20, hardSkills: 25, softSkills: 15, languages: 10, certs: 10, digital: 5 }

// ── Career recommendations per field + score range ────────────────────────────
const CAREERS = {
  tech: [
    { title: 'Software Developer', isco: '2512', salary: '$90K–$180K', growth: '+25%', skills: ['Python/JavaScript', 'Git', 'APIs', 'Databases'], where: 'LinkedIn · GitHub Jobs · Stack Overflow Jobs' },
    { title: 'Data Scientist', isco: '2120', salary: '$85K–$160K', growth: '+35%', skills: ['Python', 'ML/AI', 'Statistics', 'SQL'], where: 'Kaggle Jobs · LinkedIn · Indeed' },
    { title: 'Cybersecurity Analyst', isco: '2529', salary: '$80K–$140K', growth: '+32%', skills: ['Network Security', 'SIEM', 'CompTIA Sec+', 'Ethical Hacking'], where: 'CyberSecJobs · LinkedIn · Indeed' },
    { title: 'Cloud Engineer', isco: '2522', salary: '$100K–$180K', growth: '+28%', skills: ['AWS/Azure/GCP', 'Terraform', 'Docker/K8s', 'Linux'], where: 'LinkedIn · AWS Jobs · Remote.co' },
    { title: 'IT Support Specialist', isco: '3512', salary: '$40K–$75K', growth: '+9%', skills: ['Help Desk', 'Windows/Linux', 'Networking', 'Troubleshooting'], where: 'Indeed · LinkedIn · CompTIA CareerMarketplace' },
    { title: 'UI/UX Designer', isco: '2166', salary: '$65K–$130K', growth: '+16%', skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'], where: 'Dribbble Jobs · LinkedIn · Behance' },
    { title: 'DevOps Engineer', isco: '2519', salary: '$100K–$175K', growth: '+22%', skills: ['CI/CD', 'Kubernetes', 'AWS', 'Scripting'], where: 'LinkedIn · HashiCorp Jobs · Remote.co' },
    { title: 'AI/ML Engineer', isco: '2519', salary: '$120K–$250K', growth: '+40%', skills: ['TensorFlow/PyTorch', 'Python', 'MLOps', 'LLMs'], where: 'OpenAI · Anthropic · LinkedIn · Turing.com' },
  ],
  health: [
    { title: 'Registered Nurse', isco: '2221', salary: '$60K–$100K', growth: '+6%', skills: ['Patient Care', 'Clinical Assessment', 'EHR', 'IV Therapy'], where: 'NHS Jobs · Indeed Health · Nursing Jobs' },
    { title: 'Physician Assistant / NP', isco: '2240', salary: '$100K–$145K', growth: '+28%', skills: ['Clinical Skills', 'Diagnosis', 'Prescribing', 'EMR'], where: 'PracticeLink · HospitalRecruiting · LinkedIn' },
    { title: 'Medical Laboratory Technician', isco: '3212', salary: '$45K–$75K', growth: '+11%', skills: ['Lab Analysis', 'Phlebotomy', 'LIS Systems', 'QC'], where: 'Indeed · LinkedIn · ASCP JobBoard' },
    { title: 'Physiotherapist', isco: '2264', salary: '$70K–$110K', growth: '+17%', skills: ['Manual Therapy', 'Exercise Prescription', 'Patient Assessment', 'EMR'], where: 'NHS Jobs · PhysioJobs · LinkedIn' },
    { title: 'Healthcare Assistant', isco: '5321', salary: '$28K–$48K', growth: '+22%', skills: ['Personal Care', 'Compassion', 'Basic Life Support', 'Record Keeping'], where: 'NHS Jobs · Care.com · Indeed' },
    { title: 'Pharmacist', isco: '2262', salary: '$100K–$140K', growth: '+3%', skills: ['Pharmacology', 'Drug Interactions', 'Patient Counseling', 'Dispensing'], where: 'PharmacyJobs · LinkedIn · Indeed' },
    { title: 'Mental Health Counselor', isco: '2635', salary: '$50K–$90K', growth: '+22%', skills: ['CBT', 'Active Listening', 'Crisis Intervention', 'Case Notes'], where: 'PsychologyToday · LinkedIn · Indeed' },
    { title: 'Medical Coder / Biller', isco: '3252', salary: '$40K–$65K', growth: '+8%', skills: ['ICD-10', 'CPT Codes', 'Medical Terminology', 'EHR'], where: 'AAPC JobBoard · Indeed · LinkedIn' },
  ],
  business: [
    { title: 'Financial Analyst', isco: '2413', salary: '$75K–$130K', growth: '+9%', skills: ['Excel/VBA', 'Financial Modeling', 'Bloomberg', 'Valuation'], where: 'eFinancialCareers · LinkedIn · Indeed' },
    { title: 'HR Business Partner', isco: '2423', salary: '$65K–$120K', growth: '+5%', skills: ['Employment Law', 'Workday/SAP HR', 'Talent Management', 'Coaching'], where: 'LinkedIn · Indeed · SHRM Jobs' },
    { title: 'Project Manager', isco: '2421', salary: '$80K–$150K', growth: '+11%', skills: ['PMP', 'Agile/Scrum', 'MS Project', 'Stakeholder Management'], where: 'PMI Jobs · LinkedIn · Indeed' },
    { title: 'Sales Account Executive', isco: '3322', salary: '$60K–$200K+', growth: '+5%', skills: ['CRM/Salesforce', 'Negotiation', 'Pipeline Management', 'Presentations'], where: 'LinkedIn · Indeed · SalesGravy' },
    { title: 'Accountant / CPA', isco: '2411', salary: '$55K–$120K', growth: '+4%', skills: ['GAAP/IFRS', 'Excel', 'QuickBooks/SAP', 'Tax Compliance'], where: 'Robert Half · LinkedIn · AICPA Jobs' },
    { title: 'Marketing Manager', isco: '2431', salary: '$65K–$140K', growth: '+8%', skills: ['Digital Marketing', 'Google Analytics', 'Meta Ads', 'Content Strategy'], where: 'LinkedIn · Indeed · MarketingHire' },
    { title: 'Business Analyst', isco: '2421', salary: '$70K–$120K', growth: '+11%', skills: ['Requirements Gathering', 'SQL', 'Visio/BPMN', 'Stakeholder Comms'], where: 'LinkedIn · Indeed · IIBA JobBoard' },
    { title: 'Supply Chain Manager', isco: '1324', salary: '$75K–$140K', growth: '+14%', skills: ['ERP (SAP/Oracle)', 'Logistics', 'Procurement', 'Demand Planning'], where: 'LinkedIn · Indeed · APICS Jobs' },
  ],
  trades: [
    { title: 'Electrician', isco: '7411', salary: '$55K–$100K', growth: '+11%', skills: ['NEC/IEE Codes', 'Wiring', 'Blueprint Reading', 'Safety'], where: 'Indeed · TradesWork · LinkedIn' },
    { title: 'Plumber', isco: '7126', salary: '$55K–$95K', growth: '+5%', skills: ['Pipe Fitting', 'Plumbing Codes', 'Blueprints', 'Problem-solving'], where: 'Indeed · TradesWork · Local Unions' },
    { title: 'HVAC Technician', isco: '7127', salary: '$50K–$90K', growth: '+13%', skills: ['AC/Refrigeration', 'EPA 608', 'Diagnostics', 'Electrical'], where: 'Indeed · ACCA · LinkedIn' },
    { title: 'Welder', isco: '7212', salary: '$45K–$90K', growth: '+3%', skills: ['MIG/TIG/Arc', 'Blueprint Reading', 'Metallurgy', 'Safety'], where: 'Indeed · AWS (Welding) · Lincoln Electric Jobs' },
    { title: 'Carpenter', isco: '7115', salary: '$45K–$85K', growth: '+2%', skills: ['Woodworking', 'Power Tools', 'Blueprints', 'Framing'], where: 'Indeed · Local Unions · TradesWork' },
    { title: 'Automotive Technician', isco: '7231', salary: '$45K–$80K', growth: '+2%', skills: ['OBD Diagnostics', 'Engine Repair', 'EV Systems', 'ASE Certs'], where: 'AutoJobCentral · Indeed · LinkedIn' },
    { title: 'Construction Supervisor', isco: '3123', salary: '$60K–$100K', growth: '+4%', skills: ['Safety (OSHA/WHMIS)', 'Scheduling', 'Blueprint Reading', 'Leadership'], where: 'Indeed · AGC Jobs · LinkedIn' },
    { title: 'Wind Turbine Technician', isco: '3131', salary: '$55K–$80K', growth: '+60%', skills: ['Electrical Systems', 'Heights/Rope Access', 'Hydraulics', 'Safety'], where: 'GreenJobs · LinkedIn · Indeed' },
  ],
  creative: [
    { title: 'Graphic Designer', isco: '2166', salary: '$45K–$100K', growth: '+3%', skills: ['Adobe CC', 'Figma', 'Typography', 'Brand Design'], where: 'Behance · Dribbble · 99designs' },
    { title: 'Content Creator / Writer', isco: '2641', salary: '$40K–$100K+', growth: '+4%', skills: ['Writing', 'SEO', 'CMS (WordPress)', 'Social Media'], where: 'Contently · ProBlogger · LinkedIn' },
    { title: 'Video Producer / Editor', isco: '3521', salary: '$50K–$120K', growth: '+11%', skills: ['Premiere Pro', 'After Effects', 'Storytelling', 'Color Grading'], where: 'ProductionHUB · LinkedIn · Mandy.com' },
    { title: 'Social Media Manager', isco: '2431', salary: '$45K–$90K', growth: '+8%', skills: ['Meta/TikTok/LinkedIn', 'Canva', 'Analytics', 'Copywriting'], where: 'LinkedIn · Indeed · CreativePool' },
    { title: 'Photographer', isco: '3431', salary: '$35K–$100K+', growth: '+4%', skills: ['Camera Operation', 'Lightroom/Photoshop', 'Lighting', 'Client Management'], where: 'Freelance · Backstage · LinkedIn' },
    { title: 'Game Developer', isco: '2519', salary: '$75K–$160K', growth: '+14%', skills: ['Unity/Unreal', 'C#/C++', 'Game Design', '3D Modeling'], where: 'Gamasutra Jobs · LinkedIn · Indeed' },
    { title: 'Architect', isco: '2161', salary: '$75K–$150K', growth: '+5%', skills: ['AutoCAD', 'Revit', 'BIM', 'Design'], where: 'Archinect · LinkedIn · Indeed' },
    { title: 'Fashion Designer', isco: '2163', salary: '$40K–$120K+', growth: '+3%', skills: ['Sketching', 'Textiles', 'Pattern Making', 'Adobe Illustrator'], where: 'FashionUnited · WGSN Jobs · LinkedIn' },
  ],
  legal: [
    { title: 'Lawyer / Solicitor', isco: '2611', salary: '$80K–$300K+', growth: '+8%', skills: ['Legal Research', 'Contract Drafting', 'Litigation', 'Client Management'], where: 'LawCrossing · LinkedIn · BCG Search' },
    { title: 'Paralegal', isco: '3411', salary: '$45K–$80K', growth: '+14%', skills: ['Legal Research', 'Document Management', 'Case Prep', 'Writing'], where: 'Indeed · LinkedIn · NALA Jobs' },
    { title: 'Compliance Officer', isco: '3411', salary: '$70K–$140K', growth: '+9%', skills: ['Regulatory Knowledge', 'Risk Assessment', 'Audit', 'Policy Writing'], where: 'LinkedIn · Indeed · ComplianceCrossing' },
    { title: 'Human Rights Officer', isco: '2635', salary: '$50K–$100K', growth: 'Stable', skills: ['International Law', 'Advocacy', 'Research', 'Report Writing'], where: 'UN Jobs (careers.un.org) · LinkedIn · ReliefWeb' },
    { title: 'Policy Analyst', isco: '2422', salary: '$60K–$120K', growth: '+7%', skills: ['Policy Research', 'Data Analysis', 'Stakeholder Engagement', 'Writing'], where: 'Government Jobs · Think Tanks · LinkedIn' },
  ],
  education: [
    { title: 'Primary School Teacher', isco: '2341', salary: '$40K–$80K', growth: '+4%', skills: ['Curriculum Design', 'Classroom Management', 'Assessment', 'Communication'], where: 'tes.com · LinkedIn · Government Ed Boards' },
    { title: 'Corporate Trainer / L&D', isco: '2424', salary: '$55K–$110K', growth: '+8%', skills: ['Instructional Design', 'LMS (Moodle/Cornerstone)', 'Facilitation', 'eLearning'], where: 'LinkedIn · ATD Jobs · Indeed' },
    { title: 'University Lecturer', isco: '2310', salary: '$55K–$120K', growth: '+5%', skills: ['Subject Expertise', 'Research', 'Publication', 'Student Mentoring'], where: 'HigherEdJobs · Times Higher Ed · LinkedIn' },
    { title: 'Special Education Teacher', isco: '2352', salary: '$45K–$85K', growth: '+6%', skills: ['IEP Development', 'Behavior Management', 'Assistive Tech', 'Patience'], where: 'tes.com · Indeed · LinkedIn' },
    { title: 'Online Course Creator', isco: '2356', salary: '$30K–$200K+', growth: '+25%', skills: ['Subject Expertise', 'Video Production', 'Udemy/Teachable', 'Marketing'], where: 'Udemy · Coursera · Skillshare · Self-employed' },
  ],
  science: [
    { title: 'Environmental Scientist', isco: '2133', salary: '$55K–$110K', growth: '+8%', skills: ['GIS', 'Environmental Sampling', 'Data Analysis', 'Report Writing'], where: 'LinkedIn · Indeed · SETAC Jobs' },
    { title: 'Research Scientist', isco: '2131', salary: '$70K–$140K', growth: '+9%', skills: ['Lab Techniques', 'Statistical Analysis', 'Publication', 'Grant Writing'], where: 'Nature Jobs · LinkedIn · ResearchGate' },
    { title: 'Civil Engineer', isco: '2142', salary: '$70K–$130K', growth: '+6%', skills: ['AutoCAD/Civil 3D', 'Structural Analysis', 'Project Mgmt', 'Codes'], where: 'Indeed · LinkedIn · ASCE Jobs' },
    { title: 'Chemical Engineer', isco: '2145', salary: '$80K–$150K', growth: '+10%', skills: ['Process Design', 'Safety (HAZOP)', 'Simulation Software', 'Chemistry'], where: 'AIChE Jobs · LinkedIn · Indeed' },
    { title: 'Geologist / Mining Engineer', isco: '2114', salary: '$75K–$160K', growth: '+8%', skills: ['GIS/ArcGIS', 'Field Work', 'Core Logging', 'Petrography'], where: 'Mining.com Jobs · LinkedIn · Indeed' },
  ],
  service: [
    { title: 'Customer Service Manager', isco: '4222', salary: '$45K–$90K', growth: '+5%', skills: ['CRM', 'Team Leadership', 'Conflict Resolution', 'KPI Reporting'], where: 'Indeed · LinkedIn · Zendesk Jobs' },
    { title: 'Chef / Culinary Professional', isco: '3434', salary: '$40K–$120K', growth: '+8%', skills: ['Culinary Techniques', 'Menu Planning', 'Food Safety', 'Kitchen Mgmt'], where: 'Culinary Agents · Indeed · Poached' },
    { title: 'Hotel Manager', isco: '1411', salary: '$50K–$120K', growth: '+6%', skills: ['PMS Systems', 'Guest Relations', 'F&B Management', 'P&L Oversight'], where: 'HCareers · LinkedIn · Indeed' },
    { title: 'Flight Attendant', isco: '5111', salary: '$45K–$90K', growth: '+11%', skills: ['Safety Procedures', 'Language Skills', 'Customer Service', 'First Aid'], where: 'Airline career pages · LinkedIn · Indeed' },
    { title: 'Social Worker', isco: '2635', salary: '$45K–$80K', growth: '+9%', skills: ['Case Management', 'Advocacy', 'Assessment', 'Report Writing'], where: 'Indeed · LinkedIn · NASW Jobs' },
  ],
  agri: [
    { title: 'Agricultural Manager', isco: '1311', salary: '$50K–$100K', growth: '+6%', skills: ['Farm Management', 'Crop Science', 'Equipment', 'Business Planning'], where: 'AgCareers · LinkedIn · Indeed' },
    { title: 'Agronomist', isco: '2132', salary: '$55K–$95K', growth: '+7%', skills: ['Soil Science', 'Crop Physiology', 'GIS', 'Sustainability'], where: 'AgCareers · LinkedIn · American Society of Agronomy' },
    { title: 'Aquaculture Worker', isco: '6221', salary: '$35K–$70K', growth: '+10%', skills: ['Fish Farming', 'Water Quality', 'Feed Management', 'Biosecurity'], where: 'AgCareers · LinkedIn · FAO Jobs' },
    { title: 'Food Safety Inspector', isco: '3257', salary: '$50K–$90K', growth: '+7%', skills: ['HACCP', 'Food Regulations', 'Auditing', 'Lab Testing'], where: 'Government · LinkedIn · Indeed' },
  ],
}

// ── Scoring engine ────────────────────────────────────────────────────────────
function calculateScore(a) {
  const eduMap = { none:0, primary:2, secondary:5, vocational:8, diploma:10, bachelor:12, master:14, phd:15, professional:15 }
  const expMap = { none:0, intern:4, '1-2':7, '3-5':11, '6-10':15, '11-20':17, '20+':19 }
  const digitalMap = { none:0, basic:1, intermediate:2, advanced:3, technical:4, expert:5 }

  let edu = eduMap[a.education] || 0
  // Recency decay on education
  if (a.gradYear && a.education !== 'none') {
    const yrsAgo = 2026 - parseInt(a.gradYear || 2020)
    if (yrsAgo > 15 && !a.hasCerts) edu = Math.max(edu - 2, 0)
    else if (yrsAgo > 10 && !a.hasCerts) edu = Math.max(edu - 1, 0)
  }
  // Field relevance adjustment
  if (a.studyField && a.targetField && a.studyField !== a.targetField) edu = Math.round(edu * 0.8)

  let exp = expMap[a.experience] || 0
  if (a.expMatch === 'direct') exp = Math.min(exp + 2, W.experience)
  if (a.hasGap) exp = Math.max(exp - 3, 0)

  // Hard skills: 2.5 per skill, max 10 skills, demand bonus
  const highDemand = ['ai','ml','machine learning','cloud','aws','azure','gcp','cybersecurity','data science','blockchain','react','python','kubernetes','devops','node','typescript','swift','kotlin','terraform','rust','golang']
  const tradeBonus = ['electrician','plumber','welder','hvac','carpenter','pipefitter','electrician','machinist']
  let skillCount = Math.min(parseInt(a.skillCount) || 0, 10)
  let hardSkills = skillCount * 2.5
  const skillList = (a.skillList || '').toLowerCase()
  let demandBonus = 0
  highDemand.forEach(s => { if (skillList.includes(s)) demandBonus += 1 })
  tradeBonus.forEach(s => { if (skillList.includes(s)) demandBonus += 1 })
  hardSkills = Math.min(hardSkills + Math.min(demandBonus, 5), W.hardSkills)
  // Recency decay on skills
  if (a.skillRecency === 'old') hardSkills = hardSkills * 0.6
  else if (a.skillRecency === 'mid') hardSkills = hardSkills * 0.8

  const softMap = { none:3, project:6, small:10, large:13, executive:15 }
  let softSkills = softMap[a.leadership] || 3
  if (a.strongComms) softSkills = Math.min(softSkills + 3, W.softSkills)
  if (a.problemSolving) softSkills = Math.min(softSkills + 2, W.softSkills)

  const langMap = { one:3, two:7, three:10 }
  let languages = langMap[a.languages] || 3
  if (a.englishBonus) languages = Math.min(languages + 1, W.languages)

  const certCountMap = { none:0, one:4, few:7, many:10 }
  let certs = certCountMap[a.certCount] || 0
  if (a.globalCert) certs = Math.min(certs + 2, W.certs)

  let digital = digitalMap[a.digital] || 0

  const raw = edu + exp + hardSkills + softSkills + languages + certs + digital

  // Market reality adjustments
  let adj = 0
  const country = (a.country || '').toLowerCase()
  const field = a.targetField || 'tech'
  // Demand bonus
  const highDemandCountries = { tech: ['canada','australia','germany','usa','uk','singapore'], health: ['canada','australia','uk','usa','germany','new zealand'], trades: ['australia','canada','usa','germany','uk'] }
  if (highDemandCountries[field] && highDemandCountries[field].some(c => country.includes(c))) adj += 4
  // Career change penalty (honest)
  if (a.isCareerChange && a.studyField !== a.targetField) adj -= 4
  // Employment gap
  if (a.hasGap && a.gapReason === 'unexplained') adj -= 3
  // Age-appropriate bonus for trades (shortage for 45+)
  if (a.ageGroup === '45-54' && ['trades','health'].includes(field)) adj += 2

  const final = Math.min(Math.max(Math.round(raw + adj), 5), 98)
  return {
    final,
    breakdown: {
      education: Math.round(edu),
      experience: Math.round(exp),
      hardSkills: Math.round(hardSkills),
      softSkills: Math.round(softSkills),
      languages: Math.round(languages),
      certs: Math.round(certs),
      digital: Math.round(digital),
    },
    label: final >= 85 ? '🏆 Expert / Elite' : final >= 70 ? '⭐ Highly Competitive' : final >= 55 ? '✅ Competitive' : final >= 40 ? '📈 Developing' : final >= 25 ? '🌱 Building' : final >= 10 ? '🚀 Starting' : '💡 Zero to Hero',
    color: final >= 70 ? '#38EF7D' : final >= 50 ? '#FACF39' : final >= 30 ? '#FF9A3C' : '#FF6B6B',
    marketMsg: final >= 70 ? 'Strong candidate. Apply with confidence.' : final >= 50 ? 'Competitive — targeted upskilling closes gaps fast.' : final >= 30 ? 'Entry-level ready. 1–2 certs + projects will accelerate you.' : 'Foundation stage. Start with free resources and build momentum.',
  }
}

function getCareerRecs(answers, scoreResult) {
  const pool = CAREERS[answers.targetField] || CAREERS.tech
  const score = scoreResult.final
  // Sort by relevance to score
  const recs = pool.map(c => {
    const minSalNum = parseInt((c.salary.match(/\$(\d+)K/) || [])[1] || 60)
    const matchScore = score >= 70 ? 90 + Math.floor(Math.random()*8) :
                       score >= 50 ? 72 + Math.floor(Math.random()*15) :
                       score >= 30 ? 55 + Math.floor(Math.random()*18) :
                                      35 + Math.floor(Math.random()*22)
    return { ...c, matchScore }
  }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 5)
  return recs
}

// ── Age-specific messages ─────────────────────────────────────────────────────
function getAgeMessage(ageGroup) {
  const msgs = {
    'under-18': { headline: 'Explorer Mode 🌟', msg: 'Your career hasn\'t started — and that\'s the best position to be in. Focus on discovering what excites you. Every expert was once in your exact spot.' },
    '18-24':    { headline: 'Launcher Mode 🚀', msg: 'This is your highest ROI decade. Skills you build now compound for 40 years. Consider trades — a licensed electrician earns more than most graduates by age 25.' },
    '25-34':    { headline: 'Builder Mode ⚡', msg: 'Peak upskilling window. One strategic certification or project can add $15K–$30K to your salary. Don\'t just work — build your reputation.' },
    '35-44':    { headline: 'Optimizer Mode 🎯', msg: 'Your experience is now your greatest asset. Focus on senior/leadership roles where your judgment and track record outweigh raw skills.' },
    '45-54':    { headline: 'Reinventor Mode 💼', msg: 'Age bias is real — but so is the experience premium. Target companies that value wisdom. Network-first strategy beats applications here.' },
    '55-64':    { headline: 'Senior Expert Mode 🌐', msg: 'The consulting economy was made for you. Your decades of context are worth more than any certificate. Consider fractional/advisory roles.' },
    '65+':      { headline: 'Wisdom Path 🌿', msg: 'Purpose-driven work, mentoring, and flexible roles are your arena. Your knowledge is rare and irreplaceable — share it strategically.' },
  }
  return msgs[ageGroup] || msgs['25-34']
}

// ── Gap analysis ──────────────────────────────────────────────────────────────
function getGaps(answers, scoreResult) {
  const gaps = []
  const { breakdown } = scoreResult
  if (breakdown.digital < 3) gaps.push({ gap: 'Digital Skills', action: 'Take a free Google Digital Garage course (learndigital.withgoogle.com)', time: '1–2 weeks', impact: 'High' })
  if (breakdown.certs < 4) gaps.push({ gap: 'No Recognized Certification', action: `Get 1 entry cert in ${answers.targetField === 'tech' ? 'CompTIA IT Fundamentals or Google IT Cert' : answers.targetField === 'health' ? 'First Aid/CPR + Basic Life Support' : 'Google Project Management or HubSpot'}`, time: '4–12 weeks', impact: 'High' })
  if (breakdown.experience < 7) gaps.push({ gap: 'Limited Work Experience', action: 'Apply for 3 volunteer positions or freelance projects this week. Unpaid experience beats no experience.', time: 'Start immediately', impact: 'High' })
  if (breakdown.languages < 7) gaps.push({ gap: 'Single Language', action: 'Start Duolingo + 15 min/day of English practice (or target market language)', time: '3–6 months for basics', impact: 'Medium' })
  if (breakdown.hardSkills < 15) gaps.push({ gap: 'Skills Not Yet Market-Ready', action: 'Complete 1 project showcasing your top 3 skills and post it publicly (GitHub, Behance, LinkedIn)', time: '2–4 weeks', impact: 'Very High' })
  return gaps.slice(0, 4)
}

// ── Quick wins ────────────────────────────────────────────────────────────────
function getQuickWins(answers) {
  return [
    { action: 'Update your LinkedIn headline with your target role title (not current job)', time: '5 minutes', icon: '💼' },
    { action: `Connect with 5 recruiters in ${answers.targetField || 'your field'} on LinkedIn TODAY — use our Cold Outreach tool for scripts`, time: '20 minutes', icon: '🤝' },
    { action: 'Apply to 3 jobs that feel like a "stretch" — confidence builds by doing', time: '45 minutes', icon: '🎯' },
    { action: 'Save your Score Card below and share with a mentor for feedback', time: '2 minutes', icon: '📊' },
  ]
}

// ── Step data ─────────────────────────────────────────────────────────────────
const STEP_TITLES = [
  { id: 0, title: 'About You', icon: '👤', desc: 'Let\'s personalise your assessment' },
  { id: 1, title: 'Education', icon: '🎓', desc: 'Your academic background' },
  { id: 2, title: 'Experience', icon: '💼', desc: 'Your work history and skills' },
  { id: 3, title: 'Your Skills', icon: '⚡', desc: 'What you bring to the table' },
  { id: 4, title: 'Your Goals', icon: '🚀', desc: 'Where you want to go' },
]

const COUNTRIES = ['Afghanistan','Albania','Algeria','Angola','Argentina','Armenia','Australia','Austria','Azerbaijan','Bahrain','Bangladesh','Belgium','Brazil','Bulgaria','Cambodia','Canada','Chile','China','Colombia','Croatia','Czech Republic','Denmark','Ecuador','Egypt','Ethiopia','Finland','France','Germany','Ghana','Greece','Guatemala','Hungary','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kuwait','Lebanon','Libya','Malaysia','Mexico','Morocco','Myanmar','Netherlands','New Zealand','Nigeria','Norway','Oman','Pakistan','Palestine','Panama','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia','Saudi Arabia','Senegal','Serbia','Singapore','South Africa','South Korea','Spain','Sri Lanka','Sudan','Sweden','Switzerland','Syria','Taiwan','Tanzania','Thailand','Tunisia','Turkey','UAE','Uganda','Ukraine','United Kingdom','United States','Uruguay','Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe','Other']

const FIELDS = [
  { value: 'tech', label: '💻 Technology & IT' },
  { value: 'health', label: '🏥 Healthcare & Medicine' },
  { value: 'business', label: '📊 Business, Finance & Management' },
  { value: 'trades', label: '🔧 Skilled Trades & Engineering' },
  { value: 'creative', label: '🎨 Creative, Media & Design' },
  { value: 'legal', label: '⚖️ Legal, Compliance & Government' },
  { value: 'education', label: '📚 Education & Training' },
  { value: 'science', label: '🔬 Science, Research & Environment' },
  { value: 'service', label: '🛎️ Hospitality, Tourism & Service' },
  { value: 'agri', label: '🌾 Agriculture, Food & Environment' },
]

// ── Styles ────────────────────────────────────────────────────────────────────
const glass = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 18, padding: '24px 28px', backdropFilter: 'blur(12px)' }
const inputStyle = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' }
const labelStyle = { fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }
const radioGroupStyle = { display: 'flex', flexWrap: 'wrap', gap: 8 }

function RadioChip({ name, value, label, selected, onChange }) {
  return (
    <label style={{ cursor: 'pointer' }}>
      <input type="radio" name={name} value={value} checked={selected} onChange={() => onChange(value)} style={{ display: 'none' }} />
      <span style={{
        display: 'inline-block', padding: '8px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
        background: selected ? 'linear-gradient(135deg,#00C6FF,#0072FF)' : 'rgba(255,255,255,0.07)',
        border: `1px solid ${selected ? 'transparent' : 'rgba(255,255,255,0.15)'}`,
        color: selected ? '#fff' : 'rgba(255,255,255,0.65)',
        transition: 'all .2s', boxShadow: selected ? '0 4px 16px rgba(0,114,255,0.4)' : 'none',
      }}>{label}</span>
    </label>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AssessPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ languages: 'one', digital: 'intermediate', leadership: 'none', certCount: 'none', skillCount: '3', experience: 'none', education: 'secondary', ageGroup: '25-34', targetField: 'tech', skillRecency: 'recent', expMatch: 'related' })
  const [scoreResult, setScoreResult] = useState(null)
  const [careers, setCareers] = useState([])
  const [gaps, setGaps] = useState([])
  const [quickWins, setQuickWins] = useState([])
  const [gaugeAnim, setGaugeAnim] = useState(0)

  const set = (key, val) => setAnswers(p => ({ ...p, [key]: val }))

  function handleFinish() {
    const result = calculateScore(answers)
    const recs = getCareerRecs(answers, result)
    const gapList = getGaps(answers, result)
    const wins = getQuickWins(answers)
    setScoreResult(result)
    setCareers(recs)
    setGaps(gapList)
    setQuickWins(wins)
    setTimeout(() => setGaugeAnim(result.final), 300)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function restart() {
    setScoreResult(null)
    setGaugeAnim(0)
    setStep(0)
    setAnswers({ languages: 'one', digital: 'intermediate', leadership: 'none', certCount: 'none', skillCount: '3', experience: 'none', education: 'secondary', ageGroup: '25-34', targetField: 'tech', skillRecency: 'recent', expMatch: 'related' })
  }

  const isLastStep = step === STEP_TITLES.length - 1

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#0F0C29,#302B63,#24243E)', color: '#fff', fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      {/* Rainbow bar */}
      <div style={{ height: 5, background: 'linear-gradient(90deg,#FF0099,#FACF39,#00AEEF,#38EF7D,#FF6B35)' }} />

      {/* Nav */}
      <nav style={{ padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🎯</span>
          <span style={{ fontWeight: 900, fontSize: 16, background: 'linear-gradient(135deg,#FF0099,#FACF39,#00AEEF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Alfalah AI</span>
        </Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: 600 }}>Resume Analyzer</Link>
          <span style={{ padding: '6px 14px', borderRadius: 20, background: 'linear-gradient(135deg,#00C6FF,#0072FF)', fontSize: 12, fontWeight: 800 }}>Skills Assessment</span>
        </div>
      </nav>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '32px 16px 60px' }}>

        {/* ── RESULTS ─────────────────────────────────────────────────────── */}
        {scoreResult ? (
          <div style={{ animation: 'none' }}>
            {/* Score Hero */}
            <div style={{ ...glass, textAlign: 'center', marginBottom: 24, background: 'linear-gradient(135deg,rgba(0,114,255,0.12),rgba(56,239,125,0.08))' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#FACF39', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Your Career Readiness Score</div>

              {/* Gauge circle */}
              <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="180" height="180" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
                  <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
                  <circle cx="90" cy="90" r="80" fill="none" stroke={scoreResult.color} strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 80}`}
                    strokeDashoffset={`${2 * Math.PI * 80 * (1 - gaugeAnim / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1.5s ease', filter: `drop-shadow(0 0 8px ${scoreResult.color})` }}
                  />
                </svg>
                <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 52, fontWeight: 900, color: scoreResult.color, lineHeight: 1, transition: 'color .5s' }}>{gaugeAnim}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>out of 100</div>
                </div>
              </div>

              <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>{scoreResult.label}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', maxWidth: 460, margin: '0 auto 20px', lineHeight: 1.6 }}>{scoreResult.marketMsg}</div>

              {/* Age message */}
              {answers.ageGroup && (() => {
                const am = getAgeMessage(answers.ageGroup)
                return (
                  <div style={{ padding: '14px 20px', borderRadius: 12, background: 'rgba(250,207,57,0.08)', border: '1px solid rgba(250,207,57,0.2)', textAlign: 'left', maxWidth: 500, margin: '0 auto' }}>
                    <div style={{ fontWeight: 800, color: '#FACF39', marginBottom: 4, fontSize: 13 }}>{am.headline}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{am.msg}</div>
                  </div>
                )
              })()}
            </div>

            {/* Score breakdown */}
            <div style={{ ...glass, marginBottom: 24 }}>
              <h2 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 800, background: 'linear-gradient(90deg,#00C6FF,#0072FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📊 Score Breakdown</h2>
              {[
                { label: 'Education & Training', key: 'education', max: W.education, icon: '🎓' },
                { label: 'Work Experience', key: 'experience', max: W.experience, icon: '💼' },
                { label: 'Hard / Technical Skills', key: 'hardSkills', max: W.hardSkills, icon: '⚡' },
                { label: 'Soft Skills & Leadership', key: 'softSkills', max: W.softSkills, icon: '🤝' },
                { label: 'Languages', key: 'languages', max: W.languages, icon: '🌍' },
                { label: 'Certifications', key: 'certs', max: W.certs, icon: '🏆' },
                { label: 'Digital Literacy', key: 'digital', max: W.digital, icon: '💻' },
              ].map(({ label, key, max, icon }) => {
                const val = scoreResult.breakdown[key]
                const pct = Math.round((val / max) * 100)
                const color = pct >= 70 ? '#38EF7D' : pct >= 45 ? '#FACF39' : '#FF6B6B'
                return (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>{icon} {label}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color }}>{val}/{max}</span>
                    </div>
                    <div style={{ height: 7, borderRadius: 10, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 10, width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}88)`, transition: 'width 1s ease', boxShadow: `0 0 8px ${color}66` }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Career Recommendations */}
            <div style={{ ...glass, marginBottom: 24 }}>
              <h2 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 800, background: 'linear-gradient(90deg,#38EF7D,#00AEEF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🎯 Your Top 5 Career Matches</h2>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '0 0 18px' }}>Based on your score, field, and country. Salary ranges are approximate USD equivalents.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {careers.map((c, i) => (
                  <div key={i} style={{ padding: '16px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: i === 0 ? 'linear-gradient(135deg,#FACF39,#FF6B35)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, flexShrink: 0 }}>
                      {i === 0 ? '🥇' : `#${i+1}`}
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 3 }}>{c.title}</div>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8, fontSize: 12 }}>
                        <span style={{ color: '#38EF7D', fontWeight: 700 }}>💰 {c.salary}</span>
                        <span style={{ color: '#00AEEF', fontWeight: 700 }}>📈 {c.growth} growth</span>
                        <span style={{ color: 'rgba(255,255,255,0.35)' }}>ISCO {c.isco}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 6 }}>
                        <strong style={{ color: 'rgba(255,255,255,0.7)' }}>Key skills:</strong> {c.skills.join(' · ')}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>🔍 Find jobs: {c.where}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: c.matchScore >= 80 ? '#38EF7D' : c.matchScore >= 60 ? '#FACF39' : '#FF9A3C' }}>{c.matchScore}%</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>MATCH</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Gaps */}
            {gaps.length > 0 && (
              <div style={{ ...glass, marginBottom: 24, border: '1px solid rgba(255,107,107,0.25)' }}>
                <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800, color: '#FF9A3C' }}>🔴 Priority Skill Gaps — Close These First</h2>
                {gaps.map((g, i) => (
                  <div key={i} style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,100,100,0.06)', border: '1px solid rgba(255,100,100,0.15)', marginBottom: 10 }}>
                    <div style={{ fontWeight: 800, color: '#FF9A3C', marginBottom: 4, fontSize: 13 }}>Gap: {g.gap}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>✅ Fix: {g.action}</div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>⏱ {g.time}</span>
                      <span style={{ color: g.impact === 'Very High' || g.impact === 'High' ? '#38EF7D' : '#FACF39', fontWeight: 700 }}>Impact: {g.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Wins */}
            <div style={{ ...glass, marginBottom: 24, background: 'linear-gradient(135deg,rgba(56,239,125,0.07),rgba(0,174,239,0.05))' }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800, color: '#38EF7D' }}>⚡ 4 Quick Wins — Do These Today</h2>
              {quickWins.map((w, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(56,239,125,0.05)' }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{w.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{w.action}</div>
                    <div style={{ fontSize: 11, color: '#38EF7D', marginTop: 3, fontWeight: 700 }}>⏱ {w.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA to Resume Analyzer */}
            <div style={{ ...glass, textAlign: 'center', background: 'linear-gradient(135deg,rgba(255,0,153,0.08),rgba(0,174,239,0.08))' }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>🚀</div>
              <h3 style={{ margin: '0 0 8px', fontWeight: 900 }}>Ready to go deeper?</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: '0 0 18px' }}>Use the full AI Resume Analyzer to get your ATS score, cover letter, interview prep, salary strategy, and 14 more tools — all in one click.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/" style={{ padding: '12px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#FF0099,#FACF39)', color: '#000', fontWeight: 800, fontSize: 14, textDecoration: 'none', boxShadow: '0 6px 24px rgba(255,0,153,0.35)' }}>
                  🎯 Analyze My Resume — 17 AI Tools
                </Link>
                <button onClick={restart} style={{ padding: '12px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  🔄 Retake Assessment
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ── ASSESSMENT STEPS ────────────────────────────────────────────── */
          <div>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ display: 'inline-block', padding: '4px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#FACF39', marginBottom: 14 }}>
                FREE · 5 MIN · NO LOGIN
              </div>
              <h1 style={{ fontSize: 'clamp(1.8rem,6vw,3.2rem)', fontWeight: 900, margin: '0 0 10px', background: 'linear-gradient(135deg,#FF0099,#FACF39,#00AEEF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
                Skills Assessment
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
                Get your honest, market-calibrated Career Readiness Score. Age 10 to 100. Every field. Every country.
              </p>
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                {STEP_TITLES.map((s, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: i < step ? 'linear-gradient(135deg,#38EF7D,#11998E)' : i === step ? 'linear-gradient(135deg,#00C6FF,#0072FF)' : 'rgba(255,255,255,0.08)',
                      border: i === step ? '2px solid rgba(0,198,255,0.6)' : '2px solid transparent',
                      fontSize: i < step ? 16 : 14, fontWeight: 700,
                      boxShadow: i === step ? '0 0 16px rgba(0,198,255,0.5)' : 'none',
                      transition: 'all .3s',
                    }}>
                      {i < step ? '✓' : s.icon}
                    </div>
                    <span style={{ fontSize: 10, color: i === step ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: i === step ? 700 : 400, textAlign: 'center', display: 'none' }}>{s.title}</span>
                  </div>
                ))}
              </div>
              <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg,#00C6FF,#38EF7D)', width: `${(step / (STEP_TITLES.length - 1)) * 100}%`, transition: 'width .4s ease' }} />
              </div>
              <div style={{ textAlign: 'center', marginTop: 10 }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>Step {step + 1} of {STEP_TITLES.length} — {STEP_TITLES[step].title}</span>
              </div>
            </div>

            {/* Step card */}
            <div style={{ ...glass, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                <span style={{ fontSize: 28 }}>{STEP_TITLES[step].icon}</span>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 18 }}>{STEP_TITLES[step].title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{STEP_TITLES[step].desc}</div>
                </div>
              </div>

              {/* ── STEP 0: About You ── */}
              {step === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  <div>
                    <label style={labelStyle}>Your Age Group</label>
                    <div style={radioGroupStyle}>
                      {[['under-18','Under 18'],['18-24','18–24'],['25-34','25–34'],['35-44','35–44'],['45-54','45–54'],['55-64','55–64'],['65+','65+']].map(([v,l]) => (
                        <RadioChip key={v} name="ageGroup" value={v} label={l} selected={answers.ageGroup===v} onChange={v=>set('ageGroup',v)} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Your Country</label>
                    <select value={answers.country||''} onChange={e=>set('country',e.target.value)} style={{ ...inputStyle, background: 'rgba(20,15,45,0.95)' }}>
                      <option value="">Select your country...</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Target Career Field</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 8 }}>
                      {FIELDS.map(({ value, label }) => (
                        <label key={value} style={{ cursor: 'pointer' }}>
                          <input type="radio" name="targetField" value={value} checked={answers.targetField===value} onChange={() => set('targetField', value)} style={{ display: 'none' }} />
                          <span style={{
                            display: 'block', padding: '10px 14px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                            background: answers.targetField===value ? 'linear-gradient(135deg,rgba(0,198,255,0.25),rgba(0,114,255,0.15))' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${answers.targetField===value ? 'rgba(0,198,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
                            color: answers.targetField===value ? '#fff' : 'rgba(255,255,255,0.6)',
                            transition: 'all .2s',
                          }}>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Career Goal</label>
                    <div style={radioGroupStyle}>
                      {[['first-job','🎯 First job'],['promoted','📈 Get promoted'],['change','🔄 Career change'],['freelance','💼 Go freelance'],['abroad','✈️ Work abroad'],['upskill','📚 Upskill only']].map(([v,l]) => (
                        <RadioChip key={v} name="careerGoal" value={v} label={l} selected={answers.careerGoal===v} onChange={v=>set('careerGoal',v)} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 1: Education ── */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  <div>
                    <label style={labelStyle}>Highest Education Level</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[['none','No formal education'],['primary','Primary school'],['secondary','High school / Secondary'],['vocational','Vocational / Trade certification'],['diploma','Diploma / Associate degree'],['bachelor','Bachelor\'s degree'],['master','Master\'s degree / MBA'],['phd','PhD'],['professional','Professional degree (MD, JD, etc.)']].map(([v,l]) => (
                        <label key={v} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                          <input type="radio" name="education" value={v} checked={answers.education===v} onChange={()=>set('education',v)} style={{ accentColor: '#00C6FF', width: 16, height: 16 }} />
                          <span style={{ fontSize: 14, color: answers.education===v ? '#fff' : 'rgba(255,255,255,0.65)', fontWeight: answers.education===v ? 700 : 400 }}>{l}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Field of Study (if applicable)</label>
                    <input value={answers.studyField||''} onChange={e=>set('studyField',e.target.value)} placeholder="e.g. Computer Science, Nursing, Mechanical Engineering, Business..." style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Approximately when did you complete your education?</label>
                    <div style={radioGroupStyle}>
                      {[['2023','2023+'],['2020','2020–2022'],['2015','2015–2019'],['2010','2010–2014'],['2005','2005–2009'],['before2005','Before 2005']].map(([v,l]) => (
                        <RadioChip key={v} name="gradYear" value={v} label={l} selected={answers.gradYear===v} onChange={v=>set('gradYear',v)} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Have you done any recent training, courses, or self-study? (last 3 years)</label>
                    <div style={radioGroupStyle}>
                      {[['yes','Yes, actively upskilling'],['some','A few online courses'],['no','No recent training']].map(([v,l]) => (
                        <RadioChip key={v} name="recentTraining" value={v} label={l} selected={answers.recentTraining===v} onChange={v=>set('recentTraining',v)} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Experience ── */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  <div>
                    <label style={labelStyle}>Total Work Experience</label>
                    <div style={radioGroupStyle}>
                      {[['none','None yet'],['intern','Internship/<1yr'],['1-2','1–2 years'],['3-5','3–5 years'],['6-10','6–10 years'],['11-20','11–20 years'],['20+','20+ years']].map(([v,l]) => (
                        <RadioChip key={v} name="experience" value={v} label={l} selected={answers.experience===v} onChange={v=>set('experience',v)} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Is your experience in your target career field?</label>
                    <div style={radioGroupStyle}>
                      {[['direct','Yes — direct match'],['related','Related / adjacent'],['unrelated','Completely different'],['none','No experience yet']].map(([v,l]) => (
                        <RadioChip key={v} name="expMatch" value={v} label={l} selected={answers.expMatch===v} onChange={v=>set('expMatch',v)} />
                      ))}
                    </div>
                    {answers.expMatch === 'unrelated' && <div style={{ marginTop: 8, padding: '10px 14px', borderRadius: 10, background: 'rgba(250,207,57,0.08)', border: '1px solid rgba(250,207,57,0.2)', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>💡 Career changes are very achievable — we'll identify your transferable skills and map a realistic pivot plan.</div>}
                  </div>
                  <div>
                    <label style={labelStyle}>Any significant employment gaps? (6+ months)</label>
                    <div style={radioGroupStyle}>
                      {[['no','No gaps'],['family','Yes — family care'],['health','Yes — health reasons'],['study','Yes — studying'],['other','Yes — other']].map(([v,l]) => (
                        <RadioChip key={v} name="hasGapRaw" value={v} label={l} selected={answers.hasGapRaw===v} onChange={v=>{set('hasGapRaw',v);set('hasGap',v!=='no');set('gapReason',v==='other'?'unexplained':'explained')}} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Current or most recent job level</label>
                    <div style={radioGroupStyle}>
                      {[['student','Student'],['entry','Entry / Junior'],['mid','Mid-level'],['senior','Senior'],['manager','Manager / Team Lead'],['executive','Director / Executive'],['self','Self-employed / Freelancer']].map(([v,l]) => (
                        <RadioChip key={v} name="jobLevel" value={v} label={l} selected={answers.jobLevel===v} onChange={v=>set('jobLevel',v)} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Skills ── */}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  <div>
                    <label style={labelStyle}>List your top skills (comma-separated)</label>
                    <textarea value={answers.skillList||''} onChange={e=>set('skillList',e.target.value)} placeholder="e.g. Python, SQL, Machine Learning, Project Management, AutoCAD, Patient Care, Welding..." rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>Be specific — "React.js" scores better than "coding". In-demand skills get automatic bonus points.</p>
                  </div>
                  <div>
                    <label style={labelStyle}>How many distinct skills do you have? (honest count)</label>
                    <div style={radioGroupStyle}>
                      {[['1','1–2'],['3','3–5'],['6','6–8'],['9','9–10+']].map(([v,l]) => (
                        <RadioChip key={v} name="skillCount" value={v} label={l} selected={answers.skillCount===v} onChange={v=>set('skillCount',v)} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>How recently have you used your main skills?</label>
                    <div style={radioGroupStyle}>
                      {[['recent','Actively using now'],['mid','Used 2–4 years ago'],['old','Haven\'t used in 5+ years']].map(([v,l]) => (
                        <RadioChip key={v} name="skillRecency" value={v} label={l} selected={answers.skillRecency===v} onChange={v=>set('skillRecency',v)} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Digital literacy level</label>
                    <div style={radioGroupStyle}>
                      {[['none','None'],['basic','Basic (email/social)'],['intermediate','Intermediate (Office/Google)'],['advanced','Advanced (software/analytics)'],['technical','Technical (coding/databases)'],['expert','Expert (AI tools/cloud/dev)']].map(([v,l]) => (
                        <RadioChip key={v} name="digital" value={v} label={l} selected={answers.digital===v} onChange={v=>set('digital',v)} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Languages you speak</label>
                    <div style={radioGroupStyle}>
                      {[['one','1 language'],['two','2 languages'],['three','3+ languages']].map(([v,l]) => (
                        <RadioChip key={v} name="languages" value={v} label={l} selected={answers.languages===v} onChange={v=>set('languages',v)} />
                      ))}
                    </div>
                    <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input type="checkbox" id="engBonus" checked={!!answers.englishBonus} onChange={e=>set('englishBonus',e.target.checked)} style={{ width: 16, height: 16, accentColor: '#00C6FF' }} />
                      <label htmlFor="engBonus" style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', cursor: 'pointer' }}>English is not my first language but I am proficient (+1 market bonus)</label>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 4: Goals ── */}
              {step === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  <div>
                    <label style={labelStyle}>Leadership experience</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[['none','No leadership experience yet'],['project','Led projects or initiatives'],['small','Managed a small team (1–5 people)'],['large','Managed a large team (6+ people)'],['executive','Executive / organizational leadership']].map(([v,l]) => (
                        <label key={v} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                          <input type="radio" name="leadership" value={v} checked={answers.leadership===v} onChange={()=>set('leadership',v)} style={{ accentColor: '#00C6FF', width: 16, height: 16 }} />
                          <span style={{ fontSize: 14, color: answers.leadership===v ? '#fff' : 'rgba(255,255,255,0.65)', fontWeight: answers.leadership===v ? 700 : 400 }}>{l}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Professional certifications held</label>
                    <div style={radioGroupStyle}>
                      {[['none','None'],['one','1 cert'],['few','2–3 certs'],['many','4+ certs']].map(([v,l]) => (
                        <RadioChip key={v} name="certCount" value={v} label={l} selected={answers.certCount===v} onChange={v=>set('certCount',v)} />
                      ))}
                    </div>
                    <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input type="checkbox" id="globalCert" checked={!!answers.globalCert} onChange={e=>set('globalCert',e.target.checked)} style={{ width: 16, height: 16, accentColor: '#00C6FF' }} />
                      <label htmlFor="globalCert" style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', cursor: 'pointer' }}>I hold a globally recognised certification (AWS, PMP, CPA, CISA, CompTIA, etc.) +2 bonus</label>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Strong communication and presentation skills?</label>
                    <div style={radioGroupStyle}>
                      {[['yes','Yes — confident presenter'],['some','Some — improving'],['no','Not yet']].map(([v,l]) => (
                        <RadioChip key={v} name="comms" value={v} label={l} selected={answers.commsRaw===v} onChange={v=>{set('commsRaw',v);set('strongComms',v==='yes')}} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Problem-solving — do people come to you for solutions?</label>
                    <div style={radioGroupStyle}>
                      {[['yes','Yes — I\'m a go-to solver'],['sometimes','Sometimes'],['not-yet','Not often yet']].map(([v,l]) => (
                        <RadioChip key={v} name="ps" value={v} label={l} selected={answers.psRaw===v} onChange={v=>{set('psRaw',v);set('problemSolving',v==='yes')}} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Is this a career change? (Switching to a completely new field)</label>
                    <div style={radioGroupStyle}>
                      {[['yes','Yes — career change'],['no','No — staying in my field'],['partly','Partial pivot']].map(([v,l]) => (
                        <RadioChip key={v} name="cc" value={v} label={l} selected={answers.ccRaw===v} onChange={v=>{set('ccRaw',v);set('isCareerChange',v==='yes')}} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              {step > 0 ? (
                <button onClick={() => setStep(s => s - 1)} style={{ padding: '13px 28px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  ← Back
                </button>
              ) : <div />}
              {isLastStep ? (
                <button onClick={handleFinish} style={{ padding: '13px 36px', borderRadius: 12, background: 'linear-gradient(135deg,#38EF7D,#11998E)', color: '#001a0e', fontWeight: 900, fontSize: 16, border: 'none', cursor: 'pointer', boxShadow: '0 6px 28px rgba(56,239,125,0.45)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  🎯 Get My Score
                </button>
              ) : (
                <button onClick={() => setStep(s => s + 1)} style={{ padding: '13px 32px', borderRadius: 12, background: 'linear-gradient(135deg,#00C6FF,#0072FF)', color: '#fff', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(0,114,255,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  Next →
                </button>
              )}
            </div>

            {/* Footer note */}
            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 24 }}>
              100% free · No account required · Zero data stored · Powered by ILO ISCO-08 + BLS 2026 data
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
