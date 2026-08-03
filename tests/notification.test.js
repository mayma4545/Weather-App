/**
 * @fileoverview Tests for the Farmer Notification System.
 * Tests SMS service, notification service logic, and scheduler behavior.
 * 
 * Run: node tests/notification.test.js
 */

const assert = require('assert');

// ────────────────────────────────────────
// TEST UTILITIES
// ────────────────────────────────────────

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    testsPassed++;
    console.log(`  ✅ ${name}`);
  } catch (err) {
    testsFailed++;
    console.error(`  ❌ ${name}`);
    console.error(`     ${err.message}`);
  }
}

async function asyncTest(name, fn) {
  try {
    await fn();
    testsPassed++;
    console.log(`  ✅ ${name}`);
  } catch (err) {
    testsFailed++;
    console.error(`  ❌ ${name}`);
    console.error(`     ${err.message}`);
  }
}

// ────────────────────────────────────────
// 1. SMS Service Tests
// ────────────────────────────────────────

console.log('\n📱 SMS Service Tests');
console.log('─────────────────────────');

// Save original env and restore after tests
const originalSmsEndpoint = process.env.SMS_API_ENDPOINT;
const originalSmsKey = process.env.SMS_API_KEY;

// Test 1: Stub mode (no endpoint configured)
asyncTest('Should return stub result when SMS_API_ENDPOINT is not set', async () => {
  // Ensure endpoint is empty
  delete process.env.SMS_API_ENDPOINT;
  delete process.env.SMS_API_KEY;

  // Re-require to pick up env changes (SMS service reads env at module level)
  // Since node caches modules, we need to test the behavior of the function
  const { sendSms } = require('../services/smsService');
  const result = await sendSms({ to: '+639171234567', message: 'Test SMS' });

  assert.strictEqual(result.success, true, 'Should succeed');
  assert.strictEqual(result.stub, true, 'Should be a stub');
  assert.strictEqual(result.to, '+639171234567', 'Should have correct recipient');
  assert.strictEqual(result.message, 'Test SMS', 'Should have correct message');
});

// Test 2: sendSms function exists and is callable
test('sendSms should be a function', () => {
  const { sendSms } = require('../services/smsService');
  assert.strictEqual(typeof sendSms, 'function', 'sendSms should be a function');
});

// Restore env
process.env.SMS_API_ENDPOINT = originalSmsEndpoint || '';
process.env.SMS_API_KEY = originalSmsKey || '';

// ────────────────────────────────────────
// 2. Notification Service Tests
// ────────────────────────────────────────

console.log('\n📧 Notification Service Tests');
console.log('─────────────────────────────');

test('Notification service should export sendDailyWeatherReport', () => {
  const service = require('../services/notificationService');
  assert.strictEqual(typeof service.sendDailyWeatherReport, 'function');
});

test('Notification service should export checkAndSendStormAlerts', () => {
  const service = require('../services/notificationService');
  assert.strictEqual(typeof service.checkAndSendStormAlerts, 'function');
});

test('Notification service should export generateWeatherEmailHtml', () => {
  const service = require('../services/notificationService');
  assert.strictEqual(typeof service.generateWeatherEmailHtml, 'function');
});

test('Notification service should export generateStormAlertEmailHtml', () => {
  const service = require('../services/notificationService');
  assert.strictEqual(typeof service.generateStormAlertEmailHtml, 'function');
});

// Test HTML generation with mock data
test('generateWeatherEmailHtml should produce valid HTML with weather data', () => {
  const { generateWeatherEmailHtml } = require('../services/notificationService');

  const mockWeather = {
    temperature: 32,
    humidity: 78,
    wind_speed: 15,
    rainfall: 5,
    weather_description: 'partly cloudy',
    description: 'partly cloudy'
  };

  const mockForecast = {
    days: [
      { date: '2026-08-01', day_name: 'Sat', temp_max: 34, temp_min: 26, humidity: 80, rainfall: 12, weather_main: 'Rain', weather_icon_url: '' },
      { date: '2026-08-02', day_name: 'Sun', temp_max: 33, temp_min: 25, humidity: 75, rainfall: 3, weather_main: 'Clouds', weather_icon_url: '' }
    ]
  };

  const mockCrops = [
    { crop_name: 'Rice', ideal_temp_min: 20, ideal_temp_max: 35, rain_tolerance: 50, vulnerabilities: 'Blast fungus, stem borer' }
  ];

  const html = generateWeatherEmailHtml(mockWeather, mockForecast, mockCrops);
  assert.ok(html.includes('Daily Weather Report') || html.includes('Weather Report'), 'Should contain report title');
  assert.ok(html.includes('32'), 'Should contain temperature');
  assert.ok(html.includes('Rice'), 'Should contain crop name');
});

