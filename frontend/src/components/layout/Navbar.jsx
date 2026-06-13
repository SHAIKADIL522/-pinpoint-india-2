import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Explore" },
  { to: "/map-intelligence", label: "Map Intelligence" },
  { to: "/dashboard", label: "AI Insights" },
  { to: "/analytics", label: "Analytics" },
  { to: "/favorites", label: "Saved Locations" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, login, logout } = useAuth();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  function openCommandPalette() {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
  }

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: "sticky", top: 0, zIndex: 100,
        padding: "0 24px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(2,6,23,0.92)" : "rgba(2,6,23,0.7)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        transition: "background 0.3s",
        gap: 16,
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg, #22D3EE 0%, #10B981 100%)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          boxShadow: "0 0 20px rgba(34,211,238,0.3)",
        }}>📍</div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 800, color: "#fff" }}>
            PinPoint India
          </div>
          <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, letterSpacing: "0.08em" }}>
            LOCATION INTELLIGENCE
          </div>
        </div>
      </Link>

      {/* Center nav links */}
      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        flex: 1, justifyContent: "center", overflowX: "auto",
      }}>
        {NAV_LINKS.map(({ to, label }) => {
          const active = pathname === to;
          return (
            <Link key={to} to={to} style={{
              padding: "6px 14px", borderRadius: 8, textDecoration: "none",
              fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
              color: active ? "#fff" : "#94A3B8",
              background: active ? "rgba(255,255,255,0.08)" : "transparent",
              transition: "all 0.2s",
            }}>{label}</Link>
          );
        })}
      </div>

      {/* Right side: Ctrl+K + auth */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={openCommandPalette}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "7px 12px", borderRadius: 9,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#94A3B8", fontSize: 12, fontWeight: 600,
            cursor: "pointer", fontFamily: "var(--font-body)",
          }}
        >
          <span style={{ fontSize: 14 }}>🔍</span>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
            border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "2px 6px",
          }}>
            Ctrl + K
          </span>
        </motion.button>

        {/* Auth button */}
        {!loading && (
          user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {user.avatar && (
                <img src={user.avatar} alt={user.name} style={{
                  width: 30, height: 30, borderRadius: "50%",
                  border: "2px solid rgba(34,211,238,0.4)",
                }} />
              )}
              <span style={{ fontSize: 13, color: "#94A3B8", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.name?.split(" ")[0]}
              </span>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={logout}
                style={{
                  padding: "6px 14px", borderRadius: 9,
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                  color: "#fca5a5", cursor: "pointer", fontSize: 12, fontWeight: 600,
                  fontFamily: "var(--font-body)",
                }}
              >
                Sign out
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={login}
              style={{
                padding: "7px 16px", borderRadius: 9,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#94A3B8", fontSize: 13, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 6,
                cursor: "pointer", fontFamily: "var(--font-body)",
                transition: "all 0.2s",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" fill="#4285F4"/>
              </svg>
              Sign in
            </motion.button>
          )
        )}
      </div>
    </motion.nav>
  );
}