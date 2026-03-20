package com.emp.management.security;

import com.emp.management.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

/**
 * JwtAuthFilter - runs on EVERY request before it reaches the controller.
 * OncePerRequestFilter = runs exactly once per HTTP request.
 *
 * What it does:
 * 1. Reads the "Authorization: Bearer <token>" header
 * 2. Validates the token
 * 3. Sets the user in Spring Security's context
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // Step 1: Read Authorization header
        String authHeader = request.getHeader("Authorization");

        // Step 2: Check if header exists and starts with "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7); // Remove "Bearer " prefix

            // Step 3: Validate the token
            if (jwtUtil.validateToken(token)) {
                String email = jwtUtil.getEmailFromToken(token);

                // Step 4: Load user from DB and set in Security Context
                userRepository.findByEmail(email).ifPresent(user -> {
                    // Create authority like "ROLE_ADMIN" or "ROLE_EMPLOYEE"
                    SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority("ROLE_" + user.getRole().name());

                    // Tell Spring Security: "This user is authenticated"
                    UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(email, null, List.of(authority));
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                });
            }
        }

        // Step 5: Continue to next filter or controller
        filterChain.doFilter(request, response);
    }
}
