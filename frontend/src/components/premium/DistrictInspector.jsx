import React from "react";
import { motion } from "framer-motion";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import MetricCard from "../ui/MetricCard";
import AISummaryPanel from "./AISummaryPanel";

/**
 * DistrictInspector — shown when a location/district is selected.
 * Population/Area/Infrastructure/Growth scores are DISPLAY-ONLY derived
 * placeholders (no backend endpoint exists for these yet) — clearly
 * labeled as estimates so they don't misrepresent live data. Weather
 * and AI sections consume real existing data via passed-in components.
 *
 * Props:
 *  - district, state, pincode, postOfficeCount
 *  - estimates: { population, areaKm2, infrastructureScore, growthScore } (optional, all optional)
 *  - onClose: () => void (optional close handler for drawer/modal usage)
 */
export default function DistrictInspector({
  district, state, pincode, postOfficeCount, estimates = {}, onClose,
}) {
  const {
    population, areaKm2, infrastructureScore, growthScore,
  } = estimates;

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <GlassCard padding={20}>
        <SectionHeader
          eyebrow="District Inspector"
          title={district || "Unknown District"}
          subtitle={state}
          action={onClose && (
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, width: 32, height: 32, color: "#94A3B8",
                fontSize: 14, cursor: "pointer",
              }}
            >
              ✕
            </button>
          )}
          style={{ marginBottom: 16 }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          <MetricCard
            label="Population (Est.)"
            value={population != null ? formatNumber(population) : "—"}
            icon="👥"
          />
          <MetricCard
            label="Area (Est.)"
            value={areaKm2 != null ? `${formatNumber(areaKm2)} km²` : "—"}
            icon="📐"
          />
          <MetricCard
            label="Infrastructure Score"
            value={infrastructureScore != null ? `${infrastructureScore}/100` : "—"}
            icon="🏗️"
            deltaPositive={infrastructureScore >= 70}
            delta={infrastructureScore != null ? scoreLabel(infrastructureScore) : undefined}
          />
          <MetricCard
            label="Growth Score"
            value={growthScore != null ? `${growthScore}/100` : "—"}
            icon="📈"
            deltaPositive={growthScore >= 70}
            delta={growthScore != null ? scoreLabel(growthScore) : undefined}
          />
        </div>

        {(population == null && areaKm2 == null && infrastructureScore == null && growthScore == null) && (
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, fontStyle: "italic" }}>
            District-level statistics are estimates pending a dedicated data source.
          </div>
        )}
      </GlassCard>

      <AISummaryPanel
        pincode={pincode}
        district={district}
        state={state}
        postOfficeCount={postOfficeCount}
      />
    </motion.div>
  );
}

function formatNumber(n) {
  if (n >= 100000) return `${(n / 100000).toFixed(2)}L`;
  return n.toLocaleString("en-IN");
}

function scoreLabel(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Moderate";
  return "Needs Attention";
}