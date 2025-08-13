package com.Project.CommunityComplaintManagementSystem;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public ComplaintService(ComplaintRepository complaintRepository, UserRepository userRepository) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    public ComplaintEntity createComplaint(ComplaintEntity complaint) {
        // If you don't have authentication, you can remove the user link or set a default user
        return complaintRepository.save(complaint);
    }

    public List<ComplaintEntity> getMyComplaints(Long userId) {
        // If no authentication, fetch directly by userId
        return complaintRepository.findByUser(userRepository.findById(userId).orElseThrow());
    }

    public List<ComplaintEntity> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public ComplaintEntity updateComplaintStatus(Long complaintId, String newStatus) {
        ComplaintEntity complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setStatus(newStatus);
        return complaintRepository.save(complaint);
    }

    public String getComplaintStatus(Long complaintId) {
        ComplaintEntity complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        return complaint.getStatus();
    }
}
