# Development Workflow: Project Weather

## Overview
This document defines the development workflow and quality controls for executing tasks within Conductor tracks on Project Weather.

## Quality & Advisory Gates

### 1. Pre-Task Planning & Context Restoration
- Before starting a task, review the track plan in `conductor/tracks/<track_id>/plan.md`.
- Verify relevant project guidelines in `conductor/product-guidelines.md` and code style guides in `conductor/code_styleguides/`.

### 2. Code Review & Standards
- **Advisory Code Review:** Perform a self-review of modified files before committing task progress.
- Enforce clean separation of concerns across Express routes, models, views, and services.
- Adhere strictly to mobile-first responsive guidelines and error handling standards.

### 3. Testing & Verification
- **Unit & Integration Verification:** Run test scripts and verify database/API endpoint behavior after implementing core features.
- Ensure all migration scripts (`scripts/migrate.js`) run cleanly against SQLite/MySQL.
- Perform sanity checks on server routes (`npm start` / `npm run dev`).

### 4. Checkpoints & User Approvals
- **Phase & Track Checkpoints:** Pause for user review and approval at major track milestones and prior to track completion.
- Document progress and task completions in the track's `plan.md`.

## Commit & Version Control Protocol
- Make atomic Git commits upon completing each major task or checkpoint.
- Keep commit messages concise and descriptive (e.g., `feat(weather): add GDD calculation service`).
