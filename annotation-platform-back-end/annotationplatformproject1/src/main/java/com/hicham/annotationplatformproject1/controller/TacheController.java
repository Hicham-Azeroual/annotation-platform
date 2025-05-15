package com.hicham.annotationplatformproject1.controller;

import com.hicham.annotationplatformproject1.dto.ApiResponse;
import com.hicham.annotationplatformproject1.dto.DatasetTaskSummaryDTO;
import com.hicham.annotationplatformproject1.dto.TaskGroupDTO;
import com.hicham.annotationplatformproject1.service.TacheService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TacheController {

    private final TacheService tacheService;

    public TacheController(TacheService tacheService) {
        this.tacheService = tacheService;
    }

    @GetMapping("/annotator/{annotatorId}")
    public ResponseEntity<ApiResponse<TaskGroupDTO>> getTasksByAnnotator(
            @PathVariable Long annotatorId,
            @RequestParam Long datasetId,
            @RequestParam(required = false) Integer page) {
        ApiResponse<TaskGroupDTO> response = tacheService.getTasksByAnnotator(annotatorId, datasetId, page);
        return ResponseEntity.status(response.isSuccess() ? 200 : 400)
                .body(response);
    }

    @GetMapping("/annotator/{annotatorId}/summary")
    public ResponseEntity<ApiResponse<List<DatasetTaskSummaryDTO>>> getTaskSummaryByAnnotator(@PathVariable Long annotatorId) {
        ApiResponse<List<DatasetTaskSummaryDTO>> response = tacheService.getTaskSummaryByAnnotator(annotatorId);
        return ResponseEntity.status(response.isSuccess() ? 200 : 400)
                .body(response);
    }

    @PostMapping("/annotate")
    public ResponseEntity<ApiResponse<String>> saveAnnotation(
            @RequestParam Long annotatorId,
            @RequestParam Long coupeTexteId,
            @RequestParam Long classeChoisieId) {
        ApiResponse<String> response = tacheService.saveAnnotation(annotatorId, coupeTexteId, classeChoisieId);
        return ResponseEntity.status(response.isSuccess() ? 200 : 400)
                .body(response);
    }
}