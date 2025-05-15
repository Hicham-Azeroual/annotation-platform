package com.hicham.annotationplatformproject1.repository;

import com.hicham.annotationplatformproject1.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByUsername(String username);

    List<Utilisateur> findByRole(Utilisateur.Role role);

    long countByRoleAndActive(Utilisateur.Role role, boolean active);
    @Query("SELECT COUNT(u) FROM Utilisateur u WHERE u.role = :role AND u.active = :active AND u.createdAt < :time")
    long countByRoleAndActiveAndCreatedAtBefore(Utilisateur.Role role, boolean active, LocalDateTime time);


    List<Utilisateur> findByRoleAndActive(Utilisateur.Role role, boolean active);
    Optional<Utilisateur> findByEmail(String email);

}