/**
 * ──────────────────────────────────────────────────
 * OPENWEATHER API SERVICE
 * Handles all communication with OpenWeather API,
 * data transformation, caching, and agricultural
 * insight generation for Project Weather.
 * ──────────────────────────────────────────────────
 */

const OPENWEATHER_BASE = 'https://api.openweathermap.org/data/2.5';

// Default coordinates: Masbate City, Masbate, Philippines
const DEFAULT_LAT = process.env.WEATHER_LAT || '12.3703';
const DEFAULT_LON = process.env.WEATHER_LON || '123.6217';

// ────────────────────────────────────────
// IN-MEMORY CACHE (10-minute TTL)
// ────────────────────────────────────────
const cache = {
  current: { data: null, expiry: 0 },
  forecast: { data: null, expiry: 0 }
};

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function isCacheValid(key) {
  return cache[key] && cache[key].data !== null && Date.now() < cache[key].expiry;
}

function setCache(key, data) {
  cache[key] = { data, expiry: Date.now() + CACHE_TTL };
}

// ────────────────────────────────────────
// CURRENT WEATHER
// ────────────────────────────────────────

/**
 * Fetch current weather from OpenWeather API
 * Returns normalized weather object for the frontend
 */
async function fetchCurrentWeather(lat = DEFAULT_LAT, lon = DEFAULT_LON) {
  const cacheKey = `current_${lat}_${lon}`;
  if (isCacheValid(cacheKey)) {
    return cache[cacheKey].data;
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENWEATHER_API_KEY is not set in .env');
  }

  const url = `${OPENWEATHER_BASE}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenWeather API error (${response.status}): ${errorText}`);
  }

  const raw = await response.json();

  // Transform to our normalized format
  const data = {
    temperature: Math.round(raw.main.temp),
    feels_like: Math.round(raw.main.feels_like),
    temp_min: Math.round(raw.main.temp_min),
    temp_max: Math.round(raw.main.temp_max),
    humidity: raw.main.humidity,
    pressure: raw.main.pressure,
    wind_speed: Math.round((raw.wind.speed * 3.6) * 10) / 10,  // m/s → km/h
    wind_deg: raw.wind.deg || 0,
    rainfall: (raw.rain && raw.rain['1h']) ? raw.rain['1h'] : ((raw.rain && raw.rain['3h']) ? raw.rain['3h'] : 0),
    rainfall_3h: (raw.rain && raw.rain['3h']) ? raw.rain['3h'] : 0,
    clouds: raw.clouds ? raw.clouds.all : 0,
    visibility: raw.visibility ? Math.round(raw.visibility / 1000 * 10) / 10 : 10,  // meters → km
    weather_main: raw.weather[0].main,
    weather_description: raw.weather[0].description,
    weather_icon: raw.weather[0].icon,
    weather_icon_url: `https://openweathermap.org/img/wn/${raw.weather[0].icon}@2x.png`,
    sunrise: raw.sys.sunrise * 1000,
    sunset: raw.sys.sunset * 1000,
    location: raw.name,
    country: raw.sys.country,
    dt: raw.dt * 1000,
    fetched_at: Date.now(),
    // Agricultural insights generated from current data
    insights: generateCurrentInsights(raw)
  };

  setCache(cacheKey, data);
  return data;
}

// ────────────────────────────────────────
// 5-DAY FORECAST (aggregated to daily)
// ────────────────────────────────────────

/**
 * Fetch 5-day/3-hour forecast and aggregate into daily summaries
 */
