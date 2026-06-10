// ─────────────────────────────────────────────────────────────
//  PinPoint India 2.0 — Weather Service
//  OpenWeather One Call API 4.0
//
//  SECURITY: API key lives only on the backend.
//  Frontend calls /api/v1/weather — never touches OW directly.
//
//  Endpoints used:
//  - /data/4.0/onecall/current  (current conditions)
//  - /data/4.0/onecall/timeline/1h (hourly forecast)
//  - /data/4.0/onecall/timeline/1day (daily forecast)
//
//  Features:
//  - Graceful fallback when OPENWEATHER_API_KEY missing
//  - 8s timeout per request
//  - 2 retry attempts on network failure
//  - In-memory cache (10min TTL) — Redis-ready architecture
// ─────────────────────────────────────────────────────────────

const env = require('../../config/env');
const { features } = require('../../config/features');

// ── In-memory cache (TTL: 10 minutes) ───────────────────────
// When Redis is enabled, swap this map for ioredis SETEX.
const weatherCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

function getCacheKey(type, lat, lon) {
  return `weather:${type}:${parseFloat(lat).toFixed(3)}:${parseFloat(lon).toFixed(3)}`;
}

function getFromCache(key) {
  const entry = weatherCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    weatherCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  weatherCache.set(key, { data, ts: Date.now() });
}

// ── Fetch with timeout ───────────────────────────────────────
async function fetchWithTimeout(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new WeatherError(`OpenWeather returned ${res.status}`, res.status, body);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

// ── Retry wrapper (2 attempts) ───────────────────────────────
async function fetchWithRetry(url, retries = 2) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fetchWithTimeout(url);
    } catch (err) {
      lastErr = err;
      // Don't retry on 4xx (bad key, bad params)
      if (err instanceof WeatherError && err.statusCode >= 400 && err.statusCode < 500) {
        throw err;
      }
      if (i < retries) {
        await new Promise(r => setTimeout(r, 500 * (i + 1)));
      }
    }
  }
  throw lastErr;
}

// ── Custom error class ───────────────────────────────────────
class WeatherError extends Error {
  constructor(message, statusCode = 503, raw = null) {
    super(message);
    this.name = 'WeatherError';
    this.statusCode = statusCode;
    this.raw = raw;
  }
}

// ── Build URL helper ─────────────────────────────────────────
function buildUrl(endpoint, lat, lon, units = 'metric', lang = 'en') {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    units,
    lang,
    appid: env.OPENWEATHER_API_KEY,
  });
  return `${env.OPENWEATHER_BASE_URL}/${endpoint}?${params.toString()}`;
}

// ── Fallback response when weather is disabled ───────────────
function weatherDisabledResponse(lat, lon) {
  return {
    available: false,
    reason: 'Weather service not configured (OPENWEATHER_API_KEY missing)',
    lat,
    lon,
    data: null,
  };
}

// ── PUBLIC API ───────────────────────────────────────────────

/**
 * Get current weather for a location.
 * @param {number} lat
 * @param {number} lon
 * @param {string} units  - 'metric' | 'imperial' | 'standard'
 */
async function getCurrentWeather(lat, lon, units = 'metric') {
  if (!features.weather.enabled) {
    return weatherDisabledResponse(lat, lon);
  }

  const cacheKey = getCacheKey('current', lat, lon);
  const cached = getFromCache(cacheKey);
  if (cached) return { ...cached, fromCache: true };

  const url = buildUrl('current', lat, lon, units);
  const json = await fetchWithRetry(url);
  const result = normalizeCurrentWeather(json, lat, lon, units);
  setCache(cacheKey, result);
  return result;
}

/**
 * Get hourly weather for next 48h (returns up to 20 records per page).
 * @param {number} lat
 * @param {number} lon
 */
async function getHourlyForecast(lat, lon, units = 'metric') {
  if (!features.weather.enabled) {
    return weatherDisabledResponse(lat, lon);
  }

  const cacheKey = getCacheKey('hourly', lat, lon);
  const cached = getFromCache(cacheKey);
  if (cached) return { ...cached, fromCache: true };

  const url = buildUrl('timeline/1h', lat, lon, units);
  const json = await fetchWithRetry(url);
  const result = normalizeHourlyForecast(json, lat, lon);
  setCache(cacheKey, result);
  return result;
}

/**
 * Get daily weather for next 10 days.
 * @param {number} lat
 * @param {number} lon
 */
async function getDailyForecast(lat, lon, units = 'metric') {
  if (!features.weather.enabled) {
    return weatherDisabledResponse(lat, lon);
  }

  const cacheKey = getCacheKey('daily', lat, lon);
  const cached = getFromCache(cacheKey);
  if (cached) return { ...cached, fromCache: true };

  const url = buildUrl('timeline/1day', lat, lon, units);
  const json = await fetchWithRetry(url);
  const result = normalizeDailyForecast(json, lat, lon);
  setCache(cacheKey, result);
  return result;
}

