/**
 * @fileoverview Notification Scheduler for Project Weather.
 * Uses node-cron to schedule daily weather reports (6 AM) and
 * storm checks (every 5 minutes) with deduplication logic.
 */

const cron = require('node-cron');
const { sendDailyWeatherReport, checkAndSendStormAlerts } = require('./notificationService');

// ────────────────────────────────────────
// STATE TRACKING
// ────────────────────────────────────────

let dailyJob = null;
let stormJob = null;

// Storm alert deduplication state
let lastStormRiskLevel = 'NONE';
let lastStormAlertTimestamp = 0;

const RISK_SEVERITY = { NONE: 0, WATCH: 1, WARNING: 2, EMERGENCY: 3 };
const STORM_ALERT_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour cooldown

// ────────────────────────────────────────
// SCHEDULER START
// ────────────────────────────────────────

/**
 * Initializes and starts all notification cron jobs.
 * - Daily weather report at 6:00 AM (Asia/Manila)
 * - Storm check every 5 minutes
 */
function startSchedulers() {
  console.log('──────────────────────────────────────');
  console.log('🔔 [Scheduler] Initializing notification schedulers...');

  // Daily Weather Report — 6:00 AM Manila time
  dailyJob = cron.schedule('0 6 * * *', async () => {
    const startTime = new Date().toISOString();
    console.log(`🔔 [Scheduler] Running daily weather report... (started: ${startTime})`);
    try {
      const result = await sendDailyWeatherReport();
      console.log(`✅ [Scheduler] Daily weather report completed. Notified: ${result.usersNotified} users.`);
    } catch (err) {
      console.error('❌ [Scheduler] Daily weather report failed:', err.message);
    }
  }, {
    scheduled: true,
    timezone: 'Asia/Manila'
  });

  console.log('🕐 [Scheduler] Daily weather report cron started (6:00 AM Asia/Manila)');

  // Storm Check — Every 5 minutes
  stormJob = cron.schedule('*/5 * * * *', async () => {
    console.log(`🌀 [Scheduler] Running storm check... (${new Date().toISOString()})`);
    try {
      const result = await checkAndSendStormAlerts();

      if (!result) {
        console.log('🌀 [Scheduler] Storm check returned no result.');
        return;
      }

      // Deduplication logic — only log/track if risk changed
      const currentRisk = result.riskLevel || 'NONE';
      const currentSeverity = RISK_SEVERITY[currentRisk] || 0;
      const lastSeverity = RISK_SEVERITY[lastStormRiskLevel] || 0;
      const timeSinceLastAlert = Date.now() - lastStormAlertTimestamp;

      if (currentRisk !== 'NONE' && result.usersNotified > 0) {
        const isEscalation = currentSeverity > lastSeverity;
        const cooldownExpired = timeSinceLastAlert >= STORM_ALERT_COOLDOWN_MS;

        if (isEscalation || cooldownExpired) {
          lastStormRiskLevel = currentRisk;
          lastStormAlertTimestamp = Date.now();
          console.log(`⚠️ [Scheduler] Storm alert sent! Risk: ${currentRisk}, Notified: ${result.usersNotified} users.`);
        } else {
          console.log(`🌀 [Scheduler] Storm risk (${currentRisk}) unchanged. Cooldown active — skipping.`);
        }
      } else if (currentRisk === 'NONE' && lastStormRiskLevel !== 'NONE') {
        console.log('✅ [Scheduler] Storm risk has cleared. Resetting state.');
        lastStormRiskLevel = 'NONE';
      } else {
        console.log('✅ [Scheduler] No storm risks detected.');
      }
    } catch (err) {
      console.error('❌ [Scheduler] Storm check failed:', err.message);
    }
  }, {
    scheduled: true,
    timezone: 'Asia/Manila'
  });

  console.log('🌀 [Scheduler] Storm check cron started (every 5 minutes)');
  console.log('──────────────────────────────────────');
}

// ────────────────────────────────────────
// SCHEDULER STOP
// ────────────────────────────────────────

/**
 * Stops all notification cron jobs gracefully.
 */
function stopSchedulers() {
  if (dailyJob) {
    dailyJob.stop();
    dailyJob = null;
    console.log('🛑 [Scheduler] Daily weather report cron stopped.');
  }
  if (stormJob) {
    stormJob.stop();
    stormJob = null;
    console.log('🛑 [Scheduler] Storm check cron stopped.');
  }
}

module.exports = {
  startSchedulers,
  stopSchedulers
};
