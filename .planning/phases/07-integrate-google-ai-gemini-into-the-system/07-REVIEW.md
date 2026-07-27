---
phase: 07-integrate-google-ai-gemini-into-the-system
reviewed: 2026-07-27T14:30:00Z
depth: standard
files_reviewed: 5
files_reviewed_list:
  - public/js/farmer-dashboard.js
  - views/weather-analytics.html
  - routes/index.js
  - services/geminiService.js
  - .env.example
findings:
  critical: 1
  warning: 2
  info: 2
  total: 5
status: issues_found
---

# Phase 07: Code Review Report — Google AI Gemini Integration

**Reviewed:** 2026-07-27T14:30:00Z
**Depth:** standard
**Files Reviewed:** 5
**Status:** issues_found

## Summary

This review covers the Gemini AI integration for the "Safe to Plant" Decision Engine on the Weather Analytics page. The integration follows a well-designed fallback architecture: rule-based scoring remains authoritative, Gemini-generated field recommendations are layered on top with graceful degradation to static text. The implementation adheres to the lazy-load pattern established in the codebase and the throttle mechanism prevents rapid double-fire. Authentication and authorization guards are correctly applied.

One **critical** security issue was found: hardcoded production Cloudinary credentials in `routes/index.js` (a pre-existing anti-pattern, not introduced by this phase but detected during review). Two **warning** issues were found: an unbounded `Map` for per-user throttle state and incomplete client-side crop tolerance data for the fallback predictor. Two **info** items document minor code quality observations.

---

## Critical Issues

### CR-01: Hardcoded Production Cloudinary Credentials

**File:** `routes/index.js:29-31`
**Issue:** Production Cloudinary credentials (`cloud_name`, `api_key`, `api_secret`) are hardcoded as string fallbacks in the `cloudinary.config()` call. This is explicitly flagged as a security anti-pattern in CONVENTIONS.md. If this source file is ever committed to a public repository (or if the repo access broadens), these credentials are exposed. While not newly introduced by this phase, the Gemini integration touched this file and the issue remains.

```js
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dir9ljc5q',
  api_key: process.env.CLOUDINARY_API_KEY || '947544355558482',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'JmBJHjNTI7MJ597pr79X7xPZ9lE'
});
```

**Fix:** Remove the hardcoded fallback values. Rely solely on `process.env` variables. If the env vars are not set, throw a clear error at startup or log a warning and disable Cloudinary upload functionality.

```js
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
```

Consider adding a startup check:
```js
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn('⚠️ Cloudinary not configured — image upload disabled');
}
```

---

## Warnings

### WR-01: Unbounded Memory Growth in Per-User Throttle Map

**File:** `routes/index.js:682-683`
**Issue:** The `geminiLastCallByUser` Map stores per-user timestamps for the 3-second Gemini throttle. Entries are added on every request (when the user IS throttled or when Gemini is called) but **never removed**. For a campus pilot with limited users this is not an immediate crash risk, but as the user base grows, the Map accumulates entries indefinitely, creating a slow memory leak. Each entry persists until the process restarts (since `MemoryStore` sessions also reset on restart).

```js
const geminiLastCallByUser = new Map();
const GEMINI_USER_THROTTLE_MS = 3000;
```

**Fix:** (a) Set a TTL on entries — prune entries older than `GEMINI_USER_THROTTLE_MS * 2` on each write. (b) Alternatively, use a `Map` with an eviction policy. (c) Consider a simpler time-window approach using a rolling counter.

Option (a) minimal fix:
```js
// Prune stale entries on each write (keep map bounded)
function pruneGeminiThrottleMap() {
  const cutoff = Date.now() - GEMINI_USER_THROTTLE_MS * 2;
  for (const [uid, ts] of geminiLastCallByUser) {
    if (ts < cutoff) geminiLastCallByUser.delete(uid);
  }
}
// Call pruneGeminiThrottleMap() before/after each set
```

### WR-02: Client-Side Fallback Crop Limits Only Cover 6 of 10 Crops

**File:** `public/js/farmer-dashboard.js:1431-1439`
**Issue:** The `cropLimits` object on the client side only defines tolerance profiles for 6 crops (Rice, Corn, Tomato, Eggplant, Ampalaya, Kangkong). The "Safe to Plant" predictor supports 10 crops — the remaining 4 (Onion, Squash, Sweet Potato, Pepper) are missing. When the API call fails and `fallbackLocalEvaluation()` runs (line 1621), it silently defaults to `cropLimits['Rice']` for any missing crop, producing incorrect fallback recommendations for Onion, Squash, Sweet Potato, and Pepper users.

