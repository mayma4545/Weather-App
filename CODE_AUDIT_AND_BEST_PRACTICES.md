# Codebase Security, "AI Slop", & Architecture Audit Report

> **Scope:** Full-stack audit of **Project Weather (AGRIDEB)** (`index.js`, `config/`, `middlewares/`, `models/`, `routes/`, `services/`, `utils/`, `scripts/`, `public/`, and `views/`).
> **Objective:** Identify security vulnerabilities, AI-generated anti-patterns ("AI slop"), architectural debt, and actionable best practices to harden and refactor the web application.

---

## 1. Critical & High-Severity Security Vulnerabilities

### 1.1 Broken Object Level Authorization (BOLA / IDOR)
Several authenticated API endpoints check that a user is logged in (`requireAuth`), but **never verify that the target resource belongs to `req.session.userId`**. Any logged-in user can read, modify, harvest, or delete another farmer's data by guessing or incrementing integer IDs:

| Endpoint | Location | Vulnerability Details |
| :--- | :--- | :--- |
| `POST /api/planting-records` | `routes/index.js:524-565` | Accepts `plot_id` from `req.body` without verifying `plot.user_id === req.session.userId`. Marks any existing crop on that plot as `'Harvested'` and creates a record on another farmer's plot. |
| `PUT /api/planting-records/:id` | `routes/index.js:568-598` | Looks up `PlantingRecord.findByPk(id)` without checking ownership of the parent `FarmPlot`. Can also reassign `plot_id` to any plot. |
| `PUT` & `PATCH /api/planting-records/:id/health` | `routes/index.js:601-661` | Modifies `health_status` of any planting record ID without checking plot ownership. |
| `DELETE /api/planting-records/:id` | `routes/index.js:664-678` | Deletes any planting record in the database by ID without verifying ownership. |
| `POST /api/planting-records/:id/harvest` | `routes/index.js:681-704` | Archives/harvests any farmer's active crop by ID without verifying ownership. |
| `GET` & `POST /api/plots/:id/soil` | `routes/index.js:767-811` | Reads or overwrites soil test profiles and `plot.soil_type` for any `plot_id` without checking `plot.user_id === req.session.userId`. |
| `GET /api/advisor/*` (`irrigation`, `disease-risk`, `fertilizer`, `gdd`, `dashboard`) | `routes/index.js:1145-1403` | Helper `getPlotContext(plotId)` fetches `FarmPlot.findByPk(plotId)` without scoping to `req.session.userId`. (Only `/api/todo` at line 1416 checks `plot.user_id !== userId`). |

### 1.2 Broken Function Level Authorization (Privilege Escalation)
- **Unprotected Crop Creation (`POST /api/crops`)**: In `routes/index.js:741-760`, the route `POST /api/crops` is marked with `// 7. Create a new CropRepository variety (legacy farmer route)` and only uses `requireAuth` instead of `requireAdmin`. Any regular farmer account can inject arbitrary global crop varieties into `CropRepository`, affecting all users and admin views.

### 1.3 Unauthenticated Endpoints, Quota Exhaustion & Cache Poisoning
- **Unauthenticated IoT Sensor Ingestion (`POST /api/weather/station/reading`)**: In `routes/index.js:1107-1138`, there is no authentication, device secret token, or HMAC signature check. Anyone who knows or guesses a `device_id` can inject fake weather telemetry into `WeatherLog`.
- **Unauthenticated Weather Logging (`POST /api/weather/log` & `GET /api/weather/history`)**: In `routes/index.js:1032-1065`, anyone on the internet can trigger `POST /api/weather/log` to spam `WeatherLog` rows and drain the OpenWeather API quota.
- **Unauthenticated OpenWeather Proxy & Unbounded Cache (`GET /api/weather/current`, `/forecast`, `/risks`)**:
  - `routes/index.js:818-863` exposes weather proxy routes without `requireAuth` and accepts arbitrary `lat` and `lon` query parameters.
  - In `utils/weatherService.js:19-32`, every unique `lat`/`lon` pair creates a new key (`cache['current_' + lat + '_' + lon]`) in an in-memory object that **never evicts expired keys**. An attacker can send requests with random `lat`/`lon` values to exhaust both the `OPENWEATHER_API_KEY` quota and Node.js heap memory (Denial of Service).

