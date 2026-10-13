# 🪔 PujaPath — Live Durga Puja Pandal Hopping Navigator

**PujaPath (পূজাপথ)** is a responsive, mobile-first web application designed to help pilgrims and visitors navigate the magnificent Durga Puja pandals of Kolkata (with special focus on the heritage-rich North Kolkata cluster). It combines real-time browser GPS location, interactive Google Maps, intelligent route optimization, crowdsourced queue delays, group hopping coordination, and per-person budget splitting.

---

## 🌟 Key Features

1. **Live GPS Location & Compass**:
   - High-accuracy geolocation tracking via `navigator.geolocation.watchPosition()`.
   - Real-time pulsating blue-dot position marker with GPS accuracy ring and timestamp.
   - Dynamic Haversine distance and estimated walking/metro travel time to each pandal.
   - Clear permission handling, privacy protection, and one-tap manual transit hub fallback (Shyambazar, Sovabazar, Howrah Station, Howrah Maidan underwater metro).

2. **Interactive Google Maps Integration**:
   - Modern promise-based `@vis.gl/react-google-maps` implementation.
   - `AdvancedMarkerElement` pins featuring custom Durga Puja iconography, visited badges, itinerary numbers, and crowd color indicators.
   - Interactive InfoWindows detailing Bengali title, nearest metro gate, live crowd status, and direct deep-links to native Google Maps navigation.
   - Modern Routes API polyline rendering for walking, transit, and taxi travel.

3. **North Kolkata Pandal Directory**:
   - Verified seed records:
     - **Bagbazar Sarbojanin Durgotsav** (105+ years Sabeki idol in Daaker Saaj)
     - **Kumartuli Park Sarbojanin** (Sculptors' colony art installations)
     - **Ahiritola Sarbojanin Durgotsav** (Ganga riverside landmark)
     - **Shobhabazar Rajbari** (Raja Nabakrishna Deb's 1757 Bonedi mansion)
     - **Kashi Bose Lane Durga Puja** (Multi-award winning theme pioneer)
     - **Hatibagan Sarbojanin** (Historic theatre corridor)
     - **Nalin Sarkar Street** (Natural indigenous craft installations)
     - **Simla Vyayam Samiti** (Freedom fighter heritage & traditional Pratima)
     - **Telengabagan Sarbojanin** (Monumental structural illumination)
     - **Manicktalla Chaltabagan Lohapatty** (High-voltage Dhunuchi dance & communal harmony)
     - **College Square** (Ethereal water reflection illumination)
     - **Mohammad Ali Park** (Grand royal palace replica)
   - Verified coordinates, establishment history, daily puja timings, Pushpanjali and Bhog hours, and accessibility information (wheelchair access, senior citizen queue, pass entrance).

4. **Smart Puja Route Planner (Itinerary Builder)**:
   - Starting point selection (Current GPS, Shyambazar 5-Point, Howrah Station, Howrah Maidan).
   - Custom time constraints: 3, 5, 8, or 12 hours.
   - Per-person budget and transport mode (Walking, Metro, Yellow Taxi).
   - Heuristic Traveling Salesperson optimizer (Nearest Neighbor + 2-Opt) that factors in **visiting duration + real-time crowd queue delays**.
   - Feasibility warning when itinerary exceeds time limits due to crowd delays.
   - Reorder stops, delete stops, and copy shareable itinerary text.

5. **Live Crowd and Queue Reporting**:
   - Status levels: Low (<15m), Moderate (15-35m), High (35-60m), Very High (>60m).
   - Community-submitted field reports with freshness decay (45-minute validity window) and rate limiting.

6. **Group Hopping ("Puja Squad")**:
   - Squad invite passcode and join link.
   - **Consent-based Live Location Sharing**: Opt-in only, clearly labeled, with instantaneous revocation.
   - Mutual visited checklist synchronization.
   - Stale GPS warnings (> 10 minutes) and designated rendezvous point.

7. **Hopper Budget Tracker & Expense Splitter**:
   - Per-head budget tracker with visual progress meter.
   - Categorized expenses: Metro/Train, Taxi/Auto, Food & Mishti, Puja Pass/VIP, Emergency.
   - Equal group splitting calculator.

8. **Official Helplines & SOS**:
   - Kolkata Police Lalbazar Control Room (100 / 112).
   - Traffic Police Puja Diversions Helpline (1073).
   - Women & Child Safety (Tejaswini Squad 1091).
   - Medical Ambulance (102 / 108).
   - Kolkata Metro Rail Helpline (139).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React |
| **Maps** | Google Maps JavaScript API, Places API (New), Routes API (`@vis.gl/react-google-maps`) |
| **Backend** | Java 17+, Spring Boot 3.3.x, Spring Data JPA, Spring Security, JWT (jjwt) |
| **Database** | MySQL 8.0+ / H2 In-Memory (for testing) |
| **Deployment** | Vercel / Cloud Run (Frontend), Cloud Run / AWS / Railway (Backend) |

---

## 🚀 Quickstart Guide

### 1. Frontend Setup

```bash
# Clone the repository
git clone <repo-url>
cd pujapath

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Set VITE_GOOGLE_MAPS_API_KEY with your Google Maps API key

# Run development server
npm run dev
# The application will be running on http://localhost:3000
```

### 2. Backend Setup (Spring Boot)

```bash
cd backend

# Configure database credentials in .env or backend/src/main/resources/application.properties
# Start MySQL server and create database:
# mysql -u root -p < schema.sql

# Run Spring Boot application
./mvnw spring-boot:run
# Server runs on http://localhost:8080
```

---

## 🧪 Testing

### Frontend Unit Tests:
```bash
npx tsx tests/geoUtils.test.ts
npx tsx tests/routeOptimizer.test.ts
```

### Backend Unit & Integration Tests:
```bash
cd backend
./mvnw test
```

---

## 📋 Implementation Status Matrix

| Feature | Status | Notes |
|---|---|---|
| Live GPS Watch Tracking | **Implemented** | Real browser geolocation with accuracy and fallback |
| Google Maps Integration | **Implemented** | Vector maps with `AdvancedMarkerElement` and quota defense |
| North Kolkata Directory | **Implemented** | 12 verified heritage & modern pandals with timings |
| Smart Multi-Stop Planner | **Implemented** | Nearest Neighbor + 2-Opt with queue delay buffers |
| Native Google Maps Navigation | **Implemented** | One-tap launch with walking/driving directions |
| Visited & Starred Persistence | **Implemented** | LocalStorage state and mutual squad sync |
| Live Crowd Reports | **Implemented** | Timestamped community reporting with freshness metadata |
| Group Hopping Mode | **Implemented** | Invite codes, meeting points, opt-in location sharing |
| Budget & Expense Splitter | **Implemented** | Per-person tracking with equal expense division |
| Spring Boot REST Backend | **Implemented** | Full JPA entities, controllers, services, security, JWT |
| MySQL Schema & Seeds | **Implemented** | `schema.sql` and `seed.sql` included |
| Real-time WebSocket Broker | **Optional / Ready** | Polling & SSE-ready endpoints implemented in backend |
