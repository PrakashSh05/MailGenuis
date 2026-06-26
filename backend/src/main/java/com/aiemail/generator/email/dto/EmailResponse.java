package com.aiemail.generator.email.dto;

import com.aiemail.generator.common.enums.EmailLength;
import com.aiemail.generator.common.enums.Language;
import com.aiemail.generator.common.enums.Tone;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailResponse {
    private UUID id;
    private String purpose;
    private String recipient;
    private Tone tone;
    private EmailLength length;
    private Language language;
    private String additionalInstructions;
    private String subject;
    private String body;
    private String modelUsed;
    private Integer generationTimeMs;
    private boolean isSaved;
    @com.fasterxml.jackson.annotation.JsonProperty("isFavorite")
    private boolean favorite;
    private LocalDateTime createdAt;
}
