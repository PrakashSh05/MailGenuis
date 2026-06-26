package com.aiemail.generator.dashboard.controller;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.auth.repository.UserRepository;
import com.aiemail.generator.common.enums.UserRole;
import com.aiemail.generator.dashboard.dto.*;
import com.aiemail.generator.dashboard.service.DashboardService;
import com.aiemail.generator.security.CustomUserDetailsService;
import com.aiemail.generator.security.JwtAuthenticationEntryPoint;
import com.aiemail.generator.security.JwtTokenProvider;
import com.aiemail.generator.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DashboardController.class)
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DashboardService dashboardService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @MockBean
    private JwtTokenProvider tokenProvider;

    @MockBean
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    private UserEntity mockUser;
    private UserPrincipal mockPrincipal;

    @BeforeEach
    void setUp() {
        UUID userId = UUID.randomUUID();
        mockUser = UserEntity.builder()
                .id(userId)
                .email("testuser@example.com")
                .passwordHash("password")
                .fullName("Test User")
                .role(UserRole.ROLE_USER)
                .build();

        mockPrincipal = UserPrincipal.create(mockUser);

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(mockPrincipal, null, mockPrincipal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
    }

    @Test
    @WithMockUser
    void testGetDashboardSuccess() throws Exception {
        DashboardResponse response = DashboardResponse.builder()
                .statistics(Collections.singletonList(
                        StatisticsCard.builder()
                                .title("Total Emails")
                                .value("5")
                                .description("desc")
                                .trend("neutral")
                                .build()
                ))
                .analytics(AnalyticsSummary.builder()
                        .mostUsedTone("FORMAL")
                        .mostUsedLanguage("ENGLISH")
                        .mostUsedTemplate("None")
                        .build())
                .recentActivities(Collections.singletonList(
                        RecentActivity.builder()
                                .type("EMAIL_GENERATED")
                                .title("Title")
                                .description("desc")
                                .timestamp(LocalDateTime.now())
                                .build()
                ))
                .quickActions(Collections.singletonList(
                        QuickAction.builder()
                                .title("Action")
                                .description("desc")
                                .actionUrl("/url")
                                .icon("Icon")
                                .build()
                ))
                .build();

        when(dashboardService.getDashboardSummary(any(UserEntity.class))).thenReturn(response);

        mockMvc.perform(get("/api/v1/dashboard")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.statistics[0].value").value("5"))
                .andExpect(jsonPath("$.data.analytics.mostUsedTone").value("FORMAL"));
    }

    @Test
    @WithMockUser
    void testGetRecentActivitySuccess() throws Exception {
        RecentActivity activity = RecentActivity.builder()
                .type("EMAIL_GENERATED")
                .title("Title")
                .description("desc")
                .timestamp(LocalDateTime.now())
                .build();

        when(dashboardService.getRecentActivities(any(UserEntity.class))).thenReturn(Collections.singletonList(activity));

        mockMvc.perform(get("/api/v1/dashboard/activity")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].type").value("EMAIL_GENERATED"));
    }

    @Test
    @WithMockUser
    void testGetStatisticsSuccess() throws Exception {
        StatisticsCard card = StatisticsCard.builder()
                .title("Total Emails")
                .value("10")
                .description("desc")
                .trend("neutral")
                .build();

        when(dashboardService.getStatistics(any(UserEntity.class))).thenReturn(Collections.singletonList(card));

        mockMvc.perform(get("/api/v1/dashboard/statistics")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].value").value("10"));
    }

    @Test
    void testGetDashboardUnauthorized() throws Exception {
        SecurityContextHolder.clearContext();

        mockMvc.perform(get("/api/v1/dashboard")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}
