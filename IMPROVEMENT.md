# Improvement Plan — Project Weather

> **Goal:** Upgrade the system from a functional prototype into a real-world agricultural decision support platform for Masbate farmers.
> **Target users:** Smallholder farmers + Commercial farmers
> **Budget:** Moderate (can invest in paid APIs/services)
> **Status:** System is still in development — foundational changes are possible now.

---

## Reference Map

| Existing Artifact | Location | Relevance |
|---|---|---|
| Database Schema & Models | `AI Ref Files/database schema.html` · `models/*.js` | Foundation for data model changes |
| OpenWeather Integration | `AI Ref Files/openWeather-walkthrough.md` · `utils/weatherService.js` | Backend for all weather-dependent features |
| Admin Implementation Plan | `AI Ref Files/admin - implementation_plan.md` | Admin UI patterns reusable for new management features |
| Farmer Pages & Logic | `AI Ref Files/farmers Pages.html` | Existing farmer workflows to extend |
| Database Setup Report | `AI Ref Files/database_setup_report.md` | Dual-env DB config (SQLite dev / MySQL prod) |
| Project Overview | `GEMINI.md` | Core objectives and vision |

---

## Tier 1: Critical Foundations

These are **non-negotiable** for any real-world deployment. Without them the system is insecure, unreachable to farmers, and unreliable.

### 1.1 Authentication & Authorization System

**Problem:** No session/JWT mechanism exists. Any URL is accessible without login. The farmer API hardcodes a single demo user.

**Solution:**
- Integrate `express-session` (or JWT with `jsonwebtoken`) for persistent login
- Add `authMiddleware` to protect routes — redirect unauthenticated users to `/login`
- Store session in the database (via Sequelize `connect-session-sequelize`) so it survives server restarts
- Role-based guards: `Admin` vs `Agriculturist` — enforce at the route level

**Files affected:** `routes/index.js`, `presenters/authPresenter.js`, new `middleware/auth.js`

**Complexity:** Medium | **Priority:** P0

---

### 1.2 SMS / Push Notification Backend

**Problem:** The profile page already has an "SMS alerts" toggle and the admin "Global Alerts" page exists, but no notification delivery system is wired.

**Solution:**
- Integrate **Semaphore API** (Philippine SMS gateway, pay-per-use, ~₱0.25/SMS) or **Twilio**
- Create a `notifications/` service module that sends SMS to farmer contact numbers
- Extend the alert model with `delivery_method` (SMS / In-App / Both) and `delivery_status`
- Trigger automatic alerts when weather thresholds are breached (e.g., `rainfall_3h > 50mm`)

**Files affected:** New `services/notificationService.js`, modify `routes/index.js` (alert endpoint), modify `Alert.js` model

**Complexity:** Medium (paid API) | **Priority:** P0

---

### 1.3 On-Site Weather Station Support

**Problem:** All weather data comes from OpenWeather (city-level). Local microclimates in Masbate's terrain mean city data can be 2-5°C off from actual field conditions.

**Solution:**
- Add a **weather station API endpoint** (`POST /api/weather/station/reading`) for local IoT sensors
- New model `StationDevice` (device_id, location_name, lat, lon, owner_id, last_seen)
- The weather log already supports `data_source: 'Station'` — route station data through the same logging pipeline
- Dashboard can show "Station" vs "API" badges (admin weather monitor already has this UI — see `AI Ref Files/admin - implementation_plan.md`)

**Hardware options:** Arduino + DHT22 + rain gauge + LoRa shield (~$80-120/station), or commercial Davis Vantage Vue (~$300)

**Files affected:** New `models/StationDevice.js`, modify `routes/index.js`, modify `utils/weatherService.js`

**Complexity:** High (hardware + software) | **Priority:** P1

---

## Tier 2: High-Impact Agricultural Features

These features deliver direct value to farmers — better yields, less waste, prevented losses.

### 2.1 Irrigation Scheduling Engine

**Problem:** The profile has an "irrigation prompts" toggle but no logic behind it.

**Solution:**
- Build an irrigation recommendation model in `services/irrigationService.js`
- **Inputs:** crop type, growth stage, days since last rain, forecast rainfall (next 3 days), soil type (user input), temperature
- **Output:** "Irrigate 15mm tomorrow morning" or "No irrigation needed — 25mm rain expected Thursday"
- Expose as `GET /api/advisor/irrigation?plot_id=X`
- Show recommendation on the farmer dashboard as a new card

**Files affected:** New `services/irrigationService.js`, modify `routes/index.js`, modify `farmer-dashboard.html` and `farmer-dashboard.js`

**Complexity:** Medium | **Priority:** P1

---

### 2.2 Pest & Disease Risk Model

**Problem:** The insight engine mentions "Fungal risk elevated" but it is a single generic rule. Real pest/disease prediction requires crop-specific epidemiological models.

