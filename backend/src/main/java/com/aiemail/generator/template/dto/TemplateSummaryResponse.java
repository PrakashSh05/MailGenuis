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
public class TemplateSummaryResponse {
    private UUID id;
    private String name;
    private Tone tone;
    private LocalDateTime createdAt;
}
