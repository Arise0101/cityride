# CITYRIDE — Smart City Bus Management System

**Tagline:** *"Your City. Your Bus. Your Ride."*

CITYRIDE is a commercial-grade, full-stack Smart City Bus Management System built for **Passengers**, **Drivers**, and **Administrators**.

---

## 🌟 Key Features

### 📱 1. Passenger Mobile & Responsive Web Application
- **Splash & Onboarding**: 3-step carousel ("Find Your Bus", "Track in Real Time", "Travel Smarter").
- **Passenger Home Dashboard**: Greetings, destination search bar, quick action shortcuts, nearby bus stops with distance & ETAs, live bus carousel.
- **Live Bus Tracking (Interactive Leaflet Map)**: Real-time 5G simulated telemetry feed with moving bus markers, stop pins, and polyline routes.
- **Bus & Route Search**: Filter by bus number (e.g. `BUS-102`), route, and stop locations; view detailed arrival timelines.
- **CityRide AI Assistant**: Conversational AI route navigator powered by the **Gemini API** and intelligent fallback routing engine.
- **AI ETA & Delay Predictor**: Machine learning arrival time calculations factoring traffic congestion, speed, and weather.
- **Smart Lost & Found Hub**: Report lost items with image upload simulation, AI auto-tagging (`#black`, `#wallet`, `#leather`), and match alerts.
- **Notifications & Profile**: Saved routes, favorite stops, FCM notification toggles, and travel history.

### 🚍 2. Driver Application
- **Shift Dashboard**: Assigned bus (BUS-102) & route details, driver status, rating, shift timing.
- **Active Trip HUD**: Start Trip, Pause Trip, and End Trip controls with real-time GPS telemetry transmission.
- **Incident & Delay Reporter**: One-click broadcast for Traffic Congestion, Breakdown, Accident, and Detour alerts to Admin Control.

### 📊 3. Admin Desktop Dashboard
- **Analytics Overview**: High-impact KPI cards (Total Buses, Active Buses, Active Drivers, Passengers, Trips Today, Delayed Buses) + Chart.js visualizations.
- **Live Fleet Radar Map**: Fullscreen fleet tracking with status filters and bus detail cards.
- **Bus Fleet CRUD**: Add bus modal, edit registration/route/driver linkage, delete bus, toggle active/delayed/maintenance status.
- **Driver Management**: Register drivers, license tracking, shift assignment.
- **Route & Stop Corridor Manager**: Interactive route stop sequencing and distance/duration configuration.
- **Lost & Found AI Match Panel**: Review lost vs found items, view AI confidence scores (e.g., 94% match), and trigger passenger notification claims.
- **AI Analytics**: Machine learning accuracy rates, route delay analysis charts, and congestion bottleneck metrics.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Lucide React Icons, Leaflet / React-Leaflet, Chart.js / React-Chartjs-2, AppContext State Management.
- **Backend**: Node.js, Express.js REST APIs, WebSocket Telemetry Stream server (`ws`).
- **Database**: Supabase PostgreSQL schema (`database/schema.sql`) and sample seed dataset (`database/seed.sql`).
- **AI Engine**: Gemini API service bridge, XGBoost/RandomForest simulated ETA predictor matrix, Lost & Found AI tagger.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Frontend & Backend (Concurrent Mode)
```bash
# Runs frontend on http://localhost:3000 and backend API/WebSocket on http://localhost:5000
npm start
```

Or run frontend separately:
```bash
npm run dev
```

And backend server:
```bash
npm run server
```

---

## 🗄️ Database Architecture (`/database`)

- `schema.sql`: Contains 15 PostgreSQL tables (`users`, `passengers`, `drivers`, `buses`, `routes`, `stops`, `route_stops`, `schedules`, `trips`, `gps_locations`, `notifications`, `lost_items`, `found_items`, `lost_found_matches`, `ai_predictions`).
- `seed.sql`: Includes initial data for Central City routes, drivers, buses, stops, and lost items.

---

## 🌐 API Endpoints

- `GET /api/buses` - Retrieve all buses
- `POST /api/buses` - Add a new bus
- `GET /api/routes` - Retrieve all routes
- `GET /api/drivers` - Retrieve driver directory
- `POST /api/ai/assistant` - Query CityRide AI Assistant (Gemini API)
- `POST /api/ai/predict-eta` - Generate ML ETA predictions
- `GET /api/lost-found` - Retrieve lost and found reports
- `POST /api/lost-found/report` - Submit lost/found item with AI auto-tagging
