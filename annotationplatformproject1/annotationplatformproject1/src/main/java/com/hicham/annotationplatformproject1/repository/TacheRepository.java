package com.hicham.annotationplatformproject1.repository;

import com.hicham.annotationplatformproject1.model.Tache;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TacheRepository extends JpaRepository<Tache, Long> {
    boolean existsByAnnotateurIdAndDatasetId(Long annotatorId, Long datasetId);

    Optional<Tache> findByCoupeTexteIdAndAnnotateurId(Long coupeTexteId, Long annotateurId);

    long countByStatut(Tache.StatutTache statut);

    long countByDatasetIdAndStatut(Long datasetId, Tache.StatutTache statut);

    long countByDatasetIdAndStatutIn(Long datasetId, List<Tache.StatutTache> statuts);

    long countByAnnotateurId(Long annotatorId);

    long countByAnnotateurIdAndStatut(Long annotatorId, Tache.StatutTache statut);

    @Query("SELECT COUNT(t) FROM Tache t WHERE t.dateCreation < :time")
    long countByDateCreationBefore(LocalDateTime time);

    // Count completed tasks before a specific time
    @Query("SELECT COUNT(t) FROM Tache t WHERE t.statut = :statut AND t.dateCreation < :time")
    long countByStatutAndDateCreationBefore(Tache.StatutTache statut, LocalDateTime time);


    long countByDatasetId(Long datasetId);
    @Query("SELECT DISTINCT t.dataset.id FROM Tache t")
    List<Long> findAllDatasetIdsWithTasks();

    // Updated method to return distinct annotator IDs
    @Query("SELECT DISTINCT t.annotateur.id FROM Tache t WHERE t.dataset.id = :datasetId")
    List<Long> findDistinctAnnotateurIdsByDatasetId(@Param("datasetId") Long datasetId);

    List<Tache> findByDatasetIdAndAnnotateurId(Long datasetId, Long annotatorId);

    List<Tache> findByAnnotateurId(Long annotatorId);

    Page<Tache> findByAnnotateurIdAndDatasetId(Long annotatorId, Long datasetId, Pageable pageable);
}