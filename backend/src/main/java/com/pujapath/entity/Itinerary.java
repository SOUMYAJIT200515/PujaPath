package com.pujapath.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "itineraries")
public class Itinerary {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 150)
    private String title;

    private String startPointName;
    private Double startLat;
    private Double startLng;

    private String endPointName;
    private Double endLat;
    private Double endLng;

    private Integer timeBudgetHours;
    private Integer budgetPerPerson;

    @Column(length = 20)
    private String transportMode; // WALKING, TRANSIT, DRIVING

    private Double totalDistanceKm;
    private Integer totalTimeMinutes;
    private Boolean isRealistic;

    @Column(length = 500)
    private String warningMessage;

    private Long createdAt;

    @OneToMany(mappedBy = "itinerary", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("stopOrder ASC")
    private List<ItineraryStop> stops = new ArrayList<>();

    public Itinerary() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getStartPointName() { return startPointName; }
    public void setStartPointName(String startPointName) { this.startPointName = startPointName; }

    public Double getStartLat() { return startLat; }
    public void setStartLat(Double startLat) { this.startLat = startLat; }

    public Double getStartLng() { return startLng; }
    public void setStartLng(Double startLng) { this.startLng = startLng; }

    public String getEndPointName() { return endPointName; }
    public void setEndPointName(String endPointName) { this.endPointName = endPointName; }

    public Double getEndLat() { return endLat; }
    public void setEndLat(Double endLat) { this.endLat = endLat; }

    public Double getEndLng() { return endLng; }
    public void setEndLng(Double endLng) { this.endLng = endLng; }

    public Integer getTimeBudgetHours() { return timeBudgetHours; }
    public void setTimeBudgetHours(Integer timeBudgetHours) { this.timeBudgetHours = timeBudgetHours; }

    public Integer getBudgetPerPerson() { return budgetPerPerson; }
    public void setBudgetPerPerson(Integer budgetPerPerson) { this.budgetPerPerson = budgetPerPerson; }

    public String getTransportMode() { return transportMode; }
    public void setTransportMode(String transportMode) { this.transportMode = transportMode; }

    public Double getTotalDistanceKm() { return totalDistanceKm; }
    public void setTotalDistanceKm(Double totalDistanceKm) { this.totalDistanceKm = totalDistanceKm; }

    public Integer getTotalTimeMinutes() { return totalTimeMinutes; }
    public void setTotalTimeMinutes(Integer totalTimeMinutes) { this.totalTimeMinutes = totalTimeMinutes; }

    public Boolean getIsRealistic() { return isRealistic; }
    public void setIsRealistic(Boolean isRealistic) { this.isRealistic = isRealistic; }

    public String getWarningMessage() { return warningMessage; }
    public void setWarningMessage(String warningMessage) { this.warningMessage = warningMessage; }

    public Long getCreatedAt() { return createdAt; }
    public void setCreatedAt(Long createdAt) { this.createdAt = createdAt; }

    public List<ItineraryStop> getStops() { return stops; }
    public void setStops(List<ItineraryStop> stops) { this.stops = stops; }
}
