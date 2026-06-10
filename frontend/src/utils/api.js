import axios from "axios";

// In dev, VITE_API_URL is not set → uses Vite proxy (/api → localhost:5000)
// In prod, VITE_API_URL = https://your-backend.vercel.app/api
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true, // Required for session cookies (Google OAuth)
});

// Response error interceptor for unified error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.code === "ECONNABORTED") {
      err.message = "Request timed out. Please try again.";
    }
    return Promise.reject(err);
  }
);

export async function fetchPincode(pin) {
  const { data } = await api.get(`/pincode/${pin}`);
  return data;
}

export async function fetchWeather(city) {
  const encoded = encodeURIComponent(city);
  const { data } = await api.get(`/weather?city=${encoded}`);
  return data;
}

export async function fetchAIInsight(payload) {
  const { data } = await api.post("/ai/location-insight", payload);
  return data;
}

export default api;
