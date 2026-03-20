package com.emp.management.service;

import com.emp.management.dto.*;
import com.emp.management.entity.User;
import com.emp.management.repository.UserRepository;
import com.emp.management.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * AuthService - handles login logic.
 * Service layer = where business logic lives (between Controller and Repository).
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // BCrypt encoder from SecurityConfig

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Login process:
     * 1. Find user by email
     * 2. Compare passwords using BCrypt
     * 3. If correct, generate and return JWT token
     */
    public LoginResponse login(LoginRequest request) {
        // Step 1: Find user - throw error if not found
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Step 2: Check if password matches (BCrypt comparison)
        // passwordEncoder.matches() hashes the input and compares with stored hash
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Step 3: Generate JWT token with email and role
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        // Step 4: Return token + user info
        return new LoginResponse(token, user.getEmail(), user.getRole().name(), user.getName());
    }
}
