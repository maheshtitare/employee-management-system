package com.emp.management.dto;

import lombok.*;
import java.util.Map;

/**
 * DashboardDTO - data shown on the dashboard page.
 */
@Data
@AllArgsConstructor
public class DashboardDTO {
    private long totalEmployees;                  // e.g. 25
    private Map<String, Long> departmentCount;    // e.g. {"IT": 8, "HR": 5, "Finance": 12}
}
