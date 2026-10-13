import {
  calculateDistanceKm,
  formatDistance,
  estimateTravelTimeMinutes,
  formatDuration,
  getGoogleMapsNavigationUrl,
  getCrowdDelayBufferMinutes,
} from '../src/utils/geoUtils';

// Test 1: Bagbazar to Sovabazar distance
const bagbazar = { lat: 22.6023, lng: 88.3664 };
const sovabazar = { lat: 22.5975, lng: 88.3648 };

const dist = calculateDistanceKm(bagbazar.lat, bagbazar.lng, sovabazar.lat, sovabazar.lng);
console.assert(dist > 0.4 && dist < 0.8, `Expected distance ~0.55km, got ${dist}`);

// Test 2: formatDistance
console.assert(formatDistance(0.45) === '450 m', `Expected 450 m, got ${formatDistance(0.45)}`);
console.assert(formatDistance(1.72) === '1.7 km', `Expected 1.7 km, got ${formatDistance(1.72)}`);

// Test 3: formatDuration
console.assert(formatDuration(25) === '25 mins', `Expected 25 mins, got ${formatDuration(25)}`);
console.assert(formatDuration(75) === '1 hr 15 m', `Expected 1 hr 15 m, got ${formatDuration(75)}`);

// Test 4: Travel time estimates
const walkTime = estimateTravelTimeMinutes(1.0, 'WALKING');
console.assert(walkTime >= 15 && walkTime <= 25, `Expected walking time ~18m, got ${walkTime}`);

const driveTime = estimateTravelTimeMinutes(2.0, 'DRIVING');
console.assert(driveTime >= 10 && driveTime <= 20, `Expected drive time ~15m, got ${driveTime}`);

// Test 5: Google Maps deep link
const gmapsUrl = getGoogleMapsNavigationUrl(bagbazar.lat, bagbazar.lng, 'Bagbazar Sarbojanin');
console.assert(
  gmapsUrl.includes('https://www.google.com/maps/dir/'),
  `URL should be Google Maps link, got ${gmapsUrl}`
);
console.assert(
  gmapsUrl.includes('destination=Bagbazar%20Sarbojanin%2C%20Kolkata'),
  `URL should include destination param`
);

// Test 6: Crowd delay buffers
console.assert(getCrowdDelayBufferMinutes('low') === 15, 'Low crowd delay buffer');
console.assert(getCrowdDelayBufferMinutes('very_high') === 85, 'Very high crowd delay buffer');

console.log('✅ All geoUtils unit tests passed!');
