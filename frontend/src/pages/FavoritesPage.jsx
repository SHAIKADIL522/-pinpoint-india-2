import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "../hooks/useFavorites";
import { pageVariants } from "../animations/pageVariants";
import { cardVariants } from "../animations/cardVariants";
import { STATE_EMOJIS } from "../utils/constants";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate"
      style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px" }}
    >
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
          ⭐ Favorites
        </h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>
          {favorites.length === 0 ? "No saved pincodes yet." : `${favorites.length} saved location${favorites.length > 1 ? "s" : ""}`}
        </p>
      </div>

      {favorites.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: "center", padding: "60px 20px", borderRadius: 16,
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          }}>
          <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.3 }}>⭐</div>
          <div style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>Star pincodes from search results to save them here</div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/")}
            style={{
              padding: "10px 24px", borderRadius: 10,
              background: "linear-gradient(135deg,#3b82f6,#6366f1)",
              border: "none", color: "#fff", cursor: "pointer",
              fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14,
            }}>
            🔍 Search Pincodes
          </motion.button>
        </motion.div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <AnimatePresence>
            {favorites.map((fav) => {
              const emoji = STATE_EMOJIS[fav.state] || "📍";
              return (
                <motion.div key={fav.pincode} variants={cardVariants} initial="initial" animate="animate" exit={{ opacity: 0, x: -20 }}
                  style={{
                    padding: "18px 22px", borderRadius: 16,
                    background: "rgba(15,22,41,0.7)", border: "1px solid rgba(255,255,255,0.07)",
                    backdropFilter: "blur(20px)", display: "flex", alignItems: "center",
                    justifyContent: "space-between", cursor: "pointer",
                  }}
                  whileHover={{ borderColor: "rgba(59,130,246,0.3)" }}
                  onClick={() => navigate(`/?pin=${fav.pincode}`)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 32 }}>{emoji}</span>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--font-display)", color: "#93c5fd" }}>{fav.pincode}</span>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{fav.district}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        {fav.state} · {fav.postOfficeCount} post office{fav.postOfficeCount !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={e => { e.stopPropagation(); navigate(`/?pin=${fav.pincode}`); }}
                      style={{
                        padding: "7px 16px", borderRadius: 9,
                        background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
                        color: "#93c5fd", cursor: "pointer", fontSize: 13, fontWeight: 600,
                        fontFamily: "var(--font-body)",
                      }}>
                      View
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={e => { e.stopPropagation(); removeFavorite(fav.pincode); }}
                      style={{
                        width: 34, height: 34, borderRadius: 9,
                        background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)",
                        color: "#fca5a5", cursor: "pointer", fontSize: 15,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                      ×
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
