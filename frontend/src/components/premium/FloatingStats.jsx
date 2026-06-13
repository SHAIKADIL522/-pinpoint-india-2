import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { floatingStat, counterEase } from "../../design-system/animations";

function AnimatedNumber({ value, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame;
    const duration = 1200;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return <span ref={ref}>{display.toLocaleString("en-IN")}{suffix}</span>;
}

const STATS = [
  { icon: "📍", value: 700, suffix: "+", label: "Districts" },
  { icon: "🗺️", value: 6000, suffix: "+", label: "Sub Districts" },
  { icon: "📡", value: null, label: "Live DigiPIN Intelligence", live: true },
  { icon: "✨", value: null, label: "AI Location Insights", live: true },
];

export default function FloatingStats() {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ staggerChildren: 0.1 }}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 12,
        maxWidth: 760,
        margin: "32px auto 0",
        position: "relative",
        zIndex: 2,
      }}
    >
      {STATS.map((s, i) => (
        <motion.div
          key={i}
          variants={floatingStat}
          whileHover="hover"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 18px",
            borderRadius: 16,
            background: "rgba(15,23,42,0.6)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div style={{ fontSize: 22 }}>{s.icon}</div>
          <div style={{ textAlign: "left" }}>
            {s.live ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 800, color: "#fff" }}>
                <span style={{
                  width: 7, height: 7, borderRadius: "50%", background: "#10B981",
                  boxShadow: "0 0 8px #10B981", display: "inline-block",
                }} />
                Live
              </div>
            ) : (
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>
                <AnimatedNumber value={s.value} suffix={s.suffix} />
              </div>
            )}
            <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600 }}>{s.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}