import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { pageVariants, staggerContainer } from "../animations/pageVariants";
import { cardVariants } from "../animations/cardVariants";
import HeroSection from "../components/premium/HeroSection";

const FEATURES = [
  { icon: "🔍", title: "Instant Lookup", desc: "Get complete details for any Indian pincode in milliseconds.", to: "/" },
  { icon: "🌡️", title: "Live Weather", desc: "Real-time temperature, humidity, wind and forecasts via OpenWeatherMap.", to: "/map-intelligence" },
  { icon: "✨", title: "AI Insights", desc: "Gemini Flash generates cultural facts and local tips for every location.", to: "/dashboard" },
  { icon: "🗺️", title: "Interactive Map", desc: "Dark-mode Leaflet map with smooth fly-to animations.", to: "/map-intelligence" },
  { icon: "📍", title: "Nearby Places", desc: "Hospitals, railways, airports and attractions near any pincode.", to: "/map-intelligence" },
  { icon: "⭐", title: "Favorites", desc: "Save and revisit your most searched locations instantly.", to: "/favorites" },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <HeroSection />

      {/* ── Features grid ── */}
      <div style={{ padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
            Everything you need
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, color: "#e2e8f0" }}>
            Built for Intelligence
          </h2>
        </div>
        <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}
        >
          {FEATURES.map((f, i) => (
            <motion.div key={i} variants={cardVariants} whileHover="hover"
              onClick={() => navigate(f.to)}
              style={{
                padding: 24, borderRadius: 16, cursor: "pointer",
                background: "rgba(15,22,41,0.5)", border: "1px solid rgba(255,255,255,0.06)",
              }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}