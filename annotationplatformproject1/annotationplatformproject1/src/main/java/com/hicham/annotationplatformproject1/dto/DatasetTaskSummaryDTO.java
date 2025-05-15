package com.hicham.annotationplatformproject1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DatasetTaskSummaryDTO {
    private Long datasetId;
    private String datasetName;
    private String description;
    private List<TaskSummaryDTO> tasks;
    private Long totalCoupeTextes;
    private String progress;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TaskSummaryDTO {
        private Long taskId;
    }
}