package com.hicham.annotationplatformproject1.service;

import com.hicham.annotationplatformproject1.dto.ApiResponse;
import com.hicham.annotationplatformproject1.dto.DatasetDTO;
import com.hicham.annotationplatformproject1.dto.DatasetDetailsDTO;
import com.hicham.annotationplatformproject1.dto.DatasetsResponseDTO;
import com.hicham.annotationplatformproject1.exception.ServiceException;
import com.hicham.annotationplatformproject1.model.Annotation;
import com.hicham.annotationplatformproject1.model.ClassePersistante;
import com.hicham.annotationplatformproject1.model.CoupeTexte;
import com.hicham.annotationplatformproject1.model.Dataset;
import com.hicham.annotationplatformproject1.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for managing datasets, including creation, retrieval, and export.
 */
@Service
public class DatasetService {

    private final DatasetRepository datasetRepository;
    private final CoupeTexteRepository coupeTexteRepository;
    private final ClassPersistanteService classPersistanteService;
    private final ActivityLogService activityLogService;
    private final TacheRepository tacheRepository;
    private final AnnotationRepository annotationRepository;
    private final StatisticsService statisticsService;
    private final ValidationService validationService;

    public DatasetService(DatasetRepository datasetRepository,
                          CoupeTexteRepository coupeTexteRepository,
                          ClassPersistanteService classPersistanteService,
                          ActivityLogService activityLogService,
                          TacheRepository tacheRepository,
                          AnnotationRepository annotationRepository,
                          StatisticsService statisticsService,
                          ValidationService validationService) {
        this.datasetRepository = datasetRepository;
        this.coupeTexteRepository = coupeTexteRepository;
        this.classPersistanteService = classPersistanteService;
        this.activityLogService = activityLogService;
        this.tacheRepository = tacheRepository;
        this.annotationRepository = annotationRepository;
        this.statisticsService = statisticsService;
        this.validationService = validationService;
    }

    /**
     * Creates a new dataset from a name, description, classes, and uploaded file.
     *
     * @param name        Dataset name.
     * @param description Dataset description.
     * @param classes     Semicolon-separated class names.
     * @param file        CSV file containing text pairs.
     * @return ApiResponse with created DatasetDTO.
     */
    public ApiResponse<DatasetDTO> createDataset(String name, String description, String classes, MultipartFile file) {
        try {
            // Validate inputs
            if (name == null || name.trim().isEmpty()) {
                throw new ServiceException("Dataset name cannot be empty");
            }
            if (file == null || file.isEmpty()) {
                throw new ServiceException("File cannot be empty");
            }

            // Create and save dataset
            Dataset dataset = new Dataset();
            dataset.setName(name);
            dataset.setDescription(description);
            Dataset savedDataset = datasetRepository.save(dataset);

            // Process file and save text pairs
            List<CoupeTexte> textPairs = processFile(file, savedDataset);
            coupeTexteRepository.saveAll(textPairs);

            // Create and associate classes
            classPersistanteService.createClasses(classes, savedDataset);

            // Convert to DTO
            DatasetDTO datasetDTO = convertToDTO(savedDataset);

            activityLogService.logActivity(
                    "DATASET_CREATED",
                    "Dataset created: " + name + " with " + textPairs.size() + " text pairs"
            );
            return ApiResponse.success("Dataset created successfully", datasetDTO);
        } catch (Exception e) {
            activityLogService.logActivity("DATASET_ERROR", "Failed to create dataset: " + e.getMessage());
            return ApiResponse.error("Failed to create dataset: " + e.getMessage());
        }
    }

