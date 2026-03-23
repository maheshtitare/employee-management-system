package com.ems.repository;

import com.ems.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 📦 Employee Repository
 *
 * Extends JpaRepository → automatically gives us:
 * - findAll(), findById(), save(), deleteById(), count(), etc.
 *
 * We add custom query methods below using Spring Data's method naming conventions.
 * Spring automatically generates the SQL query from the method name!
 */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Find employees whose name contains the search text (case-insensitive)
    // SQL: SELECT * FROM employees WHERE LOWER(name) LIKE %search%
    List<Employee> findByNameContainingIgnoreCase(String name);

    // Find employees by department ID
    // SQL: SELECT * FROM employees WHERE department_id = ?
    List<Employee> findByDepartmentId(Long departmentId);

    // Find employees by status (Active / Inactive)
    List<Employee> findByStatus(String status);

    // Count how many active employees are in each department
    // Used for dashboard stats
    @Query("SELECT e.department.id, COUNT(e) FROM Employee e WHERE e.status = 'Active' GROUP BY e.department.id")
    List<Object[]> countEmployeesGroupByDepartment();

    // Count total active employees
    long countByStatus(String status);

    // Check if email already exists (for validation)
    boolean existsByEmail(String email);

    // Check if mobile already exists (for validation)
    boolean existsByMobile(String mobile);

    // Find all employees ordered by name A-Z
    List<Employee> findAllByOrderByNameAsc();

    // Find all employees ordered by salary (high to low)
    List<Employee> findAllByOrderBySalaryDesc();
}
