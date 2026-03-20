package com.emp.management.service;

import com.emp.management.dto.*;
import com.emp.management.entity.Employee;
import com.emp.management.exception.EmployeeNotFoundException;
import com.emp.management.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

/**
 * EmployeeService - contains all business logic for employee operations.
 * Controllers call services. Services call repositories.
 */
@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    /**
     * Get employees with search, filter, and pagination.
     *
     * @param name       - search term (can be empty)
     * @param department - department filter (can be empty)
     * @param page       - page number starting from 0
     * @param size       - records per page
     */
    public PageResponse<Employee> getAllEmployees(String name, String department, int page, int size) {
        // Create pageable object: sort by id descending (newest first)
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        // Treat blank strings as null (so filter is skipped)
        String searchName = (name == null || name.isBlank()) ? null : name;
        String searchDept = (department == null || department.isBlank()) ? null : department;

        // Repository call with search, filter, and pagination
        Page<Employee> result = employeeRepository.searchEmployees(searchName, searchDept, pageable);

        // Wrap in our custom PageResponse DTO
        return new PageResponse<>(
            result.getContent(),
            result.getNumber(),
            result.getTotalPages(),
            result.getTotalElements()
        );
    }

    /**
     * Get a single employee by ID.
     * Throws EmployeeNotFoundException if not found (caught by GlobalExceptionHandler).
     */
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
            .orElseThrow(() -> new EmployeeNotFoundException(id));
    }

    /**
     * Add a new employee.
     * Uses Builder pattern (from @Builder Lombok annotation).
     */
    public Employee addEmployee(EmployeeDTO dto) {
        Employee employee = Employee.builder()
            .name(dto.getName())
            .email(dto.getEmail())
            .department(dto.getDepartment())
            .salary(dto.getSalary())
            .build();

        return employeeRepository.save(employee); // INSERT INTO employees...
    }

    /**
     * Update an existing employee.
     * First finds the employee (throws 404 if not found), then updates fields.
     */
    public Employee updateEmployee(Long id, EmployeeDTO dto) {
        Employee employee = getEmployeeById(id); // reuse getById (throws if not found)

        // Update all fields
        employee.setName(dto.getName());
        employee.setEmail(dto.getEmail());
        employee.setDepartment(dto.getDepartment());
        employee.setSalary(dto.getSalary());

        return employeeRepository.save(employee); // UPDATE employees SET...
    }

    /**
     * Delete an employee by ID.
     * First checks if employee exists (throws 404 if not).
     */
    public void deleteEmployee(Long id) {
    if (!employeeRepository.existsById(id)) {
        throw new EmployeeNotFoundException(id);
    }
    employeeRepository.deleteById(id);
}
}
