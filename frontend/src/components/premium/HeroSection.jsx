import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { POPULAR_PINCODES } from "../../utils/constants";
import { heroFadeUp, heroStagger } from "../../design-system/animations";
import FloatingStats from "./FloatingStats";

const HERO_VIDEO_URL =
  "https://res.cloudinary.com/dfonotyfb/video/upload/v1775585556/dds3_1_rqhg7x.mp4";

export default function HeroSection() {
  const [pin, setPin] = useState("");
  const [videoFailed, setVideoFailed] = useState(false);
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    const p = pin.trim();
    if (/^\d{6}$/.test(p)) navigate(`/?pin=${p}`);
  }

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "94vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 24px 60px",
        background: "#020617",
      }}
    >
      {!videoFailed && (
        <video
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoFailed(true)}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", zIndex: 0,
          }}
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
      )}

      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        background: videoFailed
          ? "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,211,238,0.10) 0%, transparent 60%), #020617"
          : "transparent",
      }} />

      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "rgba(2,6,23,0.7)",
      }} />
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(180deg, rgba(2,6,23,0.2) 0%, rgba(2,6,23,0.6) 55%, #020617 100%)",
      }} />

      <motion.div
        initial="initial" animate="animate" variants={heroStagger}
        style={{
          position: "relative", zIndex: 2, textAlign: "center",
          maxWidth: 900, width: "100%",
        }}
      >
        <motion.div
          variants={heroFadeUp}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 18px", borderRadius: 999, marginBottom: 28,
            background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.25)",
            color: "#22D3EE", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
          }}
        >
          ✦ India's Most Advanced Location Intelligence Platform
        </motion.div>

        <motion.h1
          variants={heroFadeUp}
          style={{
            fontFamily: "var(--font-display)", fontWeight: 800, lineHeight: 1.05,
            fontSize: "clamp(40px, 6vw, 72px)", marginBottom: 20, color: "#fff",
            letterSpacing: "-0.02em",
          }}
        >
          India's AI-Powered<br />
          <span style={{
            background: "linear-gradient(135deg, #22D3EE 0%, #10B981 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Location Intelligence Platform
          </span>
        </motion.h1>

        <motion.p
          variants={heroFadeUp}
          style={{
            color: "#94A3B8", fontSize: "clamp(15px, 1.6vw, 19px)", lineHeight: 1.6,
            maxWidth: 640, margin: "0 auto 36px",
          }}
        >
          Explore districts, mandals, villages, DigiPINs, weather intelligence,
          AI insights and geospatial analytics across India.
        </motion.p>

        <motion.form
          variants={heroFadeUp}
          onSubmit={handleSearch}
          style={{
            display: "flex", gap: 10, maxWidth: 620, margin: "0 auto",
            position: "relative",
          }}
        >
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{
              position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)",
              color: "#64748B", fontSize: 17,
            }}>🔍</span>
            <input
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Search any location in India..."
              inputMode="numeric" maxLength={6}
              style={{
                width: "100%", height: 58, paddingLeft: 50, paddingRight: 90,
                background: "rgba(15,23,42,0.7)", border: "1px solid rgba(34,211,238,0.25)",
                borderRadius: 14, color: "#fff", fontSize: 16, fontFamily: "var(--font-body)",
                fontWeight: 600, outline: "none", boxSizing: "border-box",
                backdropFilter: "blur(20px)",
              }}
            />
            <span style={{
              position: "absolute", right: 70, top: "50%", transform: "translateY(-50%)",
              fontSize: 11, color: "#64748B", fontWeight: 700, border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 6, padding: "3px 8px", letterSpacing: "0.05em",
            }}>
              Ctrl + K
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            type="submit"
            style={{
              width: 58, height: 58, borderRadius: 14, flexShrink: 0,
              background: "linear-gradient(135deg, #22D3EE 0%, #10B981 100%)",
              border: "none", color: "#020617", fontSize: 20, fontWeight: 800,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            →
          </motion.button>
        </motion.form>

        <motion.div
          variants={heroFadeUp}
          style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 16 }}
        >
          <span style={{ fontSize: 12, color: "#64748B", fontWeight: 600, alignSelf: "center", marginRight: 4 }}>
            Try:
          </span>
          {POPULAR_PINCODES.slice(0, 2).map(({ pin: p, label }) => (
            <button key={p} onClick={() => navigate(`/?pin=${p}`)}
              style={{
                padding: "5px 14px", borderRadius: 8,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#94A3B8", fontSize: 12, fontWeight: 600, cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              {label}
            </button>
          ))}
          <button onClick={() => navigate("/?pin=560001")}
            style={{
              padding: "5px 14px", borderRadius: 8,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#94A3B8", fontSize: 12, fontWeight: 600, cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            560001
          </button>
          <button
            style={{
              padding: "5px 14px", borderRadius: 8,
              background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)",
              color: "#22D3EE", fontSize: 12, fontWeight: 600, cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            DigiPIN
          </button>
        </motion.div>

        <FloatingStats />
      </motion.div>
    </div>
  );
}