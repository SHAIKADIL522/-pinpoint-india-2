import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getNearbyPlaces, PLACE_CATEGORIES } from "../../services/mapService";

export default function NearbyPlaces({ lat, lon }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    if (!lat || !lon) return;
    setLoading(true);
    getNearbyPlaces(lat, lon, "all")
      .then(setPlaces)
      .catch(() => setPlaces([]))
      .finally(() => setLoading(false));
  }, [lat, lon]);

  const filtered = activeCategory === "all"
    ? places
    : places.filter(p => p.type === activeCategory);

  const typeIcon = (type) => {
    const map = { hospital: "🏥", railway: "🚆", airport: "✈️", bus: "🚌", attraction: "🗺️" };
    return map[type] || "📍";
  };

  return (
    <div style={{
      padding: 20, borderRadius: 14,
      background: "rgba(15,22,41,0.6)", border: "1px solid rgba(255,255,255,0.07)",
    }}>
      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
        📍 Nearby Places
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {PLACE_CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
            padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
            cursor: "pointer", border: "1px solid",
            background: activeCategory === cat.id ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.03)",
            borderColor: activeCategory === cat.id ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.08)",
            color: activeCategory === cat.id ? "#93c5fd" : "#64748b",
            transition: "all 0.2s", fontFamily: "var(--font-body)",
          }}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ color: "#475569", fontSize: 13, padding: "12px 0" }}>Loading nearby places…</div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ color: "#475569", fontSize: 13, padding: "12px 0" }}>
          No {activeCategory === "all" ? "" : activeCategory} places found nearby.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((place, i) => (
            <motion.div key={place.name + i}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ delay: i * 0.04 }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px", borderRadius: 10,
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                }}>
                  {typeIcon(place.type)}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{place.name}</div>
                  <div style={{ fontSize: 11, color: "#64748b", textTransform: "capitalize" }}>{place.type}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#3b82f6", fontWeight: 600 }}>{place.distance} km</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