### 1.4 Cross-Site Scripting (XSS) & HTML Injection
- **DOM-Based / Stored XSS via Unescaped `innerHTML`**:
  - `public/js/farmer-dashboard.js:1708-1744`: Injects `c.plot`, `c.crop`, `c.damage`, and `advice` (`crop.best_practices`) directly into `statusHtml` and `gridHtml` via `innerHTML` without calling `escapeHtml()`.
  - `public/js/admin-dashboard.js:339`: Renders `<img src="${c.image_url}" alt="${esc(c.crop_name)}">` without escaping `c.image_url`. Since `POST /api/admin/crops` (`routes/index.js:1709`) accepts `req.body.image_url` as a raw string, a malicious URL payload (`" onerror="...`) triggers XSS.
  - `public/js/admin-dashboard.js:1290`: Injects `data.name` and `data.email` directly into `loadingStatus.innerHTML` during alert broadcasts.
- **HTML Email Injection**:
  - `routes/index.js:1998, 2007, 2016` and `services/notificationService.js:81-83, 188` interpolate `user.full_name`, `message`, `crop.crop_name`, and `crop.vulnerabilities` directly into HTML email templates without escaping HTML entities.
- **Regex HTML Sanitizer Anti-Pattern**:
  - `routes/index.js:70-73` defines `sanitizeInput(str)` using `.replace(/<[^>]*>?/gm, '')`. Regex tag stripping is bypassable (e.g., unclosed tags, attribute contexts) and is not even applied to most routes (`/api/farmer/profile`, `/api/plots`, `/api/crops`, `/api/admin/alerts`).

### 1.5 Authentication, Session Management & OTP Flaws
- **Hardcoded Fallback Session Secret**: `index.js:32` uses `secret: process.env.SESSION_SECRET || 'project-weather-secret-key-dev-2026'`. If `SESSION_SECRET` is omitted in production, anyone can forge signed `connect.sid` session cookies.
- **Insecure Session Cookies & Missing CSRF Protection**:
  - `index.js:35-39` hardcodes `cookie: { secure: false, httpOnly: true }` even in production and omits `sameSite: 'lax'` or `'strict'`.
  - No CSRF tokens are used on state-changing `POST`/`PUT`/`DELETE` endpoints, and `/logout` (`routes/index.js:416`) is a `GET` route (allowing `<img src="/logout">` forced-logout attacks).
- **In-Memory Session Store in Production**: `express-session` uses the default `MemoryStore` (`index.js:31`), which leaks memory under load and logs out all users whenever the server restarts.
- **Session Fixation**: `routes/index.js:395-400` mutates `req.session` on login without calling `req.session.regenerate()` first.
- **OTP Purpose Confusion (`/verify-otp` vs `/password-reset`)**:
  - Both registration and password reset store codes in the `Otp` table keyed only by `email` (`routes/index.js:111, 185`).
  - While `/password-reset/verify` checks `data.purpose === 'password_reset'`, `/verify-otp` (`routes/index.js:290-339`) **never checks `userData.purpose`**. Submitting a valid password-reset OTP to `/verify-otp` will attempt to create a new user with `undefined` fields or corrupt registration state.
- **Plaintext OTP Logged to Console**: `routes/index.js:151` logs `🔑 LOCAL/DEBUG OTP CODE FOR ${email}: ${otp_code}` whenever SMTP fails, leaking live OTPs into cloud stdout logs.
- **Missing Rate Limiting**: No rate limiter (`express-rate-limit`) exists on `/login`, `/register`, `/verify-otp`, `/password-reset/*`, or `/api/weather/predict-planting`.

### 1.6 Transport Security, CORS, CSP & File Upload Flaws
- **Disabled SSL Verification on Production Database (`rejectUnauthorized: false`)**: `config/database.js:23, 44` sets `ssl: { require: true, rejectUnauthorized: false }` for production MySQL connections, making the database connection vulnerable to Man-in-the-Middle (MitM) attacks.
- **Weak Content Security Policy (CSP)**: `index.js:17-20` configures Helmet with `scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"]` and `imgSrc: ["'self'", "data:", "blob:", "https://*"]`, which disables CSP's primary defense against XSS.
- **Wildcard CORS**: `index.js:25` calls `app.use(cors())` with default wildcard (`*`) origin access.
- **Plaintext HTTP & API Key in URL (`satelliteService.js`)**: `services/satelliteService.js:1` uses `http://api.agromonitoring.com/agro/1.0` (unencrypted HTTP) and passes `appid=${appId}` in the query string, exposing the API key in transit.
- **Fake MIME-Type Validation on Uploads**: `routes/index.js:46-52` checks `req.file.mimetype` (which is controlled by the client HTTP header) rather than inspecting the file buffer's magic bytes.

