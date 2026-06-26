package com.aiemail.generator.ai.client;

import com.aiemail.generator.ai.config.GroqConfig;
import com.aiemail.generator.ai.dto.GroqMessage;
import com.aiemail.generator.ai.dto.GroqRequest;
import com.aiemail.generator.ai.dto.GroqResponse;
import com.aiemail.generator.exception.AiServiceException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Component
@Slf4j
public class GroqClient {

    private final RestTemplate restTemplate;
    private final GroqConfig groqConfig;

    @Autowired
    public GroqClient(RestTemplate restTemplate, GroqConfig groqConfig) {
        this.restTemplate = restTemplate;
        this.groqConfig = groqConfig;
    }

    public GroqResponse callGroq(String prompt) {
        String apiKey = groqConfig.getApiKey();
        if (apiKey == null || apiKey.trim().isEmpty() || "your_groq_api_key_here".equals(apiKey)) {
            throw new AiServiceException("Groq API key is not configured or is invalid.");
        }

        String url = groqConfig.getApiUrl();

        // Construct request body
        GroqMessage message = GroqMessage.builder().role("user").content(prompt).build();
        GroqRequest requestBody = GroqRequest.builder()
                .model(groqConfig.getModel())
                .messages(Collections.singletonList(message))
                .temperature(0.7)
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        HttpEntity<GroqRequest> entity = new HttpEntity<>(requestBody, headers);

        log.info("Sending request to Groq API (Model: {})", groqConfig.getModel());
        long startTime = System.currentTimeMillis();

        try {
            ResponseEntity<GroqResponse> responseEntity = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    GroqResponse.class
            );

            long duration = System.currentTimeMillis() - startTime;
            log.info("Received response from Groq API in {} ms", duration);

            GroqResponse response = responseEntity.getBody();
            if (response == null || response.getChoices() == null || response.getChoices().isEmpty()) {
                throw new AiServiceException("Groq API returned an empty or invalid response");
            }
            return response;

        } catch (HttpClientErrorException ex) {
            log.error("Client error calling Groq API: Status {}, Body: {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            if (ex.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                throw new AiServiceException("Groq API rate limit exceeded. Please try again later.");
            }
            throw new AiServiceException("Groq API client error: " + ex.getResponseBodyAsString());
        } catch (HttpServerErrorException ex) {
            log.error("Server error calling Groq API: Status {}", ex.getStatusCode());
            throw new AiServiceException("Groq API server error occurred. Please try again later.");
        } catch (ResourceAccessException ex) {
            log.error("Timeout/Connection error calling Groq API: {}", ex.getMessage());
            throw new AiServiceException("Timeout occurred while waiting for Groq API response.");
        } catch (Exception ex) {
            log.error("Unexpected error calling Groq API: {}", ex.getMessage());
            throw new AiServiceException("An unexpected error occurred during AI generation: " + ex.getMessage());
        }
    }
}
