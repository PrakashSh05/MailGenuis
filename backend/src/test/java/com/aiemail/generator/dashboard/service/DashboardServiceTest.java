package com.aiemail.generator.dashboard.service;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.common.enums.Language;
import com.aiemail.generator.common.enums.Tone;
import com.aiemail.generator.dashboard.dto.*;
import com.aiemail.generator.email.entity.EmailEntity;
import com.aiemail.generator.email.repository.EmailRepository;
import com.aiemail.generator.template.entity.UserTemplateEntity;
import com.aiemail.generator.template.repository.UserTemplateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock private EmailRepository emailRepository;
    @Mock private UserTemplateRepository templateRepository;

    @InjectMocks
    private DashboardServiceImpl dashboardService;

    private UserEntity user;

    @BeforeEach
    void setUp() {
        user = new UserEntity();
        user.setId(UUID.randomUUID());
        user.setEmail("test@example.com");
        user.setCreatedAt(LocalDateTime.now().minusDays(30));
        user.setUpdatedAt(LocalDateTime.now().minusDays(30));
    }

    @Test
    void getStatistics_returnsAllCards() {
        when(emailRepository.countByUser(user)).thenReturn(50L);
        when(emailRepository.countByUserAndCreatedAtAfter(eq(user), any())).thenReturn(5L);
        when(emailRepository.countByUserAndIsFavorite(user, true)).thenReturn(10L);
        when(templateRepository.countByUser(user)).thenReturn(3L);

        List<StatisticsCard> cards = dashboardService.getStatistics(user);

        assertNotNull(cards);
        assertEquals(5, cards.size());
        assertEquals("50", cards.get(0).getValue());
        assertEquals("Total Emails", cards.get(0).getTitle());
    }

    @Test
    void getRecentActivities_returnsChronologicalList() {
        EmailEntity email = new EmailEntity();
        email.setSubject("Latest Email");
        email.setCreatedAt(LocalDateTime.now());

        when(emailRepository.findFirstByUserOrderByCreatedAtDesc(user)).thenReturn(Optional.of(email));
        when(emailRepository.findFirstByUserAndIsSavedTrueOrderByCreatedAtDesc(user)).thenReturn(Optional.empty());
        when(templateRepository.findFirstByUserOrderByCreatedAtDesc(user)).thenReturn(Optional.empty());

        List<RecentActivity> activities = dashboardService.getRecentActivities(user);

        assertNotNull(activities);
        assertFalse(activities.isEmpty());
        assertEquals("EMAIL_GENERATED", activities.get(0).getType());
    }

    @Test
    void getDashboardSummary_returnsFullResponse() {
        when(emailRepository.countByUser(user)).thenReturn(10L);
        when(emailRepository.countByUserAndCreatedAtAfter(eq(user), any())).thenReturn(2L);
        when(emailRepository.countByUserAndIsFavorite(user, true)).thenReturn(1L);
        when(templateRepository.countByUser(user)).thenReturn(0L);
        when(emailRepository.findMostUsedTone(eq(user), any(Pageable.class))).thenReturn(List.of(Tone.PROFESSIONAL));
        when(emailRepository.findMostUsedLanguage(eq(user), any(Pageable.class))).thenReturn(List.of(Language.ENGLISH));
        when(templateRepository.findByUser(user)).thenReturn(Collections.emptyList());
        when(templateRepository.findFirstByUserOrderByCreatedAtDesc(user)).thenReturn(Optional.empty());
        when(emailRepository.findFirstByUserOrderByCreatedAtDesc(user)).thenReturn(Optional.empty());
        when(emailRepository.findFirstByUserAndIsSavedTrueOrderByCreatedAtDesc(user)).thenReturn(Optional.empty());

        DashboardResponse response = dashboardService.getDashboardSummary(user);

        assertNotNull(response);
        assertNotNull(response.getStatistics());
        assertNotNull(response.getAnalytics());
        assertNotNull(response.getQuickActions());
        assertEquals("PROFESSIONAL", response.getAnalytics().getMostUsedTone());
    }
}
