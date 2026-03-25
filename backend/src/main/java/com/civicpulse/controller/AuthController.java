package com.civicpulse.controller;

import com.civicpulse.dto.AuthRequest;
import com.civicpulse.dto.AuthResponse;
import com.civicpulse.dto.ForgotPasswordRequest;
import com.civicpulse.dto.RegisterRequest;
import com.civicpulse.dto.ResetPasswordRequest;
import com.civicpulse.entity.Role;
import com.civicpulse.repository.UserRepository;
import com.civicpulse.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(Map.of("message", "Registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String token = authService.createPasswordResetToken(request);
        return ResponseEntity.ok(Map.of(
                "message", "Password reset token generated",
                "resetToken", token
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password reset successful"));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuthResponse.UserView>> users() {
        var users = userRepository.findAll().stream()
                .filter(u -> u.getRole() != Role.ADMIN)
                .map(u -> new AuthResponse.UserView(u.getId(), u.getName(), u.getEmail(), u.getRole(), u.getPhone()))
                .toList();
        return ResponseEntity.ok(users);
    }
}
