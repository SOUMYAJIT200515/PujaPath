import { Itinerary, ItineraryStop, Pandal, PandalCategory, RegionFilter, TransportMode } from '../types';
import {
  calculateDistanceKm,
  estimateTravelTimeMinutes,
  getCrowdDelayBufferMinutes,
} from './geoUtils';

interface PlanRouteParams {
  startCoords: { lat: number; lng: number; name: string };
  returnCoords?: { lat: number; lng: number; name: string };
  allPandals: Pandal[];
  regionScope?: RegionFilter;
  timeBudgetHours: number;
  budgetPerPerson: number;
  transportMode: TransportMode;
  preferredCategories: PandalCategory[];
  maxStops: number;
  selectedPandalIds?: string[];
}

/**
 * Optimizes the route order using Nearest Neighbor + 2-Opt Heuristic to minimize total distance
 */
export function optimizePandalRoute(params: PlanRouteParams): Itinerary {
  const {
    startCoords,
    returnCoords = startCoords,
    allPandals,
    regionScope = 'ALL',
    timeBudgetHours,
    budgetPerPerson,
    transportMode,
    preferredCategories,
    maxStops,
    selectedPandalIds,
  } = params;

  // 1. Filter candidates
  let candidatePandals: Pandal[] = [];

  if (selectedPandalIds && selectedPandalIds.length > 0) {
    candidatePandals = allPandals.filter((p) => selectedPandalIds.includes(p.id));
  } else {
    // Score based on region, categories, and proximity
    candidatePandals = allPandals.filter((p) => {
      if (regionScope !== 'ALL' && p.region !== regionScope) {
        return false;
      }
      if (preferredCategories.length > 0 && !preferredCategories.includes(p.category)) {
        return false;
      }
      return true;
    });

    // If no pandals matched category, fall back to region pandals or all pandals
    if (candidatePandals.length === 0) {
      candidatePandals = regionScope !== 'ALL'
        ? allPandals.filter((p) => p.region === regionScope)
        : [...allPandals];
      if (candidatePandals.length === 0) {
        candidatePandals = [...allPandals];
      }
    }

    // Sort by proximity to start
    candidatePandals.sort((a, b) => {
      const distA = calculateDistanceKm(
        startCoords.lat,
        startCoords.lng,
        a.coordinates.lat,
        a.coordinates.lng
      );
      const distB = calculateDistanceKm(
        startCoords.lat,
        startCoords.lng,
        b.coordinates.lat,
        b.coordinates.lng
      );
      return distA - distB;
    });

    candidatePandals = candidatePandals.slice(0, Math.min(maxStops, candidatePandals.length));
  }

  // 2. Solve Stop Order using Nearest-Neighbor heuristic
  const orderedStops: Pandal[] = [];
  const remaining = [...candidatePandals];
  let currentLat = startCoords.lat;
  let currentLng = startCoords.lng;

  while (remaining.length > 0) {
    let bestIndex = 0;
    let shortestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const dist = calculateDistanceKm(
        currentLat,
        currentLng,
        remaining[i].coordinates.lat,
        remaining[i].coordinates.lng
      );
      if (dist < shortestDist) {
        shortestDist = dist;
        bestIndex = i;
      }
    }

    const nextPandal = remaining.splice(bestIndex, 1)[0];
    orderedStops.push(nextPandal);
    currentLat = nextPandal.coordinates.lat;
    currentLng = nextPandal.coordinates.lng;
  }

  // 3. 2-Opt refinement for small routes (<= 10 stops)
  if (orderedStops.length > 3) {
    let improved = true;
    let iterations = 0;
    while (improved && iterations < 20) {
      improved = false;
      iterations++;
      for (let i = 0; i < orderedStops.length - 1; i++) {
        for (let k = i + 1; k < orderedStops.length; k++) {
          const currentDist =
            (i === 0
              ? calculateDistanceKm(
                  startCoords.lat,
                  startCoords.lng,
                  orderedStops[i].coordinates.lat,
                  orderedStops[i].coordinates.lng
                )
              : 0) +
            calculateDistanceKm(
              orderedStops[i].coordinates.lat,
              orderedStops[i].coordinates.lng,
              orderedStops[k].coordinates.lat,
              orderedStops[k].coordinates.lng
            );

          const reversedDist =
            (i === 0
              ? calculateDistanceKm(
                  startCoords.lat,
                  startCoords.lng,
                  orderedStops[k].coordinates.lat,
                  orderedStops[k].coordinates.lng
                )
              : 0) +
            calculateDistanceKm(
              orderedStops[k].coordinates.lat,
              orderedStops[k].coordinates.lng,
              orderedStops[i].coordinates.lat,
              orderedStops[i].coordinates.lng
            );

          if (reversedDist < currentDist - 0.05) {
            // Swap section
            const segment = orderedStops.slice(i, k + 1).reverse();
            orderedStops.splice(i, segment.length, ...segment);
            improved = true;
          }
        }
      }
    }
  }

  // 4. Calculate chronological timeline with realistic queuing & visiting duration
  let runningMinutes = 0;
  let totalDistanceKm = 0;
  let prevLat = startCoords.lat;
  let prevLng = startCoords.lng;

  const startTime = new Date();
  const stops: ItineraryStop[] = [];

  for (let idx = 0; idx < orderedStops.length; idx++) {
    const p = orderedStops[idx];
    const travelDist = calculateDistanceKm(
      prevLat,
      prevLng,
      p.coordinates.lat,
      p.coordinates.lng
    );
    totalDistanceKm += travelDist;

    const travelMins = estimateTravelTimeMinutes(travelDist, transportMode);
    runningMinutes += travelMins;

    // Arrival time calculation
    const arrivalDate = new Date(startTime.getTime() + runningMinutes * 60 * 1000);
    const arrivalStr = arrivalDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Pandal buffer: base viewing (20 min) + crowd wait buffer
    const queueBuffer = getCrowdDelayBufferMinutes(p.crowdLevel);
    const visitDuration = Math.round(20 + queueBuffer);

    stops.push({
      pandalId: p.id,
      order: idx + 1,
      estimatedArrival: arrivalStr,
      visitDurationMinutes: visitDuration,
      travelTimeMinutes: travelMins,
      travelDistanceKm: Number(travelDist.toFixed(2)),
      completed: !!p.isVisited,
      pandal: p,
    });

    runningMinutes += visitDuration;
    prevLat = p.coordinates.lat;
    prevLng = p.coordinates.lng;
  }

  // Return trip to end point
  const returnDist = calculateDistanceKm(
    prevLat,
    prevLng,
    returnCoords.lat,
    returnCoords.lng
  );
  totalDistanceKm += returnDist;
  const returnTravelMins = estimateTravelTimeMinutes(returnDist, transportMode);
  runningMinutes += returnTravelMins;

  // Feasibility Check
  const maxAllocatedMinutes = timeBudgetHours * 60;
  const isRealistic = runningMinutes <= maxAllocatedMinutes;

  let warningMessage: string | undefined;
  if (!isRealistic) {
    const excessHours = ((runningMinutes - maxAllocatedMinutes) / 60).toFixed(1);
    warningMessage = `Total expected time (${(runningMinutes / 60).toFixed(
      1
    )} hrs) exceeds your ${timeBudgetHours}-hour budget by ~${excessHours} hrs due to queue and festival crowd delays. Consider reducing stop count or picking pandals with moderate/low crowd.`;
  }

  const regionLabel = regionScope === 'ALL' ? 'All Kolkata' : `${regionScope} Kolkata`;

  return {
    id: `itin-${Date.now()}`,
    title: `${regionLabel} Hop — ${orderedStops.length} Pandals (${timeBudgetHours}h Plan)`,
    regionScope,
    startPoint: startCoords,
    endPoint: returnCoords,
    timeBudgetHours,
    budgetPerPerson,
    transportMode,
    preferredCategories,
    stops,
    totalDistanceKm: Number(totalDistanceKm.toFixed(2)),
    totalTimeMinutes: runningMinutes,
    isRealistic,
    warningMessage,
    createdAt: Date.now(),
  };
}

