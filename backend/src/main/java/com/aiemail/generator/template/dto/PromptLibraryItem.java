package com.aiemail.generator.template.dto;

import com.aiemail.generator.common.enums.EmailLength;
import com.aiemail.generator.common.enums.Tone;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromptLibraryItem {
    private String id;
    private String category;
    private String title;
    private String description;
    private String purpose;
    private Tone defaultTone;
    private EmailLength defaultLength;
    private String prompt;
}
