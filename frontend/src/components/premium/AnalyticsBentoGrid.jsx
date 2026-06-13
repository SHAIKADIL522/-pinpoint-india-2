import React from "react";
import { motion } from "framer-motion";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import MetricCard from "../ui/MetricCard";
import AISummaryPanel from "./AISummaryPanel";
import WeatherIntelligencePanel from "./WeatherIntelligencePanel";

/**
 * AnalyticsBentoGrid — modern SaaS bento layout for the analytics view.
 * Composes existing data via AISummaryPanel/WeatherIntelligencePanel and
 * MetricCard tiles for DigiPIN coverage / location analytics / infrastructure
 * (the latter as labeled estimates, consistent with DistrictInspector).
 *
 * Props:
 *  - location: { pincode, district, state, lat, lon, postOfficeCount, digipin }
 *  - estimates: { infrastructureScore, growthScore, digipinCoverage, aiInsightsToday }
 */
export default function AnalyticsBentoGrid({ location = {}, estimates = {} }) {
  const { pincode, district, state, lat, lon, postOfficeCount, digipin } = location;
  const { infrastructureScore, growthScore, digipinCoverage, aiInsightsToday } = estimates;

  return (
    <div>
      <SectionHeader
        eyebrow="Analytics"
        title="Location Intelligence Overview"
        subtitle={district ? `${district}${state ? `, ${state}` : ""}` : "Select a location to view analytics"}
      />

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: 16,
      }}>
        {/* AI Insights — large */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ gridColumn: "span 7" }}
        >
          <AISummaryPanel pincode={pincode} district={district} state={state} postOfficeCount={postOfficeCount} />
        </motion.div>

        {/* Weather — medium */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
          style={{ gridColumn: "span 5" }}
        >
          {lat != null && lon != null
            ? <WeatherIntelligencePanel lat={lat} lon={lon} />
            : <GlassCard padding={20}><EmptyState label="Weather Intelligence" /></GlassCard>}
        </motion.div>

        {/* DigiPIN coverage */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          style={{ gridColumn: "span 4" }}
        >
          <MetricCard
            label="DigiPIN Coverage"
            value={digipinCoverage != null ? `${digipinCoverage}%` : digipin || "—"}
            icon="🆔"
            delta={digipinCoverage != null ? "Coverage estimate" : "Assigned code"}
            deltaPositive
          />
        </motion.div>

        {/* Infrastructure */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
          style={{ gridColumn: "span 4" }}
        >
          <MetricCard
            label="Infrastructure"
            value={infrastructureScore != null ? `${infrastructureScore}/100` : "—"}
            icon="🏗️"
            delta={infrastructureScore != null ? "Estimate" : undefined}
            deltaPositive={infrastructureScore >= 70}
          />
        </motion.div>

        {/* Growth / Trends */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
          style={{ gridColumn: "span 4" }}
        >
          <MetricCard
            label="Location Trends"
            value={growthScore != null ? `${growthScore}/100` : "—"}
            icon="📈"
            delta={aiInsightsToday != null ? `${aiInsightsToday} insights today` : "Estimate"}
            deltaPositive={growthScore >= 70}
          />
        </motion.div>
      </div>
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div style={{ textAlign: "center", padding: "20px 0", color: "#64748B" }}>
      <div style={{ fontSize: 24, marginBottom: 6 }}>📡</div>
      <div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 11, marginTop: 2 }}>Select a location to view data</div>
    </div>
  );
}