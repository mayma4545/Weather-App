/**
 * Dynamic Growing Degree Day (GDD) Stage Tracker Engine
 * Replaces simple calendar-day growth stages with heat-unit accumulation modeling.
 */

/**
 * Calculate daily Growing Degree Days (GDD).
 * @param {number} tMax - Daily maximum temperature (°C)
 * @param {number} tMin - Daily minimum temperature (°C)
 * @param {number} tBase - Base temperature threshold (°C, default 10°C for Rice/Corn)
 * @param {number} tUpper - Upper temperature cutoff (°C, default 40°C)
 * @returns {number} Daily GDD heat units
 */
function calculateDailyGDD(tMax, tMin, tBase = 10, tUpper = 40) {
  const maxTemp = Math.min(parseFloat(tMax || 32), tUpper);
  const minTemp = Math.max(parseFloat(tMin || 24), tBase);
  const meanTemp = (maxTemp + minTemp) / 2;
  const gdd = Math.max(0, meanTemp - tBase);
  return parseFloat(gdd.toFixed(1));
}

/**
 * Estimate accumulated GDD from planting date to today.
 * Uses daily average GDD for Masbate tropical climate (~18.5 GDD/day for Tbase=10).
 * @param {string|Date} plantingDate - Planting date string (YYYY-MM-DD)
 * @param {number} avgDailyGDD - Average daily GDD rate (default 18.5)
 * @returns {number} Estimated total accumulated GDD
 */
function estimateAccumulatedGDD(plantingDate, avgDailyGDD = 18.5) {
  if (!plantingDate) return 0;
  const pDate = new Date(plantingDate);
  const now = new Date();
  const diffTime = now.getTime() - pDate.getTime();
  const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  return Math.round(diffDays * avgDailyGDD);
}

/**
 * Get crop phenology thresholds and details based on accumulated heat units.
 * @param {string} cropName - Crop name
 * @param {number} accumulatedGDD - Total heat units accumulated
 * @returns {Object} Growth stage report
 */
