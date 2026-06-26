package com.aiemail.generator.ai.service;

import com.aiemail.generator.ai.builder.ActionPromptBuilder;
import com.aiemail.generator.ai.builder.GenerateEmailPromptBuilder;
import com.aiemail.generator.ai.client.GroqClient;
import com.aiemail.generator.ai.dto.AiOutputDto;
import com.aiemail.generator.ai.dto.GroqResponse;
import com.aiemail.generator.common.enums.ActionType;
import com.aiemail.generator.common.enums.EmailLength;
import com.aiemail.generator.common.enums.Language;
import com.aiemail.generator.common.enums.Tone;
import com.aiemail.generator.exception.AiServiceException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AiPipeline {

    private final GroqClient groqClient;
    private final GenerateEmailPromptBuilder generateEmailPromptBuilder;
    private final ActionPromptBuilder actionPromptBuilder;
    private final ObjectMapper objectMapper;

    @Autowired
    public AiPipeline(GroqClient groqClient,
                      GenerateEmailPromptBuilder generateEmailPromptBuilder,
                      ActionPromptBuilder actionPromptBuilder) {
        this.groqClient = groqClient;
        this.generateEmailPromptBuilder = generateEmailPromptBuilder;
        this.actionPromptBuilder = actionPromptBuilder;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.configure(JsonParser.Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
    }

    public AiOutputDto generateEmail(String purpose, String recipient, Tone tone, EmailLength length, Language language, String additionalInstructions) {
        log.info("Starting email generation pipeline");
        String prompt = generateEmailPromptBuilder.build(purpose, recipient, tone, length, language, additionalInstructions);
        return executeAndParse(prompt);
    }

    public AiOutputDto applyAction(String currentSubject, String currentBody, ActionType actionType, String targetLanguage) {
        log.info("Starting email action pipeline: {}", actionType);
        String prompt = actionPromptBuilder.build(currentSubject, currentBody, actionType, targetLanguage);
        return executeAndParse(prompt);
    }

    private AiOutputDto executeAndParse(String prompt) {
        GroqResponse response = groqClient.callGroq(prompt);
        try {
            String rawText = response.getChoices().get(0).getMessage().getContent();
            String cleanedJson = cleanJsonText(rawText);
            return objectMapper.readValue(cleanedJson, AiOutputDto.class);
        } catch (Exception ex) {
            log.error("Failed to parse Groq response to AiOutputDto: {}", ex.getMessage());
            throw new AiServiceException("Failed to parse generated email content: " + ex.getMessage());
        }
    }

    private String cleanJsonText(String rawText) {
        if (rawText == null) {
            return "";
        }
        String cleaned = rawText.trim();
        // Remove markdown wrappers if present
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }
        return cleaned.trim();
    }
}
