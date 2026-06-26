package com.aiemail.generator.dashboard.controller;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.auth.repository.UserRepository;
import com.aiemail.generator.common.response.ApiResponse;
import com.aiemail.generator.dashboard.dto.*;
import com.aiemail.generator.dashboard.service.DashboardService;
import com.aiemail.generator.exception.UnauthorizedException;
import com.aiemail.generator.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserRepository userRepository;

    @Autowired
    public DashboardController(DashboardService dashboardService, UserRepository userRepository) {
        this.dashboardService = dashboardService;
        this.userRepository = userRepository;
    }

    private UserEntity getAuthenticatedUser(UserPrincipal principal) {
        if (principal == null) {
            throw new UnauthorizedException("User is not authenticated");
        }
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard(
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest servletRequest) {
        UserEntity user = getAuthenticatedUser(principal);
        DashboardResponse response = dashboardService.getDashboardSummary(user);
        ApiResponse<DashboardResponse> body = ApiResponse.success(response, "Dashboard summary loaded successfully", servletRequest.getRequestURI());
        return ResponseEntity.ok(body);
    }

    @GetMapping("/activity")
    public ResponseEntity<ApiResponse<List<RecentActivity>>> getRecentActivity(
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest servletRequest) {
        UserEntity user = getAuthenticatedUser(principal);
        List<RecentActivity> response = dashboardService.getRecentActivities(user);
        ApiResponse<List<RecentActivity>> body = ApiResponse.success(response, "Recent activity loaded successfully", servletRequest.getRequestURI());
        return ResponseEntity.ok(body);
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<List<StatisticsCard>>> getStatistics(
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest servletRequest) {
        UserEntity user = getAuthenticatedUser(principal);
        List<StatisticsCard> response = dashboardService.getStatistics(user);
        ApiResponse<List<StatisticsCard>> body = ApiResponse.success(response, "Statistics loaded successfully", servletRequest.getRequestURI());
        return ResponseEntity.ok(body);
    }
}
