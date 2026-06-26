package com.aiemail.generator.profile.dto;

import com.aiemail.generator.common.enums.Tone;
import com.aiemail.generator.common.enums.Language;
import com.aiemail.generator.common.enums.EmailLength;
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
public class ProfileResponse {
    private UUID id;
    private String email;
    private String fullName;
    private String role;
    private Tone defaultTone;
    private Language defaultLanguage;
    private EmailLength defaultEmailLength;
    private boolean darkModeEnabled;
    private String themePreference;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