function getGrowthStageByGDD(cropName = 'Rice', accumulatedGDD = 0) {
  const crop = (cropName || '').toLowerCase();
  const gdd = parseFloat(accumulatedGDD || 0);

  let stage = "Seedling";
  let stageDescription = "Early seedling establishment and root development.";
  let currentStageMin = 0;
  let nextStageMax = 400;
  let nextStageName = "Active Tillering";
  let totalLifecycleGDD = 1600;
  let tBase = 10;

  // 1. RICE / PALAY (Tbase = 10°C, Lifecycle ~1600 GDD)
  if (crop.includes('rice') || crop.includes('palay')) {
    tBase = 10;
    totalLifecycleGDD = 1600;
    if (gdd < 80) {
      stage = "Germination / Emergence";
      stageDescription = "Radicle and coleoptile emergence from seed.";
      currentStageMin = 0; nextStageMax = 80; nextStageName = "Seedling Stage";
    } else if (gdd < 400) {
      stage = "Seedling Stage";
      stageDescription = "Development of first 4 true leaves prior to transplanting/tillering.";
      currentStageMin = 80; nextStageMax = 400; nextStageName = "Active Tillering";
    } else if (gdd < 800) {
      stage = "Active Tillering";
      stageDescription = "Rapid shoot multiplication and root expansion.";
      currentStageMin = 400; nextStageMax = 800; nextStageName = "Booting / Panicle Initiation";
    } else if (gdd < 1100) {
      stage = "Booting / Panicle Initiation";
      stageDescription = "Reproductive panicle formation inside leaf sheath.";
      currentStageMin = 800; nextStageMax = 1100; nextStageName = "Heading & Flowering";
    } else if (gdd < 1300) {
      stage = "Heading & Flowering (Anthesis)";
      stageDescription = "Panicle emergence and pollination. Highly vulnerable to heat/rain stress.";
      currentStageMin = 1100; nextStageMax = 1300; nextStageName = "Grain Filling";
    } else if (gdd < 1550) {
      stage = "Grain Filling (Milk & Dough Stage)";
      stageDescription = "Starch accumulation in grains; changing from green to golden yellow.";
      currentStageMin = 1300; nextStageMax = 1550; nextStageName = "Maturity / Harvest Ready";
    } else {
      stage = "Maturity / Harvest Ready";
      stageDescription = "Over 80% of grains are hard and golden yellow. Ready for combine or sickle harvest.";
      currentStageMin = 1550; nextStageMax = 1800; nextStageName = "Harvest Completed";
    }
  }
  // 2. CORN / MAIS (Tbase = 10°C, Lifecycle ~1350 GDD)
  else if (crop.includes('corn') || crop.includes('mais')) {
    tBase = 10;
    totalLifecycleGDD = 1350;
    if (gdd < 125) {
      stage = "Emergence (VE - V2)";
      stageDescription = "Seedling emergence and initial leaf unfolding.";
      currentStageMin = 0; nextStageMax = 125; nextStageName = "Vegetative V6 Stage";
    } else if (gdd < 520) {
      stage = "Vegetative (V3 - V6)";
      stageDescription = "Rapid leaf collar formation and growing point rising above soil surface.";
      currentStageMin = 125; nextStageMax = 520; nextStageName = "Late Vegetative (V10 - V12)";
    } else if (gdd < 700) {
      stage = "Late Vegetative (V10 - VT)";
      stageDescription = "Stalk elongation and ear shoot development.";
      currentStageMin = 520; nextStageMax = 700; nextStageName = "Tasseling & Silking";
    } else if (gdd < 920) {
      stage = "Tasseling & Silking (VT - R1)";
      stageDescription = "Pollen shed and silk fertilization. Peak crop water demand.";
      currentStageMin = 700; nextStageMax = 920; nextStageName = "Grain Filling (Blister/Dough)";
    } else if (gdd < 1200) {
      stage = "Grain Filling (R2 - R4)";
      stageDescription = "Kernel development from watery blister to yellow dough stage.";
      currentStageMin = 920; nextStageMax = 1200; nextStageName = "Physiological Maturity";
    } else {
      stage = "Physiological Maturity (R6 - Harvest)";
      stageDescription = "Black layer formed at kernel base. Maximum dry weight reached.";
      currentStageMin = 1200; nextStageMax = 1500; nextStageName = "Harvest Completed";
    }
  }
  // 3. KANGKONG / LEAFY GREENS (Tbase = 15°C, Lifecycle ~250 GDD)
  else if (crop.includes('kangkong')) {
    tBase = 15;
    totalLifecycleGDD = 250;
    if (gdd < 40) {
      stage = "Seedling Stage";
      stageDescription = "Cotyledon and first true leaf development.";
      currentStageMin = 0; nextStageMax = 40; nextStageName = "Active Vegetative Growth";
    } else if (gdd < 180) {
      stage = "Active Vegetative Growth";
      stageDescription = "Rapid shoot and stem elongation. Ideal for nitrogen foliar feeding.";
      currentStageMin = 40; nextStageMax = 180; nextStageName = "Harvest Ready";
    } else {
      stage = "Harvest Ready";
      stageDescription = "Tender shoots reach optimal harvest length (25-30cm).";
      currentStageMin = 180; nextStageMax = 350; nextStageName = "Regrowth / Ratoon";
    }
  }
  // 4. VEGETABLES (Tomato, Eggplant, Ampalaya) (Tbase = 10°C, Lifecycle ~1200 GDD)
  else {
    tBase = 10;
    totalLifecycleGDD = 1200;
    if (gdd < 200) {
      stage = "Seedling Stage";
      stageDescription = "Nursery establishment and transplant recovery.";
      currentStageMin = 0; nextStageMax = 200; nextStageName = "Vegetative Vine/Bush Growth";
    } else if (gdd < 550) {
      stage = "Vegetative Growth";
      stageDescription = "Branching and foliage canopy development.";
      currentStageMin = 200; nextStageMax = 550; nextStageName = "Flowering Stage";
    } else if (gdd < 850) {
      stage = "Flowering & Fruit Set";
      stageDescription = "Blossom opening and pollination. Potassium demand increases.";
      currentStageMin = 550; nextStageMax = 850; nextStageName = "Fruit Development";
    } else if (gdd < 1100) {
      stage = "Fruit Development & Enlargement";
      stageDescription = "Rapid fruit sizing and ripening.";
      currentStageMin = 850; nextStageMax = 1100; nextStageName = "Harvest Ready";
    } else {
      stage = "Harvest Stage";
      stageDescription = "Fruits reach marketable maturity and coloration.";
      currentStageMin = 1100; nextStageMax = 1400; nextStageName = "Final Harvest";
    }
  }

  const stageSpan = Math.max(1, nextStageMax - currentStageMin);
  const progressInStage = Math.max(0, Math.min(100, Math.round(((gdd - currentStageMin) / stageSpan) * 100)));
  const totalLifecycleProgress = Math.max(0, Math.min(100, Math.round((gdd / totalLifecycleGDD) * 100)));

  // Estimate remaining days to next stage assuming ~18 GDD/day
  const remainingGDD = Math.max(0, nextStageMax - gdd);
  const estimatedDaysToNextStage = Math.ceil(remainingGDD / 18);

  return {
    stage,
    stageDescription,
    gddAccumulated: Math.round(gdd),
    gddForCurrentStage: currentStageMin,
    gddForNextStage: nextStageMax,
    nextStageName,
    percentThroughStage: progressInStage,
    totalLifecycleProgress,
    estimatedDaysToNextStage,
    tBase
  };
}

