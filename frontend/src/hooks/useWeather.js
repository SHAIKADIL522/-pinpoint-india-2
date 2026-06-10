import { useState, useCallback } from "react";
import { getWeather } from "../services/weatherService";

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeather(city);
      setWeather(data);
    } catch (err) {
      setError(err.response?.data?.error || "Weather unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  return { weather, loading, error, fetchWeather };
}
