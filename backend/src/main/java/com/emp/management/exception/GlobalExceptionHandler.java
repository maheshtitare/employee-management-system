package com.emp.management.exception;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

/**
 * GlobalExceptionHandler - catches exceptions from ALL controllers in one place.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle EmployeeNotFoundException - returns 404 Not Found.
     */
    @ExceptionHandler(EmployeeNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleEmployeeNotFound(EmployeeNotFoundException ex) {
        Map<String, Object> error = new LinkedHashMap<>();
        error.put("timestamp", LocalDateTime.now().toString());
        error.put("status", 404);
        error.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * Handle runtime exceptions - FIXED (400 → 500)
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> error = new LinkedHashMap<>();
        error.put("timestamp", LocalDateTime.now().toString());
        error.put("status", 500); // ✅ FIXED
        error.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error); // ✅ FIXED
    }

    /**
     * Catch-all for any other unexpected errors - returns 500.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> error = new LinkedHashMap<>();
        error.put("timestamp", LocalDateTime.now().toString());
        error.put("status", 500);
        error.put("message", "Internal server error: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}