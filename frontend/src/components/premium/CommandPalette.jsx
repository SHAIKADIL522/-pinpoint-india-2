import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { POPULAR_PINCODES } from "../../utils/constants";

/**
 * CommandPalette — Ctrl+K search command center.
 *
 * Implemented with plain React (no `cmdk` dependency) to avoid adding new
 * packages. Listens globally for Ctrl/Cmd+K to open, navigates to "/" with
 * ?pin=XXXXXX for 6-digit pincodes (matches existing SearchPage behavior),
 * and surfaces popular pincodes / quick links. No backend or service changes.
 *
 * Mount this once near the app root (e.g. in App.jsx or Navbar.jsx).
 */
const QUICK_LINKS = [
  { label: "Dashboard", path: "/dashboard", icon: "📊" },
  { label: "Favorites", path: "/favorites", icon: "⭐" },
  { label: "Search", path: "/", icon: "🔍" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Global Ctrl/Cmd+K listener
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const trimmed = query.trim();
  const isPincode = /^\d{1,6}$/.test(trimmed);
  const isCoords = /^-?\d+\.\d+\s*,\s*-?\d+\.\d+$/.test(trimmed);

  const filteredPincodes = POPULAR_PINCODES.filter(p =>
    !trimmed ||
    p.pin.startsWith(trimmed) ||
    p.label.toLowerCase().includes(trimmed.toLowerCase())
  ).slice(0, 5);

  const filteredLinks = QUICK_LINKS.filter(l =>
    !trimmed || l.label.toLowerCase().includes(trimmed.toLowerCase())
  );

  // Build flat results list for keyboard navigation
  const results = [];
  if (isPincode && trimmed.length === 6) {
    results.push({ type: "action", label: `Search pincode ${trimmed}`, icon: "📮", action: () => goToPin(trimmed) });
  }
  if (isCoords) {
    results.push({ type: "action", label: `Go to coordinates ${trimmed}`, icon: "📍", action: () => goToCoords(trimmed) });
  }
  filteredPincodes.forEach(p => results.push({ type: "pincode", label: p.label, sub: p.pin, icon: "📌", action: () => goToPin(p.pin) }));
  filteredLinks.forEach(l => results.push({ type: "link", label: l.label, icon: l.icon, action: () => navigate(l.path) }));

  function goToPin(pin) {
    navigate(`/?pin=${pin}`);
    setOpen(false);
  }

  function goToCoords(coords) {
    const [lat, lon] = coords.split(",").map(s => s.trim());
    navigate(`/?lat=${lat}&lon=${lon}`);
    setOpen(false);
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[activeIndex]?.action();
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 2000,
            background: "rgba(2,6,23,0.7)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "flex-start", justifyContent: "center",
            paddingTop: "12vh",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 600,
              background: "rgba(15,23,42,0.92)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              backdropFilter: "blur(24px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              overflow: "hidden",
            }}
          >
            {/* Search input */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              <span style={{ fontSize: 18, color: "#64748B" }}>🔍</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Search pincode, district, coordinates, or page..."
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: "#fff", fontSize: 15, fontFamily: "var(--font-body)", fontWeight: 500,
                }}
              />
              <span style={{
                fontSize: 11, color: "#64748B", fontWeight: 700,
                border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "3px 8px",
              }}>
                ESC
              </span>
            </div>

            {/* Results */}
            <div style={{ maxHeight: 360, overflowY: "auto", padding: 8 }}>
              {results.length === 0 && (
                <div style={{ padding: "24px 16px", textAlign: "center", color: "#64748B", fontSize: 13 }}>
                  No results. Try a 6-digit pincode or "lat, lon".
                </div>
              )}
              {results.map((r, i) => (
                <div
                  key={`${r.type}-${r.label}-${i}`}
                  onClick={r.action}
                  onMouseEnter={() => setActiveIndex(i)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                    background: i === activeIndex ? "rgba(34,211,238,0.1)" : "transparent",
                    border: i === activeIndex ? "1px solid rgba(34,211,238,0.2)" : "1px solid transparent",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{r.icon}</span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#fff" }}>{r.label}</span>
                  {r.sub && <span style={{ fontSize: 12, color: "#64748B" }}>{r.sub}</span>}
                </div>
              ))}
            </div>

            {/* Footer hint */}
            <div style={{
              display: "flex", gap: 16, padding: "10px 18px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              fontSize: 11, color: "#64748B", fontWeight: 600,
            }}>
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}