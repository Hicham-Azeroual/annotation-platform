package com.hicham.annotationplatformproject1.repository;

import com.hicham.annotationplatformproject1.model.Annotation;
import com.hicham.annotationplatformproject1.model.ClassePersistante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AnnotationRepository extends JpaRepository<Annotation, Long> {
    boolean existsByCoupeTexteIdAndAnnotateurId(Long coupeTexteId, Long annotateurId);

    long countByAnnotateAtAfter(LocalDateTime dateTime);



    // Count annotations within a time range
    @Query("SELECT COUNT(a) FROM Annotation a WHERE a.annotateAt BETWEEN :start AND :end")
    long countByAnnotateAtBetween(LocalDateTime start, LocalDateTime end);


    @Query("SELECT FUNCTION('DATE', a.annotateAt) as date, COUNT(a) as count " +
            "FROM Annotation a " +
            "WHERE a.annotateAt >= :start AND a.annotateAt < :end " +
            "GROUP BY FUNCTION('DATE', a.annotateAt)")
    List<Object[]> countAnnotationsByDay(LocalDateTime start, LocalDateTime end);

    List<Annotation> findByCoupeTexteIdIn(List<Long> coupeTexteIds);

    @Query("SELECT COUNT(a) FROM Annotation a WHERE a.coupeTexte.id IN :coupeTexteIds")
    long countByCoupeTexteIdIn(List<Long> coupeTexteIds);

    boolean existsByCoupeTexteId(Long id);

    long countByCoupeTexteIdInAndAnnotateurId(List<Long> coupeTexteIds, Long annotatorId);

    Annotation findByCoupeTexteIdAndAnnotateurId(Long id, Long annotatorId);

    Optional<ClassePersistante> findClassePersistanteById(Long classeChoisieId);
}