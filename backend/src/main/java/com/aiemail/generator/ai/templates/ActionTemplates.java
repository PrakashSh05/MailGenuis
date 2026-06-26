package com.aiemail.generator.ai.templates;

import com.aiemail.generator.common.enums.ActionType;

import java.util.HashMap;
import java.util.Map;

public final class ActionTemplates {
    private ActionTemplates() {
        // Prevent instantiation
    }

    private static final Map<ActionType, String> ACTIONS = new HashMap<>();

    static {
        ACTIONS.put(ActionType.IMPROVE, 
            "Improve the flow, readability, and impact of the following email while maintaining its core message.");
        
        ACTIONS.put(ActionType.PROFESSIONAL, 
            "Make the tone of the following email strictly professional, formal, and corporate-appropriate.");
        
        ACTIONS.put(ActionType.FRIENDLY, 
            "Make the tone of the following email warm, friendly, polite, and approachable.");
        
        ACTIONS.put(ActionType.SHORTEN, 
            "Shorten the following email, removing wordiness and keeping it concise and direct.");
        
        ACTIONS.put(ActionType.EXPAND, 
            "Expand the following email to add more detail, context, and politeness where appropriate.");
        
        ACTIONS.put(ActionType.GRAMMAR, 
            "Correct any grammar, spelling, punctuation, or formatting errors in the following email.");
        
        ACTIONS.put(ActionType.TRANSLATE, 
            "Translate the following email completely. Translate it into [TARGET_LANGUAGE].");
        
        ACTIONS.put(ActionType.SIMPLIFY, 
            "Simplify the language, structure, and word choices of the following email so it is very easy to read.");
        
        ACTIONS.put(ActionType.SUMMARIZE, 
            "Summarize the following email body to present its key points concisely as an email.");
        
        ACTIONS.put(ActionType.BULLET_POINTS, 
            "Convert the body of the following email into clean, well-spaced bullet points.");
        
        ACTIONS.put(ActionType.REGENERATE, 
            "Regenerate the email entirely, providing a fresh take on the subject and body structure.");
    }

    public static String getActionInstruction(ActionType type) {
        return ACTIONS.getOrDefault(type, "Revise the following email.");
    }

    public static final String WRAPPER_TEMPLATE = 
        "You are an expert email editor. Your task is to modify the provided email based on the edit instruction.\n\n" +
        "Edit Instruction: [INSTRUCTION]\n\n" +
        "Target Email Subject:\n[CURRENT_SUBJECT]\n\n" +
        "Target Email Body:\n[CURRENT_BODY]\n\n" +
        "You MUST respond STRICTLY in the following JSON format. Do not wrap the JSON in ```json or any other markdown wrapper. Do not output anything other than the raw JSON string.\n" +
        "{\n" +
        "  \"subject\": \"[Revised Subject Line]\",\n" +
        "  \"body\": \"[Revised Email Body (use \\n for newlines)]\"\n" +
        "}";
}
