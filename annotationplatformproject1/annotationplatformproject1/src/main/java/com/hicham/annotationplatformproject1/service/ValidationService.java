package com.hicham.annotationplatformproject1.service;

import com.hicham.annotationplatformproject1.exception.ServiceException;
import com.hicham.annotationplatformproject1.model.Dataset;
import com.hicham.annotationplatformproject1.model.Utilisateur;
import com.hicham.annotationplatformproject1.repository.DatasetRepository;
import com.hicham.annotationplatformproject1.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;

/**
 * Service for common validation logic to reduce code duplication.
 */
@Service
public class ValidationService {
    private final DatasetRepository datasetRepository;
    private final UtilisateurRepository utilisateurRepository;

    public ValidationService(DatasetRepository datasetRepository, UtilisateurRepository utilisateurRepository) {
        this.datasetRepository = datasetRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    /**
     * Validates that a dataset exists by ID.
     *
     * @param datasetId The ID of the dataset to validate.
     * @return The found Dataset object.
     * @throws ServiceException if the dataset is not found.
     */
    public Dataset validateDataset(Long datasetId) {
        return datasetRepository.findById(datasetId)
                .orElseThrow(() -> new ServiceException("Dataset not found with ID: " + datasetId));
    }

    /**
     * Validates that a user exists and has the ANNOTATOR role.
     *
     * @param annotatorId The ID of the annotator to validate.
     * @return The found Utilisateur object.
     * @throws ServiceException if the annotator is not found or is not an annotator.
     */
    public Utilisateur validateAnnotator(Long annotatorId) {
        Utilisateur annotator = utilisateurRepository.findById(annotatorId)
                .orElseThrow(() -> new ServiceException("Annotator not found with ID: " + annotatorId));
        if (annotator.getRole() != Utilisateur.Role.ANNOTATOR) {
            throw new ServiceException("User is not an annotator with ID: " + annotatorId);
        }
        return annotator;
    }
}