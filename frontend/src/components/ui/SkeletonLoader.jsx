import React from "react";
import { motion } from "framer-motion";

/**
 * SkeletonLoader — shimmering placeholder block. Base for AISkeleton/MapSkeleton.
 *
 * Props:
 *  - width: number | string (default "100%")
 *  - height: number | string (default 16)
 *  - radius: number (default 8)
 *  - style: extra overrides
 */
export function SkeletonBlock({ width = "100%", height = 16, radius = 8, style = {} }) {
  return (
    <motion.div
      animate={{ opacity: [0.5, 0.9, 0.5] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      style={{
        width, height, borderRadius: radius,
        background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 100%)",
        ...style,
      }}
    />
  );
}

/**
 * SkeletonLoader — generic card-shaped skeleton with N lines.
 *
 * Props:
 *  - lines: number (default 3)
 *  - showAvatar: boolean (renders a circular block above lines)
 *  - height: number (card min-height, optional)
 */
export default function SkeletonLoader({ lines = 3, showAvatar = false, height }) {
  return (
    <div style={{
      background: "rgba(15,23,42,0.6)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: 20,
      minHeight: height,
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      {showAvatar && <SkeletonBlock width={40} height={40} radius={20} style={{ marginBottom: 6 }} />}
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock key={i} width={i === lines - 1 ? "60%" : "100%"} height={14} />
      ))}
    </div>
  );
}