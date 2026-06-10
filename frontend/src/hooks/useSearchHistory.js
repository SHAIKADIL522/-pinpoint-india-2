import { useState, useEffect } from "react";

const KEY = "pinpoint_history";
const MAX = 10;

export function useSearchHistory() {
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
    catch { return []; }
  });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(history)); }, [history]);

  function addSearch(item) {
    setHistory(prev => {
      const filtered = prev.filter(h => h.pincode !== item.pincode);
      return [{ ...item, searchedAt: new Date().toISOString() }, ...filtered].slice(0, MAX);
    });
  }

  function clearHistory() { setHistory([]); }

  return { history, addSearch, clearHistory };
}
