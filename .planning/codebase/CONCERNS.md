# Codebase Concerns

**Analysis Date:** 2026-07-22

Severity scale used below: **Critical / High / Medium / Low**.
All file paths are relative to repo root (`C:\Users\ferna\Desktop\WEATHER`).

---

## Tech Debt

### Hardcoded Production Cloudinary Credentials (Critical)

- Issue: Cloudinary secret is hardcoded as the OR-fallback when env vars are missing. If `.env` is absent or typo'd in any environment, the app silently authenticates with the committed production account instead of failing.
- Files: `routes/index.js:27-30`
  ```js
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dir9ljc5q',
    api_key:    process.env.CLOUDINARY_API_KEY     || '947544355558482',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'JmBJHjNTI7MJ597pr79X7xPZ9lE'
  });
  ```
- Impact: Anyone reading the repo (it appears to be a public/student project) gets full write access to the Cloudinary account, can upload/delete media, and consume the owner's bandwidth quota. Secret rotation is required.
- Fix approach: Remove all literal secrets; require env vars (`if (!process.env.CLOUDINARY_API_SECRET) throw …`); rotate the Cloudinary API key immediately; run `git filter-repo` to purge the historical secret (it currently lives in tracked file history).

### Committed Live Session Cookie (Critical)

- Issue: `cookies.txt` is a Netscape-format cookie dump containing a real `connect.sid` session token, and it is **tracked by git** (verified via `git ls-files`). It is NOT in `.gitignore`.
- Files: `cookies.txt` (committed), `.gitignore` (missing `cookies.txt`)
- Impact: Anyone with repo access can replay the session until it expires (maxAge 24h, value `s%3AH5EO6s41…`). If the session belonged to the Admin user, full admin compromise is possible.
- Fix approach: Add `cookies.txt` (and `*.txt` cookie variants) to `.gitignore`; `git rm --cached cookies.txt`; destroy/invalidate that session server-side; purge from history.

### Default / Hardcoded Session Signing Secret (High)

- Issue: `express-session` falls back to a static predictable secret if `SESSION_SECRET` env var is missing.
- Files: `index.js:31`
  ```js
  secret: process.env.SESSION_SECRET || 'project-weather-secret-key-dev-2026',
  ```
- Impact: If `SESSION_SECRET` is unset in production (_Render_ deployment, etc.), an attacker who knows this repo can forge valid session cookies and bypass authentication entirely, including forging `userRole: 'Admin'`.
- Fix approach: Fail to boot if `SESSION_SECRET` is missing in production; never hardcode a fallback secret; rotate the secret now since the fallback string is public.

### `sequelize.sync({ alter: true })` on Every Boot (High)

- Issue: Schema is auto-migrated at startup against the production MySQL DB on every server start.
- Files: `index.js:58`
- Impact: Auto-alter in production can rename/drop columns when model definitions drift, leading to irreversible data loss on Render redeploy. Migration tooling exists (`scripts/migrate.js`) but is bypassed.
- Fix approach: Remove `sync({ alter: true })` from `index.js` in production; gate behind `NODE_ENV !== 'production'`; rely on `npm run migrate:prod`; add `force: false` explicitly in dev.

### Production MySQL SSL Uses `rejectUnauthorized: false` (High)

- Issue: TLS verification is disabled for the Aiven MySQL connection in production.
- Files: `config/database.js:21-24`, `config/database.js:41-46`
  ```js
  ssl: { require: true, rejectUnauthorized: false }
  ```
- Impact: Vulnerable to man-in-the-middle interception of DB traffic and credentials; the `migrate-data.js` script correctly uses `rejectUnauthorized: true` with `DB_SSL_CA`, but the running app does not.
- Fix approach: Use `rejectUnauthorized: true` and provide `ca: process.env.DB_SSL_CA` (as `migrate-data.js` does) for the runtime connection.

---

## IDOR / Authorization Gaps (High)

