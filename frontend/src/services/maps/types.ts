// ─────────────────────────────────────────────────────────────
//  PinPoint India — Map Types
//  All interfaces for the map feature module
// ─────────────────────────────────────────────────────────────

export interface MapConfig {
  center:    [number, number]; // [lng, lat]
  zoom:      number;
  minZoom?:  number;
  maxZoom?:  number;
  style:     string;           // MapTiler style URL
  bounds?:   [[number, number], [number, number]]; // [[sw_lng, sw_lat], [ne_lng, ne_lat]]
}

export interface MarkerData {
  id:          string;
  coordinates: [number, number]; // [lng, lat]
  label?:      string;
  subLabel?:   string;
  type?:       "pincode" | "postoffice" | "custom";
  color?:      string;
  data?:       Record<string, unknown>;
}

export interface RouteData {
  id:          string;
  coordinates: [number, number][]; // array of [lng, lat]
  distanceKm?: number;
  durationMin?: number;
  color?:      string;
}

export interface SearchResult {
  id:          string;
  place_name:  string;
  center:      [number, number]; // [lng, lat]
  type:        string;
  relevance?:  number;
  bbox?:       [number, number, number, number];
}

export interface GeocoderOptions {
  query:       string;
  proximity?:  [number, number];
  bbox?:       [number, number, number, number];
  limit?:      number;
  language?:   string;
}

export interface PincodeGeoResult {
  pincode:     string;
  coordinates: [number, number]; // [lng, lat]
  district:    string;
  state:       string;
  found:       boolean;
}

export interface MapStyleOption {
  id:    string;
  label: string;
  url:   string;
  thumb: string;
}

export interface IMapProvider {
  getStyleUrl(styleId: string): string;
  getGeocoderUrl(query: string, options?: GeocoderOptions): string;
  getApiKey(): string;
}

// Re-export convenience
export type { MapConfig, MarkerData, RouteData, SearchResult, PincodeGeoResult, MapStyleOption };
