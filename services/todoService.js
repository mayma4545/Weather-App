const irrigationService = require('./irrigationService');
const diseaseRiskService = require('./diseaseRiskService');
const fertilizerService = require('./fertilizerService');
const gddService = require('./gddService');
const weatherService = require('../utils/weatherService');

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getToday() {
  const d = new Date();
  return {
    dateStr: d.toISOString().split('T')[0],
    dayName: DAY_NAMES[d.getDay()],
    dayNum: d.getDate(),
    month: d.getMonth(),
    year: d.getFullYear()
  };
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return {
    dayName: DAY_NAMES[d.getDay()],
    dayNum: d.getDate()
  };
}

function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

const SOIL_MOISTURE_TIPS = {
  'Clay': 'Clay soil holds moisture well. Avoid overwatering; check for waterlogging.',
  'Clay Loam': 'Good water retention. Irrigate when top 5cm feels dry.',
  'Silt Loam': 'Moderate drainage. Monitor moisture levels regularly.',
  'Sandy Loam': 'Drains quickly. More frequent lighter irrigation needed.',
  'Sandy': 'Very low water holding capacity. Split irrigation into smaller doses.',
  'Loam': 'Ideal soil. Maintain consistent moisture schedule.'
};

function getSoilTip(soilType) {
  return SOIL_MOISTURE_TIPS[soilType] || SOIL_MOISTURE_TIPS['Loam'];
}

function generateGeneralTasks(weatherData, forecastDays, cropName, growthStage, daysGrown, soilType) {
  const tasks = [];
  const today = getToday();
  const currentTemp = weatherData.temperature || 28;
  const currentHumidity = weatherData.humidity || 75;
  const currentWind = weatherData.wind_speed || 5;
  const currentRain = weatherData.rainfall || 0;
  const stage = (growthStage || '').toLowerCase();

  if (forecastDays && forecastDays.length > 0) {
    const next3Days = forecastDays.slice(0, 3);
    const heavyRainDays = next3Days.filter(d => d.rainfall >= 20);
    const highWindDays = next3Days.filter(d => d.wind_speed > 30);
    const highHumidityDays = next3Days.filter(d => d.humidity >= 85);

    if (heavyRainDays.length > 0) {
      heavyRainDays.forEach(day => {
        tasks.push({
          date: day.date,
          dayName: day.day_name,
          dayNum: new Date(day.date + 'T12:00:00').getDate(),
          task: 'Check & clear drainage canals',
          plot: 'All Plots',
          crop: '—',
          stage: '—',
          type: 'DRAIN',
          priority: day.rainfall >= 30 ? 'high' : 'medium',
          reason: `${day.rainfall}mm rain forecasted. Ensure waterways are clear to prevent flooding and root rot.`
        });
      });
    }

    if (highWindDays.length > 0) {
      highWindDays.forEach(day => {
        tasks.push({
          date: day.date,
          dayName: day.day_name,
          dayNum: new Date(day.date + 'T12:00:00').getDate(),
          task: 'Inspect & secure plant stakes and trellises',
          plot: 'All Plots',
          crop: '—',
          stage: '—',
          type: 'PEST',
          priority: day.wind_speed >= 40 ? 'high' : 'medium',
          reason: `Strong winds (${day.wind_speed} km/h) forecasted. Secure structures to prevent crop lodging.`
        });
      });
    }

    if (highHumidityDays.length > 0) {
      highHumidityDays.forEach(day => {
        tasks.push({
          date: day.date,
          dayName: day.day_name,
          dayNum: new Date(day.date + 'T12:00:00').getDate(),
          task: 'Monitor crop canopy for fungal disease symptoms',
          plot: 'All Plots',
          crop: '—',
          stage: '—',
          type: 'PEST',
          priority: day.humidity >= 90 ? 'high' : 'medium',
          reason: `High humidity (${day.humidity}%) creates ideal conditions for blast, mildew, and leaf spot. Inspect early morning.`
        });
      });
    }
  }

  if (currentWind <= 20 && currentRain === 0) {
    const sprayDay = forecastDays && forecastDays.length > 0 ? forecastDays[0] : null;
    if (sprayDay && sprayDay.wind_speed <= 20) {
      tasks.push({
        date: sprayDay.date,
        dayName: sprayDay.day_name,
        dayNum: new Date(sprayDay.date + 'T12:00:00').getDate(),
        task: 'Apply foliar fertilizer or pesticide spray',
        plot: 'As needed',
        crop: cropName,
        stage: growthStage,
        type: 'PEST',
        priority: 'medium',
        reason: `Low wind (${sprayDay.wind_speed} km/h) and no rain expected. Safe spray window for pest or nutrient application.`
      });
    }
  }

  return tasks;
}

