package com.hicham.annotationplatformproject1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class ResponseDetailsOfDatasetsDTO {

    private List<CoupeTexteDTO> coupeTextes;
    private boolean annotated;
    private AnnotationDetailsDTO annotationDetails;
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int pageSize;
    private List<AnnotatorDetailsDTO> annotators; // Updated to use AnnotatorDetailsDTO

    @Data
    @AllArgsConstructor
    public static class AnnotatorDetailsDTO {
        private Long id;
        private String prenom; // First name
        private String nom; // Last name
        private String username;
        private String email;
        private boolean active;
        private int taskCount; // Number of tasks assigned
        private boolean canUnassign; // Flag for unassign action
    }
}