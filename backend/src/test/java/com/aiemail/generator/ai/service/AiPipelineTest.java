package com.aiemail.generator.ai.service;

import com.aiemail.generator.ai.builder.ActionPromptBuilder;
import com.aiemail.generator.ai.builder.GenerateEmailPromptBuilder;
import com.aiemail.generator.ai.client.GroqClient;
import com.aiemail.generator.ai.dto.*;
import com.aiemail.generator.common.enums.EmailLength;
import com.aiemail.generator.common.enums.Language;
import com.aiemail.generator.common.enums.Tone;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class AiPipelineTest {

    @Mock
    private GroqClient groqClient;

    @Mock
    private GenerateEmailPromptBuilder generateEmailPromptBuilder;

    @Mock
    private ActionPromptBuilder actionPromptBuilder;

    private AiPipeline aiPipeline;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        aiPipeline = new AiPipeline(groqClient, generateEmailPromptBuilder, actionPromptBuilder);
    }

    @Test
    void testGenerateEmailAndParse() {
        String mockResponseJson = "```json\n{\n  \"subject\": \"Test Subject\",\n  \"body\": \"Test Body\"\n}\n```";
        
        GroqMessage message = GroqMessage.builder().content(mockResponseJson).build();
        GroqChoice choice = GroqChoice.builder().message(message).build();
        GroqResponse response = GroqResponse.builder().choices(Collections.singletonList(choice)).build();

        when(generateEmailPromptBuilder.build(anyString(), anyString(), any(Tone.class), any(EmailLength.class), any(Language.class), anyString()))
                .thenReturn("Compiled prompt");
        when(groqClient.callGroq(anyString())).thenReturn(response);

        AiOutputDto result = aiPipeline.generateEmail("Leave", "HR", Tone.FORMAL, EmailLength.SHORT, Language.ENGLISH, null);

        assertNotNull(result);
        assertEquals("Test Subject", result.getSubject());
        assertEquals("Test Body", result.getBody());
    }
}
