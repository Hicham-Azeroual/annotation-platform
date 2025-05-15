package com.hicham.annotationplatformproject1.service;

import com.hicham.annotationplatformproject1.model.ActivityLog;
import com.hicham.annotationplatformproject1.model.Utilisateur;
import com.hicham.annotationplatformproject1.repository.ActivityLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public ActivityLogService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    @Transactional
    public void logActivity(String action, String description, Utilisateur user) {
        ActivityLog log = new ActivityLog();
        log.setAction(action);
        log.setDescription(description);
        log.setUser(user);
        log.setTimestamp(LocalDateTime.now());
        activityLogRepository.save(log);
    }

    @Transactional
    public void logActivity(String action, String description) {
        // Pour les activités sans utilisateur spécifique (système)
        logActivity(action, description, null);
    }
}