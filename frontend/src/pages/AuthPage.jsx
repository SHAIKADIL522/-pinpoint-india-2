import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { pageVariants } from "../animations/pageVariants";
import { useAuth } from "../contexts/AuthContext";

export default function AuthPage() {
  const { user, login, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (!loading && user) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate"
        style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}
      >
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          style={{
            width: "100%", maxWidth: 380, padding: "44px 36px", borderRadius: 20,
            background: "rgba(15,22,41,0.8)", border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(24px)", textAlign: "center", boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
          }}
        >
          {user.avatar && (
            <img src={user.avatar} alt={user.name} style={{
              width: 72, height: 72, borderRadius: "50%", margin: "0 auto 16px",
              display: "block", border: "3px solid rgba(99,102,241,0.5)",
            }} />
          )}
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{user.name}</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>{user.email}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/")}
              style={{
                width: "100%", height: 46, borderRadius: 12,
                background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                border: "none", color: "#fff", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "var(--font-body)",
              }}
            >🔍 Search Pincodes</motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={logout}
              style={{
                width: "100%", height: 46, borderRadius: 12,
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                color: "#fca5a5", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "var(--font-body)",
              }}
            >Sign Out</motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate"
      style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}
    >
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        style={{
          width: "100%", maxWidth: 380, padding: "44px 36px", borderRadius: 20,
          background: "rgba(15,22,41,0.8)", border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(24px)", textAlign: "center", boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{
          width: 72, height: 72, borderRadius: 20, margin: "0 auto 20px",
          background: "linear-gradient(135deg,#1a237e,#283593)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 40px rgba(99,102,241,0.3)",
        }}>
          <svg width="36" height="36" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
          </svg>
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Welcome Back!</h2>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 32 }}>
          Login to save your favorites and history across all your devices.
        </p>
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(255,255,255,0.08)" }}
          whileTap={{ scale: 0.98 }}
          onClick={login}
          style={{
            width: "100%", height: 50, borderRadius: 12,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            color: "#e2e8f0", fontSize: 15, fontWeight: 600,
            cursor: "pointer", fontFamily: "var(--font-body)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" fill="#4285F4"/>
          </svg>
          Sign in with Google
        </motion.button>
        <p style={{ marginTop: 20, fontSize: 11, color: "#475569" }}>
          By signing in, your favorites and history sync across devices.
        </p>
      </motion.div>
    </motion.div>
  );
}
