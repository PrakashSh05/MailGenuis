package com.aiemail.generator.template.service;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.common.enums.Tone;
import com.aiemail.generator.exception.ConflictException;
import com.aiemail.generator.exception.ResourceNotFoundException;
import com.aiemail.generator.template.dto.TemplateRequest;
import com.aiemail.generator.template.dto.TemplateResponse;
import com.aiemail.generator.template.entity.UserTemplateEntity;
import com.aiemail.generator.template.mapper.TemplateMapper;
import com.aiemail.generator.template.repository.UserTemplateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TemplateServiceTest {

    @Mock private UserTemplateRepository templateRepository;
    @Mock private TemplateMapper templateMapper;

    @InjectMocks
    private TemplateServiceImpl templateService;

    private UserEntity user;
    private UserTemplateEntity templateEntity;
    private TemplateRequest templateRequest;
    private TemplateResponse templateResponse;

    @BeforeEach
    void setUp() {
        user = new UserEntity();
        user.setId(UUID.randomUUID());

        templateEntity = new UserTemplateEntity();
        templateEntity.setId(UUID.randomUUID());
        templateEntity.setName("Weekly Update");
        templateEntity.setTone(Tone.PROFESSIONAL);
        templateEntity.setUser(user);

        templateRequest = new TemplateRequest();
        templateRequest.setName("Weekly Update");
        templateRequest.setTone(Tone.PROFESSIONAL);
        templateRequest.setLength(com.aiemail.generator.common.enums.EmailLength.MEDIUM);
        templateRequest.setLanguage(com.aiemail.generator.common.enums.Language.ENGLISH);
        templateRequest.setBody("Write a weekly update email");

        templateResponse = new TemplateResponse();
        templateResponse.setName("Weekly Update");
    }

    @Test
    void createTemplate_success() {
        when(templateRepository.existsByUserAndName(user, "Weekly Update")).thenReturn(false);
        when(templateMapper.templateRequestToUserTemplateEntity(any())).thenReturn(templateEntity);
        when(templateRepository.save(any())).thenReturn(templateEntity);
        when(templateMapper.userTemplateEntityToTemplateResponse(any())).thenReturn(templateResponse);

        TemplateResponse result = templateService.createTemplate(templateRequest, user);

        assertNotNull(result);
        assertEquals("Weekly Update", result.getName());
        verify(templateRepository).save(any());
    }

    @Test
    void createTemplate_duplicateName_throwsConflict() {
        when(templateRepository.existsByUserAndName(user, "Weekly Update")).thenReturn(true);

        assertThrows(ConflictException.class, () -> templateService.createTemplate(templateRequest, user));
        verify(templateRepository, never()).save(any());
    }

    @Test
    void updateTemplate_success() {
        UUID id = templateEntity.getId();
        when(templateRepository.findByIdAndUser(id, user)).thenReturn(Optional.of(templateEntity));
        when(templateRepository.save(any())).thenReturn(templateEntity);
        when(templateMapper.userTemplateEntityToTemplateResponse(any())).thenReturn(templateResponse);

        TemplateResponse result = templateService.updateTemplate(id, templateRequest, user);

        assertNotNull(result);
        verify(templateRepository).save(any());
    }

    @Test
    void updateTemplate_notFound_throwsException() {
        UUID id = UUID.randomUUID();
        when(templateRepository.findByIdAndUser(id, user)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> templateService.updateTemplate(id, templateRequest, user));
    }

    @Test
    void updateTemplate_duplicateNameOnRename_throwsConflict() {
        UUID id = templateEntity.getId();
        TemplateRequest renameReq = new TemplateRequest();
        renameReq.setName("Different Name");
        renameReq.setTone(Tone.CASUAL);

        when(templateRepository.findByIdAndUser(id, user)).thenReturn(Optional.of(templateEntity));
        when(templateRepository.existsByUserAndName(user, "Different Name")).thenReturn(true);

        assertThrows(ConflictException.class, () -> templateService.updateTemplate(id, renameReq, user));
    }

    @Test
    void deleteTemplate_success() {
        UUID id = templateEntity.getId();
        when(templateRepository.findByIdAndUser(id, user)).thenReturn(Optional.of(templateEntity));

        templateService.deleteTemplate(id, user);

        verify(templateRepository).delete(templateEntity);
    }

    @Test
    void deleteTemplate_notFound_throwsException() {
        UUID id = UUID.randomUUID();
        when(templateRepository.findByIdAndUser(id, user)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> templateService.deleteTemplate(id, user));
    }

    @Test
    void getTemplateById_success() {
        UUID id = templateEntity.getId();
        when(templateRepository.findByIdAndUser(id, user)).thenReturn(Optional.of(templateEntity));
        when(templateMapper.userTemplateEntityToTemplateResponse(any())).thenReturn(templateResponse);

        TemplateResponse result = templateService.getTemplateById(id, user);

        assertEquals("Weekly Update", result.getName());
    }
}
