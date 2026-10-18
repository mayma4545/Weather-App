/* Quick smoke test for the OpenCode Zen recommendations model. */
require('dotenv').config();
const { generateFieldRecommendations, isConfigured } = require('../services/geminiService');

(async () => {
  console.log('Configured:', isConfigured());
  console.log('Model:', process.env.GEMINI_MODEL || '(default) gemini-flash-lite-latest');

  const evaluation = {
    cropKey: 'Rice',
    crop: { name: 'Rice' },
    userCropContext: 'Wet season rice, tillering stage',
    safetyIndex: 68,
    trafficLight: 'YELLOW',
    riskLevel: 'MODERATE',
    verdictTitle: 'Caution advised',
    metrics: {
      currentTemp: 30,
      currentHumidity: 85,
      rainfallNext3DaysMm: 60,
      windSpeedKmh: 18
    },
    factors: {
      rain: { status: 'HIGH', message: 'Heavy rain expected over the next 3 days.' },
      humidity: { status: 'HIGH', message: 'High humidity favours disease.' }
    },
    activeAlerts: []
  };

  try {
    const recs = await generateFieldRecommendations(evaluation, { language: 'english' });
    console.log('\n✅ Got', recs.length, 'recommendations:\n');
    recs.forEach((r, i) => console.log(`${i + 1}. ${r}`));
  } catch (err) {
    console.error('\n❌ FAILED:', err.message);
    process.exitCode = 1;
  }
})();
