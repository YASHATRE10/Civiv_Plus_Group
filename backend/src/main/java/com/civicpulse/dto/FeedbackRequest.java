package com.civicpulse.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeedbackRequest {
    private Long complaintId;
    private Integer rating;
    private String comment;
}
