const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const router = express.Router();

const FRONTEND = process.env.FRONTEND_URL || "http://localhost:5173";
const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";
// Use explicit GOOGLE_CALLBACK_URL if set, otherwise construct from BACKEND
const CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL || `${BACKEND}/auth/google/callback`;

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: CALLBACK_URL,
      },
      (accessToken, refreshToken, profile, done) => {
        const user = {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          avatar: profile.photos?.[0]?.value,
        };
        return done(null, user);
      }
    )
  );
} else {
  console.warn(
    "⚠️  GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set — OAuth disabled."
  );
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// GET /auth/google — initiate OAuth flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// GET /auth/google/callback — OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND}/auth?error=1`,
  }),
  (req, res) => res.redirect(FRONTEND)
);

// GET /auth/me — check current session
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) return res.json({ user: req.user });
  res.json({ user: null });
});

// GET /auth/logout — destroy session
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.error("Logout error:", err);
    res.redirect(FRONTEND);
  });
});

module.exports = router;
