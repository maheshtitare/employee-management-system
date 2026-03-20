package com.emp.management.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * User entity - stores login credentials.
 * This is SEPARATE from Employee. Think of it as the "login account".
 * An admin uses this to log in, not the Employee table.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password; // BCrypt hashed - never store plain text!

    @Enumerated(EnumType.STRING)  // Stores "ADMIN" or "EMPLOYEE" as string in DB
    private Role role;

    // Enum inside the class - keeps it organized
    public enum Role {
        ADMIN,      // Can add/edit/delete employees
        EMPLOYEE    // Can only view
    }
}