---

## 2. "AI Slop", Hallucinations & Bad Coding Practices

### 2.1 Broken Storm Alert Deduplication (Logic Hallucination)
In `services/notificationScheduler.js:80-106`, the cron job runs every 5 minutes:
```js
const result = await checkAndSendStormAlerts(); // <-- Sends emails & SMS to ALL farmers immediately!
...
if (currentRisk !== 'NONE' && result.usersNotified > 0) {
  const isEscalation = currentSeverity > lastSeverity;
  const cooldownExpired = timeSinceLastAlert >= STORM_ALERT_COOLDOWN_MS;
  if (isEscalation || cooldownExpired) {
    lastStormRiskLevel = currentRisk;
    lastStormAlertTimestamp = Date.now();
  } else {
    console.log(`🌀 [Scheduler] Storm risk (${currentRisk}) unchanged. Cooldown active — skipping.`);
  }
}
```
**Why this is AI slop:** The cooldown and escalation check is placed **after** `await checkAndSendStormAlerts()` has already executed and sent emails/SMS to every farmer in the database. As a result, during a storm, farmers are spammed with duplicate emails and SMS messages **every 5 minutes**, while the console falsely logs `"Cooldown active — skipping"`.

### 2.2 Misleading Names, Hallucinated Comments & Contradictory Logs
- **`services/geminiService.js` is not Gemini**: The file is named `geminiService.js`, its JSDoc claims `@returns {string|null} API key from GOOGLE_AI_API_KEY or GEMINI_API_KEY` (`line 32`) and `Call Gemini generateContent` (`line 357`), and `routes/index.js:1004` sets `recommendations_source = 'gemini'`. In reality, the file calls `https://opencode.ai/zen/v1/chat/completions` using `OPENCODE_API_KEY` and `deepseek-v4-flash-free`.
- **Contradictory Startup Log (`index.js:59-61`)**:
  ```js
  sequelize.sync({ alter: false })
    .then(() => {
      console.log('✅ Database schema synchronized non-destructively (alter: true)');
  ```
  The log message explicitly claims `(alter: true)` right after calling `sync({ alter: false })`.
- **Starting the Server When DB Sync Fails (`index.js:69-74`)**: In the `.catch()` block of `sequelize.sync()`, the app logs the error and calls `app.listen(PORT)` anyway (`without DB sync`), serving a broken app that throws 500 errors on every request instead of exiting with a non-zero status code.
- **No-Op Function Left in Production Path (`routes/index.js:882-890`)**: `localizeStaticRecommendations(evaluation, language)` contains only a 7-line comment explaining why it was gutted and `return;`, yet it is still called on line 980.
- **Copy-Pasted Duplicate Route Handlers (`routes/index.js:601-661`)**: `router.put('/api/planting-records/:id/health', ...)` and `router.patch('/api/planting-records/:id/health', ...)` contain 30 lines of 100% identical copy-pasted code instead of sharing a handler function or using `router.route()`.
- **Swallowed Module Load Errors (`routes/index.js:12-22`)**: Nine services are loaded via `try { ... = require(...) } catch(e) { console.warn(...) }` with the comment `// Lazy-load agricultural services (created after routes file)`. This is a leftover from multi-step AI code generation and masks syntax/import errors at startup.
- **Guessing Auth Headers in `smsService.js` (`services/smsService.js:28-31`)**: Sends the API key in *both* `headers['x-api-key']` and `headers['Authorization'] = 'Bearer ...'` simultaneously, while sending SMS content via a `GET` query string.

