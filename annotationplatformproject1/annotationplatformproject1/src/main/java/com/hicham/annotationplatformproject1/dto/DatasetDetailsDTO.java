package com.hicham.annotationplatformproject1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
@Data
@AllArgsConstructor
public class DatasetDetailsDTO {


    private Long id;
    private String name;
    private String description;
    private List<String> classes;
    private double progress;
    private long totalCoupeTextes;
    private long numberOfAnnotatedCoupeTextes; // Changed from assignedCoupeTextes
    private long numberOfNotAnnotatedCoupeTextes; // Changed from unassignedCoupeTextes
 }
