package com.ems.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 🏢 Department Entity
 *
 * This class maps to the "departments" table in MySQL.
 * Each Department can have many Employees (One-to-Many relationship).
 *
 * @Entity  → tells JPA this is a database table
 * @Table   → specifies the table name
 * @Data    → Lombok: auto-generates getters, setters, toString
 */
@Entity
@Table(name = "departments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Department {

    // Auto-incremented primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Department name must be unique (e.g., HR, IT, Sales)
    @Column(nullable = false, unique = true)
    private String name;

    // One Department → Many Employees (mappedBy = field name in Employee entity)
    // FetchType.LAZY means employees are loaded only when accessed
    @OneToMany(mappedBy = "department", fetch = FetchType.LAZY)
    private List<Employee> employees;

    // Timestamp when department was created
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Auto-set createdAt before saving to DB
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