async function fetchForecast(lat = DEFAULT_LAT, lon = DEFAULT_LON) {
  const cacheKey = `forecast_${lat}_${lon}`;
  if (isCacheValid(cacheKey)) {
    return cache[cacheKey].data;
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENWEATHER_API_KEY is not set in .env');
  }

  const url = `${OPENWEATHER_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenWeather Forecast API error (${response.status}): ${errorText}`);
  }

  const raw = await response.json();

  // Group 3-hour intervals into daily buckets
  const dailyBuckets = {};

  raw.list.forEach(entry => {
    const dateKey = entry.dt_txt.split(' ')[0]; // e.g. "2026-05-24"

    if (!dailyBuckets[dateKey]) {
      dailyBuckets[dateKey] = {
        date: dateKey,
        temps: [],
        humidities: [],
        winds: [],
        rains: [],
        weather_conditions: [],
        weather_icons: []
      };
    }

    const bucket = dailyBuckets[dateKey];
    bucket.temps.push(entry.main.temp);
    bucket.humidities.push(entry.main.humidity);
    bucket.winds.push(entry.wind.speed * 3.6); // m/s → km/h
    bucket.rains.push(
      (entry.rain && entry.rain['3h']) ? entry.rain['3h'] : 0
    );
    bucket.weather_conditions.push(entry.weather[0].main);
    bucket.weather_icons.push(entry.weather[0].icon);
  });

  // Aggregate each day
  const days = Object.values(dailyBuckets).map(bucket => {
    const tempMax = Math.round(Math.max(...bucket.temps));
    const tempMin = Math.round(Math.min(...bucket.temps));
    const avgHumidity = Math.round(bucket.humidities.reduce((a, b) => a + b, 0) / bucket.humidities.length);
    const avgWind = Math.round(bucket.winds.reduce((a, b) => a + b, 0) / bucket.winds.length * 10) / 10;
    const totalRain = Math.round(bucket.rains.reduce((a, b) => a + b, 0) * 10) / 10;

    // Pick the most frequent weather condition
    const condCount = {};
    bucket.weather_conditions.forEach(c => {
      condCount[c] = (condCount[c] || 0) + 1;
    });
    const dominant = Object.entries(condCount).sort((a, b) => b[1] - a[1])[0][0];

    // Pick the icon from the midday reading (index ~4 for noon) or first available
    const middayIdx = Math.min(4, bucket.weather_icons.length - 1);
    const icon = bucket.weather_icons[middayIdx] || bucket.weather_icons[0];

    const dateObj = new Date(bucket.date + 'T12:00:00');
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return {
      date: bucket.date,
      day_name: dayNames[dateObj.getDay()],
      temp_max: tempMax,
      temp_min: tempMin,
      humidity: avgHumidity,
      wind_speed: avgWind,
      rainfall: totalRain,
      weather_main: dominant,
      weather_icon: icon,
      weather_icon_url: `https://openweathermap.org/img/wn/${icon}@2x.png`
    };
  });

  // Sort by date ascending, take up to 5 days
  days.sort((a, b) => a.date.localeCompare(b.date));
  const forecastDays = days.slice(0, 5);

  // Compute max rain across forecast for rainfall bar scaling
  const maxRain = Math.max(...forecastDays.map(d => d.rainfall), 1);

  const data = {
    days: forecastDays,
    max_rain: maxRain,
    total_forecast_rain: Math.round(forecastDays.reduce((s, d) => s + d.rainfall, 0) * 10) / 10,
    fetched_at: Date.now()
  };

  setCache(cacheKey, data);
  return data;
}

// ────────────────────────────────────────
// AGRICULTURAL INSIGHT GENERATION
// ────────────────────────────────────────

/**
 * Generate agricultural insights from current weather conditions
 */
