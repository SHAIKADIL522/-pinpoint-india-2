import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLocationInsight } from "../../services/aiService";
import GlassCard from "../ui/GlassCard";
import PremiumButton from "../ui/PremiumButton";
import AISkeleton from "../ui/AISkeleton";

/**
 * AISummaryPanel — premium presentation layer around the existing
 * getLocationInsight() AI service. Logic untouched; only styling,
 * loading states, and layout are new.
 *
 * Props:
 *  - pincode, district, state, postOfficeCount: passed straight to aiService
 *  - autoGenerate: boolean — fetch on mount (default false, matches existing UX)
 */
export default function AISummaryPanel({ pincode, district, state, postOfficeCount, autoGenerate = false }) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    setInsight(null);
    setError(null);
    setGenerated(false);
    if (autoGenerate && pincode) generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pincode]);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const data = await getLocationInsight({ pincode, district, state, postOfficeCount });
      setInsight(data.insight);
      setGenerated(true);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.message ||
        "AI insight unavailable. Check OPENROUTER_API_KEY in backend .env"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassCard padding={20} style={{ position: "relative", overflow: "hidden" }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: -40, right: -40, width: 140, height: 140,
        background: "radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>✨</span>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#fff", margin: 0 }}>
            AI Summary
          </h3>
        </div>
        {generated && !loading && (
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
            color: "#10B981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
            borderRadius: 999, padding: "3px 10px",
          }}>
            Generated
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AISkeleton lines={4} />
          </motion.div>
        )}

        {!loading && error && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ fontSize: 13, color: "#F59E0B", lineHeight: 1.6 }}
          >
            ⚠ {error}
            <div style={{ marginTop: 12 }}>
              <PremiumButton variant="secondary" size="sm" onClick={generate}>Retry</PremiumButton>
            </div>
          </motion.div>
        )}

        {!loading && !error && insight && (
          <motion.div key="insight" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ fontSize: 13.5, color: "#CBD5E1", lineHeight: 1.7 }}
          >
            {insight}
          </motion.div>
        )}

        {!loading && !error && !insight && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 14, lineHeight: 1.6 }}>
              Generate an AI-powered cultural and geographic report for this location.
            </p>
            <PremiumButton onClick={generate} icon={<span>✨</span>}>
              Generate Detailed Report
            </PremiumButton>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}