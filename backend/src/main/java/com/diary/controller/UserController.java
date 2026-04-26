package com.diary.controller;

import com.diary.dto.UserResponse;
import com.diary.model.User;
import com.diary.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal User user) {
        int streak = userService.calculateStreak(user);
        return ResponseEntity.ok(UserResponse.fromEntity(user, streak));
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
        return ResponseEntity.ok(UserResponse.fromEntity(updated, streak));
    }
}
