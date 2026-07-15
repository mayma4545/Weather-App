/**
 * Typhoon & Extreme Weather Alert Engine
 * Evaluates short-term weather forecasts against PAGASA wind speed and rainfall intensity thresholds
 * to issue early warnings and farm damage mitigation checklists.
 */

/**
 * Assess typhoon and extreme weather risk from 5-day forecast data.
 * @param {Array} forecastDays - Array of forecast day objects { day_name, date, temp_max, temp_min, humidity, rainfall, wind_speed }
 * @returns {Object} Typhoon risk assessment and emergency protocols
 */
function assessTyphoonRisk(forecastDays = []) {
  if (!Array.isArray(forecastDays) || forecastDays.length === 0) {
    return {
      overallRisk: 'NONE',
      signals: [],
      emergencyChecklist: [],
      farmPreparation: ['Maintain routine weather monitoring.']
    };
  }

  const signals = [];
  let highestSeverity = 'NONE'; // NONE | WATCH | WARNING | EMERGENCY
  let totalRain = 0;
  let maxWind = 0;
  let hotDaysCount = 0;
  let dryDaysCount = 0;

  forecastDays.forEach((d, idx) => {
    const wind = parseFloat(d.wind_speed || 0);
    const rain = parseFloat(d.rainfall || 0);
    const tMax = parseFloat(d.temp_max || 31);
    const hum = parseFloat(d.humidity || 75);
    const dayLabel = d.day_name || `Day ${idx + 1}`;
    const dateStr = d.date || '';

    totalRain += rain;
    if (wind > maxWind) maxWind = wind;
    if (tMax >= 36) hotDaysCount++;
    if (rain < 1 && hum < 60) dryDaysCount++;

    // 1. Tropical Cyclone Wind Signals (PAGASA-based thresholds)
    if (wind >= 89) {
      highestSeverity = 'EMERGENCY';
      signals.push({
        date: dateStr,
        dayName: dayLabel,
        type: 'SEVERE_STORM',
        severity: 'EMERGENCY',
        windSpeed: wind,
        rainfall: rain,
        title: `🔴 Signal #3 / Severe Tropical Storm (${wind} km/h wind)`,
        description: `Destructive winds exceeding 89 km/h expected on ${dayLabel}. Severe structural and crop damage imminent.`,
        actions: [
          'EMERGENCY: Harvest all mature crops immediately before storm landfall.',
          'Secure all farm buildings, solar panels, and irrigation pumps.',
          'Evacuate livestock to elevated, sheltered concrete structures.',
          'Do NOT attempt field operations during severe wind gusts.'
        ]
      });
    } else if (wind >= 62) {
      if (highestSeverity !== 'EMERGENCY') highestSeverity = 'WARNING';
      signals.push({
        date: dateStr,
        dayName: dayLabel,
        type: 'TROPICAL_STORM',
        severity: 'WARNING',
        windSpeed: wind,
        rainfall: rain,
        title: `🟠 Signal #2 / Tropical Storm (${wind} km/h wind)`,
        description: `Gale-force winds (62-88 km/h) forecasted on ${dayLabel}. Will cause lodging in flowering rice and corn.`,
        actions: [
          'Harvest crops that are within 5 days of maturity immediately.',
          'Propping / staking of fruit trees and vegetable trellises.',
          'Clear drainage canals to allow rapid evacuation of storm runoff.',
          'Store harvested produce in elevated, waterproof warehouses.'
        ]
      });
    } else if (wind >= 45) {
      if (highestSeverity === 'NONE' || highestSeverity === 'WATCH') highestSeverity = 'WATCH';
      signals.push({
        date: dateStr,
        dayName: dayLabel,
        type: 'TROPICAL_DEPRESSION',
        severity: 'WATCH',
        windSpeed: wind,
        rainfall: rain,
        title: `🟡 Signal #1 / Tropical Depression Watch (${wind} km/h wind)`,
        description: `Strong breeze to near gale winds (45-61 km/h) expected on ${dayLabel}. May break tender vegetable shoots.`,
        actions: [
          'Inspect field dikes and irrigation bunds for leaks or cracks.',
          'Postpone nitrogen fertilizer application and pesticide spraying.',
          'Monitor PAGASA weather bulletins every 6 hours.'
        ]
      });
    }

    // 2. Heavy Rainfall & Flood Risk
    if (rain >= 80) {
      highestSeverity = 'EMERGENCY';
      signals.push({
        date: dateStr,
        dayName: dayLabel,
        type: 'FLOOD_RISK',
        severity: 'EMERGENCY',
        windSpeed: wind,
        rainfall: rain,
        title: `🔴 Torrential Rainfall & Flood Warning (${rain} mm/day)`,
        description: `Torrential rain forecasted on ${dayLabel}. Extreme risk of flash flooding and paddy inundation.`,
        actions: [
          'Open all field drainage floodgates and bund outlets immediately.',
          'Move farm equipment and fertilizer sacks to high ground.',
          'Avoid crossing swollen streams or irrigation canals.'
        ]
      });
    } else if (rain >= 50) {
      if (highestSeverity !== 'EMERGENCY') highestSeverity = 'WARNING';
      signals.push({
        date: dateStr,
        dayName: dayLabel,
        type: 'FLOOD_RISK',
        severity: 'WARNING',
        windSpeed: wind,
        rainfall: rain,
        title: `🟠 Heavy Rainfall Advisory (${rain} mm/day)`,
        description: `Heavy rain expected on ${dayLabel}. Waterlogging risk for low-lying plots and root rot in vegetables.`,
        actions: [
          'Ensure drainage pathways are clear of weeds and silt.',
          'Suspend mechanical field cultivation to prevent soil compaction.'
        ]
      });
    }
  });

  // 3. Cumulative Weather Anomalies (Drought / Heat spell)
  if (hotDaysCount >= 3) {
    if (highestSeverity === 'NONE') highestSeverity = 'WATCH';
    signals.push({
      date: 'Next 5 Days',
      dayName: 'Multi-Day Outlook',
      type: 'EXTREME_HEAT',
      severity: 'WATCH',
      windSpeed: maxWind,
      rainfall: totalRain,
      title: `☀️ Extreme Heat Wave Watch (${hotDaysCount} days ≥ 36°C)`,
      description: `Sustained high temperatures will cause pollen sterility in flowering rice/corn and rapid soil moisture depletion.`,
      actions: [
        'Perform early morning or late evening irrigation to buffer canopy temperatures.',
        'Apply organic mulch (rice straw) around vegetable beds to conserve soil moisture.',
        'Avoid foliar chemical sprays during peak afternoon heat (>35°C).'
      ]
    });
  } else if (dryDaysCount >= 5 && totalRain < 5) {
    if (highestSeverity === 'NONE') highestSeverity = 'WATCH';
    signals.push({
      date: 'Next 5 Days',
      dayName: 'Multi-Day Outlook',
      type: 'DROUGHT_WATCH',
      severity: 'WATCH',
      windSpeed: maxWind,
      rainfall: totalRain,
      title: `🌵 Dry Spell / Drought Watch (<5mm total rain)`,
      description: `Extended dry period forecasted with low atmospheric humidity. High evaporative stress on rainfed crops.`,
      actions: [
        'Schedule supplemental irrigation for crops in vegetative or grain-filling stages.',
        'Implement alternate wetting and drying (AWD) water saving in rice paddies.',
        'Check farm water reservoir levels.'
      ]
    });
  }

  // Generate universal emergency checklist if any Warning or Emergency is present
  const emergencyChecklist = (highestSeverity === 'WARNING' || highestSeverity === 'EMERGENCY') ? [
    '⚡ Harvest all mature or near-mature crops immediately before landfall.',
    '🌊 Clear and deepen all field drainage channels and waterways.',
    '🏠 Secure roofs of farm sheds, storage structures, and solar panels.',
    '🐄 Move livestock and work animals to elevated concrete shelters.',
    '🎒 Store harvested grains, seeds, and fertilizers in elevated waterproof bags.',
    '📻 Monitor PAGASA and local DRRMO advisories continuously.'
  ] : [];

  return {
    overallRisk: highestSeverity,
    maxWindSpeed: parseFloat(maxWind.toFixed(1)),
    totalForecastRain: parseFloat(totalRain.toFixed(1)),
    signals,
    emergencyChecklist,
    farmPreparation: signals.length > 0
      ? signals.map(s => `[${s.dayName}] ${s.title}: ${s.actions[0]}`)
      : ['Weather conditions are normal. Continue standard farm maintenance.']
  };
}

module.exports = { assessTyphoonRisk };
