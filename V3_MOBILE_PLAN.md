# Alfalah AI — V3 MOBILE PLAN
**Status: PLANNING | Start: After V2 demo locked**
**Owner:** Shahzad Muhammad · Mississauga, ON, Canada

---

## V3 MISSION
Build Alfalah AI V3 from scratch as a **native mobile-first app** for Android + iOS,
with a companion web app — serving 8 billion humans globally.

---

## MOBILE PUBLISHING — V2 DEMO (IMMEDIATE, NO NEW CODE)

The current V2 is already a full PWA. You can publish it to both stores TODAY using PWABuilder.

### Step 1 — Add Icons (REQUIRED first)
Create or download any 192×192 and 512×512 PNG image with the Alfalah "ا" logo.
Save them as:
- `public/icon-192.png`
- `public/icon-512.png`

Then push to GitHub (Vercel auto-deploys).

### Step 2 — Package with PWABuilder (FREE)
1. Go to **https://www.pwabuilder.com**
2. Enter: `https://shahzad-job-coach-ai.vercel.app`
3. Click "Package for Stores"
4. Download:
   - **Android TWA (APK)** — ready to upload to Google Play
   - **iOS Xcode project** — open in Xcode, archive, upload to App Store

### Step 3 — Store Accounts
| Store | Cost | Account |
|-------|------|---------|
| Google Play Console | $25 one-time | play.google.com/console |
| Apple App Store (Developer) | $99/year | developer.apple.com |

### Step 4 — Upload & Submit
- **Android**: Upload APK → fill store listing → submit for review (~3 days)
- **iOS**: Open Xcode project → Archive → Upload to App Store Connect → submit (~7 days review)

**Estimated total time: 1-2 weeks from now to live in both stores.**

---

## V3 — NATIVE MOBILE APP (BUILD FROM SCRATCH)

### Recommended Stack: React Native + Expo
- **Why Expo**: No Mac required for development · OTA updates · EAS Build in cloud · same JS codebase for iOS + Android
- **Why React Native**: Reuse existing business logic from V2 (API routes, RAG system) · Large community · Shopify/Meta use it

### Alternative: Capacitor (simpler migration from Next.js)
- Wrap existing Next.js app in a native shell
- Access native APIs (camera, biometrics, push notifications)
- Less performant than React Native but much faster to build

### V3 Architecture Plan
```
alfalah-ai-v3/
├── mobile/          ← React Native + Expo app
│   ├── app/         ← Expo Router screens
│   ├── components/  ← Shared UI components
│   └── api/         ← API client (calls shared backend)
├── backend/         ← Next.js API routes (shared with web)
│   ├── api/analyze/ ← Same RAG + AI logic
│   ├── api/chat/
│   └── api/jobs/
├── web/             ← Next.js web app (reuses backend)
└── data/            ← All .md RAG files (same as v2/*)
```

### V3 Feature Additions (beyond V2)
- [ ] **User Accounts**: Firebase Auth or Clerk — save resume history
- [ ] **Push Notifications**: Job alerts, application reminders
- [ ] **Camera/Photo**: Scan physical resume with phone camera
- [ ] **Offline Mode**: Cache AI results, work without internet
- [ ] **Native Share**: Share results via WhatsApp/Email/LinkedIn
- [ ] **Voice Input**: Speak your career question (mobile mic)
- [ ] **Biometric Lock**: Protect saved resumes with fingerprint/Face ID
- [ ] **All 195 languages**: Enable the multilingual system (already in V2 code, commented out)
- [ ] **Dark/Light mode**: Native OS preference detection
- [ ] **Widgets**: Android/iOS home screen widgets for quick ATS score
- [ ] **App Store Optimization (ASO)**: Keywords: career coach AI, resume analyzer, job search

### V3 Screens (Mobile UX)
```
1. Onboarding (3 slides) → Country + Industry selection
2. Home Dashboard — quick actions
3. Resume Upload — camera scan or file picker
4. Job Description Input — paste or camera scan
5. AI Analysis Results — swipeable cards (one per tool)
6. Saved Results — history with timestamps
7. Settings — country, industry, language, notifications
8. About / Rate App / Share
```

### V3 Key Improvements vs V2
| Feature | V2 Demo | V3 Mobile |
|---------|---------|-----------|
| Platform | Web PWA | Native iOS + Android |
| Code base | Next.js only | React Native + Next.js backend |
| User data | Zero storage | Optional cloud save (Firebase) |
| Languages | English only | 11 languages (already built) |
| Resume input | Paste/file upload | Camera scan + file + paste |
| Results UX | Grouped cards on web | Swipeable native cards |
| Notifications | None | Job alerts push notifications |
| Offline | No | Yes (cached results) |
| App stores | No (PWA only) | Google Play + App Store |

---

## V3 DEVELOPMENT PHASES

### Phase 1 — Setup (Week 1)
- [ ] Create new repo: `alfalah-ai-v3`
- [ ] Init Expo project: `npx create-expo-app alfalah-mobile`
- [ ] Move backend API routes from V2
- [ ] Copy all RAG data files from v2/
- [ ] Set up EAS Build (cloud build — no Mac needed)
- [ ] Connect Vercel backend to mobile app

### Phase 2 — Core Screens (Week 2-3)
- [ ] Onboarding + country/industry picker (native version of V2 splash)
- [ ] Resume input screen (file + paste)
- [ ] Job description input screen
- [ ] Analyze button → loading animation
- [ ] Results screen — swipeable 17 tool cards

### Phase 3 — Native Features (Week 4)
- [ ] Camera scan (expo-camera + OCR)
- [ ] Push notifications (Expo Notifications)
- [ ] Save history (AsyncStorage → Firebase)
- [ ] Share results
- [ ] Settings screen

### Phase 4 — Store Submission (Week 5)
- [ ] EAS Build → generate APK + IPA
- [ ] App Store listing (screenshots, description, keywords)
- [ ] Google Play listing
- [ ] Submit both stores
- [ ] Monitor review

---

## V3 RECOMMENDED TOOLS
| Tool | Purpose | Free? |
|------|---------|-------|
| Expo SDK 51+ | React Native framework | Yes |
| EAS Build | Cloud build (no Mac needed) | Free tier |
| Firebase Auth | User accounts | Free tier |
| Firestore | Resume history storage | Free tier (1GB) |
| expo-camera | Camera scanning | Yes |
| expo-document-picker | File upload (PDF/DOCX) | Yes |
| expo-notifications | Push notifications | Yes |
| React Native Paper | UI components | Yes |
| Vercel | Backend hosting | Free tier |

---

## BRAND ASSETS NEEDED FOR V3
- [ ] Alfalah AI logo PNG (192×192, 512×512, 1024×1024)
- [ ] App Store screenshots (6.7" iPhone, iPad, Android)
- [ ] Feature graphic (1024×500) for Google Play
- [ ] App Store preview video (optional but boosts downloads)
- [ ] Privacy Policy URL (required for both stores)
- [ ] Terms of Service URL

---

## DOMAIN
- `alfalah.app` — owned by Shahzad, connect when ready
- Point to Vercel (CNAME: `cname.vercel-dns.com`) when launching V3

---

## NOTES
- V2 stays live as demo during V3 development
- V3 backend (API routes) built on V2 code — same RAG, same AI chain
- React Native is preferred over Flutter (team uses JS/Next.js already)
- Expo Go app allows testing on physical device without building first
