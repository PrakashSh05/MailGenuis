package com.aiemail.generator.email.controller;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.auth.repository.UserRepository;
import com.aiemail.generator.common.enums.EmailLength;
import com.aiemail.generator.common.enums.Language;
import com.aiemail.generator.common.enums.Tone;
import com.aiemail.generator.common.enums.UserRole;
import com.aiemail.generator.email.dto.*;
import com.aiemail.generator.email.service.EmailService;
import com.aiemail.generator.security.CustomUserDetailsService;
import com.aiemail.generator.security.JwtAuthenticationEntryPoint;
import com.aiemail.generator.security.JwtTokenProvider;
import com.aiemail.generator.security.UserPrincipal;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = EmailController.class)
class EmailControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmailService emailService;

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
                .email("user@example.com")
                .passwordHash("hash")
                .fullName("John Doe")
                .role(UserRole.ROLE_USER)
                .build();

        mockPrincipal = UserPrincipal.create(mockUser);

        // Configure mock security context authentication
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(mockPrincipal, null, mockPrincipal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
    }

    @Test
    @WithMockUser
    void testGenerateEmailSuccess() throws Exception {
        EmailRequest request = EmailRequest.builder()
                .purpose("Leave")
                .recipient("HR")
                .tone(Tone.FORMAL)
                .length(EmailLength.SHORT)
                .language(Language.ENGLISH)
                .build();

        EmailResponse response = EmailResponse.builder()
                .subject("Leave Request")
                .body("Hello HR...")
                .tone(Tone.FORMAL)
                .length(EmailLength.SHORT)
                .language(Language.ENGLISH)
                .build();

        when(emailService.generateEmail(any(EmailRequest.class), any(UserEntity.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/emails/generate")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.subject").value("Leave Request"));
    }

    @Test
    @WithMockUser
    void testSaveEmailSuccess() throws Exception {
        SaveEmailRequest request = SaveEmailRequest.builder()
                .purpose("Leave")
                .recipient("HR")
                .tone(Tone.FORMAL)
                .length(EmailLength.SHORT)
                .language(Language.ENGLISH)
                .subject("Leave request")
                .body("Dear HR, I need leave.")
                .isFavorite(false)
                .build();

        EmailResponse response = EmailResponse.builder()
                .id(UUID.randomUUID())
                .subject("Leave request")
                .body("Dear HR, I need leave.")
                .isSaved(true)
                .build();

        when(emailService.saveEmail(any(SaveEmailRequest.class), any(UserEntity.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/emails")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.isSaved").value(true));
    }

    @Test
    @WithMockUser
    void testGetHistorySuccess() throws Exception {
        PaginatedEmailResponse response = PaginatedEmailResponse.builder()
                .items(Collections.singletonList(EmailSummaryResponse.builder()
                        .id(UUID.randomUUID())
                        .subject("Subject")
                        .isFavorite(false)
                        .build()))
                .currentPage(0)
                .pageSize(10)
                .totalPages(1)
                .totalElements(1)
                .build();

        when(emailService.getEmailHistory(any(UserEntity.class), any(), any(), any(), anyInt(), anyInt(), anyString()))
                .thenReturn(response);

        mockMvc.perform(get("/api/v1/emails")
                .param("search", "Subject")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalElements").value(1));
    }

    @Test
    @WithMockUser
    void testDeleteEmailSuccess() throws Exception {
        UUID id = UUID.randomUUID();
        doNothing().when(emailService).deleteEmail(eq(id), any(UserEntity.class));

        mockMvc.perform(delete("/api/v1/emails/{id}", id)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }
}
