package com.hicham.annotationplatformproject1.dto;

import com.hicham.annotationplatformproject1.model.Utilisateur;
import lombok.Data;

@Data
public class AnnotatorRequest {
    private String prenom;
    private String nom;
    private String username;
    private String email;
    private Utilisateur.Role role;
    private boolean active;
    private boolean regeneratePassword; // Added field
}