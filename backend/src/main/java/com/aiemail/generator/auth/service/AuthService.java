package com.aiemail.generator.auth.service;

import com.aiemail.generator.auth.dto.AuthResponse;
import com.aiemail.generator.auth.dto.LoginRequest;
import com.aiemail.generator.auth.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
