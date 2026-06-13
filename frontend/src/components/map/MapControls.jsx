// ─────────────────────────────────────────────────────────────
//  PinPoint India — MapControls Component
//  Style switcher + reset to India view
//  Floats over the map, bottom-right position
//  Premium UI pass: glass panel + buttons. Logic unchanged.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MAP_STYLES } from "../../services/maps/map.style";

/**
 * @param {Object}   props
 * @param {Function} props.onStyleChange   - (styleId: string) => void
 * @param {Function} props.onResetView     - () => void
 */
export default function MapControls({ onStyleChange, onResetView }) {
  const [activeStyle, setActiveStyle] = useState("streets-v2");
  const [open, setOpen] = useState(false);

  const handleStyle = (styleId) => {
    setActiveStyle(styleId);
    onStyleChange?.(styleId);
    setOpen(false);
  };

  const buttonStyle = {
    width: 36, height: 36, borderRadius: 10,
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#94A3B8",
    cursor: "pointer",
    fontSize: 15,
    display: "flex", alignItems: "center", justifyContent: "center",
    backdropFilter: "blur(12px)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom:   "40px",
        right:    "12px",
        zIndex:   30,
        display:  "flex",
        flexDirection: "column",
        gap:      "8px",
        alignItems: "flex-end",
      }}
    >
      {/* Style picker panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            style={{
              background:   "rgba(15,23,42,0.85)",
              border:       "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding:      "8px",
              display:      "flex",
              flexDirection: "column",
              gap:          "4px",
              minWidth:     "140px",
              backdropFilter: "blur(16px)",
              boxShadow:    "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            {MAP_STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => handleStyle(s.id)}
                style={{
                  display:      "flex",
                  alignItems:   "center",
                  gap:          "8px",
                  padding:      "7px 10px",
                  borderRadius: "8px",
                  border:       "none",
                  cursor:       "pointer",
                  fontSize:     "12px",
                  fontWeight:   600,
                  fontFamily:   "var(--font-body)",
                  background:   activeStyle === s.id ? "linear-gradient(135deg, #22D3EE 0%, #10B981 100%)" : "transparent",
                  color:        activeStyle === s.id ? "#020617" : "#94A3B8",
                  transition:   "all 0.15s",
                  textAlign:    "left",
                }}
              >
                <span style={{ fontSize: "14px" }}>{s.thumb}</span>
                {s.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Style toggle button */}
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        title="Change map style"
        style={buttonStyle}
      >
        🗺️
      </motion.button>

      {/* Reset to India view */}
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={onResetView}
        title="Reset to India view"
        style={buttonStyle}
      >
        🏠
      </motion.button>
    </div>
  );
}