package com.aiemail.generator.ai.builder;

import com.aiemail.generator.common.enums.EmailLength;
import com.aiemail.generator.common.enums.Language;
import com.aiemail.generator.common.enums.Tone;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class GenerateEmailPromptBuilderTest {

    private final GenerateEmailPromptBuilder builder = new GenerateEmailPromptBuilder();

    @Test
    void testBuildPrompt() {
        String prompt = builder.build(
                "Request vacation leave",
                "Manager",
                Tone.FORMAL,
                EmailLength.SHORT,
                Language.ENGLISH,
                "Need next Monday off"
        );

        assertNotNull(prompt);
        assertTrue(prompt.contains("Request vacation leave"));
        assertTrue(prompt.contains("Manager"));
        assertTrue(prompt.contains("FORMAL"));
        assertTrue(prompt.contains("SHORT"));
        assertTrue(prompt.contains("ENGLISH"));
        assertTrue(prompt.contains("Need next Monday off"));
    }
}
