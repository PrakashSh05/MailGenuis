package com.aiemail.generator.auth.entity;

import com.aiemail.generator.common.enums.UserRole;
import com.aiemail.generator.common.enums.Tone;
import com.aiemail.generator.common.enums.Language;
import com.aiemail.generator.common.enums.EmailLength;
import com.aiemail.generator.email.entity.EmailEntity;
import com.aiemail.generator.template.entity.UserTemplateEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(
    name = "users",
    indexes = {
        @Index(name = "idx_users_email", columnList = "email", unique = true)
    }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    @EqualsAndHashCode.Include
    @ToString.Include
    private UUID id;

    @NotBlank
    @Email
    @Column(name = "email", nullable = false, unique = true)
    @ToString.Include
    private String email;

    @NotBlank
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @NotBlank
    @Column(name = "full_name", nullable = false)
    @ToString.Include
    private String fullName;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    @Builder.Default
    private UserRole role = UserRole.ROLE_USER;

    @Enumerated(EnumType.STRING)
    @Column(name = "default_tone")
    private Tone defaultTone;

    @Enumerated(EnumType.STRING)
    @Column(name = "default_language")
    private Language defaultLanguage;

    @Enumerated(EnumType.STRING)
    @Column(name = "default_email_length")
    private EmailLength defaultEmailLength;

    @Column(name = "dark_mode_enabled", nullable = false)
    @Builder.Default
    private boolean darkModeEnabled = false;

    @Column(name = "theme_preference", nullable = false)
    @Builder.Default
    private String themePreference = "light";

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<EmailEntity> emails = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<UserTemplateEntity> templates = new ArrayList<>();
}
