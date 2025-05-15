package com.hicham.annotationplatformproject1.dto;

import lombok.Data;

import java.util.List;

@Data
public class DatasetDTO {
    private Long id;
    private String name;
    private String description;
    private List<String> classes;
    private double progress; // New field for progress percentage

    public DatasetDTO(Long id, String name, String description, List<String> classes, double progress) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.classes = classes;
        this.progress = progress;
    }
}