package com.aiemail.generator.template.service;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.exception.ConflictException;
import com.aiemail.generator.exception.ResourceNotFoundException;
import com.aiemail.generator.template.dto.TemplateRequest;
import com.aiemail.generator.template.dto.TemplateResponse;
import com.aiemail.generator.template.entity.UserTemplateEntity;
import com.aiemail.generator.template.mapper.TemplateMapper;
import com.aiemail.generator.template.repository.UserTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class TemplateServiceImpl implements TemplateService {

    private final UserTemplateRepository templateRepository;
    private final TemplateMapper templateMapper;

    @Autowired
    public TemplateServiceImpl(UserTemplateRepository templateRepository, TemplateMapper templateMapper) {
        this.templateRepository = templateRepository;
        this.templateMapper = templateMapper;
    }

    @Override
    @Transactional
    public TemplateResponse createTemplate(TemplateRequest request, UserEntity user) {
        if (templateRepository.existsByUserAndName(user, request.getName())) {
            throw new ConflictException("A template with name '" + request.getName() + "' already exists");
        }

        UserTemplateEntity entity = templateMapper.templateRequestToUserTemplateEntity(request);
        entity.setUser(user);

        UserTemplateEntity saved = templateRepository.save(entity);
        return templateMapper.userTemplateEntityToTemplateResponse(saved);
    }

    @Override
    @Transactional
    public TemplateResponse updateTemplate(UUID id, TemplateRequest request, UserEntity user) {
        UserTemplateEntity entity = templateRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + id));

        // Check if name has changed and is a duplicate
        if (!entity.getName().equals(request.getName()) && templateRepository.existsByUserAndName(user, request.getName())) {
            throw new ConflictException("A template with name '" + request.getName() + "' already exists");
        }

        entity.setName(request.getName());
        entity.setTone(request.getTone());
        entity.setLength(request.getLength());
        entity.setLanguage(request.getLanguage());
        entity.setBody(request.getBody());

        UserTemplateEntity saved = templateRepository.save(entity);
        return templateMapper.userTemplateEntityToTemplateResponse(saved);
    }

    @Override
    @Transactional
    public void deleteTemplate(UUID id, UserEntity user) {
        UserTemplateEntity entity = templateRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + id));
        templateRepository.delete(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public TemplateResponse getTemplateById(UUID id, UserEntity user) {
        UserTemplateEntity entity = templateRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + id));
        return templateMapper.userTemplateEntityToTemplateResponse(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TemplateResponse> getTemplates(UserEntity user, String name, com.aiemail.generator.common.enums.Tone tone, String category, int page, int size, String sortBy) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            String[] parts = sortBy.split(",");
            String property = parts[0].trim();
            Sort.Direction direction = Sort.Direction.DESC;
            if (parts.length > 1) {
                String dirStr = parts[1].trim();
                if ("asc".equalsIgnoreCase(dirStr)) {
                    direction = Sort.Direction.ASC;
                }
            }
            sort = Sort.by(direction, property);
        }
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<UserTemplateEntity> templatePage;

        boolean hasName = name != null && !name.trim().isEmpty();
        boolean hasTone = tone != null;

        if (hasName && hasTone) {
            templatePage = templateRepository.findByUserAndNameContainingIgnoreCaseAndTone(user, name.trim(), tone, pageable);
        } else if (hasName) {
            templatePage = templateRepository.findByUserAndNameContainingIgnoreCase(user, name.trim(), pageable);
        } else if (hasTone) {
            templatePage = templateRepository.findByUserAndTone(user, tone, pageable);
        } else {
            templatePage = templateRepository.findByUser(user, pageable);
        }

        return templatePage.map(templateMapper::userTemplateEntityToTemplateResponse);
    }
}
