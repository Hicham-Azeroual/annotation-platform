package com.hicham.annotationplatformproject1.service;

import com.hicham.annotationplatformproject1.dto.ApiResponse;
import com.hicham.annotationplatformproject1.dto.AnnotationRequest;
import com.hicham.annotationplatformproject1.dto.DatasetTaskSummaryDTO;
import com.hicham.annotationplatformproject1.dto.TaskGroupDTO;
import com.hicham.annotationplatformproject1.exception.ServiceException;
import com.hicham.annotationplatformproject1.model.*;
import com.hicham.annotationplatformproject1.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for managing tasks (Tache) and their annotations.
 */
@Service
public class TacheService {

    private final TacheRepository tacheRepository;
    private final CoupeTexteRepository coupeTexteRepository;
    private final AnnotationRepository annotationRepository;
    private final DatasetRepository datasetRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ActivityLogService activityLogService;
    private final UserDatasetProgressRepository userDatasetProgressRepository;
    private final AnnotationService annotationService;
    private final ValidationService validationService;
    private final StatisticsService statisticsService;

    public TacheService(TacheRepository tacheRepository,
                        CoupeTexteRepository coupeTexteRepository,
                        AnnotationRepository annotationRepository,
                        DatasetRepository datasetRepository,
                        UtilisateurRepository utilisateurRepository,
                        ActivityLogService activityLogService,
                        UserDatasetProgressRepository userDatasetProgressRepository,
                        AnnotationService annotationService,
                        ValidationService validationService,
                        StatisticsService statisticsService) {
        this.tacheRepository = tacheRepository;
        this.coupeTexteRepository = coupeTexteRepository;
        this.annotationRepository = annotationRepository;
        this.datasetRepository = datasetRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.activityLogService = activityLogService;
        this.userDatasetProgressRepository = userDatasetProgressRepository;
        this.annotationService = annotationService;
        this.validationService = validationService;
        this.statisticsService = statisticsService;
    }

    /**
     * Retrieves tasks for an annotator and dataset, with pagination.
     */
    public ApiResponse<TaskGroupDTO> getTasksByAnnotator(Long annotatorId, Long datasetId, Integer page) {
        try {
            validationService.validateAnnotator(annotatorId);
            Dataset dataset = validationService.validateDataset(datasetId);

            int pageToFetch = page != null ? page : getLastPage(annotatorId, datasetId);
            Pageable pageable = PageRequest.of(pageToFetch, 1);
            Page<Tache> taskPage = tacheRepository.findByAnnotateurIdAndDatasetId(annotatorId, datasetId, pageable);

            if (taskPage.isEmpty()) {
                activityLogService.logActivity(
                        "TASKS_RETRIEVED",
                        "No tasks found for annotator ID: " + annotatorId + " and dataset ID: " + datasetId
                );
                return ApiResponse.error("No tasks found for annotator and dataset");
            }

            Tache task = taskPage.getContent().get(0);
            List<TaskGroupDTO.TaskDetailDTO> taskDetails = buildTaskDetails(task, annotatorId);

            TaskGroupDTO taskGroup = new TaskGroupDTO(
                    task.getId(),
                    datasetId,
                    dataset.getName(),
                    taskDetails,
                    statisticsService.calculateDatasetProgress(datasetId),
                    pageToFetch,
                    taskPage.getTotalPages(),
                    taskPage.getTotalElements(),
                    dataset.getClasses().stream()
                            .map(cls -> new TaskGroupDTO.ClassDTO(cls.getId(), cls.getNomClasse()))
                            .toList()
            );

            updateLastPage(annotatorId, datasetId, pageToFetch);
            activityLogService.logActivity(
                    "TASK_RETRIEVED",
                    "Retrieved task for annotator ID: " + annotatorId + ", dataset ID: " + datasetId + ", page: " + pageToFetch
            );
            return ApiResponse.success("Task retrieved successfully", taskGroup);
        } catch (ServiceException e) {
            activityLogService.logActivity("TASKS_FETCH_ERROR", e.getMessage());
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            activityLogService.logActivity(
                    "TASKS_FETCH_ERROR",
                    "Failed to retrieve task for annotator ID " + annotatorId + ", dataset ID: " + datasetId + ": " + e.getMessage()
            );
            return ApiResponse.error("Failed to retrieve task: " + e.getMessage());
        }
    }

    /**
     * Builds task details for a single task.
     */
    private List<TaskGroupDTO.TaskDetailDTO> buildTaskDetails(Tache task, Long annotatorId) {
        CoupeTexte coupeTexte = task.getCoupeTexte();
        if (coupeTexte == null) return Collections.emptyList();

        Annotation annotation = annotationRepository.findByCoupeTexteIdAndAnnotateurId(coupeTexte.getId(), annotatorId);
        TaskGroupDTO.TaskDetailDTO detail = new TaskGroupDTO.TaskDetailDTO();
        detail.setCoupeTexteId(coupeTexte.getId());
        detail.setText1(coupeTexte.getText1());
        detail.setText2(coupeTexte.getText2());
        detail.setStatus(String.valueOf(task.getStatut()));
        detail.setDateCreation(task.getDateCreation());
        detail.setDateFin(task.getDateFin());
        detail.setAssignedClass(annotation != null ? annotation.getClasseChoisie().getNomClasse() : null);
        return List.of(detail);
    }

