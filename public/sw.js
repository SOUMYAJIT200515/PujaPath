/**
 * PujaPath Service Worker with Cache API
 * Provides offline support for downloaded itineraries and pandal locations
 * during Durga Puja in network-congested crowd zones across Kolkata.
 */

const STATIC_CACHE_NAME = 'pujapath-static-v1';
const DATA_CACHE_NAME = 'pujapath-offline-data-v1';

// Essential static resources for app shell
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];

// Offline fallback JSON responses
const OFFLINE_ITINERARY_ENDPOINT = '/offline/downloaded-itinerary.json';
const OFFLINE_PANDALS_ENDPOINT = '/offline/pandal-locations.json';

// Install event: Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn('[ServiceWorker] Some precache assets were not found:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event: Clean up legacy caches & take immediate control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== STATIC_CACHE_NAME && name !== DATA_CACHE_NAME) {
              return caches.delete(name);
            }
            return null;
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event: Serve cached assets and handle offline fallback
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Intercept specific offline data endpoints from Cache API
  if (
    url.pathname === OFFLINE_ITINERARY_ENDPOINT ||
    url.pathname === OFFLINE_PANDALS_ENDPOINT
  ) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return new Response(JSON.stringify({ error: 'Not in cache' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
        });
      })
    );
    return;
  }

  // 2. Navigation requests: Network-first with cache fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // 3. Static assets & Google fonts / icons
  if (
    url.origin === location.origin ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('unsplash.com')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Stale-while-revalidate in background if online
          if (navigator.onLine) {
            fetch(event.request)
              .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                  caches.open(STATIC_CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                  });
                }
              })
              .catch(() => {
                // Ignore background revalidate network errors
              });
          }
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            if (
              !networkResponse ||
              networkResponse.status !== 200 ||
              networkResponse.type === 'opaque'
            ) {
              return networkResponse;
            }
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return networkResponse;
          })
          .catch(() => {
            // Offline fallback
            return caches.match(event.request);
          });
      })
    );
  }
});

// Message listener for client cache synchronization via Cache API
self.addEventListener('message', (event) => {
  if (!event.data || !event.data.type) return;

  if (event.data.type === 'CACHE_ITINERARY_DATA') {
    const itineraryData = event.data.payload;
    caches.open(DATA_CACHE_NAME).then((cache) => {
      const response = new Response(JSON.stringify(itineraryData), {
        headers: {
          'Content-Type': 'application/json',
          'X-Cached-At': new Date().toISOString(),
          'X-Cached-By': 'PujaPath-CacheAPI',
        },
      });
      cache.put(new Request(OFFLINE_ITINERARY_ENDPOINT), response).then(() => {
        event.ports[0]?.postMessage({ success: true, timestamp: Date.now() });
      });
    });
  }

  if (event.data.type === 'CACHE_PANDAL_LOCATIONS') {
    const pandalsData = event.data.payload;
    caches.open(DATA_CACHE_NAME).then((cache) => {
      const response = new Response(JSON.stringify(pandalsData), {
        headers: {
          'Content-Type': 'application/json',
          'X-Cached-At': new Date().toISOString(),
          'X-Cached-By': 'PujaPath-CacheAPI',
        },
      });
      cache.put(new Request(OFFLINE_PANDALS_ENDPOINT), response).then(() => {
        event.ports[0]?.postMessage({ success: true, count: pandalsData.length });
      });
    });
  }

  if (event.data.type === 'GET_CACHE_STATUS') {
    caches.open(DATA_CACHE_NAME).then(async (cache) => {
      const itinRes = await cache.match(OFFLINE_ITINERARY_ENDPOINT);
      const pandalsRes = await cache.match(OFFLINE_PANDALS_ENDPOINT);
      event.ports[0]?.postMessage({
        hasItinerary: Boolean(itinRes),
        hasPandals: Boolean(pandalsRes),
        itinDate: itinRes?.headers.get('X-Cached-At') || null,
        pandalsDate: pandalsRes?.headers.get('X-Cached-At') || null,
      });
    });
  }

  if (event.data.type === 'CLEAR_OFFLINE_CACHE') {
    caches.delete(DATA_CACHE_NAME).then(() => {
      event.ports[0]?.postMessage({ success: true });
    });
  }
});
