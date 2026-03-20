package com.emp.management.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Employee entity - maps to the "employees" table in MySQL.
 * Each field = one column in the database.
 */
@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-increment ID
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private Double salary;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /**
     * @PrePersist runs automatically BEFORE saving to DB.
     * This sets the createdAt timestamp automatically.
     */
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
