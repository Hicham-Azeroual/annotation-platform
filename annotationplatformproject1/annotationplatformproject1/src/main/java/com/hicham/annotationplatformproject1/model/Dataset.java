package com.hicham.annotationplatformproject1.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Dataset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt = LocalDateTime.now();
    @OneToMany(mappedBy = "dataset", cascade = CascadeType.ALL)
    private List<CoupeTexte> coupeTextes = new ArrayList<>();

    @OneToMany(mappedBy = "dataset", cascade = CascadeType.ALL)
    private List<ClassePersistante> classes = new ArrayList<>();

    @OneToMany(mappedBy = "dataset", cascade = CascadeType.ALL)
    private List<Tache> taches = new ArrayList<>();
}
