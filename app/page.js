'use client'

import { useState, useRef, useEffect, useMemo } from 'react'

// ── Constants ──────────────────────────────────────────────────────────────────
const MAX_PASTE_CHARS = 12000

// ── LANGUAGE SYSTEM (disabled — English only for now, re-enable later) ────────
/* LANGUAGES list kept for future multilingual release — do not delete
const LANGUAGES = [
  { code: 'en', label: 'English',     flag: '🇬🇧', speakers: '1.5B' },
  { code: 'zh', label: 'Chinese',     flag: '🇨🇳', speakers: '1.1B' },
  { code: 'hi', label: 'Hindi',       flag: '🇮🇳', speakers: '611M' },
  { code: 'es', label: 'Spanish',     flag: '🇪🇸', speakers: '561M' },
  { code: 'ar', label: 'Arabic',      flag: '🇸🇦', speakers: '335M' },
  { code: 'fr', label: 'French',      flag: '🇫🇷', speakers: '312M' },
  { code: 'bn', label: 'Bengali',     flag: '🇧🇩', speakers: '278M' },
  { code: 'pt', label: 'Portuguese',  flag: '🇧🇷', speakers: '269M' },
  { code: 'ru', label: 'Russian',     flag: '🇷🇺', speakers: '255M' },
  { code: 'id', label: 'Indonesian',  flag: '🇮🇩', speakers: '252M' },
  { code: 'ur', label: 'Urdu',        flag: '🇵🇰', speakers: '238M' },
]
*/
const CLIENT_HOURLY_LIMIT = 9999  // disabled for dev
const HOUR_MS = 3_600_000
const BACKOFF_HOURS = [1, 3, 6]

// ── Country picker data ────────────────────────────────────────────────────────
const COUNTRY_PICKER = [
  { name: 'Canada',               code: 'CA', flag: '🇨🇦' },
  { name: 'United States',        code: 'US', flag: '🇺🇸' },
  { name: 'United Kingdom',       code: 'GB', flag: '🇬🇧' },
  { name: 'Australia',            code: 'AU', flag: '🇦🇺' },
  { name: 'India',                code: 'IN', flag: '🇮🇳' },
  { name: 'Pakistan',             code: 'PK', flag: '🇵🇰' },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪' },
  { name: 'Germany',              code: 'DE', flag: '🇩🇪' },
  { name: 'Singapore',            code: 'SG', flag: '🇸🇬' },
  { name: 'Nigeria',              code: 'NG', flag: '🇳🇬' },
  { name: 'South Africa',         code: 'ZA', flag: '🇿🇦' },
  { name: 'New Zealand',          code: 'NZ', flag: '🇳🇿' },
  { name: 'France',               code: 'FR', flag: '🇫🇷' },
  { name: 'Netherlands',          code: 'NL', flag: '🇳🇱' },
  { name: 'Sweden',               code: 'SE', flag: '🇸🇪' },
  { name: 'Saudi Arabia',         code: 'SA', flag: '🇸🇦' },
  { name: 'Bangladesh',           code: 'BD', flag: '🇧🇩' },
  { name: 'Philippines',          code: 'PH', flag: '🇵🇭' },
  { name: 'Brazil',               code: 'BR', flag: '🇧🇷' },
  { name: 'Other / Global',       code: 'GL', flag: '🌍' },
]

