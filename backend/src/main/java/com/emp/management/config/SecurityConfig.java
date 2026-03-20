package com.emp.management.config;

import com.emp.management.security.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import java.util.List;

/**
 * SecurityConfig - configures Spring Security for JWT-based auth.
 *
 * Key concepts:
 * - STATELESS: No HTTP session. Each request must carry JWT token.
 * - CSRF disabled: Not needed for REST APIs with JWT.
 * - CORS enabled: Allows React app (port 3000) to call Spring (port 8080).
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Allow CORS (Cross-Origin Resource Sharing) for React frontend
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Disable CSRF - not needed for stateless REST APIs
            .csrf(csrf -> csrf.disable())

            // Use STATELESS sessions - no cookies, no session storage
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Define which URLs are public vs protected
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()  // Login = public
                .anyRequest().authenticated()                  // Everything else needs JWT
            )

            // Add our JWT filter BEFORE Spring's default login filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * BCrypt password encoder - hashes passwords securely.
     * Plain text password NEVER stored in DB.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * CORS configuration - allows React (localhost:3000) to call our API.
     * Without this, browser will block the request!
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
