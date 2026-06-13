import React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import GlassCard from "./GlassCard";

/**
 * MetricCard — enterprise stat card with optional sparkline trend.
 *
 * Props:
 *  - label: string
 *  - value: string | number
 *  - delta: string (e.g. "+2.35% vs last year")
 *  - deltaPositive: boolean (controls delta color)
 *  - icon: string | ReactNode
 *  - trend: number[] (sparkline data points)
 *  - trendColor: string (line color, default secondary green)
 */
export default function MetricCard({
  label,
  value,
  delta,
  deltaPositive = true,
  icon,
  trend,
  trendColor = "#10B981",
  style = {},
}) {
  const chartData = trend ? trend.map((v, i) => ({ i, v })) : null;

  return (
    <GlassCard padding={20} style={{ display: "flex", flexDirection: "column", gap: 10, ...style }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          color: "#94A3B8",
        }}>
          {label}
        </div>
        {icon && <div style={{ fontSize: 16, opacity: 0.8 }}>{icon}</div>}
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div>
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.1 }}
          >
            {value}
          </motion.div>
          {delta && (
            <div style={{
              fontSize: 12, fontWeight: 600, marginTop: 4,
              color: deltaPositive ? "#10B981" : "#F59E0B",
            }}>
              {delta}
            </div>
          )}
        </div>

        {chartData && (
          <div style={{ width: 80, height: 36, flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={trendColor}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </GlassCard>
  );
}