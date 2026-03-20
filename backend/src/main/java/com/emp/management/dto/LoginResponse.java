package com.emp.management.dto;

import lombok.*;

/**
 * LoginResponse - data we send BACK to frontend after successful login.
 * Frontend stores this in localStorage.
 */
@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;    // JWT token - send this in every future request
    private String email;
    private String role;     // "ADMIN" or "EMPLOYEE"
    private String name;
}
