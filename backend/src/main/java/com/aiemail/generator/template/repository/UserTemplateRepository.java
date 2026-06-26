package com.aiemail.generator.template.repository;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.template.entity.UserTemplateEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserTemplateRepository extends JpaRepository<UserTemplateEntity, UUID> {
    
    List<UserTemplateEntity> findByUser(UserEntity user);
    
    Page<UserTemplateEntity> findByUser(UserEntity user, Pageable pageable);
    
    Page<UserTemplateEntity> findByUserAndNameContainingIgnoreCase(UserEntity user, String name, Pageable pageable);
    
    Optional<UserTemplateEntity> findByIdAndUser(UUID id, UserEntity user);
    
    boolean existsByUserAndName(UserEntity user, String name);

    Page<UserTemplateEntity> findByUserAndTone(UserEntity user, com.aiemail.generator.common.enums.Tone tone, Pageable pageable);

    Page<UserTemplateEntity> findByUserAndNameContainingIgnoreCaseAndTone(UserEntity user, String name, com.aiemail.generator.common.enums.Tone tone, Pageable pageable);

    long countByUser(UserEntity user);

    Optional<UserTemplateEntity> findFirstByUserOrderByCreatedAtDesc(UserEntity user);
}
