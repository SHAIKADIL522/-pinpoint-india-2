import React from "react";
import { motion } from "framer-motion";

/**
 * SectionHeader — eyebrow label + title + optional action slot.
 *
 * Props:
 *  - eyebrow: string (small uppercase label, optional)
 *  - title: string
 *  - subtitle: string (optional)
 *  - action: ReactNode (right-aligned, e.g. button or "Last updated" text)
 *  - align: "left" | "center" (default "left")
 */
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
  align = "left",
  style = {},
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      style={{
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        gap: 16, marginBottom: 20,
        textAlign: align,
        flexDirection: align === "center" ? "column" : "row",
        ...style,
      }}
    >
      <div>
        {eyebrow && (
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
            color: "#94A3B8", marginBottom: 8,
          }}>
            {eyebrow}
          </div>
        )}
        <h2 style={{
          fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800,
          color: "#fff", letterSpacing: "-0.01em", margin: 0,
        }}>
          {title}
        </h2>
        {subtitle && (
          <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 6, lineHeight: 1.5 }}>
            {subtitle}
          </div>
        )}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </motion.div>
  );
}