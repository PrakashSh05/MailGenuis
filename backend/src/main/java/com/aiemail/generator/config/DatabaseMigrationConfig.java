package com.aiemail.generator.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class DatabaseMigrationConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseMigrationConfig.class);

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public DatabaseMigrationConfig(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void runMigrations() {
        try {
            log.info("Running manual database migrations...");
            // Drop NOT NULL constraint on body column if it exists
            jdbcTemplate.execute("ALTER TABLE user_templates ALTER COLUMN body DROP NOT NULL;");
            log.info("Successfully dropped NOT NULL constraint on user_templates.body");
        } catch (Exception e) {
            log.warn("Failed to drop NOT NULL constraint (column might not exist or already dropped): {}", e.getMessage());
        }
    }
}
