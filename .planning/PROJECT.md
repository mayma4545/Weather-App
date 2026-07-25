# DEBESMSCAT Weather & Smart Crop Platform

## What This Is

A web platform for DEBESMSCAT that combines campus weather monitoring with smart crop management tools for campus agriculturists (farmers) and agriculture students. It delivers real-time and forecast weather for the DEBESMSCAT campus, early-warning advisories, weather-informed planting and plot guidance, and a crop knowledge repository—evolving the existing Weather codebase into a usable campus pilot.

## Core Value

Campus users can trust local weather data and act on clear crop advisories in time to reduce climate-related crop risk and improve plot decisions.

## Requirements

### Validated

<!-- Inferred from existing codebase — shipped capabilities to preserve and harden -->

- ✓ User authentication with email/password, OTP registration, and session-based roles (Admin / Agriculturist) — existing
- ✓ Farmer dashboard with farm plots, planting records, and crop selection — existing
- ✓ Admin dashboard for users, crops, alerts, and operational oversight — existing
- ✓ OpenWeather-backed current weather and forecast (proxy + caching) — existing
- ✓ Agricultural advisor services (irrigation, disease risk, fertilizer, GDD/growth stage, typhoon risk) — existing
- ✓ Crop repository with image upload (Cloudinary) — existing
- ✓ In-app alerts and admin broadcast with email delivery path — existing
- ✓ Soil profiles and weather logging models — existing
- ✓ Agricultural trivia content model/seed path — existing

### Active

<!-- Current scope. Building toward these for the campus pilot. -->

- [ ] Reliable campus-scoped weather (current + forecast: temperature, rainfall, wind) via OpenWeather with commercial-grade reliability patterns (caching, graceful degradation, clear freshness)
- [ ] Early-warning system for heavy rainfall and extreme heat with in-app + email delivery farmers/students actually receive
- [ ] Crop management decision support: harden existing advisors and add weather-trend planting schedule guidance per plot
- [ ] Actionable plot guidance so users manage different farm plots with clearer growth-stage and next-step insights
- [ ] Centralized crop knowledge hub: crop varieties, best practices, and management guidelines (browseable, remote-accessible)
- [ ] Usable campus pilot UX for DEBESMSCAT farmers and students (not prototype-only)
- [ ] Support DEBESMSCAT agriculture + technology education goals through a data-driven learning-capable environment (pilot quality)

### Out of Scope

- IoT / on-site weather station hardware integration — deferred past v1 pilot; API weather is the source of truth
- SMS / push notification channels — v1 is in-app + email only
- Satellite / remote sensing (Agromonitoring-style) features — deferred
- Google Weather API migration — stay on OpenWeather for v1
- Multi-location / regional coverage beyond DEBESMSCAT campus — campus-fixed weather for v1
- Full structured e-learning (courses, graded quizzes, LMS) — knowledge hub is catalog + best practices, not a full LMS
- Mobile native apps — web-first pilot
- Commercial farmer marketplace / e-commerce — not part of academic pilot

## Context

**Institution:** DEBESMSCAT (Dr. Emilio B. Espinosa Sr. Memorial State College of Agriculture and Technology), Masbate region context.

**Problem:** Agriculturists face climate risk (heavy rain, extreme heat) similar to damages reported in MIMAROPA and Masbate. Traditional observational planning is insufficient; farmers and students need data-driven weather + crop decision support.

**Users:**
- Campus agriculturists / farmers managing DEBESMSCAT plots
- Students studying agriculture at the university

**Codebase state (brownfield):**
- Express 5 + vanilla HTML/CSS/JS farmer & admin dashboards
- Sequelize (SQLite dev / MySQL prod)
- OpenWeather integration, advisor services, alerts, crop repo, trivia already present
- Known gaps: prototype reliability/polish, alert trustworthiness, stronger planting calendar, campus-pilot readiness (see also `IMPROVEMENT.md` and `.planning/codebase/CONCERNS.md`)

**Success bar:** Usable pilot on campus — real plots, reliable weather, working alerts, trustworthy advisors, usable knowledge hub.

**Strategic alignment:** Modernize traditional farming approaches through digital transformation; reflect higher standards in agricultural education for students and faculty.

## Constraints

- **Tech stack**: Evolve existing Node/Express/Sequelize/vanilla frontend stack — do not greenfield rewrite
- **Weather provider**: OpenWeather for v1 (not Google Weather)
- **Geography**: DEBESMSCAT campus weather scope only
- **Notifications**: In-app + email only in v1 (no SMS)
- **Users**: Farmers and students; Admin role remains for content/ops
- **Quality bar**: Campus pilot usable daily — prioritize reliability over new experimental features
- **Budget posture**: Prefer existing integrations; avoid new paid channels in v1 unless essential

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Evolve existing Weather codebase | Faster path to pilot; substantial domain logic already built | — Pending |
| OpenWeather (keep) over Google Weather | Already integrated; focus effort on reliability and product value | — Pending |
| Campus-only weather location | Matches DEBESMSCAT pilot; simplifies accuracy expectations | — Pending |
| In-app + email alerts (no SMS) | Email path exists; SMS adds cost/complexity after pilot proves value | — Pending |
| Harden advisors + add planting calendar | Existing services are foundation; planting schedule is the missing decision centerpiece | — Pending |
| Knowledge hub = catalog + best practices | Bridges info gap without building full LMS in v1 | — Pending |
| Defer IoT stations, SMS, satellite | Concentrate on API weather + decision tools + knowledge for a usable pilot | — Pending |
| Dual audience: farmers + students | Same product serves operators and education from day one | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-25 after initialization*
