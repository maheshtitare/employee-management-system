package com.ems.serviceImpl;

import com.ems.dto.DepartmentDTO;
import com.ems.entity.Department;
import com.ems.exception.BadRequestException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import com.ems.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 🏢 DepartmentServiceImpl
 *
 * Business logic for Department CRUD operations.
 * Also calculates employee count per department.
 */
@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    // Get all departments with employee count
    @Override
    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get one department by ID
    @Override
    public DepartmentDTO getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        return convertToDTO(dept);
    }

    // Create new department
    @Override
    public DepartmentDTO createDepartment(DepartmentDTO dto) {
        // Check duplicate name
        if (departmentRepository.existsByName(dto.getName())) {
            throw new BadRequestException("Department already exists: " + dto.getName());
        }
        Department dept = new Department();
        dept.setName(dto.getName());
        Department saved = departmentRepository.save(dept);
        return convertToDTO(saved);
    }

    // Update department name
    @Override
    public DepartmentDTO updateDepartment(Long id, DepartmentDTO dto) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        dept.setName(dto.getName());
        Department updated = departmentRepository.save(dept);
        return convertToDTO(updated);
    }

    // Delete department (only if no employees assigned)
    @Override
    public String deleteDepartment(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));

        // Safety check: don't delete if employees exist
        List<?> employees = employeeRepository.findByDepartmentId(id);
        if (!employees.isEmpty()) {
            throw new BadRequestException("Cannot delete department with assigned employees. Reassign employees first.");
        }

        departmentRepository.delete(dept);
        return "Department '" + dept.getName() + "' deleted successfully.";
    }

    // Helper: Convert entity → DTO (with employee count)
    private DepartmentDTO convertToDTO(Department dept) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(dept.getId());
        dto.setName(dept.getName());

        // Count active employees in this department
        int count = employeeRepository.findByDepartmentId(dept.getId()).size();
        dto.setEmployeeCount(count);

        return dto;
    }
}
