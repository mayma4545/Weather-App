# External Integrations

**Analysis Date:** 2026-07-22

## APIs & External Services

**Weather Data — OpenWeather API:**
- Purpose: Current weather + 5-day/3-hour forecast for farm-plot locations; powers all agricultural advisors (irrigation, disease, fertilizer, GDD, typhoon)
- Base URL: `https://api.openweathermap.org/data/2.5` (`utils/weatherService.js` line 10)
- Endpoints used: `/weather` (current) and `/forecast` (`utils/weatherService.js` lines 53, 113)
- Client: Native Node `fetch` (no SDK) — returns normalized JSON
- Auth: `OPENWEATHER_API_KEY` query param `appid` (`utils/weatherService.js` lines 48-53)
- Caching: In-memory 10-minute TTL keyed by `current_<lat>_<lon>` and `forecast_<lat>_<lon>` (`utils/weatherService.js` lines 19-32, 24)
- Defaults: Masbate City lat `12.3703` / lon `123.6217` (`WEATHER_LAT`/`WEATHER_LON` env vars, line 13-14)
- Aggregation: 3-hour forecast intervals bucketed into daily summaries (max/min temp, avg humidity/wind, total rain, dominant condition) — lines 124-190
- Server-side proxy routes: `/api/weather/current`, `/api/weather/forecast`, `/api/weather/risks`, `/api/weather/log`, `/api/weather/history` (`routes/index.js` lines 626-707). Keys never exposed to browser.
- CSP whitelist: `connectSrc` and `imgSrc` include `https://api.openweathermap.org` and `https://openweathermap.org` (`index.js` lines 19-20)

**Satellite / NDVI — Agromonitoring API:**
- Purpose: NDVI satellite imagery & vegetation health stats for Mandaon Agricultural Zone (Masbate)
- Base URL: `http://api.agromonitoring.com/agro/1.0` (`services/satelliteService.js` line 1)
- Endpoints used: `/polygons` (list/create), `/image/search`, plus NDVI/stats URLs returned by search
- Client: Native `fetch` (no SDK)
- Auth: `AGROMONITORING_API_KEY` query param `appid` (`services/satelliteService.js` lines 34, 75)
- Polygon: Hardcoded `MANDAON_POLYGON` GeoJSON shape (lines 3-25); `getOrCreatePolygon()` caches ID in module variable and parses it from error text on duplicate-create (lines 61-64)
- Helpers exported: `getOrCreatePolygon`, `searchImages`, `fetchImageBuffer`, `fetchStats`, `assessVegetationHealth` (NDVI mean thresholds → HEALTHY/MODERATE/STRESSED/DAMAGED/NO_VEGETATION)
- Note: HTTP (not HTTPS) base URL — CSP also whitelists `https://api.agromonitoring.com` (`index.js` line 20)
- Note: `satelliteService` is loaded defensively in `routes/index.js` line 20 inside try/catch; routes consuming it should check service availability before use

**File/Image Hosting — Cloudinary:**
- Purpose: Host crop repository images uploaded by admins
- SDK: `cloudinary` npm package, configured inline in `routes/index.js` lines 26-30
- Auth: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (hardcoded fallback defaults present on lines 27-29 — security concern, belongs in CONCERNS.md)
- Upload flow: `multer.memoryStorage()` → `uploadToCloudinary()` (`routes/index.js` lines 33-57) uploads buffer via `cloudinary.uploader.upload_stream` to folder `weather_crops`
- Routes: `POST /api/admin/crops/upload-image`, `POST /api/admin/crops`, `PUT /api/admin/crops/:id` (lines 1269, 1282, 1324)
- Limits: `MAX_FILE_SIZE` env (default 10 MB), `ALLOWED_IMAGE_TYPES` env (default `jpeg,jpg,png,gif,webp`)

