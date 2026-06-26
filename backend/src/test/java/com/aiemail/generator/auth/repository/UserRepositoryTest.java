package com.aiemail.generator.auth.repository;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.common.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("dev")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void testSaveAndFindByEmail() {
        UserEntity user = UserEntity.builder()
                .email("test-" + System.currentTimeMillis() + "@example.com")
                .passwordHash("hashedpassword")
                .fullName("Test User")
                .role(UserRole.ROLE_USER)
                .darkModeEnabled(false)
                .themePreference("light")
                .build();

        UserEntity savedUser = userRepository.save(user);
        assertNotNull(savedUser.getId());
        assertNotNull(savedUser.getCreatedAt());
        assertNotNull(savedUser.getUpdatedAt());

        Optional<UserEntity> foundUser = userRepository.findByEmail(user.getEmail());
        assertTrue(foundUser.isPresent());
        assertEquals(user.getFullName(), foundUser.get().getFullName());
    }

    @Test
    void testExistsByEmail() {
        String email = "exists-" + System.currentTimeMillis() + "@example.com";
        UserEntity user = UserEntity.builder()
                .email(email)
                .passwordHash("hash")
                .fullName("Exists User")
                .role(UserRole.ROLE_USER)
                .build();

        assertFalse(userRepository.existsByEmail(email));
        userRepository.save(user);
        assertTrue(userRepository.existsByEmail(email));
    }
}
