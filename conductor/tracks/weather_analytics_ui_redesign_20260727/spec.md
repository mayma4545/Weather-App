# Specification: Modern Weather Analytics UI Redesign

## Overview
Redesign the UI of the Farmer Weather Analytics page (`/farmer/weather-analytics`) to deliver a smooth, modern, clean, and responsive experience for both desktop and mobile viewports. The design will feature zero heavy borders, refined 8px-grid spacing/padding, subtle card background tints, clean typography, and uncluttered data visualizations (without gradient fills or unnecessary icons).

## Functional Requirements
- **Responsive Layout & Grid System**:
  - Implement a mobile-first responsive layout that seamlessly expands to a multi-column desktop grid.
  - Enforce consistent 8px-based spacing scale (`8px`, `16px`, `24px`, `32px`) across containers, card gaps, and internal padding.
- **Borderless Card Container Styling**:
  - Remove all hard/heavy borders from containers, topbars, sidebars, and analytics cards.
  - Utilize soft background tints (`rgba` / subtle neutral fills) and soft micro-shadows/depth for visual separation.
- **Header & Navigation**:
  - **Desktop**: Clean, borderless sidebar with minimal navigation items and subtle active indicator.
  - **Mobile**: Minimalist topbar with location & profile badge, plus a smooth slide-out mobile drawer triggered by a clean hamburger button.
- **Weather Data Analytics & Visualization**:
  - Clean metric stat cards (Temperature, Humidity, Rainfall, Growing Degree Days) with clear typographic hierarchy.
  - Streamlined data charts using flat solid/muted color fills (no heavy gradient fills) and clean interactive tooltips.
  - Early Warning / Weather Alert section styled with clean, non-intrusive notification banners.
- **Typography & Iconography**:
  - Modern typography using clean font stacks (Inter/Roboto/system UI).
  - Eliminate redundant, decorative, or noisy icons; keep icons strictly functional and minimal.

## Non-Functional Requirements
- **Mobile & Desktop Usability**: 100% responsive across screens from 360px mobile width to >1440px desktop screens without horizontal overflow or overlapping text.
- **Performance**: High frame rate transitions for mobile slide-out drawer and smooth hover effects.

## Acceptance Criteria
- [ ] `/farmer/weather-analytics` page has zero hard/visible borders on cards, navigation, or topbar.
- [ ] Spacing between all elements follows standard 8px grid intervals (`16px`/`24px`/`32px`).
- [ ] No unnecessary or decorative clutter icons; all typography is readable with clear visual hierarchy.
- [ ] Charts use flat solid fills (no gradient fills) and clean tooltip styling.
- [ ] Full responsiveness tested on both mobile view (drawer navigation) and desktop view (sidebar navigation).

## Out of Scope
- Backend API route modifications or changing underlying weather data calculation formulas.
