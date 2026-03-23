package com.ems.repository;

import com.ems.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 🔐 User Repository
 *
 * Handles all DB operations for the users table.
 * Used during login, forgot password, reset password.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email (for email+password login)
    Optional<User> findByEmail(String email);

    // Find user by mobile number (for mobile+password login)
    Optional<User> findByMobile(String mobile);

    // Find user by email OR mobile (flexible login)
    Optional<User> findByEmailOrMobile(String email, String mobile);

    // Check if email already registered
    boolean existsByEmail(String email);

    // Check if mobile already registered
    boolean existsByMobile(String mobile);
}
