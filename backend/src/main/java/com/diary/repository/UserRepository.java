package com.diary.repository;

import com.diary.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationToken(String token);
    Optional<User> findByAuthProviderAndProviderId(String authProvider, String providerId);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
