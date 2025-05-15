package com.hicham.annotationplatformproject1.service;

import com.hicham.annotationplatformproject1.dto.ApiResponse;
import com.hicham.annotationplatformproject1.dto.AssignmentRequest;
import com.hicham.annotationplatformproject1.dto.UtilisateurDTO;
import com.hicham.annotationplatformproject1.model.*;
import com.hicham.annotationplatformproject1.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TaskAssignmentService {

    private final CoupeTexteRepository coupeTexteRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final TacheRepository tacheRepository;
    private final DatasetRepository datasetRepository;
    private final ActivityLogService activityLogService;
    private final AnnotationRepository annotationRepository;
    public TaskAssignmentService(CoupeTexteRepository coupeTexteRepository,
                                 UtilisateurRepository utilisateurRepository,
                                 TacheRepository tacheRepository,
                                 DatasetRepository datasetRepository,
                                 ActivityLogService activityLogService, AnnotationService annotationService, AnnotationRepository annotationRepository) {
        this.coupeTexteRepository = coupeTexteRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.tacheRepository = tacheRepository;
        this.datasetRepository = datasetRepository;
        this.activityLogService = activityLogService;
        this.annotationRepository = annotationRepository;
    }

    @Transactional
    public ApiResponse<String> assignTextPairs(Long datasetId, AssignmentRequest request) {
        try {
            Dataset dataset = datasetRepository.findById(datasetId)
                    .orElseThrow(() -> new RuntimeException("Dataset not found"));

            List<Utilisateur> annotateurs = utilisateurRepository.findAllById(request.getAnnotatorIds())
                    .stream()
                    .filter(u -> u.getRole() == Utilisateur.Role.ANNOTATOR)
                    .collect(Collectors.toList());

            if (annotateurs.isEmpty()) {
                return ApiResponse.error("No valid annotators found");
            }

            List<CoupeTexte> unassignedTextPairs = coupeTexteRepository.findUnassignedByDatasetId(datasetId);

            if (unassignedTextPairs.isEmpty()) {
                return ApiResponse.error("No unassigned text pairs available");
            }

            Collections.shuffle(unassignedTextPairs);

            int pairsPerAnnotator = unassignedTextPairs.size() / annotateurs.size();
            int remainingPairs = unassignedTextPairs.size() % annotateurs.size();

            int startIndex = 0;
            for (int i = 0; i < annotateurs.size(); i++) {
                int endIndex = startIndex + pairsPerAnnotator + (i < remainingPairs ? 1 : 0);

                if (startIndex >= unassignedTextPairs.size()) break;

                List<CoupeTexte> assignedPairs = unassignedTextPairs.subList(
                        startIndex,
                        Math.min(endIndex, unassignedTextPairs.size())
                );

                for (CoupeTexte pair : assignedPairs) {
                    Tache tache = new Tache();
                    tache.setDataset(dataset);
                    tache.setAnnotateur(annotateurs.get(i));
                    tache.setCoupeTexte(pair);
                    tache.setStatut(Tache.StatutTache.EN_ATTENTE);
                    tache.setDateCreation(LocalDateTime.now());

                    // Set deadline: use request deadline if provided, otherwise default to 7 days from now
                    LocalDateTime deadline = request.getDeadline() != null
                            ? request.getDeadline()
                            : LocalDateTime.now().plusDays(7); // Default: 7 days from May 13, 2025
                    tache.setDateFin(deadline);

                    tacheRepository.save(tache);

                    pair.setAssigned(true);
                    coupeTexteRepository.save(pair);
                }

                startIndex = endIndex;
            }

            activityLogService.logActivity(
                    "TASKS_ASSIGNED",
                    "Assigned " + unassignedTextPairs.size() + " text pairs (each with text1 and text2) to " +
                            annotateurs.size() + " annotators for dataset: " + datasetId +
                            " with deadline: " + (request.getDeadline() != null ? request.getDeadline() : LocalDateTime.now().plusDays(7))
            );

            return ApiResponse.success("Text pairs assigned successfully", null);
        } catch (Exception e) {
            activityLogService.logActivity(
                    "TASK_ASSIGNMENT_ERROR",
                    "Failed to assign tasks: " + e.getMessage()
            );
            return ApiResponse.error("Assignment failed: " + e.getMessage());
        }
    }

    public ApiResponse<List<UtilisateurDTO>> getAvailableAnnotators(Long datasetId) {
        try {
            List<Utilisateur> allAnnotators = utilisateurRepository.findByRole(Utilisateur.Role.ANNOTATOR);

            List<UtilisateurDTO> availableAnnotators = allAnnotators.stream()
                    .filter(annotator -> !hasTasksForDataset(annotator.getId(), datasetId))
                    .map(annotator -> new UtilisateurDTO(
                            annotator.getId(),
                            annotator.getNom(),
                            annotator.getPrenom(),
                            annotator.getUsername(),
                            annotator.getEmail(),
                            annotator.isActive(),
                            annotator.getRole().name(),
                            tacheRepository.countByAnnotateurId(annotator.getId())
                    ))
                    .collect(Collectors.toList());

            activityLogService.logActivity(
                    "AVAILABLE_ANNOTATORS_RETRIEVED",
                    "Retrieved " + availableAnnotators.size() + " available annotators for dataset ID: " + datasetId
            );

            return ApiResponse.success("Available annotators retrieved", availableAnnotators);
        } catch (Exception e) {
            activityLogService.logActivity(
                    "ANNOTATOR_FETCH_ERROR",
                    "Failed to get available annotators: " + e.getMessage()
            );
            return ApiResponse.error("Failed to get available annotators: " + e.getMessage());
        }
    }

    private boolean hasTasksForDataset(Long annotatorId, Long datasetId) {
        return tacheRepository.existsByAnnotateurIdAndDatasetId(annotatorId, datasetId);
    }



    @Transactional
    public ApiResponse<String> unassignAnnotatorFromDataset(Long datasetId, Long annotatorId) {
        try {
            // Validate dataset existence
            Dataset dataset = datasetRepository.findById(datasetId)
                    .orElseThrow(() -> new RuntimeException("Dataset not found"));

            // Validate annotator existence
            Utilisateur annotator = utilisateurRepository.findById(annotatorId)
                    .filter(u -> u.getRole() == Utilisateur.Role.ANNOTATOR)
                    .orElseThrow(() -> new RuntimeException("Annotator not found"));

            // Fetch all tasks for this annotator and dataset
            List<Tache> tasks = tacheRepository.findByDatasetIdAndAnnotateurId(datasetId, annotatorId);
            if (tasks.isEmpty()) {
                return ApiResponse.error("No tasks found for this annotator in the dataset");
            }

            // Filter tasks that are not completed (i.e., not TERMINE)
            List<Tache> tasksToUnassign = tasks.stream()
                    .filter(task -> task.getStatut() != Tache.StatutTache.TERMINEE)
                    .collect(Collectors.toList());

            if (tasksToUnassign.isEmpty()) {
                return ApiResponse.success("No uncompleted tasks to unassign for this annotator in the dataset", null);
            }

            // Unassign the annotator from non-completed tasks
            for (Tache task : tasksToUnassign) {
                task.setAnnotateur(null); // Remove annotator assignment
                task.setStatut(Tache.StatutTache.EN_ATTENTE); // Reset to unassigned state
                task.setDateFin(null); // Clear deadline if any
                tacheRepository.save(task);

                // Update the associated CoupeTexte
                CoupeTexte coupeTexte = task.getCoupeTexte();
                if (coupeTexte != null) {
                    // Only set assigned to false if there are no completed annotations
                    boolean hasAnnotation = annotationRepository.existsByCoupeTexteId(coupeTexte.getId());
                    if (!hasAnnotation) {
                        coupeTexte.setAssigned(false);
                        coupeTexteRepository.save(coupeTexte);
                    }
                }
            }

            activityLogService.logActivity(
                    "ANNOTATOR_UNASSIGNED",
                    "Unassigned annotator ID " + annotatorId + " from dataset ID " + datasetId +
                            ". Unassigned " + tasksToUnassign.size() + " tasks."
            );

            return ApiResponse.success("Annotator unassigned successfully from uncompleted tasks in dataset", null);

        } catch (Exception e) {
            activityLogService.logActivity(
                    "ANNOTATOR_UNASSIGN_ERROR",
                    "Failed to unassign annotator: " + e.getMessage()
            );
            return ApiResponse.error("Failed to unassign annotator: " + e.getMessage());
        }
    }

}