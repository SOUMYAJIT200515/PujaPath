package com.pujapath.controller;

import com.pujapath.entity.CrowdReport;
import com.pujapath.service.CrowdReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crowd-reports")
@CrossOrigin(origins = "*")
public class CrowdReportController {

    private final CrowdReportService crowdReportService;

    public CrowdReportController(CrowdReportService crowdReportService) {
        this.crowdReportService = crowdReportService;
    }

    @GetMapping
    public ResponseEntity<List<CrowdReport>> getRecentReports() {
        return ResponseEntity.ok(crowdReportService.getRecentReports());
    }

    @GetMapping("/pandal/{pandalId}")
    public ResponseEntity<List<CrowdReport>> getReportsForPandal(@PathVariable String pandalId) {
        return ResponseEntity.ok(crowdReportService.getReportsForPandal(pandalId));
    }

    @PostMapping
    public ResponseEntity<CrowdReport> submitReport(@RequestBody CrowdReport report) {
        if (report.getPandalId() == null || report.getCrowdLevel() == null) {
            return ResponseEntity.badRequest().build();
        }
        CrowdReport saved = crowdReportService.submitReport(report);
        return ResponseEntity.ok(saved);
    }
}
