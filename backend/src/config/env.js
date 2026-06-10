// PinPoint India 2.0 — Environment Configuration
// Single source of truth for all env vars + API URLs.

const env = {
  // ── Server ───────────────────────────────────────────────
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT:     parseInt(process.env.PORT || '5000', 10),
  isDev:    process.env.NODE_ENV !== 'production',
  isProd:   process.env.NODE_ENV === 'production',

  // ── URLs ─────────────────────────────────────────────────
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  BACKEND_URL:  process.env.BACKEND_URL  || 'http://localhost:5000',

  // ── OpenWeather (FREE tier — 2.5, NOT paid 4.0) ──────────
  OPENWEATHER_API_KEY:  process.env.OPENWEATHER_API_KEY || null,
  OPENWEATHER_BASE_URL: 'https://api.openweathermap.org/data/2.5',

  // ── OpenRouter AI ────────────────────────────────────────
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || null,

  // ── models.dev (no key required) ─────────────────────────
  MODELS_DEV_URL:       'https://models.dev/api.json',
  MODELS_DEV_LOGOS_URL: 'https://models.dev/logos',

  // ── MongoDB Atlas (optional) ─────────────────────────────
  MONGODB_URI: process.env.MONGODB_URI || null,

  // ── Redis Cloud (optional) ───────────────────────────────
  REDIS_URL: process.env.REDIS_URL || null,

  // ── Google OAuth (session-based, no JWT) ─────────────────
  GOOGLE_CLIENT_ID:     process.env.GOOGLE_CLIENT_ID     || null,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || null,
  // FIX: was /api/v1/auth/google/callback — wrong path
  GOOGLE_CALLBACK_URL:  process.env.GOOGLE_CALLBACK_URL  || 'http://localhost:5000/auth/google/callback',
  SESSION_SECRET:       process.env.SESSION_SECRET        || 'pinpoint-dev-secret',

  // ── MapTiler (frontend only — checked via VITE_MAPTILER_KEY) ─
  // Backend does not need this key — removing MAPBOX_TOKEN typo
  MAPTILER_KEY: process.env.MAPTILER_KEY || null,

  // ── Sentry ───────────────────────────────────────────────
  SENTRY_DSN: process.env.SENTRY_DSN || null,
};

module.exports = env;
