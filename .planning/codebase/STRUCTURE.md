# Codebase Structure

**Analysis Date:** 2026-07-22

## Directory Layout

```
WEATHER/
├── index.js                 # Express app entry — middleware, session, static, routes mount, DB sync
├── package.json             # CommonJS, scripts (start/dev/migrate)
├── package-lock.json
├── database.sqlite          # Dev SQLite DB (generated, committed)
├── .env                     # Env config (DO NOT read contents)
├── .gitignore
├── GEMINI.md                # AI assistant guidance doc
├── IMPROVEMENT.md           # Project improvement notes
├── UI-SPEC.md               # UI design contract
├── plotStatus.md            # Status doc
├── cookies.txt
├── fix-html-structure.js    # One-off maintenance script (root)
├── fix-tail.js              # One-off maintenance script (root)
├── _theming.ps1             # PowerShell theme helper
├── nul                      # Empty stray file (Windows redirect accident)
├── config/                  # DB connection config
│   └── database.js          # Sequelize instance (SQLite dev / MySQL prod)
├── middlewares/             # Request guards
│   └── auth.js              # requireAuth, requireAdmin session checks
├── models/                  # Sequelize ORM models + associations
│   ├── index.js             # Barrel: imports models + defines associations + exports
│   ├── User.js
│   ├── FarmPlot.js
│   ├── PlantingRecord.js
│   ├── CropRepository.js
│   ├── WeatherLog.js
│   ├── Alert.js
│   ├── Trivia.js
│   ├── SoilProfile.js
│   ├── StationDevice.js
│   └── Otp.js
├── routes/                  # All HTTP routing (pages + REST API)
│   └── index.js             # Single 1911-line router file
├── presenters/              # Thin view-dispatch helpers (largely unused)
│   ├── authPresenter.js
│   └── dashboardPresenter.js
├── services/                # Domain/business logic (pure functions, no DB)
│   ├── irrigationService.js       # FAO-56 ET0 irrigation scheduling
│   ├── diseaseRiskService.js      # Crop disease risk assessment
│   ├── fertilizerService.js       # Fertilizer timing recommendations
│   ├── gddService.js              # Growing Degree Days / growth stage
│   ├── typhoonAlertService.js     # Typhoon / extreme weather risk
│   ├── todoService.js             # Smart task list generator
│   ├── satelliteService.js        # Agromonitoring NDVI/satellite imagery
│   └── emailService.js            # Nodemailer SMTP (Gmail) singleton
├── utils/                   # External API clients
│   └── weatherService.js    # OpenWeather API client + 10-min in-memory cache
├── scripts/                 # CLI maintenance / migration scripts
│   ├── migrate.js                  # npm run migrate:dev|migrate:prod
│   ├── migrate-data.js             # Data migration
│   ├── migrate-otp-and-identity.js # OTP/identity migration
│   ├── seed.js                     # DB seed
│   ├── seed-trivia.js              # Trivia seed
│   └── reset-admin.js              # Admin password reset
├── views/                   # Static HTML pages (no templating engine)
│   ├── login.html
│   ├── register.html
│   ├── verify-otp.html
│   ├── farmer-dashboard.html
│   ├── crop-management.html
│   ├── weather-analytics.html
│   ├── digital-repository.html
│   ├── profile.html
│   └── admin-dashboard.html
├── public/                  # Static assets served by express.static
│   ├── css/
│   │   ├── login.css
│   │   ├── farmer-dashboard.css
│   │   ├── new-farmer-dashboard.css
│   │   ├── admin-dashboard.css
│   │   ├── crop-management.css
│   │   └── digital-repository.css
│   ├── js/
│   │   ├── farmer-dashboard.js      # ~2743 lines — main farmer SPA bundle + i18n
│   │   ├── new-farmer-dashboard.js  # New dashboard variant
│   │   └── admin-dashboard.js
│   └── img/
├── AI Ref Files/            # Reference materials (committed)
├── .planning/               # GSD planning workspace
├── .agents/                 # GSD agents config
├── .vscode/                 # Editor config
└── .git/
```

## Directory Purposes

**`config/`:**
- Purpose: Application configuration.
- Contains: `database.js` — single Sequelize instance configured per environment.
- Key files: `config/database.js` (65 lines).

**`middlewares/`:**
- Purpose: Express middleware functions guarding routes.
- Contains: `middlewares/auth.js` — `requireAuth`, `requireAdmin`.
- Note: Only one file — no logging, validation, or rate-limit middleware modules.

