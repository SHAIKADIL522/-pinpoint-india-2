import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { relativeTime } from "../../utils/helpers";

export default function RecentSearches({ history, onSelect, onClear }) {
  if (!history.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      style={{
        background: "rgba(10,14,26,0.98)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 14, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        maxHeight: 320, overflowY: "auto",
      }}
    >
      <div style={{
        padding: "10px 16px 6px", display: "flex", justifyContent: "space-between",
        alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Recent Searches
        </span>
        <button onClick={onClear} style={{
          fontSize: 11, color: "#3b82f6", background: "none", border: "none", cursor: "pointer",
        }}>Clear All</button>
      </div>
      {history.map((item) => (
        <button key={item.pincode} onClick={() => onSelect(item.pincode)}
          style={{
            width: "100%", padding: "10px 16px", background: "none", border: "none",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s",
            textAlign: "left",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14 }}>🕐</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#f0f4ff" }}>{item.pincode}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{item.district}, {item.state}</div>
            </div>
          </div>
          <span style={{ fontSize: 11, color: "#475569" }}>{relativeTime(item.searchedAt)}</span>
        </button>
      ))}
    </motion.div>
  );
}
