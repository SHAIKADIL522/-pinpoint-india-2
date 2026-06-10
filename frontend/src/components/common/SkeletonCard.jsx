import React from "react";
import { motion } from "framer-motion";

const Sk = ({ w, h = 14, mb = 0, mt = 0 }) => (
  <div style={{
    width: w, height: h, borderRadius: 7, marginBottom: mb, marginTop: mt,
    background: "linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%)",
    backgroundSize: "800px 100%",
    animation: "shimmer 1.6s infinite",
  }} />
);

export default function SkeletonCard() {
  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}`}</style>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
        padding: 28, borderRadius: 16,
        background: "rgba(15,22,41,0.7)", border: "1px solid rgba(255,255,255,0.07)",
      }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20 }}>
          <Sk w={52} h={52} />
          <div><Sk w={160} h={22} mb={8} /><Sk w={100} h={14} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ padding: 14, borderRadius: 10, background: "rgba(255,255,255,0.02)" }}>
              <Sk w="50%" h={10} mb={6} />
              <Sk w="80%" h={14} />
            </div>
          ))}
        </div>
        <Sk w="100%" h={120} mt={0} />
        <Sk w="100%" h={100} mt={12} />
      </motion.div>
    </>
  );
}
