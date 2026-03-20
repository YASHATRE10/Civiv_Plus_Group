package com.civicpulse.repository;

import com.civicpulse.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Optional<Feedback> findByComplaintId(Long complaintId);
}
