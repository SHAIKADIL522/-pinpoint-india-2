// ─────────────────────────────────────────────────────────────
//  PinPoint India — RouteLayer Component
//  Renders a GeoJSON LineString route on the map
//  Cleans up source/layer on unmount or route change
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";

const SOURCE_ID = "pinpoint-route-source";
const LAYER_ID  = "pinpoint-route-layer";

/**
 * @param {Object}   props
 * @param {import('maplibre-gl').Map|null} props.map
 * @param {import('../../services/maps/types').RouteData|null} props.route
 */
export default function RouteLayer({ map, route }) {
  const routeIdRef = useRef(null);

  useEffect(() => {
    if (!map || !route) return;
    if (routeIdRef.current === route.id) return;

    const addRoute = () => {
      // Remove old
      if (map.getLayer(LAYER_ID))  map.removeLayer(LAYER_ID);
      if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);

      const geojson = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: route.coordinates,
        },
      };

      map.addSource(SOURCE_ID, { type: "geojson", data: geojson });
      map.addLayer({
        id:     LAYER_ID,
        type:   "line",
        source: SOURCE_ID,
        layout: { "line-join": "round", "line-cap": "round" },
        paint:  {
          "line-color":   route.color || "#f97316",
          "line-width":   4,
          "line-opacity": 0.85,
        },
      });

      // Fit bounds to route
      if (route.coordinates.length > 1) {
        const lngs = route.coordinates.map((c) => c[0]);
        const lats = route.coordinates.map((c) => c[1]);
        map.fitBounds(
          [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
          { padding: 60, duration: 800 }
        );
      }

      routeIdRef.current = route.id;
    };

    // Map may not be fully loaded yet
    if (map.isStyleLoaded()) {
      addRoute();
    } else {
      map.once("styledata", addRoute);
    }
  }, [map, route]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (!map) return;
      try {
        if (map.getLayer(LAYER_ID))   map.removeLayer(LAYER_ID);
        if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
      } catch {/* map may already be destroyed */}
    };
  }, [map]);

  return null;
}