// ── Full 195 UN countries (ISO-2 code + name, flag generated dynamically) ────
const COUNTRY_LIST_195 = [
  {n:'Afghanistan',c:'AF'},{n:'Albania',c:'AL'},{n:'Algeria',c:'DZ'},{n:'Andorra',c:'AD'},
  {n:'Angola',c:'AO'},{n:'Antigua & Barbuda',c:'AG'},{n:'Argentina',c:'AR'},{n:'Armenia',c:'AM'},
  {n:'Australia',c:'AU'},{n:'Austria',c:'AT'},{n:'Azerbaijan',c:'AZ'},{n:'Bahamas',c:'BS'},
  {n:'Bahrain',c:'BH'},{n:'Bangladesh',c:'BD'},{n:'Barbados',c:'BB'},{n:'Belarus',c:'BY'},
  {n:'Belgium',c:'BE'},{n:'Belize',c:'BZ'},{n:'Benin',c:'BJ'},{n:'Bhutan',c:'BT'},
  {n:'Bolivia',c:'BO'},{n:'Bosnia & Herzegovina',c:'BA'},{n:'Botswana',c:'BW'},{n:'Brazil',c:'BR'},
  {n:'Brunei',c:'BN'},{n:'Bulgaria',c:'BG'},{n:'Burkina Faso',c:'BF'},{n:'Burundi',c:'BI'},
  {n:'Cabo Verde',c:'CV'},{n:'Cambodia',c:'KH'},{n:'Cameroon',c:'CM'},{n:'Canada',c:'CA'},
  {n:'Central African Rep.',c:'CF'},{n:'Chad',c:'TD'},{n:'Chile',c:'CL'},{n:'China',c:'CN'},
  {n:'Colombia',c:'CO'},{n:'Comoros',c:'KM'},{n:'Congo',c:'CG'},{n:'Congo DR',c:'CD'},
  {n:'Costa Rica',c:'CR'},{n:"Côte d'Ivoire",c:'CI'},{n:'Croatia',c:'HR'},{n:'Cuba',c:'CU'},
  {n:'Cyprus',c:'CY'},{n:'Czech Republic',c:'CZ'},{n:'Denmark',c:'DK'},{n:'Djibouti',c:'DJ'},
  {n:'Dominica',c:'DM'},{n:'Dominican Republic',c:'DO'},{n:'Ecuador',c:'EC'},{n:'Egypt',c:'EG'},
  {n:'El Salvador',c:'SV'},{n:'Equatorial Guinea',c:'GQ'},{n:'Eritrea',c:'ER'},{n:'Estonia',c:'EE'},
  {n:'Eswatini',c:'SZ'},{n:'Ethiopia',c:'ET'},{n:'Fiji',c:'FJ'},{n:'Finland',c:'FI'},
  {n:'France',c:'FR'},{n:'Gabon',c:'GA'},{n:'Gambia',c:'GM'},{n:'Georgia',c:'GE'},
  {n:'Germany',c:'DE'},{n:'Ghana',c:'GH'},{n:'Greece',c:'GR'},{n:'Grenada',c:'GD'},
  {n:'Guatemala',c:'GT'},{n:'Guinea',c:'GN'},{n:'Guinea-Bissau',c:'GW'},{n:'Guyana',c:'GY'},
  {n:'Haiti',c:'HT'},{n:'Honduras',c:'HN'},{n:'Hungary',c:'HU'},{n:'Iceland',c:'IS'},
  {n:'India',c:'IN'},{n:'Indonesia',c:'ID'},{n:'Iran',c:'IR'},{n:'Iraq',c:'IQ'},
  {n:'Ireland',c:'IE'},{n:'Israel',c:'IL'},{n:'Italy',c:'IT'},{n:'Jamaica',c:'JM'},
  {n:'Japan',c:'JP'},{n:'Jordan',c:'JO'},{n:'Kazakhstan',c:'KZ'},{n:'Kenya',c:'KE'},
  {n:'Kiribati',c:'KI'},{n:'Kuwait',c:'KW'},{n:'Kyrgyzstan',c:'KG'},{n:'Laos',c:'LA'},
  {n:'Latvia',c:'LV'},{n:'Lebanon',c:'LB'},{n:'Lesotho',c:'LS'},{n:'Liberia',c:'LR'},
  {n:'Libya',c:'LY'},{n:'Liechtenstein',c:'LI'},{n:'Lithuania',c:'LT'},{n:'Luxembourg',c:'LU'},
  {n:'Madagascar',c:'MG'},{n:'Malawi',c:'MW'},{n:'Malaysia',c:'MY'},{n:'Maldives',c:'MV'},
  {n:'Mali',c:'ML'},{n:'Malta',c:'MT'},{n:'Marshall Islands',c:'MH'},{n:'Mauritania',c:'MR'},
  {n:'Mauritius',c:'MU'},{n:'Mexico',c:'MX'},{n:'Micronesia',c:'FM'},{n:'Moldova',c:'MD'},
  {n:'Monaco',c:'MC'},{n:'Mongolia',c:'MN'},{n:'Montenegro',c:'ME'},{n:'Morocco',c:'MA'},
  {n:'Mozambique',c:'MZ'},{n:'Myanmar',c:'MM'},{n:'Namibia',c:'NA'},{n:'Nauru',c:'NR'},
  {n:'Nepal',c:'NP'},{n:'Netherlands',c:'NL'},{n:'New Zealand',c:'NZ'},{n:'Nicaragua',c:'NI'},
  {n:'Niger',c:'NE'},{n:'Nigeria',c:'NG'},{n:'Norway',c:'NO'},{n:'Oman',c:'OM'},
  {n:'Pakistan',c:'PK'},{n:'Palau',c:'PW'},{n:'Panama',c:'PA'},{n:'Papua New Guinea',c:'PG'},
  {n:'Paraguay',c:'PY'},{n:'Peru',c:'PE'},{n:'Philippines',c:'PH'},{n:'Poland',c:'PL'},
  {n:'Portugal',c:'PT'},{n:'Qatar',c:'QA'},{n:'Romania',c:'RO'},{n:'Russia',c:'RU'},
  {n:'Rwanda',c:'RW'},{n:'Saint Kitts & Nevis',c:'KN'},{n:'Saint Lucia',c:'LC'},
  {n:'Saint Vincent',c:'VC'},{n:'Samoa',c:'WS'},{n:'San Marino',c:'SM'},
  {n:'São Tomé & Príncipe',c:'ST'},{n:'Saudi Arabia',c:'SA'},{n:'Senegal',c:'SN'},
  {n:'Serbia',c:'RS'},{n:'Seychelles',c:'SC'},{n:'Sierra Leone',c:'SL'},{n:'Singapore',c:'SG'},
  {n:'Slovakia',c:'SK'},{n:'Slovenia',c:'SI'},{n:'Solomon Islands',c:'SB'},{n:'Somalia',c:'SO'},
  {n:'South Africa',c:'ZA'},{n:'South Sudan',c:'SS'},{n:'Spain',c:'ES'},{n:'Sri Lanka',c:'LK'},
  {n:'Sudan',c:'SD'},{n:'Suriname',c:'SR'},{n:'Sweden',c:'SE'},{n:'Switzerland',c:'CH'},
  {n:'Syria',c:'SY'},{n:'Taiwan',c:'TW'},{n:'Tajikistan',c:'TJ'},{n:'Tanzania',c:'TZ'},
  {n:'Thailand',c:'TH'},{n:'Timor-Leste',c:'TL'},{n:'Togo',c:'TG'},{n:'Tonga',c:'TO'},
  {n:'Trinidad & Tobago',c:'TT'},{n:'Tunisia',c:'TN'},{n:'Turkey',c:'TR'},
  {n:'Turkmenistan',c:'TM'},{n:'Tuvalu',c:'TV'},{n:'Uganda',c:'UG'},{n:'Ukraine',c:'UA'},
  {n:'United Arab Emirates',c:'AE'},{n:'United Kingdom',c:'GB'},{n:'United States',c:'US'},
  {n:'Uruguay',c:'UY'},{n:'Uzbekistan',c:'UZ'},{n:'Vanuatu',c:'VU'},{n:'Venezuela',c:'VE'},
  {n:'Vietnam',c:'VN'},{n:'Yemen',c:'YE'},{n:'Zambia',c:'ZM'},{n:'Zimbabwe',c:'ZW'},
  {n:'Other / Global',c:'GL'},
].map(x => ({ name: x.n, code: x.c, flag: x.c === 'GL' ? '🌍' : countryFlag(x.c) }))

// ── Industry picker data ───────────────────────────────────────────────────────
const INDUSTRY_PICKER = [
  { id: 'tech',        label: 'IT & Technology',        icon: '💻', keys: ['software','developer','engineer','data','cloud','ai','cyber','network','devops'] },
  { id: 'healthcare',  label: 'Healthcare & Medical',   icon: '🏥', keys: ['nurse','doctor','medical','health','clinical','pharmacy','dental','therapy'] },
  { id: 'finance',     label: 'Finance & Banking',      icon: '💰', keys: ['accountant','finance','bank','audit','tax','investment','insurance','cfa','cpa'] },
  { id: 'engineering', label: 'Engineering',            icon: '⚙️', keys: ['mechanical','civil','electrical','structural','chemical','aerospace','manufacturing'] },
  { id: 'education',   label: 'Education & Training',   icon: '🎓', keys: ['teacher','professor','instructor','tutor','curriculum','training','elearning'] },
  { id: 'trades',      label: 'Trades & Construction',  icon: '🔧', keys: ['electrician','plumber','carpenter','hvac','welder','construction','red seal','nccer'] },
  { id: 'marketing',   label: 'Marketing & Sales',      icon: '📈', keys: ['marketing','sales','seo','digital','brand','content','social media','hubspot'] },
  { id: 'legal',       label: 'Legal & Compliance',     icon: '⚖️', keys: ['lawyer','attorney','paralegal','compliance','gdpr','legal','contract','regulatory'] },
  { id: 'hr',          label: 'HR & Recruiting',        icon: '👥', keys: ['human resources','recruiter','talent','payroll','shrm','cipd','workday','people ops'] },
  { id: 'logistics',   label: 'Supply Chain & Ops',     icon: '🚚', keys: ['logistics','supply chain','procurement','warehouse','operations','apics','pmp'] },
  { id: 'creative',    label: 'Creative & Design',      icon: '🎨', keys: ['designer','ux','graphic','creative','video','animation','adobe','figma','art'] },
  { id: 'hospitality', label: 'Hospitality & Tourism',  icon: '🏨', keys: ['hotel','restaurant','tourism','chef','hospitality','travel','food','events'] },
  { id: 'government',  label: 'Government & Public',    icon: '🏛️', keys: ['government','public sector','policy','military','civil service','ngo','non-profit'] },
  { id: 'science',     label: 'Science & Research',     icon: '🔬', keys: ['scientist','research','biotech','lab','chemistry','biology','physics','phd'] },
  { id: 'other',       label: 'Other / Not Sure',       icon: '🌐', keys: [] },
]

