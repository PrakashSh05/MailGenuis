package com.aiemail.generator.profile.service;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.profile.dto.*;

public interface ProfileService {
    ProfileResponse getProfile(UserEntity user);
    ProfileResponse updateProfile(UpdateProfileRequest request, UserEntity user);
    void updatePassword(UpdatePasswordRequest request, UserEntity user);
    ProfileResponse updateSettings(UpdateSettingsRequest request, UserEntity user);
}
