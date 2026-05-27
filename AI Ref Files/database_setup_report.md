# Project Weather: Database & Migration System Implementation Report

We have successfully integrated a dynamic, two-variant database model system and built a robust tables migration script matching the exact schema specified in the embedded draw.io diagram inside `AI Ref Files/database schema.html`.

---

## 🛠️ Design and Configuration System

### 1. Dual-Variant Database Connection (`config/database.js`)
We created a clean database abstraction using **Sequelize ORM** that dynamically loads environment configurations:
- **Development Variant**: Uses **SQLite**, generating a local git-ignored database file `database.sqlite` automatically.
- **Production Variant**: Uses **MySQL** (configured for **Aiven.io**). It natively handles SSL encryption requirements (`rejectUnauthorized: false`) and supports single-URI connection strings (`DATABASE_URL`) as well as individual host parameters.

### 2. Standardized Object-Relational Models (`models/`)
We translated the exact diagram fields, foreign keys, and constraints into modular, type-safe Sequelize models:
* **`User`** (`models/User.js`): User credentials, contact info (for SMS/Email alerts), and roles.
* **`CropRepository`** (`models/CropRepository.js`): Crop parameters, including minimum/maximum growth temperature thresholds and rain tolerance.
* **`FarmPlot`** (`models/FarmPlot.js`): Farm plots with owner reference and sizes.
* **`PlantingRecord`** (`models/PlantingRecord.js`): Tracking for what is planted where, when, and their current status (e.g. Growing).
* **`WeatherLog`** (`models/WeatherLog.js`): Historical weather metrics logs with data source origins (`API` vs `Station`).
* **`Alert`** (`models/Alert.js`): Extreme weather alerts and agricultural recommendations pushed to farmers.

*Associations and foreign key constraints are established cleanly inside `models/index.js`.*

---

## 🚀 Migration Script (`scripts/migrate.js`)
The migration script is fully parameterized to support running on different target databases:
```bash
# To migrate and initialize the development (SQLite) database
node scripts/migrate.js --env=development

# To migrate and initialize the production (Aiven.io MySQL) database
node scripts/migrate.js --env=production
```

> [!NOTE]
> You can also append the `--force` (or `-f`) flag to drop tables first and perform a clean re-migration.
> E.g., `node scripts/migrate.js --env=development --force`

---

## 💎 Command-Line & Package Integration

### 1. Shortcut Scripts (`package.json`)
We added dedicated NPM script targets so you can easily run migrations without remembering CLI arguments:
- **`npm run migrate:dev`**: Runs development migrations on your local SQLite database.
- **`npm run migrate:prod`**: Runs production migrations on your Aiven.io MySQL database.

### 2. Environment Templates (`.env`)
We populated `.env` with configurable parameters for both SQLite and Aiven.io MySQL, ready for your credentials:
```ini
# Active Environment (development / production)
NODE_ENV=development

# DEVELOPMENT DATABASE (SQLite)
DB_FILE=database.sqlite

# PRODUCTION DATABASE (MySQL Aiven.io)
# DATABASE_URL=mysql://avnadmin:password@host:port/dbname?ssl-mode=REQUIRED
```

### 3. Git Preservation (`.gitignore`)
Local SQLite database files (`database.sqlite`), `.env` secrets, and `node_modules` are successfully git-ignored to prevent accidental exposures.