**Solution:**
- Create `services/pestDiseaseService.js` with a rule engine for Masbate-relevant diseases:

| Disease | Crop | Trigger Conditions |
|---|---|---|
| Rice Blast | Rice | 25-30°C + >90% humidity > 48h |
| Bacterial Leaf Blight | Rice | >30°C + heavy rain + flooding |
| Corn Downy Mildew | Corn | 20-25°C + >85% humidity |
| Tomato Late Blight | Vegetables | 15-20°C + wet leaves > 10h |

- Expose as `GET /api/advisor/pest-risk?plot_id=X`
- Push alert automatically when risk crosses threshold (ties into notification system)

**Files affected:** New `services/pestDiseaseService.js`, modify `routes/index.js`, modify `weather-analytics.html` and `farmer-dashboard.js`

**Complexity:** Medium | **Priority:** P1

---

### 2.3 Fertilizer Timing Advisor

**Problem:** Farmers guess when to apply fertilizer. Poor timing (applying before heavy rain) wastes money and pollutes water.

**Solution:**
- Create `services/fertilizerService.js`
- **Logic:** Given crop type + growth stage + forecast rainfall, recommend:
  - "Apply N fertilizer today — dry window of 48h expected"
  - "Delay application — 60mm rain forecast in 24h (runoff risk)"
- Expose as `GET /api/advisor/fertilizer?crop_id=X&stage=Y`

**Files affected:** New `services/fertilizerService.js`, modify `routes/index.js`

**Complexity:** Low-Medium | **Priority:** P2

---

### 2.4 Harvest Yield Estimator

**Problem:** Farmers have no data-driven way to estimate final yield mid-season.

**Solution:**
- Build model in `services/yieldEstimatorService.js`
- Correlate historical weather data (temperature stress, drought days, excess rain days) against known crop sensitivity tables
- Output: estimated yield range (t/ha) + confidence level
- Update automatically as season progresses

**Files affected:** New `services/yieldEstimatorService.js`, modify `routes/index.js`, modify planting records UI in `farmer-dashboard.js`

**Complexity:** Medium | **Priority:** P2

---

### 2.5 "Safe to Plant" Predictor Enhancement

**Problem:** The existing predictor (in `weather-analytics.html`) works but uses only short-range forecast.

**Solution:**
- Extend to use: 5-day forecast + 30-day seasonal outlook + crop-specific thresholds + soil readiness check
- Add seasonal calendar context: "Rice planted in July typically faces typhoon risk in Oct-Nov. Consider planting in August instead."
- Show confidence score (Low / Medium / High)

**Files affected:** `utils/weatherService.js`, `views/weather-analytics.html`, `public/js/farmer-dashboard.js`

**Complexity:** Low-Medium | **Priority:** P2

---

## Tier 3: Accessibility & Reliability

### 3.1 Multi-Language Support (Filipino / Bicolano / English)

**Problem:** All UI text and insights are in English. Many smallholder farmers in Masbate speak Bicolano or Filipino as their primary language.

**Solution:**
- Create `locales/` directory with JSON translation files: `en.json`, `fil.json`, `bcl.json`
- Modify `weatherService.js` insight engine to accept a `lang` parameter and return translated strings
- Add language selector to topbar and profile settings
- Persist preference in user settings (new `language_pref` column on `users` table)

**Files affected:** New `locales/en.json`, `locales/fil.json`, `locales/bcl.json`, modify `utils/weatherService.js`, all view HTML files, `public/js/*.js`, model `User.js`

**Complexity:** Medium | **Priority:** P1

---

### 3.2 Offline Support (PWA Mode)

**Problem:** Rural Masbate has unreliable internet. If the network drops, farmers see blank screens.

**Solution:**
- Convert the app into a **Progressive Web App**:
  - Add `manifest.json` with app icons and splash screen
  - Register a service worker that caches static assets (CSS, JS, HTML) and recent weather data
  - Show "last updated" timestamps so farmers know how stale the data is
  - Background sync when connectivity returns
- Target: dashboard, crop management, and weather analytics work fully offline with cached data

**Files affected:** New `public/manifest.json`, new `public/service-worker.js`, modify `index.js` (serve manifest), modify `farmer-dashboard.html` (register SW)

**Complexity:** Medium | **Priority:** P2

---

### 3.3 Data Export (PDF / CSV Reports)

**Problem:** Farmers and cooperatives need to share data with banks, extension officers, and government subsidy programs.

**Solution:**
- Add export buttons to planting records, weather history, and yield data
- Generate CSV server-side (simple) or PDF via `pdfkit` or `puppeteer`
- Endpoints: `GET /api/export/planting-records?format=csv`, `GET /api/export/weather-logs?format=csv`

**Files affected:** New `routes/export.js`, modify `package.json` (add pdfkit/csv dep), add export buttons to `crop-management.html` and `weather-analytics.html`

