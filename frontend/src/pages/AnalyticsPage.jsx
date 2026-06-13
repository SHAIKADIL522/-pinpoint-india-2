import React from "react";
import { motion } from "framer-motion";
import { pageVariants } from "../animations/pageVariants";

export default function AnalyticsPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 20px" }}
    >
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 800,
            marginBottom: 6,
            color: "#e2e8f0",
          }}
        >
          📊 Analytics
        </h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>
          Insights and usage statistics will appear here.
        </p>
      </div>

      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          borderRadius: 16,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.3 }}>📊</div>
        <div style={{ fontSize: 14, color: "#64748b" }}>
          Analytics dashboard coming soon.
        </div>
      </div>
    </motion.div>
  );
}