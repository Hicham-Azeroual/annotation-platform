package com.hicham.annotationplatformproject1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CoupeTexteDTO {

    private Long id;
    private String text1;
    private String text2;
    private LocalDateTime annotationDate; // New field for annotation date
    private String annotatedClass;

}
