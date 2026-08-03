# DEBESMSCAT Weather & Smart Crop Platform

A web platform for DEBESMSCAT combining campus weather monitoring with smart crop management tools for campus agriculturists (farmers) and agriculture students.

## Tech Stack

- **Runtime**: Node.js (CommonJS, `type: "commonjs"`), Express ^5.2.1
- **Data**: Sequelize ^6 ORM — SQLite (dev) / MySQL via Aiven.io (prod)
- **Auth**: express-session (in-memory MemoryStore), bcrypt password hashing
- **Weather**: OpenWeather API (current + 5-day forecast) with 10-min in-memory cache
- **Image hosting**: Cloudinary
- **Email**: Nodemailer (Gmail SMTP); **SMS**: stub service (`services/smsService.js`)
- **Scheduling**: node-cron (daily weather report 6 AM, storm check every 5 min)
- **Frontend**: Vanilla JS + static HTML in `views/`, plain CSS in `public/css/`, client bundles in `public/js/`

## Key Directories

- `routes/index.js` — all page routes + REST `/api/*` endpoints
- `models/` — Sequelize models (User, FarmPlot, PlantingRecord, CropRepository, WeatherLog, Alert, Trivia, SoilProfile, StationDevice, Otp)
- `services/` — domain logic (irrigation, disease, fertilizer, GDD, typhoon alerts, notification, scheduler, etc.)
- `utils/weatherService.js` — OpenWeather client + caching
- `middlewares/auth.js` — `requireAuth`, `requireAdmin`
- `scripts/` — migrations and seed scripts

## Conventions

- Server: `require()` / `module.exports`, camelCase, 2-space indent, single quotes, semicolons
- Models: factory function with `underscored: true` (snake_case columns/tables)
- Associations defined centrally in `models/index.js` with `as` aliases
- Route handlers are inline async arrow functions wrapped in try/catch returning JSON
- Client bundles: ESLint-free, prefer `const`/`let` over `var` in new code
- JSDoc on exported service functions
- Logging with emoji prefixes (`✅`, `❌`, `⚠️`)

## Running

- `npm start` → `node index.js`
- `npm run dev` → nodemon
- `npm run migrate:dev` / `migrate:prod` → Sequelize sync scripts