/**
 * Estimate shorthand growth stage string ('initial'|'dev'|'mid'|'late') for other advisors.
 * @param {string} cropName - Crop name
 * @param {number} daysGrown - Days grown
 * @returns {string} Shorthand stage
 */
function estimateGrowthStage(cropName = 'Rice', daysGrown = 15) {
  const gdd = daysGrown * 18.5; // Approx heat units
  const info = getGrowthStageByGDD(cropName, gdd);
  const s = info.stage.toLowerCase();
  if (s.includes('seedling') || s.includes('germination') || s.includes('emergence')) return 'initial';
  if (s.includes('tillering') || s.includes('vegetative') || s.includes('v6')) return 'dev';
  if (s.includes('flowering') || s.includes('booting') || s.includes('tasseling') || s.includes('silking') || s.includes('fruiting')) return 'mid';
  return 'late';
}

/**
 * Get comprehensive GDD analysis and harvest date prediction for a planting record.
 * @param {string} cropName - Crop name
 * @param {string} plantingDate - YYYY-MM-DD
 * @param {Object} currentWeather - Current weather { temp_max, temp_min, temperature }
 * @param {Array} forecastDays - Array of forecast days
 * @returns {Object} Full GDD report
 */
function getGDDAdvisorData(cropName = 'Rice', plantingDate, currentWeather = {}, forecastDays = []) {
  const pDate = plantingDate ? new Date(plantingDate) : new Date();
  const now = new Date();
  const daysGrown = Math.max(0, Math.floor((now.getTime() - pDate.getTime()) / (1000 * 60 * 60 * 24)));

  // Calculate actual GDD rate from current weather if available
  const tMax = currentWeather.temp_max || (currentWeather.temperature ? currentWeather.temperature + 4 : 32);
  const tMin = currentWeather.temp_min || (currentWeather.temperature ? currentWeather.temperature - 4 : 24);
  const dailyRate = calculateDailyGDD(tMax, tMin, 10);
  
  // Accumulated heat units
  const accumulated = Math.round(daysGrown * ((dailyRate + 18.5) / 2));
  const stageInfo = getGrowthStageByGDD(cropName, accumulated);

  // Estimate harvest date based on remaining GDD to maturity
  const crop = (cropName || '').toLowerCase();
  let totalTargetGDD = 1600;
  if (crop.includes('corn') || crop.includes('mais')) totalTargetGDD = 1350;
  else if (crop.includes('kangkong')) totalTargetGDD = 250;
  else if (crop.includes('tomato') || crop.includes('eggplant')) totalTargetGDD = 1200;

  const remainingGDD = Math.max(0, totalTargetGDD - accumulated);
  const avgRate = dailyRate > 5 ? dailyRate : 18.5;
  const remainingDays = Math.ceil(remainingGDD / avgRate);
  
  const estimatedHarvestDate = new Date(now.getTime() + remainingDays * 24 * 60 * 60 * 1000);
  const harvestDateStr = estimatedHarvestDate.toISOString().split('T')[0];

  return {
    ...stageInfo,
    daysGrown,
    currentDailyGDD: dailyRate,
    targetLifecycleGDD: totalTargetGDD,
    remainingDaysToHarvest: remainingDays,
    estimatedHarvestDate: harvestDateStr
  };
}

module.exports = {
  calculateDailyGDD,
  estimateAccumulatedGDD,
  getGrowthStageByGDD,
  estimateGrowthStage,
  getGDDAdvisorData
};
