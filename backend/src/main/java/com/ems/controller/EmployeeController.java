package com.ems.controller;

import com.ems.dto.EmployeeRequestDTO;
import com.ems.dto.EmployeeResponseDTO;
import com.ems.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 👨‍💼 EmployeeController
 *
 * REST API endpoints for Employee CRUD operations.
 * All endpoints are prefixed with /api/employees
 *
 * @RestController → returns JSON responses automatically
 * @RequestMapping → base URL for all methods in this controller
 * @CrossOrigin    → allow requests from React frontend
 */
@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    // ─────────────────────────────────────────────────
    // GET /api/employees → Get all employees
    // ─────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<EmployeeResponseDTO>> getAllEmployees() {
        List<EmployeeResponseDTO> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);   // 200 OK
    }

    // ─────────────────────────────────────────────────
    // GET /api/employees/{id} → Get employee by ID
    // ─────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponseDTO> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    // ─────────────────────────────────────────────────
    // POST /api/employees → Add new employee
    // ─────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<EmployeeResponseDTO> addEmployee(
            @Valid @RequestBody EmployeeRequestDTO requestDTO) {
        EmployeeResponseDTO created = employeeService.addEmployee(requestDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);  // 201 Created
    }

    // ─────────────────────────────────────────────────
    // PUT /api/employees/{id} → Update employee
    // ─────────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponseDTO> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequestDTO requestDTO) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, requestDTO));
    }

    // ─────────────────────────────────────────────────
    // DELETE /api/employees/{id} → Soft delete (Inactive)
    // ─────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long id) {
        String message = employeeService.softDeleteEmployee(id);
        return ResponseEntity.ok(message);
    }

    // ─────────────────────────────────────────────────
    // GET /api/employees/search?name=Aarav → Search by name
    // ─────────────────────────────────────────────────
    @GetMapping("/search")
    public ResponseEntity<List<EmployeeResponseDTO>> searchByName(
            @RequestParam String name) {
        return ResponseEntity.ok(employeeService.searchByName(name));
    }

    // ─────────────────────────────────────────────────
    // GET /api/employees/filter?departmentId=2 → Filter by dept
    // ─────────────────────────────────────────────────
    @GetMapping("/filter")
    public ResponseEntity<List<EmployeeResponseDTO>> filterByDepartment(
            @RequestParam Long departmentId) {
        return ResponseEntity.ok(employeeService.filterByDepartment(departmentId));
    }

    // ─────────────────────────────────────────────────
    // GET /api/employees/sort?sortBy=salary → Sort list
    // ─────────────────────────────────────────────────
    @GetMapping("/sort")
    public ResponseEntity<List<EmployeeResponseDTO>> sortEmployees(
            @RequestParam(defaultValue = "name") String sortBy) {
        return ResponseEntity.ok(employeeService.sortEmployees(sortBy));
    }
}
