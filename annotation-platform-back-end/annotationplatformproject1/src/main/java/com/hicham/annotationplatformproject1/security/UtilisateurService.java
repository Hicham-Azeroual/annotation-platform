package com.hicham.annotationplatformproject1.security;

import com.hicham.annotationplatformproject1.dto.UtilisateurDTO;
import com.hicham.annotationplatformproject1.model.Utilisateur;
import com.hicham.annotationplatformproject1.repository.TacheRepository;
import com.hicham.annotationplatformproject1.repository.UtilisateurRepository;
import com.hicham.annotationplatformproject1.service.ActivityLogService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityLogService activityLogService;
    private final TacheRepository tacheRepository; // Added dependency

    public UtilisateurService(UtilisateurRepository utilisateurRepository,
                              PasswordEncoder passwordEncoder,
                              ActivityLogService activityLogService,
                              TacheRepository tacheRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.activityLogService = activityLogService;
        this.tacheRepository = tacheRepository;
    }

    public UtilisateurDTO createAnnotateur(String username, String nom, String prenom, String email) {
        try {
            String rawPassword = generateRandomPassword(10);
            System.out.println("Mot de passe annotateur (à communiquer) : " + rawPassword);

            Utilisateur annotateur = new Utilisateur();
            annotateur.setUsername(username);
            annotateur.setNom(nom);
            annotateur.setPrenom(prenom);
            annotateur.setEmail(email);
            annotateur.setRole(Utilisateur.Role.ANNOTATOR);
            annotateur.setPassword(passwordEncoder.encode(rawPassword));
            annotateur.setActive(true);

            Utilisateur savedAnnotateur = utilisateurRepository.save(annotateur);

            activityLogService.logActivity(
                    "USER_CREATED",
                    "Created annotator: " + username,
                    savedAnnotateur
            );

            return new UtilisateurDTO(
                    savedAnnotateur.getId(),
                    savedAnnotateur.getNom(),
                    savedAnnotateur.getPrenom(),
                    savedAnnotateur.getUsername(),
                    savedAnnotateur.getEmail(),
                    savedAnnotateur.isActive(),
                    savedAnnotateur.getRole().name(),
                    rawPassword,
                    true
            );
        } catch (Exception e) {
            activityLogService.logActivity(
                    "USER_CREATION_ERROR",
                    "Failed to create annotator: " + e.getMessage()
            );
            throw e;
        }
    }

    public List<UtilisateurDTO> getAvailableAnnotators() {
        try {
            List<Utilisateur> annotateurs = utilisateurRepository.findByRoleAndActive(Utilisateur.Role.ANNOTATOR, true);
            activityLogService.logActivity(
                    "ANNOTATORS_FETCHED",
                    "Fetched available annotators",
                    null
            );

            return annotateurs.stream()
                    .map(annotateur -> new UtilisateurDTO(
                            annotateur.getId(),
                            annotateur.getNom(),
                            annotateur.getPrenom(),
                            annotateur.getUsername(),
                            annotateur.getEmail(),
                            annotateur.isActive(),
                            annotateur.getRole().name(),
                            tacheRepository.countByAnnotateurId(annotateur.getId())
                    ))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            activityLogService.logActivity(
                    "ANNOTATORS_FETCH_ERROR",
                    "Failed to fetch available annotators: " + e.getMessage(),
                    null
            );
            throw e;
        }
    }

    public String generateRandomPassword(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}