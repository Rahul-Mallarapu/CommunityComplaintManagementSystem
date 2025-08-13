package com.Project.CommunityComplaintManagementSystem;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    public ResponseEntity<ComplaintEntity> createComplaint(@RequestBody ComplaintEntity complaint) {
        return ResponseEntity.ok(complaintService.createComplaint(complaint));
    }

    @GetMapping("/my/{userId}")
    public ResponseEntity<List<ComplaintEntity>> getMyComplaints(@PathVariable Long userId) {
        return ResponseEntity.ok(complaintService.getMyComplaints(userId));
    }

    @GetMapping
    public ResponseEntity<List<ComplaintEntity>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ComplaintEntity> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(complaintService.updateComplaintStatus(id, status));
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<String> getStatus(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComplaintStatus(id));
    }
}
