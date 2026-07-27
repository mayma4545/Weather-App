---
phase: 07-integrate-google-ai-gemini-into-the-system
fixed_at: 2026-07-27T22:30:00Z
review_path: .planning/phases/07-integrate-google-ai-gemini-into-the-system/07-REVIEW.md
iteration: 1
findings_in_scope: 3
fixed: 3
skipped: 0
status: all_fixed
---

# Phase 07: Code Review Fix Report

**Fixed at:** 2026-07-27T22:30:00Z
**Source review:** .planning/phases/07-integrate-google-ai-gemini-into-the-system/07-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope (critical + warning): 3
- Fixed: 3
- Skipped: 0

## Fixed Issues

### CR-01: Hardcoded Production Cloudinary Credentials

**Files modified:** `routes/index.js`
**Commit:** `5211aec`
**Applied fix:** Removed hardcoded Cloudinary `cloud_name`, `api_key`, and `api_secret` fallback strings from `cloudinary.config()`. Now relies solely on `process.env` variables. Added a startup warning check that logs a message when Cloudinary is not configured, indicating image upload will be disabled.

### WR-01: Unbounded Memory Growth in Per-User Throttle Map

**Files modified:** `routes/index.js`
**Commit:** `fde88ce`
**Applied fix:** Added `pruneGeminiThrottleMap()` function that prunes entries older than `GEMINI_USER_THROTTLE_MS * 2` on each write to the `geminiLastCallByUser` Map. The prune function is called before every `Map.set()` in the predict-planting handler, keeping the map bounded and preventing indefinite memory accumulation.

### WR-02: Client-Side Fallback Crop Limits Only Cover 6 of 10 Crops

**Files modified:** `public/js/farmer-dashboard.js`
**Commit:** `7d90352`
**Applied fix:** Added the 4 missing crop tolerance profiles to `cropLimits` — Onion, Squash, Sweet Potato, and Pepper — with `rainLimit`, `tempMin`, `tempMax`, and `name` values matching the server-side `plantingPredictorService.js` definitions. This ensures `fallbackLocalEvaluation()` produces correct recommendations for all 10 supported crops when the API call fails.

## Skipped Issues

None — all in-scope findings were fixed.

---

_Fixed: 2026-07-27T22:30:00Z_
_Fixer: gsd-code-fixer agent_
_Iteration: 1_
