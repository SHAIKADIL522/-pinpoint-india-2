import api from "../utils/api";

export async function getWeather(city) {
  const { data } = await api.get(`/weather?city=${encodeURIComponent(city)}`);
  return data;
}

export function getWeatherHighlights(weather) {
  const highlights = [];
  if (!weather) return highlights;

  if (weather.temp > 35) highlights.push({ icon: "🌡️", label: "Feels Hot", desc: "Carry water and stay hydrated.", color: "#f97316" });
  else if (weather.temp < 15) highlights.push({ icon: "🧊", label: "Cold Weather", desc: "Wear warm clothing outdoors.", color: "#60a5fa" });
  else highlights.push({ icon: "😊", label: "Pleasant Weather", desc: "Great conditions to be outside.", color: "#10b981" });

  if (weather.humidity > 75) highlights.push({ icon: "💧", label: "High Humidity", desc: "It might feel warm and humid.", color: "#3b82f6" });
  else if (weather.humidity < 30) highlights.push({ icon: "🏜️", label: "Very Dry", desc: "Stay hydrated and use moisturiser.", color: "#f59e0b" });

  if (weather.windSpeed > 10) highlights.push({ icon: "💨", label: "Strong Wind", desc: `Wind at ${weather.windSpeed} m/s — secure loose items.`, color: "#8b5cf6" });
  else highlights.push({ icon: "🌬️", label: "Moderate Wind", desc: "Wind speed is comfortable.", color: "#6b7280" });

  const rain = ["Rain", "Drizzle", "Thunderstorm"];
  if (rain.includes(weather.main)) highlights.push({ icon: "🌧️", label: "Rain Expected", desc: "Carry an umbrella today.", color: "#60a5fa" });
  else highlights.push({ icon: "☀️", label: "Low Chance of Rain", desc: "No rain expected in the next 6 hours.", color: "#fbbf24" });

  return highlights.slice(0, 4);
}
