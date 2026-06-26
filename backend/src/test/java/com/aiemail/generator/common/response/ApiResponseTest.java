package com.aiemail.generator.common.response;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class ApiResponseTest {

    @Test
    void testSuccessHelper() {
        String testData = "Hello World";
        String message = "Operation complete";
        String path = "/api/v1/test";

        ApiResponse<String> response = ApiResponse.success(testData, message, path);

        assertTrue(response.isSuccess());
        assertEquals(message, response.getMessage());
        assertEquals(testData, response.getData());
        assertEquals(path, response.getPath());
        assertNotNull(response.getTimestamp());
    }

    @Test
    void testBuilder() {
        LocalDateTime time = LocalDateTime.now();
        ApiResponse<Integer> response = ApiResponse.<Integer>builder()
                .success(true)
                .message("OK")
                .data(100)
                .timestamp(time)
                .path("/test")
                .build();

        assertTrue(response.isSuccess());
        assertEquals("OK", response.getMessage());
        assertEquals(100, response.getData());
        assertEquals(time, response.getTimestamp());
        assertEquals("/test", response.getPath());
    }
}
