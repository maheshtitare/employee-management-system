package com.ems.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 🔄 ResetPasswordDTO - user submits OTP + new password */
@Data @NoArgsConstructor @AllArgsConstructor
public class ResetPasswordDTO {
    private String email;
    private String mobile;

    @NotBlank(message = "OTP is required")
    private String otp;

    @NotBlank(message = "New password is required")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,}$",
        message = "Password: 8+ chars, uppercase, lowercase, number, special character"
    )
    private String newPassword;
}
