package com.hicham.annotationplatformproject1.dto;

import lombok.Data;

@Data
public class UtilisateurDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String username;
    private String email;
    private boolean active;
    private String role;
    private String token;
    private String temporaryPassword; // New field for temporary password
    private long taskCount; // Added field for task count

    public UtilisateurDTO(Long id, String nom, String prenom, String username, String email, boolean active, String role, String token) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.username = username;
        this.email = email;
        this.active = active;
        this.role = role;
        this.token = token;
    }

    // Additional constructor for annotator creation
    public UtilisateurDTO(Long id, String nom, String prenom, String username, String email, boolean active, String role, String temporaryPassword, boolean isAnnotatorCreation) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.username = username;
        this.email = email;
        this.active = active;
        this.role = role;
        this.temporaryPassword = temporaryPassword;
    }

    // New constructor for getAvailableAnnotators with taskCount
    public UtilisateurDTO(Long id, String nom, String prenom, String username, String email, boolean active, String role, long taskCount) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.username = username;
        this.email = email;
        this.active = active;
        this.role = role;
        this.taskCount = taskCount;
    }
}