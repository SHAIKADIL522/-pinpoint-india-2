import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Premium marker — cyan/emerald glow + pulse, matches enterprise palette
const glowIcon = new L.DivIcon({
  html: `<div style="
    width:36px;height:36px;border-radius:50%;
    background:linear-gradient(135deg,#22D3EE,#10B981);
    display:flex;align-items:center;justify-content:center;
    font-size:18px;
    box-shadow:0 0 0 8px rgba(34,211,238,0.15),0 0 30px rgba(34,211,238,0.5);
    animation:mapPulse 2s ease-in-out infinite;
  ">📍</div>
  <style>
    @keyframes mapPulse{0%,100%{box-shadow:0 0 0 8px rgba(34,211,238,0.15),0 0 30px rgba(34,211,238,0.5)}50%{box-shadow:0 0 0 16px rgba(34,211,238,0.08),0 0 50px rgba(34,211,238,0.7)}}
  </style>`,
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function FlyTo({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 13, { duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function MapView({ lat, lon, district, pincode }) {
  if (!lat || !lon) return null;
  const center = [lat, lon];

  return (
    <div style={{
      borderRadius: 16, overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.08)",
      height: 320, position: "relative",
      background: "rgba(15,23,42,0.6)",
      backdropFilter: "blur(8px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    }}>
      <style>{`
        .leaflet-popup-content-wrapper {
          background: rgba(15,23,42,0.92) !important;
          color: #fff !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 12px !important;
          backdrop-filter: blur(16px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important;
        }
        .leaflet-popup-tip {
          background: rgba(15,23,42,0.92) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        .leaflet-popup-content { font-family: var(--font-body); margin: 10px 14px; }
        .leaflet-popup-close-button {
          color: #94A3B8 !important;
        }
        .leaflet-control-zoom a {
          background: rgba(15,23,42,0.85) !important;
          color: #94A3B8 !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(255,255,255,0.06) !important;
          color: #fff !important;
        }
      `}</style>
      <MapContainer
        center={center} zoom={12}
        style={{ height: "100%", width: "100%", background: "#020617" }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>'
        />
        <FlyTo center={center} />
        <Marker position={center} icon={glowIcon}>
          <Popup>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#fff" }}>
              {district}
            </div>
            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
              📮 {pincode}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}