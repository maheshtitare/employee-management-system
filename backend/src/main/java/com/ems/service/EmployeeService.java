package com.ems.service;

import com.ems.dto.EmployeeRequestDTO;
import com.ems.dto.EmployeeResponseDTO;

import java.util.List;

/**
 * 📋 EmployeeService Interface
 *
 * Defines ALL operations related to Employee management.
 * The actual logic is written in EmployeeServiceImpl.
 *
 * Why use an interface?
 * → Loose coupling: Controller depends on interface, not concrete class.
 * → Easy to swap implementation later (good design practice).
 */
public interface EmployeeService {

    // Get all employees
    List<EmployeeResponseDTO> getAllEmployees();

    // Get one employee by ID
    EmployeeResponseDTO getEmployeeById(Long id);

    // Add a new employee
    EmployeeResponseDTO addEmployee(EmployeeRequestDTO requestDTO);

    // Update existing employee
    EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO requestDTO);

    // Soft delete: change status to Inactive
    String softDeleteEmployee(Long id);

    // Search employees by name (real-time search)
    List<EmployeeResponseDTO> searchByName(String name);

    // Filter employees by department
    List<EmployeeResponseDTO> filterByDepartment(Long departmentId);

    // Sort employees by name or salary
    List<EmployeeResponseDTO> sortEmployees(String sortBy);
}
