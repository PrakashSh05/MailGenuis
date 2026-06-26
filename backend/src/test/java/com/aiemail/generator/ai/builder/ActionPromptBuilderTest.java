package com.aiemail.generator.ai.builder;

import com.aiemail.generator.common.enums.ActionType;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ActionPromptBuilderTest {

    private final ActionPromptBuilder builder = new ActionPromptBuilder();

    @Test
    void testBuildPrompt() {
        String prompt = builder.build(
                "Old Subject",
                "Old Body",
                ActionType.SHORTEN,
                null
        );

        assertNotNull(prompt);
        assertTrue(prompt.contains("Old Subject"));
        assertTrue(prompt.contains("Old Body"));
        assertTrue(prompt.contains("Shorten the following email"));
    }

    @Test
    void testBuildTranslationPrompt() {
        String prompt = builder.build(
                "Subject",
                "Body",
                ActionType.TRANSLATE,
                "SPANISH"
        );

        assertNotNull(prompt);
        assertTrue(prompt.contains("Translate the following email completely"));
        assertTrue(prompt.contains("SPANISH"));
    }
}
