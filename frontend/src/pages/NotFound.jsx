import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: "0 20px", textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🗺️</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, marginBottom: 8 }}>404</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Page not found</p>
      <Link to="/" className="btn btn-primary">← Back to Search</Link>
    </div>
  );
}
