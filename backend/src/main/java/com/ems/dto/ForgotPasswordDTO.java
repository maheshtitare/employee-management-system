package com.ems.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 🔑 ForgotPasswordDTO - user enters email or mobile */
@Data @NoArgsConstructor @AllArgsConstructor
public class ForgotPasswordDTO {
    private String email;
    private String mobile;
}
