package com.emp.management.exception;

/**
 * Custom exception thrown when an employee is not found in the database.
 * By having a specific exception, we can handle it differently in GlobalExceptionHandler.
 */
public class EmployeeNotFoundException extends RuntimeException {

    public EmployeeNotFoundException(Long id) {
        super("Employee not found with ID: " + id);
    }
}
