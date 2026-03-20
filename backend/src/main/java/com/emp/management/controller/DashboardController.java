package com.emp.management.controller;

import com.emp.management.dto.DashboardDTO;
import com.emp.management.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * DashboardController - provides summary stats for the React dashboard.
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    /**
     * GET /api/dashboard
     * Returns: total employees + department-wise count
     */
    @GetMapping
    public ResponseEntity<DashboardDTO> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboardData());
    }
}
