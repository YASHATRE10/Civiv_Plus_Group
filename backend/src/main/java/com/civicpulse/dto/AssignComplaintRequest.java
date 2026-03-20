package com.civicpulse.dto;

import com.civicpulse.entity.Priority;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignComplaintRequest {
    private Long complaintId;
    private Long officerId;
    private Priority priority;
    private String deadline;
}
