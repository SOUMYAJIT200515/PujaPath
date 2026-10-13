package com.pujapath.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "crowd_reports", indexes = {
    @Index(name = "idx_report_pandal_time", columnList = "pandalId, timestamp")
})
public class CrowdReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 64)
    private String pandalId;

    @Column(nullable = false, length = 150)
    private String pandalName;

    @Column(nullable = false, length = 30)
    private String crowdLevel; // low, moderate, high, very_high

    @Column(nullable = false)
    private Integer waitTimeMinutes;

    @Column(length = 80)
    private String reporterName;

    @Column(length = 300)
    private String comment;

    @Column(nullable = false)
    private Long timestamp;

    @Column(nullable = false, length = 20)
    private String source; // community, official

    public CrowdReport() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPandalId() { return pandalId; }
    public void setPandalId(String pandalId) { this.pandalId = pandalId; }

    public String getPandalName() { return pandalName; }
    public void setPandalName(String pandalName) { this.pandalName = pandalName; }

    public String getCrowdLevel() { return crowdLevel; }
    public void setCrowdLevel(String crowdLevel) { this.crowdLevel = crowdLevel; }

    public Integer getWaitTimeMinutes() { return waitTimeMinutes; }
    public void setWaitTimeMinutes(Integer waitTimeMinutes) { this.waitTimeMinutes = waitTimeMinutes; }

    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Long getTimestamp() { return timestamp; }
    public void setTimestamp(Long timestamp) { this.timestamp = timestamp; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}
