import React, { useState } from "react";

/**
 * PremiumInput — enterprise text input with optional icon and focus glow.
 *
 * Props: standard <input> props plus
 *  - icon: ReactNode (left-aligned)
 *  - rightAdornment: ReactNode (e.g. "Ctrl + K" badge)
 *  - size: "sm" | "md" | "lg" (default "md")
 */
const SIZES = {
  sm: { height: 38, fontSize: 13 },
  md: { height: 46, fontSize: 14 },
  lg: { height: 58, fontSize: 16 },
};

export default function PremiumInput({
  icon,
  rightAdornment,
  size = "md",
  style = {},
  ...inputProps
}) {
  const [focused, setFocused] = useState(false);
  const sizeStyle = SIZES[size] || SIZES.md;
  const leftPad = icon ? sizeStyle.height * 0.78 : 16;
  const rightPad = rightAdornment ? sizeStyle.height * 1.6 : 16;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {icon && (
        <span style={{
          position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
          color: "#64748B", fontSize: sizeStyle.fontSize + 2, pointerEvents: "none",
          display: "flex", alignItems: "center",
        }}>
          {icon}
        </span>
      )}
      <input
        onFocus={(e) => { setFocused(true); inputProps.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); inputProps.onBlur?.(e); }}
        style={{
          width: "100%",
          height: sizeStyle.height,
          paddingLeft: leftPad,
          paddingRight: rightPad,
          background: "rgba(15,23,42,0.7)",
          border: focused ? "1px solid #22D3EE" : "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          color: "#fff",
          fontSize: sizeStyle.fontSize,
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          outline: "none",
          boxSizing: "border-box",
          backdropFilter: "blur(20px)",
          boxShadow: focused ? "0 0 0 3px rgba(34,211,238,0.12)" : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          ...style,
        }}
        {...inputProps}
      />
      {rightAdornment && (
        <span style={{
          position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
          fontSize: 11, color: "#64748B", fontWeight: 700,
          border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6,
          padding: "3px 8px", letterSpacing: "0.05em", pointerEvents: "none",
        }}>
          {rightAdornment}
        </span>
      )}
    </div>
  );
}