package com.hicham.annotationplatformproject1.repository;

import com.hicham.annotationplatformproject1.model.UserDatasetProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserDatasetProgressRepository extends JpaRepository<UserDatasetProgress, Long> {
    Optional<UserDatasetProgress> findByUserIdAndDatasetId(Long userId, Long datasetId);
}