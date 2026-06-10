import React, { useState } from "react";
import WeatherCard from "../weather/WeatherCard";
import AIInsightCard from "../ai/AIInsightCard";

const stateEmojis = {
  "Andhra Pradesh": "🏛️", "Arunachal Pradesh": "🏔️", "Assam": "🫖",
  "Bihar": "🕌", "Chhattisgarh": "🌿", "Goa": "🏖️", "Gujarat": "🎭",
  "Haryana": "🌾", "Himachal Pradesh": "🏔️", "Jharkhand": "⛏️",
  "Karnataka": "🌺", "Kerala": "🥥", "Madhya Pradesh": "🐯",
  "Maharashtra": "🌆", "Manipur": "🏞️", "Meghalaya": "☁️",
  "Mizoram": "🌄", "Nagaland": "🗿", "Odisha": "🛕", "Punjab": "🌻",
  "Rajasthan": "🏜️", "Sikkim": "🏔️", "Tamil Nadu": "🛕",
  "Telangana": "💎", "Tripura": "🌳", "Uttar Pradesh": "🕌",
  "Uttarakhand": "⛰️", "West Bengal": "🐯", "Delhi": "🏛️",
};

export default function ResultCard({ data, onToggleFavorite, isFav }) {
  const [showAll, setShowAll] = useState(false);
  const emoji = stateEmojis[data.state] || "📍";
  const displayPOs = showAll ? data.postOffices : data.postOffices.slice(0, 3);

  const card = {
    padding: 28,
    borderRadius: 16,
    background: "rgba(15,22,41,0.7)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  };

  const metaGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 10,
    margin: "20px 0",
  };

  const metaTile = {
    padding: "14px 16px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
  };

  return (
    <div style={card} className="fade-up">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 36 }}>{emoji}</span>
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "var(--font-display)", lineHeight: 1.1 }}>
                {data.district}
              </h2>
              <div style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 2 }}>
                {data.state}, {data.country}
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <span style={{
            padding: "4px 14px",
            borderRadius: 20,
            background: "rgba(59,130,246,0.12)",
            border: "1px solid rgba(59,130,246,0.3)",
            color: "#93c5fd",
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: "0.1em",
          }}>
            {data.pincode}
          </span>
          <button
            onClick={() => onToggleFavorite(data)}
            title={isFav ? "Remove from favorites" : "Add to favorites"}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: isFav ? "rgba(255,153,51,0.15)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${isFav ? "rgba(255,153,51,0.4)" : "rgba(255,255,255,0.1)"}`,
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            {isFav ? "⭐" : "☆"}
          </button>
        </div>
      </div>

      {/* Meta tiles */}
      <div style={metaGrid}>
        {[
          { label: "Division", value: data.division },
          { label: "Region", value: data.region },
          { label: "Circle", value: data.circle },
          { label: "Post Offices", value: data.postOffices.length },
        ].map(({ label, value }) => (
          <div key={label} style={metaTile}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
              {label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
              {value || "—"}
            </div>
          </div>
        ))}
      </div>

      {/* Weather */}
      <div style={{ marginBottom: 12 }} className="fade-up-2">
        <WeatherCard city={`${data.district}, ${data.state}`} />
      </div>

      {/* AI Insight */}
      <div style={{ marginBottom: 20 }} className="fade-up-3">
        <AIInsightCard
          pincode={data.pincode}
          district={data.district}
          state={data.state}
          postOfficeCount={data.postOffices.length}
        />
      </div>

      {/* Post Offices */}
      <div className="fade-up-4">
        <div style={{
          height: 1,
          background: "rgba(255,255,255,0.06)",
          margin: "0 0 16px",
        }} />
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
          📮 Post Offices ({data.postOffices.length})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {displayPOs.map((po, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
              gap: 12,
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{po.name}</div>
                {po.taluk && po.taluk !== "NA" && (
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{po.taluk}</div>
                )}
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <span style={{
                  padding: "2px 8px",
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 600,
                  background: po.branchType === "Head Post Office" ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)",
                  color: po.branchType === "Head Post Office" ? "#6ee7b7" : "var(--text-muted)",
                  border: `1px solid ${po.branchType === "Head Post Office" ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.06)"}`,
                }}>
                  {po.branchType}
                </span>
                {po.deliveryStatus === "Delivery" && (
                  <span style={{
                    padding: "2px 8px",
                    borderRadius: 6,
                    fontSize: 10,
                    fontWeight: 600,
                    background: "rgba(59,130,246,0.1)",
                    color: "#93c5fd",
                    border: "1px solid rgba(59,130,246,0.2)",
                  }}>
                    Delivery
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        {data.postOffices.length > 3 && (
          <button
            onClick={() => setShowAll((s) => !s)}
            style={{
              marginTop: 10,
              width: "100%",
              padding: "10px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "var(--font-body)",
              transition: "all 0.2s",
            }}
          >
            {showAll ? "▲ Show less" : `▼ Show all ${data.postOffices.length} post offices`}
          </button>
        )}
      </div>
    </div>
  );
}
