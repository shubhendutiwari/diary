package com.diary.dto;

public class AuthResponse {

    private String token;
    private String username;
    private Long userId;
    private boolean emailVerified;
    private String authProvider;

    public AuthResponse() {}

    public AuthResponse(String token, String username, Long userId, boolean emailVerified, String authProvider) {
        this.token = token;
        this.username = username;
        this.userId = userId;
        this.emailVerified = emailVerified;
        this.authProvider = authProvider;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public String getAuthProvider() { return authProvider; }
    public void setAuthProvider(String authProvider) { this.authProvider = authProvider; }
}