**Transactional Email — Gmail SMTP via Nodemailer:**
- Purpose: OTP verification codes at registration, welcome emails after successful OTP verify
- Implementation: `services/emailService.js` — single `sendEmail({ to, subject, text, html, attachments })` exported function
- Transport: `nodemailer.createTransport({ service: 'gmail', auth: { user, pass } })` (lines 15-21)
- Auth: `EMAIL_USER`, `EMAIL_PASS` (Gmail app password). Falls back to warning + logs OTP to console when unset (`emailService.js` lines 11-13, `routes/index.js` lines 147-149)
- Callers: registration OTP send (`routes/index.js` line 140), post-verify welcome email (line 241)
- Fail-soft: Email send errors are caught and logged, never block auth flow

## Data Storage

**Databases:**
- **Development:** SQLite
  - File: `<repo>/database.sqlite` (committed fixture file at repo root) — path via `DB_FILE` env (`config/database.js` line 55)
  - Client: `sequelize` with `dialect: 'sqlite'`, SQL logging on
- **Production:** MySQL (Aiven.io managed)
  - Connection: `PROD_DATABASE_URL` (preferred) OR individual `PROD_DB_NAME`/`PROD_DB_USER`/`PROD_DB_PASSWORD`/`PROD_DB_HOST`/`PROD_DB_PORT`
  - Client: `sequelize` with `dialect: 'mysql'`, SSL required (`rejectUnauthorized: false`), `supportBigNumbers` enabled (`config/database.js` lines 17-49)
  - Logging off in prod
- Selection: `NODE_ENV=production` OR `DB_ENV=production` toggles MySQL (`config/database.js` line 7)

**Schema lifecycle:**
- Auto-sync at boot via `sequelize.sync({ alter: true })` in `index.js` lines 58-64
- Explicit migration tool `scripts/migrate.js` (`npm run migrate:dev`/`migrate:prod`); supports `--force` for destructive reset
- No migration versioning system (no `umzug`/ sequelize-cli migrations folder)

**File Storage:**
- Crop images → Cloudinary (see above)
- Static frontend assets → local filesystem via `express.static('public')` (`index.js` line 42)
- No local file upload persistence (multer uses memory storage, hands buffer to Cloudinary)

**Caching:**
- In-memory only: OpenWeather 10-min TTL cache in `utils/weatherService.js`; Agromonitoring polygon ID cached in module variable (`satelliteService.js` line 27)
- No Redis / Memcached
- Sessions: `express-session` default `MemoryStore` (not production-safe for multi-instance)

## Authentication & Identity

**Auth Provider:**
- Custom (no OAuth/OIDC, no Passport.js)
- Implementation:
  - Registration: email + password → bcrypt hash (cost 10) → OTP (6-digit `crypto.randomInt`) stored in `Otp` table with `user_data` JSON, 10-min expiry, 3-attempt lockout (`routes/index.js` lines 74-156, 163-256)
  - OTP delivered via Gmail SMTP (see Transactional Email)
  - Login: bcrypt.compare against `User.password_hash`; on success set `req.session.{userId,userRole,userFullName,userEmail}` (`routes/index.js` lines 258-286)
  - Logout: `req.session.destroy()` + redirect (`routes/index.js` lines 289-293)
- Middleware: `middlewares/auth.js` exports `requireAuth` (redirect or 401 for `/api/*`) and `requireAdmin` (redirect to `/farmer/dashboard` or 403 for `/api/*`)
- Roles: `Admin`, `Agriculturist` enforced via `User.role` `isIn` validation (`models/User.js` lines 15-21)
- Session: `express-session` cookie, `httpOnly: true`, `secure: false` (NOT production-safe; comment says set true with HTTPS), 24h maxAge, secret from `SESSION_SECRET` with hardcoded dev fallback (`index.js` lines 30-39)
- Password rules: ≥8 chars + uppercase + lowercase + digit (`routes/index.js` line 92)

## Monitoring & Observability

**Error Tracking:**
- None (no Sentry, no Bugsnag). Errors caught and `console.error`/`console.warn` only.