**`models/`:**
- Purpose: Sequelize ORM model definitions + association graph.
- Contains: One file per entity + `index.js` barrel.
- Key files: `models/index.js` (associations), `models/User.js`, `models/FarmPlot.js`, `models/PlantingRecord.js`, `models/CropRepository.js`, `models/WeatherLog.js`, `models/StationDevice.js`, `models/SoilProfile.js`, `models/Alert.js`, `models/Trivia.js`, `models/Otp.js`.

**`routes/`:**
- Purpose: All HTTP routing — both page routes (returning HTML) and REST API routes (returning JSON).
- Contains: Single `routes/index.js` (~1911 lines) mounted at `/`.
- Note: No module split by resource (e.g., `routes/auth.js`, `routes/crops.js`).

**`presenters/`:**
- Purpose: View-dispatch helpers (MVP-style presenter abstraction).
- Contains: `authPresenter.js` (used for `/login` and root redirect), `dashboardPresenter.js` (defined but unused — routes inline the `res.sendFile`).
- Pattern: Each presenter exports functions that call `res.sendFile(path.join(__dirname, '..', 'views', 'X.html'))`.

**`services/`:**
- Purpose: Business-logic modules — pure/functional agricultural recommendation engines + external adapters (email, satellite).
- Contains: 8 service modules.
- Key files: `services/irrigationService.js`, `services/todoService.js`, `services/satelliteService.js`, `services/emailService.js`.
- Pattern: Export plain functions; do NOT import models (data fetched by caller). Exception: `satelliteService`/`emailService` are external-API adapters holding module-level singletons.

**`utils/`:**
- Purpose: Cross-cutting helpers — currently only the OpenWeather API client.
- Key files: `utils/weatherService.js` (~359 lines) with in-memory cache.

**`scripts/`:**
- Purpose: Standalone CLI scripts for DB maintenance, seeding, and admin operations.
- Contains: `migrate.js`, `migrate-data.js`, `migrate-otp-and-identity.js`, `seed.js`, `seed-trivia.js`, `reset-admin.js`.
- Pattern: Each sets `NODE_ENV` then imports from `../models` and runs `sequelize.authenticate()` / sync / inserts.

**`views/`:**
- Purpose: Static HTML page shells.
- Contains: 9 `.html` files — login, register, verify-otp (auth flow); farmer-dashboard, crop-management, weather-analytics, digital-repository, profile (farmer pages); admin-dashboard (admin).
- Note: All dynamic content rendered client-side by `/js/*.js` calling `/api/*`.

**`public/`:**
- Purpose: Static assets served by `express.static` at `/`.
- Contains: `css/` (6 stylesheets, match view names), `js/` (3 client bundles — one per dashboard), `img/`.
- Key files: `public/js/farmer-dashboard.js` (~2743 lines — largest client bundle, includes i18n map).

**`AI Ref Files/`:**
- Purpose: Reference materials bundled with the repo (committed).
- Generated: No.

## Key File Locations

**Entry Points:**
- `index.js`: HTTP server bootstrap — wires middleware + routes + DB sync.
- `scripts/migrate.js`: CLI DB migration entry (`npm run migrate:dev|prod`).

**Configuration:**
- `config/database.js`: Sequelize instance (SQLite dev / MySQL prod).
- `package.json`: Scripts and dependency manifest (CommonJS, no `"type": "module"`).
- `.env`: Environment variables (existence noted — contents not read).
- `.gitignore`: Ignored paths.

**Core Logic:**
- `routes/index.js`: All HTTP routing + request orchestration + inline helpers (`getPlotContext`, `sanitizeInput`, `uploadToCloudinary`).
- `services/*.js`: Agricultural recommendation algorithms.
- `utils/weatherService.js`: OpenWeather API integration + cache.
- `models/*.js`: Sequelize schema.
- `middlewares/auth.js`: Session-based auth guards.

**Testing:**
- None. `package.json` test script is the default placeholder (`echo "Error: no test specified" && exit 1`).
- No `test/` or `__tests__/` directory; no test framework installed.

## Naming Conventions

**Files:**
- Models: PascalCase matching the Sequelize model name (`User.js`, `FarmPlot.js`, `CropRepository.js`, `StationDevice.js`, `PlantingRecord.js`, `SoilProfile.js`, `WeatherLog.js`, `Trivia.js`, `Alert.js`, `Otp.js`).
- Services / utils / middlewares / presenters: camelCase with `Service`/`auth` suffix (`irrigationService.js`, `weatherService.js`, `dashboardPresenter.js`).
- Views: kebab-case + `.html` matching the route slug (`farmer-dashboard.html`, `crop-management.html`, `verify-otp.html`).
- Client JS / CSS: kebab-case matching dashboard name (`farmer-dashboard.js`, `farmer-dashboard.css`).
- Barrels: `index.js` (CommonJS `module.exports`).

