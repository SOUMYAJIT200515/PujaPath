package com.pujapath.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "itinerary_stops")
public class ItineraryStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerary_id", nullable = false)
    @JsonIgnore
    private Itinerary itinerary;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pandal_id", nullable = false)
    private Pandal pandal;

    @Column(nullable = false)
    private Integer stopOrder;

    private String estimatedArrival;
    private Integer visitDurationMinutes;
    private Integer travelTimeMinutes;
    private Double travelDistanceKm;
    private Boolean completed;

    public ItineraryStop() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Itinerary getItinerary() { return itinerary; }
    public void setItinerary(Itinerary itinerary) { this.itinerary = itinerary; }

    public Pandal getPandal() { return pandal; }
    public void setPandal(Pandal pandal) { this.pandal = pandal; }

    public Integer getStopOrder() { return stopOrder; }
    public void setStopOrder(Integer stopOrder) { this.stopOrder = stopOrder; }

    public String getEstimatedArrival() { return estimatedArrival; }
    public void setEstimatedArrival(String estimatedArrival) { this.estimatedArrival = estimatedArrival; }

    public Integer getVisitDurationMinutes() { return visitDurationMinutes; }
    public void setVisitDurationMinutes(Integer visitDurationMinutes) { this.visitDurationMinutes = visitDurationMinutes; }

    public Integer getTravelTimeMinutes() { return travelTimeMinutes; }
    public void setTravelTimeMinutes(Integer travelTimeMinutes) { this.travelTimeMinutes = travelTimeMinutes; }

    public Double getTravelDistanceKm() { return travelDistanceKm; }
    public void setTravelDistanceKm(Double travelDistanceKm) { this.travelDistanceKm = travelDistanceKm; }

    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }
}
