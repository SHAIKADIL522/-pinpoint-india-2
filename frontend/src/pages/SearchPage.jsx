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
import GlassCard from "../components/ui/GlassCard";
import PremiumInput from "../components/ui/PremiumInput";
import PremiumButton from "../components/ui/PremiumButton";
import MapSkeleton from "../components/ui/MapSkeleton";
import HeroBackground from "../components/explore/HeroBackground";
import FloatingPins from "../components/explore/FloatingPins";
import HeroStats from "../components/explore/HeroStats";
import FeatureGrid from "../components/explore/FeatureGrid";
import TerrainMesh from "../components/explore/TerrainMesh";

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
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: 0,
      }}
    >
      {/* ============ PREMIUM HERO SECTION (single, two-column) ============ */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "100px 24px 60px",
          background:
            "linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(2,6,23,1) 100%)",
        }}
      >
        <HeroBackground />
        <div className="hero-glow" />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1280,
            margin: "0 auto",
          }}
        >
          <div className="hero-layout">
            {/* ---------- LEFT: text + search ---------- */}
            <div className="hero-left">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 16px",
                  borderRadius: 999,
                  marginBottom: 18,
                  background: "rgba(34,211,238,0.08)",
                  border: "1px solid rgba(34,211,238,0.25)",
                  color: "#22D3EE",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                ✦ Explore India Intelligently
              </div>
              <h1
                className="hero-title"
                style={{
                  color: "#fff",
                  marginBottom: 18,
                }}
              >
                Discover Places.
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(90deg,#60A5FA,#22D3EE,#10B981)",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Uncover Insights.
                </span>
              </h1>

              <p
                className="hero-description"
                style={{
                  marginBottom: 30,
                }}
              >
                PinPoint India helps you search any 6-digit pincode and explore
                detailed location intelligence in seconds.
              </p>

              {/* Search Form */}
              <div style={{ position: "relative", maxWidth: 520 }}>
                <form
                  onSubmit={handleSearch}
                  style={{ display: "flex", gap: 10 }}
                >
                  <PremiumInput
                    icon="🔍"
                    size="lg"
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
                      fontSize: 16,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                    }}
                  />

                  <PremiumButton
                    type="submit"
                    size="lg"
                    disabled={loading}
                    style={{ minWidth: 120 }}
                  >
                    {loading ? "…" : "Search →"}
                  </PremiumButton>
                </form>

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

              {/* Trending Pins */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 18,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: "#64748B",
                    fontWeight: 600,
                    marginRight: 4,
                  }}
                >
                  Trending
                </span>
                {POPULAR_PINCODES.map(({ pin }) => (
                  <button
                    key={pin}
                    onClick={() => {
                      setPinInput(pin);
                      search(pin);
                    }}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#94A3B8",
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    {pin}
                  </button>
                ))}
              </div>
            </div>

            {/* ---------- RIGHT: visual intelligence panel ---------- */}
            <div className="hero-right">
              <div className="hero-visual">
                 <TerrainMesh />
                <FloatingPins />
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ marginTop: 48 }}>
            <HeroStats />
          </div>

          {/* Feature grid */}
          <div style={{ marginTop: 56 }}>
            <h2
              style={{
                textAlign: "center",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(22px, 3vw, 30px)",
                fontWeight: 800,
                color: "#fff",
                marginBottom: 6,
              }}
            >
              Everything you need to explore smarter
            </h2>
            <p
              style={{
                textAlign: "center",
                color: "#94A3B8",
                fontSize: 14,
                marginBottom: 28,
              }}
            >
              Powerful location intelligence tools at your fingertips
            </p>
            <FeatureGrid />
          </div>
        </div>
      </div>

      {/* ============ MAIN CONTENT (below hero) ============ */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
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
                color: "#FCA5A5",
                fontSize: 14,
                fontWeight: 600,
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
              <GlassCard padding={24}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 14 }}
                  >
                    <span style={{ fontSize: 42 }}>{emoji}</span>
                    <div>
                      <h2
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 26,
                          fontWeight: 800,
                          lineHeight: 1.1,
                          color: "#fff",
                          margin: 0,
                        }}
                      >
                        {data.district}
                      </h2>
                      <div
                        style={{
                          color: "#94A3B8",
                          fontSize: 14,
                          marginTop: 4,
                        }}
                      >
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
                        background: "rgba(34,211,238,0.1)",
                        border: "1px solid rgba(34,211,238,0.25)",
                        color: "#67E8F9",
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
                          ? "rgba(245,158,11,0.12)"
                          : "rgba(255,255,255,0.05)",
                        border: `1px solid ${isFavorite(data.pincode) ? "rgba(245,158,11,0.35)" : "rgba(255,255,255,0.1)"}`,
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
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          color: "#64748B",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: 3,
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}
                      >
                        {value || "—"}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

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
              <Suspense fallback={<MapSkeleton height={320} />}>
                {mapCoords && (
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#94A3B8",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
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
              <GlassCard padding={24}>
                <div
                  style={{
                    fontSize: 11,
                    color: "#94A3B8",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 12,
                  }}
                >
                  📮 Post Offices ({data.postOffices?.length})
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
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
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#fff",
                          }}
                        >
                          {po.name}
                        </div>
                        {po.taluk && po.taluk !== "NA" && (
                          <div style={{ fontSize: 11, color: "#64748B" }}>
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
                            fontWeight: 700,
                            background: po.branchType?.includes("Head")
                              ? "rgba(16,185,129,0.12)"
                              : "rgba(255,255,255,0.04)",
                            color: po.branchType?.includes("Head")
                              ? "#6EE7B7"
                              : "#64748B",
                            border: `1px solid ${po.branchType?.includes("Head") ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.08)"}`,
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
                              fontWeight: 700,
                              background: "rgba(34,211,238,0.1)",
                              color: "#67E8F9",
                              border: "1px solid rgba(34,211,238,0.25)",
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
                  <PremiumButton
                    variant="ghost"
                    fullWidth
                    onClick={() => setShowAll((s) => !s)}
                    style={{ marginTop: 10 }}
                  >
                    {showAll
                      ? "▲ Show less"
                      : `▼ Show all ${data.postOffices.length} post offices`}
                  </PremiumButton>
                )}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!loading && !data && !error && (
          <div
            style={{ textAlign: "center", padding: "60px 0", color: "#475569" }}
          >
            <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.3 }}>
              📍
            </div>
            <div style={{ fontSize: 15, color: "#64748B" }}>
              Search a pincode to get started
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
