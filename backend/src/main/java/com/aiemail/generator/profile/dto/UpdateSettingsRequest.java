package com.aiemail.generator.profile.dto;

import com.aiemail.generator.common.enums.Tone;
import com.aiemail.generator.common.enums.Language;
import com.aiemail.generator.common.enums.EmailLength;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSettingsRequest {
    private Tone defaultTone;
    private Language defaultLanguage;
    private EmailLength defaultEmailLength;
    private Boolean darkModeEnabled;
    private String themePreference;
}