### Missing Ownership Checks on Resource Mutations (High)

- Issue: Multiple mutating routes fetch a record by ID and modify/destroy it without verifying that the record belongs to the currently logged-in user. Any authenticated Agriculturist can edit/delete ANY other user's planting records, soil profiles, and submit readings for ANY station.
- Files: `routes/index.js`
  - `PUT /api/planting-records/:id` (line 440) — only checks existence, not `plot.user_id === req.session.userId`.
  - `DELETE /api/planting-records/:id` (line 472) — same.
  - `POST /api/planting-records/:id/harvest` (line 489) — same.
  - `POST /api/plots/:id/soil` (line 590) — modifies the plot and creates a SoilProfile without ownership check.
  - `GET /api/plots/:id/soil` (line 575) — leaks any plot's soil data by ID.
- Impact: Horizontal privilege escalation across all farmer accounts; data corruption, deletion, or theft.
- Fix approach: After `findByPk`, fetch the associated `FarmPlot` (via the `plot` association) and compare its `user_id` to `req.session.userId`; return 403 on mismatch. Wrap this in a helper (`assertOwnership(record, userId)`).

### Anonymous Sensor Reading Endpoint (High)

- Issue: `POST /api/weather/station/reading` has no `requireAuth` and only validates that `device_id` exists in the DB.
- Files: `routes/index.js:749-780`
- Impact: Anyone who can guess or enumerate `device_id` values can pollute the `WeatherLog` table with bogus readings, which then drive the irrigation/disease/fertilizer advisors. No API key is required for the device either.
- Fix approach: Require either a per-device secret token (header) or `requireAuth` plus ownership check (`station.owner_id === req.session.userId`).

### Public Unauthenticated GET Routes (Medium)

- Issue: Several read endpoints are intentionally public but expose potentially sensitive aggregate data.
- Files: `routes/index.js`
  - `GET /api/crops` (line 538)
  - `GET /api/trivia` (line 1753)
  - `GET /api/weather/current` (line 626), `/api/weather/forecast` (line 642), `/api/weather/risks` (line 658), `/api/weather/log` (line 674), `/api/weather/history` (line 696)
- Impact: Unauthenticated scraping of crop library, trivia, historical weather logs (including `station_id`s) and arbitrary writes to `WeatherLog` via `POST /api/weather/log`.
- Fix approach: Apply `requireAuth` to `/api/weather/log` (it is a write) at minimum; consider rate-limiting and auth for the read endpoints.

---

## Security Considerations

### Cookie `secure` Flag Hardcoded to False (High)

- Risk: Session cookies can be transmitted over plaintext HTTP, exposing them to network sniffing.
- Files: `index.js:34-35`
  ```js
  cookie: { secure: false, // set to true in production with HTTPS
            httpOnly: true, maxAge: 24*60*60*1000 }
  ```
