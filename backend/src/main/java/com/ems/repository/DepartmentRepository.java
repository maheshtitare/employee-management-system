package com.ems.repository;

import com.ems.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 🏢 Department Repository
 *
 * Handles all DB operations for Department table.
 * JpaRepository provides basic CRUD out of the box.
 */
@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    // Check if department name already exists
    boolean existsByName(String name);

    // Find department by name
    Optional<Department> findByName(String name);
}
