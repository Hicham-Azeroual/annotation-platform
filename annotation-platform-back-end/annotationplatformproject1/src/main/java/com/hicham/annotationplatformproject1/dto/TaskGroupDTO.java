package com.hicham.annotationplatformproject1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor

public class TaskGroupDTO {
    private Long taskId;
    private Long datasetId;
    private String datasetName;
    private List<TaskDetailDTO> tasks;
    private double progress;
    private int currentPage;
    private int totalPages;
    private long totalTasks;
    private List<ClassDTO> classes; // Updated to use ClassDTO

    public TaskGroupDTO() {

    }

    @Data
    @AllArgsConstructor
    public static class TaskDetailDTO {
        private Long coupeTexteId;
        private String text1;
        private String text2;
        private String status;
        private LocalDateTime dateCreation;
        private LocalDateTime dateFin;
        private String assignedClass;

        public TaskDetailDTO() {

        }
    }

    @Data
    @AllArgsConstructor

    public static class ClassDTO {
        private Long id;
        private String nomClasse;

        public ClassDTO() {

        }
    }
}