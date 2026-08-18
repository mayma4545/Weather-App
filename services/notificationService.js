/**
 * Notification Service for AGRIDEB.
 * Handles orchestration of weather reports and storm alerts to farmers.
 */

const { User, FarmPlot, PlantingRecord, CropRepository, Alert } = require('../models');
const weatherService = require('../utils/weatherService');
const typhoonAlertService = require('./typhoonAlertService');
const emailService = require('./emailService');
const smsService = require('./smsService');
const { Op } = require('sequelize');

/**
 * Returns whether a farmer already received today's report in Manila time.
 * @param {number} userId - Farmer user ID.
 * @returns {Promise<boolean>} Whether today's report was already recorded.
 */
async function hasDailyWeatherReportToday(userId) {
  const manilaDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
  const startOfDay = new Date(`${manilaDate}T00:00:00+08:00`);
  const startOfNextDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  return Boolean(await Alert.findOne({
    where: {
      user_id: userId,
      alert_type: 'daily_weather_report',
      created_at: { [Op.gte]: startOfDay, [Op.lt]: startOfNextDay }
    }
  }));
}

/**
 * Generates the HTML for the daily weather report email.
 * @param {Object} weather - Current weather data.
 * @param {Object} forecast - Forecast data.
 * @param {Array} farmerCrops - List of crops the farmer is currently growing.
 * @returns {string} HTML email string.
 */
