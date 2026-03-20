package com.emp.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point of the Spring Boot application.
 * @SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan
 */
@SpringBootApplication
public class EmployeeManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmployeeManagementApplication.class, args);
    }
}
