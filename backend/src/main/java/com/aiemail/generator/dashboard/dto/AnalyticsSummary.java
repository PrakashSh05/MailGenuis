package com.aiemail.generator.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsSummary {
    private String mostUsedTone;
    private String mostUsedLanguage;
    private String mostUsedTemplate;
}
