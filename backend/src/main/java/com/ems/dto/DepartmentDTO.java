package com.ems.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/** 🏢 DepartmentDTO */
@Data @NoArgsConstructor @AllArgsConstructor
public class DepartmentDTO {
    private Long id;
    @NotBlank(message = "Department name is required")
    private String name;
    private int employeeCount;
}
