import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkeletonBlock } from "./SkeletonLoader";

const AI_STATES = [
  "Analyzing Location...",
  "Generating Intelligence...",
  "Building Geographic Report...",
];

/**
 * AISkeleton — animated loading state for AI insight panels.
 * Cycles through enterprise-style status messages while content loads.
 *
 * Props:
 *  - lines: number of placeholder text lines (default 4)
 */
export default function AISkeleton({ lines = 4 }) {
  const [stateIndex, setStateIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStateIndex((i) => (i + 1) % AI_STATES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: "rgba(15,23,42,0.6)",
      border: "1px solid rgba(34,211,238,0.15)",
      borderRadius: 16,
      padding: 20,
      display: "flex", flexDirection: "column", gap: 14,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          style={{
            width: 18, height: 18, borderRadius: "50%",
            border: "2px solid rgba(34,211,238,0.2)",
            borderTopColor: "#22D3EE",
          }}
        />
        <AnimatePresence mode="wait">
          <motion.span
            key={stateIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            style={{ fontSize: 13, fontWeight: 700, color: "#22D3EE" }}
          >
            {AI_STATES[stateIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonBlock key={i} width={i === lines - 1 ? "55%" : `${90 - i * 6}%`} height={12} />
        ))}
      </div>
    </div>
  );
}