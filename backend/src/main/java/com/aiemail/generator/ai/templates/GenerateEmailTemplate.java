package com.aiemail.generator.ai.templates;

public final class GenerateEmailTemplate {
    private GenerateEmailTemplate() {
        // Prevent instantiation
    }

    public static final String TEMPLATE = 
        "You are a professional email writing assistant. Write an email matching the following parameters.\n" +
        "Language: [LANGUAGE]\n" +
        "Tone: [TONE]\n" +
        "Length: [LENGTH]\n" +
        "Purpose: [PURPOSE]\n" +
        "Recipient: [RECIPIENT]\n" +
        "Additional Instructions: [INSTRUCTIONS]\n\n" +
        "You MUST respond STRICTLY in the following JSON format. Do not wrap the JSON in ```json or any other markdown wrapper. Do not output anything other than the raw JSON string.\n" +
        "{\n" +
        "  \"subject\": \"[Generated Subject Line]\",\n" +
        "  \"body\": \"[Generated Email Body (use \\n for newlines)]\"\n" +
        "}";
}
