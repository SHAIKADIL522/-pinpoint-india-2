import React from "react";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "24px",
      textAlign: "center",
      color: "#475569",
      fontSize: 12,
    }}>
      <div style={{ marginBottom: 4 }}>
        📍 <strong style={{ color: "#64748b" }}>PinPoint India</strong> — AI-Powered Location Intelligence Platform
      </div>
      <div>Built with React + Express · Powered by OpenRouter & OpenWeatherMap</div>
    </footer>
  );
}
