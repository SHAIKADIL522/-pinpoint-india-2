import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

/**
 * PremiumModal — glass modal with backdrop blur, escape-to-close.
 *
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - title: string (optional)
 *  - children
 *  - maxWidth: number (default 480)
 */
export default function PremiumModal({ open, onClose, title, children, maxWidth = 480 }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(2,6,23,0.7)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxWidth,
              background: "rgba(15,23,42,0.85)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: 24,
              backdropFilter: "blur(24px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          >
            {title && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 16,
              }}>
                <h3 style={{
                  fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800,
                  color: "#fff", margin: 0,
                }}>
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  style={{
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8, width: 32, height: 32, color: "#94A3B8",
                    fontSize: 16, cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}