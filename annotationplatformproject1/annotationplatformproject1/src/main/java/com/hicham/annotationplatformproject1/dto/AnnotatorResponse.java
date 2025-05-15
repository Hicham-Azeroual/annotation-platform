package com.hicham.annotationplatformproject1.dto;

import com.hicham.annotationplatformproject1.model.Utilisateur;
import lombok.Data;

@Data
public class AnnotatorResponse {
    private Long id;
    private String prenom;
    private String nom;
    private String username;
    private String email;
    private Utilisateur.Role role;
    private boolean active;
    private String password; // Added field for returning regenerated password
}