function generateIrrigationTasks(irrigationResult, forecastDays) {
  const tasks = [];
  if (!irrigationResult) return tasks;

  const today = getToday();
  let targetDate = today.dateStr;
  let targetDayName = today.dayName;
  let targetDayNum = today.dayNum;

  if (irrigationResult.urgency === 'none') return tasks;

  if (forecastDays && forecastDays.length > 0) {
    const next3Days = forecastDays.slice(0, 3);
    for (const day of next3Days) {
      if (day.rainfall < 5) {
        targetDate = day.date;
        const fd = formatDate(day.date);
        targetDayName = fd.dayName;
        targetDayNum = fd.dayNum;
        break;
      }
    }
  }

  const taskDesc = irrigationResult.urgency === 'high'
    ? `Irrigate ${irrigationResult.cropName} — apply ${irrigationResult.amountMm}mm water urgently`
    : `Irrigate ${irrigationResult.cropName} — apply ${irrigationResult.amountMm}mm water`;

  tasks.push({
    date: targetDate,
    dayName: targetDayName,
    dayNum: targetDayNum,
    task: taskDesc,
    plot: irrigationResult.cropName,
    crop: irrigationResult.cropName,
    stage: irrigationResult.growthStage,
    type: 'IRR',
    priority: irrigationResult.urgency === 'high' ? 'high' : irrigationResult.urgency === 'moderate' ? 'medium' : 'low',
    reason: `Crop water consumption: ${irrigationResult.cropET}mm/day. Soil: ${irrigationResult.soilType}. ${getSoilTip(irrigationResult.soilType)}`
  });

  return tasks;
}

function generateFertilizerTasks(fertilizerResult) {
  const tasks = [];
  if (!fertilizerResult) return tasks;

  if (fertilizerResult.urgency === 'none' && fertilizerResult.daysUntilNextEvent > 7) return tasks;

  const today = getToday();
  const scheduleDate = addDays(today.dateStr, Math.min(fertilizerResult.daysUntilNextEvent, 3));
  const fd = formatDate(scheduleDate);

  if (fertilizerResult.urgency === 'high' || fertilizerResult.urgency === 'moderate') {
    const isDelayed = fertilizerResult.recommendation.includes('DELAY RECOMMENDED');
    tasks.push({
      date: scheduleDate,
      dayName: fd.dayName,
      dayNum: fd.dayNum,
      task: isDelayed
        ? `[DELAYED] ${fertilizerResult.nextFertilizerEvent} — postpone due to forecasted rain`
        : `${fertilizerResult.nextFertilizerEvent} — apply to ${fertilizerResult.cropName}`,
      plot: fertilizerResult.cropName,
      crop: fertilizerResult.cropName,
      stage: fertilizerResult.growthStage,
      type: 'FERT',
      priority: fertilizerResult.urgency === 'high' ? 'high' : 'medium',
      reason: isDelayed
        ? fertilizerResult.weatherReason
        : `${fertilizerResult.recommendation} ${fertilizerResult.weatherReason}`
    });
  }

  return tasks;
}

function generateDiseaseTasks(diseaseRisks, forecastDays) {
  const tasks = [];
  if (!diseaseRisks || !Array.isArray(diseaseRisks)) return tasks;

  const today = getToday();
  const highRisks = diseaseRisks.filter(r => r.riskLevel === 'HIGH' || r.riskLevel === 'CRITICAL');

  for (const risk of highRisks) {
    const targetDate = forecastDays && forecastDays.length > 0 ? forecastDays[0].date : today.dateStr;
    const fd = formatDate(targetDate);

    tasks.push({
      date: targetDate,
      dayName: fd.dayName,
      dayNum: fd.dayNum,
      task: `${risk.riskLevel === 'CRITICAL' ? 'URGENT: ' : ''}Scout for ${risk.disease} on ${risk.cropAffected}`,
      plot: risk.cropAffected,
      crop: risk.cropAffected,
      stage: '—',
      type: 'PEST',
      priority: risk.riskLevel === 'CRITICAL' ? 'high' : 'medium',
      reason: risk.recommendation
    });

    if (risk.riskLevel === 'CRITICAL') {
      const nextDay = forecastDays && forecastDays.length > 1 ? forecastDays[1] : null;
      if (nextDay) {
        const fd2 = formatDate(nextDay.date);
        tasks.push({
          date: nextDay.date,
          dayName: fd2.dayName,
          dayNum: fd2.dayNum,
          task: `Apply preventive treatment for ${risk.disease}`,
          plot: risk.cropAffected,
          crop: risk.cropAffected,
          stage: '—',
          type: 'PEST',
          priority: 'high',
          reason: `Critical ${risk.disease} risk persists. Apply recommended fungicide/bactericide. ${risk.triggers}`
        });
      }
    }
  }

  return tasks;
}

