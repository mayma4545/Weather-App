/**
 * Epidemiological Disease Risk Forecasting Engine
 * Evaluates weather conditions against pathogen development thresholds to predict disease outbreak risks.
 */

/**
 * Assess disease risks for a given crop based on current weather and 5-day forecast.
 * @param {Object} weatherData - Current weather { temperature, humidity, wind_speed, rainfall }
 * @param {Array} forecastDays - Array of forecast day objects { temp_max, temp_min, humidity, rainfall, wind_speed }
 * @param {string} cropName - Crop being monitored
 * @param {string} growthStage - Current growth stage
 * @returns {Array} Array of disease risk objects
 */
function assessDiseaseRisks(weatherData = {}, forecastDays = [], cropName = 'General', growthStage = 'vegetative') {
  const crop = (cropName || '').toLowerCase();
  const stage = (growthStage || '').toLowerCase();
  
  const currentTemp = parseFloat(weatherData.temperature || 28);
  const currentHum = parseFloat(weatherData.humidity || 75);
  const currentRain = parseFloat(weatherData.rainfall || 0);
  const currentWind = parseFloat(weatherData.wind_speed || 5);

  let maxHum = currentHum;
  let maxRain = currentRain;
  let maxWind = currentWind;
  let avgTemp = currentTemp;
  let minTemp = currentTemp - 4;
  let wetDaysCount = currentRain > 2 ? 1 : 0;

  if (Array.isArray(forecastDays) && forecastDays.length > 0) {
    let totalTemp = currentTemp;
    forecastDays.forEach(d => {
      if (d.humidity && d.humidity > maxHum) maxHum = d.humidity;
      if (d.rainfall && d.rainfall > maxRain) maxRain = d.rainfall;
      if (d.wind_speed && d.wind_speed > maxWind) maxWind = d.wind_speed;
      if (d.rainfall && d.rainfall > 2) wetDaysCount++;
      if (d.temp_min && d.temp_min < minTemp) minTemp = d.temp_min;
      const dayMean = d.temp_max && d.temp_min ? (d.temp_max + d.temp_min) / 2 : currentTemp;
      totalTemp += dayMean;
    });
    avgTemp = totalTemp / (forecastDays.length + 1);
  }

  const risks = [];

  // 1. Rice Blast (Magnaporthe oryzae) — relevant for Rice / Palay
  if (crop.includes('rice') || crop.includes('palay') || crop.includes('general')) {
    let score = 20;
    let triggers = [];
    if (maxHum > 88) { score += 40; triggers.push('High relative humidity (>88%)'); }
    if (avgTemp >= 24 && avgTemp <= 29) { score += 25; triggers.push('Optimal fungal growth temperature (24-29°C)'); }
    if (wetDaysCount >= 2) { score += 15; triggers.push('Multiple wet days promoting spore germination'); }
    if (stage.includes('flowering') || stage.includes('heading') || stage.includes('booting')) {
      score = Math.min(100, Math.round(score * 1.3));
      triggers.push('Vulnerable reproductive growth stage (Panicle/Neck blast susceptibility)');
    }

    let level = 'LOW';
    if (score >= 80) level = 'CRITICAL';
    else if (score >= 60) level = 'HIGH';
    else if (score >= 40) level = 'MODERATE';

    risks.push({
      disease: 'Rice Blast',
      pathogen: 'Magnaporthe oryzae',
      cropAffected: 'Rice / Palay',
      riskLevel: level,
      riskScore: Math.min(100, score),
      triggers: triggers.join('; ') || 'Normal weather conditions',
      recommendation: level === 'HIGH' || level === 'CRITICAL'
        ? 'URGENT: High risk of Rice Blast. Check lower leaves for diamond-shaped lesions immediately. Avoid nitrogen top-dressing during high humidity periods. Apply preventive organic copper fungicide or tricyclazole if lesions appear.'
        : 'Maintain standard field monitoring. Keep field drainage clear to avoid excessive canopy humidity.',
      preventiveMeasures: [
        'Use resistant rice varieties (e.g., NSIC Rc222, Rc160)',
        'Avoid excessive nitrogen fertilizer application',
        'Maintain continuous water depth of 3-5cm during vegetative stage',
        'Ensure balanced silicon and potassium soil nutrition'
      ]
    });

    // Bacterial Leaf Blight (Xanthomonas oryzae pv. oryzae)
    let blbScore = 15;
    let blbTriggers = [];
    if (maxRain > 15 || wetDaysCount >= 2) { blbScore += 45; blbTriggers.push('Heavy rainfall creating leaf water-soaking'); }
    if (maxWind > 20) { blbScore += 40; blbTriggers.push('Strong winds (>20 km/h) causing leaf wounding and bacterial entry'); }
    
    let blbLevel = 'LOW';
    if (blbScore >= 75) blbLevel = 'HIGH';
    else if (blbScore >= 45) blbLevel = 'MODERATE';

    risks.push({
      disease: 'Bacterial Leaf Blight (BLB)',
      pathogen: 'Xanthomonas oryzae pv. oryzae',
      cropAffected: 'Rice / Palay',
      riskLevel: blbLevel,
      riskScore: Math.min(100, blbScore),
      triggers: blbTriggers.join('; ') || 'Calm, dry winds',
      recommendation: blbLevel === 'HIGH'
        ? 'WARNING: Wind-driven heavy rains favor BLB infection. Do NOT trim leaf tips during transplanting. Drain fields temporarily if water is too deep. Apply copper-based bactericides if water-soaked streaks appear on leaf margins.'
        : 'Wind speeds and rainfall are within safe limits for leaf integrity.',
      preventiveMeasures: [
        'Avoid clipping seedling leaf tips before transplanting',
        'Use certified disease-free seeds',
        'Implement proper weed sanitation along dikes and irrigation canals'
      ]
    });
  }

  // 2. Corn Downy Mildew (Peronosclerospora philippinensis)
  if (crop.includes('corn') || crop.includes('general')) {
    let dmScore = 20;
    let dmTriggers = [];
    if (minTemp >= 20 && minTemp <= 25) { dmScore += 35; dmTriggers.push('Favorable cool night temperatures (20-25°C)'); }
    if (maxHum > 85) { dmScore += 35; dmTriggers.push('High morning dew/humidity (>85%)'); }
    if (stage.includes('seedling') || stage.includes('emergence') || stage.includes('initial')) {
      dmScore += 20;
      dmTriggers.push('Highly susceptible seedling stage (first 3-4 weeks)');
    }

    let dmLevel = 'LOW';
    if (dmScore >= 75) dmLevel = 'HIGH';
    else if (dmScore >= 50) dmLevel = 'MODERATE';

    risks.push({
      disease: 'Philippine Corn Downy Mildew',
      pathogen: 'Peronosclerospora philippinensis',
      cropAffected: 'Corn / Mais',
      riskLevel: dmLevel,
      riskScore: Math.min(100, dmScore),
      triggers: dmTriggers.join('; ') || 'Dry conditions unfavorable for sporulation',
      recommendation: dmLevel === 'HIGH'
        ? 'HIGH RISK: Morning dew and cool night temperatures strongly favor downy mildew spore release. Inspect young corn seedlings for chlorotic stripes and white downy growth on undersides. Rogue and bury infected plants immediately.'
        : 'Risk is manageable. Continue routine early morning field checks.',
      preventiveMeasures: [
        'Treat seeds with metalaxyl or mefenoxam fungicide prior to planting',
        'Plant resistant hybrids or open-pollinated varieties (OPV)',
        'Synchronize planting dates within the community to avoid overlapping crop cycles'
      ]
    });
  }

  // 3. Vegetable Late Blight & Fungal Leaf Spot (Tomato / Eggplant / Kangkong / Ampalaya)
  if (crop.includes('tomato') || crop.includes('eggplant') || crop.includes('ampalaya') || crop.includes('kangkong') || crop.includes('general')) {
    let lbScore = 25;
    let lbTriggers = [];
    if (maxHum > 88 || wetDaysCount >= 2) { lbScore += 45; lbTriggers.push('High relative humidity and wet leaf surfaces'); }
    if (avgTemp >= 18 && avgTemp <= 27) { lbScore += 30; lbTriggers.push('Moderate temperatures ideal for fungal spore germination'); }

    let lbLevel = 'LOW';
    if (lbScore >= 75) lbLevel = 'HIGH';
    else if (lbScore >= 50) lbLevel = 'MODERATE';

    risks.push({
      disease: 'Fungal Leaf Spot / Late Blight',
      pathogen: 'Phytophthora infestans / Cercospora spp.',
      cropAffected: cropName,
      riskLevel: lbLevel,
      riskScore: Math.min(100, lbScore),
      triggers: lbTriggers.join('; ') || 'Low humidity limits fungal spread',
      recommendation: lbLevel === 'HIGH'
        ? 'CAUTION: Wet canopy conditions favor rapid blight spread. Improve air circulation by pruning lower yellowing leaves. Avoid overhead sprinkler irrigation; switch to drip or base watering. Apply preventive bio-fungicide (Trichoderma or Bacillus subtilis).'
        : 'Canopy moisture is within safe levels. Ensure adequate plant spacing.',
      preventiveMeasures: [
        'Use drip irrigation or water at the base of plants',
        'Stake and prune vines to improve airflow and solar exposure',
        'Practice 2-3 year crop rotation with non-solanaceous crops'
      ]
    });
  }

  // 4. General Root Rot (all crops during continuous rainfall)
  if (wetDaysCount >= 3 || maxRain > 50) {
    risks.push({
      disease: 'Fungal & Bacterial Root Rot',
      pathogen: 'Pythium spp. / Fusarium spp. / Ralstonia solanacearum',
      cropAffected: cropName,
      riskLevel: maxRain > 80 ? 'CRITICAL' : 'HIGH',
      riskScore: maxRain > 80 ? 95 : 75,
      triggers: `Continuous heavy rainfall (${wetDaysCount} wet days, max ${maxRain}mm/day) causing soil waterlogging`,
      recommendation: 'CRITICAL WARNING: Prolonged soil saturation suffocates roots and promotes soil-borne water mold infection. Immediately clear field drainage canals to evacuate standing water. Do NOT apply fertilizers to waterlogged soil.',
      preventiveMeasures: [
        'Construct raised planting beds (20-30cm height) for vegetables in wet season',
        'Incorporate well-decomposed organic compost to improve soil drainage',
        'Apply bio-fungicides like Trichoderma harzianum during land preparation'
      ]
    });
  }

  return risks;
}

module.exports = { assessDiseaseRisks };
