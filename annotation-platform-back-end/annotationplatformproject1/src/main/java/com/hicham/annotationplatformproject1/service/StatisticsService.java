package com.hicham.annotationplatformproject1.service;

import com.hicham.annotationplatformproject1.dto.ApiResponse;
import com.hicham.annotationplatformproject1.dto.StatisticsDTO;
import com.hicham.annotationplatformproject1.model.*;
import com.hicham.annotationplatformproject1.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for calculating and retrieving statistical data, centralizing progress and metric calculations.
 */
@Service
public class StatisticsService {

    private final DatasetRepository datasetRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final AnnotationRepository annotationRepository;
    private final TacheRepository tacheRepository;
    private final ActivityLogRepository activityLogRepository;
    private final ActivityLogService activityLogService;
    private final CoupeTexteRepository coupeTexteRepository;

    public StatisticsService(DatasetRepository datasetRepository,
                             UtilisateurRepository utilisateurRepository,
                             AnnotationRepository annotationRepository,
                             TacheRepository tacheRepository,
                             ActivityLogRepository activityLogRepository,
                             ActivityLogService activityLogService,
                             CoupeTexteRepository coupeTexteRepository) {
        this.datasetRepository = datasetRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.annotationRepository = annotationRepository;
        this.tacheRepository = tacheRepository;
        this.activityLogRepository = activityLogRepository;
        this.activityLogService = activityLogService;
        this.coupeTexteRepository = coupeTexteRepository;
    }

    /**
     * Retrieves comprehensive statistics for the platform.
     *
     * @return ApiResponse with StatisticsDTO containing all stats.
     */
    public ApiResponse<StatisticsDTO> getStatistics() {
        try {
            StatisticsDTO stats = new StatisticsDTO(
                    getStats(),
                    getRecentActivities(),
                    getDatasetsProgress(),
                    getTopAnnotators(),
                    getAnnotationTrend()
            );
            activityLogService.logActivity("STATISTICS_RETRIEVED", "Statistics data retrieved successfully");
            return ApiResponse.success("Statistics retrieved successfully", stats);
        } catch (Exception e) {
            activityLogService.logActivity("STATISTICS_ERROR", "Failed to retrieve statistics: " + e.getMessage());
            return ApiResponse.error("Failed to retrieve statistics: " + e.getMessage());
        }
    }

    /**
     * Calculates the progress percentage for a dataset.
     *
     * @param datasetId The ID of the dataset.
     * @return Progress as a percentage (0.0 to 100.0).
     */
    public double calculateDatasetProgress(Long datasetId) {
        long totalTasks = tacheRepository.countByDatasetId(datasetId);
        long completedTasks = tacheRepository.countByDatasetIdAndStatut(datasetId, Tache.StatutTache.TERMINEE);
        return totalTasks > 0 ? Math.min((completedTasks * 100.0 / totalTasks), 100.0) : 0.0;
    }

    /**
     * Counts annotated and not annotated text pairs in a dataset.
     *
     * @param datasetId The ID of the dataset.
     * @return Map with "annotated" and "notAnnotated" counts.
     */
    public Map<String, Long> countAnnotatedTextPairs(Long datasetId) {
        long totalCoupeTextes = coupeTexteRepository.countByDatasetId(datasetId);
        List<Long> coupeTexteIds = coupeTexteRepository.findByDatasetId(datasetId)
                .stream()
                .map(CoupeTexte::getId)
                .toList();
        long annotatedCount = coupeTexteIds.isEmpty() ? 0 :
                annotationRepository.countByCoupeTexteIdIn(coupeTexteIds);
        return Map.of(
                "annotated", annotatedCount,
                "notAnnotated", totalCoupeTextes - annotatedCount
        );
    }

    /**
     * Calculates the overall completion rate across all tasks.
     *
     * @return Completion rate as a percentage.
     */
    public double calculateCompletionRate() {
        long totalTasks = tacheRepository.count();
        long completedTasks = tacheRepository.countByStatut(Tache.StatutTache.TERMINEE);
        return totalTasks > 0 ? (completedTasks * 100.0 / totalTasks) : 0.0;
    }

