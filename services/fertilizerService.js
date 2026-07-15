/**
 * Split-Fertilizer Timing Advisor Engine
 * Calculates optimal timing for nitrogen and NPK fertilizer application based on crop growth phenology
 * and short-term weather forecast (avoiding rain-induced runoff and leaching).
 */

/**
 * Get fertilizer recommendation and scheduling for a crop batch.
 * @param {string} cropName - Crop name
 * @param {string} growthStage - Current growth stage
 * @param {number} daysGrown - Elapsed days since planting
 * @param {Array} forecastDays - Array of forecast day objects { rainfall, wind_speed }
 * @param {Object} soilNutrients - Optional { nitrogen_level, phosphorus_level, potassium_level } ('Low'|'Medium'|'High')
 * @returns {Object} Fertilizer advice object
 */
function getFertilizerRecommendation(cropName = 'Rice', growthStage = 'dev', daysGrown = 15, forecastDays = [], soilNutrients = null) {
  const crop = (cropName || '').toLowerCase();
  const stage = (growthStage || '').toLowerCase();
  
  // Check next 48 hours for rainfall runoff risk
  let next48hRain = 0;
  let hasHeavyRain = false;
  if (Array.isArray(forecastDays)) {
    forecastDays.slice(0, 2).forEach(d => {
      const rain = parseFloat(d.rainfall || 0);
      next48hRain += rain;
      if (rain > 12) hasHeavyRain = true;
    });
  }

  const weatherWindowSafe = !hasHeavyRain && next48hRain <= 18;
  const weatherReason = weatherWindowSafe
    ? `Next 48h forecasted rainfall (${next48hRain.toFixed(1)}mm) is low. Safe window for fertilizer absorption without runoff or leaching.`
    : `WARNING: Heavy rainfall (${next48hRain.toFixed(1)}mm) forecasted within 48h. Application now will result in severe fertilizer runoff into waterways and economic loss.`;

  let nextEvent = "Regular Maintenance";
  let daysUntilNext = 0;
  let baseRecommendation = "";
  let urgency = "none";

  // 1. RICE / PALAY SCHEDULE
  if (crop.includes('rice') || crop.includes('palay')) {
    if (daysGrown <= 5 || stage.includes('initial') || stage.includes('seedling')) {
      nextEvent = "First Top-dress (Active Tillering / 14-21 DAP)";
      daysUntilNext = Math.max(0, 18 - daysGrown);
      urgency = daysUntilNext <= 3 ? "moderate" : "low";
      baseRecommendation = "Crop is in Seedling stage. Ensure basal NPK fertilizer (e.g., 14-14-14 or 16-20-0) was applied during final harrowing or transplanting. Prepare nitrogen (Urea 46-0-0) for the upcoming tillering top-dress.";
    } else if (daysGrown <= 35 || stage.includes('tillering') || stage.includes('dev')) {
      nextEvent = "Second Top-dress (Panicle Initiation / 45-52 DAP)";
      daysUntilNext = Math.max(0, 48 - daysGrown);
      if (daysGrown >= 16 && daysGrown <= 25) {
        urgency = "high";
        baseRecommendation = "ACTIVE TILLERING STAGE: Optimal window for First Nitrogen Top-dress. Apply 30-40% of seasonal nitrogen requirement to stimulate maximum tiller production. Maintain 2-3cm shallow water before application.";
      } else {
        urgency = "low";
        baseRecommendation = "Tillering in progress. Monitor leaf greenness using a Leaf Color Chart (LCC). If LCC reading drops below 4 (inbred) or 4.5 (hybrid), apply supplemental nitrogen.";
      }
    } else if (daysGrown <= 65 || stage.includes('booting') || stage.includes('panicle') || stage.includes('mid')) {
      nextEvent = "Flowering / Grain Filling (No N needed)";
      daysUntilNext = Math.max(0, 75 - daysGrown);
      if (daysGrown >= 44 && daysGrown <= 55) {
        urgency = "high";
        baseRecommendation = "PANICLE INITIATION STAGE: Critical window for Second Nitrogen & Potassium Top-dress. Apply remaining 30% nitrogen plus muriate of potash (MOP 0-0-60) to increase spikelet number and grain filling weight.";
      } else {
        urgency = "low";
        baseRecommendation = "Reproductive booting stage. Do NOT apply late nitrogen fertilizer beyond panicle initiation, as excess nitrogen increases susceptibility to Rice Blast and lodging during winds.";
      }
    } else {
      nextEvent = "Harvest Stage";
      daysUntilNext = 0;
      urgency = "none";
      baseRecommendation = "Crop is approaching maturity and grain filling. Terminate all fertilizer applications. Drain paddy water 10-14 days before harvest to hasten grain ripening and firm up soil for harvesting equipment.";
    }
  }
  // 2. CORN / MAIS SCHEDULE
  else if (crop.includes('corn') || crop.includes('mais')) {
    if (daysGrown <= 10 || stage.includes('emergence') || stage.includes('initial')) {
      nextEvent = "Side-dress Nitrogen (V6 Stage / 25-30 DAP)";
      daysUntilNext = Math.max(0, 25 - daysGrown);
      urgency = "low";
      baseRecommendation = "Young corn seedlings utilizing starter basal fertilizer. Keep field weed-free to prevent nutrient competition before the critical V6 growth spurt.";
    } else if (daysGrown <= 40 || stage.includes('v6') || stage.includes('dev') || stage.includes('vegetative')) {
      nextEvent = "Tasseling / Silking Stage (50-60 DAP)";
      daysUntilNext = Math.max(0, 52 - daysGrown);
      if (daysGrown >= 22 && daysGrown <= 32) {
        urgency = "high";
        baseRecommendation = "V6 GROWTH STAGE (6-8 true leaves): Critical window for side-dress nitrogen application. Corn nitrogen demand spikes dramatically from V6 to tasseling. Apply Urea along plant rows and cover lightly with soil.";
      } else {
        urgency = "moderate";
        baseRecommendation = "Rapid vegetative stalk growth. Ensure adequate soil moisture is present to dissolve applied side-dress nutrients.";
      }
    } else {
      nextEvent = "Grain Filling & Maturity";
      daysUntilNext = 0;
      urgency = "none";
      baseRecommendation = "Tasseling and silking stages reached. Nutrient uptake is shifting from soil absorption to internal translocation from leaves to kernels. No further soil fertilizer required.";
    }
  }
  // 3. VEGETABLES (Tomato, Eggplant, Kangkong, Ampalaya)
  else {
    if (crop.includes('kangkong')) {
      nextEvent = "Weekly Foliar / Nitrogen Boost";
      daysUntilNext = 7 - (daysGrown % 7);
      urgency = daysUntilNext <= 2 ? "moderate" : "low";
      baseRecommendation = "Leafy vegetables require steady nitrogen for rapid tender shoots. Apply light top-dress of urea or fermented plant juice (FPJ) after every harvest cutting.";
    } else {
      nextEvent = "Bi-weekly Fruiting Maintenance";
      daysUntilNext = 14 - (daysGrown % 14);
      urgency = daysUntilNext <= 3 ? "moderate" : "low";
      baseRecommendation = "Solanaceous and vine vegetables require balanced potassium and phosphorus during flowering and fruit set. Supplement with calcium-boron foliar spray to prevent blossom-end rot and fruit dropping.";
    }
  }

  // Adjust urgency and advice if weather window is unsafe
  if (!weatherWindowSafe && (urgency === 'high' || urgency === 'moderate')) {
    urgency = "moderate"; // Downgrade immediate action due to rain
    baseRecommendation = `[DELAY RECOMMENDED] ${baseRecommendation} However, due to impending rain (>10mm within 48h), postpone application until the storm passes to prevent nutrient runoff.`;
  }

  // Nutrient adjustments based on soil test profile
  const nutrientAdjustments = {
    nitrogen: { rate: "Standard (100%)", advice: "Maintain recommended application schedule." },
    phosphorus: { rate: "Standard (100%)", advice: "Maintain recommended basal application." },
    potassium: { rate: "Standard (100%)", advice: "Maintain recommended application schedule." }
  };

  if (soilNutrients) {
    if (soilNutrients.nitrogen_level === 'Low') {
      nutrientAdjustments.nitrogen = { rate: "Increased (+25%)", advice: "Soil test shows N depletion. Increase urea rate by 25% or add organic compost." };
    } else if (soilNutrients.nitrogen_level === 'High') {
      nutrientAdjustments.nitrogen = { rate: "Reduced (-30%)", advice: "High residual soil N. Reduce urea rate by 30% to prevent excessive lodging and foliage susceptibility to pests." };
    }

    if (soilNutrients.phosphorus_level === 'Low') {
      nutrientAdjustments.phosphorus = { rate: "Increased (+20%)", advice: "Low soil P restricts root development. Incorporate solophos (0-20-0) or bone meal." };
    }

    if (soilNutrients.potassium_level === 'Low') {
      nutrientAdjustments.potassium = { rate: "Increased (+30%)", advice: "Low soil K weakens stalks and reduces disease resistance. Supplement with muriate of potash (MOP)." };
    } else if (soilNutrients.potassium_level === 'High') {
      nutrientAdjustments.potassium = { rate: "Maintenance (50%)", advice: "High soil K. Reduce potash application." };
    }
  }

  return {
    cropName,
    growthStage: stage,
    daysGrown,
    nextFertilizerEvent: nextEvent,
    daysUntilNextEvent: daysUntilNext,
    weatherWindowSafe,
    weatherReason,
    recommendation: baseRecommendation,
    nutrientAdjustments,
    urgency
  };
}

module.exports = { getFertilizerRecommendation };
