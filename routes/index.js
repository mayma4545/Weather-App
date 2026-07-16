const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const weatherService = require('../utils/weatherService');
const authPresenter = require('../presenters/authPresenter');
const { requireAuth, requireAdmin } = require('../middlewares/auth');
const { User, FarmPlot, PlantingRecord, CropRepository, WeatherLog, Alert, Trivia, SoilProfile, StationDevice, Otp } = require('../models');

// Lazy-load agricultural services (created after routes file)
let irrigationService, diseaseRiskService, fertilizerService, gddService, typhoonAlertService, todoService, satelliteService;
try { irrigationService = require('../services/irrigationService'); } catch(e) { console.warn('irrigationService not loaded:', e.message); }
try { diseaseRiskService = require('../services/diseaseRiskService'); } catch(e) { console.warn('diseaseRiskService not loaded:', e.message); }
try { fertilizerService = require('../services/fertilizerService'); } catch(e) { console.warn('fertilizerService not loaded:', e.message); }
try { gddService = require('../services/gddService'); } catch(e) { console.warn('gddService not loaded:', e.message); }
try { typhoonAlertService = require('../services/typhoonAlertService'); } catch(e) { console.warn('typhoonAlertService not loaded:', e.message); }
try { todoService = require('../services/todoService'); } catch(e) { console.warn('todoService not loaded:', e.message); }
try { satelliteService = require('../services/satelliteService'); } catch(e) { console.warn('satelliteService not loaded:', e.message); }
const { sendEmail } = require('../services/emailService');

// ==========================================
// 🔑 AUTH ROUTES (public)
// ==========================================
router.get('/', authPresenter.redirectLogin);
router.get('/login', authPresenter.getLogin);
// Helper to sanitize inputs and strip HTML tags
function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/<[^>]*>?/gm, '');
}

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'register.html'));
});

