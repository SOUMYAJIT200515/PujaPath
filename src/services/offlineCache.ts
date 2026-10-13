import { Itinerary, Pandal } from '../types';

export const CACHE_API_DATA_NAME = 'pujapath-offline-data-v1';
export const ITINERARY_CACHE_ENDPOINT = '/offline/downloaded-itinerary.json';
export const PANDALS_CACHE_ENDPOINT = '/offline/pandal-locations.json';

const LOCAL_STORAGE_ITIN_KEY = 'pujapath_offline_itinerary_cache';
const LOCAL_STORAGE_PANDALS_KEY = 'pujapath_offline_pandals_cache';
const LOCAL_STORAGE_TIMESTAMP_KEY = 'pujapath_offline_cache_time';

export interface OfflineCacheStatus {
  isSupported: boolean;
  hasCachedItinerary: boolean;
  hasCachedPandals: boolean;
  pandalCount: number;
  itineraryTitle: string | null;
  stopCount: number;
  lastCachedAt: string | null;
}

/**
 * Register Service Worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.info('[PWA] Service Worker is not supported in this browser.');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    console.info('[PWA] Service Worker registered with scope:', registration.scope);
    return registration;
  } catch (error) {
    console.warn('[PWA] Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Cache downloaded itinerary into Service Worker Cache API
 */
export async function cacheDownloadedItinerary(
  itinerary: Itinerary
): Promise<boolean> {
  try {
    // 1. Direct Cache API storage
    if ('caches' in window) {
      const cache = await caches.open(CACHE_API_DATA_NAME);
      const dataPayload = {
        itinerary,
        cachedAt: new Date().toISOString(),
        version: '1.0',
      };
      const response = new Response(JSON.stringify(dataPayload), {
        headers: {
          'Content-Type': 'application/json',
          'X-Cached-At': new Date().toISOString(),
          'X-Cached-By': 'ServiceWorker-CacheAPI',
        },
      });
      await cache.put(new Request(ITINERARY_CACHE_ENDPOINT), response);
    }

    // 2. Post message to active Service Worker controller if available
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_ITINERARY_DATA',
        payload: itinerary,
      });
    }

    // 3. Keep localStorage mirror for instantaneous synchronous hydration
    localStorage.setItem(LOCAL_STORAGE_ITIN_KEY, JSON.stringify(itinerary));
    localStorage.setItem(LOCAL_STORAGE_TIMESTAMP_KEY, new Date().toISOString());

    window.dispatchEvent(new CustomEvent('pujapath_offline_cache_updated'));
    return true;
  } catch (err) {
    console.error('[CacheAPI] Failed to cache itinerary:', err);
    // Fallback solely to localStorage
    localStorage.setItem(LOCAL_STORAGE_ITIN_KEY, JSON.stringify(itinerary));
    return false;
  }
}

/**
 * Cache pandal locations and metadata into Service Worker Cache API
 */
export async function cachePandalLocations(
  pandals: Pandal[]
): Promise<boolean> {
  try {
    if ('caches' in window) {
      const cache = await caches.open(CACHE_API_DATA_NAME);
      const dataPayload = {
        pandals,
        count: pandals.length,
        cachedAt: new Date().toISOString(),
      };
      const response = new Response(JSON.stringify(dataPayload), {
        headers: {
          'Content-Type': 'application/json',
          'X-Cached-At': new Date().toISOString(),
          'X-Cached-By': 'ServiceWorker-CacheAPI',
        },
      });
      await cache.put(new Request(PANDALS_CACHE_ENDPOINT), response);
    }

    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_PANDAL_LOCATIONS',
        payload: pandals,
      });
    }

    localStorage.setItem(LOCAL_STORAGE_PANDALS_KEY, JSON.stringify(pandals));
    localStorage.setItem(LOCAL_STORAGE_TIMESTAMP_KEY, new Date().toISOString());

    window.dispatchEvent(new CustomEvent('pujapath_offline_cache_updated'));
    return true;
  } catch (err) {
    console.error('[CacheAPI] Failed to cache pandal locations:', err);
    localStorage.setItem(LOCAL_STORAGE_PANDALS_KEY, JSON.stringify(pandals));
    return false;
  }
}

/**
 * Retrieve downloaded itinerary from Cache API (with localStorage fallback)
 */
