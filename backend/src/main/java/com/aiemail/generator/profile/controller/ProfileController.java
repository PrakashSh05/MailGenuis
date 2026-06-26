package com.aiemail.generator.profile.controller;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.auth.repository.UserRepository;
import com.aiemail.generator.common.response.ApiResponse;
import com.aiemail.generator.exception.UnauthorizedException;
import com.aiemail.generator.profile.dto.*;
import com.aiemail.generator.profile.service.ProfileService;
import com.aiemail.generator.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final ProfileService profileService;
    private final UserRepository userRepository;

    @Autowired
    public ProfileController(ProfileService profileService, UserRepository userRepository) {
        this.profileService = profileService;
        this.userRepository = userRepository;
    }

    private UserEntity getAuthenticatedUser(UserPrincipal principal) {
        if (principal == null) {
            throw new UnauthorizedException("User is not authenticated");
        }
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest servletRequest) {
        UserEntity user = getAuthenticatedUser(principal);
        ProfileResponse response = profileService.getProfile(user);
        ApiResponse<ProfileResponse> body = ApiResponse.success(response, "Profile retrieved successfully", servletRequest.getRequestURI());
        return ResponseEntity.ok(body);
    }

    @PutMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest servletRequest) {
        UserEntity user = getAuthenticatedUser(principal);
        ProfileResponse response = profileService.updateProfile(request, user);
        ApiResponse<ProfileResponse> body = ApiResponse.success(response, "Profile updated successfully", servletRequest.getRequestURI());
        return ResponseEntity.ok(body);
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> updatePassword(
            @Valid @RequestBody UpdatePasswordRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest servletRequest) {
        UserEntity user = getAuthenticatedUser(principal);
        profileService.updatePassword(request, user);
        ApiResponse<Void> body = ApiResponse.success(null, "Password updated successfully", servletRequest.getRequestURI());
        return ResponseEntity.ok(body);
    }

    @PutMapping("/settings")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateSettings(
            @Valid @RequestBody UpdateSettingsRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest servletRequest) {
        UserEntity user = getAuthenticatedUser(principal);
        ProfileResponse response = profileService.updateSettings(request, user);
        ApiResponse<ProfileResponse> body = ApiResponse.success(response, "Settings updated successfully", servletRequest.getRequestURI());
        return ResponseEntity.ok(body);
    }
}
