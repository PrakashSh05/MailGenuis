package com.aiemail.generator.common.response;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

class ApiErrorTest {

    @Test
    void testBuilderAndGetters() {
        LocalDateTime time = LocalDateTime.now();
        Map<String, String> details = new HashMap<>();
        details.put("field", "Must not be empty");

        ApiError error = ApiError.builder()
                .timestamp(time)
                .status(400)
                .error("Bad Request")
                .message("Validation failed")
                .path("/api/v1/resource")
                .details(details)
                .build();

        assertEquals(time, error.getTimestamp());
        assertEquals(400, error.getStatus());
        assertEquals("Bad Request", error.getError());
        assertEquals("Validation failed", error.getMessage());
        assertEquals("/api/v1/resource", error.getPath());
        assertEquals(details, error.getDetails());
    }
}
