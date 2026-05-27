dd# UI Design Specification Contract (UI-SPEC)

This document serves as the single source of truth for all visual and interaction design in this project. All AI-generated pages and components must adhere strictly to these rules to ensure a cohesive, human-crafted, and professional look across desktop and mobile.

## 1. Global Principles
- **Responsive First**: All layouts must stack cleanly on mobile (typically 1-column) and expand deliberately on desktop (max-width containers, multi-column).
- **No "AI Aesthetic"**: Do not use gradient colors at all so that the design will not look like AI. Avoid excessive glowing shadows or disjointed spacing. Use constrained token values (listed below) exclusively.

## 2. Spacing & Layout (The "Boxes")
All spacing (padding, margin, gap) must strictly follow an 8-point grid scale. Do not use arbitrary values like 15px or 27px.

### Spacing Scale
- `4px` (xs): Tight component spacing (e.g., icon next to text)
- `8px` (sm): Internal component padding
- `16px` (md): Default container padding / standard gap
- `24px` (lg): Section separation within cards
- `32px` (xl): Page section padding
- `48px` (2xl): Major block separation (desktop)
- `64px` (3xl): Hero section spacing

### Containers & Radii
- **Max Width**: constrained to `1200px` for desktop layouts to prevent stretching.
- **Border Radius**: Use `8px` for buttons/inputs and `12px` for larger cards to give a soft, modern feel.
- **Shadows**: Keep elevation subtle. Use a soft shadow (e.g., `0 4px 6px -1px rgba(0, 0, 0, 0.1)`) for cards, never harsh black shadows. 

## 3. Typography
Do not introduce extra font families or weights. Keep the hierarchy flat and clear.

- **Primary Font Family**: `Inter` (or system-ui fallback like `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`).
- **Weights**: 
  - `400` (Regular) - For all body text.
  - `600` (Semibold) - For all headings and primary buttons.
- **Line Height**: 
  - Body: `1.5` (150%) for readability.
  - Headings: `1.2` (120%) for tighter grouping.

### Size Scale
- `14px`: Metadata, footer, secondary labels.
- `16px`: Base body text, standard inputs, and buttons.
- `20px`: Card titles, sub-section headers.
- `28px`: Page titles (H2).
- `36px`: Hero titles (H1).

## 4. Color Palette
Follow the 60-30-10 rule. The application should feel primarily clean and airy. Because this is a "WEATHER" project, the accent centers around a clear, trustworthy blue.

- **60% Dominant (Surface/Background)**
  - Background: `#FAFAFA` (Very light gray, easier on eyes than pure white).
  - Cards/Containers: `#FFFFFF` (Pure white to pop against background).
  - Primary Text: `#0F172A` (Slate 900 - nearly black, for high contrast readability).

- **30% Secondary (Borders/Muted Elements)**
  - Borders/Dividers: `#E2E8F0` (Slate 200).
  - Secondary Text: `#64748B` (Slate 500 - for timestamps, metadata, placeholders).
  - Muted Backgrounds: `#F1F5F9` (Slate 100 - for secondary button hovers or disabled states).

- **10% Accent (Interactive/Branding)**
  - Primary Brand/Action: `#0EA5E9` (Sky Blue 500).
  - Hover Action: `#0284C7` (Sky Blue 600).
  - *Reserved exclusively for*: Primary buttons, active tabs, selected states, and key data visualization highlights.
  
- **Semantic/System Colors**
  - Destructive/Error: `#EF4444` (Red 500).
  - Success: `#22C55E` (Green 500).

## 5. Copywriting & Interaction
- **Primary CTA**: Action-oriented ("Check Forecast", "Save Location").
- **Empty States**: Always include a neutral illustration/icon and a clear action (e.g., "No saved locations yet. Search for a city to get started.").
- **Error States**: State the problem plainly without jargon + offer a recovery path (e.g., "We couldn't reach the weather service. Try refreshing the page.").
- **Destructive Actions**: Always require a confirmation step.
