package com.aiemail.generator.email.service;

import com.aiemail.generator.ai.config.GroqConfig;
import com.aiemail.generator.ai.dto.AiOutputDto;
import com.aiemail.generator.ai.service.AiPipeline;
import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.common.enums.Tone;
import com.aiemail.generator.common.enums.EmailLength;
import com.aiemail.generator.common.enums.Language;
import com.aiemail.generator.email.dto.*;
import com.aiemail.generator.email.entity.EmailEntity;
import com.aiemail.generator.email.mapper.EmailMapper;
import com.aiemail.generator.email.repository.EmailRepository;
import com.aiemail.generator.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock private EmailRepository emailRepository;
    @Mock private AiPipeline aiPipeline;
    @Mock private EmailMapper emailMapper;
    @Mock private GroqConfig groqConfig;

    @InjectMocks
    private EmailServiceImpl emailService;

    private UserEntity user;
    private EmailEntity emailEntity;

    @BeforeEach
    void setUp() {
        user = new UserEntity();
        user.setId(UUID.randomUUID());
        user.setEmail("test@example.com");

        emailEntity = new EmailEntity();
        emailEntity.setId(UUID.randomUUID());
        emailEntity.setSubject("Test Subject");
        emailEntity.setBody("Test Body");
        emailEntity.setUser(user);
    }

    @Test
    void generateEmail_success() {
        EmailRequest request = new EmailRequest();
        request.setPurpose("Sales pitch");
        request.setTone(Tone.PROFESSIONAL);
        request.setLength(EmailLength.MEDIUM);
        request.setLanguage(Language.ENGLISH);

        AiOutputDto aiOutput = new AiOutputDto();
        aiOutput.setSubject("AI Subject");
        aiOutput.setBody("AI Body");

        when(aiPipeline.generateEmail(any(), any(), any(), any(), any(), any())).thenReturn(aiOutput);
        when(groqConfig.getModel()).thenReturn("llama-3.1-8b-instant");

        EmailResponse result = emailService.generateEmail(request, user);

        assertNotNull(result);
        assertEquals("AI Subject", result.getSubject());
        assertEquals("AI Body", result.getBody());
        assertFalse(result.isSaved());
    }

    @Test
    void saveEmail_success() {
        SaveEmailRequest request = new SaveEmailRequest();
        request.setSubject("Saved Subject");
        request.setBody("Saved Body");

        when(emailMapper.saveEmailRequestToEmailEntity(any())).thenReturn(emailEntity);
        when(emailRepository.save(any())).thenReturn(emailEntity);
        EmailResponse resp = EmailResponse.builder().subject("Saved Subject").build();
        when(emailMapper.emailEntityToEmailResponse(any())).thenReturn(resp);
        when(groqConfig.getModel()).thenReturn("llama-3.1-8b-instant");

        EmailResponse result = emailService.saveEmail(request, user);

        assertNotNull(result);
        verify(emailRepository).save(any(EmailEntity.class));
    }

    @Test
    void getEmailById_found() {
        UUID id = emailEntity.getId();
        EmailResponse resp = EmailResponse.builder().subject("Test Subject").build();
        when(emailRepository.findByIdAndUser(id, user)).thenReturn(Optional.of(emailEntity));
        when(emailMapper.emailEntityToEmailResponse(emailEntity)).thenReturn(resp);

        EmailResponse result = emailService.getEmailById(id, user);

        assertEquals("Test Subject", result.getSubject());
    }

    @Test
    void getEmailById_notFound_throwsException() {
        UUID id = UUID.randomUUID();
        when(emailRepository.findByIdAndUser(id, user)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> emailService.getEmailById(id, user));
    }

    @Test
    void toggleFavorite_success() {
        UUID id = emailEntity.getId();
        FavoriteRequest favReq = new FavoriteRequest();
        favReq.setIsFavorite(true);

        when(emailRepository.findByIdAndUser(id, user)).thenReturn(Optional.of(emailEntity));
        when(emailRepository.save(any())).thenReturn(emailEntity);
        EmailResponse resp = EmailResponse.builder().isFavorite(true).build();
        when(emailMapper.emailEntityToEmailResponse(any())).thenReturn(resp);

        EmailResponse result = emailService.toggleFavorite(id, favReq, user);

        assertTrue(result.isFavorite());
    }

    @Test
    void deleteEmail_success() {
        UUID id = emailEntity.getId();
        when(emailRepository.findByIdAndUser(id, user)).thenReturn(Optional.of(emailEntity));

        emailService.deleteEmail(id, user);

        verify(emailRepository).delete(emailEntity);
    }

    @Test
    void deleteEmail_notFound_throwsException() {
        UUID id = UUID.randomUUID();
        when(emailRepository.findByIdAndUser(id, user)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> emailService.deleteEmail(id, user));
    }

    @Test
    void getEmailHistory_withQuery() {
        Page<EmailEntity> page = new PageImpl<>(List.of(emailEntity));
        when(emailRepository.searchEmails(eq(user), eq("test"), any(Pageable.class))).thenReturn(page);
        EmailSummaryResponse summary = new EmailSummaryResponse();
        summary.setSubject("Test Subject");
        when(emailMapper.emailEntityToEmailSummaryResponse(any())).thenReturn(summary);

        PaginatedEmailResponse result = emailService.getEmailHistory(user, "test", null, null, 0, 10, "createdAt");

        assertNotNull(result);
        assertEquals(1, result.getItems().size());
    }

    @Test
    void getEmailHistory_emptyQuery_favoriteFilter() {
        Page<EmailEntity> page = new PageImpl<>(List.of(emailEntity));
        when(emailRepository.findByUserAndIsFavorite(eq(user), eq(true), any(Pageable.class))).thenReturn(page);
        when(emailMapper.emailEntityToEmailSummaryResponse(any())).thenReturn(new EmailSummaryResponse());

        PaginatedEmailResponse result = emailService.getEmailHistory(user, null, true, null, 0, 10, "createdAt");

        assertEquals(1, result.getItems().size());
    }
}
