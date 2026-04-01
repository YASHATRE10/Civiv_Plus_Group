package com.civicpulse.service;

import com.civicpulse.dto.AssignComplaintRequest;
import com.civicpulse.dto.ComplaintResponse;
import com.civicpulse.dto.StatusUpdateRequest;
import com.civicpulse.entity.*;
import com.civicpulse.repository.ComplaintRepository;
import com.civicpulse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public ComplaintResponse createComplaint(
            String title,
            String description,
            Category category,
            String location,
            MultipartFile image,
            String citizenEmail
    ) {
        User citizen = userRepository.findByEmail(citizenEmail)
                .orElseThrow(() -> new IllegalArgumentException("Citizen not found"));

        Complaint complaint = new Complaint();
        complaint.setTitle(title);
        complaint.setDescription(description);
        complaint.setCategory(category);
        complaint.setLocation(location);
        complaint.setStatus(ComplaintStatus.PENDING);
        complaint.setPriority(Priority.MEDIUM);
        complaint.setSubmissionDate(LocalDateTime.now());
        complaint.setCitizen(citizen);
        complaint.setImage(storeFile(image));

        return ComplaintResponse.fromEntity(complaintRepository.save(complaint));
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getComplaints(Long officerId) {
        List<Complaint> complaints = officerId != null
                ? complaintRepository.findByAssignedOfficerId(officerId)
                : complaintRepository.findAll();
        return complaints.stream().map(ComplaintResponse::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getComplaintsByUser(Long userId) {
        return complaintRepository.findByCitizenId(userId).stream().map(ComplaintResponse::fromEntity).toList();
    }

    @Transactional
    public ComplaintResponse assignComplaint(AssignComplaintRequest request) {
        if (request.getComplaintId() == null || request.getOfficerId() == null) {
            throw new IllegalArgumentException("Complaint and officer are required");
        }

        Long complaintId = Objects.requireNonNull(request.getComplaintId());
        Long officerId = Objects.requireNonNull(request.getOfficerId());

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found"));

        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new IllegalArgumentException("Officer not found"));

        complaint.setAssignedOfficer(officer);
        complaint.setPriority(request.getPriority() == null ? Priority.MEDIUM : request.getPriority());
        complaint.setDeadline(request.getDeadline() != null ? LocalDate.parse(request.getDeadline()) : null);
        complaint.setStatus(ComplaintStatus.IN_PROGRESS);

        Complaint savedComplaint = complaintRepository.save(complaint);
        notificationService.createAssignmentNotification(officer, savedComplaint);
        return ComplaintResponse.fromEntity(savedComplaint);
    }

    @Transactional
    public ComplaintResponse updateStatus(StatusUpdateRequest request, MultipartFile proofImage) {
        if (request.getComplaintId() == null || request.getStatus() == null) {
            throw new IllegalArgumentException("Complaint and status are required");
        }

        Long complaintId = Objects.requireNonNull(request.getComplaintId());
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found"));

        ComplaintStatus previousStatus = complaint.getStatus();

        complaint.setStatus(request.getStatus());
        complaint.setResolutionNote(request.getResolutionNote());

        if (request.getStatus() == ComplaintStatus.RESOLVED) {
            complaint.setResolvedDate(LocalDateTime.now());
        }

        if (proofImage != null && !proofImage.isEmpty()) {
            complaint.setProofImage(storeFile(proofImage));
        }

        Complaint savedComplaint = complaintRepository.save(complaint);

        if (previousStatus != savedComplaint.getStatus()) {
            notificationService.createStatusUpdateNotification(savedComplaint.getCitizen(), savedComplaint, previousStatus);
        }

        return ComplaintResponse.fromEntity(savedComplaint);
    }

    private String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            Path uploadRoot = Paths.get("uploads");
            if (!Files.exists(uploadRoot)) {
                Files.createDirectories(uploadRoot);
            }

            String filename = UUID.randomUUID() + "-" + file.getOriginalFilename();
            Path destination = uploadRoot.resolve(filename);
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + filename;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file", ex);
        }
    }
}
