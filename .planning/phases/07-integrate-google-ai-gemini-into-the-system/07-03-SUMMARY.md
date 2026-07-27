---
phase: 07-integrate-google-ai-gemini-into-the-system
plan: 03
subsystem: "Client UX — weather-analytics"
tags: ["gemini", "predict-planting", "language", "xss", "loading-state"]
dependency_graph:
  requires: ["02-predict-planting-wire"]
  provides: ["language-field", "loading-state", "xss-safe-render", "source-note"]
  affects: ["farmer-dashboard.js", "weather-analytics.html"]
tech-stack:
  added: []
  patterns: ["textContent for AI text rendering", "inline loading state before async fetch"]
key-files:
  created: []
  modified:
    - public/js/farmer-dashboard.js
    - views/weather-analytics.html
decisions: []
metrics:
  duration: "1 min"
  completed_date: "2026-07-27"
---

# Phase 7 Plan 3: Client UX — Language, Loading, Safe Render

One-liner: Weather-analytics crop select passes language param, shows loading state, and renders AI/static recommendation bullets safely via textContent on the existing Actionable Field Recommendations card.

## Tasks

| Task | Name                                                                 | Commit   | Files Modified                    |
| ---- | -------------------------------------------------------------------- | -------- | --------------------------------- |
| 1    | Pass language, loading state, and XSS-safe recommendation rendering  | `075c82d` | `public/js/farmer-dashboard.js`   |
| 2    | HTML affordance for source note + optional disclaimer on same card   | `7d4e0c3` | `views/weather-analytics.html`    |

## Task Details

### Task 1 — `public/js/farmer-dashboard.js`

1. **Loading state (PLAT-04):** In `updatePredictor` before the fetch call, set a single `<li>` with textContent showing "Generating field recommendations…" / "Gumagawa ng rekomendasyon sa bukid…"
2. **Language in request body (D-07):** Derive `lang` from `currentLanguage` (filipino/minasbate → 'filipino', else 'english'); include as `language` in `POST /api/weather/predict-planting` JSON body
3. **Safe render (XSS — T-07-10 mitigated):** Replace any unsafe innerHTML concatenation with `li.textContent = String(r)` via `createElement` loop; empty-state fallback in bilingual text
4. **Source note:** Set `#predictor-recommendations-source` textContent based on `recommendations_source` ('gemini' / 'static'), bilingual
5. **No "Generate with AI" button (D-05):** No such UI added
6. **No chat UI or new nav (D-02/D-04):** No new product surface

### Task 2 — `views/weather-analytics.html`

1. Added `#predictor-recommendations-source` paragraph (inline styled, green, 11px) for AI/static source attribution
2. Added `#predictor-ai-disclaimer` paragraph with standard disclaimer text
3. Confirmed `<script src="/js/farmer-dashboard.js"></script>` is the only JS bundle
4. No CSS file needed — inline styles match surrounding card pattern
5. No chat drawers, new nav links, or second AI panel

## Deviations from Plan

None — plan executed exactly as written.

## Threat Surface

### STRIDE Mitigations Applied

| Threat ID | Category | Status | Evidence |
|-----------|----------|--------|----------|
| T-07-10 | XSS / Tampering | **mitigated** | `li.textContent = String(r)` — no innerHTML concatenation of AI text |
| T-07-11 | Information Disclosure | **accepted** | No GOOGLE_AI_API_KEY in client bundle |
| T-07-12 | Spoofing | **accepted** | Server coerces language enum; worst case wrong language bullets |
| T-07-04 | E (Auth) | **mitigated** | Page already behind requireAuth; fetch uses session cookie |

**High-severity gate T-07-10**: Confirmed mitigated — AI text rendering uses `textContent`, never `innerHTML`.

## Verification Results

```
PASS: no unsafe recommendations map
PASS: language param uses lang variable
PASS: loading state present
PASS: no Generate with AI button
PASS: source element in HTML
PASS: disclaimer element in HTML
PASS: XSS-safe textContent rendering
```

## Success Criteria

- [x] Farmer on `/farmer/weather-analytics` sees AI (or static fallback) bullets after crop select
- [x] Language follows app toggle
- [x] XSS-safe rendering of recommendation text
- [x] Clear loading state while request in flight

## Self-Check: PASSED

All created/modified files verified present. All commits verified in git history.
