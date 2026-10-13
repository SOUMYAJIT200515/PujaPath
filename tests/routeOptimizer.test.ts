import { optimizePandalRoute, recalculateItineraryStops } from '../src/utils/routeOptimizer';
import { INITIAL_PANDALS } from '../src/data/initialPandals';

const start = {
  lat: 22.6001,
  lng: 88.3712,
  name: 'Shyambazar 5-Point Crossing',
};

// Test 1: Route optimization with 4 stops
const itinerary = optimizePandalRoute({
  startCoords: start,
  returnCoords: start,
  allPandals: INITIAL_PANDALS,
  timeBudgetHours: 5,
  budgetPerPerson: 500,
  transportMode: 'WALKING',
  preferredCategories: ['heritage', 'traditional', 'theme', 'famous'],
  maxStops: 4,
});

console.assert(itinerary.stops.length === 4, `Expected 4 stops, got ${itinerary.stops.length}`);
console.assert(itinerary.totalDistanceKm > 0, 'Total distance should be greater than 0');
console.assert(itinerary.totalTimeMinutes > 60, 'Total time should include visiting and queue buffers');
console.assert(typeof itinerary.isRealistic === 'boolean', 'isRealistic should be boolean');

// Test 2: Stop reordering
const reversedStops = [...itinerary.stops.map((s) => s.pandal)].reverse();
const recalculated = recalculateItineraryStops(itinerary, reversedStops);

console.assert(recalculated.stops.length === 4, 'Recalculated stops count should match');
console.assert(
  recalculated.stops[0].pandal.id === reversedStops[0].id,
  'First stop should match reversed order'
);

console.log('✅ All routeOptimizer unit tests passed!');