**Complexity:** Low | **Priority:** P3

---

## Tier 4: Strategic / Future

### 4.1 Government & Insurance Linkage

**Problem:** When typhoons destroy crops, farmers often miss insurance claim deadlines or lack documentation.

**Solution:**
- Generate **automated extreme weather reports** when: wind > 60km/h, rainfall > 100mm/24h, or temperature > 38°C
- Report includes: date, weather data (from OpenWeather + station), affected plots/crops, estimated damage level
- Output as PDF ready for submission to **PhilRice**, **DA**, or insurance providers

**Complexity:** Low-Medium | **Priority:** P3

---

### 4.2 Market Price Feed

**Problem:** Farmers lack transparent, real-time market price information for their crops.

**Solution:**
- Integrate with **DA-PhilMech** or **MASIPAG** price data (or scrape local market boards)
- Show "Expected Farm Gate Price" per crop on the dashboard
- Alert when price is favorable: "Palay price is ₱21/kg this week — consider harvesting"

**Complexity:** Medium (needs data source) | **Priority:** P3

---

### 4.3 Soil Data Integration

**Problem:** Fertilizer and crop selection recommendations are generic without soil test data.

**Solution:**
- Add soil test result input to profile/plot page (pH, N, P, K, OM, CEC)
- Store in new `soil_tests` table (soil_test_id, plot_id, test_date, pH, N, P, K, organic_matter)
- Use thresholds to refine crop recommendations and fertilizer timing

**Files affected:** New `models/SoilTest.js`, modify `views/profile.html`, add soil input to plot management

**Complexity:** Medium | **Priority:** P3

---

### 4.4 Cooperative / Multi-Farm Dashboard

**Problem:** Cooperative leaders have no aggregated view of member farms.

**Solution:**
- Add `cooperatives` and `cooperative_members` tables
- Cooperative admin can view aggregate: total planted area, crop distribution, upcoming harvests, alerts across all member farms
- Alert targeting: send advisory to entire cooperative at once

**Complexity:** High | **Priority:** P4

---

### 4.5 Voice / Chatbot Interface

**Problem:** Low-literacy farmers cannot use text-heavy web interfaces.

**Solution:**
- Integrate **Facebook Messenger API** or **Telegram Bot** for simple queries:
  - "Ano ang panahon ngayon?" → returns current weather in Filipino
  - "Kailan magtanim ng palay?" → returns safe-to-plant recommendation
- Optionally integrate with **IVR** (Interactive Voice Response) via a telephony service for voice-only phones

**Complexity:** High (needs NLP/IVR integration) | **Priority:** P4

---

### 4.6 Crop Rotation Planner

**Problem:** Continuous planting of the same crop depletes soil.

**Solution:**
- Recommend next crop based on: previous crop, current soil nutrients (from soil test), upcoming seasonal weather
- "Rice depletes N. Next season plant Legume to fix nitrogen. Or plant Corn with N fertilizer."

**Complexity:** Medium | **Priority:** P4

---

## Implementation Roadmap

### Phase 1 (Foundation) — 2-3 weeks
| Sprint | Items |
|---|---|
| Sprint 1 | Authentication + Route guards + Session management |
| Sprint 2 | SMS/Notification backend + alert triggers |

### Phase 2 (Core Agronomy) — 4-5 weeks
| Sprint | Items |
|---|---|
| Sprint 3 | Irrigation scheduling engine |
| Sprint 4 | Pest & disease risk model |
| Sprint 5 | Multi-language support (Fil + Bcl) |

### Phase 3 (Polish & Reach) — 3-4 weeks
| Sprint | Items |
|---|---|
| Sprint 6 | Offline/PWA mode |
| Sprint 7 | Fertilizer advisor + Enhanced Safe-to-Plant |
| Sprint 8 | Yield estimator + Data export |

### Phase 4 (Strategic) — Ongoing
| Priority | Items |
|---|---|
| Next | Weather station support + Soil integration |
| Future | Market prices + Cooperative dashboard + Insurance linkage |
| Long-term | Voice/chatbot + Crop rotation planner |

---

## Database Schema Changes (Summary)

| New Table | Purpose | Phase |
|---|---|---|
| `station_devices` | Registered IoT weather stations | P2 |
| `soil_tests` | Per-plot soil analysis results | P4 |
| `cooperatives` | Farmer cooperative groups | P4 |
| `cooperative_members` | M2M: cooperatives <-> users | P4 |

| Existing Table | New Columns | Phase |
|---|---|---|
| `users` | `language_pref` (VARCHAR), `session_token` (TEXT) | P1, P3 |
| `alerts` | `delivery_method` (ENUM: SMS/In-App/Both), `delivery_status` (VARCHAR) | P1 |
| `weather_logs` | `station_id` (FK -> station_devices) | P2 |

---

*Generated from codebase analysis of existing features and AI Ref Files documentation.*
