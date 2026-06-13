import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { WEATHER_ICONS } from "../../utils/constants";
import { windDir } from "../../utils/helpers";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import { SkeletonBlock } from "../ui/SkeletonLoader";


function deriveMetrics(weather) {
  if (!weather) return null;
  const temp = weather.main?.temp ?? weather.temp;
  const humidity = weather.main?.humidity ?? weather.humidity;
  const wind = weather.wind?.speed ?? weather.wind_speed ?? 0;
  const condition = weather.weather?.[0]?.main || weather.condition || "Clear";

  // Travel conditions: penalize heavy rain/storm/snow + high wind
  let travel = "Excellent";
  if (["Thunderstorm", "Snow"].includes(condition) || wind > 12) travel = "Poor";
  else if (["Rain", "Drizzle"].includes(condition) || wind > 7) travel = "Fair";

  // Outdoor index 0-100
  let outdoor = 90;
  if (condition === "Rain" || condition === "Drizzle") outdoor -= 30;
  if (condition === "Thunderstorm" || condition === "Snow") outdoor -= 60;
  if (temp > 38 || temp < 5) outdoor -= 25;
  if (humidity > 85) outdoor -= 10;
  outdoor = Math.max(5, Math.min(100, outdoor));

  // Agriculture impact
  let agriculture = "Favorable";
  if (condition === "Rain" || condition === "Drizzle") agriculture = "Beneficial — Rainfall";
  if (condition === "Thunderstorm") agriculture = "Caution — Storm Risk";
  if (temp > 40) agriculture = "Heat Stress Risk";

  // Forecast confidence — static high, since OpenWeatherMap free tier doesn't expose this;
  // derived heuristically from condition stability
  const confidence = ["Clear", "Clouds"].includes(condition) ? 92 : 78;

  return { temp, humidity, wind, condition, travel, outdoor, agriculture, confidence };
}

export default function WeatherIntelligencePanel({ lat, lon, city }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const hasCoords = lat != null && lon != null && !isNaN(lat) && !isNaN(lon);
    if (!hasCoords && !city) return;

    setLoading(true);
    setError(null);
    setWeather(null);

    const url = hasCoords
      ? `/weather?lat=${lat}&lon=${lon}`
      : `/weather?city=${encodeURIComponent(city)}`;

    api.get(url)
      .then(res => setWeather(res.data))
      .catch(err => setError(err?.response?.data?.error || "Weather intelligence unavailable"))
      .finally(() => setLoading(false));
  }, [lat, lon, city]);

  if (loading) {
    return (
      <GlassCard padding={20}>
        <SkeletonBlock width={160} height={16} style={{ marginBottom: 16 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} height={64} radius={12} />)}
        </div>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard padding={20}>
        <div style={{ color: "#F59E0B", fontSize: 13 }}>⚠ {error}</div>
      </GlassCard>
    );
  }

  const m = deriveMetrics(weather);
  if (!m) return null;

  const icon = WEATHER_ICONS[m.condition] || WEATHER_ICONS.default;

  return (
    <GlassCard padding={20}>
      <SectionHeader
        eyebrow="Live"
        title="Weather Intelligence"
        action={<span style={{ fontSize: 28 }}>{icon}</span>}
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 18 }}>
        <span style={{ fontSize: 36, fontWeight: 800, color: "#fff" }}>{Math.round(m.temp)}°C</span>
        <span style={{ fontSize: 13, color: "#94A3B8" }}>{m.condition} · Wind {windDir(weather.wind?.deg ?? 0)} {m.wind} m/s</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        <Metric label="Travel Conditions" value={m.travel} accent={m.travel === "Excellent" ? "#10B981" : m.travel === "Fair" ? "#F59E0B" : "#EF4444"} />
        <Metric label="Outdoor Index" value={`${m.outdoor}/100`} accent="#22D3EE" bar={m.outdoor} />
        <Metric label="Agriculture Impact" value={m.agriculture} accent="#10B981" />
        <Metric label="Forecast Confidence" value={`${m.confidence}%`} accent="#22D3EE" bar={m.confidence} />
      </div>
    </GlassCard>
  );
}

function Metric({ label, value, accent, bar }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12, padding: 12,
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: bar != null ? 6 : 0 }}>
        {value}
      </div>
      {bar != null && (
        <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${bar}%` }} transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ height: "100%", background: accent, borderRadius: 2 }}
          />
        </div>
      )}
    </motion.div>
  );
}