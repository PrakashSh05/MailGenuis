package com.aiemail.generator.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentActivity {
    private String type; // e.g., "EMAIL_GENERATED", "EMAIL_SAVED", "TEMPLATE_CREATED", "PROFILE_UPDATED"
    private String title;
    private String description;
    private LocalDateTime timestamp;
}
