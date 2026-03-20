package com.emp.management.repository;

import com.emp.management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * UserRepository - Spring Data JPA handles all SQL automatically!
 * JpaRepository<User, Long> means: "Repository for User entity, with Long as ID type"
 *
 * Spring auto-generates: findAll(), findById(), save(), deleteById() etc.
 * We only need to define custom queries here.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring generates: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);
}
