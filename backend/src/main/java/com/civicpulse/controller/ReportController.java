package com.civicpulse.controller;

import com.civicpulse.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/categories")
    @PreAuthorize("hasAnyRole('ADMIN','OFFICER')")
    public ResponseEntity<List<Map<String, Object>>> categories() {
        return ResponseEntity.ok(reportService.categoryReport());
    }

    @GetMapping("/monthly")
    @PreAuthorize("hasAnyRole('ADMIN','OFFICER')")
    public ResponseEntity<List<Map<String, Object>>> monthly() {
        return ResponseEntity.ok(reportService.monthlyReport());
    }

    @GetMapping("/sla")
    @PreAuthorize("hasAnyRole('ADMIN','OFFICER')")
    public ResponseEntity<List<Map<String, Object>>> sla() {
        return ResponseEntity.ok(reportService.slaReport());
    }
}
