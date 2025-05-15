package com.hicham.annotationplatformproject1.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class CoupeTexte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String text1;

    @Column(columnDefinition = "TEXT")
    private String text2;

    private boolean assigned = false;

    @ManyToOne
    @JoinColumn(name = "dataset_id")
    private Dataset dataset;
}