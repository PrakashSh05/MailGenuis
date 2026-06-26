package com.aiemail.generator.auth.service;

import com.aiemail.generator.auth.dto.AuthResponse;
import com.aiemail.generator.auth.dto.LoginRequest;
import com.aiemail.generator.auth.dto.RegisterRequest;
import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.auth.mapper.AuthMapper;
import com.aiemail.generator.auth.repository.UserRepository;
import com.aiemail.generator.exception.ConflictException;
import com.aiemail.generator.exception.UnauthorizedException;
import com.aiemail.generator.security.JwtTokenProvider;
import com.aiemail.generator.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtTokenProvider tokenProvider;
    @Mock private AuthMapper authMapper;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private UserEntity userEntity;
    private AuthResponse authResponse;
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFullName("Test User");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        userEntity = new UserEntity();
        userEntity.setId(UUID.randomUUID());
        userEntity.setEmail("test@example.com");
        userEntity.setFullName("Test User");

        authResponse = new AuthResponse();
        authResponse.setEmail("test@example.com");
        authResponse.setFullName("Test User");

        UserPrincipal principal = new UserPrincipal(
                userEntity.getId(), userEntity.getEmail(), "hashed",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
        authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
    }

    @Test
    void register_success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(authMapper.registerRequestToUserEntity(any())).thenReturn(userEntity);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(UserEntity.class))).thenReturn(userEntity);
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(tokenProvider.generateToken(any())).thenReturn("jwt-token");
        when(tokenProvider.getJwtExpirationMs()).thenReturn(86400000L);
        when(authMapper.userEntityToAuthResponse(any())).thenReturn(authResponse);

        AuthResponse result = authService.register(registerRequest);

        assertNotNull(result);
        assertEquals("jwt-token", result.getToken());
        assertEquals(86400000L, result.getExpiresIn());
        verify(userRepository).save(any(UserEntity.class));
    }

    @Test
    void register_duplicateEmail_throwsConflict() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThrows(ConflictException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_success() {
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(tokenProvider.generateToken(any())).thenReturn("jwt-token");
        when(tokenProvider.getJwtExpirationMs()).thenReturn(86400000L);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(userEntity));
        when(authMapper.userEntityToAuthResponse(any())).thenReturn(authResponse);

        AuthResponse result = authService.login(loginRequest);

        assertNotNull(result);
        assertEquals("jwt-token", result.getToken());
    }

    @Test
    void login_badCredentials_throwsUnauthorized() {
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(UnauthorizedException.class, () -> authService.login(loginRequest));
    }
}
