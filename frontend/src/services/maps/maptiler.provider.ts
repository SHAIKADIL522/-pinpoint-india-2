/// <reference types="vite/client" />
// ─────────────────────────────────────────────────────────────
//  PinPoint India — MapTiler Provider  (FIXED)
//  Fix: vite/client reference + geocoder URL correct path encoding
// ─────────────────────────────────────────────────────────────

import type { IMapProvider, GeocoderOptions } from "./types";

const MAPTILER_BASE = "https://api.maptiler.com";

export class MapTilerProvider implements IMapProvider {
  private readonly key: string;

  constructor() {
    this.key = import.meta.env.VITE_MAPTILER_KEY || "";
    if (!this.key) {
      console.warn("[PinPoint Maps] VITE_MAPTILER_KEY not set. Add it to .env.local");
    }
  }

  getApiKey(): string {
    return this.key;
  }

  getStyleUrl(styleId: string): string {
    return `${MAPTILER_BASE}/maps/${styleId}/style.json?key=${this.key}`;
  }

  getGeocoderUrl(query: string, opts: Partial<GeocoderOptions> = {}): string {
    const params = new URLSearchParams({
      key:      this.key,
      limit:    String(opts.limit ?? 5),
      language: opts.language ?? "en",
      bbox:     "68.7,8.4,97.4,37.6",
    });
    return `${MAPTILER_BASE}/geocoding/${encodeURIComponent(query)}.json?${params}`;
  }
}
