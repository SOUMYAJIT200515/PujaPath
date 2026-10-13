package com.pujapath.repository;

import com.pujapath.entity.CrowdReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CrowdReportRepository extends JpaRepository<CrowdReport, Long> {

    List<CrowdReport> findByPandalIdOrderByTimestampDesc(String pandalId);

    List<CrowdReport> findTop20ByOrderByTimestampDesc();
}
