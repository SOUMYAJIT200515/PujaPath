# Google Maps Platform Setup Guide for PujaPath

This guide covers setting up, configuring, and restricting your Google Maps Platform credentials for **PujaPath: Live Durga Puja Pandal Hopping Navigator**.

---

## 1. Google Cloud Project & Billing Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new Google Cloud Project (e.g. `pujapath-kolkata`).
3. Link a **Billing Account** to the project:
   - Google provides a **$200 recurring monthly credit** for Google Maps Platform, covering ample requests for testing, staging, and small-to-medium deployments.
   - Without billing enabled, API calls return `ApiProjectMapError` or `BillingNotEnabledMapError`.

---

## 2. Enabling Required Google Maps APIs

Enable the following APIs in the [API Library](https://console.cloud.google.com/apis/library):

1. **Maps JavaScript API**
   - Renders interactive vector and raster maps, custom `AdvancedMarkerElement` festival pins, InfoWindows, and viewport camera animations.
2. **Places API (New)**
   - Powers pandal address autocompletion and place details.
3. **Routes API**
   - Calculates routes, multi-stop waypoints, encoded polylines, and realistic travel durations for walking, public transit (metro/bus), and driving.

---

## 3. Creating & Restricting API Keys

Never use an unrestricted API key in production. Always create separate client and server keys.

### A. Browser Client Key (`VITE_GOOGLE_MAPS_API_KEY`)

1. Go to **APIs & Services > Credentials**.
2. Click **Create Credentials > API Key**.
3. Under **Application restrictions**:
   - Choose **Websites** (HTTP referrers).
   - Add your authorized domains:
     - `http://localhost:3000/*`
     - `http://localhost:5173/*`
     - `https://your-production-app.vercel.app/*`
     - `https://*.run.app/*`
4. Under **API restrictions**:
   - Select **Restrict key**.
   - Select only:
     - `Maps JavaScript API`
     - `Places API (New)`
     - `Routes API`
5. Save the key and set it in your `.env`:
   ```bash
   VITE_GOOGLE_MAPS_API_KEY="AIzaSy..."
   ```

### B. Cloud Map ID Setup (`mapId`)

For modern `AdvancedMarkerElement` to render correctly without console deprecation errors:
1. Go to **Google Maps Platform > Map Management** in the Cloud Console.
2. Create a Map ID:
   - Name: `PujaPath North Kolkata`
   - Map Type: `JavaScript`
   - Raster/Vector: `Vector`
3. If not using a custom Cloud Map ID, PujaPath defaults to `"DEMO_MAP_ID"`.

---

## 4. Quotas, Cost Optimization & Fallback Behavior

1. **Session Tokens:**
   - Always group autocomplete and place details lookups under an `AutocompleteSessionToken` to be billed at the single session SKU rather than per-keystroke.
2. **Daily Quota Capping:**
   - Set daily budget alerts under **Billing > Budgets & alerts** to prevent surprise charges during festive traffic spikes.
3. **Fallback in PujaPath:**
   - If no API key is provided or quota is exceeded, PujaPath automatically falls back to an interactive list and detail directory view without crashing.
   - When quota reaches limits, a sticky non-intrusive warning banner appears (`gmp-quota-exceeded` event listener in `src/main.tsx`).
