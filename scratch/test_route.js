/* End-to-end: mount the real router with a stubbed farmer session and hit the
   AI recommendations route exactly like the farmer page does. */
require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());
app.use((req, _res, next) => {
  req.session = { userId: 1, userRole: 'Agriculturist', userFullName: 'Test Farmer' };
  next();
});
app.use('/', require('../routes/index'));

const server = app.listen(4996, async () => {
  console.log('Harness on :4996\n');
  try {
    const fRes = await fetch('http://localhost:4996/api/weather/forecast');
    const liveForecast = await fRes.json();

    const res = await fetch('http://localhost:4996/api/weather/predict-planting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cropKey: 'Rice', forecastData: liveForecast, language: 'english' })
    });
    console.log('HTTP status:', res.status);
    const data = await res.json();
    console.log('recommendations_source:', data.recommendations_source);
    console.log('recommendations_error:', data.recommendations_error || '(none)');
    console.log('\nRecommendations:');
    (data.recommendations || []).forEach((r, i) => console.log(`  ${i + 1}. ${r}`));
  } catch (e) {
    console.error('ERR:', e.message);
  } finally {
    server.close(() => process.exit(0));
  }
});
