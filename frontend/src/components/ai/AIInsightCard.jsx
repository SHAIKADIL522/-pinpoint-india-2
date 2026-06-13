import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLocationInsight } from "../../services/aiService";
import GlassCard from "../ui/GlassCard";
import PremiumButton from "../ui/PremiumButton";
import AISkeleton from "../ui/AISkeleton";

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

  if (!generated && !loading && !error) {
    return (
      <GlassCard padding={20}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 16 }}>✨</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                AI Area Insights
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>
              Get AI-powered facts about {district}, {state}
            </div>
          </div>
          <PremiumButton size="sm" onClick={generate} icon={<span>✨</span>}>
            Generate
          </PremiumButton>
        </div>
      </GlassCard>
    );
  }

  if (loading) {
    return (
      <GlassCard padding={20}>
        <AISkeleton lines={3} />
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard padding={20} style={{ border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)" }}>
        <div style={{ fontSize: 13, color: "#FCA5A5", marginBottom: 8 }}>
          ⚠️ {error}
        </div>
        <PremiumButton variant="ghost" size="sm" onClick={generate}>
          ↻ Try again
        </PremiumButton>
      </GlassCard>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard padding={20}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{
            fontSize: 11, color: "#22D3EE", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            ✨ AI Area Insights · {district}
          </div>
          <PremiumButton variant="ghost" size="sm" onClick={generate}>
            ↻ Regenerate
          </PremiumButton>
        </div>
        <p style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.75, margin: 0 }}>
          {insight}
        </p>
      </GlassCard>
    </motion.div>
  );
}