function generateHarvestTasks(gddData, cropName) {
  const tasks = [];
  if (!gddData || !gddData.remainingDaysToHarvest) return tasks;

  const today = getToday();
  const remaining = gddData.remainingDaysToHarvest;

  if (remaining <= 3) {
    const harvestDate = addDays(today.dateStr, 1);
    const fd = formatDate(harvestDate);
    tasks.push({
      date: harvestDate,
      dayName: fd.dayName,
      dayNum: fd.dayNum,
      task: `Prepare harvest equipment and storage area for ${cropName}`,
      plot: cropName,
      crop: cropName,
      stage: gddData.stage,
      type: 'HARVEST',
      priority: 'high',
      reason: `Crop at ${gddData.stage} stage. Estimated harvest-ready in ${remaining} days (${gddData.estimatedHarvestDate}). Begin pre-harvest preparations.`
    });
  } else if (remaining <= 7) {
    const prepDate = addDays(today.dateStr, Math.max(1, remaining - 3));
    const fd = formatDate(prepDate);
    tasks.push({
      date: prepDate,
      dayName: fd.dayName,
      dayNum: fd.dayNum,
      task: `Pre-harvest: drain field / reduce irrigation for ${cropName}`,
      plot: cropName,
      crop: cropName,
      stage: gddData.stage,
      type: 'HARVEST',
      priority: 'medium',
      reason: `Harvest expected in ${remaining} days (${gddData.estimatedHarvestDate}). Begin pre-harvest field drying to harden crop for harvest.`
    });
  }

  if (gddData.stage && (
    gddData.stage.toLowerCase().includes('grain fill') ||
    gddData.stage.toLowerCase().includes('milk') ||
    gddData.stage.toLowerCase().includes('dough') ||
    gddData.stage.toLowerCase().includes('fruit development')
  )) {
    const midStageDate = forecastDays && forecastDays.length > 1 ? forecastDays[2] : null;
    if (midStageDate) {
      const fd = formatDate(midStageDate.date);
      tasks.push({
        date: midStageDate.date,
        dayName: fd.dayName,
        dayNum: fd.dayNum,
        task: `Monitor ${cropName} grain/fruit development — check for pests and disease`,
        plot: cropName,
        crop: cropName,
        stage: gddData.stage,
        type: 'PEST',
        priority: 'low',
        reason: `${cropName} at ${gddData.stage} stage (${gddData.percentThroughStage}% through stage). Critical to protect yield at this stage.`
      });
    }
  }

  return tasks;
}

