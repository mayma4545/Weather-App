# Roadmap: DEBESMSCAT Weather & Smart Crop Platform

## Overview

Evolve the existing Express/Sequelize weather app into a campus-usable pilot: harden authentication and role access, make OpenWeather campus data trustworthy (freshness + graceful degradation), deliver early warnings farmers actually receive (in-app + email), complete plot/planting decision support with a weather-trend planting calendar, polish the crop knowledge hub, and ship mobile-usable farmer/admin dashboards with clear loading and error states. Brownfield path — no rewrite; reliability and pilot polish over new experimental features.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Auth & Access Hardening** - Secure register/login/logout and role enforcement for pilot users
- [ ] **Phase 2: Reliable Campus Weather** - Trustworthy current + forecast weather with freshness and graceful degradation
- [ ] **Phase 3: Early Warning System** - Heavy rain / extreme heat advisories via in-app inbox and email
- [ ] **Phase 4: Crop Decisions & Planting Calendar** - Plots, plantings, hardened advisors, and when-to-plant guidance
- [ ] **Phase 5: Knowledge Hub** - Browseable crop catalog and best-practice guidelines with admin maintenance
- [ ] **Phase 6: Campus Pilot UX** - Daily-usable farmer/admin dashboards on mobile with clear empty/loading/error states
- [ ] **Phase 7: Integrate Google AI (Gemini)** - AI-generated Actionable Field Recommendations on weather-analytics

## Phase Details

### Phase 1: Auth & Access Hardening
**Goal**: Users can securely access the platform with correct Agriculturist vs Admin roles
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04
**Success Criteria** (what must be TRUE):
  1. User can register with email/password and complete OTP verification
  2. User can log in and stay logged in across browser refresh (session)
  3. User can log out securely and is blocked from protected pages afterward
  4. System enforces Agriculturist vs Admin access on pages and APIs (wrong role cannot reach the other dashboard or its APIs)
**Plans**: TBD

### Phase 2: Reliable Campus Weather
**Goal**: Users can trust DEBESMSCAT campus current weather and forecast with clear freshness and no dashboard breakage on API failure
**Depends on**: Phase 1
**Requirements**: WTHR-01, WTHR-02, WTHR-03, WTHR-04
**Success Criteria** (what must be TRUE):
  1. User can view current campus weather (temperature, rainfall, wind speed) for DEBESMSCAT
  2. User can view multi-day forecast for campus (temperature, rainfall, wind)
  3. Weather data shows freshness/last-updated so users know if data is current
  4. When OpenWeather fails or is slow, UI degrades gracefully (cached data and/or clear error) without breaking the dashboard
**Plans**: TBD
**UI hint**: yes

### Phase 3: Early Warning System
**Goal**: Users receive and manage heavy-rainfall and extreme-heat advisories in time via in-app inbox and email
**Depends on**: Phase 2
**Requirements**: ALRT-01, ALRT-02, ALRT-03, ALRT-04, ALRT-05, ALRT-06
**Success Criteria** (what must be TRUE):
  1. System generates advisories for heavy rainfall based on weather thresholds/forecast
  2. System generates advisories for extreme heat based on weather thresholds/forecast
  3. User can view alerts in an in-app inbox on the farmer dashboard, see severity/type, and mark or dismiss alerts as read
  4. User receives alert notifications by email for relevant advisories
  5. Admin can broadcast targeted or global advisories to agriculturists
**Plans**: TBD
**UI hint**: yes

### Phase 4: Crop Decisions & Planting Calendar
**Goal**: Agriculturists manage plots and plantings and get actionable weather-informed advisor and planting-schedule guidance
**Depends on**: Phase 2
**Requirements**: CROP-01, CROP-02, CROP-03, CROP-04, CROP-05, CROP-06, CROP-07, CROP-08, CROP-09
**Success Criteria** (what must be TRUE):
  1. Agriculturist can create and manage farm plots and record/track active plantings (crop + dates)
  2. User can view irrigation, disease risk, fertilizer, growth-stage (GDD), and typhoon/storm risk for a selected plot
  3. User can view weather-trend based planting schedule guidance (when-to-plant / avoid windows)
  4. Advisor outputs are actionable — clear recommendation plus short rationale, not raw metrics only
