package com.ems.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 🔐 LoginRequestDTO - sent by frontend during login */
@Data @NoArgsConstructor @AllArgsConstructor
public class LoginRequestDTO {
    private String email;    // login via email
    private String mobile;   // OR login via mobile
    @NotBlank(message = "Password is required")
    private String password;
}
