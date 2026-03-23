package com.ems.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 🔐 User Entity
 *
 * Represents a login user of the system.
 * A User can login with email OR mobile number + password.
 * Role can be ADMIN (full access) or USER (view only).
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User's display name (shown in "Welcome, Mahesh 👋")
    @Column(nullable = false)
    private String name;

    // Email for login (optional, but at least one of email/mobile required)
    @Column(unique = true)
    private String email;

    // Mobile number for login
    @Column(unique = true)
    private String mobile;

    // Password (plain text for simplicity - no JWT)
    @Column(nullable = false)
    private String password;

    // ADMIN = full access, USER = view only
    @Column(nullable = false)
    private String role = "USER";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.role == null) this.role = "USER";
    }
}
