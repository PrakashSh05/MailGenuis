package com.aiemail.generator.security;

import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.security.Key;
import java.util.Base64;
import java.util.Collections;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;
    private final String base64Secret = Base64.getEncoder().encodeToString(
            "this-is-a-secret-key-for-jwt-token-generation-please-change-it-in-production".getBytes());
    private final long expirationMs = 86400000L;

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider(base64Secret, expirationMs);
    }

    private Authentication createAuth(UUID userId, String email) {
        UserPrincipal principal = new UserPrincipal(
                userId, email, "hashed",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
        return new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
    }

    @Test
    void generateToken_shouldReturnNonNullToken() {
        UUID userId = UUID.randomUUID();
        Authentication auth = createAuth(userId, "test@example.com");

        String token = tokenProvider.generateToken(auth);

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void getUserIdFromJWT_shouldReturnCorrectUserId() {
        UUID userId = UUID.randomUUID();
        Authentication auth = createAuth(userId, "test@example.com");
        String token = tokenProvider.generateToken(auth);

        UUID extracted = tokenProvider.getUserIdFromJWT(token);

        assertEquals(userId, extracted);
    }

    @Test
    void getEmailFromJWT_shouldReturnCorrectEmail() {
        UUID userId = UUID.randomUUID();
        String email = "jwt@example.com";
        Authentication auth = createAuth(userId, email);
        String token = tokenProvider.generateToken(auth);

        String extracted = tokenProvider.getEmailFromJWT(token);

        assertEquals(email, extracted);
    }

    @Test
    void validateToken_shouldReturnTrueForValidToken() {
        Authentication auth = createAuth(UUID.randomUUID(), "valid@example.com");
        String token = tokenProvider.generateToken(auth);

        assertTrue(tokenProvider.validateToken(token));
    }

    @Test
    void validateToken_shouldReturnFalseForMalformedToken() {
        assertFalse(tokenProvider.validateToken("not.a.valid.token"));
    }

    @Test
    void validateToken_shouldReturnFalseForEmptyToken() {
        assertFalse(tokenProvider.validateToken(""));
    }

    @Test
    void validateToken_shouldReturnFalseForExpiredToken() {
        // Create a provider with 0ms expiration
        JwtTokenProvider expiredProvider = new JwtTokenProvider(base64Secret, 0L);
        Authentication auth = createAuth(UUID.randomUUID(), "expired@example.com");
        String token = expiredProvider.generateToken(auth);

        assertFalse(expiredProvider.validateToken(token));
    }

    @Test
    void getJwtExpirationMs_shouldReturnConfiguredValue() {
        assertEquals(expirationMs, tokenProvider.getJwtExpirationMs());
    }
}
