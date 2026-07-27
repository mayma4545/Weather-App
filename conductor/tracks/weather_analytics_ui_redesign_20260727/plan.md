# Implementation Plan: Modern Weather Analytics UI Redesign

Redesign the UI of `http://localhost:4000/farmer/weather-analytics` with a clean, borderless, modern aesthetic, refined 8px grid spacing, responsive layout, and uncluttered data displays.

## Phase 1: Design System & Spacing Infrastructure Setup
- [x] Task: Establish 8px grid spacing tokens, soft background tint variables, and borderless container rules in CSS
    - [x] Add 8px-based spacing variables (`--space-xs: 8px`, `--space-sm: 16px`, `--space-md: 24px`, `--space-lg: 32px`)
    - [x] Create borderless card styles using soft tint backgrounds (`rgba(255,255,255,0.7)` / light slate fills) and subtle elevation shadows instead of hard borders
    - [x] Remove hard `border`, `border-top`, `border-bottom` properties for analytics elements
- [x] Task: Conductor - User Manual Verification 'Phase 1: Design System & Spacing Infrastructure Setup' (Protocol in workflow.md)

## Phase 2: Weather Analytics View Redesign (`views/weather-analytics.html`)
- [x] Task: Implement borderless topbar & mobile slide-out navigation drawer
    - [x] Update topbar layout with clean location display, notification badge, profile icon, and smooth mobile hamburger drawer button
    - [x] Refine desktop sidebar to be borderless with subtle active nav indicators
- [x] Task: Redesign core metrics stat cards (Temp, Humidity, Rainfall, GDD)
    - [x] Replace bordered stat boxes with modern borderless tinted cards
    - [x] Streamline typographic scale for metric values and labels, removing redundant decorative icons
    - [x] Ensure 16px/24px consistent padding and gap spacing across cards
- [x] Task: Refine analytics charts and forecast containers
    - [x] Update chart container elements to be borderless with soft background fills
    - [x] Configure chart styling to use flat/muted solid fills (no heavy gradient fills) and clean hover tooltips
- [x] Task: Redesign alert banners and historical weather archive table
    - [x] Style alert banners with soft warning tints and clean typography
    - [x] Convert hard-bordered table to borderless clean row cards with generous 16px padding
- [x] Task: Conductor - User Manual Verification 'Phase 2: Weather Analytics View Redesign' (Protocol in workflow.md)

## Phase 3: Responsive Testing & Final Quality Checks
- [x] Task: Verify mobile and desktop responsiveness
    - [x] Test layout at mobile viewports (360px-480px) ensuring drawer opens smoothly and stat cards stack nicely
    - [x] Test layout at desktop viewports (1280px-1920px) ensuring proper grid alignment and 24px/32px spacing
- [x] Task: Verify live server rendering on `http://localhost:4000/farmer/weather-analytics`
    - [x] Confirm no console errors or broken navigation links
- [x] Task: Conductor - User Manual Verification 'Phase 3: Responsive Testing & Final Quality Checks' (Protocol in workflow.md)
