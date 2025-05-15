package com.hicham.annotationplatformproject1.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ClassePersistante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nomClasse;

    @ManyToOne
    @JoinColumn(name = "dataset_id")
    private Dataset dataset;
}
