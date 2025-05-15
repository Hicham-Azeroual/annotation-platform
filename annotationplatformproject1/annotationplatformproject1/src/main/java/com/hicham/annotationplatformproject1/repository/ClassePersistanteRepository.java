package com.hicham.annotationplatformproject1.repository;

import com.hicham.annotationplatformproject1.model.ClassePersistante;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassePersistanteRepository extends JpaRepository<ClassePersistante, Long> {
}