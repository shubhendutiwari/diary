package com.diary.controller;

import com.diary.dto.AuthResponse;
import com.diary.dto.LoginRequest;
import com.diary.dto.OAuthRequest;
import com.diary.dto.RegisterRequest;
import com.diary.model.User;
import com.diary.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = userService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    // OAuth2 social login endpoint
    @PostMapping("/oauth")
    public ResponseEntity<AuthResponse> oauthLogin(@RequestBody OAuthRequest request) {
        AuthResponse response = userService.oauthLogin(request);
        return ResponseEntity.ok(response);
    }

    // Verify email with OTP code
    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, Object>> verifyEmail(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {
        String code = body.get("code");
        boolean verified = userService.verifyEmail(code, user);
        if (verified) {
            return ResponseEntity.ok(Map.of("verified", true, "message", "Email verified successfully!"));
        }
        return ResponseEntity.badRequest().body(Map.of("verified", false, "error", "Invalid verification code"));
    }

    // Resend verification code
    @PostMapping("/resend-verification")
    public ResponseEntity<Map<String, String>> resendVerification(@AuthenticationPrincipal User user) {
        userService.resendVerificationCode(user);
        return ResponseEntity.ok(Map.of("message", "Verification code sent!"));
    }
}
