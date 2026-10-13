package com.pujapath.service;

import com.pujapath.entity.Pandal;
import com.pujapath.repository.PandalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PandalService {

    private final PandalRepository pandalRepository;

    public PandalService(PandalRepository pandalRepository) {
        this.pandalRepository = pandalRepository;
    }

    public List<Pandal> getAllPandals() {
        return pandalRepository.findAll();
    }

    public Optional<Pandal> getPandalById(String id) {
        return pandalRepository.findById(id);
    }

    public List<Pandal> getPandalsByCategory(String category) {
        return pandalRepository.findByCategory(category);
    }

    public List<Pandal> searchPandals(String query) {
        if (query == null || query.trim().isEmpty()) {
            return pandalRepository.findAll();
        }
        return pandalRepository.searchPandals(query.trim());
    }

    public List<Pandal> getNearbyPandals(double lat, double lng, double radiusKm) {
        return pandalRepository.findNearbyPandals(lat, lng, radiusKm);
    }

    public Pandal savePandal(Pandal pandal) {
        return pandalRepository.save(pandal);
    }
}
