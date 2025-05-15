package com.hichamazeroual.annotationplatformproject.repository;

import com.hichamazeroual.annotationplatformproject.model.Dataset;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DatasetRepository extends JpaRepository<Dataset, Long> {
} 