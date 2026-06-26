package com.aiemail.generator.email.controller;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.auth.repository.UserRepository;
import com.aiemail.generator.common.constants.AppConstants;
import com.aiemail.generator.common.response.ApiResponse;
import com.aiemail.generator.email.dto.*;
import com.aiemail.generator.email.service.EmailService;
import com.aiemail.generator.exception.UnauthorizedException;
import com.aiemail.generator.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/emails")
public class EmailController {

    private final EmailService emailService;
    private final UserRepository userRepository;

    @Autowired
    public EmailController(EmailService emailService, UserRepository userRepository) {
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    private UserEntity getAuthenticatedUser(UserPrincipal principal) {
        if (principal == null) {
            throw new UnauthorizedException("User is not authenticated");
        }
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<EmailResponse>> generateEmail(
            @Valid @RequestBody EmailRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest servletRequest) {
        
        UserEntity user = getAuthenticatedUser(principal);
        EmailResponse response = emailService.generateEmail(request, user);
        ApiResponse<EmailResponse> body = ApiResponse.success(response, "Email generated successfully", servletRequest.getRequestURI());
        return ResponseEntity.ok(body);
    }

    @PostMapping("/action")
    public ResponseEntity<ApiResponse<EmailResponse>> applyAction(
            @Valid @RequestBody ActionRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest servletRequest) {
        
        UserEntity user = getAuthenticatedUser(principal);
        EmailResponse response = emailService.applyAction(request, user);
        ApiResponse<EmailResponse> body = ApiResponse.success(response, "AI action applied successfully", servletRequest.getRequestURI());
        return ResponseEntity.ok(body);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EmailResponse>> saveEmail(
            @Valid @RequestBody SaveEmailRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest servletRequest) {
        
        UserEntity user = getAuthenticatedUser(principal);
        EmailResponse response = emailService.saveEmail(request, user);
        ApiResponse<EmailResponse> body = ApiResponse.success(response, "Email saved successfully", servletRequest.getRequestURI());
        return new ResponseEntity<>(body, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PaginatedEmailResponse>> getEmailHistory(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "favorite", required = false) Boolean isFavorite,
            @RequestParam(value = "tone", required = false) com.aiemail.generator.common.enums.Tone tone,
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER_STR) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE_STR) int size,
            @RequestParam(value = "sort", defaultValue = AppConstants.DEFAULT_SORT_BY) String sortBy,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest servletRequest) {
        
        UserEntity user = getAuthenticatedUser(principal);
        PaginatedEmailResponse response = emailService.getEmailHistory(user, search, isFavorite, tone, page, size, sortBy);
        ApiResponse<PaginatedEmailResponse> body = ApiResponse.success(response, "Email history fetched successfully", servletRequest.getRequestURI());
        return ResponseEntity.ok(body);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmailResponse>> getEmailById(
            @PathVariable("id") UUID id,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest servletRequest) {
        
        UserEntity user = getAuthenticatedUser(principal);
        EmailResponse response = emailService.getEmailById(id, user);
        ApiResponse<EmailResponse> body = ApiResponse.success(response, "Email details fetched successfully", servletRequest.getRequestURI());
        return ResponseEntity.ok(body);
    }

    @PatchMapping("/{id}/favorite")
    public ResponseEntity<ApiResponse<EmailResponse>> toggleFavorite(
            @PathVariable("id") UUID id,
            @Valid @RequestBody FavoriteRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest servletRequest) {
        
        UserEntity user = getAuthenticatedUser(principal);
        EmailResponse response = emailService.toggleFavorite(id, request, user);
        ApiResponse<EmailResponse> body = ApiResponse.success(response, "Favorite status updated successfully", servletRequest.getRequestURI());
        return ResponseEntity.ok(body);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmail(
            @PathVariable("id") UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        UserEntity user = getAuthenticatedUser(principal);
        emailService.deleteEmail(id, user);
        return ResponseEntity.noContent().build();
    }
}
