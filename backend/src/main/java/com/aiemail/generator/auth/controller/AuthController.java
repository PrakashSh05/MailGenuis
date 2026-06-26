package com.aiemail.generator.auth.controller;

import com.aiemail.generator.auth.dto.AuthResponse;
import com.aiemail.generator.auth.dto.LoginRequest;
import com.aiemail.generator.auth.dto.RegisterRequest;
import com.aiemail.generator.auth.service.AuthService;
import com.aiemail.generator.common.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request, HttpServletRequest servletRequest) {
        AuthResponse response = authService.register(request);
        ApiResponse<AuthResponse> body = ApiResponse.success(response, "User registered successfully", servletRequest.getRequestURI());
        return new ResponseEntity<>(body, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request, HttpServletRequest servletRequest) {
        AuthResponse response = authService.login(request);
        ApiResponse<AuthResponse> body = ApiResponse.success(response, "Login successful", servletRequest.getRequestURI());
        return ResponseEntity.ok(body);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest servletRequest) {
        SecurityContextHolder.clearContext();
        ApiResponse<Void> body = ApiResponse.success(null, "Logout successful", servletRequest.getRequestURI());
        return ResponseEntity.ok(body);
    }
}
