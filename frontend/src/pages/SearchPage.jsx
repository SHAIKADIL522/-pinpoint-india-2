import React, { useEffect, useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { usePincode } from "../hooks/usePincode";
import { useFavorites } from "../hooks/useFavorites";
import { useSearchHistory } from "../hooks/useSearchHistory";
import { POPULAR_PINCODES, STATE_EMOJIS } from "../utils/constants";
import { pageVariants } from "../animations/pageVariants";
import WeatherCard from "../components/weather/WeatherCard";
import WeatherChart from "../components/weather/WeatherChart";
import AIInsightCard from "../components/ai/AIInsightCard";
import SkeletonCard from "../components/common/SkeletonCard";
import RecentSearches from "../components/search/RecentSearches";

const MapView = lazy(() => import("../components/map/MapView"));
const NearbyPlaces = lazy(() => import("../components/map/NearbyPlaces"));
const AIChat = lazy(() => import("../components/ai/AIChat"));

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [pinInput, setPinInput] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [mapCoords, setMapCoords] = useState(null);

  const { data, loading, error, search } = usePincode();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { history, addSearch, clearHistory } = useSearchHistory();

  // Handle ?pin= param from dashboard
  useEffect(() => {
    const p = searchParams.get("pin");
    if (p && /^\d{6}$/.test(p)) {
      setPinInput(p);
      search(p);
    }
  }, []);

  // Geocode district after pincode found
  useEffect(() => {
    if (!data) return;
    geocodeDistrict(`${data.district}, ${data.state}, India`);
    addSearch({
      pincode: data.pincode,
      district: data.district,
      state: data.state,
    });
  }, [data]);

  async function geocodeDistrict(q) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
      );
      const json = await res.json();
      if (json.length)
        setMapCoords({
          lat: parseFloat(json[0].lat),
          lon: parseFloat(json[0].lon),
        });
    } catch {
      setMapCoords(null);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    const p = pinInput.trim();
    if (/^\d{6}$/.test(p)) {
      search(p);
      setShowHistory(false);
    }
  }

  function handleHistorySelect(pin) {
    setPinInput(pin);
    search(pin);
    setShowHistory(false);
  }

  function toggleFavorite() {
    if (!data) return;
    if (isFavorite(data.pincode)) removeFavorite(data.pincode);
    else
      addFavorite({
        pincode: data.pincode,
        district: data.district,
        state: data.state,
        postOfficeCount: data.postOffices?.length || 0,
      });
  }

  const emoji = STATE_EMOJIS[data?.state] || "📍";
  const displayPOs = showAll
    ? data?.postOffices
    : data?.postOffices?.slice(0, 4);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px" }}
    >
      {/* Search bar */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 800,
              background: "linear-gradient(135deg,#f0f4ff,#93c5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Pincode Search
          </h1>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: 480 }}>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#475569",
                  }}
                >
                  🔍
                </span>
                <input
                  value={pinInput}
                  onChange={(e) =>
                    setPinInput(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  onFocus={() => setShowHistory(true)}
                  onBlur={() => setTimeout(() => setShowHistory(false), 150)}
                  placeholder="Enter 6-digit pincode"
                  inputMode="numeric"
                  maxLength={6}
                  disabled={loading}
                  style={{
                    width: "100%",
                    height: 52,
                    paddingLeft: 44,
                    paddingRight: 16,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "#f0f4ff",
                    fontSize: 18,
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                style={{
                  height: 52,
                  padding: "0 24px",
                  borderRadius: 12,
                  background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                  border: "none",
                  color: "#fff",
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
                }}
              >
                {loading ? "…" : "Search"}
              </motion.button>
            </form>

            {/* History dropdown */}
            <AnimatePresence>
              {showHistory && history.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 58,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                  }}
                >
                  <RecentSearches
                    history={history}
                    onSelect={handleHistorySelect}
                    onClear={clearHistory}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Popular chips */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            flexWrap: "wrap",
            marginTop: 14,
          }}
        >
          <span style={{ fontSize: 11, color: "#475569", alignSelf: "center" }}>
            Try:
          </span>
          {POPULAR_PINCODES.map(({ pin }) => (
            <button
              key={pin}
              onClick={() => {
                setPinInput(pin);
                search(pin);
              }}
              disabled={loading}
              style={{
                padding: "4px 12px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#94a3b8",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              {pin}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              marginBottom: 20,
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#fca5a5",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && <SkeletonCard />}

      {/* Results */}
      <AnimatePresence>
        {!loading && data && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            {/* Header card */}
            <div
              style={{
                padding: "24px 28px",
                borderRadius: 16,
                background: "rgba(15,22,41,0.8)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 42 }}>{emoji}</span>
                  <div>
                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 26,
                        fontWeight: 800,
                        lineHeight: 1.1,
                      }}
                    >
                      {data.district}
                    </h2>
                    <div style={{ color: "#64748b", fontSize: 14 }}>
                      {data.state}, {data.country}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      padding: "5px 16px",
                      borderRadius: 20,
                      fontWeight: 800,
                      fontSize: 16,
                      letterSpacing: "0.1em",
                      background: "rgba(59,130,246,0.12)",
                      border: "1px solid rgba(59,130,246,0.3)",
                      color: "#93c5fd",
                    }}
                  >
                    {data.pincode}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleFavorite}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: isFavorite(data.pincode)
                        ? "rgba(255,153,51,0.15)"
                        : "rgba(255,255,255,0.05)",
                      border: `1px solid ${isFavorite(data.pincode) ? "rgba(255,153,51,0.4)" : "rgba(255,255,255,0.1)"}`,
                      cursor: "pointer",
                      fontSize: 17,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isFavorite(data.pincode) ? "⭐" : "☆"}
                  </motion.button>
                </div>
              </div>

              {/* Meta grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: 10,
                  marginTop: 20,
                }}
              >
                {[
                  { label: "Division", value: data.division },
                  { label: "Region", value: data.region },
                  { label: "Circle", value: data.circle },
                  { label: "Post Offices", value: data.postOffices?.length },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: "#475569",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 3,
                      }}
                    >
                      {label}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>
                      {value || "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather */}
            <WeatherCard
              city={`${data.district}, ${data.state}`}
              lat={mapCoords?.lat}
              lon={mapCoords?.lon}
            />

            {/* Weather Chart */}
            <WeatherChart
              lat={mapCoords?.lat}
              lon={mapCoords?.lon}
              district={data.district}
              state={data.state}
            />

            {/* Map */}
            <Suspense
              fallback={
                <div
                  style={{
                    height: 320,
                    borderRadius: 14,
                    background: "rgba(15,22,41,0.4)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#475569",
                  }}
                >
                  Loading map…
                </div>
              }
            >
              {mapCoords && (
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#64748b",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 8,
                    }}
                  >
                    🗺️ Live Map Location
                  </div>
                  <MapView
                    lat={mapCoords.lat}
                    lon={mapCoords.lon}
                    district={data.district}
                    pincode={data.pincode}
                  />
                </div>
              )}
            </Suspense>

            {/* AI Insight */}
            <AIInsightCard
              pincode={data.pincode}
              district={data.district}
              state={data.state}
              postOfficeCount={data.postOffices?.length}
            />

            {/* Nearby Places */}
            <Suspense fallback={null}>
              {mapCoords && (
                <NearbyPlaces lat={mapCoords.lat} lon={mapCoords.lon} />
              )}
            </Suspense>

            {/* AI Chat */}
            <Suspense fallback={null}>
              <AIChat
                context={{
                  district: data.district,
                  state: data.state,
                  pincode: data.pincode,
                }}
              />
            </Suspense>

            {/* Post Offices */}
            <div
              style={{
                padding: "20px 24px",
                borderRadius: 16,
                background: "rgba(15,22,41,0.7)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 12,
                }}
              >
                📮 Post Offices ({data.postOffices?.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {displayPOs?.map((po, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        {po.name}
                      </div>
                      {po.taluk && po.taluk !== "NA" && (
                        <div style={{ fontSize: 11, color: "#64748b" }}>
                          {po.taluk}
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontSize: 10,
                          fontWeight: 600,
                          background: po.branchType?.includes("Head")
                            ? "rgba(16,185,129,0.12)"
                            : "rgba(255,255,255,0.04)",
                          color: po.branchType?.includes("Head")
                            ? "#6ee7b7"
                            : "#64748b",
                          border: `1px solid ${po.branchType?.includes("Head") ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.06)"}`,
                        }}
                      >
                        {po.branchType}
                      </span>
                      {po.deliveryStatus === "Delivery" && (
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: 6,
                            fontSize: 10,
                            fontWeight: 600,
                            background: "rgba(59,130,246,0.1)",
                            color: "#93c5fd",
                            border: "1px solid rgba(59,130,246,0.2)",
                          }}
                        >
                          Delivery
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              {data.postOffices?.length > 4 && (
                <button
                  onClick={() => setShowAll((s) => !s)}
                  style={{
                    marginTop: 10,
                    width: "100%",
                    padding: 10,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 10,
                    color: "#64748b",
                    cursor: "pointer",
                    fontSize: 13,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {showAll
                    ? "▲ Show less"
                    : `▼ Show all ${data.postOffices.length} post offices`}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!loading && !data && !error && (
        <div
          style={{ textAlign: "center", padding: "60px 0", color: "#475569" }}
        >
          <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.3 }}>📍</div>
          <div style={{ fontSize: 15 }}>Search a pincode to get started</div>
        </div>
      )}
    </motion.div>
  );
}