### 2.3 Monolithic "God Files" & Abandoned Architecture
- **2,356-Line Router (`routes/index.js`)**: All routes, validation, database queries, HTML email templates, Cloudinary stream uploads, and AI prompt orchestration are crammed into a single file.
- **Abandoned Presenter Pattern (`presenters/`)**: `presenters/authPresenter.js` (15 lines) and `presenters/dashboardPresenter.js` (10 lines) were created to follow an MVP architecture, but `dashboardPresenter.js` isn't even imported in `routes/index.js`, and all subsequent routes were dumped directly into `routes/index.js`.
- **6,800+ Lines of Duplicated Frontend JS (`public/js/farmer-dashboard.js` & `public/js/new-farmer-dashboard.js`)**:
  - `farmer-dashboard.js` (4,090 lines) and `new-farmer-dashboard.js` (2,715 lines) duplicate nearly the entire client application, including 400+ lines of hardcoded translation dictionaries and duplicated agronomic scoring logic (`computePlotHealth`, `computeLocalSafety`) that already exists on the backend (`plantingPredictorService.js`, `gddService.js`).
- **DOM TreeWalker Translation Hack (`farmer-dashboard.js:390-452`)**: Instead of using `data-i18n` keys, `applyTranslations()` walks every text node in `document.body` and runs `.replaceAll(engKey, langVal)` on substrings (`"Heat"`, `"Rain"`, `"Plot"`, `"Wind"`), which is slow and prone to corrupting dynamic text.

### 2.4 Severe Performance Anti-Patterns
- **GET Request Performing External API Calls + DB Writes Polled Every 5 Seconds**:
  - `public/js/admin-dashboard.js:258-262` polls `GET /api/admin/stats` every **5 seconds** (`setInterval(..., 5000)`).
  - Inside `GET /api/admin/stats` (`routes/index.js:1614-1670`), the server pings `weatherService.fetchCurrentWeather()` and, if no log exists in the last hour, **executes `WeatherLog.create()` inside a `GET` handler** (violating HTTP idempotency and doing redundant work every 5 seconds).
- **In-Memory Table Scan & $O(N^2)$ Grouping for Pagination (`routes/index.js:2099-2159`)**:
  - `GET /api/admin/alerts` fetches **all** `Admin Broadcast` rows from the `alerts` table into Node.js memory, runs a nested `alerts.filter(...)` inside a `for (const alert of alerts)` loop ($O(N^2)$ time complexity), filters by search string in JavaScript, and slices the array in memory instead of using SQL `GROUP BY`, `WHERE`, `LIMIT`, and `OFFSET`.
- **Sequential N+1 Queries & Unbounded Concurrency**:
  - `GET /api/todo` (`routes/index.js:1427-1476`) awaits `getPlotContext(plot.plot_id)` sequentially inside a `for...of` loop.
  - `POST /api/admin/alerts` (`routes/index.js:1947-1976`) inserts `Alert` rows one by one in a `for...of` loop instead of `Alert.bulkCreate()`, then fires `Promise.all(emailPromises)` for all farmers at once without concurrency throttling (which will hit SMTP rate limits as user count grows).
  - `GET /api/satellite/imagery` (`routes/index.js:2244-2269`) fetches NDVI stats sequentially in a `for` loop instead of `Promise.all()`.

### 2.5 Hardcoded Environments, Weak Seeds & Repository Clutter
- **Conflicting Hardcoded URLs in Emails**:
  - `routes/index.js:341` hardcodes `https://weather-app-rr5y.onrender.com/login` in the welcome email.
  - `routes/index.js:2028` hardcodes `http://localhost:4000/` in the admin advisory email.
- **Hardcoded Weak Admin Passwords**: `scripts/reset-admin.js:10` and `scripts/seed.js:23` hardcode `'password123'` for `admin@debesmscat.edu.ph`.
- **Silent Schema Mutations & Delimited Strings in DB**: `scripts/seed.js:14-21` runs raw `ALTER TABLE` queries inside empty `catch (e) {}` blocks, and stores multi-stage data as `'Seedling 25d||Tillering 35d||...'` instead of JSON or a normalized table.
- **Committed Artifacts & Unused Dependencies**:
  - `cookies.txt` (contains a captured `connect.sid` session cookie), `nul` (Windows reserved filename), `fix-html-structure.js`, `fix-tail.js`, `_theming.ps1`, and `scratch/test_predictor.js` are sitting in the repository.
  - `package.json` includes `"resend": "^6.22.0"` which is never used anywhere, and `"test"` is still set to `"echo \"Error: no test specified\" && exit 1"` despite `tests/notification.test.js` existing.

