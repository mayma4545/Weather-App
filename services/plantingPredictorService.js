/**
 * Safe to Plant Predictor Engine
 * Evaluates live weather forecasts against crop-specific agronomic thresholds
 * to generate a Planting Safety Index (%), risk level, factor breakdown, and actionable advice.
 */

const CROP_PROFILES = {
  'Rice': {
    id: 'Rice',
    name: 'Rice (Palay IR64)',
    category: 'Cereal',
    icon: 'rice',
    tempMin: 20,
    tempOptimalMin: 24,
    tempOptimalMax: 32,
    tempMax: 37,
    dailyRainMax: 80,
    totalRainMax: 200,
    humidityOptimalMin: 65,
    humidityOptimalMax: 88,
    windSpeedMax: 40,
    soilMoisturePreference: 'High',
    description: 'Requires ample water during transplanting. High heat above 35°C during early stage causes seedling stress.'
  },
  'Corn': {
    id: 'Corn',
    name: 'Corn (OPV / Hybrid)',
    category: 'Cereal',
    icon: 'corn',
    tempMin: 18,
    tempOptimalMin: 22,
    tempOptimalMax: 30,
    tempMax: 35,
    dailyRainMax: 50,
    totalRainMax: 140,
    humidityOptimalMin: 55,
    humidityOptimalMax: 80,
    windSpeedMax: 35,
    soilMoisturePreference: 'Moderate',
    description: 'Sensitive to waterlogging during germination. Requires warm, well-drained soil.'
  },
  'Tomato': {
    id: 'Tomato',
    name: 'Tomato (Kamatis)',
    category: 'Vegetable',
    icon: 'tomato',
    tempMin: 18,
    tempOptimalMin: 21,
    tempOptimalMax: 29,
    tempMax: 34,
    dailyRainMax: 25,
    totalRainMax: 75,
    humidityOptimalMin: 50,
    humidityOptimalMax: 75,
    windSpeedMax: 30,
    soilMoisturePreference: 'Moderate-Low',
    description: 'High humidity and rainfall promote fungal leaf blight and blossom rot. Prefers moderate warmth.'
  },
  'Eggplant': {
    id: 'Eggplant',
    name: 'Eggplant (Talong)',
    category: 'Vegetable',
    icon: 'eggplant',
    tempMin: 20,
    tempOptimalMin: 24,
    tempOptimalMax: 32,
    tempMax: 38,
    dailyRainMax: 40,
    totalRainMax: 110,
    humidityOptimalMin: 55,
    humidityOptimalMax: 82,
    windSpeedMax: 35,
    soilMoisturePreference: 'Moderate',
    description: 'Warm-season crop with good heat tolerance. Excessive flooding damages seed bed roots.'
  },
  'Ampalaya': {
    id: 'Ampalaya',
    name: 'Ampalaya (Bitter Gourd)',
    category: 'Vegetable',
    icon: 'ampalaya',
    tempMin: 20,
    tempOptimalMin: 24,
    tempOptimalMax: 34,
    tempMax: 38,
    dailyRainMax: 60,
    totalRainMax: 160,
    humidityOptimalMin: 60,
    humidityOptimalMax: 85,
    windSpeedMax: 35,
    soilMoisturePreference: 'Moderate',
    description: 'Thrives in warm humid conditions. Strong trellis protection recommended if winds exceed 30 km/h.'
  },
  'Kangkong': {
    id: 'Kangkong',
    name: 'Kangkong (Water Spinach)',
    category: 'Leafy Green',
    icon: 'kangkong',
    tempMin: 18,
    tempOptimalMin: 24,
    tempOptimalMax: 35,
    tempMax: 40,
    dailyRainMax: 120,
    totalRainMax: 300,
    humidityOptimalMin: 60,
    humidityOptimalMax: 95,
    windSpeedMax: 45,
    soilMoisturePreference: 'Very High',
    description: 'Extremely resilient to high rainfall and moist conditions. Excellent choice for wet season.'
  },
  'Onion': {
    id: 'Onion',
    name: 'Onion (Sibuyas)',
    category: 'Bulb',
    icon: 'onion',
    tempMin: 13,
    tempOptimalMin: 18,
    tempOptimalMax: 26,
    tempMax: 32,
    dailyRainMax: 20,
    totalRainMax: 50,
    humidityOptimalMin: 45,
    humidityOptimalMax: 70,
    windSpeedMax: 28,
    soilMoisturePreference: 'Low',
    description: 'Highly sensitive to excessive water. Waterlogged soil causes bulb rot and seedling decay.'
  },
  'Squash': {
    id: 'Squash',
    name: 'Squash (Kalabasa)',
    category: 'Vegetable',
    icon: 'squash',
    tempMin: 18,
    tempOptimalMin: 22,
    tempOptimalMax: 31,
    tempMax: 36,
    dailyRainMax: 45,
    totalRainMax: 130,
    humidityOptimalMin: 55,
    humidityOptimalMax: 80,
    windSpeedMax: 35,
    soilMoisturePreference: 'Moderate',
    description: 'Needs warm soil for seed germination. Susceptible to powdery mildew in high humidity.'
  },
  'Sweet Potato': {
    id: 'Sweet Potato',
    name: 'Sweet Potato (Kamote)',
    category: 'Tuber',
    icon: 'sweet_potato',
    tempMin: 18,
    tempOptimalMin: 22,
    tempOptimalMax: 30,
    tempMax: 37,
    dailyRainMax: 55,
    totalRainMax: 150,
    humidityOptimalMin: 55,
    humidityOptimalMax: 85,
    windSpeedMax: 40,
    soilMoisturePreference: 'Moderate',
    description: 'Resilient root crop. Avoid waterlogged fields during initial vine planting stage.'
  },
  'Pepper': {
    id: 'Pepper',
    name: 'Pepper (Siling Labuyo)',
    category: 'Vegetable',
    icon: 'pepper',
    tempMin: 18,
    tempOptimalMin: 22,
    tempOptimalMax: 30,
    tempMax: 36,
    dailyRainMax: 30,
    totalRainMax: 90,
    humidityOptimalMin: 50,
    humidityOptimalMax: 75,
    windSpeedMax: 30,
    soilMoisturePreference: 'Moderate',
    description: 'Sensitive to flower drop under extreme heat (>35°C) or heavy downpours.'
  }
};

