package com.aiemail.generator.exception;

import com.aiemail.generator.common.response.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void testHandleResourceNotFound() {
        HttpServletRequest request = Mockito.mock(HttpServletRequest.class);
        when(request.getRequestURI()).thenReturn("/api/v1/emails/1");
        
        ResourceNotFoundException ex = new ResourceNotFoundException("Email not found");
        ResponseEntity<ApiError> response = handler.handleResourceNotFoundException(ex, request);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Email not found", response.getBody().getMessage());
        assertEquals("/api/v1/emails/1", response.getBody().getPath());
        assertEquals("Not Found", response.getBody().getError());
    }

    @Test
    void testHandleIllegalArgument() {
        HttpServletRequest request = Mockito.mock(HttpServletRequest.class);
        when(request.getRequestURI()).thenReturn("/api/v1/emails");

        IllegalArgumentException ex = new IllegalArgumentException("Invalid input data");
        ResponseEntity<ApiError> response = handler.handleIllegalArgumentException(ex, request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Invalid input data", response.getBody().getMessage());
        assertEquals("/api/v1/emails", response.getBody().getPath());
        assertEquals("Bad Request", response.getBody().getError());
    }
}
