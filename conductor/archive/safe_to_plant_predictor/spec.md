# Specification: Safe to Plant Predictor Upgrade

## Overview
Upgrade the "Safe to Plant Predictor" mechanic on `/farmer/weather-analytics`. The feature enables farmers to select or input a target crop and evaluate whether current and forecasted weather conditions (temperature range, rainfall probability, humidity, seasonal temperature suitability) present a safe planting window.

## User Persona & Usability Goals
- **Target User:** Farmers requiring simple, clear, and conventional inputs (e.g., visual crop selection cards/dropdowns, simplified planting date picker).
- **Core Experience:**
  - Fast crop selection (preset common crops + custom option).
  - Clear visual indicator (e.g., "Optimal", "Caution", "Unfavorable") with plain-language explanation.
  - Actionable advice (e.g., "Best planting window: Next 5 days", "High risk of heavy rain on Day 3").

## Functional Requirements
1. **Simplified Crop Input UI:**
   - Visual selection chips/cards for popular regional crops (e.g., Rice, Corn, Tomato, Eggplant, Onion) with icons.
   - Fallback custom crop search/dropdown.
   - Date picker defaulting to "Today" with quick options ("This Week", "Next Week").
2. **Enhanced Prediction Mechanics:**
   - Weather integration: Cross-reference crop temperature tolerances (min/max/optimal), moisture needs, and 7-day forecast data.
   - Growth & risk score calculation: Calculate a Planting Safety Index (%) considering temperature, rainfall forecast, and extreme alert risks (e.g., typhoons, heatwaves).
   - Breakdown details: Show key risk factors (e.g., Temperature: Ideal 24°C, Rain Risk: Moderate).
3. **Responsive & Conventional Layout:**
   - Mobile-first layout seamlessly integrated into `views/weather-analytics.html` and `public/js/` / `services/`.
