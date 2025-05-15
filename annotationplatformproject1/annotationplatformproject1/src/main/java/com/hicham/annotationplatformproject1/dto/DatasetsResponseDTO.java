package com.hicham.annotationplatformproject1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
public class DatasetsResponseDTO {
    private List<DatasetDTO> datasets;
    private long completedDatasets;
    private long notCompletedDatasets;
    private long unassignedDatasets;
    private long totalElements;  // Total number of datasets
    private int totalPages;     // Total number of pages
    private int currentPage;    // Current page number
    private int pageSize;       // Number of items per page

    public DatasetsResponseDTO(List<DatasetDTO> datasets, long completedDatasets,
                               long notCompletedDatasets, long unassignedDatasets,
                               long totalElements, int totalPages, int currentPage, int pageSize) {
        this.datasets = datasets;
        this.completedDatasets = completedDatasets;
        this.notCompletedDatasets = notCompletedDatasets;
        this.unassignedDatasets = unassignedDatasets;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
    }


}