function generateWeatherEmailHtml(weather, forecast, farmerCrops) {
  let cropAnalysisHtml = '';

  if (farmerCrops && farmerCrops.length > 0) {
    const currentTemp = weather.temperature;
    const currentRain = weather.rainfall || 0; // assuming rainfall is in weather

    cropAnalysisHtml += `
      <div style="margin-top: 20px;">
        <h3 style="color: #2e7d32;">🌾 Crop Impact Analysis</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f1f8e9;">
            <th style="padding: 10px; border: 1px solid #c5e1a5;">Crop</th>
            <th style="padding: 10px; border: 1px solid #c5e1a5;">Status</th>
            <th style="padding: 10px; border: 1px solid #c5e1a5;">Vulnerabilities</th>
          </tr>
    `;

    farmerCrops.forEach(crop => {
      let issues = [];
      
      if (currentTemp < crop.ideal_temp_min) {
        issues.push(`Temperature too cold (Min: ${crop.ideal_temp_min}°C, Current: ${currentTemp}°C)`);
      } else if (currentTemp > crop.ideal_temp_max) {
        issues.push(`Temperature too hot (Max: ${crop.ideal_temp_max}°C, Current: ${currentTemp}°C)`);
      }
      
      if (currentRain > crop.rain_tolerance) {
        issues.push(`Rainfall exceeds tolerance (Max: ${crop.rain_tolerance}mm, Current: ${currentRain}mm)`);
      }

      const statusHtml = issues.length > 0 
        ? `<span style="color: #e65100; font-weight: bold;">Warning: ${issues.join(', ')}</span>`
        : `<span style="color: #2e7d32; font-weight: bold;">Optimal Conditions</span>`;

      cropAnalysisHtml += `
        <tr>
          <td style="padding: 10px; border: 1px solid #c5e1a5;">${crop.crop_name}</td>
          <td style="padding: 10px; border: 1px solid #c5e1a5;">${statusHtml}</td>
          <td style="padding: 10px; border: 1px solid #c5e1a5;">${crop.vulnerabilities || 'None noted'}</td>
        </tr>
      `;
    });

    cropAnalysisHtml += `
        </table>
      </div>
    `;
  } else {
    cropAnalysisHtml = '<p>No active crops recorded for analysis.</p>';
  }

  let forecastHtml = '';
  if (forecast && forecast.days) {
    forecastHtml += `
      <div style="margin-top: 20px;">
        <h3 style="color: #2e7d32;">📅 5-Day Forecast</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
    `;
    forecast.days.slice(0, 5).forEach(day => {
      forecastHtml += `
        <div style="flex: 1; min-width: 100px; padding: 10px; background-color: #f1f8e9; border: 1px solid #c5e1a5; border-radius: 5px; text-align: center;">
          <strong>${day.date}</strong><br/>
          ${day.description || 'Clear'}<br/>
          Temp: ${day.temp_min}°C - ${day.temp_max}°C<br/>
          Rain: ${day.rainfall || 0}mm
        </div>
      `;
    });
    forecastHtml += `
        </div>
      </div>
    `;
  }

  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <div style="background-color: #2e7d32; color: #fff; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
        <h2 style="margin: 0;">🌤 Daily Weather Report</h2>
      </div>
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px;">
        <h3 style="color: #2e7d32;">Current Conditions</h3>
        <p>
          <strong>Temperature:</strong> ${weather.temperature}°C<br/>
          <strong>Humidity:</strong> ${weather.humidity}%<br/>
          <strong>Wind Speed:</strong> ${weather.wind_speed} m/s<br/>
          <strong>Rainfall:</strong> ${weather.rainfall || 0} mm<br/>
          <strong>Conditions:</strong> ${weather.description || 'Clear'}
        </p>
        ${forecastHtml}
        ${cropAnalysisHtml}
        <p style="margin-top: 20px; font-size: 12px; color: #777; text-align: center;">
          Provided by AGRIDEB Agricultural Platform
        </p>
      </div>
    </div>
  `;
}

/**
 * Generates the HTML for the storm alert email.
 * @param {Object} typhoonAssessment - The risk assessment object.
 * @param {Array} farmerCrops - List of crops the farmer is currently growing.
 * @returns {string} HTML email string.
 */
function generateStormAlertEmailHtml(typhoonAssessment, farmerCrops) {
  let riskColor;
  switch (typhoonAssessment.overallRisk) {
    case 'WATCH': riskColor = '#fbc02d'; break;     // Yellow
    case 'WARNING': riskColor = '#f57c00'; break;   // Orange
    case 'EMERGENCY': riskColor = '#d32f2f'; break; // Red
    default: riskColor = '#388e3c'; break;          // Green
  }

  let signalsHtml = '';
  if (typhoonAssessment.signals && typhoonAssessment.signals.length > 0) {
    signalsHtml += '<h3>\ud83d\udce1 Storm Signals</h3><ul>';
    typhoonAssessment.signals.forEach(sig => {
      const actionsHtml = (sig.actions || []).map(a => '<li>' + a + '</li>').join('');
      signalsHtml += '<li style="margin-bottom: 10px;">' +
        '<strong>' + sig.title + '</strong><br/>' +
        sig.description + '<br/>' +
        '<em>Recommended Actions:</em>' +
        '<ul>' + actionsHtml + '</ul>' +
        '</li>';
    });
    signalsHtml += '</ul>';
  }

  let emergencyChecklistHtml = '';
  if (typhoonAssessment.emergencyChecklist && typhoonAssessment.emergencyChecklist.length > 0) {
    emergencyChecklistHtml += '<h3>📋 Emergency Checklist</h3><ul>';
    typhoonAssessment.emergencyChecklist.forEach(item => {
      emergencyChecklistHtml += `<li>${item}</li>`;
    });
    emergencyChecklistHtml += '</ul>';
  }

  let cropAnalysisHtml = '';
  if (farmerCrops && farmerCrops.length > 0) {
    cropAnalysisHtml += '<h3>🌾 Potential Crop Damage</h3><ul>';
    farmerCrops.forEach(crop => {
      cropAnalysisHtml += `
        <li>
          <strong>${crop.crop_name}</strong> - Vulnerabilities: ${crop.vulnerabilities || 'None noted'}
        </li>
      `;
    });
    cropAnalysisHtml += '</ul>';
  }

  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <div style="background-color: ${riskColor}; color: #fff; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
        <h2 style="margin: 0;">⚠️ STORM ALERT: ${typhoonAssessment.overallRisk}</h2>
      </div>
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px;">
        <p>A severe weather event has been detected that may impact your agricultural operations.</p>
        ${signalsHtml}
        ${emergencyChecklistHtml}
        ${cropAnalysisHtml}
        <p style="margin-top: 20px; font-size: 12px; color: #777; text-align: center;">
          Stay Safe! Provided by AGRIDEB Agricultural Platform
        </p>
      </div>
    </div>
  `;
}

/**
 * Sends a daily weather report to all farmers.
 */
