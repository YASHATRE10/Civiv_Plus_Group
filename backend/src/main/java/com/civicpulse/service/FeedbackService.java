package com.civicpulse.service;

import com.civicpulse.dto.FeedbackRequest;
import com.civicpulse.dto.FeedbackResponse;
import com.civicpulse.entity.Feedback;
import com.civicpulse.repository.ComplaintRepository;
import com.civicpulse.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ComplaintRepository complaintRepository;

    @Transactional
    public FeedbackResponse saveFeedback(FeedbackRequest request) {
        if (request.getComplaintId() == null) {
            throw new IllegalArgumentException("Complaint id is required");
        }

        Long complaintId = Objects.requireNonNull(request.getComplaintId());
        Feedback feedback = feedbackRepository.findByComplaintId(complaintId).orElse(new Feedback());
        feedback.setComplaint(complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found")));
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());
        feedback.setDate(LocalDateTime.now());
        return FeedbackResponse.fromEntity(feedbackRepository.save(feedback));
    }

    @Transactional(readOnly = true)
    public FeedbackResponse getFeedback(Long complaintId) {
        return feedbackRepository.findByComplaintId(complaintId)
                .map(FeedbackResponse::fromEntity)
                .orElse(null);
    }
}
