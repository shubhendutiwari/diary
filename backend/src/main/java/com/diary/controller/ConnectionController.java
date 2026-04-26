package com.diary.controller;

import com.diary.dto.UserResponse;
import com.diary.model.Connection;
import com.diary.model.User;
import com.diary.service.ConnectionService;
import com.diary.service.UserService;
import com.diary.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    private final ConnectionService connectionService;
    private final UserService userService;
    private final UserRepository userRepository;

    public ConnectionController(ConnectionService connectionService, UserService userService,
                                UserRepository userRepository) {
        this.connectionService = connectionService;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    // Send friend request
    @PostMapping("/request/{userId}")
    public ResponseEntity<?> sendRequest(@AuthenticationPrincipal User user, @PathVariable Long userId) {
        try {
            Connection conn = connectionService.sendRequest(user, userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", conn.getStatus() == Connection.Status.ACCEPTED
                    ? "You are now friends!" : "Friend request sent!");
            response.put("status", conn.getStatus().toString().toLowerCase());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Accept friend request
    @PostMapping("/accept/{connectionId}")
    public ResponseEntity<?> acceptRequest(@AuthenticationPrincipal User user, @PathVariable Long connectionId) {
        try {
            connectionService.acceptRequest(user, connectionId);
            return ResponseEntity.ok(Map.of("message", "Friend request accepted!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Reject friend request
    @PostMapping("/reject/{connectionId}")
    public ResponseEntity<?> rejectRequest(@AuthenticationPrincipal User user, @PathVariable Long connectionId) {
        try {
            connectionService.rejectRequest(user, connectionId);
            return ResponseEntity.ok(Map.of("message", "Friend request declined"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Remove friend
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> removeFriend(@AuthenticationPrincipal User user, @PathVariable Long userId) {
        try {
            connectionService.removeFriend(user, userId);
            return ResponseEntity.ok(Map.of("message", "Friend removed"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get my friends list
    @GetMapping("/friends")
    public ResponseEntity<List<Map<String, Object>>> getFriends(@AuthenticationPrincipal User user) {
        List<Map<String, Object>> friends = connectionService.getFriends(user).stream()
                .map(friend -> buildUserCard(friend, "friends"))
                .collect(Collectors.toList());
        return ResponseEntity.ok(friends);
    }

    // Get pending incoming requests
    @GetMapping("/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingRequests(@AuthenticationPrincipal User user) {
        List<Map<String, Object>> pending = connectionService.getPendingRequests(user).stream()
                .map(conn -> {
                    Map<String, Object> card = buildUserCard(conn.getRequester(), "pending_received");
                    card.put("connectionId", conn.getId());
                    return card;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(pending);
    }

    // Get sent requests
    @GetMapping("/sent")
    public ResponseEntity<List<Map<String, Object>>> getSentRequests(@AuthenticationPrincipal User user) {
        List<Map<String, Object>> sent = connectionService.getSentRequests(user).stream()
                .map(conn -> {
                    Map<String, Object> card = buildUserCard(conn.getAddressee(), "pending_sent");
                    card.put("connectionId", conn.getId());
                    return card;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(sent);
    }

    // Search / discover people
    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchPeople(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "") String q) {
        List<User> users;
        if (q.isEmpty()) {
            users = userRepository.findAll();
        } else {
            users = userRepository.findByUsernameContainingIgnoreCase(q);
        }

        List<Map<String, Object>> result = users.stream()
                .filter(u -> !u.getId().equals(user.getId()))
                .map(u -> {
                    String status = connectionService.getConnectionStatus(user, u);
                    return buildUserCard(u, status);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    // Get connection counts (for badge)
    @GetMapping("/counts")
    public ResponseEntity<Map<String, Long>> getCounts(@AuthenticationPrincipal User user) {
        Map<String, Long> counts = new HashMap<>();
        counts.put("friends", connectionService.getFriendCount(user));
        counts.put("pending", connectionService.getPendingCount(user));
        return ResponseEntity.ok(counts);
    }

    private Map<String, Object> buildUserCard(User user, String connectionStatus) {
        Map<String, Object> card = new HashMap<>();
        card.put("id", user.getId());
        card.put("username", user.getUsername());
        card.put("bio", user.getBio());
        card.put("avatarUrl", user.getAvatarUrl());
        card.put("connectionStatus", connectionStatus);
        card.put("friendCount", connectionService.getFriendCount(user));
        return card;
    }
}
