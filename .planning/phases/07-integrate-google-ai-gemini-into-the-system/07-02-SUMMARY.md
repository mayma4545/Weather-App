---
phase: 07-integrate-google-ai-gemini-into-the-system
plan: 02
subsystem: api
tags: [gemini, predict-planting, requireAuth, recommendations, fallback]

requires:
  - phase: 07-01
    provides: "services/geminiService.js generateFieldRecommendations + isConfigured"
provides:
  - "POST /api/weather/predict-planting requireAuth + Gemini recommendation override"
  - "recommendations_source gemini|static with static plantingPredictor fallback"
affects:
  - 07-03 (client UX for AI recommendations / language param)

tech-stack:
  added: []
  patterns:
    - "Rule-based evaluatePlantingSafety authoritative; Gemini overrides recommendations[] only"
    - "recommendations_source + short recommendations_error code on AI fallback"
    - "3s in-memory per-user Gemini throttle against double-fire"

key-files:
  created: []
  modified:
    - routes/index.js

key-decisions:
  - "Gemini override only when isConfigured and ≥3 bullets; else keep static recommendations"
  - "3s per-user skip of Gemini still returns full rule-based payload with static bullets"
  - "Alert load uses session auth path (Alert.findAll is_active limit 20) not req.user"

patterns-established:
  - "Auth-protected predictor: requireAuth → allowlist cropKey → evaluate → optional AI recommendations"
  - "language body: filipino|english with minasbate→filipino coerce"

requirements-completed: [CROP-08, CROP-09, PLAT-04]

duration: 4min
completed: 2026-07-27
---

# Phase 07 Plan 02: Predict-Planting Gemini Wire Summary

**Auth-protected predict-planting with Gemini recommendation override and static plantingPredictor fallback**

## Performance

- **Duration:** 4 min
- **Started:** 2026-07-27T09:45:27Z
- **Completed:** 2026-07-27T09:49:30Z
- **Tasks:** 2/2
- **Files modified:** 1

## Accomplishments

- Lazy-loaded `geminiService` with try/catch alongside other agricultural services
- Secured `POST /api/weather/predict-planting` with `requireAuth` (401 JSON when logged out)
- Hardened `cropKey` via `sanitizeInput` + allowlist (invalid/missing → Rice)
- After rule-based `evaluatePlantingSafety`, optionally overrides `recommendations` only via Gemini; scores/verdict/factors unchanged
- On Gemini failure/unconfigured/throttle: static bullets remain; `recommendations_source: 'static'`; short `recommendations_error: 'ai_unavailable'` when catch path runs
- Language from body honored (filipino|english; minasbate→filipino)

## Task Commits

Each task was committed atomically:

1. **Task 1: Lazy-load geminiService and secure predict-planting with requireAuth** - `da8846b` (feat)
2. **Task 2: Override recommendations with Gemini; static fallback; language param** - `21d5d7b` (feat)

**Plan metadata:** (pending final docs commit)

## Files Created/Modified

- `routes/index.js` - geminiService lazy-load; requireAuth + cropKey allowlist; Gemini recommendation wire + static fallback + 3s throttle

## Decisions Made

- Implemented optional 3s per-user in-memory Gemini throttle (plan agent discretion) to blunt chip+select double-fire
- Alerts always loaded under requireAuth via `Alert.findAll({ where: { is_active: true }, limit: 20 })` instead of non-existent `req.user`
- Never assign safetyIndex/trafficLight/verdict from AI — only `evaluation.recommendations` and source metadata

## Deviations from Plan

None - plan executed exactly as written (optional throttle included per plan discretion).

## Issues Encountered

None

## User Setup Required

Same as Plan 01 — operator must set `GOOGLE_AI_API_KEY` (or `GEMINI_API_KEY`) in `.env` for live AI bullets. Without a key, API still returns 200 with static `recommendations` and `recommendations_source: 'static'`.

## Next Phase Readiness

- Plan 03 can pass `language` from the farmer UI toggle and optionally surface `recommendations_source` / subtle AI disclaimer
- Client can keep mapping `data.recommendations` string[] into `#predictor-recommendations-list`
- No chat/briefing routes added (D-02, D-04)

## Self-Check: PASSED

- FOUND: `routes/index.js` with `requireAuth` on predict-planting
- FOUND: `generateFieldRecommendations` + `recommendations_source` gemini|static
- FOUND: commit `da8846b`
- FOUND: commit `21d5d7b`
- Automated verify: route auth+lazyload ok; predict-planting gemini wire ok

---
*Phase: 07-integrate-google-ai-gemini-into-the-system*
*Completed: 2026-07-27*
