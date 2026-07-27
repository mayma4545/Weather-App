# Phase 7: Integrate Google AI (Gemini) into the system - Context

**Gathered:** 2026-07-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Add Google Gemini to the DEBESMSCAT Weather & Smart Crop platform so the **Actionable Field Recommendations** block on `/farmer/weather-analytics` is AI-generated, crop- and weather-aware text — not the current static template bullets from `plantingPredictorService`.

Out of scope for this phase: general chatbots, student tutoring product, SMS/push, replacing OpenWeather, replacing rule-based safety index / traffic light / factor scores, full rewrite of dashboards.

</domain>

<decisions>
## Implementation Decisions

### Primary AI job
- **D-01:** Gemini’s only product job in this phase is generating **Actionable Field Recommendations** on the weather-analytics planting predictor UI (`#predictor-recommendations-list`).
- **D-02:** Do **not** build a free-form chat assistant, daily briefing product, or study helper in this phase.
- **D-03:** Rule-based planting predictor stays authoritative for **safety index, traffic light, verdict title/description, and factor breakdown**. Gemini writes **recommendations only**.

### Trigger & UX placement
- **D-04:** Surface remains `/farmer/weather-analytics` — the existing “Actionable Field Recommendations” card under the planting safety predictor (not a new nav page or chat drawer).
- **D-05:** Generation runs **automatically when the farmer selects a crop** (same moment the predictor already loads) — no separate “Generate with AI” button required for v1.
- **D-06:** Output format: **3–5 concrete field-action bullets** (what to do on the field now / this week), not a long essay.

### Language
- **D-07:** Recommendation language **follows the app language toggle** (Filipino or English), consistent with existing farmer UI i18n.

### Agent's Discretion
- Exact Gemini model ID and SDK vs raw `fetch` to Google Generative Language API
- Env var name (prefer `GOOGLE_AI_API_KEY` or `GEMINI_API_KEY`) — **never** commit or hardcode keys; user must place key in `.env` only
- Prompt structure, token limits, and caching strategy
- On Gemini failure/timeout: fall back to existing static `plantingPredictorService` recommendations (or clear error + static bullets) so the page never goes blank
- Server-side-only API calls (key never exposed to browser); auth via existing `requireAuth`
- Optional short disclaimer that AI advice supplements, not replaces, local agronomist judgment
- Rate limiting / simple per-user throttling if needed for free-tier quotas
- Whether to pass full predictor JSON + forecast metrics into the prompt (recommended yes — grounded on live scores)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product & planning
- `.planning/PROJECT.md` — stack evolve-not-rewrite; OpenWeather stay; campus pilot quality; secrets/budget posture
- `.planning/REQUIREMENTS.md` — CROP-08/CROP-09 (planting guidance actionable); PLAT-04 (clear error/empty states)
- `.planning/ROADMAP.md` — Phase 7 entry
- `.planning/codebase/INTEGRATIONS.md` — external API patterns (OpenWeather proxy, env keys, server-side only)
- `.planning/codebase/ARCHITECTURE.md` — routes + services + static views pattern
- `.planning/codebase/CONVENTIONS.md` — CommonJS services, lazy-load services, sanitizeInput, no hardcoded secrets

### Implementation touchpoints
- `views/weather-analytics.html` — Actionable Field Recommendations UI (`#predictor-recommendations-list`)
- `services/plantingPredictorService.js` — rule-based scores + current static `recommendations[]`
- `public/js/new-farmer-dashboard.js` / `public/js/farmer-dashboard.js` — `renderPredictorResult`, crop-select predictor fetch
- `routes/index.js` — predictor/advisor routes, lazy service loading, `requireAuth`
- `utils/weatherService.js` — weather fetch/cache pattern to mirror for external API style

No external Gemini product ADR in-repo — use Google AI / Gemini API docs at plan/research time. **Never store user-supplied API keys in planning docs or source.**

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `plantingPredictorService.evaluatePlantingSafety` (or equivalent export): produces `safetyIndex`, `trafficLight`, `factors`, `metrics`, static `recommendations` — keep scores; replace or override recommendation text with Gemini output server-side or in response shaping
- Weather forecast + crop key already loaded on weather-analytics crop select
- Lazy-load pattern in `routes/index.js` for optional services (`try/catch` require → 503 if missing)

### Established Patterns
- External APIs called only from Node (OpenWeather via `utils/weatherService.js`); browser calls `/api/*`
- Advisor-style pure services under `services/` with JSDoc; routes assemble context
- Farmer pages: static HTML + vanilla JS DOM updates
- Bilingual strings via client translation maps / language toggle

### Integration Points
- Predictor API response path that currently returns `recommendations: string[]` — extend to Gemini-generated list (with fallback)
- `renderPredictorResult` already maps `data.recommendations` into the UL — minimal frontend change if API shape stays an array of strings
- Page route: `GET /farmer/weather-analytics` → `views/weather-analytics.html`

</code_context>

<specifics>
## Specific Ideas

- User quote (intent): only wants AI to make **“actionable field recommendation”** at `http://localhost:4000/farmer/weather-analytics`, rather than static text.
- UI label already exists: **“Actionable Field Recommendations”** — enhance that block, don’t invent a parallel AI panel.
- Static examples today are generic templates like “Proceed with field preparation…”, “Clear drainage…”, “Postpone sowing…” — AI should make these **specific to live metrics** (temps, rain peaks, crop, risk level).

</specifics>

<deferred>
## Deferred Ideas

- Free-form crop/farm Q&A chat
- “Explain my advisors” across irrigation/disease/fertilizer pages
- Daily farm assistant / todo narrative
- Student study helper / quiz AI
- Replacing rule-based safety scoring with LLM judgment
- Multi-page AI features outside weather-analytics

None folded from todos (no matching pending todos).

</deferred>

---

*Phase: 07-integrate-google-ai-gemini-into-the-system*
*Context gathered: 2026-07-27*