**Plans**: TBD
**UI hint**: yes

### Phase 5: Knowledge Hub
**Goal**: Users browse a centralized crop knowledge hub; admins maintain catalog and best-practice content
**Depends on**: Phase 1
**Requirements**: KNOW-01, KNOW-02, KNOW-03, KNOW-04
**Success Criteria** (what must be TRUE):
  1. User can browse a crop catalog (varieties with details and images)
  2. User can read best-practice / management guidelines for crops
  3. Admin can create, update, and remove crop catalog entries
  4. Admin can maintain best-practice content linked to crops
**Plans**: TBD
**UI hint**: yes

### Phase 6: Campus Pilot UX
**Goal**: Farmer and admin primary flows are daily-usable on campus (including mobile web) with clear empty, loading, and error states
**Depends on**: Phase 2, Phase 3, Phase 4, Phase 5
**Requirements**: PLAT-01, PLAT-02, PLAT-03, PLAT-04
**Success Criteria** (what must be TRUE):
  1. Agriculturist has a farmer dashboard as daily workspace (weather, plots, advisories, alerts)
  2. Admin has an admin dashboard for users, content, and alert operations
  3. Farmer and admin primary flows work on mobile web browsers (usable campus pilot layout)
  4. Empty, loading, and error states are clear on main dashboards (no silent failures)
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Auth & Access Hardening | 0/TBD | Not started | - |
| 2. Reliable Campus Weather | 0/TBD | Not started | - |
| 3. Early Warning System | 0/TBD | Not started | - |
| 4. Crop Decisions & Planting Calendar | 0/TBD | Not started | - |
| 5. Knowledge Hub | 0/TBD | Not started | - |
| 6. Campus Pilot UX | 0/TBD | Not started | - |
| 7. Integrate Google AI (Gemini) | 0/3 | Planned | - |

## Coverage Summary

| Category | Requirements | Phase |
|----------|--------------|-------|
| Authentication & Access | AUTH-01..04 (4) | Phase 1 |
| Weather | WTHR-01..04 (4) | Phase 2 |
| Early Warning | ALRT-01..06 (6) | Phase 3 |
| Crop Decisions | CROP-01..09 (9) | Phase 4 (+ CROP-08/09 enhanced in Phase 7) |
| Knowledge Hub | KNOW-01..04 (4) | Phase 5 |
| Platform UX | PLAT-01..04 (4) | Phase 6 (+ PLAT-04 for AI loading in Phase 7) |
| Google AI recommendations | CROP-08, CROP-09, PLAT-04 | Phase 7 |

**v1 coverage:** 31/31 requirements mapped ✓ (Phase 7 enhances CROP-08/CROP-09/PLAT-04)

### Phase 7: Integrate Google AI (Gemini) into the system

**Goal:** On `/farmer/weather-analytics`, Actionable Field Recommendations are Gemini-generated, crop- and weather-aware bullets (Filipino/English), while rule-based safety scores stay authoritative and static tips remain the fallback
**Depends on:** Phase 6 (pilot UX surface); practically uses existing weather-analytics + planting predictor
**Requirements:** CROP-08, CROP-09, PLAT-04
**Success Criteria** (what must be TRUE):
  1. When a farmer selects a crop on weather-analytics, Actionable Field Recommendations update automatically (no separate Generate button) with 3–5 concrete field-action bullets
  2. Recommendation language follows the app language toggle (Filipino or English)
  3. Safety index, traffic light, verdict, and factor scores remain rule-based (`plantingPredictorService`) — Gemini writes recommendations only
  4. If Gemini is unconfigured, times out, or errors, static predictor recommendations still display (page never blanks)
  5. Gemini API key is server-side only; `POST /api/weather/predict-planting` requires authentication; recommendation text is rendered XSS-safe
**Plans:** 3 plans

Plans:
- [x] 07-01-PLAN.md — Gemini service (fetch client, prompt/parse, env key docs)
- [x] 07-02-PLAN.md — Wire predict-planting: requireAuth, AI override, static fallback
- [ ] 07-03-PLAN.md — Client language param, loading state, XSS-safe bullets + disclaimer
