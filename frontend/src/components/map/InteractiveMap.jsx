// ─────────────────────────────────────────────────────────────
//  PinPoint India — InteractiveMap Component
//  Pure map canvas. Accepts pincode → auto fly-to + marker.
//  No direct MapTiler calls here — all via hooks/services.
//  Safe for Vite (no SSR issues, no dynamic import needed).
//  Premium UI pass: glass container, MapSkeleton loading state,
//  enterprise overlay badges. Map/hooks logic untouched.
// ─────────────────────────────────────────────────────────────

import { useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMap }         from "../../hooks/useMap";
import { usePincodeMap }  from "../../hooks/usePincodeMap";
import MapControls        from "./MapControls";
import MapSkeleton        from "../ui/MapSkeleton";

/**
 * @param {Object}   props
 * @param {string}   [props.pincode]       - 6-digit pincode to fly to
 * @param {string}   [props.label]         - Popup label (e.g. district name)
 * @param {string}   [props.className]     - Extra CSS class
 * @param {string}   [props.height]        - CSS height, default "400px"
 * @param {Function} [props.onMapClick]    - Callback (lng, lat) on map click
 * @param {boolean}  [props.showControls]  - Show style switcher, default true
 */
export default function InteractiveMap({
  pincode,
  label,
  className = "",
  height = "400px",
  onMapClick,
  showControls = true,
}) {
  // Unique container ID per instance (supports multiple maps on same page)
  const uid = useId().replace(/:/g, "");
  const containerId = `pinpoint-map-${uid}`;

  const { mapRef, isLoaded, flyTo, setStyle, fitIndia } = useMap({
    containerId,
    initialStyle: "streets-v2",
    onMapClick,
  });

  const { geoResult, isResolving, geoError } = usePincodeMap({
    pincode,
    mapRef,
    isLoaded,
    label,
  });

  return (
    <div
      className={`pinpoint-map-wrapper ${className}`}
      style={{
        position:     "relative",
        borderRadius: "16px",
        overflow:     "hidden",
        height,
        background:   "rgba(15,23,42,0.6)",
        border:       "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Map canvas */}
      <div id={containerId} style={{ width: "100%", height: "100%" }} />

      {/* Loading state */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            style={{ position: "absolute", inset: 0, zIndex: 10 }}
          >
            <MapSkeleton height="100%" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resolving pincode coordinates indicator */}
      {isLoaded && isResolving && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{
            position:    "absolute",
            top:         "12px",
            left:        "12px",
            background:  "rgba(15,23,42,0.8)",
            border:      "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            padding:     "6px 12px",
            fontSize:    "11px",
            fontFamily:  "var(--font-body)",
            fontWeight:  600,
            color:       "#94A3B8",
            zIndex:      20,
            display:     "flex",
            alignItems:  "center",
            gap:         "8px",
            backdropFilter: "blur(12px)",
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ color: "#22D3EE", fontSize: 10 }}
          >●</motion.span>
          Locating {pincode}…
        </motion.div>
      )}

      {/* Geo error badge */}
      {isLoaded && geoError && (
        <div
          style={{
            position:    "absolute",
            top:         "12px",
            left:        "12px",
            background:  "rgba(239,68,68,0.1)",
            border:      "1px solid rgba(239,68,68,0.25)",
            borderRadius: "8px",
            padding:     "6px 12px",
            fontSize:    "11px",
            fontWeight:  600,
            color:       "#f87171",
            fontFamily:  "var(--font-body)",
            zIndex:      20,
            backdropFilter: "blur(12px)",
          }}
        >
          ⚠ Could not locate pincode on map
        </div>
      )}

      {/* Style switcher controls */}
      {isLoaded && showControls && (
        <MapControls
          onStyleChange={setStyle}
          onResetView={fitIndia}
        />
      )}

      {/* Coordinates badge (when geo resolved) */}
      {isLoaded && geoResult?.found && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          style={{
            position:    "absolute",
            bottom:      "32px",
            left:        "12px",
            background:  "rgba(15,23,42,0.8)",
            backdropFilter: "blur(12px)",
            border:      "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            padding:     "5px 12px",
            fontSize:    "11px",
            fontWeight:  600,
            fontFamily:  "var(--font-body)",
            color:       "#94A3B8",
            zIndex:      20,
            pointerEvents: "none",
          }}
        >
          📍 {geoResult.coordinates[1].toFixed(4)}°N · {geoResult.coordinates[0].toFixed(4)}°E
        </motion.div>
      )}
    </div>
  );
}