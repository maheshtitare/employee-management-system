package com.emp.management.repository;

import com.emp.management.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * EmployeeRepository - handles all Employee database queries.
 * Using JPQL (Java Persistence Query Language) - similar to SQL but uses class names.
 */
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    /**
     * Search by name AND filter by department with pagination.
     * - :name IS NULL means "skip this filter if name is not provided"
     * - LOWER(...) LIKE LOWER(...) = case-insensitive search
     * - Pageable = Spring handles page number, page size, sorting
     */
    @Query("SELECT e FROM Employee e WHERE " +
           "(:name IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:department IS NULL OR e.department = :department)")
    Page<Employee> searchEmployees(
        @Param("name") String name,
        @Param("department") String department,
        Pageable pageable
    );

    /**
     * For Dashboard: count employees grouped by department.
     * Returns List of Object[] where [0] = dept name, [1] = count.
     */
    @Query("SELECT e.department, COUNT(e) FROM Employee e GROUP BY e.department")
    List<Object[]> countByDepartment();
}
