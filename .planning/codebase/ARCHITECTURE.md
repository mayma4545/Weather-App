# Architecture

**Analysis Date:** 2026-07-22

## Pattern Overview

**Overall:** Layered MVC variant — Express server serving static HTML views with a REST API consumed by client-side JavaScript (a "thick client" / lightweight SPA-per-page architecture, not a server-rendered templating engine). The `routes/` layer acts as both controller and view-dispatcher; `presenters/` is a thin view-dispatch helper; `services/`/`utils/` hold business logic; `models/` holds Sequelize ORM definitions.

**Key Characteristics:**
- Single Express app entry point (`index.js`) mounting one router (`routes/index.js`) at `/`.
- Server-rendered templating is NOT used. Views are static `.html` files in `views/` served via `res.sendFile`; all dynamic behavior is rendered client-side from `public/js/*.js` calling `/api/*` endpoints.
- REST API (`/api/...`) co-located in the same `routes/index.js` file as page routes — no `controllers/` separation.
- Sequelize ORM with `alter: true` auto-sync on every boot (`index.js:58`) — schema is code-first, derived from `models/`.
- Dual-database target: SQLite in development, MySQL (Aiven.io) in production — selected at runtime in `config/database.js`.
- Session-based auth (cookie + server session store), not JWT.

## Layers

**Entry / Bootstrap (`index.js`):**
- Purpose: Wire global middleware, mount session, mount static files, mount router, sync DB, start HTTP listener.
- Location: `index.js`
- Contains: Express app setup, helmet CSP, CORS, JSON/urlencoded body parsers, morgan logging, express-session config, static asset mount, error handler.
- Depends on: `routes/index.js`, `models/index.js` (sequelize instance), `express-session`, `helmet`, `morgan`, `cors`, `dotenv`.
- Used by: `npm start` / `npm run dev` (nodemon).

**Routing / Controller Layer (`routes/index.js`):**
- Purpose: Define all page routes AND all REST API endpoints; orchestrates data fetching, calls services, sends JSON or static HTML.
- Location: `routes/index.js` (single 1911-line file — see CONCERNS).
- Contains: ~30 GET page routes (`/login`, `/farmer/dashboard`, `/admin/dashboard`, etc.) and ~40+ REST endpoints under `/api/*` covering auth, plots, crops, planting, soil, weather proxy, IoT stations, advisors, todo, admin CRUD, alerts, trivia, satellite.
- Depends on: `utils/weatherService`, all `services/*` (lazy-loaded with try/catch fallback), `middlewares/auth`, `presenters/authPresenter`, `models/`, `services/emailService`, `cloudinary`, `multer`.
- Used by: `index.js` mounts it at `/`.

**Middleware Layer (`middlewares/`):**
- Purpose: Cross-cutting request guards.
- Location: `middlewares/auth.js`
- Contains: `requireAuth` (checks `req.session.userId`, 401 for `/api/` paths else redirect to `/login`) and `requireAdmin` (checks `req.session.userRole === 'Admin'`, 403 for `/api/` else redirect to `/farmer/dashboard`).
- Used by: Every protected route in `routes/index.js` via per-route middleware chaining.
- Pattern: API vs page detection via `req.path.startsWith('/api/')` returns JSON; otherwise redirects.

**Presenter Layer (`presenters/`):**
- Purpose: Thin view-dispatch helpers — currently only wrap `res.sendFile(path.join(__dirname, '..', 'views', 'X.html'))`.
- Location: `presenters/authPresenter.js`, `presenters/dashboardPresenter.js`
- Note: Largely vestigial; most page routes in `routes/index.js` call `res.sendFile` directly rather than going through presenters. `dashboardPresenter.getDashboard` is defined but unused (routes use inline `getFarmerDashboard`).

