package com.aiemail.generator.template.entity;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.common.enums.Tone;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "user_templates",
    indexes = {
        @Index(name = "idx_templates_user_id", columnList = "user_id")
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
public class UserTemplateEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    @EqualsAndHashCode.Include
    @ToString.Include
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @NotBlank
    @Column(name = "name", nullable = false, length = 100)
    @ToString.Include
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "tone", nullable = false)
    @NotNull
    private Tone tone;

    @Enumerated(EnumType.STRING)
    @Column(name = "length", nullable = false)
    @NotNull
    private com.aiemail.generator.common.enums.EmailLength length;

    @Enumerated(EnumType.STRING)
    @Column(name = "language", nullable = false)
    @NotNull
    private com.aiemail.generator.common.enums.Language language;

    @NotBlank
    @Column(name = "prompt_template", nullable = false, length = 5000)
    private String body;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
