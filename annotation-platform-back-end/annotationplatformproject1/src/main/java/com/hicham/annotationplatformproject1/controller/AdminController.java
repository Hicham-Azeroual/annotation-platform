package com.hicham.annotationplatformproject1.controller;

import com.hicham.annotationplatformproject1.dto.ApiResponse;
import com.hicham.annotationplatformproject1.dto.UtilisateurDTO;
import com.hicham.annotationplatformproject1.model.Utilisateur;
import com.hicham.annotationplatformproject1.security.UtilisateurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/annotators")
public class AdminController {

    private final UtilisateurService utilisateurService;

    public AdminController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UtilisateurDTO>> createAnnotator(@RequestBody Utilisateur request) {
        try {
            UtilisateurDTO annotateurDTO = utilisateurService.createAnnotateur(
                    request.getUsername(),
                    request.getNom(),
                    request.getPrenom(),
                    request.getEmail()
            );

            return ResponseEntity.ok(ApiResponse.success("Annotateur créé avec succès", annotateurDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Erreur lors de la création de l'annotateur: " + e.getMessage()));
        }
    }
}