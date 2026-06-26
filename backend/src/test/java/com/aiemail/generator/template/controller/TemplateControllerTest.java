package com.aiemail.generator.template.controller;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.auth.repository.UserRepository;
import com.aiemail.generator.common.enums.EmailLength;
import com.aiemail.generator.common.enums.Tone;
import com.aiemail.generator.common.enums.UserRole;
import com.aiemail.generator.exception.ConflictException;
import com.aiemail.generator.exception.ResourceNotFoundException;
import com.aiemail.generator.security.CustomUserDetailsService;
import com.aiemail.generator.security.JwtAuthenticationEntryPoint;
import com.aiemail.generator.security.JwtTokenProvider;
import com.aiemail.generator.security.UserPrincipal;
import com.aiemail.generator.template.dto.*;
import com.aiemail.generator.template.service.PromptLibraryService;
import com.aiemail.generator.template.service.TemplateService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = TemplateController.class)
class TemplateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TemplateService templateService;

    @MockBean
    private PromptLibraryService promptLibraryService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @MockBean
    private JwtTokenProvider tokenProvider;

    @MockBean
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    private UserEntity mockUser;
    private UserPrincipal mockPrincipal;

    @BeforeEach
    void setUp() {
        UUID userId = UUID.randomUUID();
        mockUser = UserEntity.builder()
                .id(userId)
                .email("testuser@example.com")
                .passwordHash("password")
                .fullName("Test User")
                .role(UserRole.ROLE_USER)
                .build();

        mockPrincipal = UserPrincipal.create(mockUser);

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(mockPrincipal, null, mockPrincipal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
    }

    // --- PROMPT LIBRARY TESTS ---

    @Test
    @WithMockUser
    void testGetPromptLibrarySuccess() throws Exception {
        PromptLibraryItem item = PromptLibraryItem.builder()
                .id("hr-leave")
                .category("HR")
                .title("Leave Request")
                .description("Desc")
                .purpose("Purpose")
                .defaultTone(Tone.FORMAL)
                .defaultLength(EmailLength.SHORT)
                .prompt("Prompt")
                .build();

        PromptLibraryCategory category = new PromptLibraryCategory("HR", Collections.singletonList(item));
        when(promptLibraryService.getCategorizedLibrary()).thenReturn(Collections.singletonList(category));

        mockMvc.perform(get("/api/v1/templates/library"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.categories[0].name").value("HR"))
                .andExpect(jsonPath("$.data.categories[0].items[0].id").value("hr-leave"));
    }

    @Test
    @WithMockUser
    void testGetPromptLibraryCategoriesSuccess() throws Exception {
        when(promptLibraryService.getCategories()).thenReturn(Collections.singletonList("HR"));

        mockMvc.perform(get("/api/v1/templates/library/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0]").value("HR"));
    }

    @Test
    @WithMockUser
    void testGetPromptLibraryItemByIdSuccess() throws Exception {
        PromptLibraryItem item = PromptLibraryItem.builder()
                .id("hr-leave")
                .category("HR")
                .title("Leave Request")
                .description("Desc")
                .purpose("Purpose")
                .defaultTone(Tone.FORMAL)
                .defaultLength(EmailLength.SHORT)
                .prompt("Prompt")
                .build();

        when(promptLibraryService.getItemById("hr-leave")).thenReturn(item);

        mockMvc.perform(get("/api/v1/templates/library/hr-leave"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value("hr-leave"))
                .andExpect(jsonPath("$.data.category").value("HR"));
    }

    @Test
    @WithMockUser
    void testGetPromptLibraryItemByIdNotFound() throws Exception {
        when(promptLibraryService.getItemById("invalid")).thenThrow(new ResourceNotFoundException("Prompt Library item not found"));

        mockMvc.perform(get("/api/v1/templates/library/invalid"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    // --- USER CUSTOM TEMPLATES CRUD TESTS ---

    @Test
    @WithMockUser
    void testCreateTemplateSuccess() throws Exception {
        TemplateRequest request = TemplateRequest.builder()
                .name("Meeting Followup")
                .tone(Tone.PROFESSIONAL)
                .length(EmailLength.MEDIUM)
                .language(com.aiemail.generator.common.enums.Language.ENGLISH)
                .body("Write meeting followup for [Name].")
                .build();

        TemplateResponse response = TemplateResponse.builder()
                .id(UUID.randomUUID())
                .name("Meeting Followup")
                .tone(Tone.PROFESSIONAL)
                .length(EmailLength.MEDIUM)
                .language(com.aiemail.generator.common.enums.Language.ENGLISH)
                .body("Write meeting followup for [Name].")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(templateService.createTemplate(any(TemplateRequest.class), any(UserEntity.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/templates")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Meeting Followup"))
                .andExpect(jsonPath("$.data.tone").value("PROFESSIONAL"));
    }

    @Test
    @WithMockUser
    void testCreateTemplateValidationFailure() throws Exception {
        TemplateRequest request = TemplateRequest.builder()
                .name("") // Invalid name
                .tone(null) // Invalid tone
                .length(EmailLength.MEDIUM)
                .language(com.aiemail.generator.common.enums.Language.ENGLISH)
                .body("") // Invalid prompt
                .build();

        mockMvc.perform(post("/api/v1/templates")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @WithMockUser
    void testCreateTemplateDuplicateNameConflict() throws Exception {
        TemplateRequest request = TemplateRequest.builder()
                .name("Duplicate Name")
                .tone(Tone.CASUAL)
                .length(EmailLength.MEDIUM)
                .language(com.aiemail.generator.common.enums.Language.ENGLISH)
                .body("Casual template")
                .build();

        when(templateService.createTemplate(any(TemplateRequest.class), any(UserEntity.class)))
                .thenThrow(new ConflictException("A template with name 'Duplicate Name' already exists"));

        mockMvc.perform(post("/api/v1/templates")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.message").value("A template with name 'Duplicate Name' already exists"));
    }

    @Test
    @WithMockUser
    void testUpdateTemplateSuccess() throws Exception {
        UUID templateId = UUID.randomUUID();
        TemplateRequest request = TemplateRequest.builder()
                .name("Updated Name")
                .tone(Tone.CASUAL)
                .length(EmailLength.MEDIUM)
                .language(com.aiemail.generator.common.enums.Language.ENGLISH)
                .body("Updated content")
                .build();

        TemplateResponse response = TemplateResponse.builder()
                .id(templateId)
                .name("Updated Name")
                .tone(Tone.CASUAL)
                .length(EmailLength.MEDIUM)
                .language(com.aiemail.generator.common.enums.Language.ENGLISH)
                .body("Updated content")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(templateService.updateTemplate(eq(templateId), any(TemplateRequest.class), any(UserEntity.class))).thenReturn(response);

        mockMvc.perform(put("/api/v1/templates/{id}", templateId)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Updated Name"));
    }

    @Test
    @WithMockUser
    void testUpdateTemplateOwnershipValidationFailure() throws Exception {
        UUID templateId = UUID.randomUUID();
        TemplateRequest request = TemplateRequest.builder()
                .name("Name")
                .tone(Tone.CASUAL)
                .length(EmailLength.MEDIUM)
                .language(com.aiemail.generator.common.enums.Language.ENGLISH)
                .body("Prompt")
                .build();

        when(templateService.updateTemplate(eq(templateId), any(TemplateRequest.class), any(UserEntity.class)))
                .thenThrow(new ResourceNotFoundException("Template not found with id: " + templateId));

        mockMvc.perform(put("/api/v1/templates/{id}", templateId)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @WithMockUser
    void testDeleteTemplateSuccess() throws Exception {
        UUID templateId = UUID.randomUUID();
        doNothing().when(templateService).deleteTemplate(eq(templateId), any(UserEntity.class));

        mockMvc.perform(delete("/api/v1/templates/{id}", templateId)
                .with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void testDeleteTemplateOwnershipValidationFailure() throws Exception {
        UUID templateId = UUID.randomUUID();
        doThrow(new ResourceNotFoundException("Template not found"))
                .when(templateService).deleteTemplate(eq(templateId), any(UserEntity.class));

        mockMvc.perform(delete("/api/v1/templates/{id}", templateId)
                .with(csrf()))
                .andExpect(status().isNotFound());
    }

    // --- SEARCH AND PAGINATION TESTS ---

    @Test
    @WithMockUser
    void testGetTemplatesSearchAndPaginationSuccess() throws Exception {
        TemplateResponse template = TemplateResponse.builder()
                .id(UUID.randomUUID())
                .name("Leave Template")
                .tone(Tone.FORMAL)
                .length(EmailLength.MEDIUM)
                .language(com.aiemail.generator.common.enums.Language.ENGLISH)
                .body("Formal text")
                .build();

        Page<TemplateResponse> pageResponse = new PageImpl<>(Collections.singletonList(template));

        when(templateService.getTemplates(any(UserEntity.class), eq("Leave"), eq(Tone.FORMAL), eq("HR"), eq(0), eq(10), eq("name,asc")))
                .thenReturn(pageResponse);

        mockMvc.perform(get("/api/v1/templates")
                .param("name", "Leave")
                .param("tone", "FORMAL")
                .param("category", "HR")
                .param("page", "0")
                .param("size", "10")
                .param("sort", "name,asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].name").value("Leave Template"));
    }

    // --- SECURITY CONSTRAINTS TESTS (UNAUTHORIZED / FORBIDDEN) ---

    @Test
    void testGetPromptLibraryUnauthorized() throws Exception {
        // Clear security context
        SecurityContextHolder.clearContext();

        mockMvc.perform(get("/api/v1/templates/library"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testCreateTemplateUnauthorized() throws Exception {
        SecurityContextHolder.clearContext();

        TemplateRequest request = TemplateRequest.builder()
                .name("Name")
                .tone(Tone.CASUAL)
                .length(EmailLength.MEDIUM)
                .language(com.aiemail.generator.common.enums.Language.ENGLISH)
                .body("Prompt")
                .build();

        mockMvc.perform(post("/api/v1/templates")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }
}
