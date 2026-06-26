package com.aiemail.generator.template.controller;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.auth.repository.UserRepository;
import com.aiemail.generator.common.constants.AppConstants;
import com.aiemail.generator.common.response.ApiResponse;
import com.aiemail.generator.exception.UnauthorizedException;
import com.aiemail.generator.security.UserPrincipal;
import com.aiemail.generator.template.dto.*;
import com.aiemail.generator.template.service.PromptLibraryService;
import com.aiemail.generator.template.service.TemplateService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/templates")
public class TemplateController {

    private final TemplateService templateService;
    private final PromptLibraryService promptLibraryService;
    private final UserRepository userRepository;

    @Autowired
    public TemplateController(TemplateService templateService,
                              PromptLibraryService promptLibraryService,
                              UserRepository userRepository) {
        this.templateService = templateService;
        this.promptLibraryService = promptLibraryService;
        this.userRepository = userRepository;
    }

    private UserEntity getAuthenticatedUser(UserPrincipal principal) {
        if (principal == null) {
            throw new UnauthorizedException("User is not authenticated");
        }
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));
    }

    // --- PROMPT LIBRARY (SYSTEM) ENDPOINTS ---

    @GetMapping("/library")
    public ResponseEntity<ApiResponse<PromptLibraryResponse>> getPromptLibrary(HttpServletRequest servletRequest) {
        List<PromptLibraryCategory> categories = promptLibraryService.getCategorizedLibrary();
        PromptLibraryResponse response = new PromptLibraryResponse(categories);
        ApiResponse<PromptLibraryResponse> body = ApiResponse.success(response, "Prompt library loaded successfully", servletRequest.getRequestURI());
        return ResponseEntity.ok(body);
    }

    @GetMapping("/library/categories")
    public ResponseEntity<ApiResponse<List<String>>> getPromptLibraryCategories(HttpServletRequest servletRequest) {
        List<String> categories = promptLibraryService.getCategories();
        ApiResponse<List<String>> body = ApiResponse.success(categories, "Prompt library categories loaded successfully", servletRequest.getRequestURI());
        return ResponseEntity.ok(body);
    }

    @GetMapping("/library/{id}")
    public ResponseEntity<ApiResponse<PromptLibraryItem>> getPromptLibraryItemById(
            @PathVariable("id") String id,
            HttpServletRequest servletRequest) {
        PromptLibraryItem item = promptLibraryService.getItemById(id);
        ApiResponse<PromptLibraryItem> body = ApiResponse.success(item, "Prompt library item loaded successfully", servletRequest.getRequestURI());
        return ResponseEntity.ok(body);
    }

    // --- USER CUSTOM TEMPLATES ENDPOINTS ---

    @PostMapping
    public ResponseEntity<ApiResponse<TemplateResponse>> createTemplate(
            @Valid @RequestBody TemplateRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest servletRequest) {
        
        UserEntity user = getAuthenticatedUser(principal);
        TemplateResponse response = templateService.createTemplate(request, user);
        ApiResponse<TemplateResponse> body = ApiResponse.success(response, "Custom template created successfully", servletRequest.getRequestURI());
        return new ResponseEntity<>(body, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TemplateResponse>>> getTemplates(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "tone", required = false) com.aiemail.generator.common.enums.Tone tone,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER_STR) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE_STR) int size,
            @RequestParam(value = "sort", defaultValue = AppConstants.DEFAULT_SORT_BY) String sortBy,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest servletRequest) {
        
        UserEntity user = getAuthenticatedUser(principal);
        String searchName = (name != null) ? name : search;
        Page<TemplateResponse> response = templateService.getTemplates(user, searchName, tone, category, page, size, sortBy);
        ApiResponse<Page<TemplateResponse>> body = ApiResponse.success(response, "Custom templates loaded successfully", servletRequest.getRequestURI());
        return ResponseEntity.ok(body);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TemplateResponse>> getTemplateById(
            @PathVariable("id") UUID id,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest servletRequest) {
        
        UserEntity user = getAuthenticatedUser(principal);
        TemplateResponse response = templateService.getTemplateById(id, user);
        ApiResponse<TemplateResponse> body = ApiResponse.success(response, "Custom template details loaded successfully", servletRequest.getRequestURI());
        return ResponseEntity.ok(body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TemplateResponse>> updateTemplate(
            @PathVariable("id") UUID id,
            @Valid @RequestBody TemplateRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest servletRequest) {
        
        UserEntity user = getAuthenticatedUser(principal);
        TemplateResponse response = templateService.updateTemplate(id, request, user);
        ApiResponse<TemplateResponse> body = ApiResponse.success(response, "Custom template updated successfully", servletRequest.getRequestURI());
        return ResponseEntity.ok(body);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(
            @PathVariable("id") UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        UserEntity user = getAuthenticatedUser(principal);
        templateService.deleteTemplate(id, user);
        return ResponseEntity.noContent().build();
    }
}
