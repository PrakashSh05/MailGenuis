package com.aiemail.generator.email.repository;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.email.entity.EmailEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmailRepository extends JpaRepository<EmailEntity, UUID> {
    
    Page<EmailEntity> findByUser(UserEntity user, Pageable pageable);
    
    Page<EmailEntity> findByUserAndIsFavorite(UserEntity user, boolean isFavorite, Pageable pageable);

    Optional<EmailEntity> findByIdAndUser(UUID id, UserEntity user);

    @Query("SELECT e FROM EmailEntity e WHERE e.user = :user AND " +
           "(LOWER(e.subject) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.body) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.purpose) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<EmailEntity> searchEmails(@Param("user") UserEntity user, @Param("query") String query, Pageable pageable);

    @Query("SELECT e FROM EmailEntity e WHERE e.user = :user AND e.tone = :tone AND " +
           "(LOWER(e.subject) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.body) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.purpose) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<EmailEntity> searchEmailsByTone(@Param("user") UserEntity user, @Param("query") String query, @Param("tone") com.aiemail.generator.common.enums.Tone tone, Pageable pageable);

    @Query("SELECT e FROM EmailEntity e WHERE e.user = :user AND e.isFavorite = :isFavorite AND " +
           "(LOWER(e.subject) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.body) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.purpose) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<EmailEntity> searchEmailsByFavorite(@Param("user") UserEntity user, @Param("query") String query, @Param("isFavorite") boolean isFavorite, Pageable pageable);

    Page<EmailEntity> findByUserAndTone(UserEntity user, com.aiemail.generator.common.enums.Tone tone, Pageable pageable);

    long countByUser(UserEntity user);

    long countByUserAndIsFavorite(UserEntity user, boolean isFavorite);

    long countByUserAndCreatedAtAfter(UserEntity user, java.time.LocalDateTime startDateTime);

    @Query("SELECT e.tone FROM EmailEntity e WHERE e.user = :user GROUP BY e.tone ORDER BY COUNT(e) DESC")
    java.util.List<com.aiemail.generator.common.enums.Tone> findMostUsedTone(@Param("user") UserEntity user, Pageable pageable);

    @Query("SELECT e.language FROM EmailEntity e WHERE e.user = :user GROUP BY e.language ORDER BY COUNT(e) DESC")
    java.util.List<com.aiemail.generator.common.enums.Language> findMostUsedLanguage(@Param("user") UserEntity user, Pageable pageable);

    Optional<EmailEntity> findFirstByUserOrderByCreatedAtDesc(UserEntity user);

    Optional<EmailEntity> findFirstByUserAndIsSavedTrueOrderByCreatedAtDesc(UserEntity user);
}
