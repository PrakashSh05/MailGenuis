package com.aiemail.generator.profile.service;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.auth.repository.UserRepository;
import com.aiemail.generator.exception.BadRequestException;
import com.aiemail.generator.profile.dto.*;
import com.aiemail.generator.profile.mapper.ProfileMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final ProfileMapper profileMapper;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public ProfileServiceImpl(UserRepository userRepository,
                              ProfileMapper profileMapper,
                              PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.profileMapper = profileMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public ProfileResponse getProfile(UserEntity user) {
        return profileMapper.userEntityToProfileResponse(user);
    }

    @Override
    @Transactional
    public ProfileResponse updateProfile(UpdateProfileRequest request, UserEntity user) {
        user.setFullName(request.getFullName().trim());
        if (request.getProfilePictureUrl() != null) {
            user.setProfilePictureUrl(request.getProfilePictureUrl().trim());
        }
        UserEntity saved = userRepository.save(user);
        return profileMapper.userEntityToProfileResponse(saved);
    }

    @Override
    @Transactional
    public void updatePassword(UpdatePasswordRequest request, UserEntity user) {
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Incorrect current password");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("New password and confirm password do not match");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public ProfileResponse updateSettings(UpdateSettingsRequest request, UserEntity user) {
        if (request.getDefaultTone() != null) {
            user.setDefaultTone(request.getDefaultTone());
        }
        if (request.getDefaultLanguage() != null) {
            user.setDefaultLanguage(request.getDefaultLanguage());
        }
        if (request.getDefaultEmailLength() != null) {
            user.setDefaultEmailLength(request.getDefaultEmailLength());
        }
        if (request.getDarkModeEnabled() != null) {
            user.setDarkModeEnabled(request.getDarkModeEnabled());
        }
        if (request.getThemePreference() != null) {
            user.setThemePreference(request.getThemePreference().trim());
        }

        UserEntity saved = userRepository.save(user);
        return profileMapper.userEntityToProfileResponse(saved);
    }
}
