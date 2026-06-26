package com.aiemail.generator.profile.service;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.auth.repository.UserRepository;
import com.aiemail.generator.common.enums.Tone;
import com.aiemail.generator.exception.BadRequestException;
import com.aiemail.generator.profile.dto.*;
import com.aiemail.generator.profile.mapper.ProfileMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private ProfileMapper profileMapper;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks
    private ProfileServiceImpl profileService;

    private UserEntity user;
    private ProfileResponse profileResponse;

    @BeforeEach
    void setUp() {
        user = new UserEntity();
        user.setId(UUID.randomUUID());
        user.setEmail("test@example.com");
        user.setFullName("Test User");
        user.setPasswordHash("$2a$10$encodedHash");

        profileResponse = new ProfileResponse();
        profileResponse.setEmail("test@example.com");
        profileResponse.setFullName("Test User");
    }

    @Test
    void getProfile_success() {
        when(profileMapper.userEntityToProfileResponse(user)).thenReturn(profileResponse);

        ProfileResponse result = profileService.getProfile(user);

        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    void updateProfile_success() {
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setFullName("Updated Name");

        when(userRepository.save(any())).thenReturn(user);
        when(profileMapper.userEntityToProfileResponse(any())).thenReturn(profileResponse);

        ProfileResponse result = profileService.updateProfile(request, user);

        assertNotNull(result);
        verify(userRepository).save(user);
        assertEquals("New Name", user.getFullName());
    }

    @Test
    void updatePassword_success() {
        UpdatePasswordRequest request = new UpdatePasswordRequest();
        request.setCurrentPassword("oldpass");
        request.setNewPassword("newpass123");
        request.setConfirmPassword("newpass123");

        when(passwordEncoder.matches("oldpass", user.getPasswordHash())).thenReturn(true);
        when(passwordEncoder.encode("newpass123")).thenReturn("$2a$10$newEncodedHash");

        profileService.updatePassword(request, user);

        verify(userRepository).save(user);
        assertEquals("$2a$10$newEncodedHash", user.getPasswordHash());
    }

    @Test
    void updatePassword_incorrectCurrent_throwsBadRequest() {
        UpdatePasswordRequest request = new UpdatePasswordRequest();
        request.setCurrentPassword("wrongpass");
        request.setNewPassword("newpass123");
        request.setConfirmPassword("newpass123");

        when(passwordEncoder.matches("wrongpass", user.getPasswordHash())).thenReturn(false);

        assertThrows(BadRequestException.class, () -> profileService.updatePassword(request, user));
        verify(userRepository, never()).save(any());
    }

    @Test
    void updatePassword_mismatch_throwsBadRequest() {
        UpdatePasswordRequest request = new UpdatePasswordRequest();
        request.setCurrentPassword("oldpass");
        request.setNewPassword("newpass123");
        request.setConfirmPassword("differentpass");

        when(passwordEncoder.matches("oldpass", user.getPasswordHash())).thenReturn(true);

        assertThrows(BadRequestException.class, () -> profileService.updatePassword(request, user));
    }

    @Test
    void updateSettings_partialUpdate() {
        UpdateSettingsRequest request = new UpdateSettingsRequest();
        request.setDefaultTone(Tone.FRIENDLY);
        // Leave other fields null — should not override

        when(userRepository.save(any())).thenReturn(user);
        when(profileMapper.userEntityToProfileResponse(any())).thenReturn(profileResponse);

        ProfileResponse result = profileService.updateSettings(request, user);

        assertNotNull(result);
        assertEquals(Tone.FRIENDLY, user.getDefaultTone());
        verify(userRepository).save(user);
    }
}