/**
 * Recalculates stops timeline when user manually reorders or removes a stop
 */
export function recalculateItineraryStops(
  currentItinerary: Itinerary,
  newPandalList: Pandal[]
): Itinerary {
  let runningMinutes = 0;
  let totalDistanceKm = 0;
  let prevLat = currentItinerary.startPoint.lat;
  let prevLng = currentItinerary.startPoint.lng;

  const startTime = new Date();
  const stops: ItineraryStop[] = [];

  for (let idx = 0; idx < newPandalList.length; idx++) {
    const p = newPandalList[idx];
    const travelDist = calculateDistanceKm(
      prevLat,
      prevLng,
      p.coordinates.lat,
      p.coordinates.lng
    );
    totalDistanceKm += travelDist;

    const travelMins = estimateTravelTimeMinutes(
      travelDist,
      currentItinerary.transportMode
    );
    runningMinutes += travelMins;

    const arrivalDate = new Date(startTime.getTime() + runningMinutes * 60 * 1000);
    const arrivalStr = arrivalDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const queueBuffer = getCrowdDelayBufferMinutes(p.crowdLevel);
    const visitDuration = Math.round(20 + queueBuffer);

    stops.push({
      pandalId: p.id,
      order: idx + 1,
      estimatedArrival: arrivalStr,
      visitDurationMinutes: visitDuration,
      travelTimeMinutes: travelMins,
      travelDistanceKm: Number(travelDist.toFixed(2)),
      completed: !!p.isVisited,
      pandal: p,
    });

    runningMinutes += visitDuration;
    prevLat = p.coordinates.lat;
    prevLng = p.coordinates.lng;
  }

  // Return leg
  const returnDist = calculateDistanceKm(
    prevLat,
    prevLng,
    currentItinerary.endPoint.lat,
    currentItinerary.endPoint.lng
  );
  totalDistanceKm += returnDist;
  const returnMins = estimateTravelTimeMinutes(
    returnDist,
    currentItinerary.transportMode
  );
  runningMinutes += returnMins;

  const maxAllocatedMinutes = currentItinerary.timeBudgetHours * 60;
  const isRealistic = runningMinutes <= maxAllocatedMinutes;

  let warningMessage: string | undefined;
  if (!isRealistic) {
    const excessHours = ((runningMinutes - maxAllocatedMinutes) / 60).toFixed(1);
    warningMessage = `Total expected time (${(runningMinutes / 60).toFixed(
      1
    )} hrs) exceeds your ${currentItinerary.timeBudgetHours}-hour budget by ~${excessHours} hrs.`;
  }

  return {
    ...currentItinerary,
    stops,
    totalDistanceKm: Number(totalDistanceKm.toFixed(2)),
    totalTimeMinutes: runningMinutes,
    isRealistic,
    warningMessage,
  };
}
