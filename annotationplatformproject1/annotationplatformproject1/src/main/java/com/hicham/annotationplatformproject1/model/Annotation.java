package com.hicham.annotationplatformproject1.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Annotation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "coupe_texte_id")
    private CoupeTexte coupeTexte;

    @ManyToOne
    @JoinColumn(name = "annotateur_id")
    private Utilisateur annotateur;

    @ManyToOne
    @JoinColumn(name = "classe_choisie_id")
    private ClassePersistante classeChoisie;

    private LocalDateTime annotateAt;
}
