// ─────────────────────────────────────────────────────────────
//  PinPoint India 2.0 — Weather Controller
//  Route: /api/v1/weather
// ─────────────────────────────────────────────────────────────

const {
  getCurrentWeather,
  getHourlyForecast,
  getDailyForecast,
  getLocationWeather,
  WeatherError,
} = require('./weatherService');
const { features } = require('../../config/features');

// ── Validation helper ────────────────────────────────────────
function parseCoords(req, res) {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);

  if (isNaN(lat) || isNaN(lon)) {
    res.status(400).json({
      success: false,
      error: 'lat and lon query parameters are required and must be numbers',
      example: '/api/v1/weather/current?lat=17.3850&lon=78.4867',
    });
    return null;
  }

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    res.status(400).json({
      success: false,
      error: 'lat must be -90 to 90, lon must be -180 to 180',
    });
    return null;
  }

  return { lat, lon };
}

function getUnits(req) {
  const units = req.query.units || 'metric';
  if (!['metric', 'imperial', 'standard'].includes(units)) return 'metric';
  return units;
}

function handleWeatherError(err, res) {
  if (err instanceof WeatherError) {
    return res.status(err.statusCode >= 400 && err.statusCode < 600 ? err.statusCode : 503).json({
      success: false,
      error: err.message,
    });
  }
  if (err.name === 'AbortError') {
    return res.status(504).json({ success: false, error: 'Weather request timed out' });
  }
  console.error('[WeatherController]', err);
  return res.status(500).json({ success: false, error: 'Weather service error' });
}

// ── GET /api/v1/weather/status ───────────────────────────────
async function getStatus(req, res) {
  res.json({
    success: true,
    weather: {
      enabled: features.weather.enabled,
      message: features.weather.enabled
        ? 'OpenWeather One Call 4.0 active'
        : 'Weather disabled — add OPENWEATHER_API_KEY to enable',
    },
  });
}

// ── GET /api/v1/weather/current?lat=&lon= ───────────────────
async function getCurrent(req, res) {
  const coords = parseCoords(req, res);
  if (!coords) return;

  try {
    const data = await getCurrentWeather(coords.lat, coords.lon, getUnits(req));
    res.json({ success: true, data });
  } catch (err) {
    handleWeatherError(err, res);
  }
}

// ── GET /api/v1/weather/hourly?lat=&lon= ────────────────────
async function getHourly(req, res) {
  const coords = parseCoords(req, res);
  if (!coords) return;

  try {
    const data = await getHourlyForecast(coords.lat, coords.lon, getUnits(req));
    res.json({ success: true, data });
  } catch (err) {
    handleWeatherError(err, res);
  }
}

// ── GET /api/v1/weather/daily?lat=&lon= ─────────────────────
async function getDaily(req, res) {
  const coords = parseCoords(req, res);
  if (!coords) return;

  try {
    const data = await getDailyForecast(coords.lat, coords.lon, getUnits(req));
    res.json({ success: true, data });
  } catch (err) {
    handleWeatherError(err, res);
  }
}

// ── GET /api/v1/weather/location?lat=&lon= ──────────────────
// Convenience endpoint: current + hourly in one call
// Used for pincode result weather cards
async function getLocation(req, res) {
  const coords = parseCoords(req, res);
  if (!coords) return;

  try {
    const data = await getLocationWeather(coords.lat, coords.lon, getUnits(req));
    res.json({ success: true, data });
  } catch (err) {
    handleWeatherError(err, res);
  }
}

module.exports = { getStatus, getCurrent, getHourly, getDaily, getLocation };
