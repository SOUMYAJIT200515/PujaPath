# PujaPath REST API Documentation

Base URL: `http://localhost:8080/api`

---

## 1. Pandal Directory Endpoints

### `GET /api/pandals`
Retrieves all pandals in the directory.

**Query Parameters:**
- `category` (optional): Filter by category (`heritage`, `traditional`, `theme`, `famous`)

**Response (`200 OK`):**
```json
[
  {
    "id": "bagbazar-sarbojanin",
    "name": "Bagbazar Sarbojanin Durgotsav",
    "bengaliName": "বাগবাজার সর্বজনীন দুর্গোৎসব",
    "address": "7/1, Bagbazar St, Bagbazar, Kolkata 700003",
    "neighbourhood": "Bagbazar",
    "nearestMetro": "Shyambazar Metro (Gate 1, 750m)",
    "latitude": 22.6023,
    "longitude": 88.3664,
    "category": "traditional",
    "yearEstablished": 1919,
    "crowdLevel": "high",
    "crowdFreshnessMinutes": 18,
    "crowdReportCount": 42,
    "rating": 4.90
  }
]
```

---

### `GET /api/pandals/nearby`
Finds pandals within a given radius using Haversine calculation.

**Query Parameters:**
- `lat` (required): User's latitude (e.g. `22.5971`)
- `lng` (required): User's longitude (e.g. `88.3675`)
- `radiusKm` (optional, default `3.0`): Search radius in kilometres

---

### `GET /api/pandals/search`
Searches pandals by name, Bengali name, neighbourhood, or metro station.

**Query Parameters:**
- `q` (required): Search query string (e.g. `kumartuli`)

---

## 2. Crowd and Queue Reports

### `POST /api/crowd-reports`
Submits a timestamped community queue report.

**Request Body:**
```json
{
  "pandalId": "kumartuli-park",
  "pandalName": "Kumartuli Park Sarbojanin",
  "crowdLevel": "very_high",
  "waitTimeMinutes": 45,
  "reporterName": "Subir Sen",
  "comment": "Main gate line slow, entry redirected via Rabindra Sarani",
  "timestamp": 1728801500000,
  "source": "community"
}
```

**Response (`200 OK`):**
```json
{
  "id": 1,
  "pandalId": "kumartuli-park",
  "crowdLevel": "very_high",
  "waitTimeMinutes": 45,
  "timestamp": 1728801500000,
  "source": "community"
}
```

---

## 3. Route Optimization

### `POST /api/itineraries/optimize`
Calculates an optimal stop sequence minimizing total travel time using Nearest-Neighbor + 2-Opt TSP heuristic.

**Request Body:**
```json
{
  "startLat": 22.6001,
  "startLng": 88.3712,
  "startName": "Shyambazar 5-Point Crossing",
  "timeBudgetHours": 5,
  "budgetPerPerson": 500,
  "transportMode": "WALKING",
  "preferredCategories": ["heritage", "traditional", "theme", "famous"],
  "maxStops": 5
}
```

**Response (`200 OK`):**
```json
{
  "id": "itin-e48f10ab",
  "title": "North Kolkata Tour (5 Pandals, 5h)",
  "totalDistanceKm": 3.82,
  "totalTimeMinutes": 245,
  "isRealistic": true,
  "stops": [
    {
      "stopOrder": 1,
      "pandal": {
        "id": "nalin-sarkar-street",
        "name": "Nalin Sarkar Street Sarbojanin"
      },
      "estimatedArrival": "+00h 15m",
      "travelTimeMinutes": 8,
      "visitDurationMinutes": 40,
      "completed": false
    }
  ]
}
```

---

## 4. Group Hopping & Live Location

### `POST /api/groups`
Creates a new squad.

**Request Body:**
```json
{
  "name": "Shyambazar Night Hoppers",
  "meetingPoint": "Shyambazar Metro Gate 1",
  "emergencyContact": "100 / 112"
}
```

---

### `POST /api/groups/{id}/location`
Updates a member's opt-in live location with explicit consent flag.

**Request Body:**
```json
{
  "userId": "usr-8a9d10e",
  "lat": 22.5975,
  "lng": 88.3648,
  "accuracy": 15.0,
  "isSharing": true
}
```

---

## 5. Expenses

### `POST /api/groups/{groupId}/expenses`
Logs an expense for group splitting.

**Request Body:**
```json
{
  "category": "food_bhog",
  "description": "Hatibagan Kathi Rolls & Puchka",
  "amount": 280.00,
  "paidByMemberId": "usr-8a9d10e",
  "paidByName": "Anirban"
}
```
