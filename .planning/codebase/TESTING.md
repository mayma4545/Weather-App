# Testing Patterns

**Analysis Date:** 2026-07-22

## Test Framework

**Runner:** None configured.

- `package.json` ships with the placeholder test script:
  ```json
  "test": "echo \"Error: no test specified\" && exit 1"
  ```
  Running `npm test` will print "Error: no test specified" and exit with code 1. There is no test runner installed, no assertion library, no mocking library.

**Assertion Library:** None.

**Mocking Library:** None.

**Run Commands:**
```bash
npm test        # Fails intentionally — no tests exist
npm start       # node index.js (production boot, runs sequelize.sync then listens on PORT 4000)
npm run dev     # nodemon index.js (file-watching dev server)
npm run migrate:dev    # node scripts/migrate.js --env=development (SQLite)
npm run migrate:prod   # node scripts/migrate.js --env=production (MySQL via PROD_DATABASE_URL)
```

## Test File Organization

**Location:** No test directory exists.

A globbing search for `**/*.test.js`, `**/*.spec.js`, `__tests__/`, `test/`, and `tests/` across the repo returns **zero matches**. The following candidate directories are absent:

- `test/`, `tests/`, `__tests__/`
- `spec/`, `specs/`
- `e2e/`, `cypress/`, `playwright/`

**Naming pattern:** N/A — no test files to derive a pattern from.

## Test Structure

Not applicable — no tests exist anywhere in the codebase.

## Mocking

Not applicable — no test infrastructure exists. No discussion of mocks, stubs, or fixtures in any source file or `.md` documentation.

## Fixtures and Factories

**Test Data:** No factories or fixtures directory. Seeding is done via standalone scripts:

- `scripts/seed.js` — general seed data
- `scripts/seed-trivia.js` — trivia seed data
- `scripts/reset-admin.js` — resets the admin user
- `scripts/migrate-otp-and-identity.js` — one-off data migration for OTP/identity fields
- `scripts/migrate-data.js` — bulk data migration helper

These seed scripts call `sequelize.sync(...)` and `Model.create({...})` directly. They are run manually via `node scripts/seed.js`, not by any `npm run` script in `package.json`.

**Location:** `scripts/` directory.

## Coverage

**Requirements:** None enforced. No `coverage` threshold, no `nyc`/`c8`/`istanbul` configuration, no `--coverage` flag anywhere.

**View Coverage:** Not available.

## Test Types

**Unit Tests:** None.

**Integration Tests:** None.

**E2E Tests:** None. No Playwright, Cypress, Puppeteer, or Selenium configuration detected. No `.vscode/launch.json` test configurations (only a `.vscode/tasks.json` exists).

## Validation Strategy Currently in Place

Because there is no test suite, correctness is currently established through:

1. **Runtime guards** — `index.js` calls `sequelize.sync({ alter: true })` on boot and falls back to listening without DB sync if the connection fails, so the server starts even when the DB is unreachable.
2. **Inline input validation** in every route handler (`routes/index.js`) — manual checks like `if (!plot_name || !area_size) return res.status(400).json({ error: 'Missing required fields' });`, regex email/password checks at `/register`.
3. **Sequelize validators** on models (`models/User.js`): `isEmail`, `isIn: [['Admin', 'Agriculturist']]`.
4. **Try/catch error logging** — every async route logs to `console.error('API Error <route>:', err)` and returns `500 { error: 'Internal Server Error' }`.
5. **Manual smoke testing** — developer runs `npm run dev` and exercises the UI in a browser. The `plotStatus.md`, `IMPROVEMENT.md`, and `AI Ref Files/` directory contain developer notes (not automated checks).
6. **Ad-hoc helper scripts** like `fix-html-structure.js` and `fix-tail.js` at the repo root — one-off repair scripts run manually.

## Recommended Testing Setup (Standards for New Tests)

Since no framework is configured, the following is the recommended baseline to introduce when adding tests to this CommonJS/Sequelize/Express codebase:

**Frameworks to install:**
- `jest` (test runner + assertions + mocks in one; supports CommonJS out of the box)
- `supertest` (HTTP-level integration tests against the Express `app` export)
- `sqlite3` (already a dependency — use in-memory SQLite via `:memory:` for fast, isolated model tests)

**Run command pattern to add to `package.json`:**
```json
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage"
```

