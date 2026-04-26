package com.diary.controller;

import com.diary.dto.UserResponse;
import com.diary.model.User;
import com.diary.service.ConnectionService;
import com.diary.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final ConnectionService connectionService;

    public UserController(UserService userService, ConnectionService connectionService) {
        this.userService = userService;
        this.connectionService = connectionService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal User user) {
        int streak = userService.calculateStreak(user);
        UserResponse response = UserResponse.fromEntity(user, streak);
        response.setFriendCount(connectionService.getFriendCount(user));
        response.setPendingRequests(connectionService.getPendingCount(user));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> updates) {
        User updated = userService.updateProfile(
                user,
                updates.get("bio"),
                updates.get("avatarUrl"));
        int streak = userService.calculateStreak(updated);
        UserResponse response = UserResponse.fromEntity(updated, streak);
        response.setFriendCount(connectionService.getFriendCount(updated));
        response.setPendingRequests(connectionService.getPendingCount(updated));
        return ResponseEntity.ok(response);
    }
}
