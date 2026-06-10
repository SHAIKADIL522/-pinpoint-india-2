import { useState, useEffect } from "react";

const KEY = "pinpoint_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(favorites));
  }, [favorites]);

  function addFavorite(item) {
    setFavorites((prev) => {
      if (prev.find((f) => f.pincode === item.pincode)) return prev;
      return [item, ...prev];
    });
  }

  function removeFavorite(pincode) {
    setFavorites((prev) => prev.filter((f) => f.pincode !== pincode));
  }

  function isFavorite(pincode) {
    return favorites.some((f) => f.pincode === pincode);
  }

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
