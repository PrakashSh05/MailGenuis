package com.aiemail.generator.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsCard {
    private String title;
    private String value;
    private String description;
    private String trend; // e.g., "+12%", "-3%", "neutral"
}
