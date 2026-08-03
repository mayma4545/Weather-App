# Tech Stack: Project Weather

## Core Architecture
- **Architecture Pattern:** Model-View-Presenter (MVP) / Modular MVC
- **Runtime Environment:** Node.js (CommonJS modules)

## Backend Stack
- **Framework:** Express.js (`^5.2.1`)
- **Database & ORM:** 
  - Sequelize ORM (`^6.37.8`)
  - SQLite3 (`^6.0.1`) for local/development storage (`database.sqlite`)
  - MySQL2 (`^3.22.3`) support for production database setup
- **Authentication & Security:**
  - `bcrypt` (`^6.0.0`) password hashing
  - `express-session` (`^1.19.0`) session state management
  - `helmet` (`^8.1.0`) HTTP security headers
  - `nodemailer` (`^9.0.3`) OTP and email alerts

## Frontend Stack
- **Structure:** Server-rendered HTML5 views (`views/`)
- **Styling:** Custom Vanilla CSS3 (`public/css/`)
- **Logic:** Vanilla JavaScript (`public/js/`)

## Services & Integrations
- **Cloud Storage:** Cloudinary (`^2.10.0`) & Multer (`^2.2.0`) for media/file uploads
- **Weather & AI Services:** OpenWeather API, multi-crop Planting Safety Index prediction engine (`plantingPredictorService.js`), Google AI / Gemini service (`geminiService.js`) for context-enriched field recommendations, & local station log ingestion
- **Notification & Scheduling:** `node-cron` for scheduled jobs (daily weather reports at 6 AM, storm checks every 5 min), `nodemailer` (`^9.0.3`) for email delivery, SMS API integration (stub-ready)
- **Middlewares & Logging:** `morgan` (`^1.10.1`), `cors` (`^2.8.6`), `dotenv` (`^17.4.2`)

## Development & Operations
- **Process Manager / Dev Server:** Nodemon (`nodemon index.js`)
- **Database Migrations:** Custom migration runner scripts (`scripts/migrate.js`)