---

## 3. Best Practices & Remediation Guide for This Webapp

### 3.1 Authorization & Access Control Best Practices
1. **Enforce Ownership Scoping on Every Query (Prevent BOLA/IDOR)**:
   - Never use `Model.findByPk(id)` alone for user-owned resources. Always scope queries to `req.session.userId`:
     ```js
     // For FarmPlot:
     const plot = await FarmPlot.findOne({
       where: { plot_id: req.params.id, user_id: req.session.userId }
     });
     if (!plot) return res.status(404).json({ error: 'Plot not found' });

     // For PlantingRecord (verify via associated FarmPlot):
     const record = await PlantingRecord.findOne({
       where: { record_id: req.params.id },
       include: [{ model: FarmPlot, as: 'plot', where: { user_id: req.session.userId }, required: true }]
     });
     if (!record) return res.status(404).json({ error: 'Planting record not found' });
     ```
2. **Enforce Role Guards Consistently**:
   - Remove or add `requireAdmin` to `POST /api/crops` (`routes/index.js:741`).
   - Require `requireAuth` on `/api/weather/current`, `/api/weather/forecast`, `/api/weather/risks`, `/api/weather/log`, and `/api/weather/history`.
3. **Authenticate IoT Weather Stations**:
   - Add an `api_key_hash` column to `StationDevice`. Require stations calling `POST /api/weather/station/reading` to pass an `X-Station-Key` header and validate it against the registered device before logging readings.

### 3.2 Authentication, Session & Input Security Best Practices
1. **Harden `express-session` Configuration**:
   - Fail fast at startup if ` process.env.SESSION_SECRET` is missing in production.
   - Use a persistent session store (`connect-session-sequelize`) instead of `MemoryStore`.
   - Set `app.set('trust proxy', 1)` (for Render/reverse proxies) and configure cookies securely:
     ```js
     cookie: {
       secure: process.env.NODE_ENV === 'production',
       httpOnly: true,
       sameSite: 'lax',
       maxAge: 24 * 60 * 60 * 1000
     }
     ```
   - Call `req.session.regenerate()` before assigning `req.session.userId` on login, and change `/logout` from `GET` to `POST`.
2. **Fix OTP Storage & Rate Limiting**:
   - Add an explicit `purpose` column (`'registration' | 'password_reset'`) to the `Otp` model and filter by `where: { email, purpose: 'registration' }` in `/verify-otp`.
   - Hash OTP codes (or use constant-time comparison `crypto.timingSafeEqual`) and **never** log OTPs to `console.log` when `NODE_ENV === 'production'`.
   - Add `express-rate-limit` to `/login`, `/register`, `/verify-otp`, `/password-reset/*`, and AI endpoints.
3. **Eliminate XSS & Validate Schema Inputs**:
   - Replace regex `sanitizeInput` with schema validation using **Zod**, **Joi**, or **express-validator**.
   - On the frontend, prefer `textContent` over `innerHTML`. Whenever HTML templates are built, pass **all** dynamic fields (`c.plot`, `c.crop`, `c.image_url`, `data.name`, `data.email`) through `escapeHtml()` / `escapeAttr()`.
   - Escape all user-supplied strings (`user.full_name`, `message`, `crop_name`) before interpolating into Nodemailer HTML templates.
   - Validate uploaded images using magic bytes (`file-type` package) and validate `image_url` to allow only `https://res.cloudinary.com/...` URLs.

### 3.3 Infrastructure, TLS & External API Best Practices
1. **Enforce TLS Certificate Verification on MySQL**:
   - In `config/database.js`, change `rejectUnauthorized: false` to `rejectUnauthorized: true` and provide the Aiven CA certificate via `process.env.DB_SSL_CA` (matching `scripts/migrate-data.js`).