function generateCurrentInsights(raw) {
  const temp = raw.main.temp;
  const humidity = raw.main.humidity;
  const windKmh = raw.wind.speed * 3.6;
  const rain1h = (raw.rain && raw.rain['1h']) ? raw.rain['1h'] : 0;

  const insights = {
    temperature: { status: 'normal', message: 'Within normal range' },
    humidity: { status: 'normal', message: 'Moderate humidity' },
    wind: { status: 'normal', message: 'Calm conditions' },
    rainfall: { status: 'normal', message: 'No significant precipitation' }
  };

  // Temperature insights for tropical rice farming
  if (temp >= 25 && temp <= 33) {
    insights.temperature = { status: 'good', message: 'Optimal for Rice tillering', direction: 'up' };
  } else if (temp > 33 && temp <= 36) {
    insights.temperature = { status: 'warning', message: 'Heat stress risk for crops', direction: 'up' };
  } else if (temp > 36) {
    insights.temperature = { status: 'danger', message: 'Extreme heat — irrigate immediately', direction: 'up' };
  } else if (temp < 20) {
    insights.temperature = { status: 'warning', message: 'Cold stress — protect seedlings', direction: 'down' };
  } else {
    insights.temperature = { status: 'good', message: 'Comfortable growing temperature', direction: 'up' };
  }

  // Humidity insights
  if (humidity > 85) {
    insights.humidity = { status: 'danger', message: 'Very High — Fungal/blast risk critical', direction: 'down' };
  } else if (humidity > 75) {
    insights.humidity = { status: 'warning', message: 'High — Fungal risk elevated', direction: 'down' };
  } else if (humidity >= 60 && humidity <= 75) {
    insights.humidity = { status: 'good', message: 'Ideal moisture for growth', direction: 'up' };
  } else {
    insights.humidity = { status: 'warning', message: 'Low — Consider irrigation', direction: 'down' };
  }

  // Wind insights
  if (windKmh <= 20) {
    insights.wind = { status: 'good', message: 'Safe spray window active', direction: 'up' };
  } else if (windKmh <= 35) {
    insights.wind = { status: 'warning', message: 'Moderate — Delay aerial spraying', direction: 'down' };
  } else {
    insights.wind = { status: 'danger', message: 'High winds — Secure structures', direction: 'down' };
  }

  // Rainfall insights
  if (rain1h === 0) {
    insights.rainfall = { status: 'good', message: 'No precipitation detected', direction: 'up' };
  } else if (rain1h < 5) {
    insights.rainfall = { status: 'good', message: 'Light rain — Beneficial for crops', direction: 'up' };
  } else if (rain1h < 15) {
    insights.rainfall = { status: 'warning', message: 'Moderate precipitation', direction: 'down' };
  } else {
    insights.rainfall = { status: 'danger', message: 'Heavy rainfall — Flood risk', direction: 'down' };
  }

  return insights;
}

/**
 * Generate risk alerts from forecast data + active crop sensitivities
 */
function generateForecastRisks(forecastDays, cropRepo) {
  const risks = [];

  forecastDays.forEach(day => {
    // Heavy rain warning
    if (day.rainfall >= 20) {
      risks.push({
        day: day.day_name,
        date: day.date,
        type: 'danger',
        title: `${day.day_name}: Heavy Rain Hazard`,
        icon: '⚠️',
        description: `Forecast: ${day.rainfall}mm rainfall. Check drainage channels and protect sensitive crops.`,
        metric: 'rainfall',
        value: day.rainfall
      });
    } else if (day.rainfall >= 10) {
      risks.push({
        day: day.day_name,
        date: day.date,
        type: 'warning',
        title: `${day.day_name}: Moderate Rain Expected`,
        icon: '🌧️',
        description: `Forecast: ${day.rainfall}mm rainfall. Monitor soil saturation levels.`,
        metric: 'rainfall',
        value: day.rainfall
      });
    }

    // Extreme heat warning
    if (day.temp_max >= 35) {
      risks.push({
        day: day.day_name,
        date: day.date,
        type: 'danger',
        title: `${day.day_name}: Extreme Heat Warning`,
        icon: '🔥',
        description: `Forecast: ${day.temp_max}°C. Crops will experience severe moisture stress. Schedule extra irrigation.`,
        metric: 'temperature',
        value: day.temp_max
      });
    } else if (day.temp_max >= 33) {
      risks.push({
        day: day.day_name,
        date: day.date,
        type: 'warning',
        title: `${day.day_name}: High Temperature Alert`,
        icon: '☀️',
        description: `Forecast: ${day.temp_max}°C. Consider pre-watering irrigation cycles for sensitive crops.`,
        metric: 'temperature',
        value: day.temp_max
      });
    }

    // High humidity / disease risk
    if (day.humidity >= 85) {
      risks.push({
        day: day.day_name,
        date: day.date,
        type: 'warning',
        title: `${day.day_name}: Disease Risk from Humidity`,
        icon: '💧',
        description: `Average humidity: ${day.humidity}%. Monitor rice plots for blast, rot, and fungal infections.`,
        metric: 'humidity',
        value: day.humidity
      });
    }
  });

  // Sort by severity (danger first) then by date
  risks.sort((a, b) => {
    if (a.type === 'danger' && b.type !== 'danger') return -1;
    if (a.type !== 'danger' && b.type === 'danger') return 1;
    return a.date.localeCompare(b.date);
  });

  return risks;
}

module.exports = {
  fetchCurrentWeather,
  fetchForecast,
  generateForecastRisks
};
