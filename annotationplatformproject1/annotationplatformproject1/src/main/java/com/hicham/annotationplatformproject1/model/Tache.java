package com.hicham.annotationplatformproject1.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Tache {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "dataset_id")
    private Dataset dataset;

    @ManyToOne
    @JoinColumn(name = "annotateur_id")
    private Utilisateur annotateur;

    @ManyToOne
    @JoinColumn(name = "coupe_texte_id")
    private CoupeTexte coupeTexte;

    @Enumerated(EnumType.STRING)
    private StatutTache statut = StatutTache.EN_ATTENTE;

    private LocalDateTime dateCreation = LocalDateTime.now();
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;

    public enum StatutTache { EN_ATTENTE, EN_COURS, TERMINEE }
}
