import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import api from "../../utils/api";
import GlassCard from "../ui/GlassCard";
import { SkeletonBlock } from "../ui/SkeletonLoader";

// Weather condition → emoji
function conditionIcon(main) {
  const m = { Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Drizzle: "🌦️",
    Thunderstorm: "⛈️", Snow: "❄️", Mist: "🌫️", Fog: "🌫️", Haze: "🌫️" };
  return m[main] || "🌡️";
}

function shortDay(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  return d.toLocaleDateString("en-IN", { weekday: "short" });
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(15,23,42,0.95)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10, padding: "8px 14px", fontSize: 12,
      backdropFilter: "blur(12px)",
    }}>
      <div style={{ color: "#94A3B8", marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value}°C
        </div>
      ))}
    </div>
  );
};

export default function WeatherChart({ lat, lon, district, state }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!lat || !lon) return;

    // Try real 7-day forecast from backend v1 API
    api.get(`/v1/weather/daily?lat=${lat}&lon=${lon}`)
      .then(res => {
        const days = res.data?.data?.days;
        if (!days?.length) throw new Error("no data");
        setData(
          days.slice(0, 7).map(d => ({
            day:      shortDay(d.timestamp),
            icon:     conditionIcon(d.condition?.main),
            high:     d.tempMax != null ? Math.round(d.tempMax) : null,
            low:      d.tempMin != null ? Math.round(d.tempMin) : null,
            humidity: d.humidity ?? null,
          }))
        );
      })
      .catch(() => {
        // Graceful fallback — show empty state
        setError(true);
      });
  }, [lat, lon]);

  if (error) return (
    <GlassCard padding={20} style={{ color: "#64748B", fontSize: 13, textAlign: "center" }}>
      📊 7-day forecast requires OpenWeather API key
    </GlassCard>
  );

  if (!data) return (
    <GlassCard padding={20}>
      <SkeletonBlock width={140} height={12} style={{ marginBottom: 14 }} />
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 14 }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <SkeletonBlock key={i} width={28} height={60} radius={8} />
        ))}
      </div>
      <SkeletonBlock width="100%" height={90} radius={10} />
    </GlassCard>
  );

  return (
    <GlassCard padding={20}>
      <div style={{
        fontSize: 11, color: "#94A3B8", fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14,
      }}>
        📈 7-Day Forecast
      </div>

      {/* Day icons row */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        {data.map((d, i) => (
          <div key={i} style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 20 }}>{d.icon}</div>
            <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>{d.day}</div>
            {d.high != null && (
              <div style={{ fontSize: 13, fontWeight: 700, color: "#22D3EE" }}>{d.high}°</div>
            )}
            {d.low != null && (
              <div style={{ fontSize: 11, color: "#64748B" }}>{d.low}°</div>
            )}
          </div>
        ))}
      </div>

      {/* Area chart */}
      {data.some(d => d.high != null) && (
        <ResponsiveContainer width="100%" height={90}>
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#22D3EE" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone" dataKey="high" name="High"
              stroke="#22D3EE" strokeWidth={2}
              fill="url(#tempGrad)"
              dot={{ fill: "#22D3EE", r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Area
              type="monotone" dataKey="low" name="Low"
              stroke="#10B981" strokeWidth={1.5}
              fill="none"
              dot={{ fill: "#10B981", r: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </GlassCard>
  );
}