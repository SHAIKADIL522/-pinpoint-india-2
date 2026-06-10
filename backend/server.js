require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const passport = require("passport");

const { tryInitSentry, errorHandler: sentryErrorHandler } = require("./src/middleware/sentry");
const { logFeatureStatus } = require("./src/config/features");
const env = require("./src/config/env");

// Route modules
const pincodeRoutes = require("./src/routes/pincode");
const weatherV1Routes = require("./src/routes/weatherV1");   // new v1 weather (One Call 4.0)
const legacyWeatherRoutes = require("./src/routes/weather"); // legacy /api/weather?city=
const aiRoutes = require("./src/routes/ai");
const placesRoutes = require("./src/routes/places");
const authRoutes = require("./src/routes/auth");

const app = express();

// ── Sentry (no-op if SENTRY_DSN not set) ────────────────────
tryInitSentry(app);

// ── Core middleware ──────────────────────────────────────────
app.use(express.json());

const allowedOrigins = [
  env.FRONTEND_URL,
  "https://pinpoint-india-2-5o7e.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) =>
      !origin || allowedOrigins.includes(origin)
        ? cb(null, true)
        : cb(new Error("CORS blocked: " + origin)),
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "pinpoint-india-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.isProd,
      sameSite: env.isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ── Rate limiting ────────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. Please try again later." },
  })
);

// ── Routes ───────────────────────────────────────────────────
app.use("/api/pincode", pincodeRoutes);
app.use("/api/v1/weather", weatherV1Routes);   // GET /api/v1/weather/current|hourly|daily|location
app.use("/api/weather", legacyWeatherRoutes);  // legacy GET /api/weather?city= (WeatherCard compat)
app.use("/api/ai", aiRoutes);
app.use("/api/places", placesRoutes);
app.use("/auth", authRoutes);

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString(), env: env.NODE_ENV })
);

// ── Error handlers ───────────────────────────────────────────
app.use(sentryErrorHandler());
app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(env.PORT, () => {
  console.log(`\n✅ PinPoint India 2.0 backend → http://localhost:${env.PORT}`);
  logFeatureStatus();
});
