package com.aiemail.generator.template.repository;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.auth.repository.UserRepository;
import com.aiemail.generator.common.enums.Tone;
import com.aiemail.generator.common.enums.UserRole;
import com.aiemail.generator.template.entity.UserTemplateEntity;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("dev")
class UserTemplateRepositoryTest {

    @Autowired
    private UserTemplateRepository templateRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testSaveAndQueries() {
        UserEntity user = userRepository.save(UserEntity.builder()
                .email("templatetest-" + System.currentTimeMillis() + "@example.com")
                .passwordHash("password")
                .fullName("Template Test User")
                .role(UserRole.ROLE_USER)
                .build());

        UserTemplateEntity template = UserTemplateEntity.builder()
                .user(user)
                .name("Leave Request")
                .tone(Tone.FORMAL)
                .length(com.aiemail.generator.common.enums.EmailLength.MEDIUM)
                .language(com.aiemail.generator.common.enums.Language.ENGLISH)
                .body("Write a leave request template for [Name].")
                .build();

        templateRepository.save(template);

        List<UserTemplateEntity> templates = templateRepository.findByUser(user);
        assertEquals(1, templates.size());
        assertEquals("Leave Request", templates.get(0).getName());

        assertTrue(templateRepository.existsByUserAndName(user, "Leave Request"));
        assertFalse(templateRepository.existsByUserAndName(user, "Meeting Template"));
    }
}
