# Requirements: DEBESMSCAT Weather & Smart Crop Platform

**Defined:** 2026-07-25
**Core Value:** Campus users can trust local weather data and act on clear crop advisories in time to reduce climate-related crop risk and improve plot decisions.

## v1 Requirements

Requirements for the campus pilot. Each maps to roadmap phases.

### Authentication & Access

- [ ] **AUTH-01**: User can register with email/password and complete OTP verification
- [ ] **AUTH-02**: User can log in and stay logged in across browser refresh (session)
- [ ] **AUTH-03**: User can log out securely
- [ ] **AUTH-04**: System enforces Agriculturist vs Admin role access on pages and APIs

### Weather

- [ ] **WTHR-01**: User can view current campus weather (temperature, rainfall, wind speed) for DEBESMSCAT
- [ ] **WTHR-02**: User can view multi-day forecast for campus (temperature, rainfall, wind)
- [ ] **WTHR-03**: Weather data shows freshness/last-updated so users know if data is current
- [ ] **WTHR-04**: When OpenWeather fails or is slow, UI degrades gracefully (cached data and/or clear error) without breaking the dashboard

### Early Warning

- [ ] **ALRT-01**: System generates advisories for heavy rainfall based on weather thresholds/forecast
- [ ] **ALRT-02**: System generates advisories for extreme heat based on weather thresholds/forecast
- [ ] **ALRT-03**: User can view alerts in an in-app inbox on the farmer dashboard
- [ ] **ALRT-04**: User receives alert notifications by email for relevant advisories
- [ ] **ALRT-05**: Admin can broadcast targeted or global advisories to agriculturists
- [ ] **ALRT-06**: User can see alert severity/type and mark or dismiss alerts as read

### Crop Decisions

- [ ] **CROP-01**: Agriculturist can create and manage farm plots
- [ ] **CROP-02**: Agriculturist can record and track active plantings on plots (crop + dates)
- [ ] **CROP-03**: User can view irrigation recommendation for a selected plot given weather + crop context
- [ ] **CROP-04**: User can view disease risk assessment for a selected plot
- [ ] **CROP-05**: User can view fertilizer recommendation for a selected plot
- [ ] **CROP-06**: User can view growth-stage estimate (GDD-based) for active planting
- [ ] **CROP-07**: User can view typhoon/storm risk assessment relevant to campus conditions
- [ ] **CROP-08**: User can view weather-trend based planting schedule guidance (when-to-plant / avoid windows)
- [ ] **CROP-09**: Advisor outputs are actionable (clear recommendation + short rationale), not raw metrics only

### Knowledge Hub

- [ ] **KNOW-01**: User can browse a crop catalog (varieties with details and images)
- [ ] **KNOW-02**: User can read best-practice / management guidelines for crops
- [ ] **KNOW-03**: Admin can create, update, and remove crop catalog entries
- [ ] **KNOW-04**: Admin can maintain best-practice content linked to crops

### Platform UX

- [ ] **PLAT-01**: Agriculturist has a farmer dashboard as daily workspace (weather, plots, advisories, alerts)
- [ ] **PLAT-02**: Admin has an admin dashboard for users, content, and alert operations
- [ ] **PLAT-03**: Farmer and admin primary flows work on mobile web browsers (usable campus pilot layout)
- [ ] **PLAT-04**: Empty, loading, and error states are clear on main dashboards (no silent failures)

## v2 Requirements

Deferred past campus pilot. Tracked but not in current roadmap.

### Notifications

- **NOTF-01**: SMS delivery for critical weather alerts (e.g. Semaphore)
- **NOTF-02**: Push notifications on mobile devices

### Sensing & Coverage

- **SENS-01**: IoT / on-site weather station ingestion and station-vs-API display
- **SENS-02**: Satellite / remote sensing (NDVI) plot insights
- **SENS-03**: Per-plot custom coordinates and multi-location weather

### Learning

- **LRN-01**: Structured lessons and graded assessments for agriculture courses
- **LRN-02**: Trivia as a primary student engagement product

### Weather providers

- **WPRV-01**: Google Weather API or multi-provider failover

## Out of Scope

| Feature | Reason |
|---------|--------|
| Native mobile apps | Web-first campus pilot |
| Farmer marketplace / e-commerce | Not aligned with academic pilot goals |
| Full LMS replacement | Knowledge hub is catalog + practices only |
| Regional multi-campus coverage | DEBESMSCAT campus only for v1 |
| Hardware manufacturing / station kits | IoT deferred entirely in v1 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| WTHR-01 | Phase 2 | Pending |
| WTHR-02 | Phase 2 | Pending |
| WTHR-03 | Phase 2 | Pending |
| WTHR-04 | Phase 2 | Pending |
| ALRT-01 | Phase 3 | Pending |
| ALRT-02 | Phase 3 | Pending |
| ALRT-03 | Phase 3 | Pending |
| ALRT-04 | Phase 3 | Pending |
| ALRT-05 | Phase 3 | Pending |
| ALRT-06 | Phase 3 | Pending |
| CROP-01 | Phase 4 | Pending |
| CROP-02 | Phase 4 | Pending |
| CROP-03 | Phase 4 | Pending |
| CROP-04 | Phase 4 | Pending |
| CROP-05 | Phase 4 | Pending |
| CROP-06 | Phase 4 | Pending |
| CROP-07 | Phase 4 | Pending |
| CROP-08 | Phase 4 | Pending |
| CROP-09 | Phase 4 | Pending |
| KNOW-01 | Phase 5 | Pending |
| KNOW-02 | Phase 5 | Pending |
| KNOW-03 | Phase 5 | Pending |
| KNOW-04 | Phase 5 | Pending |
| PLAT-01 | Phase 6 | Pending |
| PLAT-02 | Phase 6 | Pending |
| PLAT-03 | Phase 6 | Pending |
| PLAT-04 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 31 total
- Mapped to phases: 31
- Unmapped: 0

---
*Requirements defined: 2026-07-25*
*Last updated: 2026-07-25 after roadmap creation*
