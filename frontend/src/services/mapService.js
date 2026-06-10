import api from "../utils/api";

export async function getNearbyPlaces(lat, lon, type = "all") {
  const { data } = await api.get(`/places/nearby?lat=${lat}&lon=${lon}&type=${type}`);
  return data;
}

export function getMapTileUrl() {
  return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
}

export const PLACE_CATEGORIES = [
  { id: "all", label: "All", icon: "📍" },
  { id: "hospital", label: "Hospital", icon: "🏥" },
  { id: "railway", label: "Railway", icon: "🚆" },
  { id: "airport", label: "Airport", icon: "✈️" },
  { id: "bus", label: "Bus Stand", icon: "🚌" },
  { id: "attraction", label: "Attraction", icon: "🗺️" },
];
