package com.aiemail.generator.email.dto;

import com.aiemail.generator.common.enums.EmailLength;
import com.aiemail.generator.common.enums.Language;
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
public class SaveEmailRequest {

    @Size(max = 500, message = "Purpose must be less than 500 characters")
    private String purpose;

    @Size(max = 255, message = "Recipient must be less than 255 characters")
    private String recipient;

    @NotNull(message = "Tone is required")
    private Tone tone;

    @NotNull(message = "Length is required")
    private EmailLength length;

    @NotNull(message = "Language is required")
    private Language language;

    @Size(max = 1000, message = "Additional instructions must be less than 1000 characters")
    private String additionalInstructions;

    @NotBlank(message = "Subject is required")
    @Size(max = 255, message = "Subject must be less than 255 characters")
    private String subject;

    @NotBlank(message = "Body is required")
    @Size(max = 10000, message = "Body must be less than 10000 characters")
    private String body;

    @NotNull(message = "Favorite state must be specified")
    private Boolean isFavorite;
}
