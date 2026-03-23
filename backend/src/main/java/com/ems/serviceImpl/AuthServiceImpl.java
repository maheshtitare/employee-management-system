package com.ems.serviceImpl;

import com.ems.dto.*;
import com.ems.entity.User;
import com.ems.exception.BadRequestException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.UserRepository;
import com.ems.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * 🔐 AuthServiceImpl
 *
 * Handles login, forgot password, reset password.
 * Uses simple plain-text password comparison (no JWT, no BCrypt — fresher level).
 * OTP is simulated with a static value "123456" for demo purposes.
 */
@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    // In-memory OTP store: key = email/mobile, value = OTP
    // In production, you'd use Redis or DB — but for fresher demo, HashMap is fine
    private final Map<String, String> otpStore = new HashMap<>();

    // Static OTP for demo purposes
    private static final String DEMO_OTP = "123456";

    // ─────────────────────────────────────────────────
    // LOGIN: email+password OR mobile+password
    // ─────────────────────────────────────────────────
    @Override
    public LoginResponseDTO login(LoginRequestDTO dto) {

        // Find user by email or mobile
        Optional<User> userOpt;

        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            // Login via email
            userOpt = userRepository.findByEmail(dto.getEmail());
        } else if (dto.getMobile() != null && !dto.getMobile().isBlank()) {
            // Login via mobile
            userOpt = userRepository.findByMobile(dto.getMobile());
        } else {
            throw new BadRequestException("Please provide email or mobile number.");
        }

        // User not found
        User user = userOpt.orElseThrow(() ->
                new BadRequestException("No account found with provided credentials."));

        // Check password (plain text comparison — simple for fresher project)
        if (!user.getPassword().equals(dto.getPassword())) {
            throw new BadRequestException("Incorrect password. Please try again.");
        }

        // Login successful — return user info
        return new LoginResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                "Welcome back, " + user.getName() + " 👋"
        );
    }

    // ─────────────────────────────────────────────────
    // FORGOT PASSWORD: Simulate OTP send
    // ─────────────────────────────────────────────────
    @Override
    public String forgotPassword(ForgotPasswordDTO dto) {

        // Find user by email or mobile
        Optional<User> userOpt;

        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            userOpt = userRepository.findByEmail(dto.getEmail());
        } else if (dto.getMobile() != null && !dto.getMobile().isBlank()) {
            userOpt = userRepository.findByMobile(dto.getMobile());
        } else {
            throw new BadRequestException("Please provide email or mobile.");
        }

        userOpt.orElseThrow(() -> new BadRequestException("No account found with provided credentials."));

        // Store the static OTP mapped to identifier
        String key = dto.getEmail() != null ? dto.getEmail() : dto.getMobile();
        otpStore.put(key, DEMO_OTP);

        // In real project: send OTP via email/SMS
        return "OTP sent successfully! (Demo OTP: 123456)";
    }

    // ─────────────────────────────────────────────────
    // RESET PASSWORD: Verify OTP + update password
    // ─────────────────────────────────────────────────
    @Override
    public String resetPassword(ResetPasswordDTO dto) {

        String key = dto.getEmail() != null ? dto.getEmail() : dto.getMobile();

        // Validate OTP
        String storedOtp = otpStore.get(key);
        if (storedOtp == null || !storedOtp.equals(dto.getOtp())) {
            throw new BadRequestException("Invalid or expired OTP.");
        }

        // Find user
        Optional<User> userOpt = dto.getEmail() != null
                ? userRepository.findByEmail(dto.getEmail())
                : userRepository.findByMobile(dto.getMobile());

        User user = userOpt.orElseThrow(() ->
                new BadRequestException("User not found."));

        // Update password
        user.setPassword(dto.getNewPassword());
        userRepository.save(user);

        // Remove OTP after use (one-time use)
        otpStore.remove(key);

        return "Password reset successfully! Please login with your new password.";
    }
}
