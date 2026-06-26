package com.aiemail.generator.email.service;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.email.dto.*;

import java.util.UUID;

public interface EmailService {
    EmailResponse generateEmail(EmailRequest request, UserEntity user);
    EmailResponse applyAction(ActionRequest request, UserEntity user);
    EmailResponse saveEmail(SaveEmailRequest request, UserEntity user);
    PaginatedEmailResponse getEmailHistory(UserEntity user, String query, Boolean isFavorite, com.aiemail.generator.common.enums.Tone tone, int page, int size, String sortBy);
    EmailResponse getEmailById(UUID id, UserEntity user);
    EmailResponse toggleFavorite(UUID id, FavoriteRequest request, UserEntity user);
    void deleteEmail(UUID id, UserEntity user);
}