/**
 * Convenience: fetch current + today's hourly in parallel.
 * Used for location weather cards in the pincode lookup.
 */
async function getLocationWeather(lat, lon, units = 'metric') {
  if (!features.weather.enabled) {
    return weatherDisabledResponse(lat, lon);
  }

  const [current, hourly] = await Promise.allSettled([
    getCurrentWeather(lat, lon, units),
    getHourlyForecast(lat, lon, units),
  ]);

  return {
    available: true,
    lat,
    lon,
    units,
    current: current.status === 'fulfilled' ? current.value : null,
    hourly: hourly.status === 'fulfilled' ? hourly.value : null,
    errors: {
      current: current.status === 'rejected' ? current.reason?.message : null,
      hourly: hourly.status === 'rejected' ? hourly.reason?.message : null,
    },
  };
}

// ── Normalizers — safe field extraction ─────────────────────

function normalizeCurrentWeather(json, lat, lon, units) {
  const data = json?.data?.[0] || {};
  const weather = data.weather?.[0] || {};

  return {
    available: true,
    lat,
    lon,
    timezone: json.timezone || null,
    units,
    timestamp: data.dt ? new Date(data.dt * 1000).toISOString() : null,
    temp: data.temp ?? null,
    feelsLike: data.feels_like ?? null,
    humidity: data.humidity ?? null,
    pressure: data.pressure ?? null,
    windSpeed: data.wind_speed ?? null,
    windDeg: data.wind_deg ?? null,
    windGust: data.wind_gust ?? null,
    clouds: data.clouds ?? null,
    visibility: data.visibility ?? null,
    uvi: data.uvi ?? null,
    dewPoint: data.dew_point ?? null,
    sunrise: data.sunrise ? new Date(data.sunrise * 1000).toISOString() : null,
    sunset: data.sunset ? new Date(data.sunset * 1000).toISOString() : null,
    condition: {
      id: weather.id ?? null,
      main: weather.main ?? null,
      description: weather.description ?? null,
      icon: weather.icon ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png` : null,
    },
    rain1h: data.rain?.['1h'] ?? null,
    snow1h: data.snow?.['1h'] ?? null,
    alertIds: data.alerts || [],
  };
}

function normalizeHourlyForecast(json, lat, lon) {
  const records = json?.data || [];

  return {
    available: true,
    lat,
    lon,
    timezone: json.timezone || null,
    hours: records.map(h => ({
      timestamp: h.dt ? new Date(h.dt * 1000).toISOString() : null,
      temp: h.temp ?? null,
      feelsLike: h.feels_like ?? null,
      humidity: h.humidity ?? null,
      windSpeed: h.wind_speed ?? null,
      clouds: h.clouds ?? null,
      pop: h.pop ?? null, // probability of precipitation
      condition: {
        main: h.weather?.[0]?.main ?? null,
        description: h.weather?.[0]?.description ?? null,
        icon: h.weather?.[0]?.icon
          ? `https://openweathermap.org/img/wn/${h.weather[0].icon}@2x.png`
          : null,
      },
      rain1h: h.rain?.['1h'] ?? null,
    })),
    next: json.next || null, // pagination URL for >20 records
  };
}

function normalizeDailyForecast(json, lat, lon) {
  const records = json?.data || [];

  return {
    available: true,
    lat,
    lon,
    timezone: json.timezone || null,
    days: records.map(d => ({
      timestamp: d.dt ? new Date(d.dt * 1000).toISOString() : null,
      tempMin: d.temp?.min ?? null,
      tempMax: d.temp?.max ?? null,
      tempDay: d.temp?.day ?? null,
      tempNight: d.temp?.night ?? null,
      feelsLikeDay: d.feels_like?.day ?? null,
      humidity: d.humidity ?? null,
      windSpeed: d.wind_speed ?? null,
      windGust: d.wind_gust ?? null,
      clouds: d.clouds ?? null,
      pop: d.pop ?? null,
      uvi: d.uvi ?? null,
      sunrise: d.sunrise ? new Date(d.sunrise * 1000).toISOString() : null,
      sunset: d.sunset ? new Date(d.sunset * 1000).toISOString() : null,
      moonPhase: d.moon_phase ?? null,
      condition: {
        main: d.weather?.[0]?.main ?? null,
        description: d.weather?.[0]?.description ?? null,
        icon: d.weather?.[0]?.icon
          ? `https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`
          : null,
      },
      rain: d.rain ?? null,
      snow: d.snow ?? null,
    })),
    next: json.next || null,
    prev: json.prev || null,
  };
}

// ── Cache utilities ──────────────────────────────────────────
const cacheUtils = {
  clear: () => weatherCache.clear(),
  size: () => weatherCache.size,
  has: key => weatherCache.has(key),
};

module.exports = {
  getCurrentWeather,
  getHourlyForecast,
  getDailyForecast,
  getLocationWeather,
  WeatherError,
  cacheUtils,
};
