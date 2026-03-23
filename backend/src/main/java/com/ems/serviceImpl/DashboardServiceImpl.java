package com.ems.serviceImpl;

import com.ems.dto.DashboardDTO;
import com.ems.entity.Department;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import com.ems.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 📊 DashboardServiceImpl
 *
 * Calculates and returns all stats shown on the dashboard:
 * - Total employees
 * - Active employees
 * - Total departments
 * - Employee count per department
 */
@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public DashboardDTO getDashboardStats() {
        DashboardDTO dashboard = new DashboardDTO();

        // Total employees (all statuses)
        dashboard.setTotalEmployees(employeeRepository.count());

        // Active employees only
        dashboard.setActiveEmployees(employeeRepository.countByStatus("Active"));

        // Total departments
        dashboard.setTotalDepartments(departmentRepository.count());

        // Employee count per department
        List<DashboardDTO.DeptStat> stats = new ArrayList<>();
        List<Department> departments = departmentRepository.findAll();

        for (Department dept : departments) {
            int count = employeeRepository.findByDepartmentId(dept.getId()).size();
            stats.add(new DashboardDTO.DeptStat(dept.getName(), count));
        }

        dashboard.setDepartmentStats(stats);
        return dashboard;
    }
}