    /**
     * Processes a CSV file to extract text pairs.
     *
     * @param file    The uploaded CSV file.
     * @param dataset The associated dataset.
     * @return List of CoupeTexte objects.
     * @throws Exception if file processing fails.
     */
    private List<CoupeTexte> processFile(MultipartFile file, Dataset dataset) throws Exception {
        List<CoupeTexte> textPairs = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            reader.readLine(); // Skip header
            String line;
            while ((line = reader.readLine()) != null) {
                if (!line.trim().isEmpty()) {
                    String[] parts = line.split(",", -1);
                    if (parts.length >= 2) {
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

    /**
     * Retrieves all datasets with pagination and global statistics.
     *
     * @param page Page number (0-based).
     * @param size Page size.
     * @return ApiResponse with DatasetsResponseDTO.
     */
    public ApiResponse<DatasetsResponseDTO> getAllDatasets(int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Dataset> datasetPage = datasetRepository.findAll(pageable);

            List<DatasetDTO> datasetDTOs = datasetPage.getContent()
                    .stream()
                    .map(this::convertToDTO)
                    .toList();

            // Calculate global statistics
            long totalDatasets = datasetPage.getTotalElements();
            List<Long> datasetIdsWithTasks = tacheRepository.findAllDatasetIdsWithTasks();
            long completedDatasets = datasetIdsWithTasks.stream()
                    .filter(id -> statisticsService.calculateDatasetProgress(id) >= 99.0)
                    .count();
            long notCompletedDatasets = datasetIdsWithTasks.size() - completedDatasets;
            long unassignedDatasets = totalDatasets - datasetIdsWithTasks.size();

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
            activityLogService.logActivity("DATASET_FETCH_ERROR", "Failed to retrieve datasets: " + e.getMessage());
            return ApiResponse.error("Failed to retrieve datasets: " + e.getMessage());
        }
    }

    /**
     * Retrieves a dataset by ID.
     *
     * @param id Dataset ID.
     * @return ApiResponse with DatasetDTO.
     */
    public ApiResponse<DatasetDTO> getDatasetById(Long id) {
        try {
            Dataset dataset = validationService.validateDataset(id);
            DatasetDTO datasetDTO = convertToDTO(dataset);
            activityLogService.logActivity(
                    "DATASET_RETRIEVED",
                    "Retrieved dataset ID: " + id + ", Name: " + dataset.getName()
            );
            return ApiResponse.success("Dataset retrieved successfully", datasetDTO);
        } catch (ServiceException e) {
            activityLogService.logActivity("DATASET_FETCH_ERROR", e.getMessage());
            return ApiResponse.error(e.getMessage());
        }
    }

    /**
     * Retrieves detailed information about a dataset.
     *
     * @param id Dataset ID.
     * @return ApiResponse with DatasetDetailsDTO.
     */
    public ApiResponse<DatasetDetailsDTO> getDatasetDetails(Long id) {
        try {
            Dataset dataset = validationService.validateDataset(id);
            List<String> classNames = dataset.getClasses().stream()
                    .map(ClassePersistante::getNomClasse)
                    .toList();
            double progress = statisticsService.calculateDatasetProgress(id);
            Map<String, Long> counts = statisticsService.countAnnotatedTextPairs(id);

            DatasetDetailsDTO detailsDTO = new DatasetDetailsDTO(
                    dataset.getId(),
                    dataset.getName(),
                    dataset.getDescription(),
                    classNames,
                    progress,
                    counts.get("annotated") + counts.get("notAnnotated"),
                    counts.get("annotated"),
                    counts.get("notAnnotated")
            );

            activityLogService.logActivity(
                    "DATASET_DETAILS_RETRIEVED",
                    "Retrieved details for dataset ID: " + id
            );
            return ApiResponse.success("Dataset details retrieved successfully", detailsDTO);
        } catch (ServiceException e) {
            activityLogService.logActivity("DATASET_DETAILS_ERROR", e.getMessage());
            return ApiResponse.error(e.getMessage());
        }
    }

    /**
     * Exports a dataset as a CSV file.
     *
     * @param datasetId Dataset ID.
     * @return ApiResponse with CSV byte array.
     */
    public ApiResponse<byte[]> downloadDatasetAsCsv(Long datasetId) {
        try {
            Dataset dataset = validationService.validateDataset(datasetId);
            List<CoupeTexte> coupeTextes = coupeTexteRepository.findByDatasetId(datasetId);
            if (coupeTextes.isEmpty()) {
                throw new ServiceException("No text pairs found for dataset ID: " + datasetId);
            }

            List<Long> coupeTexteIds = coupeTextes.stream().map(CoupeTexte::getId).toList();
            Map<Long, Annotation> annotationMap = annotationRepository.findByCoupeTexteIdIn(coupeTexteIds)
                    .stream()
                    .collect(Collectors.toMap(a -> a.getCoupeTexte().getId(), a -> a));

            StringBuilder csvContent = new StringBuilder("text1,text2,annotation\n");
            for (CoupeTexte ct : coupeTextes) {
                String text1 = escapeCsvField(ct.getText1() != null ? ct.getText1() : "");
                String text2 = escapeCsvField(ct.getText2() != null ? ct.getText2() : "");
                String annotation = annotationMap.getOrDefault(ct.getId(), null) != null
                        ? escapeCsvField(annotationMap.get(ct.getId()).getClasseChoisie().getNomClasse())
                        : "N/A";
                csvContent.append(String.format("%s,%s,%s\n", text1, text2, annotation));
            }

            byte[] csvBytes = csvContent.toString().getBytes("UTF-8");
            activityLogService.logActivity(
                    "DATASET_DOWNLOADED",
                    "Dataset ID: " + datasetId + " downloaded as CSV with " + coupeTextes.size() + " text pairs"
            );
            return ApiResponse.success("Dataset downloaded successfully", csvBytes);
        } catch (Exception e) {
            activityLogService.logActivity("DATASET_DOWNLOAD_ERROR", "Failed to download dataset ID: " + datasetId + ": " + e.getMessage());
            return ApiResponse.error("Failed to download dataset: " + e.getMessage());
        }
    }

    /**
     * Converts a Dataset to a DatasetDTO.
     *
     * @param dataset The dataset to convert.
     * @return DatasetDTO with progress calculated.
     */
    private DatasetDTO convertToDTO(Dataset dataset) {
        return new DatasetDTO(
                dataset.getId(),
                dataset.getName(),
                dataset.getDescription(),
                dataset.getClasses().stream().map(ClassePersistante::getNomClasse).toList(),
                statisticsService.calculateDatasetProgress(dataset.getId())
        );
    }

    /**
     * Escapes a CSV field to handle commas and quotes.
     *
     * @param field The field to escape.
     * @return Escaped field string.
     */
    private String escapeCsvField(String field) {
        if (field == null) return "";
        if (field.contains(",") || field.contains("\"") || field.contains("\n")) {
            return "\"" + field.replace("\"", "\"\"") + "\"";
        }
        return field;
    }
}