# Coding Conventions

**Analysis Date:** 2026-07-22

## Module System

**CommonJS throughout** — declared explicitly in `package.json` (`"type": "commonjs"`).

- Use `require()` / `module.exports` on the server. Never use ESM `import`/`export` syntax in Node files.
- Client-side `public/js/*.js` files are plain browser scripts loaded via `<script>` tags in `views/*.html` — no module system, functions attach to `window` for inline handlers (e.g. `window.archivePlot = async function(...)` in `public/js/farmer-dashboard.js`).

## Naming Patterns

**Files (server):** camelCase with `Service`/`Presenter` suffix where appropriate.
- Services: `services/irrigationService.js`, `services/emailService.js`, `services/gddService.js`, `services/satelliteService.js`, `utils/weatherService.js`
- Presenters: `presenters/authPresenter.js`, `presenters/dashboardPresenter.js`
- Middlewares folder uses lowercase singular: `middlewares/auth.js`
- Models use PascalCase matching the Sequelize model name: `models/User.js`, `models/FarmPlot.js`, `models/CropRepository.js`

**Files (client):** kebab-case.
- `public/js/farmer-dashboard.js`, `public/js/new-farmer-dashboard.js`, `public/js/admin-dashboard.js`
- `public/css/farmer-dashboard.css`, `public/css/admin-dashboard.css`, `public/css/login.css`
- Views (HTML): `views/farmer-dashboard.html`, `views/crop-management.html`

**Files (scripts):** kebab-case verbs: `scripts/migrate.js`, `scripts/seed.js`, `scripts/reset-admin.js`, `scripts/migrate-otp-and-identity.js`, `scripts/seed-trivia.js`

**Functions:**
- camelCase everywhere: `fetchCurrentWeather`, `getIrrigationRecommendation`, `estimateGrowthStage`, `uploadToCloudinary`, `sanitizeInput`
- Server route handlers in `routes/index.js` are inline arrow functions passed directly to `router.get/post/put/delete`; only a few named helpers exist (`getFarmerDashboard`, `getPage`, `getPlotContext`, `uploadToCloudinary`, `sanitizeInput`)
- Presenter functions are camelCase verbs: `getLogin`, `redirectLogin`, `getDashboard`
- Client uses `function declaration` style (hoisted) for top-level functions and async function expressions for event handlers: `form.addEventListener('submit', async function (e) { ... })`

**Variables:**
- Server: `const`/`let` with camelCase. `const { Op } = require('sequelize')` destructuring is standard.
- Client: **mixed** — `var` is still used for top-level state and module-scoped data in `public/js/farmer-dashboard.js` and `public/js/new-farmer-dashboard.js` (e.g. `var currentLanguage = 'filipino';`, `var translations = {...}`, `var liveWeather`). `const`/`let` appear in newer async fetch handlers. **New client code should prefer `const`/`let` over `var`.**

**Types (Sequelize models):**
- Model names PascalCase (`User`, `FarmPlot`, `PlantingRecord`).
- Column names snake_case (`user_id`, `password_hash`, `planting_date`, `ideal_temp_min`) — achieved via `underscored: true` option in every model (see `models/User.js`, `models/FarmPlot.js`).
- Table names explicitly snake_case lowercase: `tableName: 'users'`, `tableName: 'farm_plots'`.
- Foreign keys follow `<entity>_id` pattern: `user_id`, `plot_id`, `crop_id`, `owner_id`, `station_id`.

## Code Style

**Formatting:**
- No automated formatter configured (no `.prettierrc`, no `.editorconfig`, no Biome/Rome).
- 2-space indentation is the dominant style in server files and CSS.
- HTML in `views/` uses 4-space indentation.
- Client JS files mix 4-space and 2-space blocks inconsistently — there is no enforced standard.
- Semicolons are used. Single quotes for strings on server; double quotes prevalent in client JS for HTML-adjacent strings (`"Good morning"`).

**Linting:**
- **No ESLint configuration present.** No `.eslintrc*`, no `eslint.config.*`, no lint script in `package.json`. Linting is not enforced.

## Import Organization

**Server file order** (observed in `routes/index.js`, `index.js`):
1. Node built-ins: `path`, `crypto`
2. Third-party npm: `express`, `bcrypt`, `sequelize`, `multer`, `cloudinary`
3. Internal modules: `../utils/weatherService`, `../presenters/authPresenter`, `../middlewares/auth`, `../models`, `../services/*`

**Path style:** Relative paths only — no path aliases (`tsconfig` paths, `jsconfig` paths, or `~` imports) are configured. Use `require('../models')` style.

**Barrel export** at `models/index.js` re-exports all models and the `sequelize` instance — import models from there: `const { User, FarmPlot } = require('../models');`

## Async & Error Handling

**Server route handlers** follow a strict template (every async route in `routes/index.js`):
```javascript
router.post('/api/...', requireAuth, async (req, res) => {
  try {
    // validate inputs first → return res.status(400).json({ error: '...' })
    // perform work
    // res.json(...) or res.status(201).json(...)
  } catch (err) {
    console.error('API Error <VERB> /api/...:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
```
- Input validation happens first and returns early with `400` and `{ error: '...' }`.
- Not-found returns `404` with `{ error: '<Entity> not found' }`.
- All exceptions are caught and logged via `console.error('API Error <route>:', err)` then returned as `500` with generic `'Internal Server Error'` (specific message withheld from client).
- External API failures (weather proxy) use `503` with `{ error, message: err.message, fallback: true }` — see `routes/index.js` lines ~626-655.
- Non-critical external calls (email, weather in advisor context) are wrapped in their own try/catch and logged with `console.warn('⚠️ ...')` so they don't fail the parent request.

**External service lazy-loading** (top of `routes/index.js`):
```javascript
let irrigationService;
try { irrigationService = require('../services/irrigationService'); }
catch(e) { console.warn('irrigationService not loaded:', e.message); }
```
Routes then guard with `if (!irrigationService) return res.status(503).json({ error: '... service not available' });`. **Follow this pattern when adding optional services.**

**Client-side fetch pattern** (from `public/js/farmer-dashboard.js`):
```javascript
async function loadFarmerData() {
  try {
    const response = await fetch('/api/farmer/data');
    const data = await response.json();
    // render
  } catch (err) {
    console.error('loadFarmerData failed:', err);
  }
}
```
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
  ```javascript
  // ==========================================
  // 🔑 AUTH ROUTES (public)
  // ==========================================
  ```
  Sections: AUTH ROUTES, FARMER PAGE ROUTES, ADMIN PAGE ROUTES, AGRICULTURIST & FARMER REST API ROUTES, SOIL PROFILE MANAGEMENT, OPENWEATHER API PROXY ROUTES, IOT WEATHER STATION ROUTES, AGRICULTURAL ADVISOR API ROUTES, PROFILE UPDATE ROUTES, ADMIN REST API ROUTES. Group new routes under the matching banner or add a new one in the same style.
- `utils/weatherService.js` uses decorative box dividers (`───`) between sections.
- Inline `// comments` explain non-obvious business logic (e.g. `// Effective rainfall today (80% of actual rain above 5mm...)` in `irrigationService.js`).
- Client JS uses `// Sidebar / Common` category comments to organize translation dictionaries.

## Logging

**Framework:** raw `console.log` / `console.error` / `console.warn`. HTTP requests logged via `morgan('dev')` middleware in `index.js`. No structured logger (winston/pino) is configured.

**Conventions:**
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

---

*Convention analysis: 2026-07-22*