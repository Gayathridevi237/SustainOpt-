package com.sustainopt.backend.auth.controller;

import com.sustainopt.backend.auth.dto.LoginRequest;
import com.sustainopt.backend.auth.dto.LoginResponse;
import com.sustainopt.backend.auth.dto.RegistrationRequest;
import com.sustainopt.backend.auth.dto.RegistrationResponse;
import com.sustainopt.backend.auth.service.AuthenticationService;
import com.sustainopt.backend.common.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    // ===========================
    // Register
    // ===========================
    @PostMapping("/register")
    public ApiResponse<RegistrationResponse> register(
            @Valid @RequestBody RegistrationRequest request) {

        RegistrationResponse response = authenticationService.register(request);

        return new ApiResponse<>(
                true,
                "User registered successfully.",
                response
        );
    }

    // ===========================
    // Login
    // ===========================
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response = authenticationService.login(request);

        return new ApiResponse<>(
                true,
                "Login successful.",
                response
        );
    }
}