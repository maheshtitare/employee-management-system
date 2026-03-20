package com.emp.management;

import com.emp.management.entity.Employee;
import com.emp.management.entity.User;
import com.emp.management.repository.EmployeeRepository;
import com.emp.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * DataInitializer - runs automatically when the app starts.
 * Seeds the database with default users and sample employees.
 * CommandLineRunner.run() is called after Spring context is loaded.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // ── Create Admin User ────────────────────────────────────────────────
        if (userRepository.findByEmail("admin@company.com").isEmpty()) {
            User admin = User.builder()
                .name("Admin User")
                .email("admin@company.com")
                .password(passwordEncoder.encode("admin123")) // BCrypt hash
                .role(User.Role.ADMIN)
                .build();
            userRepository.save(admin);
            System.out.println("✅ Admin created: admin@company.com / admin123");
        }

        // ── Create Employee User ─────────────────────────────────────────────
        if (userRepository.findByEmail("employee@company.com").isEmpty()) {
            User emp = User.builder()
                .name("John Doe")
                .email("employee@company.com")
                .password(passwordEncoder.encode("emp123"))
                .role(User.Role.EMPLOYEE)
                .build();
            userRepository.save(emp);
            System.out.println("✅ Employee created: employee@company.com / emp123");
        }

        // ── Seed Sample Employees (only if table is empty) ───────────────────
        if (employeeRepository.count() == 0) {
            employeeRepository.save(Employee.builder().name("Rahul Sharma").email("rahul@company.com").department("IT").salary(75000.0).build());
            employeeRepository.save(Employee.builder().name("Priya Patel").email("priya@company.com").department("HR").salary(55000.0).build());
            employeeRepository.save(Employee.builder().name("Amit Verma").email("amit@company.com").department("Finance").salary(65000.0).build());
            employeeRepository.save(Employee.builder().name("Sneha Joshi").email("sneha@company.com").department("IT").salary(80000.0).build());
            employeeRepository.save(Employee.builder().name("Rohan Mehta").email("rohan@company.com").department("Marketing").salary(60000.0).build());
            employeeRepository.save(Employee.builder().name("Kavya Reddy").email("kavya@company.com").department("IT").salary(70000.0).build());
            employeeRepository.save(Employee.builder().name("Deepak Kumar").email("deepak@company.com").department("Operations").salary(50000.0).build());
            System.out.println("✅ Sample employees seeded!");
        }
    }
}
