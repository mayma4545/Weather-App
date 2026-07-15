/**
 * Evapotranspiration (ET0) Based Irrigation Scheduling Engine
 * Implements FAO-56 Hargreaves ET0 estimation and soil water balance modeling.
 */

/**
 * Approximate extraterrestrial radiation (Ra) in mm/day based on latitude and day of year.
 * @param {number} dayOfYear - 1 to 365
 * @param {number} latitude - Latitude in degrees (default 12.37 for Masbate)
 * @returns {number} Ra in mm/day equivalent evaporation
 */
function estimateRa(dayOfYear, latitude = 12.37) {
  const latRad = (latitude * Math.PI) / 180;
  const dr = 1 + 0.033 * Math.cos((2 * Math.PI * dayOfYear) / 365);
  const delta = 0.409 * Math.sin((2 * Math.PI * dayOfYear) / 365 - 1.39);
  const ws = Math.acos(-Math.tan(latRad) * Math.tan(delta));
  
  // Solar constant Gsc = 0.0820 MJ m-2 min-1
  // Conversion factor to mm/day is roughly 0.408 * Ra(MJ/m2/day)
  const RaMJ = (24 * 60 / Math.PI) * 0.0820 * dr * (
    ws * Math.sin(latRad) * Math.sin(delta) +
    Math.cos(latRad) * Math.cos(delta) * Math.sin(ws)
  );
  return 0.408 * RaMJ;
}

/**
 * Calculate reference evapotranspiration (ET0) using Hargreaves formula.
 * @param {number} tMax - Maximum daily temperature (°C)
 * @param {number} tMin - Minimum daily temperature (°C)
 * @param {number} dayOfYear - Day of year (1-365)
 * @param {number} latitude - Latitude in degrees
 * @returns {number} ET0 in mm/day
 */
function calculateET0(tMax, tMin, dayOfYear, latitude = 12.37) {
  const tMean = (tMax + tMin) / 2;
  const tempDiff = Math.max(0.1, tMax - tMin);
  const Ra = estimateRa(dayOfYear || 180, latitude);
  
  // Hargreaves equation: ET0 = 0.0023 * Ra * (Tmean + 17.8) * sqrt(Tmax - Tmin)
  const et0 = 0.0023 * Ra * (tMean + 17.8) * Math.sqrt(tempDiff);
  return Math.max(0.1, parseFloat(et0.toFixed(2)));
}

/**
 * Get FAO-56 crop coefficient (Kc) for a given crop and growth stage.
 * @param {string} cropName - Name of the crop
 * @param {string} growthStage - 'initial' | 'dev' | 'mid' | 'late' | 'vegetative' | 'flowering' | 'fruiting' | etc.
 * @returns {number} Kc value
 */
function getCropCoefficient(cropName, growthStage) {
  const stage = (growthStage || '').toLowerCase();
  let normalizedStage = 'mid';
  
  if (stage.includes('seedling') || stage.includes('initial') || stage.includes('germination') || stage.includes('emergence')) {
    normalizedStage = 'initial';
  } else if (stage.includes('dev') || stage.includes('tillering') || stage.includes('vegetative') || stage.includes('vine') || stage.includes('v6') || stage.includes('v12')) {
    normalizedStage = 'dev';
  } else if (stage.includes('mid') || stage.includes('flowering') || stage.includes('booting') || stage.includes('heading') || stage.includes('tasseling') || stage.includes('silking') || stage.includes('fruiting')) {
    normalizedStage = 'mid';
  } else if (stage.includes('late') || stage.includes('maturity') || stage.includes('grain fill') || stage.includes('harvest')) {
    normalizedStage = 'late';
  }

  const kcTable = {
    'rice': { initial: 1.05, dev: 1.10, mid: 1.20, late: 0.90 },
    'palay ir64': { initial: 1.05, dev: 1.10, mid: 1.20, late: 0.90 },
    'corn': { initial: 0.30, dev: 0.70, mid: 1.20, late: 0.35 },
    'corn (opv)': { initial: 0.30, dev: 0.70, mid: 1.20, late: 0.35 },
    'kangkong': { initial: 0.70, dev: 0.85, mid: 1.00, late: 0.90 },
    'tomato': { initial: 0.60, dev: 0.75, mid: 1.15, late: 0.80 },
    'eggplant': { initial: 0.60, dev: 0.75, mid: 1.05, late: 0.90 },
    'ampalaya': { initial: 0.50, dev: 0.80, mid: 1.05, late: 0.85 }
  };

  const cropKey = Object.keys(kcTable).find(k => (cropName || '').toLowerCase().includes(k)) || 'default';
  const values = kcTable[cropKey] || { initial: 0.50, dev: 0.75, mid: 1.00, late: 0.80 };
  
  return values[normalizedStage] || 1.0;
}

