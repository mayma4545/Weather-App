const { evaluatePlantingSafety, getCropProfiles } = require('../services/plantingPredictorService');

console.log('Testing Crop Profiles...');
const profiles = getCropProfiles();
console.log(`Found ${profiles.length} crop profiles.`);

console.log('\nTesting Prediction Engine for Rice...');
const riceEval = evaluatePlantingSafety('Rice', {
  currentTemp: 28,
  currentHumidity: 75,
  days: [
    { temp_max: 31, temp_min: 24, rainfall: 15, humidity: 78, wind_speed: 12 },
    { temp_max: 32, temp_min: 25, rainfall: 20, humidity: 80, wind_speed: 15 },
    { temp_max: 30, temp_min: 23, rainfall: 10, humidity: 75, wind_speed: 10 }
  ]
});
console.log('Rice Result:', JSON.stringify(riceEval, null, 2));

console.log('\nTesting Prediction Engine for Tomato under Heavy Rain...');
const tomatoEval = evaluatePlantingSafety('Tomato', {
  currentTemp: 29,
  currentHumidity: 85,
  days: [
    { temp_max: 32, temp_min: 25, rainfall: 45, humidity: 90, wind_speed: 25 },
    { temp_max: 31, temp_min: 24, rainfall: 50, humidity: 92, wind_speed: 30 }
  ]
});
console.log('Tomato Result:', JSON.stringify(tomatoEval, null, 2));
