package com.aiemail.generator.email.entity;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.common.enums.Tone;
import com.aiemail.generator.common.enums.Language;
import com.aiemail.generator.common.enums.EmailLength;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "emails",
    indexes = {
        @Index(name = "idx_emails_user_id", columnList = "user_id"),
        @Index(name = "idx_emails_created_at", columnList = "created_at"),
        @Index(name = "idx_emails_is_favorite", columnList = "is_favorite")
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
public class EmailEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    @EqualsAndHashCode.Include
    @ToString.Include
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "purpose")
    private String purpose;

    @Column(name = "recipient")
    private String recipient;

    @Enumerated(EnumType.STRING)
    @Column(name = "tone", nullable = false)
    @NotNull
    private Tone tone;

    @Enumerated(EnumType.STRING)
    @Column(name = "length", nullable = false)
    @NotNull
    private EmailLength length;

    @Enumerated(EnumType.STRING)
    @Column(name = "language", nullable = false)
    @NotNull
    private Language language;

    @Column(name = "additional_instructions", length = 1000)
    private String additionalInstructions;

    @NotBlank
    @Column(name = "subject", nullable = false)
    @ToString.Include
    private String subject;

    @NotBlank
    @Column(name = "body", nullable = false, length = 10000)
    private String body;

    @Column(name = "model_used")
    private String modelUsed;

    @Column(name = "generation_time_ms")
    private Integer generationTimeMs;

    @Column(name = "is_saved", nullable = false)
    @Builder.Default
    private boolean isSaved = false;

    @Column(name = "is_favorite", nullable = false)
    @Builder.Default
    private boolean isFavorite = false;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
