const express = require("express");
const axios   = require("axios");
const router  = express.Router();

const NOMINATIM = "https://nominatim.openstreetmap.org/search";

const CATEGORY_CONFIG = {
  hospital:   { key: "amenity", val: "hospital",    radiusDeg: 0.135 },
  railway:    { key: "railway", val: "station",     radiusDeg: 0.180 },
  airport:    { key: "aeroway", val: "aerodrome",   radiusDeg: 0.720 },
  bus:        { key: "amenity", val: "bus_station", radiusDeg: 0.135 },
  attraction: { key: "tourism", val: "attraction",  radiusDeg: 0.135 },
};

async function fetchCategory(key, lat, lon) {
  const { key: tagKey, val: tagVal, radiusDeg } = CATEGORY_CONFIG[key];
  const bbox = `${lon - radiusDeg},${lat - radiusDeg},${lon + radiusDeg},${lat + radiusDeg}`;

  try {
    const { data } = await axios.get(NOMINATIM, {
      params: {
        [tagKey]:          tagVal,
        format:            "jsonv2",
        limit:             10,
        bounded:           1,
        viewbox:           bbox,
        "accept-language": "en",
      },
      headers: {
        "User-Agent": "PinPointIndia/2.0 (location-intelligence-portfolio-app)",
        "Referer":    "http://localhost:5173",
        "Accept":     "application/json",
      },
      timeout: 12000,
    });

    return (data || []).slice(0, 10).map(el => ({
      name:     el.display_name?.split(",")[0]?.trim() || `${key} (unnamed)`,
      type:     key,
      distance: haversine(lat, lon, parseFloat(el.lat), parseFloat(el.lon)).toFixed(1),
      lat:      parseFloat(el.lat),
      lon:      parseFloat(el.lon),
    }));
  } catch (e) {
    console.warn(`Nominatim fetch failed for ${key}: ${e.message}`);
    return [];
  }
}

// GET /api/places/nearby?lat=17.05&lon=79.26&type=all
router.get("/nearby", async (req, res) => {
  const { lat, lon, type = "all" } = req.query;
  if (!lat || !lon)
    return res.status(400).json({ error: "lat and lon required" });

  const categories = type === "all" ? Object.keys(CATEGORY_CONFIG) : [type];

  const results = await Promise.allSettled(
    categories.map(cat => fetchCategory(cat, parseFloat(lat), parseFloat(lon)))
  );

  const allPlaces = results
    .filter(r => r.status === "fulfilled")
    .flatMap(r => r.value)
    .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

  res.json(allPlaces.slice(0, 20));
});

function haversine(lat1, lon1, lat2, lon2) {
  const R    = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a    =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((+lat1 * Math.PI) / 180) *
    Math.cos((+lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

module.exports = router;