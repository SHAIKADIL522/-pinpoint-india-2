/// <reference types="vite/client" />
// PinPoint India — Geocoder Service
// Primary: MapTiler (requires VITE_MAPTILER_KEY)
// Fallback: Nominatim OSM (free, no key, always works)

import type { SearchResult, GeocoderOptions } from "./types";
import { getGeocoderUrl } from "./map.provider";

// ── Cache ─────────────────────────────────────────────────────
const cache   = new Map<string, SearchResult[]>();
const cacheTs = new Map<string, number>();
const CACHE_TTL = 5 * 60 * 1000;

function getCached(key: string): SearchResult[] | null {
  const ts = cacheTs.get(key);
  if (!ts || Date.now() - ts > CACHE_TTL) return null;
  return cache.get(key) ?? null;
}
function setCache(key: string, results: SearchResult[]): void {
  cache.set(key, results);
  cacheTs.set(key, Date.now());
}

// ── Error ─────────────────────────────────────────────────────
export class GeocoderError extends Error {
  constructor(msg: string, public readonly type = "geocoder") {
    super(msg);
    this.name = "GeocoderError";
  }
}

// ── Parse MapTiler feature ────────────────────────────────────
function parseFeature(f: Record<string, unknown>): SearchResult {
  const center    = f.center as [number, number];
  const placeType = (f.place_type as string[] | undefined)?.[0] ?? "place";
  return {
    id:         String(f.id ?? Math.random()),
    place_name: String(f.place_name ?? f.text ?? "Unknown"),
    center,
    type:       placeType,
    relevance:  Number(f.relevance ?? 1),
    bbox:       f.bbox as [number, number, number, number] | undefined,
  };
}

// ── Nominatim fallback (free, no key, India-focused) ─────────
async function searchNominatim(query: string): Promise<SearchResult[]> {
  const params = new URLSearchParams({
    q:                 query,
    format:            "jsonv2",
    limit:             "5",
    countrycodes:      "in",
    addressdetails:    "1",
    "accept-language": "en",
  });
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          "User-Agent": "PinPointIndia/2.0",
          Accept:       "application/json",
        },
      }
    );
    if (!res.ok) return [];
    const json = await res.json() as Array<Record<string, unknown>>;
    return (json || []).map(item => ({
      id:         String(item.place_id ?? Math.random()),
      place_name: String(item.display_name ?? ""),
      center:     [
        parseFloat(String(item.lon)),
        parseFloat(String(item.lat)),
      ] as [number, number],
      type:       String(item.type ?? "place"),
      relevance:  1,
    }));
  } catch {
    return [];
  }
}

// ── Primary: MapTiler ─────────────────────────────────────────
async function searchMapTiler(
  query: string,
  opts:  Partial<GeocoderOptions>
): Promise<SearchResult[]> {
  const key = import.meta.env.VITE_MAPTILER_KEY;
  if (!key) return []; // no key → skip, use Nominatim

  const url = getGeocoderUrl(query, { query, limit: 5, ...opts });
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new GeocoderError(`HTTP ${res.status}`);

  const json = await res.json() as { features?: Record<string, unknown>[] };
  if (!Array.isArray(json.features)) return [];
  return json.features.map(parseFeature);
}

// ── Public: searchPlaces ──────────────────────────────────────
export async function searchPlaces(
  query: string,
  opts: Partial<GeocoderOptions> = {}
): Promise<SearchResult[]> {
  const q = query.trim();
  if (!q || q.length < 2) return [];

  const cacheKey = `${q}|${JSON.stringify(opts)}`;
  const cached   = getCached(cacheKey);
  if (cached) return cached;

  let results: SearchResult[] = [];

  // Try MapTiler first (richer data + bbox)
  try {
    results = await searchMapTiler(q, opts);
  } catch {
    // MapTiler failed — fall through to Nominatim
  }

  // Fallback: Nominatim when MapTiler returns nothing or no key
  if (results.length === 0) {
    results = await searchNominatim(q);
  }

  setCache(cacheKey, results);
  return results;
}

// ── Public: reverseGeocode ────────────────────────────────────
export async function reverseGeocode(
  lng: number,
  lat: number
): Promise<SearchResult | null> {
  const key = import.meta.env.VITE_MAPTILER_KEY;

  // Try MapTiler reverse geocoding
  if (key) {
    try {
      const url = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${key}&language=en`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json() as { features?: Record<string, unknown>[] };
        const f    = json.features?.[0];
        if (f) return parseFeature(f);
      }
    } catch { /* fall through */ }
  }

  // Nominatim reverse fallback — always works
  try {
    const params = new URLSearchParams({
      format:            "jsonv2",
      lat:               String(lat),
      lon:               String(lng),
      addressdetails:    "1",
      "accept-language": "en",
    });
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params}`,
      { headers: { "User-Agent": "PinPointIndia/2.0" } }
    );
    if (!res.ok) return null;
    const item = await res.json() as Record<string, unknown>;
    if (!item.lat) return null;
    return {
      id:         String(item.place_id ?? Math.random()),
      place_name: String(item.display_name ?? ""),
      center:     [lng, lat],
      type:       String(item.type ?? "place"),
      relevance:  1,
    };
  } catch {
    return null;
  }
}