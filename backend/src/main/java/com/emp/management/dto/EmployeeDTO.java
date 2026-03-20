package com.emp.management.dto;

import lombok.Data;

/**
 * EmployeeDTO - used when adding or updating an employee.
 * We use DTO instead of the Entity directly to control what data comes in.
 */
@Data
public class EmployeeDTO {
    private String name;
    private String email;
    private String department;
    private Double salary;
}