**Logs:**
- `morgan` HTTP logs in `dev` format to stdout (`index.js` line 27)
- Sequelize SQL logging to console in dev, off in prod (`config/database.js` lines 61, 19/40)
- Application-level `console.log`/`console.error`/`console.warn` throughout `routes/index.js` and services
- No structured logging (no `pino`, `winston`, JSON logs)

**Health/Uptime:**
- No dedicated `/health` endpoint. `/api/admin/stats` performs a live OpenWeather API ping as a side-effect API health check (`routes/index.js` lines 1194-1206).

## CI/CD & Deployment

**Hosting:**
- Render (URL `weather-app-rr5y.onrender.com` hard-coded in registration welcome email, `routes/index.js` line 214)
- Implied `npm start` → `node index.js` as web command

**CI Pipeline:**
- None detected — no `.github/workflows/`, no `render.yaml`, no `.gitlab-ci.yml`, no `Dockerfile`. Deployment configuration assumed to live in the Render dashboard.

## Environment Configuration

**Required env vars (production):**
- `OPENWEATHER_API_KEY` — weather data
- `AGROMONITORING_API_KEY` — satellite NDVI
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — image hosting (NOTE: hardcoded fallback present; should be removed)
- `EMAIL_USER`, `EMAIL_PASS` — Gmail SMTP for OTP/welcome emails
- `SESSION_SECRET` — session signing (hardcoded dev fallback present)
- `PROD_DATABASE_URL` (preferred) OR `PROD_DB_NAME`, `PROD_DB_USER`, `PROD_DB_PASSWORD`, `PROD_DB_HOST`, `PROD_DB_PORT`
- `NODE_ENV=production` (or `DB_ENV=production`) — toggles MySQL connection + disables SQL logging

**Optional env vars:**
- `PORT` (default 4000)
- `WEATHER_LAT`, `WEATHER_LON` (default Masbate City)
- `DB_FILE` (default `database.sqlite`)
- `MAX_FILE_SIZE` (default 10485760 bytes)
- `ALLOWED_IMAGE_TYPES` (default `jpeg,jpg,png,gif,webp`)

**Secrets location:**
- `.env` file at repo root (existence confirmed; contents not inspected). Listed in `.gitignore` (per repo conventions; verify before commit).
- Several credentials duplicated as hardcoded fallbacks in `routes/index.js` (Cloudinary) and a dev fallback for `SESSION_SECRET` in `index.js` — recommend removal.

## Webhooks & Callbacks

**Incoming:**
- `POST /api/weather/station/reading` — IoT weather station sensor push (`routes/index.js` lines 749-780). Authenticates by `device_id` existing in `StationDevice` table (no token/Bearer; any caller knowing a `device_id` can post).
- `POST /api/weather/stations` — station device registration (requires `requireAuth` session).

**Outgoing:**
- None (no outbound webhooks to third-party systems). All external calls are HTTP request/response to OpenWeather, Agromonitoring, Cloudinary, Gmail SMTP.

## Cross-Service Data Flow Summary

1. Client (browser, vanilla JS) calls `/api/weather/*` and `/api/advisor/*` on this server.
2. Server proxies to OpenWeather (`utils/weatherService.js`), merges with DB context from Sequelize models (`getPlotContext` helper in `routes/index.js` lines 787-816), runs pure-JS advisor services in `services/*`, returns aggregated JSON.
3. Advisors (`irrigationService`, `diseaseRiskService`, `fertilizerService`, `gddService`, `typhoonAlertService`, `todoService`) are domain logic only — NO external API calls themselves; they depend on weather data passed in from `weatherService`.
4. `satelliteService.js` is the only other external API caller (Agromonitoring); loaded defensively and currently not referenced by any route in `routes/index.js` (grep shows no `satelliteService.` calls in the route file — verify usage gap).
5. Cloudinary + nodemailer interact only on admin crop-create/update and registration/OTP-verify paths.

---

*Integration audit: 2026-07-22*