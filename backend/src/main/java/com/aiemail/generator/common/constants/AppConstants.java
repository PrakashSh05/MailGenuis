package com.aiemail.generator.common.constants;

public final class AppConstants {
    private AppConstants() {
        // Prevent instantiation
    }

    public static final String API_V1_PREFIX = "/api/v1";
    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";
    
    // Default pagination configurations
    public static final String DEFAULT_PAGE_NUMBER_STR = "0";
    public static final String DEFAULT_PAGE_SIZE_STR = "10";
    public static final String DEFAULT_SORT_BY = "createdAt";
    
    // Telemetry/AI configurations
    public static final String DEFAULT_GROQ_MODEL = "llama-3.1-8b-instant";
}
