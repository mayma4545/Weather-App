---
phase: 07-integrate-google-ai-gemini-into-the-system
plan: 01
subsystem: api
tags: [gemini, google-ai, recommendations, native-fetch, prompt-injection]

requires: []
provides:
  - "services/geminiService.js — generateFieldRecommendations + prompt/parse/key helpers"
  - ".env.example Gemini key documentation (GOOGLE_AI_API_KEY / GEMINI_API_KEY / GEMINI_MODEL)"
affects:
  - 07-02 (predict-planting route wiring + static fallback)
  - 07-03 (client UX for AI recommendations)

tech-stack:
  added: []
  patterns:
    - "Native fetch to Generative Language API (no @google/generative-ai SDK)"
    - "DATA_START/DATA_END prompt boundary + cropKey allowlist against injection"
    - "Throw-on-failure service contract for route-level static fallback"

key-files:
  created:
    - services/geminiService.js
    - .env.example
  modified: []

key-decisions:
  - "Use native fetch + gemini-2.0-flash default (GEMINI_MODEL override) instead of new npm dependency"
  - "Accept both GOOGLE_AI_API_KEY and GEMINI_API_KEY; prefer GOOGLE_AI_API_KEY"
  - "Missing key warns once then throws so Plan 02 can fall back to static recommendations"

patterns-established:
  - "Gemini service mirrors weatherService: env keys only, AbortController timeout, no browser exposure"
  - "Prompt free-text sanitized (control chars stripped, 200-char cap); bullets capped ~280 chars"

requirements-completed: [CROP-08, CROP-09]

duration: 2min
completed: 2026-07-27
---

# Phase 07 Plan 01: Gemini Service Foundation Summary

**Server-only Gemini client with safe prompt builder and 3–5 bullet parser for Actionable Field Recommendations**

## Performance

- **Duration:** 2 min
- **Started:** 2026-07-27T09:42:03Z
- **Completed:** 2026-07-27T09:43:48Z
- **Tasks:** 2/2
- **Files modified:** 2

## Accomplishments

- Created `services/geminiService.js` with full export contract: `getApiKey`, `isConfigured`, `buildRecommendationsPrompt`, `parseRecommendationsResponse`, `generateFieldRecommendations`
- Prompt enforces fixed system instruction, Filipino/English switch (minasbate→filipino), DATA_START/END injection boundary, cropKey allowlist, free-text length limits
- Native `fetch` to `generativelanguage.googleapis.com` with 12s AbortController timeout and maxOutputTokens 512 — no new npm dependency
- Documented empty Gemini env placeholders in `.env.example` (no secrets); `.env` remains gitignored

## Task Commits

Each task was committed atomically:

1. **Task 1: Create geminiService with key resolution, prompt, parse, and fetch** - `a97146d` (feat)
2. **Task 2: Document env vars in .env.example (no secrets)** - `e566f1b` (chore)

**Plan metadata:** (pending final docs commit)

## Files Created/Modified

- `services/geminiService.js` - Gemini generateContent client, prompt builder, response parser, key resolution
- `.env.example` - Onboarding template including GOOGLE_AI_API_KEY / GEMINI_* placeholders

## Decisions Made

- Prefer native `fetch` over `@google/generative-ai` to keep CommonJS stack lean (plan agent discretion)
- Default model `gemini-2.0-flash` via `GEMINI_MODEL` env override
- One-time missing-key console.warn only when generate is attempted (not at module load)
- Errors never echo API key or full query-string URL (T-07-05)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

**External service requires operator configuration before live AI recommendations work:**

1. Create a Google AI Studio key: https://aistudio.google.com/apikey
2. Add to local `.env` (never commit):
   ```
   GOOGLE_AI_API_KEY=your_key_here
   # optional:
   # GEMINI_MODEL=gemini-2.0-flash
   ```
3. Without a key, `generateFieldRecommendations` throws — Plan 02 will fall back to static plantingPredictor recommendations so the UI never blanks.

## Next Phase Readiness

- Plan 02 can lazy-require `geminiService`, call `generateFieldRecommendations(evaluation, { language })` after rule-based scoring, and catch throws → static `recommendations[]`
- Client can keep consuming `recommendations: string[]` with minimal change
- No HTTP surface in this plan (auth on route is Plan 02 / T-07-03)

## Self-Check: PASSED

- FOUND: `services/geminiService.js`
- FOUND: `.env.example`
- FOUND: commit `a97146d`
- FOUND: commit `e566f1b`
- Automated verify: parse + buildRecommendationsPrompt DATA_START boundary OK; module exports all five functions

---
*Phase: 07-integrate-google-ai-gemini-into-the-system*
*Completed: 2026-07-27*
