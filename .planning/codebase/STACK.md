# Technology Stack

**Analysis Date:** 2026-07-22

## Languages

**Primary:**
- JavaScript (CommonJS) - Server logic, routes, services, models, scripts; `"type": "commonjs"` declared in `package.json`
- HTML - View templates served as static files from `views/*.html` (no templating engine)
- CSS - Hand-written stylesheets in `public/css/*.css` (no preprocessor detected)
- JavaScript (client) - Vanilla browser JS in `public/js/*.js` (e.g. `farmer-dashboard.js`, `admin-dashboard.js`); no frontend framework

**Secondary:**
- SQL - Implicit via Sequelize ORM (SQLite in dev, MySQL in prod); no raw SQL files committed

## Runtime

**Environment:**
- Node.js (version not pinned; no `.nvmrc` / `engines` field). Uses native `fetch` (Node ≥ 18 required).

**Package Manager:**
- npm (lockfile `package-lock.json` present)
- Lockfile: present

## Frameworks

**Core:**
- `express` ^5.2.1 - HTTP server & routing (`index.js`, `routes/index.js`). NOTE: Express 5.x is a recent major — escaping/regulators should use Express 5 semantics.

**Testing:**
- None detected. `"test"` script is a stub: `echo "Error: no test specified" && exit 1` (`package.json` line 7). No `jest`, `vitest`, `mocha`, or test files present.

**Build/Dev:**
- `nodemon` - Dev runner invoked via `npm run dev` (`package.json` line 9). Not listed in `dependencies` (assumed globally installed or omitted).
- No bundler/transpiler — plain CommonJS `require()` throughout; no TypeScript, no Babel, no `dist/`.

## Key Dependencies

**Critical (production runtime):**
- `sequelize` ^6.37.8 - ORM, defines models in `models/*.js`, associations in `models/index.js`
- `sqlite3` ^6.0.1 - Dev database driver (SQLite); dev file `database.sqlite` at repo root
- `mysql2` ^3.22.3 - Prod database driver (MySQL via Aiven.io); SSL required
- `express` ^5.2.1 - Web framework
- `express-session` ^1.19.0 - Session store for auth (in-memory, default `MemoryStore`)
- `bcrypt` ^6.0.0 - Password hashing for `User.password_hash` (`routes/index.js` line 101)
- `dotenv` ^17.4.2 - Env config loaded at top of `index.js`, `services/emailService.js`, `scripts/migrate.js`

**Infrastructure / External integration:**
- `helmet` ^8.1.0 - Security headers with custom CSP whitelisting OpenWeather + Agromonitoring (`index.js` lines 12-23)
- `cors` ^2.8.6 - CORS middleware (`index.js` line 24) — applied app-wide with no opts
- `morgan` ^1.10.1 - HTTP request logging, `dev` format (`index.js` line 27)
- `multer` ^2.2.0 - Multipart upload handling for crop images; in-memory storage (`routes/index.js` lines 33-38)
- `cloudinary` ^2.10.0 - Image hosting/upload for crop repository images (`routes/index.js` lines 26-30, `uploadToCloudinary` helper)
- `nodemailer` ^9.0.3 - Transactional email (OTP + welcome) via Gmail SMTP (`services/emailService.js`)

**Notable absences:**
- No test framework
- No ESLint / Prettier / Biome config
- No TypeScript
- No frontend framework or build tool (React, Vue, Vite, etc.)
- No WebSocket/real-time lib
- No job queue / scheduler

## Configuration

**Environment:**
- `.env` file present at repo root (existence noted only — contents not read). Loaded via `require('dotenv').config()`.
- Key env vars referenced in code:
  - `OPENWEATHER_API_KEY` (`utils/weatherService.js`)
  - `AGROMONITORING_API_KEY` (`services/satelliteService.js`)
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (`routes/index.js`)
  - `EMAIL_USER`, `EMAIL_PASS` (`services/emailService.js`)
  - `SESSION_SECRET` (`index.js`)
  - `PORT` (default 4000)
  - `WEATHER_LAT`, `WEATHER_LON` (default Masbate City 12.3703/123.6217)
  - `MAX_FILE_SIZE`, `ALLOWED_IMAGE_TYPES`
  - Prod DB: `PROD_DATABASE_URL` OR `PROD_DB_NAME`/`PROD_DB_USER`/`PROD_DB_PASSWORD`/`PROD_DB_HOST`/`PROD_DB_PORT`
  - Dev DB: `DB_FILE`
  - `NODE_ENV` / `DB_ENV` toggles SQLite vs MySQL (`config/database.js`)

**Security note (informational):** `routes/index.js` lines 27-29 contain hardcoded Cloudinary credentials as fallback defaults — recommend removing. (Detail captured for awareness; deeper treatment belongs in CONCERNS.md.)

**Build:**
- No build step. `npm start` runs `node index.js` directly.
- DB schema is auto-synced at boot via `sequelize.sync({ alter: true })` in `index.js` lines 58-64.
- Explicit migration script: `node scripts/migrate.js --env=development|production` (supports `--force` to drop/recreate). Invoked via `npm run migrate:dev` / `migrate:prod` (`package.json` lines 10-11).

## Platform Requirements

**Development:**
- Node.js ≥ 18 (uses global `fetch`)
- npm
- Write access to repo root for `database.sqlite` (SQLite file)

**Production:**
- Deployed to Render (URL `weather-app-rr5y.onrender.com` referenced in `routes/index.js` line 214)
- Externalized MySQL via Aiven.io (`config/database.js` line 10) with SSL
- Sessions use default in-memory `MemoryStore` — will not survive restart/ across instances (single-instance deployment assumed)

## Data Layer

**ORM:** Sequelize 6, configured in `config/database.js`
- Dev: SQLite, file at `process.env.DB_FILE || 'database.sqlite'`, SQL logging on
- Prod: MySQL dialect over SSL via `PROD_DATABASE_URL` or individual `PROD_DB_*` vars, SQL logging off

**Models** (`models/*.js`, registered in `models/index.js`):
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

**Associations:** defined in `models/index.js` lines 17-48 — User↔FarmPlot, User↔Alert, FarmPlot↔PlantingRecord↔CropRepository, User↔Trivia, FarmPlot↔SoilProfile, User↔StationDevice↔WeatherLog. All `onDelete: CASCADE` where owned.

## Frontend Stack

- **Templating:** None. Views are static `.html` files in `views/` served via `res.sendFile()` from `routes/index.js` (`getPage` helper line 302).
- **CSS:** Plain CSS per page in `public/css/` (e.g. `farmer-dashboard.css`, `admin-dashboard.css`, `digital-repository.css`).
- **Client JS:** Vanilla JS in `public/js/` (`farmer-dashboard.js` 2743 lines includes Filipino/English translation tables; `admin-dashboard.js`; `new-farmer-dashboard.js`). Communicates with REST endpoints under `/api/*`.
- **Fonts:** Google Fonts allowed via CSP `styleSrc`/`fontSrc` (`index.js` lines 17-18).

---

*Stack analysis: 2026-07-22*