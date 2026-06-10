import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLocationInsight } from "../../services/aiService";

export default function AIInsightCard({
  pincode,
  district,
  state,
  postOfficeCount,
}) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    setInsight(null);
    setError(null);
    setGenerated(false);
  }, [pincode]);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const data = await getLocationInsight({
        pincode,
        district,
        state,
        postOfficeCount,
      });
      setInsight(data.insight);
      setGenerated(true);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "AI insight unavailable. Check OPENROUTER_API_KEY in backend .env",
      );
    } finally {
      setLoading(false);
    }
  }

  const cardBase = {
    padding: 20,
    borderRadius: 14,
    background:
      "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(15,22,41,0.8) 100%)",
    border: "1px solid rgba(99,102,241,0.2)",
  };

  if (!generated && !loading)
    return (
      <div style={cardBase}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 16 }}>✨</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#a5b4fc" }}>
                AI Area Insights
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              Get AI-powered facts about {district}, {state}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={generate}
            style={{
              padding: "9px 18px",
              borderRadius: 10,
              cursor: "pointer",
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(99,102,241,0.15))",
              border: "1px solid rgba(99,102,241,0.4)",
              color: "#a5b4fc",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              boxShadow: "0 0 20px rgba(99,102,241,0.15)",
            }}
          >
            Generate ✨
          </motion.button>
        </div>
      </div>
    );

  if (loading)
    return (
      <div style={cardBase}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#a5b4fc",
            fontSize: 13,
          }}
        >
          <div style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#6366f1",
                  animation: `bounce 1.2s ease ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          Generating insights for {district}…
        </div>
        <style>{`@keyframes bounce{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}`}</style>
      </div>
    );

  if (error)
    return (
      <div
        style={{
          ...cardBase,
          background: "rgba(239,68,68,0.06)",
          border: "1px solid rgba(239,68,68,0.2)",
        }}
      >
        <div style={{ fontSize: 13, color: "#fca5a5", marginBottom: 8 }}>
          ⚠️ {error}
        </div>
        <button
          onClick={generate}
          style={{
            fontSize: 12,
            color: "#93c5fd",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ↻ Try again
        </button>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={cardBase}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#a5b4fc",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          ✨ AI Area Insights · {district}
        </div>
        <button
          onClick={generate}
          style={{
            fontSize: 11,
            color: "#6366f1",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          ↻ Regenerate
        </button>
      </div>
      <p
        style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.75, margin: 0 }}
      >
        {insight}
      </p>
    </motion.div>
  );
}
