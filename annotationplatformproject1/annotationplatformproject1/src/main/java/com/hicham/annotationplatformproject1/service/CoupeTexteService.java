package com.hicham.annotationplatformproject1.service;

import com.hicham.annotationplatformproject1.dto.*;
import com.hicham.annotationplatformproject1.model.*;
import com.hicham.annotationplatformproject1.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CoupeTexteService {

    private final CoupeTexteRepository coupeTexteRepository;
    private final AnnotationRepository annotationRepository;
    private final DatasetRepository datasetRepository;
    private final ActivityLogService activityLogService;
    private final TacheRepository tacheRepository;
    private final UtilisateurRepository utilisateurRepository;

    public CoupeTexteService(CoupeTexteRepository coupeTexteRepository,
                             AnnotationRepository annotationRepository,
                             DatasetRepository datasetRepository,
                             ActivityLogService activityLogService,
                             TacheRepository tacheRepository,
                             UtilisateurRepository utilisateurRepository) {
        this.coupeTexteRepository = coupeTexteRepository;
        this.annotationRepository = annotationRepository;
        this.datasetRepository = datasetRepository;
        this.activityLogService = activityLogService;
        this.tacheRepository = tacheRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    public ApiResponse<ResponseDetailsOfDatasetsDTO> getCoupeTextesByDatasetId(Long datasetId, int page, int size) {
        try {
            // Validate dataset existence
            Optional<Dataset> datasetOptional = datasetRepository.findById(datasetId);
            if (datasetOptional.isEmpty()) {
                activityLogService.logActivity(
                        "COUPE_TEXTES_FETCH_ERROR",
                        "Dataset not found with ID: " + datasetId
                );
                return ApiResponse.error("Dataset not found with ID: " + datasetId);
            }

            // Create Pageable object for pagination
            Pageable pageable = PageRequest.of(page, size);
            Page<CoupeTexte> coupeTextePage = coupeTexteRepository.findByDatasetId(datasetId, pageable);

            // Fetch all annotations for the couple texts in this page
            List<Long> coupeTexteIds = coupeTextePage.getContent().stream()
                    .map(CoupeTexte::getId)
                    .collect(Collectors.toList());
            List<Annotation> annotations = annotationRepository.findByCoupeTexteIdIn(coupeTexteIds);
            Map<Long, Annotation> annotationMap = annotations.stream()
                    .collect(Collectors.toMap(a -> a.getCoupeTexte().getId(), a -> a));

            // Map to CoupeTexteDTO with annotation details
            List<CoupeTexteDTO> coupeTextes = coupeTextePage.getContent().stream()
                    .map(coupeTexte -> {
                        Annotation annotation = annotationMap.get(coupeTexte.getId());
                        return new CoupeTexteDTO(
                                coupeTexte.getId(),
                                coupeTexte.getText1(),
                                coupeTexte.getText2(),
                                annotation != null ? annotation.getAnnotateAt() : null,
                                annotation != null ? annotation.getClasseChoisie().getNomClasse() : null
                        );
                    })
                    .collect(Collectors.toList());

            // Determine if the dataset has any annotations on this page
            boolean hasAnnotations = !annotations.isEmpty();
            AnnotationDetailsDTO annotationDetails = null;
            if (hasAnnotations) {
                Annotation firstAnnotation = annotations.get(0);
                annotationDetails = new AnnotationDetailsDTO(
                        firstAnnotation.getId(),
                        firstAnnotation.getAnnotateur().getId(),
                        firstAnnotation.getAnnotateur().getUsername(),
                        firstAnnotation.getClasseChoisie().getId(),
                        firstAnnotation.getClasseChoisie().getNomClasse(),
                        firstAnnotation.getAnnotateAt()
                );
            }

            // Fetch annotators assigned to this dataset
            List<Long> annotatorIds = tacheRepository.findDistinctAnnotateurIdsByDatasetId(datasetId);
            List<ResponseDetailsOfDatasetsDTO.AnnotatorDetailsDTO> annotators = utilisateurRepository.findAllById(annotatorIds).stream()
                    .map(annotator -> new ResponseDetailsOfDatasetsDTO.AnnotatorDetailsDTO(
                            annotator.getId(),
                            annotator.getPrenom(),
                            annotator.getNom(),
                            annotator.getUsername(),
                            annotator.getEmail(),
                            annotator.isActive(),
                            (int) tacheRepository.countByAnnotateurId(annotator.getId()),
                            true // canUnassign flag (can be adjusted based on business logic)
                    ))
                    .collect(Collectors.toList());

            // Build response
            ResponseDetailsOfDatasetsDTO responseDTO = new ResponseDetailsOfDatasetsDTO(
                    coupeTextes,
                    hasAnnotations,
                    annotationDetails,
                    coupeTextePage.getTotalElements(),
                    coupeTextePage.getTotalPages(),
                    coupeTextePage.getNumber(),
                    coupeTextePage.getSize(),
                    annotators
            );

            activityLogService.logActivity(
                    "COUPE_TEXTES_RETRIEVED",
                    "Retrieved " + coupeTextes.size() + " couple texts for dataset ID: " + datasetId +
                            " (page " + page + ", size " + size + ")"
            );

            return ApiResponse.success("Couple texts retrieved successfully", responseDTO);

        } catch (Exception e) {
            activityLogService.logActivity(
                    "COUPE_TEXTES_FETCH_ERROR",
                    "Failed to retrieve couple texts for dataset ID " + datasetId + ": " + e.getMessage()
            );
            return ApiResponse.error("Failed to retrieve couple texts: " + e.getMessage());
        }
    }
}