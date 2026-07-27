# Specification: Enhanced AI Weather Actionable Recommendations

## Overview
The goal of this track is to improve the specificity and usefulness of AI-generated actionable field recommendations on the `/farmer/weather-analytics` dashboard. The prompt fed to the AI (via OpenRouter) will be enriched with system context, including comprehensive real-time weather data and relevant crop data, so that the AI can provide highly targeted advice to farmers.

## Functional Requirements
1.  **Context Injection (Weather Data):** The system must dynamically inject current weather data (e.g., temperature, humidity, rainfall, wind speed) from the application into the AI prompt.
2.  **Context Injection (Crop Data):** The system must dynamically inject relevant crop data (such as crop type, growth stage, or specific plot conditions) into the AI prompt.
3.  **Prompt Engineering:** Update the system prompt instructions to force the AI to produce short, actionable bullet points suitable for a mobile interface.
4.  **Quantifiable Targets:** The prompt must instruct the AI to provide specific numerical targets or quantifiable advice (e.g., "Add 50kg of Nitrogen", "Irrigate for 45 minutes") whenever possible.

## Non-Functional Requirements
-   **Mobile-First Display:** The resulting output must be rendered clearly on mobile devices, adhering to the project's responsive design guidelines.
-   **Performance:** Gathering context and querying OpenRouter must be optimized to prevent excessive loading times on the weather analytics page.

## Acceptance Criteria
-   [ ] The AI recommendation on `/farmer/weather-analytics` includes advice specifically tailored to the current weather (temp, humidity, rain) and crop context.
-   [ ] The recommendation is formatted as a list of short, actionable bullet points.
-   [ ] When applicable, the recommendation includes quantifiable targets instead of general qualitative advice.
-   [ ] The AI response is successfully retrieved from OpenRouter and displayed correctly in the UI.

## Out of Scope
-   Redesigning the entire weather analytics dashboard layout.
-   Changing the underlying AI provider from OpenRouter to a different service.
-   Adding new AI features outside the scope of field recommendations.
