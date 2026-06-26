package com.aiemail.generator.ai.builder;

import com.aiemail.generator.ai.templates.GenerateEmailTemplate;
import com.aiemail.generator.common.enums.EmailLength;
import com.aiemail.generator.common.enums.Language;
import com.aiemail.generator.common.enums.Tone;
import org.springframework.stereotype.Component;

@Component
public class GenerateEmailPromptBuilder {

    public String build(String purpose, String recipient, Tone tone, EmailLength length, Language language, String additionalInstructions) {
        String base = GenerateEmailTemplate.TEMPLATE;
        
        return base
                .replace("[LANGUAGE]", language.name())
                .replace("[TONE]", tone.name())
                .replace("[LENGTH]", length.name())
                .replace("[PURPOSE]", purpose)
                .replace("[RECIPIENT]", recipient)
                .replace("[INSTRUCTIONS]", additionalInstructions != null ? additionalInstructions : "None");
    }
}
