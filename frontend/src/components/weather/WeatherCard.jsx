import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { getWeatherHighlights } from "../../services/weatherService";
import { windDir, formatTime } from "../../utils/helpers";
import { WEATHER_ICONS } from "../../utils/constants";

// Accepts lat/lon (preferred — works for all Indian towns)
// Falls back to city string only when no coords available
export default function WeatherCard({ city, lat, lon }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const hasCoords = lat != null && lon != null && !isNaN(lat) && !isNaN(lon);
    if (!hasCoords && !city) return;

    setLoading(true);
    setError(null);
    setWeather(null);

    // lat/lon skips OWM geocoding — works for Nalgonda, Suryapet, any small town
    const url = hasCoords
      ? `/weather?lat=${lat}&lon=${lon}`
      : `/weather?city=${encodeURIComponent(city)}`;

    api.get(url)
      .then(res => setWeather(res.data))
      .catch(err => setError(err?.response?.data?.error || "Weather unavailable"))
      .finally(() => setLoading(false));
  }, [lat, lon, city]);

  const cardStyle = {
    padding: 20, borderRadius: 14,
    background: "linear-gradient(135deg, rgba(30,58,138,0.3) 0%, rgba(15,22,41,0.8) 100%)",
    border: "1px solid rgba(59,130,246,0.2)",
  };

  if (loading) return (
    <div style={cardStyle}>
      <div style={{ color: "#64748b", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 14, height: 14, borderRadius: "50%",
          border: "2px solid rgba(59,130,246,0.3)", borderTopColor: "#3b82f6",
          animation: "spin 0.7s linear infinite",
        }} />
        Fetching weather data…
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error) return (
    <div style={{ ...cardStyle, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
      <div style={{ color: "#fca5a5", fontSize: 13 }}>⚠️ {error}</div>
    </div>
  );

  if (!weather) return null;

  const icon       = WEATHER_ICONS[weather.main] || WEATHER_ICONS.default;
  const highlights = getWeatherHighlights(weather);
  const sunrise    = formatTime(weather.sunrise, weather.timezone);
  const sunset     = formatTime(weather.sunset,  weather.timezone);

  const stats = [
    { label: "Humidity",   value: `${weather.humidity}%`,                                icon: "💧" },
    { label: "Wind",       value: `${weather.windSpeed} m/s ${windDir(weather.windDeg)}`, icon: "💨" },
    { label: "Visibility", value: `${((weather.visibility || 0) / 1000).toFixed(1)} km`, icon: "👁️" },
    { label: "Pressure",   value: `${weather.pressure} hPa`,                             icon: "🌡️" },
    { label: "Sunrise",    value: sunrise,                                                icon: "🌅" },
    { label: "Sunset",     value: sunset,                                                 icon: "🌇" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
      {/* Main temp row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 44, lineHeight: 1 }}>{icon}</span>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1 }}>
              {Math.round(weather.temp)}°C
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8", textTransform: "capitalize", marginTop: 2 }}>
              {weather.description}
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              Feels like {Math.round(weather.feelsLike)}°C
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{weather.city}</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>{weather.country}</div>
          <div style={{ marginTop: 6, display: "flex", gap: 6, justifyContent: "flex-end" }}>
            <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}>
              H: {Math.round(weather.tempMax)}°
            </span>
            <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, background: "rgba(59,130,246,0.1)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.2)" }}>
              L: {Math.round(weather.tempMin)}°
            </span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
        {stats.map(({ label, value, icon: ico }) => (
          <div key={label} style={{
            padding: "10px 12px", borderRadius: 10,
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
              {ico} {label}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Weather highlights */}
      {highlights.length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
            Weather Highlights
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {highlights.map((h, i) => (
              <div key={i} style={{
                padding: "10px 12px", borderRadius: 10,
                background: "rgba(255,255,255,0.02)", border: `1px solid ${h.color}20`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 14 }}>{h.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: h.color }}>{h.label}</span>
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{h.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}