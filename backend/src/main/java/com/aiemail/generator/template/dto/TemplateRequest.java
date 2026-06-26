package com.aiemail.generator.template.dto;

import com.aiemail.generator.common.enums.Tone;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TemplateRequest {

    @NotBlank(message = "Template name is required")
    @Size(max = 100, message = "Template name must be less than 100 characters")
    private String name;

    @NotNull(message = "Tone is required")
    private Tone tone;

    @NotNull(message = "Length is required")
    private com.aiemail.generator.common.enums.EmailLength length;

    @NotNull(message = "Language is required")
    private com.aiemail.generator.common.enums.Language language;

    @NotBlank(message = "Template body is required")
    @Size(max = 5000, message = "Template body must be less than 5000 characters")
    private String body;
}
