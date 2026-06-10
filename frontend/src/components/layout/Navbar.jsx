import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, login, logout } = useAuth();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: "sticky", top: 0, zIndex: 100,
        padding: "0 24px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(8,12,24,0.95)" : "rgba(8,12,24,0.7)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        transition: "background 0.3s",
      }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          boxShadow: "0 0 20px rgba(99,102,241,0.4)",
        }}>📍</div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "#f0f4ff" }}>
            PinPoint India
          </div>
          <div style={{ fontSize: 10, color: "#475569", fontWeight: 500, letterSpacing: "0.06em" }}>
            LOCATION INTELLIGENCE
          </div>
        </div>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {[
          { to: "/", label: "Home" },
          { to: "/dashboard", label: "Dashboard" },
          { to: "/favorites", label: "Favorites" },
        ].map(({ to, label }) => (
          <Link key={to} to={to} style={{
            padding: "6px 16px", borderRadius: 8, textDecoration: "none",
            fontSize: 13, fontWeight: 500,
            color: pathname === to ? "#f0f4ff" : "#64748b",
            background: pathname === to ? "rgba(255,255,255,0.08)" : "transparent",
            transition: "all 0.2s",
          }}>{label}</Link>
        ))}

        {/* Auth button */}
        {!loading && (
          user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
              {user.avatar && (
                <img src={user.avatar} alt={user.name} style={{
                  width: 30, height: 30, borderRadius: "50%",
                  border: "2px solid rgba(99,102,241,0.5)",
                }} />
              )}
              <span style={{ fontSize: 13, color: "#94a3b8", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
                marginLeft: 8, padding: "7px 16px", borderRadius: 9,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#94a3b8", fontSize: 13, fontWeight: 600,
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
