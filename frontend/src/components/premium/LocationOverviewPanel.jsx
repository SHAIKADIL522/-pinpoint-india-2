import React from "react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import GeoIntelligenceCard from "./GeoIntelligenceCard";

/**
 * LocationOverviewPanel — premium presentation of core pincode/location
 * facts (district, state, coordinates, post offices). Pure presentation;
 * consumes the same data shape DashboardPage/SearchPage already fetch
 * from /api/pincode/:code.
 *
 * Props:
 *  - pincode: string
 *  - district: string
 *  - state: string
 *  - region: string (optional)
 *  - lat, lon: numbers
 *  - postOfficeCount: number
 *  - digipin: string (optional — display only, no API dependency)
 */
export default function LocationOverviewPanel({
  pincode, district, state, region, lat, lon, postOfficeCount, digipin,
}) {
  return (
    <GlassCard padding={20}>
      <SectionHeader
        eyebrow="Selected Location"
        title={district || "—"}
        subtitle={[region, state].filter(Boolean).join(", ")}
        action={
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 11, fontWeight: 700, color: "#10B981",
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
            borderRadius: 999, padding: "3px 10px",
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: "#10B981",
              boxShadow: "0 0 6px #10B981", display: "inline-block",
            }} />
            Live
          </span>
        }
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10 }}>
        <GeoIntelligenceCard icon="📮" label="Pincode" value={pincode} />
        {lat != null && lon != null && (
          <>
            <GeoIntelligenceCard icon="📍" label="Latitude" value={`${Number(lat).toFixed(4)}°`} copyable />
            <GeoIntelligenceCard icon="📍" label="Longitude" value={`${Number(lon).toFixed(4)}°`} copyable />
          </>
        )}
        {digipin && <GeoIntelligenceCard icon="🆔" label="DigiPIN" value={digipin} copyable accent="#10B981" />}
        {postOfficeCount != null && (
          <GeoIntelligenceCard icon="🏤" label="Post Offices" value={postOfficeCount} />
        )}
      </div>
    </GlassCard>
  );
}