```js
var cropLimits = {
    'Rice': { rainLimit: 80, tempMin: 22, tempMax: 35, name: 'Palay IR64' },
    'Corn': { rainLimit: 50, tempMin: 18, tempMax: 30, name: 'Corn (OPV)' },
    'Tomato': { rainLimit: 20, tempMin: 20, tempMax: 30, name: 'Tomato' },
    'Eggplant': { rainLimit: 40, tempMin: 20, tempMax: 35, name: 'Eggplant' },
    'Ampalaya': { rainLimit: 70, tempMin: 22, tempMax: 35, name: 'Ampalaya' },
    'Kangkong': { rainLimit: 120, tempMin: 18, tempMax: 38, name: 'Kangkong' }
};
```

**Fix:** Add the missing 4 crops to `cropLimits` with values matching `plantingPredictorService.js`:

```js
var cropLimits = {
    'Rice': { rainLimit: 80, tempMin: 22, tempMax: 35, name: 'Palay IR64' },
    'Corn': { rainLimit: 50, tempMin: 18, tempMax: 30, name: 'Corn (OPV)' },
    'Tomato': { rainLimit: 20, tempMin: 20, tempMax: 30, name: 'Tomato' },
    'Eggplant': { rainLimit: 40, tempMin: 20, tempMax: 35, name: 'Eggplant' },
    'Ampalaya': { rainLimit: 70, tempMin: 22, tempMax: 35, name: 'Ampalaya' },
    'Kangkong': { rainLimit: 120, tempMin: 18, tempMax: 38, name: 'Kangkong' },
    'Onion': { rainLimit: 20, tempMin: 13, tempMax: 32, name: 'Onion (Sibuyas)' },
    'Squash': { rainLimit: 45, tempMin: 18, tempMax: 36, name: 'Squash (Kalabasa)' },
    'Sweet Potato': { rainLimit: 55, tempMin: 18, tempMax: 37, name: 'Sweet Potato (Kamote)' },
    'Pepper': { rainLimit: 30, tempMin: 18, tempMax: 36, name: 'Pepper (Siling Labuyo)' }
};
```

---

## Info

### IN-01: Inert `eslint-disable` Comment

**File:** `services/geminiService.js:56`
**Issue:** Line 57 contains the comment `// eslint-disable-next-line no-control-regex` which suppresses a lint warning. However, **no ESLint configuration exists** in the project (confirmed by CONVENTIONS.md: "No ESLint configuration present"). The comment is inert and serves only as documentation. While harmless, removing it would keep the codebase clean since there is no linter to suppress.

```js
// eslint-disable-next-line no-control-regex
s = s.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim();
```

**Fix:** Either remove the comment, or optionally add an `.eslintrc` config to the project and keep the suppression for correctness. Recommend removing it since no linter is configured.

### IN-02: Duplicate Language Normalization (Harmless)

**File:** `routes/index.js:705-706` and `services/geminiService.js:81-86`
**Issue:** The language value passes through two separate normalization steps — first in `routes/index.js` (where `minasbate` → `filipino`, invalid → `english`), then again in `geminiService.normalizeLanguage()` (same logic plus `tl`/`fil` aliases). The double normalization is harmless because both paths produce the same result, but it creates a maintenance burden: if the language map changes, both spots must stay in sync.

**routes/index.js:705-706:**
```js
let language = (req.body && req.body.language) ? String(req.body.language).toLowerCase() : 'english';
if (language === 'minasbate') language = 'filipino';
if (language !== 'filipino' && language !== 'english') language = 'english';
```

**services/geminiService.js:81-86:**
```js
function normalizeLanguage(language) {
  const lang = (language || 'english').toString().toLowerCase().trim();
  if (lang === 'filipino' || lang === 'minasbate' || lang === 'tl' || lang === 'fil') {
    return 'filipino';
  }
  return 'english';
}
```

**Fix:** Remove the normalization in the route handler and let `geminiService.normalizeLanguage()` be the single source of truth. The route handler can pass the raw `language` value through.

---

_Reviewed: 2026-07-27T14:30:00Z_
_Reviewer: gsd-code-reviewer agent_
_Depth: standard_
