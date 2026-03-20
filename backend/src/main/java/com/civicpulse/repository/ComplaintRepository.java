package com.civicpulse.repository;

import com.civicpulse.entity.Complaint;
import com.civicpulse.entity.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByCitizenId(Long citizenId);
    List<Complaint> findByAssignedOfficerId(Long officerId);
    long countByStatus(ComplaintStatus status);
}
