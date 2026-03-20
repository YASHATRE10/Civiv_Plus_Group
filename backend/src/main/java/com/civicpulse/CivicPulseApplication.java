package com.civicpulse;

import com.civicpulse.entity.Role;
import com.civicpulse.entity.User;
import com.civicpulse.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class CivicPulseApplication {

    public static void main(String[] args) {
        SpringApplication.run(CivicPulseApplication.class, args);
    }

    @Bean
    CommandLineRunner seedAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail("admin@civicpulse.com").isEmpty()) {
                User admin = new User();
                admin.setName("System Admin");
                admin.setEmail("admin@civicpulse.com");
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setPhone("9999999999");
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
            }
        };
    }
}
