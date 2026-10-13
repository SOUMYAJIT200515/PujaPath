package com.pujapath.controller;

import com.pujapath.entity.Itinerary;
import com.pujapath.service.RouteOptimizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/itineraries")
@CrossOrigin(origins = "*")
public class ItineraryController {

    private final RouteOptimizationService routeOptimizationService;

    public ItineraryController(RouteOptimizationService routeOptimizationService) {
        this.routeOptimizationService = routeOptimizationService;
    }

    public static class OptimizeRequest {
        public double startLat;
        public double startLng;
        public String startName;
        public double endLat;
        public double endLng;
        public String endName;
        public int timeBudgetHours = 5;
        public int budgetPerPerson = 500;
        public String transportMode = "WALKING";
        public List<String> preferredCategories;
        public int maxStops = 5;
        public List<String> explicitPandalIds;
    }

    @PostMapping("/optimize")
    public ResponseEntity<Itinerary> optimizeRoute(@RequestBody OptimizeRequest req) {
        double endLat = req.endLat != 0.0 ? req.endLat : req.startLat;
        double endLng = req.endLng != 0.0 ? req.endLng : req.startLng;

        Itinerary itinerary = routeOptimizationService.planOptimizedRoute(
                req.startLat, req.startLng, req.startName,
                endLat, endLng, req.endName,
                req.timeBudgetHours, req.budgetPerPerson, req.transportMode,
                req.preferredCategories, req.maxStops, req.explicitPandalIds
        );
        return ResponseEntity.ok(itinerary);
    }
}
