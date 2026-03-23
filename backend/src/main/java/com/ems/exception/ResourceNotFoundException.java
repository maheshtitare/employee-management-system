package com.ems.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * 🔴 ResourceNotFoundException
 *
 * Thrown when a requested resource (employee/department) is not found in DB.
 * Example: GET /api/employees/999 → employee not found → throw this
 *
 * @ResponseStatus → Spring returns 404 HTTP status automatically
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    // Convenience constructor: "Employee not found with id: 5"
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: %s", resourceName, fieldName, fieldValue));
    }
}
