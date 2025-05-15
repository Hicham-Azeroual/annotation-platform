package com.hicham.annotationplatformproject1.controller;

import com.hicham.annotationplatformproject1.model.ActivityLog;
import com.hicham.annotationplatformproject1.repository.ActivityLogRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/activity-logs")
public class ActivityLogController {

    private final ActivityLogRepository activityLogRepository;

    public ActivityLogController(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    @GetMapping
    public List<ActivityLog> getAllActivityLogs() {
        return activityLogRepository.findAllByOrderByTimestampDesc();
    }
}