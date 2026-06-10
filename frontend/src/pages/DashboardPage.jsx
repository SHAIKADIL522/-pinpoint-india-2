import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { POPULAR_PINCODES } from "../utils/constants";
import { pageVariants, staggerContainer } from "../animations/pageVariants";
import { cardVariants } from "../animations/cardVariants";

const FEATURES = [
  { icon: "🔍", title: "Instant Lookup", desc: "Get complete details for any Indian pincode in milliseconds." },
  { icon: "🌡️", title: "Live Weather", desc: "Real-time temperature, humidity, wind and forecasts via OpenWeatherMap." },
  { icon: "✨", title: "AI Insights", desc: "Gemini Flash generates cultural facts and local tips for every location." },
  { icon: "🗺️", title: "Interactive Map", desc: "Dark-mode Leaflet map with smooth fly-to animations." },
  { icon: "📍", title: "Nearby Places", desc: "Hospitals, railways, airports and attractions near any pincode." },
  { icon: "⭐", title: "Favorites", desc: "Save and revisit your most searched locations instantly." },
];

export default function DashboardPage() {
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    const p = pin.trim();
    if (/^\d{6}$/.test(p)) navigate(`/?pin=${p}`);
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* ── Hero ── */}
      <div style={{
        position: "relative", overflow: "hidden",
        minHeight: "90vh", display: "flex", alignItems: "center",
        padding: "80px 24px",
      }}>
        {/* Background map illustration */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 60% at 70% 50%, rgba(99,102,241,0.06) 0%, transparent 60%)",
        }} />
        {/* Animated dots */}
        {[...Array(6)].map((_, i) => (
          <motion.div key={i}
            animate={{ y: [0, -12, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.7 }}
            style={{
              position: "absolute",
              left: `${15 + i * 12}%`, top: `${20 + (i % 3) * 20}%`,
              width: 8, height: 8, borderRadius: "50%",
              background: `hsl(${220 + i * 30}, 80%, 65%)`,
              boxShadow: `0 0 12px hsl(${220 + i * 30}, 80%, 65%)`,
            }}
          />
        ))}

        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "4px 14px", borderRadius: 20, marginBottom: 24,
                background: "rgba(255,153,51,0.1)", border: "1px solid rgba(255,153,51,0.25)",
                color: "#fbbf24", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
              }}
            >
              🇮🇳 AI-Powered Location Intelligence Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{
                fontFamily: "var(--font-display)", fontWeight: 900, lineHeight: 1.1,
                fontSize: "clamp(36px, 5vw, 58px)", marginBottom: 20,
                background: "linear-gradient(135deg, #f0f4ff 0%, #93c5fd 60%, #818cf8 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}
            >
              Explore Any<br />Pincode. Instantly.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ color: "#64748b", fontSize: 16, lineHeight: 1.7, marginBottom: 36, maxWidth: 420 }}
            >
              Get real-time weather, AI insights, map location and nearby places of any area in India.
            </motion.p>

            {/* Search */}
            <motion.form
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              onSubmit={handleSearch}
              style={{ display: "flex", gap: 10, marginBottom: 20, maxWidth: 400 }}
            >
              <div style={{ flex: 1, position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 15 }}>🔍</span>
                <input
                  value={pin} onChange={e => setPin(e.target.value.replace(/\D/g,"").slice(0,6))}
                  placeholder="Enter 6-digit Pincode" inputMode="numeric" maxLength={6}
                  style={{
                    width: "100%", height: 52, paddingLeft: 42, paddingRight: 16,
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12, color: "#f0f4ff", fontSize: 16, fontFamily: "var(--font-body)",
                    fontWeight: 600, letterSpacing: "0.08em", outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit"
                style={{
                  height: 52, padding: "0 28px", borderRadius: 12,
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  border: "none", color: "#fff", fontFamily: "var(--font-body)",
                  fontSize: 15, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 24px rgba(99,102,241,0.4)",
                }}>
                Search
              </motion.button>
            </motion.form>

            {/* Popular */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <div style={{ fontSize: 11, color: "#475569", marginBottom: 8 }}>Popular Searches</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {POPULAR_PINCODES.map(({ pin: p, label }) => (
                  <button key={p} onClick={() => navigate(`/?pin=${p}`)}
                    style={{
                      padding: "5px 14px", borderRadius: 8,
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                      color: "#94a3b8", fontSize: 12, fontWeight: 600, cursor: "pointer",
                      fontFamily: "var(--font-body)", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; e.currentTarget.style.color = "#a5b4fc"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#94a3b8"; }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — preview cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {FEATURES.slice(0, 4).map((f, i) => (
              <motion.div key={i} variants={cardVariants} whileHover="hover"
                style={{
                  padding: 20, borderRadius: 16,
                  background: "rgba(15,22,41,0.7)", border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(20px)",
                }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{f.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

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
              style={{
                padding: 24, borderRadius: 16,
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