    /**
     * Retrieves general statistics (datasets, annotators, annotations, completion).
     *
     * @return List of StatItem objects.
     */
    private List<StatisticsDTO.StatItem> getStats() {
        List<StatisticsDTO.StatItem> stats = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime yesterday = now.minusDays(1);

        // Total Datasets
        long totalDatasets = datasetRepository.count();
        long datasetsYesterday = datasetRepository.countByCreatedAtBefore(yesterday);
        stats.add(new StatisticsDTO.StatItem(
                "Total Datasets",
                String.valueOf(totalDatasets),
                calculatePercentageChange(datasetsYesterday, totalDatasets),
                "database"
        ));

        // Active Annotators
        long activeAnnotators = utilisateurRepository.countByRoleAndActive(Utilisateur.Role.ANNOTATOR, true);
        long activeAnnotatorsYesterday = utilisateurRepository.countByRoleAndActiveAndCreatedAtBefore(
                Utilisateur.Role.ANNOTATOR, true, yesterday);
        stats.add(new StatisticsDTO.StatItem(
                "Active Annotators",
                String.valueOf(activeAnnotators),
                calculateAbsoluteChange(activeAnnotatorsYesterday, activeAnnotators),
                "users"
        ));

        // Annotations Today
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime startOfYesterday = LocalDate.now().minusDays(1).atStartOfDay();
        LocalDateTime endOfYesterday = startOfYesterday.plusDays(1).minusSeconds(1);
        long annotationsToday = annotationRepository.countByAnnotateAtAfter(startOfToday);
        long annotationsYesterday = annotationRepository.countByAnnotateAtBetween(startOfYesterday, endOfYesterday);
        stats.add(new StatisticsDTO.StatItem(
                "Annotations Today",
                String.valueOf(annotationsToday),
                calculatePercentageChange(annotationsYesterday, annotationsToday),
                "check-circle"
        ));

        // Completion Rate
        double completionRate = calculateCompletionRate();
        long totalTasksYesterday = tacheRepository.countByDateCreationBefore(yesterday);
        long completedTasksYesterday = tacheRepository.countByStatutAndDateCreationBefore(
                Tache.StatutTache.TERMINEE, yesterday);
        double completionRateYesterday = totalTasksYesterday > 0 ? (completedTasksYesterday * 100.0 / totalTasksYesterday) : 0.0;
        stats.add(new StatisticsDTO.StatItem(
                "Completion Rate",
                String.format("%.0f%%", completionRate),
                calculatePercentagePointChange(completionRateYesterday, completionRate),
                "trending-up"
        ));

        return stats;
    }

    /**
     * Retrieves the 5 most recent activities.
     *
     * @return List of ActivityItem objects.
     */
    private List<StatisticsDTO.ActivityItem> getRecentActivities() {
        return activityLogRepository.findTop5ByOrderByTimestampDesc()
                .stream()
                .map(log -> new StatisticsDTO.ActivityItem(
                        log.getDescription(),
                        getRelativeTime(log.getTimestamp()),
                        getActivityType(log.getAction())
                ))
                .toList();
    }

    /**
     * Retrieves progress for all datasets.
     *
     * @return List of DatasetProgress objects.
     */
    private List<StatisticsDTO.DatasetProgress> getDatasetsProgress() {
        return datasetRepository.findAll()
                .stream()
                .map(dataset -> {
                    long completed = tacheRepository.countByDatasetIdAndStatut(dataset.getId(), Tache.StatutTache.TERMINEE);
                    long pending = tacheRepository.countByDatasetIdAndStatutIn(
                            dataset.getId(), List.of(Tache.StatutTache.EN_ATTENTE, Tache.StatutTache.EN_COURS));
                    return new StatisticsDTO.DatasetProgress(dataset.getName(), (int) completed, (int) pending);
                })
                .toList();
    }

