package com.hicham.annotationplatformproject1.service;

import com.hicham.annotationplatformproject1.dto.ApiResponse;
import com.hicham.annotationplatformproject1.model.ActivityLog;
import com.hicham.annotationplatformproject1.model.Utilisateur;
import com.hicham.annotationplatformproject1.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
@Component
public abstract class BaseService {

    @Autowired
    protected ActivityLogRepository activityLogRepository;

    protected <T> ApiResponse<T> successResponse(String message, T data) {
        return ApiResponse.success(message, data);
    }

    protected <T> ApiResponse<T> errorResponse(String message) {
        return ApiResponse.error(message);
    }

    @Transactional
    protected void logActivity(String action, String description, Utilisateur user) {
        ActivityLog log = new ActivityLog();
        log.setAction(action);
        log.setDescription(description);
        log.setUser(user);
        log.setTimestamp(LocalDateTime.now());
        activityLogRepository.save(log);
    }

    protected void logActivity(String action, String description) {
        logActivity(action, description, null);
    }

    protected RuntimeException handleNotFoundException(String entity, Long id) {
        String message = entity + " not found with ID: " + id;
        logActivity(entity.toUpperCase() + "_FETCH_ERROR", message);
        return new RuntimeException(message);
    }

    protected RuntimeException handleInvalidRoleException(String entity, Long id) {
        String message = "User is not an " + entity.toLowerCase() + " with ID: " + id;
        logActivity(entity.toUpperCase() + "_ROLE_ERROR", message);
        return new RuntimeException(message);
    }
}