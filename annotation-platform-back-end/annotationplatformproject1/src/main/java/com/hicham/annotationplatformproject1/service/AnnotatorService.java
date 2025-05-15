package com.hicham.annotationplatformproject1.service;

import com.hicham.annotationplatformproject1.dto.AnnotatorRequest;
import com.hicham.annotationplatformproject1.dto.AnnotatorResponse;
import com.hicham.annotationplatformproject1.dto.ApiResponse;
import com.hicham.annotationplatformproject1.model.Utilisateur;
import com.hicham.annotationplatformproject1.repository.UtilisateurRepository;
import com.hicham.annotationplatformproject1.security.UtilisateurService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnotatorService {

    private final UtilisateurRepository utilisateurRepository;
    private final ActivityLogService activityLogService;
    private final PasswordEncoder passwordEncoder; // Injected PasswordEncoder
    private final UtilisateurService utilisateurService;
    public AnnotatorService(UtilisateurRepository utilisateurRepository,
                            ActivityLogService activityLogService,
                            PasswordEncoder passwordEncoder, UtilisateurService utilisateurService) {
        this.utilisateurRepository = utilisateurRepository;
        this.activityLogService = activityLogService;
        this.passwordEncoder = passwordEncoder;
        this.utilisateurService = utilisateurService;
    }

    public ApiResponse<List<AnnotatorResponse>> getAllAnnotators() {
        try {
            List<Utilisateur> annotators = utilisateurRepository.findByRole(Utilisateur.Role.ANNOTATOR);
            List<AnnotatorResponse> response = annotators.stream()
                    .map(this::mapToAnnotatorResponse)
                    .collect(Collectors.toList());

            activityLogService.logActivity(
                    "ANNOTATORS_RETRIEVED",
                    "Retrieved list of active annotators"
            );

            return ApiResponse.success("Annotators retrieved successfully", response);
        } catch (Exception e) {
            activityLogService.logActivity(
                    "ANNOTATORS_FETCH_ERROR",
                    "Failed to retrieve annotators: " + e.getMessage()
            );
            return ApiResponse.error("Failed to retrieve annotators: " + e.getMessage());
        }
    }

    public ApiResponse<AnnotatorResponse> getAnnotatorById(Long id) {
        try {
            Utilisateur annotator = utilisateurRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Annotator not found"));

            if (annotator.getRole() != Utilisateur.Role.ANNOTATOR) {
                throw new RuntimeException("User is not an annotator");
            }

            AnnotatorResponse response = mapToAnnotatorResponse(annotator);

            activityLogService.logActivity(
                    "ANNOTATOR_RETRIEVED",
                    "Retrieved details for annotator ID: " + id
            );

            return ApiResponse.success("Annotator retrieved successfully", response);
        } catch (Exception e) {
            activityLogService.logActivity(
                    "ANNOTATOR_FETCH_ERROR",
                    "Failed to retrieve annotator ID " + id + ": " + e.getMessage()
            );
            return ApiResponse.error("Failed to retrieve annotator: " + e.getMessage());
        }
    }

    public ApiResponse<AnnotatorResponse> updateAnnotator(Long id, AnnotatorRequest request) {
        try {
            Utilisateur annotator = utilisateurRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Annotator not found"));

            if (annotator.getRole() != Utilisateur.Role.ANNOTATOR) {
                throw new RuntimeException("User is not an annotator");
            }

            // Check for email uniqueness
            if (!annotator.getEmail().equals(request.getEmail()) &&
                    utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new RuntimeException("Email already in use");
            }

            // Check for username uniqueness
            if (!annotator.getUsername().equals(request.getUsername()) &&
                    utilisateurRepository.findByUsername(request.getUsername()).isPresent()) {
                throw new RuntimeException("Username already in use");
            }

            // Regenerate password if requested
            String newPassword = null;
            if (request.isRegeneratePassword()) {
                newPassword = utilisateurService.generateRandomPassword(10);
                annotator.setPassword(passwordEncoder.encode(newPassword));
                System.out.println("New password for annotator (to communicate): " + newPassword);
            }

            // Update fields
            annotator.setPrenom(request.getPrenom());
            annotator.setNom(request.getNom());
            annotator.setUsername(request.getUsername());
            annotator.setEmail(request.getEmail());
            annotator.setRole(request.getRole());
            annotator.setActive(request.isActive());

            utilisateurRepository.save(annotator);

            AnnotatorResponse response = mapToAnnotatorResponse(annotator);
            if (newPassword != null) {
                response.setPassword(newPassword); // Include new password in response
            }

            activityLogService.logActivity(
                    "ANNOTATOR_UPDATED",
                    "Updated annotator ID: " + id
            );

            return ApiResponse.success("Annotator updated successfully", response);
        } catch (Exception e) {
            activityLogService.logActivity(
                    "ANNOTATOR_UPDATE_ERROR",
                    "Failed to update annotator ID " + id + ": " + e.getMessage()
            );
            return ApiResponse.error("Failed to update annotator: " + e.getMessage());
        }
    }

    public ApiResponse<String> deleteAnnotator(Long id) {
        try {
            Utilisateur annotator = utilisateurRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Annotator not found"));

            if (annotator.getRole() != Utilisateur.Role.ANNOTATOR) {
                throw new RuntimeException("User is not an annotator");
            }

            annotator.setActive(false);
            utilisateurRepository.save(annotator);

            activityLogService.logActivity(
                    "ANNOTATOR_DELETED",
                    "Soft deleted annotator ID: " + id
            );

            return ApiResponse.success("Annotator deleted successfully", "Annotator ID " + id + " has been deactivated");
        } catch (Exception e) {
            activityLogService.logActivity(
                    "ANNOTATOR_DELETE_ERROR",
                    "Failed to delete annotator ID " + id + ": " + e.getMessage()
            );
            return ApiResponse.error("Failed to delete annotator: " + e.getMessage());
        }
    }

    private AnnotatorResponse mapToAnnotatorResponse(Utilisateur utilisateur) {
        AnnotatorResponse response = new AnnotatorResponse();
        response.setId(utilisateur.getId());
        response.setPrenom(utilisateur.getPrenom());
        response.setNom(utilisateur.getNom());
        response.setUsername(utilisateur.getUsername());
        response.setEmail(utilisateur.getEmail());
        response.setRole(utilisateur.getRole());
        response.setActive(utilisateur.isActive());
        return response;
    }


}