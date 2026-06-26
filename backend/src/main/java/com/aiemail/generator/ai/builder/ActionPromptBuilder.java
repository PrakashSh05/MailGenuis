package com.aiemail.generator.ai.builder;

import com.aiemail.generator.ai.templates.ActionTemplates;
import com.aiemail.generator.common.enums.ActionType;
import org.springframework.stereotype.Component;

@Component
public class ActionPromptBuilder {

    public String build(String currentSubject, String currentBody, ActionType actionType, String targetLanguage) {
        String instruction = ActionTemplates.getActionInstruction(actionType);
        if (actionType == ActionType.TRANSLATE && targetLanguage != null) {
            instruction = instruction.replace("[TARGET_LANGUAGE]", targetLanguage);
        }

        return ActionTemplates.WRAPPER_TEMPLATE
                .replace("[INSTRUCTION]", instruction)
                .replace("[CURRENT_SUBJECT]", currentSubject)
                .replace("[CURRENT_BODY]", currentBody);
    }
}
