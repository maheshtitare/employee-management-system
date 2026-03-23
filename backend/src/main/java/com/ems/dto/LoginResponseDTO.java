package com.ems.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/** 📤 LoginResponseDTO - returned after successful login */
@Data @NoArgsConstructor @AllArgsConstructor
public class LoginResponseDTO {
    private Long userId;
    private String name;
    private String email;
    private String role;
    private String message;
}
