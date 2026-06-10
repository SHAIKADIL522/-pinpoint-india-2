// ─────────────────────────────────────────────────────────────
//  PinPoint India — Map Style Factory  (FIXED)
//  Fix: lazy style URL evaluation — no module-load-time side effects
// ─────────────────────────────────────────────────────────────

import type { MapStyleOption, MapConfig } from "./types";
import { getStyleUrl } from "./map.provider";

export type StyleId = "streets-v2" | "satellite" | "hybrid" | "topo-v2" | "backdrop" | "dataviz";

// ← FIXED: function not called at module init — called when first used
export const MAP_STYLES: MapStyleOption[] = [
  { id: "streets-v2", label: "Streets",   url: "", thumb: "🗺️" },
  { id: "satellite",  label: "Satellite", url: "", thumb: "🛰️" },
  { id: "hybrid",     label: "Hybrid",    url: "", thumb: "🌍" },
  { id: "topo-v2",    label: "Topo",      url: "", thumb: "⛰️" },
];

export function getMapStyleUrl(styleId: StyleId = "streets-v2"): string {
  return getStyleUrl(styleId); // called lazily at render time — env always ready
}

// Lazy getter — called after env is loaded, never at module init
export function getIndiaMapConfig(): MapConfig {
  return {
    center:  [78.9629, 20.5937],
    zoom:    4.5,
    minZoom: 3,
    maxZoom: 18,
    style:   getMapStyleUrl("streets-v2"),
    bounds:  [[68.7, 8.4], [97.4, 37.6]],
  };
}

// Kept as const for import compatibility — safe because useMap calls getIndiaMapConfig() lazily
export const INDIA_MAP_CONFIG: MapConfig = {
  center:  [78.9629, 20.5937],
  zoom:    4.5,
  minZoom: 3,
  maxZoom: 18,
  style:   "", // ← empty string safe — useMap uses getMapStyleUrl() directly
  bounds:  [[68.7, 8.4], [97.4, 37.6]],
};

export const PINCODE_ZOOM = 11;
