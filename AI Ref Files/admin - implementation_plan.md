# Admin User Interface — DEBESMSCAT Crop & Weather System

Build a complete admin interface with 5 pages, separate `/admin/*` routes, matching the existing farmer UI design system (DM Sans + Playfair Display fonts, earth-tone palette, same component styles), and fully responsive mobile layout with bottom tab navigation.

## Proposed Changes

### New Model: Trivia

#### [NEW] [Trivia.js](file:///c:/Users/ferna/Desktop/WEATHER/models/Trivia.js)

A new Sequelize model for the Digital Repository content. Fields:
- `trivia_id` (PK, auto-increment)
- `content` (TEXT, required) — the tip/trivia text
- `crop_tag` (STRING, nullable) — optional crop name tag, or `"General"`
- `published_by` (INTEGER, FK → users.user_id) — the admin who published it
- `created_at` (DATE)

#### [MODIFY] [index.js](file:///c:/Users/ferna/Desktop/WEATHER/models/index.js)

- Import the new `Trivia` model
- Add association: `User.hasMany(Trivia)` / `Trivia.belongsTo(User)`
- Export `Trivia`

---

### Admin View — Single HTML with SPA navigation (matching farmer pattern)

#### [NEW] [admin-dashboard.html](file:///c:/Users/ferna/Desktop/WEATHER/views/admin-dashboard.html)

A single HTML file serving all 5 admin pages via SPA-style `page-content` panels (same pattern as farmer). Contains:

1. **Topbar** — "Project Weather" branding + "Admin" badge + user avatar
2. **Desktop Sidebar** — 5 nav links: Dashboard, Crop Repository, Digital Repository, Weather Monitor, Global Alerts
3. **Mobile Bottom Nav** — 5 tab icons matching sidebar
4. **Page panels** (div.page-content):
   - `#page-dashboard` — System health widget (total farmers, active plots, API status)
   - `#page-crop-repository` — Crop guidelines table + Add/Edit form modal
   - `#page-digital-repository` — Trivia text editor + published feed
   - `#page-weather-monitor` — Date-range weather logs table with source badges
   - `#page-global-alerts` — Advisory compose form with audience selector

Design details:
- Same `.dash`, `.topbar`, `.layout`, `.sidebar`, `.main`, `.card`, `.metric-card`, `.form-card`, `.form-control`, `.btn-submit`, `.custom-table`, `.bottom-nav` classes as farmer
- Earth-tone palette: `#1C1C1A`, `#F7F5F0`, `#EFEDE7`, `#5A8A42`, `#E8A44A`, `#C0531A`
- Admin-specific accent: subtle amber `#E8A44A` highlights on admin badge and key CTAs

---

### Admin CSS

#### [NEW] [admin-dashboard.css](file:///c:/Users/ferna/Desktop/WEATHER/public/css/admin-dashboard.css)

Imports the same Google Fonts. Reuses all base styles from the farmer design system (`.dash`, `.topbar`, `.sidebar`, `.card`, etc.) — copy-adapted to be self-contained. Admin-specific additions:
- `.admin-badge` pill on topbar
- `.status-indicator` (green/red dot for API status)
- `.stat-card` variant for dashboard metrics
- `.trivia-editor` textarea styling
- `.trivia-feed` list styling
- `.source-badge` for API/Station tags in weather table
- `.highlight-row` for anomalous weather data
- `.audience-selector` for alert targeting
- Full `@media (max-width: 768px)` responsive rules matching farmer breakpoints

---

### Admin JavaScript

#### [NEW] [admin-dashboard.js](file:///c:/Users/ferna/Desktop/WEATHER/public/js/admin-dashboard.js)

Client-side logic for all 5 admin pages:

1. **SPA Navigation** — Click sidebar/bottom-nav links to show/hide `page-content` panels, update `active` classes, push browser history
2. **Dashboard** — `GET /api/admin/stats` → render farmer count, active plots, API status
3. **Crop Repository** — `GET /api/crops` → render table; form submits `POST /api/admin/crops` or `PUT /api/admin/crops/:id`; delete via `DELETE /api/admin/crops/:id`
4. **Digital Repository** — `POST /api/admin/trivia` to publish; `GET /api/admin/trivia` to list feed; `DELETE /api/admin/trivia/:id` to remove
5. **Weather Monitor** — `GET /api/admin/weather-logs?from=...&to=...` → render table with source badges and anomaly highlighting
6. **Global Alerts** — `POST /api/admin/alerts` with message + audience → send advisory

---

### Admin API Routes

#### [MODIFY] [index.js](file:///c:/Users/ferna/Desktop/WEATHER/routes/index.js)

Add new routes:

**Page routes:**
- `GET /admin` → redirect to `/admin/dashboard`
- `GET /admin/dashboard` → serve `admin-dashboard.html`
- `GET /admin/crop-repository` → serve `admin-dashboard.html`
- `GET /admin/digital-repository` → serve `admin-dashboard.html`
- `GET /admin/weather-monitor` → serve `admin-dashboard.html`
- `GET /admin/global-alerts` → serve `admin-dashboard.html`

**API routes:**
- `GET /api/admin/stats` — Returns `{ totalFarmers, activePlots, apiStatus }`
- `POST /api/admin/crops` — Create/update crop (upsert by name)
- `PUT /api/admin/crops/:id` — Update crop by ID
- `DELETE /api/admin/crops/:id` — Delete crop by ID
- `GET /api/admin/trivia` — List all trivia entries
- `POST /api/admin/trivia` — Publish new trivia
- `DELETE /api/admin/trivia/:id` — Delete trivia
- `GET /api/admin/weather-logs` — Query weather logs with date range + source filter
- `POST /api/admin/alerts` — Send campus-wide advisory (creates alert records for matching users)

---

### Database Migration

#### [MODIFY] [migrate.js](file:///c:/Users/ferna/Desktop/WEATHER/scripts/migrate.js)

Add sync for the new `Trivia` model table.

#### [MODIFY] [seed.js](file:///c:/Users/ferna/Desktop/WEATHER/scripts/seed.js)

- Seed an admin user: `Admin User, admin@debesmscat.edu.ph, role: Admin`
- Seed a few sample trivia entries
- Seed sample weather logs for the monitor page

---

### Login Flow Update

#### [MODIFY] [login.html](file:///c:/Users/ferna/Desktop/WEATHER/views/login.html)

No change to design. The POST `/login` route will be updated to check user role and redirect accordingly:
- `role === 'Admin'` → `/admin/dashboard`
- `role === 'Agriculturist'` → `/farmer/dashboard`

---

## Verification Plan

### Automated Tests
- Run `node scripts/seed.js` to verify DB seeding works
- Start server with `npm start` and verify all `/admin/*` page routes return 200
- Test all `/api/admin/*` endpoints with browser/curl

### Manual Verification
- Navigate each admin page and verify data loads
- Test mobile responsive view at 375px viewport
- Verify SPA navigation between pages works
- Verify crop CRUD operations
- Verify trivia publish/delete
- Verify weather logs date filtering
- Verify alert broadcast creates records
