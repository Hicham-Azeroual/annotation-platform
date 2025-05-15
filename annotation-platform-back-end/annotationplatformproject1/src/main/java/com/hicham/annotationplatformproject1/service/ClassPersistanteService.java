package com.hicham.annotationplatformproject1.service;

import com.hicham.annotationplatformproject1.model.ClassePersistante;
import com.hicham.annotationplatformproject1.model.Dataset;
import com.hicham.annotationplatformproject1.repository.ClassePersistanteRepository;
import com.hicham.annotationplatformproject1.service.ActivityLogService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClassPersistanteService {

    private final ClassePersistanteRepository classePersistanteRepository;
    private final ActivityLogService activityLogService;

    public ClassPersistanteService(ClassePersistanteRepository classePersistanteRepository,
                                   ActivityLogService activityLogService) {
        this.classePersistanteRepository = classePersistanteRepository;
        this.activityLogService = activityLogService;
    }

    public List<ClassePersistante> createClasses(String classNames, Dataset dataset) {
        List<ClassePersistante> classes = new ArrayList<>();
        if (classNames != null && !classNames.trim().isEmpty()) {
            String[] classNameArray = classNames.split(";");
            for (String className : classNameArray) {
                if (!className.trim().isEmpty()) {
                    ClassePersistante classe = new ClassePersistante();
                    classe.setNomClasse(className.trim());
                    classe.setDataset(dataset);
                    classes.add(classe);
                }
            }
            classePersistanteRepository.saveAll(classes);

            activityLogService.logActivity(
                    "CLASSES_CREATED",
                    "Created " + classes.size() + " classes for dataset: " + dataset.getName()
            );
        }
        return classes;
    }
}