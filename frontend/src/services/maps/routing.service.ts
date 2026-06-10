// ─────────────────────────────────────────────────────────────
//  PinPoint India — Routing Service
//  Uses OSRM public demo server (free, OpenStreetMap data)
//  Returns GeoJSON LineString + distance + duration
// ─────────────────────────────────────────────────────────────

import type { RouteData } from "./types";

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving";

export class RoutingError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "RoutingError";
  }
}

export interface RouteRequest {
  start: [number, number]; // [lng, lat]
  end:   [number, number]; // [lng, lat]
}

export async function fetchRoute(req: RouteRequest): Promise<RouteData> {
  const { start, end } = req;
  const coords = `${start[0]},${start[1]};${end[0]},${end[1]}`;
  const url    = `${OSRM_BASE}/${coords}?overview=full&geometries=geojson&steps=false`;

  try {
    const res  = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new RoutingError(`OSRM HTTP ${res.status}`);
    const json = await res.json();

    if (json.code !== "Ok" || !json.routes?.length) {
      throw new RoutingError("No route found between these points.");
    }

    const route    = json.routes[0];
    const geometry = route.geometry as { coordinates: [number, number][] };

    return {
      id:          `route-${Date.now()}`,
      coordinates: geometry.coordinates,
      distanceKm:  Math.round((route.distance / 1000) * 10) / 10,
      durationMin: Math.round(route.duration / 60),
      color:       "#f97316", // matches PinPoint accent
    };
  } catch (err) {
    if (err instanceof RoutingError) throw err;
    throw new RoutingError("Routing request failed. Check your connection.");
  }
}
