import React from "react";
import { motion } from "framer-motion";
import { glassEntrance } from "../../design-system/animations";

/**
 * GlassCard — base glassmorphism container used across premium UI.
 *
 * Props:
 *  - children
 *  - hover: enable lift-on-hover (default true)
 *  - padding: number | string (default 20)
 *  - style: extra style overrides
 *  - as: motion element wrapper (default motion.div)
 *  - onClick
 */
export default function GlassCard({
  children,
  hover = true,
  padding = 20,
  style = {},
  className = "",
  onClick,
  ...rest
}) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={glassEntrance}
      whileHover={hover ? { y: -3, transition: { duration: 0.2 } } : undefined}
      onClick={onClick}
      className={className}
      style={{
        background: "rgba(15,23,42,0.6)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}