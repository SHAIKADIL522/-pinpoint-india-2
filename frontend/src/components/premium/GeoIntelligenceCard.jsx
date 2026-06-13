import React from "react";
import { motion } from "framer-motion";
import GlassCard from "../ui/GlassCard";

/**
 * GeoIntelligenceCard — small label/value tile used inside sidebars and
 * inspectors for facts like coordinates, DigiPIN, area, elevation, etc.
 *
 * Props:
 *  - icon: string | ReactNode
 *  - label: string
 *  - value: string | number | ReactNode
 *  - sub: string (optional secondary line)
 *  - accent: string (optional left border / icon color, default cyan)
 *  - copyable: boolean — adds a copy button (for DigiPIN/coords)
 */
export default function GeoIntelligenceCard({
  icon,
  label,
  value,
  sub,
  accent = "#22D3EE",
  copyable = false,
}) {
  const [copied, setCopied] = React.useState(false);

  function handleCopy() {
    if (value == null) return;
    navigator.clipboard?.writeText(String(value)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <GlassCard
      padding={14}
      hover={false}
      style={{
        borderLeft: `2px solid ${accent}33`,
        display: "flex", flexDirection: "column", gap: 6,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
          color: "#94A3B8",
        }}>
          {icon && <span style={{ fontSize: 13 }}>{icon}</span>}
          {label}
        </div>
        {copyable && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              fontSize: 11, color: copied ? "#10B981" : "#64748B", fontWeight: 700,
            }}
          >
            {copied ? "Copied" : "Copy"}
          </motion.button>
        )}
      </div>
      <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>
        {value ?? "—"}
      </div>
      {sub && <div style={{ fontSize: 11, color: "#64748B" }}>{sub}</div>}
    </GlassCard>
  );
}