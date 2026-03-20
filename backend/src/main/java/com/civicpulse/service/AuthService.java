package com.civicpulse.service;

import com.civicpulse.dto.AuthRequest;
import com.civicpulse.dto.AuthResponse;
import com.civicpulse.dto.RegisterRequest;
import com.civicpulse.entity.Role;
import com.civicpulse.entity.User;
import com.civicpulse.repository.UserRepository;
import com.civicpulse.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() == null ? Role.CITIZEN : request.getRole());

        if (user.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Admin registration is not allowed");
        }

        userRepository.save(user);
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(
                token,
                new AuthResponse.UserView(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getPhone())
        );
    }
}
