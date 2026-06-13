import React from "react";
import LocationOverviewPanel from "./LocationOverviewPanel";
import WeatherIntelligencePanel from "./WeatherIntelligencePanel";
import AISummaryPanel from "./AISummaryPanel";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";

/**
 * MapIntelligenceSidebar — composes the existing location/weather/AI/nearby
 * data into a single premium sidebar shown alongside the map.
 *
 * Props (all pass straight through to child panels — no new data fetching
 * logic introduced beyond what WeatherIntelligencePanel/AISummaryPanel do
 * via existing services):
 *  - location: { pincode, district, state, region, lat, lon, postOfficeCount, digipin }
 *  - nearbyPlaces: array (rendered via NearbyPlaces if passed, else omitted)
 *  - NearbyPlacesComponent: optional existing component to render unchanged
 */
export default function MapIntelligenceSidebar({ location, NearbyPlacesComponent }) {
  if (!location) {
    return (
      <GlassCard padding={24} style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📍</div>
        <SectionHeader
          title="No Location Selected"
          subtitle="Search a pincode or click on the map to view intelligence."
          align="center"
          style={{ marginBottom: 0 }}
        />
      </GlassCard>
    );
  }

  const { pincode, district, state, region, lat, lon, postOfficeCount, digipin } = location;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <LocationOverviewPanel
        pincode={pincode}
        district={district}
        state={state}
        region={region}
        lat={lat}
        lon={lon}
        postOfficeCount={postOfficeCount}
        digipin={digipin}
      />

      {(lat != null && lon != null) && (
        <WeatherIntelligencePanel lat={lat} lon={lon} />
      )}

      <AISummaryPanel
        pincode={pincode}
        district={district}
        state={state}
        postOfficeCount={postOfficeCount}
      />

      {NearbyPlacesComponent && lat != null && lon != null && (
        <GlassCard padding={0} style={{ overflow: "hidden" }}>
          <NearbyPlacesComponent lat={lat} lon={lon} />
        </GlassCard>
      )}
    </div>
  );
}