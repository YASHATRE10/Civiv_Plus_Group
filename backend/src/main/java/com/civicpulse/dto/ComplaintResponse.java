package com.civicpulse.dto;

import com.civicpulse.entity.*;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class ComplaintResponse {
    private Long id;
    private String title;
    private String description;
    private Category category;
    private String location;
    private String imageUrl;
    private ComplaintStatus status;
    private Priority priority;
    private LocalDateTime submissionDate;
    private LocalDateTime resolvedDate;
    private LocalDate deadline;
    private Long assignedOfficerId;
    private String assignedOfficerName;
    private Long citizenId;
    private String citizenName;
    private String resolutionNote;
    private String proofImage;

    public static ComplaintResponse fromEntity(Complaint complaint) {
        return ComplaintResponse.builder()
                .id(complaint.getId())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .category(complaint.getCategory())
                .location(complaint.getLocation())
                .imageUrl(complaint.getImage())
                .status(complaint.getStatus())
                .priority(complaint.getPriority())
                .submissionDate(complaint.getSubmissionDate())
                .resolvedDate(complaint.getResolvedDate())
                .deadline(complaint.getDeadline())
                .assignedOfficerId(complaint.getAssignedOfficer() != null ? complaint.getAssignedOfficer().getId() : null)
                .assignedOfficerName(complaint.getAssignedOfficer() != null ? complaint.getAssignedOfficer().getName() : null)
                .citizenId(complaint.getCitizen() != null ? complaint.getCitizen().getId() : null)
                .citizenName(complaint.getCitizen() != null ? complaint.getCitizen().getName() : null)
                .resolutionNote(complaint.getResolutionNote())
                .proofImage(complaint.getProofImage())
                .build();
    }
}