async function sendDailyWeatherReport() {
  let usersNotified = 0;
  try {
    console.log('🌤️ Fetching current weather and forecast for daily report...');
    const weather = await weatherService.fetchCurrentWeather();
    const forecast = await weatherService.fetchForecast();

    console.log('🧑‍🌾 Fetching agriculturists...');
    const farmers = await User.findAll({
      where: { role: 'Agriculturist' },
      include: [
        {
          model: FarmPlot,
          as: 'plots',
          include: [
            {
              model: PlantingRecord,
              as: 'plantingRecords',
              where: { status: 'Growing' },
              required: false,
              include: [{ model: CropRepository, as: 'crop' }]
            }
          ]
        }
      ]
    });

    for (const farmer of farmers) {
      if (await hasDailyWeatherReportToday(farmer.user_id)) {
        console.log(`ℹ️ Daily weather report already sent to user ${farmer.user_id} today.`);
        continue;
      }

      // Extract unique crops the farmer is currently growing
      const farmerCrops = [];
      const cropIds = new Set();
      
      if (farmer.plots) {
        farmer.plots.forEach(plot => {
          if (plot.plantingRecords) {
            plot.plantingRecords.forEach(record => {
              if (record.crop && !cropIds.has(record.crop.crop_id)) {
                farmerCrops.push(record.crop);
                cropIds.add(record.crop.crop_id);
              }
            });
          }
        });
      }

      const htmlContent = generateWeatherEmailHtml(weather, forecast, farmerCrops);
      
      if (farmer.email) {
        await emailService.sendEmail({
          to: farmer.email,
          subject: '[AGRIDEB] Daily Agricultural Weather Report 🌤',
          text: 'Please view this email in an HTML-compatible client.',
          html: htmlContent
        });
      }

      if (farmer.sms_opt_in && farmer.contact_number) {
        const smsMessage = `[AGRIDEB] Weather Update: Temp ${weather.temperature}C, ${weather.description || 'Clear'}. Check your email for full crop impact analysis.`;
        await smsService.sendSms({
          to: farmer.contact_number,
          message: smsMessage
        });
      }

      await Alert.create({
        user_id: farmer.user_id,
        message: 'Daily weather report sent.',
        alert_type: 'daily_weather_report'
      });

      usersNotified++;
    }

    console.log(`✅ Daily weather report sent to ${usersNotified} users.`);
    return { usersNotified };
  } catch (error) {
    console.error('❌ Error sending daily weather report:', error);
    throw error;
  }
}

/**
 * Checks for typhoons and sends storm alerts if necessary.
 */
async function checkAndSendStormAlerts() {
  let usersNotified = 0;
  try {
    console.log('🌪️ Checking for storm alerts...');
    const forecast = await weatherService.fetchForecast();
    
    // Assess risk based on forecast days
    const typhoonAssessment = await typhoonAlertService.assessTyphoonRisk(forecast.days);
    
    if (typhoonAssessment.overallRisk === 'NONE') {
      console.log('✅ No storm risks detected.');
      return { usersNotified: 0, riskLevel: 'NONE' };
    }

    console.log(`⚠️ Storm risk detected: ${typhoonAssessment.overallRisk}. Fetching agriculturists...`);
    const farmers = await User.findAll({
      where: { role: 'Agriculturist' },
      include: [
        {
          model: FarmPlot,
          as: 'plots',
          include: [
            {
              model: PlantingRecord,
              as: 'plantingRecords',
              where: { status: 'Growing' },
              required: false,
              include: [{ model: CropRepository, as: 'crop' }]
            }
          ]
        }
      ]
    });

    for (const farmer of farmers) {
      // Extract unique crops the farmer is currently growing
      const farmerCrops = [];
      const cropIds = new Set();
      
      if (farmer.plots) {
        farmer.plots.forEach(plot => {
          if (plot.plantingRecords) {
            plot.plantingRecords.forEach(record => {
              if (record.crop && !cropIds.has(record.crop.crop_id)) {
                farmerCrops.push(record.crop);
                cropIds.add(record.crop.crop_id);
              }
            });
          }
        });
      }

      const htmlContent = generateStormAlertEmailHtml(typhoonAssessment, farmerCrops);
      
      if (farmer.email) {
        await emailService.sendEmail({
          to: farmer.email,
          subject: `[AGRIDEB] STORM ALERT: ${typhoonAssessment.overallRisk} ⚠️`,
          text: 'A severe weather event has been detected. Please view this email in an HTML-compatible client.',
          html: htmlContent
        });
      }

      if (farmer.sms_opt_in && farmer.contact_number) {
        const smsMessage = `[AGRIDEB] STORM ${typhoonAssessment.overallRisk}: Severe weather detected. Secure your farm and check your email for full details.`;
        await smsService.sendSms({
          to: farmer.contact_number,
          message: smsMessage
        });
      }

      await Alert.create({
        user_id: farmer.user_id,
        message: `Storm alert sent (${typhoonAssessment.overallRisk})`,
        alert_type: 'storm_alert'
      });

      usersNotified++;
    }

    console.log(`✅ Storm alerts sent to ${usersNotified} users.`);
    return { usersNotified, riskLevel: typhoonAssessment.overallRisk };
  } catch (error) {
    console.error('❌ Error checking and sending storm alerts:', error);
    throw error;
  }
}

module.exports = {
  sendDailyWeatherReport,
  checkAndSendStormAlerts,
  generateWeatherEmailHtml,
  generateStormAlertEmailHtml,
  hasDailyWeatherReportToday
};
