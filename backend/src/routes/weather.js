const express = require("express");
const axios   = require("axios");
const router  = express.Router();

const OW_KEY = process.env.OPENWEATHER_API_KEY;
const BASE   = "https://api.openweathermap.org";

// 3-attempt geocoding — handles small Indian towns like Nalgonda, Suryapet
async function geocodeCity(city) {
  const district = city.split(",")[0].trim();
  const attempts = [
    `${city},IN`,     // "Nalgonda, Telangana,IN"
    `${district},IN`, // "Nalgonda,IN"
    district,         // "Nalgonda"
  ];
  for (const q of attempts) {
    try {
      const { data } = await axios.get(
        `${BASE}/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=1&appid=${OW_KEY}`,
        { timeout: 8000 }
      );
      if (data?.length) return { lat: data[0].lat, lon: data[0].lon };
    } catch { continue; }
  }
  throw new Error("City not found");
}

// GET /api/weather?lat=17.05&lon=79.26   ← preferred (always works)
// GET /api/weather?city=Nalgonda, Telangana  ← fallback
router.get("/", async (req, res) => {
  if (!OW_KEY)
    return res.status(500).json({ error: "OPENWEATHER_API_KEY not configured in backend .env" });

  try {
    let { lat, lon, city } = req.query;

    if ((!lat || !lon) && city) {
      const coords = await geocodeCity(city);
      lat = coords.lat;
      lon = coords.lon;
    }

    if (!lat || !lon)
      return res.status(400).json({ error: "Provide city or lat/lon query params." });

    const { data } = await axios.get(
      `${BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OW_KEY}&units=metric`,
      { timeout: 10000 }
    );

    res.json({
      city:        data.name,
      country:     data.sys?.country,
      lat:         data.coord?.lat,
      lon:         data.coord?.lon,
      temp:        data.main?.temp,
      feelsLike:   data.main?.feels_like,
      tempMin:     data.main?.temp_min,
      tempMax:     data.main?.temp_max,
      humidity:    data.main?.humidity,
      pressure:    data.main?.pressure,
      visibility:  data.visibility,
      windSpeed:   data.wind?.speed,
      windDeg:     data.wind?.deg,
      description: data.weather?.[0]?.description,
      icon:        data.weather?.[0]?.icon,
      main:        data.weather?.[0]?.main,
      clouds:      data.clouds?.all,
      sunrise:     data.sys?.sunrise,
      sunset:      data.sys?.sunset,
      timezone:    data.timezone,
      timestamp:   data.dt,
    });
  } catch (err) {
    console.error("Weather fetch error:", err.message);
    if (err.response?.status === 401)
      return res.status(401).json({ error: "Invalid OpenWeatherMap API key." });
    if (err.response?.status === 404 || err.message === "City not found")
      return res.status(404).json({ error: "Location not found." });
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
});

module.exports = router;