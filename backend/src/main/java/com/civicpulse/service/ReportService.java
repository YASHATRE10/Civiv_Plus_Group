package com.civicpulse.service;

import com.civicpulse.entity.Complaint;
import com.civicpulse.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ComplaintRepository complaintRepository;

    public List<Map<String, Object>> categoryReport() {
        return complaintRepository.findAll().stream()
                .collect(java.util.stream.Collectors.groupingBy(c -> c.getCategory().name(), java.util.stream.Collectors.counting()))
                .entrySet()
                .stream()
                .map(e -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("category", e.getKey());
                    item.put("count", e.getValue());
                    return item;
                })
                .toList();
    }

    public List<Map<String, Object>> monthlyReport() {
        return complaintRepository.findAll().stream()
                .collect(java.util.stream.Collectors.groupingBy(c -> c.getSubmissionDate().getMonth().name(), java.util.stream.Collectors.counting()))
                .entrySet()
                .stream()
                .map(e -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("month", e.getKey().substring(0, 3));
                    item.put("count", e.getValue());
                    return item;
                })
                .toList();
    }

    public List<Map<String, Object>> slaReport() {
        return complaintRepository.findAll().stream()
                .filter(c -> c.getResolvedDate() != null)
                .map(this::toSlaItem)
                .toList();
    }

    private Map<String, Object> toSlaItem(Complaint complaint) {
        long days = ChronoUnit.DAYS.between(complaint.getSubmissionDate(), complaint.getResolvedDate());
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", complaint.getId());
        item.put("days", days);
        return item;
    }
}