**File placement:** Co-located `__tests__/` directories next to the module under test, mirroring the source tree:
```
services/__tests__/irrigationService.test.js
routes/__tests__/index.test.js   (or split per route group)
models/__tests__/User.test.js
utils/__tests__/weatherService.test.js
presenters/__tests__/authPresenter.test.js
middlewares/__tests__/auth.test.js
```

**Suggested unit-test shape** (based on observed service style in `services/irrigationService.js`):
```javascript
const { calculateET0, getIrrigationRecommendation } = require('../irrigationService');

describe('calculateET0 (Hargreaves)', () => {
  test('returns positive value for typical tropical temps', () => {
    const et0 = calculateET0(32, 24, 180, 12.37);
    expect(et0).toBeGreaterThan(0);
    expect(et0).toBeLessThanOrEqual(10);
  });

  test('clamps temperature difference to minimum 0.1', () => {
    const et0 = calculateET0(25, 25, 180, 12.37);
    expect(et0).toBeGreaterThan(0);
  });
});

describe('getIrrigationRecommendation', () => {
  test('suspends irrigation when 3-day rain exceeds 25mm', () => {
    const result = getIrrigationRecommendation(
      { temperature: 30, rainfall: 0 },
      [{ rainfall: 30 }, { rainfall: 0 }, { rainfall: 0 }],
      'rice', 'mid', 'Clay Loam'
    );
    expect(result.irrigationNeeded).toBe(false);
    expect(result.urgency).toBe('none');
  });
});
```

**Suggested integration-test shape** (against `routes/index.js`):
```javascript
const request = require('supertest');
const app = require('../../index'); // requires exporting `app` from index.js
// Note: index.js currently does NOT export the app — refactor needed before integration tests can run

describe('GET /api/weather/current', () => {
  test('returns 200 with normalized weather object', async () => {
    const res = await request(app).get('/api/weather/current?lat=12.37&lon=123.62');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('temperature');
  });
});
```

**Required refactors before integration tests can work:**
- `index.js` currently calls `app.listen()` inline at the bottom and does not export `app`. To enable `supertest`, refactor to `module.exports = app;` and start listening only when `index.js` is the entry point (`if (require.main === module) { app.listen(...) }`).
- Test setup must override `process.env.NODE_ENV` to `test` and point the database at an in-memory SQLite instance (`storage: ':memory:'`) in `config/database.js`, bypassing `PROD_DATABASE_URL`.

**What to Mock (guideline):**
- `utils/weatherService.js` — mock `global.fetch` to avoid hitting OpenWeather API in route tests.
- `services/emailService.js` — mock `nodemailer.createTransport` so tests don't send real email.
- `cloudinary` in `routes/index.js` — mock `cloudinary.uploader.upload_stream`.
- Express `req.session` — set via `supertest` session middleware or `express-session` in test setup.

**What NOT to Mock:**
- Sequelize models — use a real in-memory SQLite database for model tests so the `isEmail`/`isIn` validators and `underscored` mapping actually execute.
- Pure computational services like `services/irrigationService.js` (`calculateET0`, `getCropCoefficient`, `getSoilWaterCapacity`) — these are pure functions, no I/O, should be tested directly.

## Current Test Coverage Gaps (All Code)

| Area | Key files | Risk | Priority |
|------|-----------|------|----------|
| Auth flow (register/login/OTP) | `routes/index.js` lines 62-293, `models/Otp.js` | OTP brute-force counter and expiry logic untested — bug could let attackers bypass verification | High |
| Agricultural advisors | `services/irrigationService.js`, `services/diseaseRiskService.js`, `services/fertilizerService.js`, `services/gddService.js`, `services/typhoonAlertService.js` | Pure-logic engines that drive farmer-facing recommendations; math errors silently produce wrong advice | High |
| Weather cache + transform | `utils/weatherService.js` | Cache TTL and unit conversions (m/s→km/h) — incorrect transforms flow into every advisor | High |
| Cloudinary upload validation | `routes/index.js` `uploadToCloudinary` | MIME-type allowlist bypass could permit malicious uploads | Medium |
| Session middleware | `middlewares/auth.js` | 401-vs-redirect branching by path prefix — regression could leak admin routes | Medium |
| Todo aggregation | `services/todoService.js`, `routes/index.js` `/api/todo` | Sort/priority merging of multi-plot tasks — silent ordering bugs | Low |

---

*Testing analysis: 2026-07-22*