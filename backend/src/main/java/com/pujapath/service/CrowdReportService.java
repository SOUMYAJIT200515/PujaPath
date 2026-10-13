package com.pujapath.service;

import com.pujapath.entity.CrowdReport;
import com.pujapath.entity.Pandal;
import com.pujapath.repository.CrowdReportRepository;
import com.pujapath.repository.PandalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CrowdReportService {

    private final CrowdReportRepository crowdReportRepository;
    private final PandalRepository pandalRepository;

    public CrowdReportService(CrowdReportRepository crowdReportRepository,
                              PandalRepository pandalRepository) {
        this.crowdReportRepository = crowdReportRepository;
        this.pandalRepository = pandalRepository;
    }

    public List<CrowdReport> getReportsForPandal(String pandalId) {
        return crowdReportRepository.findByPandalIdOrderByTimestampDesc(pandalId);
    }

    public List<CrowdReport> getRecentReports() {
        return crowdReportRepository.findTop20ByOrderByTimestampDesc();
    }

    @Transactional
    public CrowdReport submitReport(CrowdReport report) {
        if (report.getTimestamp() == null) {
            report.setTimestamp(System.currentTimeMillis());
        }
        if (report.getSource() == null) {
            report.setSource("community");
        }

        CrowdReport saved = crowdReportRepository.save(report);

        // Update the pandal's current crowd status
        Optional<Pandal> pandalOpt = pandalRepository.findById(report.getPandalId());
        if (pandalOpt.isPresent()) {
            Pandal pandal = pandalOpt.get();
            pandal.setCrowdLevel(report.getCrowdLevel());
            pandal.setCrowdFreshnessMinutes(1);
            pandal.setCrowdReportCount(
                pandal.getCrowdReportCount() != null ? pandal.getCrowdReportCount() + 1 : 1
            );
            pandalRepository.save(pandal);
        }

        return saved;
    }
}
