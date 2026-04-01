package com.civicpulse.service;

import com.civicpulse.dto.NotificationResponse;
import com.civicpulse.entity.Complaint;
import com.civicpulse.entity.ComplaintStatus;
import com.civicpulse.entity.Notification;
import com.civicpulse.entity.NotificationType;
import com.civicpulse.entity.User;
import com.civicpulse.repository.NotificationRepository;
import com.civicpulse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createAssignmentNotification(User officer, Complaint complaint) {
        if (officer == null || complaint == null) {
            return;
        }

        String message = "You have been assigned complaint #" + complaint.getId() + ": " + complaint.getTitle();
        saveNotification(officer, complaint, NotificationType.ASSIGNMENT, message);
    }

    @Transactional
    public void createStatusUpdateNotification(User citizen, Complaint complaint, ComplaintStatus previousStatus) {
        if (citizen == null || complaint == null) {
            return;
        }

        String previous = previousStatus == null ? "PENDING" : previousStatus.name();
        String current = complaint.getStatus().name();
        String message = "Complaint #" + complaint.getId() + " status changed from " + previous + " to " + current;
        saveNotification(citizen, complaint, NotificationType.STATUS_UPDATE, message);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getMyNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<NotificationResponse> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(NotificationResponse::fromEntity)
                .toList();

        long unreadCount = notificationRepository.countByUserIdAndReadFalse(user.getId());

        return Map.of(
                "unreadCount", unreadCount,
                "items", notifications
        );
    }

    @Transactional
    public void markAsRead(String email, Long notificationId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Notification notification = notificationRepository.findByIdAndUserId(notificationId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    private void saveNotification(User user, Complaint complaint, NotificationType type, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setComplaint(complaint);
        notification.setType(type);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }
}
