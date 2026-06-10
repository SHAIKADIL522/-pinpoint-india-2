/// <reference types="vite/client" />
// ─────────────────────────────────────────────────────────────
//  PinPoint India — Pincode Geo Service
//  Resolves Indian pincode → coordinates using:
//    1. OpenStreetMap Nominatim (free, no API key needed)
//    2. MapTiler geocoding fallback
//  Returns [lng, lat] tuple for map fly-to
// ─────────────────────────────────────────────────────────────

import type { PincodeGeoResult } from "./types";

const cache = new Map<string, PincodeGeoResult>();

const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const HEADERS   = {
  Accept: "application/json",
  // Required by Nominatim usage policy
  "User-Agent": "PinPointIndia/2.0 (portfolio project)",
};

async function tryNominatim(pincode: string): Promise<PincodeGeoResult | null> {
  const params = new URLSearchParams({
    q:              `${pincode}, India`,
    format:         "json",
    addressdetails: "1",
    limit:          "1",
    countrycodes:   "in",
  });
  try {
    const res  = await fetch(`${NOMINATIM}?${params}`, { headers: HEADERS });
    if (!res.ok) return null;
    const json = await res.json();
    if (!Array.isArray(json) || json.length === 0) return null;

    const hit     = json[0];
    const addr    = hit.address || {};
    const lng     = parseFloat(hit.lon);
    const lat     = parseFloat(hit.lat);
    if (isNaN(lng) || isNaN(lat)) return null;

    return {
      pincode,
      coordinates: [lng, lat],
      district:    addr.county || addr.city || addr.town || addr.village || "",
      state:       addr.state  || "",
      found:       true,
    };
  } catch {
    return null;
  }
}

async function tryMapTiler(pincode: string): Promise<PincodeGeoResult | null> {
  const key = import.meta.env.VITE_MAPTILER_KEY;
  if (!key) return null;
  const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(pincode + " India")}.json?key=${key}&limit=1&bbox=68.7,8.4,97.4,37.6`;
  try {
    const res  = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const f    = json.features?.[0];
    if (!f?.center) return null;
    return {
      pincode,
      coordinates: f.center as [number, number],
      district:    "",
      state:       "",
      found:       true,
    };
  } catch {
    return null;
  }
}

export async function resolvePincodeCoordinates(
  pincode: string
): Promise<PincodeGeoResult> {
  if (cache.has(pincode)) return cache.get(pincode)!;

  const result =
    (await tryNominatim(pincode)) ??
    (await tryMapTiler(pincode)) ??
    { pincode, coordinates: [78.9629, 20.5937] as [number, number], district: "", state: "", found: false };

  cache.set(pincode, result);
  return result;
}

export function clearPincodeCoordsCache(): void {
  cache.clear();
}
