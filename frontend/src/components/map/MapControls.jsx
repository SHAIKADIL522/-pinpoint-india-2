// ─────────────────────────────────────────────────────────────
//  PinPoint India — MapControls Component
//  Style switcher + reset to India view
//  Floats over the map, bottom-left position
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
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

  return (
    <div
      style={{
        position: "absolute",
        bottom:   "40px",
        right:    "12px",
        zIndex:   30,
        display:  "flex",
        flexDirection: "column",
        gap:      "6px",
        alignItems: "flex-end",
      }}
    >
      {/* Style picker panel */}
      {open && (
        <div
          style={{
            background:   "var(--surface-1, #1a1a2e)",
            border:       "1px solid var(--border-subtle)",
            borderRadius: "12px",
            padding:      "8px",
            display:      "flex",
            flexDirection: "column",
            gap:          "4px",
            minWidth:     "130px",
            boxShadow:    "0 8px 24px rgba(0,0,0,0.3)",
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
                padding:      "6px 10px",
                borderRadius: "8px",
                border:       "none",
                cursor:       "pointer",
                fontSize:     "12px",
                fontFamily:   "'JetBrains Mono', monospace",
                background:   activeStyle === s.id ? "var(--accent-primary, #f97316)" : "transparent",
                color:        activeStyle === s.id ? "#fff" : "var(--ink-secondary, #94a3b8)",
                transition:   "all 0.15s",
                textAlign:    "left",
              }}
            >
              <span style={{ fontSize: "14px" }}>{s.thumb}</span>
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Style toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Change map style"
        style={{
          width:        "36px",
          height:       "36px",
          borderRadius: "10px",
          background:   "var(--surface-1, #1a1a2e)",
          border:       "1px solid var(--border-subtle)",
          color:        "var(--ink-secondary)",
          cursor:       "pointer",
          fontSize:     "16px",
          display:      "flex",
          alignItems:   "center",
          justifyContent: "center",
          boxShadow:    "0 2px 8px rgba(0,0,0,0.2)",
          transition:   "background 0.15s",
        }}
      >
        🗺️
      </button>

      {/* Reset to India view */}
      <button
        onClick={onResetView}
        title="Reset to India view"
        style={{
          width:        "36px",
          height:       "36px",
          borderRadius: "10px",
          background:   "var(--surface-1, #1a1a2e)",
          border:       "1px solid var(--border-subtle)",
          color:        "var(--ink-secondary)",
          cursor:       "pointer",
          fontSize:     "14px",
          display:      "flex",
          alignItems:   "center",
          justifyContent: "center",
          boxShadow:    "0 2px 8px rgba(0,0,0,0.2)",
          transition:   "background 0.15s",
        }}
      >
        🏠
      </button>
    </div>
  );
}
