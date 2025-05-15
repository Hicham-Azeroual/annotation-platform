package com.hicham.annotationplatformproject1.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        name = "user_dataset_progress",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "dataset_id"})
)
@Getter
@Setter
public class UserDatasetProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Utilisateur user;

    @Column(name = "dataset_id", nullable = false)
    private Long datasetId;

    @Column(name = "last_page", nullable = false)
    private int lastPage; // Tracks the last page number (0-based index)
}