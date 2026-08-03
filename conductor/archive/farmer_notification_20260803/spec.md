# Specification: Farmer Notification System (Email & SMS)

## Overview
This feature introduces an automated notification system designed to keep farmers informed about critical weather events and daily reports. The system will send daily weather summaries at 6 AM and storm alerts every 5 minutes based on real-time weather monitoring.

## Functional Requirements
1. **Daily Weather Reports:**
   - Automatically trigger a job every day at 6:00 AM using `node-cron`.
   - Send emails and SMS messages to all users with the 'Farmer' role.
   - The notification content must include the current weather and a report on crops that might be affected by this weather.
2. **Storm Alerts:**
   - Automatically trigger a job every 5 minutes using `node-cron` to check for incoming storms.
   - If a storm is detected, instantly notify farmers (Email and SMS).
   - The notification content must include details about the possible damage to their specific crops.
3. **SMS Service:**
   - Create an initial dummy SMS service that logs the message and recipient number to the console/database. This ensures the system is ready once the actual SMS API endpoint is available.
4. **Email Service:**
   - Utilize the existing `nodemailer` setup to send email notifications.
5. **Testing:**
   - Implement unit and integration tests to verify the correctness of the scheduling, message content generation, and delivery mechanics.

## Non-Functional Requirements
- Ensure the background jobs do not block the main Express event loop.
- Proper error handling and logging should be in place for failed email or SMS deliveries.

## Acceptance Criteria
- [ ] A `node-cron` job successfully triggers at 6 AM and sends a daily weather report to all farmers.
- [ ] A `node-cron` job successfully triggers every 5 minutes and sends a storm alert if severe weather is detected.
- [ ] The SMS service correctly logs messages when triggered.
- [ ] Notifications accurately reflect the user's planted crops and potential weather impacts.
- [ ] Automated tests confirm the correct behavior of the notification system.

## Out of Scope
- Full integration with the real SMS provider API (deferred until the API is fully available).