export async function getCachedItinerary(): Promise<Itinerary | null> {
  try {
    if ('caches' in window) {
      const cache = await caches.open(CACHE_API_DATA_NAME);
      const response = await cache.match(ITINERARY_CACHE_ENDPOINT);
      if (response) {
        const data = await response.json();
        if (data.itinerary) return data.itinerary;
        return data;
      }
    }

    const localData = localStorage.getItem(LOCAL_STORAGE_ITIN_KEY);
    if (localData) {
      return JSON.parse(localData);
    }
  } catch (err) {
    console.warn('[CacheAPI] Could not retrieve cached itinerary:', err);
  }
  return null;
}

/**
 * Retrieve cached pandal locations from Cache API (with localStorage fallback)
 */
export async function getCachedPandals(): Promise<Pandal[] | null> {
  try {
    if ('caches' in window) {
      const cache = await caches.open(CACHE_API_DATA_NAME);
      const response = await cache.match(PANDALS_CACHE_ENDPOINT);
      if (response) {
        const data = await response.json();
        if (Array.isArray(data.pandals)) return data.pandals;
        if (Array.isArray(data)) return data;
      }
    }

    const localData = localStorage.getItem(LOCAL_STORAGE_PANDALS_KEY);
    if (localData) {
      return JSON.parse(localData);
    }
  } catch (err) {
    console.warn('[CacheAPI] Could not retrieve cached pandals:', err);
  }
  return null;
}

/**
 * Query current offline cache status across Cache API & local storage
 */
export async function getOfflineCacheStatus(): Promise<OfflineCacheStatus> {
  const isSupported = typeof window !== 'undefined' && 'caches' in window;
  let hasCachedItinerary = false;
  let hasCachedPandals = false;
  let pandalCount = 0;
  let itineraryTitle: string | null = null;
  let stopCount = 0;
  let lastCachedAt: string | null = null;

  if (isSupported) {
    try {
      const cache = await caches.open(CACHE_API_DATA_NAME);
      const itinRes = await cache.match(ITINERARY_CACHE_ENDPOINT);
      if (itinRes) {
        const data = await itinRes.json();
        const itin = data.itinerary || data;
        hasCachedItinerary = true;
        itineraryTitle = itin?.title || null;
        stopCount = itin?.stops?.length || 0;
        lastCachedAt = itinRes.headers.get('X-Cached-At') || data.cachedAt || null;
      }

      const pandalRes = await cache.match(PANDALS_CACHE_ENDPOINT);
      if (pandalRes) {
        const data = await pandalRes.json();
        const pandals = data.pandals || data;
        hasCachedPandals = true;
        pandalCount = Array.isArray(pandals) ? pandals.length : 0;
        if (!lastCachedAt) {
          lastCachedAt = pandalRes.headers.get('X-Cached-At') || data.cachedAt || null;
        }
      }
    } catch {
      // Fall through to localStorage inspect
    }
  }

  // Backup check in localStorage
  if (!hasCachedItinerary) {
    const rawItin = localStorage.getItem(LOCAL_STORAGE_ITIN_KEY);
    if (rawItin) {
      try {
        const parsed = JSON.parse(rawItin);
        hasCachedItinerary = true;
        itineraryTitle = parsed?.title || null;
        stopCount = parsed?.stops?.length || 0;
      } catch {
        // ignore
      }
    }
  }

  if (!hasCachedPandals) {
    const rawPandals = localStorage.getItem(LOCAL_STORAGE_PANDALS_KEY);
    if (rawPandals) {
      try {
        const parsed = JSON.parse(rawPandals);
        if (Array.isArray(parsed)) {
          hasCachedPandals = true;
          pandalCount = parsed.length;
        }
      } catch {
        // ignore
      }
    }
  }

  if (!lastCachedAt) {
    lastCachedAt = localStorage.getItem(LOCAL_STORAGE_TIMESTAMP_KEY);
  }

  return {
    isSupported,
    hasCachedItinerary,
    hasCachedPandals,
    pandalCount,
    itineraryTitle,
    stopCount,
    lastCachedAt,
  };
}

/**
 * Clear offline cache
 */
export async function clearOfflineCache(): Promise<boolean> {
  try {
    if ('caches' in window) {
      await caches.delete(CACHE_API_DATA_NAME);
    }
    localStorage.removeItem(LOCAL_STORAGE_ITIN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_PANDALS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_TIMESTAMP_KEY);
    window.dispatchEvent(new CustomEvent('pujapath_offline_cache_updated'));
    return true;
  } catch {
    return false;
  }
}