router.post('/register', async (req, res) => {
  try {
    const full_name = sanitizeInput(req.body.full_name);
    const contact_number = sanitizeInput(req.body.contact_number);
    const email = sanitizeInput(req.body.email)?.toLowerCase();
    const password = req.body.password;
    const identity_type = sanitizeInput(req.body.identity_type) || 'Farmer';
    const identity_specification = sanitizeInput(req.body.identity_specification) || null;

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      return res.status(400).json({ error: 'Password does not meet security requirements.' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const otp_code = crypto.randomInt(100000, 999999).toString();

    await Otp.destroy({ where: { email } });

    await Otp.create({
      email,
      otp_code,
      attempts: 0,
      user_data: JSON.stringify({
        full_name,
        contact_number: contact_number || null,
        email,
        password_hash,
        identity_type,
        identity_specification
      }),
      expires_at: new Date(Date.now() + 10 * 60 * 1000)
    });

    const htmlEmail = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #0f172a; margin: 0;">Project Weather</h2>
          <p style="color: #64748b; font-size: 14px;">Agricultural Weather & Crop Management System</p>
        </div>
        <div style="background: #f8fafc; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <h3 style="color: #0f172a; margin-top: 0; font-size: 18px;">Your Verification Code</h3>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 16px;">Enter the 6-digit code below to complete your registration:</p>
          <div style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #0ea5e9; background: #ffffff; padding: 16px; border-radius: 8px; border: 1px dashed #0ea5e9; display: inline-block;">
            ${otp_code}
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 16px; margin-bottom: 0;">This code expires in 10 minutes.</p>
        </div>
        <p style="color: #64748b; font-size: 14px;">If you did not request to create an account on Project Weather, please ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        to: email,
        subject: 'Project Weather - Your Verification Code (OTP)',
        text: `Your Project Weather verification code is ${otp_code}. It expires in 10 minutes.`,
        html: htmlEmail
      });
    } catch (emailErr) {
      console.warn('⚠️ Could not send OTP email via SMTP. If testing locally without credentials, check console logs.');
      console.log(`🔑 LOCAL/DEBUG OTP CODE FOR ${email}: ${otp_code}`);
    }

    req.session.pendingVerifyEmail = email;
    res.json({ success: true, redirectUrl: `/verify-otp?email=${encodeURIComponent(email)}` });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

router.get('/verify-otp', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'verify-otp.html'));
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp_code } = req.body;
    if (!email || !otp_code) {
      return res.status(400).json({ success: false, message: 'Email and 6-digit OTP code are required.' });
    }

    const record = await Otp.findOne({ where: { email } });
    if (!record) {
      return res.status(404).json({ success: false, message: 'No pending registration found or code has expired. Please register again.', restarted: true });
    }

    if (new Date() > new Date(record.expires_at)) {
      await record.destroy();
      return res.status(400).json({ success: false, message: 'Your verification code has expired. Please register again.', restarted: true });
    }

    if (record.otp_code !== otp_code.trim()) {
      record.attempts += 1;
      if (record.attempts >= 3) {
        await record.destroy();
        return res.status(400).json({
          success: false,
          restarted: true,
          message: 'You have entered an incorrect code 3 times. Your registration has been restarted for security reasons.'
        });
      } else {
        await record.save();
        const attemptsLeft = 3 - record.attempts;
        return res.status(400).json({
          success: false,
          message: `Incorrect verification code. Please try again. (${attemptsLeft} attempt${attemptsLeft > 1 ? 's' : ''} left)`,
          attemptsLeft
        });
      }
    }

    const userData = JSON.parse(record.user_data);

    const newUser = await User.create({
      full_name: userData.full_name,
      role: 'Agriculturist',
      contact_number: userData.contact_number || null,
      email: userData.email,
      password_hash: userData.password_hash,
      identity_type: userData.identity_type || 'Farmer',
      identity_specification: userData.identity_specification || null
    });

    await record.destroy();

    const loginLink = 'https://weather-app-rr5y.onrender.com/login';
    const welcomeHtml = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #0ea5e9; margin: 0;">Welcome to Project Weather! 🌱</h2>
          <p style="color: #64748b; font-size: 14px;">Agricultural Weather & Crop Management System</p>
        </div>
        <div style="color: #0f172a; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          <p>Hi <strong>${newUser.full_name}</strong>,</p>
          <p>Congratulations! Your registration as a <strong>${newUser.identity_type}${newUser.identity_specification ? ` (${newUser.identity_specification})` : ''}</strong> is complete and your account has been verified.</p>
          <p>You now have full access to real-time weather tracking, predictive agricultural modeling, and crop risk advisories tailored to your plots.</p>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${loginLink}" style="background-color: #0ea5e9; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.3);">
            Access System Dashboard
          </a>
        </div>
        <p style="color: #64748b; font-size: 14px; text-align: center;">
          Or login directly at:<br>
          <a href="${loginLink}" style="color: #0ea5e9;">${loginLink}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">Project Weather Team</p>
      </div>
    `;

    try {
      await sendEmail({
        to: newUser.email,
        subject: 'Welcome to Project Weather! Registration Successful 🌱',
        text: `Welcome ${newUser.full_name}! Your registration is complete. Login here: ${loginLink}`,
        html: welcomeHtml
      });
    } catch (emailErr) {
      console.warn('⚠️ Could not send Welcome email via SMTP:', emailErr.message);
    }

    res.json({ success: true, message: 'Registration successfully verified!' });
  } catch (err) {
    console.error('OTP Verification error:', err);
    res.status(500).json({ success: false, message: 'Verification failed due to a server error. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await User.findOne({ where: { email } });
      if (user) {
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
          return res.redirect('/login?error=Invalid email or password.');
        }
        // Store session data
        req.session.userId = user.user_id;
        req.session.userRole = user.role;
        req.session.userFullName = user.full_name;
        req.session.userEmail = user.email;

        if (user.role === 'Admin') {
          return res.redirect('/admin/dashboard');
        } else {
          return res.redirect('/farmer/dashboard');
        }
      }
    }
    res.redirect('/login?error=Invalid email or password.');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Login failed. Please try again.');
  }
});

// Logout route — destroy session
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// ==========================================
// 🌾 FARMER PAGE ROUTES (auth required)
// ==========================================
const getFarmerDashboard = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'farmer-dashboard.html'));
};

const getPage = (pageName) => (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', pageName + '.html'));
};

router.get('/farmer', requireAuth, (req, res) => res.redirect('/farmer/dashboard'));
router.get('/farmer/dashboard', requireAuth, getFarmerDashboard);
router.get('/farmer/crop-management', requireAuth, getPage('crop-management'));
router.get('/farmer/weather-analytics', requireAuth, getPage('weather-analytics'));
router.get('/farmer/digital-repository', requireAuth, getPage('digital-repository'));
router.get('/farmer/profile', requireAuth, getPage('profile'));

// Legacy redirect
router.get('/dashboard', (req, res) => res.redirect('/farmer/dashboard'));

// ==========================================
// 🛡️ ADMIN PAGE ROUTES (admin required)
// ==========================================
const getAdminDashboard = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'admin-dashboard.html'));
};

router.get('/admin', requireAuth, requireAdmin, (req, res) => res.redirect('/admin/dashboard'));
router.get('/admin/dashboard', requireAuth, requireAdmin, getAdminDashboard);
router.get('/admin/crop-repository', requireAuth, requireAdmin, getAdminDashboard);
router.get('/admin/digital-repository', requireAuth, requireAdmin, getAdminDashboard);
router.get('/admin/weather-monitor', requireAuth, requireAdmin, getAdminDashboard);
router.get('/admin/global-alerts', requireAuth, requireAdmin, getAdminDashboard);

// ==========================================
// 🌾 AGRICULTURIST & FARMER REST API ROUTES
// ==========================================

// Get session info (so frontend knows who is logged in)
router.get('/api/session', requireAuth, (req, res) => {
  res.json({
    userId: req.session.userId,
    userRole: req.session.userRole,
    fullName: req.session.userFullName,
    email: req.session.userEmail
  });
});

// Get all initial dashboard/farmer data (scoped to logged-in user via session)
router.get('/api/farmer/data', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Farmer user not found' });
    }

    const plots = await FarmPlot.findAll({
      where: { user_id: userId },
      attributes: ['plot_id', 'user_id', 'plot_name', 'area_size']
    });

    const crops = await CropRepository.findAll();

    const plantingRecords = await PlantingRecord.findAll({
      include: [
        { 
          model: FarmPlot, 
          as: 'plot',
          where: { user_id: userId },
          attributes: ['plot_id', 'user_id', 'plot_name', 'area_size']
        },
        { 
          model: CropRepository, 
          as: 'crop' 
        }
      ],
      order: [['planting_date', 'DESC'], ['record_id', 'DESC']]
    });

    res.json({
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        role: user.role,
        contact_number: user.contact_number,
        email: user.email,
        language_pref: user.language_pref,
        sms_opt_in: user.sms_opt_in
      },
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
router.post('/api/planting-records', requireAuth, async (req, res) => {
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
        { model: FarmPlot, as: 'plot', attributes: ['plot_id', 'user_id', 'plot_name', 'area_size'] },
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
router.put('/api/planting-records/:id', requireAuth, async (req, res) => {
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
        { model: FarmPlot, as: 'plot', attributes: ['plot_id', 'user_id', 'plot_name', 'area_size'] },
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
router.delete('/api/planting-records/:id', requireAuth, async (req, res) => {
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
router.post('/api/planting-records/:id/harvest', requireAuth, async (req, res) => {
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
        { model: FarmPlot, as: 'plot', attributes: ['plot_id', 'user_id', 'plot_name', 'area_size'] },
        { model: CropRepository, as: 'crop' }
      ]
    });

    res.json(detailedRecord);
  } catch (err) {
    console.error('API Error POST /api/planting-records/:id/harvest:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 5. Create a new FarmPlot (scoped to logged-in user)
router.post('/api/plots', requireAuth, async (req, res) => {
  try {
    const { plot_name, area_size, soil_type, latitude, longitude } = req.body;
    if (!plot_name || !area_size) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const userId = req.session.userId;
    const newPlot = await FarmPlot.create({
      user_id: userId,
      plot_name,
      area_size: parseFloat(area_size),
      soil_type: soil_type || null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null
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
router.post('/api/crops', requireAuth, async (req, res) => {
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
// 🧪 SOIL PROFILE MANAGEMENT
// ==========================================

// Get soil profile(s) for a plot
router.get('/api/plots/:id/soil', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const profiles = await SoilProfile.findAll({
      where: { plot_id: id },
      order: [['tested_date', 'DESC']]
    });
    res.json(profiles);
  } catch (err) {
    console.error('API Error GET /api/plots/:id/soil:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create or update soil profile for a plot
router.post('/api/plots/:id/soil', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { soil_type, ph, nitrogen_level, phosphorus_level, potassium_level, organic_matter, tested_date } = req.body;

    // Also update the plot's soil_type shorthand
    const plot = await FarmPlot.findByPk(id);
    if (!plot) return res.status(404).json({ error: 'Plot not found' });
    if (soil_type) {
      plot.soil_type = soil_type;
      await plot.save();
    }

    const profile = await SoilProfile.create({
      plot_id: parseInt(id),
      soil_type: soil_type || null,
      ph: ph ? parseFloat(ph) : null,
      nitrogen_level: nitrogen_level || null,
      phosphorus_level: phosphorus_level || null,
      potassium_level: potassium_level || null,
      organic_matter: organic_matter ? parseFloat(organic_matter) : null,
      tested_date: tested_date || new Date().toISOString().split('T')[0]
    });

    res.status(201).json(profile);
  } catch (err) {
    console.error('API Error POST /api/plots/:id/soil:', err);
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
// 📡 IOT WEATHER STATION ROUTES
// ==========================================

// Register a new weather station
router.post('/api/weather/stations', requireAuth, async (req, res) => {
  try {
    const { device_id, location_name, latitude, longitude } = req.body;
    if (!device_id) return res.status(400).json({ error: 'device_id is required' });

    const station = await StationDevice.create({
      device_id,
      owner_id: req.session.userId,
      location_name: location_name || null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      last_seen: new Date()
    });
    res.status(201).json(station);
  } catch (err) {
    console.error('API Error POST /api/weather/stations:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// List stations for current user
router.get('/api/weather/stations', requireAuth, async (req, res) => {
  try {
    const stations = await StationDevice.findAll({
      where: { owner_id: req.session.userId },
      order: [['last_seen', 'DESC']]
    });
    res.json(stations);
  } catch (err) {
    console.error('API Error GET /api/weather/stations:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Accept a sensor reading from an IoT station
router.post('/api/weather/station/reading', async (req, res) => {
  try {
    const { device_id, temperature, humidity, wind_speed, rainfall } = req.body;
    if (!device_id || temperature == null || humidity == null) {
      return res.status(400).json({ error: 'Missing required fields: device_id, temperature, humidity' });
    }

    // Validate device exists
    const station = await StationDevice.findByPk(device_id);
    if (!station) return res.status(404).json({ error: 'Unknown station device' });

    // Update last_seen
    station.last_seen = new Date();
    await station.save();

    // Log the reading
    const log = await WeatherLog.create({
      timestamp: new Date(),
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      wind_speed: wind_speed ? parseFloat(wind_speed) : 0,
      rainfall: rainfall ? parseFloat(rainfall) : 0,
      data_source: 'Station',
      station_id: device_id
    });

    res.status(201).json(log);
  } catch (err) {
    console.error('Station Reading Error:', err);
    res.status(500).json({ error: 'Failed to log station reading' });
  }
});

// ==========================================
// 🧠 AGRICULTURAL ADVISOR API ROUTES
// ==========================================

// Helper: fetch plot with active crop and weather data
async function getPlotContext(plotId) {
  const plot = await FarmPlot.findByPk(plotId);
  if (!plot) return null;

  const activeRecord = await PlantingRecord.findOne({
    where: { plot_id: plotId, status: 'Growing' },
    include: [{ model: CropRepository, as: 'crop' }]
  });

  // Get latest soil profile
  const soilProfile = await SoilProfile.findOne({
    where: { plot_id: plotId },
    order: [['tested_date', 'DESC']]
  });

  // Get current weather and forecast
  const lat = plot.latitude || process.env.WEATHER_LAT || '12.3703';
  const lon = plot.longitude || process.env.WEATHER_LON || '123.6217';

  let currentWeather = null;
  let forecast = null;
  try {
    currentWeather = await weatherService.fetchCurrentWeather(lat, lon);
    forecast = await weatherService.fetchForecast(lat, lon);
  } catch (e) {
    console.warn('Weather fetch failed for advisor:', e.message);
  }

  return { plot, activeRecord, soilProfile, currentWeather, forecast };
}

// Irrigation Advisor
router.get('/api/advisor/irrigation', requireAuth, async (req, res) => {
  try {
    const { plot_id } = req.query;
    if (!plot_id) return res.status(400).json({ error: 'plot_id required' });
    if (!irrigationService) return res.status(503).json({ error: 'Irrigation service not available' });

    const ctx = await getPlotContext(plot_id);
    if (!ctx) return res.status(404).json({ error: 'Plot not found' });
    if (!ctx.currentWeather || !ctx.forecast) return res.status(503).json({ error: 'Weather data unavailable' });

    const cropName = ctx.activeRecord ? ctx.activeRecord.crop.crop_name : 'Unknown';
    const daysGrown = ctx.activeRecord ? Math.ceil((Date.now() - new Date(ctx.activeRecord.planting_date).getTime()) / (1000*60*60*24)) : 0;
    const growthStage = gddService ? gddService.estimateGrowthStage(cropName, daysGrown) : 'mid';
    const soilType = ctx.plot.soil_type || (ctx.soilProfile ? ctx.soilProfile.soil_type : null);

    const result = irrigationService.getIrrigationRecommendation(
      ctx.currentWeather,
      ctx.forecast.days,
      cropName,
      growthStage,
      soilType
    );

    res.json(result);
  } catch (err) {
    console.error('Irrigation Advisor Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Disease Risk Advisor
router.get('/api/advisor/disease-risk', requireAuth, async (req, res) => {
  try {
    const { plot_id } = req.query;
    if (!plot_id) return res.status(400).json({ error: 'plot_id required' });
    if (!diseaseRiskService) return res.status(503).json({ error: 'Disease risk service not available' });

    const ctx = await getPlotContext(plot_id);
    if (!ctx) return res.status(404).json({ error: 'Plot not found' });
    if (!ctx.currentWeather || !ctx.forecast) return res.status(503).json({ error: 'Weather data unavailable' });

    const cropName = ctx.activeRecord ? ctx.activeRecord.crop.crop_name : 'General';
    const daysGrown = ctx.activeRecord ? Math.ceil((Date.now() - new Date(ctx.activeRecord.planting_date).getTime()) / (1000*60*60*24)) : 0;
    const growthStage = gddService ? gddService.estimateGrowthStage(cropName, daysGrown) : 'vegetative';

    const result = diseaseRiskService.assessDiseaseRisks(
      ctx.currentWeather,
      ctx.forecast.days,
      cropName,
      growthStage
    );

    res.json({ diseases: result, cropName, growthStage });
  } catch (err) {
    console.error('Disease Risk Advisor Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fertilizer Timing Advisor
router.get('/api/advisor/fertilizer', requireAuth, async (req, res) => {
  try {
    const { plot_id } = req.query;
    if (!plot_id) return res.status(400).json({ error: 'plot_id required' });
    if (!fertilizerService) return res.status(503).json({ error: 'Fertilizer service not available' });

    const ctx = await getPlotContext(plot_id);
    if (!ctx) return res.status(404).json({ error: 'Plot not found' });

    const cropName = ctx.activeRecord ? ctx.activeRecord.crop.crop_name : 'Unknown';
    const daysGrown = ctx.activeRecord ? Math.ceil((Date.now() - new Date(ctx.activeRecord.planting_date).getTime()) / (1000*60*60*24)) : 0;
    const growthStage = gddService ? gddService.estimateGrowthStage(cropName, daysGrown) : 'vegetative';
    const forecastDays = ctx.forecast ? ctx.forecast.days : [];
    const soilNutrients = ctx.soilProfile ? {
      nitrogen_level: ctx.soilProfile.nitrogen_level,
      phosphorus_level: ctx.soilProfile.phosphorus_level,
      potassium_level: ctx.soilProfile.potassium_level
    } : null;

    const result = fertilizerService.getFertilizerRecommendation(
      cropName, growthStage, daysGrown, forecastDays, soilNutrients
    );

    res.json(result);
  } catch (err) {
    console.error('Fertilizer Advisor Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GDD Growth Stage Advisor
router.get('/api/advisor/gdd', requireAuth, async (req, res) => {
  try {
    const { plot_id } = req.query;
    if (!plot_id) return res.status(400).json({ error: 'plot_id required' });
    if (!gddService) return res.status(503).json({ error: 'GDD service not available' });

    const ctx = await getPlotContext(plot_id);
    if (!ctx) return res.status(404).json({ error: 'Plot not found' });
    if (!ctx.activeRecord) return res.json({ error: 'No active crop on this plot', hasActiveCrop: false });

    const cropName = ctx.activeRecord.crop.crop_name;
    const plantingDate = ctx.activeRecord.planting_date;

    const result = gddService.getGDDAdvisorData(
      cropName,
      plantingDate,
      ctx.currentWeather,
      ctx.forecast ? ctx.forecast.days : []
    );

    res.json({ ...result, cropName, plantingDate });
  } catch (err) {
    console.error('GDD Advisor Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Typhoon / Extreme Weather Advisor
router.get('/api/advisor/typhoon', requireAuth, async (req, res) => {
  try {
    if (!typhoonAlertService) return res.status(503).json({ error: 'Typhoon alert service not available' });

    const { lat, lon } = req.query;
    const forecast = await weatherService.fetchForecast(
      lat || process.env.WEATHER_LAT || '12.3703',
      lon || process.env.WEATHER_LON || '123.6217'
    );

    const result = typhoonAlertService.assessTyphoonRisk(forecast.days);
    res.json(result);
  } catch (err) {
    console.error('Typhoon Advisor Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Aggregated Dashboard Advisor — returns ALL advisor data for a plot in one call
router.get('/api/advisor/dashboard', requireAuth, async (req, res) => {
  try {
    const { plot_id } = req.query;
    if (!plot_id) return res.status(400).json({ error: 'plot_id required' });

    const ctx = await getPlotContext(plot_id);
    if (!ctx) return res.status(404).json({ error: 'Plot not found' });

    const cropName = ctx.activeRecord ? ctx.activeRecord.crop.crop_name : null;
    const plantingDate = ctx.activeRecord ? ctx.activeRecord.planting_date : null;
    const daysGrown = plantingDate ? Math.ceil((Date.now() - new Date(plantingDate).getTime()) / (1000*60*60*24)) : 0;
    const growthStage = (gddService && cropName) ? gddService.estimateGrowthStage(cropName, daysGrown) : 'vegetative';
    const soilType = ctx.plot.soil_type || (ctx.soilProfile ? ctx.soilProfile.soil_type : null);

    const result = {
      plot: { plot_id: ctx.plot.plot_id, plot_name: ctx.plot.plot_name, soil_type: soilType },
      crop: cropName,
      plantingDate,
      daysGrown,
      irrigation: null,
      diseaseRisk: null,
      fertilizer: null,
      gdd: null,
      typhoon: null
    };

    // Run all advisors in parallel
    const promises = [];

    if (irrigationService && ctx.currentWeather && ctx.forecast) {
      promises.push(
        Promise.resolve().then(() => {
          result.irrigation = irrigationService.getIrrigationRecommendation(
            ctx.currentWeather, ctx.forecast.days, cropName || 'Unknown', growthStage, soilType
          );
        }).catch(e => { result.irrigation = { error: e.message }; })
      );
    }

    if (diseaseRiskService && ctx.currentWeather && ctx.forecast) {
      promises.push(
        Promise.resolve().then(() => {
          result.diseaseRisk = diseaseRiskService.assessDiseaseRisks(
            ctx.currentWeather, ctx.forecast.days, cropName || 'General', growthStage
          );
        }).catch(e => { result.diseaseRisk = { error: e.message }; })
      );
    }

    if (fertilizerService && cropName) {
      promises.push(
        Promise.resolve().then(() => {
          const soilNutrients = ctx.soilProfile ? {
            nitrogen_level: ctx.soilProfile.nitrogen_level,
            phosphorus_level: ctx.soilProfile.phosphorus_level,
            potassium_level: ctx.soilProfile.potassium_level
          } : null;
          result.fertilizer = fertilizerService.getFertilizerRecommendation(
            cropName, growthStage, daysGrown, ctx.forecast ? ctx.forecast.days : [], soilNutrients
          );
        }).catch(e => { result.fertilizer = { error: e.message }; })
      );
    }

    if (gddService && cropName && plantingDate) {
      promises.push(
        Promise.resolve().then(() => {
          result.gdd = gddService.getGDDAdvisorData(
            cropName, plantingDate, ctx.currentWeather, ctx.forecast ? ctx.forecast.days : []
          );
        }).catch(e => { result.gdd = { error: e.message }; })
      );
    }

    if (typhoonAlertService && ctx.forecast) {
      promises.push(
        Promise.resolve().then(() => {
          result.typhoon = typhoonAlertService.assessTyphoonRisk(ctx.forecast.days);
        }).catch(e => { result.typhoon = { error: e.message }; })
      );
    }

    await Promise.all(promises);
    res.json(result);
  } catch (err) {
    console.error('Dashboard Advisor Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Smart To-Do List — generates prioritized tasks for the farmer's active plots
router.get('/api/todo', requireAuth, async (req, res) => {
  try {
    if (!todoService) return res.status(503).json({ error: 'Todo service not available' });

    const userId = req.session.userId;
    const { plot_id } = req.query;

    let targetPlots = [];
    if (plot_id) {
      const plot = await FarmPlot.findByPk(plot_id);
      if (!plot || plot.user_id !== userId) return res.status(404).json({ error: 'Plot not found' });
      targetPlots = [plot];
    } else {
      targetPlots = await FarmPlot.findAll({ where: { user_id: userId } });
    }

    if (targetPlots.length === 0) {
      return res.json({ generatedAt: new Date().toISOString(), totalTasks: 0, today: [], upcoming: [], all: [], message: 'No plots found. Add a plot and start planting to receive smart task suggestions.' });
    }

    const allResults = [];
    for (const plot of targetPlots) {
      const ctx = await getPlotContext(plot.plot_id);
      if (!ctx) continue;

      const cropName = ctx.activeRecord && ctx.activeRecord.crop ? ctx.activeRecord.crop.crop_name : null;
      const plantingDate = ctx.activeRecord ? ctx.activeRecord.planting_date : null;
      const daysGrown = plantingDate ? Math.ceil((Date.now() - new Date(plantingDate).getTime()) / (1000*60*60*24)) : 0;
      const growthStage = (gddService && cropName) ? gddService.estimateGrowthStage(cropName, daysGrown) : 'vegetative';
      const soilType = ctx.plot.soil_type || (ctx.soilProfile ? ctx.soilProfile.soil_type : null);

      let irrigation = null;
      let diseaseRisk = null;
      let fertilizer = null;
      let gdd = null;

      if (irrigationService && ctx.currentWeather && ctx.forecast && cropName) {
        try { irrigation = irrigationService.getIrrigationRecommendation(ctx.currentWeather, ctx.forecast.days, cropName, growthStage, soilType); } catch (e) {}
      }
      if (diseaseRiskService && ctx.currentWeather && ctx.forecast && cropName) {
        try { diseaseRisk = diseaseRiskService.assessDiseaseRisks(ctx.currentWeather, ctx.forecast.days, cropName, growthStage); } catch (e) {}
      }
      if (fertilizerService && cropName) {
        try {
          const soilNutrients = ctx.soilProfile ? {
            nitrogen_level: ctx.soilProfile.nitrogen_level,
            phosphorus_level: ctx.soilProfile.phosphorus_level,
            potassium_level: ctx.soilProfile.potassium_level
          } : null;
          fertilizer = fertilizerService.getFertilizerRecommendation(cropName, growthStage, daysGrown, ctx.forecast ? ctx.forecast.days : [], soilNutrients);
        } catch (e) {}
      }
      if (gddService && cropName && plantingDate) {
        try { gdd = gddService.getGDDAdvisorData(cropName, plantingDate, ctx.currentWeather, ctx.forecast ? ctx.forecast.days : []); } catch (e) {}
      }

      const plotData = {
        plot: ctx.plot,
        activeRecord: ctx.activeRecord,
        currentWeather: ctx.currentWeather,
        forecast: ctx.forecast,
        soilProfile: ctx.soilProfile,
        irrigation,
        diseaseRisk,
        fertilizer,
        gdd
      };

      const result = todoService.generateTodoList(plotData);
      allResults.push(result);
    }

    const merged = {
      generatedAt: new Date().toISOString(),
      totalTasks: allResults.reduce((s, r) => s + r.totalTasks, 0),
      todayTasks: allResults.reduce((s, r) => s + r.todayTasks, 0),
      plots: allResults.map(r => ({ plotName: r.plotName, cropName: r.cropName, growthStage: r.growthStage, daysGrown: r.daysGrown, taskCount: r.totalTasks })),
      today: allResults.flatMap(r => r.today).sort((a, b) => a.date.localeCompare(b.date)),
      upcoming: allResults.flatMap(r => r.upcoming).sort((a, b) => a.date.localeCompare(b.date)),
      all: allResults.flatMap(r => r.all).sort((a, b) => {
        const p = { high: 0, medium: 1, low: 2 };
        const dc = a.date.localeCompare(b.date);
        return dc !== 0 ? dc : (p[a.priority] || 2) - (p[b.priority] || 2);
      })
    };

    res.json(merged);
  } catch (err) {
    console.error('Todo API Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ==========================================
// 👤 PROFILE UPDATE ROUTES
// ==========================================

router.put('/api/farmer/profile', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { full_name, contact_number, language_pref, sms_opt_in } = req.body;
    if (full_name) user.full_name = full_name;
    if (contact_number !== undefined) user.contact_number = contact_number;
    if (language_pref) user.language_pref = language_pref;
    if (sms_opt_in !== undefined) user.sms_opt_in = sms_opt_in;

    await user.save();

    // Update session
    if (full_name) req.session.userFullName = full_name;

    res.json({ success: true, user: {
      full_name: user.full_name,
      contact_number: user.contact_number,
      language_pref: user.language_pref,
      sms_opt_in: user.sms_opt_in
    }});
  } catch (err) {
    console.error('Profile Update Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ==========================================
// 🛡️ ADMIN REST API ROUTES
// ==========================================

// Admin Dashboard Stats
router.get('/api/admin/stats', requireAuth, requireAdmin, async (req, res) => {
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
router.post('/api/admin/crops', requireAuth, requireAdmin, async (req, res) => {
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

router.put('/api/admin/crops/:id', requireAuth, requireAdmin, async (req, res) => {
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

router.delete('/api/admin/crops/:id', requireAuth, requireAdmin, async (req, res) => {
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
router.get('/api/admin/trivia', requireAuth, requireAdmin, async (req, res) => {
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

router.post('/api/admin/trivia', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { content, crop_tag } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const trivia = await Trivia.create({
      content,
      crop_tag: crop_tag || 'General',
      published_by: req.session.userId
    });

    res.status(201).json(trivia);
  } catch (err) {
    console.error('API Error POST /api/admin/trivia:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/api/admin/trivia/:id', requireAuth, requireAdmin, async (req, res) => {
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
router.get('/api/admin/weather-logs', requireAuth, requireAdmin, async (req, res) => {
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
router.post('/api/admin/alerts', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { message, audience, crop_name } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let targetUsers = [];

    if (audience === 'crop' && crop_name) {
      // Find all plots growing that crop
      const crop = await CropRepository.findOne({ where: { crop_name } });
      if (!crop) {
        return res.status(404).json({ error: 'Crop not found' });
      }

      const records = await PlantingRecord.findAll({
        where: { crop_id: crop.crop_id, status: 'Growing' },
        include: [{
          model: FarmPlot,
          as: 'plot',
          attributes: ['user_id'],
          include: [{ model: User, as: 'user', attributes: ['user_id', 'email', 'full_name'] }]
        }]
      });

      const userMap = new Map();
      for (const r of records) {
        if (r.plot && r.plot.user) {
          userMap.set(r.plot.user.user_id, r.plot.user);
        }
      }
      targetUsers = [...userMap.values()];
    } else {
      // All farmers
      targetUsers = await User.findAll({
        where: { role: 'Agriculturist' },
        attributes: ['user_id', 'email', 'full_name']
      });
    }

    // Set headers for streaming response
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const sendUpdate = (data) => {
      res.write(JSON.stringify(data) + '\n');
    };

    sendUpdate({ status: 'info', message: 'Saving advisory record to database...' });

    // Create alert records for each target user
    const alertRecords = [];
    for (const user of targetUsers) {
      const alert = await Alert.create({
        user_id: user.user_id,
        message,
        alert_type: 'Admin Broadcast',
        created_at: new Date()
      });
      alertRecords.push(alert);
    }

    sendUpdate({ status: 'info', message: `Sending emails to ${targetUsers.length} farmer(s)...` });

    let completedCount = 0;
    let successCount = 0;

    const emailPromises = targetUsers.map(async (user) => {
      if (!user.email) return;

      const dateStr = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const currentYear = new Date().getFullYear();
      const scopeLabel = audience === 'crop' ? `Growers of ${crop_name}` : 'All Registered Agriculturists';

      const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agricultural Advisory</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #2c3e50;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f7f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1b5e20, #2e7d32); padding: 40px 30px; text-align: center;">
              <span style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #a5d6a7; font-weight: bold; display: block; margin-bottom: 8px;">Project Weather</span>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Agricultural Advisory</h1>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin-top: 0; font-size: 16px; line-height: 1.6; color: #34495e;">
                Dear <strong>${user.full_name || 'Farmer'}</strong>,
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
                An administrative advisory update has been published for your area. Please review the details below:
              </p>
              
              <!-- Message Box -->
              <div style="background-color: #f1f8e9; border-left: 4px solid #4caf50; padding: 20px; border-radius: 0 8px 8px 0; margin: 30px 0;">
                <p style="margin: 0; font-size: 16px; line-height: 1.6; font-style: italic; color: #1b5e20;">
                  "${message}"
                </p>
              </div>

              <!-- Extra metadata table -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; margin-top: 20px; border-top: 1px solid #eeeeee; padding-top: 20px;">
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #7f8c8d; width: 100px;">Scope:</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #2c3e50; font-weight: bold;">
                    ${scopeLabel}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #7f8c8d;">Date Sent:</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #2c3e50;">
                    ${dateStr}
                  </td>
                </tr>
              </table>
              
              <div style="text-align: center; margin-top: 40px;">
                <a href="http://localhost:4000/" style="background-color: #2e7d32; color: #ffffff; text-decoration: none; padding: 14px 30px; font-size: 16px; font-weight: bold; border-radius: 6px; display: inline-block; box-shadow: 0 4px 6px rgba(46,125,50,0.2);">
                  Open Dashboard
                </a>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="margin: 0; font-size: 12px; color: #95a5a6; line-height: 1.5;">
                This email was sent by the Project Weather Platform Administrator.<br>
                You are receiving this because you are registered as an Agriculturist.
              </p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #bdc3c7;">
                &copy; ${currentYear} Project Weather. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      try {
        await sendEmail({
          to: user.email,
          subject: `[Advisory] Project Weather Update: ${scopeLabel}`,
          text: `Project Weather Agricultural Advisory:\n\n${message}\n\nScope: ${scopeLabel}\nDate: ${dateStr}`,
          html: emailHtml
        });
        successCount++;
      } catch (err) {
        console.error(`Failed to send advisory email to ${user.email}:`, err.message);
      } finally {
        completedCount++;
        sendUpdate({
          status: 'sending',
          email: user.email,
          name: user.full_name || 'Farmer',
          index: completedCount,
          total: targetUsers.length
        });
      }
    });

    // Run all sending requests concurrently
    await Promise.all(emailPromises);

    sendUpdate({
      status: 'complete',
      success: true,
      message: 'Advisory sent successfully',
      recipientCount: targetUsers.length,
      successCount
    });
    res.end();
  } catch (err) {
    console.error('API Error POST /api/admin/alerts:', err);
    // If headers already sent, write an error chunk and end, otherwise send 500
    if (res.headersSent) {
      res.write(JSON.stringify({ status: 'error', error: 'Internal Server Error' }) + '\n');
      res.end();
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Admin Get Sent Alerts History
router.get('/api/admin/alerts', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', order = 'DESC' } = req.query;

    // Get all admin broadcasts
    const alerts = await Alert.findAll({
      where: { alert_type: 'Admin Broadcast' },
      order: [['created_at', order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']]
    });

    // Group by message + timestamp (within 1 minute = same broadcast)
    const grouped = [];
    const seen = new Set();

    for (const alert of alerts) {
      const date = new Date(alert.created_at);
      const roundedDateStr = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()).toISOString();
      const key = alert.message + '|' + roundedDateStr;

      if (!seen.has(key)) {
        seen.add(key);
        // Count how many alerts share this message and approximate timestamp
        const count = alerts.filter(a => {
          const aDate = new Date(a.created_at);
          const aRoundedDateStr = new Date(aDate.getFullYear(), aDate.getMonth(), aDate.getDate(), aDate.getHours(), aDate.getMinutes()).toISOString();
          const aKey = a.message + '|' + aRoundedDateStr;
          return aKey === key;
        }).length;

        grouped.push({
          message: alert.message,
          created_at: alert.created_at,
          recipient_count: count
        });
      }
    }

    // Filter by search string
    let filtered = grouped;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = grouped.filter(item => item.message.toLowerCase().includes(q));
    }

    // Apply pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = filtered.slice(startIndex, startIndex + limitNum);

    res.json({
      data: paginatedItems,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalItems,
        totalPages
      }
    });
  } catch (err) {
    console.error('API Error GET /api/admin/alerts:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Admin Delete Sent Alert (removes all alerts sent in that specific broadcast batch)
router.delete('/api/admin/alerts', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { message, created_at } = req.body;
    if (!message || !created_at) {
      return res.status(400).json({ error: 'Message and created_at are required' });
    }

    const date = new Date(created_at);
    // Find alerts matching description created within 1 minute of the targeted time
    const minDate = new Date(date.getTime() - 60000);
    const maxDate = new Date(date.getTime() + 60000);

    const deletedCount = await Alert.destroy({
      where: {
        alert_type: 'Admin Broadcast',
        message: message,
        created_at: {
          [Op.between]: [minDate, maxDate]
        }
      }
    });

    res.json({ success: true, deletedCount });
  } catch (err) {
    console.error('API Error DELETE /api/admin/alerts:', err);
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

// ==========================================
// 🛰️ SATELLITE VEGETATION MONITORING (Agromonitoring API)
// ==========================================

router.get('/api/satellite/imagery', requireAuth, async (req, res) => {
  try {
    if (!satelliteService) {
      return res.status(503).json({ error: 'Satellite service not available' });
    }

    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 90);

    const images = await satelliteService.searchImages(start, end);

    if (!images || images.length === 0) {
      return res.json({
        available: false,
        message: 'No recent satellite imagery available for Mandaon area yet. Sentinel-2 revisits every 3-5 days. If this polygon was recently created, please allow a few days for Agromonitoring to download satellite data for this region.',
        images: []
      });
    }

    const results = [];
    const maxImages = Math.min(images.length, 5);

    for (let i = 0; i < maxImages; i++) {
      const img = images[i];
      const entry = {
        date: new Date(img.dt * 1000).toISOString(),
        dateFormatted: new Date(img.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        satellite: img.type,
        coverage: img.dc,
        clouds: img.cl,
        hasTrueColor: !!img.image?.truecolor,
        hasFalseColor: !!img.image?.falsecolor,
        hasNdvi: !!img.image?.ndvi
      };

      if (img.stats?.ndvi) {
        try {
          const stats = await satelliteService.fetchStats(img.stats.ndvi);
          entry.ndviStats = stats;
          entry.health = satelliteService.assessVegetationHealth(stats);
        } catch (e) {
          entry.ndviStats = null;
          entry.health = satelliteService.assessVegetationHealth(null);
        }
      }

      results.push(entry);
    }

    res.json({
      available: true,
      polygon: 'Mandaon Agricultural Zone - Masbate',
      images: results
    });
  } catch (err) {
    console.error('Satellite Imagery Error:', err);
    res.status(500).json({ error: 'Failed to fetch satellite imagery', message: err.message });
  }
});

router.get('/api/satellite/image/:type', requireAuth, async (req, res) => {
  try {
    if (!satelliteService) {
      return res.status(503).json({ error: 'Satellite service not available' });
    }

    const { type } = req.params;
    if (!['truecolor', 'falsecolor', 'ndvi'].includes(type)) {
      return res.status(400).json({ error: 'Invalid image type. Use: truecolor, falsecolor, ndvi' });
    }

    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 90);

    const images = await satelliteService.searchImages(start, end);
    if (!images || images.length === 0) {
      return res.status(404).json({ error: 'No satellite images available' });
    }

    const latest = images[0];
    const imageUrl = latest.image?.[type];
    if (!imageUrl) {
      return res.status(404).json({ error: `${type} image not available for latest capture` });
    }

    const imageBuffer = await satelliteService.fetchImageBuffer(imageUrl);
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(imageBuffer);
  } catch (err) {
    console.error('Satellite Image Fetch Error:', err);
    res.status(500).json({ error: 'Failed to fetch satellite image' });
  }
});

router.get('/api/satellite/ndvi-stats', requireAuth, async (req, res) => {
  try {
    if (!satelliteService) {
      return res.status(503).json({ error: 'Satellite service not available' });
    }

    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 90);

    const images = await satelliteService.searchImages(start, end);
    if (!images || images.length === 0) {
      return res.status(404).json({ error: 'No satellite data available' });
    }

    const latest = images[0];
    if (!latest.stats?.ndvi) {
      return res.status(404).json({ error: 'NDVI stats not available' });
    }

    const stats = await satelliteService.fetchStats(latest.stats.ndvi);
    const health = satelliteService.assessVegetationHealth(stats);

    res.json({
      date: new Date(latest.dt * 1000).toISOString(),
      satellite: latest.type,
      coverage: latest.dc,
      clouds: latest.cl,
      stats,
      health
    });
  } catch (err) {
    console.error('NDVI Stats Error:', err);
    res.status(500).json({ error: 'Failed to fetch NDVI statistics' });
  }
});

module.exports = router;
