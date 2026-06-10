// ─────────────────────────────────────────────────────────────
//  PinPoint India — Map Provider (Abstract)
//  Future providers (Google Maps, Mapbox, self-hosted OSM)
//  only need to implement IMapProvider.
//  Switch provider here — zero component changes needed.
// ─────────────────────────────────────────────────────────────

import type { IMapProvider, GeocoderOptions } from "./types";
import { MapTilerProvider } from "./maptiler.provider";

export type ProviderName = "maptiler";

let _instance: IMapProvider | null = null;

export function getMapProvider(name: ProviderName = "maptiler"): IMapProvider {
  if (_instance) return _instance;
  switch (name) {
    case "maptiler":
    default:
      _instance = new MapTilerProvider();
      return _instance;
  }
}

// Convenience re-export so callers never touch maptiler directly
export function getStyleUrl(styleId: string): string {
  return getMapProvider().getStyleUrl(styleId);
}

export function getGeocoderUrl(query: string, opts?: GeocoderOptions): string {
  return getMapProvider().getGeocoderUrl(query, opts);
}

export function getApiKey(): string {
  return getMapProvider().getApiKey();
}
