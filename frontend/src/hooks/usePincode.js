import { useState, useCallback } from "react";
import { fetchPincode } from "../utils/api";

export function usePincode() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (pin) => {
    if (!pin || !/^\d{6}$/.test(pin)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await fetchPincode(pin);
      setData(result);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch pincode data.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, search, reset };
}
