package com.aiemail.generator.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class RateLimitConfig {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    /**
     * Resolves or creates a Bucket4j instance for a unique identifier (e.g. client IP or username).
     */
    public Bucket resolveBucket(String key, int capacity, int refillTokens, Duration refillDuration) {
        return cache.computeIfAbsent(key, k -> createNewBucket(capacity, refillTokens, refillDuration));
    }

    private Bucket createNewBucket(int capacity, int refillTokens, Duration refillDuration) {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(capacity, Refill.intervally(refillTokens, refillDuration)))
                .build();
    }
}
