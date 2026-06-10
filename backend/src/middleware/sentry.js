// Sentry middleware — only initializes if SENTRY_DSN env var is set
let Sentry = null;

function tryInitSentry(app) {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  try {
    Sentry = require("@sentry/node");
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV || "development",
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
    });
    app.use(Sentry.Handlers.requestHandler());
    console.log("✅ Sentry initialized");
  } catch (e) {
    console.warn("Sentry init failed (not installed?):", e.message);
    Sentry = null;
  }
}

function errorHandler() {
  if (!Sentry) return (err, req, res, next) => next(err);
  return Sentry.Handlers.errorHandler();
}

module.exports = { tryInitSentry, errorHandler };
