/// <reference types="vite/client" />
// ─────────────────────────────────────────────────────────────
//  PinPoint India — usePincodeMap Hook  (v5 FIXED)
//  maplibre-gl v5 — use unknown map ref, cast on use
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { resolvePincodeCoordinates }   from "../services/maps/pincode.service";
import type { PincodeGeoResult }       from "../services/maps/types";
import { PINCODE_ZOOM }                from "../services/maps/map.style";

export interface UsePincodeMapOptions {
  pincode:  string | undefined;
  mapRef:   React.MutableRefObject<unknown>;
  isLoaded: boolean;
  label?:   string;
}

export interface UsePincodeMapReturn {
  geoResult:   PincodeGeoResult | null;
  isResolving: boolean;
  geoError:    string | null;
}

type AnyMap = {
  flyTo:   (o: unknown) => void;
  remove?: () => void;
};

type AnyMarker = { remove: () => void; togglePopup: () => void };

export function usePincodeMap({
  pincode,
  mapRef,
  isLoaded,
  label,
}: UsePincodeMapOptions): UsePincodeMapReturn {
  const [geoResult,    setGeoResult]    = useState<PincodeGeoResult | null>(null);
  const [isResolving,  setIsResolving]  = useState(false);
  const [geoError,     setGeoError]     = useState<string | null>(null);
  const markerRef = useRef<AnyMarker | null>(null);

  useEffect(() => {
    if (!pincode || !isLoaded || !mapRef.current) return;

    let cancelled = false;
    setIsResolving(true);
    setGeoError(null);

    resolvePincodeCoordinates(pincode).then((result) => {
      if (cancelled) return;
      setGeoResult(result);
      setIsResolving(false);

      if (!result.found || !mapRef.current) return;

      const map = mapRef.current as AnyMap;
      const [lng, lat] = result.coordinates;

      map.flyTo({ center: [lng, lat], zoom: PINCODE_ZOOM, duration: 1200, essential: true });
      markerRef.current?.remove();

      import("maplibre-gl").then((ml) => {
        if (cancelled || !mapRef.current) return;
        const maplibregl = ml.default ?? ml;

        const el = document.createElement("div");
        el.className = "pinpoint-map-marker";
        el.innerHTML = `
          <div style="
            width:40px;height:40px;
            background:var(--accent-primary,#f97316);
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            box-shadow:0 4px 14px rgba(249,115,22,0.5);
            border:3px solid #fff;
            display:flex;align-items:center;justify-content:center;
          ">
            <span style="
              transform:rotate(45deg);
              font-size:12px;font-weight:700;color:#fff;
              font-family:'JetBrains Mono',monospace;
              letter-spacing:-0.5px;
            ">${pincode.slice(-3)}</span>
          </div>`;

        const popup = new maplibregl.Popup({
          offset: 30, closeButton: false, maxWidth: "200px",
        }).setHTML(`
          <div style="
            font-family:'JetBrains Mono',monospace;
            padding:8px 10px;
            background:var(--surface-1,#1a1a2e);
            border-radius:8px;
            color:var(--ink-primary,#e2e8f0);
          ">
            <div style="font-size:16px;font-weight:700;color:var(--accent-primary,#f97316)">${pincode}</div>
            ${label ? `<div style="font-size:11px;color:var(--ink-secondary,#94a3b8);margin-top:2px">${label}</div>` : ""}
            ${result.district ? `<div style="font-size:11px;color:var(--ink-muted,#64748b);margin-top:1px">${result.district}${result.state ? `, ${result.state}` : ""}</div>` : ""}
          </div>`);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(mapRef.current as never);

        marker.togglePopup();
        markerRef.current = marker as AnyMarker;
      });
    }).catch((err) => {
      if (cancelled) return;
      setGeoError(err?.message ?? "Could not resolve pincode location.");
      setIsResolving(false);
    });

    return () => {
      cancelled = true;
      markerRef.current?.remove();
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pincode, isLoaded]);

  return { geoResult, isResolving, geoError };
}
