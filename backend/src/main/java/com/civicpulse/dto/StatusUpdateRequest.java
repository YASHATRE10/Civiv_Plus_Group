package com.civicpulse.dto;

import com.civicpulse.entity.ComplaintStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatusUpdateRequest {
    private Long complaintId;
    private ComplaintStatus status;
    private String resolutionNote;
}
