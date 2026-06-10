import React from "react";

export default function LoadingSpinner({ size = 40, text = "Loading…" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: 32 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        border: `3px solid rgba(59,130,246,0.15)`,
        borderTopColor: "#3b82f6",
        animation: "spin 0.7s linear infinite",
      }} />
      {text && <div style={{ color: "#64748b", fontSize: 13 }}>{text}</div>}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