- Current mitigation: `httpOnly: true` prevents JS access; `sameSite` is not set at all (defaults to `Lax` in modern browsers, but it's implicit).
- Recommendations: Bind `secure: process.env.NODE_ENV === 'production'` (Render terminates TLS); explicitly set `sameSite: 'lax'`; rotate `SESSION_SECRET`.

### Permissive Content Security Policy (Medium)

- Risk: `scriptSrc` includes `'unsafe-inline'` and `'unsafe-eval'`, neutralizing most XSS protection.
- Files: `index.js:13-21`
- Current mitigation: Heavy use of `innerHTML` in `public/js/*.js` (98 `innerHTML` occurrences across the dashboard bundles) is why these CSP exemptions exist.
- Recommendations: Replace inline `innerHTML` interpolation with `textContent`/DOM API where possible (an `escapeHtml` helper already exists in `farmer-dashboard.js:1658` and `new-farmer-dashboard.js:1730`, but is not used everywhere); tighten CSP progressively.

### Unescaped `innerHTML` of User-Controlled Data (Medium)

- Risk: Stored XSS via `full_name` / `email` rendered into `innerHTML` without escaping in the admin alert-stream viewer.
- Files: `public/js/admin-dashboard.js:1090`
  ```js
  loadingStatus.innerHTML = `Sending to: <strong>${data.name}</strong><br>…${data.email}…`;
  ```
- Current mitigation: `routes/index.js` `sanitizeInput()` strips HTML tags on registration (`routes/index.js:64-68`), so `<script>` tags survive removal — but quotes are not escaped, so attribute-breakout remains possible if surrounding tags change. Defense-in-depth is missing here.
- Recommendations: Use the existing `esc()` helper (`public/js/admin-dashboard.js:104`) on `data.name` and `data.email`.

### OTP Registration Bypass Leaks Codes to Console (Medium)

- Risk: When SMTP fails, the server logs the raw OTP code to stdout, and persists it in plaintext.
- Files: `routes/index.js:148` — `console.log('🔑 LOCAL/DEBUG OTP CODE FOR...')`; `routes/index.js:106-119` stores `otp_code` and full `user_data` (incl. `password_hash`) in the `Otp` row's `user_data` TEXT.
- Risk: Production logs on Render may expose OTPs and the `Otp.user_data` JSON holds a `password_hash` for the unverified user — anyone with DB read access gets pre-hashed credentials; log aggregators ingest the OTP.
- Recommendations: Gate the console log behind `NODE_ENV !== 'production'`; do not persist `password_hash` in transient `Otp.user_data` (hash only after verification, or sign/HMAC it).

### `req.body.password` Not Sanitized in Login (Low)

- Files: `routes/index.js:258-286`
- Risk: None directly (bcrypt handles arbitrary bytes), but the login flow accepts any malformed JSON shape and just redirects — no rate limiting / lockout. Brute-force is feasible.
- Recommendations: Add `express-rate-limit` middleware on `/login` and `/verify-otp`; track failed attempts per IP/email.

### Internal Error Messages Returned to Client (Low)

- Files: `routes/index.js:1278,1319,1352,1834` — `res.status(500).json({ error: err.message || … })`.
- Risk: Library errors (e.g. Cloudinary quota, Sequelize dialect errors) leak through to the client.
- Recommendations: Log full error server-side; return generic messages to the client.

---

## Dependency Health

### `express-session` v1.x with Default MemoryStore (Medium)

- Risk: Sessions are stored in process memory — not production-safe; on Render's free tier, restarting the server invalidates all sessions, and there is no session sharing across instances.
- Files: `index.js:30`; no `store` configured; `package.json` declares no Redis/SQL session store.
- Recommendations: Add `connect-session-sequelize` backed by the existing `sequelize` instance, or `connect-redis`.

### Deprecation Warnings in Transitive Deps (Low)

- Files: `package-lock.json:453,1448,2124`
- Issue: At least three transitive packages are formally deprecated (per `npm audit`/lockfile `"deprecated"` entries). No direct dependencies appear pinned to deprecated versions, but warnings exist.
- Recommendations: Run `npm audit` and `npm audit fix`; review direct deps for upgrades of `uuid` consumers.

### No Test Suite (Medium)

- Issue: `package.json:7` — `"test": "echo \"Error: no test specified\" && exit 1"`. No `*.test.js`, no `__tests__/`, no runner (jest/vitest/mocha) declared.
- Impact:出家 all auth/IDOR/security fixes and advisor logic are regressable silently.
- Recommendations: Add `vitest` + `supertest`; co-locate tests in `routes/__tests__/`; prioritize IDOR and OTP-flow coverage.

---

## Fragile Areas

### Monolithic `routes/index.js` (Medium)

- Files: `routes/index.js` — **1,911 lines**, single file handling auth, farmers, admin, IoT, advisor, satellite, alerts, trivia, profile.
- Why fragile: Every change touches one file; merge conflicts are unavoidable; lazy-loaded `require()` blocks inside `try/catch` (`routes/index.js:13-20`) silently swallowes service load errors and degrades features at runtime rather than at boot.
- Safe modification: Split by domain (`routes/auth.js`, `routes/admin.js`, `routes/advisor.js`, `routes/satellite.js`, etc.); mount via `app.use` in `index.js`.
- Test coverage: None.

### Duplicate Frontend Bundles (Medium)

- Files: `public/js/farmer-dashboard.js` (2,743 lines) and `public/js/new-farmer-dashboard.js` (2,563 lines) are near-identical (matching function definitions at off-by-~110 line offsets), both included from different views.
- Why fragile: Bug fixes must be applied twice and routinely drift; `escapeHtml` is defined in two places independently.
- Safe modification: Decide which file is canonical and delete the other; update the corresponding `views/*.html` `<script>` tag.
- Test coverage: None.

### Hardcoded Polygon Coordinates (Low)

- Files: `services/satelliteService.js:10-25`
- Issue: Masbate/Mandaon polygon is hardcoded as `MANDAON_POLYGON`; any agricultural user outside that area receives irrelevant satellite data.
- Recommendations: Allow per-plot polygons (the `FarmPlot` model already has `latitude`/`longitude` — extend to a `geojson` column or polygon table).

---

## Vulnerable / Out-of-Place Files at Repo Root (Medium)

The following stray/scratch files exist and are **tracked by git** (verified via `git ls-files`):

| File | Purpose | Concern |
|------|---------|---------|
| `cookies.txt` | Session cookie export | Active session leak — see Critical above |
| `fix-html-structure.js` | One-shot HTML rebuild script | Dead code, should not ship |
| `fix-tail.js` | One-shot tag-cleanup script | Dead code, should not ship |
| `_theming.ps1` | PowerShell theming helper | Unrelated to Node app; IDE/OS artifact |
| `plotStatus.md` | Ad-hoc status notes | Should live in docs/ or be removed |
| `nul` | Empty 0-byte file (Windows `nul` misredirect) | Accidental; `.gitignore` lists `nul` but the file is on disk |
| `database.sqlite` | Local DB | Correctly gitignored — verify never tracked |

Also tracked: `.vscode/tasks.json` (IDE-specific; should be `.gitignore`d or moved to a shared `.vscode/launch.json` if intended for the team).

Additional untracked-but-present: `.env` (gitignored ✓), `.agents/`, `.planning/` (GSD artifacts).

Fix approach: `git rm --cached` the scratch/IDE files; add `cookies.txt`, `.vscode/`, `*_theming.ps1`, `fix-*.js`, `plotStatus.md` to `.gitignore`; delete `nul` from disk.

---

## Documentation Gaps

### Missing README (Medium)

- Problem: No `README.md` at repo root. The closest narrative docs are `GEMINI.md`, `IMPROVEMENT.md`, `UI-SPEC.md`, and `plotStatus.md` — none describe install/run/test commands.
- Blocks: New contributors cannot run the app or run migrations without reading source.
- Files: `GEMINI.md:29` explicitly contains `*TODO: Document commands for installation, development, and production…*`.

### Stray Design Notes in Repo Root (Low)

- `IMPROVEMENT.md` (14 KB), `UI-SPEC.md`, `GEMINI.md`, `plotStatus.md` are living design docs that mix planning with code. Consider relocating to `docs/`.

---

## Performance Bottlenecks

### Per-Image Serial `fetchStats` in Satellite Imagery (Low)

- Problem: For each of up to 5 images, `satelliteService.fetchStats(img.stats.ndvi)` is awaited sequentially inside a `for` loop.
- Files: `routes/index.js:1800-1822`
- Cause: Sequential awaits instead of `Promise.all`.
- Improvement path: Replace the `for (let i...)` loop with `Promise.all(images.slice(0,5).map(async img => { ... }))` and push results after resolution.

### Sequential Alert Insertion in Broadcast (Medium)

- Problem: `routes/index.js:1503-1511` creates one Alert row per target user inside a `for…of` loop with `await` on each `Alert.create`.
- Cause: N sequential INSERTs against MySQL — for 100 farmers this is 100 round-trips.
- Improvement path: Use `Alert.bulkCreate(targetUsers.map(u => ({...})))` for a single round-trip, then proceed to email dispatch in parallel (which already uses `Promise.all` at line 1632).

### In-Memory Weather Cache Without Bounded Eviction (Low)

- Problem: `utils/weatherService.js:19-32` caches by `current_${lat}_${lon}` keys but never evicts entries; rapid distinct lat/lon probe requests grow the cache indefinitely (memory leak).
- Improvement path: Use a bounded LRU (e.g. `lru-cache`) or cap distinct cache keys.

### Open Weather API Polling on Every Admin Stats Fetch (Medium)

- Problem: `GET /api/admin/stats` actually calls `weatherService.fetchCurrentWeather()` (twice) on every request to "verify connectivity" and auto-logs (`routes/index.js:1198,1237`) — bypassing the 10-minute TTL cache because the call is for default coords but any other cached client request is for distinct plots.
- Files: `routes/index.js:1194-1250`
- Improvement path: Use the existing 10-min cache; only fetch when the cached current entry is stale; skip the duplicate fetch+log on every admin dashboard refresh.

---

## Scaling Limits

### Session Memory Store (High at scale)

- Current capacity: ~1 Render instance, <1k concurrent sessions before memory pressure.
- Limit: All sessions lost on redeploy; no horizontal scaling.
- Scaling path: Externalize session store (Sequelize or Redis).

### In-Memory Service Cache (Low)

- `utils/weatherService.js` cache lives in process memory; multi-instance Render deploys will each maintain their own cache and amplify OpenWeather API usage (wasting quota).
- Scaling path: Shared Redis cache.

---

## Dependencies at Risk

### `bcrypt` v6 (Low/Medium)

- Risk: bcrypt v6 is recent; ensure native build toolchain matches the deployment target. Pre-built binaries exist for common platforms.
- Impact: `bcrypt` build failures will prevent `npm install` on Render, breaking deploys.
- Migration plan: Keep bcrypt but pin to a Node-prebuilt version; fall back to `bcryptjs` if native builds become unreliable.

### `mysql2` + `sequelize` v6 (Low)

- Risk: Sequelize 6 is in maintenance; Sequelize 7 is the actively developed line. Security fixes may slow.
- Impact: Long-term support window closing.
- Migration plan: Track Sequelize 7 release notes; plan upgrade in an upcoming phase.

---

## Test Coverage Gaps

### Authentication & Authorization (High priority)

- What's not tested: IDOR scenarios (cross-user record manipulation), admin role check, OTP expiry/lockout, session fixation prevention on login.
- Files: `routes/index.js` (login, verify-otp, planting-records, soil, stations routes).
- Risk: The IDOR issues identified above have no regression protection; any future refactor could silently re-introduce them.
- Priority: High.

### Advisor Services (Medium priority)

- What's not tested: `services/diseaseRiskService.js`, `services/fertilizerService.js`, `services/gddService.js`, `services/irrigationService.js`, `services/typhoonAlertService.js`, `services/todoService.js` — all pure-logic modules with no tests.
- Files: `services/*.js`.
- Risk: Pheno-stage thresholds, GDD totals, and risk class boundaries can drift silently.
- Priority: Medium — these are easy unit-test targets (no DB).

### Cloudinary Upload Path (Low priority)

- What's not tested: Image-type allowlist, file-size enforcement, upsert path in `POST /api/admin/crops`.
- Files: `routes/index.js:40-57,1282-1322`.
- Priority: Low.

---

*Concerns audit: 2026-07-22*