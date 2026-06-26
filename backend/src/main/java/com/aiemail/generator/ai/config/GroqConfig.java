package com.aiemail.generator.ai.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
@Data
public class GroqConfig {

    @Value("${app.groq.api-key}")
    private String apiKey;

    @Value("${app.groq.model:llama3-8b-8192}")
    private String model;

    @Value("${app.groq.api-url:https://api.groq.com/openai/v1/chat/completions}")
    private String apiUrl;

    @Bean
    public RestTemplate groqRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000); // 10 seconds connection timeout
        factory.setReadTimeout(30000);    // 30 seconds read timeout
        return new RestTemplate(factory);
    }
}
