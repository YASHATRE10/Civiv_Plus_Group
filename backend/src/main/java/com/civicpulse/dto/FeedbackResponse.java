package com.civicpulse.dto;

import com.civicpulse.entity.Feedback;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class FeedbackResponse {
    private Long id;
    private Long complaintId;
    private Integer rating;
    private String comment;
    private LocalDateTime date;

    public static FeedbackResponse fromEntity(Feedback feedback) {
        if (feedback == null) {
            return null;
        }

        return FeedbackResponse.builder()
                .id(feedback.getId())
                .complaintId(feedback.getComplaint() != null ? feedback.getComplaint().getId() : null)
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .date(feedback.getDate())
                .build();
    }
}