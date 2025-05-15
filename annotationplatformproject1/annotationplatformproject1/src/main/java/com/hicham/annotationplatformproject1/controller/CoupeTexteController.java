package com.hicham.annotationplatformproject1.controller;

import com.hicham.annotationplatformproject1.dto.ApiResponse;
import com.hicham.annotationplatformproject1.dto.ResponseDetailsOfDatasetsDTO;
import com.hicham.annotationplatformproject1.service.CoupeTexteService;
import com.hicham.annotationplatformproject1.service.TaskAssignmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/coupe-textes")
public class CoupeTexteController {

    private final CoupeTexteService coupeTexteService;
    private final TaskAssignmentService taskAssignmentService;
    public CoupeTexteController(CoupeTexteService coupeTexteService, TaskAssignmentService taskAssignmentService) {
        this.coupeTexteService = coupeTexteService;
        this.taskAssignmentService = taskAssignmentService;
    }

    @GetMapping("dataset/{datasetId}")
    public ResponseEntity<ApiResponse<ResponseDetailsOfDatasetsDTO>> getCoupeTextesByDatasetId(
            @PathVariable Long datasetId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ApiResponse<ResponseDetailsOfDatasetsDTO> response = coupeTexteService.getCoupeTextesByDatasetId(datasetId, page, size);
        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.status(404).body(response);
    }
    @PostMapping("/dataset/{datasetId}/unassign/{annotatorId}")
    public ResponseEntity<ApiResponse<String>> unassignAnnotatorFromDataset(
            @PathVariable Long datasetId,
            @PathVariable Long annotatorId) {
        ApiResponse<String> response = taskAssignmentService.unassignAnnotatorFromDataset(datasetId, annotatorId);
        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.status(400).body(response);
    }
}