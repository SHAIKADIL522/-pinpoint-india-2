// ─────────────────────────────────────────────────────────────
//  PinPoint India — InteractiveMap Component
//  Pure map canvas. Accepts pincode → auto fly-to + marker.
//  No direct MapTiler calls here — all via hooks/services.
//  Safe for Vite (no SSR issues, no dynamic import needed).
// ─────────────────────────────────────────────────────────────

import { useId } from "react";
import { useMap }         from "../../hooks/useMap";
import { usePincodeMap }  from "../../hooks/usePincodeMap";
import MapControls        from "./MapControls";

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
        background:   "var(--surface-2)",
        border:       "1px solid var(--border-subtle)",
      }}
    >
      {/* Map canvas */}
      <div id={containerId} style={{ width: "100%", height: "100%" }} />

      {/* Loading overlay */}
      {!isLoaded && (
        <div
          style={{
            position:       "absolute",
            inset:          0,
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
            gap:            "12px",
            background:     "var(--surface-2)",
            zIndex:         10,
          }}
        >
          <div className="map-spinner" />
          <span
            style={{
              fontSize:    "12px",
              color:       "var(--ink-muted)",
              fontFamily:  "'JetBrains Mono', monospace",
              letterSpacing: "0.05em",
            }}
          >
            Loading map…
          </span>
        </div>
      )}

      {/* Resolving pincode coordinates indicator */}
      {isLoaded && isResolving && (
        <div
          style={{
            position:    "absolute",
            top:         "12px",
            left:        "12px",
            background:  "var(--surface-1)",
            border:      "1px solid var(--border-subtle)",
            borderRadius: "8px",
            padding:     "6px 12px",
            fontSize:    "11px",
            fontFamily:  "'JetBrains Mono', monospace",
            color:       "var(--ink-secondary)",
            zIndex:      20,
            display:     "flex",
            alignItems:  "center",
            gap:         "6px",
          }}
        >
          <span style={{ color: "var(--accent-primary)" }}>●</span>
          Locating {pincode}…
        </div>
      )}

      {/* Geo error badge */}
      {isLoaded && geoError && (
        <div
          style={{
            position:    "absolute",
            top:         "12px",
            left:        "12px",
            background:  "rgba(239,68,68,0.12)",
            border:      "1px solid rgba(239,68,68,0.3)",
            borderRadius: "8px",
            padding:     "6px 12px",
            fontSize:    "11px",
            color:       "#f87171",
            fontFamily:  "'JetBrains Mono', monospace",
            zIndex:      20,
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
        <div
          style={{
            position:    "absolute",
            bottom:      "32px",
            left:        "12px",
            background:  "rgba(0,0,0,0.65)",
            backdropFilter: "blur(8px)",
            borderRadius: "6px",
            padding:     "4px 10px",
            fontSize:    "10px",
            fontFamily:  "'JetBrains Mono', monospace",
            color:       "rgba(255,255,255,0.7)",
            zIndex:      20,
            pointerEvents: "none",
          }}
        >
          {geoResult.coordinates[1].toFixed(4)}°N · {geoResult.coordinates[0].toFixed(4)}°E
        </div>
      )}
    </div>
  );
}
