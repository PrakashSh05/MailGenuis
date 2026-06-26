package com.aiemail.generator.template.dto;

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
public class TemplateResponse {
    private UUID id;
    private String name;
    private Tone tone;
    private com.aiemail.generator.common.enums.EmailLength length;
    private com.aiemail.generator.common.enums.Language language;
    private String body;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
