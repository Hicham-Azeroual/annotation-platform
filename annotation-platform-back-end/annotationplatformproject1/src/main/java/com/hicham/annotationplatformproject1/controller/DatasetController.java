package com.hicham.annotationplatformproject1.controller;

import com.hicham.annotationplatformproject1.dto.*;
import com.hicham.annotationplatformproject1.model.Utilisateur;
import com.hicham.annotationplatformproject1.security.UtilisateurService;
import com.hicham.annotationplatformproject1.service.DatasetService;
import com.hicham.annotationplatformproject1.service.TaskAssignmentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/datasets")
public class DatasetController {

    private final DatasetService datasetService;
    private final TaskAssignmentService taskAssignmentService;
    private final UtilisateurService utilisateurService;

    public DatasetController(DatasetService datasetService,
                             TaskAssignmentService taskAssignmentService, UtilisateurService utilisateurService) {
        this.datasetService = datasetService;
        this.taskAssignmentService = taskAssignmentService;
        this.utilisateurService = utilisateurService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DatasetDTO>> createDataset(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("classes") String classes,
            @RequestParam("file") MultipartFile file) {

        ApiResponse<DatasetDTO> response = datasetService.createDataset(name, description, classes, file);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<DatasetsResponseDTO>> getAllDatasets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ApiResponse<DatasetsResponseDTO> response = datasetService.getAllDatasets(page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DatasetDTO>> getDatasetById(@PathVariable Long id) {
        ApiResponse<DatasetDTO> response = datasetService.getDatasetById(id);
        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.status(404).body(response);
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<ApiResponse<DatasetDetailsDTO>> getDatasetDetails(@PathVariable Long id) {
        ApiResponse<DatasetDetailsDTO> response = datasetService.getDatasetDetails(id);
        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.status(404).body(response);
    }

    @GetMapping("/{datasetId}/available-annotators")
    public ResponseEntity<ApiResponse<List<UtilisateurDTO>>> getAvailableAnnotators() {
        try {
            List<UtilisateurDTO> annotateurs = utilisateurService.getAvailableAnnotators();
            return ResponseEntity.ok(ApiResponse.success("Annotateurs disponibles récupérés avec succès", annotateurs));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Erreur lors de la récupération des annotateurs disponibles: " + e.getMessage()));
        }
    }

    @PostMapping("/{datasetId}/assign")
    public ResponseEntity<ApiResponse<String>> assignTextPairs(
            @PathVariable Long datasetId,
            @RequestBody AssignmentRequest request) {
        // Ensure the datasetId in the path matches the request body
        if (!datasetId.equals(request.getDatasetId())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Dataset ID in path does not match request body"));
        }
        ApiResponse<String> response = taskAssignmentService.assignTextPairs(datasetId, request);
        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadDatasetAsCsv(@PathVariable Long id) {
        ApiResponse<byte[]> response = datasetService.downloadDatasetAsCsv(id);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=dataset_" + id + ".csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(response.getData());
    }
}