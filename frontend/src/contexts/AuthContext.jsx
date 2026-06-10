import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// In dev: VITE_API_URL is unset, use relative /auth (Vite proxies to backend)
// In prod: VITE_API_URL = https://backend.vercel.app/api → strip /api for auth
function getAuthBase() {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) return ""; // dev: relative URLs, proxied by Vite
  return apiUrl.replace(/\/api$/, ""); // prod: https://backend.vercel.app
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = getAuthBase();
    fetch(`${base}/auth/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setUser(d.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  function login() {
    const base = getAuthBase();
    window.location.href = `${base}/auth/google`;
  }

  function logout() {
    const base = getAuthBase();
    window.location.href = `${base}/auth/logout`;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
