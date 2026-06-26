package com.aiemail.generator.dashboard.service;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.common.enums.Language;
import com.aiemail.generator.common.enums.Tone;
import com.aiemail.generator.dashboard.dto.*;
import com.aiemail.generator.email.entity.EmailEntity;
import com.aiemail.generator.email.repository.EmailRepository;
import com.aiemail.generator.template.entity.UserTemplateEntity;
import com.aiemail.generator.template.repository.UserTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final EmailRepository emailRepository;
    private final UserTemplateRepository templateRepository;

    @Autowired
    public DashboardServiceImpl(EmailRepository emailRepository,
                                UserTemplateRepository templateRepository) {
        this.emailRepository = emailRepository;
        this.templateRepository = templateRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getDashboardSummary(UserEntity user) {
        return DashboardResponse.builder()
                .statistics(getStatistics(user))
                .analytics(getAnalyticsSummary(user))
                .recentActivities(getRecentActivities(user))
                .quickActions(getQuickActions())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StatisticsCard> getStatistics(UserEntity user) {
        List<StatisticsCard> cards = new ArrayList<>();

        long totalEmails = emailRepository.countByUser(user);
        cards.add(StatisticsCard.builder()
                .title("Total Emails")
                .value(String.valueOf(totalEmails))
                .description("Total emails generated to date")
                .trend("neutral")
                .build());

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        long todaysEmails = emailRepository.countByUserAndCreatedAtAfter(user, startOfToday);
        cards.add(StatisticsCard.builder()
                .title("Today's Emails")
                .value(String.valueOf(todaysEmails))
                .description("Emails generated today")
                .trend(todaysEmails > 0 ? "+" + todaysEmails : "neutral")
                .build());

        LocalDateTime startOfWeek = LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).atStartOfDay();
        long weeklyEmails = emailRepository.countByUserAndCreatedAtAfter(user, startOfWeek);
        cards.add(StatisticsCard.builder()
                .title("This Week's Emails")
                .value(String.valueOf(weeklyEmails))
                .description("Emails generated this week")
                .trend(weeklyEmails > 0 ? "+" + weeklyEmails : "neutral")
                .build());

        long favoriteEmails = emailRepository.countByUserAndFavorite(user, true);
        cards.add(StatisticsCard.builder()
                .title("Favorite Emails")
                .value(String.valueOf(favoriteEmails))
                .description("Starred emails in history")
                .trend("neutral")
                .build());

        long templatesCreated = templateRepository.countByUser(user);
        cards.add(StatisticsCard.builder()
                .title("Templates Created")
                .value(String.valueOf(templatesCreated))
                .description("Custom prompt templates")
                .trend("neutral")
                .build());

        return cards;
    }

    private AnalyticsSummary getAnalyticsSummary(UserEntity user) {
        PageRequest topOne = PageRequest.of(0, 1);
        
        List<Tone> toneList = emailRepository.findMostUsedTone(user, topOne);
        String mostUsedTone = !toneList.isEmpty() 
                ? toneList.get(0).name() 
                : (user.getDefaultTone() != null ? user.getDefaultTone().name() : Tone.CASUAL.name());

        List<Language> languageList = emailRepository.findMostUsedLanguage(user, topOne);
        String mostUsedLanguage = !languageList.isEmpty() 
                ? languageList.get(0).name() 
                : (user.getDefaultLanguage() != null ? user.getDefaultLanguage().name() : Language.ENGLISH.name());

        // Resolve most used template: find template matching the user's most used tone, or fallback to the latest template name
        String mostUsedTemplate = "None";
        if (user.getDefaultTone() != null) {
            // Check templates with most used tone
            List<UserTemplateEntity> matchingTemplates = templateRepository.findByUser(user);
            Optional<UserTemplateEntity> match = matchingTemplates.stream()
                    .filter(t -> t.getTone().name().equalsIgnoreCase(mostUsedTone))
                    .findFirst();
            if (match.isPresent()) {
                mostUsedTemplate = match.get().getName();
            } else if (!matchingTemplates.isEmpty()) {
                mostUsedTemplate = matchingTemplates.get(0).getName();
            }
        } else {
            Optional<UserTemplateEntity> latestTemplate = templateRepository.findFirstByUserOrderByCreatedAtDesc(user);
            if (latestTemplate.isPresent()) {
                mostUsedTemplate = latestTemplate.get().getName();
            }
        }

        return AnalyticsSummary.builder()
                .mostUsedTone(mostUsedTone)
                .mostUsedLanguage(mostUsedLanguage)
                .mostUsedTemplate(mostUsedTemplate)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecentActivity> getRecentActivities(UserEntity user) {
        List<RecentActivity> activities = new ArrayList<>();

        // 1. Latest Generated Email
        Optional<EmailEntity> latestEmail = emailRepository.findFirstByUserOrderByCreatedAtDesc(user);
        latestEmail.ifPresent(email -> activities.add(RecentActivity.builder()
                .type("EMAIL_GENERATED")
                .title("Email Generated")
                .description("Generated email: " + email.getSubject())
                .timestamp(email.getCreatedAt())
                .build()));

        // 2. Latest Saved Email
        Optional<EmailEntity> latestSaved = emailRepository.findFirstByUserAndIsSavedTrueOrderByCreatedAtDesc(user);
        latestSaved.ifPresent(email -> activities.add(RecentActivity.builder()
                .type("EMAIL_SAVED")
                .title("Email Saved")
                .description("Saved email: " + email.getSubject())
                .timestamp(email.getCreatedAt())
                .build()));

        // 3. Latest Created Template
        Optional<UserTemplateEntity> latestTemplate = templateRepository.findFirstByUserOrderByCreatedAtDesc(user);
        latestTemplate.ifPresent(template -> activities.add(RecentActivity.builder()
                .type("TEMPLATE_CREATED")
                .title("Template Created")
                .description("Created template: " + template.getName())
                .timestamp(template.getCreatedAt())
                .build()));

        // 4. Updated Profile
        if (user.getUpdatedAt() != null && user.getUpdatedAt().isAfter(user.getCreatedAt().plusSeconds(1))) {
            activities.add(RecentActivity.builder()
                    .type("PROFILE_UPDATED")
                    .title("Profile Updated")
                    .description("Updated settings and preferences")
                    .timestamp(user.getUpdatedAt())
                    .build());
        }

        // Sort by timestamp desc and limit to 10 items
        return activities.stream()
                .sorted(Comparator.comparing(RecentActivity::getTimestamp).reversed())
                .limit(10)
                .collect(Collectors.toList());
    }

    private List<QuickAction> getQuickActions() {
        List<QuickAction> actions = new ArrayList<>();
        actions.add(QuickAction.builder()
                .title("Generate Email")
                .description("Create a new AI-powered email")
                .actionUrl("/generator")
                .icon("Send")
                .build());
        actions.add(QuickAction.builder()
                .title("Create Template")
                .description("Save prompts as reusable templates")
                .actionUrl("/templates")
                .icon("Plus")
                .build());
        actions.add(QuickAction.builder()
                .title("View History")
                .description("Search and reuse sent emails")
                .actionUrl("/history")
                .icon("History")
                .build());
        actions.add(QuickAction.builder()
                .title("Account Settings")
                .description("Adjust defaults and preferences")
                .actionUrl("/settings")
                .icon("Settings")
                .build());
        return actions;
    }
}