**Service Layer (`services/`):**
- Purpose: Domain/business logic — pure functions (no DB access) that compute agricultural recommendations from weather + crop inputs.
- Location: `services/irrigationService.js`, `services/diseaseRiskService.js`, `services/fertilizerService.js`, `services/gddService.js`, `services/typhoonAlertService.js`, `services/todoService.js`, `services/satelliteService.js`, `services/emailService.js`.
- Pattern: Each module exports plain functions (e.g., `getIrrigationRecommendation`, `assessDiseaseRisks`, `getFertilizerRecommendation`, `estimateGrowthStage`, `assessTyphoonRisk`, `generateTodoList`). No classes, no shared state — except `satelliteService` which caches a polygon ID and `emailService` which holds a nodemailer transporter singleton.
- Used by: `routes/index.js` (lazy-loaded with `try/catch` guards).
- Note: Services do NOT call models or DB directly — the route handler fetches model data, assembles a "plot context" via `getPlotContext(plotId)` helper (routes/index.js:787), then passes pure inputs to the service.

**Utility / External-API Layer (`utils/`):**
- Purpose: External API integration with caching.
- Location: `utils/weatherService.js` — OpenWeather API client with in-memory 10-min TTL cache (`cache` object, `isCacheValid`/`setCache`), normalizes responses, exposes `fetchCurrentWeather`, `fetchForecast`, `generateForecastRisks`.
- Used by: `routes/index.js` for weather proxy routes and `getPlotContext`.

**Model / Data Access Layer (`models/`):**
- Purpose: Sequelize model definitions + association wiring + shared sequelize instance.
- Location: `models/index.js` (barrel + associations) plus one file per entity: `User.js`, `FarmPlot.js`, `PlantingRecord.js`, `CropRepository.js`, `WeatherLog.js`, `Alert.js`, `Trivia.js`, `SoilProfile.js`, `StationDevice.js`, `Otp.js`.
- Pattern: Each model calls `sequelize.define('Name', { fields }, { tableName, timestamps: true, underscored: true })`. Snake_case table names, snake_case columns via `underscored: true`. PKs are `*_id` INTEGER autoincrement (except `StationDevice.device_id` string PK, `Otp.otp_id`).
- Associations defined centrally in `models/index.js` using `hasMany`/`belongsTo` with named aliases (`as: 'plots'`, `as: 'crop'`, etc.) and `onDelete: 'CASCADE'`.
- Used by: Imported from `routes/index.js` via `const { User, FarmPlot, ... } = require('../models')`.

**View Layer (`views/` + `public/`):**
- Purpose: Serve HTML shells + client-side assets.
- Location: `views/*.html` (9 static HTML pages) + `public/css/*.css` (6 stylesheets) + `public/js/*.js` (3 large client bundles — `farmer-dashboard.js` is ~2743 lines).
- Rendering model: NO server templating. Each HTML page links its CSS and `<script src="/js/X.js">`; the JS fetches `/api/*` on load and renders DOM. `public/js/farmer-dashboard.js` embeds i18n translation maps client-side.

## Data Flow

**Farmer Dashboard Page Load (typical request):**

1. Browser GET `/farmer/dashboard` → Express → `routes/index.js:307` → `requireAuth` middleware checks `req.session.userId` → if missing, 302 redirect to `/login`.
2. Auth passes → `res.sendFile('views/farmer-dashboard.html')` served as static HTML.
3. Browser loads `/css/farmer-dashboard.css` and `/js/farmer-dashboard.js` (static from `public/`).
4. `farmer-dashboard.js` runs on DOM ready → `GET /api/farmer/data` (`routes/index.js:345`) → `requireAuth` → `User.findByPk(req.session.userId)`, `FarmPlot.findAll({ user_id })`, `CropRepository.findAll()`, `PlantingRecord.findAll({ include: [FarmPlot, CropRepository] })` → JSON response.
5. JS renders user/plots/crops into DOM; user selects a plot.
6. JS `GET /api/advisor/dashboard?plot_id=X` (`routes/index.js:957`) → `getPlotContext(plot_id)` (`:787`) fetches `FarmPlot`, active `PlantingRecord`+`CropRepository`, latest `SoilProfile`, and calls `weatherService.fetchCurrentWeather` + `fetchForecast` (cached).
7. Route handler runs irrigation, disease-risk, fertilizer, gdd, typhoon advisor services in parallel via `Promise.all` of `Promise.resolve().then(...)` blocks (`:984-1039`), each guarded by `.catch()` setting `result.X = { error }`.
8. Aggregated JSON returned → JS renders advisory panels.

