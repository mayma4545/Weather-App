# Phase 7: Integrate Google AI (Gemini) into the system - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-27
**Phase:** 07-integrate-google-ai-gemini-into-the-system
**Areas discussed:** AI job / primary use (scoped to weather-analytics field recommendations)

---

## Gray area selection

| Option | Description | Selected |
|--------|-------------|----------|
| AI job / primary use | What Gemini does first | ✓ |
| Where it appears in the app | Chat drawer vs page vs inline | |
| What context Gemini gets | Free chat vs grounded | |
| Safety, language, limits | Guardrails and quotas | |

**User's choice:** AI job / primary use only

---

## AI job / primary use

| Option | Description | Selected |
|--------|-------------|----------|
| Crop & farm Q&A chat | Free-form Q&A | |
| Explain my advisors | Plain-language advisor explain | |
| Daily farm assistant | One-shot daily briefing | |
| Student study helper | Education-first | |
| (Other) | User free text | ✓ |

**User's choice:** Only make an "actionable field recommendation" at `/farmer/weather-analytics`, rather than static text.

**Notes:** Mapped to existing UI block “Actionable Field Recommendations” (`#predictor-recommendations-list`) fed today by static arrays in `plantingPredictorService`.

---

## Relation to rule-based predictor

| Option | Description | Selected |
|--------|-------------|----------|
| AI writes recommendations only | Scores stay rule-based | ✓ |
| AI rewrites verdict + recommendations | Scores stay; verdict text AI | |
| AI replaces the whole predictor | LLM judgment for safety | |

**User's choice:** AI writes recommendations only (Recommended)

---

## When to generate

| Option | Description | Selected |
|--------|-------------|----------|
| Auto on crop select | Same flow as today | ✓ |
| Button: Generate with AI | Opt-in upgrade | |
| Always AI, no static fallback text | AI-only list | |

**User's choice:** Auto on crop select (Recommended)

---

## Recommendation shape

| Option | Description | Selected |
|--------|-------------|----------|
| 3–5 concrete field actions | Bullet list of actions | ✓ |
| One short paragraph briefing | Narrative | |
| Bullets + priority tags | Do now / This week / Watch | |

**User's choice:** 3–5 concrete field actions (Recommended)

---

## Language

| Option | Description | Selected |
|--------|-------------|----------|
| Follow app language toggle | FI/EN from UI | ✓ |
| English only | | |
| Filipino only | | |

**User's choice:** Follow app language toggle (Recommended)

---

## Continue / scope

| Option | Description | Selected |
|--------|-------------|----------|
| Next / ready for context | Write CONTEXT.md | ✓ |
| More on this area | | |
| Also discuss safety & limits | | |

**User's choice:** Next / ready for context (Recommended)

**Notes:** Technical defaults (env key, server-side only, static fallback on failure) left to agent discretion.

---

## the agent's Discretion

- Model/SDK choice, env var naming, prompt design, caching
- Fallback to static recommendations on Gemini failure
- Server-side key only; auth; optional disclaimer; light rate limits
- Grounding prompt on predictor JSON + weather metrics

## Deferred Ideas

- Chat, multi-advisor explain, daily assistant, student helper, LLM safety scoring