test('generateStormAlertEmailHtml should produce valid HTML with storm data', () => {
  const { generateStormAlertEmailHtml } = require('../services/notificationService');

  const mockAssessment = {
    overallRisk: 'WARNING',
    maxWindSpeed: 72,
    totalForecastRain: 120,
    signals: [
      {
        date: '2026-08-03',
        dayName: 'Mon',
        type: 'TROPICAL_STORM',
        severity: 'WARNING',
        windSpeed: 72,
        rainfall: 60,
        title: '🟠 Signal #2 / Tropical Storm (72 km/h wind)',
        description: 'Gale-force winds forecasted.',
        actions: ['Harvest mature crops immediately.', 'Clear drainage canals.']
      }
    ],
    emergencyChecklist: ['Secure structures', 'Monitor PAGASA'],
    farmPreparation: ['Harvest before landfall']
  };

  const mockCrops = [
    { crop_name: 'Corn', vulnerabilities: 'Lodging at flowering stage' }
  ];

  const html = generateStormAlertEmailHtml(mockAssessment, mockCrops);
  assert.ok(html.includes('STORM ALERT') || html.includes('Storm'), 'Should contain storm alert title');
  assert.ok(html.includes('WARNING'), 'Should contain risk level');
  assert.ok(html.includes('Corn'), 'Should contain crop name');
});

// ────────────────────────────────────────
// 3. Scheduler Tests
// ────────────────────────────────────────

console.log('\n🕐 Scheduler Tests');
console.log('──────────────────');

test('Scheduler should export startSchedulers', () => {
  const scheduler = require('../services/notificationScheduler');
  assert.strictEqual(typeof scheduler.startSchedulers, 'function');
});

test('Scheduler should export stopSchedulers', () => {
  const scheduler = require('../services/notificationScheduler');
  assert.strictEqual(typeof scheduler.stopSchedulers, 'function');
});

// ────────────────────────────────────────
// 4. Typhoon Alert Service Integration Test
// ────────────────────────────────────────

console.log('\n🌀 Typhoon Alert Service Integration Tests');
console.log('───────────────────────────────────────────');

test('assessTyphoonRisk should return NONE for calm weather', () => {
  const { assessTyphoonRisk } = require('../services/typhoonAlertService');

  const calmForecast = [
    { day_name: 'Mon', date: '2026-08-04', temp_max: 31, temp_min: 24, humidity: 70, rainfall: 5, wind_speed: 12 },
    { day_name: 'Tue', date: '2026-08-05', temp_max: 32, temp_min: 25, humidity: 72, rainfall: 3, wind_speed: 10 }
  ];

  const result = assessTyphoonRisk(calmForecast);
  assert.strictEqual(result.overallRisk, 'NONE', 'Calm weather should return NONE');
});

test('assessTyphoonRisk should return WARNING for gale-force winds', () => {
  const { assessTyphoonRisk } = require('../services/typhoonAlertService');

  const stormForecast = [
    { day_name: 'Mon', date: '2026-08-04', temp_max: 30, temp_min: 24, humidity: 85, rainfall: 60, wind_speed: 70 }
  ];

  const result = assessTyphoonRisk(stormForecast);
  assert.ok(result.overallRisk === 'WARNING' || result.overallRisk === 'EMERGENCY', 'Should detect storm risk');
  assert.ok(result.signals.length > 0, 'Should have at least one signal');
});

test('assessTyphoonRisk should return EMERGENCY for destructive winds', () => {
  const { assessTyphoonRisk } = require('../services/typhoonAlertService');

  const emergencyForecast = [
    { day_name: 'Mon', date: '2026-08-04', temp_max: 28, temp_min: 22, humidity: 95, rainfall: 100, wind_speed: 100 }
  ];

  const result = assessTyphoonRisk(emergencyForecast);
  assert.strictEqual(result.overallRisk, 'EMERGENCY', 'Destructive winds should be EMERGENCY');
  assert.ok(result.emergencyChecklist.length > 0, 'Should have emergency checklist');
});

test('assessTyphoonRisk should handle empty forecast', () => {
  const { assessTyphoonRisk } = require('../services/typhoonAlertService');
  const result = assessTyphoonRisk([]);
  assert.strictEqual(result.overallRisk, 'NONE', 'Empty forecast should be NONE');
});

// ────────────────────────────────────────
// RESULTS SUMMARY
// ────────────────────────────────────────

console.log('\n══════════════════════════════');
console.log(`📊 Test Results: ${testsPassed} passed, ${testsFailed} failed`);
console.log('══════════════════════════════\n');

process.exit(testsFailed > 0 ? 1 : 0);