**Login + Session Flow:**

1. POST `/login` (`routes/index.js:258`) → `User.findOne({ where: { email } })` → `bcrypt.compare(password, user.password_hash)`.
2. On success → `req.session.userId`, `req.session.userRole`, `req.session.userFullName`, `req.session.userEmail` set → redirect to `/admin/dashboard` (Admin role) or `/farmer/dashboard` (Agriculturist role).
3. Subsequent requests carry session cookie; `requireAuth`/`requireAdmin` read from session store.

**Registration Flow (OTP-gated):**

1. POST `/register` (`:74`) → sanitize inputs, validate, `Otp.destroy` old codes, `bcrypt.hash`, generate 6-digit `crypto.randomInt`, `Otp.create` with `user_data` JSON-stashed and `expires_at` (10 min).
2. `emailService.sendEmail` delivers OTP HTML — falls back to console.log on SMTP failure (dev).
3. POST `/verify-otp` (`:163`) → check expiry + 3-attempt lockout → `User.create` from stashed `user_data`, `Otp.destroy`, send welcome email.

**IoT Station Reading Ingestion:**

1. POST `/api/weather/station/reading` (`:749`) — note: NO `requireAuth` (open endpoint for devices) → validate `device_id` exists in `StationDevice`, update `last_seen`, `WeatherLog.create({ data_source: 'Station', station_id })`.

**Admin Broadcast Alert:**

1. POST `/api/admin/alerts` (`:1450`) → resolve target users (all Agriculturists or growers of a specific crop via `PlantingRecord` → `FarmPlot` → `User` join) → set `Transfer-Encoding: chunked` SSE-style response → insert one `Alert` row per target user → send emails concurrently via `Promise.all`, streaming progress chunks back to the admin client.

**State Management:**
- Server-side: `express-session` with default in-memory `MemoryStore` (no Redis/external store — see CONCERNS). 24-hour cookie maxAge, `httpOnly: true`, `secure: false` (hardcoded, not HTTPS-aware — see CONCERNS).
- Client-side: global `var` state in each page's JS bundle (e.g., `currentLanguage` in `public/js/farmer-dashboard.js`); no framework state manager.
- DB sync state: `sequelize.sync({ alter: true })` runs on every boot — schema is mutated to match models at startup.

## Key Abstractions

**Plot Context (`getPlotContext(plotId)`):**
- Purpose: Unified context bundle for advisory endpoints — combines plot, active planting record + crop, latest soil profile, current weather + forecast.
- Location: `routes/index.js:787-816`
- Pattern: Local async helper inside the router; used by `/api/advisor/irrigation`, `/disease-risk`, `/fertilizer`, `/gdd`, `/dashboard`, `/api/todo`.

**Sequelize sequelize instance (singleton):**
- Purpose: Shared DB connection configured per-environment.
- Location: `config/database.js` exported, re-imported by every model file via `require('../config/database')`.
- Pattern: Module-level singleton; environment branching on `NODE_ENV`/`DB_ENV`.

**Lazy-loaded service registry:**
- Purpose: Tolerate missing service files at boot without crashing the server.
- Location: `routes/index.js:13-20` — declares `let irrigationService, ...` then wraps each `require` in `try/catch`, logging a warning and leaving the binding `undefined`. Route handlers check `if (!service) return res.status(503)`.
- Pattern: Defensive loading for incremental/legacy code.

**Barrel model export:**
- Purpose: Single import surface for all models + associations.
- Location: `models/index.js`
- Pattern: `module.exports = { sequelize, Sequelize, ...models, Otp }`.

## Entry Points

**HTTP Server Entry (`index.js`):**
- Location: `index.js`
- Triggers: `npm start` (`node index.js`), `npm run dev` (nodemon), or cloud runtime.
- Responsibilities: Boot Express, register middleware, mount routes, sync DB schema, listen on `PORT` (default 4000, overridden by `process.env.PORT`).

