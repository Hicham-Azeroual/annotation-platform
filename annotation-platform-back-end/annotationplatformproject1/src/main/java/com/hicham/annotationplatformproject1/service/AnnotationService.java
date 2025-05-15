package com.hicham.annotationplatformproject1.service;

import com.hicham.annotationplatformproject1.dto.ApiResponse;
import com.hicham.annotationplatformproject1.dto.AnnotationRequest;
import com.hicham.annotationplatformproject1.model.*;
import com.hicham.annotationplatformproject1.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AnnotationService {

    private final AnnotationRepository annotationRepository;
    private final CoupeTexteRepository coupeTexteRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ClassePersistanteRepository classePersistanteRepository;
    private final TacheRepository tacheRepository;
    private final ActivityLogService activityLogService;

    public AnnotationService(AnnotationRepository annotationRepository,
                             CoupeTexteRepository coupeTexteRepository,
                             UtilisateurRepository utilisateurRepository,
                             ClassePersistanteRepository classePersistanteRepository,
                             TacheRepository tacheRepository,
                             ActivityLogService activityLogService) {
        this.annotationRepository = annotationRepository;
        this.coupeTexteRepository = coupeTexteRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.classePersistanteRepository = classePersistanteRepository;
        this.tacheRepository = tacheRepository;
        this.activityLogService = activityLogService;
    }

    @Transactional
    public ApiResponse<String> saveAnnotation(AnnotationRequest request) {
        try {
            System.out.println("couple text id " + request.getCoupeTexteId());
            CoupeTexte coupeTexte = coupeTexteRepository.findById(request.getCoupeTexteId())
                    .orElseThrow(() -> new RuntimeException("CoupeTexte not found"));

            Utilisateur annotateur = utilisateurRepository.findById(request.getAnnotateurId())
                    .filter(u -> u.getRole() == Utilisateur.Role.ANNOTATOR)
                    .orElseThrow(() -> new RuntimeException("Annotator not found or invalid"));

            ClassePersistante classe = classePersistanteRepository.findById(request.getClasseChoisieId())
                    .orElseThrow(() -> new RuntimeException("Classe not found"));

            if (annotationRepository.existsByCoupeTexteIdAndAnnotateurId(request.getCoupeTexteId(), request.getAnnotateurId())) {
                return ApiResponse.error("This text pair has already been annotated by this user");
            }

            Annotation annotation = new Annotation();
            annotation.setCoupeTexte(coupeTexte);
            annotation.setAnnotateur(annotateur);
            annotation.setClasseChoisie(classe);
            annotation.setAnnotateAt(LocalDateTime.now());
            annotationRepository.save(annotation);

            tacheRepository.findByCoupeTexteIdAndAnnotateurId(request.getCoupeTexteId(), request.getAnnotateurId())
                    .ifPresent(tache -> {
                        tache.setStatut(Tache.StatutTache.TERMINEE);
                        tache.setDateFin(LocalDateTime.now());
                        tacheRepository.save(tache);
                    });

            activityLogService.logActivity(
                    "ANNOTATION_CREATED",
                    "Annotation created for text pair: " + request.getCoupeTexteId() +
                            " with class: " + classe.getNomClasse(),
                    annotateur
            );

            return ApiResponse.success("Annotation saved successfully", null);
        } catch (Exception e) {
            activityLogService.logActivity(
                    "ANNOTATION_ERROR",
                    "Failed to create annotation: " + e.getMessage()
            );
            return ApiResponse.error("Failed to save annotation: " + e.getMessage());
        }
    }
}