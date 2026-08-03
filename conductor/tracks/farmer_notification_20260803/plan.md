# Implementation Plan: Farmer Notification System (Email & SMS)

## Phase 1: Setup and Service Preparation
- [x] Task: Install `node-cron` package.
- [x] Task: Create dummy SMS service (`services/smsService.js`) to log messages.
- [x] Task: Ensure `nodemailer` email service is configured correctly for notifications.
- [x] Task: Write initial unit tests for the dummy SMS service.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Setup and Service Preparation' (Protocol in workflow.md)

## Phase 2: Implement Notification Logic
- [x] Task: Create notification generation logic to compile messages.
    - [x] Fetch all users with 'Farmer' role.
    - [x] Generate daily weather and crop impact report content.
    - [x] Generate storm alerts and possible crop damage content based on weather data.
- [x] Task: Write unit tests for notification logic.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Implement Notification Logic' (Protocol in workflow.md)

## Phase 3: Implement Schedulers
- [x] Task: Implement the 6 AM daily cron job for weather reports using `node-cron`.
- [x] Task: Implement the 5-minute interval cron job for storm checks using `node-cron`.
- [x] Task: Write integration tests to ensure schedulers trigger the correct services.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Implement Schedulers' (Protocol in workflow.md)

## Phase 4: Final Review & Checkpoint
- [x] Task: Perform end-to-end testing of the notification flow.
- [x] Task: Self-review code for standards and modularity.
- [x] Task: Conductor - User Manual Verification 'Phase 4: Final Review & Checkpoint' (Protocol in workflow.md)
