package com.hicham.annotationplatformproject1.service;

import com.hicham.annotationplatformproject1.dto.ApiResponse;
import com.hicham.annotationplatformproject1.dto.DatasetDTO;
import com.hicham.annotationplatformproject1.dto.DatasetDetailsDTO;
import com.hicham.annotationplatformproject1.dto.DatasetsResponseDTO;
import com.hicham.annotationplatformproject1.model.*;
import com.hicham.annotationplatformproject1.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DatasetService {

    private final DatasetRepository datasetRepository;
    private final CoupeTexteRepository coupeTexteRepository;
    private final ClassPersistanteService classPersistanteService;
    private final ActivityLogService activityLogService;
    private final TacheRepository tacheRepository;
    private final AnnotationRepository annotationRepository;

    public DatasetService(DatasetRepository datasetRepository,
                          CoupeTexteRepository coupeTexteRepository,
                          ClassPersistanteService classPersistanteService,
                          ActivityLogService activityLogService,
                          TacheRepository tacheRepository,
                          AnnotationRepository annotationRepository) {
        this.datasetRepository = datasetRepository;
        this.coupeTexteRepository = coupeTexteRepository;
        this.classPersistanteService = classPersistanteService;
        this.activityLogService = activityLogService;
        this.tacheRepository = tacheRepository;
        this.annotationRepository = annotationRepository;
    }

    public ApiResponse<DatasetDTO> createDataset(String name, String description,
                                                 String classes, MultipartFile file) {
        try {
            if (name == null || name.trim().isEmpty()) {
                return ApiResponse.error("Dataset name cannot be empty");
            }
            if (file == null || file.isEmpty()) {
                return ApiResponse.error("File cannot be empty");
            }

            Dataset dataset = new Dataset();
            dataset.setName(name);
            dataset.setDescription(description);
            Dataset savedDataset = datasetRepository.save(dataset);

            List<CoupeTexte> textPairs = processFile(file, savedDataset);
            coupeTexteRepository.saveAll(textPairs);

            List<ClassePersistante> persistedClasses =
                    classPersistanteService.createClasses(classes, savedDataset);
            savedDataset.setClasses(persistedClasses);

            DatasetDTO datasetDTO = convertToDTO(savedDataset);

            activityLogService.logActivity(
                    "DATASET_CREATED",
                    "Dataset created: " + name + " with " + textPairs.size() + " text pairs"
            );

            return ApiResponse.success("Dataset created successfully", datasetDTO);

        } catch (Exception e) {
            activityLogService.logActivity(
                    "DATASET_ERROR",
                    "Failed to create dataset: " + e.getMessage()
            );
            return ApiResponse.error("Failed to create dataset: " + e.getMessage());
        }
    }

    private List<CoupeTexte> processFile(MultipartFile file, Dataset dataset) throws Exception {
        List<CoupeTexte> textPairs = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream()))) {

            reader.readLine(); // Skip header

            String line;
            while ((line = reader.readLine()) != null) {
                if (!line.trim().isEmpty()) {
                    String[] parts = line.split(",", -1); // Use -1 to include empty trailing fields
                    if (parts.length >= 2) { // Ensure at least two columns for text1 and text2
                        CoupeTexte ct = new CoupeTexte();
                        ct.setText1(parts[0].trim());
                        ct.setText2(parts[1].trim());
                        ct.setDataset(dataset);
                        ct.setAssigned(false);
                        textPairs.add(ct);
                    } else {
                        activityLogService.logActivity(
                                "FILE_PROCESSING_ERROR",
                                "Skipping invalid line in file for dataset " + dataset.getId() + ": " + line
                        );
                    }
                }
            }
        }
        return textPairs;
    }

    public ApiResponse<DatasetsResponseDTO> getAllDatasets(int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Dataset> datasetPage = datasetRepository.findAll(pageable);

            List<DatasetDTO> datasetDTOs = datasetPage.getContent()
                    .stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            // Calculate GLOBAL statistics (not just for the current page)
            long totalDatasets = datasetPage.getTotalElements();

            // Get all dataset IDs that have tasks
            List<Long> allDatasetIdsWithTasks = tacheRepository.findAllDatasetIdsWithTasks();

            // Calculate global counts
            long completedDatasets = allDatasetIdsWithTasks.stream()
                    .filter(datasetId -> {
                        long totalTasks = tacheRepository.countByDatasetId(datasetId);
                        long completedTasks = tacheRepository.countByDatasetIdAndStatut(datasetId, Tache.StatutTache.TERMINEE);
                        System.out.println("totalTasks for the dataset id: " + datasetId + " : " + totalTasks + ", completedTasks: " + completedTasks);
                        return totalTasks > 0 && completedTasks >= totalTasks - 1;
                    })
                    .count();

            System.out.println("completedDatasets: " + completedDatasets);
            long notCompletedDatasets = allDatasetIdsWithTasks.stream()
                    .filter(datasetId -> {
                        long totalTasks = tacheRepository.countByDatasetId(datasetId);
                        long completedTasks = tacheRepository.countByDatasetIdAndStatut(datasetId, Tache.StatutTache.TERMINEE);
                        return totalTasks > 0 && completedTasks < totalTasks - 1;
                    })
                    .count();

            long unassignedDatasets = totalDatasets - allDatasetIdsWithTasks.size();

            DatasetsResponseDTO responseDTO = new DatasetsResponseDTO(
                    datasetDTOs,
                    completedDatasets,
                    notCompletedDatasets,
                    unassignedDatasets,
                    datasetPage.getTotalElements(),
                    datasetPage.getTotalPages(),
                    datasetPage.getNumber(),
                    datasetPage.getSize()
            );

            activityLogService.logActivity(
                    "DATASETS_RETRIEVED",
                    "Retrieved " + datasetDTOs.size() + " datasets (page " + page + ", size " + size + ")"
            );

            return ApiResponse.success("Datasets retrieved successfully", responseDTO);
        } catch (Exception e) {
            activityLogService.logActivity(
                    "DATASET_FETCH_ERROR",
                    "Failed to retrieve datasets: " + e.getMessage()
            );
            return ApiResponse.error("Failed to retrieve datasets: " + e.getMessage());
        }
    }

    public ApiResponse<DatasetDTO> getDatasetById(Long id) {
        return datasetRepository.findById(id)
                .map(dataset -> {
                    DatasetDTO datasetDTO = convertToDTO(dataset);
                    activityLogService.logActivity(
                            "DATASET_RETRIEVED",
                            "Retrieved dataset ID: " + id + ", Name: " + dataset.getName()
                    );
                    return ApiResponse.success(
                            "Dataset retrieved successfully",
                            datasetDTO);
                })
                .orElseGet(() -> {
                    activityLogService.logActivity(
                            "DATASET_FETCH_ERROR",
                            "Failed to find dataset with ID: " + id
                    );
                    return ApiResponse.error("Dataset not found with ID: " + id);
                });
    }

    private DatasetDTO convertToDTO(Dataset dataset) {
        List<String> classNames = dataset.getClasses()
                .stream()
                .map(ClassePersistante::getNomClasse)
                .collect(Collectors.toList());

        // Calculate progress for the dataset
        double progress = calculateDatasetProgress(dataset.getId());

        return new DatasetDTO(
                dataset.getId(),
                dataset.getName(),
                dataset.getDescription(),
                classNames,
                progress
        );
    }

    public ApiResponse<DatasetDetailsDTO> getDatasetDetails(Long id) {
        return datasetRepository.findById(id)
                .map(dataset -> {
                    List<String> classNames = dataset.getClasses()
                            .stream()
                            .map(ClassePersistante::getNomClasse)
                            .collect(Collectors.toList());

                    double progress = calculateDatasetProgress(dataset.getId());

                    // Total number of CoupeTexte pairs in the dataset
                    long totalCoupeTextes = coupeTexteRepository.countByDatasetId(id);

                    // Get all CoupeTexte IDs for this dataset
                    List<Long> coupeTexteIds = coupeTexteRepository.findByDatasetId(id)
                            .stream()
                            .map(CoupeTexte::getId)
                            .collect(Collectors.toList());

                    // Count how many CoupeTexte pairs have annotations
                    long numberOfAnnotatedCoupeTextes = annotationRepository.countByCoupeTexteIdIn(coupeTexteIds);

                    // Calculate not annotated pairs
                    long numberOfNotAnnotatedCoupeTextes = totalCoupeTextes - numberOfAnnotatedCoupeTextes;

                    DatasetDetailsDTO detailsDTO = new DatasetDetailsDTO(
                            dataset.getId(),
                            dataset.getName(),
                            dataset.getDescription(),
                            classNames,
                            progress,
                            totalCoupeTextes,
                            numberOfAnnotatedCoupeTextes,
                            numberOfNotAnnotatedCoupeTextes
                    );

                    activityLogService.logActivity(
                            "DATASET_DETAILS_RETRIEVED",
                            "Retrieved details for dataset ID: " + id
                    );

                    return ApiResponse.success("Dataset details retrieved successfully", detailsDTO);
                })
                .orElseGet(() -> {
                    activityLogService.logActivity(
                            "DATASET_DETAILS_ERROR",
                            "Failed to find dataset with ID: " + id
                    );
                    return ApiResponse.error("Dataset not found with ID: " + id);
                });
    }

    private double calculateDatasetProgress(Long datasetId) {
        long totalTasks = tacheRepository.countByDatasetId(datasetId);
        long completedTasks = tacheRepository.countByDatasetIdAndStatut(datasetId, Tache.StatutTache.TERMINEE);
        return totalTasks > 0 ? (completedTasks >= totalTasks - 1 ? 100.0 : (completedTasks * 100.0 / totalTasks)) : 0.0;
    }



    public ApiResponse<byte[]> downloadDatasetAsCsv(Long datasetId) {
        try {
            // Verify dataset exists
            Optional<Dataset> datasetOptional = datasetRepository.findById(datasetId);
            if (datasetOptional.isEmpty()) {
                activityLogService.logActivity(
                        "DATASET_NOT_FOUND",
                        "Dataset not found with ID: " + datasetId
                );
                return ApiResponse.error("Dataset not found with ID: " + datasetId);
            }

            Dataset dataset = datasetOptional.get();

            // Fetch all CoupeTexte entries for the dataset
            List<CoupeTexte> coupeTextes = coupeTexteRepository.findByDatasetId(datasetId);
            if (coupeTextes.isEmpty()) {
                activityLogService.logActivity(
                        "DATASET_DOWNLOAD_ERROR",
                        "No text pairs found for dataset ID: " + datasetId
                );
                return ApiResponse.error("No text pairs found for dataset ID: " + datasetId);
            }

            // Fetch annotations for all CoupeTexte IDs
            List<Long> coupeTexteIds = coupeTextes.stream()
                    .map(CoupeTexte::getId)
                    .collect(Collectors.toList());
            List<Annotation> annotations = annotationRepository.findByCoupeTexteIdIn(coupeTexteIds);

            // Create a map of CoupeTexte ID to Annotation for quick lookup
            Map<Long, Annotation> annotationMap = annotations.stream()
                    .collect(Collectors.toMap(
                            annotation -> annotation.getCoupeTexte().getId(),
                            annotation -> annotation
                    ));

            // Build CSV content
            StringBuilder csvContent = new StringBuilder();
            // Add CSV header
            csvContent.append("text1,text2,annotation\n");

            // Add data rows
            for (CoupeTexte coupeTexte : coupeTextes) {
                String text1 = escapeCsvField(coupeTexte.getText1() != null ? coupeTexte.getText1() : "");
                String text2 = escapeCsvField(coupeTexte.getText2() != null ? coupeTexte.getText2() : "");
                Annotation annotation = annotationMap.get(coupeTexte.getId());
                String annotationValue = annotation != null && annotation.getClasseChoisie() != null
                        ? escapeCsvField(annotation.getClasseChoisie().getNomClasse())
                        : "N/A";

                csvContent.append(String.format("%s,%s,%s\n", text1, text2, annotationValue));
            }

            // Convert CSV content to byte array
            byte[] csvBytes = csvContent.toString().getBytes("UTF-8");

            activityLogService.logActivity(
                    "DATASET_DOWNLOADED",
                    "Dataset ID: " + datasetId + " downloaded as CSV with " + coupeTextes.size() + " text pairs"
            );

            return ApiResponse.success("Dataset downloaded successfully", csvBytes);

        } catch (Exception e) {
            activityLogService.logActivity(
                    "DATASET_DOWNLOAD_ERROR",
                    "Failed to download dataset ID: " + datasetId + " as CSV: " + e.getMessage()
            );
            return ApiResponse.error("Failed to download dataset as CSV: " + e.getMessage());
        }
    }

    private String escapeCsvField(String field) {
        if (field == null) {
            return "";
        }
        // Escape quotes by doubling them and wrap the field in quotes if it contains commas or quotes
        if (field.contains(",") || field.contains("\"") || field.contains("\n")) {
            return "\"" + field.replace("\"", "\"\"") + "\"";
        }
        return field;
    }
}