package com.hicham.annotationplatformproject1.controller;

import com.hicham.annotationplatformproject1.dto.ApiResponse;
import com.hicham.annotationplatformproject1.dto.UtilisateurDTO;
import com.hicham.annotationplatformproject1.model.Utilisateur;
import com.hicham.annotationplatformproject1.repository.UtilisateurRepository;
import com.hicham.annotationplatformproject1.security.CustomUserDetailsService;
import com.hicham.annotationplatformproject1.security.JwtUtil;
import com.hicham.annotationplatformproject1.security.TokenBlacklist;
import com.hicham.annotationplatformproject1.security.UtilisateurService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private TokenBlacklist tokenBlacklist;

    @Autowired
    private UtilisateurService utilisateurService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
            String role = userDetails.getAuthorities().stream()
                    .map(grantedAuthority -> grantedAuthority.getAuthority().replace("ROLE_", ""))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("No role found for user"));

            String token = jwtUtil.generateToken(request.getUsername(), role);

            Utilisateur user = utilisateurRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UtilisateurDTO userDTO = new UtilisateurDTO(
                    user.getId(),
                    user.getNom(),
                    user.getPrenom(),
                    user.getUsername(),
                    user.getEmail(),
                    user.isActive(),
                    role,
                    token
            );

            return ResponseEntity.ok(ApiResponse.success("Login successful", userDTO));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid username or password"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An error occurred: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Date expiration = jwtUtil.getExpirationDateFromToken(token);
            tokenBlacklist.add(token, expiration);
        }

        SecurityContextHolder.clearContext();

        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<?>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            utilisateurService.regeneratePassword(request.getEmail());
            return ResponseEntity.ok(ApiResponse.success("Password reset successful. Check your email for the new password.", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("User with email " + request.getEmail() + " not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to reset password: " + e.getMessage()));
        }
    }

    public static class AuthRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class ForgotPasswordRequest {
        private String email;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}