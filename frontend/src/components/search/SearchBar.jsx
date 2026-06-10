import React, { useState } from "react";

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const pin = value.trim();
    if (!/^\d{6}$/.test(pin)) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onSearch(pin);
  }

  const containerStyle = {
    display: "flex",
    gap: 12,
    maxWidth: 480,
    width: "100%",
    animation: shake ? "shakeX 0.4s ease" : "none",
  };

  const inputStyle = {
    flex: 1,
    height: 52,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "0 20px",
    color: "var(--text-primary)",
    fontSize: 20,
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    letterSpacing: "0.1em",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    caretColor: "var(--accent)",
  };

  const btnStyle = {
    height: 52,
    padding: "0 24px",
    background: loading ? "rgba(59,130,246,0.4)" : "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    cursor: loading ? "not-allowed" : "pointer",
    fontFamily: "var(--font-body)",
    fontSize: 16,
    fontWeight: 700,
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: 8,
    whiteSpace: "nowrap",
  };

  return (
    <>
      <style>{`
        @keyframes shakeX {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }
        .pincode-input:focus {
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 3px var(--accent-glow) !important;
        }
        .search-btn:not(:disabled):hover {
          background: var(--accent-2) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 20px var(--accent-glow);
        }
      `}</style>
      <form onSubmit={handleSubmit} style={containerStyle}>
        <input
          className="pincode-input"
          style={inputStyle}
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter 6-digit pincode"
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
          autoFocus
          disabled={loading}
        />
        <button className="search-btn" style={btnStyle} type="submit" disabled={loading}>
          {loading ? (
            <>
              <span style={{ animation: "spin 0.8s linear infinite", display: "inline-block" }}>⟳</span>
              Searching
            </>
          ) : (
            <>🔍 Search</>
          )}
        </button>
      </form>
    </>
  );
}
