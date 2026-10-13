import { TransportMode } from '../types';

/**
 * Calculates Great-Circle distance between two coordinates using the Haversine formula (km)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Formats distance cleanly (e.g., '450 m' or '2.4 km')
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Estimates travel duration in minutes based on real Kolkata Durga Puja urban conditions
 */
export function estimateTravelTimeMinutes(
  distanceKm: number,
  mode: TransportMode
): number {
  switch (mode) {
    case 'WALKING': {
      // 4 km/h walking speed with pedestrian crowd factor
      const baseMinutes = (distanceKm / 4.0) * 60;
      return Math.max(3, Math.round(baseMinutes * 1.2));
    }
    case 'TRANSIT': {
      // Kolkata metro average 25 km/h + walking to station & ticketing buffer (10 mins)
      const transitMinutes = (distanceKm / 22.0) * 60 + 8;
      return Math.max(8, Math.round(transitMinutes));
    }
    case 'DRIVING': {
      // Heavy Puja festival traffic congestion (~10-14 km/h average)
      const drivingMinutes = (distanceKm / 12.0) * 60 + 5;
      return Math.max(5, Math.round(drivingMinutes));
    }
    default:
      return Math.round((distanceKm / 4.5) * 60);
  }
}

/**
 * Formats duration in minutes to readable string (e.g., '15 mins', '1 hr 20 mins')
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)} mins`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  if (remainingMinutes === 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hr ${remainingMinutes} m`;
}

/**
 * Builds standard Google Maps directions/navigation deep link
 */
export function getGoogleMapsNavigationUrl(
  destinationLat: number,
  destinationLng: number,
  destinationName?: string,
  originLat?: number,
  originLng?: number
): string {
  const destParam = encodeURIComponent(
    destinationName ? `${destinationName}, Kolkata` : `${destinationLat},${destinationLng}`
  );
  let url = `https://www.google.com/maps/dir/?api=1&destination=${destParam}&destination_place_id=&travelmode=walking`;
  if (originLat !== undefined && originLng !== undefined) {
    url += `&origin=${originLat},${originLng}`;
  }
  return url;
}

/**
 * Get crowd level queue delay buffer in minutes
 */
export function getCrowdDelayBufferMinutes(level: string): number {
  switch (level) {
    case 'low':
      return 15;
    case 'moderate':
      return 30;
    case 'high':
      return 50;
    case 'very_high':
      return 85;
    case 'unknown':
    default:
      return 35;
  }
}