    /**
     * Retrieves the top 5 annotators by completion rate.
     *
     * @return List of TopAnnotator objects.
     */
    private List<StatisticsDTO.TopAnnotator> getTopAnnotators() {
        return utilisateurRepository.findByRole(Utilisateur.Role.ANNOTATOR)
                .stream()
                .map(annotator -> {
                    long totalTasks = tacheRepository.countByAnnotateurId(annotator.getId());
                    long completedTasks = tacheRepository.countByAnnotateurIdAndStatut(
                            annotator.getId(), Tache.StatutTache.TERMINEE);
                    int completion = totalTasks > 0 ? (int) (completedTasks * 100 / totalTasks) : 0;
                    return new StatisticsDTO.TopAnnotator(annotator.getPrenom() + " " + annotator.getNom(), completion);
                })
                .sorted((a, b) -> Integer.compare(b.getCompletion(), a.getCompletion()))
                .limit(5)
                .toList();
    }

    /**
     * Retrieves annotation trend for the past 7 days.
     *
     * @return List of AnnotationTrend objects.
     */
    private List<StatisticsDTO.AnnotationTrend> getAnnotationTrend() {
        LocalDateTime startOfPeriod = LocalDate.now().minusDays(6).atStartOfDay();
        LocalDateTime endOfPeriod = LocalDateTime.now();
        Map<String, Long> countMap = annotationRepository.countAnnotationsByDay(startOfPeriod, endOfPeriod)
                .stream()
                .collect(Collectors.toMap(row -> row[0].toString(), row -> (Long) row[1]));

        List<StatisticsDTO.AnnotationTrend> trend = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate date = LocalDate.now().minusDays(6 - i);
            String dateStr = date.toString();
            trend.add(new StatisticsDTO.AnnotationTrend(dateStr, countMap.getOrDefault(dateStr, 0L)));
        }
        return trend;
    }

    /**
     * Formats a timestamp as a relative time string.
     *
     * @param timestamp The timestamp to format.
     * @return Relative time string (e.g., "2 hours ago").
     */
    private String getRelativeTime(LocalDateTime timestamp) {
        long minutes = ChronoUnit.MINUTES.between(timestamp, LocalDateTime.now());
        return switch ((int) minutes) {
            case 0 -> "Just now";
            case 1 -> "1 minute ago";
            default -> {
                if (minutes < 60) yield minutes + " minutes ago";
                long hours = ChronoUnit.HOURS.between(timestamp, LocalDateTime.now());
                if (hours < 24) yield hours + " hours ago";
                yield ChronoUnit.DAYS.between(timestamp, LocalDateTime.now()) + " days ago";
            }
        };
    }

    /**
     * Determines the activity type for UI display.
     *
     * @param action The activity action.
     * @return Type as "success", "info", or "error".
     */
    private String getActivityType(String action) {
        return switch (action) {
            case "DATASET_CREATED", "TASKS_ASSIGNED" -> "success";
            case "USER_CREATED", "ANNOTATION_CREATED" -> "info";
            case "DATASET_ERROR", "TASK_ASSIGNMENT_ERROR", "ANNOTATOR_FETCH_ERROR",
                 "USER_CREATION_ERROR", "ANNOTATION_ERROR" -> "error";
            default -> "info";
        };
    }

    /**
     * Calculates percentage change between two values.
     *
     * @param previous Previous value.
     * @param current  Current value.
     * @return Formatted percentage change string.
     */
    private String calculatePercentageChange(long previous, long current) {
        if (previous == 0) return current > 0 ? "+100%" : "N/A";
        double change = ((current - previous) * 100.0) / previous;
        return String.format("%+.1f%%", change);
    }

    /**
     * Calculates absolute change between two values.
     *
     * @param previous Previous value.
     * @param current  Current value.
     * @return Formatted absolute change string.
     */
    private String calculateAbsoluteChange(long previous, long current) {
        long change = current - previous;
        return change >= 0 ? "+" + change : String.valueOf(change);
    }

    /**
     * Calculates percentage point change between two percentages.
     *
     * @param previous Previous percentage.
     * @param current  Current percentage.
     * @return Formatted percentage point change string.
     */
    private String calculatePercentagePointChange(double previous, double current) {
        double change = current - previous;
        return String.format("%+.1f%%", change);
    }
}