**Directories:**
- Lowercase plurals for collections (`routes/`, `models/`, `middlewares/`, `services/`, `views/`, `scripts/`).
- Singular for singletons (`config/`, `utils/`, `public/`).
- Kebab-case with space allowed in ad-hoc folders (`AI Ref Files/`).

**Table Names (DB):** `underscored: true` forces snake_case plurals — `users`, `farm_plots`, `planting_records`, `crop_repository`, `weather_logs`, `station_devices`, `soil_profiles`, `alerts`, `trivia`, `otps`.

## Where to Add New Code

**New REST API endpoint:**
- Add the route inline in `routes/index.js` under the matching section comment block (e.g., `// 🛡️ ADMIN REST API ROUTES`). Use the existing inline pattern:
  ```js
  router.get('/api/foo', requireAuth, async (req, res) => {
    try { ... res.json(...); }
    catch (err) { console.error('API Error /api/foo:', err); res.status(500).json({ error: 'Internal Server Error' }); }
  });
  ```
- Scope queries by `req.session.userId` for user-owned resources.

**New Sequelize model/entity:**
- Create `models/NewEntity.js` following the existing pattern: `sequelize.define('NewEntity', { new_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, ... }, ... }, { tableName: 'new_entities', timestamps: true, underscored: true })`.
- Import it in `models/index.js`, define `hasMany`/`belongsTo` associations with named `as:` aliases, and add to the `module.exports` object.
- Schema auto-syncs on next boot via `sequelize.sync({ alter: true })` in `index.js` — no manual SQL migration required (though `scripts/migrate.js` exists for explicit runs).

**New agricultural advisory service:**
- Create `services/newService.js` exporting pure functions taking already-fetched inputs (weather, crop, soil) — do NOT import models directly.
- Lazy-load it in `routes/index.js:13-20` block (add `let newService; try { newService = require('../services/newService'); } catch(e) { console.warn(...); }`).
- Add a route `router.get('/api/advisor/new', requireAuth, async (req, res) => { ... if (!newService) return res.status(503)...; ... })`.
- Optionally wire it into the aggregated `/api/advisor/dashboard` Promise.all block (`routes/index.js:984-1039`).

**New page (view + route):**
- Add static HTML in `views/new-page.html` linking `/css/new-page.css` and (if dynamic) `/js/new-page.js`.
- Add `router.get('/new-page', requireAuth, getPage('new-page'))` in `routes/index.js` (`getPage` helper at `:302`).
- Add matching CSS in `public/css/new-page.css` and JS in `public/js/new-page.js`.

**New client-side bundle:**
- Place in `public/js/` (served at `/js/<name>.js`); fetch data from `/api/*` and render to DOM directly (no framework).

**New CLI maintenance script:**
- Place in `scripts/<name>.js`; follow `scripts/migrate.js` pattern (parse `--env=` argv, set `process.env.NODE_ENV`, `require('dotenv').config()`, `sequelize.authenticate()`).
- Add an npm script entry in `package.json` if it should be runnable via npm.

**Shared utility/helper (cross-route):**
- Pure helpers live inline in `routes/index.js` (e.g., `sanitizeInput`, `getPlotContext`, `uploadToCloudinary`) — no shared `helpers/` directory exists. For genuinely shared code, add to `utils/`.

## Special Directories

**`node_modules/`:**
- Purpose: NPM dependencies.
- Generated: Yes (by `npm install`).
- Committed: No (gitignored).

**`database.sqlite`:**
- Purpose: Dev SQLite database file.
- Generated: Yes (by `sequelize.sync` or migration).
- Committed: Yes (present in repo) — unusual; typically gitignored.

**`AI Ref Files/`:**
- Purpose: Reference / planning assets (committed).
- Generated: No.

**`.planning/`:**
- Purpose: GSD workflow workspace (PROJECT.md, codebase intel, phase plans).
- Generated: Yes (by GSD commands).
- Committed: Yes (see `.gitignore` for any exclusions).

**`.agents/`:**
- Purpose: GSD agent definitions / skills.
- Committed: Yes.

---

*Structure analysis: 2026-07-22*