    /**
     * Saves an annotation for a task.
     */
    public ApiResponse<String> saveAnnotation(Long annotatorId, Long coupeTexteId, Long classeChoisieId) {
        try {
            // Placeholder for durationInSeconds (to be provided by you)
            Long durationInSeconds = null; // Replace with your duration logic
            AnnotationRequest request = new AnnotationRequest(annotatorId, coupeTexteId, classeChoisieId);
            ApiResponse<String> response = annotationService.saveAnnotation(request);

            if (response.isSuccess()) {
                tacheRepository.findByCoupeTexteIdAndAnnotateurId(coupeTexteId, annotatorId)
                        .ifPresent(tache -> updateLastPage(annotatorId, tache.getDataset().getId(), getLastPage(annotatorId, tache.getDataset().getId())));
            }

            return response;
        } catch (Exception e) {
            activityLogService.logActivity(
                    "ANNOTATION_ERROR",
                    "Failed to save annotation for annotator ID " + annotatorId + ", coupeTexte ID: " + coupeTexteId + ": " + e.getMessage()
            );
            return ApiResponse.error("Failed to save annotation: " + e.getMessage());
        }
    }

    /**
     * Retrieves the last viewed page for an annotator and dataset.
     */
    private int getLastPage(Long userId, Long datasetId) {
        return userDatasetProgressRepository.findByUserIdAndDatasetId(userId, datasetId)
                .map(UserDatasetProgress::getLastPage)
                .orElse(0);
    }

    /**
     * Updates the last viewed page for an annotator and dataset.
     */
    private void updateLastPage(Long userId, Long datasetId, int page) {
        UserDatasetProgress progress = userDatasetProgressRepository.findByUserIdAndDatasetId(userId, datasetId)
                .orElseGet(() -> {
                    UserDatasetProgress newProgress = new UserDatasetProgress();
                    newProgress.setUser(utilisateurRepository.findById(userId).orElseThrow());
                    newProgress.setDatasetId(datasetId);
                    return newProgress;
                });
        progress.setLastPage(page);
        userDatasetProgressRepository.save(progress);
    }

    /**
     * Retrieves task summaries for an annotator across all datasets.
     */
    public ApiResponse<List<DatasetTaskSummaryDTO>> getTaskSummaryByAnnotator(Long annotatorId) {
        try {
            Utilisateur annotator = validationService.validateAnnotator(annotatorId);
            List<Tache> tasks = tacheRepository.findByAnnotateurId(annotatorId);
            if (tasks.isEmpty()) {
                activityLogService.logActivity(
                        "TASK_SUMMARY_RETRIEVED",
                        "No tasks found for annotator ID: " + annotatorId
                );
                return ApiResponse.success("No tasks found for annotator", List.of());
            }

            Map<Long, List<Tache>> tasksByDataset = tasks.stream()
                    .collect(Collectors.groupingBy(tache -> tache.getDataset().getId()));

            List<DatasetTaskSummaryDTO> summaries = tasksByDataset.entrySet().stream()
                    .map(entry -> buildDatasetSummary(entry.getKey(), entry.getValue(), annotatorId))
                    .toList();

            activityLogService.logActivity(
                    "TASK_SUMMARY_RETRIEVED",
                    "Retrieved " + summaries.size() + " dataset summaries for annotator ID: " + annotatorId
            );
            return ApiResponse.success("Task summaries retrieved successfully", summaries);
        } catch (ServiceException e) {
            activityLogService.logActivity("TASK_SUMMARY_FETCH_ERROR", e.getMessage());
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            activityLogService.logActivity(
                    "TASK_SUMMARY_FETCH_ERROR",
                    "Failed to retrieve task summaries for annotator ID " + annotatorId + ": " + e.getMessage()
            );
            return ApiResponse.error("Failed to retrieve task summaries: " + e.getMessage());
        }
    }

    /**
     * Builds a dataset summary for a set of tasks.
     */
    private DatasetTaskSummaryDTO buildDatasetSummary(Long datasetId, List<Tache> tasks, Long annotatorId) {
        Dataset dataset = validationService.validateDataset(datasetId);
        List<DatasetTaskSummaryDTO.TaskSummaryDTO> taskSummaries = tasks.stream()
                .map(task -> new DatasetTaskSummaryDTO.TaskSummaryDTO(task.getId()))
                .toList();

        List<Long> coupeTexteIds = tasks.stream()
                .map(Tache::getCoupeTexte)
                .filter(Objects::nonNull)
                .map(CoupeTexte::getId)
                .distinct()
                .toList();

        long totalCoupeTextes = coupeTexteIds.size();
        long annotatedCount = coupeTexteIds.isEmpty() ? 0 :
                annotationRepository.countByCoupeTexteIdInAndAnnotateurId(coupeTexteIds, annotatorId);

        return new DatasetTaskSummaryDTO(
                datasetId,
                dataset.getName(),
                dataset.getDescription() != null ? dataset.getDescription() : "No description",
                taskSummaries,
                totalCoupeTextes,
                annotatedCount + "/" + totalCoupeTextes
        );
    }
}