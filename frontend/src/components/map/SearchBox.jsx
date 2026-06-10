// ─────────────────────────────────────────────────────────────
//  PinPoint India — SearchBox Component
//  Geocoder search input → dropdown → fly map to result
//  Debounced 350ms, matches PinPoint design system
// ─────────────────────────────────────────────────────────────

import { useState, useCallback, useRef } from "react";
import { searchPlaces } from "../../services/maps/geocoder.service";

/**
 * @param {Object}   props
 * @param {Function} props.onSelect   - (result: SearchResult) => void
 * @param {string}   [props.placeholder]
 * @param {boolean}  [props.disabled]
 */
export default function SearchBox({
  onSelect,
  placeholder = "Search places in India…",
  disabled = false,
}) {
  const [query,     setQuery]     = useState("");
  const [results,   setResults]   = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [open,      setOpen]      = useState(false);
  const [error,     setError]     = useState(null);
  const debounceRef = useRef(null);
  const wrapperRef  = useRef(null);

  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setQuery(val);
    setError(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!val.trim() || val.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchPlaces(val);
        setResults(res);
        setOpen(res.length > 0);
      } catch (err) {
        setError(err.message || "Search failed");
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 350);
  }, []);

  const handleSelect = useCallback((result) => {
    setQuery(result.place_name);
    setResults([]);
    setOpen(false);
    onSelect?.(result);
  }, [onSelect]);

  const handleBlur = useCallback((e) => {
    // Delay close so click on result can register
    if (!wrapperRef.current?.contains(e.relatedTarget)) {
      setTimeout(() => setOpen(false), 150);
    }
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", width: "100%" }}
      onBlur={handleBlur}
    >
      <div
        style={{
          position:     "relative",
          display:      "flex",
          alignItems:   "center",
          background:   "var(--surface-2)",
          border:       "1px solid var(--border-subtle)",
          borderRadius: "10px",
          overflow:     "hidden",
          transition:   "border-color 0.15s",
        }}
      >
        {/* Search icon */}
        <span
          style={{
            padding:  "0 10px 0 12px",
            fontSize: "14px",
            color:    "var(--ink-muted)",
            pointerEvents: "none",
          }}
        >
          🔍
        </span>

        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            flex:        1,
            padding:     "10px 10px 10px 0",
            background:  "transparent",
            border:      "none",
            outline:     "none",
            fontSize:    "13px",
            fontFamily:  "'JetBrains Mono', monospace",
            color:       "var(--ink-primary)",
            cursor:      disabled ? "not-allowed" : "text",
          }}
        />

        {/* Loading spinner */}
        {loading && (
          <span
            style={{
              padding:   "0 12px",
              fontSize:  "12px",
              color:     "var(--accent-primary)",
              animation: "spin 1s linear infinite",
            }}
          >
            ◌
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <p style={{ fontSize: "11px", color: "#f87171", marginTop: "4px", paddingLeft: "4px" }}>
          {error}
        </p>
      )}

      {/* Dropdown results */}
      {open && results.length > 0 && (
        <div
          style={{
            position:     "absolute",
            top:          "calc(100% + 4px)",
            left:         0,
            right:        0,
            background:   "var(--surface-1)",
            border:       "1px solid var(--border-subtle)",
            borderRadius: "10px",
            overflow:     "hidden",
            zIndex:       50,
            boxShadow:    "0 8px 24px rgba(0,0,0,0.25)",
          }}
        >
          {results.map((r) => (
            <button
              key={r.id}
              onMouseDown={() => handleSelect(r)}
              style={{
                display:     "block",
                width:       "100%",
                padding:     "10px 14px",
                background:  "transparent",
                border:      "none",
                borderBottom: "1px solid var(--border-subtle)",
                textAlign:   "left",
                cursor:      "pointer",
                fontSize:    "12px",
                fontFamily:  "'JetBrains Mono', monospace",
                color:       "var(--ink-secondary)",
                transition:  "background 0.1s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ color: "var(--accent-primary)", marginRight: "8px" }}>📍</span>
              {r.place_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
