/// <reference types="vite/client" />
// ─────────────────────────────────────────────────────────────
//  PinPoint India — Feature Flags  (FIXED)
//  Fix: isEnabled reads env at CALL TIME not module load time
//  Prevents race condition where FEATURES object is frozen before
//  Vite injects env vars into import.meta.env
// ─────────────────────────────────────────────────────────────

export type FeatureKey = "MAPS" | "AI";

/** Always reads live from import.meta.env — never stale */
export function isEnabled(feature: FeatureKey): boolean {
  switch (feature) {
    case "MAPS":
      return import.meta.env.VITE_FEATURE_MAPS === "true";
    case "AI":
      return import.meta.env.VITE_FEATURE_AI !== "false";
    default:
      return false;
  }
}

// Keep FEATURES export for any code that imports it directly
export const FEATURES = {
  get MAPS() { return isEnabled("MAPS"); },
  get AI()   { return isEnabled("AI");  },
} as const;
