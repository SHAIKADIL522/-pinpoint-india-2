import React from "react";
import { motion } from "framer-motion";

/**
 * PremiumButton — enterprise button with primary/secondary/ghost variants.
 *
 * Props:
 *  - variant: "primary" | "secondary" | "ghost" | "danger" (default "primary")
 *  - size: "sm" | "md" | "lg" (default "md")
 *  - icon: ReactNode (optional, rendered before children)
 *  - fullWidth: boolean
 *  - disabled, onClick, type, style
 */
const VARIANTS = {
  primary: {
    background: "linear-gradient(135deg, #22D3EE 0%, #10B981 100%)",
    color: "#020617",
    border: "none",
  },
  secondary: {
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  ghost: {
    background: "transparent",
    color: "#94A3B8",
    border: "1px solid transparent",
  },
  danger: {
    background: "rgba(239,68,68,0.1)",
    color: "#F87171",
    border: "1px solid rgba(239,68,68,0.3)",
  },
};

const SIZES = {
  sm: { height: 36, padding: "0 14px", fontSize: 13 },
  md: { height: 44, padding: "0 20px", fontSize: 14 },
  lg: { height: 52, padding: "0 28px", fontSize: 15 },
};

export default function PremiumButton({
  children,
  variant = "primary",
  size = "md",
  icon,
  fullWidth = false,
  disabled = false,
  onClick,
  type = "button",
  style = {},
}) {
  const variantStyle = VARIANTS[variant] || VARIANTS.primary;
  const sizeStyle = SIZES[size] || SIZES.md;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.02, filter: "brightness(1.08)" }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        borderRadius: 10, fontWeight: 700, fontFamily: "var(--font-body)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? "100%" : "auto",
        transition: "background 0.2s, border-color 0.2s",
        ...sizeStyle,
        ...variantStyle,
        ...style,
      }}
    >
      {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
      {children}
    </motion.button>
  );
}