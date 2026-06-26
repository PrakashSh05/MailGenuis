package com.aiemail.generator.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroqResponse {
    private String id;
    private String model;
    private List<GroqChoice> choices;
}
