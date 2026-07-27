# Implementation Plan: Enhanced AI Weather Actionable Recommendations

## Phase 1: Context Gathering Strategy
- [x] Task: Identify and aggregate relevant Crop Data
    - [x] Update the `WeatherAnalytics` controller or service to fetch active crop profiles/plots for the user.
    - [x] Format crop data (type, growth stage, soil, etc.) into a concise text representation.
- [x] Task: Identify and aggregate comprehensive Weather Data
    - [x] Ensure all relevant weather parameters (temp, humidity, rain, wind) from the Google Weather API or local station are bundled.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Context Gathering Strategy' (Protocol in workflow.md)

## Phase 2: AI Prompt Engineering & API Update
- [x] Task: Update the OpenRouter Prompt
    - [x] Modify the prompt payload in the AI service to inject the gathered weather and crop context.
    - [x] Add explicit instructions for the AI to return short, actionable bullet points.
    - [x] Add explicit instructions demanding quantifiable numerical targets where applicable.
- [x] Task: Verify the OpenRouter Response
    - [x] Test the integration locally to ensure the payload is accepted and the AI response adheres to the requested format.
- [x] Task: Conductor - User Manual Verification 'Phase 2: AI Prompt Engineering & API Update' (Protocol in workflow.md)

## Phase 3: UI Adjustments for AI Recommendations
- [x] Task: Update the Farmer Weather Analytics View
    - [x] Ensure the UI container (`/farmer/weather-analytics`) correctly renders the bulleted list response.
    - [x] Apply mobile-first CSS styling to the recommendation block (if needed) for clear readability.
- [x] Task: Conductor - User Manual Verification 'Phase 3: UI Adjustments for AI Recommendations' (Protocol in workflow.md)
