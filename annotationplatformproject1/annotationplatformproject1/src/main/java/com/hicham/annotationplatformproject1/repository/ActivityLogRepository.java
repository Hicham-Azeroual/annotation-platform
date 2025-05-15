package com.hicham.annotationplatformproject1.repository;

import com.hicham.annotationplatformproject1.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findAllByOrderByTimestampDesc();

    List<ActivityLog> findTop5ByOrderByTimestampDesc();
}