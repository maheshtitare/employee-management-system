package com.emp.management.service;

import com.emp.management.dto.DashboardDTO;
import com.emp.management.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

/**
 * DashboardService - provides summary data for the dashboard page.
 */
@Service
public class DashboardService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public DashboardDTO getDashboardData() {
        // Total count of all employees
        long total = employeeRepository.count();

        // Get department-wise count from repository
        // Result looks like: [["IT", 8], ["HR", 5], ["Finance", 12]]
        List<Object[]> rawResults = employeeRepository.countByDepartment();

        // Convert to a Map: {"IT": 8, "HR": 5, "Finance": 12}
        Map<String, Long> departmentCount = new LinkedHashMap<>();
        for (Object[] row : rawResults) {
            String dept = (String) row[0];
            Long count = (Long) row[1];
            departmentCount.put(dept, count);
        }

        return new DashboardDTO(total, departmentCount);
    }
}
