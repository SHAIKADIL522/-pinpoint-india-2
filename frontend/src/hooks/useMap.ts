/// <reference types="vite/client" />
// ─────────────────────────────────────────────────────────────
//  PinPoint India — useMap Hook  (v5 FIXED)
//  maplibre-gl v5 changed types — MapMouseEvent removed,
//  use maplibregl.MapMouseEvent directly
// ─────────────────────────────────────────────────────────────

import { useRef, useEffect, useCallback, useState } from "react";
import { INDIA_MAP_CONFIG } from "../services/maps/map.style";
import type { StyleId }     from "../services/maps/map.style";
import { getMapStyleUrl }   from "../services/maps/map.style";

export interface UseMapOptions {
  containerId:  string;
  initialStyle?: StyleId;
  onMapClick?:  (lng: number, lat: number) => void;
}

export interface UseMapReturn {
  mapRef:   React.MutableRefObject<unknown>;
  isLoaded: boolean;
  flyTo:    (lng: number, lat: number, zoom?: number) => void;
  setStyle: (styleId: StyleId) => void;
  fitIndia: () => void;
}

export function useMap({
  containerId,
  initialStyle = "streets-v2",
  onMapClick,
}: UseMapOptions): UseMapReturn {
  // Use unknown to avoid v4/v5 type conflicts — accessed only via methods
  const mapRef        = useRef<unknown>(null);
  const cleanupMapRef = useRef<{ remove: () => void } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let destroyed = false;

    import("maplibre-gl").then((ml) => {
      const maplibregl = ml.default ?? ml;
      const container  = document.getElementById(containerId);
      if (!container || mapRef.current || destroyed) return;

      const map = new maplibregl.Map({
        container:          containerId,
        style:              getMapStyleUrl(initialStyle),
        center:             INDIA_MAP_CONFIG.center,
        zoom:               INDIA_MAP_CONFIG.zoom,
        minZoom:            INDIA_MAP_CONFIG.minZoom,
        maxZoom:            INDIA_MAP_CONFIG.maxZoom,
        maxBounds:          INDIA_MAP_CONFIG.bounds,
        attributionControl: false,
      });

      cleanupMapRef.current = map;

      map.addControl(
        new maplibregl.AttributionControl({ compact: true }),
        "bottom-right"
      );
      map.addControl(
        new maplibregl.NavigationControl({ showCompass: false }),
        "top-right"
      );

      map.on("load", () => {
        if (destroyed) { map.remove(); return; }
        mapRef.current = map;
        setIsLoaded(true);
      });

      if (onMapClick) {
        // v5 compatible — use generic event
        map.on("click", (e: { lngLat: { lng: number; lat: number } }) => {
          onMapClick(e.lngLat.lng, e.lngLat.lat);
        });
      }
    });

    return () => {
      destroyed = true;
      cleanupMapRef.current?.remove();
      cleanupMapRef.current = null;
      mapRef.current        = null;
      setIsLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId]);

  const flyTo = useCallback((lng: number, lat: number, zoom = 11) => {
    (mapRef.current as { flyTo: (o: unknown) => void })?.flyTo({
      center: [lng, lat], zoom, duration: 1200, essential: true,
    });
  }, []);

  const setStyle = useCallback((styleId: StyleId) => {
    (mapRef.current as { setStyle: (s: string) => void })?.setStyle(
      getMapStyleUrl(styleId)
    );
  }, []);

  const fitIndia = useCallback(() => {
    (mapRef.current as { flyTo: (o: unknown) => void })?.flyTo({
      center:   INDIA_MAP_CONFIG.center,
      zoom:     INDIA_MAP_CONFIG.zoom,
      duration: 800,
    });
  }, []);

  return { mapRef, isLoaded, flyTo, setStyle, fitIndia };
}
