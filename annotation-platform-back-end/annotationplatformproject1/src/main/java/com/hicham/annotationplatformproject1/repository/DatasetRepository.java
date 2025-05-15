package com.hicham.annotationplatformproject1.repository;

import com.hicham.annotationplatformproject1.model.Dataset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DatasetRepository extends JpaRepository<Dataset, Long> {
    Optional<Dataset> findByName(String name);

    long count();

    // Count datasets created before a specific time
    @Query("SELECT COUNT(d) FROM Dataset d WHERE d.createdAt < :time")
    long countByCreatedAtBefore(LocalDateTime time);

    Page<Dataset> findAll(Pageable pageable);

}