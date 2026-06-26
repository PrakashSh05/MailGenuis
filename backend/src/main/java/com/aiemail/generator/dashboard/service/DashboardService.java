package com.aiemail.generator.dashboard.service;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.dashboard.dto.*;

import java.util.List;

public interface DashboardService {
    DashboardResponse getDashboardSummary(UserEntity user);
    List<StatisticsCard> getStatistics(UserEntity user);
    List<RecentActivity> getRecentActivities(UserEntity user);
}
