# PinPoint India 2.0

Full-stack Indian pincode lookup platform with AI insights, live weather, MapLibre maps, Google OAuth, and Sentry monitoring.

## Stack

**Frontend:** React 18, Vite 5, React Router v6, Framer Motion, Leaflet/MapLibre GL, Recharts, Axios  
**Backend:** Node.js 18+, Express, Passport.js (Google OAuth), OpenWeather One Call 4.0  

## Quick Start

### 1. Backend
```bash
cd backend
cp .env.example .env
# Fill in your API keys in .env
npm install
npm run dev
# Runs on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env
# Only VITE_MAPTILER_KEY needed for maps (optional)
npm install
npm run dev
# Runs on http://localhost:5173
```

## Environment Variables

### Backend `.env`
| Key | Required | Source |
|-----|----------|--------|
| `OPENWEATHER_API_KEY` | Yes | [openweathermap.org](https://openweathermap.org) |
| `OPENROUTER_API_KEY` | Yes | [openrouter.ai](https://openrouter.ai) |
| `GOOGLE_CLIENT_ID` | OAuth | [console.cloud.google.com](https://console.cloud.google.com) |
| `GOOGLE_CLIENT_SECRET` | OAuth | same |
| `SESSION_SECRET` | Yes | any random string |
| `SENTRY_DSN` | Optional | [sentry.io](https://sentry.io) |

### Frontend `.env`
| Key | Required | Notes |
|-----|----------|-------|
| `VITE_API_URL` | Prod only | Set to backend Vercel URL |
| `VITE_MAPTILER_KEY` | Maps | [maptiler.com](https://maptiler.com) |
| `VITE_SENTRY_DSN` | Optional | Sentry frontend DSN |

## Deploy to Vercel

### Backend
1. Import `backend/` folder as separate Vercel project
2. Set all env vars in Vercel dashboard
3. Set `GOOGLE_CALLBACK_URL=https://your-backend.vercel.app/auth/google/callback`
4. Set `FRONTEND_URL=https://your-frontend.vercel.app`

### Frontend
1. Import `frontend/` folder as separate Vercel project
2. Set `VITE_API_URL=https://your-backend.vercel.app/api`
3. vercel.json handles SPA routing automatically

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/pincode/:pin` | Pincode lookup |
| `GET /api/weather?city=` | Current weather (legacy) |
| `GET /api/v1/weather/current?lat=&lon=` | Current weather v1 |
| `GET /api/v1/weather/daily?lat=&lon=` | 7-day forecast |
| `GET /api/v1/weather/hourly?lat=&lon=` | Hourly forecast |
| `GET /api/places/nearby?lat=&lon=` | Nearby places |
| `POST /api/ai/location-insight` | AI location insight |
| `GET /auth/google` | Google OAuth initiate |
| `GET /auth/me` | Current user session |
| `GET /auth/logout` | Logout |

## Features

- 🔍 Instant 6-digit pincode lookup (postalpincode.in)  
- 🌡️ Live weather + 7-day forecast (OpenWeather)  
- ✨ AI location insights (OpenRouter/Gemini Flash)  
- 🗺️ Leaflet dark map + MapLibre GL (feature-flagged)  
- 📍 Nearby places (Overpass API)  
- 🔐 Google OAuth with session persistence  
- ⭐ Favorites + search history (localStorage)  
- 🐞 Sentry error tracking (optional)  
