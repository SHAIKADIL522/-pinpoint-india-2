import React from "react";
import { motion } from "framer-motion";
import { SkeletonBlock } from "./SkeletonLoader";

/**
 * MapSkeleton — placeholder for map panels while tiles/data load.
 * Shows a pulsing grid pattern + center marker pulse + corner controls skeleton.
 *
 * Props:
 *  - height: number | string (default "100%")
 */
export default function MapSkeleton({ height = "100%" }) {
  return (
    <div style={{
      position: "relative", width: "100%", height,
      minHeight: 320, borderRadius: 16, overflow: "hidden",
      background: "rgba(15,23,42,0.6)",
      border: "1px solid rgba(255,255,255,0.08)",
    }}>
      {/* Faux grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        opacity: 0.6,
      }} />

      {/* Center marker pulse */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <motion.div
          animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", width: 16, height: 16, borderRadius: "50%",
            background: "#22D3EE",
          }}
        />
        <div style={{
          width: 10, height: 10, borderRadius: "50%",
          background: "#22D3EE", boxShadow: "0 0 12px #22D3EE",
        }} />
      </div>

      {/* Top-left status chip */}
      <div style={{ position: "absolute", top: 16, left: 16 }}>
        <SkeletonBlock width={140} height={28} radius={8} />
      </div>

      {/* Top-right control buttons */}
      <div style={{ position: "absolute", top: 16, right: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBlock key={i} width={36} height={36} radius={8} />
        ))}
      </div>

      {/* Bottom legend */}
      <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
        <SkeletonBlock width={180} height={48} radius={12} />
      </div>
    </div>
  );
}