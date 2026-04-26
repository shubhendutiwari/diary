package com.diary.dto;

import com.diary.model.User;
import java.time.LocalDateTime;

public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String bio;
    private String avatarUrl;
    private boolean emailVerified;
    private String authProvider;
    private LocalDateTime createdAt;
    private int streak;

    public UserResponse() {}

    public static UserResponse fromEntity(User user) {
        return fromEntity(user, 0);
    }

    public static UserResponse fromEntity(User user, int streak) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setBio(user.getBio());
        response.setAvatarUrl(user.getAvatarUrl());
        response.setEmailVerified(user.isEmailVerified());
        response.setAuthProvider(user.getAuthProvider());
        response.setCreatedAt(user.getCreatedAt());
        response.setStreak(streak);
        return response;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public String getAuthProvider() { return authProvider; }
    public void setAuthProvider(String authProvider) { this.authProvider = authProvider; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }
}