**Migration Script (`scripts/migrate.js`):**
- Location: `scripts/migrate.js`
- Triggers: `npm run migrate:dev` / `npm run migrate:prod`.
- Responsibilities: Sets `NODE_ENV`/`DB_ENV` from `--env=`, authenticates, optional `--force` destructive reset, runs `sequelize.sync()`.

**Seed / Reset Scripts:**
- `scripts/seed.js`, `scripts/seed-trivia.js`, `scripts/reset-admin.js`, `scripts/migrate-data.js`, `scripts/migrate-otp-and-identity.js` — one-off admin/maintenance scripts using the same model layer.

## Error Handling

**Strategy:** Per-route `try/catch` returning JSON `{ error: 'Internal Server Error' }` with `console.error` logging. No centralized error handler beyond the final 500 fallback in `index.js:49` (which returns `{ error: 'Something went wrong!' }`).

**Patterns:**
- Each async route handler wraps its body in `try/catch`; catch logs `console.error('API Error /path:', err)` and returns `res.status(500).json({ error: 'Internal Server Error' })`.
- External API failures (`/api/weather/*`) return `503` with `{ error, message, fallback: true }` so the frontend can render fallback UI.
- Missing optional service → `503 { error: 'X service not available' }` (from lazy-load pattern).
- Admin alert SSE-style endpoint checks `res.headersSent` before sending 500 to avoid "headers already sent" crashes (`routes/index.js:1645`).
- Weather advisor endpoints degrade gracefully: if `weatherService` fails, `getPlotContext` catches and returns `null` weather, and the route returns `503 { error: 'Weather data unavailable' }`.
- No global request validation library — inputs are sanitized via inline `sanitizeInput()` (`routes/index.js:65`) which strips HTML tags with a regex, plus email/password regex checks in `/register`.

## Cross-Cutting Concerns

**Logging:** `morgan('dev')` for HTTP request logging to stdout; `console.error`/`console.warn`/`console.log` used pervasively for application errors and debug. No structured logger (winston/pino) — spans, correlation IDs, or log levels not present.

**Validation:** Inline per-route — `sanitizeInput` strips HTML, regex email validation, password policy (min 8 chars, upper/lower/digit) enforced only in `/register`. Sequelize model-level `validate.isIn` constrains enums (`User.role`, `SoilProfile.soil_type`, `WeatherLog.data_source`, N/P/K levels). No request-schema validation (e.g., Joi, zod, express-validator).

**Authentication:** Session-cookie based. `express-session` with `MemoryStore` (default), `secret` from `SESSION_SECRET` env or hardcoded dev fallback (`index.js:31`). Password hashing via `bcrypt` (10 rounds). OTP (6-digit, 10-min expiry, 3-attempt lockout) gates registration.

**Authorization:** Role-based with two roles (`Admin`, `Agriculturist`) enforced by `requireAdmin` middleware. Data scoping handled implicitly inside routes via `req.session.userId` (e.g., `FarmPlot.findAll({ where: { user_id: userId } })`).

**File Uploads:** `multer` with `memoryStorage` (10MB default limit) → streamed to Cloudinary `weather_crops` folder → `secure_url` persisted to `CropRepository.image_url`. MIME-type allowlist (env `ALLOWED_IMAGE_TYPES`).

**Static Assets:** `express.static(path.join(__dirname, 'public'))` — CSS, JS, images served directly. Helmet CSP allows `unsafe-inline`/`unsafe-eval` scripts and Google Fonts.

**Caching:** `utils/weatherService.js` in-memory object cache (10-min TTL, keyed by lat/lon). `satelliteService` caches polygon ID. No HTTP cache headers on API responses except `/api/satellite/image/:type` (`Cache-Control: public, max-age=3600`).

**i18n:** Client-side only — translation maps hardcoded in `public/js/farmer-dashboard.js` (`translations` object with `filipino`/English), toggled by `currentLanguage` global var. `User.language_pref` persisted but only consumed by client.

---

*Architecture analysis: 2026-07-22*