package com.hicham.annotationplatformproject1.controller;

import com.hicham.annotationplatformproject1.dto.AnnotationRequest;
import com.hicham.annotationplatformproject1.dto.ApiResponse;
import com.hicham.annotationplatformproject1.service.AnnotationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/annotations")
public class AnnotationController {

    private final AnnotationService annotationService;

    public AnnotationController(AnnotationService annotationService) {
        this.annotationService = annotationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<String>> saveAnnotation(@RequestBody AnnotationRequest request) {
        ApiResponse<String> response = annotationService.saveAnnotation(request);
        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.badRequest().body(response);
    }
}