2. **Tighten Helmet CSP & CORS**:
   - Remove `'unsafe-eval'` and `'unsafe-inline'` from `scriptSrc` (move inline scripts in `views/*.html` to external `.js` files in `public/js/`), and restrict `imgSrc` to specific trusted domains (`'self'`, `data:`, `https://res.cloudinary.com`, `https://openweathermap.org`, `https://*.tile.openstreetmap.org`, `https://server.arcgisonline.com`).
   - Restrict `cors({ origin: process.env.APP_BASE_URL })` instead of wildcard `cors()`.
3. **Use HTTPS & Bounded Caching for External Services**:
   - Change `http://api.agromonitoring.com` to `https://api.agromonitoring.com` in `services/satelliteService.js`.
   - Bound the weather cache in `utils/weatherService.js` (e.g., using `lru-cache` with a `max: 100` entry cap and coordinate rounding to 2 decimal places) so arbitrary coordinates cannot exhaust memory.
   - Centralize `APP_BASE_URL` in `.env` and replace hardcoded `http://localhost:4000/` and `https://weather-app-rr5y.onrender.com` links.

### 3.4 Architecture, Code Structure & Performance Best Practices
1. **Split `routes/index.js` into Modular Domain Routers & Controllers**:
   - Break the 2,356-line `routes/index.js` into focused routers:
     - `routes/auth.routes.js` (`/login`, `/register`, `/verify-otp`, `/password-reset/*`, `/logout`)
     - `routes/farmer.routes.js` (`/api/farmer/*`, `/api/plots/*`, `/api/planting-records/*`, `/api/todo`)
     - `routes/advisor.routes.js` (`/api/advisor/*`, `/api/weather/predict-planting`)
     - `routes/weather.routes.js` (`/api/weather/*`, `/api/satellite/*`)
     - `routes/admin.routes.js` (`/api/admin/*`)
     - `routes/pages.routes.js` (HTML view serving)
2. **Fix the Storm Alert Scheduler Deduplication**:
   - In `services/notificationScheduler.js` and `services/notificationService.js`, evaluate `typhoonAlertService.assessTyphoonRisk(forecast.days)` and check the cooldown/escalation state **before** querying farmers and sending emails/SMS. Persist the last alert timestamp/severity in the database (or check recent `storm_alert` rows in `Alert`) so server restarts do not reset the cooldown.
3. **Move Database Aggregation & Pagination to SQL**:
   - In `GET /api/admin/alerts`, use SQL `GROUP BY`, `WHERE message LIKE ?`, `LIMIT`, and `OFFSET` (or add a `broadcast_batch_id` column to `Alert`) instead of loading the entire table into memory.
   - Use `Alert.bulkCreate()` when broadcasting alerts and use a concurrency limiter (e.g., `p-limit(5)` or a background job queue) when sending bulk emails.
   - Remove DB writes (`WeatherLog.create`) from `GET /api/admin/stats` (move periodic weather logging into `notificationScheduler.js`) and increase admin dashboard polling from `5000ms` to `30000ms`–`60000ms`.
4. **Consolidate & Modularize Frontend Code**:
   - Delete the unused duplicate dashboard script (`new-farmer-dashboard.js` vs `farmer-dashboard.js`) and split the remaining 4,090-line file into ES modules (`api.js`, `i18n.js`, `weather-ui.js`, `crops-ui.js`, `predictor-ui.js`, `satellite-ui.js`).
   - Replace the DOM `TreeWalker` text-replacement hack with explicit `data-i18n="key"` attributes on HTML elements and JSON locale files (`/locales/en.json`, `/locales/fil.json`, `/locales/min.json`).
   - Remove duplicated agronomic scoring logic from the frontend and rely on the backend services (`plantingPredictorService.js`, `gddService.js`) as the single source of truth.
5. **Clean Up Repository & Tooling**:
   - Remove `cookies.txt`, `nul`, `fix-html-structure.js`, `fix-tail.js`, `_theming.ps1`, and `scratch/` from the workspace, and add `cookies.txt` and `scratch/` to `.gitignore`.
   - Rename `services/geminiService.js` to `services/aiRecommendationService.js` (or `opencodeService.js`) so the filename and JSDoc match the actual provider.
   - Replace Sequelize `.sync()` and ad-hoc `scripts/migrate-*.js` files with `sequelize-cli` / `umzug` migrations, and require `ADMIN_INITIAL_PASSWORD` from `.env` in `scripts/seed.js` and `scripts/reset-admin.js`.
