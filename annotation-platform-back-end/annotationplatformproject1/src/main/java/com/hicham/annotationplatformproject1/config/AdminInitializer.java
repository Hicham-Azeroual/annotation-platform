package com.hicham.annotationplatformproject1.config;

import com.hicham.annotationplatformproject1.model.Utilisateur;
import com.hicham.annotationplatformproject1.repository.UtilisateurRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        if (utilisateurRepository.findByUsername("admin").isEmpty()) {
            Utilisateur admin = new Utilisateur();
            admin.setUsername("admin");
            admin.setNom("Admin");
            admin.setPrenom("Super");
            admin.setEmail("admin@platform.com");
            admin.setRole(Utilisateur.Role.ADMIN);
            String rawPassword = "admin123"; // TODO: Change for production!
            admin.setPassword(passwordEncoder.encode(rawPassword));
            utilisateurRepository.save(admin);
            System.out.println("ADMIN INITIALISÉ - username: admin, password: " + rawPassword);
        }
    }
}