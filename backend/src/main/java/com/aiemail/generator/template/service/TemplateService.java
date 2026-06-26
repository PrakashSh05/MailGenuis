package com.aiemail.generator.template.service;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.template.dto.TemplateRequest;
import com.aiemail.generator.template.dto.TemplateResponse;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface TemplateService {
    TemplateResponse createTemplate(TemplateRequest request, UserEntity user);
    TemplateResponse updateTemplate(UUID id, TemplateRequest request, UserEntity user);
    void deleteTemplate(UUID id, UserEntity user);
    TemplateResponse getTemplateById(UUID id, UserEntity user);
    Page<TemplateResponse> getTemplates(UserEntity user, String name, com.aiemail.generator.common.enums.Tone tone, String category, int page, int size, String sortBy);
}
