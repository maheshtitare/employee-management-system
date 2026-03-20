package com.emp.management.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

/**
 * JwtUtil - Utility class for JWT operations.
 *
 * JWT (JSON Web Token) looks like: xxxxx.yyyyy.zzzzz
 *   - Header: algorithm type
 *   - Payload: user data (email, role, expiry)
 *   - Signature: proves token is not tampered
 */
@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration}")
    private long expiration;

    /**
     * Generate a JWT token for a logged-in user.
     * We store email and role inside the token.
     */
    public String generateToken(String email, String role) {
        Key key = Keys.hmacShaKeyFor(secret.getBytes());

        return Jwts.builder()
            .setSubject(email)           // Who is this token for
            .claim("role", role)         // Store role in token payload
            .setIssuedAt(new Date())     // When was it created
            .setExpiration(new Date(System.currentTimeMillis() + expiration)) // When it expires
            .signWith(key)               // Sign with secret key
            .compact();                  // Build the token string
    }

    /**
     * Extract the email (subject) from a token.
     */
    public String getEmailFromToken(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * Check if a token is valid (not expired, not tampered).
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token); // throws exception if invalid
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false; // Token is invalid
        }
    }

    // Private helper to parse and verify the token
    private Claims parseClaims(String token) {
        Key key = Keys.hmacShaKeyFor(secret.getBytes());
        return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();
    }
}
