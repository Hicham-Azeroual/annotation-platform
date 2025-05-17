package com.hicham.annotationplatformproject1.security;

import com.hicham.annotationplatformproject1.dto.UtilisateurDTO;
import com.hicham.annotationplatformproject1.model.Utilisateur;
import com.hicham.annotationplatformproject1.repository.TacheRepository;
import com.hicham.annotationplatformproject1.repository.UtilisateurRepository;
import com.hicham.annotationplatformproject1.service.ActivityLogService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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
    private final TacheRepository tacheRepository;
    private final JavaMailSender mailSender;

    public UtilisateurService(UtilisateurRepository utilisateurRepository,
                              PasswordEncoder passwordEncoder,
                              ActivityLogService activityLogService,
                              TacheRepository tacheRepository,
                              JavaMailSender mailSender) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.activityLogService = activityLogService;
        this.tacheRepository = tacheRepository;
        this.mailSender = mailSender;
    }

    public UtilisateurDTO createAnnotateur(String username, String nom, String prenom, String email) throws MessagingException {
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
            sendWelcomeEmail(savedAnnotateur, rawPassword);

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

    public void regeneratePassword(String email) throws MessagingException {
        try {
            Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User with email " + email + " not found"));

            String newPassword = generateRandomPassword(10);
            utilisateur.setPassword(passwordEncoder.encode(newPassword));
            utilisateurRepository.save(utilisateur);

            sendPasswordResetEmail(utilisateur, newPassword);

            activityLogService.logActivity(
                    "PASSWORD_RESET",
                    "Password reset for user: " + utilisateur.getUsername(),
                    utilisateur
            );
        } catch (Exception e) {
            activityLogService.logActivity(
                    "PASSWORD_RESET_ERROR",
                    "Failed to reset password for email " + email + ": " + e.getMessage(),
                    null
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

    private void sendWelcomeEmail(Utilisateur utilisateur, String password) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(utilisateur.getEmail());
        helper.setSubject("Welcome to Annotation Platform - Your Account Details");
        helper.setFrom("your-email@gmail.com");

        String htmlContent = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome Email</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f4f4f9;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .header {
                    background-color: #4a90e2;
                    padding: 30px;
                    text-align: center;
                    color: #ffffff;
                }
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 600;
                }
                .content {
                    padding: 30px;
                    line-height: 1.6;
                }
                .content h2 {
                    color: #4a90e2;
                    font-size: 22px;
                    margin-bottom: 15px;
                }
                .content p {
                    margin: 10px 0;
                    font-size: 16px;
                }
                .credentials-box {
                    background-color: #f9f9f9;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    text-align: center;
                }
                .credentials-box p {
                    margin: 5px 0;
                    font-size: 16px;
                }
                .credentials-box .label {
                    font-weight: 600;
                    color: #555;
                }
                .credentials-box .value {
                    font-size: 18px;
                    color: #4a90e2;
                    font-weight: 700;
                }
                .button {
                    display: inline-block;
                    padding: 12px 25px;
                    background-color: #4a90e2;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                    margin-top: 20px;
                    transition: background-color 0.3s ease;
                }
                .button:hover {
                    background-color: #357abd;
                }
                .footer {
                    background-color: #f4f4f9;
                    padding: 20px;
                    text-align: center;
                    font-size: 14px;
                    color: #777;
                }
                .footer a {
                    color: #4a90e2;
                    text-decoration: none;
                }
                @media only screen and (max-width: 600px) {
                    .container {
                        margin: 20px;
                    }
                    .header h1 {
                        font-size: 24px;
                    }
                    .content {
                        padding: 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Annotation Platform</h1>
                </div>
                <div class="content">
                    <h2>Hello, %s %s!</h2>
                    <p>We’re excited to have you on board as an annotator. Your account has been successfully created, and below are your login credentials to access the platform.</p>
                    <div class="credentials-box">
                        <p><span class="label">Username:</span> <span class="value">%s</span></p>
                        <p><span class="label">Password:</span> <span class="value">%s</span></p>
                    </div>
                    <p>Please keep this information secure and do not share it with anyone. You can change your password after logging in for the first time.</p>
                    <p style="text-align: center;">
                        <a href="http://localhost:8080/login" class="button">Log In Now</a>
                    </p>
                </div>
                <div class="footer">
                    <p>If you have any questions, feel free to <a href="mailto:support@annotationplatform.com">contact support</a>.</p>
                    <p>© 2025 Annotation Platform. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(
                utilisateur.getPrenom(),
                utilisateur.getNom(),
                utilisateur.getUsername(),
                password
        );

        helper.setText(htmlContent, true);
        mailSender.send(message);
    }

    private void sendPasswordResetEmail(Utilisateur utilisateur, String newPassword) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(utilisateur.getEmail());
        helper.setSubject("Annotation Platform - Password Reset");
        helper.setFrom("your-email@gmail.com");

        String htmlContent = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Email</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f4f4f9;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .header {
                    background-color: #e74c3c;
                    padding: 30px;
                    text-align: center;
                    color: #ffffff;
                }
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 600;
                }
                .content {
                    padding: 30px;
                    line-height: 1.6;
                }
                .content h2 {
                    color: #e74c3c;
                    font-size: 22px;
                    margin-bottom: 15px;
                }
                .content p {
                    margin: 10px 0;
                    font-size: 16px;
                }
                .credentials-box {
                    background-color: #f9f9f9;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    text-align: center;
                }
                .credentials-box p {
                    margin: 5px 0;
                    font-size: 16px;
                }
                .credentials-box .label {
                    font-weight: 600;
                    color: #555;
                }
                .credentials-box .value {
                    font-size: 18px;
                    color: #e74c3c;
                    font-weight: 700;
                }
                .button {
                    display: inline-block;
                    padding: 12px 25px;
                    background-color: #e74c3c;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                    margin-top: 20px;
                    transition: background-color 0.3s ease;
                }
                .button:hover {
                    background-color: #c0392b;
                }
                .footer {
                    background-color: #f4f4f9;
                    padding: 20px;
                    text-align: center;
                    font-size: 14px;
                    color: #777;
                }
                .footer a {
                    color: #e74c3c;
                    text-decoration: none;
                }
                @media only screen and (max-width: 600px) {
                    .container {
                        margin: 20px;
                    }
                    .header h1 {
                        font-size: 24px;
                    }
                    .content {
                        padding: 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset</h1>
                </div>
                <div class="content">
                    <h2>Hello, %s %s!</h2>
                    <p>We received a request to reset your password for the Annotation Platform. Below is your new password to access your account.</p>
                    <div class="credentials-box">
                        <p><span class="label">Username:</span> <span class="value">%s</span></p>
                        <p><span class="label">New Password:</span> <span class="value">%s</span></p>
                    </div>
                    <p>Please keep this information secure and do not share it with anyone. We recommend changing your password after logging in.</p>
                    <p style="text-align: center;">
                        <a href="http://localhost:8080/login" class="button">Log In Now</a>
                    </p>
                </div>
                <div class="footer">
                    <p>If you did not request this reset, please <a href="mailto:support@annotationplatform.com">contact support</a> immediately.</p>
                    <p>© 2025 Annotation Platform. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(
                utilisateur.getPrenom(),
                utilisateur.getNom(),
                utilisateur.getUsername(),
                newPassword
        );

        helper.setText(htmlContent, true);
        mailSender.send(message);
    }
}