const express = require('express');
const router = express.Router();
const path = require('path');
const { Op } = require('sequelize');
const weatherService = require('../utils/weatherService');
const authPresenter = require('../presenters/authPresenter');
const { User, FarmPlot, PlantingRecord, CropRepository, WeatherLog, Alert, Trivia } = require('../models');

// Auth routes
router.get('/', authPresenter.redirectLogin);
router.get('/login', authPresenter.getLogin);
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    if (email) {
      const user = await User.findOne({ where: { email } });
      if (user) {
        if (user.role === 'Admin') {
          return res.redirect('/admin/dashboard');
        } else {
          return res.redirect('/farmer/dashboard');
        }
      }
    }
    // Default fallback
    res.redirect('/farmer/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    res.redirect('/farmer/dashboard');
  }
});

// Logout route
router.get('/logout', (req, res) => {
  res.redirect('/login');
});

// ==========================================
// 🌾 FARMER PAGE ROUTES
// ==========================================
const getFarmerDashboard = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'farmer-dashboard.html'));
};

const getPage = (pageName) => (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', pageName + '.html'));
};

router.get('/farmer', (req, res) => res.redirect('/farmer/dashboard'));
router.get('/farmer/dashboard', getFarmerDashboard);
router.get('/farmer/crop-management', getPage('crop-management'));
router.get('/farmer/weather-analytics', getPage('weather-analytics'));
router.get('/farmer/digital-repository', getPage('digital-repository'));
router.get('/farmer/profile', getPage('profile'));

// Legacy redirect
router.get('/dashboard', (req, res) => res.redirect('/farmer/dashboard'));

// ==========================================
// 🛡️ ADMIN PAGE ROUTES
// ==========================================
const getAdminDashboard = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'admin-dashboard.html'));
};

router.get('/admin', (req, res) => res.redirect('/admin/dashboard'));
router.get('/admin/dashboard', getAdminDashboard);
router.get('/admin/crop-repository', getAdminDashboard);
router.get('/admin/digital-repository', getAdminDashboard);
router.get('/admin/weather-monitor', getAdminDashboard);
router.get('/admin/global-alerts', getAdminDashboard);

// ==========================================
// 🌾 AGRICULTURIST & FARMER REST API ROUTES
// ==========================================

