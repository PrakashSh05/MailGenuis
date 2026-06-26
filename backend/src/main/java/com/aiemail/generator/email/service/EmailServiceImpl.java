package com.aiemail.generator.email.service;

import com.aiemail.generator.ai.config.GroqConfig;
import com.aiemail.generator.ai.dto.AiOutputDto;
import com.aiemail.generator.ai.service.AiPipeline;
import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.email.dto.*;
import com.aiemail.generator.email.entity.EmailEntity;
import com.aiemail.generator.email.mapper.EmailMapper;
import com.aiemail.generator.email.repository.EmailRepository;
import com.aiemail.generator.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EmailServiceImpl implements EmailService {

    private final EmailRepository emailRepository;
    private final AiPipeline aiPipeline;
    private final EmailMapper emailMapper;
    private final GroqConfig groqConfig;

    @Autowired
    public EmailServiceImpl(EmailRepository emailRepository,
                            AiPipeline aiPipeline,
                            EmailMapper emailMapper,
                            GroqConfig groqConfig) {
        this.emailRepository = emailRepository;
        this.aiPipeline = aiPipeline;
        this.emailMapper = emailMapper;
        this.groqConfig = groqConfig;
    }

    @Override
    @Transactional(readOnly = true)
    public EmailResponse generateEmail(EmailRequest request, UserEntity user) {
        long startTime = System.currentTimeMillis();

        AiOutputDto aiOutput = aiPipeline.generateEmail(
                request.getPurpose(),
                request.getRecipient(),
                request.getTone(),
                request.getLength(),
                request.getLanguage(),
                request.getAdditionalInstructions()
        );

        long duration = System.currentTimeMillis() - startTime;

        return EmailResponse.builder()
                .purpose(request.getPurpose())
                .recipient(request.getRecipient())
                .tone(request.getTone())
                .length(request.getLength())
                .language(request.getLanguage())
                .additionalInstructions(request.getAdditionalInstructions())
                .subject(aiOutput.getSubject())
                .body(aiOutput.getBody())
                .modelUsed(groqConfig.getModel())
                .generationTimeMs((int) duration)
                .isSaved(false)
                .isFavorite(false)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public EmailResponse applyAction(ActionRequest request, UserEntity user) {
        long startTime = System.currentTimeMillis();

        AiOutputDto aiOutput = aiPipeline.applyAction(
                request.getCurrentSubject(),
                request.getCurrentBody(),
                request.getActionType(),
                request.getTargetLanguage()
        );

        long duration = System.currentTimeMillis() - startTime;

        return EmailResponse.builder()
                .subject(aiOutput.getSubject())
                .body(aiOutput.getBody())
                .modelUsed(groqConfig.getModel())
                .generationTimeMs((int) duration)
                .isSaved(false)
                .isFavorite(false)
                .build();
    }

    @Override
    @Transactional
    public EmailResponse saveEmail(SaveEmailRequest request, UserEntity user) {
        EmailEntity emailEntity = emailMapper.saveEmailRequestToEmailEntity(request);
        emailEntity.setUser(user);
        emailEntity.setSaved(true);
        emailEntity.setModelUsed(groqConfig.getModel());

        EmailEntity savedEntity = emailRepository.save(emailEntity);
        return emailMapper.emailEntityToEmailResponse(savedEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public PaginatedEmailResponse getEmailHistory(UserEntity user, String query, Boolean isFavorite, com.aiemail.generator.common.enums.Tone tone, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));
        Page<EmailEntity> emailPage;

        if (query != null && !query.trim().isEmpty()) {
            if (tone != null) {
                emailPage = emailRepository.searchEmailsByTone(user, query.trim(), tone, pageable);
            } else if (Boolean.TRUE.equals(isFavorite)) {
                emailPage = emailRepository.searchEmailsByFavorite(user, query.trim(), true, pageable);
            } else {
                emailPage = emailRepository.searchEmails(user, query.trim(), pageable);
            }
        } else {
            if (tone != null) {
                emailPage = emailRepository.findByUserAndTone(user, tone, pageable);
            } else if (Boolean.TRUE.equals(isFavorite)) {
                emailPage = emailRepository.findByUserAndIsFavorite(user, true, pageable);
            } else {
                emailPage = emailRepository.findByUser(user, pageable);
            }
        }

        List<EmailSummaryResponse> items = emailPage.getContent().stream()
                .map(emailMapper::emailEntityToEmailSummaryResponse)
                .collect(Collectors.toList());

        return PaginatedEmailResponse.builder()
                .items(items)
                .currentPage(emailPage.getNumber())
                .pageSize(emailPage.getSize())
                .totalPages(emailPage.getTotalPages())
                .totalElements(emailPage.getTotalElements())
                .hasNext(emailPage.hasNext())
                .hasPrevious(emailPage.hasPrevious())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public EmailResponse getEmailById(UUID id, UserEntity user) {
        EmailEntity entity = emailRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Email log not found with id: " + id));
        return emailMapper.emailEntityToEmailResponse(entity);
    }

    @Override
    @Transactional
    public EmailResponse toggleFavorite(UUID id, FavoriteRequest request, UserEntity user) {
        EmailEntity entity = emailRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Email log not found with id: " + id));

        entity.setFavorite(request.getIsFavorite());
        EmailEntity saved = emailRepository.save(entity);
        return emailMapper.emailEntityToEmailResponse(saved);
    }

    @Override
    @Transactional
    public void deleteEmail(UUID id, UserEntity user) {
        EmailEntity entity = emailRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Email log not found with id: " + id));
        emailRepository.delete(entity);
    }
}