// ── UI Translations (top 11 languages) ────────────────────────────────────────
const T = {
  en: {
    analyzeBtn: '🚀 Analyse My Profile — 16 AI Tools',
    analyzingBtn: '✨ Generating all 16 AI tools...',
    analyzingNote: 'AI generating all 16 tools — takes about 20–35 seconds...',
    uploadResume: 'Drop file or click to upload',
    uploadFormats: 'PDF · DOCX · TXT · Max 10MB',
    orPasteBelow: '— or paste below —',
    resumePlaceholder: 'Paste your resume text here...',
    jobPlaceholder: 'Paste the job description here...',
    resumeTitle: '📋 Your Resume',
    jobTitle: '💼 Job Description',
    readingFile: 'Reading file...',
    resultsHeader: 'AI Results',
    selectCategory: 'Select a category · then choose a tool inside',
    downloadBtn: '📥 Download .txt',
    shareBtn: '🔗 Share',
    copiedBtn: '✓ Copied!',
    copyBtn: '📋 Copy',
    chatPlaceholder: 'Ask anything about your career...',
    freeUses: 'Free uses:',
    searching: '⏳ Searching Google Jobs...',
    searchBtn: '🔍 Search Fresh Jobs',
    showingMarket: 'Showing results for your market:',
    noResult: 'No result yet for',
    generating: 'Generating',
    detectingLocation: 'Detecting location...',
  },
  zh: {
    analyzeBtn: '🚀 分析我的简历 — 16个AI工具',
    analyzingBtn: '✨ 正在生成所有16个AI工具...',
    analyzingNote: 'AI正在生成所有16个工具 — 大约需要20-35秒...',
    uploadResume: '拖放文件或点击上传',
    uploadFormats: 'PDF · DOCX · TXT · 最大10MB',
    orPasteBelow: '— 或在下方粘贴 —',
    resumePlaceholder: '在此粘贴您的简历文本...',
    jobPlaceholder: '在此粘贴职位描述...',
    resumeTitle: '📋 您的简历',
    jobTitle: '💼 职位描述',
    readingFile: '正在读取文件...',
    resultsHeader: 'AI分析结果',
    selectCategory: '选择类别 · 然后选择内部工具',
    downloadBtn: '📥 下载 .txt',
    shareBtn: '🔗 分享',
    copiedBtn: '✓ 已复制！',
    copyBtn: '📋 复制',
    chatPlaceholder: '询问任何职业问题...',
    freeUses: '免费次数:',
    searching: '⏳ 正在搜索职位...',
    searchBtn: '🔍 搜索最新职位',
    showingMarket: '显示您所在市场的结果:',
    noResult: '暂无结果:',
    generating: '正在生成',
    detectingLocation: '正在检测位置...',
  },
  hi: {
    analyzeBtn: '🚀 मेरी प्रोफ़ाइल विश्लेषण करें — 16 AI टूल्स',
    analyzingBtn: '✨ सभी 16 AI टूल्स बना रहे हैं...',
    analyzingNote: 'AI सभी 16 टूल्स बना रहा है — लगभग 20-35 सेकंड लगते हैं...',
    uploadResume: 'फ़ाइल खींचें या अपलोड करने के लिए क्लिक करें',
    uploadFormats: 'PDF · DOCX · TXT · अधिकतम 10MB',
    orPasteBelow: '— या नीचे पेस्ट करें —',
    resumePlaceholder: 'यहाँ अपना रेज़्यूमे टेक्स्ट पेस्ट करें...',
    jobPlaceholder: 'यहाँ नौकरी विवरण पेस्ट करें...',
    resumeTitle: '📋 आपका रेज़्यूमे',
    jobTitle: '💼 नौकरी विवरण',
    readingFile: 'फ़ाइल पढ़ रहे हैं...',
    resultsHeader: 'AI परिणाम',
    selectCategory: 'श्रेणी चुनें · फिर अंदर का टूल चुनें',
    downloadBtn: '📥 डाउनलोड .txt',
    shareBtn: '🔗 शेयर करें',
    copiedBtn: '✓ कॉपी हो गया!',
    copyBtn: '📋 कॉपी करें',
    chatPlaceholder: 'अपने करियर के बारे में कुछ भी पूछें...',
    freeUses: 'मुफ़्त उपयोग:',
    searching: '⏳ नौकरियाँ खोज रहे हैं...',
    searchBtn: '🔍 नई नौकरियाँ खोजें',
    showingMarket: 'आपके बाज़ार के परिणाम दिखा रहे हैं:',
    noResult: 'अभी कोई परिणाम नहीं:',
    generating: 'बना रहे हैं',
    detectingLocation: 'स्थान पता कर रहे हैं...',
  },
  es: {
    analyzeBtn: '🚀 Analizar Mi Perfil — 16 Herramientas IA',
    analyzingBtn: '✨ Generando las 16 herramientas IA...',
    analyzingNote: 'IA generando las 16 herramientas — tarda unos 20-35 segundos...',
    uploadResume: 'Arrastra el archivo o haz clic para subir',
    uploadFormats: 'PDF · DOCX · TXT · Máx 10MB',
    orPasteBelow: '— o pega abajo —',
    resumePlaceholder: 'Pega el texto de tu currículum aquí...',
    jobPlaceholder: 'Pega la descripción del trabajo aquí...',
    resumeTitle: '📋 Tu Currículum',
    jobTitle: '💼 Descripción del Trabajo',
    readingFile: 'Leyendo archivo...',
    resultsHeader: 'Resultados de IA',
    selectCategory: 'Selecciona una categoría · luego elige una herramienta',
    downloadBtn: '📥 Descargar .txt',
    shareBtn: '🔗 Compartir',
    copiedBtn: '✓ ¡Copiado!',
    copyBtn: '📋 Copiar',
    chatPlaceholder: 'Pregunta lo que quieras sobre tu carrera...',
    freeUses: 'Usos gratuitos:',
    searching: '⏳ Buscando empleos...',
    searchBtn: '🔍 Buscar Empleos Frescos',
    showingMarket: 'Mostrando resultados para tu mercado:',
    noResult: 'Sin resultado aún para',
    generating: 'Generando',
    detectingLocation: 'Detectando ubicación...',
  },
  ar: {
    analyzeBtn: '🚀 تحليل ملفي — 16 أداة ذكاء اصطناعي',
    analyzingBtn: '✨ جاري توليد جميع الأدوات الـ16...',
    analyzingNote: 'الذكاء الاصطناعي يولد جميع الأدوات — يستغرق حوالي 20-35 ثانية...',
    uploadResume: 'اسحب الملف أو انقر للرفع',
    uploadFormats: 'PDF · DOCX · TXT · الحد الأقصى 10MB',
    orPasteBelow: '— أو الصق أدناه —',
    resumePlaceholder: 'الصق نص سيرتك الذاتية هنا...',
    jobPlaceholder: 'الصق وصف الوظيفة هنا...',
    resumeTitle: '📋 سيرتك الذاتية',
    jobTitle: '💼 وصف الوظيفة',
    readingFile: 'جاري قراءة الملف...',
    resultsHeader: 'نتائج الذكاء الاصطناعي',
    selectCategory: 'اختر فئة · ثم اختر أداة بداخلها',
    downloadBtn: '📥 تحميل .txt',
    shareBtn: '🔗 مشاركة',
    copiedBtn: '✓ تم النسخ!',
    copyBtn: '📋 نسخ',
    chatPlaceholder: 'اسأل أي شيء عن مسيرتك المهنية...',
    freeUses: 'استخدامات مجانية:',
    searching: '⏳ جاري البحث عن وظائف...',
    searchBtn: '🔍 ابحث عن وظائف جديدة',
    showingMarket: 'عرض نتائج سوقك:',
    noResult: 'لا توجد نتيجة بعد لـ',
    generating: 'جاري التوليد',
    detectingLocation: 'جاري تحديد الموقع...',
  },
  fr: {
    analyzeBtn: '🚀 Analyser Mon Profil — 16 Outils IA',
    analyzingBtn: '✨ Génération des 16 outils IA...',
    analyzingNote: "L'IA génère les 16 outils — environ 20-35 secondes...",
    uploadResume: 'Déposez le fichier ou cliquez pour télécharger',
    uploadFormats: 'PDF · DOCX · TXT · Max 10Mo',
    orPasteBelow: '— ou collez ci-dessous —',
    resumePlaceholder: 'Collez le texte de votre CV ici...',
    jobPlaceholder: "Collez la description du poste ici...",
    resumeTitle: '📋 Votre CV',
    jobTitle: '💼 Description du Poste',
    readingFile: 'Lecture du fichier...',
    resultsHeader: 'Résultats IA',
    selectCategory: 'Sélectionnez une catégorie · puis choisissez un outil',
    downloadBtn: '📥 Télécharger .txt',
    shareBtn: '🔗 Partager',
    copiedBtn: '✓ Copié !',
    copyBtn: '📋 Copier',
    chatPlaceholder: 'Posez toutes vos questions de carrière...',
    freeUses: 'Utilisations gratuites :',
    searching: '⏳ Recherche d\'emplois...',
    searchBtn: '🔍 Rechercher des Emplois',
    showingMarket: 'Résultats pour votre marché :',
    noResult: 'Pas encore de résultat pour',
    generating: 'Génération en cours',
    detectingLocation: 'Détection de la localisation...',
  },
  bn: {
    analyzeBtn: '🚀 আমার প্রোফাইল বিশ্লেষণ করুন — ১৬টি AI টুল',
    analyzingBtn: '✨ সব ১৬টি AI টুল তৈরি হচ্ছে...',
    analyzingNote: 'AI সব ১৬টি টুল তৈরি করছে — প্রায় ২০-৩৫ সেকেন্ড লাগে...',
    uploadResume: 'ফাইল টেনে আনুন বা আপলোড করতে ক্লিক করুন',
    uploadFormats: 'PDF · DOCX · TXT · সর্বোচ্চ ১০MB',
    orPasteBelow: '— অথবা নিচে পেস্ট করুন —',
    resumePlaceholder: 'এখানে আপনার রেজুমে টেক্সট পেস্ট করুন...',
    jobPlaceholder: 'এখানে চাকরির বিবরণ পেস্ট করুন...',
    resumeTitle: '📋 আপনার রেজুমে',
    jobTitle: '💼 চাকরির বিবরণ',
    readingFile: 'ফাইল পড়া হচ্ছে...',
    resultsHeader: 'AI ফলাফল',
    selectCategory: 'একটি বিভাগ নির্বাচন করুন · তারপর ভেতরের টুল বেছে নিন',
    downloadBtn: '📥 ডাউনলোড .txt',
    shareBtn: '🔗 শেয়ার করুন',
    copiedBtn: '✓ কপি হয়েছে!',
    copyBtn: '📋 কপি করুন',
    chatPlaceholder: 'আপনার ক্যারিয়ার সম্পর্কে যেকোনো প্রশ্ন করুন...',
    freeUses: 'বিনামূল্যে ব্যবহার:',
    searching: '⏳ চাকরি খোঁজা হচ্ছে...',
    searchBtn: '🔍 নতুন চাকরি খুঁজুন',
    showingMarket: 'আপনার বাজারের ফলাফল দেখানো হচ্ছে:',
    noResult: 'এখনো কোনো ফলাফল নেই:',
    generating: 'তৈরি হচ্ছে',
    detectingLocation: 'অবস্থান শনাক্ত করা হচ্ছে...',
  },
  pt: {
    analyzeBtn: '🚀 Analisar Meu Perfil — 16 Ferramentas IA',
    analyzingBtn: '✨ Gerando todas as 16 ferramentas IA...',
    analyzingNote: 'IA gerando todas as 16 ferramentas — cerca de 20-35 segundos...',
    uploadResume: 'Arraste o arquivo ou clique para fazer upload',
    uploadFormats: 'PDF · DOCX · TXT · Máx 10MB',
    orPasteBelow: '— ou cole abaixo —',
    resumePlaceholder: 'Cole o texto do seu currículo aqui...',
    jobPlaceholder: 'Cole a descrição da vaga aqui...',
    resumeTitle: '📋 Seu Currículo',
    jobTitle: '💼 Descrição da Vaga',
    readingFile: 'Lendo arquivo...',
    resultsHeader: 'Resultados da IA',
    selectCategory: 'Selecione uma categoria · depois escolha uma ferramenta',
    downloadBtn: '📥 Baixar .txt',
    shareBtn: '🔗 Compartilhar',
    copiedBtn: '✓ Copiado!',
    copyBtn: '📋 Copiar',
    chatPlaceholder: 'Pergunte qualquer coisa sobre sua carreira...',
    freeUses: 'Usos gratuitos:',
    searching: '⏳ Pesquisando vagas...',
    searchBtn: '🔍 Buscar Vagas Novas',
    showingMarket: 'Mostrando resultados para o seu mercado:',
    noResult: 'Sem resultado ainda para',
    generating: 'Gerando',
    detectingLocation: 'Detectando localização...',
  },
  ru: {
    analyzeBtn: '🚀 Анализировать мой профиль — 16 инструментов',
    analyzingBtn: '✨ Генерируются все 16 инструментов...',
    analyzingNote: 'ИИ генерирует все 16 инструментов — около 20-35 секунд...',
    uploadResume: 'Перетащите файл или нажмите для загрузки',
    uploadFormats: 'PDF · DOCX · TXT · Макс 10МБ',
    orPasteBelow: '— или вставьте ниже —',
    resumePlaceholder: 'Вставьте текст резюме здесь...',
    jobPlaceholder: 'Вставьте описание вакансии здесь...',
    resumeTitle: '📋 Ваше резюме',
    jobTitle: '💼 Описание вакансии',
    readingFile: 'Чтение файла...',
    resultsHeader: 'Результаты ИИ',
    selectCategory: 'Выберите категорию · затем выберите инструмент',
    downloadBtn: '📥 Скачать .txt',
    shareBtn: '🔗 Поделиться',
    copiedBtn: '✓ Скопировано!',
    copyBtn: '📋 Копировать',
    chatPlaceholder: 'Задайте любой вопрос о карьере...',
    freeUses: 'Бесплатных использований:',
    searching: '⏳ Поиск вакансий...',
    searchBtn: '🔍 Найти свежие вакансии',
    showingMarket: 'Показываю результаты для вашего рынка:',
    noResult: 'Нет результата для',
    generating: 'Генерация',
    detectingLocation: 'Определение местоположения...',
  },
  id: {
    analyzeBtn: '🚀 Analisis Profil Saya — 16 Alat AI',
    analyzingBtn: '✨ Membuat semua 16 alat AI...',
    analyzingNote: 'AI membuat semua 16 alat — membutuhkan sekitar 20-35 detik...',
    uploadResume: 'Seret file atau klik untuk mengunggah',
    uploadFormats: 'PDF · DOCX · TXT · Maks 10MB',
    orPasteBelow: '— atau tempel di bawah —',
    resumePlaceholder: 'Tempel teks CV Anda di sini...',
    jobPlaceholder: 'Tempel deskripsi pekerjaan di sini...',
    resumeTitle: '📋 CV Anda',
    jobTitle: '💼 Deskripsi Pekerjaan',
    readingFile: 'Membaca file...',
    resultsHeader: 'Hasil AI',
    selectCategory: 'Pilih kategori · lalu pilih alat di dalamnya',
    downloadBtn: '📥 Unduh .txt',
    shareBtn: '🔗 Bagikan',
    copiedBtn: '✓ Disalin!',
    copyBtn: '📋 Salin',
    chatPlaceholder: 'Tanyakan apa saja tentang karier Anda...',
    freeUses: 'Penggunaan gratis:',
    searching: '⏳ Mencari lowongan...',
    searchBtn: '🔍 Cari Lowongan Terbaru',
    showingMarket: 'Menampilkan hasil untuk pasar Anda:',
    noResult: 'Belum ada hasil untuk',
    generating: 'Membuat',
    detectingLocation: 'Mendeteksi lokasi...',
  },
  ur: {
    analyzeBtn: '🚀 میری پروفائل تجزیہ کریں — 16 AI ٹولز',
    analyzingBtn: '✨ تمام 16 AI ٹولز بنائے جا رہے ہیں...',
    analyzingNote: 'AI تمام 16 ٹولز بنا رہا ہے — تقریباً 20-35 سیکنڈ لگتے ہیں...',
    uploadResume: 'فائل گھسیٹیں یا اپ لوڈ کرنے کے لیے کلک کریں',
    uploadFormats: 'PDF · DOCX · TXT · زیادہ سے زیادہ 10MB',
    orPasteBelow: '— یا نیچے پیسٹ کریں —',
    resumePlaceholder: 'یہاں اپنا سی وی ٹیکسٹ پیسٹ کریں...',
    jobPlaceholder: 'یہاں نوکری کی تفصیل پیسٹ کریں...',
    resumeTitle: '📋 آپ کا سی وی',
    jobTitle: '💼 نوکری کی تفصیل',
    readingFile: 'فائل پڑھی جا رہی ہے...',
    resultsHeader: 'AI نتائج',
    selectCategory: 'ایک زمرہ منتخب کریں · پھر اندر سے ٹول چنیں',
    downloadBtn: '📥 ڈاؤن لوڈ .txt',
    shareBtn: '🔗 شیئر کریں',
    copiedBtn: '✓ کاپی ہو گیا!',
    copyBtn: '📋 کاپی کریں',
    chatPlaceholder: 'اپنے کیریئر کے بارے میں کچھ بھی پوچھیں...',
    freeUses: 'مفت استعمال:',
    searching: '⏳ نوکریاں تلاش کی جا رہی ہیں...',
    searchBtn: '🔍 نئی نوکریاں تلاش کریں',
    showingMarket: 'آپ کی مارکیٹ کے نتائج دکھائے جا رہے ہیں:',
    noResult: 'ابھی کوئی نتیجہ نہیں:',
    generating: 'بنایا جا رہا ہے',
    detectingLocation: 'مقام معلوم کیا جا رہا ہے...',
  },
}
// tx() always returns English — multilingual system disabled, kept for future use
function tx(lang, key) { lang = 'en'; // eslint-disable-line
  return (T[lang] && T[lang][key]) || T.en[key] || key
}

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
// Negative sections (MISSING, RED FLAG, FAIL, REJECT, GAP, BURIED) → RED
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

  // Detect negative section by heading content
  const NEGATIVE_PATTERNS = /MISSING|RED FLAG|FAIL|REJECT|GAP|BURIED|WEAK|NOT FOUND|ABSENT|LACKING/i
  const POSITIVE_PATTERNS = /FOUND|MATCHED|PASS|STRENGTH|WORKS WELL|ADVANTAGE|QUICK WIN|WHAT YOU NOTICED/i
  let negativeSection = false

  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={i} style={{ height: 10 }} />

        // # Heading 1
        if (/^#\s+/.test(trimmed)) {
          const content = trimmed.replace(/^#+\s*/, '')
          negativeSection = NEGATIVE_PATTERNS.test(content) && !POSITIVE_PATTERNS.test(content)
          const col = negativeSection ? '#FF6B6B' : '#00AEEF'
          const border = negativeSection ? 'rgba(255,107,107,0.3)' : 'rgba(0,174,239,0.3)'
          return (
            <div key={i} style={{ fontSize: 17, fontWeight: 800, color: col, borderBottom: `1px solid ${border}`, paddingBottom: 6, marginTop: 18, marginBottom: 8 }}>
              {parseInlineBold(content)}
            </div>
          )
        }

        // ## Heading 2
        if (/^##\s+/.test(trimmed)) {
          const content = trimmed.replace(/^#+\s*/, '')
          negativeSection = NEGATIVE_PATTERNS.test(content) && !POSITIVE_PATTERNS.test(content)
          const col = negativeSection ? '#FF6B6B' : '#FACF39'
          return (
            <div key={i} style={{ fontSize: 15, fontWeight: 700, color: col, marginTop: 14, marginBottom: 6 }}>
              {parseInlineBold(content)}
            </div>
          )
        }

        // Bullet: • - * at start
        if (/^[•\-\*]\s+/.test(trimmed)) {
          const content = trimmed.replace(/^[•\-\*]\s+/, '')
          const isNeg = negativeSection || NEGATIVE_PATTERNS.test(content)
          return (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5, alignItems: 'flex-start', paddingLeft: 8, background: isNeg ? 'rgba(255,65,60,0.08)' : 'transparent', borderRadius: isNeg ? 6 : 0, padding: isNeg ? '4px 8px' : '0 0 0 8px' }}>
              <span style={{ color: isNeg ? '#FF4136' : '#FF0099', fontWeight: 900, flexShrink: 0, marginTop: 1 }}>{isNeg ? '✗' : '•'}</span>
              <span style={{ color: isNeg ? '#FF8A80' : 'rgba(255,255,255,0.88)', lineHeight: 1.6 }}>{parseInlineBold(content)}</span>
            </div>
          )
        }

        // Numbered list
        if (/^\d+\.\s+/.test(trimmed)) {
          const num = trimmed.match(/^(\d+)\./)[1]
          const content = trimmed.replace(/^\d+\.\s+/, '')
          const isNeg = negativeSection
          return (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 5, alignItems: 'flex-start', paddingLeft: 8 }}>
              <span style={{ color: isNeg ? '#FF6B6B' : '#FACF39', fontWeight: 800, flexShrink: 0, minWidth: 20, marginTop: 1 }}>{num}.</span>
              <span style={{ color: isNeg ? '#FF8A80' : 'rgba(255,255,255,0.88)', lineHeight: 1.6 }}>{parseInlineBold(content)}</span>
            </div>
          )
        }

        // ALL CAPS LABEL: pattern
        if (/^[A-Z][A-Z\s]{2,}:\s*/.test(trimmed)) {
          const colonIdx = trimmed.indexOf(':')
          const label = trimmed.slice(0, colonIdx)
          const rest = trimmed.slice(colonIdx + 1).trim()
          const isNeg = NEGATIVE_PATTERNS.test(label)
          return (
            <div key={i} style={{ marginBottom: 6, lineHeight: 1.7, background: isNeg ? 'rgba(255,65,60,0.1)' : 'transparent', borderRadius: isNeg ? 6 : 0, padding: isNeg ? '3px 8px' : 0 }}>
              <span style={{ color: isNeg ? '#FF6B6B' : '#FACF39', fontWeight: 800, letterSpacing: 0.5 }}>{label}: </span>
              <span style={{ color: isNeg ? '#FF8A80' : 'rgba(255,255,255,0.85)' }}>{parseInlineBold(rest)}</span>
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
  const [splashPhase, setSplashPhase] = useState('loading') // 'loading'|'detecting'|'detected'|'country'|'industry'
  const [splashPct, setSplashPct]     = useState(0)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedIndustry, setSelectedIndustry] = useState(null)
  const [detectedCountry, setDetectedCountry]   = useState(null) // auto-detected from IP
  const [splashSearch, setSplashSearch]         = useState('')   // search in 195 list
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

  // ── Splash screen: loading → country picker ──────────────────────────────────
  useEffect(() => {
    let frame
    const start = Date.now()
    const duration = 1800
    function tick() {
      const elapsed = Date.now() - start
      const pct = Math.min(100, Math.round((elapsed / duration) * 100))
      setSplashPct(pct)
      if (elapsed < duration) { frame = requestAnimationFrame(tick) }
      else { setSplashPhase('detecting') } // try IP detect first
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  // ── Country selection handler → goes to industry picker ─────────────────────
  function pickCountry(c) {
    setSelectedCountry(c)
    setUserInfo(prev => ({
      ...(prev || {}),
      country: c.name, countryCode: c.code,
      city: prev?.city || c.name, region: prev?.region || '',
    }))
    setSearchLocation(c.name)
    setSplashPhase('industry')
  }

  // ── Industry selection handler → dismisses splash ─────────────────────────
  function pickIndustry(ind) {
    setSelectedIndustry(ind)
    setSplash(false)
  }

  // ── Fetch location + weather + auto-detect country for splash ──────────────
  useEffect(() => {
    // Fallback: if IP detection takes >4s, show manual country picker
    const detectTimeout = setTimeout(() => {
      setSplashPhase(prev => (prev === 'detecting' ? 'country' : prev))
    }, 4000)

    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => {
        clearTimeout(detectTimeout)
        setUserInfo({ city: d.city || '—', region: d.region || '—', country: d.country_name || '—', countryCode: d.country_code || '', lat: d.latitude ? d.latitude.toFixed(4) : null, lng: d.longitude ? d.longitude.toFixed(4) : null, os: detectOS(), timezone: d.timezone || '', currency: d.currency || '' })
        if (d.city && d.country_name) setSearchLocation(`${d.city}, ${d.country_name}`)
        // Auto-detect country for splash
        if (d.country_code && d.country_name) {
          const matched = COUNTRY_LIST_195.find(x => x.code === d.country_code)
          const detected = matched || { name: d.country_name, code: d.country_code, flag: countryFlag(d.country_code) }
          setDetectedCountry(detected)
          setSplashPhase(prev => (prev === 'detecting' ? 'detected' : prev))
        } else {
          setSplashPhase(prev => (prev === 'detecting' ? 'country' : prev))
        }
        const loc = encodeURIComponent((d.city || '') + ',' + (d.country_code || ''))
        return fetch(`https://wttr.in/${loc}?format=%c+%C+%t&m`)
      })
      .then(r => r.text())
      .then(w => setWeather(w.trim()))
      .catch(() => {
        clearTimeout(detectTimeout)
        setSplashPhase(prev => (prev === 'detecting' ? 'country' : prev))
      })
    const s = getRLS()
    setRemaining(Math.max(0, CLIENT_HOURLY_LIMIT - s.count))
    setUserLang(detectLang())
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
    setError(''); setErrorDismissed(false); setLoading(true); setResults({}); setActiveGroup(null); setActiveTab(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobPosting: jobText, requestedKeys: ALL_CARD_KEYS, userCountry: userInfo?.country || '', userCountryCode: userInfo?.countryCode || '', userIndustry: selectedIndustry?.id || '', userIndustryLabel: selectedIndustry?.label || '' }),
      })
      if (!res.ok) {
        let msg = 'Analysis failed'
        try { const d = await res.json(); msg = d.message || d.error || msg } catch {}
        throw new Error(msg)
      }
      const data = await res.json()
      setResults(data)
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
    a.href = url; a.download = 'Alfalah_AI_Career_Report.txt'; a.click()
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
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'linear-gradient(160deg,#0F0C29,#302B63,#24243E)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: (splashPhase === 'loading' || splashPhase === 'detecting' || splashPhase === 'detected') ? 'center' : 'flex-start',
          gap: 24, overflowY: 'auto', padding: (splashPhase === 'loading' || splashPhase === 'detecting' || splashPhase === 'detected') ? 0 : '32px 16px',
        }}>
          {/* Logo always shown */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: splashPhase === 'country' ? 0 : 0 }}>
            <div style={{
              width: (splashPhase === 'loading' || splashPhase === 'detecting') ? 80 : 56,
              height: (splashPhase === 'loading' || splashPhase === 'detecting') ? 80 : 56,
              borderRadius: 16, background: 'linear-gradient(135deg,#FF0099,#FACF39,#00AEEF,#38EF7D)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: (splashPhase === 'loading' || splashPhase === 'detecting') ? 44 : 30, fontWeight: 900, color: '#0F0C29',
              boxShadow: '0 0 40px rgba(255,0,153,0.5)',
              animation: 'pulse-glow 1.8s ease-in-out infinite', flexShrink: 0,
            }}>ا</div>
            <h1 style={{
              fontSize: (splashPhase === 'loading' || splashPhase === 'detecting') ? 'clamp(2rem,8vw,4rem)' : 'clamp(1.6rem,6vw,2.8rem)',
              fontWeight: 900, margin: 0,
              background: 'linear-gradient(135deg,#FF0099,#FACF39,#00AEEF,#38EF7D)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Alfalah AI</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0, fontStyle: 'italic' }}>
              الفلاح — Come to Success
            </p>
          </div>

          {splashPhase === 'loading' ? (
            /* ── Loading bar ── */
            <>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>17 Free AI Career Tools · 195 Countries</p>
              <div style={{ width: 240, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg,#FF0099,#FACF39,#00AEEF)', width: `${splashPct}%`, transition: 'width 0.1s linear' }} />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, margin: 0, cursor: 'pointer' }} onClick={() => setSplashPhase('detecting')}>Loading... tap to skip</p>
            </>

          ) : splashPhase === 'detecting' ? (
            /* ── Detecting location ── */
            <div style={{ textAlign: 'center', animation: 'fade-in 0.3s ease' }}>
              <div style={{ fontSize: 36, marginBottom: 12, animation: 'pulse-glow 1s ease infinite' }}>📡</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Detecting your location...</div>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: 0 }}>Loading your country package</p>
            </div>

          ) : splashPhase === 'detected' ? (
            /* ── IP detected — confirm or change ── */
            <div style={{ width: '100%', maxWidth: 400, textAlign: 'center', animation: 'fade-in 0.4s ease' }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 16, letterSpacing: 1 }}>WE DETECTED YOUR LOCATION</div>
              <div style={{ fontSize: 72, marginBottom: 8 }}>{detectedCountry?.flag}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{detectedCountry?.name}</div>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: '0 0 24px' }}>
                Is this correct? We'll load your full job market, salary, visa & labor law package.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => pickCountry(detectedCountry)}
                  style={{ background: 'linear-gradient(135deg,#38EF7D,#00AEEF)', border: 'none', borderRadius: 12, padding: '14px 32px', cursor: 'pointer', color: '#0F0C29', fontFamily: 'inherit', fontSize: 15, fontWeight: 900 }}>
                  ✓ Yes, that's correct
                </button>
                <button onClick={() => { setSplashSearch(''); setSplashPhase('country') }}
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '14px 24px', cursor: 'pointer', color: '#fff', fontFamily: 'inherit', fontSize: 14, fontWeight: 700 }}>
                  🌍 Change country
                </button>
              </div>
            </div>

          ) : splashPhase === 'country' ? (
            /* ── Full 195 country picker with search ── */
            <div style={{ width: '100%', maxWidth: 600, animation: 'fade-in 0.4s ease' }}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 8, letterSpacing: 1 }}>STEP 1 OF 2 — SELECT YOUR COUNTRY</div>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: 0 }}>
                  We'll load your full country package: job market · salary · visa paths · labor laws
                </p>
              </div>
              {/* Search box */}
              <input
                type="text" placeholder="🔍 Search 195 countries..."
                value={splashSearch} onChange={e => setSplashSearch(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontFamily: 'inherit', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }}
                autoFocus
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 8, maxHeight: 360, overflowY: 'auto', paddingRight: 4 }}>
                {COUNTRY_LIST_195
                  .filter(c => !splashSearch || c.name.toLowerCase().includes(splashSearch.toLowerCase()) || c.code.toLowerCase().includes(splashSearch.toLowerCase()))
                  .map(c => (
                    <button key={c.code} onClick={() => { setSplashSearch(''); pickCountry(c) }}
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 8px', cursor: 'pointer', color: '#fff', fontFamily: 'inherit', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(250,207,57,0.18)'; e.currentTarget.style.borderColor = '#FACF39' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                    >
                      <span style={{ fontSize: 22 }}>{c.flag}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.3 }}>{c.name}</span>
                    </button>
                  ))}
              </div>
            </div>

          ) : (
            /* ── Step 2: Industry Picker ── */
            <div style={{ width: '100%', maxWidth: 560, animation: 'fade-in 0.4s ease' }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 8, letterSpacing: 1 }}>STEP 2 OF 2 — SELECT YOUR INDUSTRY</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(56,239,125,0.12)', border: '1px solid rgba(56,239,125,0.3)', borderRadius: 20, padding: '4px 14px', marginBottom: 12 }}>
                  <span style={{ fontSize: 16 }}>{selectedCountry?.flag}</span>
                  <span style={{ color: '#38EF7D', fontWeight: 700, fontSize: 13 }}>{selectedCountry?.name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>✓ package loaded</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 6 }}>🏢 What's your industry?</div>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: 0 }}>We'll load certifications, salary benchmarks & top job titles for your field</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 10 }}>
                {INDUSTRY_PICKER.map(ind => (
                  <button key={ind.id} onClick={() => pickIndustry(ind)}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 10px', cursor: 'pointer', color: '#fff', fontFamily: 'inherit', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,174,239,0.18)'; e.currentTarget.style.borderColor = '#00AEEF' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                  >
                    <span style={{ fontSize: 26 }}>{ind.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.3 }}>{ind.label}</span>
                  </button>
                ))}
              </div>
              <p style={{ textAlign: 'center', marginTop: 14, color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
                <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setSplashPhase('country')}>← Back to country</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Main page ───────────────────────────────────────────────────────── */}
      <main style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg,#0F0C29,#302B63,#24243E)',
        color: '#fff', fontFamily: "'Segoe UI',system-ui,sans-serif",
      }}>
        {/* ── Rainbow top bar ─────────────────────────────────────────────── */}
        <div style={{ height: 5, background: 'linear-gradient(90deg,#FF0099,#FACF39,#00AEEF,#38EF7D,#FF6B35,#DA22FF,#FF0099)', backgroundSize: '200% 100%', animation: 'rainbow-shift 4s ease infinite' }} />

        {/* ── Scrolling Ticker Banner ──────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(90deg,rgba(255,0,153,0.12),rgba(0,174,239,0.12),rgba(250,207,57,0.10),rgba(56,239,125,0.10))',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '6px 0', overflow: 'hidden',
        }}>
          <div className="ticker-wrap">
            <div className="ticker-inner">
              {/* Duplicate content for seamless loop */}
              {[0,1].map(i => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 0 }}>
                  {[
                    { icon: '🌟', text: 'Alfalah AI — الفلاح — Come to Success', color: '#FACF39' },
                    { icon: '🚀', text: '17 Free AI Career Tools', color: '#00AEEF' },
                    { icon: '🌍', text: '195 Countries Supported', color: '#38EF7D' },
                    { icon: '🗣️', text: '11 World Languages', color: '#FF6B35' },
                    { icon: '⚡', text: 'Skills Assessment 0–100 Score', color: '#DA22FF' },
                    { icon: '🏆', text: 'From Labor to C-Suite · Age 10 to 100', color: '#FF0099' },
                    { icon: '🔒', text: 'Zero Data Stored · No Login Required', color: '#00AEEF' },
                    { icon: '💼', text: 'ATS Score · Cover Letter · Interview Prep', color: '#FACF39' },
                    { icon: '🛂', text: 'Visa Pathways · Country Laws · Salary Intel', color: '#38EF7D' },
                    { icon: '🤖', text: 'Powered by Google Gemini AI', color: '#FF6B35' },
                    { icon: '❤️', text: 'Free for All Humanity · Built with Heart', color: '#FF0099' },
                  ].map((item, j) => (
                    <span key={j} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 24px', fontSize: 12, fontWeight: 600 }}>
                      <span style={{ animation: 'star-spin 3s ease-in-out infinite', animationDelay: `${j * 0.3}s`, display: 'inline-block' }}>{item.icon}</span>
                      <span style={{ color: item.color, letterSpacing: 0.3 }}>{item.text}</span>
                      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 16, marginLeft: 8 }}>✦</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>

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
            {/* Language selector — disabled, English only (re-enable for v3 multilingual) */}
            <div style={{ marginLeft: 'auto' }} />
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
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>{tx(userLang,'detectingLocation')}</span>
              )}
            </div>
            {/* Usage dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{tx(userLang,'freeUses')}</span>
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
                    {atsScore.label} — {atsScore.matched.length}/{atsScore.matched.length + atsScore.missing.length} technical keywords matched
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
                <span>📋</span> {tx(userLang,'resumeTitle').replace('📋 ','')}
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
                  ? <p style={{ color: '#00AEEF', fontSize: 13, fontWeight: 700, margin: 0 }}>{tx(userLang,'readingFile')}</p>
                  : fileName
                    ? <p style={{ color: '#38EF7D', fontSize: 12, fontWeight: 700, margin: 0 }}>✓ {fileName}</p>
                    : <>
                        <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>{tx(userLang,'uploadResume')}</p>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{tx(userLang,'uploadFormats')}</p>
                      </>
                }
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', margin: '0 0 8px' }}>{tx(userLang,'orPasteBelow')}</p>
              <textarea
                value={resumeText}
                onChange={e => { const v = e.target.value; setResumeText(v.length > MAX_PASTE_CHARS ? v.slice(0, MAX_PASTE_CHARS) : v) }}
                placeholder={tx(userLang,'resumePlaceholder')}
                style={{ ...textarea, height: 150 }}
              />
              <p style={{ textAlign: 'right', fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: '4px 0 0' }}>
                {resumeText.length.toLocaleString()} / {MAX_PASTE_CHARS.toLocaleString()}
              </p>
            </div>

            {/* Job Description */}
            <div style={glass}>
              <h2 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 800, background: 'linear-gradient(90deg,#FF0099,#FF6B6B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>💼</span> {tx(userLang,'jobTitle').replace('💼 ','')}
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
                  ? <p style={{ color: '#FF0099', fontSize: 13, fontWeight: 700, margin: 0 }}>{tx(userLang,'readingFile')}</p>
                  : jobFileName
                    ? <p style={{ color: '#38EF7D', fontSize: 12, fontWeight: 700, margin: 0 }}>✓ {jobFileName}</p>
                    : <>
                        <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>{tx(userLang,'uploadResume')}</p>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{tx(userLang,'uploadFormats')}</p>
                      </>
                }
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', margin: '0 0 8px' }}>{tx(userLang,'orPasteBelow')}</p>
              <textarea
                value={jobText}
                onChange={e => { const v = e.target.value; setJobText(v.length > 6000 ? v.slice(0, 6000) : v) }}
                placeholder={tx(userLang,'jobPlaceholder')}
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
              {loading ? tx(userLang,'analyzingBtn') : tx(userLang,'analyzeBtn')}
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
                  {tx(userLang,'analyzingNote')}
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
                  {tx(userLang,'resultsHeader')}
                </h2>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    onClick={downloadReport}
                    disabled={Object.keys(results).length === 0}
                    style={{ padding: '8px 16px', borderRadius: 10, background: 'linear-gradient(135deg,#00C6FF,#0072FF)', border: 'none', color: '#fff', fontWeight: 700, cursor: Object.keys(results).length === 0 ? 'not-allowed' : 'pointer', fontSize: 13, fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(0,198,255,0.35)', transition: 'all .2s', opacity: Object.keys(results).length === 0 ? 0.5 : 1 }}
                    onMouseEnter={e => { if (Object.keys(results).length > 0) e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    {tx(userLang,'downloadBtn')}
                  </button>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 20 }}>
                {tx(userLang,'selectCategory')}
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

                    {/* Your Market banner — shown inside Job Hunt group, above content */}
                    {activeGroup === 'jobhunt' && userInfo?.country && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 14px', marginBottom: 14, borderRadius: 10,
                        background: 'rgba(56,239,125,0.07)',
                        border: '1px solid rgba(56,239,125,0.2)',
                      }}>
                        <span style={{ fontSize: 13 }}>📍</span>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
                          {tx(userLang,'showingMarket')}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#38EF7D' }}>
                          {userInfo.country}
                        </span>
                      </div>
                    )}

                    {/* Content area */}
                    <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 14, padding: 22, fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.92)', maxHeight: 520, overflowY: 'auto', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {content
                        ? <RenderText text={content} />
                        : loading
                          ? <span style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>{tx(userLang,'generating')} {tab.label}...<span className="typing-cursor" /></span>
                          : <span style={{ color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>{tx(userLang,'noResult')} {tab.label}</span>
                      }
                    </div>

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

          {/* Live Jobs moved into Job Hunt → Matching Jobs card (see above) */}

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

        {/* Chatbot disabled — saves API quota, re-enable for v3 if needed */}

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
          @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
          @keyframes ticker-rtl { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
          @keyframes float-up { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
          @keyframes star-spin { 0%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(180deg) scale(1.3)} 100%{transform:rotate(360deg) scale(1)} }
          @keyframes rainbow-shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
          .ticker-wrap { overflow:hidden; white-space:nowrap; }
          .ticker-inner { display:inline-block; animation:ticker 32s linear infinite; }
          .ticker-inner:hover { animation-play-state:paused; }
          select option { background:#1a1a2e !important; }
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
