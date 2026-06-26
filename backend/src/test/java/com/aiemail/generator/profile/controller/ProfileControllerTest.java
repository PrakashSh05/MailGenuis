package com.aiemail.generator.profile.controller;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.auth.repository.UserRepository;
import com.aiemail.generator.common.enums.EmailLength;
import com.aiemail.generator.common.enums.Language;
import com.aiemail.generator.common.enums.Tone;
import com.aiemail.generator.common.enums.UserRole;
import com.aiemail.generator.exception.BadRequestException;
import com.aiemail.generator.profile.dto.*;
import com.aiemail.generator.profile.service.ProfileService;
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

import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ProfileController.class)
class ProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProfileService profileService;

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

    @Test
    @WithMockUser
    void testGetProfileSuccess() throws Exception {
        ProfileResponse response = ProfileResponse.builder()
                .id(mockUser.getId())
                .email(mockUser.getEmail())
                .fullName(mockUser.getFullName())
                .role("ROLE_USER")
                .defaultTone(Tone.CASUAL)
                .defaultLanguage(Language.ENGLISH)
                .defaultEmailLength(EmailLength.SHORT)
                .darkModeEnabled(false)
                .themePreference("light")
                .build();

        when(profileService.getProfile(any(UserEntity.class))).thenReturn(response);

        mockMvc.perform(get("/api/v1/profile")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fullName").value("Test User"))
                .andExpect(jsonPath("$.data.email").value("testuser@example.com"));
    }

    @Test
    @WithMockUser
    void testUpdateProfileSuccess() throws Exception {
        UpdateProfileRequest request = UpdateProfileRequest.builder()
                .fullName("Jane Doe")
                .profilePictureUrl("http://image.com/pic.jpg")
                .build();

        ProfileResponse response = ProfileResponse.builder()
                .fullName("Jane Doe")
                .profilePictureUrl("http://image.com/pic.jpg")
                .build();

        when(profileService.updateProfile(any(UpdateProfileRequest.class), any(UserEntity.class))).thenReturn(response);

        mockMvc.perform(put("/api/v1/profile")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fullName").value("Jane Doe"))
                .andExpect(jsonPath("$.data.profilePictureUrl").value("http://image.com/pic.jpg"));
    }

    @Test
    @WithMockUser
    void testUpdateProfileValidationFailure() throws Exception {
        UpdateProfileRequest request = UpdateProfileRequest.builder()
                .fullName("") // Blank name
                .build();

        mockMvc.perform(put("/api/v1/profile")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @WithMockUser
    void testUpdatePasswordSuccess() throws Exception {
        UpdatePasswordRequest request = UpdatePasswordRequest.builder()
                .currentPassword("oldpassword")
                .newPassword("newpassword")
                .confirmPassword("newpassword")
                .build();

        doNothing().when(profileService).updatePassword(any(UpdatePasswordRequest.class), any(UserEntity.class));

        mockMvc.perform(put("/api/v1/profile/password")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Password updated successfully"));
    }

    @Test
    @WithMockUser
    void testUpdatePasswordMismatch() throws Exception {
        UpdatePasswordRequest request = UpdatePasswordRequest.builder()
                .currentPassword("oldpassword")
                .newPassword("newpassword")
                .confirmPassword("wrongconfirm")
                .build();

        doThrow(new BadRequestException("New password and confirm password do not match"))
                .when(profileService).updatePassword(any(UpdatePasswordRequest.class), any(UserEntity.class));

        mockMvc.perform(put("/api/v1/profile/password")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @WithMockUser
    void testUpdateSettingsSuccess() throws Exception {
        UpdateSettingsRequest request = UpdateSettingsRequest.builder()
                .defaultTone(Tone.FORMAL)
                .defaultLanguage(Language.SPANISH)
                .defaultEmailLength(EmailLength.LONG)
                .darkModeEnabled(true)
                .themePreference("dark")
                .build();

        ProfileResponse response = ProfileResponse.builder()
                .defaultTone(Tone.FORMAL)
                .defaultLanguage(Language.SPANISH)
                .defaultEmailLength(EmailLength.LONG)
                .darkModeEnabled(true)
                .themePreference("dark")
                .build();

        when(profileService.updateSettings(any(UpdateSettingsRequest.class), any(UserEntity.class))).thenReturn(response);

        mockMvc.perform(put("/api/v1/profile/settings")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.defaultTone").value("FORMAL"))
                .andExpect(jsonPath("$.data.defaultLanguage").value("SPANISH"))
                .andExpect(jsonPath("$.data.themePreference").value("dark"));
    }

    @Test
    void testGetProfileUnauthorized() throws Exception {
        SecurityContextHolder.clearContext();

        mockMvc.perform(get("/api/v1/profile")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}
