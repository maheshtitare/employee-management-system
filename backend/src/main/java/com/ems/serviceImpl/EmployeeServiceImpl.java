package com.ems.serviceImpl;

import com.ems.dto.EmployeeRequestDTO;
import com.ems.dto.EmployeeResponseDTO;
import com.ems.entity.Department;
import com.ems.entity.Employee;
import com.ems.exception.BadRequestException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import com.ems.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 👨‍💼 EmployeeServiceImpl
 *
 * This is where ALL the business logic for employee management lives.
 * It uses EmployeeRepository to talk to the database.
 * It converts between Entity ↔ DTO using helper methods.
 *
 * @Service → Spring manages this as a service bean
 */
@Service
public class EmployeeServiceImpl implements EmployeeService {

    // Spring automatically injects these repositories
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    // ─────────────────────────────────────────────────
    // 1. GET ALL EMPLOYEES
    // ─────────────────────────────────────────────────
    @Override
    public List<EmployeeResponseDTO> getAllEmployees() {
        // Get all employees from DB, convert each to DTO, return as list
        return employeeRepository.findAll()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────
    // 2. GET EMPLOYEE BY ID
    // ─────────────────────────────────────────────────
    @Override
    public EmployeeResponseDTO getEmployeeById(Long id) {
        // Find employee or throw 404 exception
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        return convertToResponseDTO(employee);
    }

    // ─────────────────────────────────────────────────
    // 3. ADD NEW EMPLOYEE
    // ─────────────────────────────────────────────────
    @Override
    public EmployeeResponseDTO addEmployee(EmployeeRequestDTO dto) {

        // ✅ Check if email already exists
        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email already registered: " + dto.getEmail());
        }

        // ✅ Check if mobile already exists
        if (employeeRepository.existsByMobile(dto.getMobile())) {
            throw new BadRequestException("Mobile number already registered: " + dto.getMobile());
        }

        // ✅ Find the department (throws 404 if not found)
        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", dto.getDepartmentId()));

        // ✅ Build Employee entity from DTO
        Employee employee = new Employee();
        employee.setName(dto.getName());
        employee.setEmail(dto.getEmail());
        employee.setMobile(dto.getMobile());
        employee.setDepartment(department);
        employee.setSalary(dto.getSalary());
        employee.setJoiningDate(dto.getJoiningDate());
        employee.setStatus(dto.getStatus() != null ? dto.getStatus() : "Active");

        // ✅ Save to DB and return response
        Employee saved = employeeRepository.save(employee);
        return convertToResponseDTO(saved);
    }

    // ─────────────────────────────────────────────────
    // 4. UPDATE EMPLOYEE
    // ─────────────────────────────────────────────────
    @Override
    public EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO dto) {

        // Find existing employee
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));

        // Check email uniqueness (only if email is being changed)
        if (!employee.getEmail().equals(dto.getEmail()) && employeeRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email already in use: " + dto.getEmail());
        }

        // Check mobile uniqueness
        if (!employee.getMobile().equals(dto.getMobile()) && employeeRepository.existsByMobile(dto.getMobile())) {
            throw new BadRequestException("Mobile already in use: " + dto.getMobile());
        }

        // Find new department if changed
        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", dto.getDepartmentId()));

        // Update fields
        employee.setName(dto.getName());
        employee.setEmail(dto.getEmail());
        employee.setMobile(dto.getMobile());
        employee.setDepartment(department);
        employee.setSalary(dto.getSalary());
        employee.setJoiningDate(dto.getJoiningDate());
        if (dto.getStatus() != null) employee.setStatus(dto.getStatus());

        Employee updated = employeeRepository.save(employee);
        return convertToResponseDTO(updated);
    }

    // ─────────────────────────────────────────────────
    // 5. SOFT DELETE (change status to Inactive)
    // ─────────────────────────────────────────────────
    @Override
    public String softDeleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));

        // Don't actually delete — just mark as Inactive
        employee.setStatus("Inactive");
        employeeRepository.save(employee);

        return "Employee '" + employee.getName() + "' marked as Inactive successfully.";
    }

    // ─────────────────────────────────────────────────
    // 6. SEARCH BY NAME (real-time)
    // ─────────────────────────────────────────────────
    @Override
    public List<EmployeeResponseDTO> searchByName(String name) {
        return employeeRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────
    // 7. FILTER BY DEPARTMENT
    // ─────────────────────────────────────────────────
    @Override
    public List<EmployeeResponseDTO> filterByDepartment(Long departmentId) {
        return employeeRepository.findByDepartmentId(departmentId)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────
    // 8. SORT BY NAME OR SALARY
    // ─────────────────────────────────────────────────
    @Override
    public List<EmployeeResponseDTO> sortEmployees(String sortBy) {
        List<Employee> sorted;
        if ("salary".equalsIgnoreCase(sortBy)) {
            sorted = employeeRepository.findAllByOrderBySalaryDesc();
        } else {
            sorted = employeeRepository.findAllByOrderByNameAsc();
        }
        return sorted.stream().map(this::convertToResponseDTO).collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────
    // HELPER: Convert Employee entity → EmployeeResponseDTO
    // ─────────────────────────────────────────────────
    private EmployeeResponseDTO convertToResponseDTO(Employee emp) {
        EmployeeResponseDTO dto = new EmployeeResponseDTO();
        dto.setId(emp.getId());
        dto.setName(emp.getName());
        dto.setEmail(emp.getEmail());
        dto.setMobile(emp.getMobile());
        dto.setSalary(emp.getSalary());
        dto.setJoiningDate(emp.getJoiningDate());
        dto.setStatus(emp.getStatus());
        dto.setCreatedAt(emp.getCreatedAt());
        dto.setUpdatedAt(emp.getUpdatedAt());

        // Set department details (null-safe)
        if (emp.getDepartment() != null) {
            dto.setDepartmentId(emp.getDepartment().getId());
            dto.setDepartmentName(emp.getDepartment().getName());
        }

        return dto;
    }
}
