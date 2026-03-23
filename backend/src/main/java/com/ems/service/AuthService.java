package com.ems.service;

import com.ems.dto.*;

/**
 * 🔐 AuthService Interface
 * Handles login, forgot password, reset password
 */
public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO requestDTO);
    String forgotPassword(ForgotPasswordDTO dto);
    String resetPassword(ResetPasswordDTO dto);
}
