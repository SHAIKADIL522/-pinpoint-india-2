// PinPoint India 2.0 — Feature Flags
// Auto-detects available services. Missing keys = graceful disable.

const features = {
  weather: {
    enabled: Boolean(process.env.OPENWEATHER_API_KEY),
    label: "OpenWeather",
  },
  ai: {
    enabled: Boolean(process.env.OPENROUTER_API_KEY),
    label: "OpenRouter AI",
  },
  models: {
    enabled: true,
    label: "models.dev AI Explorer",
  },
  mongodb: {
    enabled: Boolean(process.env.MONGODB_URI),
    label: "MongoDB Atlas",
  },
  redis: {
    enabled: Boolean(process.env.REDIS_URL),
    label: "Redis Cloud",
  },
  auth: {
    // Session-based OAuth — NO JWT_SECRET needed
    enabled: Boolean(
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
    ),
    label: "Google OAuth",
  },
  maps: {
    enabled: false,
    label: "MapTiler Geo Engine",
  },
  errorTracking: {
    enabled: Boolean(process.env.SENTRY_DSN),
    label: "Sentry Error Tracking",
  },
};

function logFeatureStatus() {
  console.log("\n📦 PinPoint India 2.0 — Feature Status:");
  Object.entries(features).forEach(([key, { enabled, label }]) => {
    const icon = enabled ? "✅" : "⚪";
    console.log(
      `  ${icon} ${label} (${key}): ${enabled ? "ENABLED" : "DISABLED — missing env var"}`,
    );
  });
  console.log("");
}

module.exports = { features, logFeatureStatus };
