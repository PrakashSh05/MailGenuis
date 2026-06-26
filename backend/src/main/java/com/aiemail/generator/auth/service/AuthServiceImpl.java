package com.aiemail.generator.auth.service;

import com.aiemail.generator.auth.dto.AuthResponse;
import com.aiemail.generator.auth.dto.LoginRequest;
import com.aiemail.generator.auth.dto.RegisterRequest;
import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.auth.mapper.AuthMapper;
import com.aiemail.generator.auth.repository.UserRepository;
import com.aiemail.generator.common.enums.UserRole;
import com.aiemail.generator.exception.ConflictException;
import com.aiemail.generator.exception.UnauthorizedException;
import com.aiemail.generator.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final AuthMapper authMapper;

    @Autowired
    public AuthServiceImpl(UserRepository userRepository,
                            PasswordEncoder passwordEncoder,
                            AuthenticationManager authenticationManager,
                            JwtTokenProvider tokenProvider,
                            AuthMapper authMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.authMapper = authMapper;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email address is already in use");
        }

        UserEntity user = authMapper.registerRequestToUserEntity(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.ROLE_USER);
        user.setDarkModeEnabled(false);
        user.setThemePreference("light");

        UserEntity savedUser = userRepository.save(user);

        // Authenticate programmatically to return active token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        AuthResponse response = authMapper.userEntityToAuthResponse(savedUser);
        response.setToken(jwt);
        response.setExpiresIn(tokenProvider.getJwtExpirationMs());
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            UserEntity user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

            AuthResponse response = authMapper.userEntityToAuthResponse(user);
            response.setToken(jwt);
            response.setExpiresIn(tokenProvider.getJwtExpirationMs());
            return response;
        } catch (BadCredentialsException ex) {
            throw new UnauthorizedException("Invalid email or password");
        }
    }
}
