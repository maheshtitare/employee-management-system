package com.emp.management.controller;

import com.emp.management.dto.*;
import com.emp.management.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController - handles authentication endpoints.
 * This is PUBLIC (no JWT needed) - see SecurityConfig.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * POST /api/auth/login
     * Body: { "email": "admin@company.com", "password": "admin123" }
     * Returns: JWT token + user info
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