/**
 * Evaluates safe-to-plant conditions for a given crop and forecast data.
 * @param {string} cropKey - Key matching crop profile (e.g. 'Rice', 'Tomato')
 * @param {Object} forecastData - Current/Forecast weather payload
 * @param {Array} alertList - Active severe weather alerts
 * @returns {Object} Comprehensive evaluation result
 */
function evaluatePlantingSafety(cropKey, forecastData = {}, alertList = []) {
  const crop = CROP_PROFILES[cropKey] || CROP_PROFILES['Rice'];

  // Extract weather metrics safely
  const days = Array.isArray(forecastData.days) ? forecastData.days : [];
  const currentTemp = parseFloat(forecastData.currentTemp || forecastData.temp || 28);
  const currentHum = parseFloat(forecastData.currentHumidity || forecastData.humidity || 75);
  const currentWind = parseFloat(forecastData.currentWindSpeed || forecastData.windSpeed || 10);

  let maxTemp = currentTemp;
  let minTemp = currentTemp - 3;
  let maxDailyRain = parseFloat(forecastData.currentRain || 0);
  let totalForecastRain = maxDailyRain;
  let maxWindSpeed = currentWind;
  let avgHumidity = currentHum;

  if (days.length > 0) {
    let humSum = 0;
    let tempMaxes = [];
    let tempMins = [];
    let rainVals = [];
    let windVals = [];

    days.forEach(d => {
      if (d.temp_max != null) tempMaxes.push(parseFloat(d.temp_max));
      if (d.temp_min != null) tempMins.push(parseFloat(d.temp_min));
      if (d.rainfall != null) rainVals.push(parseFloat(d.rainfall));
      if (d.wind_speed != null) windVals.push(parseFloat(d.wind_speed));
      if (d.humidity != null) humSum += parseFloat(d.humidity);
    });

    if (tempMaxes.length) maxTemp = Math.max(...tempMaxes);
    if (tempMins.length) minTemp = Math.min(...tempMins);
    if (rainVals.length) {
      maxDailyRain = Math.max(...rainVals);
      totalForecastRain = rainVals.reduce((a, b) => a + b, 0);
    }
    if (windVals.length) maxWindSpeed = Math.max(...windVals);
    if (humSum > 0) avgHumidity = Math.round(humSum / days.length);
  }

  // Factor 1: Temperature Score (0-100)
  let tempScore = 100;
  let tempStatus = 'Ideal';
  let tempMessage = `Forecast temp (${maxTemp}°C) is within ideal range (${crop.tempOptimalMin}°C - ${crop.tempOptimalMax}°C).`;

  if (maxTemp > crop.tempMax) {
    tempScore = Math.max(10, 100 - (maxTemp - crop.tempMax) * 20);
    tempStatus = 'Danger';
    tempMessage = `Excessive heat (${maxTemp}°C) exceeds ${crop.name} tolerance threshold (${crop.tempMax}°C). Risk of seed drying and heat stress.`;
  } else if (maxTemp > crop.tempOptimalMax) {
    tempScore = Math.max(50, 100 - (maxTemp - crop.tempOptimalMax) * 10);
    tempStatus = 'Caution';
    tempMessage = `Temperature (${maxTemp}°C) is above optimal (${crop.tempOptimalMax}°C). Provide shade mulching or pre-irrigate.`;
  } else if (minTemp < crop.tempMin) {
    tempScore = Math.max(20, 100 - (crop.tempMin - minTemp) * 15);
    tempStatus = 'Caution';
    tempMessage = `Night temp drop (${minTemp}°C) below minimum threshold (${crop.tempMin}°C) will slow germination.`;
  }

  // Factor 2: Rainfall & Moisture Score (0-100)
  let rainScore = 100;
  let rainStatus = 'Ideal';
  let rainMessage = `Rainfall forecast (${maxDailyRain.toFixed(1)}mm peak day, ${totalForecastRain.toFixed(1)}mm 5-day total) is safe.`;

  if (maxDailyRain > crop.dailyRainMax) {
    rainScore = Math.max(0, 100 - (maxDailyRain - crop.dailyRainMax) * 3);
    rainStatus = 'Danger';
    rainMessage = `Downpour forecast (${maxDailyRain.toFixed(1)}mm/day) exceeds ${crop.name} rain limit (${crop.dailyRainMax}mm/day). High risk of seed wash-off and waterlogging.`;
  } else if (totalForecastRain > crop.totalRainMax) {
    rainScore = Math.max(30, 100 - (totalForecastRain - crop.totalRainMax) * 1.5);
    rainStatus = 'Danger';
    rainMessage = `Cumulative 5-day rain (${totalForecastRain.toFixed(1)}mm) exceeds crop limit (${crop.totalRainMax}mm). Risk of root suffocation.`;
  } else if (maxDailyRain > crop.dailyRainMax * 0.7 || totalForecastRain > crop.totalRainMax * 0.7) {
    rainScore = 65;
    rainStatus = 'Caution';
    rainMessage = `Moderate rainfall (${maxDailyRain.toFixed(1)}mm/day) expected. Ensure field drainage channels are clear before planting.`;
  }

  // Factor 3: Wind & Environmental Stress Score (0-100)
  let envScore = 100;
  let envStatus = 'Ideal';
  let envMessage = `Wind speeds (${maxWindSpeed.toFixed(1)} km/h) and humidity (${avgHumidity}%) present low mechanical stress.`;

  if (maxWindSpeed > crop.windSpeedMax) {
    envScore = Math.max(20, 100 - (maxWindSpeed - crop.windSpeedMax) * 4);
    envStatus = 'Caution';
    envMessage = `Strong winds (${maxWindSpeed.toFixed(1)} km/h) exceed crop wind tolerance (${crop.windSpeedMax} km/h). Stake young seedlings.`;
  }

  // Severe Alert Penalties
  let alertPenalty = 0;
  let activeAlertDetails = [];
  if (Array.isArray(alertList) && alertList.length > 0) {
    alertList.forEach(alert => {
      const title = (alert.title || alert.type || '').toLowerCase();
      if (title.includes('typhoon') || title.includes('storm') || title.includes('flood') || title.includes('heavy rain')) {
        alertPenalty += 40;
        activeAlertDetails.push(`Severe Warning: ${alert.title || alert.type || 'Storm Warning'}`);
      } else if (title.includes('heat') || title.includes('drought')) {
        alertPenalty += 25;
        activeAlertDetails.push(`Severe Warning: ${alert.title || alert.type || 'Heat Warning'}`);
      }
    });
  }

  // Overall Planting Safety Index (%)
  let safetyIndex = Math.round(
    (tempScore * 0.40) + (rainScore * 0.40) + (envScore * 0.20) - alertPenalty
  );
  safetyIndex = Math.max(0, Math.min(100, safetyIndex));

  // Risk Classification
  let riskLevel = 'OPTIMAL'; // OPTIMAL, CAUTION, HIGH_RISK
  let trafficLight = 'GREEN';
  let verdictTitle = '';
  let verdictDesc = '';
  let recommendations = [];

  if (safetyIndex >= 75) {
    riskLevel = 'OPTIMAL';
    trafficLight = 'GREEN';
    verdictTitle = `GREEN: OPTIMAL PLANTING WINDOW (${safetyIndex}% SAFETY INDEX)`;
    verdictDesc = `Weather outlook for ${crop.name} is highly favorable over the next 5 days. Low risk of weather damage.`;
    recommendations = [
      `Proceed with field preparation and seed germination for ${crop.name}.`,
      `Optimal soil temperature (${maxTemp}°C) supports fast root emergence.`,
      `Maintain standard moisture management and inspect drainage canals.`
    ];
  } else if (safetyIndex >= 50) {
    riskLevel = 'CAUTION';
    trafficLight = 'YELLOW';
    verdictTitle = `YELLOW: PLANT WITH PRECAUTION (${safetyIndex}% SAFETY INDEX)`;
    verdictDesc = `Moderate risk factors detected for ${crop.name}. Planting is feasible with precautionary field management.`;
    recommendations = [
      tempStatus === 'Caution' ? `Mulch seed beds to reduce soil surface temperature and moisture evaporation.` : `Monitor local rainfall before sowing sensitive seeds.`,
      rainStatus === 'Caution' ? `Clear all field perimeter drainage ditches to prevent standing water.` : `Pre-irrigate soil prior to sowing.`,
      `Check weather forecasts daily for sudden tropical depression formation.`
    ];
  } else {
    riskLevel = 'HIGH_RISK';
    trafficLight = 'RED';
    verdictTitle = `RED: DELAY PLANTING BATCH (${safetyIndex}% SAFETY INDEX)`;
    verdictDesc = `Unfavorable weather conditions for ${crop.name}. Sowing now risks seed rot, wash-out, or severe germination failure.`;
    recommendations = [
      `Postpone sowing or transplanting until the weather window stabilizes.`,
      rainStatus === 'Danger' ? `Heavy rainfall forecast (${maxDailyRain.toFixed(1)}mm/day) will wash out seedbeds and cause root rot.` : `Extreme heat (${maxTemp}°C) will scorch emerging seedlings.`,
      `Keep seeds in sheltered nursery containers until risk index improves above 75%.`
    ];
  }

  return {
    cropKey,
    crop: {
      name: crop.name,
      category: crop.category,
      icon: crop.icon,
      description: crop.description,
      soilMoisturePreference: crop.soilMoisturePreference
    },
    safetyIndex,
    riskLevel,
    trafficLight,
    verdictTitle,
    verdictDesc,
    metrics: {
      maxTemp,
      minTemp,
      maxDailyRain,
      totalForecastRain,
      maxWindSpeed,
      avgHumidity
    },
    factors: {
      temperature: { score: Math.round(tempScore), status: tempStatus, message: tempMessage },
      rainfall: { score: Math.round(rainScore), status: rainStatus, message: rainMessage },
      environment: { score: Math.round(envScore), status: envStatus, message: envMessage }
    },
    activeAlerts: activeAlertDetails,
    recommendations
  };
}

/**
 * Returns list of available crop profiles for UI dropdowns/cards.
 */
function getCropProfiles() {
  return Object.keys(CROP_PROFILES).map(key => ({
    key,
    ...CROP_PROFILES[key]
  }));
}

module.exports = {
  CROP_PROFILES,
  evaluatePlantingSafety,
  getCropProfiles
};