function generateGrowthStageTasks(cropName, growthStage, daysGrown, forecastDays) {
  const tasks = [];
  const stage = (growthStage || '').toLowerCase();
  const today = getToday();
  const targetDay = forecastDays && forecastDays.length > 0 ? forecastDays[0] : null;
  const targetDate = targetDay ? targetDay.date : today.dateStr;
  const fd = targetDay ? formatDate(targetDay.date) : { dayName: today.dayName, dayNum: today.dayNum };

  if (stage.includes('seedling') || stage.includes('germination') || stage.includes('emergence')) {
    tasks.push({
      date: targetDate,
      dayName: fd.dayName,
      dayNum: fd.dayNum,
      task: `Protect ${cropName} seedlings — monitor for damping-off and pest damage`,
      plot: cropName,
      crop: cropName,
      stage: growthStage,
      type: 'PEST',
      priority: 'medium',
      reason: `Seedling stage is highly vulnerable. Check for cutworms, damping-off fungi, and adequate soil moisture daily.`
    });
    if (daysGrown <= 3) {
      tasks.push({
        date: targetDate,
        dayName: fd.dayName,
        dayNum: fd.dayNum,
        task: `Verify ${cropName} seedling emergence and stand count`,
        plot: cropName,
        crop: cropName,
        stage: growthStage,
        type: 'GENERAL',
        priority: 'medium',
        reason: `Check for uniform germination. Replant missing hills within 5-7 days to maintain target plant population.`
      });
    }
  }

  if (stage.includes('tillering') || stage.includes('vegetative')) {
    tasks.push({
      date: targetDate,
      dayName: fd.dayName,
      dayNum: fd.dayNum,
      task: `Monitor ${cropName} vegetative growth — check leaf color and vigor`,
      plot: cropName,
      crop: cropName,
      stage: growthStage,
      type: 'GENERAL',
      priority: 'low',
      reason: `Vegetative stage: pale green leaves indicate nitrogen deficiency. Use Leaf Color Chart (LCC) to guide top-dress timing.`
    });
  }

  if (stage.includes('flower') || stage.includes('booting') || stage.includes('heading') || stage.includes('tassel') || stage.includes('silking')) {
    tasks.push({
      date: targetDate,
      dayName: fd.dayName,
      dayNum: fd.dayNum,
      task: `Monitor ${cropName} flowering stage — check pollination success`,
      plot: cropName,
      crop: cropName,
      stage: growthStage,
      type: 'GENERAL',
      priority: 'medium',
      reason: `Critical reproductive stage. Avoid water stress and pesticide spraying during flowering to protect pollinators.`
    });
  }

  return tasks;
}

function generateTodoList(plotData) {
  const { plot, activeRecord, currentWeather, forecast, soilProfile, irrigation, diseaseRisk, fertilizer, gdd } = plotData;
  const today = getToday();

  const cropName = activeRecord && activeRecord.crop ? activeRecord.crop.crop_name : (plot ? '—' : '—');
  const plantingDate = activeRecord ? activeRecord.planting_date : null;
  const daysGrown = plantingDate
    ? Math.max(0, Math.floor((new Date() - new Date(plantingDate)) / (1000 * 60 * 60 * 24)))
    : 0;
  const soilType = soilProfile ? soilProfile.soil_type : (plot ? plot.soil_type : null);
  const growthStage = gdd ? gdd.stage : (gddService ? gddService.estimateGrowthStage(cropName, daysGrown) : '—');
  const forecastDays = forecast ? forecast.days : [];
  const weatherData = currentWeather || {};

  let allTasks = [];

  allTasks = allTasks.concat(generateIrrigationTasks(irrigation, forecastDays));
  allTasks = allTasks.concat(generateFertilizerTasks(fertilizer));
  allTasks = allTasks.concat(generateDiseaseTasks(diseaseRisk, forecastDays));
  allTasks = allTasks.concat(generateHarvestTasks(gdd, cropName));
  allTasks = allTasks.concat(generateGrowthStageTasks(cropName, growthStage, daysGrown, forecastDays));
  allTasks = allTasks.concat(generateGeneralTasks(weatherData, forecastDays, cropName, growthStage, daysGrown, soilType));

  allTasks.forEach(t => {
    if (!t.plot || t.plot === '—') {
      t.plot = plot ? plot.plot_name : '—';
    }
    if (!t.crop || t.crop === '—') {
      t.crop = cropName || '—';
    }
    if (!t.stage || t.stage === '—') {
      t.stage = growthStage || '—';
    }
  });

  const unique = [];
  const seen = new Set();
  for (const task of allTasks) {
    const key = `${task.date}|${task.task}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(task);
    }
  }

  unique.sort((a, b) => {
    const priorityRank = { high: 0, medium: 1, low: 2 };
    const dateCmp = a.date.localeCompare(b.date);
    if (dateCmp !== 0) return dateCmp;
    return (priorityRank[a.priority] || 2) - (priorityRank[b.priority] || 2);
  });

  const todayTasks = unique.filter(t => t.date === today.dateStr);
  const upcomingTasks = unique.filter(t => t.date !== today.dateStr).slice(0, 10);

  return {
    generatedAt: new Date().toISOString(),
    plotId: plot ? plot.plot_id : null,
    plotName: plot ? plot.plot_name : null,
    cropName,
    growthStage,
    daysGrown,
    soilType: soilType || 'Not tested',
    totalTasks: unique.length,
    todayTasks: todayTasks.length,
    today: todayTasks,
    upcoming: upcomingTasks,
    all: unique.slice(0, 15)
  };
}

module.exports = { generateTodoList };
