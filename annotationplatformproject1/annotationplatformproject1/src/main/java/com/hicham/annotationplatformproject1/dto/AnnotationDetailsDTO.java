package com.hicham.annotationplatformproject1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
public class AnnotationDetailsDTO {

    private Long id;
    private Long annotateurId;
    private String annotateurUsername;
    private Long classeChoisieId;
    private String classeChoisieNom;
    private LocalDateTime annotatedAt;


}
