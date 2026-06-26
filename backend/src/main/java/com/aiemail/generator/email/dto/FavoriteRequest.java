package com.aiemail.generator.email.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteRequest {
    @NotNull(message = "Favorite status is required")
    @com.fasterxml.jackson.annotation.JsonProperty("isFavorite")
    private Boolean favorite;
}
