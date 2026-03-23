package com.ems.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 👨‍💼 Employee Entity
 *
 * This class maps to the "employees" table in MySQL.
 * Contains all employee fields as required in the project spec.
 *
 * @Entity  → JPA will manage this class as a DB table
 * @Data    → Lombok auto-generates boilerplate code
 */
@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    // Primary key - auto-incremented
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Employee full name
    @Column(nullable = false)
    private String name;

    // Unique email address
    @Column(nullable = false, unique = true)
    private String email;

    // Unique mobile number
    @Column(nullable = false, unique = true)
    private String mobile;

    // Many employees can belong to one department
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")   // Foreign key column in employees table
    private Department department;

    // Employee salary
    @Column(precision = 12, scale = 2)
    private BigDecimal salary;

    // Date when employee joined the company
    @Column(name = "joining_date")
    private LocalDate joiningDate;

    // Status: "Active" or "Inactive" (used for soft delete)
    @Column(nullable = false)
    private String status = "Active";

    // Auto-set when employee is first created
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Auto-updated whenever employee record changes
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Called automatically before first save
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = "Active";
    }

    // Called automatically before every update
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
