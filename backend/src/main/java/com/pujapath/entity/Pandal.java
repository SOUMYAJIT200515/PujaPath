package com.pujapath.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pandals", indexes = {
    @Index(name = "idx_pandal_coords", columnList = "latitude, longitude"),
    @Index(name = "idx_pandal_category", columnList = "category"),
    @Index(name = "idx_pandal_neighbourhood", columnList = "neighbourhood")
})
public class Pandal {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 150)
    private String bengaliName;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(nullable = false, length = 80)
    private String neighbourhood;

    @Column(nullable = false, length = 120)
    private String nearestMetro;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 40)
    private String category; // heritage, traditional, theme, famous

    private Integer yearEstablished;

    @Column(length = 500)
    private String photoUrl;

    @Column(length = 500)
    private String sourceUrl;

    @Column(length = 30)
    private String crowdLevel; // low, moderate, high, very_high, unknown

    private Integer crowdFreshnessMinutes;
    private Integer crowdReportCount;
    private Double rating;
    private Integer reviewCount;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Pandal() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBengaliName() { return bengaliName; }
    public void setBengaliName(String bengaliName) { this.bengaliName = bengaliName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getNeighbourhood() { return neighbourhood; }
    public void setNeighbourhood(String neighbourhood) { this.neighbourhood = neighbourhood; }

    public String getNearestMetro() { return nearestMetro; }
    public void setNearestMetro(String nearestMetro) { this.nearestMetro = nearestMetro; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getYearEstablished() { return yearEstablished; }
    public void setYearEstablished(Integer yearEstablished) { this.yearEstablished = yearEstablished; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public String getCrowdLevel() { return crowdLevel; }
    public void setCrowdLevel(String crowdLevel) { this.crowdLevel = crowdLevel; }

    public Integer getCrowdFreshnessMinutes() { return crowdFreshnessMinutes; }
    public void setCrowdFreshnessMinutes(Integer crowdFreshnessMinutes) { this.crowdFreshnessMinutes = crowdFreshnessMinutes; }

    public Integer getCrowdReportCount() { return crowdReportCount; }
    public void setCrowdReportCount(Integer crowdReportCount) { this.crowdReportCount = crowdReportCount; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
