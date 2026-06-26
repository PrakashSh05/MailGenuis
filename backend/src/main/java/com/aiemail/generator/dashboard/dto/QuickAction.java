package com.aiemail.generator.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuickAction {
    private String title;
    private String description;
    private String actionUrl;
    private String icon;
}
