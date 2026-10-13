package com.pujapath.repository;

import com.pujapath.entity.Pandal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PandalRepository extends JpaRepository<Pandal, String> {

    List<Pandal> findByCategory(String category);

    @Query("SELECT p FROM Pandal p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.bengaliName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.neighbourhood) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.nearestMetro) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Pandal> searchPandals(@Param("query") String query);

    @Query(value = "SELECT p.*, " +
           "(6371 * acos(cos(radians(:lat)) * cos(radians(p.latitude)) * " +
           "cos(radians(p.longitude) - radians(:lng)) + " +
           "sin(radians(:lat)) * sin(radians(p.latitude)))) AS distance " +
           "FROM pandals p " +
           "HAVING distance <= :radiusKm " +
           "ORDER BY distance ASC", nativeQuery = true)
    List<Pandal> findNearbyPandals(@Param("lat") double lat,
                                   @Param("lng") double lng,
                                   @Param("radiusKm") double radiusKm);
}
