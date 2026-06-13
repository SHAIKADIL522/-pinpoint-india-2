import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { getWeatherHighlights } from "../../services/weatherService";
import { windDir, formatTime } from "../../utils/helpers";
import { WEATHER_ICONS } from "../../utils/constants";
import GlassCard from "../ui/GlassCard";
import { SkeletonBlock } from "../ui/SkeletonLoader";

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

  if (loading) return (
    <GlassCard padding={20}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <SkeletonBlock width={56} height={56} radius={12} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <SkeletonBlock width={100} height={28} />
          <SkeletonBlock width={140} height={14} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {Array.from({ length: 6 }).map((_, i) => <SkeletonBlock key={i} height={48} radius={10} />)}
      </div>
    </GlassCard>
  );

  if (error) return (
    <GlassCard padding={20} style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}>
      <div style={{ color: "#FCA5A5", fontSize: 13 }}>⚠️ {error}</div>
    </GlassCard>
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
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard padding={20}>
        {/* Main temp row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 44, lineHeight: 1 }}>{icon}</span>
            <div>
              <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1, color: "#fff" }}>
                {Math.round(weather.temp)}°C
              </div>
              <div style={{ fontSize: 13, color: "#94A3B8", textTransform: "capitalize", marginTop: 2 }}>
                {weather.description}
              </div>
              <div style={{ fontSize: 12, color: "#64748B" }}>
                Feels like {Math.round(weather.feelsLike)}°C
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{weather.city}</div>
            <div style={{ fontSize: 11, color: "#64748B" }}>{weather.country}</div>
            <div style={{ marginTop: 6, display: "flex", gap: 6, justifyContent: "flex-end" }}>
              <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.2)" }}>
                H: {Math.round(weather.tempMax)}°
              </span>
              <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "rgba(34,211,238,0.1)", color: "#67E8F9", border: "1px solid rgba(34,211,238,0.2)" }}>
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
              <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
                {ico} {label}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Weather highlights */}
        {highlights.length > 0 && (
          <div>
            <div style={{ fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
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
                  <div style={{ fontSize: 11, color: "#64748B" }}>{h.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}