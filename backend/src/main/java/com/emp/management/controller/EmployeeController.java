package com.emp.management.controller;

import java.util.Map;
import com.emp.management.dto.*;
import com.emp.management.entity.Employee;
import com.emp.management.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

/**
 * EmployeeController - REST API endpoints for employee CRUD operations.
 * All endpoints are PROTECTED (JWT required) - see SecurityConfig.
 *
 * REST conventions:
 * GET    /api/employees       - get all (with filters)
 * GET    /api/employees/{id}  - get one
 * POST   /api/employees       - create new
 * PUT    /api/employees/{id}  - update existing
 * DELETE /api/employees/{id}  - delete
 */
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    /**
     * GET /api/employees?name=john&department=IT&page=0&size=5
     * @RequestParam with defaultValue = optional query params
     */
    @GetMapping
    public ResponseEntity<PageResponse<Employee>> getAllEmployees(
            @RequestParam(defaultValue = "") String name,
            @RequestParam(defaultValue = "") String department,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        PageResponse<Employee> response = employeeService.getAllEmployees(name, department, page, size);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/employees/5  - get employee with ID=5
     * @PathVariable extracts {id} from the URL
     */
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployee(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    /**
     * POST /api/employees  - create a new employee
     * @RequestBody reads JSON body and converts to EmployeeDTO
     */
    @PostMapping
    public ResponseEntity<Employee> addEmployee(@RequestBody EmployeeDTO dto) {
        Employee created = employeeService.addEmployee(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created); // 201 Created
    }

    /**
     * PUT /api/employees/5  - update employee with ID=5
     */
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable Long id,
            @RequestBody EmployeeDTO dto) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, dto));
    }

    /**
     * DELETE /api/employees/5  - delete employee with ID=5
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(Map.of("message", "Employee deleted successfully"));
    }
}
