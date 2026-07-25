<!-- GSD:project-start source:PROJECT.md -->
## Project

**DEBESMSCAT Weather & Smart Crop Platform**

A web platform for DEBESMSCAT that combines campus weather monitoring with smart crop management tools for campus agriculturists (farmers) and agriculture students. It delivers real-time and forecast weather for the DEBESMSCAT campus, early-warning advisories, weather-informed planting and plot guidance, and a crop knowledge repository—evolving the existing Weather codebase into a usable campus pilot.

**Core Value:** Campus users can trust local weather data and act on clear crop advisories in time to reduce climate-related crop risk and improve plot decisions.

### Constraints

- **Tech stack**: Evolve existing Node/Express/Sequelize/vanilla frontend stack — do not greenfield rewrite
- **Weather provider**: OpenWeather for v1 (not Google Weather)
- **Geography**: DEBESMSCAT campus weather scope only
- **Notifications**: In-app + email only in v1 (no SMS)
- **Users**: Farmers and students; Admin role remains for content/ops
- **Quality bar**: Campus pilot usable daily — prioritize reliability over new experimental features
- **Budget posture**: Prefer existing integrations; avoid new paid channels in v1 unless essential
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- JavaScript (CommonJS) - Server logic, routes, services, models, scripts; `"type": "commonjs"` declared in `package.json`
- HTML - View templates served as static files from `views/*.html` (no templating engine)
- CSS - Hand-written stylesheets in `public/css/*.css` (no preprocessor detected)
- JavaScript (client) - Vanilla browser JS in `public/js/*.js` (e.g. `farmer-dashboard.js`, `admin-dashboard.js`); no frontend framework
- SQL - Implicit via Sequelize ORM (SQLite in dev, MySQL in prod); no raw SQL files committed
## Runtime
- Node.js (version not pinned; no `.nvmrc` / `engines` field). Uses native `fetch` (Node ≥ 18 required).
- npm (lockfile `package-lock.json` present)
- Lockfile: present
## Frameworks
- `express` ^5.2.1 - HTTP server & routing (`index.js`, `routes/index.js`). NOTE: Express 5.x is a recent major — escaping/regulators should use Express 5 semantics.
- None detected. `"test"` script is a stub: `echo "Error: no test specified" && exit 1` (`package.json` line 7). No `jest`, `vitest`, `mocha`, or test files present.
- `nodemon` - Dev runner invoked via `npm run dev` (`package.json` line 9). Not listed in `dependencies` (assumed globally installed or omitted).
- No bundler/transpiler — plain CommonJS `require()` throughout; no TypeScript, no Babel, no `dist/`.
## Key Dependencies
- `sequelize` ^6.37.8 - ORM, defines models in `models/*.js`, associations in `models/index.js`
- `sqlite3` ^6.0.1 - Dev database driver (SQLite); dev file `database.sqlite` at repo root
- `mysql2` ^3.22.3 - Prod database driver (MySQL via Aiven.io); SSL required
- `express` ^5.2.1 - Web framework
- `express-session` ^1.19.0 - Session store for auth (in-memory, default `MemoryStore`)
- `bcrypt` ^6.0.0 - Password hashing for `User.password_hash` (`routes/index.js` line 101)
- `dotenv` ^17.4.2 - Env config loaded at top of `index.js`, `services/emailService.js`, `scripts/migrate.js`
- `helmet` ^8.1.0 - Security headers with custom CSP whitelisting OpenWeather + Agromonitoring (`index.js` lines 12-23)
- `cors` ^2.8.6 - CORS middleware (`index.js` line 24) — applied app-wide with no opts
- `morgan` ^1.10.1 - HTTP request logging, `dev` format (`index.js` line 27)
- `multer` ^2.2.0 - Multipart upload handling for crop images; in-memory storage (`routes/index.js` lines 33-38)
- `cloudinary` ^2.10.0 - Image hosting/upload for crop repository images (`routes/index.js` lines 26-30, `uploadToCloudinary` helper)
- `nodemailer` ^9.0.3 - Transactional email (OTP + welcome) via Gmail SMTP (`services/emailService.js`)
- No test framework
- No ESLint / Prettier / Biome config
- No TypeScript
- No frontend framework or build tool (React, Vue, Vite, etc.)
- No WebSocket/real-time lib
- No job queue / scheduler
## Configuration
- `.env` file present at repo root (existence noted only — contents not read). Loaded via `require('dotenv').config()`.
- Key env vars referenced in code:
- No build step. `npm start` runs `node index.js` directly.
- DB schema is auto-synced at boot via `sequelize.sync({ alter: true })` in `index.js` lines 58-64.
- Explicit migration script: `node scripts/migrate.js --env=development|production` (supports `--force` to drop/recreate). Invoked via `npm run migrate:dev` / `migrate:prod` (`package.json` lines 10-11).
## Platform Requirements
- Node.js ≥ 18 (uses global `fetch`)
- npm
- Write access to repo root for `database.sqlite` (SQLite file)
- Deployed to Render (URL `weather-app-rr5y.onrender.com` referenced in `routes/index.js` line 214)
- Externalized MySQL via Aiven.io (`config/database.js` line 10) with SSL
- Sessions use default in-memory `MemoryStore` — will not survive restart/ across instances (single-instance deployment assumed)
## Data Layer
- Dev: SQLite, file at `process.env.DB_FILE || 'database.sqlite'`, SQL logging on
- Prod: MySQL dialect over SSL via `PROD_DATABASE_URL` or individual `PROD_DB_*` vars, SQL logging off
- `User` (roles: `Admin` | `Agriculturist`; bcrypt-hashed `password_hash`)
- `CropRepository` (shared crop parameter catalog, has `image_url` from Cloudinary)
- `FarmPlot` (user-scoped, holds lat/lon)
- `PlantingRecord` (plot + crop, status `Growing`/`Harvested`)
- `WeatherLog` (`data_source`: `API` | `Station`, optional `station_id`)
- `Alert` (incl. `Admin Broadcast` type)
- `Trivia` (published_by → User)
- `SoilProfile` (multiple per plot over time)
- `StationDevice` (IoT weather station, `device_id` PK, `owner_id` → User)
- `Otp` (pending registration: `email`, `otp_code`, `attempts`, `user_data` JSON, `expires_at`)
## Frontend Stack
- **Templating:** None. Views are static `.html` files in `views/` served via `res.sendFile()` from `routes/index.js` (`getPage` helper line 302).
- **CSS:** Plain CSS per page in `public/css/` (e.g. `farmer-dashboard.css`, `admin-dashboard.css`, `digital-repository.css`).
- **Client JS:** Vanilla JS in `public/js/` (`farmer-dashboard.js` 2743 lines includes Filipino/English translation tables; `admin-dashboard.js`; `new-farmer-dashboard.js`). Communicates with REST endpoints under `/api/*`.
- **Fonts:** Google Fonts allowed via CSP `styleSrc`/`fontSrc` (`index.js` lines 17-18).
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Module System
- Use `require()` / `module.exports` on the server. Never use ESM `import`/`export` syntax in Node files.
- Client-side `public/js/*.js` files are plain browser scripts loaded via `<script>` tags in `views/*.html` — no module system, functions attach to `window` for inline handlers (e.g. `window.archivePlot = async function(...)` in `public/js/farmer-dashboard.js`).
## Naming Patterns
- Services: `services/irrigationService.js`, `services/emailService.js`, `services/gddService.js`, `services/satelliteService.js`, `utils/weatherService.js`
- Presenters: `presenters/authPresenter.js`, `presenters/dashboardPresenter.js`
- Middlewares folder uses lowercase singular: `middlewares/auth.js`
- Models use PascalCase matching the Sequelize model name: `models/User.js`, `models/FarmPlot.js`, `models/CropRepository.js`
- `public/js/farmer-dashboard.js`, `public/js/new-farmer-dashboard.js`, `public/js/admin-dashboard.js`
- `public/css/farmer-dashboard.css`, `public/css/admin-dashboard.css`, `public/css/login.css`
- Views (HTML): `views/farmer-dashboard.html`, `views/crop-management.html`
- camelCase everywhere: `fetchCurrentWeather`, `getIrrigationRecommendation`, `estimateGrowthStage`, `uploadToCloudinary`, `sanitizeInput`
- Server route handlers in `routes/index.js` are inline arrow functions passed directly to `router.get/post/put/delete`; only a few named helpers exist (`getFarmerDashboard`, `getPage`, `getPlotContext`, `uploadToCloudinary`, `sanitizeInput`)
- Presenter functions are camelCase verbs: `getLogin`, `redirectLogin`, `getDashboard`
- Client uses `function declaration` style (hoisted) for top-level functions and async function expressions for event handlers: `form.addEventListener('submit', async function (e) { ... })`
- Server: `const`/`let` with camelCase. `const { Op } = require('sequelize')` destructuring is standard.
- Client: **mixed** — `var` is still used for top-level state and module-scoped data in `public/js/farmer-dashboard.js` and `public/js/new-farmer-dashboard.js` (e.g. `var currentLanguage = 'filipino';`, `var translations = {...}`, `var liveWeather`). `const`/`let` appear in newer async fetch handlers. **New client code should prefer `const`/`let` over `var`.**
- Model names PascalCase (`User`, `FarmPlot`, `PlantingRecord`).
- Column names snake_case (`user_id`, `password_hash`, `planting_date`, `ideal_temp_min`) — achieved via `underscored: true` option in every model (see `models/User.js`, `models/FarmPlot.js`).
- Table names explicitly snake_case lowercase: `tableName: 'users'`, `tableName: 'farm_plots'`.
- Foreign keys follow `<entity>_id` pattern: `user_id`, `plot_id`, `crop_id`, `owner_id`, `station_id`.
## Code Style
- No automated formatter configured (no `.prettierrc`, no `.editorconfig`, no Biome/Rome).
- 2-space indentation is the dominant style in server files and CSS.
- HTML in `views/` uses 4-space indentation.
- Client JS files mix 4-space and 2-space blocks inconsistently — there is no enforced standard.
- Semicolons are used. Single quotes for strings on server; double quotes prevalent in client JS for HTML-adjacent strings (`"Good morning"`).
- **No ESLint configuration present.** No `.eslintrc*`, no `eslint.config.*`, no lint script in `package.json`. Linting is not enforced.
## Import Organization
## Async & Error Handling
- Input validation happens first and returns early with `400` and `{ error: '...' }`.
- Not-found returns `404` with `{ error: '<Entity> not found' }`.
- All exceptions are caught and logged via `console.error('API Error <route>:', err)` then returned as `500` with generic `'Internal Server Error'` (specific message withheld from client).
- External API failures (weather proxy) use `503` with `{ error, message: err.message, fallback: true }` — see `routes/index.js` lines ~626-655.
- Non-critical external calls (email, weather in advisor context) are wrapped in their own try/catch and logged with `console.warn('⚠️ ...')` so they don't fail the parent request.
- Parallel fetches use `Promise.all`: `const [currentRes, forecastRes] = await Promise.all([fetch(...), fetch(...)])`.
- Form submissions use `fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify({...}) })`.
## Validation & Sanitization
- `sanitizeInput(str)` in `routes/index.js` trims and strips HTML tags via regex `/<[^>]*>?/gm`. Use for all free-text user input from forms.
- Email validated with regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` and Sequelize's `isEmail` validator (`models/User.js`).
- Password policy enforced inline: `length >= 8 && /[A-Z]/ && /[a-z]/ && /\d/` (see `/register` handler).
- Numeric inputs from `req.body` are explicitly cast with `parseInt()` / `parseFloat()` before passing to Sequelize (e.g. `plot_id: parseInt(plot_id)`, `area_size: parseFloat(area_size)`).
- File uploads validated against `ALLOWED_IMAGE_TYPES` env (default `jpeg,jpg,png,gif,webp`) and size-limited by `MAX_FILE_SIZE` (default 10MB) via Multer (`routes/index.js`).
## Comments & JSDoc
- **JSDoc is used in service modules** — `services/irrigationService.js`, `services/emailService.js`, and `utils/weatherService.js` document every exported function with `@param` / `@returns`. **New services should follow this pattern.**
- Section banner comments with emoji+ASCII dividers organize `routes/index.js`:
- `utils/weatherService.js` uses decorative box dividers (`───`) between sections.
- Inline `// comments` explain non-obvious business logic (e.g. `// Effective rainfall today (80% of actual rain above 5mm...)` in `irrigationService.js`).
- Client JS uses `// Sidebar / Common` category comments to organize translation dictionaries.
## Logging
- Status messages prefixed with emoji: `console.log('✅ Database schema synchronized...')`, `console.error('❌ Failed to...')`, `console.warn('⚠️ ...')`.
- Error logs include the operation name: `console.error('API Error POST /api/planting-records:', err)`.
- Verbose step-by-step logging in `scripts/migrate.js` uses ANSI color codes (`\x1b[36m`, `\x1b[32m`) for header banners — keep this style for any new migration/seed scripts.
- Local-only OTP fallback is logged to console when email sending fails: `console.log('🔑 LOCAL/DEBUG OTP CODE FOR ${email}: ${otp_code}')`.
## CSS Conventions
- **Global, unscoped, page-per-route stylesheets** in `public/css/`. Each view links its own CSS: `<link rel="stylesheet" href="/css/farmer-dashboard.css">`. No CSS modules, no CSS-in-JS, no Tailwind.
- **No BEM.** Class names are flat, hyphenated, semantically named: `.topbar`, `.topbar-brand`, `.topbar-right`, `.sidebar`, `.nav-item`, `.alert-pill`, `.layout`, `.dash`. Modifiers use `--` suffix: `.nav-item--logout`, `.active` modifier is `.nav-item.active`.
- Inline `style="..."` attributes are used liberally in HTML views for one-off tweaks (avatar colors, quick flex layouts) — not considered an anti-pattern in this codebase.
- Heavy use of CSS gradients for headers and buttons: `linear-gradient(135deg, #064e3b 0%, #047857 100%)`.
- SVG icons are inline in HTML (no icon library), styled via `stroke="currentColor"`.
- Web fonts loaded via `@import` at top of each CSS file: `'Plus Jakarta Sans'`, `'Nunito'`, `'Outfit'` from Google Fonts.
- **Design tokens:** No CSS variables or design-token file. Colors and spacing are hardcoded per-file. The primary green palette (`#047857`, `#10b981`, `#059669`, `#064e3b`) appears consistently across `farmer-dashboard.css` and represents the brand green — reuse these for new dashboard pages.
- 4-space indentation in CSS files.
## Database Conventions
- ORM: Sequelize 6. Models defined with `sequelize.define('ModelName', {...}, { tableName, timestamps: true, underscored: true })`.
- All models set `underscored: true` so camelCase JS fields map to snake_case DB columns — **always include this option in new models**.
- `timestamps: true` is default-on; the project relies on `createdAt`/`updatedAt`.
- Associations defined centrally in `models/index.js` (not in model files) using `hasMany`/`belongsTo` with explicit `foreignKey` and `as` alias. Always define an `as` alias — routes depend on them (e.g. `include: [{ model: FarmPlot, as: 'plot' }]`).
- Cascade deletes on parent relations: `onDelete: 'CASCADE'` for `User.hasMany(FarmPlot, ...)` etc.
- Schema synchronization uses `sequelize.sync({ alter: true })` on every boot (`index.js` line 58) — non-destructive column adds. Migrations scripts in `scripts/migrate*.js` use `sync({ force: false/true })`.
## Session & Auth Conventions
- Auth state lives in `express-session`, not JWT. Session keys: `req.session.userId`, `req.session.userRole`, `req.session.userFullName`, `req.session.userEmail`.
- Two middleware guards in `middlewares/auth.js`: `requireAuth` (any logged-in user) and `requireAdmin` (role === `'Admin'`). Apply `requireAuth` first, then `requireAdmin`: `router.get('/api/admin/stats', requireAuth, requireAdmin, async ...)`.
- API paths (`/api/*`) get `401`/`403` JSON; page paths get redirected to `/login` or `/farmer/dashboard`.
- Roles are string literals `'Admin'` and `'Agriculturist'` — enforced via Sequelize `isIn` validator in `models/User.js`.
## Git Conventions
- **No enforced git convention.** Only 4 commits exist in the repo with messages like `start`, `bago` (Tagalog for "new"), `to green`, and `7/16/25: Thinking on adding new openweather features`. No conventional-commits, no issue references, no semantic versioning in messages.
- Single author: `mayma4545 <fernandezmayma@gmail.com>`.
- `.gitignore` excludes `node_modules/`, `*.sqlite`, `database.sqlite`, `.env`, and `nul` (Windows reserved name).
- **Recommendation for future commits:** use Conventional Commits (`feat:`, `fix:`, `chore:`) scoped by area, e.g. `feat(irrigation): add Hargreaves ET0 calc`.
## Environment Configuration
- `.env` exists (gitignored) — contains runtime secrets. **No `.env.example` template exists** — recommend creating one documenting: `OPENWEATHER_API_KEY`, `SESSION_SECRET`, `WEATHER_LAT`, `WEATHER_LON`, `PORT`, `DB_FILE`, `NODE_ENV`, `PROD_DATABASE_URL`/`PROD_DB_*`, `EMAIL_USER`, `EMAIL_PASS`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `MAX_FILE_SIZE`, `ALLOWED_IMAGE_TYPES`.
- Loaded via `require('dotenv').config()` at the top of `index.js` and re-loaded in `services/emailService.js` and `scripts/migrate.js`.
- Fallback defaults are inline with `||`: `process.env.PORT || 4000`, `process.env.WEATHER_LAT || '12.3703'` (Masbate City, Philippines — the project's default geographic anchor).
- **`routes/index.js` lines 27-29 hardcode production Cloudinary credentials as fallback** — this is a security anti-pattern (see CONCERNS). New code must read solely from `process.env` without credential literals.
## Function Design
- **Size:** Route handler functions in `routes/index.js` are long (50-150 lines) and bundle validation, business logic, and response shaping in one `try` block. This is the accepted style here — extraction to services is partial (`getPlotContext` is one example of an extracted helper).
- **Parameters:** Services use positional args with defaults: `getIrrigationRecommendation(weatherData = {}, forecastDays = [], cropName = 'Crop', growthStage = 'mid', soilType = 'Loam')`. Destructuring used for option objects: `sendEmail({ to, subject, text, html, attachments })`.
- **Return values:** API endpoints return plain JSON objects (Sequelize instances serialize automatically). Advisor services return rich report objects with both computed numbers and human-readable `recommendation` strings.
## Module Exports
- **Named exports preferred.** Services: `module.exports = { calculateET0, getCropCoefficient, ... }`. Models: `module.exports = User` (single default-ish export of the Sequelize model). Presenters: `module.exports = { getLogin, redirectLogin }`. Middlewares: `module.exports = { requireAuth, requireAdmin }`.
- No barrel files outside `models/index.js`.
- Lazy-require optional services at the top of `routes/index.js` (try/catch around `require`) when a service may not load — see the seven-service block at lines 13-20.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Single Express app entry point (`index.js`) mounting one router (`routes/index.js`) at `/`.
- Server-rendered templating is NOT used. Views are static `.html` files in `views/` served via `res.sendFile`; all dynamic behavior is rendered client-side from `public/js/*.js` calling `/api/*` endpoints.
- REST API (`/api/...`) co-located in the same `routes/index.js` file as page routes — no `controllers/` separation.
- Sequelize ORM with `alter: true` auto-sync on every boot (`index.js:58`) — schema is code-first, derived from `models/`.
- Dual-database target: SQLite in development, MySQL (Aiven.io) in production — selected at runtime in `config/database.js`.
- Session-based auth (cookie + server session store), not JWT.
## Layers
- Purpose: Wire global middleware, mount session, mount static files, mount router, sync DB, start HTTP listener.
- Location: `index.js`
- Contains: Express app setup, helmet CSP, CORS, JSON/urlencoded body parsers, morgan logging, express-session config, static asset mount, error handler.
- Depends on: `routes/index.js`, `models/index.js` (sequelize instance), `express-session`, `helmet`, `morgan`, `cors`, `dotenv`.
- Used by: `npm start` / `npm run dev` (nodemon).
- Purpose: Define all page routes AND all REST API endpoints; orchestrates data fetching, calls services, sends JSON or static HTML.
- Location: `routes/index.js` (single 1911-line file — see CONCERNS).
- Contains: ~30 GET page routes (`/login`, `/farmer/dashboard`, `/admin/dashboard`, etc.) and ~40+ REST endpoints under `/api/*` covering auth, plots, crops, planting, soil, weather proxy, IoT stations, advisors, todo, admin CRUD, alerts, trivia, satellite.
- Depends on: `utils/weatherService`, all `services/*` (lazy-loaded with try/catch fallback), `middlewares/auth`, `presenters/authPresenter`, `models/`, `services/emailService`, `cloudinary`, `multer`.
- Used by: `index.js` mounts it at `/`.
- Purpose: Cross-cutting request guards.
- Location: `middlewares/auth.js`
- Contains: `requireAuth` (checks `req.session.userId`, 401 for `/api/` paths else redirect to `/login`) and `requireAdmin` (checks `req.session.userRole === 'Admin'`, 403 for `/api/` else redirect to `/farmer/dashboard`).
- Used by: Every protected route in `routes/index.js` via per-route middleware chaining.
- Pattern: API vs page detection via `req.path.startsWith('/api/')` returns JSON; otherwise redirects.
- Purpose: Thin view-dispatch helpers — currently only wrap `res.sendFile(path.join(__dirname, '..', 'views', 'X.html'))`.
- Location: `presenters/authPresenter.js`, `presenters/dashboardPresenter.js`
- Note: Largely vestigial; most page routes in `routes/index.js` call `res.sendFile` directly rather than going through presenters. `dashboardPresenter.getDashboard` is defined but unused (routes use inline `getFarmerDashboard`).
- Purpose: Domain/business logic — pure functions (no DB access) that compute agricultural recommendations from weather + crop inputs.
- Location: `services/irrigationService.js`, `services/diseaseRiskService.js`, `services/fertilizerService.js`, `services/gddService.js`, `services/typhoonAlertService.js`, `services/todoService.js`, `services/satelliteService.js`, `services/emailService.js`.
- Pattern: Each module exports plain functions (e.g., `getIrrigationRecommendation`, `assessDiseaseRisks`, `getFertilizerRecommendation`, `estimateGrowthStage`, `assessTyphoonRisk`, `generateTodoList`). No classes, no shared state — except `satelliteService` which caches a polygon ID and `emailService` which holds a nodemailer transporter singleton.
- Used by: `routes/index.js` (lazy-loaded with `try/catch` guards).
- Note: Services do NOT call models or DB directly — the route handler fetches model data, assembles a "plot context" via `getPlotContext(plotId)` helper (routes/index.js:787), then passes pure inputs to the service.
- Purpose: External API integration with caching.
- Location: `utils/weatherService.js` — OpenWeather API client with in-memory 10-min TTL cache (`cache` object, `isCacheValid`/`setCache`), normalizes responses, exposes `fetchCurrentWeather`, `fetchForecast`, `generateForecastRisks`.
- Used by: `routes/index.js` for weather proxy routes and `getPlotContext`.
- Purpose: Sequelize model definitions + association wiring + shared sequelize instance.
- Location: `models/index.js` (barrel + associations) plus one file per entity: `User.js`, `FarmPlot.js`, `PlantingRecord.js`, `CropRepository.js`, `WeatherLog.js`, `Alert.js`, `Trivia.js`, `SoilProfile.js`, `StationDevice.js`, `Otp.js`.
- Pattern: Each model calls `sequelize.define('Name', { fields }, { tableName, timestamps: true, underscored: true })`. Snake_case table names, snake_case columns via `underscored: true`. PKs are `*_id` INTEGER autoincrement (except `StationDevice.device_id` string PK, `Otp.otp_id`).
- Associations defined centrally in `models/index.js` using `hasMany`/`belongsTo` with named aliases (`as: 'plots'`, `as: 'crop'`, etc.) and `onDelete: 'CASCADE'`.
- Used by: Imported from `routes/index.js` via `const { User, FarmPlot, ... } = require('../models')`.
- Purpose: Serve HTML shells + client-side assets.
- Location: `views/*.html` (9 static HTML pages) + `public/css/*.css` (6 stylesheets) + `public/js/*.js` (3 large client bundles — `farmer-dashboard.js` is ~2743 lines).
- Rendering model: NO server templating. Each HTML page links its CSS and `<script src="/js/X.js">`; the JS fetches `/api/*` on load and renders DOM. `public/js/farmer-dashboard.js` embeds i18n translation maps client-side.
## Data Flow
- Server-side: `express-session` with default in-memory `MemoryStore` (no Redis/external store — see CONCERNS). 24-hour cookie maxAge, `httpOnly: true`, `secure: false` (hardcoded, not HTTPS-aware — see CONCERNS).
- Client-side: global `var` state in each page's JS bundle (e.g., `currentLanguage` in `public/js/farmer-dashboard.js`); no framework state manager.
- DB sync state: `sequelize.sync({ alter: true })` runs on every boot — schema is mutated to match models at startup.
## Key Abstractions
- Purpose: Unified context bundle for advisory endpoints — combines plot, active planting record + crop, latest soil profile, current weather + forecast.
- Location: `routes/index.js:787-816`
- Pattern: Local async helper inside the router; used by `/api/advisor/irrigation`, `/disease-risk`, `/fertilizer`, `/gdd`, `/dashboard`, `/api/todo`.
- Purpose: Shared DB connection configured per-environment.
- Location: `config/database.js` exported, re-imported by every model file via `require('../config/database')`.
- Pattern: Module-level singleton; environment branching on `NODE_ENV`/`DB_ENV`.
- Purpose: Tolerate missing service files at boot without crashing the server.
- Location: `routes/index.js:13-20` — declares `let irrigationService, ...` then wraps each `require` in `try/catch`, logging a warning and leaving the binding `undefined`. Route handlers check `if (!service) return res.status(503)`.
- Pattern: Defensive loading for incremental/legacy code.
- Purpose: Single import surface for all models + associations.
- Location: `models/index.js`
- Pattern: `module.exports = { sequelize, Sequelize, ...models, Otp }`.
## Entry Points
- Location: `index.js`
- Triggers: `npm start` (`node index.js`), `npm run dev` (nodemon), or cloud runtime.
- Responsibilities: Boot Express, register middleware, mount routes, sync DB schema, listen on `PORT` (default 4000, overridden by `process.env.PORT`).
- Location: `scripts/migrate.js`
- Triggers: `npm run migrate:dev` / `npm run migrate:prod`.
- Responsibilities: Sets `NODE_ENV`/`DB_ENV` from `--env=`, authenticates, optional `--force` destructive reset, runs `sequelize.sync()`.
- `scripts/seed.js`, `scripts/seed-trivia.js`, `scripts/reset-admin.js`, `scripts/migrate-data.js`, `scripts/migrate-otp-and-identity.js` — one-off admin/maintenance scripts using the same model layer.
## Error Handling
- Each async route handler wraps its body in `try/catch`; catch logs `console.error('API Error /path:', err)` and returns `res.status(500).json({ error: 'Internal Server Error' })`.
- External API failures (`/api/weather/*`) return `503` with `{ error, message, fallback: true }` so the frontend can render fallback UI.
- Missing optional service → `503 { error: 'X service not available' }` (from lazy-load pattern).
- Admin alert SSE-style endpoint checks `res.headersSent` before sending 500 to avoid "headers already sent" crashes (`routes/index.js:1645`).
- Weather advisor endpoints degrade gracefully: if `weatherService` fails, `getPlotContext` catches and returns `null` weather, and the route returns `503 { error: 'Weather data unavailable' }`.
- No global request validation library — inputs are sanitized via inline `sanitizeInput()` (`routes/index.js:65`) which strips HTML tags with a regex, plus email/password regex checks in `/register`.
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

| Skill | Description | Path |
|-------|-------------|------|
| mama | Describe what this skill does and when to use it. Include keywords that help agents identify relevant tasks. | `.agents/skills/mama/SKILL.md` |
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
