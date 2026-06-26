package com.aiemail.generator.email.dto;

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
public class EmailSummaryResponse {
    private UUID id;
    private String subject;
    private String purpose;
    private String recipient;
    private Tone tone;
    private boolean isFavorite;
    private boolean isSaved;
    private LocalDateTime createdAt;
}
