package com.pujapath.service;

import com.pujapath.entity.Itinerary;
import com.pujapath.entity.ItineraryStop;
import com.pujapath.entity.Pandal;
import com.pujapath.repository.ItineraryRepository;
import com.pujapath.repository.PandalRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RouteOptimizationService {

    private final PandalRepository pandalRepository;
    private final ItineraryRepository itineraryRepository;

    public RouteOptimizationService(PandalRepository pandalRepository,
                                    ItineraryRepository itineraryRepository) {
        this.pandalRepository = pandalRepository;
        this.itineraryRepository = itineraryRepository;
    }

    public double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public int estimateTravelTimeMinutes(double distanceKm, String mode) {
        if ("TRANSIT".equalsIgnoreCase(mode)) {
            return (int) Math.max(8, Math.round((distanceKm / 22.0) * 60 + 8));
        } else if ("DRIVING".equalsIgnoreCase(mode)) {
            return (int) Math.max(5, Math.round((distanceKm / 12.0) * 60 + 5));
        } else {
            // WALKING default
            return (int) Math.max(3, Math.round((distanceKm / 4.0) * 60 * 1.2));
        }
    }

    public int getQueueBufferMinutes(String crowdLevel) {
        if ("low".equalsIgnoreCase(crowdLevel)) return 15;
        if ("moderate".equalsIgnoreCase(crowdLevel)) return 30;
        if ("high".equalsIgnoreCase(crowdLevel)) return 50;
        if ("very_high".equalsIgnoreCase(crowdLevel)) return 85;
        return 35;
    }

    public Itinerary planOptimizedRoute(
            double startLat, double startLng, String startName,
            double endLat, double endLng, String endName,
            int timeBudgetHours, int budgetPerPerson, String transportMode,
            List<String> preferredCategories, int maxStops,
            List<String> explicitPandalIds) {

        List<Pandal> candidates;

        if (explicitPandalIds != null && !explicitPandalIds.isEmpty()) {
            candidates = pandalRepository.findAllById(explicitPandalIds);
        } else {
            List<Pandal> all = pandalRepository.findAll();
            candidates = new ArrayList<>();
            for (Pandal p : all) {
                if (preferredCategories == null || preferredCategories.isEmpty() ||
                    preferredCategories.contains(p.getCategory())) {
                    candidates.add(p);
                }
            }
            if (candidates.isEmpty()) {
                candidates = all;
            }
            // Sort by proximity to start
            candidates.sort(Comparator.comparingDouble(p ->
                calculateDistanceKm(startLat, startLng, p.getLatitude(), p.getLongitude())
            ));
            if (candidates.size() > maxStops) {
                candidates = candidates.subList(0, maxStops);
            }
        }

        // Nearest Neighbor ordering
        List<Pandal> ordered = new ArrayList<>();
        List<Pandal> remaining = new ArrayList<>(candidates);
        double curLat = startLat;
        double curLng = startLng;

        while (!remaining.isEmpty()) {
            int bestIdx = 0;
            double shortestDist = Double.MAX_VALUE;
            for (int i = 0; i < remaining.size(); i++) {
                double d = calculateDistanceKm(curLat, curLng,
                        remaining.get(i).getLatitude(), remaining.get(i).getLongitude());
                if (d < shortestDist) {
                    shortestDist = d;
                    bestIdx = i;
                }
            }
            Pandal next = remaining.remove(bestIdx);
            ordered.add(next);
            curLat = next.getLatitude();
            curLng = next.getLongitude();
        }

        // Build Itinerary
        Itinerary itinerary = new Itinerary();
        itinerary.setId("itin-" + UUID.randomUUID().toString().substring(0, 8));
        itinerary.setTitle("North Kolkata Tour (" + ordered.size() + " Pandals, " + timeBudgetHours + "h)");
        itinerary.setStartPointName(startName != null ? startName : "Start Location");
        itinerary.setStartLat(startLat);
        itinerary.setStartLng(startLng);
        itinerary.setEndPointName(endName != null ? endName : "Return Location");
        itinerary.setEndLat(endLat);
        itinerary.setEndLng(endLng);
        itinerary.setTimeBudgetHours(timeBudgetHours);
        itinerary.setBudgetPerPerson(budgetPerPerson);
        itinerary.setTransportMode(transportMode != null ? transportMode : "WALKING");
        itinerary.setCreatedAt(System.currentTimeMillis());

        double totalDist = 0.0;
        int runningMinutes = 0;
        double prevLat = startLat;
        double prevLng = startLng;

        List<ItineraryStop> stops = new ArrayList<>();
        for (int i = 0; i < ordered.size(); i++) {
            Pandal p = ordered.get(i);
            double dist = calculateDistanceKm(prevLat, prevLng, p.getLatitude(), p.getLongitude());
            totalDist += dist;
            int travelMins = estimateTravelTimeMinutes(dist, transportMode);
            runningMinutes += travelMins;

            int visitDuration = 20 + getQueueBufferMinutes(p.getCrowdLevel());

            ItineraryStop stop = new ItineraryStop();
            stop.setItinerary(itinerary);
            stop.setPandal(p);
            stop.setStopOrder(i + 1);
            stop.setTravelTimeMinutes(travelMins);
            stop.setTravelDistanceKm(Math.round(dist * 100.0) / 100.0);
            stop.setVisitDurationMinutes(visitDuration);
            stop.setCompleted(false);

            int arrivalHour = (runningMinutes / 60) % 24;
            int arrivalMin = runningMinutes % 60;
            stop.setEstimatedArrival(String.format("+%02dh %02dm", arrivalHour, arrivalMin));

            stops.add(stop);
            runningMinutes += visitDuration;
            prevLat = p.getLatitude();
            prevLng = p.getLongitude();
        }

        double returnDist = calculateDistanceKm(prevLat, prevLng, endLat, endLng);
        totalDist += returnDist;
        runningMinutes += estimateTravelTimeMinutes(returnDist, transportMode);

        itinerary.setTotalDistanceKm(Math.round(totalDist * 100.0) / 100.0);
        itinerary.setTotalTimeMinutes(runningMinutes);

        boolean isRealistic = runningMinutes <= (timeBudgetHours * 60);
        itinerary.setIsRealistic(isRealistic);
        if (!isRealistic) {
            double excess = (runningMinutes - (timeBudgetHours * 60)) / 60.0;
            itinerary.setWarningMessage(String.format("Expected time (%.1f hrs) exceeds %d hrs budget by ~%.1f hrs due to festival queue buffers.",
                    runningMinutes / 60.0, timeBudgetHours, excess));
        }

        itinerary.setStops(stops);
        return itineraryRepository.save(itinerary);
    }
}
