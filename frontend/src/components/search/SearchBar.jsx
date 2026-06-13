import React, { useState } from "react";
import PremiumInput from "../ui/PremiumInput";
import PremiumButton from "../ui/PremiumButton";

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
      `}</style>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: 12,
          maxWidth: 480,
          width: "100%",
          animation: shake ? "shakeX 0.4s ease" : "none",
        }}
      >
        <PremiumInput
          icon="🔍"
          size="lg"
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter 6-digit pincode"
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
          autoFocus
          disabled={loading}
          style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.1em",
          }}
        />
        <PremiumButton
          type="submit"
          size="lg"
          disabled={loading}
          style={{ flexShrink: 0 }}
          icon={loading ? (
            <span style={{ display: "inline-block", animation: "spin 0.8s linear infinite" }}>⟳</span>
          ) : (
            <span>🔍</span>
          )}
        >
          {loading ? "Searching" : "Search"}
        </PremiumButton>
      </form>
    </>
  );
}