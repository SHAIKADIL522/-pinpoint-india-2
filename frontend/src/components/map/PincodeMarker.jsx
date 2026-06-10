// ─────────────────────────────────────────────────────────────
//  PinPoint India — PincodeMarker Component
//  Adds a single styled pincode marker to a live map
//  Used when you need one marker without full MarkerLayer
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";

/**
 * @param {Object}         props
 * @param {import('maplibre-gl').Map|null} props.map
 * @param {[number,number]} props.coordinates - [lng, lat]
 * @param {string}         props.pincode
 * @param {string}         [props.district]
 * @param {string}         [props.state]
 * @param {boolean}        [props.openPopup]   - auto-open popup, default true
 */
export default function PincodeMarker({
  map,
  coordinates,
  pincode,
  district = "",
  state = "",
  openPopup = true,
}) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map || !coordinates) return;

    import("maplibre-gl").then(({ default: maplibregl }) => {
      // Remove previous
      markerRef.current?.remove();

      const el = document.createElement("div");
      el.style.cssText = `
        width:44px; height:44px; cursor:pointer;
        display:flex; align-items:center; justify-content:center;
      `;
      el.innerHTML = `
        <div style="
          width:40px; height:40px;
          background:var(--accent-primary, #f97316);
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 4px 18px rgba(249,115,22,0.55);
          border:3px solid #fff;
          display:flex; align-items:center; justify-content:center;
        ">
          <span style="
            transform:rotate(45deg);
            font-size:11px; font-weight:800;
            color:#fff;
            font-family:'JetBrains Mono',monospace;
            letter-spacing:-0.5px;
          ">${pincode.slice(-3)}</span>
        </div>
      `;

      const locationLine = [district, state].filter(Boolean).join(", ");
      const popup = new maplibregl.Popup({
        offset:      [0, -36],
        closeButton: false,
        maxWidth:    "220px",
        className:   "pinpoint-map-popup",
      }).setHTML(`
        <div style="
          font-family:'JetBrains Mono',monospace;
          padding:10px 12px;
          background:var(--surface-1,#1a1a2e);
          border-radius:10px;
          color:var(--ink-primary,#e2e8f0);
          min-width:160px;
        ">
          <div style="
            font-size:20px; font-weight:800;
            color:var(--accent-primary,#f97316);
            letter-spacing:0.08em;
            line-height:1;
          ">${pincode}</div>
          ${locationLine ? `
            <div style="
              font-size:11px;
              color:var(--ink-muted,#64748b);
              margin-top:4px;
            ">${locationLine}</div>
          ` : ""}
          <div style="
            font-size:10px;
            color:var(--ink-faint,#475569);
            margin-top:6px;
            border-top:1px solid var(--border-subtle,rgba(255,255,255,0.08));
            padding-top:5px;
          ">
            ${coordinates[1].toFixed(4)}°N · ${coordinates[0].toFixed(4)}°E
          </div>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map);

      if (openPopup) marker.togglePopup();
      markerRef.current = marker;
    });

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
    };
  }, [map, coordinates, pincode, district, state, openPopup]);

  return null;
}
