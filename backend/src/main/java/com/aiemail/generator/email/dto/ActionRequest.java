package com.aiemail.generator.email.dto;

import com.aiemail.generator.common.enums.ActionType;
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
public class ActionRequest {

    @NotNull(message = "Action type is required")
    private ActionType actionType;

    @NotBlank(message = "Current subject is required")
    @Size(max = 255, message = "Subject must be less than 255 characters")
    private String currentSubject;

    @NotBlank(message = "Current body is required")
    @Size(max = 10000, message = "Body must be less than 10000 characters")
    private String currentBody;

    private String targetLanguage;
}
