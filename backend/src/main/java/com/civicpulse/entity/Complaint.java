package com.civicpulse.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "complaints")
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Category category;

    private String location;

    private String image;

    @Enumerated(EnumType.STRING)
    private ComplaintStatus status;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    private LocalDateTime submissionDate;

    private LocalDateTime resolvedDate;

    private LocalDate deadline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_officer_id")
    private User assignedOfficer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizen_id")
    private User citizen;

    private String resolutionNote;

    private String proofImage;
}
