// PinPoint India 2.0 — Weather v1 Routes
// FREE tier: OpenWeather 2.5 (not paid 4.0)

const express = require("express");
const axios   = require("axios");
const router  = express.Router();

const KEY  = process.env.OPENWEATHER_API_KEY;
const BASE = "https://api.openweathermap.org/data/2.5";

const cache = new Map();
function getCached(k) {
  const hit = cache.get(k);
  if (hit && Date.now() - hit.ts < 600_000) return hit.data;
  return null;
}
function setCache(k, data) { cache.set(k, { data, ts: Date.now() }); }

function coords(req, res) {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);
  if (isNaN(lat) || isNaN(lon))
    return res.status(400).json({ error: "lat and lon required" });
  return { lat, lon };
}

// GET /api/v1/weather/status
router.get("/status", (req, res) => {
  res.json({ enabled: Boolean(KEY), source: "OpenWeather 2.5 free tier" });
});

// GET /api/v1/weather/current?lat=&lon=
router.get("/current", async (req, res) => {
  const c = coords(req, res); if (!c) return;
  if (!KEY) return res.status(503).json({ error: "OPENWEATHER_API_KEY not set" });

  const ck = `cur_${c.lat}_${c.lon}`;
  const hit = getCached(ck);
  if (hit) return res.json({ ...hit, fromCache: true });

  try {
    const { data } = await axios.get(
      `${BASE}/weather?lat=${c.lat}&lon=${c.lon}&appid=${KEY}&units=metric`,
      { timeout: 8000 }
    );
    const result = {
      available: true, lat: c.lat, lon: c.lon,
      data: {
        temp:        Math.round(data.main.temp),
        feelsLike:   Math.round(data.main.feels_like),
        tempMin:     Math.round(data.main.temp_min),
        tempMax:     Math.round(data.main.temp_max),
        humidity:    data.main.humidity,
        pressure:    data.main.pressure,
        windSpeed:   data.wind?.speed,
        visibility:  data.visibility ? data.visibility / 1000 : null,
        condition: {
          main:        data.weather[0]?.main,
          description: data.weather[0]?.description,
          icon:        data.weather[0]?.icon,
        },
        sunrise: new Date(data.sys.sunrise * 1000).toISOString(),
        sunset:  new Date(data.sys.sunset  * 1000).toISOString(),
        city:    data.name,
      },
    };
    setCache(ck, result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.response?.data?.message || err.message });
  }
});

// GET /api/v1/weather/daily?lat=&lon=
// /forecast gives 3h slots → group by day → 7-day summary (FREE tier)
router.get("/daily", async (req, res) => {
  const c = coords(req, res); if (!c) return;
  if (!KEY) return res.status(503).json({ error: "OPENWEATHER_API_KEY not set" });

  const ck = `daily_${c.lat}_${c.lon}`;
  const hit = getCached(ck);
  if (hit) return res.json({ ...hit, fromCache: true });

  try {
    const { data } = await axios.get(
      `${BASE}/forecast?lat=${c.lat}&lon=${c.lon}&appid=${KEY}&units=metric&cnt=40`,
      { timeout: 8000 }
    );

    // Group 3h slots by calendar day
    const byDay = {};
    for (const item of data.list) {
      const day = item.dt_txt.split(" ")[0];
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(item);
    }

    const days = Object.entries(byDay).slice(0, 7).map(([date, slots]) => {
      const temps    = slots.map(s => s.main.temp);
      const humidity = slots.map(s => s.main.humidity);
      const rep      = slots.find(s => s.dt_txt.includes("12:00")) || slots[0];
      return {
        timestamp: new Date(date).toISOString(),
        tempMax:   Math.round(Math.max(...temps)),
        tempMin:   Math.round(Math.min(...temps)),
        tempAvg:   Math.round(temps.reduce((a, b) => a + b, 0) / temps.length),
        humidity:  Math.round(humidity.reduce((a, b) => a + b, 0) / humidity.length),
        condition: {
          main:        rep.weather[0]?.main,
          description: rep.weather[0]?.description,
          icon:        rep.weather[0]?.icon,
        },
      };
    });

    const result = { available: true, lat: c.lat, lon: c.lon, data: { days } };
    setCache(ck, result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.response?.data?.message || err.message });
  }
});

// GET /api/v1/weather/hourly?lat=&lon=
router.get("/hourly", async (req, res) => {
  const c = coords(req, res); if (!c) return;
  if (!KEY) return res.status(503).json({ error: "OPENWEATHER_API_KEY not set" });

  const ck = `hourly_${c.lat}_${c.lon}`;
  const hit = getCached(ck);
  if (hit) return res.json({ ...hit, fromCache: true });

  try {
    const { data } = await axios.get(
      `${BASE}/forecast?lat=${c.lat}&lon=${c.lon}&appid=${KEY}&units=metric&cnt=16`,
      { timeout: 8000 }
    );
    const hours = data.list.map(item => ({
      timestamp: new Date(item.dt * 1000).toISOString(),
      temp:      Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      humidity:  item.main.humidity,
      condition: { main: item.weather[0]?.main, description: item.weather[0]?.description },
      windSpeed: item.wind?.speed,
    }));
    const result = { available: true, lat: c.lat, lon: c.lon, data: { hours } };
    setCache(ck, result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.response?.data?.message || err.message });
  }
});

module.exports = router;