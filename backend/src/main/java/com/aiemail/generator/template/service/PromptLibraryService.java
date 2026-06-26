package com.aiemail.generator.template.service;

import com.aiemail.generator.exception.ResourceNotFoundException;
import com.aiemail.generator.template.dto.PromptLibraryCategory;
import com.aiemail.generator.template.dto.PromptLibraryItem;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PromptLibraryService {

    private final List<PromptLibraryItem> library = new ArrayList<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void init() {
        try {
            ClassPathResource resource = new ClassPathResource("prompt-library.json");
            try (InputStream is = resource.getInputStream()) {
                List<PromptLibraryItem> items = objectMapper.readValue(is, new TypeReference<List<PromptLibraryItem>>() {});
                library.addAll(items);
                log.info("Successfully loaded {} prompt library items from resources.", library.size());
            }
        } catch (Exception ex) {
            log.error("Failed to load static prompt library: {}", ex.getMessage());
        }
    }

    public List<PromptLibraryItem> getLibrary() {
        return Collections.unmodifiableList(library);
    }

    public List<String> getCategories() {
        return library.stream()
                .map(PromptLibraryItem::getCategory)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<PromptLibraryCategory> getCategorizedLibrary() {
        Map<String, List<PromptLibraryItem>> grouped = library.stream()
                .collect(Collectors.groupingBy(PromptLibraryItem::getCategory));
        
        List<PromptLibraryCategory> categories = new ArrayList<>();
        grouped.forEach((categoryName, items) -> {
            categories.add(new PromptLibraryCategory(categoryName, items));
        });
        return categories;
    }

    public PromptLibraryItem getItemById(String id) {
        return library.stream()
                .filter(item -> item.getId().equalsIgnoreCase(id))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Prompt Library item not found with id: " + id));
    }
}
