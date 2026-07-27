# Track Plan: Safe to Plant Predictor Upgrade

## Phase 1: Context & Data Modeling Analysis
- [x] Task 1.1: Inspect `views/weather-analytics.html`, `services/`, and weather analytics client JS to map current predictor logic.
- [x] Task 1.2: Define crop temperature and moisture threshold parameters for regional crops in service/model layer.

## Phase 2: Core Prediction Engine Enhancement
- [x] Task 2.1: Upgrade prediction algorithm in `services/` to factor in multi-day weather forecasts, ideal temperature ranges, and extreme weather alert flags.
- [x] Task 2.2: Add clear risk level classifications ("Optimal", "Caution", "High Risk") and actionable advice generation.

## Phase 3: UI & UX Implementation
- [x] Task 3.1: Redesign crop input UI on `/farmer/weather-analytics` with intuitive crop selection cards/presets and conventional controls.
- [x] Task 3.2: Create a high-contrast prediction result panel displaying overall safety score, weather factor breakdown, and recommendations.

## Phase 4: Integration & Verification
- [x] Task 4.1: Perform end-to-end testing on `/farmer/weather-analytics` route with real/mock weather data.
- [x] Task 4.2: Verify mobile responsiveness and field usability.
