package com.diary.service;

import com.diary.dto.AuthResponse;
import com.diary.dto.LoginRequest;
import com.diary.dto.OAuthRequest;
import com.diary.dto.RegisterRequest;
import com.diary.model.DiaryEntry;
import com.diary.model.User;
import com.diary.repository.DiaryEntryRepository;
import com.diary.repository.UserRepository;
import com.diary.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final DiaryEntryRepository diaryEntryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, DiaryEntryRepository diaryEntryRepository,
                       PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.diaryEntryRepository = diaryEntryRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()));

        // Generate email verification token
        String verificationToken = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        user.setVerificationToken(verificationToken);
        user.setEmailVerified(false);

        user = userRepository.save(user);

        // In development, log the verification code to console
        System.out.println("📧 Verification code for " + user.getEmail() + ": " + verificationToken);

        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername(), user.getId(), user.isEmailVerified(), user.getAuthProvider());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if ("OAUTH2_USER".equals(user.getPasswordHash())) {
            throw new RuntimeException("This account uses social login. Please sign in with " + user.getAuthProvider());
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername(), user.getId(), user.isEmailVerified(), user.getAuthProvider());
    }

    // OAuth2 login/register — creates user if first time, or logs in existing
    public AuthResponse oauthLogin(OAuthRequest request) {
        // Check if user already exists with this provider
        User user = userRepository.findByAuthProviderAndProviderId(request.getProvider(), request.getProviderId())
                .orElse(null);

        if (user == null) {
            // Check if email already exists (link accounts)
            user = userRepository.findByEmail(request.getEmail()).orElse(null);

            if (user != null) {
                // Link existing account with OAuth provider
                user.setAuthProvider(request.getProvider());
                user.setProviderId(request.getProviderId());
                user.setEmailVerified(true);
                if (request.getAvatarUrl() != null && user.getAvatarUrl() == null) {
                    user.setAvatarUrl(request.getAvatarUrl());
                }
                user = userRepository.save(user);
            } else {
                // Create new user from OAuth data
                String username = generateUniqueUsername(request.getName());
                user = new User(username, request.getEmail(), request.getProvider(), request.getProviderId());
                if (request.getAvatarUrl() != null) {
                    user.setAvatarUrl(request.getAvatarUrl());
                }
                user = userRepository.save(user);
            }
        }

        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername(), user.getId(), user.isEmailVerified(), user.getAuthProvider());
    }

    // Email verification
    public boolean verifyEmail(String code, User user) {
        if (user.isEmailVerified()) {
            return true;
        }
        if (code != null && code.equals(user.getVerificationToken())) {
            user.setEmailVerified(true);
            user.setVerificationToken(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public void resendVerificationCode(User user) {
        if (user.isEmailVerified()) {
            throw new RuntimeException("Email already verified");
        }
        String verificationToken = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        user.setVerificationToken(verificationToken);
        userRepository.save(user);
        System.out.println("📧 New verification code for " + user.getEmail() + ": " + verificationToken);
    }

    // Streak calculation
    public int calculateStreak(User user) {
        List<DiaryEntry> entries = diaryEntryRepository.findByUserOrderByCreatedAtDesc(user);
        if (entries.isEmpty()) return 0;

        // Get unique dates when user wrote entries
        List<LocalDate> writingDays = entries.stream()
                .map(e -> e.getCreatedAt().toLocalDate())
                .distinct()
                .sorted((a, b) -> b.compareTo(a)) // most recent first
                .collect(Collectors.toList());

        if (writingDays.isEmpty()) return 0;

        // Check if user wrote today or yesterday (streak is still active)
        LocalDate today = LocalDate.now();
        LocalDate firstDay = writingDays.get(0);

        if (!firstDay.equals(today) && !firstDay.equals(today.minusDays(1))) {
            return 0; // Streak broken
        }

        int streak = 1;
        for (int i = 1; i < writingDays.size(); i++) {
            if (writingDays.get(i).equals(writingDays.get(i - 1).minusDays(1))) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    private String generateUniqueUsername(String name) {
        if (name == null || name.isBlank()) name = "user";
        String base = name.toLowerCase().replaceAll("[^a-z0-9]", "");
        if (base.isEmpty()) base = "user";
        if (base.length() > 15) base = base.substring(0, 15);
        String username = base;
        int counter = 1;
        while (userRepository.existsByUsername(username)) {
            username = base + counter++;
        }
        return username;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(User user, String bio, String avatarUrl) {
        if (bio != null) user.setBio(bio);
        if (avatarUrl != null) user.setAvatarUrl(avatarUrl);
        return userRepository.save(user);
    }
}
