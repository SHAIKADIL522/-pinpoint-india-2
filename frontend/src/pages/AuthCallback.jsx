import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// After Google OAuth redirect back to frontend, session cookie is set.
// This page just checks /auth/me and navigates to home.
export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Short delay to let session cookie settle, then go home
    setTimeout(() => navigate("/", { replace: true }), 500);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 40, height: 40, borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.1)",
            borderTopColor: "var(--accent)",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Signing you in…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  );
}
