package com.pujapath;

import com.pujapath.service.RouteOptimizationService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RouteOptimizationServiceTest {

    private final RouteOptimizationService service = new RouteOptimizationService(null, null);

    @Test
    void testHaversineDistanceBetweenNorthKolkataPandals() {
        // Bagbazar Sarbojanin to Shobhabazar Rajbari
        double bagbazarLat = 22.6023;
        double bagbazarLng = 88.3664;
        double sovabazarLat = 22.5975;
        double sovabazarLng = 88.3648;

        double distance = service.calculateDistanceKm(bagbazarLat, bagbazarLng, sovabazarLat, sovabazarLng);
        assertTrue(distance > 0.4 && distance < 0.8, "Distance should be approx 0.55 km");
    }

    @Test
    void testTravelTimeEstimates() {
        int walkMins = service.estimateTravelTimeMinutes(1.0, "WALKING");
        assertTrue(walkMins >= 15 && walkMins <= 25, "1km walk in crowd should be ~18 mins");

        int transitMins = service.estimateTravelTimeMinutes(2.0, "TRANSIT");
        assertTrue(transitMins >= 10 && transitMins <= 20, "2km metro should be ~13 mins");
    }

    @Test
    void testQueueBuffers() {
        assertEquals(15, service.getQueueBufferMinutes("low"));
        assertEquals(30, service.getQueueBufferMinutes("moderate"));
        assertEquals(50, service.getQueueBufferMinutes("high"));
        assertEquals(85, service.getQueueBufferMinutes("very_high"));
    }
}
