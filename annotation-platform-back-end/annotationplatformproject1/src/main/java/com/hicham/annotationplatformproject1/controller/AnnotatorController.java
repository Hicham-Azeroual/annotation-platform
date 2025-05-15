package com.hicham.annotationplatformproject1.controller;

import com.hicham.annotationplatformproject1.dto.AnnotatorRequest;
import com.hicham.annotationplatformproject1.dto.AnnotatorResponse;
import com.hicham.annotationplatformproject1.dto.ApiResponse;
import com.hicham.annotationplatformproject1.service.AnnotatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/annotators")
public class AnnotatorController {

    private final AnnotatorService annotatorService;

    public AnnotatorController(AnnotatorService annotatorService) {
        this.annotatorService = annotatorService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AnnotatorResponse>>> getAllAnnotators() {
        ApiResponse<List<AnnotatorResponse>> response = annotatorService.getAllAnnotators();
        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AnnotatorResponse>> getAnnotatorById(@PathVariable Long id) {
        ApiResponse<AnnotatorResponse> response = annotatorService.getAnnotatorById(id);
        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.badRequest().body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AnnotatorResponse>> updateAnnotator(
            @PathVariable Long id, @RequestBody AnnotatorRequest request) {
        ApiResponse<AnnotatorResponse> response = annotatorService.updateAnnotator(id, request);
        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.badRequest().body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteAnnotator(@PathVariable Long id) {
        ApiResponse<String> response = annotatorService.deleteAnnotator(id);
        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.badRequest().body(response);
    }
}