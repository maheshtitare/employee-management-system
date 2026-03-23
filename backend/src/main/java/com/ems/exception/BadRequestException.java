package com.ems.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * 🟡 BadRequestException
 *
 * Thrown when input data is invalid or a business rule is violated.
 * Example: duplicate email, wrong OTP, invalid login credentials.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
