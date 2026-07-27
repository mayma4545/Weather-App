# Implementation Plan: Enhanced AI Weather Actionable Recommendations

## Phase 1: Context Gathering Strategy
- [ ] Task: Identify and aggregate relevant Crop Data
    - [ ] Update the `WeatherAnalytics` controller or service to fetch active crop profiles/plots for the user.
    - [ ] Format crop data (type, growth stage, soil, etc.) into a concise text representation.
- [ ] Task: Identify and aggregate comprehensive Weather Data
    - [ ] Ensure all relevant weather parameters (temp, humidity, rain, wind) from the Google Weather API or local station are bundled.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Context Gathering Strategy' (Protocol in workflow.md)

## Phase 2: AI Prompt Engineering & API Update
- [ ] Task: Update the OpenRouter Prompt
    - [ ] Modify the prompt payload in the AI service to inject the gathered weather and crop context.
    - [ ] Add explicit instructions for the AI to return short, actionable bullet points.
    - [ ] Add explicit instructions demanding quantifiable numerical targets where applicable.
- [ ] Task: Verify the OpenRouter Response
    - [ ] Test the integration locally to ensure the payload is accepted and the AI response adheres to the requested format.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: AI Prompt Engineering & API Update' (Protocol in workflow.md)

## Phase 3: UI Adjustments for AI Recommendations
- [ ] Task: Update the Farmer Weather Analytics View
    - [ ] Ensure the UI container (`/farmer/weather-analytics`) correctly renders the bulleted list response.
    - [ ] Apply mobile-first CSS styling to the recommendation block (if needed) for clear readability.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: UI Adjustments for AI Recommendations' (Protocol in workflow.md)
