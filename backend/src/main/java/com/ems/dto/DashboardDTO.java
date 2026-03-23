package com.ems.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/** 📊 DashboardDTO - Stats for dashboard page */
@Data @NoArgsConstructor @AllArgsConstructor
public class DashboardDTO {
    private long totalEmployees;
    private long activeEmployees;
    private long totalDepartments;
    private List<DeptStat> departmentStats;

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class DeptStat {
        private String departmentName;
        private long employeeCount;
    }
}
