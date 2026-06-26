package com.aiemail.generator.email.repository;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.auth.repository.UserRepository;
import com.aiemail.generator.common.enums.EmailLength;
import com.aiemail.generator.common.enums.Language;
import com.aiemail.generator.common.enums.Tone;
import com.aiemail.generator.common.enums.UserRole;
import com.aiemail.generator.email.entity.EmailEntity;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("dev")
class EmailRepositoryTest {

    @Autowired
    private EmailRepository emailRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testSaveAndQueries() {
        UserEntity user = userRepository.save(UserEntity.builder()
                .email("emailtest-" + System.currentTimeMillis() + "@example.com")
                .passwordHash("password")
                .fullName("Email Test User")
                .role(UserRole.ROLE_USER)
                .build());

        EmailEntity email1 = EmailEntity.builder()
                .user(user)
                .purpose("Meeting Request")
                .recipient("Manager")
                .tone(Tone.FORMAL)
                .length(EmailLength.SHORT)
                .language(Language.ENGLISH)
                .subject("Urgent: Sync request")
                .body("Hello, let's sync today.")
                .isFavorite(true)
                .build();

        EmailEntity email2 = EmailEntity.builder()
                .user(user)
                .purpose("Leave Request")
                .recipient("HR")
                .tone(Tone.PROFESSIONAL)
                .length(EmailLength.MEDIUM)
                .language(Language.ENGLISH)
                .subject("Sick leave notice")
                .body("I am feeling unwell today.")
                .isFavorite(false)
                .build();

        emailRepository.save(email1);
        emailRepository.save(email2);

        // Find by user
        Page<EmailEntity> page = emailRepository.findByUser(user, PageRequest.of(0, 10));
        assertEquals(2, page.getTotalElements());

        // Find by user and isFavorite
        Page<EmailEntity> favPage = emailRepository.findByUserAndIsFavorite(user, true, PageRequest.of(0, 10));
        assertEquals(1, favPage.getTotalElements());
        assertEquals("Urgent: Sync request", favPage.getContent().get(0).getSubject());

        // Search Emails
        Page<EmailEntity> searchPage = emailRepository.searchEmails(user, "leave", PageRequest.of(0, 10));
        assertEquals(1, searchPage.getTotalElements());
        assertEquals("Sick leave notice", searchPage.getContent().get(0).getSubject());
    }
}
