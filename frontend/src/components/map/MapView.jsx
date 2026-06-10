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

const glowIcon = new L.DivIcon({
  html: `<div style="
    width:36px;height:36px;border-radius:50%;
    background:linear-gradient(135deg,#3b82f6,#6366f1);
    display:flex;align-items:center;justify-content:center;
    font-size:18px;
    box-shadow:0 0 0 8px rgba(99,102,241,0.2),0 0 30px rgba(99,102,241,0.5);
    animation:mapPulse 2s ease-in-out infinite;
  ">📍</div>
  <style>
    @keyframes mapPulse{0%,100%{box-shadow:0 0 0 8px rgba(99,102,241,0.2),0 0 30px rgba(99,102,241,0.5)}50%{box-shadow:0 0 0 16px rgba(99,102,241,0.1),0 0 50px rgba(99,102,241,0.7)}}
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
      borderRadius: 14, overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.08)",
      height: 320, position: "relative",
    }}>
      <MapContainer
        center={center} zoom={12}
        style={{ height: "100%", width: "100%", background: "#0a0e1a" }}
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
            <div style={{ fontFamily: "sans-serif", padding: 4 }}>
              <strong>{district}</strong><br />
              📮 {pincode}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
