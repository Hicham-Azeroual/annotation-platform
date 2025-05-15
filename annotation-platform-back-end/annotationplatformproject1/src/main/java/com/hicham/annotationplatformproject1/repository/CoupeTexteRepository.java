package com.hicham.annotationplatformproject1.repository;

import com.hicham.annotationplatformproject1.model.CoupeTexte;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CoupeTexteRepository extends JpaRepository<CoupeTexte, Long> {


    @Query("SELECT c FROM CoupeTexte c WHERE c.dataset.id = :datasetId AND c.assigned = false")
    List<CoupeTexte> findUnassignedByDatasetId(Long datasetId);


    long countByDatasetId(Long id);

    long countAssignedByDatasetId(Long id);

    Page<CoupeTexte> findByDatasetId(Long datasetId, Pageable pageable);

    @Query("SELECT c FROM CoupeTexte c WHERE c.dataset.id = :datasetId")
    List<CoupeTexte> findByDatasetId(Long datasetId);

}