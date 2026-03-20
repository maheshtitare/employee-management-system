package com.emp.management.dto;

import lombok.Data;

/**
 * LoginRequest - data the frontend sends when user logs in.
 * DTO = Data Transfer Object (just a container for data, no business logic)
 */
@Data
public class LoginRequest {
    private String email;
    private String password;
}
