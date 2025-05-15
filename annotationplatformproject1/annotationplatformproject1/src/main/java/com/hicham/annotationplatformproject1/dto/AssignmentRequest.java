package com.hicham.annotationplatformproject1.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AssignmentRequest {
    private Long datasetId;
    private List<Long> annotatorIds; // IDs des annotateurs sélectionnés
    private LocalDateTime deadline; // New field for deadline


}