/**
 * Get available water holding capacity of soil in mm per meter of root depth.
 * @param {string} soilType - 'Clay', 'Clay Loam', 'Silt Loam', 'Sandy Loam', 'Sandy'
 * @returns {number} Water capacity in mm/m
 */
function getSoilWaterCapacity(soilType) {
  const type = (soilType || '').toLowerCase();
  if (type.includes('clay loam')) return 160;
  if (type.includes('clay')) return 180;
  if (type.includes('silt')) return 200;
  if (type.includes('sandy loam')) return 120;
  if (type.includes('sandy')) return 80;
  return 140; // Default loam
}

/**
 * Main function to generate irrigation advice based on current and forecasted weather.
 * @param {Object} weatherData - Current weather { temperature, temp_max, temp_min, humidity, rainfall }
 * @param {Array} forecastDays - Array of forecast day objects { temp_max, temp_min, rainfall, humidity }
 * @param {string} cropName - Crop name
 * @param {string} growthStage - Current growth stage
 * @param {string} soilType - Soil texture
 * @returns {Object} Recommendation report
 */
function getIrrigationRecommendation(weatherData = {}, forecastDays = [], cropName = 'Crop', growthStage = 'mid', soilType = 'Loam') {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24)) || 180;

  const tMax = weatherData.temp_max || (weatherData.temperature ? weatherData.temperature + 3 : 32);
  const tMin = weatherData.temp_min || (weatherData.temperature ? weatherData.temperature - 4 : 24);
  
  const et0 = calculateET0(tMax, tMin, dayOfYear);
  const kc = getCropCoefficient(cropName, growthStage);
  const cropET = parseFloat((et0 * kc).toFixed(2));
  
  const soilCap = getSoilWaterCapacity(soilType);
  
  // Assume effective root zone depth of 0.4m for vegetables/rice, 0.8m for corn
  const rootDepth = (cropName.toLowerCase().includes('corn')) ? 0.8 : 0.4;
  const totalSoilWater = soilCap * rootDepth;

  // Effective rainfall today (80% of actual rain above 5mm, capped by soil capacity)
  const todayRain = parseFloat(weatherData.rainfall || 0);
  const effectiveRain = todayRain > 5 ? Math.min(totalSoilWater, (todayRain - 5) * 0.8) : 0;
  
  // Calculate upcoming 3-day forecasted rainfall
  let next3DaysRain = 0;
  if (Array.isArray(forecastDays)) {
    forecastDays.slice(0, 3).forEach(d => {
      next3DaysRain += parseFloat(d.rainfall || 0);
    });
  }

  const netWaterBalance = parseFloat((effectiveRain - cropET).toFixed(2));
  let recommendation = "";
  let irrigationNeeded = false;
  let amountMm = 0;
  let urgency = 'none';

  if (next3DaysRain > 25) {
    recommendation = `Suspend irrigation. Forecasted heavy rainfall (${next3DaysRain.toFixed(1)}mm over next 3 days) will exceed crop water requirements. Ensure proper field drainage.`;
    irrigationNeeded = false;
    urgency = 'none';
  } else if (todayRain >= cropET) {
    recommendation = `No irrigation needed today. Today's rainfall (${todayRain}mm) meets or exceeds daily crop water loss (${cropET}mm ETc).`;
    irrigationNeeded = false;
    urgency = 'none';
  } else {
    const deficit = parseFloat((cropET - effectiveRain).toFixed(1));
    amountMm = deficit;
    
    if (deficit > 6) {
      urgency = 'high';
      irrigationNeeded = true;
      recommendation = `Apply approximately ${deficit}mm of water immediately. High atmospheric evaporative demand (${cropET}mm/day) is depleting root zone moisture in ${soilType} soil.`;
    } else if (deficit > 2) {
      urgency = 'moderate';
      irrigationNeeded = true;
      recommendation = `Apply ${deficit}mm of water tomorrow morning or evening to maintain optimal root zone moisture for ${cropName} during ${growthStage} stage.`;
    } else {
      urgency = 'low';
      irrigationNeeded = false;
      recommendation = `Soil moisture is currently stable. Monitor field condition; daily crop water consumption is light (${cropET}mm/day).`;
    }
  }

  return {
    et0,
    kc,
    cropET,
    effectiveRainfall: parseFloat(effectiveRain.toFixed(2)),
    soilCapacity: soilCap,
    netWaterBalance,
    next3DaysRain: parseFloat(next3DaysRain.toFixed(1)),
    irrigationNeeded,
    amountMm,
    urgency,
    recommendation,
    soilType,
    cropName,
    growthStage
  };
}

module.exports = {
  calculateET0,
  getCropCoefficient,
  getSoilWaterCapacity,
  getIrrigationRecommendation
};
