package com.civicpulse.controller;

import com.civicpulse.dto.FeedbackRequest;
import com.civicpulse.dto.FeedbackResponse;
import com.civicpulse.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<FeedbackResponse> createFeedback(@RequestBody FeedbackRequest request) {
        return ResponseEntity.ok(feedbackService.saveFeedback(request));
    }

    @GetMapping("/{complaintId}")
    @PreAuthorize("hasAnyRole('ADMIN','CITIZEN','OFFICER')")
    public ResponseEntity<FeedbackResponse> getFeedback(@PathVariable Long complaintId) {
        return ResponseEntity.ok(feedbackService.getFeedback(complaintId));
    }
}