// Get all initial dashboard/farmer data (scoping to default user "Juan Ramos")
router.get('/api/farmer/data', async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: 'juan.ramos@masbatefarming.ph' } });
    if (!user) {
      return res.status(404).json({ error: 'Farmer user not found' });
    }

    const plots = await FarmPlot.findAll({
      where: { user_id: user.user_id }
    });

    const crops = await CropRepository.findAll();

    const plantingRecords = await PlantingRecord.findAll({
      include: [
        { 
          model: FarmPlot, 
          as: 'plot',
          where: { user_id: user.user_id }
        },
        { 
          model: CropRepository, 
          as: 'crop' 
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      user,
      plots,
      crops,
      plantingRecords
    });
  } catch (err) {
    console.error('API Error /api/farmer/data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 1. Create a new planting record (Register planting batch)
router.post('/api/planting-records', async (req, res) => {
  try {
    const { plot_id, crop_id, planting_date } = req.body;

    if (!plot_id || !crop_id || !planting_date) {
      return res.status(400).json({ error: 'Missing required fields: plot_id, crop_id, planting_date' });
    }

    // Check if the plot already has an active planting record ('Growing')
    // If it does, mark that record as 'Harvested' (moving it to history) before planting the new crop.
    const activeRecord = await PlantingRecord.findOne({
      where: { plot_id, status: 'Growing' }
    });

    if (activeRecord) {
      activeRecord.status = 'Harvested';
      await activeRecord.save();
    }

    // Create the new planting record
    const newRecord = await PlantingRecord.create({
      plot_id: parseInt(plot_id),
      crop_id: parseInt(crop_id),
      planting_date,
      status: 'Growing'
    });

    // Fetch full detailed record to return
    const detailedRecord = await PlantingRecord.findByPk(newRecord.record_id, {
      include: [
        { model: FarmPlot, as: 'plot' },
        { model: CropRepository, as: 'crop' }
      ]
    });

    res.status(201).json(detailedRecord);
  } catch (err) {
    console.error('API Error POST /api/planting-records:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. Update an existing planting record (Edit details)
router.put('/api/planting-records/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { crop_id, planting_date, plot_id, status } = req.body;

    const record = await PlantingRecord.findByPk(id);
    if (!record) {
      return res.status(404).json({ error: 'Planting record not found' });
    }

    if (crop_id) record.crop_id = parseInt(crop_id);
    if (planting_date) record.planting_date = planting_date;
    if (plot_id) record.plot_id = parseInt(plot_id);
    if (status) record.status = status;

    await record.save();

    const detailedRecord = await PlantingRecord.findByPk(record.record_id, {
      include: [
        { model: FarmPlot, as: 'plot' },
        { model: CropRepository, as: 'crop' }
      ]
    });

    res.json(detailedRecord);
  } catch (err) {
    console.error('API Error PUT /api/planting-records:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3. Delete a planting record entirely
router.delete('/api/planting-records/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const record = await PlantingRecord.findByPk(id);
    if (!record) {
      return res.status(404).json({ error: 'Planting record not found' });
    }

    await record.destroy();
    res.json({ success: true, message: 'Planting record deleted successfully' });
  } catch (err) {
    console.error('API Error DELETE /api/planting-records:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 4. Mark a planting record as harvested (Archive crop)
router.post('/api/planting-records/:id/harvest', async (req, res) => {
  try {
    const { id } = req.params;
    const record = await PlantingRecord.findByPk(id);
    if (!record) {
      return res.status(404).json({ error: 'Planting record not found' });
    }

    record.status = 'Harvested';
    await record.save();

    const detailedRecord = await PlantingRecord.findByPk(record.record_id, {
      include: [
        { model: FarmPlot, as: 'plot' },
        { model: CropRepository, as: 'crop' }
      ]
    });

    res.json(detailedRecord);
  } catch (err) {
    console.error('API Error POST /api/planting-records/:id/harvest:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 5. Create a new FarmPlot
router.post('/api/plots', async (req, res) => {
  try {
    const { plot_name, area_size } = req.body;
    if (!plot_name || !area_size) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const user = await User.findOne({ where: { email: 'juan.ramos@masbatefarming.ph' } });
    if (!user) {
      return res.status(404).json({ error: 'Farmer user not found' });
    }
    const newPlot = await FarmPlot.create({
      user_id: user.user_id,
      plot_name,
      area_size: parseFloat(area_size)
    });
    res.status(201).json(newPlot);
  } catch (err) {
    console.error('API Error POST /api/plots:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 6. Get all crops (shared by farmer and admin)
router.get('/api/crops', async (req, res) => {
  try {
    const crops = await CropRepository.findAll({ order: [['crop_name', 'ASC']] });
    res.json(crops);
  } catch (err) {
    console.error('API Error GET /api/crops:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 7. Create a new CropRepository variety (legacy farmer route)
router.post('/api/crops', async (req, res) => {
  try {
    const { crop_name, ideal_temp_min, ideal_temp_max, rain_tolerance, days_to_harvest, best_practices } = req.body;
    if (!crop_name || !ideal_temp_min || !ideal_temp_max || !rain_tolerance || !days_to_harvest) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newCrop = await CropRepository.create({
      crop_name,
      ideal_temp_min: parseFloat(ideal_temp_min),
      ideal_temp_max: parseFloat(ideal_temp_max),
      rain_tolerance: parseFloat(rain_tolerance),
      days_to_harvest: parseInt(days_to_harvest),
      best_practices: best_practices || null
    });
    res.status(201).json(newCrop);
  } catch (err) {
    console.error('API Error POST /api/crops:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ==========================================
// 🌤️ OPENWEATHER API PROXY ROUTES
// ==========================================

// Current weather data (proxied to keep API key server-side)
router.get('/api/weather/current', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const data = await weatherService.fetchCurrentWeather(lat, lon);
    res.json(data);
  } catch (err) {
    console.error('Weather API Error:', err.message);
    res.status(503).json({ 
      error: 'Weather data unavailable', 
      message: err.message,
      fallback: true
    });
  }
});

// 5-day forecast (aggregated to daily summaries)
router.get('/api/weather/forecast', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const data = await weatherService.fetchForecast(lat, lon);
    res.json(data);
  } catch (err) {
    console.error('Forecast API Error:', err.message);
    res.status(503).json({ 
      error: 'Forecast data unavailable', 
      message: err.message,
      fallback: true 
    });
  }
});

// Forecast risk analysis (with agricultural context)
router.get('/api/weather/risks', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const forecast = await weatherService.fetchForecast(lat, lon);
    const risks = weatherService.generateForecastRisks(forecast.days);
    res.json({ risks, forecast_summary: forecast });
  } catch (err) {
    console.error('Risk API Error:', err.message);
    res.status(503).json({ 
      error: 'Risk analysis unavailable', 
      message: err.message 
    });
  }
});

// Save current weather to historical log
router.post('/api/weather/log', async (req, res) => {
  try {
    const { lat, lon } = req.body;
    const current = await weatherService.fetchCurrentWeather(lat, lon);
    
    const log = await WeatherLog.create({
      timestamp: new Date(current.dt),
      temperature: current.temperature,
      humidity: current.humidity,
      wind_speed: current.wind_speed,
      rainfall: current.rainfall,
      data_source: 'API'
    });
    
    res.status(201).json(log);
  } catch (err) {
    console.error('Weather Log Error:', err.message);
    res.status(500).json({ error: 'Failed to log weather data' });
  }
});

// Get historical weather logs
router.get('/api/weather/history', async (req, res) => {
  try {
    const logs = await WeatherLog.findAll({
      order: [['timestamp', 'DESC']],
      limit: 30
    });
    res.json(logs);
  } catch (err) {
    console.error('Weather History Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch weather history' });
  }
});


// ==========================================
// 🛡️ ADMIN REST API ROUTES
// ==========================================

// Admin Dashboard Stats
router.get('/api/admin/stats', async (req, res) => {
  try {
    // Count registered farmers (Agriculturist role)
    const totalFarmers = await User.count({ where: { role: 'Agriculturist' } });

    // Count active farm plots (plots that have a "Growing" planting record)
    const activePlots = await PlantingRecord.count({ where: { status: 'Growing' } });

    // Check API status — look at most recent weather log with source "API"
    const lastApiLog = await WeatherLog.findOne({
      where: { data_source: 'API' },
      order: [['timestamp', 'DESC']]
    });

    let apiStatus = 'offline';
    let lastLogTime = null;
    if (lastApiLog) {
      lastLogTime = lastApiLog.timestamp;
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (new Date(lastApiLog.timestamp) > oneHourAgo) {
        apiStatus = 'online';
      }
    }

    // Recent weather logs (last 5)
    const recentLogs = await WeatherLog.findAll({
      order: [['timestamp', 'DESC']],
      limit: 5
    });

    // Recent admin broadcast alerts (last 5)
    const recentAlerts = await Alert.findAll({
      where: { alert_type: 'Admin Broadcast' },
      order: [['created_at', 'DESC']],
      limit: 5
    });

    res.json({
      totalFarmers,
      activePlots,
      apiStatus,
      lastLogTime,
      recentLogs,
      recentAlerts
    });
  } catch (err) {
    console.error('API Error /api/admin/stats:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Admin Crop CRUD
router.post('/api/admin/crops', async (req, res) => {
  try {
    const { crop_name, ideal_temp_min, ideal_temp_max, rain_tolerance, days_to_harvest, best_practices } = req.body;
    if (!crop_name || ideal_temp_min == null || ideal_temp_max == null || rain_tolerance == null || days_to_harvest == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Upsert: check if crop name already exists
    const existing = await CropRepository.findOne({ where: { crop_name } });
    if (existing) {
      existing.ideal_temp_min = parseFloat(ideal_temp_min);
      existing.ideal_temp_max = parseFloat(ideal_temp_max);
      existing.rain_tolerance = parseFloat(rain_tolerance);
      existing.days_to_harvest = parseInt(days_to_harvest);
      existing.best_practices = best_practices || null;
      await existing.save();
      return res.json(existing);
    }

    const newCrop = await CropRepository.create({
      crop_name,
      ideal_temp_min: parseFloat(ideal_temp_min),
      ideal_temp_max: parseFloat(ideal_temp_max),
      rain_tolerance: parseFloat(rain_tolerance),
      days_to_harvest: parseInt(days_to_harvest),
      best_practices: best_practices || null
    });
    res.status(201).json(newCrop);
  } catch (err) {
    console.error('API Error POST /api/admin/crops:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/api/admin/crops/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { crop_name, ideal_temp_min, ideal_temp_max, rain_tolerance, days_to_harvest, best_practices } = req.body;

    const crop = await CropRepository.findByPk(id);
    if (!crop) {
      return res.status(404).json({ error: 'Crop not found' });
    }

    if (crop_name) crop.crop_name = crop_name;
    if (ideal_temp_min != null) crop.ideal_temp_min = parseFloat(ideal_temp_min);
    if (ideal_temp_max != null) crop.ideal_temp_max = parseFloat(ideal_temp_max);
    if (rain_tolerance != null) crop.rain_tolerance = parseFloat(rain_tolerance);
    if (days_to_harvest != null) crop.days_to_harvest = parseInt(days_to_harvest);
    if (best_practices !== undefined) crop.best_practices = best_practices || null;

    await crop.save();
    res.json(crop);
  } catch (err) {
    console.error('API Error PUT /api/admin/crops:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/api/admin/crops/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const crop = await CropRepository.findByPk(id);
    if (!crop) {
      return res.status(404).json({ error: 'Crop not found' });
    }
    await crop.destroy();
    res.json({ success: true, message: 'Crop deleted successfully' });
  } catch (err) {
    console.error('API Error DELETE /api/admin/crops:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Admin Trivia CRUD
router.get('/api/admin/trivia', async (req, res) => {
  try {
    const trivia = await Trivia.findAll({
      order: [['created_at', 'DESC']],
      include: [{ model: User, as: 'publisher', attributes: ['full_name'] }]
    });
    res.json(trivia);
  } catch (err) {
    console.error('API Error GET /api/admin/trivia:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/api/admin/trivia', async (req, res) => {
  try {
    const { content, crop_tag } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Get admin user (default to first admin)
    const admin = await User.findOne({ where: { role: 'Admin' } });
    if (!admin) {
      return res.status(404).json({ error: 'No admin user found' });
    }

    const trivia = await Trivia.create({
      content,
      crop_tag: crop_tag || 'General',
      published_by: admin.user_id
    });

    res.status(201).json(trivia);
  } catch (err) {
    console.error('API Error POST /api/admin/trivia:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/api/admin/trivia/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const trivia = await Trivia.findByPk(id);
    if (!trivia) {
      return res.status(404).json({ error: 'Trivia not found' });
    }
    await trivia.destroy();
    res.json({ success: true, message: 'Trivia deleted successfully' });
  } catch (err) {
    console.error('API Error DELETE /api/admin/trivia:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Admin Weather Logs (with date range filter)
router.get('/api/admin/weather-logs', async (req, res) => {
  try {
    const { from, to } = req.query;
    const where = {};

    if (from || to) {
      where.timestamp = {};
      if (from) where.timestamp[Op.gte] = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        where.timestamp[Op.lte] = toDate;
      }
    }

    const logs = await WeatherLog.findAll({
      where,
      order: [['timestamp', 'DESC']],
      limit: 100
    });

    res.json(logs);
  } catch (err) {
    console.error('API Error GET /api/admin/weather-logs:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Admin Send Campus-Wide Alert
router.post('/api/admin/alerts', async (req, res) => {
  try {
    const { message, audience, crop_name } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let targetUserIds = [];

    if (audience === 'crop' && crop_name) {
      // Find all plots growing that crop
      const crop = await CropRepository.findOne({ where: { crop_name } });
      if (!crop) {
        return res.status(404).json({ error: 'Crop not found' });
      }

      const records = await PlantingRecord.findAll({
        where: { crop_id: crop.crop_id, status: 'Growing' },
        include: [{ model: FarmPlot, as: 'plot', attributes: ['user_id'] }]
      });

      const userIdSet = new Set(records.map(r => r.plot.user_id));
      targetUserIds = [...userIdSet];
    } else {
      // All farmers
      const farmers = await User.findAll({ where: { role: 'Agriculturist' }, attributes: ['user_id'] });
      targetUserIds = farmers.map(f => f.user_id);
    }

    // Create alert records for each target user
    const alertRecords = [];
    for (const userId of targetUserIds) {
      const alert = await Alert.create({
        user_id: userId,
        message,
        alert_type: 'Admin Broadcast',
        created_at: new Date()
      });
      alertRecords.push(alert);
    }

    res.status(201).json({
      success: true,
      message: 'Advisory sent successfully',
      recipientCount: targetUserIds.length
    });
  } catch (err) {
    console.error('API Error POST /api/admin/alerts:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Admin Get Sent Alerts History
router.get('/api/admin/alerts', async (req, res) => {
  try {
    // Get distinct admin broadcast messages with count
    const alerts = await Alert.findAll({
      where: { alert_type: 'Admin Broadcast' },
      order: [['created_at', 'DESC']],
      limit: 50
    });

    // Group by message + timestamp (within 1 minute = same broadcast)
    const grouped = [];
    const seen = new Set();

    for (const alert of alerts) {
      const key = alert.message + '|' + new Date(alert.created_at).toISOString().substring(0, 16);
      if (!seen.has(key)) {
        seen.add(key);
        // Count how many alerts share this message and approximate timestamp
        const count = alerts.filter(a => {
          const aKey = a.message + '|' + new Date(a.created_at).toISOString().substring(0, 16);
          return aKey === key;
        }).length;

        grouped.push({
          message: alert.message,
          created_at: alert.created_at,
          recipient_count: count
        });
      }
    }

    res.json(grouped);
  } catch (err) {
    console.error('API Error GET /api/admin/alerts:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get trivia for farmers (public read endpoint)
router.get('/api/trivia', async (req, res) => {
  try {
    const { crop_tag } = req.query;
    const where = {};
    if (crop_tag && crop_tag !== 'all') {
      where[Op.or] = [{ crop_tag }, { crop_tag: 'General' }];
    }

    const trivia = await Trivia.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: 50
    });
    res.json(trivia);
  } catch (err) {
    console.error('API Error GET /api/trivia:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
