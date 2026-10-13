package com.pujapath.controller;

import com.pujapath.entity.Pandal;
import com.pujapath.service.PandalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pandals")
@CrossOrigin(origins = "*")
public class PandalController {

    private final PandalService pandalService;

    public PandalController(PandalService pandalService) {
        this.pandalService = pandalService;
    }

    @GetMapping
    public ResponseEntity<List<Pandal>> getAllPandals(
            @RequestParam(required = false) String category) {
        if (category != null && !category.equalsIgnoreCase("all")) {
            return ResponseEntity.ok(pandalService.getPandalsByCategory(category));
        }
        return ResponseEntity.ok(pandalService.getAllPandals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pandal> getPandalById(@PathVariable String id) {
        return pandalService.getPandalById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Pandal>> searchPandals(@RequestParam String q) {
        return ResponseEntity.ok(pandalService.searchPandals(q));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Pandal>> getNearbyPandals(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "3.0") double radiusKm) {
        return ResponseEntity.ok(pandalService.getNearbyPandals(lat, lng, radiusKm));
    }
}
